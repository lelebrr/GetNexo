// GDPR/LGPD Cookie Consent Manager
// Blocks Non-Essential Scripts until Accepted

(function () {
    const CONSENT_KEY = 'getnexo_consent';

    function createBanner() {
        if (localStorage.getItem(CONSENT_KEY)) return;

        const banner = document.createElement('div');
        banner.id = 'gdpr-banner';
        banner.style.position = 'fixed';
        banner.style.bottom = '0';
        banner.style.left = '0';
        banner.style.width = '100%';
        banner.style.background = '#000';
        banner.style.color = '#fff';
        banner.style.padding = '20px';
        banner.style.zIndex = '9999';
        banner.style.borderTop = '2px solid #00ff00';
        banner.style.fontFamily = 'monospace';
        banner.style.display = 'flex';
        banner.style.justifyContent = 'space-between';
        banner.style.alignItems = 'center';

        banner.innerHTML = `
            <div>
                <strong>🍪 LGPD NOTICE:</strong> We use cookies to optimize performance and AI personalization.
                <br><small>Your data is processed locally whenever possible.</small>
            </div>
            <div>
                <button id="btn-reject" style="background:#555; color:#fff; border:none; padding:10px 20px; margin-right:10px; cursor:pointer;">Essential Only</button>
                <button id="btn-accept" style="background:#00ff00; color:#000; border:none; padding:10px 20px; font-weight:bold; cursor:pointer;">ACCEPT ALL</button>
            </div>
        `;

        document.body.appendChild(banner);

        document.getElementById('btn-accept').onclick = () => {
            localStorage.setItem(CONSENT_KEY, 'full');
            banner.remove();
            enableTracking();
        };

        document.getElementById('btn-reject').onclick = () => {
            localStorage.setItem(CONSENT_KEY, 'essential');
            banner.remove();
        };
    }

    function enableTracking() {
        console.log("🍪 Consent Granted. Initializing Analytics...");
        // Load Google Analytics, Pixel, etc.
        // loadScript('https://www.googletagmanager.com/gtag/js?id=UA-XXXX');
    }

    // Auto-Run
    window.addEventListener('load', () => {
        createBanner();
        if (localStorage.getItem(CONSENT_KEY) === 'full') {
            enableTracking();
        }
    });
})();
