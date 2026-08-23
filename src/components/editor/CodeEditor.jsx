import { useEffect, useRef } from 'react'
import { Editor } from '@monaco-editor/react'
import { useSocket } from '../../hooks/useSocket'
import { useRoomStore } from '../../store/roomStore'
import { SOCKET_EVENTS } from '../../utils/constants'
import { defaultEditorOptions, defineMonacoTheme } from './editorConfig'

export const CodeEditor = ({
  value,
  onChange,
  language = 'javascript',
  readOnly = false,
  height = '100%',
}) => {
  const { socket, on, off, emit } = useSocket()
  const { roomId } = useRoomStore()
  const emitTimerRef = useRef(null)

  useEffect(() => {
    if (!socket || !roomId) return

    const handleCodeChange = (data) => {
      if (data.senderId && data.senderId === socket.id) {
        return
      }
      if (data.code !== undefined && data.code !== value) {
        onChange(data.code)
      }
    }

    on(SOCKET_EVENTS.CODE_CHANGE, handleCodeChange)

    return () => {
      off(SOCKET_EVENTS.CODE_CHANGE, handleCodeChange)
    }
  }, [socket, roomId, on, off, onChange, value])

  const handleChange = (val) => {
    const newValue = val || ''
    onChange(newValue)

    if (roomId) {
      if (emitTimerRef.current) {
        clearTimeout(emitTimerRef.current)
      }

      emitTimerRef.current = setTimeout(() => {
        emit(SOCKET_EVENTS.CODE_CHANGE, {
          roomId,
          code: newValue,
          language,
        })
      }, 150)
    }
  }

  return (
    <div className="w-full h-full border-t border-b border-border">
      <Editor
        height={height}
        defaultLanguage={language}
        language={language}
        value={value}
        onChange={handleChange}
        theme="vs-dark"
        options={{
          ...defaultEditorOptions,
          readOnly,
        }}
        beforeMount={defineMonacoTheme}
      />
    </div>
  )
}
