# devdop - Remote Pair Programming

A modern web app for real-time collaborative coding. Code together, debug together, build together.

## 🚀 Features

- **Monaco Code Editor** - Professional syntax highlighting for 10+ languages
- **Real-time Code Sync** - See changes as your partner types (Socket.io)
- **Video & Audio** - Built-in peer-to-peer video calls (WebRTC)
- **Live Chat** - Message your teammates in real time
- **Code Execution** - Run and test code instantly
- **Session History** - View and manage past pair programming sessions

## 🛠 Tech Stack

- React 18 + Vite
- React Router v6 (client-side routing)
- TailwindCSS (dark theme)
- Monaco Editor
- Socket.io
- Zustand (state management)
- Lucide React (icons)
- React Hot Toast (notifications)

## 📦 Installation

```bash
npm create vite@latest devdop -- --template react
cd devdop
npm install react-router-dom @monaco-editor/react socket.io-client zustand axios lucide-react react-hot-toast simple-peer tailwindcss postcss autoprefixer
npm run dev
```

Manually copy all source files from this project into the `src/` directory, then:

```bash
npm run dev
```

## 🌍 Environment Setup

Copy `.env.example` to `.env.local`:

```bash
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

## 📁 Project Structure

```
src/
├── api/              # API calls (mocked, ready for backend)
├── components/       # React components
│   ├── layout/       # Navbar, ProtectedRoute
│   ├── ui/           # Button, Input, Avatar, Badge, Modal, Tooltip
│   ├── editor/       # CodeEditor, LanguageSelect, RunButton, OutputPanel
│   ├── room/         # RoomLayout, RoomHeader, ParticipantSidebar
│   ├── video/        # VideoPanel, VideoTile
│   └── chat/         # ChatPanel, ChatMessage
├── hooks/            # useSocket, useWebRTC, useEditor, useRoom
├── store/            # Zustand stores: auth, room, socket
├── pages/            # Full pages: Home, Login, Register, Dashboard, Room
├── utils/            # Constants, helpers, mock data
└── App.jsx           # Main app with routing
```

## 🔧 Features Status

### ✅ Implemented
- Homepage with hero and features
- Login/Register pages with validation
- Dashboard with past sessions
- Room layout (3-column design)
- Monaco code editor with 8+ languages
- Code execution with mock output
- Output panel with execution results
- Chat panel with message history
- Video panel with WebRTC placeholder
- Participant sidebar
- Responsive UI with dark theme
- Toast notifications

### 🚧 TODO - Backend Integration Points

All files have `/* ── BACKEND INTEGRATION POINTS ── */` comments marking where to wire backend:

1. **Authentication** (`src/api/index.js`)
   - Replace mock login → `POST /api/auth/login`
   - Replace mock register → `POST /api/auth/register`

2. **Room Management** (`src/api/index.js`)
   - Replace mock createRoom → `POST /api/rooms`
   - Replace mock getRoom → `GET /api/rooms/:roomCode`
   - Replace mock getSessions → `GET /api/sessions`

3. **Code Execution** (`src/api/index.js` & `src/components/room/RoomLayout.jsx`)
   - Replace mock runCode → `POST /api/sessions/run` (integrate Judge0)

4. **Socket.io Events** (`src/hooks/useSocket.js` & multiple components)
   - Replace mock socket with real `socket.io-client`
   - Wire events: `code:change`, `language:change`, `chat:message`, `user:joined`, `user:left`

5. **WebRTC** (`src/hooks/useWebRTC.js`)
   - Replace mock streams with real `getUserMedia()`
   - Integrate `simple-peer` for peer connections

## 📝 Authentication Flow

1. User registers → Account created, token stored in localStorage
2. Token sent with each API request in `Authorization` header
3. ProtectedRoute checks if logged in, redirects to /login if not
4. Auth state persists using Zustand + localStorage

## 🎯 Design System

### Colors (from Tailwind config)
- **Primary**: `#0d1117` (app background)
- **Surface**: `#161b22` (navbar, panels)
- **Elevated**: `#21262d` (cards, inputs)
- **Text**: `#e6edf3` (main text)
- **Accent Blue**: `#58a6ff` (links, active)
- **Accent Green**: `#2ea043` (success, run button)
- **Accent Red**: `#f85149` (errors, danger)

### Typography
- **Code Font**: JetBrains Mono (13px)
- **UI Font**: System-ui (14px)

### Spacing & Radius
- Border radius: 6px (buttons/inputs), 8px (cards), 12px (modals)

## 🚀 Getting Started with Backend

Follow these steps to integrate your backend:

1. **Set up backend server** (Node.js/Express recommended)
   - Create `POST /api/auth/login` endpoint
   - Create `POST /api/auth/register` endpoint
   - Implement Socket.io server

2. **Update API calls** in `src/api/index.js`:
   ```javascript
   export const login = async (email, password) => {
     // Replace mock with:
     const { data } = await api.post('/auth/login', { email, password })
     return data
   }
   ```

3. **Replace Socket.io Mock** in `src/hooks/useSocket.js`:
   ```javascript
   import io from 'socket.io-client'
   const socket = io(SOCKET_URL, { auth: { token: authToken } })
   ```

4. **Implement WebRTC** in `src/hooks/useWebRTC.js`:
   ```javascript
   navigator.mediaDevices.getUserMedia({ video: true, audio: true })
       .then(stream => setLocalStream(stream))
   ```

5. **Wire SSH/Terminal** (for running code):
   - Integrate Judge0 API or similar code execution service
   - Update `runCode()` in `src/api/index.js`

## 📚 Component API

### useSocket Hook
```javascript
const { socket, connected, emit, on, off } = useSocket()
emit('event-name', data)
on('event-name', callback)
```

### useRoom Hook
```javascript
const { roomCode, isHost } = useRoom(roomCode)
```

### useEditor Hook
```javascript
const { code, language, handleCodeChange, handleLanguageChange } = useEditor()
```

### useWebRTC Hook
```javascript
const { localStream, remoteStream, isMicOn, isCamOn, toggleMic, toggleCam } = useWebRTC()
```

## 🐛 Debugging

- Check browser console for mock logs: `[SOCKET MOCK]`, `[ROOM]`, `[EDITOR]`, `[WEBRTC MOCK]`
- Use React DevTools to inspect Zustand stores
- Check network tab for API calls
- Toast notifications show all user actions

## 📄 License

MIT

---

**Built with ❤️ by the devdop team**
