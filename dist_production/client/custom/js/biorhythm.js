
// JetNexo Bio-Rhythm
// "We flow with your energy."
// Adjusts UI based on User's Circadian Rhythm.

class BioRhythm {
    constructor() {
        this.hour = new Date().getHours();
        this.root = document.documentElement;
        this.init();
    }

    init() {
        console.log(`⏰ [BioRhythm] User Local Hour: ${this.hour}h`);

        if (this.hour >= 6 && this.hour < 12) {
            this.setMode('MORNING_BOOST');
        } else if (this.hour >= 12 && this.hour < 18) {
            this.setMode('AFTERNOON_FOCUS');
        } else if (this.hour >= 18 && this.hour < 22) {
            this.setMode('EVENING_RELAX');
        } else {
            this.setMode('MIDNIGHT_DEEP');
        }
    }

    setMode(mode) {
        console.log(`🧬 [BioRhythm] Activating Mode: ${mode}`);

        switch (mode) {
            case 'MORNING_BOOST':
                // High Energy, Bright, Fast Animations
                this.root.style.setProperty('--animation-speed', '0.2s');
                this.root.style.setProperty('--ui-brightness', '1.1');
                this.root.style.setProperty('--accent-glow', '0 0 15px #FFD500'); // Sun Gold
                break;

            case 'AFTERNOON_FOCUS':
                // Balanced, Clear
                this.root.style.setProperty('--animation-speed', '0.3s');
                this.root.style.setProperty('--ui-brightness', '1.0');
                this.root.style.setProperty('--accent-glow', '0 0 10px #FF0033'); // Action Red
                break;

            case 'EVENING_RELAX':
                // Warmer, Slower
                this.root.style.setProperty('--animation-speed', '0.5s');
                this.root.style.setProperty('--ui-brightness', '0.9');
                this.root.style.setProperty('--accent-glow', '0 0 20px #FF5500'); // Sunset Orange
                break;

            case 'MIDNIGHT_DEEP':
                // Dark, Minimal motion, Blue-light filter vibe
                this.root.style.setProperty('--animation-speed', '0.8s');
                this.root.style.setProperty('--ui-brightness', '0.7');
                this.root.style.setProperty('--accent-glow', '0 0 5px #4400FF'); // Deep Neon
                break;
        }
    }
}

// Auto-boot
if (typeof window !== 'undefined') {
    new BioRhythm();
}
