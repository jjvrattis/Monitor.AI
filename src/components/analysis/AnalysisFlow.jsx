import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Filter, 
  Search, 
  AlertTriangle, 
  Clock, 
  User, 
  Calendar,
  ChevronDown,
  Play,
  Pause,
  SkipForward,
  Star,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import LoadingRocket from '../ui/LoadingRocket'

const AnalysisFlow = () => {
  const [calls, setCalls] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    operator: 'all',
    dateRange: 'today',
    riskLevel: 'all',
    status: 'pending'
  })
  const [sortBy, setSortBy] = useState('priority')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCall, setSelectedCall] = useState(null)

  useEffect(() => {
    loadCalls()
  }, [filters, sortBy])

  const loadCalls = async () => {
    setIsLoading(true)
    try {
      // Simular carregamento de chamadas
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const mockCalls = [
        {
          id: 1,
          operator: 'Maria Santos',
          customer: 'João Silva',
          date: '2024-01-15',
          time: '14:30',
          duration: '00:05:23',
          riskLevel: 'high',
          priority: 95,
          status: 'pending',
          issues: ['Script não seguido', 'Tom inadequado', 'Informação incorreta'],
          sentiment: 'negative',
          conformityScore: 45,
          audioUrl: '/audio/call-001.mp3'
        },
        {
          id: 2,
          operator: 'Pedro Costa',
          customer: 'Ana Oliveira',
          date: '2024-01-15',
          time: '13:45',
          duration: '00:03:12',
          riskLevel: 'medium',
          priority: 78,
          status: 'pending',
          issues: ['Velocidade de fala', 'Pausa inadequada'],
          sentiment: 'neutral',
          conformityScore: 72,
          audioUrl: '/audio/call-002.mp3'
        },
        {
          id: 3,
          operator: 'Carlos Lima',
          customer: 'Mariana Souza',
          date: '2024-01-15',
          time: '12:15',
          duration: '00:07:45',
          riskLevel: 'low',
          priority: 32,
          status: 'pending',
          issues: ['Pequenos desvios do script'],
          sentiment: 'positive',
          conformityScore: 88,
          audioUrl: '/audio/call-003.mp3'
        },
        {
          id: 4,
          operator: 'Lucia Ferreira',
          customer: 'Roberto Santos',
          date: '2024-01-15',
          time: '11:30',
          duration: '00:04:56',
          riskLevel: 'high',
          priority: 92,
          status: 'reviewed',
          issues: ['Informação sensível exposta', 'Procedimento não seguido'],
          sentiment: 'negative',
          conformityScore: 38,
          audioUrl: '/audio/call-004.mp3'
        }
      ]
      
      setCalls(mockCalls)
    } catch (error) {
      toast.error('Erro ao carregar chamadas')
    } finally {
      setIsLoading(false)
    }
  }

  const getRiskColor = (level) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200'
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200'
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200'
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive': return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'negative': return <TrendingDown className="w-4 h-4 text-red-500" />
      default: return <Minus className="w-4 h-4 text-gray-500" />
    }
  }

  const filteredCalls = calls.filter(call => {
    const matchesSearch = call.operator.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         call.customer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesOperator = filters.operator === 'all' || call.operator === filters.operator
    const matchesRisk = filters.riskLevel === 'all' || call.riskLevel === filters.riskLevel
    const matchesStatus = filters.status === 'all' || call.status === filters.status
    
    return matchesSearch && matchesOperator && matchesRisk && matchesStatus
  }).sort((a, b) => {
    switch (sortBy) {
      case 'priority': return b.priority - a.priority
      case 'date': return new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time)
      case 'conformity': return a.conformityScore - b.conformityScore
      default: return 0
    }
  })

  const handleCallSelect = (call) => {
    setSelectedCall(call)
    // Aqui você pode navegar para a página de detalhes da chamada
    toast.success(`Analisando chamada de ${call.operator}`)
  }

  const markAsReviewed = (callId) => {
    setCalls(calls.map(call => 
      call.id === callId 
        ? { ...call, status: 'reviewed' }
        : call
    ))
    toast.success('Chamada marcada como revisada')
  }

  if (isLoading) {
    return <LoadingRocket message="Carregando análises..." />
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Fluxo de Análise Inteligente
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Chamadas priorizadas por IA para revisão humana
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field"
          >
            <option value="priority">Prioridade</option>
            <option value="date">Data/Hora</option>
            <option value="conformity">Conformidade</option>
          </select>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary flex items-center space-x-2"
          >
            <Filter className="w-4 h-4" />
            <span>Filtros</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filtros */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="card p-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Operador
                </label>
                <select
                  value={filters.operator}
                  onChange={(e) => setFilters({ ...filters, operator: e.target.value })}
                  className="input-field"
                >
                  <option value="all">Todos</option>
                  <option value="Maria Santos">Maria Santos</option>
                  <option value="Pedro Costa">Pedro Costa</option>
                  <option value="Carlos Lima">Carlos Lima</option>
                  <option value="Lucia Ferreira">Lucia Ferreira</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Período
                </label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
                  className="input-field"
                >
                  <option value="today">Hoje</option>
                  <option value="week">Esta semana</option>
                  <option value="month">Este mês</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nível de Risco
                </label>
                <select
                  value={filters.riskLevel}
                  onChange={(e) => setFilters({ ...filters, riskLevel: e.target.value })}
                  className="input-field"
                >
                  <option value="all">Todos</option>
                  <option value="high">Alto</option>
                  <option value="medium">Médio</option>
                  <option value="low">Baixo</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="input-field"
                >
                  <option value="all">Todos</option>
                  <option value="pending">Pendente</option>
                  <option value="reviewed">Revisado</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar por operador ou cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lista de chamadas */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredCalls.map((call, index) => (
            <motion.div
              key={call.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="card p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleCallSelect(call)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    {/* Prioridade */}
                    <div className="flex items-center space-x-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <span className="font-bold text-lg text-gray-900 dark:text-white">
                        {call.priority}
                      </span>
                    </div>
                    
                    {/* Nível de risco */}
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskColor(call.riskLevel)}`}>
                      {call.riskLevel === 'high' ? 'Alto Risco' : 
                       call.riskLevel === 'medium' ? 'Médio Risco' : 'Baixo Risco'}
                    </span>
                    
                    {/* Status */}
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      call.status === 'pending' 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}>
                      {call.status === 'pending' ? 'Pendente' : 'Revisado'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {call.operator}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Operador
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {call.customer}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Cliente
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {call.date} {call.time}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Data/Hora
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {call.duration}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Duração
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Métricas */}
                  <div className="flex items-center space-x-6 mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Conformidade:
                      </span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              call.conformityScore >= 80 ? 'bg-green-500' :
                              call.conformityScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${call.conformityScore}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {call.conformityScore}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Sentimento:
                      </span>
                      {getSentimentIcon(call.sentiment)}
                    </div>
                  </div>
                  
                  {/* Issues */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Problemas identificados:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {call.issues.map((issue, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded text-xs"
                        >
                          {issue}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Ações */}
                <div className="flex flex-col space-y-2 ml-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCallSelect(call)
                    }}
                    className="btn-primary text-sm px-4 py-2"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Analisar
                  </button>
                  
                  {call.status === 'pending' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        markAsReviewed(call.id)
                      }}
                      className="btn-secondary text-sm px-4 py-2"
                    >
                      Marcar como Revisado
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {filteredCalls.length === 0 && (
        <div className="text-center py-12">
          <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            Nenhuma chamada encontrada com os filtros aplicados
          </p>
        </div>
      )}
    </motion.div>
  )
}

export default AnalysisFlow