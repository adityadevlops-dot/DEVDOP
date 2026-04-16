import express from 'express'
import { register, login, getMe } from '../controllers/authController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'
import { loginLimiter } from '../middleware/rateLimiter.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', loginLimiter, login)
router.get('/me', authMiddleware, getMe)

export default router
