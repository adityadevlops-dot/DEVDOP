/* ── BACKEND INTEGRATION POINTS ──
   - Coordinates room state management
   - Emits: code changes, language changes, run code
   - Listens: participant updates, code changes, output
   - Current status: Layout structure, partial state wiring
*/

import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useRoomStore } from '../../store/roomStore'
import { useRoom } from '../../hooks/useRoom'
import { useEditor } from '../../hooks/useEditor'
import { useWebRTC } from '../../hooks/useWebRTC'
import { useSocket } from '../../hooks/useSocket'
import * as api from '../../api/index'

import { RoomHeader } from './RoomHeader'
import { CodeEditor } from '../editor/CodeEditor'
import { OutputPanel } from '../editor/OutputPanel'
import { ParticipantSidebar } from './ParticipantSidebar'
import { VideoPanel } from '../video/VideoPanel'
import { ChatPanel } from '../chat/ChatPanel'
import { CursorOverlay } from './CursorOverlay'

export const RoomLayout = () => {
  const { roomCode } = useParams()
  const navigate = useNavigate()

  const { code, language, output, isRunning, setOutput, setIsRunning } = useRoomStore()
  const { handleCodeChange, handleLanguageChange } = useEditor()
  const { localStream, remoteStream, toggleMic, toggleCam, isMicOn, isCamOn } = useWebRTC()
  const { connected } = useSocket()
  useRoom(roomCode)

  const [isConnecting, setIsConnecting] = useState(true)

  useEffect(() => {
    if (!connected && isConnecting) {
      setTimeout(() => {
        setIsConnecting(false)
        toast.success('Connected to room')
      }, 1000)
    }
  }, [connected, isConnecting])

  const handleRun = async () => {
    if (!code.trim()) {
      toast.error('Code is empty')
      return
    }

    setIsRunning(true)
    try {
      const result = await api.runCode(code, language)
      setOutput(result.output)
      toast.success('Code executed!')
    } catch (error) {
      setOutput('Error executing code:\n' + error.message)
      toast.error('Failed to run code')
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="h-screen w-full bg-primary flex">
      {/* Left Panel: Video + Participants (200px) */}
      <div className="w-52 border-r border-border flex flex-col">
        <VideoPanel
          localStream={localStream}
          remoteStream={remoteStream}
          onToggleMic={toggleMic}
          onToggleCam={toggleCam}
          isMicOn={isMicOn}
          isCamOn={isCamOn}
        />
        <ParticipantSidebar />
      </div>

      {/* Center Panel: Editor (flex) */}
      <div className="flex-1 flex flex-col">
        <RoomHeader />
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-hidden">
            <CodeEditor
              value={code}
              onChange={handleCodeChange}
              language={language}
            />
            <CursorOverlay />
          </div>
          <OutputPanel output={output} isLoading={isRunning} onRun={handleRun} />
        </div>
      </div>

      {/* Right Panel: Chat (220px) */}
      <div className="w-56 border-l border-border">
        <ChatPanel />
      </div>
    </div>
  )
}
