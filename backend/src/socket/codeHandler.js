import { SOCKET_EVENTS } from '../config/constants.js'
import Session from '../models/Session.js'

let codeChangeDebounce = {}

export const handleCodeChange = (io, socket) => {
  socket.on(SOCKET_EVENTS.CODE_CHANGE, async (data) => {
    const { roomId, code, language } = data

    // Debounce code saves (500ms)
    if (codeChangeDebounce[roomId]) {
      clearTimeout(codeChangeDebounce[roomId])
    }

    codeChangeDebounce[roomId] = setTimeout(async () => {
      try {
        // Save code to session
        const session = await Session.findOne({ roomId })
        if (session) {
          session.code = code
          session.language = language || session.language
          await session.save()
          console.log(`💾 Code saved for room ${roomId}`)
        }
      } catch (error) {
        console.error('[CODE] Error saving code:', error)
      }
    }, 500)

    // Broadcast to other users in room
    socket.to(roomId).emit(SOCKET_EVENTS.CODE_CHANGE, { code, language })
    console.log(`📝 Code changed in room ${roomId}`)
  })
}

export const handleCursorMove = (io, socket) => {
  socket.on(SOCKET_EVENTS.CURSOR_MOVE, (data) => {
    const { roomId, line, column, username } = data

    // Broadcast cursor position to other users
    socket.to(roomId).emit(SOCKET_EVENTS.CURSOR_MOVE, {
      line,
      column,
      username,
    })
  })
}

export const handleLanguageChange = (io, socket) => {
  socket.on(SOCKET_EVENTS.LANGUAGE_CHANGE, (data) => {
    const { roomId, language } = data

    // Broadcast language change to ALL users in room (including sender)
    io.to(roomId).emit(SOCKET_EVENTS.LANGUAGE_CHANGE, { language })

    console.log(`🔄 Language changed to ${language} in room ${roomId}`)
  })
}
