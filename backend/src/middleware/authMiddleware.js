import { verifyToken } from '../utils/generateToken.js'

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const decoded = verifyToken(token)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}
