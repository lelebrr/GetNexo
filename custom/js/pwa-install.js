// Custom PWA Install Hack
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    showInstallPromo();
});

function showInstallPromo() {
    const banner = document.createElement('div');
    banner.id = 'pwa-install-banner';
    banner.innerHTML = `
        <div style="position:fixed;bottom:20px;left:20px;right:20px;background:#111;border:1px solid #FFD500;padding:15px;border-radius:10px;z-index:9999;display:flex;align-items:center;justify-content:space-between;box-shadow:0 0 20px rgba(255, 213, 0, 0.3);">
            <div style="color:#fff;font-family:'Montserrat',sans-serif;">
                <strong style="color:#FFD500">Instalar App Use Nexo</strong><br>
                <small>Acesso 100% Offline + Notifications</small>
            </div>
            <button id="pwa-install-btn" style="background:#FFD500;color:#000;border:none;padding:10px 20px;font-weight:bold;border-radius:5px;cursor:pointer;">INSTALAR AGORA</button>
        </div>
    `;
    document.body.appendChild(banner);

    document.getElementById('pwa-install-btn').addEventListener('click', async () => {
        banner.remove();
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);
        deferredPrompt = null;
    });
}

// Offline Detection
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

function updateOnlineStatus() {
    if (!navigator.onLine) {
        document.body.style.filter = "grayscale(100%)";
        alert("⚠️ Você está Offline. Relaxa, o Use Nexo funciona sem internet.");
    } else {
        document.body.style.filter = "none";
    }
}

// Register SW
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js')
        .then(() => console.log('Service Worker Registered'));
}
