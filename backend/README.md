# DevDop Backend

Real-time pair programming backend built with Node.js, Express, and Socket.io.

## Setup

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment**
   - Copy `.env` file with your MongoDB URI, JWT_SECRET, and Judge0 API key
   - MongoDB connection string required
   - Judge0 API key for code execution (optional for development)

3. **Seed database**
   ```bash
   npm run seed
   ```
   Creates 5 test users: alex, jordan, casey, morgan, taylor (all with password123)

4. **Start server**
   ```bash
   npm run dev
   ```
   Server runs on http://localhost:5000

## API Endpoints

### Authentication
- **POST** `/api/auth/register` - Register new user
- **POST** `/api/auth/login` - Login user
- **GET** `/api/auth/me` - Get current user (requires auth)

### Rooms
- **POST** `/api/rooms` - Create room
- **GET** `/api/rooms/:roomCode` - Get room details
- **DELETE** `/api/rooms/:roomId` - Close room

### Sessions
- **GET** `/api/sessions` - Get user sessions
- **GET** `/api/sessions/:sessionId` - Get session details
- **POST** `/api/sessions/:sessionId/run` - Execute code

## Socket.io Events

### Room Management
- `join-room` - Join room
- `leave-room` - Leave room
- `user-joined` - User joined room
- `user-left` - User left room
- `kick-user` - Remove user from room
- `lock-room` - Lock/unlock room

### Code Collaboration
- `code-change` - Code editor change
- `cursor-move` - Cursor position change
- `language-change` - Programming language change

### Communication
- `chat-message` - Send chat message
- `receive-chat` - Receive chat message

### WebRTC
- `webrtc-offer` - WebRTC offer
- `webrtc-answer` - WebRTC answer
- `ice-candidate` - ICE candidate exchange

## Technology Stack
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Real-time**: Socket.io
- **Code Execution**: Judge0 API
- **Authentication**: JWT + bcrypt
- **Security**: Helmet, CORS, Rate Limiting
