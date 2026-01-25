/**
 * mega-chat-sim.js
 * Simulation of GetNexo IA Conversational Experience
 */

(function () {
    'use strict';

    const scenarios = [
        {
            name: "Lúcia (Moda)",
            messages: [
                { role: 'user', content: 'Olá! Gostaria de ver o tênis Quantum Red tam 37.' },
                { role: 'bot', content: 'Com certeza, Lúcia! Temos o Quantum Red disponível. Veja ele em 360º para conferir cada detalhe:' },
                { role: 'media', type: '360', title: 'Tênis Quantum Red', itemEmoji: '👟', ar: true },
                { role: 'user', content: 'Que incrível! Dá pra ver tudo. Vou querer um.' },
                { role: 'bot', content: 'Excelente escolha! Gerando seu pedido... Pronto! Você pode pagar via PIX para envio imediato.' },
                { role: 'media', type: 'pix', amount: 'R$ 289,90' }
            ]
        },
        {
            name: "Carlos (Pizzaria)",
            messages: [
                { role: 'user', content: 'Quero uma pizza de calabresa com borda de queijo.' },
                { role: 'bot', content: 'Claro, Carlos! Uma Calabresa Especial saindo. Deseja adicionar uma Coca 2L com desconto?' },
                { role: 'user', content: 'Sim, por favor! E qual o tempo de entrega?' },
                { role: 'bot', content: 'Tempo estimado de 35 min. Posso fechar seu pedido no valor de R$ 74,00?' },
                { role: 'user', content: 'Pode fechar!' },
                { role: 'bot', content: 'Pedido confirmado! 🍕 Acompanhe pelo link que enviei.' }
            ]
        }
    ];

    let currentScenario = 0;
    let currentMsg = 0;
    const chatContainer = document.getElementById('mega-chat-container');

    // Helper for Trusted Types
    function setInnerHTML(element, html) {
        if (window.trustedTypes && window.trustedTypes.defaultPolicy) {
            // Se existe politica default, o navegador converte automaticamente.
            // Podemos atribuir direto.
            element.innerHTML = html;
            return;
        }

        const policy = window.getnexoPolicy || (window.getnexoTrustedTypes && window.getnexoTrustedTypes.policy);

        if (policy && policy.createHTML) {
            element.innerHTML = policy.createHTML(html);
        } else {
            element.innerHTML = html;
        }
    }

    function addBubble(msg) {
        if (!chatContainer) return;
        const bubble = document.createElement('div');

        if (msg.role === 'media') {
            if (msg.type === '360') {
                bubble.className = 'sim-media';
                const html = `
                    <div class="sim-360-preview rotating">
                        <div class="sim-product-leap" id="sim-product-target">
                            <span style="font-size: 6rem; filter: drop-shadow(0 20px 40px rgba(0,0,0,0.6));">${msg.itemEmoji || '👟'}</span>
                        </div>
                        <div class="sim-360-icon" style="position:absolute; top:15px; left:15px; cursor:pointer; font-size: 1.5rem; opacity: 0.8;">🔄</div>
                        ${msg.ar ? '<div class="sim-rar-btn" id="sim-rar-trigger">RAR !</div>' : ''}
                    </div>
                `;
                setInnerHTML(bubble, html);
            } else if (msg.type === 'pix') {
                bubble.className = 'sim-pix-card';
                const pixHtml = `
                    <div class="pix-qr" style="display:flex; align-items:center; justify-content:center; font-size:2rem;">🔳</div>
                    <div style="font-weight:800; font-size:0.9rem;">${msg.amount}</div>
                    <div style="font-size:0.7rem; color:#666;">Código PIX copiado!</div>
                    <div class="pix-btn">PAGAMENTO CONFIRMADO ✅</div>
                `;
                setInnerHTML(bubble, pixHtml);
            }
        } else {
            bubble.className = `mega-bubble ${msg.role}`;
            setInnerHTML(bubble, `<span>${msg.content}</span>`);
        }

        chatContainer.appendChild(bubble);
        chatContainer.scrollTop = chatContainer.scrollHeight;

        if (msg.type === '360' && msg.ar) {
            setTimeout(simulateARInteraction, 3000);
        }
    }

    function simulateARInteraction() {
        const finger = document.getElementById('sim-finger-cursor');
        const trigger = document.getElementById('sim-rar-trigger');
        const product = document.getElementById('sim-product-target');

        if (!finger || !trigger || !product) return;

        const triggerRect = trigger.getBoundingClientRect();
        const containerRect = document.querySelector('.smart-phone-mockup').getBoundingClientRect();

        const targetX = triggerRect.left - containerRect.left + 5;
        const targetY = triggerRect.top - containerRect.top + 30;

        finger.style.setProperty('--target-x', `${targetX}px`);
        finger.style.setProperty('--target-y', `${targetY}px`);
        finger.style.display = 'block';
        finger.style.animation = 'fingerMove 2.5s cubic-bezier(0.45, 0.05, 0.55, 0.95) forwards';

        setTimeout(() => {
            trigger.style.transform = 'scale(0.8)';
            trigger.style.background = '#00ff9d';

            setTimeout(() => {
                trigger.style.transform = 'scale(1)';
                product.classList.add('leaping');
                const jumpHtml = '<span style="font-size: 8.5rem; filter: drop-shadow(0 0 30px rgba(0,212,255,0.8));">📱✨</span>';
                setInnerHTML(product, jumpHtml);

                setTimeout(() => {
                    product.classList.remove('leaping');
                    finger.style.display = 'none';
                }, 5000);
            }, 200);
        }, 2200);
    }

    function runSimulation() {
        if (!chatContainer) return;
        const scenario = scenarios[currentScenario];
        const msg = scenario.messages[currentMsg];

        addBubble(msg);

        currentMsg++;
        if (currentMsg < scenario.messages.length) {
            setTimeout(runSimulation, 3500);
        } else {
            setTimeout(() => {
                setInnerHTML(chatContainer, '');
                currentScenario = (currentScenario + 1) % scenarios.length;
                currentMsg = 0;
                runSimulation();
            }, 7000);
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        if (chatContainer) {
            setTimeout(runSimulation, 1000);
        }
    });

})();
