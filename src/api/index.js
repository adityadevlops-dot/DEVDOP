import axios from 'axios'
import { getToken, clearToken } from '../utils/token'

let rawApiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').trim()
if (import.meta.env.DEV && !rawApiUrl.replace(/\/+$/, '').endsWith('/api')) {
  console.warn('[CONFIG WARNING] VITE_API_URL does not end with "/api". API requests may return 404!')
}
const API_BASE_URL = rawApiUrl.replace(/\/+$/, '')

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearToken()
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { username: email, password })
    return response.data.data || response.data
  } catch (error) {
    const errorData = error.response?.data || error
    throw {
      message: errorData?.message || errorData?.data?.message || 'Login failed',
      data: errorData,
    }
  }
}

export const register = async (username, email, password) => {
  try {
    const response = await api.post('/auth/register', { username, email, password })
    return response.data.data || response.data
  } catch (error) {
    const errorData = error.response?.data || error
    throw {
      message: errorData?.message || errorData?.data?.message || 'Registration failed',
      data: errorData,
    }
  }
}

export const getMe = async () => {
  try {
    const response = await api.get('/auth/me')
    return response.data.data.user
  } catch (error) {
    throw error.response?.data || { message: 'Failed to get user info' }
  }
}

export const createRoom = async () => {
  try {
    const response = await api.post('/rooms', {
      name: 'Code Room',
      description: 'Pair Programming Session',
    })
    return response.data.data.room
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create room' }
  }
}

export const getRoom = async (roomCode) => {
  try {
    const response = await api.get(`/rooms/${roomCode}`)
    const data = response.data?.data || response.data
    const result = data.room || data

    if (!result?._id) {
      throw new Error('Room has no ID')
    }

    return result
  } catch (error) {
    throw error.response?.data || { message: error.message || 'Room not found' }
  }
}

export const getSessions = async () => {
  try {
    const response = await api.get('/sessions')
    return response.data.data || []
  } catch (error) {
    throw error.response?.data || { message: 'Failed to get sessions' }
  }
}

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

export const closeRoom = async (roomId) => {
  try {
    const response = await api.delete(`/rooms/${roomId}`)
    return response.data.data
  } catch (error) {
    throw error.response?.data || { message: 'Failed to close room' }
  }
}

export default api
