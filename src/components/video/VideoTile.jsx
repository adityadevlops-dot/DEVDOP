import { useEffect, useRef } from 'react'
import { MicOff } from 'lucide-react'
import { Avatar } from '../ui/Avatar'
import { getColorForUser } from '../../utils/helpers'

export const VideoTile = ({ stream, username = 'User', isMuted = false, isLocal = false }) => {
  const videoRef = useRef(null)

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream
      videoRef.current.muted = isMuted || isLocal
    }
  }, [stream, isMuted, isLocal])

  if (!stream) {
    return (
      <div className="w-full aspect-video bg-surface rounded-button flex items-center justify-center border border-border relative overflow-hidden">
        <Avatar
          alt={username}
          size="lg"
          backgroundColor={getColorForUser(username)}
        />
        <div className="absolute bottom-1.5 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-sm rounded text-[10px] text-text-primary font-medium">
          {username} {isLocal && '(You)'}
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full aspect-video bg-black rounded-button border border-border overflow-hidden group">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isMuted || isLocal}
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-1.5 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-sm rounded text-[10px] text-text-primary font-medium flex items-center gap-1">
        <span>{username} {isLocal && '(You)'}</span>
        {isMuted && <MicOff size={10} className="text-accent-red" />}
      </div>
    </div>
  )
}
