## 2024-05-22 - Hardcoded Secrets in Express Server
**Vulnerability:** Hardcoded JWT secret fallback found in `chat-api/server.js`.
**Learning:** Providing insecure default values for security-critical configuration (like JWT secrets) is a common pattern that can lead to production vulnerabilities if environment variables are misconfigured.
**Prevention:** Strictly validate the presence of required security environment variables at application startup and fail fast (exit) if they are missing. Avoid insecure defaults in code.

## 2024-05-22 - Missing Authentication on Sensitive Routes
**Vulnerability:** Multiple sensitive API endpoints (CRM, Loyalty, Tickets) were mounted without any authentication middleware, allowing unauthenticated access to PII and business data.
**Learning:** Middleware application order and scope is critical. Mounting routes with `app.use('/path', routes)` does not automatically apply auth unless globally applied or explicitly included.
**Prevention:** Use a "secure by default" approach. Apply authentication middleware globally or to parent route groups. Explicitly exclude public routes rather than explicitly including protected ones.
**Fix Detail:** The existing `middleware/auth.js` was using a legacy DB-session approach incompatible with the JWTs issued by `server.js`. It was rewritten to correctly verify JWTs.

## 2024-05-22 - Remote Command Execution (RCE) in Docker Route
**Vulnerability:** The `/api/docker` endpoints utilized `child_process.exec()` with unsanitized user input (e.g. `docker stop ${name}`), allowing attackers to inject shell commands.
**Learning:** Using `exec()` with string concatenation is a classic RCE vector. Even authenticated routes are dangerous if they allow RCE, as they facilitate privilege escalation or lateral movement.
**Prevention:** Use `execFile` or `spawn` which accepts arguments as an array and bypasses the shell. Always validate input against a strict allowlist (e.g. alphanumeric only for container names).

## 2024-05-22 - Missing Security Headers & Rate Limiting
**Vulnerability:** Application lacked `Helmet` (security headers) and `Rate Limiting`, exposing it to clickjacking, detailed recon, and brute-force/DoS attacks.
**Learning:** Framework defaults (like Express) are optimized for development, not security. Production deployments must explicitly add hardening layers.
**Prevention:** Standardize on a security middleware stack (Helmet + RateLimit + CORS Strict Mode) for all new services.

## 2024-05-22 - In-Memory User Store vs Database
**Vulnerability:** The application was using an in-memory array for user authentication in `server.js` while the database had a `users` table. This led to state inconsistencies and potential security bypasses if the server restarted or if data wasn't persisted.
**Learning:** Hardcoded user credentials in source code are a major security risk and technical debt.
**Fix Detail:** Refactored `server.js` to query the SQLite database for user credentials using parameterized queries, merging the logic with the new database schema.

## 2025-02-20 - Unauthenticated Sensitive Admin Routes
**Vulnerability:** Critical admin endpoints (CRM, Tickets, Products, Settings) were explicitly whitelisted in `publicRoutes`, allowing unauthenticated access to PII and business data.
**Learning:** Whitelisting routes for "demo" or "initial setup" purposes without strict environmental checks creates permanent backdoors in production.
**Prevention:** Default to "secure by default". Never whitelist entire feature sets (like CRM or Analytics) for convenience. If a demo mode is needed, implement it as a separate mock service or strict feature flag, not by bypassing auth.

## 2025-02-20 - Global Fetch Interceptors & Token Leakage
**Vulnerability:** A proposed fix for unauthenticated API calls involved a global fetch interceptor that checked `url.includes('/api/')`. This was rejected because it would leak tokens to any external URL containing "/api/" (e.g. `google.com/api/`).
**Learning:** Global interceptors are powerful but dangerous. When injecting credentials, always validate the **Origin** strictly. Never use loose substring matches for security decisions.
**Prevention:** Use `startsWith('/')` for relative URLs or strict `origin` checks for absolute URLs.
