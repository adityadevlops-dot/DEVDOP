import { customAlphabet } from 'nanoid'

// Generate 6-character uppercase room codes
const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 6)

export const generateRoomCode = () => nanoid()
