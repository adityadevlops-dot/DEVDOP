/* ── BACKEND INTEGRATION POINTS ──
   - Emit: socket.emit('chat:message', { message })
   - Listen: socket.on('chat:receive', (message) => { ... })
   - Current status: UI with mock messages, no socket integration
*/

import { useEffect, useRef, useState } from 'react'
import { Send } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useRoomStore } from '../../store/roomStore'
import { useSocket } from '../../hooks/useSocket'
import { ChatMessage } from './ChatMessage'
import { Input } from '../ui/Input'
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
    if (!socket || !roomId) {
      console.log('[CHAT] socket or roomId not ready:', { socket: !!socket, roomId, connected })
      return
    }

    console.log('[CHAT] setting up socket listener for:', SOCKET_EVENTS.RECEIVE_CHAT)

    const handleReceiveMessage = (message) => {
      console.log('[CHAT] received message:', message)
      setMessages((prev) => [...prev, message])
    }

    on(SOCKET_EVENTS.RECEIVE_CHAT, handleReceiveMessage)

    return () => {
      off(SOCKET_EVENTS.RECEIVE_CHAT, handleReceiveMessage)
    }
  }, [socket, roomId, on, off, connected])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    console.log('[CHAT] handleSendMessage called:', { 
      input: input.trim(), 
      user: !!user, 
      roomId,
      ready: !!(input.trim() && user && roomId)
    })
    
    if (!input.trim() || !user || !roomId) {
      console.log('[CHAT] early return - missing requirements')
      return
    }

    const newMessage = {
      id: Date.now().toString(),
      userId: user._id || user.id,
      username: user.username,
      message: input,
      timestamp: new Date(),
    }

    setMessages([...messages, newMessage])
    setInput('')

    // Emit socket event with roomId
    console.log('[CHAT] emitting CHAT_MESSAGE with roomId:', roomId)
    emit(SOCKET_EVENTS.CHAT_MESSAGE, {
      roomId,
      message: input,
      username: user.username,
    })
    console.log('[CHAT] message sent:', newMessage)
  }

  const handleKeyPress = (e) => {
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
      <div className="flex-1 overflow-y-auto space-y-2 py-3">
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
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            isOwn={msg.userId === (user?._id || user?.id)}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-3 py-3 border-t border-border space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
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
