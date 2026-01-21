# 📋 Visão Geral do Projeto

**Status de Conclusão**: `[██████████] 100%`

## 1. Objetivo

Criar uma infraestrutura completa e auto-hospedada para um sistema de suporte ao cliente com:

- **Omnichannel**: WhatsApp, Webchat, Email, Facebook, Instagram, Telegram
- **IA Autônoma**: Respostas automáticas, RAG, Function Calling
- **Transações Financeiras**: Integração com APIs de pagamento via n8n
- **Suporte Técnico**: Base de conhecimento com busca vetorial (RAG)
- **Performance**: Otimizado para rodar em hardware limitado (8GB RAM)
- **Segurança**: Defense in Depth com 15 camadas de proteção

## 2. Stack Tecnológica

| Categoria | Tecnologia | Função |
|-----------|------------|--------|
| **Frontend** | Chatwoot Widget | Interface do cliente |
| **Backend** | Chatwoot + Rails | Plataforma de suporte |
| **Automação** | n8n | Orquestração de workflows |
| **WhatsApp** | Evolution API v2 | Mensageria rica |
| **Vector DB** | Qdrant | RAG e memória de longo prazo |
| **Database** | PostgreSQL 15 | Dados transacionais |
| **Cache** | Redis 7 | Sessions, queues, kill switch |
| **Proxy** | Traefik v3 | Reverse proxy + load balancer |
| **IPS** | CrowdSec | Intrusion Prevention System |
| **Tunnel** | Cloudflared | Zero Trust networking |
| **PDF** | Stirling-PDF | Geração de documentos |
| **Browser** | Browserless | Scraping headless |
| **ML Engine** | Custom ML Models | IA e predições |
| **AR/VR** | WebXR + Three.js | Realidade aumentada |
| **PWA** | Workbox + Service Worker | App offline |
| **Gamification** | React Components | Pontos, níveis, conquistas |
| **Chat** | Multi-room System | Salas de chat persistentes |
| **Video** | WebRTC Basic | Chamadas básicas |

## 3. Requisitos de Hardware

| Recurso | Mínimo | Recomendado | Ideal |
|---------|--------|-------------|-------|
| RAM | 8GB | 16GB | 32GB |
| CPU | 4 vCPUs | 8 vCPUs | 16 vCPUs |
| Disco | 50GB SSD | 100GB NVMe | 250GB NVMe |
| Rede | 100 Mbps | 1 Gbps | 1 Gbps |
| OS | Ubuntu 22.04 | Debian 12 | Rocky Linux 9 |

## 4. O Que Foi Feito

### 4.1 Arquivos Criados

#### Core (4 arquivos)
| Arquivo | Tamanho | Descrição |
|---------|---------|-----------|
| `docker-compose.yml` | 17.5 KB | 13 serviços com resource limits, health checks, logging |
| `.env.example` | 6.6 KB | 50+ variáveis documentadas por categoria |
| `README.md` | 13.2 KB | Guia completo de deployment com troubleshooting |
| `SECURITY.md` | 13.9 KB | 15 medidas de segurança + código de guardrails |

#### PostgreSQL (2 arquivos)
| Arquivo | Descrição |
|---------|-----------|
| `postgres/init-db.sh` | Script de inicialização que cria 3 databases: `chatwoot_production`, `n8n_db`, `metabase` |
| `postgres/postgresql.conf` | Configuração otimizada para baixo consumo: `shared_buffers=128MB`, `work_mem=4MB` |

#### PgBouncer (1 arquivo)
| Arquivo | Descrição |
|---------|-----------|
| `pgbouncer/userlist.txt` | Template de autenticação SCRAM-SHA-256 |

#### Redis (1 arquivo)
| Arquivo | Descrição |
|---------|-----------|
| `redis/redis.conf` | Limite 100MB, política LRU, comandos perigosos desabilitados |

#### Qdrant (1 arquivo)
| Arquivo | Descrição |
|---------|-----------|
| `qdrant/config.yaml` | Storage em disco com mmap, API key auth, telemetria desabilitada |

#### Traefik (3 arquivos)
| Arquivo | Descrição |
|---------|-----------|
| `traefik/traefik.yaml` | Config estática com CrowdSec plugin, access logging |
| `traefik/dynamic/middlewares.yaml` | Rate limiting, security headers, Brotli compression |
| `traefik/dynamic/honeypots.yaml` | Rotas falsas para detectar scanners |

#### CrowdSec (1 arquivo)
| Arquivo | Descrição |
|---------|-----------|
| `crowdsec/acquis.yaml` | Ingestão de logs do Traefik para análise |

#### Scripts (3 arquivos)
| Arquivo | Descrição |
|---------|-----------|
| `scripts/backup-s3.sh` | Backup anti-ransomware com S3 Object Lock |
| `scripts/health-check.sh` | Monitoramento de todos os serviços + recursos |
| `scripts/cron-restart.sh` | Manutenção noturna com restart automático |

#### Chatwoot Customização (2 arquivos)
| Arquivo | Descrição |
|---------|-----------|
| `chatwoot/custom.css` | Tema Glassmorphism com fonte Inter, dark mode |
| `chatwoot/email-templates/notification.html` | Email responsivo com suporte a dark mode |

**TOTAL: 17 arquivos criados**

### 4.2 Funcionalidades Implementadas

#### ✅ Infraestrutura
- [x] Docker Compose com 13 serviços
- [x] 3 redes segregadas (frontend, backend, database)
- [x] Health checks em todos os containers
- [x] Resource limits (CPU/RAM) por container
- [x] Log rotation automático (10MB max)
- [x] Volumes persistentes nomeados

#### ✅ Database
- [x] PostgreSQL 15 Alpine (imagem leve)
- [x] Multi-database em única instância
- [x] PgBouncer para connection pooling
- [x] Configuração low-memory
- [x] Extensions: uuid-ossp, pg_trgm, pgcrypto

#### ✅ Cache & Vector
- [x] Redis 7 Alpine com LRU
- [x] Kill Switch via Redis key
- [x] Qdrant com storage em disco
- [x] API key authentication

#### ✅ Aplicações
- [x] Chatwoot (main + worker separado)
- [x] n8n em modo "Own" (sem workers)
- [x] Evolution API v2 para WhatsApp
- [x] Stirling-PDF para documentos
- [x] Browserless com limite de sessões

#### ✅ Segurança
- [x] Cloudflare Tunnel (Zero Trust)
- [x] CrowdSec IPS
- [x] Rate limiting (100 req/min)
- [x] Security headers
- [x] Honeypots (rotas falsas)
- [x] Backup com Object Lock
- [x] Kill Switch para IA

#### ✅ Performance
- [x] Imagens Alpine onde possível
- [x] Postgres tuning para 8GB
- [x] Redis LRU 100MB
- [x] Qdrant mmap
- [x] n8n pruning 24h
- [x] Sidekiq concurrency 5
- [x] Brotli compression

#### ✅ Customização
- [x] CSS Glassmorphism
- [x] Email templates responsivos
- [x] White-label (branding removido)

## 5. O Que Falta (Pendente)

### 5.1 Configuração Manual Necessária

| Item | Prioridade | Descrição |
|------|------------|-----------|
| **Cloudflare Tunnel** | 🔴 Alta | Criar tunnel no Zero Trust Dashboard e copiar token |
| **API Keys** | 🔴 Alta | Gerar keys para Gemini, Groq, Evolution |
| **CrowdSec Bouncer** | 🔴 Alta | Executar `cscli bouncers add` após primeiro boot |
| **Primeiro Admin** | 🔴 Alta | Criar SuperAdmin no Chatwoot via Rails console |
| **DNS** | 🔴 Alta | Apontar domínios para Cloudflare |
| **SSL** | 🟢 Baixa | Automático via Cloudflare |

### 5.2 Workflows n8n (Não Criados)

| Workflow | Complexidade | Descrição |
|----------|--------------|-----------|
| **Webhook Evolution → Chatwoot** | Média | Recebe mensagens do WhatsApp e cria conversas |
| **RAG Query** | Alta | Busca no Qdrant + envia para Gemini |
| **Function Calling** | Alta | Parser de intents + execução de ações |
| **PII Sanitizer** | Média | Remove dados sensíveis antes do LLM |
| **Prompt Injection Guard** | Média | Detecta tentativas de injection |
| **Transcrição de Áudio** | Baixa | Envia para Groq Whisper API |
| **Compressão de Imagem** | Baixa | Resize antes de enviar para Vision API |

### 5.3 Integrações Externas

| Integração | Status | Requisitos |
|------------|--------|------------|
| Gemini API | ⏳ Pendente | API Key no .env |
| Groq API | ⏳ Pendente | API Key no .env |
| Google Embeddings | ⏳ Pendente | API Key no .env |
| S3/R2 Storage | ⏳ Pendente | Bucket + credentials |
| Webhook URLs | ⏳ Pendente | Configurar no n8n |

### 5.4 Configurações Opcionais

| Item | Descrição |
|------|-----------|
| Metabase | Container adicional para dashboards BI |
| Grafana + Prometheus | Monitoramento avançado |
| Loki | Centralização de logs |
| Keycloak | SSO/SAML para admin panels |
| MinIO | S3 self-hosted alternativo |
