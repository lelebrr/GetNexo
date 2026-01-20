// Nexo Plugin for Tray
// ID: {{ID}}

(function () {
    console.log('[Nexo] Tray Commerce Init');
    // Tray often uses 'Tray' object

    var s = document.createElement('script');
    s.src = 'https://cdn.getnexo.com.br/widget.js?uid={{ID}}&p=tray';
    document.body.appendChild(s);
})();
