import { useState, useRef } from 'react'

export const Tooltip = ({
  content,
  children,
  side = 'top',
  delay = 200,
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const timerRef = useRef(null)

  const handleMouseEnter = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setIsVisible(true)
    }, delay)
  }

  const handleMouseLeave = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
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
      {isVisible && content && (
        <div
          className={`absolute z-50 px-2.5 py-1 text-xs font-medium text-white bg-elevated border border-border shadow-lg rounded-md whitespace-nowrap pointer-events-none ${positions[side] || positions.top}`}
        >
          {content}
        </div>
      )}
    </div>
  )
}
