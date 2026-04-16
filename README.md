# 🎯 DevDop
## Real-Time Collaborative Coding Platform

[![License](https://img.shields.io/badge/License-MIT-brightgreen?style=for-the-badge)](LICENSE)
[![Node Version](https://img.shields.io/badge/Node-18+-blue?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Build Status](https://img.shields.io/badge/Build-Active-brightgreen?style=for-the-badge)](https://github.com/adityadevlops-dot/DEVDOP)
[![Socket.io](https://img.shields.io/badge/Socket.io-Real--Time-010101?style=for-the-badge&logo=socket.io)](https://socket.io)

> **Transform pair programming into a seamless, real-time experience with DevDop** — where teams code together, chat instantly, execute code live, and collaborate face-to-face.

---

## 📌 About The Project

DevDop is a **production-ready collaborative coding platform** built for remote pair programming, technical interviews, and distributed learning. It enables teams to write code together with **real-time synchronization**, communicate instantly through **live chat**, share video/audio via **WebRTC**, and execute code on demand.

> [!NOTE]
> 🎉 DevDop is **fully functional and production-ready**! All core features have been implemented, tested, and optimized for performance.

---

## 🚀 Features

- ⚡ **Real-Time Code Synchronization** - Changes sync instantly across all participants using Socket.io
- 💬 **Live Chat System** - Built-in messaging for seamless team communication
- 🎥 **Video & Audio Calls** - Peer-to-peer WebRTC implementation with camera/microphone support
- 👥 **Multi-User Rooms** - Create collaborative sessions and invite teammates with unique room codes
- 🔐 **Secure Authentication** - JWT-based login/registration with token persistence
- 🎨 **Syntax Highlighting** - Support for 8+ programming languages (JavaScript, Python, Java, C++, Go, TypeScript, Rust, C)
- ⚙️ **Code Execution** - Run code directly with Judge0 API integration
- 🔍 **Live Cursor Tracking** - See exactly where other users are typing in real-time
- 📊 **Smart Output Panel** - Collapsible execution results with smart formatting
- 🌙 **Modern Dark Theme** - Beautiful, responsive UI built with Tailwind CSS
- 👤 **Participant Avatars** - Visual identification of team members with generated avatars
- 🔄 **Auto-Persisted State** - Session data persists across browser refreshes

---

## 🛠 Tech Stack

### Frontend Stack
![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5+-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io--Client-4+-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-State-FF6B6B?style=for-the-badge)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Monaco Editor](https://img.shields.io/badge/Monaco-Editor-007ACC?style=for-the-badge&logo=microsoft&logoColor=white)

### Backend Stack
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4+-000000?style=for-the-badge&logo=express)
![Socket.io](https://img.shields.io/badge/Socket.io--Server-4+-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-13AA52?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-ODM-880000?style=for-the-badge&logo=mongooseosx&logoColor=white)

---

## 🎯 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** v18+ ([Download](https://nodejs.org/))
- **npm** v9+ or **yarn** v3+
- **MongoDB Atlas** account ([Free Sign Up](https://www.mongodb.com/cloud/atlas))

> [!TIP]
> New to MongoDB? Create a free tier cluster at MongoDB Atlas — it's quick and perfect for development!

### Installation

**Step 1: Clone the Repository**
```bash
git clone https://github.com/adityadevlops-dot/DEVDOP.git
cd DEVDOP
```

**Step 2: Backend Setup**
```bash
cd backend
npm install

# Create .env file with your configuration
cp .env.example .env
```

Edit `backend/.env` with your details:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_secret_key
JUDGE0_API_KEY=your_judge0_api_key
CORS_ORIGIN=http://localhost:5173,http://localhost:3000,http://localhost:3001,http://localhost:3002
```

Start the backend:
```bash
npm start
```
✅ Backend running on `http://localhost:5000`

**Step 3: Frontend Setup**
```bash
# In a new terminal, from project root
npm install

# Create .env file
cp .env.example .env.local
```

Edit `.env.local`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

Start the frontend:
```bash
npm run dev
```
✅ Frontend running on `http://localhost:3002`

> [!WARNING]
> Make sure MongoDB cluster is online and the connection string is correct. The backend will fail to start without a valid database connection!

---

## 🎮 How To Use

### **Create a Collaborative Room**

1. **Sign In** — Register or login to your DevDop account
2. **Create Room** — Click "Create Room" on the dashboard
3. **Share Code** — Share the room code with collaborators (e.g., `HRG59R`)
4. **Start Coding** — Participants join and you're ready to code together!

### **Core Workflow**

```
┌─────────────────────────────────────┐
│ 1. Login/Register                   │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│ 2. Create or Join a Room            │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│ 3. Real-Time Code Collaboration     │
│    • Code Sync • Chat • Video Calls  │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│ 4. Run & Test Code                  │
│    • Execute instantly • View Output │
└─────────────────────────────────────┘
```

### **Features in Action**

```javascript
// Your code changes sync to all participants instantly
function quickSort(arr) {
  if (arr.length <= 1) return arr;
  const pivot = arr[0];
  const left = arr.slice(1).filter(x => x < pivot);
  const right = arr.slice(1).filter(x => x >= pivot);
  return [...quickSort(left), pivot, ...quickSort(right)];
}
```

---

## 📊 Project Structure

```
DEVDOP/
├── backend/                          # Node.js/Express Server
│   ├── src/
│   │   ├── config/                  # Database & API configuration
│   │   ├── controllers/             # Route handlers
│   │   ├── models/                  # MongoDB schemas (User, Room, Session)
│   │   ├── routes/                  # API endpoints
│   │   ├── middleware/              # Auth, error handling, rate limiting
│   │   ├── socket/                  # Socket.io event handlers
│   │   └── utils/                   # Helper functions
│   └── package.json
│
├── src/                               # React Frontend
│   ├── api/                         # API client with Axios
│   ├── components/
│   │   ├── layout/                 # Navbar, ProtectedRoute
│   │   ├── room/                   # RoomLayout, RoomHeader, Participants
│   │   ├── editor/                 # CodeEditor, LanguageSelect, OutputPanel
│   │   ├── video/                  # VideoPanel, VideoTile
│   │   ├── chat/                   # ChatPanel, ChatMessage
│   │   └── ui/                     # Reusable UI components
│   ├── hooks/                      # Custom React hooks
│   ├── store/                      # Zustand state management
│   ├── pages/                      # Full page components
│   └── utils/                      # Constants, helpers
│
└── package.json                     # Frontend dependencies
```

---

## ✅ Features Status

### Completed Features
- ✅ User authentication with JWT
- ✅ Room creation and joining
- ✅ Real-time code synchronization
- ✅ Multi-language syntax highlighting
- ✅ Live chat messaging
- ✅ Code execution via Judge0
- ✅ WebRTC video/audio support
- ✅ Participant tracking with avatars
- ✅ Cursor position sync
- ✅ Responsive dark UI
- ✅ CORS configuration
- ✅ Production deployment ready

### Roadmap - Coming Soon
- [ ] Code snippet export & sharing
- [ ] GitHub integration for code import/export
- [ ] Collaborative debugging breakpoints
- [ ] AI-powered code suggestions
- [ ] Team workspaces with persistence
- [ ] Advanced role-based access control
- [ ] Live session recording & replay
- [ ] Code templates & starter projects

---

## 🤝 Contributing

We ❤️ contributions! Here's how to help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow existing code patterns and style
- Write meaningful commit messages
- Test your changes before submitting
- Update documentation as needed
- No breaking changes without discussion

---

## 📄 License

This project is licensed under the **MIT License** — you're free to use, modify, and distribute. See the [LICENSE](LICENSE) file for complete details.

---

## 💬 Community & Support

- 🐛 **Found a Bug?** [Report it on GitHub Issues](https://github.com/adityadevlops-dot/DEVDOP/issues)
- 💡 **Have an Idea?** [Start a Discussion](https://github.com/adityadevlops-dot/DEVDOP/discussions)
- 📧 **Email** — devdop@example.com
- 🐦 **Twitter** — [@devdop_io](https://twitter.com)

---

## 🙌 Acknowledgments

Special thanks to:
- The incredible **open-source community** for amazing libraries
- **MongoDB** for scalable cloud databases
- **Socket.io** for real-time communication
- All **contributors** and **users** for making DevDop better!

---

<div align="center">

### ⭐ **If you find DevDop useful, please star this repository!** ⭐

**Your support keeps us motivated and helps the community grow** 🚀

[View on GitHub](https://github.com/adityadevlops-dot/DEVDOP) • [Report Issues](https://github.com/adityadevlops-dot/DEVDOP/issues) • [Discussions](https://github.com/adityadevlops-dot/DEVDOP/discussions)

**Made with ❤️ by the DevDop Team**

[⬆ Back to top](#-devdop)

</div>

---

**Built with ❤️ by the devdop team**
