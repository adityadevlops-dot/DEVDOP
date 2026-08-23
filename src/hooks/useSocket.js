import { useEffect, useCallback } from 'react'
import { getSocket } from '../socket/socket'
import { useSocketStore } from '../store/socketStore'

export const useSocket = () => {
  const connected = useSocketStore((state) => state.connected)
  const activeSocket = getSocket()

  useEffect(() => {
    getSocket()
  }, [])

  const emit = useCallback((event, data, ack) => {
    const s = getSocket()
    if (s) {
      s.emit(event, data, ack)
    } else {
      console.warn('[SOCKET] emit skipped (socket not connected):', event)
    }
  }, [])

  const on = useCallback((event, callback) => {
    const s = getSocket()
    if (s) {
      s.on(event, callback)
    }
  }, [])

  const off = useCallback((event, callback) => {
    const s = getSocket()
    if (s) {
      s.off(event, callback)
    }
  }, [])

  return {
    socket: activeSocket,
    connected,
    emit,
    on,
    off,
  }
}
