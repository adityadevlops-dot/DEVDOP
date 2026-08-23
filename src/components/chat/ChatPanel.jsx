import { useEffect, useRef, useState } from 'react'
import { Send } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useRoomStore } from '../../store/roomStore'
import { useSocket } from '../../hooks/useSocket'
import { ChatMessage } from './ChatMessage'
import { Button } from '../ui/Button'
import { SOCKET_EVENTS } from '../../utils/constants'

export const ChatPanel = () => {
  const { user } = useAuthStore()
  const { roomId } = useRoomStore()
  const { socket, on, off, emit, connected } = useSocket()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (!socket || !roomId) return

    const handleReceiveMessage = (messagePayload) => {
      setMessages((prev) => {
        const messageId = messagePayload.id || messagePayload.clientMsgId
        const exists = prev.some((m) => (m.id && m.id === messageId) || (m.clientMsgId && m.clientMsgId === messagePayload.clientMsgId))
        if (exists) return prev
        return [...prev, messagePayload]
      })
    }

    on(SOCKET_EVENTS.RECEIVE_CHAT, handleReceiveMessage)

    return () => {
      off(SOCKET_EVENTS.RECEIVE_CHAT, handleReceiveMessage)
    }
  }, [socket, roomId, on, off])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    const text = input.trim()
    if (!text || !user || !roomId) return

    const clientMsgId = `${Date.now()}_${Math.random().toString(36).substr(2, 6)}`

    // Do NOT optimistic append to avoid duplicates; server broadcast is source of truth
    setInput('')

    emit(SOCKET_EVENTS.CHAT_MESSAGE, {
      roomId,
      message: text,
      clientMsgId,
      username: user.username,
    })
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="h-full bg-surface flex flex-col">
      {/* Header */}
      <div className="px-4 py-4 border-b border-border">
        <h3 className="text-sm font-semibold text-text-primary">Chat</h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-2 py-3 px-3">
        {!roomId && (
          <div className="px-4 py-2 text-xs text-text-muted bg-elevated/50 rounded">
            ⏳ Joining room...
          </div>
        )}
        {messages.length === 0 && roomId && (
          <div className="px-4 py-2 text-xs text-text-muted">
            No messages yet. Start chatting!
          </div>
        )}
        {messages.map((msg, idx) => {
          const key = msg.id || msg.clientMsgId || `msg_${idx}`
          const isOwn = String(msg.userId) === String(user?._id || user?.id)
          return (
            <ChatMessage
              key={key}
              message={msg}
              isOwn={isOwn}
            />
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-3 py-3 border-t border-border space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 bg-elevated border border-border rounded-button text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-blue transition-colors"
          />
          <Button
            variant="primary"
            size="sm"
            onClick={handleSendMessage}
            disabled={!input.trim()}
            className="px-3"
          >
            <Send size={16} />
          </Button>
        </div>
      </div>
    </div>
  )
}
