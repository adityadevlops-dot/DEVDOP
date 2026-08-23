import { GoogleLogin } from '@react-oauth/google'
import toast from 'react-hot-toast'
import * as api from '../../api/index'
import { useAuthStore } from '../../store/authStore'
import { useNavigate } from 'react-router-dom'

export const GoogleSignInButton = ({ onSuccessRedirect = '/dashboard' }) => {
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
  const isConfigured = googleClientId && !googleClientId.includes('placeholder') && !googleClientId.includes('your_google_client_id')

  const handleSuccess = async (credentialResponse) => {
    try {
      const { user, token } = await api.googleLogin(credentialResponse.credential)
      localStorage.setItem('token', token)
      login(user, token)
      toast.success(`Welcome ${user.username}!`)
      navigate(onSuccessRedirect)
    } catch (error) {
      console.error('[GOOGLE AUTH ERROR]:', error)
      toast.error(error.message || 'Google authentication failed')
    }
  }

  const handleError = () => {
    if (!isConfigured) {
      toast.error('Please set VITE_GOOGLE_CLIENT_ID in .env file with a valid Google OAuth Client ID.')
    } else {
      toast.error('Google Sign-In was cancelled or failed')
    }
  }

  return (
    <div className="w-full flex justify-center my-3">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        theme="filled_black"
        shape="rectangular"
        size="large"
        width="100%"
        text="continue_with"
      />
    </div>
  )
}
