/**
 * Neuro-Particles: The Digital Network
 * Simulates data nodes connecting near the cursor.
 * Lightweight HTML5 Canvas implementation.
 */

class ParticleNetwork {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.cursor = { x: -100, y: -100 };
        this.config = {
            particleCount: 60,
            connectionDist: 100,
            color: 'rgba(0, 247, 255, 0.5)', // Neon Blue
            speed: 0.5
        };

        this.init();
    }

    init() {
        // Setup Canvas
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100vw';
        this.canvas.style.height = '100vh';
        this.canvas.style.zIndex = '-1'; // Background
        this.canvas.style.pointerEvents = 'none';
        document.body.appendChild(this.canvas);

        // Resize Listener
        window.addEventListener('resize', () => this.resize());
        this.resize();

        // Mouse Listener
        document.addEventListener('mousemove', (e) => {
            this.cursor.x = e.clientX;
            this.cursor.y = e.clientY;
        });

        // Create Particles
        for (let i = 0; i < this.config.particleCount; i++) {
            this.particles.push(new Particle(this.canvas.width, this.canvas.height));
        }

        // Start Loop
        this.animate();
        console.log("🌌 Neuro-Particles Connected.");
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update & Draw Particles
        this.particles.forEach(p => {
            p.update(this.canvas.width, this.canvas.height);
            p.draw(this.ctx);
        });

        // Draw Connections
        this.drawConnections();

        requestAnimationFrame(() => this.animate());
    }

    drawConnections() {
        this.particles.forEach((p, i) => {
            // Connect to Cursor
            const distCursor = Math.hypot(p.x - this.cursor.x, p.y - this.cursor.y);
            if (distCursor < 150) {
                this.ctx.beginPath();
                this.ctx.strokeStyle = `rgba(0, 247, 255, ${1 - distCursor / 150})`;
                this.ctx.lineWidth = 1;
                this.ctx.moveTo(p.x, p.y);
                this.ctx.lineTo(this.cursor.x, this.cursor.y);
                this.ctx.stroke();
            }

            // Connect to nearby particles (optional, kept minimal for perf)
            // for (let j = i + 1; j < this.particles.length; j++) {
            //     const p2 = this.particles[j];
            //     const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
            //     if (dist < this.config.connectionDist) {
            //         this.ctx.beginPath();
            //         this.ctx.strokeStyle = `rgba(0, 247, 255, ${0.2 * (1 - dist/this.config.connectionDist)})`;
            //         this.ctx.moveTo(p.x, p.y);
            //         this.ctx.lineTo(p2.x, p2.y);
            //         this.ctx.stroke();
            //     }
            // }
        });
    }
}

class Particle {
    constructor(w, h) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
    }

    update(w, h) {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > w) this.vx *= -1;
        if (this.y < 0 || this.y > h) this.vy *= -1;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Init only on Desktop (roughly)
if (window.innerWidth > 768) {
    new ParticleNetwork();
}
