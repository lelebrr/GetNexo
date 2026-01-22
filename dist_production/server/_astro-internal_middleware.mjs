import { v as verifyToken } from "./assets/auth-bbOfVkaL.js";
import { l as logger } from "./assets/logger-DtfYvGVK.js";
import crypto from "node:crypto";
import "es-module-lexer";
import "./assets/astro-designed-error-pages-B1t6Y8eu.js";
import "piccolore";
import "./assets/astro/server-MCYX8tFF.js";
import "clsx";
import { s as sequence } from "./assets/index-e2rjIyjF.js";
const rateLimitStore = /* @__PURE__ */ new Map();
const RATE_LIMITS = {
  // API endpoints
  "/api/graphql": { window: 60 * 1e3, max: 50, burst: 10 },
  "/api/stream": { window: 60 * 1e3, max: 30, burst: 5 },
  "/api/payments": { window: 60 * 1e3, max: 20, burst: 3 },
  "/api/webhooks": { window: 60 * 1e3, max: 100, burst: 20 },
  // Páginas públicas
  "/": { window: 60 * 1e3, max: 500, burst: 50 },
  // Admin endpoints (mais restritivo)
  "/admin": { window: 60 * 1e3, max: 100, burst: 10 },
  // Padrão para outros
  "default": { window: 60 * 1e3, max: 200, burst: 30 }
};
function checkRateLimit(clientIP, endpoint) {
  const now = Date.now();
  const config = RATE_LIMITS[endpoint] || RATE_LIMITS.default;
  const windowStart = now - config.window;
  const key = `${clientIP}:${endpoint}`;
  if (!rateLimitStore.has(key)) {
    rateLimitStore.set(key, { requests: [], burstCount: 0, lastBurstReset: now });
  }
  const data = rateLimitStore.get(key);
  const { requests, burstCount, lastBurstReset } = data;
  if (now - lastBurstReset > config.window) {
    data.burstCount = 0;
    data.lastBurstReset = now;
  }
  const validRequests = requests.filter((time) => time > windowStart);
  const recentRequests = validRequests.filter((time) => now - time < 1e4);
  if (recentRequests.length >= config.burst) {
    return { allowed: false, retryAfter: Math.ceil((config.window - (now - windowStart)) / 1e3) };
  }
  if (validRequests.length >= config.max) {
    return { allowed: false, retryAfter: Math.ceil((config.window - (now - windowStart)) / 1e3) };
  }
  validRequests.push(now);
  data.requests = validRequests;
  data.burstCount++;
  return { allowed: true };
}
const onRequest$1 = async (context, next) => {
  const startTime = Date.now();
  const url = new URL(context.request.url);
  const endpoint = url.pathname;
  const method = context.request.method;
  const clientIP = context.request.headers.get("x-forwarded-for") || context.request.headers.get("x-real-ip") || "unknown";
  logger.info(`Request: ${method} ${endpoint}`, {
    method,
    endpoint,
    clientIP,
    userAgent: context.request.headers.get("user-agent")
  });
  const hasRateLimit = Object.keys(RATE_LIMITS).some((key) => endpoint.startsWith(key)) || RATE_LIMITS.default;
  if (hasRateLimit) {
    const clientIP2 = context.request.headers.get("x-forwarded-for") || context.request.headers.get("x-real-ip") || "unknown";
    const result = checkRateLimit(clientIP2, endpoint);
    if (!result.allowed) {
      logger.warn(`Rate limit exceeded: ${endpoint}`, {
        clientIP: clientIP2,
        endpoint,
        retryAfter: result.retryAfter
      });
      return new Response(JSON.stringify({
        error: "Rate limit exceeded",
        retryAfter: result.retryAfter,
        endpoint
      }), {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": result.retryAfter.toString(),
          "X-RateLimit-Reset": (Date.now() + result.retryAfter * 1e3).toString()
        }
      });
    }
  }
  const nonce = crypto.randomBytes(16).toString("base64");
  context.locals.nonce = nonce;
  const clientId = context.request.headers.get("x-client-id") || context.url.searchParams.get("client_id") || context.cookies?.get("client_id") || "default";
  context.locals.clientId = clientId;
  const requestUrl = new URL(context.request.url);
  const protectedPaths = ["/admin", "/meu-painel", "/revenda"];
  const publicAuthPaths = ["/api/login", "/api/auth/google", "/api/auth/github"];
  const isPublicAuth = publicAuthPaths.some((path) => requestUrl.pathname.startsWith(path)) || requestUrl.pathname === "/admin/login" && method === "GET";
  const isProtected = protectedPaths.some((path) => requestUrl.pathname.startsWith(path)) && !isPublicAuth;
  if (isProtected) {
    const authHeader = context.request.headers.get("Authorization");
    const acceptHeader = context.request.headers.get("Accept") || "";
    if ((!authHeader || !authHeader.startsWith("Bearer ")) && acceptHeader.includes("text/html")) {
      return context.redirect("/admin/login");
    }
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      logger.warn(`Authentication failed: Token não fornecido`, {
        endpoint,
        clientIP
      });
      return new Response(JSON.stringify({ error: "Token não fornecido" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    const token = authHeader.slice(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      logger.warn(`Authentication failed: Token inválido`, {
        endpoint,
        clientIP
      });
      return new Response(JSON.stringify({ error: "Token inválido" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    context.locals.user = decoded;
  }
  const response = await next();
  const duration = Date.now() - startTime;
  const status = response.status;
  logger.info(`Response: ${status} in ${duration}ms`, {
    method,
    endpoint,
    status,
    duration,
    clientIP
  });
  if (duration > 2e3) {
    logger.performance("Slow response detected", {
      method,
      endpoint,
      duration,
      status
    });
  }
  response.headers.delete("X-Frame-Options");
  response.headers.set("Content-Security-Policy", "frame-ancestors *");
  const currentUrl = new URL(context.request.url);
  if (currentUrl.pathname.startsWith("/dashboard")) {
    response.headers.set("Cache-Control", "public, max-age=3600");
  }
  if (currentUrl.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2|webp|avif)$/)) {
    response.headers.set("Cache-Control", "public, max-age=31536000, immutable");
    response.headers.set("Vary", "Accept-Encoding");
  }
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.cloudflare.com static.cloudflareinsights.com https://cdn.jsdelivr.net https://api.getnexo.com.br https://*.getnexo.com.br; object-src 'none'; base-uri 'none';",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src * data:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src *",
    "frame-ancestors *"
  ].join("; ");
  response.headers.set("Content-Security-Policy", csp);
  return response;
};
const onRequest = sequence(
  onRequest$1
);
export {
  onRequest
};
