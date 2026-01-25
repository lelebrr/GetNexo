/**
 * modals-demo.js
 * Modal management and simulation logic for GetNexo Interactive Demos (IA & Chat)
 */

(function () {
    'use strict';

    // -- Modal Management --
    window.abrirModalDemo = function () {
        const modal = document.getElementById('demo-modal');
        if (modal) {
            modal.classList.remove('hidden');
            modal.style.display = 'block';
        }
    };

    window.fecharModalDemo = function () {
        const modal = document.getElementById('demo-modal');
        if (modal) {
            modal.classList.add('hidden');
            modal.style.display = 'none';
        }
    };

    window.abrirModalChat = function () {
        fecharModalDemo();
        setTimeout(() => {
            const modal = document.getElementById('chat-modal');
            if (modal) {
                modal.classList.remove('hidden');
                modal.style.display = 'block';
            }
        }, 100);
    };

    window.fecharModalChat = function () {
        const modal = document.getElementById('chat-modal');
        if (modal) {
            modal.classList.add('hidden');
            modal.style.display = 'none';
        }
    };

    window.abrirModalIA = function () {
        fecharModalDemo();
        setTimeout(() => {
            const modal = document.getElementById('ia-modal');
            if (modal) {
                modal.classList.remove('hidden');
                modal.style.display = 'block';
            }
        }, 100);
    };

    window.fecharModalIA = function () {
        const modal = document.getElementById('ia-modal');
        if (modal) {
            modal.classList.add('hidden');
            modal.style.display = 'none';
        }
    };

    window.fecharModalProdutoIA = function () {
        const modal = document.getElementById('product-modal-ia');
        if (modal) modal.classList.add('hidden');
    };

    // -- Chat Simulation Logic --
    window.preencherMensagemModal = function (texto) {
        const input = document.getElementById('chat-input-modal');
        if (input) {
            input.value = texto;
            sendMessageModal();
        }
    };

    window.handleKeyPressModal = function (event) {
        if (event.key === 'Enter') sendMessageModal();
    };

    window.sendMessageModal = function () {
        const input = document.getElementById('chat-input-modal');
        if (!input) return;
        const message = input.value.trim();
        if (!message) return;

        addMessageModal(message, 'user');
        input.value = '';

        setTimeout(() => {
            addMessageModal('🤖 Esta é uma demonstração do Chat IA do GetNexo. Em uma implementação real, a IA responderia automaticamente com informações sobre produtos do catálogo.', 'bot');
        }, 1000);
    };

    function addMessageModal(text, sender) {
        const messagesDiv = document.getElementById('chat-messages-modal');
        if (!messagesDiv) return;
        const messageDiv = document.createElement('div');
        messageDiv.className = `flex ${sender === 'user' ? 'justify-end' : 'justify-start'}`;

        const bubbleClass = sender === 'user'
            ? 'bg-cyber-gold text-black'
            : 'bg-neon-blue/20 border border-neon-blue/50 text-white';

        messageDiv.innerHTML = `
            <div class="${bubbleClass} rounded-2xl px-4 py-3 max-w-xs">
                <p class="text-sm whitespace-pre-line">${text}</p>
            </div>
        `;

        messagesDiv.appendChild(messageDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    // -- IA & Multimedia Demo Logic --
    window.preencherMensagemIA = function (texto) {
        const input = document.getElementById('ia-chat-input');
        if (input) {
            input.value = texto;
            sendMessageIA();
        }
    };

    window.handleKeyPressIA = function (event) {
        if (event.key === 'Enter') sendMessageIA();
    };

    window.sendMessageIA = function () {
        const input = document.getElementById('ia-chat-input');
        if (!input) return;
        const message = input.value.trim();
        if (!message) return;

        addMessageIA(message, 'user');
        input.value = '';

        setTimeout(() => {
            addMessageIA('🤖 Demo IA: Buscando produtos... Encontrei resultados relevantes!', 'bot');
            setTimeout(() => {
                mostrarProdutoIA('computador', 0);
            }, 1000);
        }, 1500);
    };

    function addMessageIA(text, sender) {
        const messagesDiv = document.getElementById('ia-chat-messages');
        if (!messagesDiv) return;
        const messageDiv = document.createElement('div');
        messageDiv.className = `flex ${sender === 'user' ? 'justify-end' : 'justify-start'}`;

        const bubbleClass = sender === 'user'
            ? 'bg-cyber-gold text-black'
            : 'bg-neon-blue/20 border border-neon-blue/50 text-white';

        messageDiv.innerHTML = `
            <div class="${bubbleClass} rounded-2xl px-4 py-3 max-w-md">
                <p class="text-sm whitespace-pre-line">${text}</p>
            </div>
        `;

        messagesDiv.appendChild(messageDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    window.mostrarProdutoIA = function (categoria, index) {
        const produtos = {
            carro: { nome: 'Cruze RS Turbo 2026', cor: 'Preto', preco: 129990, imagem: '/logo.svg' },
            celular: { nome: 'iPhone 15 128GB', cor: 'Azul', preco: 4299, imagem: '/logo.svg' },
            computador: { nome: 'PC Warrior i5 12ª', cpu: 'i5-12400F', ram: '16GB', preco: 4990, imagem: '/logo.svg' }
        };

        const produto = produtos[categoria];
        if (!produto) return;

        const content = `
            <img src="${produto.imagem}" alt="${produto.nome}" class="w-full h-48 object-cover rounded-lg mb-4" onerror="this.src='/logo.svg'" />
            <h4 class="text-xl text-cyber-gold font-jetbrains mb-2">${produto.nome}</h4>
            <div class="text-sm text-gray-300 mb-4">
                ${produto.cor ? `<p>Cor: ${produto.cor}</p>` : ''}
                ${produto.cpu ? `<p>CPU: ${produto.cpu}</p>` : ''}
                ${produto.ram ? `<p>RAM: ${produto.ram}</p>` : ''}
            </div>
            <p class="text-2xl text-matrix-green font-bold mb-4">R$ ${produto.preco.toLocaleString('pt-BR')}</p>
            <div class="flex space-x-2">
                <button onclick="alert('Produto adicionado ao carrinho!')" class="bg-cyber-gold hover:bg-yellow-400 text-black px-4 py-2 rounded font-medium">Comprar Agora</button>
            </div>
        `;

        const target = document.getElementById('product-content-ia');
        if (target) target.innerHTML = content;

        const modal = document.getElementById('product-modal-ia');
        if (modal) modal.classList.remove('hidden');
    };

    // -- Global Listeners --
    document.addEventListener('DOMContentLoaded', () => {
        document.addEventListener('click', function (event) {
            const demoModal = document.getElementById('demo-modal');
            const chatModal = document.getElementById('chat-modal');
            const iaModal = document.getElementById('ia-modal');
            const productModal = document.getElementById('product-modal-ia');

            if (event.target === demoModal) fecharModalDemo();
            if (event.target === chatModal) fecharModalChat();
            if (event.target === iaModal) fecharModalIA();
            if (event.target === productModal) fecharModalProdutoIA();
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                fecharModalDemo();
                fecharModalChat();
                fecharModalIA();
                fecharModalProdutoIA();
            }
        });
    });

})();
