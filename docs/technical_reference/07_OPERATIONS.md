# 🔧 Manutenção e Operação

**Status de Conclusão**: `[░░░░░░░░░░] 0%`

## 1. Comandos Diários

```bash
# Status dos serviços
docker compose ps

# Uso de recursos
docker stats --no-stream

# Logs recentes
docker compose logs --since 1h

# Health check
./scripts/health-check.sh
```

## 2. Backup Manual

```bash
./scripts/backup-s3.sh
```

## 3. Manutenção Noturna (Cron)

```bash
# Adicionar ao crontab
crontab -e

# Executar às 4h da manhã
0 4 * * * /opt/support-system/scripts/cron-restart.sh >> /var/log/cron-restart.log 2>&1
```

## 4. Kill Switch

```bash
# EMERGÊNCIA: Desligar IA
docker exec redis redis-cli SET AI_KILL_SWITCH 1

# Religar
docker exec redis redis-cli SET AI_KILL_SWITCH 0

# Verificar
docker exec redis redis-cli GET AI_KILL_SWITCH
```

## 5. Atualizar Serviços

```bash
# Pull novas imagens
docker compose pull

# Restart com novas imagens
docker compose up -d

# Verificar versões
docker compose images
```

---

# 🛠️ Troubleshooting

## 1. Container não inicia

```bash
# Ver logs
docker compose logs [service] --tail 100

# Verificar recursos
docker stats --no-stream

# Health check manual
docker inspect [container] | grep -A 10 Health
```

## 2. Memória alta

```bash
# Ver consumo
docker stats --no-stream --format "table {{.Name}}\t{{.MemUsage}}"

# Restart memory hogs
docker compose restart chatwoot-worker n8n browserless

# Forçar GC do Node
docker exec n8n node --expose-gc -e "global.gc()"
```

## 3. Database connection refused

```bash
# Verificar Postgres
docker compose logs postgres | tail -20

# Verificar PgBouncer
docker compose logs pgbouncer | tail -20

# Testar conexão
docker exec pgbouncer psql -h localhost -p 6432 -U postgres -c "SELECT 1"
```

## 4. CrowdSec não bloqueia

```bash
# Verificar bouncer
docker exec crowdsec cscli bouncers list

# Verificar alertas
docker exec crowdsec cscli alerts list

# Verificar decisões
docker exec crowdsec cscli decisions list

# Forçar ban (teste)
docker exec crowdsec cscli decisions add --ip 1.2.3.4 --reason "manual test"
```

## 5. Webhook não chega no n8n

```bash
# Verificar logs Evolution
docker compose logs evolution-api | grep webhook

# Testar webhook manualmente
curl -X POST https://n8n.domain.com/webhook/test \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```
