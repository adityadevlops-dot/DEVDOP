import { useEffect } from 'react'
import { io } from 'socket.io-client'
import { useSocketStore } from '../store/socketStore'
import { SOCKET_EVENTS } from '../utils/constants'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'

export const useSocket = () => {
  const { socket, connected, setSocket, setConnected } = useSocketStore()

  useEffect(() => {
    try {
      const token = localStorage.getItem('token')

      if (!token) {
        console.warn('No token found, socket connection skipped')
        return
      }

      // Initialize real Socket.io connection
      const newSocket = io(SOCKET_URL, {
        auth: {
          token,
        },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      })

      newSocket.on('connect', () => {
        console.log('✅ Socket connected:', newSocket.id)
        console.log('🔌 Socket URL:', SOCKET_URL)
        setConnected(true)
      })

      newSocket.on('disconnect', () => {
        console.log('❌ Socket disconnected')
        setConnected(false)
      })

      newSocket.on('error', (error) => {
        console.error('Socket error:', error)
      })

      setSocket(newSocket)

      return () => {
        if (newSocket) {
          newSocket.disconnect()
        }
      }
    } catch (error) {
      console.error('Socket initialization error:', error)
    }
  }, [setSocket, setConnected])

  const emit = (event, data) => {
    if (socket) {
      console.log('[SOCKET] emit:', event, data)
      socket.emit(event, data)
    }
  }

  const on = (event, callback) => {
    if (socket) {
      socket.on(event, callback)
    }
  }

  const off = (event, callback) => {
    if (socket) {
      socket.off(event, callback)
    }
  }

  return {
    socket,
    connected,
    emit,
    on,
    off,
  }
}
