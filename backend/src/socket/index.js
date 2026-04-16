import { Server } from 'socket.io'
import { verifyToken } from '../utils/generateToken.js'
import { handleRoomJoin, handleRoomLeave, handleKickUser, handleLockRoom, handleDisconnect } from './roomHandler.js'
import { handleCodeChange, handleCursorMove, handleLanguageChange } from './codeHandler.js'
import { handleChatMessage } from './chatHandler.js'
import { handleWebRTCSignaling } from './rtcHandler.js'

export const setupSocketIO = (server) => {
  // Parse CORS origins from environment variable
  const corsOrigins = process.env.CORS_ORIGIN 
    ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
    : ['http://localhost:5173', 'http://localhost:3000']
  
  console.log('[SOCKET.IO] CORS origins:', corsOrigins)

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
      const token = socket.handshake.auth.token

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
    console.log(`✅ Socket connected: ${socket.id} (User: ${socket.user.username})`)

    // Room handlers
    handleRoomJoin(io, socket)
    handleRoomLeave(io, socket)
    handleKickUser(io, socket)
    handleLockRoom(io, socket)

    // Code handlers
    handleCodeChange(io, socket)
    handleCursorMove(io, socket)
    handleLanguageChange(io, socket)

    // Chat handler
    handleChatMessage(io, socket)

    // WebRTC handler
    handleWebRTCSignaling(io, socket)

    // Disconnect handler
    handleDisconnect(io, socket)
  })

  return io
}
