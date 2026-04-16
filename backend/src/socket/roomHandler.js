import Room from '../models/Room.js'
import User from '../models/User.js'
import { SOCKET_EVENTS } from '../config/constants.js'

export const handleRoomJoin = (io, socket, event) => {
  socket.on(SOCKET_EVENTS.JOIN_ROOM, async (data) => {
    try {
      const { roomId, username } = data
      const userId = socket.user.userId

      const room = await Room.findById(roomId)
      if (!room) {
        socket.emit(SOCKET_EVENTS.ERROR, { message: 'Room not found' })
        return
      }

      socket.join(roomId)
      socket.roomId = roomId
      socket.userId = userId
      socket.username = username

      // Add user to room participants if not already there
      const participantExists = room.participants.some(p => p.userId.toString() === userId.toString())
      if (!participantExists) {
        room.participants.push({ userId, username })
        await room.save()
      }

      // Get all participants with full user details (avatar, etc)
      const participantsWithDetails = await Promise.all(
        room.participants.map(async (p) => {
          const user = await User.findById(p.userId).select('username avatar')
          return {
            userId: p.userId,
            username: user?.username || p.username,
            avatar: user?.avatar,
          }
        })
      )

      // Broadcast user joined with userId
      io.to(roomId).emit(SOCKET_EVENTS.USER_JOINED, {
        userId,
        username,
        avatar: (await User.findById(userId).select('avatar'))?.avatar,
        message: `${username} joined the room`,
      })

      // Send updated room users to all clients with full details (including host info)
      io.to(roomId).emit(SOCKET_EVENTS.ROOM_USERS, {
        users: participantsWithDetails,
        host: room.createdBy.toString(),
      })

      console.log(`✅ ${username} (${userId}) joined room ${roomId}`)
    } catch (error) {
      console.error('Error joining room:', error)
      socket.emit(SOCKET_EVENTS.ERROR, { message: 'Failed to join room' })
    }
  })
}

export const handleRoomLeave = (io, socket) => {
  socket.on(SOCKET_EVENTS.LEAVE_ROOM, async (data) => {
    try {
      const { roomId, username } = data
      const userId = socket.user.userId

      socket.leave(roomId)

      io.to(roomId).emit(SOCKET_EVENTS.USER_LEFT, {
        userId,
        username,
        message: `${username} left the room`,
      })

      console.log(`👋 ${username} (${userId}) left room ${roomId}`)
    } catch (error) {
      console.error('Error leaving room:', error)
    }
  })
}

export const handleKickUser = (io, socket) => {
  socket.on(SOCKET_EVENTS.KICK_USER, async (data) => {
    try {
      const { roomId, username } = data

      io.to(roomId).emit('user-kicked', {
        username,
        message: `${username} was kicked from the room`,
      })

      console.log(`🚫 ${username} kicked from room ${roomId}`)
    } catch (error) {
      console.error('Error kicking user:', error)
    }
  })
}

export const handleLockRoom = (io, socket) => {
  socket.on(SOCKET_EVENTS.LOCK_ROOM, async (data) => {
    try {
      const { roomId, isLocked } = data

      await Room.findByIdAndUpdate(roomId, { isLocked })

      io.to(roomId).emit('room-locked', { isLocked })

      console.log(`🔒 Room ${roomId} locked: ${isLocked}`)
    } catch (error) {
      console.error('Error locking room:', error)
    }
  })
}

export const handleDisconnect = (io, socket) => {
  socket.on('disconnect', () => {
    if (socket.roomId) {
      io.to(socket.roomId).emit(SOCKET_EVENTS.USER_LEFT, {
        userId: socket.userId,
        username: socket.username,
        message: 'A user disconnected',
      })
    }
    console.log(`❌ Socket ${socket.id} disconnected`)
  })
}
