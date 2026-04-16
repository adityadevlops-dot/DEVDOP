export const DevdopLogo = ({ size = 32, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background circle */}
      <circle cx="24" cy="24" r="22" fill="#0a0a0a" stroke="#ff2c2c" strokeWidth="1.5" />
      
      {/* Left bracket */}
      <path
        d="M16 14 L12 14 L12 34 L16 34"
        stroke="#ff2c2c"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Center vertical line */}
      <line
        x1="24"
        y1="12"
        x2="24"
        y2="36"
        stroke="#ff2c2c"
        strokeWidth="2"
        opacity="0.6"
      />
      
      {/* Right bracket */}
      <path
        d="M32 14 L36 14 L36 34 L32 34"
        stroke="#ff2c2c"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Center dot - executing code indicator */}
      <circle cx="24" cy="24" r="2.5" fill="#ff2c2c" />
    </svg>
  )
}

