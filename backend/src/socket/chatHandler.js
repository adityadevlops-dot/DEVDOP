import { SOCKET_EVENTS } from '../config/constants.js'

export const handleChatMessage = (io, socket) => {
  socket.on(SOCKET_EVENTS.CHAT_MESSAGE, (data) => {
    const { roomId, message, username } = data
    const userId = socket.user.userId

    // Validate message
    if (!message || message.length > 500) {
      socket.emit(SOCKET_EVENTS.ERROR, {
        message: 'Invalid message',
      })
      return
    }

    // Broadcast to room with userId included
    io.to(roomId).emit(SOCKET_EVENTS.RECEIVE_CHAT, {
      userId,
      username,
      message,
      timestamp: new Date(),
    })

    console.log(`💬 Chat message from ${username} (${userId}) in room ${roomId}: "${message}"`)
  })
}
