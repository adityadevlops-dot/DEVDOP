import { verifyToken } from '../utils/generateToken.js'

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authentication required. No token provided.' })
    }

    const token = authHeader.substring(7).trim()
    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication required. Empty token.' })
    }

    const decoded = verifyToken(token)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired authentication token.' })
  }
}
