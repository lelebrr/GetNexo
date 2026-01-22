// GetNexo Home Page Animations - Performance Optimized
(function () {
    // 1. Hero Chat Simulation
    const chatContainer = document.getElementById('hero-chat');
    if (chatContainer) {
        const messages = [
            { type: 'user', text: 'Olá, gostaria de saber o preço do GetNexo Pro.' },
            { type: 'agent', text: 'Com certeza! O Plano Pro custa apenas R$ 97/mês com hospedagem inclusa.' },
            { type: 'agent', text: 'Gostaria de gerar um link de ativação agora?' },
            { type: 'user', text: 'Sim, por favor!' }
        ];

        let msgIndex = 0;
        const typeNext = () => {
            if (msgIndex < messages.length) {
                const msg = messages[msgIndex];
                const div = document.createElement('div');
                div.className = `chat-msg ${msg.type}`;
                div.innerHTML = `<div class="msg-inner">${msg.text}</div>`;
                chatContainer.appendChild(div);
                requestAnimationFrame(() => {
                    chatContainer.scrollTop = chatContainer.scrollHeight;
                });
                msgIndex++;
                setTimeout(typeNext, 2500);
            } else {
                setTimeout(() => {
                    chatContainer.innerHTML = '';
                    msgIndex = 0;
                    typeNext();
                }, 5000);
            }
        };
        typeNext();
    }

    // 2. Ara Avatar Parallax movement - Optimized for 60fps / No Reflow
    const hologram = document.querySelector('.hologram-core');
    if (hologram) {
        let mouseX = 0, mouseY = 0;
        let winW = window.innerWidth, winH = window.innerHeight;
        let ticking = false;

        window.addEventListener('resize', () => {
            winW = window.innerWidth;
            winH = window.innerHeight;
        }, { passive: true });

        window.addEventListener('mousemove', (e) => {
            mouseX = e.pageX;
            mouseY = e.pageY;
            if (!ticking) {
                requestAnimationFrame(() => {
                    const x = (winW / 2 - mouseX) / 30;
                    const y = (winH / 2 - mouseY) / 30;
                    hologram.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // 3. Intersection Observer for Reveal Animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();
