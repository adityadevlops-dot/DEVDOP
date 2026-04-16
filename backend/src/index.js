import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import http from 'http'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import { setupSocketIO } from './socket/index.js'
import { errorHandler } from './middleware/errorHandler.js'
import { apiLimiter } from './middleware/rateLimiter.js'

// Routes
import authRoutes from './routes/auth.js'
import roomRoutes from './routes/rooms.js'
import sessionRoutes from './routes/sessions.js'

dotenv.config()

const app = express()
const server = http.createServer(app)
const PORT = process.env.PORT || 5000

// Middleware
app.use(helmet())

// Parse CORS origins from environment variable
const corsOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : ['http://localhost:5173', 'http://localhost:3000']

console.log('[CORS] allowed origins:', corsOrigins)

app.use(cors({
  origin: corsOrigins,
  credentials: true,
}))
app.use(express.json())
app.use(apiLimiter)

// Connect to MongoDB
connectDB()

// Setup Socket.io
setupSocketIO(server)

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/rooms', roomRoutes)
app.use('/api/sessions', sessionRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() })
})

// Error handling middleware
app.use(errorHandler)

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('👋 Shutting down gracefully...')
  server.close(() => {
    console.log('✅ Server closed')
    process.exit(0)
  })
})

// Start server
server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════╗
║   🚀 Devdop Backend Server Ready   ║
║   ✅ Server running on port ${PORT}      ║
║   🔗 Socket.io enabled             ║
║   💾 MongoDB connected             ║
╚════════════════════════════════════╝
  `)
})
