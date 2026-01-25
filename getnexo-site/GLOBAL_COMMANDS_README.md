# Global Commands - Administração

## Visão Geral

Os botões de "Global Commands" são controles de sistema que permitem gerenciar various aspectos da aplicação de forma centralizada.

## Botões Disponíveis

### 🔄 Atualizar Padrões
**Função:** Atualiza as configurações e padrões do sistema

**O que faz:**
- Sincroniza configurações do banco de dados
- Atualiza templates de e-mail
- Recarrega regras de negócio
- Sincroniza com serviços externos

**Quando usar:**
- Após alterar configurações no painel
- Quando mudar endpoints de API
- Para sincronizar com serviços de terceiros

**Endpoint:** `POST /api/admin/update-patterns`

---

### 💾 Ver Backups
**Função:** Lista todos os backups disponíveis no sistema

**O que faz:**
- Escaneia o diretório `/backups`
- Mostra nome, data e tamanho de cada backup
- Exibe lista formatada no console

**Quando usar:**
- Para verificar backups existentes
- Antes de criar novos backups
- Para confirmar que backups estão sendo criados

**Endpoint:** `GET /api/admin/list-backups`

**Formato da resposta:**
```json
{
  "backups": [
    {
      "name": "backup-2026-01-25.json",
      "date": "25/01/2026",
      "size": "1.2 MB"
    }
  ]
}
```

---

### 🧹 Limpar Logs
**Função:** Remove todos os arquivos de log do sistema

**O que faz:**
- Escaneia o diretório `/logs`
- Remove todos os arquivos de log
- Libera espaço em disco

**Quando usar:**
- Quando logs ficam muito grandes
- Para limpar logs antigos
- Após resolução de problemas

**⚠️ Aviso:** Esta ação não pode ser desfeita!

**Endpoint:** `POST /api/admin/clear-logs`

---

### 🚨 Emergency Reset
**Função:** Executa um reset completo do sistema

**O que faz:**
1. **Limpa caches** - Remove arquivos de cache do Astro
2. **Limpa logs** - Remove todos os arquivos de log
3. **Verifica configurações** - Confere integridade das configs
4. **Reinicia serviços** - Simula reinicialização de serviços

**Quando usar:**
- Sistema está lento ou travado
- Após grandes alterações de código
- Para resolver problemas de performance
- Em emergências de sistema

**⚠️ Aviso:** Esta ação é irreversível e requer confirmação dupla!

**Endpoint:** `POST /api/admin/emergency-reset`

**Resposta:**
```json
{
  "success": true,
  "message": "Emergency Reset executado com sucesso",
  "details": {
    "cache": "limpo",
    "logs": "limpos",
    "services": "reiniciados"
  }
}
```

---

## Fluxo de Trabalho Recomendado

### Para Atualizações de Sistema
1. 🔄 Atualizar Padrões
2. 💾 Ver Backups (confirmação)
3. 🚨 Emergency Reset (se necessário)

### Para Manutenção
1. 🧹 Limpar Logs
2. 💾 Ver Backups
3. 🔄 Atualizar Padrões

### Para Emergências
1. 🚨 Emergency Reset
2. Aguardar reinicialização
3. Verificar logs

---

## Segurança

### Confirmações
- **Limpar Logs:** Confirmação única
- **Emergency Reset:** Confirmação dupla (dois diálogos)

### Logs de Auditoria
Todas as ações são registradas no console do servidor:
```
🔄 Atualizando padrões do sistema...
✅ Padrões atualizados com sucesso
🧹 15 arquivos de log foram limpos
🚨 Emergency Reset iniciado...
✅ Emergency Reset concluído com sucesso
```

---

## Troubleshooting

### Botão não responde
1. Verifique se o JavaScript está habilitado
2. Abra o console do navegador (F12)
3. Verifique erros de conexão
4. Recarregue a página (Ctrl+F5)

### Erro na API
1. Verifique logs do servidor
2. Confira permissões de diretório
3. Verifique espaço em disco
4. Consulte logs de erro

### Emergency Reset falha
1. Verifique permissões de escrita
2. Confira espaço em disco disponível
3. Verifique se diretórios existem
4. Consulte logs do sistema

---

## Endpoints de API

| Botão | Método | Endpoint | Descrição |
|-------|--------|----------|-----------|
| Atualizar Padrões | POST | `/api/admin/update-patterns` | Atualiza configurações |
| Ver Backups | GET | `/api/admin/list-backups` | Lista backups disponíveis |
| Limpar Logs | POST | `/api/admin/clear-logs` | Remove todos os logs |
| Emergency Reset | POST | `/api/admin/emergency-reset` | Reset completo do sistema |

---

## Dicas

### Para Desenvolvedores
- Use `console.log` para debug
- Monitore logs do servidor
- Teste em ambiente de desenvolvimento primeiro

### Para Administradores
- Faça backup antes de Emergency Reset
- Monitore espaço em disco
- Documente alterações de configuração

### Para Usuários
- Aguarde confirmações
- Não interrompa processos
- Verifique logs após ações

---

## Status

✅ **Funcionalidade:** Implementada e testada  
✅ **APIs:** Criadas e funcionando  
✅ **Segurança:** Confirmações implementadas  
✅ **Logs:** Auditoria completa  

**Versão:** 1.0  
**Status:** ✅ Produção  
**Atualizado:** 25/01/2026
