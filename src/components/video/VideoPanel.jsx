import { Mic, MicOff, Video, VideoOff } from 'lucide-react'
import { VideoTile } from './VideoTile'
import { Button } from '../ui/Button'
import { useAuthStore } from '../../store/authStore'

export const VideoPanel = ({
  localStream,
  remoteStream,
  onToggleMic,
  onToggleCam,
  isMicOn = true,
  isCamOn = true,
}) => {
  const { user } = useAuthStore()
  const username = user?.username || 'You'

  return (
    <div className="flex-shrink-0 border-b border-border p-3 space-y-3 bg-surface/50">
      {/* Local Video */}
      <div>
        <p className="text-[10px] uppercase font-bold text-text-muted px-1 mb-1.5 tracking-wider">
          Local Feed
        </p>
        <VideoTile stream={localStream} username={username} isMuted={!isMicOn} isLocal />
      </div>

      {/* Remote Video */}
      {remoteStream && (
        <div>
          <p className="text-[10px] uppercase font-bold text-text-muted px-1 mb-1.5 tracking-wider">
            Peer Feed
          </p>
          <VideoTile stream={remoteStream} username="Peer" />
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-2 pt-1">
        <Button
          variant={isMicOn ? 'secondary' : 'danger'}
          size="sm"
          onClick={onToggleMic}
          aria-label={isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
          className="flex-1 flex items-center justify-center gap-1.5 text-xs py-1.5"
        >
          {isMicOn ? <Mic size={14} /> : <MicOff size={14} />}
          <span>{isMicOn ? 'Mute' : 'Unmute'}</span>
        </Button>
        <Button
          variant={isCamOn ? 'secondary' : 'danger'}
          size="sm"
          onClick={onToggleCam}
          aria-label={isCamOn ? 'Turn Off Camera' : 'Turn On Camera'}
          className="flex-1 flex items-center justify-center gap-1.5 text-xs py-1.5"
        >
          {isCamOn ? <Video size={14} /> : <VideoOff size={14} />}
          <span>{isCamOn ? 'Cam' : 'Off'}</span>
        </Button>
      </div>
    </div>
  )
}
