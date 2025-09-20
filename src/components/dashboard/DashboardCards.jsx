import React from 'react'
import { motion } from 'framer-motion'
import { 
  Phone, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Users,
  BarChart3,
  Activity
} from 'lucide-react'

const DashboardCards = ({ data = {} }) => {
  const cards = [
    {
      id: 'total-calls',
      title: 'Chamadas Analisadas',
      value: data.totalCalls || 1247,
      change: '+12%',
      changeType: 'positive',
      icon: Phone,
      color: 'primary',
      description: 'Total este mês'
    },
    {
      id: 'conformity',
      title: 'Conformidade Média',
      value: `${data.conformityRate || 87}%`,
      change: '+3%',
      changeType: 'positive',
      icon: CheckCircle,
      color: 'green',
      description: 'Meta: 85%'
    },
    {
      id: 'alerts',
      title: 'Alertas Pendentes',
      value: data.pendingAlerts || 23,
      change: '-8%',
      changeType: 'negative',
      icon: AlertTriangle,
      color: 'yellow',
      description: 'Requer atenção'
    },
    {
      id: 'avg-time',
      title: 'Tempo Médio',
      value: `${data.avgTime || 4.2}min`,
      change: '-0.5min',
      changeType: 'positive',
      icon: Clock,
      color: 'blue',
      description: 'Por análise'
    },
    {
      id: 'active-operators',
      title: 'Operadores Ativos',
      value: data.activeOperators || 45,
      change: '+2',
      changeType: 'positive',
      icon: Users,
      color: 'purple',
      description: 'Online agora'
    },
    {
      id: 'efficiency',
      title: 'Eficiência IA',
      value: `${data.aiEfficiency || 94}%`,
      change: '+1%',
      changeType: 'positive',
      icon: Activity,
      color: 'indigo',
      description: 'Precisão do modelo'
    }
  ]

  const getColorClasses = (color) => {
    const colors = {
      primary: 'from-primary-400 to-primary-600 text-white',
      green: 'from-green-400 to-green-600 text-white',
      yellow: 'from-yellow-400 to-yellow-600 text-white',
      blue: 'from-blue-400 to-blue-600 text-white',
      purple: 'from-purple-400 to-purple-600 text-white',
      indigo: 'from-indigo-400 to-indigo-600 text-white',
    }
    return colors[color] || colors.primary
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
    >
      {cards.map((card) => (
        <motion.div
          key={card.id}
          variants={cardVariants}
          whileHover={{ 
            scale: 1.02,
            transition: { duration: 0.2 }
          }}
          className="card p-6 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getColorClasses(card.color)} flex items-center justify-center shadow-lg`}>
                  <card.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {card.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {card.description}
                  </p>
                </div>
              </div>
              
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {card.value}
                  </p>
                  <div className="flex items-center space-x-1">
                    <span className={`text-sm font-medium ${
                      card.changeType === 'positive' 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {card.change}
                    </span>
                    <TrendingUp className={`w-4 h-4 ${
                      card.changeType === 'positive' 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400 rotate-180'
                    }`} />
                  </div>
                </div>
                
                {/* Mini gráfico placeholder */}
                <div className="w-16 h-8 flex items-end space-x-1">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className={`w-2 bg-gradient-to-t ${getColorClasses(card.color)} rounded-sm opacity-60`}
                      style={{ height: `${Math.random() * 100 + 20}%` }}
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.random() * 100 + 20}%` }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}

export default DashboardCards