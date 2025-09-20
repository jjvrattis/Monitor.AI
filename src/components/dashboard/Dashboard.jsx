import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, Filter, Download, Calendar } from 'lucide-react'
import DashboardCards from './DashboardCards'
import LoadingRocket from '../ui/LoadingRocket'

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState({})
  const [selectedPeriod, setSelectedPeriod] = useState('7d')

  useEffect(() => {
    // Simular carregamento de dados
    const loadData = async () => {
      setIsLoading(true)
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setDashboardData({
        totalCalls: 1247,
        conformityRate: 87,
        pendingAlerts: 23,
        avgTime: 4.2,
        activeOperators: 45,
        aiEfficiency: 94
      })
      setIsLoading(false)
    }

    loadData()
  }, [selectedPeriod])

  const heatmapData = [
    { hour: '08:00', monday: 85, tuesday: 92, wednesday: 78, thursday: 88, friday: 95 },
    { hour: '09:00', monday: 92, tuesday: 88, wednesday: 85, thursday: 90, friday: 87 },
    { hour: '10:00', monday: 78, tuesday: 85, wednesday: 92, thursday: 85, friday: 90 },
    { hour: '11:00', monday: 88, tuesday: 90, wednesday: 87, thursday: 92, friday: 85 },
    { hour: '12:00', monday: 95, tuesday: 87, wednesday: 90, thursday: 87, friday: 92 },
    { hour: '13:00', monday: 87, tuesday: 92, wednesday: 85, thursday: 90, friday: 88 },
    { hour: '14:00', monday: 90, tuesday: 85, wednesday: 88, thursday: 95, friday: 87 },
    { hour: '15:00', monday: 85, tuesday: 88, wednesday: 92, thursday: 87, friday: 90 },
    { hour: '16:00', monday: 92, tuesday: 90, wednesday: 87, thursday: 85, friday: 95 },
    { hour: '17:00', monday: 88, tuesday: 87, wednesday: 90, thursday: 92, friday: 85 },
  ]

  const getHeatmapColor = (value) => {
    if (value >= 90) return 'bg-green-500'
    if (value >= 80) return 'bg-yellow-500'
    if (value >= 70) return 'bg-orange-500'
    return 'bg-red-500'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingRocket message="Carregando dashboard..." />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Visão geral do sistema de monitoramento
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Seletor de período */}
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="input-field text-sm"
          >
            <option value="1d">Último dia</option>
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="90d">Últimos 90 dias</option>
          </select>
          
          {/* Botões de ação */}
          <button className="btn-secondary p-2">
            <Filter className="w-4 h-4" />
          </button>
          
          <button className="btn-secondary p-2">
            <RefreshCw className="w-4 h-4" />
          </button>
          
          <button className="btn-primary px-4 py-2 flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {/* Cards de métricas */}
      <DashboardCards data={dashboardData} />

      {/* Gráficos e heatmaps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Heatmap de conformidade por horário */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Conformidade por Horário
            </h3>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <span>Baixa</span>
              <div className="flex space-x-1">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <div className="w-3 h-3 bg-orange-500 rounded"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                <div className="w-3 h-3 bg-green-500 rounded"></div>
              </div>
              <span>Alta</span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <div className="grid grid-cols-6 gap-1 min-w-[400px]">
              {/* Header */}
              <div className="text-xs font-medium text-gray-500 p-2"></div>
              {['Seg', 'Ter', 'Qua', 'Qui', 'Sex'].map(day => (
                <div key={day} className="text-xs font-medium text-gray-500 p-2 text-center">
                  {day}
                </div>
              ))}
              
              {/* Dados */}
              {heatmapData.map((row) => (
                <React.Fragment key={row.hour}>
                  <div className="text-xs font-medium text-gray-500 p-2">
                    {row.hour}
                  </div>
                  {['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].map(day => (
                    <motion.div
                      key={`${row.hour}-${day}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: Math.random() * 0.5 }}
                      className={`w-8 h-8 rounded ${getHeatmapColor(row[day])} flex items-center justify-center text-xs font-medium text-white cursor-pointer hover:scale-110 transition-transform`}
                      title={`${row.hour} - ${row[day]}%`}
                    >
                      {row[day]}
                    </motion.div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Gráfico de tendências */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Tendência de Conformidade
          </h3>
          
          <div className="h-64 flex items-end justify-between space-x-2">
            {[85, 87, 82, 90, 88, 92, 89, 91, 87, 94, 90, 87].map((value, index) => (
              <motion.div
                key={index}
                className="flex-1 bg-gradient-to-t from-primary-400 to-primary-600 rounded-t-lg relative group cursor-pointer"
                initial={{ height: 0 }}
                animate={{ height: `${(value / 100) * 100}%` }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {value}%
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="flex justify-between mt-4 text-xs text-gray-500">
            {['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'].map(month => (
              <span key={month}>{month}</span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Lista de alertas recentes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Alertas Recentes
          </h3>
          <button className="text-primary-600 dark:text-primary-400 text-sm font-medium hover:underline">
            Ver todos
          </button>
        </div>
        
        <div className="space-y-4">
          {[
            { id: 1, type: 'high', message: 'Operador João Silva - Desvio de script detectado', time: '2 min atrás' },
            { id: 2, type: 'medium', message: 'Taxa de conformidade abaixo da meta - Turno da manhã', time: '15 min atrás' },
            { id: 3, type: 'low', message: 'Novo operador Maria Santos precisa de treinamento', time: '1 hora atrás' },
          ].map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: alert.id * 0.1 }}
              className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
            >
              <div className={`w-3 h-3 rounded-full ${
                alert.type === 'high' ? 'bg-red-500' :
                alert.type === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
              }`} />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {alert.message}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {alert.time}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Dashboard