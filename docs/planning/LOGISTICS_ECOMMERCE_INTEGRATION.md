# 🚚 Logística & Integração E-commerce

**Origem**: Estratégia de "Logística Automática" e Sincronização em Tempo Real (Janeiro 2026).
**Objetivo**: Transformar o suporte em um hub logístico e comercial, sem o atendente precisar sair do chat.

## 1. Hub de Entregas (Nativo no Chat)

O sistema calcula frete, gera etiqueta e rastreia automaticamente dentro do ticket.

### 1.1 Fluxo de Automacão
1.  **Cotação**: Cliente digita CEP -> Sistema consulta agregadores (Frenet/Melhor Envio) -> Mostra opções (Preço x Prazo) no chat.
2.  **Etiqueta**: Cliente aprova -> Integração gera etiqueta de envio (Correios/Jadlog/Loggi).
3.  **Rastreio Ativo**:
    -   Webhook da transportadora atualiza o ticket ("Saiu para entrega").
    -   Notificação automática no WhatsApp do cliente: "Seu pacote chega hoje até as 18h".
    -   **Atraso**: Se detectar atrazo (API Latam Cargo), avisa proativamente: "Novo ETA amanhã 10h".

### 1.2 Integradores Principais
-   **Agregadores**: Frenet, Melhor Envio (cobre Correios, Jadlog, Latam, Azul).
-   **Last Mile (Urgência)**:
    -   **Uber Direct** / **Loggi** / **Lalamove**: Entrega em horas (mesma cidade).
    -   **Borzo (Click Entregas)**: Motoboy on-demand.
-   **Nacionais**: Total Express, Sequoia (Moda), Jamef (Carga pesada).

---

## 2. Integração E-commerce (ERP & Plataformas)

O Chatwoot/n8n atua como "controle remoto" da loja.

### 2.1 Plataformas Suportadas
| Plataforma | Features de Integração |
|------------|------------------------|
| **Shopify** | Carrinho em tempo real, criar pedido no chat, devolução. |
| **VTEX** | Catálogo sync, preço dinâmico, promoções. |
| **Nuvemshop** | Link direto de produto ("Quero esse"), status de pedido. |
| **Bling / Tiny** | Emissão de NFe e Boleto direto no chat. |
| **Wix / Loja Integrada** | Estoque real ("Só 5 sobrando"), histórico de cliente. |
| **CRM Bonus** | Saldo de pontos fidelidade no perfil do cliente. |

### 2.2 Funcionalidades Práticas
-   **Carrinho no Chat**: Atendente monta o carrinho, manda link de checkout ou Pix Copia e Cola.
-   **Estoque Real**: "Última unidade" (Sync com ERP previne venda sem estoque).
-   **Histórico**: Ao abrir ticket, mostra: "Comprou Tênis X ontem", "Devolveu Camisa Y mês passado".
-   **Devolução (Reversa)**: Clica um botão -> Gera código de postagem reversa -> Manda PDF pro cliente.
