# 🪶 Stack Leve & Versões Oficiais

**Origem**: Recomendação de stack leve e estável (Janeiro 2026).
**Foco**: Performance e estabilidade ("Nada de versão heavy ou beta").

## 1. Sistema & Core

| Componente | Versão Recomendada | Comando / Fonte |
|------------|--------------------|-----------------|
| **OS Host** | Ubuntu 22.04 LTS | [ubuntu-22.04.5-live-server-amd64.iso](https://releases.ubuntu.com/22.04/) |
| **Docker** | Engine (Latest) | [Instalação Oficial](https://docs.docker.com/engine/install/ubuntu/) |
| **Compose** | v2.29.1 | `curl .../v2.29.1/docker-compose-linux-x86_64` |

## 2. Aplicações (Versões Leves)

### n8n
-   **Versão**: `1.59.3-alpine`
-   **Motivo**: "Mais leve".
-   **Imagem**: `n8nio/n8n:1.59.3-alpine`
-   **Porta**: 5678

### Chatwoot
-   **Versão**: `v3.4.1` (v3.4.1.2)
-   **Nota**: "Sem extras".
-   **Imagem**: `chatwoot/chatwoot:v3.4.1.2-alpine`
-   **Porta**: 3000

### Evolution API
-   **Versão**: `2.2.9`
-   **Imagem**: `atendai/evolution-api:2.2.9`
-   **Porta**: 8080

### Browserless
-   **Versão**: Chrome 129
-   **Nota**: "Leve".
-   **Imagem**: `browserless/chrome:129`
-   **Porta**: 3001:3000

## 3. Infraestrutura & Dados

| Serviço | Versão | Imagem | Configuração |
|---------|--------|--------|--------------|
| **Qdrant** | v1.10.1 | `qdrant/qdrant:v1.10.1-alpine` | Mmap mode enabled |
| **Redis** | 7.2 | `redis:7.2-alpine` | Alpine |
| **Postgres** | 15 | `postgres:15-alpine` | `POSTGRES_DB=chatwoot` |
| **Traefik** | v3.0.0 | `traefik:v3.0` | Mínimo |
| **CrowdSec** | 1.6.8 | [Tarball v1.6.8](https://github.com/crowdsecurity/crowdsec/releases/) | - |
| **Watchtower**| 1.3.1 | `containrrr/watchtower:1.3.1` | - |
