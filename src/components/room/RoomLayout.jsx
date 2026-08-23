import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
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
  const { code, language, output, isRunning, setOutput, setIsRunning } = useRoomStore()
  const { handleCodeChange } = useEditor()
  const { localStream, remoteStream, toggleMic, toggleCam, isMicOn, isCamOn } = useWebRTC()
  const { connected } = useSocket()
  
  useRoom(roomCode)

  const handleRun = async () => {
    if (!code || !code.trim()) {
      toast.error('Code editor is empty')
      return
    }

    setIsRunning(true)
    try {
      const result = await api.runCode(code, language)
      setOutput(result.output || result.error || 'Execution finished with no output')
      if (result.success) {
        toast.success('Execution completed!')
      } else {
        toast.error('Execution finished with errors')
      }
    } catch (error) {
      setOutput('Error executing code:\n' + (error.message || 'Server error'))
      toast.error(error.message || 'Failed to run code')
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="h-screen w-full bg-primary flex overflow-hidden">
      {/* Left Sidebar: Video + Participants */}
      <div className="w-52 border-r border-border flex flex-col flex-shrink-0">
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

      {/* Main Workspace: Header + Monaco + Output */}
      <div className="flex-1 flex flex-col min-w-0">
        <RoomHeader />
        <div className="flex-1 flex flex-col min-h-0 relative">
          <div className="flex-1 overflow-hidden relative">
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

      {/* Right Sidebar: Live Chat */}
      <div className="w-56 border-l border-border flex-shrink-0">
        <ChatPanel />
      </div>
    </div>
  )
}
