import { Server } from 'socket.io'
import { verifyToken } from '../utils/generateToken.js'
import { handleRoomJoin, handleRoomLeave, handleKickUser, handleLockRoom, handleDisconnect } from './roomHandler.js'
import { handleCodeChange, handleCursorMove, handleLanguageChange } from './codeHandler.js'
import { handleChatMessage } from './chatHandler.js'
import { handleWebRTCSignaling } from './rtcHandler.js'
import { getCorsOrigins } from '../config/cors.js'

export const setupSocketIO = (server) => {
  const corsOrigins = getCorsOrigins()

  const io = new Server(server, {
    cors: {
      origin: corsOrigins,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  })

  // JWT Auth Middleware
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token

      if (!token) {
        return next(new Error('No token provided'))
      }

      const decoded = verifyToken(token)
      socket.user = decoded
      next()
    } catch (error) {
      next(new Error('Invalid token'))
    }
  })

  io.on('connection', (socket) => {
    handleRoomJoin(io, socket)
    handleRoomLeave(io, socket)
    handleKickUser(io, socket)
    handleLockRoom(io, socket)

    handleCodeChange(io, socket)
    handleCursorMove(io, socket)
    handleLanguageChange(io, socket)

    handleChatMessage(io, socket)
    handleWebRTCSignaling(io, socket)

    handleDisconnect(io, socket)
  })

  return io
}
