## 2025-02-27 - [Demo Mode Backdoor]
**Vulnerability:** Critical business data (CRM, Tickets, Analytics) was exposed publicly because endpoints were whitelisted in `authMiddleware` for "demo/initial setup" convenience.
**Learning:** Temporary "demo" or "dev" conveniences often persist into production code if not explicitly flagged or removed by a build process. Comments indicating "allow without strict auth" are major red flags.
**Prevention:**
1. Use feature flags or environment variables (e.g., `DEMO_MODE=true`) to enable insecure behavior, never hardcode it in the main logic.
2. Ensure `publicRoutes` lists are minimal and audited regularly.
3. Fail securely: Default to deny, only allow specific routes.
