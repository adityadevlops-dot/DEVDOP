import { useState } from 'react'
import { Terminal, Play, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '../ui/Button'

export const OutputPanel = ({ output, isLoading, onRun }) => {
  const [isExpanded, setIsExpanded] = useState(!!output || isLoading)

  // Auto-expand when output or loading starts
  if ((output || isLoading) && !isExpanded) {
    setIsExpanded(true)
  }

  return (
    <div className={`bg-primary border-t border-border flex flex-col transition-all ${isExpanded ? 'h-40' : 'h-12'}`}>
      {/* Header */}
      <div className="h-12 bg-surface border-b border-border flex items-center justify-between px-4 gap-2 cursor-pointer hover:bg-primary transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          {isExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          <Terminal size={16} className="text-accent-green" />
          <span className="text-sm font-semibold text-text-primary">Output</span>
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          <Button
            variant="success"
            size="sm"
            onClick={onRun}
            isLoading={isLoading}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {!isLoading && <Play size={16} />}
            Run
          </Button>
        </div>
      </div>

      {/* Output Content */}
      {isExpanded && (
        <div className="flex-1 overflow-auto p-4 font-mono text-sm text-text-primary">
          {isLoading ? (
            <div className="flex items-center gap-2 text-text-muted">
              <span className="inline-block w-2 h-2 bg-accent-blue rounded-full animate-pulse" />
              Running...
            </div>
          ) : output ? (
            <pre className="whitespace-pre-wrap break-words text-text-primary">{output}</pre>
          ) : (
            <span className="text-text-muted">Output will appear here</span>
          )}
        </div>
      )}
    </div>
  )
}
