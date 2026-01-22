/**
 * 🎉 CONFETTI CANNON
 * Celebration effect for conversions and achievements
 */

class ConfettiCannon {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'confetti-canvas';
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 99999;
        `;
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.colors = ['#00F7FF', '#FF0033', '#FFD500', '#00FF00', '#FF00FF'];

        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    fire(x = window.innerWidth / 2, y = window.innerHeight / 2) {
        console.log('🎉 Confetti!');

        for (let i = 0; i < 100; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 20,
                vy: (Math.random() - 0.5) * 20 - 10,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                size: Math.random() * 10 + 5,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 10,
                life: 1
            });
        }

        this.animate();
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles = this.particles.filter(p => p.life > 0);

        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.5; // Gravity
            p.rotation += p.rotationSpeed;
            p.life -= 0.01;

            this.ctx.save();
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate(p.rotation * Math.PI / 180);
            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = p.life;
            this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size / 2);
            this.ctx.restore();
        });

        if (this.particles.length > 0) {
            requestAnimationFrame(() => this.animate());
        }
    }
}

// Global instance
window.confetti = new ConfettiCannon();

// Expose fire function
window.fireConfetti = () => window.confetti.fire();

console.log('🎉 Confetti Cannon Ready. Call fireConfetti() to celebrate!');
