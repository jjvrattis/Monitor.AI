import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Upload, 
  Play, 
  Pause, 
  Volume2, 
  Download, 
  Share2, 
  FileAudio, 
  Clock,
  User,
  Bot,
  AlertCircle,
  CheckCircle,
  Loader2,
  X,
  Mic,
  TrendingUp
} from 'lucide-react'
import toast from 'react-hot-toast'
import audioService from '../../services/audioService'

const AudioAnalysis = () => {
  const [file, setFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [audioUrl, setAudioUrl] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [uploadProgress, setUploadProgress] = useState(0)
  
  const fileInputRef = useRef(null)
  const audioRef = useRef(null)
  const dropRef = useRef(null)

  // Função para lidar com drag & drop
  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile.type.startsWith('audio/')) {
        setFile(droppedFile)
        setAudioUrl(URL.createObjectURL(droppedFile))
      } else {
        toast.error('Por favor, selecione um arquivo de áudio válido')
      }
    }
  }, [])

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      setAudioUrl(URL.createObjectURL(selectedFile))
    }
  }

  // Função para lidar com upload de arquivo
  const handleFileUpload = async (file) => {
    try {
      console.log('Iniciando handleFileUpload com arquivo:', file.name)
      
      // Validar arquivo
      audioService.validateAudioFile(file)
      
      setFile(file)
      setIsUploading(true)
      setUploadProgress(0)
      
      // Simular progresso de upload
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 200)

      console.log('Chamando audioService.uploadAudio...')
      // Fazer upload para o backend Flask
      const result = await audioService.uploadAudio(file)
      
      console.log('Resultado do upload:', result)
      clearInterval(progressInterval)
      setUploadProgress(100)
      
      // Processar resultado
      if (result.success) {
        setAnalysisResult({
          transcription: result.transcription || '',
          analysis: result.analysis || '',
          segments: result.segments || [],
          duration: result.duration || 0,
          speakers: result.speakers || []
        })
        setCurrentStep('analysis')
        toast.success('Análise concluída com sucesso!')
      } else {
        throw new Error(result.error || 'Erro na análise')
      }
      
    } catch (error) {
      console.error('Erro no handleFileUpload:', error)
      console.error('Stack trace:', error.stack)
      toast.error(`Erro no upload: ${error.message}`)
      setFile(null)
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleAnalyze = async () => {
    if (!file) {
      toast.error('Por favor, selecione um arquivo de áudio')
      return
    }

    await handleFileUpload(file)
  }

  const togglePlayPause = () => {
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

  const formatTime = (time) => {
    return audioService.formatTime(time)
  }

  const handleDownloadPDF = () => {
    if (!analysisResult) return
    
    // Criar conteúdo do PDF
    const content = `
RELATÓRIO DE ANÁLISE - MONITOR.AI
================================

Data: ${new Date().toLocaleDateString('pt-BR')}
Arquivo: ${file?.name || 'Arquivo de áudio'}

ANÁLISE DETALHADA:
${analysisResult.analysis || analysisResult.relatorio || 'Análise não disponível'}

TRANSCRIÇÃO COMPLETA:
${analysisResult.transcription || 'Transcrição não disponível'}
    `.trim()
    
    // Criar e baixar arquivo
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `relatorio-analise-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    toast.success('Relatório baixado com sucesso!')
  }

  const handleShare = () => {
    if (analysisResult) {
      const text = `Relatório de Análise - Monitor.AI\n\n${analysisResult.analysis || analysisResult.relatorio}`
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`
      window.open(whatsappUrl, '_blank')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Monitor.AI - Análise Inteligente de Ligações
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Transforme suas ligações em insights valiosos com transcrição automática e análise detalhada por IA
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Coluna Esquerda - Upload e Player */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Upload Area */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Upload de Áudio
              </h2>
              
              <div
                ref={dropRef}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`
                  relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300
                  ${dragActive 
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                    : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500'
                  }
                `}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                <div className="flex flex-col items-center space-y-4">
                  <div className={`
                    w-16 h-16 rounded-full flex items-center justify-center transition-colors
                    ${dragActive 
                      ? 'bg-primary-100 dark:bg-primary-800' 
                      : 'bg-gray-100 dark:bg-gray-700'
                    }
                  `}>
                    <Upload className={`w-8 h-8 ${dragActive ? 'text-primary-600' : 'text-gray-400'}`} />
                  </div>
                  
                  <div>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {file ? file.name : 'Clique ou arraste um arquivo de áudio'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Formatos suportados: MP3, WAV, M4A
                    </p>
                  </div>
                </div>
              </div>

              {/* Audio Player */}
              {audioUrl && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <audio
                    ref={audioRef}
                    src={audioUrl}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={() => setIsPlaying(false)}
                  />
                  
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={togglePlayPause}
                      className="w-12 h-12 bg-primary-500 hover:bg-primary-600 rounded-full flex items-center justify-center text-white transition-colors"
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
                    </button>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                    
                    <Volume2 className="w-5 h-5 text-gray-400" />
                  </div>
                </motion.div>
              )}

              {/* Analyze Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAnalyze}
                disabled={!file || isAnalyzing}
                className="w-full mt-6 btn-primary py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processando com IA...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Mic className="w-5 h-5" />
                    <span>Iniciar Análise</span>
                  </div>
                )}
              </motion.button>
            </div>

            {/* Quick Stats */}
            {analysisResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-3 gap-4"
              >
                <div className="card p-4 text-center">
                  <FileAudio className="w-8 h-8 text-primary-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">Arquivo</p>
                  <p className="font-semibold text-gray-900 dark:text-white">Processado</p>
                </div>
                <div className="card p-4 text-center">
                  <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                  <p className="font-semibold text-green-600">Concluído</p>
                </div>
                <div className="card p-4 text-center">
                  <TrendingUp className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">Duração</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {analysisResult.duration ? `${Math.round(analysisResult.duration)}s` : 'N/A'}
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Coluna Direita - Resultados */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {analysisResult ? (
              <>
                {/* Header do Relatório */}
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Relatório de Análise
                    </h2>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleShare}
                        className="btn-secondary p-2"
                        title="Compartilhar no WhatsApp"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleDownloadPDF}
                        className="btn-secondary p-2"
                        title="Download Relatório"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-green-600 dark:text-green-400 font-medium">
                    {analysisResult.descricao}
                  </p>
                </div>

                {/* Informações do Arquivo */}
                {analysisResult.speakers && analysisResult.speakers.length > 0 && (
                  <div className="card p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Informações da Ligação
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Participantes</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {analysisResult.speakers.length} pessoa(s)
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Segmentos</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {analysisResult.segments ? analysisResult.segments.length : 0} falas
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Relatório Completo */}
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Análise Detalhada
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 max-h-96 overflow-y-auto">
                    <div className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {analysisResult.analysis || analysisResult.relatorio || 'Análise não disponível'}
                    </div>
                  </div>
                </div>

                {/* Transcrição */}
                {analysisResult.transcription && (
                  <div className="card p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Transcrição Completa
                    </h3>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 max-h-64 overflow-y-auto">
                      <div className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {analysisResult.transcription}
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="card p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Aguardando Análise
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Selecione um arquivo de áudio de ligação para receber análise completa com insights e relatório detalhado
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default AudioAnalysis