#!/bin/bash

# Script para corrigir erros do Astro TypeScript
# Adiciona variáveis pageTitle, pageDescription, pageKeywords nos arquivos que usam Layout

files=(
  "src/pages/blog/metricas-analytics.astro"
  "src/pages/blog/multiplos-numeros.astro"
  "src/pages/blog/privacidade-2026.astro"
  "src/pages/blog/programa-revenda.astro"
  "src/pages/blog/recuperar-carrinho.astro"
  "src/pages/blog/suporte-rapido.astro"
  "src/pages/blog/tunnel.astro"
  "src/pages/blog/upsell.astro"
  "src/pages/blog/whatsapp-automatizado-guia.astro"
  "src/pages/blog/whatsapp-flows-automatizados.astro"
  "src/pages/blog/wsl.astro"
  "src/pages/precos.astro"
  "src/pages/test.astro"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "Corrigindo $file..."

    # Verifica se já tem as variáveis
    if ! grep -q "const pageTitle" "$file"; then
      # Adiciona após o import Layout
      sed -i '/import Layout from/a\
const pageTitle = "Página GetNexo";\
const pageDescription = "Descrição da página GetNexo";\
const pageKeywords = "getnexo, whatsapp, automacao";' "$file"
    fi
  fi
done

echo "Correção concluída!"