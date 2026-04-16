export const BackgroundShapes = () => {
  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      {/* Large Blob Shape 1 - Top Left */}
      <div
        className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full opacity-70"
        style={{
          background: 'radial-gradient(circle at 30% 30%, rgba(255, 44, 44, 0.8) 0%, rgba(255, 44, 44, 0.4) 30%, rgba(255, 44, 44, 0) 70%)',
          filter: 'blur(80px)',
          animation: 'float 8s ease-in-out infinite',
        }}
      />

      {/* Large Blob Shape 2 - Top Center-Right */}
      <div
        className="absolute -top-64 right-1/3 w-[450px] h-[450px] rounded-full opacity-60"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(255, 44, 44, 0.7) 0%, rgba(255, 44, 44, 0.3) 35%, rgba(255, 44, 44, 0) 70%)',
          filter: 'blur(90px)',
          animation: 'float 10s ease-in-out infinite 1s',
        }}
      />

      {/* Large Blob Shape 3 - Center Right */}
      <div
        className="absolute top-1/2 -right-32 w-[550px] h-[550px] rounded-full opacity-65"
        style={{
          background: 'radial-gradient(circle at 40% 60%, rgba(255, 44, 44, 0.75) 0%, rgba(255, 44, 44, 0.35) 32%, rgba(255, 44, 44, 0) 75%)',
          filter: 'blur(95px)',
          animation: 'float 12s ease-in-out infinite 2s',
        }}
      />

      {/* Large Blob Shape 4 - Bottom Left */}
      <div
        className="absolute -bottom-40 left-1/4 w-[480px] h-[480px] rounded-full opacity-62"
        style={{
          background: 'radial-gradient(circle at 60% 40%, rgba(255, 44, 44, 0.72) 0%, rgba(255, 44, 44, 0.32) 33%, rgba(255, 44, 44, 0) 72%)',
          filter: 'blur(85px)',
          animation: 'float 9s ease-in-out infinite 1.5s',
        }}
      />

      {/* Large Blob Shape 5 - Bottom Right */}
      <div
        className="absolute -bottom-32 -right-48 w-[520px] h-[520px] rounded-full opacity-68"
        style={{
          background: 'radial-gradient(circle at 35% 55%, rgba(255, 44, 44, 0.78) 0%, rgba(255, 44, 44, 0.38) 31%, rgba(255, 44, 44, 0) 68%)',
          filter: 'blur(88px)',
          animation: 'float 11s ease-in-out infinite 0.5s',
        }}
      />

      {/* Ambient glow layer */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255, 44, 44, 0.3) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
