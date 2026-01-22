#!/bin/bash

# Backup Script com Verificação - Sentinel v3
# Faz backup completo de arquivos, banco, logs e verifica integridade

BACKUP_DIR=${BACKUP_DIR:-/mnt/backup}
DATE=$(date +%Y-%m-%d_%H-%M-%S)
BACKUP_FILE="$BACKUP_DIR/backup-full-$DATE.tar.gz"

echo "🚀 Iniciando backup completo para $BACKUP_FILE"

# Verificar se backup dir existe
if [ ! -d "$BACKUP_DIR" ]; then
  echo "❌ Diretório de backup não encontrado: $BACKUP_DIR"
  exit 1
fi

# Backup de arquivos
echo "📁 Fazendo backup de arquivos..."
tar -czf "$BACKUP_FILE" \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='*.log' \
  --exclude='sessions' \
  /src /dist /logs /config /custom 2>/dev/null

# Backup de banco (assumindo PostgreSQL ou similar)
echo "💾 Fazendo backup de banco..."
if command -v pg_dump &> /dev/null; then
  pg_dump -U $DB_USER -h $DB_HOST $DB_NAME > "$BACKUP_DIR/db-$DATE.sql"
  gzip "$BACKUP_DIR/db-$DATE.sql"
elif command -v mysqldump &> /dev/null; then
  mysqldump -u $DB_USER -p$DB_PASS -h $DB_HOST $DB_NAME > "$BACKUP_DIR/db-$DATE.sql"
  gzip "$BACKUP_DIR/db-$DATE.sql"
fi

# Verificar integridade
echo "🔍 Verificando integridade..."
if tar -tzf "$BACKUP_FILE" >/dev/null 2>&1; then
  echo "✅ Backup íntegro: $BACKUP_FILE"
  # Limpar backups antigos (>7 dias)
  find "$BACKUP_DIR" -name "backup-full-*.tar.gz" -mtime +7 -delete
  echo "🧹 Backups antigos removidos."
else
  echo "❌ Backup corrompido! Removendo..."
  rm -f "$BACKUP_FILE"
  exit 1
fi

echo "✅ Backup concluído com sucesso."