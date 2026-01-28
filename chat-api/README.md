# GetNexo Chat API

API de autenticação e chat para o sistema GetNexo.

## 🚀 Instalação

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn

### Passos

1. **Instalar dependências:**
```bash
cd chat-api
npm install
```

2. **Configurar variáveis de ambiente:**
   - O arquivo `.env` já está configurado com valores padrão
   - Para produção, edite o arquivo `.env` com suas credenciais

3. **Iniciar o servidor:**
```bash
# Modo desenvolvimento (com hot reload)
npm run dev

# Modo produção
npm start
```

O servidor rodará em `http://localhost:3006`

## 📡 Endpoints Disponíveis

### Autenticação

#### POST /api/login
Realiza login de usuário.

**Request:**
```json
{
  "email": "admin@getnexo.com.br",
  "password": "admin123"
}
```

**Response (Sucesso):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@getnexo.com.br",
    "name": "Administrador",
    "role": "superadmin",
    "role_id": 1
  },
  "message": "Login realizado com sucesso"
}
```

**Response (Erro):**
```json
{
  "error": "Credenciais inválidas"
}
```

#### GET /api/users
Verifica se o usuário está autenticado (requer token).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (Sucesso):**
```json
{
  "id": 1,
  "email": "admin@getnexo.com.br",
  "name": "Administrador",
  "role": "superadmin",
  "role_id": 1
}
```

#### POST /api/auth/forgot-password
Solicita redefinição de senha.

**Request:**
```json
{
  "email": "admin@getnexo.com.br"
}
```

**Response (Sucesso):**
```json
{
  "message": "Link de redefinição enviado! Verifique seu email."
}
```

#### POST /api/auth/register
Cria nova conta de usuário.

**Request:**
```json
{
  "email": "novo@getnexo.com.br",
  "password": "senha123",
  "name": "Novo Usuário"
}
```

**Response (Sucesso):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 5,
    "email": "novo@getnexo.com.br",
    "name": "Novo Usuário",
    "role": "client",
    "role_id": 3
  },
  "message": "Conta criada com sucesso"
}
```

### Utilitários

#### GET /api/health
Verifica se a API está funcionando.

**Response:**
```json
{
  "status": "ok",
  "message": "API está funcionando"
}
```

## 🔐 Credenciais de Demonstração

| Tipo | Email | Senha | Role |
|------|-------|-------|------|
| Admin | `admin@getnexo.com.br` | `admin123` | superadmin |
| Revendedor | `revendedor@getnexo.com` | `demo123` | reseller |
| Cliente | `cliente@getnexo.com` | `demo123` | client |
| Super Admin | `lelebrr@gmail.com` | `master2026` | superadmin |

## 🛡️ Segurança

- **JWT Tokens**: Tokens expiram em 24 horas
- **Senhas**: Armazenadas com bcrypt (hash seguro)
- **CORS**: Configurado para permitir apenas origens específicas
- **HTTPS**: Recomendado para produção

## 📁 Estrutura do Projeto

```
chat-api/
├── server.js          # Servidor principal
├── package.json       # Dependências
├── .env              # Variáveis de ambiente
└── README.md         # Documentação
```

## 🚨 Em Produção

1. **Use banco de dados real** (PostgreSQL, MongoDB, etc.)
2. **Configure CORS** para permitir apenas seu domínio
3. **Use variáveis de ambiente seguras**
4. **Configure HTTPS**
5. **Implemente rate limiting**
6. **Adicione validação de entrada**
7. **Configure logs de segurança**

## 🐛 Debug

Para ver logs detalhados:
```bash
DEBUG=* npm run dev
```

## 📞 Suporte

Para dúvidas ou problemas, entre em contato com o suporte do GetNexo.
