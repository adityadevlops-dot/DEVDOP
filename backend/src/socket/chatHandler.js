import { SOCKET_EVENTS } from '../config/constants.js'
import Session from '../models/Session.js'
import { nanoid } from 'nanoid'

export const handleChatMessage = (io, socket) => {
  socket.on(SOCKET_EVENTS.CHAT_MESSAGE, async (data) => {
    try {
      const { roomId, message, clientMsgId, msgId } = data
      const userId = socket.user?.userId || socket.user?._id
      const username = socket.user?.username || data.username

      if (!message || typeof message !== 'string' || message.trim().length === 0 || message.length > 500) {
        socket.emit(SOCKET_EVENTS.ERROR, {
          message: 'Invalid message length (must be 1-500 chars)',
        })
        return
      }

      const generatedId = nanoid ? nanoid() : `${Date.now()}_${Math.random().toString(36).substr(2, 6)}`
      const effectiveClientMsgId = clientMsgId || msgId || generatedId

      const chatPayload = {
        id: generatedId,
        clientMsgId: effectiveClientMsgId,
        userId: String(userId),
        username,
        message: message.trim(),
        timestamp: new Date(),
      }

      // Broadcast to room (including sender as source of truth)
      io.to(roomId).emit(SOCKET_EVENTS.RECEIVE_CHAT, chatPayload)

      // Fire-and-forget session chat persistence (keep last 200)
      Session.findOneAndUpdate(
        { roomId },
        {
          $push: {
            messages: {
              $each: [chatPayload],
              $slice: -200,
            },
          },
        }
      ).catch((err) => console.error('[CHAT PERSISTENCE ERROR]:', err.message))
    } catch (error) {
      console.error('[CHAT ERROR]:', error.message)
      socket.emit(SOCKET_EVENTS.ERROR, { message: 'Failed to send chat message' })
    }
  })
}
