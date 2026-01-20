// Neuro-Engine: The Soul of the Interface
// Handles Keystroke Analysis, Audio Feedback, and Mood Management

class NeuroLogic {
    constructor() {
        this.keystrokes = [];
        this.lastKeyTime = Date.now();
        this.mood = 'neutral';
        this.trustLevel = 0; // 0-5 stars

        // Audio Context (Mocked for auto-play policy, initializes on interaction)
        this.audioCtx = null;

        this.initListeners();
    }

    initListeners() {
        document.addEventListener('keydown', (e) => this.analyzeKeystroke(e));
        document.addEventListener('click', () => this.initAudioContext()); // Unlock Audio

        // Mocking message reception for demo
        window.addEventListener('message-received', () => this.playAudio('ding'));
    }

    initAudioContext() {
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            console.log("🔊 Neuro-Audio Context Unlocked.");
        }
    }

    // Item 151: Neuro-Typing Engine
    analyzeKeystroke(e) {
        const now = Date.now();
        const delta = now - this.lastKeyTime;
        this.lastKeyTime = now;

        this.keystrokes.push(delta);
        if (this.keystrokes.length > 20) this.keystrokes.shift(); // Keep last 20

        const avgSpeed = this.keystrokes.reduce((a, b) => a + b, 0) / this.keystrokes.length;

        // Play typing sound (Item 176)
        this.playAudio('type');

        // Analyze Personality
        if (avgSpeed < 100) {
            console.log("🧠 Neuro-Input: Impulsive/Fast detected. Adjusting AI to 'Concise'.");
            // In prod: fetch('/api/neuro/profile', { method: 'POST', body: JSON.stringify({ trait: 'impulsive' }) });
        } else if (e.key === 'Backspace') {
            console.log("🧠 Neuro-Input: Perfectionist detected (High correction). Adjusting AI to 'Analytical'.");
        }
    }

    // Item 152, 156, 184, 193, 198: Multisensory Audio
    playAudio(type) {
        if (!this.audioCtx) return;

        const osc = this.audioCtx.createOscillator();
        const gainNode = this.audioCtx.createGain();
        osc.connect(gainNode);
        gainNode.connect(this.audioCtx.destination);

        const now = this.audioCtx.currentTime;

        if (type === 'ding') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(523.25, now); // C5
            osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.1); // C6
            gainNode.gain.setValueAtTime(0.1, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
            osc.start();
            osc.stop(now + 0.5);
        } else if (type === 'type') {
            // Item 189: Client Typing Sound
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(800, now);
            gainNode.gain.setValueAtTime(0.03, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
            osc.start();
            osc.stop(now + 0.05);
        } else if (type === 'tada') {
            // Item 170: Success
            this.playChord([523.25, 659.25, 783.99]);
        } else if (type === 'bip') {
            // Item 184: Error Backup
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(200, now); // Low
            gainNode.gain.setValueAtTime(0.1, now);
            gainNode.gain.linearRampToValueAtTime(0.01, now + 0.2);
            osc.start();
            osc.stop(now + 0.2);
        } else if (type === 'swoosh') {
            // Item 193: Send Sound (White Noise Burst sim)
            // Simplified as slide
            osc.type = 'sine';
            osc.frequency.setValueAtTime(200, now);
            osc.frequency.linearRampToValueAtTime(800, now + 0.2);
            gainNode.gain.setValueAtTime(0.05, now);
            gainNode.gain.linearRampToValueAtTime(0.01, now + 0.2);
            osc.start();
            osc.stop(now + 0.2);
        } else if (type === 'toc') {
            // Item 198: Goodbye
            osc.type = 'square';
            osc.frequency.setValueAtTime(100, now);
            gainNode.gain.setValueAtTime(0.1, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            osc.start();
            osc.stop(now + 0.1);
        }
    }

    playChord(freqs) {
        freqs.forEach((f, i) => {
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            osc.connect(gain);
            gain.connect(this.audioCtx.destination);
            osc.frequency.value = f;
            gain.gain.value = 0.1;
            gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 1.5);
            osc.start();
            osc.stop(this.audioCtx.currentTime + 1.5);
        });
    }

    // Item 190, 195: Special Effects
    triggerEffect(effectName) {
        const body = document.body;
        if (effectName === 'golden_birthday') {
            // Item 190
            body.classList.add('golden-mode');
            setTimeout(() => body.classList.remove('golden-mode'), 5000);
        } else if (effectName === 'urgency_shake') {
            // Item 195
            body.classList.add('shake-red');
            setTimeout(() => body.classList.remove('shake-red'), 1000);
        }
    }

    // Item 153: Mood & Color
    setMood(mood) {
        this.mood = mood;
        const root = document.documentElement;

        switch (mood) {
            case 'solution': // Green
                root.style.setProperty('--mood-color', '#00ff00');
                root.style.setProperty('--bg-mood', '#0a1a0a');
                break;
            case 'urgent': // Red
                root.style.setProperty('--mood-color', '#ff0033');
                root.style.setProperty('--bg-mood', '#1a0a0a');
                break;
            case 'empathy': // Blue
                root.style.setProperty('--mood-color', '#0088ff');
                root.style.setProperty('--bg-mood', '#0a0a1a');
                break;
            default:
                root.style.setProperty('--mood-color', '#ffd500'); // Default Yellow
                root.style.setProperty('--bg-mood', '#000000');
        }
        console.log(`🎨 UI Mood shifted to: ${mood}`);
    }

    // Item 154: Trust & Gamification
    triggerTrustCheck() {
        const trust = confirm("🧠 Micro-Trust: Did I earn your trust with that interaction?");
        if (trust) {
            this.trustLevel++;
            console.log(`⭐ Trust Level Up: ${this.trustLevel}/5`);
            this.playAudio('tada');
            if (this.trustLevel >= 5) {
                alert("🎉 CLIENTE FIEL DETECTADO! Ganhe 5% OFF: #TRUST5");
            }
        }
    }

    // Global Instance Handlers (Mock triggers)
    // Used by Tuner or Manual Events
    handleError() { this.playAudio('bip'); console.log("🤖 Ops, falhei."); }
    handleSend() { this.playAudio('swoosh'); }
    handleClose() { this.playAudio('toc'); }
}

// Global Instance
window.neuro = new NeuroLogic();
console.log("🧠 Neuro-Engine 2.0 Loaded (200 Features). Waiting for user interaction...");
