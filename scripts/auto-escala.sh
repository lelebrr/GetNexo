#!/bin/bash

# Variáveis de limiar (ajusta conforme seu VPS)
RAM_MAX=85%           # uso de RAM que dispara escala
CONVERSAS_MAX=120     # mensagens/hora
CPU_MAX=75%           # carga média CPU

# Logs
LOG="/logs/auto-escala.log"
echo "Verificação $(date +'%F %T')" >> $LOG

# Checa uso atual
RAM_USO=$(docker stats bot --no-stream --format "{{.MemUsage}}" | awk '{print $1}' | sed 's/MiB//')
CPU_USO=$(docker stats bot --no-stream --format "{{.CPUA}}" | awk '{print $1}' | sed 's/%//')
CONVERSAS=$(grep "$(date +%Y-%m-%d)" /logs/conversas/conta-diaria.log | wc -l)

# Converte RAM pra número
RAM_NUM=$(echo $RAM_USO | sed 's/MiB//')
TOTAL_RAM=$(free -m | awk '/Mem:/ {print $2}')
RAM_PCT=$(echo "scale=2; ($RAM_NUM * 100) / $TOTAL_RAM" | bc)

# Se bater em qualquer métrica, escala
if (( $(echo "$RAM_PCT > $RAM_MAX" | bc -l) )) || (( $(echo "$CPU_USO > $CPU_MAX" | bc -l) )) || (( $CONVERSAS > $CONVERSAS_MAX )); then
  # Escala para cima
  NEW_RAM=$(( $(echo $RAM_BASE | sed 's/g//' ) * 2 ))g
  NEW_CPU=$(( $(echo $CPU_BASE | sed 's/0.//') * 2 )).0

  echo "Escalando: RAM ${NEW_RAM}, CPU ${NEW_CPU}, conversas ${CONVERSAS}" >> $LOG

  # Atualiza compose e reinicia (seguro, 3s de downtime)
  sed -i "s/mem_limit: 1g/mem_limit: ${NEW_RAM}/" docker-compose.yml
  sed -i "s/cpus: 1.0/cpus: ${NEW_CPU}/" docker-compose.yml
  sed -i "s/RAM_BASE=1g/RAM_BASE=${NEW_RAM}/" docker-compose.yml
  sed -i "s/CPU_BASE=1.0/CPU_BASE=${NEW_CPU}/" docker-compose.yml

  docker-compose down
  sleep 2
  docker-compose up -d

  # Avisa (opcional: Telegram ou syslog)
  echo "🚀 GetNexo: escalado para ${NEW_RAM} RAM, ${NEW_CPU} CPU — uso: ${RAM_PCT}% RAM, ${CPU_USO}% CPU, ${CONVERSAS} msg/h" | tee -a $LOG
else
  echo "Tudo ok: ${RAM_PCT}% RAM, ${CPU_USO}% CPU, ${CONVERSAS} msg/h" >> $LOG
fi