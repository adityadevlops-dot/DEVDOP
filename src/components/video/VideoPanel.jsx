/* ── BACKEND INTEGRATION POINTS ──
   - Uses WebRTC streams from useWebRTC hook
   - Emits: media toggle states via socket
   - Listens: remote stream state changes
   - Current status: UI only, streams are mocked
*/

import { Mic, MicOff, Video, VideoOff } from 'lucide-react'
import { VideoTile } from './VideoTile'
import { Button } from '../ui/Button'

export const VideoPanel = ({
  localStream,
  remoteStream,
  onToggleMic,
  onToggleCam,
  isMicOn,
  isCamOn,
}) => {
  return (
    <div className="flex-shrink-0 border-b border-border p-3 space-y-3">
      {/* Local Video */}
      <div>
        <p className="text-xs font-semibold text-text-muted px-2 mb-2">You</p>
        <VideoTile stream={localStream} isMuted />
      </div>

      {/* Remote Video */}
      {remoteStream && (
        <div>
          <p className="text-xs font-semibold text-text-muted px-2 mb-2">Remote</p>
          <VideoTile stream={remoteStream} />
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-2 pt-2">
        <Button
          variant={isMicOn ? 'primary' : 'danger'}
          size="sm"
          onClick={onToggleMic}
          className="flex-1 flex items-center justify-center gap-2"
        >
          {isMicOn ? <Mic size={16} /> : <MicOff size={16} />}
        </Button>
        <Button
          variant={isCamOn ? 'primary' : 'danger'}
          size="sm"
          onClick={onToggleCam}
          className="flex-1 flex items-center justify-center gap-2"
        >
          {isCamOn ? <Video size={16} /> : <VideoOff size={16} />}
        </Button>
      </div>
    </div>
  )
}
