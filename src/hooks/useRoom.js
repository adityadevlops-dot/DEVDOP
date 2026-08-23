import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useRoomStore } from '../store/roomStore'
import { useAuthStore } from '../store/authStore'
import { useSocket } from './useSocket'
import { SOCKET_EVENTS } from '../utils/constants'
import * as api from '../api/index'

export const useRoom = (roomCode) => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { roomCode: currRoomCode, isHost, addParticipant, removeParticipant, setRoom, setCode, setLanguage } = useRoomStore()
  const { socket, emit, on, off, connected } = useSocket()

  const activeJoinedRef = useRef(new Set())

  // Reset activeJoinedRef when roomCode changes
  useEffect(() => {
    activeJoinedRef.current.clear()
  }, [roomCode])

  useEffect(() => {
    if (!roomCode || !user || !connected || !socket) {
      return
    }

    let isEffectActive = true
    let joinedRoomId = null

    const handleRoomUsers = (data) => {
      if (!isEffectActive) return
      if (data.users) {
        data.users.forEach((p) => {
          addParticipant({
            id: p.userId || p.id,
            username: p.username,
            avatar: p.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.username}`,
            role: data.host === String(p.userId || p.id) ? 'host' : 'participant',
            isOnline: true,
          })
        })
      }
    }

    const handleUserJoined = (data) => {
      if (!isEffectActive) return
      addParticipant({
        id: data.userId || data.id,
        username: data.username,
        avatar: data.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.username}`,
        role: 'participant',
        isOnline: true,
      })
    }

    const handleUserLeft = (data) => {
      if (!isEffectActive) return
      removeParticipant(data.userId || data.id)
    }

    const handleRoomState = (data) => {
      if (!isEffectActive) return
      if (data.code !== undefined) setCode(data.code)
      if (data.language) setLanguage(data.language)
    }

    // 1. Attach listeners FIRST
    on(SOCKET_EVENTS.ROOM_USERS, handleRoomUsers)
    on(SOCKET_EVENTS.USER_JOINED, handleUserJoined)
    on(SOCKET_EVENTS.USER_LEFT, handleUserLeft)
    on('room-state', handleRoomState)

    // 2. Join room logic
    const executeJoin = async () => {
      try {
        const roomInfo = await api.getRoom(roomCode)
        if (!isEffectActive) return

        if (!roomInfo || !roomInfo._id) {
          toast.error('Room not found or invalid room code')
          navigate('/')
          return
        }

        joinedRoomId = roomInfo._id

        const isHostUser = String(roomInfo.createdBy?._id || roomInfo.createdBy) === String(user._id || user.id)
        
        const initialCode = roomInfo.session?.code !== undefined ? roomInfo.session.code : null
        const initialLanguage = roomInfo.session?.language || null

        setRoom(roomCode, isHostUser, roomInfo._id, initialCode, initialLanguage)

        addParticipant({
          id: user._id || user.id,
          username: user.username,
          avatar: user.avatar,
          role: isHostUser ? 'host' : 'participant',
          isOnline: true,
        })

        if (roomInfo.participants) {
          roomInfo.participants.forEach((p) => {
            if (String(p.userId || p.id) !== String(user._id || user.id)) {
              addParticipant({
                id: p.userId || p.id,
                username: p.username,
                avatar: p.avatar,
                role: p.role,
                isOnline: p.isOnline,
              })
            }
          })
        }

        // Idempotent join emit guard
        if (!activeJoinedRef.current.has(roomInfo._id)) {
          activeJoinedRef.current.add(roomInfo._id)
          emit(SOCKET_EVENTS.JOIN_ROOM, {
            roomId: roomInfo._id,
            username: user.username,
          })
        }
      } catch (error) {
        if (!isEffectActive) return
        toast.error(error?.message || 'Room not found')
        navigate('/')
      }
    }

    executeJoin()

    // 3. Cleanup: detach listeners & emit LEAVE_ROOM
    return () => {
      isEffectActive = false
      off(SOCKET_EVENTS.ROOM_USERS, handleRoomUsers)
      off(SOCKET_EVENTS.USER_JOINED, handleUserJoined)
      off(SOCKET_EVENTS.USER_LEFT, handleUserLeft)
      off('room-state', handleRoomState)

      if (joinedRoomId) {
        emit(SOCKET_EVENTS.LEAVE_ROOM, {
          roomId: joinedRoomId,
          username: user?.username,
        })
      }
    }
  }, [roomCode, user, connected, socket, emit, on, off, addParticipant, removeParticipant, setRoom, setCode, setLanguage, navigate])

  return {
    roomCode: currRoomCode,
    isHost,
  }
}
