# 🏪 Reseller API Documentation

This document describes the API endpoints for the Reseller (Revenda) module in the GetNexo Chat API.

**Base URL:** `/api/revenda`
**Authentication:** Bearer Token (JWT) required for all endpoints.

## 📊 Statistics

### `GET /stats`
Retrieves the main dashboard statistics for the logged-in reseller.

**Response:**
```json
{
  "total_clients": 5,
  "active_subscriptions": 5,
  "monthly_revenue": "R$ 3.000,00",
  "commissions_pending": "R$ 450,00",
  "growth_rate": "+0%",
  "code": "NEXO-REV-2026",
  "clientsCount": 5,
  "recent_activity": [
    { "type": "commission", "message": "Comissão Assinatura Cliente", "time": "28/01/2026, 10:00:00" }
  ]
}
```

## 👥 Client Management

### `GET /clientes`
List all clients linked to the reseller account, including commission calculations.

**Response:**
```json
[
  {
    "id": 3,
    "nome": "Cliente",
    "email": "cliente@getnexo.com",
    "dominio": "N/A",
    "plano": "Standard",
    "status": "active",
    "receita": "R$ 3.000,00",
    "comissao": "R$ 450,00",
    "data": "28/01/2026"
  }
]
```

### `POST /clientes`
Creates a new client account linked to the reseller.

**Body:**
```json
{
  "nome": "Novo Cliente",
  "email": "novo@cliente.com",
  "password": "senha123" // Optional, default: mudar123
}
```

**Response:**
```json
{
  "ok": true,
  "message": "Cliente criado com sucesso.",
  "clientId": 6
}
```

## 💰 Financials

### `GET /financeiro`
Retrieves current balance, payout request history, and commission history.

**Response:**
```json
{
  "balance": "R$ 12.000,00",
  "next_payout": "15/02/2026",
  "history": [
    {
      "description": "Solicitação de Saque",
      "date": "28/01/2026",
      "amount": "-R$ 100,00",
      "status": "pending"
    },
    {
      "description": "Comissão Assinatura Cliente",
      "date": "28/01/2026",
      "amount": "R$ 450,00",
      "status": "paid"
    }
  ]
}
```

### `POST /saque`
Requests a payout. The amount is immediately deducted from the balance and a request record is created.

**Body:**
```json
{
  "amount": 100.00
}
```

**Response:**
```json
{
  "ok": true,
  "message": "Solicitação realizada com sucesso"
}
```

## 📣 Marketing & Profile

### `GET /marketing`
Retrieves active marketing assets (banners, links, PDFs) stored in the database.

**Response:**
```json
{
  "links": [
    { "name": "Página Inicial (GetNexo)", "url": "https://getnexo.com.br/?ref=REV123", "clicks": 0 }
  ],
  "assets": [
    { "name": "Banner 728x90", "type": "Image", "url": "/assets/marketing/banner-h.png" }
  ]
}
```

### `PUT /perfil`
Updates reseller profile information (e.g., bank details).

**Body:**
```json
{
  "bank_info": { "type": "PIX", "key": "email@teste.com" }
}
```

**Response:**
```json
{
  "ok": true,
  "message": "Perfil atualizado com sucesso"
}
```

### `POST /suporte`
Creates a support ticket for the reseller.

**Body:**
```json
{
  "subject": "Ajuda Financeira",
  "message": "Preciso de ajuda com meu saque."
}
```

**Response:**
```json
{
  "ok": true,
  "message": "Ticket de suporte criado"
}
```

## 🗄️ Database Schema (SQLite)

The Reseller module uses the following tables in `omnichat.db`:

### `reseller_profiles`
Stores reseller specific settings.
- `user_id`: FK to `users`
- `balance`: Current wallet balance
- `commission_rate`: Default 0.15 (15%)
- `referral_code`: Unique code
- `bank_info`: JSON string of bank details

### `commissions`
Tracks earnings.
- `reseller_id`: FK to `users`
- `source_user_id`: FK to `users` (the client who generated the sale)
- `amount`: Commission value
- `status`: 'pending' or 'paid'

### `payout_requests`
Tracks withdrawal requests.
- `reseller_id`: FK to `users`
- `amount`: Requested value
- `status`: 'pending', 'approved', 'rejected'

### `marketing_assets`
Stores available marketing materials.
- `type`: 'Link', 'Image', 'PDF'
- `name`: Display name
- `url`: Resource URL
- `active`: Boolean

### `coupons`
Stores discount codes.
- `code`: Unique code (e.g., 'NEXO20')
- `discount_type`: 'percentage' or 'fixed'
- `discount_value`: Value
