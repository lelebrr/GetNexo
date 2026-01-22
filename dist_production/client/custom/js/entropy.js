
// JetNexo Entropy Sales
// "Everything ends. Buy before it does."
// Visually decays the offer container over time (opacity, blur, glitch).

class EntropySales {
    constructor() {
        this.target = document.querySelector('.entropy-target'); // Add this class to sales container
        this.duration = 60; // seconds
        this.timeLeft = this.duration;
        this.running = false;

        if (this.target) this.init();
    }

    init() {
        console.log("⏳ [Entropy] Decay process initiated.");
        this.running = true;
        this.tick();
    }

    tick() {
        if (!this.running || this.timeLeft <= 0) {
            this.collapse();
            return;
        }

        this.timeLeft--;
        const percentage = 1 - (this.timeLeft / this.duration); // 0 to 1

        // Visual Decay Effects
        this.target.style.opacity = 1 - (percentage * 0.5); // Fade to 50%
        this.target.style.filter = `blur(${percentage * 5}px) grayscale(${percentage * 100}%)`;

        if (percentage > 0.8) {
            // Glitch in final moments
            this.target.style.transform = `translate(${Math.random() * 2}px, ${Math.random() * 2}px)`;
            this.target.style.color = Math.random() > 0.5 ? 'red' : 'inherit';
        }

        requestAnimationFrame(() => {
            setTimeout(() => this.tick(), 1000);
        });
    }

    collapse() {
        console.log("💀 [Entropy] Offer dead.");
        this.target.innerHTML = "<h2 style='color:red; text-align:center;'>OFFER EXPIRED.</h2>";
        this.target.style.filter = 'grayscale(100%)';
        this.target.style.opacity = '1';
        this.target.style.transform = 'none';
    }
}

// Auto-boot
if (typeof window !== 'undefined') {
    window.entropy = new EntropySales();
}
