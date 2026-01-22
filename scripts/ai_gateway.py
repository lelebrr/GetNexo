#!/usr/bin/env python3
"""
GetNexo AI Gateway - Roteador Inteligente de IA
Sistema de orquestração multi-LLM que seleciona automaticamente a melhor IA baseada em custo, qualidade e contexto
"""

import os
import json
import time
import requests
import hashlib
import asyncio
from datetime import datetime, timedelta
from collections import defaultdict, deque
import threading
import statistics
import random

class AIGateway:
    def __init__(self):
        self.usage_log = 'data/ai_gateway_usage.json'
        self.performance_metrics = 'data/ai_performance.json'
        self.model_configs = 'data/model_configs.json'

        # Configurações dos provedores de IA
        self.providers = {
            'anthropic': {
                'api_key': os.getenv('ANTHROPIC_API_KEY'),
                'base_url': 'https://api.anthropic.com/v1/messages',
                'models': {
                    'claude-3-opus-20240229': {
                        'cost_per_token': 0.015,
                        'max_tokens': 200000,
                        'strengths': ['creative_writing', 'analysis', 'code_generation'],
                        'weaknesses': ['real_time', 'simple_qa']
                    },
                    'claude-3-sonnet-20240229': {
                        'cost_per_token': 0.008,
                        'max_tokens': 200000,
                        'strengths': ['general_purpose', 'conversation', 'analysis'],
                        'weaknesses': ['specialized_math', 'real_time']
                    },
                    'claude-3-haiku-20240307': {
                        'cost_per_token': 0.0005,
                        'max_tokens': 200000,
                        'strengths': ['fast_response', 'simple_tasks', 'classification'],
                        'weaknesses': ['complex_reasoning', 'creative_writing']
                    }
                }
            },
            'openai': {
                'api_key': os.getenv('OPENAI_API_KEY'),
                'base_url': 'https://api.openai.com/v1/chat/completions',
                'models': {
                    'gpt-4-turbo': {
                        'cost_per_token': 0.01,
                        'max_tokens': 128000,
                        'strengths': ['complex_reasoning', 'code_generation', 'analysis'],
                        'weaknesses': ['real_time_speed', 'cost_efficiency']
                    },
                    'gpt-4': {
                        'cost_per_token': 0.03,
                        'max_tokens': 8192,
                        'strengths': ['reasoning', 'analysis', 'creative_writing'],
                        'weaknesses': ['speed', 'cost', 'context_window']
                    },
                    'gpt-3.5-turbo': {
                        'cost_per_token': 0.0015,
                        'max_tokens': 16384,
                        'strengths': ['speed', 'cost_efficiency', 'general_conversation'],
                        'weaknesses': ['complex_reasoning', 'creative_depth']
                    }
                }
            },
            'google': {
                'api_key': os.getenv('GOOGLE_AI_KEY'),
                'base_url': 'https://generativelanguage.googleapis.com/v1beta/models',
                'models': {
                    'gemini-pro': {
                        'cost_per_token': 0.0005,
                        'max_tokens': 32768,
                        'strengths': ['multimodal', 'factual_knowledge', 'speed'],
                        'weaknesses': ['creative_writing', 'code_generation']
                    },
                    'gemini-pro-vision': {
                        'cost_per_token': 0.001,
                        'max_tokens': 16384,
                        'strengths': ['image_understanding', 'multimodal', 'factual'],
                        'weaknesses': ['text_only_tasks', 'creative_writing']
                    }
                }
            },
            'replicate': {
                'api_key': os.getenv('REPLICATE_API_KEY'),
                'base_url': 'https://api.replicate.com/v1/predictions',
                'models': {
                    'llama-2-70b-chat': {
                        'cost_per_token': 0.0008,
                        'max_tokens': 4096,
                        'strengths': ['open_source', 'customizable', 'cost_efficient'],
                        'weaknesses': ['quality_vs_closed', 'speed']
                    },
                    'codellama-34b-instruct': {
                        'cost_per_token': 0.0008,
                        'max_tokens': 16384,
                        'strengths': ['code_generation', 'technical_writing'],
                        'weaknesses': ['general_conversation', 'creative_writing']
                    }
                }
            }
        }

        # Critérios de roteamento
        self.routing_criteria = {
            'cost_priority': {
                'weights': {'cost': 0.8, 'speed': 0.1, 'quality': 0.1},
                'preferred_providers': ['replicate', 'google', 'openai']
            },
            'quality_priority': {
                'weights': {'quality': 0.7, 'cost': 0.2, 'speed': 0.1},
                'preferred_providers': ['anthropic', 'openai', 'google']
            },
            'speed_priority': {
                'weights': {'speed': 0.8, 'cost': 0.15, 'quality': 0.05},
                'preferred_providers': ['google', 'openai', 'anthropic']
            },
            'balanced': {
                'weights': {'quality': 0.4, 'cost': 0.35, 'speed': 0.25},
                'preferred_providers': ['anthropic', 'openai', 'google', 'replicate']
            }
        }

        # Mapeamento de tarefas para modelos
        self.task_mapping = {
            'code_generation': ['codellama-34b-instruct', 'gpt-4-turbo', 'claude-3-opus-20240229'],
            'creative_writing': ['claude-3-opus-20240229', 'gpt-4', 'gemini-pro'],
            'analysis': ['claude-3-sonnet-20240229', 'gpt-4-turbo', 'gpt-4'],
            'conversation': ['gpt-3.5-turbo', 'claude-3-haiku-20240307', 'gemini-pro'],
            'classification': ['claude-3-haiku-20240307', 'gpt-3.5-turbo', 'gemini-pro'],
            'math': ['gpt-4-turbo', 'claude-3-sonnet-20240229'],
            'image_analysis': ['gemini-pro-vision'],
            'fast_response': ['gpt-3.5-turbo', 'claude-3-haiku-20240307', 'gemini-pro']
        }

        # Estado do sistema
        self.usage_stats = defaultdict(lambda: {'requests': 0, 'tokens': 0, 'cost': 0.0, 'errors': 0})
        self.performance_stats = defaultdict(lambda: {'response_times': deque(maxlen=100), 'quality_scores': deque(maxlen=100)})
        self.current_strategy = 'balanced'
        self.request_queue = asyncio.Queue()

        self._load_state()
        self._start_monitoring()

    def _load_state(self):
        """Carrega estado salvo"""
        try:
            if os.path.exists(self.usage_log):
                with open(self.usage_log, 'r') as f:
                    usage_data = json.load(f)
                    self.usage_stats.update(usage_data)
                print("✅ Estatísticas de uso carregadas")
        except Exception as e:
            print(f"Aviso ao carregar uso: {e}")

        try:
            if os.path.exists(self.performance_metrics):
                with open(self.performance_metrics, 'r') as f:
                    perf_data = json.load(f)
                    for model, data in perf_data.items():
                        self.performance_stats[model]['response_times'] = deque(data.get('response_times', []), maxlen=100)
                        self.performance_stats[model]['quality_scores'] = deque(data.get('quality_scores', []), maxlen=100)
                print("✅ Métricas de performance carregadas")
        except Exception as e:
            print(f"Aviso ao carregar performance: {e}")

    def _save_state(self):
        """Salva estado atual"""
        try:
            # Salvar uso
            with open(self.usage_log, 'w') as f:
                json.dump(dict(self.usage_stats), f, indent=2)

            # Salvar performance
            perf_data = {}
            for model, stats in self.performance_stats.items():
                perf_data[model] = {
                    'response_times': list(stats['response_times']),
                    'quality_scores': list(stats['quality_scores'])
                }

            with open(self.performance_metrics, 'w') as f:
                json.dump(perf_data, f, indent=2)

        except Exception as e:
            print(f"Erro ao salvar estado: {e}")

    def _start_monitoring(self):
        """Inicia monitoramento em background"""
        def monitor_loop():
            while True:
                try:
                    # Salvar estado periodicamente
                    time.sleep(300)  # A cada 5 minutos
                    self._save_state()
                except Exception as e:
                    print(f"Erro no monitoramento: {e}")

        thread = threading.Thread(target=monitor_loop, daemon=True)
        thread.start()

    def route_request(self, prompt, task_type=None, priority='balanced', context=None, **kwargs):
        """Roteia requisição para o melhor modelo disponível"""
        start_time = time.time()

        # Determinar tipo de tarefa se não especificado
        if not task_type:
            task_type = self._classify_task(prompt)

        # Selecionar estratégia de roteamento
        strategy = self.routing_criteria.get(priority, self.routing_criteria['balanced'])

        # Encontrar melhor modelo
        best_model, best_provider, score = self._select_best_model(task_type, strategy, context)

        if not best_model:
            raise Exception("Nenhum modelo disponível atende aos critérios")

        # Executar requisição
        try:
            result = self._execute_request(best_provider, best_model, prompt, **kwargs)

            # Registrar métricas
            response_time = time.time() - start_time
            self._record_metrics(best_model, response_time, result.get('quality_score', 0.8), result)

            result['routing_info'] = {
                'selected_model': best_model,
                'provider': best_provider,
                'task_type': task_type,
                'routing_score': score,
                'response_time': round(response_time, 3)
            }

            return result

        except Exception as e:
            # Registrar erro
            self.usage_stats[best_model]['errors'] += 1
            raise e

    def _classify_task(self, prompt):
        """Classifica automaticamente o tipo de tarefa"""
        prompt_lower = prompt.lower()

        # Regras simples de classificação
        if any(keyword in prompt_lower for keyword in ['def ', 'function', 'class ', 'import ', 'code']):
            return 'code_generation'
        elif any(keyword in prompt_lower for keyword in ['write a story', 'creative', 'poem', 'novel']):
            return 'creative_writing'
        elif any(keyword in prompt_lower for keyword in ['analyze', 'explain', 'what is', 'how does']):
            return 'analysis'
        elif any(keyword in prompt_lower for keyword in ['classify', 'categorize', 'label']):
            return 'classification'
        elif any(keyword in prompt_lower for keyword in ['calculate', 'solve', 'equation', 'math']):
            return 'math'
        elif len(prompt.split()) < 10:
            return 'fast_response'
        else:
            return 'conversation'

    def _select_best_model(self, task_type, strategy, context=None):
        """Seleciona o melhor modelo baseado nos critérios"""
        candidates = self.task_mapping.get(task_type, [])

        if not candidates:
            # Fallback para modelos gerais
            candidates = ['gpt-3.5-turbo', 'claude-3-haiku-20240307', 'gemini-pro']

        best_score = -1
        best_model = None
        best_provider = None

        for model_name in candidates:
            # Encontrar provider do modelo
            provider = None
            model_config = None

            for prov_name, prov_config in self.providers.items():
                if model_name in prov_config['models']:
                    provider = prov_name
                    model_config = prov_config['models'][model_name]
                    break

            if not provider or not model_config:
                continue

            # Verificar se provider está disponível
            if not self.providers[provider]['api_key']:
                continue

            # Calcular score baseado na estratégia
            score = self._calculate_model_score(model_name, model_config, strategy, context)

            if score > best_score:
                best_score = score
                best_model = model_name
                best_provider = provider

        return best_model, best_provider, best_score

    def _calculate_model_score(self, model_name, model_config, strategy, context=None):
        """Calcula score de adequação do modelo"""
        weights = strategy['weights']

        # Score de qualidade (baseado em histórico)
        quality_stats = self.performance_stats[model_name]['quality_scores']
        quality_score = statistics.mean(quality_stats) if quality_stats else 0.7

        # Score de velocidade (baseado em histórico)
        speed_stats = self.performance_stats[model_name]['response_times']
        avg_response_time = statistics.mean(speed_stats) if speed_stats else 2.0
        speed_score = max(0, 1 - (avg_response_time / 10))  # Normalizar para 0-1

        # Score de custo (inverter - menor custo = maior score)
        cost_score = max(0, 1 - (model_config['cost_per_token'] * 1000))  # Normalizar

        # Calcular score ponderado
        total_score = (
            quality_score * weights.get('quality', 0.4) +
            speed_score * weights.get('speed', 0.3) +
            cost_score * weights.get('cost', 0.3)
        )

        # Bônus para provedores preferidos
        if any(model_name in self.providers[prov]['models'] for prov in strategy['preferred_providers']):
            total_score *= 1.2

        # Penalidade por alta taxa de erro
        error_rate = self.usage_stats[model_name]['errors'] / max(1, self.usage_stats[model_name]['requests'])
        if error_rate > 0.1:  # Mais de 10% de erro
            total_score *= 0.8

        return total_score

    def _execute_request(self, provider, model, prompt, **kwargs):
        """Executa requisição no provider específico"""
        if provider == 'anthropic':
            return self._call_anthropic(model, prompt, **kwargs)
        elif provider == 'openai':
            return self._call_openai(model, prompt, **kwargs)
        elif provider == 'google':
            return self._call_google(model, prompt, **kwargs)
        elif provider == 'replicate':
            return self._call_replicate(model, prompt, **kwargs)
        else:
            raise Exception(f"Provider {provider} não suportado")

    def _call_anthropic(self, model, prompt, **kwargs):
        """Chama API da Anthropic"""
        url = self.providers['anthropic']['base_url']
        headers = {
            'x-api-key': self.providers['anthropic']['api_key'],
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json'
        }

        max_tokens = min(kwargs.get('max_tokens', 1000), 4000)

        data = {
            'model': model,
            'max_tokens': max_tokens,
            'messages': [{'role': 'user', 'content': prompt}]
        }

        if 'temperature' in kwargs:
            data['temperature'] = kwargs['temperature']

        response = requests.post(url, headers=headers, json=data, timeout=60)
        response.raise_for_status()

        result = response.json()
        content = result['content'][0]['text']

        # Estimar tokens (simplificado)
        estimated_tokens = len(content.split()) * 1.3

        return {
            'content': content,
            'provider': 'anthropic',
            'model': model,
            'estimated_tokens': int(estimated_tokens),
            'finish_reason': result.get('stop_reason', 'completed')
        }

    def _call_openai(self, model, prompt, **kwargs):
        """Chama API da OpenAI"""
        url = self.providers['openai']['base_url']
        headers = {
            'Authorization': f"Bearer {self.providers['openai']['api_key']}",
            'Content-Type': 'application/json'
        }

        max_tokens = min(kwargs.get('max_tokens', 1000), 4000)

        data = {
            'model': model,
            'messages': [{'role': 'user', 'content': prompt}],
            'max_tokens': max_tokens
        }

        if 'temperature' in kwargs:
            data['temperature'] = kwargs['temperature']

        response = requests.post(url, headers=headers, json=data, timeout=60)
        response.raise_for_status()

        result = response.json()
        content = result['choices'][0]['message']['content']
        usage = result.get('usage', {})

        return {
            'content': content,
            'provider': 'openai',
            'model': model,
            'estimated_tokens': usage.get('total_tokens', len(content.split()) * 1.3),
            'finish_reason': result['choices'][0]['finish_reason']
        }

    def _call_google(self, model, prompt, **kwargs):
        """Chama API do Google"""
        url = f"{self.providers['google']['base_url']}/{model}:generateContent"
        params = {'key': self.providers['google']['api_key']}

        data = {
            'contents': [{
                'parts': [{'text': prompt}]
            }]
        }

        if 'temperature' in kwargs:
            data['generationConfig'] = {'temperature': kwargs['temperature']}

        response = requests.post(url, params=params, json=data, timeout=60)
        response.raise_for_status()

        result = response.json()
        content = result['candidates'][0]['content']['parts'][0]['text']

        return {
            'content': content,
            'provider': 'google',
            'model': model,
            'estimated_tokens': len(content.split()) * 1.3,
            'finish_reason': 'completed'
        }

    def _call_replicate(self, model, prompt, **kwargs):
        """Chama API da Replicate"""
        url = self.providers['replicate']['base_url']
        headers = {
            'Authorization': f"Token {self.providers['replicate']['api_key']}",
            'Content-Type': 'application/json'
        }

        data = {
            'version': model,
            'input': {
                'prompt': prompt,
                'max_length': min(kwargs.get('max_tokens', 1000), 4000),
                'temperature': kwargs.get('temperature', 0.7)
            }
        }

        response = requests.post(url, headers=headers, json=data, timeout=30)
        response.raise_for_status()

        prediction_url = response.json()['urls']['get']

        # Aguardar conclusão
        max_attempts = 60  # 5 minutos máximo
        for attempt in range(max_attempts):
            status_response = requests.get(prediction_url, headers=headers)
            status_response.raise_for_status()
            status = status_response.json()

            if status['status'] == 'succeeded':
                content = status['output']
                return {
                    'content': content,
                    'provider': 'replicate',
                    'model': model,
                    'estimated_tokens': len(content.split()) * 1.3,
                    'finish_reason': 'completed'
                }
            elif status['status'] == 'failed':
                raise Exception("Falha na geração com Replicate")

            time.sleep(5)

        raise Exception("Timeout na geração com Replicate")

    def _record_metrics(self, model_name, response_time, quality_score, result):
        """Registra métricas da requisição"""
        # Atualizar estatísticas de uso
        self.usage_stats[model_name]['requests'] += 1
        self.usage_stats[model_name]['tokens'] += result.get('estimated_tokens', 0)

        model_config = None
        for provider in self.providers.values():
            if model_name in provider['models']:
                model_config = provider['models'][model_name]
                break

        if model_config:
            cost = result.get('estimated_tokens', 0) * model_config['cost_per_token'] / 1000
            self.usage_stats[model_name]['cost'] += cost

        # Atualizar métricas de performance
        self.performance_stats[model_name]['response_times'].append(response_time)
        self.performance_stats[model_name]['quality_scores'].append(quality_score)

    def get_routing_stats(self):
        """Retorna estatísticas de roteamento"""
        total_requests = sum(stats['requests'] for stats in self.usage_stats.values())
        total_cost = sum(stats['cost'] for stats in self.usage_stats.values())
        total_tokens = sum(stats['tokens'] for stats in self.usage_stats.values())

        # Estatísticas por modelo
        model_stats = {}
        for model, stats in self.usage_stats.items():
            if stats['requests'] > 0:
                error_rate = stats['errors'] / stats['requests']
                avg_response_time = statistics.mean(self.performance_stats[model]['response_times']) if self.performance_stats[model]['response_times'] else 0
                avg_quality = statistics.mean(self.performance_stats[model]['quality_scores']) if self.performance_stats[model]['quality_scores'] else 0

                model_stats[model] = {
                    'requests': stats['requests'],
                    'tokens': stats['tokens'],
                    'cost': round(stats['cost'], 4),
                    'error_rate': round(error_rate * 100, 2),
                    'avg_response_time': round(avg_response_time, 3),
                    'avg_quality_score': round(avg_quality, 3)
                }

        return {
            'total_requests': total_requests,
            'total_cost': round(total_cost, 4),
            'total_tokens': total_tokens,
            'models': model_stats,
            'current_strategy': self.current_strategy,
            'available_providers': list(self.providers.keys())
        }

    def set_routing_strategy(self, strategy):
        """Define estratégia de roteamento"""
        if strategy not in self.routing_criteria:
            raise Exception(f"Estratégia '{strategy}' não encontrada. Opções: {list(self.routing_criteria.keys())}")

        self.current_strategy = strategy
        print(f"✅ Estratégia de roteamento alterada para: {strategy}")

    def get_available_models(self):
        """Retorna modelos disponíveis por provider"""
        available = {}

        for provider_name, provider in self.providers.items():
            if provider['api_key']:
                available[provider_name] = {
                    'models': list(provider['models'].keys()),
                    'status': 'available'
                }
            else:
                available[provider_name] = {
                    'models': list(provider['models'].keys()),
                    'status': 'no_api_key'
                }

        return available

def main():
    """Função principal"""
    gateway = AIGateway()

    import sys
    if len(sys.argv) < 2:
        print("🤖 AI Gateway - Roteador Inteligente de IA")
        print("Comandos disponíveis:")
        print("  ask <prompt> [task_type] [priority] - Fazer pergunta inteligente")
        print("  stats                               - Ver estatísticas de roteamento")
        print("  models                              - Ver modelos disponíveis")
        print("  strategy <type>                     - Alterar estratégia de roteamento")
        print("  test <model> <prompt>               - Testar modelo específico")
        print("\nEstratégias: balanced, cost_priority, quality_priority, speed_priority")
        print("Task types: code_generation, creative_writing, analysis, conversation, etc.")
        return

    command = sys.argv[1]

    try:
        if command == 'ask':
            if len(sys.argv) < 3:
                print("Uso: python ai_gateway.py ask <prompt> [task_type] [priority]")
                return

            prompt = sys.argv[2]
            task_type = sys.argv[3] if len(sys.argv) > 3 else None
            priority = sys.argv[4] if len(sys.argv) > 4 else 'balanced'

            result = gateway.route_request(prompt, task_type, priority)

            print("🤖 RESPOSTA:")
            print(result['content'])
            print(f"\n📊 Routing: {result['routing_info']['selected_model']} via {result['routing_info']['provider']}")
            print(f"⏱️ Tempo: {result['routing_info']['response_time']}s")

        elif command == 'stats':
            stats = gateway.get_routing_stats()
            print("📊 ESTATÍSTICAS DO AI GATEWAY:")
            print(f"Total de requests: {stats['total_requests']}")
            print(f"Custo total: ${stats['total_cost']}")
            print(f"Tokens totais: {stats['total_tokens']}")
            print(f"Estratégia atual: {stats['current_strategy']}")
            print("\nPor modelo:")
            for model, data in stats['models'].items():
                print(f"  {model}: {data['requests']} req, ${data['cost']}, {data['avg_response_time']}s avg")

        elif command == 'models':
            models = gateway.get_available_models()
            print("🔧 MODELOS DISPONÍVEIS:")
            for provider, data in models.items():
                status = "✅" if data['status'] == 'available' else "❌"
                print(f"{status} {provider}:")
                for model in data['models']:
                    print(f"   • {model}")

        elif command == 'strategy':
            if len(sys.argv) < 3:
                print("Uso: python ai_gateway.py strategy <type>")
                return
            strategy = sys.argv[2]
            gateway.set_routing_strategy(strategy)

        elif command == 'test':
            if len(sys.argv) < 4:
                print("Uso: python ai_gateway.py test <model> <prompt>")
                return

            model = sys.argv[2]
            prompt = ' '.join(sys.argv[3:])

            # Encontrar provider do modelo
            provider = None
            for prov_name, prov_config in gateway.providers.items():
                if model in prov_config['models']:
                    provider = prov_name
                    break

            if not provider:
                print(f"❌ Modelo {model} não encontrado")
                return

            result = gateway._execute_request(provider, model, prompt)
            print(f"🧪 Teste do modelo {model}:")
            print(result['content'])

        else:
            print("Comando não reconhecido. Use sem argumentos para ver ajuda.")

    except Exception as e:
        print(f"❌ Erro: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()