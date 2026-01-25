#!/bin/bash

# Script de backup automático dos arquivos GLB
# Para agendar no crontab: 0 3 * * * /home/lele/usenexo/backup_glb.sh

# Configurações
SOURCE_DIR="/home/lele/usenexo/glb"
BACKUP_DIR="/home/lele/usenexo/backups"
RETENTION_DAYS=30
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_FILE="glb_${TIMESTAMP}.tar.gz"
LOG_FILE="/home/lele/usenexo/backup_glb.log"

# Criar diretório de backup se não existir
mkdir -p "$BACKUP_DIR"

# Função de log
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "🚀 Iniciando backup dos arquivos GLB..."

# Verificar se o diretório de origem existe
if [ ! -d "$SOURCE_DIR" ]; then
    log "❌ Erro: Diretório de origem não encontrado: $SOURCE_DIR"
    exit 1
fi

# Contar arquivos para backup
FILE_COUNT=$(find "$SOURCE_DIR" -name "*.glb" | wc -l)
log "📁 Encontrados $FILE_COUNT arquivos GLB para backup"

# Verificar se há arquivos para backup
if [ "$FILE_COUNT" -eq 0 ]; then
    log "⚠️  Nenhum arquivo GLB encontrado para backup"
    exit 0
fi

# Criar backup
log "🗜️  Compactando arquivos..."
if tar -czf "$BACKUP_DIR/$BACKUP_FILE" -C "$SOURCE_DIR" .; then
    BACKUP_SIZE=$(du -h "$BACKUP_DIR/$BACKUP_FILE" | cut -f1)
    log "✅ Backup criado com sucesso: $BACKUP_FILE ($BACKUP_SIZE)"
else
    log "❌ Erro ao criar backup"
    exit 1
fi

# Remover backups antigos
log "🧹 Limpando backups antigos (>$RETENTION_DAYS dias)..."
OLD_BACKUPS=$(find "$BACKUP_DIR" -name "glb_*.tar.gz" -mtime +$RETENTION_DAYS -type f)
if [ -n "$OLD_BACKUPS" ]; then
    while IFS= read -r old_backup; do
        rm -f "$old_backup"
        log "🗑️  Removido backup antigo: $(basename "$old_backup")"
    done <<< "$OLD_BACKUPS"
else
    log "📝 Nenhum backup antigo para remover"
fi

# Listar backups atuais
CURRENT_BACKUPS=$(find "$BACKUP_DIR" -name "glb_*.tar.gz" -type f | wc -l)
TOTAL_SIZE=$(du -sh "$BACKUP_DIR" | cut -f1)
log "📊 Status atual: $CURRENT_BACKUPS backups no diretório ($TOTAL_SIZE)"

log "🎉 Backup concluído com sucesso!"
exit 0