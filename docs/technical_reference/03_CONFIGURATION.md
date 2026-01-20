# ⚙️ Configurações e Variáveis

**Status de Conclusão**: `[░░░░░░░░░░] 0%`

## 1. Configurações por Serviço

### 1.1 PostgreSQL

**Arquivo**: `postgres/postgresql.conf`

```ini
# Conexões
max_connections = 50           # PgBouncer gerencia pooling

# Memória (otimizado para 8GB total)
shared_buffers = 128MB         # ~25% da RAM do container
work_mem = 4MB                 # Baixo para evitar spikes
maintenance_work_mem = 64MB    # Para VACUUM, INDEX
effective_cache_size = 256MB   # Estimativa de cache do OS

# Performance SSD
random_page_cost = 1.1         # SSD é rápido
effective_io_concurrency = 200 # Paralelismo IO

# Background Workers
max_worker_processes = 4
max_parallel_workers = 4
autovacuum_max_workers = 2

# Logging (mínimo)
log_min_duration_statement = 1000  # Só queries >1s
```

**Databases Criados**:
| Database | Uso |
|----------|-----|
| `chatwoot_production` | Dados do Chatwoot |
| `n8n_db` | Workflows e execuções do n8n |
| `metabase` | Dashboards BI (opcional) |

### 1.2 PgBouncer

**Configuração via Environment**:
```yaml
POOL_MODE: transaction        # Melhor para Rails
MAX_CLIENT_CONN: 200          # Máximo de conexões cliente
DEFAULT_POOL_SIZE: 10         # Pool por database
RESERVE_POOL_SIZE: 5          # Pool de reserva
```

### 1.3 Redis

**Arquivo**: `redis/redis.conf`

```ini
# Memória
maxmemory 100mb
maxmemory-policy allkeys-lru   # Evita OutOfMemory

# Persistência (RDB)
save 900 1                     # Snapshot a cada 15min
save 300 10
save 60 10000

# Segurança
rename-command FLUSHDB ""      # Desabilita comandos perigosos
rename-command FLUSHALL ""
rename-command DEBUG ""
rename-command CONFIG ""

# Performance
lazyfree-lazy-eviction yes     # Deleta em background
jemalloc-bg-thread yes
```

**Keys Especiais**:
| Key | Tipo | Uso |
|-----|------|-----|
| `AI_KILL_SWITCH` | String | `1` = IA desabilitada |
| `sidekiq:*` | Hash | Filas do Chatwoot |
| `cache:*` | String | Cache de sessões |

### 1.4 Qdrant

**Arquivo**: `qdrant/config.yaml`

```yaml
service:
  api_key: "${QDRANT_API_KEY}"  # Autenticação obrigatória
  enable_cors: true

storage:
  on_disk_payload: true         # Payloads no disco
  mmap_threshold_kb: 20480      # Vetores em mmap após 20MB
  
optimizers:
  memmap_threshold_kb: 20480
  max_optimization_threads: 1   # Economia de CPU

hnsw_index:
  on_disk: true                 # Índice em disco

telemetry_disabled: true
log_level: WARN
```

### 1.5 Chatwoot

**Environment Variables Importantes**:
```yaml
# Performance
SIDEKIQ_CONCURRENCY: 5          # Reduzido de 25
RAILS_MAX_THREADS: 5
WEB_CONCURRENCY: 2

# Desabilitar não-usados
ENABLE_SMTP: false              # Se não usar email
ENABLE_IMAP: false

# Storage Externo (recomendado)
ACTIVE_STORAGE_SERVICE: amazon  # Ou 's3_compatible' para R2
S3_BUCKET_NAME: seu-bucket
```

### 1.6 n8n

**Environment Variables Importantes**:
```yaml
# Execuções (economia de disco)
EXECUTIONS_DATA_PRUNE: true
EXECUTIONS_DATA_MAX_AGE: 24             # Dias
EXECUTIONS_DATA_SAVE_ON_SUCCESS: none   # Não salva sucesso
EXECUTIONS_DATA_SAVE_ON_ERROR: all

# Modo Own (sem workers)
EXECUTIONS_MODE: regular

# Memória Node.js
NODE_OPTIONS: --max-old-space-size=512
```

### 1.7 Evolution API

**Environment Variables**:
```yaml
# Base
SERVER_URL: https://evolution.seudominio.com
AUTHENTICATION_API_KEY: ${EVOLUTION_API_KEY}

# Database (SQLite - economia RAM)
DATABASE_PROVIDER: sqlite
DATABASE_CONNECTION_URI: file:./data/evolution.db

# Redis para cache
CACHE_REDIS_ENABLED: true
CACHE_REDIS_URI: redis://redis:6379/1

# Chatwoot Integration
CHATWOOT_ENABLED: true
CHATWOOT_URL: http://chatwoot:3000
```

### 1.8 Traefik

**Middlewares Ativos**:
| Middleware | Função |
|------------|--------|
| `crowdsec` | Verifica IP no CrowdSec |
| `rate-limit` | 100 req/min por IP |
| `security-headers` | HSTS, XSS, etc |
| `compress` | Brotli compression |
| `honeypot-ban` | Delay + log de scanners |

### 1.9 CrowdSec

**Collections Instaladas**:
```bash
crowdsecurity/traefik          # Parser de logs Traefik
crowdsecurity/http-cve         # CVEs conhecidos
crowdsecurity/whitelist-good-actors  # Google, etc
```

## 2. Variáveis de Ambiente (.env)

### 2.1 Obrigatórias (Sem Default)

```bash
# Database
POSTGRES_PASSWORD=            # Mínimo 32 caracteres

# Chatwoot
CHATWOOT_SECRET_KEY_BASE=     # openssl rand -hex 64
CHATWOOT_DOMAIN=              # chat.seudominio.com

# n8n
N8N_ADMIN_USER=
N8N_ADMIN_PASSWORD=
N8N_DOMAIN=                   # n8n.seudominio.com

# Evolution API
EVOLUTION_API_KEY=            # Mínimo 32 caracteres
EVOLUTION_DOMAIN=             # evolution.seudominio.com

# Qdrant
QDRANT_API_KEY=

# Cloudflare
CLOUDFLARE_TUNNEL_TOKEN=      # Do Zero Trust Dashboard

# CrowdSec
CROWDSEC_BOUNCER_API_KEY=     # Gerado após primeiro boot

# Browserless
BROWSERLESS_TOKEN=
```

### 2.2 APIs Externas

```bash
# LLM (escolha um ou mais)
GEMINI_API_KEY=               # Principal
OPENAI_API_KEY=               # Fallback
ANTHROPIC_API_KEY=            # Fallback

# STT (Transcrição)
GROQ_API_KEY=                 # Whisper API

# Embeddings
GOOGLE_EMBEDDINGS_API_KEY=    # text-embedding-004
```

### 2.3 Storage S3

```bash
# AWS S3 ou Cloudflare R2
STORAGE_SERVICE=amazon        # ou 's3_compatible'
S3_BUCKET_NAME=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1

# Para R2:
# S3_ENDPOINT=https://ACCOUNT.r2.cloudflarestorage.com

# Backup Bucket (com Object Lock)
BACKUP_S3_BUCKET=
```

### 2.4 Opcionais com Default

```bash
TIMEZONE=America/Sao_Paulo
POSTGRES_USER=postgres
INSTALLATION_NAME="Support System"
BRAND_NAME="Support"
RATE_LIMIT_AVERAGE=100
RATE_LIMIT_BURST=50
GEMINI_MODEL=gemini-1.5-flash
GOOGLE_EMBEDDINGS_MODEL=text-embedding-004
```
