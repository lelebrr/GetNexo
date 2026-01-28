# Instalação do Backend de Autenticação GetNexo

Este guia explica como configurar e iniciar o servidor de autenticação do GetNexo.

## 📋 Pré-requisitos

- **Node.js 18+** (recomendado: Node.js 20 LTS)
- **npm** (gerenciador de pacotes do Node.js)
- **Git** (para clonar o repositório)

## 🚀 Instalação Rápida

### 1. Instalar dependências

```bash
cd chat-api
npm install
```

### 2. Iniciar o servidor

**Linux/macOS:**
```bash
./start.sh
```

**Windows:**
```bash
npm start
```

O servidor iniciará em `http://localhost:3006`

## 📁 Estrutura do Projeto

```
chat-api/
├── server.js          # Servidor principal (Express + JWT)
├── package.json       # Dependências do projeto
├── .env              # Variáveis de ambiente
├── README.md         # Documentação completa
├── INSTALL.md        # Este arquivo
└── start.sh          # Script de inicialização (Linux/macOS)
```

## 🔐 Credenciais de Demonstração

| Tipo | Email | Senha | Role |
|------|-------|-------|------|
| Admin | `admin@getnexo.com.br` | `admin123` | superadmin |
| Revendedor | `revendedor@getnexo.com` | `demo123` | reseller |
| Cliente | `cliente@getnexo.com` | `demo123` | client |
| Super Admin | `lelebrr@gmail.com` | `master2026` | superadmin |

## 📡 Endpoints da API

### Autenticação

- **POST** `/api/login` - Realiza login
- **GET** `/api/users` - Verifica usuário logado (requer token)
- **POST** `/api/auth/forgot-password` - Redefinir senha
- **POST** `/api/auth/register` - Criar nova conta
- **GET** `/api/health` - Health check

### Exemplo de uso com cURL

```bash
# Login
curl -X POST http://localhost:3006/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@getnexo.com.br","password":"admin123"}'

# Verificar usuário logado
curl -X GET http://localhost:3006/api/users \
  -H "Authorization: Bearer <token>"
```

## ⚙️ Configuração Avançada

### Variáveis de Ambiente

Edite o arquivo `.env` para configurar:

```env
# Porta do servidor
PORT=3006

# Segredo JWT (em produção, use uma chave segura)
JWT_SECRET=getnexo-secret-key-2026

# Configurações do banco de dados (em produção)
# DATABASE_URL=postgresql://user:password@localhost:5432/getnexo
# REDIS_URL=redis://localhost:6379

# Configurações de email (em produção)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=your-password
# EMAIL_FROM=noreply@getnexo.com.br
```

### Modo Desenvolvimento

Para desenvolvimento com hot reload:

```bash
npm run dev
```

### Modo Produção

Para produção:

```bash
npm start
```

## 🛡️ Segurança

### Em Produção

1. **Altere o JWT_SECRET** para uma chave segura e longa
2. **Configure CORS** para permitir apenas seu domínio
3. **Use HTTPS** com certificado SSL
4. **Implemente rate limiting** para prevenir ataques
5. **Use banco de dados real** (PostgreSQL, MongoDB, etc.)
6. **Configure logs de segurança**
7. **Implemente validação de entrada**

### Exemplo de CORS configurado

No arquivo `server.js`, altere:

```javascript
app.use(cors({
  origin: ['https://getnexo.com.br', 'https://www.getnexo.com.br'],
  credentials: true
}));
```

## 🐛 Troubleshooting

### Erro: "Port 3006 already in use"

```bash
# Encontrar processo usando a porta
lsof -i :3006

# Matar o processo
kill -9 <PID>

# Ou use uma porta diferente
PORT=3007 npm start
```

### Erro: "Module not found"

```bash
# Reinstalar dependências
rm -rf node_modules
npm install
```

### Erro: "JWT secret not defined"

Verifique o arquivo `.env` e garanta que `JWT_SECRET` está definido.

## 📚 Documentação Adicional

- Veja [`README.md`](README.md) para detalhes completos da API
- Consulte a documentação do [Express.js](https://expressjs.com/)
- Documentação do [JWT](https://jwt.io/)

## 🚀 Próximos Passos

1. **Integrar com o frontend**: Atualize a API proxy em `getnexo-site/src/pages/api/login.ts`
2. **Conectar ao banco de dados**: Implemente persistência de usuários
3. **Adicionar validação de email**: Envio de emails de confirmação
4. **Implementar 2FA**: Autenticação de dois fatores
5. **Adicionar rate limiting**: Prevenir abuso da API

## 📞 Suporte

Para dúvidas ou problemas, entre em contato com o suporte do GetNexo.
