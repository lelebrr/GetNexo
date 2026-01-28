#!/bin/bash

# Script para iniciar o servidor de autenticação do GetNexo

echo "🚀 Iniciando servidor de autenticação GetNexo..."
echo ""

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não está instalado!"
    echo "Por favor, instale o Node.js 18+ e tente novamente."
    exit 1
fi

# Verificar se npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm não está instalado!"
    echo "Por favor, instale o npm e tente novamente."
    exit 1
fi

echo "✅ Node.js: $(node --version)"
echo "✅ npm: $(npm --version)"
echo ""

# Navegar para o diretório do chat-api
cd "$(dirname "$0")"

# Verificar se node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
    echo ""
fi

# Iniciar o servidor
echo "🚀 Iniciando servidor na porta 3006..."
echo "📝 Endpoints disponíveis:"
echo "   POST /api/login - Login de usuário"
echo "   GET  /api/users - Verificar usuário logado"
echo "   POST /api/auth/forgot-password - Redefinir senha"
echo "   POST /api/auth/register - Criar conta"
echo "   GET  /api/health - Health check"
echo ""
echo "🔑 Credenciais de demonstração:"
echo "   Admin: admin@getnexo.com.br / admin123"
echo "   Revendedor: revendedor@getnexo.com / demo123"
echo "   Cliente: cliente@getnexo.com / demo123"
echo ""
echo "🛑 Pressione Ctrl+C para parar o servidor"
echo ""

npm start
