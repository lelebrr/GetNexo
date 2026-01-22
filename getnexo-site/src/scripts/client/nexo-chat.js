/**
 * NexoChat Web Component
 * High-performance DeepSeek integration with streaming, retries, and local fallback.
 */
import { localAI } from './local-fallback.js';

class NexoChat extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.apiBase = window.location.hostname === 'localhost' ? 'http://localhost:3006' : 'https://api.getnexo.com.br';
        this.history = [];
        this.trialMode = true; // Emulating 36h trial logic
        this.debounceTimeout = null;
        this.cacheTTL = 30 * 60 * 1000; // 30 mins
        this.isStreaming = false;
    }

    connectedCallback() {
        this.render();
        this.setupListeners();
        console.log("GetNexo → Chat Component Initialized");
    }

    // --- CACHE LOGIC ---
    getCache(message) {
        const cached = localStorage.getItem(`nexo_cache_${btoa(message.substring(0, 20))}`);
        if (cached) {
            const { content, expires } = JSON.parse(cached);
            if (Date.now() < expires) return content;
        }
        return null;
    }

    setCache(message, content) {
        const data = { content, expires: Date.now() + this.cacheTTL };
        localStorage.setItem(`nexo_cache_${btoa(message.substring(0, 20))}`, JSON.stringify(data));
    }

    // --- MONITORING ---
    async sendPing(model, timing, error = false) {
        try {
            await fetch(`${this.apiBase}/api/monitor/ping`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    error,
                    model,
                    timing,
                    ip: 'client-side', // Backend will detect real IP
                    timestamp: new Date().toISOString()
                })
            });
        } catch (e) {
            // Silently fail monitoring if network is down
        }
    }

    // --- CHAT LOGIC ---
    async handleSend(message) {
        if (!message.trim() || this.isStreaming) return;

        this.addMessage('user', message);
        this.clearInput();

        // 1. Check Cache
        const cached = this.getCache(message);
        if (cached) {
            this.addMessage('assistant', cached);
            return;
        }

        // 2. Performance Debounce is handled by the UI listener call
        this.isStreaming = true;
        const startTime = Date.now();
        const responsePlaceholder = this.addMessage('assistant', '', true);

        try {
            await this.requestWithRetry(message, responsePlaceholder, startTime);
        } catch (err) {
            console.error('[NEXO CHAT] All retries failed. Using local fallback.');
            const localResponse = await localAI.generateResponse(message);
            this.updateMessage(responsePlaceholder, localResponse);
            this.sendPing('local-fallback', Date.now() - startTime, true);
        } finally {
            this.isStreaming = false;
        }
    }

    async requestWithRetry(message, placeholder, startTime, attempt = 1) {
        const backoff = [500, 1000, 2000];

        try {
            const response = await fetch(`${this.apiBase}/api/chat/stream`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message, history: this.history, trialMode: this.trialMode })
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullContent = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') continue;
                        try {
                            const parsed = JSON.parse(data);
                            if (parsed.content) {
                                fullContent += parsed.content;
                                this.updateMessage(placeholder, fullContent);
                            }
                        } catch (e) { }
                    }
                }
            }

            this.setCache(message, fullContent);
            this.history.push({ role: 'user', content: message });
            this.history.push({ role: 'assistant', content: fullContent });
            this.sendPing('deepseek', Date.now() - startTime);

        } catch (err) {
            if (attempt <= 3) {
                console.warn(`[NEXO CHAT] Attempt ${attempt} failed: ${err.message}. Retrying...`);
                await new Promise(r => setTimeout(r, backoff[attempt - 1]));
                return this.requestWithRetry(message, placeholder, startTime, attempt + 1);
            }
            throw err;
        }
    }

    // --- UI HELPERS ---
    addMessage(role, content, isStreaming = false) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${role}`;
        msgDiv.innerText = content;
        if (isStreaming) msgDiv.classList.add('typing');
        this.shadowRoot.querySelector('#chat-body').appendChild(msgDiv);
        this.scrollToBottom();
        return msgDiv;
    }

    updateMessage(element, content) {
        element.innerText = content;
        element.classList.remove('typing');
        this.scrollToBottom();
    }

    clearInput() {
        this.shadowRoot.querySelector('#chat-input').value = '';
    }

    scrollToBottom() {
        const body = this.shadowRoot.querySelector('#chat-body');
        body.scrollTop = body.scrollHeight;
    }

    setupListeners() {
        const input = this.shadowRoot.querySelector('#chat-input');
        const btn = this.shadowRoot.querySelector('#send-btn');

        const trigger = () => {
            if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
            this.debounceTimeout = setTimeout(() => {
                this.handleSend(input.value);
            }, 300);
        };

        btn.addEventListener('click', () => this.handleSend(input.value));
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSend(input.value);
        });
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host { display: block; font-family: 'Inter', sans-serif; }
                #chat-container { width: 400px; height: 500px; background: #0f172a; border-radius: 20px; display: flex; flex-direction: column; overflow: hidden; border: 1px solid #1e293b; color: white; box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1); }
                #chat-header { background: #1e293b; padding: 1rem; border-bottom: 1px solid #334155; display: flex; align-items: center; gap: 10px; }
                #chat-body { flex: 1; overflow-y: auto; padding: 1rem; display: flex; flex-direction: column; gap: 10px; scroll-behavior: smooth; }
                .message { max-width: 80%; padding: 0.8rem 1rem; border-radius: 12px; font-size: 0.9rem; line-height: 1.4; }
                .user { align-self: flex-end; background: #00d4ff; color: black; border-bottom-right-radius: 2px; }
                .assistant { align-self: flex-start; background: #1e293b; color: #e5e7eb; border-bottom-left-radius: 2px; border: 1px solid #334155; }
                .typing::after { content: '...'; animation: blink 1s infinite; }
                @keyframes blink { 0%, 100% { opacity: 0; } 50% { opacity: 1; } }
                #chat-footer { padding: 1rem; background: #1e293b; display: flex; gap: 10px; }
                input { flex: 1; background: #0f172a; border: 1px solid #334155; border-radius: 50px; padding: 0.6rem 1.2rem; color: white; outline: none; }
                input:focus { border-color: #00d4ff; }
                button { background: #00d4ff; border: none; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
                button:hover { transform: scale(1.1); }
            </style>
            <div id="chat-container">
                <div id="chat-header">
                    <div style="width:10px; height:10px; background:#00ff9d; border-radius:50%; box-shadow: 0 0 10px #00ff9d;"></div>
                    <strong>GetNexo Assistant</strong>
                </div>
                <div id="chat-body">
                    <div class="message assistant">Olá! Como posso ajudar você hoje?</div>
                </div>
                <div id="chat-footer">
                    <input id="chat-input" placeholder="Digite sua mensagem..." autocomplete="off">
                    <button id="send-btn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
                    </button>
                </div>
            </div>
        `;
    }
}

customElements.define('nexo-chat', NexoChat);
