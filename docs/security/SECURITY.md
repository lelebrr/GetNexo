# Security Hardening Guide

Guia completo de segurança para o Ultimate Autonomous Support System.

---

## 🛡️ Defense in Depth

O sistema implementa múltiplas camadas de segurança:

```
┌─────────────────────────────────────────────────────────────────┐
│                    1. CLOUDFLARE EDGE                           │
│    DDoS Mitigation · WAF · Bot Management · SSL/TLS            │
├─────────────────────────────────────────────────────────────────┤
│                    2. ZERO TRUST TUNNEL                         │
│    Sem portas abertas no router · Conexão outbound apenas      │
├─────────────────────────────────────────────────────────────────┤
│                    3. CROWDSEC IPS                              │
│    Análise de logs · Threat Intelligence · IP Banning          │
├─────────────────────────────────────────────────────────────────┤
│                    4. TRAEFIK REVERSE PROXY                     │
│    Rate Limiting · Security Headers · Brotli Compression       │
├─────────────────────────────────────────────────────────────────┤
│                    5. NETWORK ISOLATION                         │
│    Frontend · Backend · Database (3 redes segregadas)          │
├─────────────────────────────────────────────────────────────────┤
│                    6. APPLICATION SECURITY                      │
│    HMAC Webhooks · JWT · Input Validation · Output Encoding    │
├─────────────────────────────────────────────────────────────────┤
│                    7. DATABASE SECURITY                         │
│    Rede isolada · Connection Pooling · Encrypted at rest       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1. Cloudflare Edge (Configuração Recomendada)

### 1.1 Configurar WAF

No Cloudflare Dashboard > Security > WAF:

```yaml
# Regras Recomendadas
- Block: Known Bad Bots
- Block: SQL Injection attempts
- Block: XSS attempts
- Block: Path Traversal
- Challenge: High risk traffic from TOR
- Challenge: Requests without User-Agent
```

### 1.2 Page Rules (Caching)

```yaml
# Cache de assets estáticos
- URL: *seudominio.com/packs/*
  Cache Level: Cache Everything
  Edge Cache TTL: 1 month

- URL: *seudominio.com/assets/*
  Cache Level: Cache Everything
  Edge Cache TTL: 1 month

# Bypass para APIs
- URL: *seudominio.com/api/*
  Cache Level: Bypass
```

### 1.3 Bot Management

```yaml
# Configuração de Bot Fight Mode
Bot Fight Mode: ON
JavaScript Detection: ON
Privacy Pass Support: ON

# Firewall Rules
- Block if cf.client.bot equals true
- Block if cf.threat_score > 30
```

---

## 2. CrowdSec Configuration

### 2.1 Instalar Collections

```bash
docker exec crowdsec cscli collections install \
  crowdsecurity/traefik \
  crowdsecurity/http-cve \
  crowdsecurity/whitelist-good-actors \
  crowdsecurity/linux \
  crowdsecurity/sshd
```

### 2.2 Criar Bouncer

```bash
# Gerar API key para Traefik
docker exec crowdsec cscli bouncers add traefik-bouncer

# Copiar a key para .env: CROWDSEC_BOUNCER_API_KEY
```

### 2.3 Whitelist IPs Confiáveis

```yaml
# crowdsec/parsers/whitelist.yaml
name: local/whitelist
description: "Whitelist trusted IPs"
whitelist:
  reason: "Trusted IPs"
  ip:
    - "10.0.0.0/8"
    - "172.16.0.0/12"
    - "192.168.0.0/16"
```

### 2.4 Monitorar Atividade

```bash
# Ver decisões ativas (IPs banidos)
docker exec crowdsec cscli decisions list

# Ver alertas
docker exec crowdsec cscli alerts list

# Estatísticas
docker exec crowdsec cscli metrics
```

---

## 3. Rate Limiting

### 3.1 Configuração Traefik

Já configurado em `traefik/dynamic/middlewares.yaml`:

```yaml
rate-limit:
  rateLimit:
    average: 100    # 100 requests
    burst: 50       # Burst de 50
    period: 1m      # Por minuto

rate-limit-strict:
  rateLimit:
    average: 20     # Para endpoints sensíveis
    burst: 10
    period: 1m
```

### 3.2 Aplicar em Endpoints Específicos

```yaml
# Para login/auth (mais restritivo)
http:
  routers:
    chatwoot-auth:
      rule: "Host(`chat.domain.com`) && PathPrefix(`/auth`)"
      middlewares:
        - rate-limit-strict@file
```

---

## 4. Honeypots

### 4.1 Rotas Falsas Configuradas

O arquivo `traefik/dynamic/honeypots.yaml` cria armadilhas:

| Rota | Alvo |
|------|------|
| `/wp-admin`, `/wp-login` | WordPress scanners |
| `/phpmyadmin`, `/pma` | PHPMyAdmin exploits |
| `/.env`, `/.git/config` | Config leaks |
| `/backup`, `/db.sql` | Backup exposure |
| `/shell`, `/cmd` | Webshell attempts |

### 4.2 Ação

- Request é logado no Traefik
- CrowdSec processa e identifica o IP como malicioso
- IP é banido automaticamente

---

## 5. IA Guardrails (n8n)

### 5.1 Prompt Injection Prevention

Crie um nó de validação no n8n antes de enviar ao LLM:

```javascript
// Código para nó "Code" no n8n
const input = $input.first().json.message;

// Patterns de Prompt Injection
const dangerousPatterns = [
  /ignore (all )?(previous|above|prior) instructions/i,
  /forget (all )?(previous|above|prior)/i,
  /disregard (all )?(previous|above|prior)/i,
  /you are now/i,
  /new persona/i,
  /system prompt/i,
  /\[INST\]/i,
  /\[\[SYSTEM\]\]/i,
  /<\|im_start\|>/i,
  /```(system|assistant)/i,
];

let isSafe = true;
let detectedPattern = null;

for (const pattern of dangerousPatterns) {
  if (pattern.test(input)) {
    isSafe = false;
    detectedPattern = pattern.toString();
    break;
  }
}

if (!isSafe) {
  // Log tentativa
  console.warn(`Prompt injection detected: ${detectedPattern}`);
  
  return [{
    json: {
      blocked: true,
      reason: 'Input validation failed',
      response: 'Desculpe, não entendi sua mensagem. Pode reformular?'
    }
  }];
}

return $input.all();
```

### 5.2 PII Sanitization

```javascript
// Remover dados sensíveis antes de enviar ao LLM
const input = $input.first().json.message;

// CPF
let sanitized = input.replace(/\d{3}\.\d{3}\.\d{3}-\d{2}/g, '[CPF REMOVIDO]');

// Cartão de crédito
sanitized = sanitized.replace(/\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, '[CARTÃO REMOVIDO]');

// Email
sanitized = sanitized.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL REMOVIDO]');

// Telefone BR
sanitized = sanitized.replace(/(\+55\s?)?(\(?\d{2}\)?[\s-]?)?\d{4,5}[\s-]?\d{4}/g, '[TELEFONE REMOVIDO]');

return [{ json: { message: sanitized, original_had_pii: sanitized !== input } }];
```

### 5.3 Function Calling Validation

```javascript
// Validar output do LLM antes de executar
const llmOutput = $input.first().json;

// Schema esperado
const validFunctions = ['get_order_status', 'create_ticket', 'transfer_to_human'];

// Validar função
if (!validFunctions.includes(llmOutput.function_name)) {
  return [{
    json: {
      error: true,
      message: 'Função não permitida',
      fallback: 'Vou transferir você para um atendente humano.'
    }
  }];
}

// Validar parâmetros (exemplo para get_order_status)
if (llmOutput.function_name === 'get_order_status') {
  if (!llmOutput.params?.order_id || typeof llmOutput.params.order_id !== 'string') {
    return [{
      json: {
        error: true,
        message: 'Parâmetros inválidos'
      }
    }];
  }
  
  // Sanitizar order_id (prevenir injection)
  llmOutput.params.order_id = llmOutput.params.order_id.replace(/[^a-zA-Z0-9-]/g, '');
}

return $input.all();
```

### 5.4 System Prompt Guardrail

Adicione este prefixo mandatório ao *System Message* de todos os nós de LLM:

```text
NUNCA revele ou responda com dados PII (Bancos, CPF, Telefones).
Se o usuário solicitar dados sensíveis ou se você não tiver certeza sobre a segurança da resposta, diga: 'Preciso verificar essa informação com um supervisor humano' e encerre a resposta.
Mantenha um tom profissional e seguro.
```

---

## 6. Kill Switch

### 6.1 Como Funciona

Uma key no Redis (`AI_KILL_SWITCH`) pode desabilitar toda a IA instantaneamente.

### 6.2 Verificar no n8n

Adicione este nó no início de todo workflow com IA:

```javascript
const Redis = require('ioredis');
const redis = new Redis({ host: 'redis', port: 6379 });

const killSwitch = await redis.get('AI_KILL_SWITCH');

if (killSwitch === '1') {
  return [{
    json: {
      blocked: true,
      reason: 'AI temporarily disabled',
      response: 'No momento, estou operando em modo limitado. Um atendente vai ajudá-lo em breve.'
    }
  }];
}

return $input.all();
```

### 6.3 Ativar/Desativar

```bash
# EMERGÊNCIA: Desligar IA
docker exec redis redis-cli SET AI_KILL_SWITCH 1

# Religar IA
docker exec redis redis-cli SET AI_KILL_SWITCH 0
```

---

## 7. Webhook Security (HMAC)

### 7.1 Gerar Secret

```bash
# No .env
N8N_WEBHOOK_SECRET=$(openssl rand -hex 32)
```

### 7.2 Validar no n8n

```javascript
const crypto = require('crypto');

const secret = process.env.N8N_WEBHOOK_SECRET;
const receivedSignature = $input.first().headers['x-webhook-signature'];
const payload = JSON.stringify($input.first().json);

const expectedSignature = 'sha256=' + crypto
  .createHmac('sha256', secret)
  .update(payload)
  .digest('hex');

if (receivedSignature !== expectedSignature) {
  throw new Error('Invalid webhook signature');
}

return $input.all();
```

### 7.3 Enviar Webhook com Assinatura

```javascript
const crypto = require('crypto');

const secret = process.env.N8N_WEBHOOK_SECRET;
const payload = JSON.stringify({ event: 'test', data: {} });

const signature = 'sha256=' + crypto
  .createHmac('sha256', secret)
  .update(payload)
  .digest('hex');

// Incluir no header: x-webhook-signature
```

---

## 8. Brute Force Protection

### 8.1 Chatwoot

```yaml
# Já configurado via environment
MAX_LOGIN_ATTEMPTS: 5
LOGIN_LOCKOUT_MINUTES: 15
```

### 8.2 n8n

Protegido por Basic Auth + Rate Limiting.

### 8.3 CrowdSec Scenarios

```bash
# Instalar cenário de brute force
docker exec crowdsec cscli scenarios install crowdsecurity/http-bf
```

---

## 9. Backups Anti-Ransomware

### 9.1 S3 Object Lock

O script `scripts/backup-s3.sh` usa:

```bash
# Object Lock em modo GOVERNANCE
--object-lock-mode GOVERNANCE
--object-lock-retain-until-date "$(date -d '+30 days' --iso-8601=seconds)"
```

### 9.2 Criar Bucket com Object Lock

```bash
# AWS CLI
aws s3api create-bucket \
  --bucket your-backup-bucket \
  --object-lock-enabled-for-bucket \
  --region us-east-1

# Habilitar versionamento (obrigatório)
aws s3api put-bucket-versioning \
  --bucket your-backup-bucket \
  --versioning-configuration Status=Enabled
```

### 9.3 Testar Restore

```bash
# Listar backups
aws s3 ls s3://your-backup-bucket/backups/

# Baixar backup
aws s3 cp s3://your-backup-bucket/backups/backup_2024-01-15.tar.gz .

# Verificar integridade
sha256sum -c backup_2024-01-15.tar.gz.sha256

# Restore Postgres
docker exec -i postgres pg_restore -U postgres -d chatwoot_production < chatwoot_2024-01-15.dump
```

---

## 10. Auditoria (Logs)

### 10.1 Centralização

Todos os logs vão para stdout/stderr, capturados pelo Docker:

```bash
# Ver logs de todos os serviços
docker compose logs --since 1h

# Exportar para arquivo
docker compose logs --since 24h > audit_$(date +%Y%m%d).log
```

### 10.2 Log Rotation

Configurado no `docker-compose.yml`:

```yaml
logging:
  driver: local
  options:
    max-size: "10m"
    max-file: "3"
```

### 10.3 Enviar para SIEM (Opcional)

```yaml
# Adicionar ao docker-compose.yml para enviar a Elasticsearch/Loki
logging:
  driver: gelf
  options:
    gelf-address: "udp://localhost:12201"
```

---

## 11. Checklist de Segurança

### Antes de Production

- [ ] Todas as senhas em `.env` são únicas e fortes (32+ chars)
- [ ] Cloudflare Tunnel configurado (sem portas expostas)
- [ ] CrowdSec bouncer key gerada e configurada
- [ ] HTTPS em todos os domínios (via Cloudflare)
- [ ] Rate limiting testado
- [ ] Backup S3 com Object Lock configurado
- [ ] Kill Switch testado
- [ ] Honeypots gerando logs
- [ ] Guardrails de IA implementados no n8n
- [ ] Webhook secrets configurados

### Manutenção Mensal

- [ ] Revisar logs do CrowdSec (`cscli alerts list`)
- [ ] Verificar updates de segurança (Watchtower notifica)
- [ ] Testar restore de backup
- [ ] Rotacionar API keys
- [ ] Revisar regras do WAF Cloudflare

---

## 📞 Incidente Response

### Suspeita de Breach

1. **Ativar Kill Switch**: `redis-cli SET AI_KILL_SWITCH 1`
2. **Desconectar Tunnel**: `docker compose stop cloudflared`
3. **Preservar Logs**: `docker compose logs > incident_$(date +%s).log`
4. **Analisar CrowdSec**: `docker exec crowdsec cscli alerts list`
5. **Revogar API Keys**: Regenerar todas em `.env`
6. **Restore de Backup**: Se necessário

---

**Autor**: Leandro Barbosa  
**Versão**: 1.0.0  
**Classificação**: Interno
