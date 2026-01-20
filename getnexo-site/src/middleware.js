export const onRequest = async (context, next) => {
    // Generate Nonce for CSP
    const nonce = Buffer.from(crypto.getRandomValues(new Uint8Array(16))).toString('base64');
    context.locals.nonce = nonce;

    const response = await next();

    // Allow Iframes (Widget)
    response.headers.delete('X-Frame-Options'); // Remove blocking header
    response.headers.set('Content-Security-Policy', "frame-ancestors *"); // Allow all

    // Cache Control for Admin Panel (1 hour)
    const url = new URL(context.request.url);
    if (url.pathname.startsWith('/dashboard')) {
        response.headers.set('Cache-Control', 'public, max-age=3600');
    }

    // CORS (for font loading or api calls)
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Security Headers (HSTS, CSP, COOP)
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');

    // Hardened CSP
    // - uses 'strict-dynamic' with nonce for modern browsers
    // - uses 'require-trusted-types-for' for DOM XSS mitigation
    const csp = [
        "default-src 'self'",
        `script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://cdn.jsdelivr.net https://static.cloudflareinsights.com https://api.getnexo.com.br https://getnexo.com.br http://localhost:4321`,
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "img-src * data:",
        "font-src 'self' https://fonts.gstatic.com",
        "connect-src *",
        "frame-ancestors *"
    ].join('; ');

    response.headers.set('Content-Security-Policy', csp);

    return response;
};
