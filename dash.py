"""
Dashboard Backend - Lógicas de Cálculos para Monitor.AI
Arquivo com funções pré-prontas para cálculos do dashboard
"""

import json
import random
from datetime import datetime, timedelta
from typing import Dict, List, Any
import statistics

class DashboardCalculator:
    """Classe com todas as lógicas de cálculo para o dashboard"""
    
    def __init__(self):
        self.data_cache = {}
    
    def calculate_total_calls(self, calls_data: List[Dict]) -> int:
        """Calcula o total de chamadas"""
        return len(calls_data) if calls_data else 0
    
    def calculate_conformity_rate(self, calls_data: List[Dict]) -> float:
        """Calcula a taxa de conformidade"""
        if not calls_data:
            return 0.0
        
        conforming_calls = sum(1 for call in calls_data if call.get('conformity', False))
        return round((conforming_calls / len(calls_data)) * 100, 1)
    
    def calculate_pending_alerts(self, calls_data: List[Dict]) -> int:
        """Calcula alertas pendentes"""
        if not calls_data:
            return 0
        
        return sum(1 for call in calls_data if call.get('alert_pending', False))
    
    def calculate_avg_call_time(self, calls_data: List[Dict]) -> float:
        """Calcula tempo médio de chamada em minutos"""
        if not calls_data:
            return 0.0
        
        times = [call.get('duration', 0) for call in calls_data if call.get('duration')]
        return round(statistics.mean(times) / 60, 1) if times else 0.0
    
    def calculate_active_operators(self, operators_data: List[Dict]) -> int:
        """Calcula operadores ativos"""
        if not operators_data:
            return 0
        
        return sum(1 for op in operators_data if op.get('active', False))
    
    def calculate_ai_efficiency(self, ai_analysis_data: List[Dict]) -> float:
        """Calcula eficiência da IA"""
        if not ai_analysis_data:
            return 0.0
        
        successful_analysis = sum(1 for analysis in ai_analysis_data 
                                if analysis.get('success', False))
        return round((successful_analysis / len(ai_analysis_data)) * 100, 1)
    
    def generate_heatmap_data(self, calls_data: List[Dict]) -> List[Dict]:
        """Gera dados do heatmap de conformidade por horário"""
        heatmap = []
        hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', 
                '14:00', '15:00', '16:00', '17:00']
        days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
        
        for hour in hours:
            hour_data = {'hour': hour}
            for day in days:
                # Simula cálculo baseado em dados reais
                # Aqui você colocaria a lógica real baseada nos seus dados
                conformity_rate = random.randint(70, 95)
                hour_data[day] = conformity_rate
            heatmap.append(hour_data)
        
        return heatmap
    
    def calculate_trend_data(self, calls_data: List[Dict], days: int = 7) -> Dict:
        """Calcula dados de tendência dos últimos N dias"""
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)
        
        # Filtra chamadas do período
        period_calls = [
            call for call in calls_data 
            if start_date <= datetime.fromisoformat(call.get('date', '')) <= end_date
        ]
        
        return {
            'total_calls': len(period_calls),
            'conformity_trend': self.calculate_conformity_rate(period_calls),
            'avg_time_trend': self.calculate_avg_call_time(period_calls),
            'period_start': start_date.isoformat(),
            'period_end': end_date.isoformat()
        }
    
    def get_dashboard_summary(self, 
                            calls_data: List[Dict] = None,
                            operators_data: List[Dict] = None,
                            ai_analysis_data: List[Dict] = None) -> Dict[str, Any]:
        """
        Retorna um resumo completo para o dashboard
        Se não houver dados, retorna dados simulados
        """
        
        # Se não há dados, gera dados simulados
        if not calls_data:
            calls_data = self._generate_mock_calls_data()
        if not operators_data:
            operators_data = self._generate_mock_operators_data()
        if not ai_analysis_data:
            ai_analysis_data = self._generate_mock_ai_data()
        
        return {
            'metrics': {
                'totalCalls': self.calculate_total_calls(calls_data),
                'conformityRate': self.calculate_conformity_rate(calls_data),
                'pendingAlerts': self.calculate_pending_alerts(calls_data),
                'avgTime': self.calculate_avg_call_time(calls_data),
                'activeOperators': self.calculate_active_operators(operators_data),
                'aiEfficiency': self.calculate_ai_efficiency(ai_analysis_data)
            },
            'heatmapData': self.generate_heatmap_data(calls_data),
            'trends': self.calculate_trend_data(calls_data),
            'lastUpdate': datetime.now().isoformat()
        }
    
    def _generate_mock_calls_data(self) -> List[Dict]:
        """Gera dados simulados de chamadas"""
        mock_calls = []
        for i in range(1247):  # Número exemplo
            mock_calls.append({
                'id': f'call_{i}',
                'date': (datetime.now() - timedelta(days=random.randint(0, 30))).isoformat(),
                'duration': random.randint(120, 600),  # 2-10 minutos em segundos
                'conformity': random.choice([True, False]),
                'alert_pending': random.choice([True, False, False, False]),  # 25% chance
                'operator_id': f'op_{random.randint(1, 50)}'
            })
        return mock_calls
    
    def _generate_mock_operators_data(self) -> List[Dict]:
        """Gera dados simulados de operadores"""
        mock_operators = []
        for i in range(50):
            mock_operators.append({
                'id': f'op_{i}',
                'name': f'Operador {i}',
                'active': random.choice([True, False]),
                'shift': random.choice(['morning', 'afternoon', 'night'])
            })
        return mock_operators
    
    def _generate_mock_ai_data(self) -> List[Dict]:
        """Gera dados simulados de análises de IA"""
        mock_ai = []
        for i in range(500):
            mock_ai.append({
                'id': f'analysis_{i}',
                'success': random.choice([True, False, True, True]),  # 75% sucesso
                'confidence': random.uniform(0.7, 0.99),
                'processing_time': random.uniform(0.5, 3.0)
            })
        return mock_ai

# Instância global do calculador
dashboard_calc = DashboardCalculator()

def get_dashboard_data():
    """Função principal para obter dados do dashboard"""
    return dashboard_calc.get_dashboard_summary()

def calculate_custom_metrics(data: Dict) -> Dict:
    """Calcula métricas customizadas baseadas em dados específicos"""
    # Aqui você pode adicionar cálculos específicos do seu negócio
    return {
        'custom_metric_1': 0,
        'custom_metric_2': 0,
        'calculated_at': datetime.now().isoformat()
    }

if __name__ == "__main__":
    # Teste das funções
    print("=== Teste do Dashboard Calculator ===")
    data = get_dashboard_data()
    print(json.dumps(data, indent=2, ensure_ascii=False))