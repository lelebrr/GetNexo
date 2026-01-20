// Nexo Plugin for Shopify
// ID: {{ID}}
// Domain: {{DOMAIN}}

(function () {
    console.log('[Nexo] Starting Shopify App...');
    // Shopify uses 'Shopify' global object
    var shop = window.Shopify ? window.Shopify.shop : '{{DOMAIN}}';

    var script = document.createElement('script');
    script.src = 'https://cdn.getnexo.com.br/widget.js?uid={{ID}}&p=shopify&shop=' + shop;
    script.async = true;
    document.body.appendChild(script);
})();
