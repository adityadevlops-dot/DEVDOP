import express from 'express'
import { getSessions, getSession, runSessionCode, quickRunCode } from '../controllers/sessionController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'
import { runCodeLimiter } from '../middleware/rateLimiter.js'

const router = express.Router()

router.get('/', authMiddleware, getSessions)
router.get('/:sessionId', authMiddleware, getSession)
router.post('/run', authMiddleware, runCodeLimiter, quickRunCode)
router.post('/:sessionId/run', authMiddleware, runCodeLimiter, runSessionCode)

export default router
