#!/bin/bash
# Monta o HD externo (ex: /dev/sdb1)
mkdir -p /mnt/backup-externo
mount /dev/sdb1 /mnt/backup-externo

# Copia tudo da pasta de logs
rsync -av --progress /logs/conversas/ /mnt/backup-externo/conversas-semanal/

# Compacta pra economizar espaço
tar -czf /mnt/backup-externo/backup-conversas-$(date +%Y%m%d).tar.gz -C /logs conversas

# Compacta sessões
tar -czf /mnt/backup-externo/backup-sessions-$(date +%Y%m%d).tar.gz -C / sessions

# Desmonta
umount /mnt/backup-externo
echo "Backup semanal concluído."