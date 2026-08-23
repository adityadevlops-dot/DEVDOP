import { Copy, LogOut } from 'lucide-react'
import { useNavigate, useParams } from 'react'
import { useRoomStore } from '../../store/roomStore'
import { useSocket } from '../../hooks/useSocket'
import { useWebRTC } from '../../hooks/useWebRTC'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { Tooltip } from '../ui/Tooltip'
import { LanguageSelect } from '../editor/LanguageSelect'
import { copyToClipboard } from '../../utils/helpers'
import { SOCKET_EVENTS } from '../../utils/constants'
import toast from 'react-hot-toast'

export const RoomHeader = () => {
  const navigate = useNavigate()
  const { roomCode: urlRoomCode } = useParams()
  const { roomCode: storeRoomCode, roomId, language, setLanguage, isHost, reset } = useRoomStore()
  const { emit } = useSocket()
  const { stopMedia } = useWebRTC()

  const roomCode = storeRoomCode || urlRoomCode

  const handleCopyCode = () => {
    if (!roomCode) {
      toast.error('Room code not available')
      return
    }
    copyToClipboard(roomCode)
    toast.success('Room code copied!')
  }

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage)
    if (roomId) {
      emit(SOCKET_EVENTS.LANGUAGE_CHANGE, {
        roomId,
        language: newLanguage,
      })
    }
  }

  const handleLeaveRoom = () => {
    if (window.confirm('Leave the room?')) {
      if (roomId) {
        emit(SOCKET_EVENTS.LEAVE_ROOM, { roomId })
      }
      stopMedia()
      reset()
      navigate('/')
      toast.success('Left the room')
    }
  }

  return (
    <div className="px-6 py-4 bg-surface border-b border-border flex items-center justify-between gap-4">
      {/* Left: Room Code */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-elevated border border-accent-red rounded-button">
          <code className="text-sm font-mono font-semibold text-accent-red">
            {roomCode || 'Loading...'}
          </code>
          <Tooltip content="Copy room code">
            <button
              onClick={handleCopyCode}
              disabled={!roomCode}
              className="text-text-muted hover:text-accent-red transition-colors p-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Copy size={16} />
            </button>
          </Tooltip>
        </div>
        {isHost && (
          <Badge variant="red" size="xs">
            Host
          </Badge>
        )}
        {!isHost && (
          <span className="text-xs text-text-muted">Guest</span>
        )}
      </div>

      {/* Center: Language Select */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-text-muted">Language:</label>
        <LanguageSelect value={language} onChange={handleLanguageChange} />
      </div>

      {/* Right: Leave Button */}
      <div className="flex items-center gap-3">
        <Button
          variant="danger"
          size="md"
          onClick={handleLeaveRoom}
          className="flex items-center gap-2"
        >
          <LogOut size={18} />
          Leave
        </Button>
      </div>
    </div>
  )
}
