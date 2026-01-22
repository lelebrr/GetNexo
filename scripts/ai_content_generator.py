#!/usr/bin/env python3
"""
GetNexo AI Content Generator - Gerador de Conteúdo com IA
Sistema avançado de criação automática de conteúdo usando múltiplas IAs
"""

import os
import json
import requests
import time
from datetime import datetime, timedelta
import random
import re
from collections import defaultdict
import hashlib

class AIContentGenerator:
    def __init__(self):
        self.api_keys = {
            'openai': os.getenv('OPENAI_API_KEY'),
            'anthropic': os.getenv('ANTHROPIC_API_KEY'),
            'google': os.getenv('GOOGLE_AI_KEY'),
            'replicate': os.getenv('REPLICATE_API_KEY')
        }

        self.content_history = 'data/ai_content_history.json'
        self.templates_dir = 'data/content_templates/'

        # Modelos disponíveis
        self.models = {
            'gpt4': {'provider': 'openai', 'model': 'gpt-4', 'cost_per_token': 0.03},
            'claude': {'provider': 'anthropic', 'model': 'claude-3-opus-20240229', 'cost_per_token': 0.015},
            'gemini': {'provider': 'google', 'model': 'gemini-pro', 'cost_per_token': 0.001},
            'llama': {'provider': 'replicate', 'model': 'meta/llama-2-70b-chat', 'cost_per_token': 0.0008}
        }

        # Templates de conteúdo
        self.content_templates = {
            'blog_post': self._blog_template(),
            'social_media': self._social_template(),
            'email_campaign': self._email_template(),
            'product_description': self._product_template(),
            'technical_doc': self._technical_template(),
            'marketing_copy': self._marketing_template()
        }

        # Carregar histórico
        self._load_history()

    def _load_history(self):
        """Carrega histórico de conteúdo gerado"""
        try:
            if os.path.exists(self.content_history):
                with open(self.content_history, 'r', encoding='utf-8') as f:
                    self.history = json.load(f)
            else:
                self.history = {'contents': [], 'usage_stats': {}}
        except Exception as e:
            print(f"Aviso ao carregar histórico: {e}")
            self.history = {'contents': [], 'usage_stats': {}}

    def _save_history(self):
        """Salva histórico"""
        try:
            os.makedirs(os.path.dirname(self.content_history), exist_ok=True)
            with open(self.content_history, 'w', encoding='utf-8') as f:
                json.dump(self.history, f, indent=2, ensure_ascii=False)
        except Exception as e:
            print(f"Erro ao salvar histórico: {e}")

    def _blog_template(self):
        return {
            'structure': [
                'title',
                'introduction',
                'main_content',
                'conclusion',
                'meta_description',
                'tags'
            ],
            'prompt_template': """
            Escreva um post de blog completo sobre: {topic}

            Estrutura:
            1. Título atraente e otimizado para SEO
            2. Introdução cativante (3-4 parágrafos)
            3. Conteúdo principal com seções bem definidas
            4. Conclusão com call-to-action
            5. Meta description para SEO
            6. Tags relevantes

            Tom: {tone}
            Comprimento: {length}
            Público-alvo: {audience}
            Palavras-chave principais: {keywords}

            Garanta que o conteúdo seja original, informativo e envolvente.
            """,
            'default_params': {
                'tone': 'profissional e acessível',
                'length': '1200-1500 palavras',
                'audience': 'empreendedores e profissionais de marketing',
                'keywords': 'marketing digital, vendas, automação'
            }
        }

    def _social_template(self):
        return {
            'structure': ['post', 'hashtags', 'call_to_action'],
            'platforms': ['twitter', 'instagram', 'facebook', 'linkedin'],
            'prompt_template': """
            Crie posts para redes sociais sobre: {topic}

            Para cada plataforma ({platforms}), crie:
            1. Post principal (até {char_limit} caracteres)
            2. Hashtags relevantes (5-10)
            3. Call-to-action apropriado

            Tom: {tone}
            Objetivo: {objective}

            Mantenha o tom conversacional e envolvente.
            """,
            'default_params': {
                'tone': 'conversacional e amigável',
                'objective': 'gerar engajamento e tráfego',
                'char_limit': '280'
            }
        }

    def _email_template(self):
        return {
            'structure': ['subject', 'preview', 'body', 'footer'],
            'prompt_template': """
            Crie uma campanha de email sobre: {topic}

            Estrutura:
            1. Assunto atraente que gere abertura
            2. Prévia (preview text)
            3. Corpo do email com introdução, benefícios, prova social
            4. Call-to-action forte
            5. Footer com unsubscribe

            Tom: {tone}
            Objetivo: {objective}
            Segmento: {segment}

            Foque em conversão e mantenha pessoal.
            """,
            'default_params': {
                'tone': 'persuasivo e amigável',
                'objective': 'converter leads em clientes',
                'segment': 'potenciais clientes'
            }
        }

    def _product_template(self):
        return {
            'structure': ['headline', 'description', 'features', 'benefits', 'pricing'],
            'prompt_template': """
            Crie descrição de produto para: {product_name}

            Estrutura:
            1. Headline cativante
            2. Descrição completa (200-300 palavras)
            3. Lista de características principais
            4. Benefícios para o cliente
            5. Estratégia de precificação sugerida

            Tom: {tone}
            Público-alvo: {audience}
            Concorrente principal: {competitor}

            Destaque diferenciais únicos e valor agregado.
            """,
            'default_params': {
                'tone': 'persuasivo e confiável',
                'audience': 'consumidores finais',
                'competitor': 'soluções tradicionais'
            }
        }

    def _technical_template(self):
        return {
            'structure': ['overview', 'requirements', 'installation', 'usage', 'api_reference'],
            'prompt_template': """
            Crie documentação técnica para: {product_name}

            Estrutura:
            1. Visão geral e arquitetura
            2. Pré-requisitos e dependências
            3. Guia de instalação passo-a-passo
            4. Exemplos de uso práticos
            5. Referência da API (se aplicável)

            Nível técnico: {technical_level}
            Linguagem: {language}

            Seja preciso, detalhado e prático.
            """,
            'default_params': {
                'technical_level': 'intermediário',
                'language': 'português'
            }
        }

    def _marketing_template(self):
        return {
            'structure': ['headline', 'subheadline', 'body', 'proof', 'guarantee', 'scarcity'],
            'prompt_template': """
            Crie copy de marketing para: {product_service}

            Use a estrutura AIDA:
            1. Atenção (headline impactante)
            2. Interesse (benefícios principais)
            3. Desejo (prova social e diferenciais)
            4. Ação (call-to-action forte)

            Adicione elementos persuasivos:
            - Prova social
            - Garantia
            - Escassez/urgência

            Tom: {tone}
            Canal: {channel}
            Objetivo: {objective}

            Foque em benefícios, não características.
            """,
            'default_params': {
                'tone': 'persuasivo e urgente',
                'channel': 'landing page',
                'objective': 'gerar vendas imediatas'
            }
        }

    def generate_content(self, content_type, topic, model='claude', **kwargs):
        """Gera conteúdo usando IA especificada"""
        if content_type not in self.content_templates:
            raise Exception(f"Tipo de conteúdo '{content_type}' não suportado")

        if model not in self.models:
            raise Exception(f"Modelo '{model}' não disponível")

        template = self.content_templates[content_type]
        model_config = self.models[model]

        # Verificar se API key está disponível
        if not self.api_keys.get(model_config['provider']):
            raise Exception(f"API key para {model_config['provider']} não configurada")

        # Preparar prompt
        params = {**template['default_params'], **kwargs}
        prompt = template['prompt_template'].format(topic=topic, **params)

        print(f"🤖 Gerando conteúdo com {model} sobre: {topic}")

        # Chamar API apropriada
        try:
            if model_config['provider'] == 'anthropic':
                content = self._call_claude(prompt, model_config['model'])
            elif model_config['provider'] == 'openai':
                content = self._call_openai(prompt, model_config['model'])
            elif model_config['provider'] == 'google':
                content = self._call_google(prompt, model_config['model'])
            else:
                content = self._call_replicate(prompt, model_config['model'])

            # Processar e estruturar resposta
            structured_content = self._structure_content(content, template['structure'], content_type)

            # Registrar no histórico
            self._log_generation(content_type, topic, model, structured_content, len(content))

            return structured_content

        except Exception as e:
            print(f"❌ Erro na geração: {e}")
            # Fallback para modelo mais simples
            if model != 'gemini':
                return self.generate_content(content_type, topic, 'gemini', **kwargs)
            raise

    def _call_claude(self, prompt, model):
        """Chama API da Anthropic (Claude)"""
        url = "https://api.anthropic.com/v1/messages"
        headers = {
            'x-api-key': self.api_keys['anthropic'],
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json'
        }

        data = {
            'model': model,
            'max_tokens': 4000,
            'messages': [{'role': 'user', 'content': prompt}]
        }

        response = requests.post(url, headers=headers, json=data, timeout=60)
        response.raise_for_status()

        return response.json()['content'][0]['text']

    def _call_openai(self, prompt, model):
        """Chama API da OpenAI"""
        url = "https://api.openai.com/v1/chat/completions"
        headers = {
            'Authorization': f"Bearer {self.api_keys['openai']}",
            'Content-Type': 'application/json'
        }

        data = {
            'model': model,
            'messages': [{'role': 'user', 'content': prompt}],
            'max_tokens': 4000,
            'temperature': 0.7
        }

        response = requests.post(url, headers=headers, json=data, timeout=60)
        response.raise_for_status()

        return response.json()['choices'][0]['message']['content']

    def _call_google(self, prompt, model):
        """Chama API do Google (Gemini)"""
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
        params = {'key': self.api_keys['google']}

        data = {
            'contents': [{
                'parts': [{'text': prompt}]
            }]
        }

        response = requests.post(url, params=params, json=data, timeout=60)
        response.raise_for_status()

        return response.json()['candidates'][0]['content']['parts'][0]['text']

    def _call_replicate(self, prompt, model):
        """Chama API da Replicate (para modelos open-source)"""
        url = "https://api.replicate.com/v1/predictions"
        headers = {
            'Authorization': f"Token {self.api_keys['replicate']}",
            'Content-Type': 'application/json'
        }

        data = {
            'version': model,
            'input': {
                'prompt': prompt,
                'max_length': 4000,
                'temperature': 0.7
            }
        }

        response = requests.post(url, headers=headers, json=data, timeout=60)
        response.raise_for_status()

        prediction_url = response.json()['urls']['get']

        # Aguardar conclusão
        while True:
            status_response = requests.get(prediction_url, headers=headers)
            status_response.raise_for_status()
            status = status_response.json()

            if status['status'] == 'succeeded':
                return status['output']
            elif status['status'] == 'failed':
                raise Exception("Falha na geração com Replicate")

            time.sleep(2)

    def _structure_content(self, raw_content, structure, content_type):
        """Estrutura o conteúdo gerado"""
        structured = {
            'type': content_type,
            'generated_at': datetime.now().isoformat(),
            'raw_content': raw_content
        }

        # Tentar extrair seções baseadas na estrutura
        sections = re.split(r'\n\s*\n(?=[A-Z][^a-z]*:|\d+\.)', raw_content)

        for i, section_name in enumerate(structure):
            if i < len(sections):
                structured[section_name] = sections[i].strip()
            else:
                structured[section_name] = ""

        # Adicionar metadados
        structured['word_count'] = len(raw_content.split())
        structured['char_count'] = len(raw_content)
        structured['read_time'] = max(1, structured['word_count'] // 200)  # minutos

        return structured

    def _log_generation(self, content_type, topic, model, content, tokens_used):
        """Registra geração no histórico"""
        entry = {
            'id': hashlib.md5(f"{datetime.now().isoformat()}{topic}".encode()).hexdigest(),
            'timestamp': datetime.now().isoformat(),
            'type': content_type,
            'topic': topic,
            'model': model,
            'word_count': content.get('word_count', 0),
            'tokens_estimated': tokens_used,
            'cost_estimated': tokens_used * self.models[model]['cost_per_token'] / 1000
        }

        self.history['contents'].append(entry)

        # Atualizar estatísticas
        if model not in self.history['usage_stats']:
            self.history['usage_stats'][model] = {'total_tokens': 0, 'total_cost': 0.0, 'generations': 0}

        self.history['usage_stats'][model]['total_tokens'] += tokens_used
        self.history['usage_stats'][model]['total_cost'] += entry['cost_estimated']
        self.history['usage_stats'][model]['generations'] += 1

        self._save_history()

    def generate_campaign(self, topic, platforms=None, content_types=None):
        """Gera campanha completa de conteúdo"""
        if not platforms:
            platforms = ['blog', 'twitter', 'instagram', 'email']
        if not content_types:
            content_types = ['blog_post', 'social_media', 'email_campaign']

        campaign = {
            'topic': topic,
            'created_at': datetime.now().isoformat(),
            'contents': {}
        }

        print(f"🚀 Gerando campanha completa sobre: {topic}")

        for content_type in content_types:
            try:
                if content_type == 'social_media' and platforms:
                    # Gerar para múltiplas plataformas
                    campaign['contents'][content_type] = {}
                    for platform in platforms:
                        content = self.generate_content(
                            content_type, topic,
                            platform_config={'platform': platform}
                        )
                        campaign['contents'][content_type][platform] = content
                        time.sleep(2)  # Rate limiting
                else:
                    content = self.generate_content(content_type, topic)
                    campaign['contents'][content_type] = content
                    time.sleep(2)

            except Exception as e:
                print(f"⚠️ Erro ao gerar {content_type}: {e}")
                continue

        # Salvar campanha
        campaign_file = f"data/campaigns/campaign_{int(time.time())}.json"
        os.makedirs(os.path.dirname(campaign_file), exist_ok=True)
        with open(campaign_file, 'w', encoding='utf-8') as f:
            json.dump(campaign, f, indent=2, ensure_ascii=False)

        print(f"✅ Campanha salva em: {campaign_file}")
        return campaign

    def get_usage_stats(self):
        """Retorna estatísticas de uso"""
        return self.history['usage_stats']

    def list_generated_content(self, limit=10):
        """Lista conteúdo gerado recentemente"""
        return sorted(
            self.history['contents'],
            key=lambda x: x['timestamp'],
            reverse=True
        )[:limit]

    def optimize_content(self, content_id, target_platform):
        """Otimiza conteúdo existente para plataforma específica"""
        # Buscar conteúdo original
        original = None
        for item in self.history['contents']:
            if item['id'] == content_id:
                original = item
                break

        if not original:
            raise Exception("Conteúdo não encontrado")

        # Gerar versão otimizada
        prompt = f"""
        Otimize este conteúdo para {target_platform}:

        Conteúdo original:
        {original}

        Requisitos para {target_platform}:
        - Comprimento apropriado
        - Linguagem adequada
        - Elementos visuais sugeridos
        - Call-to-action otimizado

        Mantenha a mensagem principal mas adapte para a plataforma.
        """

        optimized = self.generate_content('social_media', f"Versão otimizada de {original['topic']}", prompt_extension=prompt)
        optimized['original_id'] = content_id
        optimized['platform'] = target_platform

        return optimized

def main():
    """Função principal"""
    generator = AIContentGenerator()

    import sys
    if len(sys.argv) < 2:
        print("🤖 AI Content Generator - Gerador de Conteúdo com IA")
        print("Comandos disponíveis:")
        print("  generate <type> <topic> [model]  - Gerar conteúdo específico")
        print("  campaign <topic>                 - Gerar campanha completa")
        print("  stats                            - Ver estatísticas de uso")
        print("  list                             - Listar conteúdo gerado")
        print("  optimize <id> <platform>         - Otimizar conteúdo existente")
        print("\nTipos disponíveis: blog_post, social_media, email_campaign, product_description, technical_doc, marketing_copy")
        print("Modelos: gpt4, claude, gemini, llama")
        return

    command = sys.argv[1]

    try:
        if command == 'generate':
            if len(sys.argv) < 4:
                print("Uso: python ai_content_generator.py generate <type> <topic> [model]")
                return
            content_type = sys.argv[2]
            topic = sys.argv[3]
            model = sys.argv[4] if len(sys.argv) > 4 else 'claude'

            content = generator.generate_content(content_type, topic, model)
            print(f"\n📝 Conteúdo gerado ({content_type}):")
            print(json.dumps(content, indent=2, ensure_ascii=False))

        elif command == 'campaign':
            if len(sys.argv) < 3:
                print("Uso: python ai_content_generator.py campaign <topic>")
                return
            topic = sys.argv[2]
            campaign = generator.generate_campaign(topic)
            print(f"🚀 Campanha gerada para: {topic}")

        elif command == 'stats':
            stats = generator.get_usage_stats()
            print("📊 Estatísticas de uso:")
            for model, data in stats.items():
                print(f"  {model}: {data['generations']} gerações, {data['total_tokens']} tokens, R$ {data['total_cost']:.2f}")

        elif command == 'list':
            contents = generator.list_generated_content()
            print("📋 Conteúdo gerado recentemente:")
            for item in contents:
                print(f"  {item['id'][:8]} - {item['type']} - {item['topic']} - {item['timestamp'][:10]}")

        elif command == 'optimize':
            if len(sys.argv) < 4:
                print("Uso: python ai_content_generator.py optimize <content_id> <platform>")
                return
            content_id = sys.argv[2]
            platform = sys.argv[3]

            optimized = generator.optimize_content(content_id, platform)
            print(f"✨ Conteúdo otimizado para {platform}:")
            print(json.dumps(optimized, indent=2, ensure_ascii=False))

        else:
            print("Comando não reconhecido. Use sem argumentos para ver ajuda.")

    except Exception as e:
        print(f"❌ Erro: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()