import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: true,

      // Actions
      login: async (credentials) => {
        try {
          set({ isLoading: true })
          
          // Simular chamada de API
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // Mock de resposta da API
          const mockUser = {
            id: 1,
            name: 'João Victor',
            email: credentials.username,
            role: credentials.username === 'admin' ? 'admin' : 'analyst',
            permissions: credentials.username === 'admin' 
              ? ['read', 'write', 'delete', 'admin'] 
              : ['read', 'write']
          }
          
          const mockToken = 'mock-jwt-token-' + Date.now()
          
          set({ 
            user: mockUser, 
            token: mockToken, 
            isLoading: false 
          })
          
          return { success: true, user: mockUser }
        } catch (error) {
          set({ isLoading: false })
          return { success: false, error: error.message }
        }
      },

      logout: () => {
        set({ user: null, token: null, isLoading: false })
      },

      updateUser: (userData) => {
        set(state => ({
          user: { ...state.user, ...userData }
        }))
      },

      initializeAuth: () => {
        // Verificar se há dados persistidos
        const state = get()
        if (state.token && state.user) {
          set({ isLoading: false })
        } else {
          set({ isLoading: false })
        }
      },

      // Getters
      isAuthenticated: () => {
        const state = get()
        return !!(state.token && state.user)
      },

      isAdmin: () => {
        const state = get()
        return state.user?.role === 'admin'
      },

      hasPermission: (permission) => {
        const state = get()
        return state.user?.permissions?.includes(permission) || false
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

export default useAuthStore