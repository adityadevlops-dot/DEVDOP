import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

export const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuthStore()
  const location = useLocation()
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    setCheckingAuth(false)
  }, [isLoggedIn])

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <p className="text-text-muted text-sm">Validating session...</p>
      </div>
    )
  }

  const token = localStorage.getItem('token')
  if (!token || !isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
