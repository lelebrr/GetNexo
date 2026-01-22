#!/usr/bin/env python3
"""
GetNexo Knowledge Feed - Crawler que Alimenta o Banco Vetorial da IA
Sistema de ingestão automática de conhecimento para RAG (Retrieval-Augmented Generation)
"""

import os
import json
import requests
import time
import feedparser
from datetime import datetime, timedelta
from urllib.parse import urljoin, urlparse
from bs4 import BeautifulSoup
import re
from collections import deque
import hashlib
import threading
import queue
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class KnowledgeFeed:
    def __init__(self):
        self.vector_db_path = 'data/vector_store/'
        self.feed_sources_path = 'data/feed_sources.json'
        self.ingestion_log = 'data/ingestion_log.json'
        self.content_cache = 'data/content_cache/'

        # Fontes de conhecimento (RSS feeds, sites, APIs)
        self.feed_sources = {
            'tech_news': {
                'type': 'rss',
                'url': 'https://techcrunch.com/feed/',
                'category': 'technology',
                'priority': 'high',
                'update_interval': 3600  # 1 hora
            },
            'ai_research': {
                'type': 'rss',
                'url': 'https://arxiv.org/rss/cs.AI',
                'category': 'research',
                'priority': 'high',
                'update_interval': 7200  # 2 horas
            },
            'industry_trends': {
                'type': 'rss',
                'url': 'https://www.wired.com/feed/rss',
                'category': 'trends',
                'priority': 'medium',
                'update_interval': 10800  # 3 horas
            },
            'github_trending': {
                'type': 'api',
                'url': 'https://api.github.com/search/repositories?q=language:python&sort=stars&order=desc',
                'category': 'development',
                'priority': 'medium',
                'update_interval': 21600  # 6 horas
            },
            'stackoverflow': {
                'type': 'scrape',
                'url': 'https://stackoverflow.com/questions/tagged/python?tab=Newest',
                'category': 'qa',
                'priority': 'low',
                'update_interval': 43200  # 12 horas
            }
        }

        # Configurações de processamento
        self.processing_config = {
            'max_content_length': 10000,     # Máximo de caracteres por documento
            'min_content_length': 100,       # Mínimo de caracteres
            'chunk_size': 1000,              # Tamanho dos chunks para embedding
            'chunk_overlap': 200,            # Sobreposição entre chunks
            'max_pages_per_source': 10,      # Máximo de páginas por fonte
            'rate_limit_delay': 1,           # Delay entre requests (segundos)
            'user_agent': 'GetNexo-KnowledgeFeed/1.0 (https://getnexo.com.br)',
            'timeout': 30                     # Timeout para requests
        }

        # Estado do sistema
        self.ingestion_queue = queue.Queue()
        self.processed_urls = set()
        self.last_updates = {}

        # Estatísticas
        self.stats = {
            'total_ingested': 0,
            'sources_processed': 0,
            'errors_encountered': 0,
            'last_ingestion': None,
            'queue_size': 0
        }

        self._load_state()
        self._start_ingestion_worker()

    def _load_state(self):
        """Carrega estado salvo do sistema"""
        try:
            if os.path.exists(self.feed_sources_path):
                with open(self.feed_sources_path, 'r') as f:
                    self.feed_sources.update(json.load(f))
                print("✅ Fontes de feed carregadas")
        except Exception as e:
            print(f"Aviso ao carregar fontes: {e}")

        try:
            if os.path.exists(self.ingestion_log):
                with open(self.ingestion_log, 'r') as f:
                    log_data = json.load(f)
                    self.processed_urls = set(log_data.get('processed_urls', []))
                    self.last_updates = log_data.get('last_updates', {})
                    self.stats = log_data.get('stats', self.stats)
                print("✅ Log de ingestão carregado")
        except Exception as e:
            print(f"Aviso ao carregar log: {e}")

    def _save_state(self):
        """Salva estado atual"""
        try:
            os.makedirs(os.path.dirname(self.feed_sources_path), exist_ok=True)

            # Salvar fontes
            with open(self.feed_sources_path, 'w') as f:
                json.dump(self.feed_sources, f, indent=2)

            # Salvar log de ingestão
            log_data = {
                'processed_urls': list(self.processed_urls),
                'last_updates': self.last_updates,
                'stats': self.stats,
                'last_save': datetime.now().isoformat()
            }

            with open(self.ingestion_log, 'w') as f:
                json.dump(log_data, f, indent=2)

        except Exception as e:
            print(f"Erro ao salvar estado: {e}")

    def _start_ingestion_worker(self):
        """Inicia worker de ingestão em background"""
        def ingestion_worker():
            while True:
                try:
                    content_item = self.ingestion_queue.get(timeout=5)
                    self._process_content_item(content_item)
                    self.ingestion_queue.task_done()
                except queue.Empty:
                    continue
                except Exception as e:
                    print(f"Erro no worker de ingestão: {e}")
                    self.stats['errors_encountered'] += 1

        # Iniciar múltiplos workers
        for i in range(3):  # 3 workers paralelos
            thread = threading.Thread(target=ingestion_worker, daemon=True, name=f"IngestionWorker-{i}")
            thread.start()

    def add_feed_source(self, name, source_config):
        """Adiciona nova fonte de conhecimento"""
        required_fields = ['type', 'url', 'category', 'priority', 'update_interval']

        for field in required_fields:
            if field not in source_config:
                raise ValueError(f"Campo obrigatório faltando: {field}")

        if source_config['type'] not in ['rss', 'api', 'scrape', 'website']:
            raise ValueError("Tipo deve ser: rss, api, scrape, ou website")

        self.feed_sources[name] = source_config
        self._save_state()

        print(f"✅ Fonte adicionada: {name} ({source_config['type']})")
        return True

    def crawl_and_ingest(self, source_names=None, force_update=False):
        """Raspa e ingere conhecimento das fontes configuradas"""
        if source_names is None:
            source_names = list(self.feed_sources.keys())

        print(f"🕷️ Iniciando crawling de {len(source_names)} fontes...")

        for source_name in source_names:
            if source_name not in self.feed_sources:
                print(f"⚠️ Fonte não encontrada: {source_name}")
                continue

            source = self.feed_sources[source_name]

            # Verificar se precisa atualizar
            if not force_update:
                last_update = self.last_updates.get(source_name)
                if last_update:
                    last_update_time = datetime.fromisoformat(last_update)
                    update_interval = timedelta(seconds=source['update_interval'])
                    if datetime.now() - last_update_time < update_interval:
                        print(f"⏭️ Pulando {source_name} (atualizado recentemente)")
                        continue

            try:
                print(f"📥 Processando {source_name} ({source['type']})...")
                self._crawl_source(source_name, source)
                self.last_updates[source_name] = datetime.now().isoformat()
                self.stats['sources_processed'] += 1

            except Exception as e:
                print(f"❌ Erro ao processar {source_name}: {e}")
                self.stats['errors_encountered'] += 1

        self._save_state()
        print(f"✅ Crawling concluído. Itens na fila: {self.ingestion_queue.qsize()}")

    def _crawl_source(self, source_name, source_config):
        """Raspa conteúdo de uma fonte específica"""
        source_type = source_config['type']
        url = source_config['url']

        if source_type == 'rss':
            self._crawl_rss_feed(source_name, url, source_config)
        elif source_type == 'api':
            self._crawl_api_endpoint(source_name, url, source_config)
        elif source_type == 'scrape':
            self._crawl_website(source_name, url, source_config)
        elif source_type == 'website':
            self._crawl_website_recursive(source_name, url, source_config)

    def _crawl_rss_feed(self, source_name, url, config):
        """Processa feed RSS"""
        try:
            headers = {'User-Agent': self.processing_config['user_agent']}
            response = requests.get(url, headers=headers, timeout=self.processing_config['timeout'])
            response.raise_for_status()

            feed = feedparser.parse(response.content)

            for entry in feed.entries[:self.processing_config['max_pages_per_source']]:
                if hasattr(entry, 'link') and entry.link not in self.processed_urls:
                    content_item = {
                        'source': source_name,
                        'type': 'rss_entry',
                        'url': entry.link,
                        'title': getattr(entry, 'title', ''),
                        'description': getattr(entry, 'description', ''),
                        'published': getattr(entry, 'published_parsed', None),
                        'category': config['category'],
                        'priority': config['priority']
                    }

                    self.ingestion_queue.put(content_item)
                    self.processed_urls.add(entry.link)

        except Exception as e:
            print(f"Erro ao processar RSS {source_name}: {e}")

    def _crawl_api_endpoint(self, source_name, url, config):
        """Processa endpoint de API"""
        try:
            headers = {'User-Agent': self.processing_config['user_agent']}
            response = requests.get(url, headers=headers, timeout=self.processing_config['timeout'])
            response.raise_for_status()

            data = response.json()

            # Processar baseado na estrutura da API
            if 'items' in data:
                items = data['items']
            elif isinstance(data, list):
                items = data
            else:
                items = [data]

            for item in items[:self.processing_config['max_pages_per_source']]:
                content_item = {
                    'source': source_name,
                    'type': 'api_item',
                    'url': item.get('html_url') or item.get('url') or url,
                    'title': item.get('name') or item.get('title') or item.get('full_name', ''),
                    'description': item.get('description', ''),
                    'content': json.dumps(item),
                    'category': config['category'],
                    'priority': config['priority']
                }

                self.ingestion_queue.put(content_item)

        except Exception as e:
            print(f"Erro ao processar API {source_name}: {e}")

    def _crawl_website(self, source_name, url, config, use_selenium=False):
        """Raspa conteúdo de website"""
        try:
            if use_selenium:
                return self._crawl_with_selenium(source_name, url, config)

            headers = {'User-Agent': self.processing_config['user_agent']}
            response = requests.get(url, headers=headers, timeout=self.processing_config['timeout'])
            response.raise_for_status()

            soup = BeautifulSoup(response.content, 'html.parser')

            # Remover elementos indesejados
            for tag in soup(['script', 'style', 'nav', 'footer', 'aside']):
                tag.decompose()

            # Extrair conteúdo principal
            title = soup.find('title').text.strip() if soup.find('title') else ''
            description = ''
            meta_desc = soup.find('meta', {'name': 'description'})
            if meta_desc:
                description = meta_desc.get('content', '')

            # Extrair texto principal
            content = ' '.join([p.text.strip() for p in soup.find_all('p') if p.text.strip()])
            content = re.sub(r'\s+', ' ', content)  # Normalizar espaços

            if len(content) >= self.processing_config['min_content_length']:
                content_item = {
                    'source': source_name,
                    'type': 'webpage',
                    'url': url,
                    'title': title,
                    'description': description,
                    'content': content[:self.processing_config['max_content_length']],
                    'category': config['category'],
                    'priority': config['priority']
                }

                self.ingestion_queue.put(content_item)

        except Exception as e:
            print(f"Erro ao raspar website {source_name}: {e}")

    def _crawl_with_selenium(self, source_name, url, config):
        """Raspa usando Selenium para conteúdo dinâmico"""
        try:
            chrome_options = Options()
            chrome_options.add_argument('--headless')
            chrome_options.add_argument('--no-sandbox')
            chrome_options.add_argument('--disable-dev-shm-usage')

            driver = webdriver.Chrome(options=chrome_options)
            driver.get(url)

            # Aguardar carregamento
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.TAG_NAME, 'body'))
            )

            # Extrair dados
            title = driver.title
            content = driver.find_element(By.TAG_NAME, 'body').text
            content = re.sub(r'\s+', ' ', content)

            driver.quit()

            if len(content) >= self.processing_config['min_content_length']:
                content_item = {
                    'source': source_name,
                    'type': 'dynamic_webpage',
                    'url': url,
                    'title': title,
                    'content': content[:self.processing_config['max_content_length']],
                    'category': config['category'],
                    'priority': config['priority']
                }

                self.ingestion_queue.put(content_item)

        except Exception as e:
            print(f"Erro ao raspar com Selenium {source_name}: {e}")

    def _crawl_website_recursive(self, source_name, base_url, config, max_depth=2):
        """Raspa website recursivamente (seguindo links)"""
        visited = set()
        to_visit = deque([(base_url, 0)])  # (url, depth)

        while to_visit and len(visited) < self.processing_config['max_pages_per_source']:
            current_url, depth = to_visit.popleft()

            if current_url in visited or depth > max_depth:
                continue

            visited.add(current_url)

            try:
                # Raspar página atual
                self._crawl_website(source_name, current_url, config)

                # Encontrar novos links se ainda não atingiu profundidade máxima
                if depth < max_depth:
                    headers = {'User-Agent': self.processing_config['user_agent']}
                    response = requests.get(current_url, headers=headers, timeout=10)
                    soup = BeautifulSoup(response.content, 'html.parser')

                    for link in soup.find_all('a', href=True):
                        next_url = urljoin(current_url, link['href'])
                        parsed_next = urlparse(next_url)
                        parsed_base = urlparse(base_url)

                        # Só seguir links do mesmo domínio
                        if parsed_next.netloc == parsed_base.netloc and next_url not in visited:
                            to_visit.append((next_url, depth + 1))

                time.sleep(self.processing_config['rate_limit_delay'])

            except Exception as e:
                print(f"Erro ao processar {current_url}: {e}")

    def _process_content_item(self, item):
        """Processa item de conteúdo para o vector store"""
        try:
            # Gerar chunks do conteúdo
            chunks = self._create_content_chunks(item)

            # Salvar chunks no vector store
            for i, chunk in enumerate(chunks):
                chunk_id = self._save_chunk_to_vector_store(item, chunk, i)

            self.stats['total_ingested'] += 1
            self.stats['last_ingestion'] = datetime.now().isoformat()

            print(f"✅ Processado: {item['title'][:50]}... ({len(chunks)} chunks)")

        except Exception as e:
            print(f"Erro ao processar item {item.get('title', 'Unknown')}: {e}")

    def _create_content_chunks(self, item):
        """Cria chunks do conteúdo para embedding"""
        content = item.get('content', '') + ' ' + item.get('description', '')
        content = content.strip()

        if not content:
            return []

        # Dividir em chunks com sobreposição
        chunk_size = self.processing_config['chunk_size']
        overlap = self.processing_config['chunk_overlap']

        chunks = []
        start = 0

        while start < len(content):
            end = start + chunk_size

            # Ajustar para não cortar palavras
            if end < len(content):
                # Encontrar último espaço antes do limite
                last_space = content.rfind(' ', start, end)
                if last_space > start:
                    end = last_space

            chunk = content[start:end].strip()
            if len(chunk) >= self.processing_config['min_content_length'] // 2:  # Chunks menores são aceitáveis
                chunks.append(chunk)

            start = end - overlap

            if start >= len(content):
                break

        return chunks

    def _save_chunk_to_vector_store(self, item, chunk, chunk_index):
        """Salva chunk no vector store (simulado - em produção usaria Pinecone, Weaviate, etc.)"""
        # Gerar ID único para o chunk
        content_hash = hashlib.md5(chunk.encode()).hexdigest()
        chunk_id = f"{item['source']}_{content_hash}_{chunk_index}"

        # Metadata do chunk
        chunk_data = {
            'id': chunk_id,
            'source': item['source'],
            'url': item['url'],
            'title': item['title'],
            'category': item['category'],
            'priority': item['priority'],
            'chunk_index': chunk_index,
            'content': chunk,
            'embedding_ready': False,  # Sinalizar para geração de embedding
            'created_at': datetime.now().isoformat(),
            'content_hash': content_hash
        }

        # Salvar chunk
        os.makedirs(self.vector_db_path, exist_ok=True)
        chunk_file = os.path.join(self.vector_db_path, f"{chunk_id}.json")

        with open(chunk_file, 'w', encoding='utf-8') as f:
            json.dump(chunk_data, f, ensure_ascii=False, indent=2)

        return chunk_id

    def search_knowledge(self, query, category=None, limit=10):
        """Busca conhecimento no vector store"""
        # Simulação de busca (em produção usaria embeddings e similaridade vetorial)
        results = []

        try:
            for filename in os.listdir(self.vector_db_path):
                if filename.endswith('.json'):
                    filepath = os.path.join(self.vector_db_path, filename)

                    with open(filepath, 'r', encoding='utf-8') as f:
                        chunk_data = json.load(f)

                    # Filtros simples
                    if category and chunk_data['category'] != category:
                        continue

                    # Busca por palavra-chave simples
                    query_lower = query.lower()
                    content_lower = chunk_data['content'].lower()

                    if query_lower in content_lower:
                        # Calcular score simples
                        score = content_lower.count(query_lower) / len(content_lower.split())
                        results.append({
                            'chunk': chunk_data,
                            'score': score
                        })

            # Ordenar por score e limitar
            results.sort(key=lambda x: x['score'], reverse=True)
            return [r['chunk'] for r in results[:limit]]

        except Exception as e:
            print(f"Erro na busca: {e}")
            return []

    def get_ingestion_stats(self):
        """Retorna estatísticas de ingestão"""
        total_chunks = 0
        try:
            if os.path.exists(self.vector_db_path):
                total_chunks = len([f for f in os.listdir(self.vector_db_path) if f.endswith('.json')])
        except:
            pass

        return {
            'total_ingested': self.stats['total_ingested'],
            'total_chunks': total_chunks,
            'sources_processed': self.stats['sources_processed'],
            'errors_encountered': self.stats['errors_encountered'],
            'queue_size': self.ingestion_queue.qsize(),
            'last_ingestion': self.stats['last_ingestion'],
            'feed_sources': len(self.feed_sources),
            'processed_urls': len(self.processed_urls)
        }

    def export_knowledge_base(self, format='json'):
        """Exporta base de conhecimento"""
        export_data = {
            'exported_at': datetime.now().isoformat(),
            'stats': self.get_ingestion_stats(),
            'chunks': []
        }

        try:
            for filename in os.listdir(self.vector_db_path):
                if filename.endswith('.json'):
                    filepath = os.path.join(self.vector_db_path, filename)

                    with open(filepath, 'r', encoding='utf-8') as f:
                        chunk_data = json.load(f)
                        export_data['chunks'].append(chunk_data)

        except Exception as e:
            print(f"Erro na exportação: {e}")

        export_file = f"data/knowledge_export_{int(time.time())}.{format}"

        if format == 'json':
            with open(export_file, 'w', encoding='utf-8') as f:
                json.dump(export_data, f, ensure_ascii=False, indent=2)

        print(f"📤 Base de conhecimento exportada: {export_file}")
        return export_file

def main():
    """Função principal"""
    feed = KnowledgeFeed()

    import sys
    if len(sys.argv) < 2:
        print("🧠 Knowledge Feed - Alimentação RAG Automática")
        print("Comandos disponíveis:")
        print("  crawl [sources]         - Raspar fontes (ex: tech_news,ai_research)")
        print("  add-source <name> <url> <type> <category> - Adicionar fonte")
        print("  search <query> [category] - Buscar conhecimento")
        print("  stats                    - Ver estatísticas")
        print("  export                   - Exportar base de conhecimento")
        print("\nTipos de fonte: rss, api, scrape, website")
        print("Fontes disponíveis:", ', '.join(feed.feed_sources.keys()))
        return

    command = sys.argv[1]

    try:
        if command == 'crawl':
            sources = sys.argv[2].split(',') if len(sys.argv) > 2 else None
            force = '--force' in sys.argv
            feed.crawl_and_ingest(sources, force)

        elif command == 'add-source':
            if len(sys.argv) < 6:
                print("Uso: python knowledge_feed.py add-source <name> <url> <type> <category>")
                return

            name = sys.argv[2]
            url = sys.argv[3]
            source_type = sys.argv[4]
            category = sys.argv[5]

            source_config = {
                'type': source_type,
                'url': url,
                'category': category,
                'priority': 'medium',
                'update_interval': 3600
            }

            feed.add_feed_source(name, source_config)

        elif command == 'search':
            if len(sys.argv) < 3:
                print("Uso: python knowledge_feed.py search <query> [category]")
                return

            query = sys.argv[2]
            category = sys.argv[3] if len(sys.argv) > 3 else None

            results = feed.search_knowledge(query, category)
            print(f"🔍 Resultados para '{query}' ({len(results)} encontrados):")

            for i, result in enumerate(results[:5], 1):
                print(f"{i}. {result['title']} - {result['source']} ({result['category']})")
                print(f"   {result['content'][:200]}...")
                print()

        elif command == 'stats':
            stats = feed.get_ingestion_stats()
            print("📊 ESTATÍSTICAS DE INGESTÃO:")
            print(json.dumps(stats, indent=2))

        elif command == 'export':
            export_file = feed.export_knowledge_base()
            print(f"✅ Exportação concluída: {export_file}")

        else:
            print("Comando não reconhecido. Use sem argumentos para ver ajuda.")

    except Exception as e:
        print(f"❌ Erro: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()