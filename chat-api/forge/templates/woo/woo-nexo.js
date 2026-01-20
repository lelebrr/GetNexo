// Nexo Plugin for WooCommerce
// ID: {{ID}}
// Domain: {{DOMAIN}}
// Expiry: {{EXPIRY}}

(function () {
    console.log('[Nexo] Inneciando plugin Woo...');
    var d = document, s = d.createElement('script');
    s.src = 'https://cdn.getnexo.com.br/widget.js?uid={{ID}}&p=woo';
    s.async = true;
    d.body.appendChild(s);

    // WooCommerce Specific: Add to Cart Interception (Example)
    /*
    jQuery('body').on('added_to_cart', function() {
        // Trigger generic event for Nexo
        window.dispatchEvent(new CustomEvent('nexo:cart-update'));
    });
    */
})();
