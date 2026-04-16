/* ── BACKEND INTEGRATION POINTS ──
   - Emit room join/leave events through socket
   - Listen for user:joined and user:left events
   - Handle room creation and room info fetching
   - Current status: State management only
*/

import { useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import { useRoomStore } from '../store/roomStore'
import { useAuthStore } from '../store/authStore'
import { useSocket } from './useSocket'
import { SOCKET_EVENTS } from '../utils/constants'
import * as api from '../api/index'

export const useRoom = (roomCode) => {
  const { user } = useAuthStore()
  const { roomCode: currRoomCode, isHost, addParticipant, removeParticipant, setRoom } = useRoomStore()
  const { socket, emit, on, off, connected } = useSocket()
  
  // Use a ref to prevent multiple join attempts for the same room
  const joinAttemptedRef = useRef(false)

  useEffect(() => {
    if (!roomCode || !user || !connected || !socket) {
      console.log('[ROOM] waiting for room join:', { roomCode, user: !!user, connected, socket: !!socket })
      return
    }

    // Skip if we already attempted to join this room
    if (joinAttemptedRef.current) {
      console.log('[ROOM] already attempted to join, skipping')
      return
    }

    console.log('[ROOM] attempting to join room:', roomCode)
    joinAttemptedRef.current = true

    const joinRoom = async () => {
      try {
        // Fetch room info from API
        console.log('[ROOM] fetching room from API:', roomCode)
        const roomInfo = await api.getRoom(roomCode)
        console.log('[ROOM] got room info:', roomInfo)
        
        if (!roomInfo) {
          console.error('[ROOM] room info is null/undefined')
          toast.error('Room data is invalid')
          joinAttemptedRef.current = false
          return
        }

        if (!roomInfo._id) {
          console.error('[ROOM] room has no _id:', roomInfo)
          toast.error('Room ID missing - invalid room state')
          joinAttemptedRef.current = false
          return
        }
        
        // Set room in store with roomId - THIS IS CRITICAL
        const isHostUser = roomInfo.createdBy === user?.id || roomInfo.createdBy?._id === user?.id
        console.log('[ROOM] setting room store - roomCode:', roomCode, 'isHost:', isHostUser, 'roomId:', roomInfo._id)
        
        setRoom(roomCode, isHostUser, roomInfo._id)
        
        console.log('[ROOM] room store updated')

        // Clear existing participants and add fresh ones
        // Add current user first
        addParticipant({
          id: user._id || user.id,
          username: user.username,
          avatar: user.avatar,
          role: 'participant',
          isOnline: true,
        })

        // Add other participants from room
        if (roomInfo.participants) {
          roomInfo.participants.forEach((p) => {
            if ((p.userId || p.id) !== (user._id || user.id)) {
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

        // Emit JOIN_ROOM socket event NOW (after listeners are attached)
        emit(SOCKET_EVENTS.JOIN_ROOM, {
          roomId: roomInfo._id,
          username: user?.username,
        })
        console.log('[ROOM] emitted JOIN_ROOM with roomId:', roomInfo._id)

        console.log('[ROOM] joined room:', roomCode)
      } catch (error) {
        console.error('[ROOM] failed to join room:', {
          error,
          message: error?.message,
          status: error?.status,
          data: error?.data,
        })
        joinAttemptedRef.current = false
        const errorMsg = error?.message || error?.data?.message || 'Failed to join room'
        toast.error(errorMsg)
      }
    }

    // ATTACH LISTENERS BEFORE EMITTING JOIN_ROOM
    // This ensures we don't miss the initial ROOM_USERS event from backend
    const handleRoomUsers = (data) => {
      console.log('[ROOM] received ROOM_USERS event:', data)
      if (data.users) {
        data.users.forEach((p) => {
          addParticipant({
            id: p.userId || p.id,
            username: p.username,
            avatar: p.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.username}`,
            role: data.host === (p.userId?.toString() || p.userId || p.id) ? 'host' : 'participant',
            isOnline: true,
          })
        })
      }
    }

    // Listen for user joined
    const handleUserJoined = (data) => {
      console.log('[ROOM] received USER_JOINED event:', data)
      addParticipant({
        id: data.userId || data.id,
        username: data.username,
        avatar: data.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.username}`,
        role: 'participant',
        isOnline: true,
      })
      console.log('[ROOM] user joined:', data.username)
    }

    // Listen for user left
    const handleUserLeft = (data) => {
      console.log('[ROOM] received USER_LEFT event:', data)
      removeParticipant(data.userId || data.id)
      console.log('[ROOM] user left:', data.username)
    }

    // Attach listeners FIRST
    on(SOCKET_EVENTS.ROOM_USERS, handleRoomUsers)
    on(SOCKET_EVENTS.USER_JOINED, handleUserJoined)
    on(SOCKET_EVENTS.USER_LEFT, handleUserLeft)

    console.log('[ROOM] attached socket listeners for:', SOCKET_EVENTS.ROOM_USERS, SOCKET_EVENTS.USER_JOINED, SOCKET_EVENTS.USER_LEFT)

    // THEN join room
    joinRoom()

    // Cleanup: leave room
    return () => {
      // TODO: Emit leave event
      off(SOCKET_EVENTS.ROOM_USERS, handleRoomUsers)
      off(SOCKET_EVENTS.USER_JOINED, handleUserJoined)
      off(SOCKET_EVENTS.USER_LEFT, handleUserLeft)
      console.log('[ROOM] left room:', roomCode)
    }
  }, [roomCode, user, connected, socket, emit, on, off, addParticipant, removeParticipant, setRoom])

  return {
    roomCode: currRoomCode,
    isHost,
  }
}
