import { useEffect, useRef } from 'react'
import { Avatar } from '../ui/Avatar'
import { getColorForUser } from '../../utils/helpers'

export const VideoTile = ({ stream, username = 'User', isMuted = false }) => {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream
      videoRef.current.muted = isMuted
    }
  }, [stream, isMuted])

  // If no stream, show avatar placeholder
  if (!stream) {
    return (
      <div className="w-full aspect-video bg-elevated rounded-button flex items-center justify-center border border-border">
        <Avatar
          alt={username}
          size="lg"
          backgroundColor={getColorForUser(username)}
        />
      </div>
    )
  }

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted={isMuted}
      className="w-full aspect-video bg-black rounded-button border border-border object-cover"
    />
  )
}
