// Nexo Plugin for Nuvemshop
// ID: {{ID}}

(function () {
    console.log('[Nexo] Nuvem Start');
    // Nuvemshop Global 'LS'
    var storeId = window.LS ? window.LS.store.id : 'unknown';

    var s = document.createElement('script');
    s.src = 'https://cdn.getnexo.com.br/widget.js?uid={{ID}}&p=nuvem&sid=' + storeId;
    document.body.appendChild(s);
})();
