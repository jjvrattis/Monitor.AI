from flask import Flask, render_template, request, jsonify
import os
import requests
import time
from openai import OpenAI

# --- CONFIGURAÇÕES FLASK ---
app = Flask(__name__, template_folder='templates')

# --- CHAVES E ENDPOINTS ---
ASSEMBLY_API_KEY = "684a9d6c573d4e4f9fd2714ceb686c08"
UPLOAD_ENDPOINT = "https://api.assemblyai.com/v2/upload"
TRANSCRIPT_ENDPOINT = "https://api.assemblyai.com/v2/transcript"

OPENAI_API_KEY = "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"  # <<< coloca aqui tua chave da OpenAI
client = OpenAI(api_key=OPENAI_API_KEY)

# --- FUNÇÕES DE ÁUDIO E TRANSCRIÇÃO ---
def upload_audio(file_path):
    headers = {'authorization': ASSEMBLY_API_KEY}
    with open(file_path, 'rb') as f:
        response = requests.post(UPLOAD_ENDPOINT, headers=headers, data=f)
    return response.json()['upload_url']

def start_transcription(audio_url):
    headers = {"authorization": ASSEMBLY_API_KEY, "content-type": "application/json"}
    data = {"audio_url": audio_url, "language_code": "pt", "speaker_labels": True, "speakers_expected": 2}
    response = requests.post(TRANSCRIPT_ENDPOINT, json=data, headers=headers)
    return response.json()['id']

def get_transcription_result(transcript_id, max_wait=60):
    headers = {'authorization': ASSEMBLY_API_KEY}
    polling_url = f"{TRANSCRIPT_ENDPOINT}/{transcript_id}"
    waited = 0  # ← Inicializa a variável aqui

    while waited < max_wait:
        resp = requests.get(polling_url, headers=headers).json()
        status = resp.get('status')
        if status == 'completed':
            return resp
        elif status == 'error':
            return {"error": resp.get('error')}
        time.sleep(3)
        waited += 3

    return {"error": "Timeout na transcrição"}


# --- FUNÇÕES DE PROCESSAMENTO ---
def merge_short_segments(utterances, min_words=3):
    merged = []
    for utt in utterances:
        speaker = utt['speaker']
        text = utt['text'].strip()
        if not merged:
            merged.append({"speaker": speaker, "text": text})
            continue
        last = merged[-1]
        last_speaker = last['speaker']
        if speaker == last_speaker or len(text.split()) <= min_words:
            merged[-1]['text'] += " " + text
        else:
            merged.append({"speaker": speaker, "text": text})
    return merged

def identificar_operador_cliente(utterances):
    mapping = {}
    for utt in utterances:
        txt = utt['text'].lower()
        if "lojas caedu" in txt or "gerente de negociação" in txt or "pré jurídico" in txt:
            mapping[utt['speaker']] = "Operador"
        else:
            if utt['speaker'] not in mapping:
                mapping[utt['speaker']] = "Cliente"
    for utt in utterances:
        utt['speaker'] = mapping[utt['speaker']]
    return utterances

# --- FUNÇÃO DE RELATÓRIO USANDO OPENAI ---
def gerar_relatorio_openai(texto):
    prompt = f"""
Você é um analista de conversas especializado em monitoria de atendimento.
Analise a transcrição abaixo e produza um RELATÓRIO ESTRUTURADO com:

1. Resumo objetivo da ligação (máx 5 linhas).
2. Pontos positivos da operadora.
3. Pontos negativos da operadora.
4. Sugestões práticas de melhoria.
5. Notas de 0 a 10 para:
   - Clareza de comunicação
   - Domínio da negociação
   - Postura/profissionalismo
   - Capacidade de fechamento
   - Sua opinião sincera sobre a ligação, incluindo informalidades se necessário (ex: "foi uma ligação de merda", "foi até boazinha", "operador foi zika")
6. Nota final (média geral).

Transcrição:
{texto}
"""
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "Você é um analista de monitoria de atendimento, objetivo e claro."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.3
    )
    return completion.choices[0].message.content

# --- ROTAS FLASK ---
@app.route("/")
def index():
    return render_template("painel.html")

@app.route("/upload", methods=["POST"])
def upload():
    file = request.files.get("audio_file")
    if not file:
        return jsonify({"success": False, "relatorio": "Nenhum arquivo de áudio enviado"}), 400

    os.makedirs("uploads", exist_ok=True)
    file_path = os.path.join("uploads", file.filename)
    file.save(file_path)

    try:
        audio_url = upload_audio(file_path)
        transcript_id = start_transcription(audio_url)
        result = get_transcription_result(transcript_id)

        if "error" in result:
            return jsonify({"success": False, "relatorio": f"Erro na transcrição: {result['error']}"})
        else:
            utterances = result.get('utterances', [])
            utterances = merge_short_segments(utterances)
            utterances = identificar_operador_cliente(utterances)
            full_text = "\n".join([f"{utt['speaker']}: {utt['text']}" for utt in utterances])
            
            # --- gera relatório usando OpenAI ---
            relatorio = gerar_relatorio_openai(full_text)
            
            return jsonify({"success": True, "relatorio": relatorio, "descricao": "Relatório gerado com sucesso!"})

    except Exception as e:
        return jsonify({"success": False, "relatorio": f"Erro no processamento: {str(e)}"})
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)

if __name__ == "__main__":
    app.run(debug=True)

