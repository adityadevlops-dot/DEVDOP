import express from 'express'
import { register, login, googleAuth, getMe } from '../controllers/authController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'
import { loginLimiter } from '../middleware/rateLimiter.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', loginLimiter, login)
router.post('/google', loginLimiter, googleAuth)
router.get('/me', authMiddleware, getMe)

export default router
