#!/bin/bash
# Automated PostgreSQL backup with encryption

BACKUP_DIR="/backups/postgres"
mkdir -p "$BACKUP_DIR"

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_$DATE.sql"
ENCRYPTION_KEY=${BACKUP_ENCRYPTION_KEY:-"change_me_to_secure_key"}
WEBHOOK_URL=${WEBHOOK_URL:-""}
DB_HOST=${DB_HOST:-"localhost"}
DB_USER=${DB_USER:-"postgres"}
DB_NAME=${DB_NAME:-"n8n"}

echo "Starting backup for $DB_NAME at $DATE..."

# Create backup
if PGPASSWORD=$DB_PASSWORD pg_dump -h "$DB_HOST" -U "$DB_USER" "$DB_NAME" > "$BACKUP_FILE"; then
    echo "Dump successful."

    # Compress
    gzip "$BACKUP_FILE"

    # Encrypt
    openssl enc -aes-256-cbc -salt -in "${BACKUP_FILE}.gz" -out "${BACKUP_FILE}.gz.enc" -k "$ENCRYPTION_KEY" -pbkdf2

    # Remove unencrypted files
    rm "${BACKUP_FILE}.gz"

    echo "Backup encrypted: ${BACKUP_FILE}.gz.enc"

    # Cleanup old backups (keep last 30 days)
    find "$BACKUP_DIR" -name "*.enc" -mtime +30 -delete

    # Send notification
    if [ ! -z "$WEBHOOK_URL" ]; then
        curl -X POST "$WEBHOOK_URL" -H "Content-Type: application/json" -d "{\"text\":\"✅ PostgreSQL backup completed: $DATE\"}"
    fi
else
    echo "❌ Backup failed!"
    if [ ! -z "$WEBHOOK_URL" ]; then
        curl -X POST "$WEBHOOK_URL" -H "Content-Type: application/json" -d "{\"text\":\"❌ PostgreSQL backup FAILED: $DATE\"}"
    fi
    exit 1
fi
