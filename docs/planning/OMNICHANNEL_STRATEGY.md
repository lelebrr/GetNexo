# 🌐 Estratégia Omnichannel & Integração Social

**Origem**: Pedidos e ideias de conversas (Janeiro 2026).
**Objetivo**: Centralizar Instagram e Facebook no Chatwoot para resposta unificada.

## 1. Fluxo de Integração (Instagram & Facebook)

O Chatwoot atua como inbox central, puxando mensagens nativamente via API do Facebook.

### 1.1 Conexão Instagram (DM e Comentários)
1.  **Pré-requisito**: Ter uma conta Business do Instagram conectada a uma Página do Facebook.
2.  No Chatwoot:
    -   Acesse **Configurações > Inboxes > Add Inbox**.
    -   Selecione **Instagram**.
    -   Faça login e autorize a página do Facebook vinculada.
3.  **Resultado**:
    -   Toda DM e novo comentário cai no inbox unificado.
    -   Atendente (ou IA) responde no Chatwoot.
    -   Resposta aparece nativamente no Direct do cliente.

### 1.2 Conexão Facebook Messenger
1.  No Chatwoot:
    -   Acesse **Configurações > Inboxes > Add Inbox**.
    -   Selecione **Facebook**.
    -   Selecione a Página desejada.
2.  **Resultado**:
    -   Mensagens da página caem no Chatwoot.
    -   Resposta espelhada no Messenger original.

### 1.3 Backup & Alternativas
-   **Evolution API**: Suporta Instagram de forma experimental (útil como backup se API oficial falhar).
-   **n8n**: Pode disparar respostas customizadas via Graph API se necessário.

---

## 2. Experiência do Cliente

O fluxo é transparente para o usuário final:

1.  Cliente manda DM no Instagram.
2.  Mensagem cai no Chatwoot.
3.  IA (ou Humano) responde no Chatwoot.
4.  Resposta aparece no Instagram do cliente instantaneamente.

> **Meta**: "Cliente vê a resposta no canal que ele usou, experiência perfeita."
