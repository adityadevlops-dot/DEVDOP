import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

export const generateToken = (userId, username) => {
  return jwt.sign({ userId, username }, env.JWT_SECRET, { expiresIn: '7d' })
}

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, env.JWT_SECRET)
  } catch (error) {
    throw new Error('Invalid token')
  }
}
