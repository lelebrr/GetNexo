# 🎯 GUIA COMPLETO: Como Configurar Mercado Pago

## 📋 **PROCESSO DE CONFIGURAÇÃO - PASSO A PASSO**

### **1. CRIAR CONTA NO MERCADO PAGO**
- **Site**: https://www.mercadopago.com.br/
- **Passos**:
  1. Clicar "Criar conta"
  2. Escolher "Para meu negócio"
  3. Preencher dados pessoais/empresariais
  4. Verificar email e telefone
  5. Aguardar aprovação (pode levar 1-2 dias)

### **2. CRIAR APLICAÇÃO (APP)**
- **Acesse**: https://www.mercadopago.com.br/developers/panel
- **Passos**:
  1. No menu lateral: "Suas integrações" → "Criar aplicação"
  2. **Nome da aplicação**: `GetNexo E-commerce`
  3. **Finalidade**: `E-commerce`
  4. **Produto**: `Pagamentos`
  5. Clicar "Criar aplicação"

### **3. CONFIGURAR CREDENCIAIS**
- **Na tela da aplicação criada**:
  1. Aba "Credenciais"
  2. **Modo**: `Sandbox` (para testes) ou `Produção` (para vendas reais)
  3. Copiar as credenciais:
     - **Client ID**: `12345678901234567890123456789012`
     - **Client Secret**: `abcd1234567890efgh1234567890...`

### **4. GERAR ACCESS TOKEN**
- **Método mais simples**: Client Credentials
- **URL para teste**: `https://api.mercadopago.com/oauth/token`
- **Método**: POST
- **Headers**:
  ```
  Content-Type: application/x-www-form-urlencoded
  ```
- **Body** (form-data):
  ```
  grant_type=client_credentials
  client_id=SEU_CLIENT_ID
  client_secret=SEU_CLIENT_SECRET
  ```

#### **Exemplo com cURL**:
```bash
curl -X POST \
  'https://api.mercadopago.com/oauth/token' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'grant_type=client_credentials&client_id=SEU_CLIENT_ID&client_secret=SEU_CLIENT_SECRET'
```

#### **Resposta esperada**:
```json
{
  "access_token": "APP_USR-1234567890123456-123456-78901234567890123456789012345678-123456789",
  "token_type": "Bearer",
  "expires_in": 21600,
  "scope": "offline_access",
  "user_id": 123456789
}
```

### **5. CONFIGURAR NO SISTEMA**
- **Arquivo**: `getnexo-site/.env`
- **Adicionar**:
  ```env
  MERCADO_PAGO_ACCESS_TOKEN=APP_USR-1234567890123456-123456-78901234567890123456789012345678-123456789
  ```

### **6. TESTAR INTEGRAÇÃO**
```bash
# Testar se o token funciona
curl -X GET \
  'https://api.mercadopago.com/v1/payment_methods' \
  -H 'Authorization: Bearer SEU_ACCESS_TOKEN'
```

#### **Resposta esperada**:
```json
[
  {
    "id": "visa",
    "name": "Visa",
    "payment_type_id": "credit_card",
    ...
  }
]
```

---

## 🎯 **INTEGRAÇÃO NO CÓDIGO**

### **Arquivo: `getnexo-site/src/lib/mercadoPago.js`**
```javascript
// src/lib/mercadoPago.js
import { MercadoPagoConfig, Payment } from 'mercadopago'

const client = new MercadoPagoConfig({
  accessToken: import.meta.env.MERCADO_PAGO_ACCESS_TOKEN
})

export const payment = new Payment(client)

// Função para criar pagamento
export async function criarPagamento(dados) {
  try {
    const response = await payment.create({
      body: {
        transaction_amount: dados.valor,
        description: dados.descricao,
        payment_method_id: dados.metodoPagamento,
        payer: {
          email: dados.email,
          identification: {
            type: dados.tipoDocumento,
            number: dados.numeroDocumento
          }
        }
      }
    })
    return response
  } catch (error) {
    console.error('Erro Mercado Pago:', error)
    throw error
  }
}
```

---

## 💰 **CUSTOS E LIMITAÇÕES**

### **Sandbox (Testes)**:
- ✅ **Gratuito**
- ✅ Sem limites
- ✅ Cartões de teste disponíveis

### **Produção (Vendas Reais)**:
- **Taxa**: 3.49% + R$ 0.49 por transação
- **Saque**: Gratuito (D+1)
- **Limites**: Sem limites iniciais

### **Cartões de Teste**:
```
Visa: 4235647728025682
Master: 5031433215406351
CVV: 123
Validade: 11/25
```

---

## 🚨 **PROBLEMAS COMUNS E SOLUÇÕES**

### **Erro: "invalid_client"**
- ✅ Verificar se Client ID e Secret estão corretos
- ✅ Usar credenciais de Sandbox para testes

### **Erro: "unauthorized"**
- ✅ Verificar se Access Token está atualizado
- ✅ Tokens expiram em 6 horas

### **Erro: "invalid_scope"**
- ✅ Verificar se a aplicação tem permissões corretas

### **Aplicação não aprovada**
- ✅ Aguardar 1-2 dias úteis
- ✅ Verificar se todos os dados foram preenchidos
- ✅ Suporte: https://www.mercadopago.com.br/ajuda

---

## 🎯 **TESTE FINAL**

### **1. Criar Pagamento de Teste**
```javascript
import { criarPagamento } from './lib/mercadoPago.js'

const teste = await criarPagamento({
  valor: 10.00,
  descricao: 'Teste GetNexo',
  metodoPagamento: 'visa',
  email: 'teste@email.com',
  tipoDocumento: 'CPF',
  numeroDocumento: '12345678900'
})

console.log('Pagamento criado:', teste)
```

### **2. Verificar no Painel**
- Acesse: https://www.mercadopago.com.br/developers/panel
- Ver "Atividades" para ver pagamentos de teste

---

## ✅ **RESULTADO ESPERADO**

Após configuração completa:
- ✅ Sistema aceita pagamentos
- ✅ Checkout integrado
- ✅ Webhooks configurados
- ✅ Relatórios de vendas
- ✅ Produto 100% comercial

**🚀 PRONTO PARA VENDER!**