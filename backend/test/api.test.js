import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import express from 'express'
import mongoSanitize from 'express-mongo-sanitize'

import authRoutes from '../src/routes/auth.js'
import roomRoutes from '../src/routes/rooms.js'
import sessionRoutes from '../src/routes/sessions.js'
import { errorHandler } from '../src/middleware/errorHandler.js'

let mongoServer
let app

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  const mongoUri = mongoServer.getUri()
  await mongoose.connect(mongoUri)

  app = express()
  app.use(express.json())
  app.use(mongoSanitize())

  app.use('/api/auth', authRoutes)
  app.use('/api/rooms', roomRoutes)
  app.use('/api/sessions', sessionRoutes)

  app.use('/api/*', (req, res) => {
    res.status(404).json({ success: false, message: `Cannot ${req.method} ${req.originalUrl}` })
  })

  app.use(errorHandler)
})

afterAll(async () => {
  await mongoose.disconnect()
  if (mongoServer) {
    await mongoServer.stop()
  }
})

describe('Backend API Integration Tests', () => {
  let userToken = ''
  let user2Token = ''
  let createdRoomId = ''

  it('1. Should register a new user successfully', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser1',
        email: 'testuser1@example.com',
        password: 'Password123!',
      })

    expect(res.status).toBe(201)
    expect(res.body.success).toBe(true)
    expect(res.body.data.token).toBeDefined()
    userToken = res.body.data.token
  })

  it('2. Should reject duplicate registration with 409', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser1',
        email: 'testuser1@example.com',
        password: 'Password123!',
      })

    expect(res.status).toBe(409)
    expect(res.body.success).toBe(false)
  })

  it('3. Should login user and return JWT token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'testuser1',
        password: 'Password123!',
      })

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data.token).toBeDefined()
  })

  it('4. Should register second user for authorization tests', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser2',
        email: 'testuser2@example.com',
        password: 'Password123!',
      })

    expect(res.status).toBe(201)
    user2Token = res.body.data.token
  })

  it('5. Should create room as user 1', async () => {
    const res = await request(app)
      .post('/api/rooms')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        name: 'Test Pair Room',
        description: 'Testing room authorization',
      })

    expect(res.status).toBe(201)
    expect(res.body.success).toBe(true)
    createdRoomId = res.body.data.room._id
  })

  it('6. Should reject room deletion by non-host user 2 with 403', async () => {
    const res = await request(app)
      .delete(`/api/rooms/${createdRoomId}`)
      .set('Authorization', `Bearer ${user2Token}`)

    expect(res.status).toBe(403)
    expect(res.body.success).toBe(false)
  })

  it('7. Should return 404 JSON for unknown API routes', async () => {
    const res = await request(app).get('/api/unknown-endpoint-path')
    expect(res.status).toBe(404)
    expect(res.body.success).toBe(false)
  })

  it('8. Should reject code execution exceeding 50,000 chars with 400', async () => {
    const oversizedCode = 'a'.repeat(50001)
    const res = await request(app)
      .post('/api/sessions/run')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        code: oversizedCode,
        language: 'javascript',
      })

    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
  })

  it('9. Should reject Google auth request when token is missing or invalid', async () => {
    const resMissing = await request(app).post('/api/auth/google').send({})
    expect(resMissing.status).toBe(400)
    expect(resMissing.body.success).toBe(false)

    const resInvalid = await request(app).post('/api/auth/google').send({ credential: 'invalid_google_token' })
    expect(resInvalid.status).toBe(401)
    expect(resInvalid.body.success).toBe(false)
  })
})
