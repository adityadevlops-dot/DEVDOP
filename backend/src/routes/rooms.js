import express from 'express'
import { createRoom, getRoom, closeRoom } from '../controllers/roomController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/', authMiddleware, createRoom)
router.get('/:roomCode', authMiddleware, getRoom)
router.delete('/:roomId', authMiddleware, closeRoom)

export default router
