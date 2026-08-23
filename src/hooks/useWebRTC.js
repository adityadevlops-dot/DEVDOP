import { useState, useEffect, useRef } from 'react'

export const useWebRTC = () => {
  const [localStream, setLocalStream] = useState(null)
  const [remoteStream, setRemoteStream] = useState(null)
  const [isMicOn, setIsMicOn] = useState(true)
  const [isCamOn, setIsCamOn] = useState(true)
  const [isCallActive, setIsCallActive] = useState(false)

  const streamRef = useRef(null)

  const stopMedia = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
      setLocalStream(null)
    }
  }

  useEffect(() => {
    return () => {
      stopMedia()
    }
  }, [])

  const startCall = async () => {
    try {
      stopMedia()
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      })
      streamRef.current = stream
      setLocalStream(stream)
      setIsCallActive(true)
    } catch (err) {
      console.warn('[WEBRTC] Media initialization error:', err.message)
    }
  }

  const endCall = () => {
    setIsCallActive(false)
    setRemoteStream(null)
    stopMedia()
  }

  const toggleMic = () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !isMicOn
      })
    }
    setIsMicOn(!isMicOn)
  }

  const toggleCam = () => {
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = !isCamOn
      })
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
    stopMedia,
  }
}
