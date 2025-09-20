// Serviço para integração com o backend Flask de análise de áudio
const API_BASE_URL = 'http://localhost:5000'

class AudioService {
  /**
   * Faz upload de um arquivo de áudio para análise
   * @param {File} audioFile - Arquivo de áudio
   * @param {Function} onProgress - Callback para progresso do upload
   * @returns {Promise} - Resultado da análise
   */
  async uploadAudio(audioFile, onProgress = null) {
    const formData = new FormData()
    formData.append('audio_file', audioFile)

    try {
      console.log('Iniciando upload para:', `${API_BASE_URL}/upload`)
      console.log('Arquivo:', audioFile.name, 'Tamanho:', audioFile.size)
      
      // Criar AbortController para controlar timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 300000) // 5 minutos de timeout

      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
        // Não definir Content-Type para permitir boundary automático
      })

      clearTimeout(timeoutId)

      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Erro na resposta:', errorText)
        throw new Error(`Erro no upload: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      console.log('Upload bem-sucedido:', result)
      return result
    } catch (error) {
      console.error('Erro no upload de áudio:', error)
      console.error('Tipo do erro:', error.name)
      console.error('Mensagem do erro:', error.message)
      
      // Tratamento específico para timeout
      if (error.name === 'AbortError') {
        throw new Error('Timeout: O processamento está demorando mais que o esperado. Tente novamente.')
      }
      
      throw error
    }
  }

  /**
   * Verifica se o servidor Flask está rodando
   * @returns {Promise<boolean>} - Status do servidor
   */
  async checkServerStatus() {
    try {
      const response = await fetch(`${API_BASE_URL}/`, {
        method: 'GET',
        timeout: 5000
      })
      return response.ok
    } catch (error) {
      console.error('Servidor Flask não está disponível:', error)
      return false
    }
  }

  /**
   * Obtém o histórico de análises (se implementado no backend)
   * @returns {Promise<Array>} - Lista de análises anteriores
   */
  async getAnalysisHistory() {
    try {
      const response = await fetch(`${API_BASE_URL}/history`, {
        method: 'GET',
      })

      if (!response.ok) {
        throw new Error(`Erro ao buscar histórico: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao buscar histórico:', error)
      return []
    }
  }

  /**
   * Formata o tempo em segundos para formato legível
   * @param {number} seconds - Tempo em segundos
   * @returns {string} - Tempo formatado (mm:ss)
   */
  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  /**
   * Valida se o arquivo é um formato de áudio suportado
   * @param {File} file - Arquivo a ser validado
   * @returns {boolean} - Se o arquivo é válido
   */
  validateAudioFile(file) {
    const supportedTypes = [
      'audio/mpeg',
      'audio/mp3',
      'audio/wav',
      'audio/wave',
      'audio/x-wav',
      'audio/mp4',
      'audio/m4a',
      'audio/aac',
      'audio/ogg',
      'audio/webm'
    ]

    const maxSize = 100 * 1024 * 1024 // 100MB
    
    if (!supportedTypes.includes(file.type)) {
      throw new Error('Formato de arquivo não suportado. Use MP3, WAV, M4A, AAC, OGG ou WebM.')
    }

    if (file.size > maxSize) {
      throw new Error('Arquivo muito grande. Tamanho máximo: 100MB.')
    }

    return true
  }

  /**
   * Converte bytes para formato legível
   * @param {number} bytes - Tamanho em bytes
   * @returns {string} - Tamanho formatado
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes'
    
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
}

export default new AudioService()