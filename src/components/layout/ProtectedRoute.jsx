import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

export const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, logout } = useAuthStore()
  const location = useLocation()
  const [isValidating, setIsValidating] = useState(true)
  const [isValid, setIsValid] = useState(false)

  useEffect(() => {
    // Check if token exists and is valid
    const token = localStorage.getItem('token')
    
    if (!token || !isLoggedIn) {
      setIsValid(false)
    } else {
      setIsValid(true)
    }
    
    setIsValidating(false)
  }, [isLoggedIn])

  if (isValidating) {
    return <div className="min-h-screen bg-primary flex items-center justify-center">
      <p className="text-text-muted">Loading...</p>
    </div>
  }

  if (!isValid) {
    // Clear auth state if token is invalid
    if (isLoggedIn) {
      logout()
      localStorage.removeItem('token')
    }
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
