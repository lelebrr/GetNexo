#!/bin/bash

# Script de deploy completo do sistema GetNexo
set -e

echo "🚀 Iniciando deploy do sistema GetNexo..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Funções de log
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 1. Inicializar banco de dados
log_info "1. Inicializando banco de dados..."
cd database
node init-database.js
cd ..
log_info "✅ Banco de dados inicializado com sucesso!"

# 2. Instalar dependências do bot
log_info "2. Instalando dependências do bot..."
cd bot
npm install
log_info "✅ Dependências do bot instaladas!"

# 3. Instalar dependências do site
log_info "3. Instalando dependências do site..."
cd ../getnexo-site
npm install
log_info "✅ Dependências do site instaladas!"

# 4. Construir site
log_info "4. Construindo site..."
npm run build
log_info "✅ Site construído com sucesso!"

# 5. Validar configurações
log_info "5. Validando configurações..."

# Verificar se .env existe
if [ ! -f "../.env" ]; then
    log_warn "Arquivo .env não encontrado. Criando template..."
    cp .env.example ../.env
    log_warn "Por favor, edite o arquivo .env com suas configurações reais!"
fi

# Verificar chaves essenciais
source ../.env

if [ -z "$HF_KEY" ] || [ "$HF_KEY" = "hf_sua_chave_aqui" ]; then
    log_error "Hugging Face Key não configurada no .env!"
    exit 1
fi

log_info "✅ Configurações validadas!"

# 6. Iniciar serviços (opcional)
log_info "6. Serviços prontos para iniciar!"
echo ""
echo "🎉 DEPLOY COMPLETO! 🎉"
echo ""
echo "Para iniciar os serviços:"
echo "  Bot WhatsApp: cd bot && npm start"
echo "  Site: cd getnexo-site && npm run dev"
echo ""
echo "📋 Próximos passos:"
echo "  1. Configure as chaves API no arquivo .env"
echo "  2. Teste o bot: cd bot && npm start"
echo "  3. Acesse o site: http://localhost:3000"
echo ""
echo "🔐 Lembre-se de:"
echo "  - Nunca commitar chaves API no Git"
echo "  - Manter backups regulares do banco de dados"
echo "  - Monitorar os logs em tempo real"