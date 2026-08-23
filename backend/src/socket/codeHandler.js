import { SOCKET_EVENTS } from '../config/constants.js'
import Session from '../models/Session.js'

const codeDebounceMap = new Map()

export const flushPendingSave = async (roomId) => {
  const pending = codeDebounceMap.get(roomId)
  if (pending) {
    clearTimeout(pending.timer)
    codeDebounceMap.delete(roomId)
    try {
      await Session.findOneAndUpdate(
        { roomId },
        { $set: { code: pending.code, language: pending.language } }
      )
      console.log(`💾 Immediate flush of code saved for room ${roomId}`)
    } catch (error) {
      console.error('[CODE] Error flushing code:', error.message)
    }
  }
}

export const handleCodeChange = (io, socket) => {
  socket.on(SOCKET_EVENTS.CODE_CHANGE, async (data) => {
    const { roomId, code, language } = data

    if (!roomId) return

    // Debounce code saves per roomId
    if (codeDebounceMap.has(roomId)) {
      clearTimeout(codeDebounceMap.get(roomId).timer)
    }

    const timer = setTimeout(async () => {
      codeDebounceMap.delete(roomId)
      try {
        await Session.findOneAndUpdate(
          { roomId },
          { $set: { code, language } }
        )
        console.log(`💾 Code saved for room ${roomId}`)
      } catch (error) {
        console.error('[CODE] Error saving code:', error.message)
      }
    }, 500)

    codeDebounceMap.set(roomId, { timer, code, language })

    // Broadcast code change to other sockets in room with senderId
    socket.to(roomId).emit(SOCKET_EVENTS.CODE_CHANGE, {
      code,
      language,
      senderId: socket.id,
    })
  })
}

export const handleCursorMove = (io, socket) => {
  socket.on(SOCKET_EVENTS.CURSOR_MOVE, (data) => {
    const { roomId, line, column, username } = data
    if (!roomId) return

    socket.to(roomId).emit(SOCKET_EVENTS.CURSOR_MOVE, {
      line,
      column,
      username,
      senderId: socket.id,
    })
  })
}

export const handleLanguageChange = (io, socket) => {
  socket.on(SOCKET_EVENTS.LANGUAGE_CHANGE, async (data) => {
    const { roomId, language } = data
    if (!roomId || !language) return

    io.to(roomId).emit(SOCKET_EVENTS.LANGUAGE_CHANGE, {
      roomId,
      language,
      senderId: socket.id,
    })

    try {
      await Session.findOneAndUpdate({ roomId }, { $set: { language } })
      console.log(`🔄 Language changed to ${language} in room ${roomId}`)
    } catch (err) {
      console.error('[LANGUAGE CHANGE ERROR]:', err.message)
    }
  })
}
