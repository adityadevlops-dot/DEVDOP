import './config/env.js'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import http from 'http'
import mongoose from 'mongoose'
import mongoSanitize from 'express-mongo-sanitize'
import connectDB from './config/db.js'
import { setupSocketIO } from './socket/index.js'
import { errorHandler } from './middleware/errorHandler.js'
import { apiLimiter } from './middleware/rateLimiter.js'
import { requestLogger } from './middleware/requestLogger.js'
import { getCorsOrigins } from './config/cors.js'
import env from './config/env.js'

import authRoutes from './routes/auth.js'
import roomRoutes from './routes/rooms.js'
import sessionRoutes from './routes/sessions.js'

const app = express()
const server = http.createServer(app)
const PORT = env.PORT

app.set('trust proxy', 1)

app.use(helmet())

const allowedOrigins = getCorsOrigins()
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
)

app.use(express.json({ limit: '1mb' }))
app.use(requestLogger)
app.use(mongoSanitize())
app.use('/api', apiLimiter)

setupSocketIO(server)

app.use('/api/auth', authRoutes)
app.use('/api/rooms', roomRoutes)
app.use('/api/sessions', sessionRoutes)

// Healthcheck endpoint (7.3)
app.get('/health', (req, res) => {
  const isDbReady = mongoose.connection.readyState === 1
  const responseData = {
    status: isDbReady ? 'ok' : 'down',
    database: isDbReady ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  }
  if (!isDbReady) {
    return res.status(503).json(responseData)
  }
  return res.status(200).json(responseData)
})

app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: `Cannot ${req.method} ${req.originalUrl}` })
})

app.use(errorHandler)

// Graceful shutdown handler (7.2)
const gracefulShutdown = (signal) => {
  console.log(`👋 Received ${signal}. Shutting down gracefully...`)
  const timeoutGuard = setTimeout(() => {
    console.error('❌ Shutdown timed out (10s max grace). Forcefully exiting.')
    process.exit(1)
  }, 10000)

  server.close(async () => {
    try {
      await mongoose.connection.close()
      console.log('✅ Mongoose connection and HTTP server closed.')
      clearTimeout(timeoutGuard)
      process.exit(0)
    } catch (err) {
      console.error('Error during database disconnection:', err)
      process.exit(1)
    }
  })
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'))
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))

// 7.1: Await connectDB before server.listen inside success path
const startServer = async () => {
  try {
    await connectDB()
    server.listen(PORT, () => {
      console.log(`🚀 DevDop Backend Server ready on port ${PORT}`)
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error.message)
    process.exit(1)
  }
}

startServer()
