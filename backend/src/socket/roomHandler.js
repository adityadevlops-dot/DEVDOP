import Room from '../models/Room.js'
import User from '../models/User.js'
import Session from '../models/Session.js'
import { SOCKET_EVENTS } from '../config/constants.js'
import { flushPendingSave } from './codeHandler.js'

export const handleRoomJoin = (io, socket) => {
  socket.on(SOCKET_EVENTS.JOIN_ROOM, async (data) => {
    try {
      const { roomId } = data
      const userId = socket.user?.userId || socket.user?._id
      const username = socket.user?.username || data.username

      if (!roomId) {
        socket.emit(SOCKET_EVENTS.ERROR, { message: 'Room ID is required' })
        return
      }

      const room = await Room.findById(roomId)
      if (!room) {
        socket.emit(SOCKET_EVENTS.ERROR, { message: 'Room not found' })
        return
      }

      if (room.isLocked) {
        socket.emit(SOCKET_EVENTS.ERROR, { message: 'Room is locked' })
        return
      }

      if (room.participants.length >= (room.maxParticipants || 10)) {
        const isExisting = room.participants.some(
          (p) => String(p.userId) === String(userId)
        )
        if (!isExisting) {
          socket.emit(SOCKET_EVENTS.ERROR, { message: 'Room is full' })
          return
        }
      }

      socket.join(roomId)
      socket.roomId = roomId
      socket.userId = String(userId)
      socket.username = username

      // Atomic push if not present
      await Room.updateOne(
        { _id: roomId, 'participants.userId': { $ne: userId } },
        { $push: { participants: { userId, username } } }
      )

      const updatedRoom = await Room.findById(roomId)

      const participantsWithDetails = await Promise.all(
        updatedRoom.participants.map(async (p) => {
          const userDoc = await User.findById(p.userId).select('username avatar')
          return {
            userId: String(p.userId),
            username: userDoc?.username || p.username,
            avatar: userDoc?.avatar,
          }
        })
      )

      const currentUserDoc = await User.findById(userId).select('avatar')

      io.to(roomId).emit(SOCKET_EVENTS.USER_JOINED, {
        userId: String(userId),
        username,
        avatar: currentUserDoc?.avatar,
        message: `${username} joined the room`,
      })

      io.to(roomId).emit(SOCKET_EVENTS.ROOM_USERS, {
        users: participantsWithDetails,
        host: String(room.createdBy),
      })

      // Send initial room snapshot (code & language)
      const session = await Session.findOne({ roomId })
      if (session) {
        socket.emit('room-state', {
          code: session.code,
          language: session.language,
        })
      }

      console.log(`✅ ${username} (${userId}) joined room ${roomId}`)
    } catch (error) {
      console.error('Error joining room:', error.message)
      socket.emit(SOCKET_EVENTS.ERROR, { message: 'Failed to join room' })
    }
  })
}

export const handleRoomLeave = (io, socket) => {
  socket.on(SOCKET_EVENTS.LEAVE_ROOM, async (data) => {
    try {
      const roomId = data?.roomId || socket.roomId
      const userId = socket.user?.userId || socket.userId
      const username = socket.user?.username || socket.username

      if (!roomId) return

      socket.leave(roomId)

      await Room.updateOne(
        { _id: roomId },
        { $pull: { participants: { userId } } }
      )

      const updatedRoom = await Room.findById(roomId)

      if (updatedRoom) {
        const remainingUsers = await Promise.all(
          updatedRoom.participants.map(async (p) => {
            const userDoc = await User.findById(p.userId).select('username avatar')
            return {
              userId: String(p.userId),
              username: userDoc?.username || p.username,
              avatar: userDoc?.avatar,
            }
          })
        )

        io.to(roomId).emit(SOCKET_EVENTS.USER_LEFT, {
          userId: String(userId),
          username,
          message: `${username} left the room`,
        })

        io.to(roomId).emit(SOCKET_EVENTS.ROOM_USERS, {
          users: remainingUsers,
          host: String(updatedRoom.createdBy),
        })
      }

      const roomSockets = await io.in(roomId).fetchSockets()
      if (roomSockets.length === 0) {
        await flushPendingSave(roomId)
      }

      console.log(`👋 ${username} (${userId}) left room ${roomId}`)
    } catch (error) {
      console.error('Error leaving room:', error.message)
    }
  })
}

export const handleKickUser = (io, socket) => {
  socket.on(SOCKET_EVENTS.KICK_USER, async (data) => {
    try {
      const { roomId, userId: targetUserId } = data
      const currentUserId = String(socket.user?.userId || socket.userId)

      const room = await Room.findById(roomId)
      if (!room || String(room.createdBy) !== currentUserId) {
        socket.emit(SOCKET_EVENTS.ERROR, { message: 'Only host can kick participants' })
        return
      }

      await Room.updateOne({ _id: roomId }, { $pull: { participants: { userId: targetUserId } } })

      const socketsInRoom = await io.in(roomId).fetchSockets()
      const targetSocket = socketsInRoom.find((s) => String(s.userId) === String(targetUserId))

      if (targetSocket) {
        targetSocket.emit('user-kicked', { message: 'You have been kicked by host' })
        targetSocket.leave(roomId)
      }

      const updatedRoom = await Room.findById(roomId)
      const remainingUsers = await Promise.all(
        updatedRoom.participants.map(async (p) => {
          const userDoc = await User.findById(p.userId).select('username avatar')
          return {
            userId: String(p.userId),
            username: userDoc?.username || p.username,
            avatar: userDoc?.avatar,
          }
        })
      )

      io.to(roomId).emit(SOCKET_EVENTS.ROOM_USERS, {
        users: remainingUsers,
        host: String(updatedRoom.createdBy),
      })
    } catch (error) {
      console.error('Error kicking user:', error.message)
    }
  })
}

export const handleLockRoom = (io, socket) => {
  socket.on(SOCKET_EVENTS.LOCK_ROOM, async (data) => {
    try {
      const { roomId, isLocked } = data
      const currentUserId = String(socket.user?.userId || socket.userId)

      const room = await Room.findById(roomId)
      if (!room || String(room.createdBy) !== currentUserId) {
        socket.emit(SOCKET_EVENTS.ERROR, { message: 'Only host can lock the room' })
        return
      }

      room.isLocked = !!isLocked
      await room.save()

      io.to(roomId).emit('room-locked', { isLocked: room.isLocked })
    } catch (error) {
      console.error('Error locking room:', error.message)
    }
  })
}

export const handleDisconnect = (io, socket) => {
  socket.on('disconnect', async () => {
    const roomId = socket.roomId
    const userId = socket.userId
    const username = socket.username

    if (roomId && userId) {
      try {
        await Room.updateOne(
          { _id: roomId },
          { $pull: { participants: { userId } } }
        )

        const updatedRoom = await Room.findById(roomId)
        if (updatedRoom) {
          const remainingUsers = await Promise.all(
            updatedRoom.participants.map(async (p) => {
              const userDoc = await User.findById(p.userId).select('username avatar')
              return {
                userId: String(p.userId),
                username: userDoc?.username || p.username,
                avatar: userDoc?.avatar,
              }
            })
          )

          io.to(roomId).emit(SOCKET_EVENTS.USER_LEFT, {
            userId: String(userId),
            username,
            message: `${username} disconnected`,
          })

          io.to(roomId).emit(SOCKET_EVENTS.ROOM_USERS, {
            users: remainingUsers,
            host: String(updatedRoom.createdBy),
          })
        }

        const roomSockets = await io.in(roomId).fetchSockets()
        if (roomSockets.length === 0) {
          await flushPendingSave(roomId)
        }
      } catch (err) {
        console.error('Disconnect cleanup error:', err.message)
      }
    }
    console.log(`❌ Socket ${socket.id} disconnected`)
  })
}
