"""
Main.py - Arquivo Principal do Backend Monitor.AI
Sistema de rotas e endpoints principais
"""

from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room
import json
import os
from datetime import datetime
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash

# Imports locais
from dash import DashboardCalculator
# from audio import app as audio_app  # Importa o app de áudio existente (comentado para evitar conflitos)

# Configuração do Flask
app = Flask(__name__)
app.config['SECRET_KEY'] = 'monitor-ai-secret-key-2024'
CORS(app, origins=["http://localhost:3000"])
socketio = SocketIO(app, cors_allowed_origins="*")

# Configuração do banco de dados
DATABASE = 'monitor_ai.db'

def init_database():
    """Inicializa o banco de dados com tabelas necessárias"""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    
    # Tabela de usuários
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            role TEXT DEFAULT 'user',
            active BOOLEAN DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_login TIMESTAMP
        )
    ''')
    
    # Tabela de chamadas
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS calls (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            operator_id INTEGER,
            duration INTEGER,
            conformity BOOLEAN,
            alert_pending BOOLEAN,
            audio_file TEXT,
            analysis_result TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (operator_id) REFERENCES users (id)
        )
    ''')
    
    # Tabela de operadores
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS operators (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            shift TEXT,
            active BOOLEAN DEFAULT 1,
            performance_score REAL DEFAULT 0.0,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    conn.commit()
    conn.close()

# ==================== ROTAS PRINCIPAIS ====================

@app.route('/')
def home():
    """Rota principal - informações da API"""
    return jsonify({
        'app': 'Monitor.AI Backend',
        'version': '2.0',
        'status': 'running',
        'endpoints': {
            'dashboard': '/api/dashboard',
            'users': '/api/users',
            'calls': '/api/calls',
            'operators': '/api/operators',
            'audio': '/upload',
            'websocket': '/socket.io'
        }
    })

# ==================== ROTAS DO DASHBOARD ====================

@app.route('/api/dashboard', methods=['GET'])
def get_dashboard():
    """Endpoint para dados do dashboard"""
    try:
        calculator = DashboardCalculator()
        data = calculator.get_dashboard_data()
        return jsonify({
            'success': True,
            'data': data,
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/dashboard/metrics', methods=['POST'])
def calculate_metrics():
    """Endpoint para cálculos customizados"""
    try:
        data = request.get_json()
        calculator = DashboardCalculator()
        metrics = calculator.calculate_custom_metrics(data)
        return jsonify({
            'success': True,
            'metrics': metrics
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# ==================== ROTAS DE USUÁRIOS ====================

@app.route('/api/users', methods=['GET'])
def get_users():
    """Lista todos os usuários"""
    try:
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        cursor.execute('''
            SELECT id, username, email, role, active, created_at, last_login 
            FROM users ORDER BY created_at DESC
        ''')
        users = cursor.fetchall()
        conn.close()
        
        users_list = []
        for user in users:
            users_list.append({
                'id': user[0],
                'username': user[1],
                'email': user[2],
                'role': user[3],
                'active': bool(user[4]),
                'created_at': user[5],
                'last_login': user[6]
            })
        
        return jsonify({
            'success': True,
            'users': users_list,
            'total': len(users_list)
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/users', methods=['POST'])
def create_user():
    """Cria um novo usuário"""
    try:
        data = request.get_json()
        
        # Validação básica
        required_fields = ['username', 'email', 'password']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'success': False,
                    'error': f'Campo {field} é obrigatório'
                }), 400
        
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        
        # Verifica se usuário já existe
        cursor.execute('SELECT id FROM users WHERE username = ? OR email = ?', 
                      (data['username'], data['email']))
        if cursor.fetchone():
            conn.close()
            return jsonify({
                'success': False,
                'error': 'Usuário ou email já existe'
            }), 409
        
        # Cria o usuário
        password_hash = generate_password_hash(data['password'])
        cursor.execute('''
            INSERT INTO users (username, email, password_hash, role, active)
            VALUES (?, ?, ?, ?, ?)
        ''', (
            data['username'],
            data['email'],
            password_hash,
            data.get('role', 'user'),
            data.get('active', True)
        ))
        
        user_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        # Emite evento via WebSocket
        socketio.emit('user_created', {
            'user_id': user_id,
            'username': data['username']
        })
        
        return jsonify({
            'success': True,
            'message': 'Usuário criado com sucesso',
            'user_id': user_id
        }), 201
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    """Atualiza um usuário"""
    try:
        data = request.get_json()
        
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        
        # Verifica se usuário existe
        cursor.execute('SELECT id FROM users WHERE id = ?', (user_id,))
        if not cursor.fetchone():
            conn.close()
            return jsonify({
                'success': False,
                'error': 'Usuário não encontrado'
            }), 404
        
        # Atualiza campos fornecidos
        update_fields = []
        update_values = []
        
        for field in ['username', 'email', 'role', 'active']:
            if field in data:
                update_fields.append(f'{field} = ?')
                update_values.append(data[field])
        
        if update_fields:
            update_values.append(user_id)
            cursor.execute(f'''
                UPDATE users SET {', '.join(update_fields)}
                WHERE id = ?
            ''', update_values)
            conn.commit()
        
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'Usuário atualizado com sucesso'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    """Remove um usuário"""
    try:
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        
        cursor.execute('DELETE FROM users WHERE id = ?', (user_id,))
        if cursor.rowcount == 0:
            conn.close()
            return jsonify({
                'success': False,
                'error': 'Usuário não encontrado'
            }), 404
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'Usuário removido com sucesso'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# ==================== ROTAS DE CHAMADAS ====================

@app.route('/api/calls', methods=['GET'])
def get_calls():
    """Lista todas as chamadas"""
    try:
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        cursor.execute('''
            SELECT c.*, u.username as operator_name
            FROM calls c
            LEFT JOIN users u ON c.operator_id = u.id
            ORDER BY c.created_at DESC
            LIMIT 100
        ''')
        calls = cursor.fetchall()
        conn.close()
        
        calls_list = []
        for call in calls:
            calls_list.append({
                'id': call[0],
                'operator_id': call[1],
                'operator_name': call[8] if len(call) > 8 else 'N/A',
                'duration': call[2],
                'conformity': bool(call[3]),
                'alert_pending': bool(call[4]),
                'audio_file': call[5],
                'analysis_result': call[6],
                'created_at': call[7]
            })
        
        return jsonify({
            'success': True,
            'calls': calls_list,
            'total': len(calls_list)
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# ==================== WEBSOCKET EVENTS ====================

@socketio.on('connect')
def handle_connect():
    """Cliente conectado"""
    print(f'Cliente conectado: {request.sid}')
    emit('connected', {'message': 'Conectado ao Monitor.AI'})

@socketio.on('disconnect')
def handle_disconnect():
    """Cliente desconectado"""
    print(f'Cliente desconectado: {request.sid}')

@socketio.on('join_room')
def handle_join_room(data):
    """Cliente entra em uma sala"""
    room = data.get('room', 'general')
    join_room(room)
    emit('joined_room', {'room': room})

# ==================== INTEGRAÇÃO COM AUDIO.PY ====================

# Registra as rotas do audio.py no app principal
@app.route('/upload', methods=['POST'])
def upload_audio():
    """Endpoint para upload de áudio - integração futura com audio.py"""
    try:
        if 'audio' not in request.files:
            return jsonify({
                'success': False,
                'error': 'Nenhum arquivo de áudio enviado'
            }), 400
        
        file = request.files['audio']
        if file.filename == '':
            return jsonify({
                'success': False,
                'error': 'Nome do arquivo inválido'
            }), 400
        
        # Aqui você pode adicionar a lógica de processamento do áudio
        # Por enquanto, apenas confirma o recebimento
        return jsonify({
            'success': True,
            'message': 'Arquivo recebido com sucesso',
            'filename': file.filename
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# ==================== INICIALIZAÇÃO ====================

if __name__ == '__main__':
    print("=== Iniciando Monitor.AI Backend ===")
    
    # Inicializa o banco de dados
    init_database()
    print("✓ Banco de dados inicializado")
    
    # Cria usuário admin padrão se não existir
    try:
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        cursor.execute('SELECT id FROM users WHERE username = ?', ('admin',))
        if not cursor.fetchone():
            password_hash = generate_password_hash('admin123')
            cursor.execute('''
                INSERT INTO users (username, email, password_hash, role, active)
                VALUES (?, ?, ?, ?, ?)
            ''', ('admin', 'admin@monitor.ai', password_hash, 'admin', True))
            conn.commit()
            print("✓ Usuário admin criado (admin/admin123)")
        conn.close()
    except Exception as e:
        print(f"Erro ao criar usuário admin: {e}")
    
    print("✓ Servidor iniciando na porta 5000")
    print("✓ Frontend esperado em http://localhost:3000")
    print("✓ WebSocket habilitado")
    print("=" * 40)
    
    # Inicia o servidor
    socketio.run(app, 
                host='0.0.0.0', 
                port=5000, 
                debug=True,
                allow_unsafe_werkzeug=True)