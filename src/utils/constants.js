export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'

export const LANGUAGES = [
  { id: 'javascript', label: 'JavaScript', ext: '.js' },
  { id: 'typescript', label: 'TypeScript', ext: '.ts' },
  { id: 'python', label: 'Python', ext: '.py' },
  { id: 'java', label: 'Java', ext: '.java' },
  { id: 'cpp', label: 'C++', ext: '.cpp' },
  { id: 'csharp', label: 'C#', ext: '.cs' },
  { id: 'go', label: 'Go', ext: '.go' },
  { id: 'rust', label: 'Rust', ext: '.rs' },
]

export const SOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  JOIN_ROOM: 'join-room',
  LEAVE_ROOM: 'leave-room',
  ROOM_USERS: 'room-users',
  CODE_CHANGE: 'code-change',
  LANGUAGE_CHANGE: 'language-change',
  CURSOR_MOVE: 'cursor-move',
  CHAT_MESSAGE: 'chat-message',
  RECEIVE_CHAT: 'receive-chat',
  USER_JOINED: 'user-joined',
  USER_LEFT: 'user-left',
  CALL_START: 'call:start',
  CALL_END: 'call:end',
  ERROR: 'error',
}

export const MOCK_LANGUAGES_TIMEOUT = 800
export const DEFAULT_CODE = '// Welcome to devdop!\n// Start coding together\n\nfunction hello() {\n  console.log("Hello, World!");\n}\n\nhello();'
