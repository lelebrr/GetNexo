# GetNexo v1.0 🚀

**Plataforma de Automação de Vendas & Atendimento via WhatsApp com IA.**

GetNexo é uma solução completa "All-in-One" que transforma seu WhatsApp em uma máquina de vendas autônoma. Diferente de soluções tradicionais, o GetNexo oferece uma infraestrutura robusta, PIX nativo, e uma IA generativa treinada para converter leads em clientes.

## 🌟 Funcionalidades Principais

### 🤖 Automação & IA
-   **IA Generativa**: Respostas humanizadas baseadas no seu contexto.
-   **Flow Editor**: Criador de fluxos "Arrastar-e-Soltar" com persistência.
-   **Forge**: Gerador automático de plugins para WordPress/Shopify.

### 💰 Vendas & Loja
-   **Loja Integrada (`/loja`)**: Catálogo de produtos e checkout.
-   **PIX Nativo**: Geração automática de QR Code e validação via Webhook.
-   **Recuperação de Carrinho**: Automação para recuperar vendas perdidas.

### 👥 Gestão Completa
-   **Painel do Usuário**: Gestão de domínios, faturas e stats.
-   **Painel de Revenda**: Crie sub-contas, gerencie equipes (Admin/Editor/Viewer) e distribua códigos de desconto.
-   **Admin Master**: Controle total sobre roles, usuários e sistema.

## 🚀 Como Iniciar

### Desenvolvimento Local

1.  **Requisitos**: Node.js 18+, Docker (opcional para N8N/Evolution).
2.  **Instalação**:
    ```bash
    git clone https://github.com/lelebrr/GetNexo.git
    cd GetNexo
    npm install
    ```
3.  **Rodar Backend e Frontend**:
    ```bash
    # Terminal 1 (Backend)
    cd chat-api && npm run dev
    
    # Terminal 2 (Frontend)
    cd getnexo-site && npm run dev
    ```

### Deploy (Produção)

O projeto é otimizado para **Docker Compose**:

```bash
docker-compose up -d --build
```

Isso subirá:
-   `getnexo-site` (Frontend Astro) na porta 4321
-   `chat-api` (Backend Node.js) na porta 3000

## 📂 Estrutura do Projeto

-   `/getnexo-site`: Frontend Astro (SSR/Static).
-   `/chat-api`: Backend Node.js (SQLite + Express).
-   `/docs`: Documentação técnica e manuais.

## 📄 Licença

Proprietário: **GetNexo**. Todos os direitos reservados.
