import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useThemeStore = create(
  persist(
    (set, get) => ({
      isDark: false,
      
      toggleTheme: () => {
        const newTheme = !get().isDark
        set({ isDark: newTheme })
        
        // Aplicar tema no documento
        if (newTheme) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      },
      
      setTheme: (isDark) => {
        set({ isDark })
        
        // Aplicar tema no documento
        if (isDark) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      },
      
      initializeTheme: () => {
        const { isDark } = get()
        
        // Verificar preferência do sistema se não houver configuração salva
        if (isDark === null) {
          const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
          set({ isDark: systemPrefersDark })
          
          if (systemPrefersDark) {
            document.documentElement.classList.add('dark')
          }
        } else {
          // Aplicar tema salvo
          if (isDark) {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }
        }
      }
    }),
    {
      name: 'theme-storage',
      partialize: (state) => ({ isDark: state.isDark }),
    }
  )
)

export default useThemeStore