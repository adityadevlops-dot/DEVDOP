import { io } from 'socket.io-client'
import { useSocketStore } from '../store/socketStore'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'

let socket = null

export function getSocket() {
  const token = localStorage.getItem('token')
  if (!token) return null

  if (!socket) {
    socket = io(SOCKET_URL, {
      auth: { token },
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    })

    socket.on('connect', () => {
      console.log('✅ Singleton Socket connected:', socket.id)
      useSocketStore.getState().setConnected(true)
      useSocketStore.getState().setSocket(socket)
    })

    socket.on('disconnect', (reason) => {
      console.log('❌ Singleton Socket disconnected:', reason)
      useSocketStore.getState().setConnected(false)
    })

    socket.on('connect_error', (err) => {
      console.error('Socket connect error:', err.message)
      useSocketStore.getState().setConnected(false)
    })
  }

  return socket
}

export function destroySocket() {
  if (socket) {
    socket.disconnect()
    socket = null
    useSocketStore.getState().setConnected(false)
    useSocketStore.getState().setSocket(null)
  }
}
