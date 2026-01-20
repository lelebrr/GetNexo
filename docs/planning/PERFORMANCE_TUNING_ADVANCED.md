# ⚡ Performance Tuning & "Modo Turbo"

**Origem**: Lista de otimizações "Modo Velocidade" (Janeiro 2026).
**Objetivo**: Maximizar performance em hardware limitado ou escalar agressivamente.

## 1. Banco de Dados & Cache

-   **PostgreSQL**:
    -   `max_parallel_workers_per_gather = 4` (Paralelismo de query).
    -   `default_statistics_target = 100` (Planejamento de query otimizado).
    -   Tuning para NVMe (se disponível).
-   **Redis**:
    -   **Cluster Mode**: Sharding para dividir carga.
    -   `hz 20`: Flush mais frequente, evita picos de I/O.
    -   **Pipelines**: n8n manda 50 comandos em batch, não um por um.
-   **Qdrant**:
    -   **In-Memory Mode**: Desligar mmap se tiver RAM sobrando (voa baixo). Oposto da otimização de baixo custo.
    -   **Indexação Parcial**: Indexar apenas campos de busca (título, corpo), ignorar metadados pesados.

## 2. Compressão e Rede

-   **ZSTD**: Trocar `lz4` por `zstd` no ZRAM/Logs (melhor compressão, latência zero).
-   **Brotli**: Nginx/Traefik nível 6 (comprime JSON em 60%).
-   **DNS**: DNS over HTTPS (1.1.1.1) em todos containers.
-   **Kernel Tweaks**: `net.core.somaxconn = 100` (Mais conexões simultâneas).
-   **CDN Edge**: Cloudflare para CSS/Imagens estáticas.

## 3. Aplicações

-   **Evolution API**: Cache de sessão no Redis (não refazer login/QR code a cada envio).
-   **Browserless**: `--headless=chrome`, limitar debug, max 64MB/instância.
-   **Chatwoot (Rails)**: `perform_caching = true` (Cache de views).
-   **n8n**:
    -   Desligar painel web em produção (API only).
    -   Workers: `--scale=4` (Paralelismo).
-   **RAG**: Cortar `top-k` para 2 (menos vetores = resposta mais rápida).

## 4. Otimização de Sistema (OS)

-   **CPU Governor**: `performance` (sem economia de energia).
-   **Swap**: `swappiness = 0` (RAM é lei).
-   **Storage Driver**: Docker com `overlay2` (essencial).
-   **Backup**: Rclone com `--s3-chunk-size=32M` (Upload paralelo).
-   **Log Rotation**: Compressão `lzma` (menor I/O que gzip).
