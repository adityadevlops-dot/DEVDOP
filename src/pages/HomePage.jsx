import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Code, Video, MessageSquare, Zap } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { FullBackgroundImages } from '../components/ui/FullBackgroundImages'
import * as api from '../api/index'

export const HomePage = () => {
  const navigate = useNavigate()
  const { isLoggedIn } = useAuthStore()
  const [joinCode, setJoinCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleCreateRoom = async () => {
    if (!isLoggedIn) {
      navigate('/login')
      return
    }

    setIsLoading(true)
    try {
      const room = await api.createRoom()
      toast.success(`Room ${room.roomCode} created! Share the code.`)
      navigate(`/room/${room.roomCode}`)
    } catch (error) {
      toast.error('Failed to create room')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleJoinRoom = async (e) => {
    e.preventDefault()

    if (!isLoggedIn) {
      navigate('/login')
      return
    }

    if (!joinCode.trim()) {
      toast.error('Please enter a room code')
      return
    }

    if (joinCode.length !== 6) {
      toast.error('Room code must be 6 characters')
      return
    }

    setIsLoading(true)
    try {
      // Validate room exists
      await api.getRoom(joinCode.toUpperCase())
      navigate(`/room/${joinCode.toUpperCase()}`)
      toast.success('Joined room!')
    } catch (error) {
      toast.error('Room not found')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-primary overflow-hidden">
      {/* Gradient background elements */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-accent-red/5 rounded-full blur-3xl -z-10" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-accent-red/5 rounded-full blur-3xl -z-10" />

      {/* Hero Section */}
      <section className="py-24 px-6 relative min-h-screen flex items-center">
        {/* Full Background Images Component */}
        <FullBackgroundImages />

        <div className="max-w-5xl mx-auto text-center space-y-12 relative z-10 w-full">
          {/* Heading */}
          <div className="space-y-6">
            <h1 className="text-6xl md:text-7xl font-display font-bold text-text-primary leading-tight uppercase">
              CODE TOGETHER, IN <span className="text-accent-red">REAL TIME</span>
            </h1>
            <p className="text-xl text-text-muted max-w-3xl mx-auto font-light uppercase tracking-wide">
              SHARE A CODE ROOM, COLLABORATE WITH YOUR TEAM, AND BUILD AMAZING THINGS TOGETHER. 
              PROFESSIONAL PAIR PROGRAMMING, SIMPLIFIED.
            </p>
          </div>

          {/* CTA Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto pt-8">
            {/* Create Room */}
            <div className="group relative bg-gradient-to-br from-surface via-elevated to-elevated/50 border border-accent-red/20 rounded-2xl p-1 overflow-hidden min-h-[380px] cursor-pointer hover:border-accent-red/40 transition-all duration-300">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-accent-red/0 via-accent-red/5 to-accent-red/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute -inset-1 bg-gradient-to-r from-accent-red/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300" />
              
              <div className="relative bg-elevated/80 backdrop-blur-xl rounded-xl p-8 h-full flex flex-col gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-accent-red/20 to-accent-red/5 rounded-xl flex items-center justify-center border border-accent-red/30 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-accent-red/30 transition-all duration-300">
                  <Code size={32} className="text-accent-red group-hover:text-accent-red transition-colors" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-text-primary mb-2 uppercase">CREATE ROOM</h3>
                  <p className="text-sm text-text-muted leading-relaxed uppercase">START A NEW CODING SESSION AND INVITE YOUR TEAMMATES TO COLLABORATE IN REAL-TIME</p>
                </div>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleCreateRoom}
                  isLoading={isLoading}
                  className="w-full group-hover:shadow-lg group-hover:shadow-accent-red/20 transition-all"
                >
                  CREATE NEW ROOM
                </Button>
              </div>
            </div>

            {/* Join Room */}
            <div className="group relative bg-gradient-to-br from-surface via-elevated to-elevated/50 border border-accent-red/20 rounded-2xl p-1 overflow-hidden min-h-[380px] cursor-pointer hover:border-accent-red/40 transition-all duration-300">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-accent-red/0 via-accent-red/5 to-accent-red/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute -inset-1 bg-gradient-to-r from-accent-red/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300" />
              
              <div className="relative bg-elevated/80 backdrop-blur-xl rounded-xl p-8 h-full flex flex-col gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-accent-red/20 to-accent-red/5 rounded-xl flex items-center justify-center border border-accent-red/30 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-accent-red/30 transition-all duration-300">
                  <MessageSquare size={32} className="text-accent-red group-hover:text-accent-red transition-colors" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-text-primary mb-2 uppercase">JOIN ROOM</h3>
                  <p className="text-sm text-text-muted leading-relaxed uppercase">ENTER A ROOM CODE TO JOIN AN EXISTING CODING SESSION AND JUMP INTO COLLABORATION</p>
                </div>
                <form onSubmit={handleJoinRoom} className="w-full space-y-4">
                  <Input
                    placeholder="ROOM CODE (E.G., XK7P2Q)"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    maxLength={6}
                    disabled={isLoading}
                    className="text-center text-lg font-semibold"
                  />
                  <Button
                    variant="primary"
                    size="lg"
                    type="submit"
                    isLoading={isLoading}
                    className="w-full group-hover:shadow-lg group-hover:shadow-accent-red/20 transition-all"
                  >
                    JOIN ROOM
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-surface/50 to-primary border-t border-border/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text-primary mb-4 uppercase">
              POWERFUL FEATURES FOR MODERN TEAMS
            </h2>
            <p className="text-text-muted max-w-2xl mx-auto uppercase">
              EVERYTHING YOU NEED FOR SEAMLESS REMOTE PAIR PROGRAMMING
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {/* Feature 1: Editor */}
            <div className="bg-elevated/50 border border-border/30 rounded-xl p-6 space-y-4 hover:border-accent-red/30 hover:shadow-lg hover:shadow-accent-red/5 transition-all duration-300 backdrop-blur-sm">
              <div className="w-12 h-12 bg-accent-red/10 rounded-lg flex items-center justify-center border border-accent-red/20">
                <Code size={24} className="text-accent-red" />
              </div>
              <h3 className="text-lg font-bold text-text-primary uppercase">MONACO EDITOR</h3>
              <p className="text-sm text-text-muted leading-relaxed uppercase">PROFESSIONAL SYNTAX HIGHLIGHTING FOR 10+ LANGUAGES WITH REAL-TIME COLLABORATION</p>
            </div>

            {/* Feature 2: Video */}
            <div className="bg-elevated/50 border border-border/30 rounded-xl p-6 space-y-4 hover:border-accent-teal/30 hover:shadow-lg hover:shadow-teal-500/5 transition-all duration-300 backdrop-blur-sm">
              <div className="w-12 h-12 bg-accent-teal/10 rounded-lg flex items-center justify-center border border-accent-teal/20">
                <Video size={24} className="text-accent-teal" />
              </div>
              <h3 className="text-lg font-bold text-text-primary uppercase">VIDEO CALLS</h3>
              <p className="text-sm text-text-muted leading-relaxed uppercase">INTEGRATED WEBRTC FOR PEER-TO-PEER VIDEO AND AUDIO CALLS</p>
            </div>

            {/* Feature 3: Chat */}
            <div className="bg-elevated/50 border border-border/30 rounded-xl p-6 space-y-4 hover:border-accent-gold/30 hover:shadow-lg hover:shadow-yellow-500/5 transition-all duration-300 backdrop-blur-sm">
              <div className="w-12 h-12 bg-accent-gold/10 rounded-lg flex items-center justify-center border border-accent-gold/20">
                <MessageSquare size={24} className="text-accent-gold" />
              </div>
              <h3 className="text-lg font-bold text-text-primary uppercase">LIVE CHAT</h3>
              <p className="text-sm text-text-muted leading-relaxed uppercase">REAL-TIME MESSAGING TO DISCUSS IDEAS AND SOLUTIONS INSTANTLY</p>
            </div>

            {/* Feature 4: Run Code */}
            <div className="bg-elevated/50 border border-border/30 rounded-xl p-6 space-y-4 hover:border-accent-green/30 hover:shadow-lg hover:shadow-green-500/5 transition-all duration-300 backdrop-blur-sm">
              <div className="w-12 h-12 bg-accent-green/10 rounded-lg flex items-center justify-center border border-accent-green/20">
                <Zap size={24} className="text-accent-green" />
              </div>
              <h3 className="text-lg font-bold text-text-primary uppercase">CODE EXECUTION</h3>
              <p className="text-sm text-text-muted leading-relaxed uppercase">EXECUTE CODE INSTANTLY AND SEE RESULTS TOGETHER IN REAL TIME</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center space-y-8 bg-elevated/50 border border-border/30 rounded-2xl p-12 backdrop-blur-sm">
          <div>
            <h2 className="text-3xl font-bold text-text-primary mb-2 uppercase">
              READY TO COLLABORATE?
            </h2>
            <p className="text-text-muted uppercase">
              GET STARTED WITH DEVDOP IN SECONDS. NO SETUP REQUIRED.
            </p>
          </div>
          <div className="flex gap-4 justify-center flex-wrap">
            {isLoggedIn ? (
              <>
                <Button variant="primary" size="lg" onClick={handleCreateRoom}>
                  CREATE ROOM
                </Button>
                <Button variant="secondary" size="lg" onClick={() => navigate('/dashboard')}>
                  GO TO DASHBOARD
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/register')}
                >
                  GET STARTED
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate('/login')}
                >
                  SIGN IN
                </Button>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
