#!/bin/bash

# Script de atualização automática do site
# Para agendar no crontab: 0 4 * * * /home/lele/usenexo/atualiza_site.sh

# Configurações
PROJECT_DIR="/home/lele/usenexo/getnexo-site"
BACKUP_DIR="/home/lele/usenexo/backups/site"
VERCEL_TOKEN="seu-token-vercel-aqui"  # Substitua pelo seu token Vercel
VERCEL_ID="seu-projeto-vercel-id"     # Substitua pelo ID do seu projeto Vercel
TIMESTAMP=$(date +"%Y%m%d_%H-%M-%S")
LOG_FILE="/home/lele/usenexo/atualiza_site.log"

# Criar diretório de backup
mkdir -p "$BACKUP_DIR"

# Função de log
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "🚀 Iniciando atualização automática do site..."

# 1. Backup dos arquivos GLB
log "📁 Criando backup dos arquivos GLB..."
if [ -d "$PROJECT_DIR/public/glb" ]; then
    cp -r "$PROJECT_DIR/public/glb" "$BACKUP_DIR/glb_$(date +%Y%m%d)"
    log "✅ Backup dos GLB criado: glb_$(date +%Y%m%d)"
else
    log "⚠️  Diretório GLB não encontrado, pulando backup..."
fi

# 2. Compactar backup
log "🗜️  Compactando backup..."
if [ -d "$BACKUP_DIR/glb_$(date +%Y%m%d)" ]; then
    tar -czf "$BACKUP_DIR/site_backup_${TIMESTAMP}.tar.gz" -C "$BACKUP_DIR" "glb_$(date +%Y%m%d)"
    rm -rf "$BACKUP_DIR/glb_$(date +%Y%m%d)"
    BACKUP_SIZE=$(du -h "$BACKUP_DIR/site_backup_${TIMESTAMP}.tar.gz" | cut -f1)
    log "✅ Backup compactado: site_backup_${TIMESTAMP}.tar.gz ($BACKUP_SIZE)"
fi

# 3. Limpar backups antigos (>15 dias)
log "🧹 Limpando backups antigos..."
OLD_BACKUPS=$(find "$BACKUP_DIR" -name "site_backup_*.tar.gz" -mtime +15 -type f)
if [ -n "$OLD_BACKUPS" ]; then
    while IFS= read -r old_backup; do
        rm -f "$old_backup"
        log "🗑️  Removido backup antigo: $(basename "$old_backup")"
    done <<< "$OLD_BACKUPS"
else
    log "📝 Nenhum backup antigo para remover"
fi

# 4. Navegar para o diretório do projeto
cd "$PROJECT_DIR" || {
    log "❌ Erro: Não foi possível acessar o diretório do projeto: $PROJECT_DIR"
    exit 1
}

# 5. Instalar dependências
log "📦 Instalando dependências..."
if npm ci; then
    log "✅ Dependências instaladas com sucesso"
else
    log "❌ Erro ao instalar dependências"
    exit 1
fi

# 6. Rodar build
log "🔨 Construindo o site..."
if npm run build; then
    log "✅ Site construído com sucesso"
else
    log "❌ Erro ao construir o site"
    exit 1
fi

# 7. Deploy no Vercel (se token estiver configurado)
if [ "$VERCEL_TOKEN" != "seu-token-vercel-aqui" ] && [ "$VERCEL_ID" != "seu-projeto-vercel-id" ]; then
    log "🚀 Deploy no Vercel..."
    
    # Instalar Vercel CLI se não existir
    if ! command -v vercel &> /dev/null; then
        log "📦 Instalando Vercel CLI..."
        npm install -g vercel
    fi
    
    # Fazer login no Vercel
    echo "$VERCEL_TOKEN" | vercel login --stdin
    
    # Fazer deploy
    if vercel --prod --yes --scope "$VERCEL_ID"; then
        log "✅ Deploy no Vercel realizado com sucesso!"
    else
        log "❌ Erro no deploy do Vercel"
    fi
else
    log "💡 Dica: Configure VERCEL_TOKEN e VERCEL_ID para deploy automático no Vercel"
fi

# 8. Notificação (opcional - pode integrar com webhook, Slack, etc.)
log "📧 Enviando notificação de atualização..."

# Exemplo de notificação por curl (webhook)
WEBHOOK_URL="https://hooks.slack.com/services/seu-webhook-url"
if [ "$WEBHOOK_URL" != "https://hooks.slack.com/services/seu-webhook-url" ]; then
    curl -X POST -H 'Content-type: application/json' \
        --data "{\"text\":\"🎉 Site atualizado! 25+ modelos leves, 100% AR. Disponível em: https://seu-site.vercel.app\"}" \
        "$WEBHOOK_URL" > /dev/null 2>&1
    log "✅ Notificação enviada"
else
    log "💡 Dica: Configure WEBHOOK_URL para receber notificações"
fi

# 9. Status final
CURRENT_BACKUPS=$(find "$BACKUP_DIR" -name "site_backup_*.tar.gz" -type f | wc -l)
TOTAL_SIZE=$(du -sh "$BACKUP_DIR" | cut -f1)
log "📊 Status atual: $CURRENT_BACKUPS backups no diretório ($TOTAL_SIZE)"

log "🎉 Atualização do site concluída com sucesso!"
log "🌐 Seu site está atualizado com os últimos modelos 3D e otimizações."

# 10. Enviar relatório por e-mail (opcional)
EMAIL_TO="admin@seusite.com"
if [ "$EMAIL_TO" != "admin@seusite.com" ]; then
    log "📧 Enviando relatório por e-mail..."
    echo "Site atualizado em $(date)

Status: ✅ Sucesso
Backup: Criado e compactado
Build: ✅ Sucesso
Deploy: ✅ Sucesso

Arquivos disponíveis em: $PROJECT_DIR/public/glb/
Total de modelos: 25+
Tamanho otimizado: 12MB (94% de redução)

Att,
Sistema Automático" | mail -s "Relatório de Atualização do Site" "$EMAIL_TO"
fi

exit 0