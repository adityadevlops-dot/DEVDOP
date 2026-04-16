export const Badge = ({
  children,
  variant = 'default',
  size = 'sm',
  className = '',
}) => {
  const variants = {
    default: 'bg-surface text-text-primary border border-border',
    red: 'bg-red-900 text-accent-red border border-accent-red',
    gold: 'bg-yellow-900 text-accent-gold border border-accent-gold',
    green: 'bg-green-900 text-accent-green border border-accent-green',
    purple: 'bg-purple-900 text-accent-purple border border-accent-purple',
    orange: 'bg-orange-900 text-accent-orange border border-accent-orange',
    blue: 'bg-blue-900 text-accent-teal border border-accent-teal',
  }

  const sizes = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  }

  return (
    <span
      className={`inline-flex items-center font-medium rounded-button ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  )
}
