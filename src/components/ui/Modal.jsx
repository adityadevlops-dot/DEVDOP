import { X } from 'lucide-react'
import { Button } from './Button'

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  actions,
  size = 'md',
}) => {
  if (!isOpen) return null

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div
        className={`bg-elevated border border-border/50 rounded-2xl p-8 shadow-2xl ${sizes[size]}`}
      >
        <div className="flex items-center justify-between mb-6">
          {title && <h2 className="text-2xl font-bold text-text-primary">{title}</h2>}
          <button
            onClick={onClose}
            className="text-text-muted hover:text-accent-red transition-colors duration-300 p-2"
          >
            <X size={22} />
          </button>
        </div>

        <div className="text-text-primary mb-8">{children}</div>

        {actions && (
          <div className="flex justify-end gap-3 pt-6 border-t border-border/30">
            {actions.map((action, idx) => (
              <Button
                key={idx}
                variant={action.variant || 'secondary'}
                onClick={action.onClick}
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
