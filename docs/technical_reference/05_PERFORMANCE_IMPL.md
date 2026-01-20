# ⚡ Otimizações de Performance

**Status de Conclusão**: `[░░░░░░░░░░] 0%`

## 1. Checklist de Otimização

| # | Otimização | Economia RAM | Implementado |
|---|------------|--------------|--------------|
| 1 | Single Postgres | ~500MB | ✅ |
| 2 | Alpine Images | ~100MB | ✅ |
| 3 | PgBouncer Pooling | ~200MB | ✅ |
| 4 | Postgres Tuning | ~300MB | ✅ |
| 5 | Qdrant Disk Mode | ~500MB | ✅ |
| 6 | Redis LRU 100MB | ~400MB | ✅ |
| 7 | n8n Pruning | Disk | ✅ |
| 8 | n8n Success=none | Disk | ✅ |
| 9 | Sidekiq 5 | ~100MB | ✅ |
| 10 | No Local Whisper | ~4GB | ✅ (API) |
| 11 | No Local Embeddings | ~2GB | ✅ (API) |
| 12 | Docker log limit | Disk | ✅ |
| 13 | Cloudflared vs NPM | ~200MB | ✅ |
| 14 | Browserless limit | ~500MB | ✅ |
| 15 | n8n Own Mode | ~300MB | ✅ |

## 2. Tuning do Host

```bash
# ZRAM (compressão de RAM)
sudo apt install zram-config -y
sudo systemctl enable zram-config

# Swappiness (preferir RAM)
echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# Transparent Huge Pages (desabilitar para databases)
echo 'never' | sudo tee /sys/kernel/mm/transparent_hugepage/enabled
```
