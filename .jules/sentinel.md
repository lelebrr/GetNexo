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

## 2024-05-22 - OS Command Injection in Model Converter
**Vulnerability:** The `chat-api/scripts/model-converter.js` utilized `child_process.exec()` with unsanitized inputs (`glbPath` and `usdzPath`) to run `npx gltf-to-usdz`. This exposed an OS Command Injection vulnerability.
**Learning:** `exec` invokes a shell and is vulnerable to injection if input arguments contain shell metacharacters.
**Prevention:** Use `execFile` with arguments separated into an array. Additionally, when using `execFile` to invoke `npx` cross-platform, conditionally set the executable to `npx.cmd` on Windows.
