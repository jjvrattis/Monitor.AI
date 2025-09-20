/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Paleta de cores personalizada
        primary: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7', // Verde suave de fundo
          400: '#34D399', // Verde principal
          500: '#10B981',
          600: '#059669', // Verde escuro (hover/active)
          700: '#047857', // Verde acento profundo
          800: '#065F46',
          900: '#064E3B',
        },
        accent: {
          400: '#A3E635', // Lime destaque
        },
        background: {
          light: '#F8FAFC',
          dark: '#020617',
        },
        text: {
          light: '#000000',
          dark: '#FFFFFF',
        },
        // Cores para diferentes níveis de risco
        risk: {
          low: '#10B981',
          medium: '#F59E0B',
          high: '#EF4444',
          critical: '#DC2626',
        },
        // Cores para sentimentos
        sentiment: {
          positive: '#10B981',
          neutral: '#6B7280',
          negative: '#EF4444',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
      },
      animation: {
        'rocket': 'rocket 2s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        rocket: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(5deg)' },
        }
      },
      boxShadow: {
        'glow': '0 0 20px rgba(52, 211, 153, 0.3)',
        'glow-lg': '0 0 30px rgba(52, 211, 153, 0.4)',
      }
    },
  },
  plugins: [],
}