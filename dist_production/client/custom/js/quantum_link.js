
// JetNexo Quantum Link
// "Omnipresence achieved."
// Instantly synchronizes state across tabs using BroadcastChannel.

class QuantumLink {
    constructor() {
        this.channel = new BroadcastChannel('jetnexo_quantum_layer');
        this.init();
    }

    init() {
        console.log("⚛️ [Quantum] Channel Open. Listening for entanglement...");

        this.channel.onmessage = (event) => {
            this.handleEntanglement(event.data);
        };
    }

    sync(action, payload) {
        // Broadcast local change to other tabs
        console.log(`⚛️ [Quantum] Broadcasting: ${action}`);
        this.channel.postMessage({ action, payload, timestamp: Date.now() });
    }

    handleEntanglement(data) {
        console.log(`⚛️ [Quantum] Entanglement received:`, data);

        switch (data.action) {
            case 'THEME_CHANGE':
                document.documentElement.className = data.payload;
                break;
            case 'CART_UPDATE':
                this.updateCartUI(data.payload);
                break;
            case 'LOGIN_SUCCESS':
                window.location.reload(); // Auto-login everywhere
                break;
        }
    }

    updateCartUI(count) {
        const badge = document.getElementById('cart-badge');
        if (badge) badge.innerText = count;
        // Trigger haptic ghost feel
        if (window.haptics) window.haptics.trigger('LIGHT');
    }
}

// Auto-boot
if (typeof window !== 'undefined') {
    window.quantum = new QuantumLink();
}
