// GetNexo UI Features - Performance Optimized
(function () {
    // 1. Command Palette
    const palette = document.getElementById('command-palette');
    const searchInput = document.getElementById('palette-search');
    if (palette && searchInput) {
        const items = palette.querySelectorAll('.palette-item');
        let activeIndex = -1;

        const openPalette = () => {
            palette.style.display = 'flex';
            searchInput.focus();
            activeIndex = -1;
        };

        const closePalette = () => {
            palette.style.display = 'none';
            searchInput.value = '';
        };

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

        const updateActiveItem = () => {
            items.forEach((item, idx) => {
                item.classList.toggle('active', idx === activeIndex);
                if (idx === activeIndex) {
                    requestAnimationFrame(() => {
                        item.scrollIntoView({ block: 'nearest' });
                    });
                }
            });
        };

        palette.addEventListener('click', (e) => {
            if (e.target === palette) closePalette();
        });
    }

    // 2. Live Pulse Engine
    const pulseToast = document.getElementById('live-pulse');
    const pulseMsg = document.getElementById('pulse-message');
    const activities = [
        "Nexus acaba de processar um lead em São Paulo.",
        "Novo bot GetNexo ativado em Curitiba.",
        "Recuperação de carrinho de R$ 450 confirmada via WhatsApp.",
        "Cliente VIP conectado ao suporte multi-agente.",
        "Checkout PIX gerado com sucesso para 'Loja Tech'."
    ];

    function showPulse() {
        if (localStorage.getItem('omnichat_token')) return;
        const msg = activities[Math.floor(Math.random() * activities.length)];
        if (pulseMsg) pulseMsg.innerText = msg;
        if (pulseToast) {
            pulseToast.style.display = 'flex';
            setTimeout(() => {
                pulseToast.style.animation = 'toastSlideIn 0.5s reverse forwards';
                setTimeout(() => {
                    pulseToast.style.display = 'none';
                    pulseToast.style.animation = 'toastSlideIn 0.5s forwards';
                }, 500);
            }, 4000);
        }
    }

    if (!localStorage.getItem('omnichat_token')) {
        setInterval(showPulse, 15000);
    }

    // 3. Haptic UI Soundscape
    const playSound = (freq = 440, duration = 0.1) => {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx.state === 'suspended') return;
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

    // 4. Contextual Search Logic
    const qaBox = document.getElementById('palette-quick-answer');
    const qaText = document.getElementById('qa-text');
    const context = {
        'pix': 'O GetNexo suporta PIX nativo no WhatsApp. O bot gera o QRC ou Copia e Cola instantaneamente e valida o pagamento via Webhook.',
        'ia': 'Usamos IA Generativa (Gemini/Llama) treinada com seus dados para responder leads de forma humanizada e estratégica 24/7.',
        'contato': 'Você pode falar com nosso suporte via Command + K -> "Fale com o Time" ou direto pelo ícone do WhatsApp.',
        'preço': 'O plano Self-Hosted é Grátis. O plano Pro (Nuvem Gerenciada) custa R$ 97/mês com toda a infra inclusa.'
    };

    searchInput?.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase().trim();
        let matched = false;
        for (const key in context) {
            if (q.includes(key)) {
                if (qaText) qaText.innerText = context[key];
                if (qaBox) qaBox.style.display = 'block';
                matched = true;
                break;
            }
        }
        if (!matched && qaBox) qaBox.style.display = 'none';
    });

    // 5. Transitions
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link && link.origin === window.location.origin && !link.target) {
            const href = link.getAttribute('href');
            if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
                document.body.style.opacity = '0.5';
                document.body.style.transition = '0.2s';
                // Restore opacity after navigation
                setTimeout(() => {
                    document.body.style.opacity = '1';
                }, 200);
            }
        }
    });
})();
