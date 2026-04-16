import Room from '../models/Room.js'
import Session from '../models/Session.js'
import User from '../models/User.js'
import { generateRoomCode } from '../utils/generateRoomCode.js'

export const createRoom = async (req, res, next) => {
  try {
    const { name, description } = req.body
    const userId = req.user.userId
    const username = req.user.username

    if (!name) {
      return res.status(400).json({ message: 'Room name required' })
    }

    const roomCode = generateRoomCode()

    const room = new Room({
      roomCode,
      name,
      description: description || '',
      createdBy: userId,
      participants: [{ userId, username }],
    })

    await room.save()

    // Create associated session
    const session = new Session({
      roomId: room._id,
      users: [{ userId, username }],
    })

    await session.save()

    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      data: {
        room,
        session,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const getRoom = async (req, res, next) => {
  try {
    const { roomCode } = req.params
    
    console.log('[ROOM] getRoom request for code:', roomCode)

    // Convert to uppercase for consistent lookup
    const normalizedCode = roomCode?.toUpperCase()
    
    const room = await Room.findOne({ roomCode: normalizedCode }).populate('createdBy', 'username')

    console.log('[ROOM] lookup result:', room ? 'found' : 'not found')

    if (!room) {
      console.log('[ROOM] returning 404 - room not found')
      return res.status(404).json({ success: false, message: 'Room not found' })
    }

    console.log('[ROOM] room._id:', room._id, 'roomCode:', room.roomCode)

    // Populate participants with full user details (avatar, etc)
    let participantsWithDetails = []
    try {
      participantsWithDetails = await Promise.all(
        room.participants.map(async (p) => {
          try {
            const user = await User.findById(p.userId).select('username avatar')
            return {
              userId: p.userId,
              username: user?.username || p.username,
              avatar: user?.avatar,
              joinedAt: p.joinedAt,
            }
          } catch (pError) {
            console.error('[ROOM] Error mapping participant:', p.userId, pError)
            return {
              userId: p.userId,
              username: p.username,
              joinedAt: p.joinedAt,
            }
          }
        })
      )
      console.log('[ROOM] populated participants:', participantsWithDetails.length)
    } catch (pError) {
      console.error('[ROOM] Error mapping all participants:', pError)
      // If participant mapping fails, just use basic participant data
      participantsWithDetails = room.participants
    }

    const session = await Session.findOne({ roomId: room._id })

    const roomData = {
      ...room.toObject(),
      participants: participantsWithDetails,
      session,
    }

    console.log('[ROOM] sending response with roomId:', roomData._id)

    res.json({
      success: true,
      data: roomData,
    })
  } catch (error) {
    console.error('[ROOM] getRoom error:', error)
    next(error)
  }
}

export const closeRoom = async (req, res, next) => {
  try {
    const { roomId } = req.params

    const room = await Room.findByIdAndDelete(roomId)

    if (!room) {
      return res.status(404).json({ message: 'Room not found' })
    }

    // Also delete associated session
    await Session.findOneAndDelete({ roomId })

    res.json({
      success: true,
      message: 'Room closed successfully',
    })
  } catch (error) {
    next(error)
  }
}
