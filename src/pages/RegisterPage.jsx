import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import * as api from '../api/index'
import { validateEmail, validatePassword } from '../utils/helpers'

export const RegisterPage = () => {
  const navigate = useNavigate()
  const { login } = useAuthStore()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const validate = () => {
    const newErrors = {}

    if (!username) {
      newErrors.username = 'Username is required'
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters'
    }

    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!password) {
      newErrors.password = 'Password is required'
    } else if (!validatePassword(password)) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) return

    setIsLoading(true)
    try {
      const { user, token } = await api.register(username, email, password)
      
      // Store token in localStorage
      localStorage.setItem('token', token)
      
      // Store user in Zustand (which persists to localStorage)
      login(user, token)
      
      toast.success('Account created successfully!')
      navigate('/dashboard')
    } catch (error) {
      console.error('[REGISTER] Error:', error)
      const errorMessage = error?.message || error?.data?.message || 'Registration failed. Please try again.'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-6 relative">
      {/* Gradient background */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-accent-red/5 rounded-full blur-3xl -z-10" />
      
      <div className="w-full max-w-md">
        <div className="bg-elevated/50 border border-border/50 rounded-2xl p-8 space-y-6 backdrop-blur-sm">
          {/* Header */}
          <div className="space-y-3 text-center">
            <h1 className="text-3xl font-bold text-text-primary">Create account</h1>
            <p className="text-text-muted font-light">Join DEVDOP and start pair programming</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Username"
              type="text"
              placeholder="your_username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={errors.username}
              disabled={isLoading}
            />

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              disabled={isLoading}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              disabled={isLoading}
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
              disabled={isLoading}
            />

            <Button
              variant="primary"
              size="lg"
              type="submit"
              isLoading={isLoading}
              className="w-full mt-6"
            >
              Create account
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/30" />
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-sm">
            <span className="text-text-muted">Already have an account? </span>
            <Link to="/login" className="text-accent-red hover:underline font-semibold transition-colors">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
