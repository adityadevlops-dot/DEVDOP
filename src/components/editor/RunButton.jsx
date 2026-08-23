import { Play } from 'lucide-react'
import { Button } from '../ui/Button'
import { Tooltip } from '../ui/Tooltip'

export const RunButton = ({ onClick, isLoading, disabled }) => {
  return (
    <Tooltip content="Execute code (Ctrl + Enter)">
      <Button
        variant="success"
        size="md"
        onClick={onClick}
        isLoading={isLoading}
        disabled={disabled || isLoading}
        className="flex items-center gap-2"
      >
        {!isLoading && <Play size={18} />}
        Run
      </Button>
    </Tooltip>
  )
}
