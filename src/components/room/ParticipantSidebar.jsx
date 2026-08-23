import { X } from 'lucide-react'
import { useRoomStore } from '../../store/roomStore'
import { useAuthStore } from '../../store/authStore'
import { useSocket } from '../../hooks/useSocket'
import { Avatar } from '../ui/Avatar'
import { Badge } from '../ui/Badge'
import { SOCKET_EVENTS } from '../../utils/constants'
import toast from 'react-hot-toast'

export const ParticipantSidebar = () => {
  const { participants = [], isHost, roomId } = useRoomStore()
  const { user } = useAuthStore()
  const { emit } = useSocket()

  const handleKickParticipant = (participantId) => {
    if (!isHost) return
    if (window.confirm('Are you sure you want to kick this participant?')) {
      emit(SOCKET_EVENTS.KICK_USER, {
        roomId,
        userId: participantId,
      })
      toast.success('Kick request sent')
    }
  }

  const currentUserId = String(user?._id || user?.id || '')

  return (
    <div className="h-full bg-surface border-r border-border flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 py-4 border-b border-border">
        <h3 className="text-sm font-semibold text-text-primary">
          Participants ({participants.length})
        </h3>
      </div>

      {/* Participants List */}
      <div className="flex-1 overflow-y-auto divide-y divide-border">
        {participants.map((participant) => {
          const isParticipantHost = participant.role === 'host'
          const isCurrentUser = String(participant.id) === currentUserId
          const canKick = isHost && !isParticipantHost && !isCurrentUser

          return (
            <div
              key={participant.id}
              className="px-4 py-3 hover:bg-elevated transition-colors group flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <div className="relative">
                  <Avatar
                    src={participant.avatar}
                    alt={participant.username}
                    size="sm"
                  />
                  {participant.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-accent-green rounded-full border border-surface" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-text-primary truncate">
                    {participant.username} {isCurrentUser && '(You)'}
                  </p>
                  {isParticipantHost && (
                    <Badge variant="default" size="xs">
                      Host
                    </Badge>
                  )}
                </div>
              </div>

              {/* Kick Button */}
              {canKick && (
                <button
                  onClick={() => handleKickParticipant(participant.id)}
                  className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-accent-red transition-all p-1"
                  title="Kick participant"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          )
        })}

        {participants.length === 0 && (
          <div className="px-4 py-8 text-center">
            <p className="text-sm text-text-muted">No participants yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
