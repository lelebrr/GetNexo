# 🕐 Agendamento de Backup Automático

Para agendar o backup dos arquivos GLB para rodar todo dia às 3h da manhã:

## Passo 1: Abrir o crontab
```bash
crontab -e
```

## Passo 2: Adicionar a linha seguinte no final do arquivo:
```bash
0 3 * * * /home/lele/usenexo/backup_glb.sh
```

## Passo 3: Salvar e fechar
- No editor `nano`: `Ctrl + X`, depois `Y`, e `Enter`
- No editor `vim`: `:wq` e `Enter`

## Verificação
Para verificar se o cron foi agendado corretamente:
```bash
crontab -l
```

## O que acontece?
- Todo dia às 3h da manhã, o script `backup_glb.sh` será executado automaticamente
- Ele cria um backup compactado dos 25 arquivos GLB na pasta `/home/lele/usenexo/backups/`
- O backup tem nome com data e hora: `glb_YYYY-MM-DD_HH-MM-SS.tar.gz`
- Backups com mais de 30 dias são automaticamente deletados
- Tudo é registrado no arquivo `backup_glb.log`

## Logs do backup
Para ver o log do último backup:
```bash
tail -f /home/lele/usenexo/backup_glb.log
```

## Teste manual
Para testar o backup manualmente (sem aguardar 3h da manhã):
```bash
./backup_glb.sh
```

## Desagendar backup
Para remover o agendamento:
```bash
crontab -e
```
E apague a linha com o backup script.

---

✅ **Pronto! Seus arquivos GLB estão protegidos com backup automático diário.**