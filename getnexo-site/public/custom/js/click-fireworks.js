/**
 * EFEITO DE FOGOS NO CLIQUE DO MOUSE
 * Cria explosões luminosas no local do clique esquerdo
 */

(function () {
    'use strict';

    // Cria o efeito de fogos no clique
    function createFireworks(event) {
        // Só funciona com botão esquerdo do mouse
        if (event.button !== 0) return;

        // Evita cliques em elementos de formulário
        const target = event.target;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
            return;
        }

        const x = event.clientX;
        const y = event.clientY;

        // Container principal
        const fireworks = document.createElement('div');
        fireworks.className = 'click-fireworks';
        fireworks.style.left = x + 'px';
        fireworks.style.top = y + 'px';
        document.body.appendChild(fireworks);

        // Cria partículas de fogos (8-12 partículas)
        const particleCount = Math.floor(Math.random() * 5) + 8;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'firework-particle';

            // Posição aleatória em círculo
            const angle = (Math.PI * 2 * i) / particleCount;
            const distance = Math.random() * 60 + 20;
            const particleX = Math.cos(angle) * distance;
            const particleY = Math.sin(angle) * distance;

            particle.style.left = particleX + 'px';
            particle.style.top = particleY + 'px';

            // Cor aleatória entre laranja, vermelho e amarelo
            const colors = ['#ff6b35', '#f7931e', '#ffd23f', '#ff4757', '#ff9ff3'];
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];

            // Delay aleatório para efeito cascata
            particle.style.animationDelay = (Math.random() * 0.3) + 's';

            fireworks.appendChild(particle);
        }

        // Remove o efeito após a animação
        setTimeout(() => {
            if (fireworks.parentNode) {
                fireworks.parentNode.removeChild(fireworks);
            }
        }, 800);
    }

    // Adiciona listener global de clique - DESATIVADO PARA EVITAR ATROPELOS VISUAIS
    // document.addEventListener('click', createFireworks);

    console.log('🎆 Efeito de fogos no clique ativado!');

})();