import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key'

export const generateToken = (userId, username) => {
  return jwt.sign({ userId, username }, JWT_SECRET, { expiresIn: '7d' })
}

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    throw new Error('Invalid token')
  }
}
