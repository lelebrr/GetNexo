#!/bin/bash

# Script para corrigir símbolos HTML < > que estão causando erros no TypeScript

files=(
  "src/pages/blog/multiplos-numeros.astro"
  "src/pages/blog/n8n.astro"
  "src/pages/blog/upsell.astro"
  "src/pages/blog/whatsapp-flows-automatizados.astro"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "Corrigindo símbolos HTML em $file..."
    sed -i 's|< 200%|< 200%|g; s|> 0.8|> 0.8|g; s|< 1500|< 1500|g' "$file"
  fi
done

echo "Correção de símbolos HTML concluída!"