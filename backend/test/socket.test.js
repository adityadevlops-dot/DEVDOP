import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import http from 'http'
import express from 'express'
import { io as Client } from 'socket.io-client'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

import { setupSocketIO } from '../src/socket/index.js'
import { generateToken } from '../src/utils/generateToken.js'
import Room from '../src/models/Room.js'
import User from '../src/models/User.js'

let mongoServer
let httpServer
let ioServer
let serverAddress
let user1, user2
let token1, token2
let testRoom

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  await mongoose.connect(mongoServer.getUri())

  user1 = await User.create({ username: 'socketuser1', email: 's1@test.com', password: 'Password123!' })
  user2 = await User.create({ username: 'socketuser2', email: 's2@test.com', password: 'Password123!' })

  token1 = generateToken(user1._id, user1.username)
  token2 = generateToken(user2._id, user2.username)

  testRoom = await Room.create({
    roomCode: 'SOCK01',
    name: 'Socket Room',
    createdBy: user1._id,
    participants: [{ userId: user1._id, username: user1.username }],
  })

  const app = express()
  httpServer = http.createServer(app)
  ioServer = setupSocketIO(httpServer)

  await new Promise((resolve) => {
    httpServer.listen(0, () => {
      const port = httpServer.address().port
      serverAddress = `http://localhost:${port}`
      resolve()
    })
  })
})

afterAll(async () => {
  if (ioServer) ioServer.close()
  if (httpServer) httpServer.close()
  await mongoose.disconnect()
  if (mongoServer) await mongoServer.stop()
})

describe('Socket.io Integration Tests', () => {
  it('Should broadcast code-change from Client 1 to Client 2 only', async () => {
    const client1 = Client(serverAddress, { auth: { token: token1 } })
    const client2 = Client(serverAddress, { auth: { token: token2 } })

    await Promise.all([
      new Promise((res) => client1.on('connect', res)),
      new Promise((res) => client2.on('connect', res)),
    ])

    client1.emit('join-room', { roomId: testRoom._id.toString(), username: user1.username })
    client2.emit('join-room', { roomId: testRoom._id.toString(), username: user2.username })

    await new Promise((res) => setTimeout(res, 300))

    let client1Received = false
    let client2Received = null

    client1.on('code-change', () => {
      client1Received = true
    })

    const codeChangePromise = new Promise((resolve) => {
      client2.on('code-change', (data) => {
        client2Received = data
        resolve()
      })
    })

    client1.emit('code-change', {
      roomId: testRoom._id.toString(),
      code: 'console.log("Socket test")',
      language: 'javascript',
    })

    await codeChangePromise

    expect(client1Received).toBe(false)
    expect(client2Received).not.toBeNull()
    expect(client2Received.code).toBe('console.log("Socket test")')

    client1.disconnect()
    client2.disconnect()
  })
})
