/**
 * hero-animations.js
 * Typing effect and reveal animations for GetNexo Hero
 */

(function () {
    'use strict';

    // Typed Phrases - Could be localized later
    const phrases = [
        "⚡ API Oficial Meta + PIX Nativo + CRM IA",
        "✅ Setup em 12 minutos | ✅ Zero Mensalidades",
        "🚀 Transforme cliques em lucro automático 24/7",
        "🤖 IA Generativa que fecha vendas sozinha",
        "📈 +890% em vendas com GetNexo"
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const typingText = document.getElementById('typing-text');
        if (!typingText) return;

        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            typingText.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            typingText.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typeSpeed = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }

    // Parallax for floating elements (Subtle)
    function initParallax() {
        const floatingElements = document.querySelectorAll('.f-pill');
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrolled = window.scrollY; // Use scrollY instead of deprecated pageYOffset
                    floatingElements.forEach(element => {
                        const rate = scrolled * -0.2;
                        element.style.transform = `translate3d(0, ${rate}px, 0)`; // Use translate3d
                    });
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // Enhanced scroll animations
    function initScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }

    // Magnetic buttons with enhanced effects - Otimizado para evitar reflow
    function initMagneticButtons() {
        document.querySelectorAll('.btn-primary-glow, .btn-outline, .btn-surprise').forEach(button => {
            let rect = null;
            let pendingUpdate = false;
            let pendingX = 0;
            let pendingY = 0;
            let centerX = 0;
            let centerY = 0;
            let isHovering = false;
            let dimensionsCached = false;

            // Cache dimensions once on initialization to avoid reflow
            function cacheDimensions() {
                if (!dimensionsCached) {
                    rect = button.getBoundingClientRect();
                    centerX = rect.width / 2;
                    centerY = rect.height / 2;
                    dimensionsCached = true;
                }
            }

            button.addEventListener('mouseenter', function () {
                isHovering = true;
                // Use cached dimensions instead of calling getBoundingClientRect()
                cacheDimensions();
            });

            button.addEventListener('mousemove', function (e) {
                if (!rect || !isHovering) return;

                // Store values for batch update without triggering reflow
                pendingX = e.clientX - rect.left;
                pendingY = e.clientY - rect.top;

                if (!pendingUpdate) {
                    pendingUpdate = true;
                    requestAnimationFrame(() => {
                        // Batch all style updates to avoid layout thrashing
                        button.style.setProperty('--x', `${pendingX}px`);
                        button.style.setProperty('--y', `${pendingY}px`);

                        // Add subtle glow effect - using cached center values
                        const deltaX = (pendingX - centerX) / centerX;
                        const deltaY = (pendingY - centerY) / centerY;

                        // Use translate3d for hardware acceleration
                        button.style.transform = `translate3d(${deltaX * 2}px, ${deltaY * 2}px, 0)`;

                        pendingUpdate = false;
                    });
                }
            });

            button.addEventListener('mouseleave', function () {
                isHovering = false;
                this.style.transform = 'translate(0, 0)';
                // Don't reset rect to avoid reflow on next mouseenter
            });
        });
    }

    // Interactive chat simulation
    function initChatSimulation() {
        const chatContainer = document.getElementById('mega-chat-container');
        if (!chatContainer) return;

        const messages = [
            { text: "Olá! Como posso ajudar você hoje?", sender: 'bot' },
            { text: "Quero ver seu catálogo de tênis", sender: 'user' },
            { text: "Claro! Temos tênis em várias cores e tamanhos. Qual você prefere?", sender: 'bot' },
            { text: "Preto, tamanho 42", sender: 'user' },
            { text: "Perfeito! Tenho o modelo premium preto 42 disponível. R$ 299,00 com frete grátis. Quer finalizar?", sender: 'bot' }
        ];

        let messageIndex = 0;
        let charIndex = 0;
        let isTyping = false;

        function addMessage(text, sender) {
            const bubble = document.createElement('div');
            bubble.className = `mega-bubble ${sender}`;
            bubble.textContent = '';
            chatContainer.appendChild(bubble);

            // Auto scroll to bottom optimized
            requestAnimationFrame(() => {
                if (chatContainer) {
                    chatContainer.scrollTo({
                        top: chatContainer.scrollHeight,
                        behavior: 'smooth'
                    });
                }
            });

            return bubble;
        }

        function typeMessage(bubble, text) {
            if (charIndex < text.length) {
                bubble.textContent += text.charAt(charIndex);
                charIndex++;
                setTimeout(() => typeMessage(bubble, text), 50);
            } else {
                charIndex = 0;
                messageIndex++;
                if (messageIndex < messages.length) {
                    setTimeout(() => {
                        const nextMsg = messages[messageIndex];
                        const nextBubble = addMessage('', nextMsg.sender);
                        typeMessage(nextBubble, nextMsg.text);
                    }, 1000);
                } else {
                    // Reset after completion
                    setTimeout(() => {
                        chatContainer.innerHTML = '';
                        messageIndex = 0;
                        const firstBubble = addMessage('', messages[0].sender);
                        typeMessage(firstBubble, messages[0].text);
                    }, 3000);
                }
            }
        }

        // Start simulation
        const firstBubble = addMessage('', messages[0].sender);
        typeMessage(firstBubble, messages[0].text);
    }

    // Enhanced scroll progress indicator - Otimizado para evitar reflow
    function initScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress-bar';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: linear-gradient(90deg, #00d4ff, #00ff9d);
            z-index: 9999;
            transition: transform 0.1s linear;
            width: 100%;
            transform-origin: 0 50%;
            transform: scaleX(0);
        `;
        document.body.appendChild(progressBar);

        let ticking = false;
        // Cache dimensions to avoid layout thrashing
        let docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

        window.addEventListener('resize', () => {
            // Debounce resize events
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                    ticking = false;
                });
                ticking = true;
            }
        });

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrollTop = window.scrollY;
                    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) : 0;
                    progressBar.style.transform = `scaleX(${scrollPercent})`;
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // Initialize everything on DOM ready
    document.addEventListener('DOMContentLoaded', () => {
        type();
        initParallax();
        initScrollAnimations();
        initMagneticButtons();
        initChatSimulation();
        initScrollProgress();
    });

})();
