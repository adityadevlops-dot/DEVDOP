export const FullBackgroundImages = () => {
  return (
    <div className="absolute inset-0 overflow-hidden -z-10 w-screen h-screen">
      {/* Base dark background */}
      <div className="absolute inset-0 bg-primary" />

      {/* Large Red Glow - Top Left */}
      <div
        className="absolute -top-96 -left-96 w-[800px] h-[800px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255, 44, 44, 0.6) 0%, rgba(255, 44, 44, 0.3) 30%, transparent 80%)',
          filter: 'blur(100px)',
          animation: 'float 12s ease-in-out infinite',
        }}
      />

      {/* Large Red Glow - Top Right */}
      <div
        className="absolute -top-64 -right-64 w-[700px] h-[700px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255, 44, 44, 0.5) 0%, rgba(255, 44, 44, 0.25) 35%, transparent 75%)',
          filter: 'blur(90px)',
          animation: 'float 14s ease-in-out infinite 2s',
        }}
      />

      {/* Large Red Glow - Center */}
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255, 44, 44, 0.4) 0%, rgba(255, 44, 44, 0.15) 40%, transparent 85%)',
          filter: 'blur(120px)',
          animation: 'float 16s ease-in-out infinite 1s',
        }}
      />

      {/* Large Red Glow - Bottom Left */}
      <div
        className="absolute -bottom-72 -left-32 w-[750px] h-[750px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255, 44, 44, 0.55) 0%, rgba(255, 44, 44, 0.28) 32%, transparent 78%)',
          filter: 'blur(95px)',
          animation: 'float 13s ease-in-out infinite 1.5s',
        }}
      />

      {/* Large Red Glow - Bottom Right */}
      <div
        className="absolute -bottom-64 -right-96 w-[850px] h-[850px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255, 44, 44, 0.65) 0%, rgba(255, 44, 44, 0.32) 28%, transparent 75%)',
          filter: 'blur(110px)',
          animation: 'float 15s ease-in-out infinite 0.5s',
        }}
      />

      {/* Layered wave/shape overlays */}
      <svg
        className="absolute inset-0 w-full h-full opacity-50 pointer-events-none"
        style={{
          filter: 'blur(80px)',
        }}
        viewBox="0 0 1600 900"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 44, 44, 0.5)" />
            <stop offset="100%" stopColor="rgba(255, 44, 44, 0)" />
          </linearGradient>
        </defs>
        
        {/* Wave shapes */}
        <path
          d="M 0 300 Q 400 200 800 250 T 1600 300 L 1600 900 L 0 900 Z"
          fill="url(#waveGrad1)"
        />
        <path
          d="M 0 500 Q 400 400 800 450 T 1600 500 L 1600 0 L 0 0 Z"
          fill="rgba(255, 44, 44, 0.25)"
        />
      </svg>

      {/* Grain texture */}
      <div
        className="absolute inset-0 opacity-5 mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='400' height='400' fill='%23000' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
        }}
      />
    </div>
  )
}
