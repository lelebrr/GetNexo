# Protocolos A2A (Agent-to-Agent) e AP2 (Agent Payments)

O **GetNexo Enterprise** agora suporta nativamente os protocolos A2A e AP2, permitindo que seus agentes de IA descubram, comuniquem-se e realizem transações financeiras com outros agentes autônomos de forma padronizada e segura.

---

# Protocolo A2A e AP2 (Agent-to-Agent & Agent Payments)

O GetNexo agora suporta nativamente os protocolos de interoperabilidade entre agentes de IA, permitindo colaboração autônoma e pagamentos seguros.

## A2A (Agent-to-Agent Protocol) v1.0

### Discovery & Descoberta
O agente via expondo um **Agent Card** seguindo o padrão IANA em:
`/.well-known/agent-card.json`

Este arquivo contém:
- **Identidade Única**: UUID do agente.
- **Interfaces Suportadas**: REST e REST_STREAM (para chat em tempo real).
- **Capabilidades**: Lista de habilidades do agente (vendas, suporte, logística).
- **Extensões**: Links para outros protocolos como AP2.

### Mensageria
Os agentes podem trocar mensagens através de endpoints padronizados:
- `POST /api/a2a/message:send`: Envio de comando/mensagem síncrona.
- `POST /api/a2a/message:stream`: Stream de resposta em tempo real via SSE.

---

## AP2 (Agent Payments Protocol)

O AP2 estende o A2A com a capacidade de transacionar valores de forma segura usando **VDCs (Verifiable Digital Credentials)**.

### Mandatos (Mandates)
O sistema gerencia três tipos de mandatos:
1. **Cart Mandate**: Autorização para uma transação específica com o humano presente.
2. **Intent Mandate**: Autorização prévia para o agente gastar até um limite definido sem intervenção humana imediata.
3. **Payment Mandate**: Credencial final enviada à rede processadora.

### Segurança
- **Assinaturas Cryptográficas**: Todas as identidades usam pares de chaves RSA/Ed25519 (simulados).
- **Verificação de Regras**: O sistema valida limites de transação e validade temporal dos mandatos.

---

## Endpoints de Integração

| Endpoint | Método | Descrição | Pública |
|----------|---------|-----------|---------|
| `/.well-known/agent-card.json` | GET | Descoberta do Agente | Sim |
| `/api/a2a/message:send` | POST | Enviar mensagem ao agente | Sim* |
| `/api/ap2/pay` | POST | Iniciar pagamento AP2 | Sim* |
| `/api/a2a/config` | GET/POST | Configurações administrativas | Não |

*\* Requer validação de assinatura JWS/VDC em produção.*

---

## 🛠️ Implementação Técnica

### Backend (`chat-api`)

A implementação reside no diretório `chat-api/` e utiliza novas tabelas no banco de dados SQLite/PostgreSQL.

#### Endpoints Principais

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/a2a/manifest` | Retorna o perfil público do agente (JSON). |
| `POST` | `/api/a2a/webhook` | Recebe mensagens de outros agentes. |
| `GET` | `/api/a2a/peers` | Lista agentes parceiros cadastrados. |
| `POST` | `/api/ap2/pay` | Processa uma intenção de pagamento. |

#### Schema do Banco de Dados (`db.js`)

Novas tabelas foram adicionadas para suportar os protocolos:

- **`a2a_config`**: Armazena configurações de identidade (Nome, Descrição, Capabilities).
- **`a2a_peers`**: Lista de agentes externos confiáveis e seus endpoints.
- **`ap2_transactions`**: Registro imutável de transações financeiras.
- **`ap2_mandates`**: Armazenamento de VDCs (permissões de gasto).

### Frontend (`getnexo-site`)

Um novo painel administrativo foi adicionado em **Dashboard > Ferramentas > Protocolo A2A**.

#### Funcionalidades do Painel:
1.  **Identidade**: Configure como seu agente aparece para o mundo (Nome, Descrição, Skills).
2.  **Peers**: Adicione URLs de manifesto de outros agentes para iniciar conexões.
3.  **Pagamentos**: Visualize o histórico de transações AP2 em tempo real.
4.  **Documentação**: Guia rápido integrado sobre os protocolos.

---

## 🚀 Como Usar

1.  Acesse o Painel Administrativo (`/dashboard`).
2.  No menu lateral, clique em **Protocolo A2A**.
3.  Na aba **Identidade**, preencha os dados do seu agente e salve.
4.  Compartilhe sua **Manifest URL** com parceiros ou adicione a URL deles na aba **Peers**.
5.  As transações realizadas via API aparecerão automaticamente na aba **Pagamentos**.

---

## 📚 Referências Oficiais
- [A2A Protocol Specification](https://a2a-protocol.org/)
- [AP2 Payments Protocol](https://ap2-protocol.org/)
