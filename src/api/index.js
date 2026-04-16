import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      // Clear Zustand store by reloading to /login
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

/**
 * Login user
 */
export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { username: email, password })
    const data = response.data.data || response.data
    return data
  } catch (error) {
    // Return error with proper message
    const errorData = error.response?.data || error
    throw {
      message: errorData?.message || errorData?.data?.message || 'Login failed',
      data: errorData,
    }
  }
}

/**
 * Register new user
 */
export const register = async (username, email, password) => {
  try {
    const response = await api.post('/auth/register', { username, email, password })
    const data = response.data.data || response.data
    return data
  } catch (error) {
    const errorData = error.response?.data || error
    throw {
      message: errorData?.message || errorData?.data?.message || 'Registration failed',
      data: errorData,
    }
  }
}

/**
 * Get current user info
 */
export const getMe = async () => {
  try {
    const response = await api.get('/auth/me')
    return response.data.data.user
  } catch (error) {
    throw error.response?.data || { message: 'Failed to get user info' }
  }
}

/**
 * Create a new room
 */
export const createRoom = async () => {
  try {
    const response = await api.post('/rooms', {
      name: 'Code Room',
      description: 'Pair Programming Session'
    })
    return response.data.data.room
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create room' }
  }
}

/**
 * Get room info by code
 */
export const getRoom = async (roomCode) => {
  try {
    console.log('[API] fetching room:', roomCode)
    const response = await api.get(`/rooms/${roomCode}`)
    console.log('[API] full response:', response)
    console.log('[API] response.data:', response.data)
    console.log('[API] response.data.data:', response.data.data)
    
    // Handle both old and new response formats
    const data = response.data.data
    const result = data.room || data
    
    console.log('[API] extracted result:', result)
    console.log('[API] result._id:', result?._id)
    console.log('[API] result.roomCode:', result?.roomCode)
    
    if (!result?._id) {
      console.error('[API] ERROR: result has no _id!')
      throw new Error('Room has no ID')
    }
    
    return result
  } catch (error) {
    console.error('[API] getRoom error:', error)
    console.error('[API] error response:', error.response?.data)
    throw error.response?.data || { message: error.message || 'Room not found' }
  }
}

/**
 * Get past sessions
 */
export const getSessions = async () => {
  try {
    const response = await api.get('/sessions')
    return response.data.data || []
  } catch (error) {
    throw error.response?.data || { message: 'Failed to get sessions' }
  }
}

/**
 * Run code with Judge0 API
 */
export const runCode = async (code, language, stdin = '') => {
  try {
    const response = await api.post('/sessions/run', {
      code,
      language,
      stdin,
    })
    return response.data.data
  } catch (error) {
    throw error.response?.data || { message: 'Code execution failed' }
  }
}

/**
 * Close room (for host)
 */
export const closeRoom = async (roomId) => {
  try {
    const response = await api.delete(`/rooms/${roomId}`)
    return response.data.data
  } catch (error) {
    throw error.response?.data || { message: 'Failed to close room' }
  }
}

export default api
