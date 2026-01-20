# 🛒 E-commerce Integration Reference
> **Status**: Ready for n8n Implementation
> **Auth Methods**: OAuth2 / API Key

## 1. Shopify
*   **Documentation**: [dev.shopify.com](https://shopify.dev/docs/api/admin-rest)
*   **Auth**: `X-Shopify-Access-Token` header.
*   **Key Endpoints**:
    *   `GET /admin/api/2023-10/products.json`: List products.
    *   `POST /admin/api/2023-10/orders.json`: Create order.
    *   `GET /admin/api/2023-10/inventory_levels.json`: Check stock.
*   **Webhook**: `orders/create`, `inventory_levels/update`.

## 2. VTEX
*   **Documentation**: [developers.vtex.com](https://developers.vtex.com/)
*   **Auth**: `X-VTEX-API-AppKey` + `X-VTEX-API-AppToken`.
*   **Key Endpoints**:
    *   `GET /api/catalog_system/pvt/sku/stockkeepingunitids`: List SKUs.
    *   `POST /api/checkout/pub/orderForm`: Cart simulation.
    *   `GET /api/oms/pvt/orders`: List orders.

## 3. Nuvemshop (Tiendanube)
*   **Documentation**: [dev.nuvemshop.com.br](https://dev.nuvemshop.com.br/)
*   **Auth**: OAuth2 Bearer Token.
*   **Key Endpoints**:
    *   `GET /v1/{store_id}/products`: List products.
    *   `POST /v1/{store_id}/orders`: Create order.

## 4. Wix Stores
*   **Documentation**: [dev.wix.com](https://dev.wix.com/api/rest/wix-stores/orders/query-orders)
*   **Auth**: API Key (Header `Authorization`).

## 5. WooCommerce
*   **Documentation**: [woocommerce.github.io](https://woocommerce.github.io/woocommerce-rest-api-docs/)
*   **Auth**: Basic Auth (Consumer Key / Secret).
*   **Key Endpoints**: `/wp-json/wc/v3/orders`.

## 6. Magento 2 (Adobe Commerce)
*   **Documentation**: [developer.adobe.com](https://developer.adobe.com/commerce/webapi/rest/)
*   **Auth**: Bearer Token (Admin).
*   **Key Endpoints**: `/rest/V1/orders`.
