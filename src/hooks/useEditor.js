/* ── BACKEND INTEGRATION POINTS ──
   - Emit code changes through Socket.io: socket.emit('code:change', { code, language })
   - Listen for remote code changes: socket.on('code:change')
   - Handle remote cursor positions merged with local changes
   - Current status: State management only, no socket integration
*/

import { useCallback } from 'react'
import { useRoomStore } from '../store/roomStore'
import { useSocket } from './useSocket'

export const useEditor = () => {
  const { code, language, setCode, setLanguage } = useRoomStore()
  const { emit } = useSocket()

  const handleCodeChange = useCallback(
    (newCode) => {
      setCode(newCode)
      // TODO: Emit to socket with debouncing
      // emit('code:change', { code: newCode, language })
      console.log('[EDITOR] code changed, length:', newCode.length)
    },
    [setCode, emit]
  )

  const handleLanguageChange = useCallback(
    (newLanguage) => {
      setLanguage(newLanguage)
      // TODO: Emit to socket
      // emit('language:change', { language: newLanguage })
      console.log('[EDITOR] language changed to:', newLanguage)
    },
    [setLanguage, emit]
  )

  const resetCode = useCallback(() => {
    setCode('')
    console.log('[EDITOR] code reset')
  }, [setCode])

  return {
    code,
    language,
    handleCodeChange,
    handleLanguageChange,
    resetCode,
  }
}
