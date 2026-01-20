# 🚚 Logistics & Delivery Reference
> **Purpose**: Freight Calculation & Tracking

## 1. Correios
*   **Documentation**: [cws.correios.com.br](https://cws.correios.com.br/)
*   **Auth**: Basic Auth (Usuario/Senha do contrato).
*   **Key Endpoints**:
    *   `calcPrecoPrazo`: Calculate shipping.
    *   `rastro/json`: Track object.

## 2. Melhor Envio
*   **Documentation**: [docs.melhorenvio.com.br](https://docs.melhorenvio.com.br/)
*   **Auth**: OAuth2 Bearer Token.
*   **Key Endpoints**:
    *   `POST /api/v2/me/shipment/calculate`: Multi-carrier quote (Correios, Jadlog, Latam).
    *   `POST /api/v2/me/shipment/checkout`: Buy label.

## 3. Frenet
*   **Documentation**: [docs.frenet.com.br](https://docs.frenet.com.br/)
*   **Auth**: Header `token`.
*   **Key Endpoints**:
    *   `GET /shipping/quote`: Aggregated quote.

## 4. Loggi (Last Mile)
*   **Documentation**: [docs.loggi.com](https://docs.loggi.com/)
*   **Auth**: API Key.
*   **Key Endpoints**: `POST /v1/orders` (Immediate pickup).

## 5. Jadlog
*   **Integration**: Usually via Melhor Envio or Frenet for easier API access. Direct API transmits .txt files (EDI).
