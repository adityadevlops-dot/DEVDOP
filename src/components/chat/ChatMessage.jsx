import { Avatar } from '../ui/Avatar'
import { formatTime } from '../../utils/helpers'
import { getColorForUser } from '../../utils/helpers'

export const ChatMessage = ({ message, isOwn }) => {
  return (
    <div className={`flex gap-3 px-4 py-2 ${isOwn ? 'flex-row-reverse' : ''}`}>
      <Avatar
        alt={message.username}
        size="sm"
        backgroundColor={getColorForUser(message.username)}
      />
      <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} flex-1 min-w-0`}>
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-semibold text-text-primary">{message.username}</span>
          <span className="text-xs text-text-hint">{formatTime(message.timestamp)}</span>
        </div>
        <div
          className={`mt-1 px-3 py-1.5 rounded-button max-w-xs break-words text-sm ${
            isOwn
              ? 'bg-accent-blue text-primary'
              : 'bg-elevated text-text-primary border border-border'
          }`}
        >
          {message.message}
        </div>
      </div>
    </div>
  )
}
