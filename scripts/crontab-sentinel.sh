#!/bin/bash

# crontab-sentinel.sh
# Instalar no crontab: crontab -e
# Adicionar: 0 */2 * * * /home/lele/usenexo/scripts/crontab-sentinel.sh

# Caminhos
SCRIPT_DIR="/home/lele/usenexo/scripts"
LOG_FILE="/home/lele/usenexo/logs/sentinel-cron.log"
PID_FILE="/home/lele/usenexo/scripts/sentinel.pid"

# Função de log
log() {
  echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
}

# Verificar se já está rodando
if [ -f "$PID_FILE" ]; then
  PID=$(cat "$PID_FILE")
  if kill -0 "$PID" 2>/dev/null; then
    log "Sentinel já está rodando (PID: $PID), pulando..."
    exit 0
  else
    log "PID antigo encontrado, removendo..."
    rm "$PID_FILE"
  fi
fi

# Rodar Sentinel v8
log "Iniciando ciclo Sentinel v8"
cd "$SCRIPT_DIR"
node sentinel-v8.js runCycle &
SENTINEL_PID=$!

# Salvar PID
echo $SENTINEL_PID > "$PID_FILE"
log "Sentinel iniciado com PID: $SENTINEL_PID"

# Aguardar conclusão
wait $SENTINEL_PID
EXIT_CODE=$?

# Limpar PID
rm "$PID_FILE"

# Log resultado
if [ $EXIT_CODE -eq 0 ]; then
  log "Ciclo Sentinel concluído com sucesso"
else
  log "Erro no ciclo Sentinel (código: $EXIT_CODE)"
fi

# Limpar logs antigos (manter 7 dias)
find /home/lele/usenexo/logs -name "*.log" -mtime +7 -delete