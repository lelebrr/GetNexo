/**
 * 🔊 ADMIN SOUNDS (Feedback Auditivo)
 * Beeps, swooshes and alerts for admin panel
 */

class AdminSounds {
    constructor() {
        this.enabled = localStorage.getItem('admin_sounds') !== 'false';
        this.audioContext = null;

        // Initialize on first interaction
        document.addEventListener('click', () => this.init(), { once: true });
    }

    init() {
        if (this.audioContext) return;
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        console.log('🔊 Admin Sounds Initialized');
    }

    toggle() {
        this.enabled = !this.enabled;
        localStorage.setItem('admin_sounds', this.enabled);
        console.log(`🔊 Sounds ${this.enabled ? 'ON' : 'OFF'}`);
        return this.enabled;
    }

    playTone(frequency, duration, type = 'sine') {
        if (!this.enabled || !this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = type;

        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    // Sound Effects
    success() {
        this.playTone(880, 0.1);
        setTimeout(() => this.playTone(1100, 0.15), 100);
    }

    error() {
        this.playTone(200, 0.3, 'square');
    }

    click() {
        this.playTone(600, 0.05);
    }

    notification() {
        this.playTone(523, 0.1);
        setTimeout(() => this.playTone(659, 0.1), 100);
        setTimeout(() => this.playTone(784, 0.15), 200);
    }

    swoosh() {
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                this.playTone(300 + i * 50, 0.05);
            }, i * 20);
        }
    }

    alert() {
        this.playTone(440, 0.2);
        setTimeout(() => this.playTone(440, 0.2), 300);
        setTimeout(() => this.playTone(440, 0.4), 600);
    }
}

// Global instance
window.adminSounds = new AdminSounds();

// Expose shortcuts
window.playSuccess = () => window.adminSounds.success();
window.playError = () => window.adminSounds.error();
window.playNotification = () => window.adminSounds.notification();

console.log('🔊 Admin Sounds Ready. Use playSuccess(), playError(), playNotification()');
