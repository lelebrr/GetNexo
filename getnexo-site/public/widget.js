// widget.js - GetNexo Widget Public Version with Voice Support
(function () {
    if (window.getNexoWidget) return;
    window.getNexoWidget = true;

    const isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
    const API_URL = isLocalhost ? 'http://localhost:8080' : 'https://api.getnexo.com.br';

    const currentScript = document.currentScript || (function () {
        const scripts = document.getElementsByTagName('script');
        return scripts[scripts.length - 1];
    })();

    const config = {
        botId: currentScript.dataset.bot || 'demo',
        theme: currentScript.dataset.theme || 'neon',
        autoOpen: currentScript.dataset.autoOpen === 'true',
        position: currentScript.dataset.position || 'right'
    };

    let visitorId = localStorage.getItem('gn_visitor_id');
    if (!visitorId) {
        visitorId = 'web_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('gn_visitor_id', visitorId);
    }

    const styles = `
        #getnexo-root {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            position: fixed;
            bottom: 20px;
            ${config.position === 'left' ? 'left: 20px;' : 'right: 20px;'}
            z-index: 2147483647;
            display: flex;
            flex-direction: column;
            align-items: ${config.position === 'left' ? 'flex-start' : 'flex-end'};
            gap: 15px;
            pointer-events: none;
        }
        #getnexo-root > * { pointer-events: auto; }
        #getnexo-btn {
            width: 60px; height: 60px; border-radius: 50%;
            background: linear-gradient(135deg, #00ff9d, #00d4ff);
            box-shadow: 0 4px 20px rgba(0, 255, 157, 0.4);
            border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;
            font-size: 28px; transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            animation: gn-float 3s ease-in-out infinite;
        }
        #getnexo-btn:hover { transform: scale(1.1); }
        @keyframes gn-float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-5px); } }
        #getnexo-notification {
            position: absolute; top: -5px; right: -5px; background: #ef4444; color: white;
            font-size: 11px; font-weight: bold; width: 18px; height: 18px; border-radius: 50%;
            display: flex; align-items: center; justify-content: center; border: 2px solid white;
        }
        #getnexo-window {
            width: 380px; height: 600px; max-height: 80vh; max-width: 90vw;
            background: #0f172a; border: 1px solid rgba(0, 255, 157, 0.2);
            border-radius: 20px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
            display: flex; flex-direction: column; overflow: hidden;
            transition: opacity 0.3s, transform 0.3s; opacity: 0;
            transform: translateY(20px) scale(0.95); pointer-events: none; visibility: hidden;
        }
        #getnexo-window.open { opacity: 1; transform: translateY(0) scale(1); pointer-events: auto; visibility: visible; }
        #getnexo-header {
            background: linear-gradient(90deg, rgba(15, 23, 42, 1) 0%, rgba(0, 255, 157, 0.05) 100%);
            padding: 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            display: flex; justify-content: space-between; align-items: center;
        }
        #getnexo-brand { display: flex; align-items: center; gap: 10px; color: white; font-weight: 600; }
        #getnexo-status { font-size: 0.75rem; color: #00ff9d; display: flex; align-items: center; gap: 4px; }
        #getnexo-status::before { content: ''; display: block; width: 6px; height: 6px; background: #00ff9d; border-radius: 50%; }
        #getnexo-close { background: transparent; border: none; color: #94a3b8; font-size: 20px; cursor: pointer; padding: 4px; line-height: 1; }
        #getnexo-body { flex: 1; padding: 15px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; scrollbar-width: thin; scrollbar-color: #334155 transparent; }
        .gn-msg { max-width: 85%; padding: 10px 14px; border-radius: 12px; font-size: 14px; line-height: 1.5; animation: gn-fade-in 0.3s ease-out; }
        @keyframes gn-fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .gn-msg.bot { align-self: flex-start; background: #1e293b; color: #e2e8f0; border-bottom-left-radius: 2px; }
        .gn-msg.user { align-self: flex-end; background: linear-gradient(135deg, #00ff9d, #00d4ff); color: #0f172a; font-weight: 500; border-bottom-right-radius: 2px; }
        #getnexo-footer { padding: 12px; border-top: 1px solid rgba(255, 255, 255, 0.05); display: flex; gap: 8px; background: #0f172a; }
        #getnexo-input { flex: 1; background: #1e293b; border: 1px solid #334155; color: white; padding: 0 16px; height: 44px; border-radius: 22px; font-size: 14px; outline: none; transition: border-color 0.2s; }
        #getnexo-input:focus { border-color: #00ff9d; }
        .gn-icon-btn { width: 44px; height: 44px; border-radius: 50%; border: none; background: #334155; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
        .gn-icon-btn:hover { background: #475569; }
        #getnexo-send { background: #00ff9d; color: #0f172a; }
        .gn-loading span { display: inline-block; width: 6px; height: 6px; background: #94a3b8; border-radius: 50%; animation: gn-bounce 1.4s infinite ease-in-out both; margin: 0 2px; }
        @keyframes gn-bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }
    `;

    function init() {
        const styleSheet = document.createElement("style");
        styleSheet.innerText = styles;
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
        windowDiv.innerHTML = `
            <div id="getnexo-header">
                <div id="getnexo-brand">
                    <div style="background:#00ff9d; width:24px; height:24px; border-radius:6px; display:flex; align-items:center; justify-content:center; color:#0f172a; font-weight:bold; font-size:14px;">N</div>
                    <div>
                        <div style="line-height:1;">Atendente Virtual</div>
                        <div id="getnexo-status">Online</div>
                    </div>
                </div>
                <button id="getnexo-close">&times;</button>
            </div>
            <div id="getnexo-body">
                <div class="gn-msg bot">
                    Olá! 👋 Sou a IA inteligente desta loja.<br>
                    Posso ajudar você a encontrar o produto ideal ou tirar dúvidas. O que você procura hoje?
                </div>
            </div>
            <div id="getnexo-footer">
                <input id="getnexo-input" type="text" placeholder="Digite sua dúvida..." />
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
                input.placeholder = 'Digite sua dúvida...';
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                isListening = false;
                micBtn.style.background = '#334155';
                micBtn.style.boxShadow = 'none';
                input.placeholder = 'Erro na voz. Tente digitar.';
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
                    body: JSON.stringify({ botId: config.botId, message: text, visitorId: visitorId })
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
