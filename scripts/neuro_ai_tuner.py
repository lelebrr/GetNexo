#!/usr/bin/env python3
"""
GetNexo Neuro AI Tuner - Ajuste Fino de Temperatura da IA
Sistema avançado de otimização de parâmetros de IA baseado em feedback do usuário
"""

import os
import json
import time
from datetime import datetime, timedelta
from collections import defaultdict, deque
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
import joblib
import requests
import threading
import queue

class NeuroAITuner:
    def __init__(self):
        self.feedback_db = 'data/ai_feedback.json'
        self.models_db = 'data/ai_models_config.json'
        self.tuning_history = 'data/ai_tuning_history.json'

        # Parâmetros ajustáveis por modelo
        self.parameter_ranges = {
            'claude-3-opus': {
                'temperature': [0.0, 1.0],
                'top_p': [0.1, 0.9],
                'top_k': [1, 500],
                'max_tokens': [100, 4000]
            },
            'gpt-4': {
                'temperature': [0.0, 2.0],
                'top_p': [0.1, 1.0],
                'frequency_penalty': [-2.0, 2.0],
                'presence_penalty': [-2.0, 2.0],
                'max_tokens': [100, 4000]
            },
            'gemini-pro': {
                'temperature': [0.0, 1.0],
                'top_p': [0.1, 0.9],
                'top_k': [1, 40],
                'max_output_tokens': [100, 2048]
            }
        }

        # Métricas de qualidade
        self.quality_metrics = [
            'relevance_score',     # 0-10: Quão relevante é a resposta
            'accuracy_score',      # 0-10: Quão precisa é a resposta
            'helpfulness_score',   # 0-10: Quão útil é a resposta
            'creativity_score',    # 0-10: Quão criativa/original é
            'conciseness_score',   # 0-10: Quão concisa e direta é
            'tone_appropriateness', # 0-10: Adequação do tom
            'response_time',       # segundos: Tempo de resposta
            'token_efficiency'     # tokens por qualidade
        ]

        # Configurações de tuning
        self.tuning_config = {
            'feedback_window': 100,      # Últimas N interações para análise
            'min_samples_for_tuning': 10, # Mínimo de amostras para ajuste
            'tuning_interval': 300,      # Segundos entre ajustes
            'exploration_rate': 0.1,     # % de exploração vs exploração
            'learning_rate': 0.01,       # Taxa de aprendizado
            'performance_threshold': 7.0 # Score mínimo considerado bom
        }

        # Estado atual dos modelos
        self.current_configs = {}
        self.performance_history = defaultdict(list)
        self.feedback_queue = queue.Queue()

        # Modelo de ML para predição de parâmetros ideais
        self.tuning_model = None
        self.scaler = None

        self._load_state()
        self._start_feedback_processor()

    def _load_state(self):
        """Carrega estado salvo dos modelos"""
        try:
            if os.path.exists(self.models_db):
                with open(self.models_db, 'r') as f:
                    self.current_configs = json.load(f)
                print("✅ Configurações de modelos carregadas")
        except Exception as e:
            print(f"Aviso ao carregar configurações: {e}")

        try:
            if os.path.exists(self.tuning_history):
                with open(self.tuning_history, 'r') as f:
                    history = json.load(f)
                    self.performance_history = defaultdict(list, history)
                print("✅ Histórico de tuning carregado")
        except Exception as e:
            print(f"Aviso ao carregar histórico: {e}")

        # Carregar modelo de ML se existir
        try:
            if os.path.exists('data/tuning_model.pkl'):
                self.tuning_model = joblib.load('data/tuning_model.pkl')
                self.scaler = joblib.load('data/tuning_scaler.pkl')
                print("✅ Modelo de tuning carregado")
        except Exception as e:
            print(f"Aviso ao carregar modelo: {e}")

    def _save_state(self):
        """Salva estado atual"""
        try:
            os.makedirs('data', exist_ok=True)

            with open(self.models_db, 'w') as f:
                json.dump(self.current_configs, f, indent=2)

            with open(self.tuning_history, 'w') as f:
                json.dump(dict(self.performance_history), f, indent=2)

        except Exception as e:
            print(f"Erro ao salvar estado: {e}")

    def _start_feedback_processor(self):
        """Inicia processador de feedback em background"""
        def process_feedback():
            while True:
                try:
                    feedback = self.feedback_queue.get(timeout=1)
                    self._process_feedback(feedback)
                    self.feedback_queue.task_done()
                except queue.Empty:
                    continue
                except Exception as e:
                    print(f"Erro no processamento de feedback: {e}")

        thread = threading.Thread(target=process_feedback, daemon=True)
        thread.start()

    def record_interaction(self, model_name, parameters, prompt, response, context=None):
        """Registra uma interação com a IA para análise posterior"""
        interaction = {
            'id': f"{int(time.time())}_{hash(prompt) % 10000}",
            'timestamp': datetime.now().isoformat(),
            'model': model_name,
            'parameters': parameters,
            'prompt': prompt,
            'response': response,
            'context': context or {},
            'feedback_pending': True,
            'quality_scores': {}
        }

        # Salvar interação
        self._save_interaction(interaction)

        return interaction['id']

    def submit_feedback(self, interaction_id, feedback_data):
        """Submete feedback para uma interação"""
        feedback = {
            'interaction_id': interaction_id,
            'timestamp': datetime.now().isoformat(),
            'scores': {},
            'comments': feedback_data.get('comments', ''),
            'user_id': feedback_data.get('user_id'),
            'session_id': feedback_data.get('session_id')
        }

        # Validar e processar scores
        for metric in self.quality_metrics:
            if metric in feedback_data:
                score = float(feedback_data[metric])
                score = max(0, min(10, score))  # Limitar entre 0-10
                feedback['scores'][metric] = score

        # Colocar na fila de processamento
        self.feedback_queue.put(feedback)

        return True

    def _process_feedback(self, feedback):
        """Processa feedback recebido"""
        try:
            # Carregar interação original
            interaction = self._load_interaction(feedback['interaction_id'])
            if not interaction:
                return

            # Atualizar interação com feedback
            interaction['quality_scores'] = feedback['scores']
            interaction['feedback_pending'] = False
            interaction['feedback_timestamp'] = feedback['timestamp']

            # Salvar interação atualizada
            self._save_interaction(interaction)

            # Adicionar ao histórico de performance
            model_name = interaction['model']
            performance_data = {
                'timestamp': feedback['timestamp'],
                'parameters': interaction['parameters'],
                'scores': feedback['scores'],
                'context': interaction.get('context', {})
            }

            self.performance_history[model_name].append(performance_data)

            # Manter apenas últimas N interações
            if len(self.performance_history[model_name]) > self.tuning_config['feedback_window']:
                self.performance_history[model_name] = self.performance_history[model_name][-self.tuning_config['feedback_window']:]

            # Trigger tuning se necessário
            if len(self.performance_history[model_name]) >= self.tuning_config['min_samples_for_tuning']:
                self._consider_tuning(model_name)

        except Exception as e:
            print(f"Erro ao processar feedback: {e}")

    def _consider_tuning(self, model_name):
        """Avalia se deve fazer tuning baseado na performance recente"""
        recent_performance = self.performance_history[model_name][-10:]  # Últimas 10

        # Calcular média dos scores principais
        avg_scores = {}
        for metric in self.quality_metrics[:6]:  # Ignorar tempo e eficiência por enquanto
            scores = [p['scores'].get(metric, 0) for p in recent_performance if metric in p['scores']]
            if scores:
                avg_scores[metric] = np.mean(scores)

        # Verificar se performance está abaixo do threshold
        main_metrics = ['relevance_score', 'accuracy_score', 'helpfulness_score']
        avg_main = np.mean([avg_scores.get(m, 0) for m in main_metrics])

        if avg_main < self.tuning_config['performance_threshold']:
            print(f"🎯 Performance baixa detectada para {model_name} ({avg_main:.1f}). Iniciando tuning...")
            self.optimize_parameters(model_name)
        else:
            print(f"✅ Performance de {model_name} está boa ({avg_main:.1f})")

    def optimize_parameters(self, model_name):
        """Otimiza parâmetros do modelo baseado no histórico"""
        if model_name not in self.parameter_ranges:
            print(f"Modelo {model_name} não suportado para tuning")
            return

        print(f"🔧 Otimizando parâmetros para {model_name}...")

        # Preparar dados de treinamento
        training_data = self.performance_history[model_name]
        if len(training_data) < self.tuning_config['min_samples_for_tuning']:
            print("Dados insuficientes para otimização")
            return

        # Extrair features e targets
        X = []
        y = []

        for interaction in training_data:
            if not interaction['scores']:
                continue

            # Features: parâmetros atuais
            features = []
            for param_name in self.parameter_ranges[model_name].keys():
                param_value = interaction['parameters'].get(param_name, 0)
                features.append(param_value)

            # Target: média dos scores de qualidade
            quality_scores = [interaction['scores'].get(m, 5) for m in self.quality_metrics[:5]]  # Top 5 métricas
            avg_quality = np.mean(quality_scores)

            X.append(features)
            y.append(avg_quality)

        if len(X) < 5:
            print("Dados insuficientes para treinamento")
            return

        # Treinar modelo de otimização
        X = np.array(X)
        y = np.array(y)

        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)

        model = RandomForestRegressor(n_estimators=50, random_state=42)
        model.fit(X_scaled, y)

        # Salvar modelo
        os.makedirs('data', exist_ok=True)
        joblib.dump(model, 'data/tuning_model.pkl')
        joblib.dump(scaler, 'data/tuning_scaler.pkl')

        self.tuning_model = model
        self.scaler = scaler

        # Encontrar melhores parâmetros
        best_params = self._find_optimal_parameters(model_name, model, scaler)
        self.current_configs[model_name] = best_params

        self._save_state()

        print(f"✅ Parâmetros otimizados para {model_name}:")
        for param, value in best_params.items():
            print(f"   {param}: {value}")

        return best_params

    def _find_optimal_parameters(self, model_name, tuning_model, scaler):
        """Encontra parâmetros ideais usando otimização"""
        param_ranges = self.parameter_ranges[model_name]

        # Explorar espaço de parâmetros
        best_score = -1
        best_params = {}

        # Testar múltiplas combinações
        for _ in range(100):  # 100 tentativas
            # Gerar parâmetros aleatórios dentro dos limites
            test_params = {}
            features = []

            for param_name, (min_val, max_val) in param_ranges.items():
                if param_name == 'max_tokens' or param_name == 'max_output_tokens':
                    # Valores discretos para limites
                    value = np.random.choice([100, 500, 1000, 2000, 4000])
                else:
                    # Valores contínuos
                    value = np.random.uniform(min_val, max_val)

                test_params[param_name] = round(value, 3) if isinstance(value, float) else value
                features.append(value)

            # Prever score com o modelo de tuning
            X_test = scaler.transform([features])
            predicted_score = tuning_model.predict(X_test)[0]

            # Adicionar exploração aleatória
            if np.random.random() < self.tuning_config['exploration_rate']:
                predicted_score += np.random.normal(0, 0.5)

            if predicted_score > best_score:
                best_score = predicted_score
                best_params = test_params.copy()

        return best_params

    def get_optimal_parameters(self, model_name, context=None):
        """Retorna parâmetros ideais para um modelo dado o contexto"""
        if model_name not in self.current_configs:
            # Usar parâmetros padrão
            return self._get_default_parameters(model_name)

        base_params = self.current_configs[model_name].copy()

        # Ajustar baseado no contexto
        if context:
            if context.get('creative_task'):
                # Tarefas criativas: aumentar temperature
                if 'temperature' in base_params:
                    base_params['temperature'] = min(1.0, base_params['temperature'] * 1.2)

            if context.get('factual_task'):
                # Tarefas factuais: diminuir temperature
                if 'temperature' in base_params:
                    base_params['temperature'] = max(0.1, base_params['temperature'] * 0.8)

            if context.get('long_response'):
                # Respostas longas: aumentar max_tokens
                token_param = 'max_tokens' if 'max_tokens' in base_params else 'max_output_tokens'
                if token_param in base_params:
                    base_params[token_param] = min(4000, base_params[token_param] * 2)

        return base_params

    def _get_default_parameters(self, model_name):
        """Retorna parâmetros padrão para um modelo"""
        defaults = {
            'claude-3-opus': {
                'temperature': 0.7,
                'top_p': 0.9,
                'top_k': 250,
                'max_tokens': 2000
            },
            'gpt-4': {
                'temperature': 0.7,
                'top_p': 0.9,
                'frequency_penalty': 0.0,
                'presence_penalty': 0.0,
                'max_tokens': 2000
            },
            'gemini-pro': {
                'temperature': 0.7,
                'top_p': 0.8,
                'top_k': 32,
                'max_output_tokens': 1024
            }
        }

        return defaults.get(model_name, {})

    def _save_interaction(self, interaction):
        """Salva interação no banco de dados"""
        try:
            os.makedirs('data/interactions', exist_ok=True)
            filename = f"data/interactions/{interaction['id']}.json"

            with open(filename, 'w') as f:
                json.dump(interaction, f, indent=2)

        except Exception as e:
            print(f"Erro ao salvar interação: {e}")

    def _load_interaction(self, interaction_id):
        """Carrega interação do banco"""
        try:
            filename = f"data/interactions/{interaction_id}.json"
            if os.path.exists(filename):
                with open(filename, 'r') as f:
                    return json.load(f)
        except Exception as e:
            print(f"Erro ao carregar interação: {e}")
        return None

    def get_performance_stats(self, model_name=None, days=7):
        """Retorna estatísticas de performance"""
        cutoff_date = datetime.now() - timedelta(days=days)

        stats = {}

        models_to_check = [model_name] if model_name else list(self.performance_history.keys())

        for model in models_to_check:
            if model not in self.performance_history:
                continue

            recent_data = [
                p for p in self.performance_history[model]
                if datetime.fromisoformat(p['timestamp']) > cutoff_date
            ]

            if not recent_data:
                continue

            # Calcular médias
            avg_scores = {}
            for metric in self.quality_metrics:
                scores = [p['scores'].get(metric, 0) for p in recent_data if metric in p['scores']]
                if scores:
                    avg_scores[metric] = {
                        'mean': round(np.mean(scores), 2),
                        'std': round(np.std(scores), 2),
                        'min': min(scores),
                        'max': max(scores)
                    }

            # Calcular tendência
            if len(recent_data) >= 5:
                first_half = recent_data[:len(recent_data)//2]
                second_half = recent_data[len(recent_data)//2:]

                first_avg = np.mean([np.mean(list(p['scores'].values())) for p in first_half])
                second_avg = np.mean([np.mean(list(p['scores'].values())) for p in second_half])

                trend = "improving" if second_avg > first_avg else "declining" if second_avg < first_avg else "stable"

                stats[model] = {
                    'total_interactions': len(recent_data),
                    'avg_scores': avg_scores,
                    'trend': trend,
                    'trend_change': round(second_avg - first_avg, 2),
                    'current_config': self.current_configs.get(model, {})
                }

        return stats

    def export_tuning_data(self, model_name=None):
        """Exporta dados de tuning para análise externa"""
        data = {
            'exported_at': datetime.now().isoformat(),
            'models': {},
            'summary': {}
        }

        models_to_export = [model_name] if model_name else list(self.performance_history.keys())

        for model in models_to_export:
            if model in self.performance_history:
                data['models'][model] = {
                    'config': self.current_configs.get(model, {}),
                    'performance_history': self.performance_history[model],
                    'total_interactions': len(self.performance_history[model])
                }

        # Estatísticas gerais
        all_scores = []
        for model_data in data['models'].values():
            for interaction in model_data['performance_history']:
                if interaction['scores']:
                    all_scores.extend(list(interaction['scores'].values()))

        if all_scores:
            data['summary'] = {
                'total_interactions': sum(len(m['performance_history']) for m in data['models'].values()),
                'overall_avg_score': round(np.mean(all_scores), 2),
                'score_distribution': {
                    'excellent': len([s for s in all_scores if s >= 9]),
                    'good': len([s for s in all_scores if 7 <= s < 9]),
                    'average': len([s for s in all_scores if 5 <= s < 7]),
                    'poor': len([s for s in all_scores if s < 5])
                }
            }

        filename = f"data/ai_tuning_export_{int(time.time())}.json"
        with open(filename, 'w') as f:
            json.dump(data, f, indent=2)

        print(f"📤 Dados exportados para: {filename}")
        return filename

def main():
    """Função principal"""
    tuner = NeuroAITuner()

    import sys
    if len(sys.argv) < 2:
        print("🧠 Neuro AI Tuner - Otimização de Parâmetros IA")
        print("Comandos disponíveis:")
        print("  optimize <model>         - Otimizar parâmetros de modelo")
        print("  feedback <id> <scores>   - Submeter feedback (ex: relevance:8,accuracy:7)")
        print("  stats [model]            - Ver estatísticas de performance")
        print("  config <model>           - Ver configuração atual")
        print("  export [model]           - Exportar dados de tuning")
        print("  parameters <model>       - Obter parâmetros ideais")
        print("\nModelos suportados: claude-3-opus, gpt-4, gemini-pro")
        return

    command = sys.argv[1]

    try:
        if command == 'optimize':
            if len(sys.argv) < 3:
                print("Uso: python neuro_ai_tuner.py optimize <model>")
                return
            model = sys.argv[2]
            result = tuner.optimize_parameters(model)
            if result:
                print(f"✅ Parâmetros otimizados para {model}")

        elif command == 'feedback':
            if len(sys.argv) < 4:
                print("Uso: python neuro_ai_tuner.py feedback <interaction_id> <scores>")
                print("Exemplo: feedback 12345 relevance:8,accuracy:9,helpfulness:7")
                return

            interaction_id = sys.argv[2]
            scores_str = sys.argv[3]

            # Parse scores
            scores = {}
            for pair in scores_str.split(','):
                key, value = pair.split(':')
                scores[key.strip() + '_score'] = float(value.strip())

            feedback_data = {'scores': scores}
            tuner.submit_feedback(interaction_id, feedback_data)
            print(f"✅ Feedback submetido para interação {interaction_id}")

        elif command == 'stats':
            model = sys.argv[2] if len(sys.argv) > 2 else None
            stats = tuner.get_performance_stats(model)
            print("📊 ESTATÍSTICAS DE PERFORMANCE:")
            print(json.dumps(stats, indent=2))

        elif command == 'config':
            if len(sys.argv) < 3:
                print("Uso: python neuro_ai_tuner.py config <model>")
                return
            model = sys.argv[2]
            config = tuner.current_configs.get(model, tuner._get_default_parameters(model))
            print(f"⚙️ Configuração atual para {model}:")
            print(json.dumps(config, indent=2))

        elif command == 'export':
            model = sys.argv[2] if len(sys.argv) > 2 else None
            filename = tuner.export_tuning_data(model)
            print(f"📤 Dados exportados: {filename}")

        elif command == 'parameters':
            if len(sys.argv) < 3:
                print("Uso: python neuro_ai_tuner.py parameters <model>")
                return
            model = sys.argv[2]
            params = tuner.get_optimal_parameters(model)
            print(f"🎯 Parâmetros ideais para {model}:")
            print(json.dumps(params, indent=2))

        else:
            print("Comando não reconhecido. Use sem argumentos para ver ajuda.")

    except Exception as e:
        print(f"❌ Erro: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()