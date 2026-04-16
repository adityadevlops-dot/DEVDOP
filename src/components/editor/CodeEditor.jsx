/* ── BACKEND INTEGRATION POINTS ──
   - Emit code changes: socket.emit('code-change', { code, language })
   - Listen for remote changes: socket.on('code-change')
   - Handle remote cursor decorations
   - Current status: Editor UI with sync integration
*/

import { useEffect } from 'react'
import { Editor } from '@monaco-editor/react'
import { useSocket } from '../../hooks/useSocket'
import { useRoomStore } from '../../store/roomStore'
import { SOCKET_EVENTS } from '../../utils/constants'

export const CodeEditor = ({
  value,
  onChange,
  language = 'javascript',
  readOnly = false,
  height = '100%',
}) => {
  const { socket, on, off, emit } = useSocket()
  const { roomId } = useRoomStore()

  useEffect(() => {
    if (!socket || !roomId) return

    const handleCodeChange = (data) => {
      onChange(data.code)
    }

    on(SOCKET_EVENTS.CODE_CHANGE, handleCodeChange)

    return () => {
      off(SOCKET_EVENTS.CODE_CHANGE, handleCodeChange)
    }
  }, [socket, roomId, on, off, onChange])

  const handleChange = (val) => {
    const newValue = val || ''
    onChange(newValue)
    // Emit code change to other users with roomId
    if (roomId) {
      emit(SOCKET_EVENTS.CODE_CHANGE, { 
        roomId,
        code: newValue, 
        language 
      })
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
          minimap: { enabled: false },
          fontSize: 13,
          fontFamily: 'JetBrains Mono',
          padding: { top: 16, bottom: 16 },
          lineNumbers: 'on',
          lineNumbersMinChars: 3,
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          automaticLayout: true,
          readOnly,
          formatOnPaste: true,
          formatOnType: true,
        }}
        beforeMount={(monaco) => {
          // VS Dark theme customization
          monaco.editor.defineTheme('vs-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [
              { token: 'keyword', foreground: 'ff2c2c' }, // accent-red
              { token: 'string', foreground: 'ffd700' }, // accent-gold
              { token: 'number', foreground: 'ffd700' }, // accent-gold
              { token: 'entity.name.function', foreground: 'ff8c00' }, // accent-orange
            ],
            colors: {
              'editor.background': '#0a0a0a',
              'editor.foreground': '#ffffff',
              'editor.lineNumbersBackground': '#0a0a0a',
              'editor.lineNumbersForeground': '#707070',
              'editorCursor.foreground': '#ff2c2c',
              'editor.selectionBackground': '#ff2c2c30',
              'editor.lineHighlightBackground': '#1a1a1a80',
              'editorWhitespace.foreground': '#3a3a3a',
            },
          })
        }}
      />
    </div>
  )
}
