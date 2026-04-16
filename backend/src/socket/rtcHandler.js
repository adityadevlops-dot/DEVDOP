import { SOCKET_EVENTS } from '../config/constants.js'

export const handleWebRTCSignaling = (io, socket) => {
  // Handle WebRTC offer
  socket.on(SOCKET_EVENTS.WEBRTC_OFFER, (data) => {
    const { roomId, userId, offer } = data
    socket.to(roomId).emit(SOCKET_EVENTS.WEBRTC_OFFER, {
      userId,
      offer,
    })
    console.log(`📧 WebRTC offer from ${userId}`)
  })

  // Handle WebRTC answer
  socket.on(SOCKET_EVENTS.WEBRTC_ANSWER, (data) => {
    const { roomId, userId, answer } = data
    socket.to(roomId).emit(SOCKET_EVENTS.WEBRTC_ANSWER, {
      userId,
      answer,
    })
    console.log(`📧 WebRTC answer from ${userId}`)
  })

  // Handle ICE candidates
  socket.on(SOCKET_EVENTS.ICE_CANDIDATE, (data) => {
    const { roomId, userId, candidate } = data
    socket.to(roomId).emit(SOCKET_EVENTS.ICE_CANDIDATE, {
      userId,
      candidate,
    })
    console.log(`🧊 ICE candidate from ${userId}`)
  })
}
