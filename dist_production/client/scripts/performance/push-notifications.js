// Push Notifications Handler
class PushNotifications {
    constructor() {
        this.init();
    }

    async init() {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            try {
                const registration = await navigator.serviceWorker.ready;
                this.registration = registration;

                // Check permission status
                const permission = await this.checkPermission();
                if (permission === 'default') {
                    // Show notification prompt after some delay
                    setTimeout(() => this.showNotificationPrompt(), 5000);
                } else if (permission === 'granted') {
                    await this.subscribeUser();
                }
            } catch (error) {
                console.log('Push notifications not supported:', error);
            }
        }
    }

    async checkPermission() {
        return Notification.permission;
    }

    async requestPermission() {
        try {
            const permission = await Notification.requestPermission();
            return permission;
        } catch (error) {
            console.log('Error requesting permission:', error);
            return 'denied';
        }
    }

    async subscribeUser() {
        try {
            const response = await fetch('/api/push-subscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    subscription: await this.registration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: this.urlBase64ToUint8Array('YOUR_VAPID_PUBLIC_KEY')
                    })
                })
            });
            console.log('Push subscription sent to server');
        } catch (error) {
            console.log('Error subscribing to push:', error);
        }
    }

    async showNotificationPrompt() {
        // Create a custom prompt
        const prompt = document.createElement('div');
        prompt.id = 'push-notification-prompt';
        prompt.innerHTML = `
      <div class="push-prompt-overlay">
        <div class="push-prompt glass-panel">
          <div class="push-icon">🔔</div>
          <h3>Receber notificações?</h3>
          <p>Fique por dentro das últimas novidades e ofertas especiais do GetNexo.</p>
          <div class="push-buttons">
            <button class="btn-deny">Agora não</button>
            <button class="btn-allow">Permitir</button>
          </div>
        </div>
      </div>
    `;
        document.body.appendChild(prompt);

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
      .push-prompt-overlay {
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.7); backdrop-filter: blur(5px);
        z-index: 9999; display: flex; align-items: center; justify-content: center;
      }
      .push-prompt {
        max-width: 400px; width: 90%; padding: 2rem; text-align: center;
        border-radius: 20px; border-color: rgba(0, 212, 255, 0.3);
      }
      .push-icon { font-size: 3rem; margin-bottom: 1rem; }
      .push-prompt h3 { color: white; margin-bottom: 1rem; }
      .push-prompt p { color: var(--text); margin-bottom: 2rem; }
      .push-buttons { display: flex; gap: 1rem; justify-content: center; }
      .push-buttons button {
        padding: 0.8rem 1.5rem; border: none; border-radius: 10px;
        font-weight: 600; cursor: pointer; transition: 0.3s;
      }
      .btn-deny { background: rgba(255,255,255,0.1); color: white; }
      .btn-deny:hover { background: rgba(255,255,255,0.2); }
      .btn-allow { background: var(--primary); color: black; }
      .btn-allow:hover { background: var(--success); }
    `;
        document.head.appendChild(style);

        // Add event listeners
        prompt.querySelector('.btn-allow').addEventListener('click', async () => {
            const permission = await this.requestPermission();
            if (permission === 'granted') {
                await this.subscribeUser();
            }
            prompt.remove();
        });

        prompt.querySelector('.btn-deny').addEventListener('click', () => {
            prompt.remove();
        });
    }

    urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new PushNotifications();
});