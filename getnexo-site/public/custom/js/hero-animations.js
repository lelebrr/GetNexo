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
        "🚀 Transforme cliques em lucro automático 24/7"
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

    // Magnetic buttons
    function initMagneticButtons() {
        document.querySelectorAll('.btn-primary-glow, .btn-outline, .btn-surprise').forEach(button => {
            button.addEventListener('mousemove', function (e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                this.style.setProperty('--x', `${x}px`);
                this.style.setProperty('--y', `${y}px`);
            });
        });
    }

    // Initialize everything on DOM ready
    document.addEventListener('DOMContentLoaded', () => {
        type();
        initParallax();
        initMagneticButtons();
    });

})();
