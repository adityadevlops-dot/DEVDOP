import './config/env.js'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import http from 'http'
import mongoSanitize from 'express-mongo-sanitize'
import connectDB from './config/db.js'
import { setupSocketIO } from './socket/index.js'
import { errorHandler } from './middleware/errorHandler.js'
import { apiLimiter } from './middleware/rateLimiter.js'
import env from './config/env.js'

// Routes
import authRoutes from './routes/auth.js'
import roomRoutes from './routes/rooms.js'
import sessionRoutes from './routes/sessions.js'

const app = express()
const server = http.createServer(app)
const PORT = env.PORT

app.set('trust proxy', 1)

// Middleware
app.use(helmet())

const allowedOrigins = env.CORS_ORIGIN
  ? env.CORS_ORIGIN.split(',').map((o) => o.trim())
  : ['http://localhost:5173', 'http://localhost:5000']

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
)

app.use(express.json({ limit: '1mb' }))
app.use(mongoSanitize())
app.use('/api', apiLimiter)

// Connect to MongoDB
connectDB()

// Setup Socket.io
setupSocketIO(server)

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/rooms', roomRoutes)
app.use('/api/sessions', sessionRoutes)

// 404 handler for undefined API endpoints
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: `Cannot ${req.method} ${req.originalUrl}` })
})

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
  console.log(`🚀 DevDop Backend Server ready on port ${PORT}`)
})
