// GetNexo UI Features - Performance Optimized
(function () {
    // 1. Command Palette
    const palette = document.getElementById('command-palette');
    const searchInput = document.getElementById('palette-search');
    if (palette && searchInput) {
        const items = palette.querySelectorAll('.palette-item');
        let activeIndex = -1;

        // Voice Recognition
        let recognition = null;
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognition = new SpeechRecognition();
            recognition.lang = 'pt-BR';
            recognition.continuous = false;
            recognition.interimResults = false;

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                searchInput.value = transcript;
                searchInput.dispatchEvent(new Event('input'));
                // Auto-select first matching item
                setTimeout(() => {
                    const items = palette.querySelectorAll('.palette-item');
                    if (items.length > 0) {
                        activeIndex = 0;
                        updateActiveItem();
                    }
                }, 100);
            };

            recognition.onerror = (event) => {
                console.log('Speech recognition error:', event.error);
            };
        }

        const openPalette = () => {
            palette.style.display = 'flex';
            searchInput.focus();
            activeIndex = -1;
        };

        const closePalette = () => {
            palette.style.display = 'none';
            searchInput.value = '';
            if (recognition && recognition.continuous) {
                recognition.stop();
            }
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

    // Microinterações visuais aprimoradas
    document.querySelectorAll('a, button, .btn-start, .btn-login, .nav-links a, .support-btn, .control-btn').forEach(el => {
        el.addEventListener('mouseenter', () => {
            playSound(1200, 0.05);
            el.style.transform = el.classList.contains('btn-start') ? 'translateY(-3px) scale(1.02)' : 'scale(1.05)';
            el.style.boxShadow = el.classList.contains('btn-start') ? '0 8px 25px rgba(0, 212, 255, 0.4)' : '';
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = '';
            el.style.boxShadow = '';
        });

        el.addEventListener('mousedown', () => {
            playSound(800, 0.2);
            el.style.transform = el.classList.contains('btn-start') ? 'translateY(-1px) scale(0.98)' : 'scale(0.95)';
            el.style.transition = 'transform 0.1s ease, box-shadow 0.1s ease';
        });

        el.addEventListener('mouseup', () => {
            el.style.transform = el.classList.contains('btn-start') ? 'translateY(-3px) scale(1.02)' : 'scale(1.05)';
        });

        el.addEventListener('click', () => {
            // Ripple effect
            const ripple = document.createElement('div');
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255,255,255,0.6)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s linear';
            ripple.style.left = '50%';
            ripple.style.top = '50%';
            ripple.style.width = '20px';
            ripple.style.height = '20px';
            ripple.style.marginLeft = '-10px';
            ripple.style.marginTop = '-10px';
            ripple.style.pointerEvents = 'none';
            ripple.style.zIndex = '1';

            el.style.position = 'relative';
            el.style.overflow = 'hidden';
            el.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Adicionar keyframes do ripple se não existir
    if (!document.getElementById('ripple-keyframes')) {
        const style = document.createElement('style');
        style.id = 'ripple-keyframes';
        style.textContent = `
            @keyframes ripple {
                to { transform: scale(4); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

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

    // 5. Neural Background Controls
    const neuralControls = document.getElementById('neural-controls');
    const toggleNeural = document.getElementById('toggle-neural');
    const speedSlider = document.getElementById('speed-slider');
    const speedValue = document.getElementById('speed-value');
    const themeSelect = document.getElementById('theme-select');
    const pauseBtn = document.getElementById('pause-neural');

    let controlsVisible = false;

    if (toggleNeural) {
        toggleNeural.addEventListener('click', () => {
            controlsVisible = !controlsVisible;
            neuralControls.style.display = controlsVisible ? 'flex' : 'none';
            toggleNeural.innerHTML = controlsVisible ? '<span class="icon">✕</span>' : '<span class="icon">🧠</span>';
            toggleNeural.title = controlsVisible ? 'Ocultar Controles' : 'Mostrar Controles';
        });
    }

    if (speedSlider && window.neuralBG) {
        speedSlider.addEventListener('input', (e) => {
            const speed = parseFloat(e.target.value);
            window.neuralBG.setSpeed(speed);
            speedValue.textContent = speed.toFixed(1) + 'x';
        });
    }

    if (themeSelect && window.neuralBG) {
        themeSelect.addEventListener('change', (e) => {
            window.neuralBG.setTheme(e.target.value);
        });
    }

    if (pauseBtn && window.neuralBG) {
        pauseBtn.addEventListener('click', () => {
            window.neuralBG.pause();
            pauseBtn.innerHTML = window.neuralBG.isPaused ? '▶️ Retomar' : '⏸️ Pausar';
        });
    }

    // Show controls on hover over the toggle button area
    if (neuralControls) {
        let hideTimeout;
        neuralControls.addEventListener('mouseenter', () => {
            if (hideTimeout) clearTimeout(hideTimeout);
        });
        neuralControls.addEventListener('mouseleave', () => {
            if (controlsVisible) {
                hideTimeout = setTimeout(() => {
                    controlsVisible = false;
                    neuralControls.style.display = 'none';
                    toggleNeural.innerHTML = '<span class="icon">🧠</span>';
                }, 2000);
            }
        });
    }

    // 7. Language Selector
    const langBtn = document.getElementById('lang-btn');
    const langDropdown = document.getElementById('lang-dropdown');
    const currentLangFlag = document.getElementById('current-lang-flag');
    const currentLangCode = document.getElementById('current-lang-code');

    function updateLangButton(lang) {
        const langs = window.I18n ? window.I18n.getAvailableLanguages() : [
            { code: 'pt-BR', name: 'Português (Brasil)', flag: '🇧🇷' },
            { code: 'en', name: 'English', flag: '🇺🇸' }
        ];
        const current = langs.find(l => l.code === lang);
        if (current && currentLangFlag && currentLangCode) {
            currentLangFlag.textContent = current.flag;
            currentLangCode.textContent = current.code.split('-')[0].toUpperCase();
        }
    }

    if (langBtn && langDropdown) {
        langBtn.addEventListener('click', (e) => {
            e.preventDefault();
            langDropdown.classList.toggle('show');
        });

        document.addEventListener('click', (e) => {
            if (!langBtn.contains(e.target) && !langDropdown.contains(e.target)) {
                langDropdown.classList.remove('show');
            }
        });

        langDropdown.addEventListener('click', (e) => {
            e.preventDefault();
            const option = e.target.closest('.lang-option');
            if (option) {
                const lang = option.getAttribute('data-lang');
                if (window.I18n && lang) {
                    window.I18n.setLanguage(lang);
                    updateLangButton(lang);
                }
                langDropdown.classList.remove('show');
            }
        });
    }

    // Initialize language button
    if (window.I18n) {
        updateLangButton(window.I18n.getCurrentLanguage());
        window.addEventListener('languageChanged', (e) => {
            updateLangButton(e.detail.lang);
        });
    }

    // 6. Transitions
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
