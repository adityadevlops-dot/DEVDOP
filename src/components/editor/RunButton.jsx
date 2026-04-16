import { Play } from 'lucide-react'
import { Button } from '../ui/Button'

export const RunButton = ({ onClick, isLoading, disabled }) => {
  return (
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
  )
}
