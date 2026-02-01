# GetNexus System

Sistema completo de chatbot com containers isolados, auto-escala e cobrança automática.

## Estrutura
- **api-central/**: Servidor Node.js principal (Auth, Usage, Webhooks).
- **client-frontend/**: Dashboard do cliente (HTML/JS).
- **admin-panel/**: Painel do admin (HTML/JS).
- **docker/client-bot/**: Código do bot e Dockerfile.
- **scripts/**: Scripts Python para auto-escala, monitoramento e cobrança.
- **templates/**: Templates Docker Compose.

## Como Rodar

### 1. Iniciar API Central
```bash
cd api-central
npm start
```
Rodará em `http://localhost:3000`.

### 2. Acessar Dashboards
Abra os arquivos HTML no navegador:
- `client-frontend/index.html` (Use email: teste@loja.com / senha: 123456 após criar conta)
- `admin-panel/index.html`

### 3. Rodar Scripts de Automação
Certifique-se de ter Python e bibliotecas instaladas (`pip install docker requests`).
- `python3 scripts/monitor_usage.py` (Coleta uso)
- `python3 scripts/auto_scale.py` (Verifica necessidade de escala)
- `python3 scripts/billing.py` (Gera cobrança mensal)

### 4. Docker Bot
Para buildar a imagem do bot:
```bash
cd docker/client-bot
docker build -t getnexo/client-bot:latest .
```

## Integração
Adicione o script `init.js` no site do cliente para carregar o chat.
```html
<script src="path/to/getnexus/init.js?client=SEU_CLIENT_ID"></script>
```
