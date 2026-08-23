import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { destroySocket } from '../socket/socket'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoggedIn: false,

      login: (user, token) => {
        if (token) {
          localStorage.setItem('token', token)
        }
        set({
          user,
          token,
          isLoggedIn: true,
        })
      },

      logout: () => {
        localStorage.removeItem('token')
        destroySocket()
        set({
          user: null,
          token: null,
          isLoggedIn: false,
        })
      },

      setUser: (user) =>
        set({
          user,
        }),
    }),
    {
      name: 'auth-storage',
    }
  )
)
