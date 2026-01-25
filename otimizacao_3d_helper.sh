#!/bin/bash

# Script de ajuda para otimização de modelos 3D
# Autor: Leandro
# Data: 2026

echo "🚀 Otimizador de Modelos 3D - Helper Script"
echo "=========================================="
echo ""

# Verifica se Blender está instalado
if ! command -v blender &> /dev/null; then
    echo "❌ Blender não encontrado! Por favor, instale o Blender:"
    echo "   Ubuntu/Debian: sudo apt install blender"
    echo "   Ou baixe de: https://www.blender.org/download/"
    exit 1
fi

echo "✅ Blender encontrado: $(blender --version | head -n1)"
echo ""

# Verifica se as pastas existem
if [ ! -d "models_raw" ]; then
    echo "❌ Pasta 'models_raw' não encontrada!"
    echo "   Criando pasta models_raw..."
    mkdir -p models_raw
fi

if [ ! -d "models_otimizados" ]; then
    echo "❌ Pasta 'models_otimizados' não encontrada!"
    echo "   Criando pasta models_otimizados..."
    mkdir -p models_otimizados
fi

echo "✅ Pastas verificadas:"
echo "   📁 models_raw/     (para arquivos .glb originais)"
echo "   📁 models_otimizados/ (para arquivos otimizados)"
echo ""

# Lista arquivos .glb disponíveis
echo "📋 Arquivos .glb encontrados em models_raw:"
count=$(find models_raw -name "*.glb" -o -name "*.gltf" | wc -l)
if [ $count -eq 0 ]; then
    echo "   Nenhum arquivo .glb/.gltf encontrado em models_raw/"
    echo "   Coloque seus arquivos .glb pesados na pasta models_raw/"
    echo ""
    echo "   Exemplo de como copiar arquivos:"
    echo "   cp /caminho/seus/arquivos.glb models_raw/"
else
    find models_raw -name "*.glb" -o -name "*.gltf" | head -10
    echo "   Total: $count arquivo(s) encontrado(s)"
fi

echo ""

# Pergunta se quer executar a otimização
read -p "🤖 Deseja executar a otimização agora? (s/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Ss]$ ]]; then
    echo "🚀 Iniciando otimização..."
    
    # Executa o script do Blender
    blender --background --python otimiza_blender.py
    
    echo ""
    echo "✅ Otimização concluída!"
    echo "   Verifique a pasta models_otimizados/ para os resultados"
    
    # Lista os arquivos otimizados
    echo ""
    echo "📋 Arquivos otimizados:"
    find models_otimizados -name "*_otimizado.glb" | head -10
    count=$(find models_otimizados -name "*_otimizado.glb" | wc -l)
    echo "   Total: $count arquivo(s) otimizado(s)"
else
    echo "👋 Otimização cancelada. Execute manualmente quando estiver pronto:"
    echo "   blender --background --python otimiza_blender.py"
fi

echo ""
echo "📖 Para mais informações, leia o README_OTIMIZACAO_3D.md"