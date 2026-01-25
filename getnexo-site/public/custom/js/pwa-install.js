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

        // Mostrar modal automaticamente após 2 segundos
        setTimeout(() => {
            this.showInstallPrompt();
        }, 2000);

        // Escutar pelo prompt de instalação
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            // Se já estiver mostrando, não mostrar novamente
            if (!document.getElementById('pwa-install-toast')) {
                this.showInstallPrompt();
            }
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

        // Adicionar CSS da animação
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateX(-50%) translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
            }

            #install-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(0, 212, 255, 0.5);
            }

            #install-btn::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                transition: left 0.5s;
            }

            #install-btn:hover::before {
                left: 100%;
            }

            #dismiss-btn:hover {
                background: rgba(255,255,255,0.2);
                transform: scale(1.1);
            }
        `;
        document.head.appendChild(style);
    }

    showInstallPrompt() {
        const installToast = document.createElement('div');
        installToast.id = 'pwa-install-toast';
        installToast.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 75%;
                max-width: 280px;
                background: rgba(15, 23, 42, 0.75);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(0, 212, 255, 0.2);
                color: #fff;
                padding: 0.6rem 1rem;
                border-radius: 14px;
                box-shadow: 0 8px 30px rgba(0,0,0,0.3);
                z-index: 10000;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0.6rem;
                font-family: 'Inter', sans-serif;
                animation: slideUp 0.3s ease-out;
            ">
                <div style="text-align: center;">
                    <div style="font-size: 0.9rem; font-weight: 800; background: linear-gradient(90deg, #00d4ff, #00ff9d); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 0.2rem;">
                        🚀 GetNexo Vai Transformar Seu Negócio!
                    </div>
                    <div style="font-size: 0.7rem; color: #94a3b8; line-height: 1.3;">
                        IA que vende sozinha 24h - Instale AGORA e multiplique seus resultados!
                    </div>
                </div>

                <div id="countdown-timer" style="
                    font-size: 0.6rem;
                    color: #00d4ff;
                    font-weight: 600;
                    background: rgba(0, 212, 255, 0.15);
                    padding: 0.15rem 0.5rem;
                    border-radius: 10px;
                    border: 1px solid rgba(0, 212, 255, 0.4);
                ">
                    Fecha em <span id="countdown-seconds">30</span>s
                </div>

                <div style="display: flex; gap: 0.3rem; align-items: center;">
                    <button id="install-btn" style="
                        background: linear-gradient(135deg, #00d4ff, #00ff9d);
                        color: #000;
                        border: none;
                        padding: 0.4rem 0.8rem;
                        border-radius: 18px;
                        cursor: pointer;
                        font-weight: 700;
                        font-size: 0.7rem;
                        transition: all 0.3s ease;
                        box-shadow: 0 3px 12px rgba(0, 212, 255, 0.4);
                        position: relative;
                        overflow: hidden;
                    ">🚀 Instalar</button>
                    <button id="dismiss-btn" style="
                        background: rgba(255,255,255,0.1);
                        color: #fff;
                        border: 1px solid rgba(255,255,255,0.2);
                        padding: 0.4rem;
                        border-radius: 50%;
                        cursor: pointer;
                        font-size: 0.8rem;
                        width: 30px;
                        height: 30px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: 0.3s;
                    ">✕</button>
                </div>
            </div>
        `;

        document.body.appendChild(installToast);

        // Start countdown timer
        this.startCountdown();

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
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }
    }

    startCountdown() {
        let seconds = 30;
        const countdownElement = document.getElementById('countdown-seconds');

        this.countdownInterval = setInterval(() => {
            seconds--;
            if (countdownElement) {
                countdownElement.textContent = seconds;
            }

            if (seconds <= 0) {
                this.hideInstallPrompt();
            }
        }, 1000);
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