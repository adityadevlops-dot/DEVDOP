import { useCallback } from 'react'
import { useRoomStore } from '../store/roomStore'

export const useEditor = () => {
  const { code, language, setCode, setLanguage } = useRoomStore()

  const handleCodeChange = useCallback(
    (newCode) => {
      setCode(newCode)
    },
    [setCode]
  )

  const handleLanguageChange = useCallback(
    (newLanguage) => {
      setLanguage(newLanguage)
    },
    [setLanguage]
  )

  const resetCode = useCallback(() => {
    setCode('')
  }, [setCode])

  return {
    code,
    language,
    handleCodeChange,
    handleLanguageChange,
    resetCode,
  }
}
