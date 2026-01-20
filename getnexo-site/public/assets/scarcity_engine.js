
// Neuro-Psychological Scarcity Engine
// "The Fear of Missing Out is stronger than the Desire of Gain."

class ScarcityEngine {
    constructor() {
        this.spotsTotal = 15;
        this.spotsLeft = this.getStoredSpots();
        this.viewers = 0;
        this.basePrice = 997;
        this.init();
    }

    getStoredSpots() {
        const stored = localStorage.getItem('jetnexo_spots');
        return stored ? parseInt(stored) : 7; // Default start at 7
    }

    init() {
        this.render();
        this.startViewerSimulation();
        this.startSalesSimulation();
    }

    startViewerSimulation() {
        // Fluctuating viewers count (Social Proof)
        setInterval(() => {
            this.viewers = Math.floor(Math.random() * (140 - 80) + 80);
            this.updateDOM('viewers-count', `${this.viewers} pessoas vendo agora`);
        }, 3000);
    }

    startSalesSimulation() {
        // Drops a spot every 45-90 seconds randomly
        const randTime = Math.random() * (90000 - 45000) + 45000;
        setTimeout(() => {
            if (this.spotsLeft > 2) { // Never drop below 2 to maintain hope
                this.spotsLeft--;
                this.flashScreen();
                this.playSoldSound();
                this.save();
                this.render();
                this.startSalesSimulation(); // Recurse
            }
        }, randTime);
    }

    flashScreen() {
        const el = document.getElementById('scarcity-banner');
        if (el) {
            el.classList.add('bg-red-600');
            setTimeout(() => el.classList.remove('bg-red-600'), 200);
        }
    }

    playSoldSound() {
        // Subtle cash register or notification sound
        // new Audio('/assets/sold.mp3').play().catch(e=>{});
    }

    save() {
        localStorage.setItem('jetnexo_spots', this.spotsLeft);
    }

    updateDOM(id, text) {
        const el = document.getElementById(id);
        if (el) el.innerText = text;
    }

    render() {
        this.updateDOM('spots-count', this.spotsLeft);
        // Change color based on urgency
        const color = this.spotsLeft < 4 ? 'text-red-500' : 'text-yellow-500';
        const el = document.getElementById('spots-count');
        if (el) el.className = `font-black text-6xl ${color}`;
    }
}

// Auto-boot
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        new ScarcityEngine();
    });
}
