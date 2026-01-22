/**
 * 🕶️ HOLO AGENT (Admin Visuals)
 * Adds a holographic glass effect to UI cards.
 */

class HoloAgent {
    constructor(selector) {
        this.cards = document.querySelectorAll(selector);
        this.init();
    }

    init() {
        if (!this.cards.length) return;

        console.log("🕶️ HoloAgent: Initializing 3D Tilt Effect...");

        this.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => this.tilt(e, card));
            card.addEventListener('mouseleave', () => this.reset(card));
        });
    }

    tilt(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg
        const rotateY = ((x - centerX) / centerX) * 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        card.style.background = `
            radial-gradient(
                circle at ${x}px ${y}px, 
                rgba(255,255,255,0.1) 0%, 
                rgba(0,0,0,0.8) 80%
            )
        `;
    }

    reset(card) {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        card.style.background = 'rgba(0,0,0,0.8)';
    }
}

// Auto-init on load
document.addEventListener('DOMContentLoaded', () => {
    new HoloAgent('.holo-card');
});
