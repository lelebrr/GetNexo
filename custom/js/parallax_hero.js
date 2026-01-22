/**
 * GetNexo Parallax Hero - Sistema de Profundidade Dinâmica Avançada
 * Hero section com física de fluidos, camadas de profundidade e interações imersivas
 */

class ParallaxHero {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = {
            layers: 5,
            depthMultiplier: 0.3,
            fluidPhysics: true,
            particleDensity: 0.0002,
            waveAmplitude: 50,
            waveFrequency: 0.002,
            interactionRadius: 150,
            mouseInfluence: 0.8,
            autoAnimation: true,
            colorScheme: 'ocean',
            enableBloom: true,
            enableReflections: true,
            ...options
        };

        this.layers = [];
        this.particles = [];
        this.mouse = { x: 0, y: 0, vx: 0, vy: 0 };
        this.time = 0;
        this.fluidField = null;
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;

        this.colorSchemes = {
            ocean: {
                background: ['#001122', '#003366', '#0066aa', '#0099cc', '#00ccff'],
                particles: ['#00ffff', '#0080ff', '#004080', '#00ff80'],
                accents: ['#ffffff', '#ff6b6b', '#4ecdc4']
            },
            sunset: {
                background: ['#2c1810', '#5d2a1b', '#8b3a2a', '#c4492d', '#ff6b35'],
                particles: ['#ff8c42', '#ff5722', '#ff3d00', '#ffeb3b'],
                accents: ['#ffffff', '#4fc3f7', '#81c784']
            },
            nebula: {
                background: ['#0a0a0a', '#1a0033', '#330066', '#6600cc', '#9900ff'],
                particles: ['#ff00ff', '#00ffff', '#ffff00', '#ff6600'],
                accents: ['#ffffff', '#00ff00', '#ff0000']
            },
            forest: {
                background: ['#0d1b0d', '#1a2f1a', '#2d501a', '#4a7c2d', '#6bb33f'],
                particles: ['#90ee90', '#32cd32', '#228b22', '#ffffe0'],
                accents: ['#ffffff', '#daa520', '#cd853f']
            }
        };

        this.init();
    }

    init() {
        this.createCanvas();
        this.createLayers();
        this.setupFluidPhysics();
        this.createParticles();
        this.setupEventListeners();
        this.startAnimation();

        console.log('🌊 Parallax Hero initialized with fluid dynamics');
    }

    createCanvas() {
        // Create main canvas for advanced effects
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'parallax-hero-canvas';
        this.canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
            mix-blend-mode: multiply;
        `;

        this.ctx = this.canvas.getContext('2d', {
            alpha: true,
            desynchronized: true
        });

        this.resizeCanvas();
        this.container.appendChild(this.canvas);

        // Resize handler
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = this.container.offsetWidth * dpr;
        this.canvas.height = this.container.offsetHeight * dpr;
        this.canvas.style.width = this.container.offsetWidth + 'px';
        this.canvas.style.height = this.container.offsetHeight + 'px';
        this.ctx.scale(dpr, dpr);

        // Recreate fluid field on resize
        if (this.options.fluidPhysics) {
            this.setupFluidPhysics();
        }
    }

    createLayers() {
        const colors = this.colorSchemes[this.options.colorScheme].background;

        for (let i = 0; i < this.options.layers; i++) {
            const layer = document.createElement('div');
            layer.className = 'parallax-layer';
            layer.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(
                    ${45 + i * 15}deg,
                    ${colors[i % colors.length]},
                    ${colors[(i + 1) % colors.length]}
                );
                opacity: ${0.1 + i * 0.15};
                transform-style: preserve-3d;
                z-index: ${-i};
            `;

            // Add subtle animation
            layer.style.animation = `float${i} ${3 + i * 0.5}s ease-in-out infinite alternate`;

            // Create CSS keyframes for each layer
            if (!document.querySelector(`#float${i}-keyframes`)) {
                const keyframes = document.createElement('style');
                keyframes.id = `float${i}-keyframes`;
                keyframes.textContent = `
                    @keyframes float${i} {
                        0% { transform: translateY(0px) rotate(${i * 2}deg); }
                        100% { transform: translateY(${-10 - i * 5}px) rotate(${i * 2 + 5}deg); }
                    }
                `;
                document.head.appendChild(keyframes);
            }

            this.layers.push({
                element: layer,
                depth: i + 1,
                baseTransform: {
                    x: 0,
                    y: 0,
                    rotation: i * 2,
                    scale: 1
                }
            });

            this.container.appendChild(layer);
        }
    }

    setupFluidPhysics() {
        if (!this.options.fluidPhysics) return;

        const width = this.container.offsetWidth;
        const height = this.container.offsetHeight;

        // Create fluid simulation grid
        this.fluidField = {
            width: Math.floor(width / 20),
            height: Math.floor(height / 20),
            cells: [],
            velocities: []
        };

        // Initialize fluid cells
        for (let y = 0; y < this.fluidField.height; y++) {
            for (let x = 0; x < this.fluidField.width; x++) {
                this.fluidField.cells.push({
                    x: x * 20,
                    y: y * 20,
                    density: Math.random() * 0.5,
                    velocity: { x: 0, y: 0 },
                    pressure: 0
                });
            }
        }

        console.log(`🌊 Fluid physics initialized: ${this.fluidField.cells.length} cells`);
    }

    createParticles() {
        const particleCount = Math.floor(
            this.container.offsetWidth * this.container.offsetHeight * this.options.particleDensity
        );

        console.log(`✨ Creating ${particleCount} particles`);

        for (let i = 0; i < particleCount; i++) {
            const particle = new FluidParticle({
                x: Math.random() * this.container.offsetWidth,
                y: Math.random() * this.container.offsetHeight,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: Math.random() * 3 + 1,
                color: this.getRandomParticleColor(),
                life: Math.random() * 1000 + 500,
                maxLife: Math.random() * 1000 + 500,
                type: Math.random() < 0.7 ? 'fluid' : 'sparkle'
            });

            this.particles.push(particle);
        }
    }

    getRandomParticleColor() {
        const colors = this.colorSchemes[this.options.colorScheme].particles;
        return colors[Math.floor(Math.random() * colors.length)];
    }

    setupEventListeners() {
        // Mouse movement for parallax and fluid interaction
        this.container.addEventListener('mousemove', (e) => {
            const rect = this.container.getBoundingClientRect();
            const prevX = this.mouse.x;
            const prevY = this.mouse.y;

            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;

            // Calculate mouse velocity for fluid interaction
            this.mouse.vx = this.mouse.x - prevX;
            this.mouse.vy = this.mouse.y - prevY;

            // Apply parallax to layers
            this.updateParallax();

            // Interact with fluid field
            if (this.options.fluidPhysics) {
                this.interactWithFluid();
            }
        });

        // Mouse click creates ripple effects
        this.container.addEventListener('click', (e) => {
            this.createRippleEffect(e.clientX - this.container.getBoundingClientRect().left,
                e.clientY - this.container.getBoundingClientRect().top);
        });

        // Scroll creates wave effects
        let scrollTimeout;
        document.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            this.createWaveEffect();
            scrollTimeout = setTimeout(() => {
                this.settleWaveEffect();
            }, 200);
        });

        // Touch events for mobile
        this.container.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = this.container.getBoundingClientRect();

            this.mouse.x = touch.clientX - rect.left;
            this.mouse.y = touch.clientY - rect.top;

            this.updateParallax();
        });

        // Keyboard interactions
        document.addEventListener('keydown', (e) => {
            switch (e.key.toLowerCase()) {
                case ' ':
                    e.preventDefault();
                    this.createExplosionEffect();
                    break;
                case 'c':
                    this.changeColorScheme();
                    break;
                case 'f':
                    this.toggleFluidPhysics();
                    break;
            }
        });

        // Auto animation timer
        if (this.options.autoAnimation) {
            setInterval(() => {
                this.createAutoEffect();
            }, 5000);
        }
    }

    updateParallax() {
        const centerX = this.container.offsetWidth / 2;
        const centerY = this.container.offsetHeight / 2;

        const deltaX = (this.mouse.x - centerX) / centerX;
        const deltaY = (this.mouse.y - centerY) / centerY;

        this.layers.forEach((layer, index) => {
            const depth = layer.depth;
            const moveX = deltaX * depth * this.options.depthMultiplier * 30;
            const moveY = deltaY * depth * this.options.depthMultiplier * 30;
            const rotate = deltaX * depth * 0.5;
            const scale = 1 + (depth * 0.01);

            layer.element.style.transform = `
                translate(${moveX}px, ${moveY}px)
                rotate(${rotate}deg)
                scale(${scale})
            `;
        });
    }

    interactWithFluid() {
        if (!this.fluidField) return;

        const mouseCellX = Math.floor(this.mouse.x / 20);
        const mouseCellY = Math.floor(this.mouse.y / 20);

        // Apply mouse influence to nearby cells
        for (let dy = -2; dy <= 2; dy++) {
            for (let dx = -2; dx <= 2; dx++) {
                const cellX = mouseCellX + dx;
                const cellY = mouseCellY + dy;

                if (cellX >= 0 && cellX < this.fluidField.width &&
                    cellY >= 0 && cellY < this.fluidField.height) {

                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance <= 2) {
                        const influence = (2 - distance) / 2 * this.options.mouseInfluence;
                        const cellIndex = cellY * this.fluidField.width + cellX;

                        // Apply velocity to fluid cell
                        this.fluidField.cells[cellIndex].velocity.x += this.mouse.vx * influence;
                        this.fluidField.cells[cellIndex].velocity.y += this.mouse.vy * influence;
                        this.fluidField.cells[cellIndex].density += influence * 0.5;
                    }
                }
            }
        }
    }

    createRippleEffect(x, y) {
        // Create expanding ripple in fluid field
        const rippleRadius = 50;
        const maxRadius = Math.max(this.container.offsetWidth, this.container.offsetHeight) / 2;

        const animateRipple = (radius) => {
            if (radius > maxRadius) return;

            if (this.fluidField) {
                const centerX = Math.floor(x / 20);
                const centerY = Math.floor(y / 20);
                const currentRadius = Math.floor(radius / 20);

                // Apply ripple effect to ring of cells
                for (let angle = 0; angle < Math.PI * 2; angle += 0.3) {
                    const cellX = centerX + Math.cos(angle) * currentRadius;
                    const cellY = centerY + Math.sin(angle) * currentRadius;

                    if (cellX >= 0 && cellX < this.fluidField.width &&
                        cellY >= 0 && cellY < this.fluidField.height) {

                        const cellIndex = Math.floor(cellY) * this.fluidField.width + Math.floor(cellX);
                        const cell = this.fluidField.cells[cellIndex];

                        // Apply outward velocity
                        const force = (maxRadius - radius) / maxRadius;
                        cell.velocity.x += Math.cos(angle) * force * 2;
                        cell.velocity.y += Math.sin(angle) * force * 2;
                        cell.density += force * 0.3;
                    }
                }
            }

            // Create particle burst
            if (radius < rippleRadius) {
                for (let i = 0; i < 5; i++) {
                    const angle = (i / 5) * Math.PI * 2;
                    const distance = radius + Math.random() * 20;

                    this.spawnParticleAt(
                        x + Math.cos(angle) * distance,
                        y + Math.sin(angle) * distance,
                        {
                            vx: Math.cos(angle) * 3,
                            vy: Math.sin(angle) * 3,
                            size: Math.random() * 4 + 2,
                            color: this.colorSchemes[this.options.colorScheme].accents[0],
                            life: 60
                        }
                    );
                }
            }

            setTimeout(() => animateRipple(radius + 5), 16);
        };

        animateRipple(0);
    }

    createWaveEffect() {
        if (!this.fluidField) return;

        const waveStrength = 2;
        const waveLength = 100;

        for (let i = 0; i < this.fluidField.cells.length; i++) {
            const cell = this.fluidField.cells[i];
            const waveOffset = Math.sin(cell.x / waveLength + this.time * 0.01) * waveStrength;

            cell.velocity.y += waveOffset;
            cell.density += Math.abs(waveOffset) * 0.1;
        }
    }

    settleWaveEffect() {
        // Gradually reduce wave effects
        if (this.fluidField) {
            this.fluidField.cells.forEach(cell => {
                cell.velocity.x *= 0.9;
                cell.velocity.y *= 0.9;
            });
        }
    }

    createExplosionEffect() {
        const centerX = this.container.offsetWidth / 2;
        const centerY = this.container.offsetHeight / 2;

        // Create explosion of particles
        for (let i = 0; i < 50; i++) {
            const angle = (i / 50) * Math.PI * 2;
            const speed = Math.random() * 8 + 4;
            const distance = Math.random() * 100 + 50;

            this.spawnParticleAt(
                centerX + Math.cos(angle) * distance,
                centerY + Math.sin(angle) * distance,
                {
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    size: Math.random() * 6 + 2,
                    color: this.getRandomParticleColor(),
                    life: 120 + Math.random() * 60
                }
            );
        }

        // Shake layers
        this.layers.forEach((layer, index) => {
            const shake = () => {
                const intensity = (5 - index) * 2;
                const x = (Math.random() - 0.5) * intensity;
                const y = (Math.random() - 0.5) * intensity;
                layer.element.style.transform += ` translate(${x}px, ${y}px)`;
            };

            const shakeInterval = setInterval(shake, 16);
            setTimeout(() => {
                clearInterval(shakeInterval);
                this.updateParallax(); // Reset to current parallax
            }, 500);
        });
    }

    changeColorScheme() {
        const schemes = Object.keys(this.colorSchemes);
        const currentIndex = schemes.indexOf(this.options.colorScheme);
        const nextIndex = (currentIndex + 1) % schemes.length;

        this.setColorScheme(schemes[nextIndex]);
    }

    setColorScheme(scheme) {
        if (!this.colorSchemes[scheme]) return;

        this.options.colorScheme = scheme;

        // Update layer backgrounds
        const colors = this.colorSchemes[scheme].background;
        this.layers.forEach((layer, index) => {
            layer.element.style.background = `linear-gradient(
                ${45 + index * 15}deg,
                ${colors[index % colors.length]},
                ${colors[(index + 1) % colors.length]}
            )`;
        });

        // Update particle colors
        this.particles.forEach(particle => {
            if (Math.random() < 0.3) { // 30% chance to change color
                particle.color = this.getRandomParticleColor();
            }
        });

        console.log(`🎨 Color scheme changed to: ${scheme}`);
    }

    toggleFluidPhysics() {
        this.options.fluidPhysics = !this.options.fluidPhysics;

        if (this.options.fluidPhysics) {
            this.setupFluidPhysics();
        } else {
            this.fluidField = null;
        }

        console.log(`🌊 Fluid physics: ${this.options.fluidPhysics ? 'enabled' : 'disabled'}`);
    }

    createAutoEffect() {
        // Random auto-generated effects
        const effects = ['ripple', 'wave', 'particle_burst'];
        const effect = effects[Math.floor(Math.random() * effects.length)];

        switch (effect) {
            case 'ripple':
                const x = Math.random() * this.container.offsetWidth;
                const y = Math.random() * this.container.offsetHeight;
                this.createRippleEffect(x, y);
                break;

            case 'wave':
                this.createWaveEffect();
                break;

            case 'particle_burst':
                const colors = this.colorSchemes[this.options.colorScheme].accents;
                for (let i = 0; i < 20; i++) {
                    this.spawnParticleAt(
                        Math.random() * this.container.offsetWidth,
                        Math.random() * this.container.offsetHeight,
                        {
                            vx: (Math.random() - 0.5) * 6,
                            vy: (Math.random() - 0.5) * 6,
                            color: colors[Math.floor(Math.random() * colors.length)],
                            life: 100 + Math.random() * 100
                        }
                    );
                }
                break;
        }
    }

    spawnParticleAt(x, y, options = {}) {
        const particle = new FluidParticle({
            x: x,
            y: y,
            vx: options.vx || (Math.random() - 0.5) * 4,
            vy: options.vy || (Math.random() - 0.5) * 4,
            size: options.size || Math.random() * 3 + 1,
            color: options.color || this.getRandomParticleColor(),
            life: options.life || Math.random() * 500 + 200,
            maxLife: options.life || Math.random() * 500 + 200,
            type: options.type || 'fluid'
        });

        this.particles.push(particle);
    }

    startAnimation() {
        if (this.animationId) return;

        const animate = () => {
            this.time += 0.016; // ~60fps
            this.update();
            this.render();
            this.animationId = requestAnimationFrame(animate);
        };

        animate();
    }

    update() {
        // Update fluid physics
        if (this.fluidField && this.options.fluidPhysics) {
            this.updateFluidField();
        }

        // Update particles
        this.particles.forEach(particle => {
            particle.update();

            // Apply fluid forces to particles
            if (this.fluidField && particle.type === 'fluid') {
                this.applyFluidForces(particle);
            }
        });

        // Remove dead particles
        this.particles = this.particles.filter(particle => particle.life > 0);
    }

    updateFluidField() {
        // Simple fluid simulation
        this.fluidField.cells.forEach(cell => {
            // Apply viscosity (damping)
            cell.velocity.x *= 0.99;
            cell.velocity.y *= 0.99;

            // Apply gravity
            cell.velocity.y += 0.01;

            // Update position
            cell.x += cell.velocity.x;
            cell.y += cell.velocity.y;

            // Boundary conditions
            if (cell.x < 0 || cell.x > this.container.offsetWidth) {
                cell.velocity.x *= -0.8;
                cell.x = Math.max(0, Math.min(this.container.offsetWidth, cell.x));
            }

            if (cell.y < 0 || cell.y > this.container.offsetHeight) {
                cell.velocity.y *= -0.8;
                cell.y = Math.max(0, Math.min(this.container.offsetHeight, cell.y));
            }

            // Density diffusion
            cell.density *= 0.995;
        });
    }

    applyFluidForces(particle) {
        if (!this.fluidField) return;

        const cellX = Math.floor(particle.x / 20);
        const cellY = Math.floor(particle.y / 20);

        if (cellX >= 0 && cellX < this.fluidField.width &&
            cellY >= 0 && cellY < this.fluidField.height) {

            const cellIndex = cellY * this.fluidField.width + cellX;
            const cell = this.fluidField.cells[cellIndex];

            // Apply fluid velocity to particle
            particle.vx += cell.velocity.x * 0.1;
            particle.vy += cell.velocity.y * 0.1;

            // Apply density-based forces
            if (cell.density > 0.3) {
                // High density areas create repulsive forces
                const dx = particle.x - cell.x;
                const dy = particle.y - cell.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance > 0) {
                    const force = cell.density * 0.5 / distance;
                    particle.vx += (dx / distance) * force;
                    particle.vy += (dy / distance) * force;
                }
            }
        }
    }

    render() {
        if (!this.ctx) return;

        // Clear canvas
        this.ctx.clearRect(0, 0, this.container.offsetWidth, this.container.offsetHeight);

        // Render fluid field
        if (this.fluidField && this.options.fluidPhysics) {
            this.renderFluidField();
        }

        // Render particles
        this.particles.forEach(particle => {
            particle.render(this.ctx);
        });

        // Apply bloom effect
        if (this.options.enableBloom) {
            this.applyBloomEffect();
        }
    }

    renderFluidField() {
        this.ctx.save();
        this.ctx.globalAlpha = 0.3;

        this.fluidField.cells.forEach(cell => {
            if (cell.density > 0.1) {
                const alpha = Math.min(cell.density * 0.5, 0.8);
                this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                this.ctx.fillRect(cell.x, cell.y, 20, 20);
            }
        });

        this.ctx.restore();
    }

    applyBloomEffect() {
        // Simple glow effect using canvas compositing
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'screen';
        this.ctx.globalAlpha = 0.5;

        // Draw particles again with glow
        this.particles.forEach(particle => {
            const glowSize = particle.size * 4;
            const gradient = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, glowSize
            );

            gradient.addColorStop(0, particle.color);
            gradient.addColorStop(0.7, particle.color.replace('rgb', 'rgba').replace(')', ', 0.3)'));
            gradient.addColorStop(1, particle.color.replace('rgb', 'rgba').replace(')', ', 0)'));

            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, glowSize, 0, Math.PI * 2);
            this.ctx.fill();
        });

        this.ctx.restore();
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }

        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }

        this.layers.forEach(layer => {
            if (layer.element && layer.element.parentNode) {
                layer.element.parentNode.removeChild(layer.element);
            }
        });

        console.log('🗑️ Parallax Hero destroyed');
    }
}

class FluidParticle {
    constructor(options) {
        this.x = options.x || 0;
        this.y = options.y || 0;
        this.vx = options.vx || 0;
        this.vy = options.vy || 0;
        this.size = options.size || 3;
        this.color = options.color || '#ffffff';
        this.life = options.life || 1000;
        this.maxLife = options.maxLife || 1000;
        this.type = options.type || 'fluid';

        // Physics properties
        this.mass = this.size * 0.1;
        this.friction = 0.98;
        this.bounce = 0.8;

        // Visual properties
        this.rotation = 0;
        this.rotationSpeed = (Math.random() - 0.5) * 0.1;
        this.scale = 1;
        this.alpha = 1;
        this.trail = [];
        this.maxTrailLength = 10;
    }

    update() {
        if (this.life <= 0) return;

        // Update position
        this.x += this.vx;
        this.y += this.vy;

        // Update trail
        this.trail.push({ x: this.x, y: this.y, alpha: this.alpha });
        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }

        // Apply physics
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += 0.05; // Gravity

        // Update rotation
        this.rotation += this.rotationSpeed;

        // Update life and visual properties
        this.life--;
        const lifeRatio = this.life / this.maxLife;

        // Fade out effect
        this.alpha = lifeRatio;

        // Size pulsing
        this.scale = 0.5 + Math.sin(lifeRatio * Math.PI) * 0.5;

        // Boundary checks (particles bounce off edges)
        const container = document.getElementById('parallax-hero-container');
        if (container) {
            const rect = container.getBoundingClientRect();

            if (this.x < 0 || this.x > rect.width) {
                this.vx *= -this.bounce;
                this.x = Math.max(0, Math.min(rect.width, this.x));
            }

            if (this.y < 0 || this.y > rect.height) {
                this.vy *= -this.bounce;
                this.y = Math.max(0, Math.min(rect.height, this.y));
            }
        }
    }

    render(ctx) {
        if (this.alpha <= 0) return;

        ctx.save();

        // Apply transformations
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.scale(this.scale, this.scale);
        ctx.globalAlpha = this.alpha;

        // Render trail
        if (this.trail.length > 1) {
            ctx.strokeStyle = this.color;
            ctx.lineWidth = this.size * 0.5;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.globalAlpha = this.alpha * 0.3;

            ctx.beginPath();
            this.trail.forEach((point, index) => {
                const trailAlpha = (index / this.trail.length) * this.alpha * 0.5;
                ctx.globalAlpha = trailAlpha;

                if (index === 0) {
                    ctx.moveTo(point.x - this.x, point.y - this.y);
                } else {
                    ctx.lineTo(point.x - this.x, point.y - this.y);
                }
            });
            ctx.stroke();
        }

        // Reset alpha for main particle
        ctx.globalAlpha = this.alpha;

        // Draw particle based on type
        switch (this.type) {
            case 'sparkle':
                this.drawSparkle(ctx);
                break;
            case 'fluid':
            default:
                this.drawFluidParticle(ctx);
                break;
        }

        ctx.restore();
    }

    drawFluidParticle(ctx) {
        // Draw main particle
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
        ctx.fill();

        // Add inner highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(-this.size * 0.2, -this.size * 0.2, this.size * 0.2, 0, Math.PI * 2);
        ctx.fill();
    }

    drawSparkle(ctx) {
        // Draw star-shaped sparkle
        ctx.fillStyle = this.color;
        ctx.beginPath();

        const spikes = 4;
        const outerRadius = this.size / 2;
        const innerRadius = outerRadius * 0.4;

        for (let i = 0; i < spikes * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (i * Math.PI) / spikes;

            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }

        ctx.closePath();
        ctx.fill();
    }
}

// Auto-initialization
document.addEventListener('DOMContentLoaded', () => {
    // Create global parallax hero instance
    window.parallaxHero = new ParallaxHero('parallax-hero-container', {
        layers: 6,
        fluidPhysics: true,
        particleDensity: 0.0003,
        colorScheme: 'ocean',
        enableBloom: true,
        enableReflections: true
    });

    // Add global controls
    window.changeHeroColor = (scheme) => {
        if (window.parallaxHero) {
            window.parallaxHero.setColorScheme(scheme);
        }
    };

    window.toggleHeroFluid = () => {
        if (window.parallaxHero) {
            window.parallaxHero.toggleFluidPhysics();
        }
    };

    // Demo keyboard controls
    document.addEventListener('keydown', (e) => {
        if (window.parallaxHero) {
            switch (e.key.toLowerCase()) {
                case '1':
                    window.changeHeroColor('ocean');
                    break;
                case '2':
                    window.changeHeroColor('sunset');
                    break;
                case '3':
                    window.changeHeroColor('nebula');
                    break;
                case '4':
                    window.changeHeroColor('forest');
                    break;
                case 'f':
                    window.toggleHeroFluid();
                    break;
                case 'e':
                    window.parallaxHero.createExplosionEffect();
                    break;
            }
        }
    });

    console.log('🌊 Parallax Hero Active! Press 1-4 for colors, F for fluid physics, E for explosion, or move mouse for parallax!');
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ParallaxHero;
}