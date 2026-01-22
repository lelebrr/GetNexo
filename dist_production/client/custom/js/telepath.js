
// JetNexo Telepath
// "We know what you want before you do."
// Predictive prefetching based on mouse vectors.

class Telepath {
    constructor() {
        this.sensitivity = 50; // pixels
        this.targets = [];
        this.lastX = 0;
        this.lastY = 0;
        this.init();
    }

    init() {
        // Identify actionable targets
        document.querySelectorAll('a, button').forEach(el => {
            const rect = el.getBoundingClientRect();
            this.targets.push({
                el: el,
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2,
                url: el.getAttribute('href') || null
            });
        });

        document.addEventListener('mousemove', (e) => this.predict(e));
        console.log("🧠 [Telepath] Cognitive Layer Active. Tracking Intent...");
    }

    predict(e) {
        // Calculate velocity vector
        const dx = e.clientX - this.lastX;
        const dy = e.clientY - this.lastY;

        // Update last pos
        this.lastX = e.clientX;
        this.lastY = e.clientY;

        // Vector magnitude
        const speed = Math.sqrt(dx * dx + dy * dy);
        if (speed < 2) return; // Ignore idle movements

        // Project future position (Lookahead)
        const lookaheadX = e.clientX + (dx * 5);
        const lookaheadY = e.clientY + (dy * 5);

        this.checkCollision(lookaheadX, lookaheadY);
    }

    checkCollision(x, y) {
        this.targets.forEach(target => {
            const dist = Math.sqrt(Math.pow(target.x - x, 2) + Math.pow(target.y - y, 2));

            if (dist < this.sensitivity) {
                this.preload(target);
            }
        });
    }

    preload(target) {
        if (target.preloaded) return;

        target.preloaded = true;
        target.el.style.transform = "scale(1.02)"; // Subtle visual cue
        target.el.style.transition = "transform 0.2s";

        if (target.url && target.url.startsWith('/')) {
            console.log(`🔮 [Telepath] High Probability Detected. Prefetching: ${target.url}`);
            // Actual link prefetch simulation
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = target.url;
            document.head.appendChild(link);
        } else {
            console.log(`🔮 [Telepath] Intent Detected on Action: ${target.el.innerText}`);
        }
    }
}

// Auto-boot
if (typeof window !== 'undefined') {
    new Telepath();
}
