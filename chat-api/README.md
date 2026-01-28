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
   - Copie o `.env.example` para `.env` se necessário.
   - **IMPORTANTE:** A API **não iniciará** se `JWT_SECRET` não estiver definido.

   Exemplo de `.env`:
   ```env
   PORT=3006
   JWT_SECRET=sua_chave_secreta_super_segura_aqui
   CORS_ORIGIN=http://localhost:4321,https://seu-dominio.com.br
   ```

3. **Iniciar o servidor:**
```bash
# Modo desenvolvimento (com hot reload)
npm run dev

# Modo produção
npm start
```

O servidor rodará em `http://localhost:3006`

## 🛡️ Segurança Implementada

Esta API implementa diversas camadas de proteção ("Defense in Depth"):

1.  **Autenticação JWT Estrita:**
    -   Todas as rotas sensíveis (`/api/crm`, `/api/tickets`, etc.) exigem um token JWT válido no header `Authorization: Bearer <token>`.
    -   Middleware verifica a assinatura do token usando `jsonwebtoken`.

2.  **Hardening de HTTP:**
    -   **Helmet:** Adiciona headers de segurança (HSTS, X-Frame-Options, X-Content-Type-Options, etc.).
    -   **CORS Estrito:** Permite apenas origens definidas em `CORS_ORIGIN`.

3.  **Rate Limiting:**
    -   **Login:** Limite estrito de 10 tentativas por hora por IP para prevenir Brute Force.
    -   **API Geral:** Limite de 100 requisições a cada 15 minutos por IP para prevenir DoS.

4.  **Proteção contra RCE (Docker):**
    -   Endpoints de gerenciamento Docker utilizam `execFile` (sem shell) e validação estrita (Regex allowlists) para prevenir injeção de comandos.

5.  **Gerenciamento de Segredos:**
    -   Aplicação falha imediatamente (Fail Fast) se `JWT_SECRET` não estiver configurado.

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

#### GET /api/users
Verifica se o usuário está autenticado (requer token).

**Headers:**
```
Authorization: Bearer <token>
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

## 🧪 Testes

Para rodar a suíte de testes (incluindo verificações de segurança):

```bash
cd chat-api
npm test
```

## 🔐 Credenciais de Demonstração

| Tipo | Email | Senha | Role |
|------|-------|-------|------|
| Admin | `admin@getnexo.com.br` | `admin123` | superadmin |
| Revendedor | `revendedor@getnexo.com` | `demo123` | reseller |
| Cliente | `cliente@getnexo.com` | `demo123` | client |

## 📁 Estrutura do Projeto

```
chat-api/
├── server.js          # Servidor principal (Configuração de Segurança)
├── middleware/
│   └── auth.js        # Middleware de Autenticação JWT
├── routes/
│   ├── docker.js      # Gerenciamento Seguro de Containers
│   └── ...
├── tests/             # Testes de Unidade e Segurança
├── package.json       # Dependências
└── README.md          # Documentação
```
