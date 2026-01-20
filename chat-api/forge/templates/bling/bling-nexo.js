// Nexo Plugin for Bling
// ID: {{ID}}

(function () {
    console.log('[Nexo] Bling Integration Active');
    // Bling stores often use simple HTML structure
    var div = document.createElement('div');
    div.id = 'nexo-root';
    document.body.appendChild(div);

    var s = document.createElement('script');
    s.src = 'https://cdn.getnexo.com.br/widget.js?uid={{ID}}&p=bling';
    document.body.appendChild(s);
})();
