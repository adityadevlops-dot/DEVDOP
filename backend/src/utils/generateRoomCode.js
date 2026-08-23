import { customAlphabet } from 'nanoid'

// 6-character unambiguous alphanumeric uppercase room code generator
const nanoid = customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 6)

export const generateRoomCode = () => nanoid()

export const sanitizeRoomCode = (code) => {
  if (!code || typeof code !== 'string') return ''
  return code.trim().toUpperCase()
}
