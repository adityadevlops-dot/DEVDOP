/* ── BACKEND INTEGRATION POINTS ──
   - Replace with real getUserMedia() and simple-peer WebRTC
   - Handle stream negotiation with socket events
   - Handle ice candidates and offers/answers
   - Current status: All streams mocked, no real peer connection
*/

import { useState, useEffect } from 'react'

/**
 * useWebRTC Hook
 * TODO: Integrate real WebRTC using simple-peer and getUserMedia
 * - Get local media stream from camera/microphone
 * - Create peer connection for video/audio
 * - Handle ICE candidates
 * - Emit and receive through socket.io
 */
export const useWebRTC = () => {
  const [localStream, setLocalStream] = useState(null)
  const [remoteStream, setRemoteStream] = useState(null)
  const [isMicOn, setIsMicOn] = useState(true)
  const [isCamOn, setIsCamOn] = useState(true)
  const [isCallActive, setIsCallActive] = useState(false)

  useEffect(() => {
    // Initialize getUserMedia to request camera/microphone permissions
    const initializeMedia = async () => {
      try {
        console.log('[WEBRTC] requesting camera and microphone permissions...')
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: true 
        })
        setLocalStream(stream)
        console.log('[WEBRTC] camera and microphone access granted')
      } catch (err) {
        console.error('[WEBRTC] Failed to get media:', err.name, err.message)
        if (err.name === 'NotAllowedError') {
          console.warn('[WEBRTC] Camera/microphone permission denied - user can still use the app')
        } else if (err.name === 'NotFoundError') {
          console.warn('[WEBRTC] No camera/microphone found on this device')
        }
        // Don't crash the app if camera/mic not available
      }
    }

    initializeMedia()

    // Cleanup: stop all tracks when component unmounts
    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const startCall = async () => {
    // TODO: Create peer connection, emit offer through socket
    setIsCallActive(true)
    console.log('[WEBRTC MOCK] call started')
  }

  const endCall = () => {
    // TODO: Close peer connection, cleanup streams
    setIsCallActive(false)
    setRemoteStream(null)
    console.log('[WEBRTC MOCK] call ended')
  }

  const toggleMic = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !isMicOn
      })
      console.log('[WEBRTC] microphone:', !isMicOn ? 'on' : 'off')
    } else {
      console.warn('[WEBRTC] no local stream available for mic toggle')
    }
    setIsMicOn(!isMicOn)
  }

  const toggleCam = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !isCamOn
      })
      console.log('[WEBRTC] camera:', !isCamOn ? 'on' : 'off')
    } else {
      console.warn('[WEBRTC] no local stream available for camera toggle')
    }
    setIsCamOn(!isCamOn)
  }

  return {
    localStream,
    remoteStream,
    isMicOn,
    isCamOn,
    isCallActive,
    startCall,
    endCall,
    toggleMic,
    toggleCam,
  }
}
