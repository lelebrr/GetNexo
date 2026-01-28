// widget.js - GetNexo Widget Public Version with White-Label Support
(function () {
    if (window.getNexoWidget) return;
    window.getNexoWidget = true;

    const isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
    const API_URL = isLocalhost ? 'http://localhost:8080' : 'https://api.getnexo.com.br';

    const currentScript = document.currentScript || (function () {
        const scripts = document.getElementsByTagName('script');
        return scripts[scripts.length - 1];
    })();

    // Detect client_id from various sources
    let clientId = null;

    // 1. Try data attribute
    clientId = currentScript.dataset.clientId || currentScript.dataset.client_id;

    // 2. Try URL parameter in script src
    if (!clientId) {
        const scriptSrc = currentScript.src;
        const url = new URL(scriptSrc);
        clientId = url.searchParams.get('client_id') || url.searchParams.get('clientId');
    }

    // 3. Try query parameters in current URL
    if (!clientId) {
        const urlParams = new URLSearchParams(window.location.search);
        clientId = urlParams.get('client_id') || urlParams.get('clientId');
    }

    // 4. Try hash parameter
    if (!clientId) {
        const hash = window.location.hash.substring(1);
        const hashParams = new URLSearchParams(hash);
        clientId = hashParams.get('client_id') || hashParams.get('clientId');
    }

    const config = {
        botId: currentScript.dataset.bot || 'demo',
        theme: currentScript.dataset.theme || 'neon',
        autoOpen: currentScript.dataset.autoOpen === 'true',
        position: currentScript.dataset.position || 'right',
        clientId: clientId
    };

    // White-label configuration cache
    let whiteLabelConfig = null;
    const CONFIG_CACHE_KEY = `gn_wl_config_${clientId || 'default'}`;
    const CONFIG_CACHE_TTL = 30 * 60 * 1000; // 30 minutes

    // Load white-label configuration
    async function loadWhiteLabelConfig() {
        if (!clientId) {
            whiteLabelConfig = {
                branding: {
                    logo: null,
                    colorPalette: { primary: '#00ff9d', secondary: '#334155', accent: '#00d4ff', background: '#0f172a' },
                    botName: 'Atendente Virtual',
                    background: null,
                    customCss: ''
                },
                behavior: {
                    activeChannels: ['whatsapp', 'facebook', 'email', 'chat'],
                    terminology: {}
                },
                chatWidget: {
                    position: 'bottom-right',
                    size: { width: 380, height: 600 },
                    animation: true,
                    sound: true
                }
            };
            return;
        }

        try {
            // Check localStorage cache first
            const cached = localStorage.getItem(CONFIG_CACHE_KEY);
            if (cached) {
                const parsed = JSON.parse(cached);
                if (Date.now() - parsed.timestamp < CONFIG_CACHE_TTL) {
                    whiteLabelConfig = parsed.config;
                    return;
                }
            }

            // Fetch from API
            const response = await fetch(`${API_URL}/api/whitelabel/config/${clientId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                whiteLabelConfig = await response.json();

                // Cache in localStorage
                localStorage.setItem(CONFIG_CACHE_KEY, JSON.stringify({
                    config: whiteLabelConfig,
                    timestamp: Date.now()
                }));
            } else {
                console.warn('[GetNexo Widget] Failed to load white-label config, using defaults');
                // Use defaults as fallback
                whiteLabelConfig = {
                    branding: {
                        logo: null,
                        colorPalette: { primary: '#00ff9d', secondary: '#334155', accent: '#00d4ff', background: '#0f172a' },
                        botName: 'Atendente Virtual',
                        background: null,
                        customCss: ''
                    },
                    behavior: {
                        activeChannels: ['whatsapp', 'facebook', 'email', 'chat'],
                        terminology: {}
                    },
                    chatWidget: {
                        position: 'bottom-right',
                        size: { width: 380, height: 600 },
                        animation: true,
                        sound: true
                    }
                };
            }
        } catch (error) {
            console.error('[GetNexo Widget] Error loading white-label config:', error);
            // Use defaults on error
            whiteLabelConfig = {
                branding: {
                    logo: null,
                    colorPalette: { primary: '#00ff9d', secondary: '#334155', accent: '#00d4ff', background: '#0f172a' },
                    botName: 'Atendente Virtual',
                    background: null,
                    customCss: ''
                },
                behavior: {
                    activeChannels: ['whatsapp', 'facebook', 'email', 'chat'],
                    terminology: {}
                },
                chatWidget: {
                    position: 'bottom-right',
                    size: { width: 380, height: 600 },
                    animation: true,
                    sound: true
                }
            };
        }
    }

    let visitorId = localStorage.getItem('gn_visitor_id');
    if (!visitorId) {
        visitorId = 'web_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('gn_visitor_id', visitorId);
    }

    // Generate styles with white-label configuration
    function generateStyles() {
        const primaryColor = whiteLabelConfig.branding.colorPalette.primary || '#00ff9d';
        const secondaryColor = whiteLabelConfig.branding.colorPalette.secondary || '#334155';
        const accentColor = whiteLabelConfig.branding.colorPalette.accent || '#00d4ff';
        const bgColor = whiteLabelConfig.branding.colorPalette.background || '#0f172a';
        const widgetPosition = whiteLabelConfig.chatWidget.position || config.position || 'bottom-right';
        const widgetSize = whiteLabelConfig.chatWidget.size || { width: 380, height: 600 };
        const hasAnimation = whiteLabelConfig.chatWidget.animation !== false;
        const customCss = whiteLabelConfig.branding.customCss || '';

        return `
        #getnexo-root {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            position: fixed !important;
            top: auto !important;
            bottom: 30px !important;
            ${widgetPosition.includes('left') ? 'left: 30px !important;' : 'right: 30px !important;'}
            z-index: 2147483647 !important;
            display: flex;
            flex-direction: column;
            align-items: ${widgetPosition.includes('left') ? 'flex-start' : 'flex-end'};
            gap: 15px;
            pointer-events: none;
            width: auto;
            height: auto;
        }
        #getnexo-root > * { pointer-events: auto; }
        #getnexo-btn {
            width: 60px; height: 60px; border-radius: 50%;
            background: linear-gradient(135deg, ${primaryColor}, ${accentColor});
            box-shadow: 0 4px 20px ${primaryColor}66;
            border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;
            font-size: 28px; transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            ${hasAnimation ? 'animation: gn-float 3s ease-in-out infinite;' : ''}
        }
        #getnexo-btn:hover { transform: scale(1.1); }
        ${hasAnimation ? '@keyframes gn-float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-5px); } }' : ''}
        #getnexo-notification {
            position: absolute; top: -5px; right: -5px; background: #ef4444; color: white;
            font-size: 11px; font-weight: bold; width: 18px; height: 18px; border-radius: 50%;
            display: flex; align-items: center; justify-content: center; border: 2px solid white;
        }
        #getnexo-window {
            width: ${widgetSize.width}px; height: ${widgetSize.height}px; max-height: 80vh; max-width: 90vw;
            background: ${bgColor}; border: 1px solid ${primaryColor}33;
            border-radius: 20px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
            display: flex; flex-direction: column; overflow: hidden;
            transition: opacity 0.3s, transform 0.3s; opacity: 0;
            transform: translateY(20px) scale(0.95); pointer-events: none; visibility: hidden;
        }
        #getnexo-window.open { opacity: 1; transform: translateY(0) scale(1); pointer-events: auto; visibility: visible; }
        #getnexo-header {
            background: linear-gradient(90deg, ${bgColor} 0%, ${primaryColor}0D 100%);
            padding: 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            display: flex; justify-content: space-between; align-items: center;
        }
        #getnexo-brand { display: flex; align-items: center; gap: 10px; color: white; font-weight: 600; }
        #getnexo-status { font-size: 0.75rem; color: ${primaryColor}; display: flex; align-items: center; gap: 4px; }
        #getnexo-status::before { content: ''; display: block; width: 6px; height: 6px; background: ${primaryColor}; border-radius: 50%; }
        #getnexo-close { background: transparent; border: none; color: #94a3b8; font-size: 20px; cursor: pointer; padding: 4px; line-height: 1; }
        #getnexo-body { flex: 1; padding: 15px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; scrollbar-width: thin; scrollbar-color: ${secondaryColor} transparent; }
        .gn-msg { max-width: 85%; padding: 10px 14px; border-radius: 12px; font-size: 14px; line-height: 1.5; animation: gn-fade-in 0.3s ease-out; }
        @keyframes gn-fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .gn-msg.bot { align-self: flex-start; background: ${secondaryColor}; color: #e2e8f0; border-bottom-left-radius: 2px; }
        .gn-msg.user { align-self: flex-end; background: linear-gradient(135deg, ${primaryColor}, ${accentColor}); color: ${bgColor}; font-weight: 500; border-bottom-right-radius: 2px; }
        #getnexo-footer { padding: 12px; border-top: 1px solid rgba(255, 255, 255, 0.05); display: flex; gap: 8px; background: ${bgColor}; }
        #getnexo-input { flex: 1; background: ${secondaryColor}; border: 1px solid ${secondaryColor}; color: white; padding: 0 16px; height: 44px; border-radius: 22px; font-size: 14px; outline: none; transition: border-color 0.2s; }
        #getnexo-input:focus { border-color: ${primaryColor}; }
        .gn-icon-btn { width: 44px; height: 44px; border-radius: 50%; border: none; background: ${secondaryColor}; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
        .gn-icon-btn:hover { background: #475569; }
        #getnexo-send { background: ${primaryColor}; color: ${bgColor}; }
        .gn-loading span { display: inline-block; width: 6px; height: 6px; background: #94a3b8; border-radius: 50%; animation: gn-bounce 1.4s infinite ease-in-out both; margin: 0 2px; }
        @keyframes gn-bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }
        #getnexo-games-menu { display: flex; flex-wrap: wrap; justify-content: center; }
        .gn-game-btn { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 8px; background: ${secondaryColor}; border: 1px solid ${primaryColor}33; border-radius: 8px; color: white; cursor: pointer; font-size: 12px; transition: all 0.2s; min-width: 60px; }
        .gn-game-btn:hover { background: #475569; border-color: ${primaryColor}; transform: scale(1.05); }
        .gn-game-btn span { font-size: 20px; }
        .gn-game-btn small { font-size: 10px; opacity: 0.8; }
        ${customCss}
    `;
    }

    async function init() {
        // Load white-label configuration first
        await loadWhiteLabelConfig();

        // Inject Styles (now with white-label config)
        const dynamicStyles = generateStyles();
        const styleSheet = document.createElement("style");
        styleSheet.innerText = dynamicStyles;
        document.head.appendChild(styleSheet);

        const root = document.createElement('div');
        root.id = 'getnexo-root';
        document.body.appendChild(root);

        const btn = document.createElement('button');
        btn.id = 'getnexo-btn';
        btn.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color:#0f172a"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            <div id="getnexo-notification">1</div>
        `;
        root.appendChild(btn);

        const windowDiv = document.createElement('div');
        windowDiv.id = 'getnexo-window';

        const botName = whiteLabelConfig.branding.botName || 'Atendente Virtual';
        const primaryColor = whiteLabelConfig.branding.colorPalette.primary || '#00ff9d';
        const bgColor = whiteLabelConfig.branding.colorPalette.background || '#0f172a';
        const logoUrl = whiteLabelConfig.branding.logo;

        windowDiv.innerHTML = `
            <div id="getnexo-header">
                <div id="getnexo-brand">
                    ${logoUrl ? `<img src="${logoUrl}" style="width:24px; height:24px; border-radius:6px; object-fit:cover;" alt="Logo" />` :
                `<div style="background:${primaryColor}; width:24px; height:24px; border-radius:6px; display:flex; align-items:center; justify-content:center; color:${bgColor}; font-weight:bold; font-size:14px;">N</div>`}
                    <div>
                        <div style="line-height:1;">${botName}</div>
                        <div id="getnexo-status">Online</div>
                    </div>
                </div>
                <button id="getnexo-close">&times;</button>
            </div>
            <div id="getnexo-body">
                <div class="gn-msg bot">
                    ${whiteLabelConfig.behavior.terminology.welcomeMessage || 'Olá! 👋 Sou a IA inteligente desta loja.<br>Posso ajudar você a encontrar o produto ideal ou tirar dúvidas. O que você procura hoje?'}
                </div>
            </div>
            <div id="getnexo-games-menu" style="padding: 8px; border-top: 1px solid rgba(255, 255, 255, 0.05); background: ${bgColor}; display: none; gap: 8px;">
                <button id="getnexo-game-roulette" class="gn-game-btn" data-game="roleta">
                    <span>🎰</span>
                    <small>Roleta</small>
                </button>
                <button id="getnexo-game-scratch" class="gn-game-btn" data-game="raspadinha">
                    <span>🧽</span>
                    <small>Raspadinha</small>
                </button>
                <button id="getnexo-game-price" class="gn-game-btn" data-game="caca_preco">
                    <span>💰</span>
                    <small>Caça-Preço</small>
                </button>
                <button id="getnexo-game-quiz" class="gn-game-btn" data-game="quiz">
                    <span>📚</span>
                    <small>Quiz</small>
                </button>
                <button id="getnexo-game-kit" class="gn-game-btn" data-game="monte_kit">
                    <span>🎁</span>
                    <small>Monte Kit</small>
                </button>
            </div>
            <div id="getnexo-footer">
                <input id="getnexo-input" type="text" placeholder="${whiteLabelConfig.behavior.terminology.inputPlaceholder || 'Digite sua dúvida...'}" />
                <button id="getnexo-games-toggle" class="gn-icon-btn" title="Jogos">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>
                </button>
                <button id="getnexo-mic" class="gn-icon-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
                </button>
                <button id="getnexo-send" class="gn-icon-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
            </div>
        `;
        root.appendChild(windowDiv);

        const chatWindow = document.getElementById('getnexo-window');
        const chatBody = document.getElementById('getnexo-body');
        const input = document.getElementById('getnexo-input');
        const sendBtn = document.getElementById('getnexo-send');
        const closeBtn = document.getElementById('getnexo-close');
        const micBtn = document.getElementById('getnexo-mic');
        const gamesToggleBtn = document.getElementById('getnexo-games-toggle');
        const gamesMenu = document.getElementById('getnexo-games-menu');

        const toggleChat = () => {
            const isOpen = chatWindow.classList.contains('open');
            if (isOpen) {
                chatWindow.classList.remove('open');
                document.getElementById('getnexo-notification').style.display = 'flex';
            } else {
                chatWindow.classList.add('open');
                document.getElementById('getnexo-notification').style.display = 'none';
                input.focus();
            }
        };

        btn.onclick = toggleChat;
        closeBtn.onclick = toggleChat;

        if (config.autoOpen) setTimeout(toggleChat, 2000);

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        let recognition = null;
        let isListening = false;

        if (SpeechRecognition) {
            recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'pt-BR';

            recognition.onstart = () => {
                isListening = true;
                micBtn.style.background = '#ef4444';
                micBtn.style.boxShadow = '0 0 15px #ef4444';
                input.placeholder = 'Ouvindo...';
            };

            recognition.onresult = (event) => {
                const transcript = event.results[event.results.length - 1][0].transcript;
                input.value = transcript;
                sendMessage();
            };

            recognition.onend = () => {
                isListening = false;
                micBtn.style.background = '#334155';
                micBtn.style.boxShadow = 'none';
                input.placeholder = whiteLabelConfig.behavior.terminology.inputPlaceholder || 'Digite sua dúvida...';
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                isListening = false;
                micBtn.style.background = '#334155';
                micBtn.style.boxShadow = 'none';
                input.placeholder = whiteLabelConfig.behavior.terminology.errorPlaceholder || 'Erro na voz. Tente digitar.';
            };
        }

        micBtn.onclick = () => {
            if (!recognition) {
                alert('Seu navegador não suporta reconhecimento de voz.');
                return;
            }
            if (isListening) {
                recognition.stop();
            } else {
                try { recognition.start(); } catch (e) { console.error(e); }
            }
        };

        const sendMessage = async () => {
            const text = input.value.trim();
            if (!text) return;
            appendMessage(text, 'user');
            input.value = '';
            const loadingId = appendLoading();

            try {
                const res = await fetch(`${API_URL}/api/chat`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        botId: config.botId,
                        message: text,
                        visitorId: visitorId,
                        clientId: clientId
                    })
                });
                const data = await res.json();
                removeLoading(loadingId);
                appendMessage(data.reply || 'Desculpe, não entendi. Pode repetir?', 'bot');
            } catch (err) {
                console.error(err);
                removeLoading(loadingId);
                appendMessage('Erro de conexão.', 'bot');
            }
        };

        sendBtn.onclick = sendMessage;
        input.onkeypress = (e) => { if (e.key === 'Enter') sendMessage(); };

        // Games functionality
        let gamesMenuVisible = false;
        gamesToggleBtn.onclick = () => {
            gamesMenuVisible = !gamesMenuVisible;
            gamesMenu.style.display = gamesMenuVisible ? 'flex' : 'none';
            gamesToggleBtn.style.background = gamesMenuVisible ? primaryColor : '';
        };

        // Game buttons event listeners
        document.querySelectorAll('.gn-game-btn').forEach(btn => {
            btn.onclick = () => {
                const gameType = btn.dataset.game;
                startGame(gameType);
            };
        });

        function startGame(gameType) {
            // Hide games menu
            gamesMenuVisible = false;
            gamesMenu.style.display = 'none';
            gamesToggleBtn.style.background = '';

            // Add game message to chat
            appendMessage(`🎮 Iniciando ${getGameTitle(gameType)}...`, 'bot');

            // Create game overlay/modal
            createGameModal(gameType);
        }

        function createGameModal(gameType) {
            // Remove existing modal if any
            const existingModal = document.getElementById('getnexo-game-modal');
            if (existingModal) existingModal.remove();

            const modal = document.createElement('div');
            modal.id = 'getnexo-game-modal';
            modal.style.cssText = `
                position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                background: rgba(0,0,0,0.8); z-index: 2147483648;
                display: flex; align-items: center; justify-content: center;
                backdrop-filter: blur(5px);
            `;

            const gameWrapper = document.createElement('div');
            gameWrapper.style.cssText = `
                background: ${bgColor}; border-radius: 24px;
                width: 440px; height: 600px; max-width: 95vw; max-height: 90vh;
                position: relative; border: 1px solid ${primaryColor}33;
                overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                display: flex; flex-direction: column;
            `;

            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = '✕';
            closeBtn.style.cssText = `
                position: absolute; top: 15px; right: 20px;
                background: rgba(255,255,255,0.1); border: none; color: white;
                width: 32px; height: 32px; border-radius: 50%;
                font-size: 18px; cursor: pointer; z-index: 10;
                display: flex; align-items: center; justify-content: center;
                transition: all 0.2s;
            `;
            closeBtn.onmouseover = () => closeBtn.style.background = 'rgba(255,0,0,0.5)';
            closeBtn.onmouseout = () => closeBtn.style.background = 'rgba(255,255,255,0.1)';

            closeBtn.onclick = () => {
                modal.remove();
            };

            // Use the new React GameContainer via iframe
            const iframe = document.createElement('iframe');
            // Construct URL with necessary context
            const gameUrl = new URL(`${API_URL.replace('api.', '')}/games/${gameType}`);
            gameUrl.searchParams.set('userId', visitorId);
            gameUrl.searchParams.set('clientId', clientId || 'default');

            iframe.src = gameUrl.toString();
            iframe.style.cssText = `
                width: 100%; height: 100%; border: none;
                flex: 1;
            `;

            // Listen for messages from the game
            window.addEventListener('message', (event) => {
                if (event.data.action === 'closeGame') {
                    modal.remove();
                } else if (event.data.action === 'pointsEarned') {
                    showGameToast(`🏆 +${event.data.points} pontos ganhos!`);
                    // Optionally refresh chat points or show notification
                }
            });

            gameWrapper.appendChild(closeBtn);
            gameWrapper.appendChild(iframe);
            modal.appendChild(gameWrapper);
            document.body.appendChild(modal);
        }

        // Keep getGameTitle for the chat notification
        function getGameTitle(gameType) {
            const titles = {
                roleta: '🎰 Roleta Virtual',
                raspadinha: '🧽 Raspadinha',
                caca_preco: '💰 Caça-Preço',
                quiz: '📚 Quiz',
                monte_kit: '🎁 Monte seu Kit'
            };
            return titles[gameType] || 'Minigame';
        }

        function showGameToast(message) {
            const toast = document.createElement('div');
            toast.textContent = message;
            toast.style.cssText = `
                position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
                background: linear-gradient(135deg, ${primaryColor}, ${accentColor});
                color: ${bgColor}; padding: 12px 24px;
                border-radius: 50px; font-weight: bold; z-index: 2147483649;
                box-shadow: 0 10px 25px rgba(0,0,0,0.3);
                animation: gn-toast-fade 3s forwards;
            `;

            const style = document.createElement('style');
            style.textContent = `
                @keyframes gn-toast-fade {
                    0% { opacity: 0; transform: translate(-50%, -20px); }
                    10% { opacity: 1; transform: translate(-50%, 0); }
                    90% { opacity: 1; transform: translate(-50%, 0); }
                    100% { opacity: 0; transform: translate(-50%, -20px); }
                }
            `;
            document.head.appendChild(style);

            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 3000);
        }

        function appendMessage(text, type) {
            const div = document.createElement('div');
            div.className = `gn-msg ${type}`;
            div.innerHTML = text;
            chatBody.appendChild(div);
            chatBody.scrollTop = chatBody.scrollHeight;
        }

        function appendLoading() {
            const id = 'loading-' + Date.now();
            const div = document.createElement('div');
            div.id = id; div.className = 'gn-msg bot gn-loading';
            div.innerHTML = '<span></span><span></span><span></span>';
            chatBody.appendChild(div);
            return id;
        }

        function removeLoading(id) {
            const el = document.getElementById(id);
            if (el) el.remove();
        }

    }

    if (document.readyState === 'complete') { init(); } else { window.addEventListener('load', init); }
})();
