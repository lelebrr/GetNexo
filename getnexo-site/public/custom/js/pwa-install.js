class PWAInstallPrompt {
    constructor() {
        this.deferredPrompt = null;
        this.isInstalled = false;
        this.init();
    }

    init() {
        // Verificar se já está instalado
        if (window.matchMedia('(display-mode: standalone)').matches ||
            window.navigator.standalone === true) {
            this.isInstalled = true;
            return;
        }

        // Escutar pelo prompt de instalação
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallPrompt();
        });

        // Escutar pela instalação
        window.addEventListener('appinstalled', (e) => {
            console.log('PWA foi instalada com sucesso');
            this.isInstalled = true;
            this.hideInstallPrompt();
        });

        // Escutar mensagens do service worker sobre atualizações
        navigator.serviceWorker.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
                this.showUpdateNotification();
            }
        });
    }

    showInstallPrompt() {
        const installToast = document.createElement('div');
        installToast.id = 'pwa-install-toast';
        installToast.innerHTML = `
            <div style="
                position: fixed;
                bottom: 20px;
                left: 20px;
                right: 20px;
                background: linear-gradient(90deg, #00d4ff, #00ff9d);
                color: #000;
                padding: 1rem;
                border-radius: 10px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                z-index: 10000;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-family: 'Inter', sans-serif;
            ">
                <div>
                    <strong>Instalar GetNexo</strong><br>
                    <small>App PWA completo com funcionalidades offline</small>
                </div>
                <div>
                    <button id="install-btn" style="
                        background: #000;
                        color: #fff;
                        border: none;
                        padding: 0.5rem 1rem;
                        border-radius: 5px;
                        cursor: pointer;
                        margin-right: 0.5rem;
                    ">Instalar</button>
                    <button id="dismiss-btn" style="
                        background: transparent;
                        color: #000;
                        border: none;
                        cursor: pointer;
                    ">✕</button>
                </div>
            </div>
        `;

        document.body.appendChild(installToast);

        document.getElementById('install-btn').addEventListener('click', () => {
            this.installPWA();
        });

        document.getElementById('dismiss-btn').addEventListener('click', () => {
            this.hideInstallPrompt();
        });
    }

    hideInstallPrompt() {
        const toast = document.getElementById('pwa-install-toast');
        if (toast) {
            toast.remove();
        }
    }

    async installPWA() {
        if (!this.deferredPrompt) return;

        this.deferredPrompt.prompt();
        const { outcome } = await this.deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('Usuário aceitou instalar PWA');
        } else {
            console.log('Usuário rejeitou instalar PWA');
        }

        this.deferredPrompt = null;
        this.hideInstallPrompt();
    }

    showUpdateNotification() {
        const updateToast = document.createElement('div');
        updateToast.id = 'pwa-update-toast';
        updateToast.innerHTML = `
            <div style="
                position: fixed;
                bottom: 20px;
                left: 20px;
                right: 20px;
                background: linear-gradient(90deg, #ff6b35, #f7931e);
                color: #000;
                padding: 1rem;
                border-radius: 10px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                z-index: 10000;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-family: 'Inter', sans-serif;
            ">
                <div>
                    <strong>Atualização Disponível</strong><br>
                    <small>Nova versão do GetNexo pronta para instalar</small>
                </div>
                <div>
                    <button id="update-btn" style="
                        background: #000;
                        color: #fff;
                        border: none;
                        padding: 0.5rem 1rem;
                        border-radius: 5px;
                        cursor: pointer;
                        margin-right: 0.5rem;
                    ">Atualizar</button>
                    <button id="later-btn" style="
                        background: transparent;
                        color: #000;
                        border: none;
                        cursor: pointer;
                    ">Depois</button>
                </div>
            </div>
        `;

        document.body.appendChild(updateToast);

        document.getElementById('update-btn').addEventListener('click', () => {
            this.updatePWA();
        });

        document.getElementById('later-btn').addEventListener('click', () => {
            updateToast.remove();
        });
    }

    updatePWA() {
        navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
    }
}

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new PWAInstallPrompt();
});