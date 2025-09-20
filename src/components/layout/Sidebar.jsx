import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  Home, 
  BarChart3, 
  FileText, 
  Users, 
  Settings, 
  LogOut, 
  ChevronLeft,
  ChevronRight,
  User,
  Shield,
  Activity,
  Mic
} from 'lucide-react'
import useAuthStore from '../../stores/authStore'
import ThemeToggle from '../ui/ThemeToggle'

const Sidebar = () => {
  const { user, logout, isAdmin } = useAuthStore()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/' },
    { id: 'audio-analysis', label: 'Monitoria Manual', icon: Mic, path: '/audio-analysis' },
    { id: 'crud', label: 'Gerenciamento', icon: Users, path: '/crud' },
    { id: 'settings', label: 'Configurações', icon: Settings, path: '/settings' },
  ]

  const handleLogout = () => {
    logout()
  }

  const sidebarVariants = {
    open: {
      width: isCollapsed ? 80 : 280,
      transition: { duration: 0.3, ease: "easeInOut" }
    },
    closed: {
      width: 0,
      transition: { duration: 0.3, ease: "easeInOut" }
    }
  }

  return (
    <>
      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        animate="open"
        className="h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center space-y-2 w-full"
              >
                {/* Logo da empresa centralizado */}
                <div className="w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden">
                  <img 
                    src="/src/assets/logo cobtec.png" 
                    alt="Logo Cobtec" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-center">
                  <h1 className="text-sm font-bold text-gray-900 dark:text-white">monitor Cobtec</h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">v2.0</p>
                </div>
              </motion.div>
            )}
            
            <div className="flex items-center space-x-2">
              {!isCollapsed && <ThemeToggle />}
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors hidden lg:block"
              >
                {isCollapsed ? (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronLeft className="w-4 h-4 text-gray-500" />
                )}
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                  location.pathname === item.path
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 border-r-2 border-primary-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="font-medium"
                  >
                    {item.label}
                  </motion.span>
                )}
              </motion.button>
            ))}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} mb-3`}>
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-1 min-w-0"
                >
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {user?.name || 'Usuário'}
                  </p>
                  <div className="flex items-center space-x-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user?.role === 'admin' ? 'Administrador' : 'Analista'}
                    </p>
                    {user?.role === 'admin' && (
                      <Shield className="w-3 h-3 text-primary-400" />
                    )}
                  </div>
                </motion.div>
              )}
            </div>
            
            <motion.button
              onClick={handleLogout}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <LogOut className="w-4 h-4" />
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm font-medium"
                >
                  Sair
                </motion.span>
              )}
            </motion.button>
          </div>
        </div>
      </motion.aside>
    </>
  )
}

export default Sidebar