import { Copy, LogOut } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useRoomStore } from '../../store/roomStore'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { Tooltip } from '../ui/Tooltip'
import { LanguageSelect } from '../editor/LanguageSelect'
import { copyToClipboard } from '../../utils/helpers'
import toast from 'react-hot-toast'

export const RoomHeader = () => {
  const navigate = useNavigate()
  const { roomCode: urlRoomCode } = useParams()
  const { roomCode: storeRoomCode, language, setLanguage, isHost } = useRoomStore()

  // Use store roomCode, fallback to URL roomCode
  const roomCode = storeRoomCode || urlRoomCode

  console.log('[HEADER] roomCode:', roomCode, 'storeRoomCode:', storeRoomCode, 'urlRoomCode:', urlRoomCode, 'isHost:', isHost)

  const handleCopyCode = () => {
    if (!roomCode) {
      toast.error('Room code not available')
      return
    }
    copyToClipboard(roomCode)
    toast.success('Room code copied!')
  }

  const handleLeaveRoom = () => {
    if (window.confirm('Leave the room?')) {
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
        <LanguageSelect value={language} onChange={setLanguage} />
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
