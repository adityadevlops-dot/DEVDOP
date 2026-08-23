export const defaultEditorOptions = {
  minimap: { enabled: false },
  fontSize: 13,
  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
  padding: { top: 16, bottom: 16 },
  lineNumbers: 'on',
  lineNumbersMinChars: 3,
  scrollBeyondLastLine: false,
  wordWrap: 'on',
  automaticLayout: true,
  formatOnPaste: true,
  formatOnType: true,
  cursorBlinking: 'smooth',
  cursorSmoothCaretAnimation: 'on',
  smoothScrolling: true,
}

export const defineMonacoTheme = (monaco) => {
  monaco.editor.defineTheme('vs-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: 'ff2c2c' },
      { token: 'string', foreground: 'ffd700' },
      { token: 'number', foreground: 'ffd700' },
      { token: 'entity.name.function', foreground: 'ff8c00' },
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
}
