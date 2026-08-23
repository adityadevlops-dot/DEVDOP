import { Avatar } from '../ui/Avatar'
import { formatTime, getColorForUser } from '../../utils/helpers'

export const ChatMessage = ({ message, isOwn }) => {
  const timeStr = formatTime(message.timestamp) || 'Just now'
  const userColor = getColorForUser(message.username || 'User')

  return (
    <div className={`flex gap-2.5 px-2 py-1.5 ${isOwn ? 'flex-row-reverse' : ''}`}>
      <Avatar
        alt={message.username}
        size="sm"
        backgroundColor={userColor}
      />
      <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} flex-1 min-w-0`}>
        <div className="flex items-baseline gap-2">
          <span className="text-xs font-semibold text-text-primary">{message.username}</span>
          <span className="text-[10px] text-text-muted">{timeStr}</span>
        </div>
        <div
          className={`mt-1 px-3 py-1.5 rounded-2xl max-w-[85%] break-words text-xs font-normal shadow-sm ${
            isOwn
              ? 'bg-accent-red text-white rounded-tr-none'
              : 'bg-elevated text-text-primary border border-border/50 rounded-tl-none'
          }`}
        >
          {message.message}
        </div>
      </div>
    </div>
  )
}
