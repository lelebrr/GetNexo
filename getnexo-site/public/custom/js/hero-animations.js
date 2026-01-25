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
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            floatingElements.forEach(element => {
                const rate = scrolled * -0.2;
                element.style.transform = `translateY(${rate}px)`;
            });
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

    // Magnetic buttons with enhanced effects
    function initMagneticButtons() {
        document.querySelectorAll('.btn-primary-glow, .btn-outline, .btn-surprise').forEach(button => {
            button.addEventListener('mousemove', function (e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                this.style.setProperty('--x', `${x}px`);
                this.style.setProperty('--y', `${y}px`);

                // Add subtle glow effect
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const deltaX = (x - centerX) / centerX;
                const deltaY = (y - centerY) / centerY;

                this.style.transform = `translate(${deltaX * 2}px, ${deltaY * 2}px)`;
            });

            button.addEventListener('mouseleave', function () {
                this.style.transform = 'translate(0, 0)';
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

            // Auto scroll to bottom
            chatContainer.scrollTop = chatContainer.scrollHeight;

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

    // Enhanced scroll progress indicator
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
            transition: width 0.1s ease;
            width: 0%;
        `;
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercent = (scrollTop / scrollHeight) * 100;
            progressBar.style.width = scrollPercent + '%';
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
