// GetNexo Accessibility Manager - Performance Optimized
(function () {
    class AccessibilityManager {
        constructor() {
            this.state = {
                elderlyMode: false,
                cognitiveMode: false,
                highContrast: false,
                largeFont: false,
                zoomMode: false,
                reducedMotion: false
            };
            this.init();
        }

        init() {
            this.loadState();
            this.bindEvents();
            this.applyState();
        }

        loadState() {
            const saved = localStorage.getItem('nexo-a11y-settings');
            if (saved) {
                this.state = { ...this.state, ...JSON.parse(saved) };
                this.syncCheckboxes();
            }
        }

        saveState() {
            localStorage.setItem('nexo-a11y-settings', JSON.stringify(this.state));
        }

        syncCheckboxes() {
            const fields = ['elderly-mode', 'cognitive-mode', 'high-contrast', 'large-font', 'zoom-mode', 'reduced-motion'];
            fields.forEach(id => {
                const el = document.getElementById(id);
                const slider = el?.nextElementSibling;
                const stateKey = id.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
                if (el) el.checked = this.state[stateKey];
                if (slider) slider.setAttribute('aria-checked', this.state[stateKey].toString());
            });
        }

        bindEvents() {
            const toggleBtn = document.getElementById('a11y-toggle');
            const menu = document.getElementById('a11y-menu');
            const closeBtn = document.getElementById('a11y-close');

            const toggleMenu = (show) => {
                if (!menu || !toggleBtn) return;
                if (show) {
                    menu.classList.remove('hidden');
                    toggleBtn.setAttribute('aria-expanded', 'true');
                    menu.querySelector('button, input')?.focus();
                } else {
                    menu.classList.add('hidden');
                    toggleBtn.setAttribute('aria-expanded', 'false');
                    toggleBtn.focus();
                }
            };

            toggleBtn?.addEventListener('click', () => toggleMenu(menu?.classList.contains('hidden')));
            closeBtn?.addEventListener('click', () => toggleMenu(false));

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && menu && !menu.classList.contains('hidden')) {
                    toggleMenu(false);
                }
            });

            ['elderly-mode', 'cognitive-mode', 'high-contrast', 'large-font', 'zoom-mode', 'reduced-motion'].forEach(id => {
                document.getElementById(id)?.addEventListener('change', (e) => {
                    const stateKey = id.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
                    this.toggleMode(stateKey, e.target.checked);
                });
            });

            document.getElementById('btn-a11y-chat')?.addEventListener('click', () => this.toggleChat());
            document.getElementById('btn-a11y-voice')?.addEventListener('click', () => this.startVoice());
            document.getElementById('a11y-reset')?.addEventListener('click', () => this.reset());
        }

        toggleChat() {
            if (window.$chatwoot) {
                window.$chatwoot.toggle();
                document.getElementById('a11y-menu')?.classList.add('hidden');
            } else {
                window.location.href = '/contato';
            }
        }

        startVoice() {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const feedback = document.getElementById('a11y-voice-feedback');
            if (!SpeechRecognition) return alert('Seu navegador não suporta reconhecimento de voz.');

            const recognition = new SpeechRecognition();
            recognition.lang = 'pt-BR';
            recognition.interimResults = true;

            recognition.onstart = () => {
                feedback?.classList.remove('hidden');
                if (feedback) feedback.innerHTML = '<span class="pulse-dot"></span> Ouvindo...';
            };

            recognition.onresult = (event) => {
                const transcript = event.results[event.results.length - 1][0].transcript;
                if (feedback) feedback.textContent = transcript;
                if (event.results[0].isFinal) {
                    setTimeout(() => {
                        this.toggleChat();
                        feedback?.classList.add('hidden');
                    }, 1000);
                }
            };

            recognition.onerror = () => { if (feedback) feedback.textContent = "Erro. Tente novamente."; };
            recognition.start();
        }

        toggleMode(mode, value) {
            this.state[mode] = value;
            if (mode === 'elderlyMode' && value) this.state.highContrast = false;
            if (mode === 'highContrast' && value) this.state.elderlyMode = false;
            this.syncCheckboxes();
            this.saveState();
            this.applyState();
        }

        applyState() {
            const b = document.body;
            b.classList.toggle('a11y-elderly', this.state.elderlyMode);
            b.classList.toggle('a11y-cognitive', this.state.cognitiveMode);
            b.classList.toggle('a11y-high-contrast', this.state.highContrast);
            b.classList.toggle('a11y-large-font', this.state.largeFont);
            b.classList.toggle('a11y-zoom', this.state.zoomMode);
            b.classList.toggle('a11y-reduced-motion', this.state.reducedMotion);
        }

        reset() {
            this.state = { elderlyMode: false, cognitiveMode: false, highContrast: false, largeFont: false, zoomMode: false, reducedMotion: false };
            this.syncCheckboxes();
            this.saveState();
            this.applyState();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new AccessibilityManager());
    } else {
        new AccessibilityManager();
    }
})();
