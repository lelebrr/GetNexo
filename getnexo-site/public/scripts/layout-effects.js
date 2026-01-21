
// Neural Particle System
(function () {
    const canvas = document.getElementById('neural-bg');
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let particles = [];
    let mouse = { x: null, y: null, radius: 150 };

    function initNeural() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        particles = [];
        const density = (canvas.width * canvas.height) / 15000;
        for (let i = 0; i < density; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 0.5,
                speedX: Math.random() * 0.4 - 0.2,
                speedY: Math.random() * 0.4 - 0.2,
                color: 'rgba(0, 212, 255, 0.2)'
            });
        }
    }

    function animateNeural() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p, i) => {
            p.x += p.speedX; p.y += p.speedY;
            if (p.x > canvas.width || p.x < 0) p.speedX *= -1;
            if (p.y > canvas.height || p.y < 0) p.speedY *= -1;

            if (mouse.x) {
                let dx = mouse.x - p.x;
                let dy = mouse.y - p.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    let force = (mouse.radius - dist) / mouse.radius;
                    p.x -= dx * force * 0.01;
                    p.y -= dy * force * 0.01;
                }
            }

            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();

            for (let j = i + 1; j < particles.length; j++) {
                let p2 = particles[j];
                let dx = p.x - p2.x;
                let dy = p.y - p2.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100) {
                    ctx.strokeStyle = `rgba(0, 255, 157, ${0.1 * (1 - dist / 100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
                }
            }
        });
        requestAnimationFrame(animateNeural);
    }

    window.addEventListener('mousemove', e => { mouse.x = e.x; mouse.y = e.y; });
    window.addEventListener('resize', initNeural);
    initNeural(); animateNeural();

    // Command Palette Logic
    const palette = document.getElementById('command-palette');
    const searchInput = document.getElementById('palette-search');
    const items = document.querySelectorAll('.palette-item');
    const qaBox = document.getElementById('palette-quick-answer');
    const qaText = document.getElementById('qa-text');

    if (palette && searchInput) {
        let activeIndex = -1;

        function openPalette() {
            palette.style.display = 'flex';
            searchInput.focus();
            activeIndex = -1;
        }

        function closePalette() {
            palette.style.display = 'none';
            searchInput.value = '';
            qaBox.style.display = 'none';
        }

        window.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                palette.style.display === 'none' ? openPalette() : closePalette();
            }

            if (palette.style.display === 'flex') {
                if (e.key === 'Escape') closePalette();

                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    activeIndex = (activeIndex + 1) % items.length;
                    updateActiveItem();
                }
                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    activeIndex = (activeIndex - 1 + items.length) % items.length;
                    updateActiveItem();
                }
                if (e.key === 'Enter' && activeIndex > -1) {
                    items[activeIndex].click();
                }
            }
        });

        function updateActiveItem() {
            items.forEach((item, idx) => {
                item.classList.toggle('active', idx === activeIndex);
                if (idx === activeIndex) item.scrollIntoView({ block: 'nearest' });
            });
        }

        palette.addEventListener('click', (e) => {
            if (e.target === palette) closePalette();
        });

        // Quick Answer Search
        const context = {
            'pix': 'O GetNexo suporta PIX nativo no WhatsApp. O bot gera o QRC ou Copia e Cola instantaneamente e valida o pagamento via Webhook.',
            'ia': 'Usamos IA Generativa (Gemini/Llama) treinada com seus dados para responder leads de forma humanizada e estratégica 24/7.',
            'contato': 'Você pode falar com nosso suporte via Command + K -> "Fale com o Time" ou direto pelo ícone do WhatsApp.',
            'preço': 'O plano Self-Hosted é Grátis. O plano Pro (Nuvem Gerenciada) custa R$ 97/mês com toda a infra inclusa.'
        };

        searchInput.addEventListener('input', (e) => {
            const q = e.target.value.toLowerCase().trim();

            // Filter list
            items.forEach(item => {
                const text = item.textContent.toLowerCase();
                item.style.display = text.includes(q) ? 'flex' : 'none';
            });

            // Quick Answer
            let matched = false;
            for (const key in context) {
                if (q.includes(key)) {
                    qaText.innerText = context[key];
                    qaBox.style.display = 'block';
                    matched = true;
                    break;
                }
            }
            if (!matched) qaBox.style.display = 'none';
        });
    }

    // Live Pulse Engine
    const pulseToast = document.getElementById('live-pulse');
    const pulseMsg = document.getElementById('pulse-message');
    const activities = [
        "Nexus acaba de processar um lead em São Paulo.",
        "Novo bot GetNexo ativado em Curitiba.",
        "Recuperação de carrinho de R$ 450 confirmada via WhatsApp.",
        "Cliente VIP conectado ao suporte multi-agente.",
        "Checkout PIX gerado com sucesso para 'Loja Tech'."
    ];

    if (pulseToast && pulseMsg) {
        function showPulse() {
            if (localStorage.getItem('omnichat_token')) return;
            const msg = activities[Math.floor(Math.random() * activities.length)];
            pulseMsg.innerText = msg;
            pulseToast.style.display = 'flex';
            setTimeout(() => {
                pulseToast.style.animation = 'toastSlideIn 0.5s reverse forwards';
                setTimeout(() => {
                    pulseToast.style.display = 'none';
                    pulseToast.style.animation = 'toastSlideIn 0.5s forwards';
                }, 500);
            }, 4000);
        }
        if (!localStorage.getItem('omnichat_token')) {
            setInterval(showPulse, 12000);
        }
    }

    // Haptic UI Soundscape
    const playSound = (freq = 440, duration = 0.1) => {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            oscillator.frequency.value = freq;
            gainNode.gain.setValueAtTime(0.02, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + duration);
        } catch (e) { }
    };

    document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseenter', () => playSound(1200, 0.05));
        el.addEventListener('click', () => playSound(800, 0.2));
    });

    // Page Transition Effect
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link && link.origin === window.location.origin && !link.target) {
            const href = link.getAttribute('href');
            if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
                document.body.style.opacity = '0.5';
                document.body.style.transition = '0.2s';
            }
        }
    });

    // Fix Rocket Loader preload warning
    document.addEventListener('DOMContentLoaded', () => {
        const scripts = document.querySelectorAll('script[src*="_astro/hoisted"]');
        scripts.forEach(s => s.crossOrigin = 'anonymous');
    });

    // Performance Optimizer for Low-Power Devices
    class PerformanceOptimizer {
        constructor() { this.init(); }
        async init() {
            if ('getBattery' in navigator) {
                try {
                    const b = await navigator.getBattery();
                    this.handle(b);
                    b.addEventListener('levelchange', () => this.handle(b));
                    b.addEventListener('chargingchange', () => this.handle(b));
                } catch (e) { }
            }
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                this.reduce();
            }
        }
        handle(b) {
            if (b.level < 0.2 && !b.charging) {
                document.documentElement.classList.add('low-battery');
                window.lowPower = true;
            } else {
                document.documentElement.classList.remove('low-battery');
                window.lowPower = false;
            }
        }
        reduce() {
            const s = document.createElement('style');
            s.textContent = `* { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } .animated-bg { display: none !important; }`;
            document.head.appendChild(s);
        }
    }
    new PerformanceOptimizer();

})();
