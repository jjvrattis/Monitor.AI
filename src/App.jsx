import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

// Stores
import useAuthStore from './stores/authStore'
import useThemeStore from './stores/themeStore'

// Components
import LoginPage from './components/auth/LoginPage'
import Sidebar from './components/layout/Sidebar'
import Dashboard from './components/dashboard/Dashboard'
import AnalysisFlow from './components/analysis/AnalysisFlow'
import AudioAnalysis from './components/analysis/AudioAnalysis'
import CrudPage from './components/crud/CrudPage'
import CallReport from './components/reports/CallReport'
import UserManagement from './components/users/UserManagement'
import LoadingRocket from './components/ui/LoadingRocket'

// Layout wrapper para páginas autenticadas
const AuthenticatedLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex-shrink-0">
        <Sidebar />
      </div>
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}

// Componente de rota protegida
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuthStore()
  
  if (isLoading) {
    return <LoadingRocket message="Verificando autenticação..." />
  }
  
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }
  
  if (requireAdmin && !isAdmin()) {
    return (
      <AuthenticatedLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Acesso Negado
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Você não tem permissão para acessar esta página.
            </p>
          </div>
        </div>
      </AuthenticatedLayout>
    )
  }
  
  return <AuthenticatedLayout>{children}</AuthenticatedLayout>
}

function App() {
  const { initializeAuth, isLoading } = useAuthStore()
  const { initializeTheme } = useThemeStore()

  useEffect(() => {
    // Inicializar tema e autenticação
    initializeTheme()
    initializeAuth()
  }, [initializeTheme, initializeAuth])

  if (isLoading) {
    return <LoadingRocket message="Inicializando aplicação..." />
  }

  return (
    <Router>
      <div className="min-h-screen transition-colors duration-200">
        <AnimatePresence mode="wait">
          <Routes>
            {/* Rota de login */}
            <Route 
              path="/login" 
              element={
                <motion.div
                  key="login"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <LoginPage />
                </motion.div>
              } 
            />
            
            {/* Rotas protegidas */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <motion.div
                    key="dashboard"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Dashboard />
                  </motion.div>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/analysis" 
              element={
                <ProtectedRoute>
                  <motion.div
                    key="analysis"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <AnalysisFlow />
                  </motion.div>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/audio-analysis" 
              element={
                <ProtectedRoute>
                  <motion.div
                    key="audio-analysis"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <AudioAnalysis />
                  </motion.div>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/crud" 
              element={
                <ProtectedRoute>
                  <motion.div
                    key="crud"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CrudPage />
                  </motion.div>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/call/:id" 
              element={
                <ProtectedRoute>
                  <motion.div
                    key="call-report"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CallReport />
                  </motion.div>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/users" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <motion.div
                    key="users"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <UserManagement />
                  </motion.div>
                </ProtectedRoute>
              } 
            />
            
            {/* Rota de configurações (futura implementação) */}
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <motion.div
                    key="settings"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Configurações
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Esta página será implementada em breve.
                    </p>
                  </motion.div>
                </ProtectedRoute>
              } 
            />
            
            {/* Rota de relatórios (futura implementação) */}
            <Route 
              path="/reports" 
              element={
                <ProtectedRoute>
                  <motion.div
                    key="reports"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Relatórios
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Relatórios avançados serão implementados em breve.
                    </p>
                  </motion.div>
                </ProtectedRoute>
              } 
            />
            
            {/* Redirect para dashboard se autenticado, senão para login */}
            <Route 
              path="*" 
              element={<Navigate to="/" replace />} 
            />
          </Routes>
        </AnimatePresence>
        
        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'var(--toast-bg)',
              color: 'var(--toast-color)',
              border: '1px solid var(--toast-border)',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#FFFFFF',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#FFFFFF',
              },
            },
          }}
        />
      </div>
    </Router>
  )
}

export default App