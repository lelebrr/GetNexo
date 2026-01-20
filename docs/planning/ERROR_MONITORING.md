# 🚨 Monitoramento de Erros & Automação

**Origem**: Estratégia de estabilidade e feedback (Janeiro 2026).
**Objetivo**: Detectar falhas antes do cliente e facilitar o report de bugs.

## 1. Webhook de Erro Crítico (n8n)

Se o sistema detectar falha (IA 503, Redis Down, Qdrant Timeout > 3s), um workflow dispara alerta automático.

**Canais**: Telegram (Grupo Dev) ou Email.
**Conteúdo do Alerta**:
-   **Hora exata**: Timestamp ISO.
-   **Serviço Afetado**: ex: "Evolution API".
-   **Log**: Trecho do log do container (`docker logs --tail 20`).
-   **Print Automático**: Browserless tira screenshot do chat (se aplicável).
-   **Link**: Direto para o Dashboard Loki/Grafana.
-   **Ação**: Botão "Já resolvido" (callback para silenciar alerta).

## 2. Interface de Feedback (Cliente)

### 2.1 Botão "Reportar Bug"
No painel do cliente/admin:
1.  **Dropdown Simples**: "IA bugou", "Chat não abre", "Produto sumiu", "Outro".
2.  **Campo Texto**: Descrição livre.
3.  **Botão "Gravar Tela"**: Aciona Browserless para gravar 30s da sessão do usuário (se possível via plugin) ou solicita permissão de gravação.
4.  **Auto Diagnóstico**: Ao enviar, o front roda um check rápido (ping API, check whats) e anexa ao report.

### 2.2 Notificações de Saúde
-   **Mensagem Proativa**: "Seu sistema está com 97% uptime hoje. Viu algo estranho?"
-   **Checklist**: Se o cliente relata lentidão, exibe: "O chat abre? O Whats responde?". Se "Não", abre chamado técnico automaticamente.

## 3. Logs & Observabilidade

-   **Loki + Grafana**: Centralizador de logs leve.
-   **Watchtower**: Alerta sobre updates pendentes ou falhos.
-   **Health-checks**: Scripts rodam a cada minuto. Se falha persistir > 2x, dispara webhook.
