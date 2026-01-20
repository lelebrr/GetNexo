# 📢 CRM & Marketing Reference
> **Purpose**: Lead Scoring & Automation

## 1. HubSpot
*   **Documentation**: [developers.hubspot.com](https://developers.hubspot.com/docs/api/overview)
*   **Auth**: Bearer Token (Private App).
*   **Key Endpoints**:
    *   `POST /crm/v3/objects/contacts`: Create Lead.
    *   `POST /crm/v3/objects/deals`: Create Deal/Opportunity.

## 2. RD Station Marketing
*   **Documentation**: [developers.rdstation.com](https://developers.rdstation.com/)
*   **Auth**: OAuth2 or API Token.
*   **Key Endpoints**:
    *   `POST /platform/conversions`: Register Conversion (Form submit).
    *   `PATCH /platform/contacts/{email}`: Update lead score/stage.

## 3. ActiveCampaign
*   **Documentation**: [developers.activecampaign.com](https://developers.activecampaign.com/)
*   **Auth**: Header `Api-Token`.
*   **Key Endpoints**: `POST /api/3/contacts`.

## 4. Chatwoot (Internal)
*   **Documentation**: [chatwoot.com/docs](https://www.chatwoot.com/docs/product/others/api/contacts)
*   **Key Endpoints**: `POST /api/v1/accounts/{id}/contacts`.
