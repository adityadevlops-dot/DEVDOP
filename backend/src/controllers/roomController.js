import mongoose from 'mongoose'
import Room from '../models/Room.js'
import Session from '../models/Session.js'
import User from '../models/User.js'
import { generateRoomCode } from '../utils/generateRoomCode.js'

export const createRoom = async (req, res, next) => {
  try {
    const { name, description } = req.body
    const userId = req.user.userId
    const username = req.user.username

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Room name is required' })
    }

    const roomCode = generateRoomCode()

    const room = new Room({
      roomCode,
      name: name.trim(),
      description: description || '',
      createdBy: userId,
      participants: [{ userId, username }],
    })

    await room.save()

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
    const normalizedCode = roomCode?.toUpperCase()

    const room = await Room.findOne({ roomCode: normalizedCode }).populate('createdBy', 'username')

    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' })
    }

    let participantsWithDetails = []
    try {
      participantsWithDetails = await Promise.all(
        room.participants.map(async (p) => {
          const user = await User.findById(p.userId).select('username avatar')
          return {
            userId: String(p.userId),
            username: user?.username || p.username,
            avatar: user?.avatar,
            joinedAt: p.joinedAt,
          }
        })
      )
    } catch (pError) {
      participantsWithDetails = room.participants
    }

    const session = await Session.findOne({ roomId: room._id })

    const roomData = {
      ...room.toObject(),
      participants: participantsWithDetails,
      session,
    }

    res.json({
      success: true,
      data: roomData,
    })
  } catch (error) {
    next(error)
  }
}

export const closeRoom = async (req, res, next) => {
  try {
    const { roomId } = req.params

    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      return res.status(400).json({ success: false, message: 'Invalid room ID format' })
    }

    const room = await Room.findById(roomId)

    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' })
    }

    const currentUserId = String(req.user.userId || req.user._id)
    const isOwner = room.createdBy.equals ? room.createdBy.equals(currentUserId) : String(room.createdBy) === currentUserId

    if (!isOwner) {
      return res.status(403).json({ success: false, message: 'Forbidden: Only room creator can delete room' })
    }

    await Room.findByIdAndDelete(roomId)
    await Session.findOneAndDelete({ roomId })

    res.json({
      success: true,
      message: 'Room closed successfully',
    })
  } catch (error) {
    next(error)
  }
}
