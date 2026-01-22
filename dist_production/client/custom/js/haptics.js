
// JetNexo Haptics
// "Feel the deal."
// Tactile feedback for high-value interactions.

class HapticEngine {
    constructor() {
        this.enabled = 'vibrate' in navigator;
        this.init();
    }

    init() {
        if (!this.enabled) {
            console.log("📳 [Haptics] API not supported.");
            return;
        }
        console.log("📳 [Haptics] Tactile Layer Active.");

        this.attachListeners();
    }

    attachListeners() {
        // CTA Buttons (Heavy Impact)
        document.querySelectorAll('button, .cta').forEach(el => {
            el.addEventListener('click', () => this.trigger('HEAVY'));
        });

        // Links (Light Tap)
        document.querySelectorAll('a').forEach(el => {
            el.addEventListener('mouseenter', () => this.trigger('LIGHT'));
        });
    }

    trigger(type) {
        switch (type) {
            case 'LIGHT':
                navigator.vibrate(5); // 5ms tick
                break;
            case 'MEDIUM':
                navigator.vibrate(20);
                break;
            case 'HEAVY':
                navigator.vibrate([50]); // Thud
                break;
            case 'SUCCESS':
                navigator.vibrate([30, 50, 30]); // Da-da-da
                break;
            case 'ERROR':
                navigator.vibrate([100, 50, 100]); // Buzz-Buzz
                break;
        }
    }
}

// Global Access
if (typeof window !== 'undefined') {
    window.haptics = new HapticEngine();
}
