# Sentinel v3 - Instalação e Uso

## Visão Geral
Sentinel v3 é uma IA interna que mantém o site GetNexo saudável, rápido, limpo e lucrativo. Executa automaticamente todo dia às 3h via cron.

## Arquivos Criados
- `scripts/sentinel-v3.js` - Script principal Node.js
- `scripts/.env.example` - Variáveis de ambiente
- `scripts/backup.sh` - Script de backup com verificação
- `scripts/sentinel-health.json` - Exemplo de relatório
- `getnexo-site/src/pages/admin/sentinel-dashboard.astro` - Página admin
- `getnexo-site/src/components/admin/SentinelDashboard.jsx` - Dashboard React

## Dependências Necessárias
```bash
npm install playwright lighthouse imagemin imagemin-webp axios chart.js react-chartjs-2
```

Instalar fdupes, certbot, ss, etc. no sistema:
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install fdupes openssl ss certbot imagemagick xz-utils

# Instalar Playwright browsers
npx playwright install
```

## Configuração

### 1. Ambiente
```bash
cp scripts/.env.example .env
# Editar .env com suas configurações
```

### 2. Permissões
```bash
chmod +x scripts/sentinel-v3.js
chmod +x scripts/backup.sh
```

### 3. Cron Job
Adicionar ao crontab (crontab -e):
```bash
0 3 * * * /usr/bin/node /home/lele/usenexo/scripts/sentinel-v3.js
```

### 4. Diretórios
```bash
mkdir -p /logs/sentinel
mkdir -p /mnt/backup  # ou seu diretório de backup
```

## Execução

### Manual (teste)
```bash
# Modo normal
node scripts/sentinel-v3.js

# Modo teste (não executa ações)
node scripts/sentinel-v3.js --dry-run

# Forçado (ignora horário)
node scripts/sentinel-v3.js --force
```

### Via API (dashboard)
- Acesse `/admin/sentinel-dashboard`
- Clique "Rodar Agora" para execução manual
- Veja gráficos em tempo real

## Funcionalidades

### Varredura de Arquivos
- Remove duplicatas, lixo, arquivos expostos
- Compacta logs grandes
- Alerta senhas fracas

### Performance
- Lighthouse scans em todas páginas
- Mede velocidade real
- Otimiza imagens automaticamente

### Segurança
- Bloqueia IPs maliciosos
- Renova SSL automaticamente
- Detecta portas abertas

### Otimização
- Comprime imagens com WebP/AVIF
- Remove código morto
- Cria redirects para 404s

### Backup
- Backup completo diário
- Verificação de integridade
- Restauração automática se corrompido

## Dashboard Admin
- **Gráfico Velocidade**: Score Lighthouse ao longo do dia
- **Gráfico Ataques**: IPs bloqueados por hora
- **Gráfico Economia IA**: Uso local vs Gemini
- **Gráfico Disco**: Uso de espaço por diretório
- **Logs Recentes**: Últimas ações do Sentinel
- **Botões**: Executar manual, ver backups, treinar bot

## Logs Estruturados
Armazenados em `/logs/sentinel/sentinel-YYYY-MM-DD.jsonl`:
```json
{"ts":"2026-01-21T03:05:00-03:00","evento":"link_quebrado","detalhe":"/old-page","acao":"criado_redirect","sucesso":true}
{"ts":"2026-01-21T03:08:12-03:00","evento":"imagem_grande","detalhe":"hero.jpg - 4.2MB","acao":"comprimida_para_webp","sucesso":true}
```

## Monitoramento
- Relatório diário em `/logs/saude-YYYY-MM-DD.json`
- Notificações Telegram (opcional)
- Alertas automáticos para admin

## Troubleshooting
- Verifique logs em `/logs/sentinel/`
- Execute com `--dry-run` para testar
- Certifique-se de que todos os comandos do sistema estão instalados

## Segurança
- Sentinel tem acesso total ao servidor (como solicitado)
- Logs criptografados se necessário
- Acesso restrito apenas a admin máximo

Pronto. O Sentinel cuidará do site enquanto você dorme. 🚀