# Monitor AI - Instruções de Execução

## Configuração do Backend (Flask)

1. **Instalar dependências do Python:**
```bash
pip install -r requirements.txt
```

2. **Executar o backend:**
```bash
python audio.py
```
O backend estará rodando em: `http://localhost:5000`

## Configuração do Frontend (React)

1. **Navegar para a pasta do frontend:**
```bash
cd monitor-ai
```

2. **Instalar dependências do Node.js:**
```bash
npm install
```

3. **Executar o frontend:**
```bash
npm start
```
O frontend estará rodando em: `http://localhost:3000`

## Como usar

1. Certifique-se de que tanto o backend quanto o frontend estão rodando
2. Acesse `http://localhost:3000` no seu navegador
3. Faça upload de um arquivo de áudio (.mp3 ou .wav)
4. Clique em "Analisar Áudio" e aguarde o processamento
5. O relatório será exibido no painel direito

## Estrutura do Projeto

```
├── audio.py              # Backend Flask com API de análise
├── requirements.txt      # Dependências Python
├── monitor-ai/          # Frontend React
│   ├── src/
│   │   └── App.js       # Componente principal
│   ├── package.json     # Dependências Node.js
│   └── ...
└── INSTRUCOES.md        # Este arquivo
```

## Funcionalidades

- ✅ Upload de arquivos de áudio
- ✅ Transcrição automática usando AssemblyAI
- ✅ Análise de sentimento com OpenAI GPT
- ✅ Interface responsiva e moderna
- ✅ Compartilhamento via WhatsApp
- ✅ Animações e feedback visual

## Tecnologias Utilizadas

**Backend:**
- Flask (API REST)
- OpenAI GPT-4 (Análise de texto)
- AssemblyAI (Transcrição de áudio)
- Flask-CORS (Comunicação com frontend)

**Frontend:**
- React 19
- Tailwind CSS (Estilização)
- Fetch API (Comunicação com backend)

## Notas Importantes

- Certifique-se de ter as chaves de API configuradas no `audio.py`
- O backend precisa estar rodando para o frontend funcionar
- Arquivos suportados: MP3 e WAV