import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'
import { RoomLayout } from '../components/room/RoomLayout'

export const RoomPage = () => {
  const { roomCode } = useParams()
  const navigate = useNavigate()
  const { isLoggedIn } = useAuthStore()

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login')
      return
    }

    if (!roomCode) {
      toast.error('Invalid room code')
      navigate('/')
    }
  }, [roomCode, isLoggedIn, navigate])

  if (!roomCode) {
    return null
  }

  return <RoomLayout />
}
