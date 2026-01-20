// widget.js - GetNexo Widget (roda no site do cliente)
(function () {
    // Evita duplicação
    if (window.getNexoWidget) return;
    window.getNexoWidget = true;

    // Detectar ambiente
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const API_URL = isLocalhost ? 'http://localhost:8080' : 'https://api.getnexo.com.br';

    // Configuração via data-bot
    const curScript = document.currentScript || (function () {
        var scripts = document.getElementsByTagName('script');
        return scripts[scripts.length - 1];
    })();

    const config = {
        botId: curScript.dataset.bot || 'demo',
        theme: curScript.dataset.theme || 'neon'
    };

    // Injeta botão flutuante
    const btn = document.createElement('button');
    btn.id = 'getnexo-chat-btn';
    btn.innerHTML = '💬';
    btn.style.cssText = `
        position:fixed; bottom:20px; right:20px;
        background: linear-gradient(135deg, #00ff9d, #00d4ff);
        border:none; border-radius:50px;
        width:60px; height:60px; font-size:24px; cursor:pointer;
        box-shadow:0 0 20px rgba(0,255,157,0.5);
        z-index:9999;
        transition:transform 0.2s, box-shadow 0.2s;
    `;
    btn.onmouseover = () => {
        btn.style.transform = 'scale(1.1)';
        btn.style.boxShadow = '0 0 30px rgba(0,255,157,0.8)';
    };
    btn.onmouseout = () => {
        btn.style.transform = 'scale(1)';
        btn.style.boxShadow = '0 0 20px rgba(0,255,157,0.5)';
    };
    document.body.appendChild(btn);

    // Injeta janela de chat (escondida)
    const chatWin = document.createElement('div');
    chatWin.id = 'getnexo-chat';
    chatWin.style.cssText = `
        display:none; position:fixed; bottom:90px; right:20px; 
        width:350px; height:500px;
        background:rgba(10,14,23,0.98); 
        border:1px solid rgba(0,255,157,0.3); 
        border-radius:16px;
        color:#e5e7eb; 
        font-family:'Inter', -apple-system, sans-serif;
        box-shadow:0 0 40px rgba(0,255,157,0.2);
        z-index:9998; 
        overflow:hidden;
        display:flex;
        flex-direction:column;
        display:none;
    `;
    chatWin.innerHTML = `
        <header style="display:flex; justify-content:space-between; align-items:center; padding:1rem; background:linear-gradient(90deg, rgba(0,212,255,0.1), rgba(0,255,157,0.1)); border-bottom:1px solid rgba(0,255,157,0.2);">
            <div style="display:flex; align-items:center; gap:0.5rem;">
                <span style="font-size:1.5rem;">💬</span>
                <div>
                    <div style="color:#00ff9d; font-weight:bold;">GetNexo</div>
                    <div style="font-size:0.7rem; color:#64748b;">● Online agora</div>
                </div>
            </div>
            <span onclick="document.getElementById('getnexo-chat').style.display='none'" style="cursor:pointer; font-size:1.5rem; color:#64748b; padding:0.5rem;">&times;</span>
        </header>
        <div id="chat-body" style="flex:1; overflow-y:auto; padding:1rem; font-size:14px;"></div>
        <div style="padding:1rem; border-top:1px solid rgba(255,255,255,0.1);">
            <input id="chat-input" placeholder="Digite sua mensagem..." style="width:100%; padding:0.8rem 1rem; background:#1e293b; border:1px solid #334155; border-radius:50px; color:white; outline:none; font-size:14px;" />
        </div>
    `;
    document.body.appendChild(chatWin);

    // Toggle chat
    btn.onclick = () => {
        const isOpen = chatWin.style.display === 'flex';
        chatWin.style.display = isOpen ? 'none' : 'flex';
    };

    // Mensagem inicial
    const chat = chatWin.querySelector('#chat-body');
    chat.innerHTML = `
        <div style="display:flex; gap:0.5rem; margin-bottom:1rem;">
            <div style="width:32px; height:32px; background:#00ff9d; border-radius:50%; display:flex; align-items:center; justify-content:center;">🤖</div>
            <div style="flex:1; background:#1e293b; padding:0.8rem; border-radius:12px; border-top-left-radius:0;">
                <p style="margin:0; color:white;">Olá! 👋 Sou o assistente virtual da loja.</p>
                <p style="margin:0.5rem 0 0; color:#94a3b8; font-size:0.9em;">Como posso te ajudar hoje?</p>
            </div>
        </div>
    `;

    // Função para adicionar mensagem
    function addMessage(text, isBot) {
        const msgDiv = document.createElement('div');
        msgDiv.style.cssText = `display:flex; gap:0.5rem; margin-bottom:1rem; ${isBot ? '' : 'flex-direction:row-reverse;'}`;
        msgDiv.innerHTML = isBot
            ? `<div style="width:32px; height:32px; background:#00ff9d; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0;">🤖</div>
               <div style="flex:1; background:#1e293b; padding:0.8rem; border-radius:12px; border-top-left-radius:0; color:white;">${text}</div>`
            : `<div style="flex:1; background:#00d4ff22; padding:0.8rem; border-radius:12px; border-top-right-radius:0; color:white; text-align:right;">${text}</div>`;
        chat.appendChild(msgDiv);
        chat.scrollTop = chat.scrollHeight;
    }

    // Envia mensagem
    chatWin.querySelector('#chat-input').addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            const msg = e.target.value.trim();
            if (!msg) return;

            addMessage(msg, false);
            e.target.value = '';

            // Loading
            const loadingDiv = document.createElement('div');
            loadingDiv.style.cssText = 'display:flex; gap:0.5rem; margin-bottom:1rem;';
            loadingDiv.innerHTML = `
                <div style="width:32px; height:32px; background:#00ff9d; border-radius:50%; display:flex; align-items:center; justify-content:center;">🤖</div>
                <div style="color:#64748b;"><em>Digitando...</em></div>
            `;
            chat.appendChild(loadingDiv);
            chat.scrollTop = chat.scrollHeight;

            try {
                const res = await fetch(`${API_URL}/api/chat`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ botId: config.botId, mensagem: msg })
                });
                const data = await res.json();
                loadingDiv.remove();
                addMessage(data.resposta || 'Desculpe, tente novamente.', true);
            } catch (err) {
                loadingDiv.remove();
                addMessage('Desculpe, houve um erro de conexão. Por favor, tente novamente.', true);
            }
        }
    });
})();
