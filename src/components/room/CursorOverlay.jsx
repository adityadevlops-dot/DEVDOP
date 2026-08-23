import { useEffect, useState } from 'react'
import { useSocket } from '../../hooks/useSocket'
import { useRoomStore } from '../../store/roomStore'
import { getColorForUser } from '../../utils/helpers'
import { SOCKET_EVENTS } from '../../utils/constants'

export const CursorOverlay = () => {
  const { socket, on, off } = useSocket()
  const { roomId } = useRoomStore()
  const [remoteCursors, setRemoteCursors] = useState({})

  useEffect(() => {
    if (!socket || !roomId) return

    const handleCursorMove = (data) => {
      if (data.senderId && data.senderId === socket.id) return
      if (!data.username) return

      setRemoteCursors((prev) => ({
        ...prev,
        [data.username]: {
          line: data.line,
          column: data.column,
          username: data.username,
          updatedAt: Date.now(),
        },
      }))
    }

    on(SOCKET_EVENTS.CURSOR_MOVE, handleCursorMove)

    return () => {
      off(SOCKET_EVENTS.CURSOR_MOVE, handleCursorMove)
    }
  }, [socket, roomId, on, off])

  // Clean up inactive cursors after 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      setRemoteCursors((prev) => {
        const next = { ...prev }
        let changed = false
        Object.keys(next).forEach((user) => {
          if (now - next[user].updatedAt > 5000) {
            delete next[user]
            changed = true
          }
        })
        return changed ? next : prev
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return null
}
