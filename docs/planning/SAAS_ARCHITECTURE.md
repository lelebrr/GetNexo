# 🏗️ Arquitetura SaaS & Produto (GetNexo)

**Visão**: Transformar o "Frankenstein" em um Produto Comercial Escalável.
**Pilar**: Stack Sólida, Open-Source, Self-Hosted e Leve (foco em 8GB RAM).

## 1. Core da Stack (Skeleton)

Componentes essenciais já inclusos no `docker-compose.yml`, otimizados para produção.

| Componente | Repo Oficial | Otimização Produto |
|------------|--------------|--------------------|
| **Chatwoot** | `chatwoot/chatwoot` | Rails leve, Sidekiq concurrency 5, Worker separado. |
| **n8n** | `n8n-io/n8n` | Modo "own" (sem workers externos), pruning 24h. |
| **Evolution API** | `EvolutionAPI/evolution-api` | Cache Redis, v2 (estável). |
| **Qdrant** | `qdrant/qdrant` | On-disk storage + mmap (economia de RAM). |
| **PostgreSQL 15** | `postgres:15-alpine` | Tuning low-memory, shared_buffers 128MB. |
| **Redis 7** | `redis:7-alpine` | LRU agressivo, maxmemory 384MB. |
| **Traefik v3** | `traefik/traefik` | Config estática leve, Middlewares dinâmicos. |
| **CrowdSec** | `crowdsecurity/crowdsec` | Collections essenciais (traefik, http-cve). |
| **Browserless** | `browserless/chrome` | Limite de sessões, kill idle instances. |

## 2. Complementos de Produto (Add-ons)

Ferramentas para gestão, monitoramento e features extras.

| Complemento | Função | Configuração |
|-------------|--------|--------------|
| **Watchtower** | Updates Automáticos | Notificação apenas (não força update). |
| **Portainer** | Gestão GUI (Inicial) | Opcional, remover pós-setup. |
| **Ollama** | Fallback IA Local | Phi-3/Llama3, sobe apenas se API externa cair. |
| **Typesense** | Busca Rápida (Search) | Alternativa leve ao ElasticSearch. |
| **Keycloak** | SSO Multi-tenant | Gestão de usuários e permissões granulares. |
| **Loki + Grafana** | Logs & Metrics | Centralização de logs leve (vs ELK stack). |
| **Uptime Kuma** | Status Page | Monitoramento interno e alertas Telegram. |

## 3. Automação Multi-Tenant (Painel Master)

Script e fluxo para provisionamento de novos clientes com "3 cliques".

### 3.1 Painel Master ("Admin de Admins")
Interface para o dono do SaaS:
-   **Ações**: Novo Cliente, Suspender, Atualizar Plano (RAM/CPU).
-   **Campos**: Nome, Email, Domínio (`chat.cliente.com`), Plano.

### 3.2 Script de Provisionamento (`scripts/onboard-client.sh`)
Quando o Admin cria um cliente, o script roda no host:

1.  **Diretório**: Cria `/clients/clienteX`.
2.  **Configuração**:
    -   Gera `.env` específico com senhas novas.
    -   Copia `docker-compose.base.yml` (template).
    -   Ajusta volumes e nomes de container (`clienteX-chatwoot`).
3.  **Boot**: Executa `docker compose up -d` isolado.
4.  **Registro**: Salva no DB Central (Cliente, IP, Status).
5.  **Notificação**: Envia email com credenciais e URL.

### 3.3 Auto-Scaling (`scripts/auto-scale.sh`)
-   Monitora uso de recursos dos containers.
-   Aplica *Hysteresis* (não oscilar limites muito rápido).
-   Sobe ou desce limites de CPU/RAM conforme o plano contratado.

## 4. Estratégia de Repositório

-   **GitHub Privado**: `getnexo/core`.
-   **Fork**: Manter forks dos repos oficiais para aplicar patches/overlays nossos.
-   **Profiles**: Usar Docker Compose Profiles (`--profile sales`, `--profile monitoring`) para ativar módulos sob demanda.
