# 💳 Payment Gateway Reference
> **Purpose**: Checkout Links & Pix Webhooks

## 1. Mercado Pago
*   **Documentation**: [mercadopago.com.br/developers](https://www.mercadopago.com.br/developers)
*   **Auth**: Bearer Token (`TEST-` or `APP_USR-`).
*   **Key Endpoints**:
    *   `POST /v1/payments`: Create Pix Payment.
    *   `POST /checkout/preferences`: Create Checkout Link.
*   **Webhook**: Listen for `payment.created`, `payment.updated`.

## 2. Stripe
*   **Documentation**: [stripe.com/docs/api](https://stripe.com/docs/api)
*   **Auth**: Bearer Token (`sk_live_...`).
*   **Key Endpoints**:
    *   `POST /v1/payment_intents`: Process card/payment.
    *   `POST /v1/checkout/sessions`: Hosted checkout.

## 3. Pagar.me
*   **Documentation**: [docs.pagar.me](https://docs.pagar.me/)
*   **Auth**: Basic Auth (Secret Key).
*   **Flow**: Create `Order`, then add `Charge`.

## 4. Banco Central (Pix)
*   **Standard**: [bacen.gov.br](https://www.bcb.gov.br/)
*   **Integration**: Usually done via PSP (Mercado Pago, Gerencianet, Inter).
*   **Static QrCode**: Format `000201...` (Standard EMV-QRCPS).
