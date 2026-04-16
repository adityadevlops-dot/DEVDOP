import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Eye } from 'lucide-react'
import toast from 'react-hot-toast'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import * as api from '../api/index'
import { formatDate } from '../utils/helpers'
import { LANGUAGES } from '../utils/constants'

export const DashboardPage = () => {
  const navigate = useNavigate()
  const [sessions, setSessions] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const data = await api.getSessions()
        setSessions(data)
      } catch (error) {
        toast.error('Failed to load sessions')
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSessions()
  }, [])

  const handleCreateRoom = async () => {
    try {
      const room = await api.createRoom()
      toast.success(`Room ${room.roomCode} created!`)
      navigate(`/room/${room.roomCode}`)
    } catch (error) {
      toast.error('Failed to create room')
    }
  }

  const getLanguageBadge = (langId) => {
    const variantMap = {
      javascript: 'gold',
      typescript: 'purple',
      python: 'red',
      java: 'orange',
      cpp: 'green',
      csharp: 'red',
      go: 'teal',
      rust: 'orange',
    }
    const label = LANGUAGES.find((l) => l.id === langId)?.label || langId
    return (
      <Badge variant={variantMap[langId] || 'default'} size="sm">
        {label}
      </Badge>
    )
  }

  return (
    <div className="min-h-screen bg-primary">
      {/* Header */}
      <div className="bg-surface border-b border-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
            <p className="text-text-muted mt-2">Your past pair programming sessions</p>
          </div>
          <Button
            variant="primary"
            size="lg"
            onClick={handleCreateRoom}
            className="flex items-center gap-2"
          >
            <Plus size={20} />
            Create New Room
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-text-muted">Loading sessions...</p>
            </div>
          ) : Array.isArray(sessions) && sessions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-text-muted mb-4">No sessions yet. Create your first room!</p>
              <Button
                variant="primary"
                onClick={handleCreateRoom}
              >
                Create Room
              </Button>
            </div>
          ) : (
            <div className="grid gap-6">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="bg-elevated border border-border rounded-card p-6 hover:border-accent-blue transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      {/* Room Code */}
                      <div className="flex items-center gap-3">
                    <code className="text-lg font-mono font-bold text-accent-red">
                          {session.roomCode}
                        </code>
                        {getLanguageBadge(session.language)}
                      </div>

                      {/* Date & Duration */}
                      <p className="text-sm text-text-muted">
                        {formatDate(session.date)} • {session.duration}
                      </p>

                      {/* Participants */}
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-text-muted">Participants:</span>
                        <div className="flex gap-1">
                          {session.participants.map((p, idx) => (
                            <Badge
                              key={idx}
                              variant="default"
                              size="xs"
                            >
                              {p}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action */}
                    <Button
                      variant="secondary"
                      size="md"
                      className="flex items-center gap-2 ml-4"
                      onClick={() => {
                        toast.info('Code view not yet implemented')
                      }}
                    >
                      <Eye size={16} />
                      View Code
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
