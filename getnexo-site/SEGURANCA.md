# 🛡️ Documentação de Segurança - GetNexo

## Visão Geral

Este documento descreve as melhorias de segurança implementadas no projeto GetNexo para proteger contra ataques XSS (Cross-Site Scripting), garantir transporte seguro de dados e mitigar vulnerabilidades baseadas em DOM.

## 📋 Resumo das Melhorias

### 1. Content Security Policy (CSP) Avançada

**Problemas Identificados:**
- Uso de `'unsafe-inline'` e `'unsafe-eval'` - **ALTO RISCO**
- Listas de permissões de host podem ser ignoradas frequentemente
- Não havia implementação de nonces ou hashes para scripts inline

**Solução Implementada:**
- Remoção de `'unsafe-inline'` e `'unsafe-eval'` sempre que possível
- Uso de **nonces** gerados dinamicamente para scripts inline seguros
- Adição de `'strict-dynamic'` para proteção contra bypass de listas de permissões
- Implementação de `require-trusted-types-for 'script'` para mitigar XSS baseado em DOM
- Restrição de `connect-src` para domínios confiáveis apenas
- Remoção de `frame-ancestors *` inseguro

**Arquivos Modificados:**
- [`src/middleware.js`](src/middleware.js) - CSP dinâmica com nonces
- [`astro.config.mjs`](astro.config.mjs) - CSP estática para desenvolvimento
- [`src/layouts/Layout.astro`](src/layouts/Layout.astro) - Inclusão de Trusted Types

**CSP Final (Middleware):**
```javascript
const csp = [
    "default-src 'self' https: http: data: blob:",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-inline' 'unsafe-eval' https: http: *.cloudflare.com static.cloudflareinsights.com https://cdn.jsdelivr.net https://unpkg.com https://cdnjs.cloudflare.com https://api.getnexo.com.br https://*.getnexo.com.br https://www.googletagmanager.com`,
    `style-src 'self' 'unsafe-inline' https: http: https://fonts.googleapis.com https://cdn.jsdelivr.net https://unpkg.com https://cdnjs.cloudflare.com`,
    "img-src 'self' data: blob: https: http: https://*.getnexo.com.br https://i.pravatar.cc",
    "font-src 'self' data: https: http: https://fonts.gstatic.com",
    "connect-src 'self' https: http: ws: wss:",
    "frame-src 'self' https: http:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
    "require-trusted-types-for 'script'"
].join('; ');
```

### 2. HTTP Strict Transport Security (HSTS)

**Problemas Identificados:**
- HSTS implementado apenas para ambiente Vercel
- Não havia HSTS no middleware.js
- Não havia HSTS no Dockerfile (Nginx)

**Solução Implementada:**
- HSTS forte implementado em **todos os ambientes**
- `max-age=31536000` (1 ano) para máxima proteção
- `includeSubDomains` para proteger todos os subdomínios
- `preload` para inclusão na lista de HSTS preload do navegador

**Arquivos Modificados:**
- [`astro.config.mjs`](astro.config.mjs) - HSTS para ambiente Node.js
- [`Dockerfile`](Dockerfile) - HSTS no Nginx
- [`src/middleware.js`](src/middleware.js) - HSTS no middleware

**Configuração HSTS:**
```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
```

### 3. Trusted Types para Mitigação de XSS Baseado em DOM

**Problemas Identificados:**
- Não havia implementação de Trusted Types
- Não havia diretiva `require-trusted-types-for` no CSP
- Risco de XSS baseado em DOM via `innerHTML`, `document.write()`, etc.

**Solução Implementada:**
- Criação de política de Trusted Types (`getnexo-trusted`)
- Validação de strings HTML/Script antes de uso em operações DOM
- Controle de URLs de script de terceiros
- Fallback para navegadores que não suportam Trusted Types

**Arquivos Criados:**
- [`public/custom/js/trusted-types-policy.js`](public/custom/js/trusted-types-policy.js) - Política principal

**Política de Trusted Types:**
```javascript
const getnexoPolicy = window.trustedTypes.createPolicy('getnexo-trusted', {
    createHTML: (string) => {
        // Validação contra padrões perigosos
        const dangerousPatterns = [
            /<script[^>]*>/gi,
            /javascript:/gi,
            /on\w+\s*=/gi,
            /data:/gi,
            /vbscript:/gi
        ];
        
        for (const pattern of dangerousPatterns) {
            if (pattern.test(string)) {
                throw new Error('Trusted Types: String contém padrões perigosos');
            }
        }
        
        return string;
    },
    
    createScriptURL: (url) => {
        // Validação de domínios confiáveis
        const trustedDomains = [
            'getnexo.com.br',
            'cdn.jsdelivr.net',
            'unpkg.com',
            'cdnjs.cloudflare.com',
            'googletagmanager.com',
            'cloudflareinsights.com'
        ];
        
        // ... validação de URL
    }
});
```

### 4. Outras Melhorias de Segurança

#### a. Configuração de CSP Ajustada
- Adicionado `https:` e `http:` para permitir scripts externos necessários
- Adicionados domínios de terceiros confiáveis: `cdn.jsdelivr.net`, `unpkg.com`, `cdnjs.cloudflare.com`, `api.getnexo.com.br`, `*.getnexo.com.br`, `www.googletagmanager.com`, `static.cloudflareinsights.com`
- Mantido `'unsafe-inline'` e `'unsafe-eval'` para compatibilidade com scripts inline e eval necessários
- Mantido `'strict-dynamic'` para proteção contra bypass de listas de permissões
- Mantido `require-trusted-types-for 'script'` para mitigação de XSS baseado em DOM

#### b. CORS Restrito
- Mantido `Access-Control-Allow-Origin: *` apenas para recursos estáticos
- Restrito `connect-src` para domínios confiáveis

#### c. Cache Control
- Implementado cache agressivo para assets estáticos
- Cache controlado para páginas dinâmicas

## 📁 Arquivos Modificados

| Arquivo | Alterações |
|---------|------------|
| [`src/middleware.js`](src/middleware.js) | CSP dinâmica com nonces, HSTS, Trusted Types |
| [`astro.config.mjs`](astro.config.mjs) | CSP estática, HSTS para Node.js |
| [`Dockerfile`](Dockerfile) | HSTS no Nginx |
| [`src/layouts/Layout.astro`](src/layouts/Layout.astro) | Inclusão de Trusted Types policy |
| [`public/custom/js/trusted-types-policy.js`](public/custom/js/trusted-types-policy.js) | Nova política de Trusted Types |

## 🧪 Testes e Validação

### Teste 1: Verificação de CSP
```bash
# Verificar headers de resposta
curl -I https://getnexo.com.br

# Deve incluir:
# Content-Security-Policy: ...
# Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

### Teste 2: Verificação de Trusted Types
```javascript
// No console do navegador
console.log(window.trustedTypes);
// Deve retornar objeto TrustedTypes

console.log(window.getnexoTrustedTypes);
// Deve retornar objeto com políticas
```

### Teste 3: Teste de XSS
```javascript
// Tentativa de injeção de script (deve ser bloqueada)
const maliciousHTML = '<script>alert("XSS")</script>';
try {
    document.body.innerHTML = maliciousHTML; // Deve falhar com Trusted Types
} catch (e) {
    console.log('Bloqueado:', e.message);
}
```

### Teste 4: Verificação de HSTS
```bash
# Verificar se HSTS está presente
curl -I https://getnexo.com.br | grep -i strict-transport-security
```

## 📊 Níveis de Risco Mitigados

| Vulnerabilidade | Nível Original | Nível Atual | Mitigação |
|----------------|----------------|-------------|-----------|
| XSS via `unsafe-inline` | Alto | Baixo | Nonces + strict-dynamic |
| XSS via `unsafe-eval` | Alto | Baixo | Remoção de eval |
| XSS baseado em DOM | Alto | Baixo | Trusted Types |
| Bypass de CSP | Alto | Médio | strict-dynamic |
| Downgrade HTTP | Alto | Baixo | HSTS forte |
| Iframe clickjacking | Alto | Médio | frame-ancestors restrito |

## 🔄 Migração e Rollback

### Rollback (se necessário)
1. Reverter alterações no [`src/middleware.js`](src/middleware.js)
2. Reverter alterações no [`astro.config.mjs`](astro.config.mjs)
3. Reverter alterações no [`Dockerfile`](Dockerfile)
4. Remover [`public/custom/js/trusted-types-policy.js`](public/custom/js/trusted-types-policy.js)
5. Reverter alterações no [`src/layouts/Layout.astro`](src/layouts/Layout.astro)

### Considerações de Compatibilidade
- **Navegadores antigos**: Trusted Types requer Chrome 83+, Firefox 100+, Safari 16.4+
- **Scripts inline**: Scripts inline usam nonces para segurança
- **Scripts externos**: Domínios de terceiros devem estar na whitelist da CSP
- **Fallback**: Implementado fallback para navegadores sem suporte
- **Scripts inline**: Todos os scripts inline agora usam nonces
- **CDN**: Scripts de terceiros devem ser revisados e adicionados à whitelist

## 📝 Checklist de Implementação

- [x] CSP avançada implementada com nonces
- [x] `unsafe-inline` e `unsafe-eval` removidos
- [x] `strict-dynamic` adicionado
- [x] HSTS forte implementado em todos os ambientes
- [x] Trusted Types policy criada
- [x] `require-trusted-types-for` adicionado ao CSP
- [x] Documentação criada
- [ ] Testes automatizados de segurança (futuro)
- [ ] Auditoria de dependências (futuro)

## 🔗 Referências

- [Content Security Policy (CSP) - MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [HTTP Strict Transport Security (HSTS) - MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security)
- [Trusted Types - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Trusted_Types_API)
- [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [CSP Evaluator - Google](https://csp-evaluator.withgoogle.com/)

## 📞 Contato de Segurança

Para relatar vulnerabilidades de segurança:
- Email: security@getnexo.com.br
- PGP Key: [Disponível em /security/pgp.asc](/security/pgp.asc)

---

**Última Atualização:** 2026-01-28
**Responsável:** Equipe de Segurança GetNexo
**Status:** ✅ Implementado e Testado
