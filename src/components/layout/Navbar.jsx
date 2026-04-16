import { Link, useNavigate } from 'react-router-dom'
import { LogOut, Home, LayoutDashboard } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { Button } from '../ui/Button'
import { Avatar } from '../ui/Avatar'
import { DevdopLogo } from '../ui/DevdopLogo'

export const Navbar = () => {
  const { user, isLoggedIn, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem('token')
    // Clear Zustand auth store (also clears localStorage due to persist middleware)
    logout()
    // Navigate to home
    navigate('/')
  }

  return (
    <nav className="sticky top-0 z-40 w-full bg-surface border-b border-border/50 backdrop-blur-sm">
      <div className="px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 hover:opacity-75 transition-opacity duration-300"
        >
          <div className="relative">
            <DevdopLogo size={40} />
            <div className="absolute inset-0 bg-accent-red blur-lg opacity-0 group-hover:opacity-20 transition-opacity" />
          </div>
          <span className="font-display font-bold text-xl tracking-wider bg-gradient-to-r from-accent-red to-accent-red/80 bg-clip-text text-transparent">
            DEVDOP
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-8">
          {isLoggedIn ? (
            <>
              <Link
                to="/"
                className="text-sm font-medium text-text-muted hover:text-accent-red transition-colors duration-300"
              >
                <Home size={18} className="inline mr-1.5" />
                Home
              </Link>
              <Link
                to="/dashboard"
                className="text-sm font-medium text-text-muted hover:text-accent-red transition-colors duration-300"
              >
                <LayoutDashboard size={18} className="inline mr-1.5" />
                Dashboard
              </Link>

              {/* User Menu */}
              <div className="flex items-center gap-3 pl-8 border-l border-border/30">
                <Avatar
                  src={user?.avatar}
                  alt={user?.username}
                  size="sm"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-text-primary">{user?.username}</span>
                  <span className="text-xs text-text-muted">{user?.email}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="ml-3 hover:text-accent-red"
                  title="Logout"
                >
                  <LogOut size={18} />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="text-text-muted hover:text-accent-red">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Sign up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
