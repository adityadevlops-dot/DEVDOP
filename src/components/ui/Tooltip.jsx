import { useState } from 'react'

export const Tooltip = ({
  content,
  children,
  side = 'top',
  delay = 200,
}) => {
  const [isVisible, setIsVisible] = useState(false)
  let timeoutId

  const handleMouseEnter = () => {
    timeoutId = setTimeout(() => {
      setIsVisible(true)
    }, delay)
  }

  const handleMouseLeave = () => {
    clearTimeout(timeoutId)
    setIsVisible(false)
  }

  const positions = {
    top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
    bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
    left: 'right-full mr-2 top-1/2 -translate-y-1/2',
    right: 'left-full ml-2 top-1/2 -translate-y-1/2',
  }

  return (
    <div className="relative inline-block" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {children}
      {isVisible && (
        <div
          className={`absolute z-50 px-3 py-2 text-xs font-medium text-white bg-accent-red border border-accent-red rounded-button whitespace-nowrap pointer-events-none ${positions[side]}`}
        >
          {content}
        </div>
      )}
    </div>
  )
}
