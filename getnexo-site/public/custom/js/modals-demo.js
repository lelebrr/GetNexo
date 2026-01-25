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

    // Maintain conversation history
    window.chatHistory = [];

    window.abrirModalChat = function () {
        fecharModalDemo();
        setTimeout(() => {
            const modal = document.getElementById('chat-modal');
            if (modal) {
                modal.classList.remove('hidden');
                modal.style.display = 'block';

                // Initial Greeting Check
                const messagesDiv = document.getElementById('chat-messages-modal');
                if (messagesDiv && messagesDiv.children.length === 0) {
                    addMessageModal("Olá! Sou o assistente da GetNexo. Antes de mostrar os produtos incríveis pra você, me diz seu nome e email? Assim eu te trato como VIP e guardo sua oferta exclusiva. 😏", 'bot');
                    window.chatHistory.push({ role: 'assistant', content: "Olá! Sou o assistente da GetNexo. Antes de mostrar os produtos incríveis pra você, me diz seu nome e email? Assim eu te trato como VIP e guardo sua oferta exclusiva. 😏" });
                }
            }
        }, 100);
    };

    window.sendMessageModal = async function () {
        const input = document.getElementById('chat-input-modal');
        if (!input) return;
        const message = input.value.trim();
        if (!message) return;

        addMessageModal(message, 'user');
        input.value = '';

        const messagesDiv = document.getElementById('chat-messages-modal');
        const botMessageDiv = document.createElement('div');
        botMessageDiv.className = 'flex justify-start';
        botMessageDiv.innerHTML = `
            <div class="bg-neon-blue/20 border border-neon-blue/50 text-white rounded-2xl px-4 py-3 max-w-md">
                <p class="text-sm whitespace-pre-line bot-text">...</p>
            </div>
        `;
        messagesDiv.appendChild(botMessageDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
        const botTextElement = botMessageDiv.querySelector('.bot-text');

        try {
            const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:3006' : 'https://api.getnexo.com.br';

            botTextElement.innerText = "Digitando...";

            const response = await fetch(`${API_URL}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: message,
                    history: window.chatHistory || []
                })
            });

            if (!response.ok) throw new Error('Erro API');

            const data = await response.json();

            // Render the response
            botTextElement.innerHTML = data.reply.replace(/\n/g, '<br>');

            if (data.reply.includes('<img')) {
                botMessageDiv.querySelector('div').classList.remove('max-w-md'); // default
                botMessageDiv.querySelector('div').classList.add('max-w-lg');
            }

            messagesDiv.scrollTop = messagesDiv.scrollHeight;

            // Update local history
            if (data.history) {
                window.chatHistory = data.history;
            } else {
                window.chatHistory.push({ role: 'user', content: message });
                window.chatHistory.push({ role: 'assistant', content: data.reply });
            }

        } catch (error) {
            console.error(error);
            botTextElement.innerText = '⚠️ Ops, o vendedor IA está ocupado. Tente novamente.';
        }
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

    // Old implementation removed


    function addMessageModal(text, sender) {
        const messagesDiv = document.getElementById('chat-messages-modal');
        if (!messagesDiv) return;
        const messageDiv = document.createElement('div');
        messageDiv.className = `flex ${sender === 'user' ? 'justify-end' : 'justify-start'}`;

        const bubbleClass = sender === 'user'
            ? 'bg-cyber-gold text-black'
            : 'bg-void-black border border-neon-blue/50 text-white';

        messageDiv.innerHTML = `
            <div class="${bubbleClass} rounded-2xl px-4 py-3 max-w-md shadow-lg">
                <div class="text-sm whitespace-pre-line">${text}</div>
            </div>
        `;

        messagesDiv.appendChild(messageDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    // -- Voice Simulation --
    let synth = window.speechSynthesis;
    let isSpeaking = false;

    window.iniciarVozModal = function () {
        const lastBotMessage = document.querySelector('#chat-messages-modal .flex.justify-start:last-child .text-sm');
        if (!lastBotMessage) return;

        if (synth.speaking) {
            synth.cancel();
        }

        const text = lastBotMessage.innerText.replace(/<[^>]*>/g, ''); // Strip HTML
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = 'pt-BR';
        utter.rate = 1.0;
        utter.pitch = 1.0;

        utter.onstart = () => { isSpeaking = true; };
        utter.onend = () => { isSpeaking = false; };

        synth.speak(utter);
    };

    window.sendMessageIA = async function () {
        // Reuse same logic for the IA modal or implement specific one
        // For now, mapping to the same logic but targeting IA modal elements
        const input = document.getElementById('ia-chat-input');
        if (!input) return;
        const message = input.value.trim();
        if (!message) return;

        addMessageIA(message, 'user');
        input.value = '';

        // Bot placeholder
        const messagesDiv = document.getElementById('ia-chat-messages');
        const botMessageDiv = document.createElement('div');
        botMessageDiv.className = 'flex justify-start';
        botMessageDiv.innerHTML = `
            <div class="bg-neon-blue/20 border border-neon-blue/50 text-white rounded-2xl px-4 py-3 max-w-md">
                <p class="text-sm whitespace-pre-line bot-text">...</p>
            </div>
        `;
        messagesDiv.appendChild(botMessageDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;

        const botTextElement = botMessageDiv.querySelector('.bot-text');
        let fullResponse = '';

        try {
            const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:3006' : 'https://api.getnexo.com.br';
            const response = await fetch(`${API_URL}/api/chat/stream`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: message, history: [] })
            });

            if (!response.ok) throw new Error('API Error');

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const dataStr = line.replace('data: ', '');
                        if (dataStr === '[DONE]') break;
                        try {
                            const data = JSON.parse(dataStr);
                            if (data.content) {
                                if (fullResponse === '') botTextElement.innerText = '';
                                fullResponse += data.content;
                                botTextElement.innerHTML = fullResponse.replace(/\n/g, '<br>');
                                messagesDiv.scrollTop = messagesDiv.scrollHeight;
                            }
                        } catch (e) { }
                    }
                }
            }
        } catch (error) {
            botTextElement.innerText = 'Erro na IA.';
        }
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
