export const BADGE_VARIANTS = {
  default: 'bg-surface text-text-primary border border-border',
  red: 'bg-red-950/60 text-accent-red border border-accent-red/40',
  gold: 'bg-yellow-950/60 text-accent-gold border border-accent-gold/40',
  green: 'bg-green-950/60 text-accent-green border border-accent-green/40',
  purple: 'bg-purple-950/60 text-purple-400 border border-purple-500/40',
  orange: 'bg-orange-950/60 text-accent-orange border border-accent-orange/40',
  blue: 'bg-blue-950/60 text-accent-teal border border-accent-teal/40',
}

export const BADGE_SIZES = {
  xs: 'px-2 py-0.5 text-xs font-semibold',
  sm: 'px-2.5 py-1 text-xs font-semibold',
  md: 'px-3 py-1.5 text-sm font-semibold',
}

export const Badge = ({
  children,
  variant = 'default',
  size = 'sm',
  className = '',
}) => {
  return (
    <span
      className={`inline-flex items-center rounded-button transition-colors ${BADGE_VARIANTS[variant] || BADGE_VARIANTS.default} ${BADGE_SIZES[size] || BADGE_SIZES.sm} ${className}`}
    >
      {children}
    </span>
  )
}
