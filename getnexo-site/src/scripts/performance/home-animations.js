// Animações e interações para a página inicial
document.addEventListener('DOMContentLoaded', function () {
    // Sistema de revelação de elementos
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    // Observar todos os elementos com classe 'reveal'
    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });

    // Animação do chat flutuante
    const heroChat = document.getElementById('hero-chat');
    if (heroChat) {
        const messages = [
            { text: "Olá! Sou a Nexus IA, sua assistente de vendas 24/7.", type: "agent" },
            { text: "Posso ajudar você a configurar seu chatbot?", type: "agent" },
            { text: "Sim, quero começar!", type: "user" },
            { text: "Perfeito! Vamos configurar seu primeiro bot em menos de 5 minutos.", type: "agent" }
        ];

        let messageIndex = 0;

        function addMessage() {
            if (messageIndex < messages.length) {
                const message = messages[messageIndex];
                const messageEl = document.createElement('div');
                messageEl.className = `chat-msg ${message.type}`;
                messageEl.innerHTML = `<div class="msg-inner">${message.text}</div>`;
                heroChat.appendChild(messageEl);

                // Scroll para o final
                heroChat.scrollTop = heroChat.scrollHeight;

                messageIndex++;
                setTimeout(addMessage, 2000 + Math.random() * 1000);
            }
        }

        // Iniciar chat após 2 segundos
        setTimeout(addMessage, 2000);
    }

    // Animação do holograma
    const hologramCore = document.querySelector('.hologram-core');
    if (hologramCore) {
        let mouseX = 0;
        let mouseY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 20;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 20;

            hologramCore.style.transform = `rotateX(${mouseY}deg) rotateY(${mouseX}deg)`;
        });
    }

    // Efeito de hover nos cards
    document.querySelectorAll('.p-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-15px) scale(1.02)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Animação dos botões
    document.querySelectorAll('.btn-primary-glow, .btn-outline').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'translateY(-2px)';
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translateY(0)';
        });
    });

    // Smooth scroll para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Performance: Lazy load de imagens (se houver)
    const images = document.querySelectorAll('img[data-src]');
    if (images.length > 0) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    // Otimização: Reduzir movimento para usuários com preferência de movimento reduzido
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        document.documentElement.style.setProperty('--animation-duration', '0s');
    }
});