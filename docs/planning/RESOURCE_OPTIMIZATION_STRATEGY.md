# 📉 Estratégia de Otimização de Recursos (Lazy Loading)

**Origem**: Lista de "50 otimizações" para rodar leve (Janeiro 2026).
**Objetivo**: Rodar múltiplos clientes em hardware limitado (8GB RAM) desligando ocioso.

## 1. Princípios Gerais

1.  **Lazy-Load Total**: Nada roda se não estiver sendo usado.
2.  **Container Efêmero**: Serviços morrem após inatividade.
3.  **Micro-blocos**: Chat, IA, Frete em containers separados.

## 2. Regras de Otimização (Top 50 Highlights)

### Infraestrutura & Containers
-   **n8n Queue Mode**: Não roda loop ocioso, apenas consome fila.
-   **Redis Sob Demanda**: Só inicia se o módulo de IA for ativado.
-   **Qdrant Sleep**: Desliga à noite, sobe em 3s ao receber requisição.
-   **Postgres Parcial**: Carrega apenas tabelas críticas na RAM.
-   **Browserless Killer**: Mata instância Chrome se ociosa por 10s.
-   **Alpine Base**: Todas imagens base Alpine (-80MB cada).
-   **Zero Swappiness**: ZRAM ativado apenas se RAM livre < 2GB.
-   **Docker Prune**: Limpeza automática de imagens velhas.
-   **CPU Limitada**: Chatwoot 1.5 cores, n8n 0.8, Banco 1.0.

### Aplicação & Lógica
-   **Lazy-load WhatsApp**: Módulo só liga ao chegar mensagem.
-   **API Cupons**: Só ativa se cliente digitar "desconto" ou "cupom".
-   **Logs Condicionais**: Loki só grava ERROR, descarta INFO/DEBUG normal.
-   **Sleep Mode**: Usuário inativo 30min -> Container pausa.
-   **Delays n8n**: Não rodar workflows em loop frenético sem necessidade.
-   **Cache Preço**: Cache 60s para API de E-commerce (VTEX/Bling).
-   **Thread Isolada**: Conversas não compartilham memória.
-   **Session Storage**: Banco em memória só pra sessão, disco pra histórico.
-   **Kill-switch Redis**: Switch global para matar serviços em 1s.

### Frontend & UX Leve
-   **CSS Chunks**: Carrega Dark Mode e Mobile separadamente.
-   **Imagens**: Base64 só para ícones críticos. Lazy-load no resto.
-   **Desativa AR/WebGL**: Se detectar dispositivo antigo/bateria baixa.
-   **Mini-games Offline**: Rodam no client-side, zero server req.
-   **Templates em Cache**: HTML cacheado no browser.
-   **Fontes Web Condicionais**: Só baixa se cliente não tiver fonte nativa.
-   **Fallback Texto**: Se imagem falhar, mostra texto (não quebra layout).

### Manutenção & Rotina
-   **Cron Madrugada**: Backups pesados só rodam de madrugada.
-   **Garbage Collect**: Script limpa cache a cada hora.
-   **RAG Refresh**: Desliga indexação se conhecimento não mudou em 24h.
-   **Sessão Login**: Expira em 20min de inatividade.
-   **Alertas Batch**: Agrupa 5 notificações antes de enviar (menos ping).
-   **Modo Ultra-Leve**: Botão de pânico que desliga 80% das funções e deixa só chat texto.
