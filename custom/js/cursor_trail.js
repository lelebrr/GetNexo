/**
 * GetNexo Cursor Trail - Sistema de Partículas Interativas Avançado
 * Efeitos visuais dinâmicos que seguem o cursor com física realista
 */

class CursorTrail {
    constructor(options = {}) {
        this.options = {
            particleCount: 50,
            trailLength: 20,
            particleSize: 3,
            speed: 0.1,
            friction: 0.95,
            gravity: 0.1,
            mouseInfluence: 0.3,
            colorMode: 'rainbow',
            particleShape: 'circle',
            enablePhysics: true,
            enableBloom: true,
            enableMouseAttraction: true,
            ...options
        };

        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.mouse = { x: 0, y: 0, vx: 0, vy: 0 };
        this.lastMouse = { x: 0, y: 0 };
        this.animationId = null;
        this.isActive = false;
        this.trailPoints = [];
        this.physicsEngine = new ParticlePhysics();

        this.colorPalettes = {
            rainbow: ['#ff0000', '#ff8000', '#ffff00', '#80ff00', '#00ff00', '#00ff80', '#00ffff', '#0080ff', '#0000ff', '#8000ff', '#ff00ff', '#ff0080'],
            neon: ['#00ffff', '#ff00ff', '#ffff00', '#ff0080', '#80ff00'],
            fire: ['#ff0000', '#ff4400', '#ff8800', '#ffaa00', '#ffff00'],
            ocean: ['#001122', '#003366', '#0066aa', '#0099cc', '#00ccff'],
            matrix: ['#00ff00', '#00aa00', '#008800', '#006600']
        };

        this.init();
    }

    init() {
        this.createCanvas();
        this.setupEventListeners();
        this.createParticles();
        this.startAnimation();
        console.log('✨ Cursor Trail initialized');
    }

    createCanvas() {
        // Create full-screen overlay canvas
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'cursor-trail-canvas';
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            pointer-events: none;
            z-index: 9999;
            mix-blend-mode: screen;
        `;

        this.ctx = this.canvas.getContext('2d', {
            alpha: true,
            desynchronized: true,
            willReadFrequently: false
        });

        this.resizeCanvas();
        document.body.appendChild(this.canvas);

        // Resize handler
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = window.innerWidth * dpr;
        this.canvas.height = window.innerHeight * dpr;
        this.canvas.style.width = window.innerWidth + 'px';
        this.canvas.style.height = window.innerHeight + 'px';
        this.ctx.scale(dpr, dpr);
    }

    setupEventListeners() {
        // Mouse movement
        document.addEventListener('mousemove', (e) => {
            this.lastMouse.x = this.mouse.x;
            this.lastMouse.y = this.mouse.y;

            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;

            // Calculate mouse velocity
            this.mouse.vx = (this.mouse.x - this.lastMouse.x) * 0.3;
            this.mouse.vy = (this.mouse.y - this.lastMouse.y) * 0.3;

            // Add trail point
            this.addTrailPoint(e.clientX, e.clientY);

            // Attract particles to mouse
            if (this.options.enableMouseAttraction) {
                this.attractParticlesToMouse();
            }
        });

        // Mouse click effects
        document.addEventListener('mousedown', (e) => {
            this.createClickEffect(e.clientX, e.clientY);
        });

        // Scroll effects
        let scrollTimeout;
        document.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            this.createScrollEffect();
            scrollTimeout = setTimeout(() => {
                this.resetScrollEffect();
            }, 150);
        });

        // Keyboard effects
        document.addEventListener('keydown', (e) => {
            this.createKeyEffect(e.key);
        });
    }

    createParticles() {
        this.particles = [];

        for (let i = 0; i < this.options.particleCount; i++) {
            const particle = new TrailParticle({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: this.options.particleSize + Math.random() * 2,
                life: 0,
                maxLife: 100 + Math.random() * 200,
                color: this.getParticleColor(i),
                shape: this.options.particleShape,
                physics: this.options.enablePhysics
            });

            this.particles.push(particle);
        }
    }

    getParticleColor(index) {
        const palette = this.colorPalettes[this.options.colorMode] || this.colorPalettes.rainbow;
        return palette[index % palette.length];
    }

    addTrailPoint(x, y) {
        this.trailPoints.push({
            x: x,
            y: y,
            timestamp: Date.now(),
            velocity: Math.sqrt(this.mouse.vx * this.mouse.vx + this.mouse.vy * this.mouse.vy)
        });

        // Keep only recent trail points
        const maxAge = 1000; // 1 second
        this.trailPoints = this.trailPoints.filter(point =>
            Date.now() - point.timestamp < maxAge
        );

        // Limit trail length
        if (this.trailPoints.length > this.options.trailLength) {
            this.trailPoints.shift();
        }

        // Create particles along trail
        this.createTrailParticles();
    }

    createTrailParticles() {
        if (this.trailPoints.length < 2) return;

        // Create particles between trail points
        for (let i = 1; i < this.trailPoints.length; i++) {
            const current = this.trailPoints[i];
            const previous = this.trailPoints[i - 1];

            // Calculate direction
            const dx = current.x - previous.x;
            const dy = current.y - previous.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 5) { // Minimum distance for particle creation
                const particleCount = Math.floor(distance / 10);
                for (let j = 0; j < particleCount; j++) {
                    const ratio = j / particleCount;
                    const x = previous.x + dx * ratio;
                    const y = previous.y + dy * ratio;

                    this.spawnParticleAt(x, y, {
                        vx: dx * 0.1,
                        vy: dy * 0.1,
                        velocity: current.velocity
                    });
                }
            }
        }
    }

    spawnParticleAt(x, y, options = {}) {
        // Find dead or low-life particle to reuse
        let particle = this.particles.find(p => p.life <= 0);

        if (!particle) {
            // Create new particle if none available
            particle = new TrailParticle({
                x: x,
                y: y,
                vx: options.vx || (Math.random() - 0.5) * 4,
                vy: options.vy || (Math.random() - 0.5) * 4,
                size: this.options.particleSize * (0.5 + Math.random()),
                life: 1,
                maxLife: 60 + Math.random() * 120,
                color: this.getRandomColor(),
                shape: this.options.particleShape,
                physics: this.options.enablePhysics
            });
            this.particles.push(particle);
        } else {
            // Reset existing particle
            particle.reset(x, y, options);
        }

        // Add velocity based on mouse movement
        if (options.velocity > 10) {
            particle.vx += (Math.random() - 0.5) * options.velocity * 0.1;
            particle.vy += (Math.random() - 0.5) * options.velocity * 0.1;
        }
    }

    getRandomColor() {
        const palette = this.colorPalettes[this.options.colorMode] || this.colorPalettes.rainbow;
        return palette[Math.floor(Math.random() * palette.length)];
    }

    attractParticlesToMouse() {
        this.particles.forEach(particle => {
            if (particle.life > 0) {
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) { // Attraction radius
                    const force = (100 - distance) / 100 * this.options.mouseInfluence;
                    particle.vx += (dx / distance) * force;
                    particle.vy += (dy / distance) * force;
                }
            }
        });
    }

    createClickEffect(x, y) {
        // Create burst of particles on click
        const burstCount = 15 + Math.random() * 10;

        for (let i = 0; i < burstCount; i++) {
            const angle = (i / burstCount) * Math.PI * 2;
            const speed = 2 + Math.random() * 4;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;

            this.spawnParticleAt(x, y, {
                vx: vx,
                vy: vy,
                size: this.options.particleSize * (1.5 + Math.random()),
                maxLife: 80 + Math.random() * 100,
                color: '#ffffff'
            });
        }

        // Screen shake effect
        this.createScreenShake();
    }

    createScrollEffect() {
        // Create particles moving upward during scroll
        const particleCount = 8;

        for (let i = 0; i < particleCount; i++) {
            const x = Math.random() * window.innerWidth;
            const y = window.innerHeight + 10;

            this.spawnParticleAt(x, y, {
                vx: (Math.random() - 0.5) * 2,
                vy: -(2 + Math.random() * 3),
                color: '#00ffff'
            });
        }
    }

    resetScrollEffect() {
        // Smooth transition back to normal
    }

    createKeyEffect(key) {
        if (key.length === 1 && key.match(/[a-zA-Z0-9]/)) {
            // Create letter-shaped particles
            const x = this.mouse.x + (Math.random() - 0.5) * 100;
            const y = this.mouse.y + (Math.random() - 0.5) * 100;

            this.spawnParticleAt(x, y, {
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                size: this.options.particleSize * 2,
                maxLife: 120,
                color: '#ff6b6b'
            });
        }
    }

    createScreenShake() {
        // Subtle screen shake effect
        const originalTransform = this.canvas.style.transform;
        const shakeIntensity = 2;

        const shake = () => {
            const x = (Math.random() - 0.5) * shakeIntensity;
            const y = (Math.random() - 0.5) * shakeIntensity;
            this.canvas.style.transform = `translate(${x}px, ${y}px)`;
        };

        // Shake for 200ms
        const shakeInterval = setInterval(shake, 16);
        setTimeout(() => {
            clearInterval(shakeInterval);
            this.canvas.style.transform = originalTransform;
        }, 200);
    }

    startAnimation() {
        if (this.animationId) return;

        this.isActive = true;

        const animate = () => {
            if (!this.isActive) return;

            this.update();
            this.render();

            this.animationId = requestAnimationFrame(animate);
        };

        animate();
    }

    stopAnimation() {
        this.isActive = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    update() {
        // Update physics
        if (this.options.enablePhysics) {
            this.physicsEngine.update(this.particles);
        }

        // Update particles
        this.particles.forEach(particle => {
            particle.update();

            // Apply custom physics
            particle.vx *= this.options.friction;
            particle.vy *= this.options.friction;

            // Apply gravity
            particle.vy += this.options.gravity * 0.1;

            // Boundary checks
            if (particle.x < 0 || particle.x > window.innerWidth) {
                particle.vx *= -0.8;
                particle.x = Math.max(0, Math.min(window.innerWidth, particle.x));
            }

            if (particle.y < 0 || particle.y > window.innerHeight) {
                particle.vy *= -0.8;
                particle.y = Math.max(0, Math.min(window.innerHeight, particle.y));
            }
        });

        // Remove dead particles
        this.particles = this.particles.filter(particle => particle.life > 0);
    }

    render() {
        // Clear canvas with trail effect
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

        // Draw trail
        if (this.trailPoints.length > 1) {
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            this.ctx.lineWidth = 2;
            this.ctx.lineCap = 'round';
            this.ctx.lineJoin = 'round';
            this.ctx.beginPath();

            this.trailPoints.forEach((point, index) => {
                const alpha = (Date.now() - point.timestamp) / 1000;
                if (alpha < 1) {
                    if (index === 0) {
                        this.ctx.moveTo(point.x, point.y);
                    } else {
                        this.ctx.lineTo(point.x, point.y);
                    }
                }
            });

            this.ctx.stroke();
        }

        // Draw particles
        this.particles.forEach(particle => {
            particle.render(this.ctx);
        });

        // Apply bloom effect if enabled
        if (this.options.enableBloom) {
            this.applyBloomEffect();
        }
    }

    applyBloomEffect() {
        // Simple bloom simulation using canvas compositing
        this.ctx.globalCompositeOperation = 'screen';
        this.ctx.globalAlpha = 0.3;

        // Draw particles again with glow
        this.particles.forEach(particle => {
            const glowSize = particle.size * 3;
            const gradient = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, glowSize
            );

            const color = particle.color;
            gradient.addColorStop(0, color);
            gradient.addColorStop(0.5, color.replace('rgb', 'rgba').replace(')', ', 0.5)'));
            gradient.addColorStop(1, color.replace('rgb', 'rgba').replace(')', ', 0)'));

            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, glowSize, 0, Math.PI * 2);
            this.ctx.fill();
        });

        // Reset compositing
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.globalAlpha = 1;
    }

    setColorMode(mode) {
        if (this.colorPalettes[mode]) {
            this.options.colorMode = mode;
            // Update existing particles
            this.particles.forEach((particle, index) => {
                particle.color = this.getParticleColor(index);
            });
        }
    }

    setParticleCount(count) {
        this.options.particleCount = count;
        // Adjust particle array size
        if (count > this.particles.length) {
            // Add more particles
            const toAdd = count - this.particles.length;
            for (let i = 0; i < toAdd; i++) {
                const particle = new TrailParticle({
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    vx: (Math.random() - 0.5) * 2,
                    vy: (Math.random() - 0.5) * 2,
                    size: this.options.particleSize + Math.random() * 2,
                    life: 0,
                    maxLife: 100 + Math.random() * 200,
                    color: this.getParticleColor(this.particles.length + i),
                    shape: this.options.particleShape,
                    physics: this.options.enablePhysics
                });
                this.particles.push(particle);
            }
        } else if (count < this.particles.length) {
            // Remove excess particles
            this.particles = this.particles.slice(0, count);
        }
    }

    destroy() {
        this.stopAnimation();
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        console.log('🗑️ Cursor Trail destroyed');
    }
}

class TrailParticle {
    constructor(options) {
        this.x = options.x || 0;
        this.y = options.y || 0;
        this.vx = options.vx || 0;
        this.vy = options.vy || 0;
        this.size = options.size || 3;
        this.life = options.life || 0;
        this.maxLife = options.maxLife || 100;
        this.color = options.color || '#ffffff';
        this.shape = options.shape || 'circle';
        this.physics = options.physics !== false;

        // Physics properties
        this.mass = this.size * 0.1;
        this.bounce = 0.8;
        this.friction = 0.98;

        // Visual properties
        this.rotation = 0;
        this.rotationSpeed = (Math.random() - 0.5) * 0.2;
        this.scale = 1;
        this.alpha = 1;
    }

    reset(x, y, options = {}) {
        this.x = x;
        this.y = y;
        this.vx = options.vx || (Math.random() - 0.5) * 4;
        this.vy = options.vy || (Math.random() - 0.5) * 4;
        this.life = 1;
        this.maxLife = options.maxLife || 60 + Math.random() * 120;
        this.size = options.size || 3 + Math.random() * 2;
        this.color = options.color || '#ffffff';
        this.rotation = 0;
        this.scale = 1;
        this.alpha = 1;
    }

    update() {
        if (this.life <= 0) return;

        // Update position
        this.x += this.vx;
        this.y += this.vy;

        // Update rotation
        this.rotation += this.rotationSpeed;

        // Update life and visual properties
        this.life++;
        const lifeRatio = this.life / this.maxLife;

        // Fade out effect
        this.alpha = Math.max(0, 1 - lifeRatio);

        // Scale effect (particles grow and shrink)
        this.scale = Math.sin(lifeRatio * Math.PI) * 0.5 + 0.8;

        // Color transition (if multiple colors)
        if (lifeRatio > 0.8) {
            this.alpha *= (1 - lifeRatio) / 0.2;
        }

        // Reset if dead
        if (this.life >= this.maxLife) {
            this.life = 0;
        }
    }

    render(ctx) {
        if (this.life <= 0 || this.alpha <= 0) return;

        ctx.save();

        // Apply transformations
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.scale(this.scale, this.scale);
        ctx.globalAlpha = this.alpha;

        // Set color
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1;

        // Draw based on shape
        switch (this.shape) {
            case 'square':
                ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
                break;

            case 'triangle':
                ctx.beginPath();
                ctx.moveTo(0, -this.size / 2);
                ctx.lineTo(-this.size / 2, this.size / 2);
                ctx.lineTo(this.size / 2, this.size / 2);
                ctx.closePath();
                ctx.fill();
                break;

            case 'star':
                this.drawStar(ctx, 0, 0, 5, this.size / 2, this.size / 4);
                ctx.fill();
                break;

            case 'circle':
            default:
                ctx.beginPath();
                ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
                ctx.fill();
                break;
        }

        // Add glow effect
        if (this.size > 5) {
            ctx.shadowColor = this.color;
            ctx.shadowBlur = this.size * 0.5;
            ctx.fill();
            ctx.shadowBlur = 0;
        }

        ctx.restore();
    }

    drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        const step = Math.PI / spikes;

        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);

        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }

        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
    }
}

class ParticlePhysics {
    constructor() {
        this.gravity = 0.1;
        this.wind = 0;
        this.airResistance = 0.99;
    }

    update(particles) {
        particles.forEach((particle, index) => {
            if (!particle.physics || particle.life <= 0) return;

            // Apply gravity
            particle.vy += this.gravity;

            // Apply wind
            particle.vx += this.wind;

            // Apply air resistance
            particle.vx *= this.airResistance;
            particle.vy *= this.airResistance;

            // Check collisions with other particles
            for (let j = index + 1; j < particles.length; j++) {
                const other = particles[j];
                if (other.physics && other.life > 0) {
                    this.handleCollision(particle, other);
                }
            }
        });
    }

    handleCollision(p1, p2) {
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDistance = (p1.size + p2.size) / 2;

        if (distance < minDistance && distance > 0) {
            // Separate particles
            const overlap = minDistance - distance;
            const separationX = (dx / distance) * overlap * 0.5;
            const separationY = (dy / distance) * overlap * 0.5;

            p1.x -= separationX;
            p1.y -= separationY;
            p2.x += separationX;
            p2.y += separationY;

            // Exchange velocities (simplified collision)
            const tempVx = p1.vx;
            const tempVy = p1.vy;
            p1.vx = p2.vx * p1.bounce;
            p1.vy = p2.vy * p1.bounce;
            p2.vx = tempVx * p2.bounce;
            p2.vy = tempVy * p2.bounce;
        }
    }
}

// Auto-initialization
document.addEventListener('DOMContentLoaded', () => {
    // Create global cursor trail instance
    window.cursorTrail = new CursorTrail({
        particleCount: 80,
        colorMode: 'neon',
        enablePhysics: true,
        enableBloom: true,
        enableMouseAttraction: true
    });

    // Add keyboard controls for demo
    document.addEventListener('keydown', (e) => {
        switch (e.key.toLowerCase()) {
            case '1':
                window.cursorTrail.setColorMode('rainbow');
                break;
            case '2':
                window.cursorTrail.setColorMode('neon');
                break;
            case '3':
                window.cursorTrail.setColorMode('fire');
                break;
            case '4':
                window.cursorTrail.setColorMode('ocean');
                break;
            case '5':
                window.cursorTrail.setColorMode('matrix');
                break;
            case 'p':
                window.cursorTrail.options.enablePhysics = !window.cursorTrail.options.enablePhysics;
                break;
            case 'b':
                window.cursorTrail.options.enableBloom = !window.cursorTrail.options.enableBloom;
                break;
            case 'm':
                window.cursorTrail.options.enableMouseAttraction = !window.cursorTrail.options.enableMouseAttraction;
                break;
        }
    });

    console.log('🎨 Cursor Trail Active! Press 1-5 for colors, P for physics, B for bloom, M for mouse attraction');
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CursorTrail;
}