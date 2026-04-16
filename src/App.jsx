import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store/authStore'
import { Navbar } from './components/layout/Navbar'
import { ProtectedRoute } from './components/layout/ProtectedRoute'

import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { DashboardPage } from './pages/DashboardPage'
import { RoomPage } from './pages/RoomPage'
import * as api from './api/index'

function App() {
  const { login, logout } = useAuthStore()

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token')
      
      if (token) {
        try {
          // Verify token is still valid
          const user = await api.getMe()
          // Restore auth state from verified user
          login(user, token)
          console.log('[AUTH] User restored from token:', user.username)
        } catch (error) {
          console.error('[AUTH] Token verification failed:', error.message)
          // Clear invalid token
          localStorage.removeItem('token')
          logout()
        }
      }
    }

    initializeAuth()
  }, [login, logout])

  return (
    <Router>
      <div className="bg-primary min-h-screen text-text-primary font-sans">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/room/:roomCode"
            element={
              <ProtectedRoute>
                <RoomPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a1a1a',
              color: '#ffffff',
              border: '1px solid rgba(255, 44, 44, 0.3)',
              boxShadow: '0 10px 30px rgba(255, 44, 44, 0.15)',
              borderRadius: '8px',
              fontWeight: '500',
            },
            success: {
              iconTheme: {
                primary: '#00d652',
                secondary: '#1a1a1a',
              },
            },
            error: {
              iconTheme: {
                primary: '#ff2c2c',
                secondary: '#1a1a1a',
              },
            },
          }}
        />
      </div>
    </Router>
  )
}

export default App
