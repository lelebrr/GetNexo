# 🛠️ 40 Tweaks de Infraestrutura (Expert Mode)

**Origem**: Lista de otimizações "sem teoria, só prática" (Janeiro 2026).
**Objetivo**: Ajustes finos para estabilidade, performance e segurança em produção.

## 1. Memória e CPU (Anti-Travamento)
1.  **Qdrant Híbrido**: Usar `--in-memory` com cache, carregar mmap apenas se RAM apertar.
2.  **Zswap + LZ4**: Swap off total. Usar `zswap` com compressão `lz4` (compressão em tempo real sem I/O de disco).
3.  **Browserless Limitado**: Max 2 instâncias paralelas, 128MB cada. Sobe apenas se fila > 5.
4.  **n8n Queue Mode**: Workers em container separado (512MB), escalonável com `--scale`.
5.  **Postgres Tuning**: `effective_cache_size=2GB`, `shared_buffers=512MB`.
6.  **Redis LRU**: `maxmemory 384MB`, policy `allkeys-lru` (mata chaves antigas sem dó).

## 2. Redes e Latência
7.  **DNS Interno (Pi-hole)**: Bloquear trackers e acelerar lookup dentro da rede Docker.
8.  **Failover VPN**: Cloudflare Tunnel principal + Tailscale backup automático.
9.  **Rate Limit Nginx**: Global 100 req/s, Burst 300 (pra aguentar chat).
10. **Cache API Nginx**: 1min TTL para embeddings repetidos (alivia Gemini).

## 3. Segurança Pragmática
11. **Honeypot WP**: Rota falsa `/wp-login.php` e `/admin` -> CrowdSec bane IP na hora.
12. **CPU Kill Script**: Mata containers se CPU > 90% por 30s (evita loop infinito de IA).
13. **Vault Docker**: Chaves de API (Gemini/Groq) em rotação semanal automática.
14. **Log Shipping**: Enviar logs para Loki -> Alerta no App se tentar SQLi.
15. **Fail2Ban API**: 500 erros seguidos no Evolution API = Ban (protege número do Whats).

## 4. IA e Workflows Seguros
16. **Guardrail Prefix**: Prompt system forced: "NUNCA responda dados PII".
17. **Filtro RAG**: Similaridade > 0.8 apenas (corta alucinação).
18. **Fallback Local**: Phi-2 no Ollama (Docker fake GPU), ativa só se Groq der 503.
19. **Sanitizador PII n8n**: Regex (CPF/Tel) mascarado antes de enviar pra IA.
20. **Escalonamento Humano**: Confiança < 60% -> Abre ticket automático.

## 5. Backup e Disaster Recovery
21. **Restic S3**: Cripto AES-256, incremental diário, full semanal.
22. **Restore Test**: VM vazia restaura backup mensalmente (validação automática).
23. **Kill Switch Webhook**: POST externo pro Redis mata tudo em 5s.
24. **LVM Snapshots**: Janela de 15min para reverter bug no Postgres.

## 6. UI e Usabilidade
25. **Glassmorphism Fallback**: Degrada graciosamente para Material Design em mobile/safari antigo.
26. **Dark Mode Email**: CSS com `@media (prefers-color-scheme)`.
27. **Sync Notion**: Ticket criado = Página automática na Knowledge Base.
28. **TTS Seletivo**: Áudio apenas para tickets críticos (economiza banda).

## 7. Manutenção e Monitoramento
29. **Docker Stats Bot**: Telegram alerta se RAM Host > 7GB.
30. **Watchtower Seletivo**: Atualiza Front/n8n, bloqueia update de Banco.
31. **Health-Check Real**: Uptime-Kuma ignora container rodando, testa resposta HTTP.
32. **Log Cleaner**: Script apaga logs > 7 dias.

## 8. Extras (Custo/Benefício)
33. **NVMe Obrigatório**: Se for HDD, Qdrant e Swap matam a performance.
34. **Provider**: Hetzner/OVH (Custo-benefício melhor que AWS).
35. **Modo Economia**: Cron desliga workers à noite (00h-07h).
36. **Cache Embedding**: Redis 1h TTL para textos iguais.
37. **Brotli Proxy**: Compressão nível 6 (30% menos tráfego).
38. **Locust Test**: Simular 200 users antes de ir pra produção.
39. **Wiki Interna**: DokuWiki (128MB) para documentar a infra.
40. **Férias**: Backup humano é essencial.
