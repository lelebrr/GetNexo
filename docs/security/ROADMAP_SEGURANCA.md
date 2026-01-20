# 🔒 Roadmap de Segurança - GetNexo

> Documentação de features de segurança avançadas para implementação futura.

---

## 🔐 Melhorias no Sistema de Login

### 1. Autenticação 2FA (Two-Factor Authentication)

**Prioridade:** Alta  
**Esforço:** 3-5 dias

#### Implementação:
```javascript
// Opções de 2FA
const TFA_METHODS = {
  TOTP: 'Google Authenticator / Authy',
  SMS: 'Código via SMS',
  EMAIL: 'Código via Email',
  PUSH: 'Notificação Push (futuro)'
};
```

#### Bibliotecas Sugeridas:
- `speakeasy` - Geração de TOTP
- `qrcode` - QR Code para apps autenticadores
- `nodemailer` - Envio de email

#### Fluxo:
1. Usuário faz login com email/senha
2. Se 2FA ativado, redireciona para tela de código
3. Valida código TOTP/SMS/Email
4. Gera token JWT completo

---

### 2. Remember Me (Lembrar-me)

**Prioridade:** Média  
**Esforço:** 1 dia

#### Implementação:
```javascript
// Token de longa duração
const generateRememberToken = (userId) => {
  return jwt.sign(
    { id: userId, type: 'remember' },
    REMEMBER_SECRET,
    { expiresIn: '30d' }
  );
};

// Cookie seguro
res.cookie('remember_token', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 30 * 24 * 60 * 60 * 1000 // 30 dias
});
```

---

### 3. Reset de Senha por Email

**Prioridade:** Alta  
**Esforço:** 2 dias

#### Fluxo:
1. Usuário clica "Esqueci minha senha"
2. Insere email
3. Sistema gera token único (expira em 1h)
4. Envia email com link
5. Usuário define nova senha
6. Invalida todas as sessões anteriores

#### Tabela SQL:
```sql
CREATE TABLE password_resets (
  id INTEGER PRIMARY KEY,
  user_id INTEGER,
  token TEXT UNIQUE,
  expires_at DATETIME,
  used_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

### 4. Login Social (OAuth)

**Prioridade:** Baixa  
**Esforço:** 3-4 dias

#### Providers:
- Google OAuth 2.0
- GitHub OAuth
- Microsoft Azure AD (enterprise)

#### Bibliotecas:
- `passport.js` com strategies

---

## 🛡️ Segurança Adicional

### 1. Rate Limiting

**Prioridade:** Alta  
**Esforço:** 1 dia

#### Implementação:
```javascript
const rateLimit = require('express-rate-limit');

// Limite global
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requests por IP
  message: { error: 'Too many requests' }
});

// Limite específico para login (anti brute-force)
const loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 5, // 5 tentativas
  message: { error: 'Muitas tentativas. Tente novamente em 1 hora.' }
});

app.use('/auth/login', loginLimiter);
app.use(globalLimiter);
```

---

### 2. IP Blocking

**Prioridade:** Média  
**Esforço:** 2 dias

#### Tabela SQL:
```sql
CREATE TABLE blocked_ips (
  id INTEGER PRIMARY KEY,
  ip_address TEXT NOT NULL,
  reason TEXT,
  blocked_by INTEGER,
  blocked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME,
  permanent BOOLEAN DEFAULT FALSE
);
```

#### Middleware:
```javascript
const checkBlockedIP = async (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const blocked = await db.prepare(
    'SELECT * FROM blocked_ips WHERE ip_address = ? AND (expires_at > ? OR permanent = 1)'
  ).get(ip, new Date());
  
  if (blocked) {
    return res.status(403).json({ 
      error: 'IP bloqueado',
      reason: blocked.reason 
    });
  }
  next();
};
```

---

### 3. Session Management

**Prioridade:** Alta  
**Esforço:** 2-3 dias

#### Tabela SQL:
```sql
CREATE TABLE sessions (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  token_hash TEXT UNIQUE,
  ip_address TEXT,
  user_agent TEXT,
  device_info TEXT,
  location TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_activity DATETIME,
  expires_at DATETIME,
  revoked BOOLEAN DEFAULT FALSE,
  revoked_at DATETIME,
  revoked_reason TEXT
);
```

#### Features:
- Ver todas as sessões ativas
- Revogar sessões específicas
- "Sair de todos os dispositivos"
- Notificação de novo login

#### UI no Admin:
```
┌──────────────────────────────────────────────────────────────┐
│ 📱 Sessões Ativas                                            │
├──────────────────────────────────────────────────────────────┤
│ 🖥️ Chrome no Windows                                         │
│    IP: 187.45.xxx.xxx • São Paulo, BR                        │
│    Última atividade: Agora                    [Sessão Atual] │
├──────────────────────────────────────────────────────────────┤
│ 📱 Safari no iPhone                                          │
│    IP: 201.23.xxx.xxx • Rio de Janeiro, BR                   │
│    Última atividade: há 2 horas               [Encerrar]     │
├──────────────────────────────────────────────────────────────┤
│                        [🚪 Sair de Todos os Dispositivos]    │
└──────────────────────────────────────────────────────────────┘
```

---

### 4. CSRF Protection

**Prioridade:** Média  
**Esforço:** 1 dia

```javascript
const csrf = require('csurf');
app.use(csrf({ cookie: true }));

// Em cada form
<input type="hidden" name="_csrf" value="{{ csrfToken }}">
```

---

### 5. Security Headers

**Prioridade:** Média  
**Esforço:** 1 dia

```javascript
const helmet = require('helmet');
app.use(helmet());

// Headers específicos
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.socket.io"],
    styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    fontSrc: ["'self'", "https://fonts.gstatic.com"],
    imgSrc: ["'self'", "data:", "https:"],
    connectSrc: ["'self'", "https://api.getnexo.com.br", "wss://api.getnexo.com.br"]
  }
}));
```

---

## 📊 Métricas de Segurança

### Dashboard de Segurança:
- Total de tentativas de login falhas (24h)
- IPs bloqueados ativos
- Sessões ativas por usuário
- Últimos alertas de segurança
- Score de segurança do sistema

---

## 📅 Cronograma Sugerido

| Feature | Prioridade | Esforço | Sprint |
|---------|------------|---------|--------|
| Rate Limiting | Alta | 1 dia | Sprint 1 |
| Session Management | Alta | 3 dias | Sprint 1 |
| Reset Senha Email | Alta | 2 dias | Sprint 2 |
| 2FA (TOTP) | Alta | 4 dias | Sprint 2 |
| IP Blocking | Média | 2 dias | Sprint 3 |
| CSRF Protection | Média | 1 dia | Sprint 3 |
| Security Headers | Média | 1 dia | Sprint 3 |
| Remember Me | Média | 1 dia | Sprint 4 |
| Login Social | Baixa | 4 dias | Sprint 5 |

---

## 📚 Referências

- [OWASP Authentication Cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [OWASP Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
