import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// User interface
export interface User {
  id: string
  email: string
  name: string
  role: 'customer' | 'staff' | 'manager' | 'admin' | 'super_admin'
  branchId?: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

// Auth state interface
interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  
  // Actions
  setUser: (user: User) => void
  setToken: (token: string) => void
  login: (user: User, token: string) => void
  logout: () => void
  clearError: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string) => void
}

// Auth store with persistence
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      setToken: (token) => {
        set({ token })
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', token)
        }
      },
      
      login: (user, token) => {
        set({ 
          user, 
          token, 
          isAuthenticated: true, 
          error: null 
        })
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', token)
        }
      },
      
      logout: () => {
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false, 
          error: null 
        })
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token')
        }
      },
      
      clearError: () => set({ error: null }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'leafyhealth-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)