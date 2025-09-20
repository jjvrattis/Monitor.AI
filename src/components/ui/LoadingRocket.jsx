import React from 'react'
import { motion } from 'framer-motion'

const LoadingRocket = ({ message = "Carregando..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
      <motion.div
        className="relative"
        animate={{
          y: [-10, -20, -10],
          rotate: [-2, 2, -2],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Foguete SVG */}
        <svg
          width="60"
          height="60"
          viewBox="0 0 100 100"
          className="text-primary-400"
          fill="currentColor"
        >
          {/* Corpo do foguete */}
          <ellipse cx="50" cy="45" rx="12" ry="25" fill="currentColor" />
          
          {/* Ponta do foguete */}
          <path d="M38 20 L50 5 L62 20 Z" fill="currentColor" />
          
          {/* Janela */}
          <circle cx="50" cy="35" r="4" fill="white" opacity="0.8" />
          
          {/* Aletas */}
          <path d="M38 60 L35 75 L42 65 Z" fill="currentColor" />
          <path d="M62 60 L65 75 L58 65 Z" fill="currentColor" />
          
          {/* Chamas */}
          <motion.g
            animate={{
              scaleY: [1, 1.3, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <path d="M45 70 L50 85 L55 70 Z" fill="#F59E0B" />
            <path d="M47 70 L50 80 L53 70 Z" fill="#EF4444" />
          </motion.g>
        </svg>
        
        {/* Partículas de fumaça */}
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-gray-400 rounded-full"
              style={{
                left: `${(i - 1) * 8}px`,
              }}
              animate={{
                y: [0, -20, -40],
                opacity: [1, 0.5, 0],
                scale: [0.5, 1, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      </motion.div>
      
      <motion.p
        className="text-gray-600 dark:text-gray-400 font-medium"
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {message}
      </motion.p>
      
      {/* Pontos de loading */}
      <div className="flex space-x-1">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-primary-400 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default LoadingRocket