#!/bin/bash

# Script para configurar e iniciar Cloudflare Tunnel
# Execute com: bash config/cloudflared/update-tunnel.sh

echo "🔧 Configurando Cloudflare Tunnel para desenvolvimento local..."

# Verificar se cloudflared está instalado
if ! command -v cloudflared &> /dev/null; then
    echo "❌ cloudflared não encontrado. Instale com: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/tunnel-guide/"
    exit 1
fi

# Verificar se existe certificado de origem
if [ ! -f ~/.cloudflared/cert.pem ]; then
    echo "🔐 Fazendo login no Cloudflare para gerar certificado..."
    cloudflared tunnel login

    if [ $? -ne 0 ]; then
        echo "❌ Falha no login. Execute manualmente: cloudflared tunnel login"
        exit 1
    fi
fi

# Usar tunnel existente
echo "📡 Usando tunnel existente 'getnexo-tunnel'..."

# Configurar rotas DNS
echo "🔗 Configurando rotas DNS..."
cloudflared tunnel route dns getnexo-tunnel getnexo.com.br || echo "Rota já existe"
cloudflared tunnel route dns getnexo-tunnel chat.getnexo.com.br || echo "Rota já existe"
cloudflared tunnel route dns getnexo-tunnel admin.getnexo.com.br || echo "Rota já existe"

# Iniciar tunnel
echo "🚀 Iniciando tunnel..."
echo "Pressione Ctrl+C para parar o tunnel"
cloudflared tunnel --config config/cloudflared/config.yml run getnexo-tunnel