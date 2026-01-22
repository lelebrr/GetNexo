import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from "../../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$DashboardLayout } from "../../assets/DashboardLayout-DSSr717x.js";
/* empty css                                     */
import { renderers } from "../../renderers.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Suporte = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "Suporte & Logs | OmniNexo", "data-astro-cid-pqqirlge": true }, { "default": ($$result2) => renderTemplate(_a || (_a = __template([" ", `<div style="display:flex; gap:2rem; height:calc(100vh - 160px);" data-astro-cid-pqqirlge> <!-- FAQ & Support Chat --> <div style="flex:1; display:flex; flex-direction:column; gap:1.5rem;" data-astro-cid-pqqirlge> <div class="glass-panel" style="padding:2rem;" data-astro-cid-pqqirlge> <h2 style="margin:0 0 1.5rem; font-size:1.5rem; color:white; font-weight:800;" data-astro-cid-pqqirlge>Central de Ajuda</h2> <div style="margin-bottom:2rem;" data-astro-cid-pqqirlge> <div class="faq-item" data-astro-cid-pqqirlge> <div class="faq-q" data-astro-cid-pqqirlge>Como conectar meu WhatsApp?</div> <div class="faq-a" data-astro-cid-pqqirlge>Vá até a aba "Instâncias", clique em "Nova Instância" e escaneie o QR Code.</div> </div> <div class="faq-item" data-astro-cid-pqqirlge> <div class="faq-q" data-astro-cid-pqqirlge>O que é a "Taxa de Conversão IA"?</div> <div class="faq-a" data-astro-cid-pqqirlge>É a porcentagem de leads que a IA conseguiu levar até o checkout ou agendamento.</div> </div> <div class="faq-item" data-astro-cid-pqqirlge> <div class="faq-q" data-astro-cid-pqqirlge>Como mudar meu plano?</div> <div class="faq-a" data-astro-cid-pqqirlge>Acesse "Faturamento" e escolha o plano desejado. O upgrade é imediato.</div> </div> </div> <div style="height:250px; background:rgba(0,0,0,0.2); border-radius:12px; display:flex; flex-direction:column; border:1px solid rgba(255,255,255,0.05);" data-astro-cid-pqqirlge> <div style="padding:10px; border-bottom:1px solid rgba(255,255,255,0.05); font-weight:700; color:#94a3b8; font-size:0.8rem;" data-astro-cid-pqqirlge>Chat com Especialista (Online)</div> <div id="chat-msgs" style="flex:1; padding:10px; overflow-y:auto; font-size:0.9rem;" data-astro-cid-pqqirlge> <div style="margin-bottom:8px;" data-astro-cid-pqqirlge><span style="color:var(--neon-green); font-weight:700;" data-astro-cid-pqqirlge>Suporte:</span> Olá! Como posso ajudar hoje?</div> </div> <div style="padding:10px; display:flex; gap:10px;" data-astro-cid-pqqirlge> <input type="text" id="chat-input" placeholder="Digite sua dúvida..." style="flex:1; background:rgba(255,255,255,0.05); border:none; padding:8px; color:white; border-radius:6px; outline:none;" data-astro-cid-pqqirlge> <button onclick="sendMsg()" style="background:var(--neon-blue); color:black; border:none; padding:8px 16px; border-radius:6px; font-weight:700; cursor:pointer;" data-astro-cid-pqqirlge>Enviar</button> </div> </div> </div> </div> <!-- System Logs --> <div class="glass-panel" style="flex:1; display:flex; flex-direction:column; background:#000;" data-astro-cid-pqqirlge> <div style="padding:1.5rem; border-bottom:1px solid rgba(255,255,255,0.1); display:flex; justify-content:space-between; align-items:center;" data-astro-cid-pqqirlge> <h3 style="margin:0; color:white; font-family:'JetBrains Mono';" data-astro-cid-pqqirlge>System Logs</h3> <span style="font-size:0.7rem; color:#10b981;" data-astro-cid-pqqirlge>● LIVE STREAM</span> </div> <div id="log-container" style="flex:1; overflow-y:auto; padding:1.5rem; font-family:'JetBrains Mono', monospace; font-size:0.8rem; color:#a3a3a3; display:flex; flex-direction:column; gap:6px;" data-astro-cid-pqqirlge> <!-- Logs Injected Here --> </div> </div> </div>  <script>
        // Log Stream Simulation
        const logs = document.getElementById('log-container');
        const types = [
            { type: 'INFO', color: '#3b82f6' },
            { type: 'SUCCESS', color: '#10b981' },
            { type: 'WARN', color: '#facc15' },
            { type: 'ERROR', color: '#ef4444' }
        ];

        function addLog() {
            const now = new Date().toLocaleTimeString();
            const t = types[Math.floor(Math.random() * types.length)];
            const msgs = [
                'Webhook event received: message_update',
                'AI Processing started for Session #9281',
                'Connection latency spike detected (120ms)',
                'Database backup completed',
                'Rate limit triggered: 192.168.1.5'
            ];
            const msg = msgs[Math.floor(Math.random() * msgs.length)];

            const line = document.createElement('div');
            line.innerHTML = \`<span style="opacity:0.5;">[\${now}]</span> <span style="color:\${t.color}; font-weight:700;">\${t.type}</span> \${msg}\`;
            logs.appendChild(line);
            logs.scrollTop = logs.scrollHeight;
            
            if (logs.children.length > 50) logs.removeChild(logs.firstChild);
        }

        setInterval(addLog, 2000);
        for(let i=0; i<10; i++) addLog(); // Initial fill

        // Chat Logic
        const chat = document.getElementById('chat-msgs');
        const input = document.getElementById('chat-input');

        window.sendMsg = () => {
            const txt = input.value;
            if(!txt) return;
            
            chat.innerHTML += \`<div style="margin-bottom:8px; text-align:right;"><span style="color:#fff; font-weight:700;">Você:</span> \${txt}</div>\`;
            input.value = '';
            chat.scrollTop = chat.scrollHeight;

            setTimeout(() => {
                chat.innerHTML += \`<div style="margin-bottom:8px;"><span style="color:var(--neon-green); font-weight:700;">Suporte:</span> Um atendente humano responderá em breve. (Ticket #\${Math.floor(Math.random()*9000)})</div>\`;
                chat.scrollTop = chat.scrollHeight;
            }, 1000);
        };
    <\/script> `], [" ", `<div style="display:flex; gap:2rem; height:calc(100vh - 160px);" data-astro-cid-pqqirlge> <!-- FAQ & Support Chat --> <div style="flex:1; display:flex; flex-direction:column; gap:1.5rem;" data-astro-cid-pqqirlge> <div class="glass-panel" style="padding:2rem;" data-astro-cid-pqqirlge> <h2 style="margin:0 0 1.5rem; font-size:1.5rem; color:white; font-weight:800;" data-astro-cid-pqqirlge>Central de Ajuda</h2> <div style="margin-bottom:2rem;" data-astro-cid-pqqirlge> <div class="faq-item" data-astro-cid-pqqirlge> <div class="faq-q" data-astro-cid-pqqirlge>Como conectar meu WhatsApp?</div> <div class="faq-a" data-astro-cid-pqqirlge>Vá até a aba "Instâncias", clique em "Nova Instância" e escaneie o QR Code.</div> </div> <div class="faq-item" data-astro-cid-pqqirlge> <div class="faq-q" data-astro-cid-pqqirlge>O que é a "Taxa de Conversão IA"?</div> <div class="faq-a" data-astro-cid-pqqirlge>É a porcentagem de leads que a IA conseguiu levar até o checkout ou agendamento.</div> </div> <div class="faq-item" data-astro-cid-pqqirlge> <div class="faq-q" data-astro-cid-pqqirlge>Como mudar meu plano?</div> <div class="faq-a" data-astro-cid-pqqirlge>Acesse "Faturamento" e escolha o plano desejado. O upgrade é imediato.</div> </div> </div> <div style="height:250px; background:rgba(0,0,0,0.2); border-radius:12px; display:flex; flex-direction:column; border:1px solid rgba(255,255,255,0.05);" data-astro-cid-pqqirlge> <div style="padding:10px; border-bottom:1px solid rgba(255,255,255,0.05); font-weight:700; color:#94a3b8; font-size:0.8rem;" data-astro-cid-pqqirlge>Chat com Especialista (Online)</div> <div id="chat-msgs" style="flex:1; padding:10px; overflow-y:auto; font-size:0.9rem;" data-astro-cid-pqqirlge> <div style="margin-bottom:8px;" data-astro-cid-pqqirlge><span style="color:var(--neon-green); font-weight:700;" data-astro-cid-pqqirlge>Suporte:</span> Olá! Como posso ajudar hoje?</div> </div> <div style="padding:10px; display:flex; gap:10px;" data-astro-cid-pqqirlge> <input type="text" id="chat-input" placeholder="Digite sua dúvida..." style="flex:1; background:rgba(255,255,255,0.05); border:none; padding:8px; color:white; border-radius:6px; outline:none;" data-astro-cid-pqqirlge> <button onclick="sendMsg()" style="background:var(--neon-blue); color:black; border:none; padding:8px 16px; border-radius:6px; font-weight:700; cursor:pointer;" data-astro-cid-pqqirlge>Enviar</button> </div> </div> </div> </div> <!-- System Logs --> <div class="glass-panel" style="flex:1; display:flex; flex-direction:column; background:#000;" data-astro-cid-pqqirlge> <div style="padding:1.5rem; border-bottom:1px solid rgba(255,255,255,0.1); display:flex; justify-content:space-between; align-items:center;" data-astro-cid-pqqirlge> <h3 style="margin:0; color:white; font-family:'JetBrains Mono';" data-astro-cid-pqqirlge>System Logs</h3> <span style="font-size:0.7rem; color:#10b981;" data-astro-cid-pqqirlge>● LIVE STREAM</span> </div> <div id="log-container" style="flex:1; overflow-y:auto; padding:1.5rem; font-family:'JetBrains Mono', monospace; font-size:0.8rem; color:#a3a3a3; display:flex; flex-direction:column; gap:6px;" data-astro-cid-pqqirlge> <!-- Logs Injected Here --> </div> </div> </div>  <script>
        // Log Stream Simulation
        const logs = document.getElementById('log-container');
        const types = [
            { type: 'INFO', color: '#3b82f6' },
            { type: 'SUCCESS', color: '#10b981' },
            { type: 'WARN', color: '#facc15' },
            { type: 'ERROR', color: '#ef4444' }
        ];

        function addLog() {
            const now = new Date().toLocaleTimeString();
            const t = types[Math.floor(Math.random() * types.length)];
            const msgs = [
                'Webhook event received: message_update',
                'AI Processing started for Session #9281',
                'Connection latency spike detected (120ms)',
                'Database backup completed',
                'Rate limit triggered: 192.168.1.5'
            ];
            const msg = msgs[Math.floor(Math.random() * msgs.length)];

            const line = document.createElement('div');
            line.innerHTML = \\\`<span style="opacity:0.5;">[\\\${now}]</span> <span style="color:\\\${t.color}; font-weight:700;">\\\${t.type}</span> \\\${msg}\\\`;
            logs.appendChild(line);
            logs.scrollTop = logs.scrollHeight;
            
            if (logs.children.length > 50) logs.removeChild(logs.firstChild);
        }

        setInterval(addLog, 2000);
        for(let i=0; i<10; i++) addLog(); // Initial fill

        // Chat Logic
        const chat = document.getElementById('chat-msgs');
        const input = document.getElementById('chat-input');

        window.sendMsg = () => {
            const txt = input.value;
            if(!txt) return;
            
            chat.innerHTML += \\\`<div style="margin-bottom:8px; text-align:right;"><span style="color:#fff; font-weight:700;">Você:</span> \\\${txt}</div>\\\`;
            input.value = '';
            chat.scrollTop = chat.scrollHeight;

            setTimeout(() => {
                chat.innerHTML += \\\`<div style="margin-bottom:8px;"><span style="color:var(--neon-green); font-weight:700;">Suporte:</span> Um atendente humano responderá em breve. (Ticket #\\\${Math.floor(Math.random()*9000)})</div>\\\`;
                chat.scrollTop = chat.scrollHeight;
            }, 1000);
        };
    <\/script> `])), maybeRenderHead()) })}`;
}, "/home/lele/usenexo/getnexo-site/src/pages/dashboard/suporte.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/dashboard/suporte.astro";
const $$url = "/dashboard/suporte";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Suporte,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
