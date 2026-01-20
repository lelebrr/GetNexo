# 🏢 ERP Integration Reference
> **Purpose**: Invoicing (NF-e) & Financial Sync

## 1. Bling ERP
*   **Documentation**: [developer.bling.com.br](https://developer.bling.com.br/)
*   **Auth**: API Key (Query param `apikey`) or OAuth2 (New V3).
*   **Key Endpoints**:
    *   `POST /notasfiscais`: Generate NF-e.
    *   `GET /pedidos`: Sync orders.
    *   `GET /produtos`: Sync stock.

## 2. Tiny ERP
*   **Documentation**: [tiny.com.br/api-docs](https://tiny.com.br/api-docs)
*   **Auth**: Token (Query param `token`).
*   **Format**: XML or JSON.
*   **Key Endpoints**: `nota.fiscal.emitir`, `pedido.incluir`.

## 3. Totvs (Protheus)
*   **Documentation**: [api.totvs.com.br](https://api.totvs.com.br/)
*   **Auth**: Basic Auth / Bearer.
*   **Key Endpoints**: REST services custom per installation (usually `/api/v1/retail/salesorder`).

## 4. SAP Business One (Service Layer)
*   **Documentation**: [sap.com](https://help.sap.com/)
*   **Auth**: Session Cookie (Login to `/b1s/v1/Login`).
*   **Key Endpoints**:
    *   `POST /b1s/v1/Orders`: Create Sales Order.
    *   `GET /b1s/v1/Items`: Get Inventory.
