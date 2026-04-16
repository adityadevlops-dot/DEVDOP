import express from 'express'
import { getSessions, getSession, runSessionCode, quickRunCode } from '../controllers/sessionController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', authMiddleware, getSessions)
router.get('/:sessionId', authMiddleware, getSession)
router.post('/run', authMiddleware, quickRunCode)
router.post('/:sessionId/run', authMiddleware, runSessionCode)

export default router
