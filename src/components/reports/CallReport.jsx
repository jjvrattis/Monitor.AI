import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2,
  Download,
  Share2,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  User,
  FileText,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import LoadingRocket from '../ui/LoadingRocket'

const CallReport = ({ callId }) => {
  const [callData, setCallData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [feedback, setFeedback] = useState(null)
  const [comment, setComment] = useState('')
  const [showCommentBox, setShowCommentBox] = useState(false)
  const [activeTab, setActiveTab] = useState('transcript')
  
  const audioRef = useRef(null)

  useEffect(() => {
    loadCallData()
  }, [callId])

  const loadCallData = async () => {
    setIsLoading(true)
    try {
      // Simular carregamento de dados da chamada
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const mockCallData = {
        id: callId || 1,
        operator: 'Maria Santos',
        customer: 'João Silva',
        date: '2024-01-15',
        time: '14:30',
        duration: '00:05:23',
        audioUrl: '/audio/call-001.mp3',
        riskLevel: 'high',
        conformityScore: 45,
        sentiment: 'negative',
        issues: [
          {
            type: 'script_deviation',
            severity: 'high',
            timestamp: '00:01:23',
            description: 'Operador não seguiu script de abertura'
          },
          {
            type: 'inappropriate_tone',
            severity: 'medium',
            timestamp: '00:02:45',
            description: 'Tom inadequado durante explicação'
          },
          {
            type: 'incorrect_information',
            severity: 'high',
            timestamp: '00:04:12',
            description: 'Informação incorreta sobre produto'
          }
        ],
        transcript: [
          {
            speaker: 'operator',
            timestamp: '00:00:05',
            text: 'Oi, aqui é a Maria da empresa.',
            official_script: 'Bom dia! Aqui é a Maria da [Nome da Empresa]. Como posso ajudá-lo hoje?',
            deviation: true,
            sentiment: 'neutral'
          },
          {
            speaker: 'customer',
            timestamp: '00:00:08',
            text: 'Oi, eu queria saber sobre o produto X.',
            sentiment: 'neutral'
          },
          {
            speaker: 'operator',
            timestamp: '00:00:12',
            text: 'Ah sim, o produto X é muito bom, custa R$ 150.',
            official_script: 'Claro! O produto X é uma excelente opção. O valor promocional é de R$ 129,90. Gostaria que eu explique os benefícios?',
            deviation: true,
            sentiment: 'positive',
            issues: ['Preço incorreto', 'Não ofereceu explicação detalhada']
          },
          {
            speaker: 'customer',
            timestamp: '00:00:18',
            text: 'Nossa, mas no site está R$ 129. Por que a diferença?',
            sentiment: 'negative'
          },
          {
            speaker: 'operator',
            timestamp: '00:00:22',
            text: 'Ah, é que... deixa eu ver aqui... deve ser promoção mesmo.',
            official_script: 'Você está correto! O valor promocional atual é R$ 129,90. Peço desculpas pela confusão. Posso processar seu pedido com esse valor?',
            deviation: true,
            sentiment: 'uncertain',
            issues: ['Insegurança', 'Falta de conhecimento do produto']
          }
        ],
        metrics: {
          script_adherence: 45,
          tone_appropriateness: 60,
          information_accuracy: 30,
          customer_satisfaction: 40,
          call_efficiency: 70
        },
        recommendations: [
          'Revisar script de abertura com operador',
          'Treinamento sobre informações de produtos',
          'Prática de tom de voz adequado',
          'Atualização sobre preços e promoções'
        ]
      }
      
      setCallData(mockCallData)
    } catch (error) {
      toast.error('Erro ao carregar dados da chamada')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const handleSeek = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleFeedback = (type) => {
    setFeedback(type)
    toast.success(`Feedback "${type === 'agree' ? 'Concordo' : 'Discordo'}" registrado!`)
  }

  const handleCommentSubmit = () => {
    if (comment.trim()) {
      toast.success('Comentário salvo com sucesso!')
      setComment('')
      setShowCommentBox(false)
    }
  }

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive': return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'negative': return <TrendingDown className="w-4 h-4 text-red-500" />
      case 'uncertain': return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      default: return <Minus className="w-4 h-4 text-gray-500" />
    }
  }

  const getDeviationColor = (hasDeviation) => {
    return hasDeviation 
      ? 'bg-red-50 border-l-4 border-red-400 dark:bg-red-900/20 dark:border-red-500'
      : 'bg-green-50 border-l-4 border-green-400 dark:bg-green-900/20 dark:border-green-500'
  }

  if (isLoading) {
    return <LoadingRocket message="Carregando relatório..." />
  }

  if (!callData) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400">
          Chamada não encontrada
        </p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Relatório da Chamada #{callData.id}
            </h1>
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span>{callData.operator} → {callData.customer}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{callData.date} {callData.time}</span>
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="btn-secondary flex items-center space-x-2">
              <Share2 className="w-4 h-4" />
              <span>Compartilhar</span>
            </button>
            <button className="btn-primary flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Exportar PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Player de áudio */}
      <div className="card p-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={handlePlayPause}
            className="w-12 h-12 bg-primary-500 hover:bg-primary-600 text-white rounded-full flex items-center justify-center transition-colors"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
          </button>
          
          <div className="flex-1">
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-primary-500 h-2 rounded-full transition-all"
                style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Volume2 className="w-4 h-4 text-gray-400" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => {
                setVolume(e.target.value)
                if (audioRef.current) {
                  audioRef.current.volume = e.target.value
                }
              }}
              className="w-20"
            />
          </div>
        </div>
        
        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
        >
          <source src={callData.audioUrl} type="audio/mpeg" />
        </audio>
      </div>

      {/* Métricas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {Object.entries(callData.metrics).map(([key, value]) => (
          <div key={key} className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                  {key.replace('_', ' ')}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {value}%
                </p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                value >= 80 ? 'bg-green-100 dark:bg-green-900' :
                value >= 60 ? 'bg-yellow-100 dark:bg-yellow-900' : 'bg-red-100 dark:bg-red-900'
              }`}>
                {value >= 80 ? (
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                ) : value >= 60 ? (
                  <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'transcript', label: 'Transcrição', icon: FileText },
              { id: 'analysis', label: 'Análise', icon: BarChart3 },
              { id: 'recommendations', label: 'Recomendações', icon: MessageSquare }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'transcript' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Transcrição com Comparação
                </h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Conforme script</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Desvio do script</span>
                  </div>
                </div>
              </div>
              
              {callData.transcript.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg ${getDeviationColor(item.deviation)}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        {item.timestamp}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        item.speaker === 'operator' 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      }`}>
                        {item.speaker === 'operator' ? 'Operador' : 'Cliente'}
                      </span>
                      {getSentimentIcon(item.sentiment)}
                    </div>
                    
                    <button
                      onClick={() => handleSeek(item.timestamp)}
                      className="text-primary-600 hover:text-primary-700 dark:text-primary-400 text-xs"
                    >
                      Ir para momento
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Fala real:
                      </p>
                      <p className="text-gray-900 dark:text-white">
                        {item.text}
                      </p>
                    </div>
                    
                    {item.official_script && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Script oficial:
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 italic">
                          {item.official_script}
                        </p>
                      </div>
                    )}
                    
                    {item.issues && (
                      <div>
                        <p className="text-sm font-medium text-red-700 dark:text-red-300 mb-1">
                          Problemas identificados:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {item.issues.map((issue, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded text-xs"
                            >
                              {issue}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'analysis' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Análise Detalhada
              </h3>
              
              {callData.issues.map((issue, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          issue.severity === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                          issue.severity === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        }`}>
                          {issue.severity === 'high' ? 'Alta' : 
                           issue.severity === 'medium' ? 'Média' : 'Baixa'} Severidade
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {issue.timestamp}
                        </span>
                      </div>
                      <p className="text-gray-900 dark:text-white font-medium mb-1">
                        {issue.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {issue.description}
                      </p>
                    </div>
                    <button
                      onClick={() => handleSeek(issue.timestamp)}
                      className="btn-secondary text-sm ml-4"
                    >
                      Ouvir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'recommendations' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recomendações de Melhoria
              </h3>
              
              {callData.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <p className="text-gray-900 dark:text-white">
                    {recommendation}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Feedback */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Feedback da Análise
        </h3>
        
        <div className="flex items-center space-x-4 mb-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Você concorda com a análise da IA?
          </span>
          
          <div className="flex space-x-2">
            <button
              onClick={() => handleFeedback('agree')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                feedback === 'agree'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
              <span>Concordo</span>
            </button>
            
            <button
              onClick={() => handleFeedback('disagree')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                feedback === 'disagree'
                  ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <ThumbsDown className="w-4 h-4" />
              <span>Discordo</span>
            </button>
          </div>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={() => setShowCommentBox(!showCommentBox)}
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 text-sm flex items-center space-x-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Adicionar comentário</span>
          </button>
          
          <AnimatePresence>
            {showCommentBox && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3"
              >
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Adicione seus comentários sobre esta análise..."
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                  rows={3}
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleCommentSubmit}
                    className="btn-primary text-sm"
                  >
                    Salvar Comentário
                  </button>
                  <button
                    onClick={() => setShowCommentBox(false)}
                    className="btn-secondary text-sm"
                  >
                    Cancelar
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

export default CallReport