import { getInitials } from '../../utils/helpers'

export const Avatar = ({
  src,
  alt,
  initials,
  size = 'md',
  className = '',
  backgroundColor,
}) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  }

  const getDisplay = () => {
    if (src) {
      return (
        <img
          src={src}
          alt={alt || 'avatar'}
          className="w-full h-full rounded-full object-cover"
        />
      )
    }

    const displayInitials = initials || getInitials(alt || 'User')

    return (
      <div
        className="w-full h-full rounded-full flex items-center justify-center font-mono font-semibold text-white"
        style={{
          backgroundColor: backgroundColor || '#ff2c2c',
        }}
      >
        {displayInitials}
      </div>
    )
  }

  return (
    <div className={`${sizes[size]} inline-flex items-center justify-center flex-shrink-0 ${className}`}>
      {getDisplay()}
    </div>
  )
}
