const axios = require('axios');
const cheerio = require('cheerio');

async function detectPlatform(domain) {
    let url = domain.startsWith('http') ? domain : `https://${domain}`;

    try {
        console.log(`[Forge] Detecting platform for: ${url}`);

        // Add User-Agent to avoid being blocked
        const response = await axios.get(url, {
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
            },
            validateStatus: function (status) {
                return status < 500; // Resolve even if 404/403, headers might exist
            }
        });

        const html = response.data;
        const headers = response.headers;

        const $ = cheerio.load(html);
        const htmlString = typeof html === 'string' ? html : JSON.stringify(html);

        // 1. SHOPIFY
        if (
            headers['x-shopify-stage'] ||
            htmlString.includes('cdn.shopify.com') ||
            htmlString.includes('Shopify.shop') ||
            htmlString.includes('shopify-section')
        ) {
            return 'shopify';
        }

        // 2. WOOCOMMERCE
        if (
            htmlString.includes('wp-content') ||
            htmlString.includes('woocommerce') ||
            $('meta[name="generator"][content*="WooCommerce"]').length > 0 ||
            $('body').hasClass('woocommerce')
        ) {
            return 'woocommerce';
        }

        // 3. NUVEMSHOP
        if (
            htmlString.includes('d26lpennugdb8s.cloudfront.net') || // Common Nuvem CDN
            htmlString.includes('nuvemshop') ||
            htmlString.includes('loja.nuvemshop.com.br') ||
            $('meta[property="og:site_name"][content*="Nuvemshop"]').length > 0
        ) {
            return 'nuvemshop';
        }

        // 4. TRAY
        if (
            htmlString.includes('tray.com.br') ||
            htmlString.includes('opencode.tray.com.br') ||
            htmlString.includes('data-tray-tst') ||
            $('meta[name="author"][content*="Tray"]').length > 0
        ) {
            return 'tray';
        }

        // 5. BLING (Loja Virtual)
        // Bling stores are less standardized, looking for common signatures
        if (
            htmlString.includes('bling.com.br') ||
            htmlString.includes('api.bling.com.br')
        ) {
            return 'bling';
        }

        // 6. VTEX (Bonus, common in BR)
        if (
            headers['x-vtex-root-path'] ||
            htmlString.includes('vteximg.com.br') ||
            htmlString.includes('vtex.com')
        ) {
            return 'vtex'; // Map to 'tray' or generic if not supported specifically? User asked for 5 specific.
            // Requirement said: "Se não souber, detecte via headers..." and specifically listed Woo, Shopify, Bling, Nuvem, Tray.
            // If VTEX, maybe we return 'vtex' and let frontend handle it (or map to a generic)?
            // For now return null or 'unknown' to prompt user manual selection.
        }

        return 'unknown';

    } catch (error) {
        console.error(`[Forge] Detection failed for ${domain}:`, error.message);
        return 'error';
    }
}

module.exports = { detectPlatform };
