export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  isLoading = false,
  className = '',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-accent-red hover:bg-accent-red/90 text-white shadow-lg hover:shadow-red-500/30 hover:shadow-xl',
    secondary: 'bg-surface border border-border/50 hover:bg-elevated text-text-primary hover:border-accent-red/50',
    danger: 'bg-accent-red hover:bg-accent-red/90 text-white shadow-lg hover:shadow-red-500/30',
    success: 'bg-accent-green hover:bg-accent-green/90 text-white shadow-lg hover:shadow-green-500/30',
    ghost: 'hover:bg-elevated/50 text-text-primary hover:text-accent-red',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-7 py-3.5 text-base',
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="inline-block w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  )
}
