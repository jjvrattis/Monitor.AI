import React from 'react'
import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import useThemeStore from '../../stores/themeStore'

const ThemeToggle = ({ className = "" }) => {
  const { isDark, toggleTheme } = useThemeStore()

  return (
    <motion.button
      onClick={toggleTheme}
      className={`relative flex items-center justify-center w-12 h-6 bg-gray-300 dark:bg-gray-600 rounded-full p-1 transition-colors duration-300 ${className}`}
      whileTap={{ scale: 0.95 }}
    >
      {/* Background do toggle */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-400 to-primary-600"
        initial={false}
        animate={{
          opacity: isDark ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Círculo do toggle */}
      <motion.div
        className="relative z-10 flex items-center justify-center w-4 h-4 bg-white rounded-full shadow-md"
        initial={false}
        animate={{
          x: isDark ? 24 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
      >
        {/* Ícones */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={false}
          animate={{
            rotate: isDark ? 180 : 0,
            scale: isDark ? 0 : 1,
          }}
          transition={{ duration: 0.3 }}
        >
          <Sun className="w-3 h-3 text-yellow-500" />
        </motion.div>
        
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={false}
          animate={{
            rotate: isDark ? 0 : -180,
            scale: isDark ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          <Moon className="w-3 h-3 text-blue-400" />
        </motion.div>
      </motion.div>
      
      {/* Ícones de fundo */}
      <div className="absolute inset-0 flex items-center justify-between px-1">
        <motion.div
          animate={{
            opacity: isDark ? 0.3 : 0.7,
            scale: isDark ? 0.8 : 1,
          }}
          transition={{ duration: 0.3 }}
        >
          <Sun className="w-3 h-3 text-yellow-500" />
        </motion.div>
        
        <motion.div
          animate={{
            opacity: isDark ? 0.7 : 0.3,
            scale: isDark ? 1 : 0.8,
          }}
          transition={{ duration: 0.3 }}
        >
          <Moon className="w-3 h-3 text-blue-400" />
        </motion.div>
      </div>
    </motion.button>
  )
}

export default ThemeToggle