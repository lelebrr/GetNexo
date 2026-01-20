# 🚀 Guia de Deployment

**Status de Conclusão**: `[░░░░░░░░░░] 0%`

## 1. Passo a Passo

```bash
# 1. Preparar servidor (Ubuntu 22.04)
sudo apt update && sudo apt upgrade -y
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
newgrp docker

# 2. Clonar/Copiar arquivos
mkdir -p /opt/support-system
cd /opt/support-system
# Copiar todos os arquivos do projeto

# 3. Configurar .env
cp .env.example .env
nano .env  # Preencher TODAS as variáveis obrigatórias

# 4. Gerar secrets
openssl rand -hex 64  # CHATWOOT_SECRET_KEY_BASE
openssl rand -hex 16  # N8N_ENCRYPTION_KEY
openssl rand -base64 32  # API keys

# 5. Otimizar host
sudo apt install zram-config -y
echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# 6. Criar diretórios
mkdir -p logs/traefik n8n/workflows
chmod +x scripts/*.sh postgres/init-db.sh
sudo chown -R 1000:1000 n8n/

# 7. Baixar imagens
docker compose pull

# 8. Iniciar em ordem
docker compose up -d postgres
sleep 30
docker compose up -d pgbouncer redis qdrant
sleep 10
docker compose up -d chatwoot chatwoot-worker n8n evolution-api stirling-pdf browserless
sleep 60
docker compose up -d crowdsec traefik
sleep 10
docker compose up -d cloudflared watchtower

# 9. Verificar
docker compose ps
docker compose logs -f

# 10. Pós-instalação
# Gerar CrowdSec bouncer key
docker exec crowdsec cscli bouncers add traefik-bouncer
# Adicionar key ao .env e reiniciar traefik
docker compose restart traefik

# Criar admin Chatwoot
docker exec -it chatwoot bundle exec rails console
# > SuperAdmin.create!(email: 'admin@domain.com', password: 'pass', confirmed_at: Time.now)
```

## 2. Cloudflare Tunnel Setup

1. Acesse https://one.dash.cloudflare.com/
2. **Access → Tunnels → Create Tunnel**
3. Nome: `support-system`
4. Copie o **Tunnel Token** para `.env`
5. Configure Public Hostnames:

| Hostname | Service | Path |
|----------|---------|------|
| chat.domain.com | http://traefik:80 | / |
| n8n.domain.com | http://traefik:80 | / |
| evolution.domain.com | http://traefik:80 | / |
| pdf.domain.com | http://traefik:80 | / |
