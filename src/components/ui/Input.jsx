export const Input = ({
  label,
  error,
  helperText,
  placeholder,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-text-primary mb-2.5">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-3 bg-elevated border border-border/50 rounded-lg text-text-primary placeholder-text-muted transition-all duration-300 focus:outline-none focus:border-accent-red focus:shadow-lg focus:shadow-accent-red/20 ${
          error ? 'border-accent-red focus:shadow-red-500/20' : ''
        } ${className}`}
        placeholder={placeholder}
        {...props}
      />
      {error && (
        <p className="text-xs font-medium text-accent-red mt-2">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-xs text-text-muted mt-2">{helperText}</p>
      )}
    </div>
  )
}
