export const SOCKET_EVENTS = {
  // Room events
  JOIN_ROOM: 'join-room',
  LEAVE_ROOM: 'leave-room',
  ROOM_USERS: 'room-users',
  USER_JOINED: 'user-joined',
  USER_LEFT: 'user-left',
  KICK_USER: 'kick-user',
  LOCK_ROOM: 'lock-room',

  // Code events
  CODE_CHANGE: 'code-change',
  CURSOR_MOVE: 'cursor-move',
  LANGUAGE_CHANGE: 'language-change',

  // Chat events
  CHAT_MESSAGE: 'chat-message',
  RECEIVE_CHAT: 'receive-chat',

  // WebRTC signaling
  WEBRTC_OFFER: 'webrtc-offer',
  WEBRTC_ANSWER: 'webrtc-answer',
  ICE_CANDIDATE: 'ice-candidate',

  // Errors
  ERROR: 'error',
}

export const JUDGE0_LANGUAGES = {
  javascript: 63,
  python: 71,
  java: 62,
  cpp: 53,
  go: 60,
  typescript: 74,
  rust: 73,
  c: 50,
}

export const JUDGE0_STATUS_ID = {
  PENDING: 1,
  ACCEPTED: 2,
  WRONG_ANSWER: 4,
  COMPILATION_ERROR: 6,
  RUNTIME_ERROR: 11,
  TIME_LIMIT: 5,
}
