# Protocolos A2A (Agent-to-Agent) e AP2 (Agent Payments)

O **GetNexo Enterprise** agora suporta nativamente os protocolos A2A e AP2, permitindo que seus agentes de IA descubram, comuniquem-se e realizem transações financeiras com outros agentes autônomos de forma padronizada e segura.

---

## 🤖 O que é A2A (Agent-to-Agent)?

O **Protocolo A2A** é um padrão aberto que permite a interoperabilidade entre agentes de IA. Ele resolve o problema de comunicação isolada, permitindo que agentes de diferentes plataformas e fornecedores troquem mensagens e colaborem em tarefas complexas.

### Funcionalidades Implementadas
- **Discovery (Manifesto)**: Cada agente GetNexo expõe um manifesto público em `/api/a2a/manifest` descrevendo sua identidade, capacidades (skills) e endpoints de comunicação.
- **Peering (Conexão)**: Mecanismo para adicionar e gerenciar "Agentes Parceiros" (Peers) confiáveis.
- **Messaging (Webhook)**: Endpoint dedicado `/api/a2a/webhook` para receber mensagens assíncronas de outros agentes.

---

## 💳 O que é AP2 (Agent Payments Protocol)?

O **Protocolo AP2** é uma extensão do A2A focada em pagamentos. Ele utiliza **Credenciais Digitais Verificáveis (VDCs)** para garantir que transações iniciadas por agentes sejam seguras, auditáveis e autorizadas dentro de limites pré-estabelecidos.

### Funcionalidades Implementadas
- **Transações (Pay Intent)**: Endpoint `/api/ap2/pay` para iniciar pagamentos simulados ou reais.
- **Mandatos (Mandates)**: Armazenamento de permissões de pagamento (VDCs) que definem quanto e onde um agente pode gastar.
- **Histórico Auditável**: Log completo de todas as transações realizadas via protocolo AP2 na tabela `ap2_transactions`.

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
