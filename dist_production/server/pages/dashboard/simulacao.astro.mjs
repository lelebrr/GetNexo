import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from "../../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$DashboardLayout } from "../../assets/DashboardLayout-DSSr717x.js";
/* empty css                                       */
import { renderers } from "../../renderers.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Simulacao = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "AI Simulation Lab | OmniNexo", "data-astro-cid-oyaf7hrq": true }, { "default": ($$result2) => renderTemplate(_a || (_a = __template([" ", `<div style="display:flex; flex-direction:column; gap:2.5rem;" data-astro-cid-oyaf7hrq> <div class="glass-panel" style="padding:2.5rem; background:linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(167, 139, 250, 0.05)); border-color: rgba(0, 212, 255, 0.2);" data-astro-cid-oyaf7hrq> <h2 style="font-size:2.5rem; font-weight:900; color:white; margin:0;" class="text-gradient" data-astro-cid-oyaf7hrq>AI Simulation Lab 🧪</h2> <p style="color:#94a3b8; margin:0.5rem 0 0; font-size:1.1rem;" data-astro-cid-oyaf7hrq>Teste scripts e comportamentos da Ara antes de enviar para produção.</p> </div> <div style="display:grid; grid-template-columns: 1fr 1.2fr; gap:2rem; height: 700px;" data-astro-cid-oyaf7hrq> <!-- Controls --> <div class="glass-panel" style="padding:2.5rem; display:flex; flex-direction:column; gap:2rem; overflow-y:auto;" data-astro-cid-oyaf7hrq> <div data-astro-cid-oyaf7hrq> <h3 style="margin:0 0 1rem; color:var(--neon-blue);" data-astro-cid-oyaf7hrq>Configuração do Cenário</h3> <div style="display:flex; flex-direction:column; gap:1.5rem;" data-astro-cid-oyaf7hrq> <div data-astro-cid-oyaf7hrq> <label style="display:block; font-size:0.8rem; font-weight:800; color:#64748b; margin-bottom:0.8rem; text-transform:uppercase;" data-astro-cid-oyaf7hrq>Tipo de Lead</label> <select class="sim-input" data-astro-cid-oyaf7hrq> <option data-astro-cid-oyaf7hrq>Novo Lead (Frio)</option> <option data-astro-cid-oyaf7hrq>Cliente Recorrente</option> <option data-astro-cid-oyaf7hrq>Lead Crítico (Reclamação)</option> <option data-astro-cid-oyaf7hrq>Interessado em Preço</option> </select> </div> <div data-astro-cid-oyaf7hrq> <label style="display:block; font-size:0.8rem; font-weight:800; color:#64748b; margin-bottom:0.8rem; text-transform:uppercase;" data-astro-cid-oyaf7hrq>Contexto Adicional (Override)</label> <textarea class="sim-textarea" placeholder="Ex: O cliente já comprou 2x e está em dúvida sobre o frete para o Nordeste..." data-astro-cid-oyaf7hrq></textarea> </div> <div style="padding:1rem; background:rgba(255,255,255,0.03); border-radius:12px; border:1px solid rgba(255,255,255,0.05);" data-astro-cid-oyaf7hrq> <div style="display:flex; justify-content:space-between; align-items:center;" data-astro-cid-oyaf7hrq> <span style="font-weight:700; font-size:0.9rem;" data-astro-cid-oyaf7hrq>Monitoramento de Sinapse</span> <span style="color:var(--neon-green); font-size:0.75rem; font-weight:900;" data-astro-cid-oyaf7hrq>ATIVO</span> </div> <div style="margin-top:1rem; font-size:0.75rem; color:#64748b; line-height:1.5;" data-astro-cid-oyaf7hrq>
A Ara simulará o processamento real usando o modelo **Gemini 2.0 Flash**.
</div> </div> <button id="reset-sim" style="width:100%; padding:1rem; background:rgba(255,0,0,0.05); color:#fca5a5; border:1px solid rgba(255,0,0,0.1); border-radius:10px; font-weight:700; cursor:pointer;" data-astro-cid-oyaf7hrq>Limpar Simulação</button> </div> </div> </div> <!-- Chat Sandbox --> <div class="glass-panel" style="padding:0; position:relative; display:flex; flex-direction:column; border-color: rgba(0, 212, 255, 0.1);" data-astro-cid-oyaf7hrq> <div style="padding:1.5rem; border-bottom:1px solid rgba(255,255,255,0.05); background:rgba(0,0,0,0.2); display:flex; justify-content:space-between;" data-astro-cid-oyaf7hrq> <span style="font-weight:800; color:white;" data-astro-cid-oyaf7hrq>Sandbox: Conversa com Ara</span> <span style="color:var(--neon-blue); font-size:0.7rem; font-weight:900;" data-astro-cid-oyaf7hrq>MODO TESTE</span> </div> <div id="sim-messages" style="flex:1; padding:2rem; overflow-y:auto; display:flex; flex-direction:column; gap:1rem;" data-astro-cid-oyaf7hrq> <!-- Sim messages --> <div class="sim-msg system" data-astro-cid-oyaf7hrq>Simulação Iniciada. A Ara aguarda seu input como lead.</div> </div> <div style="padding:2rem; border-top:1px solid rgba(255,255,255,0.05);" data-astro-cid-oyaf7hrq> <div style="position:relative;" data-astro-cid-oyaf7hrq> <input type="text" id="sim-input-box" placeholder="Digite como um lead: 'Olá, qual o valor do frete?'" style="width:100%; padding:1.2rem; background:rgba(0,0,0,0.4); border:1px solid rgba(255,255,255,0.1); border-radius:12px; color:white; outline:none;" data-astro-cid-oyaf7hrq> <button id="send-sim" style="position:absolute; right:10px; top:50%; transform:translateY(-50%); background:var(--neon-blue); color:black; border:none; padding:8px 20px; border-radius:8px; font-weight:900; cursor:pointer;" data-astro-cid-oyaf7hrq>ENVIAR</button> </div> </div> </div> </div> </div>  <script>
      const msgBox = document.getElementById('sim-messages');
      const inputBox = document.getElementById('sim-input-box');
      const sendBtn = document.getElementById('send-sim');

      function addMsg(text, type) {
          const div = document.createElement('div');
          div.className = \`sim-msg \${type}\`;
          div.innerHTML = text;
          msgBox.appendChild(div);
          msgBox.scrollTop = msgBox.scrollHeight;
      }

      async function handleSend() {
          const text = inputBox.value.trim();
          if (!text) return;

          addMsg(text, 'user');
          inputBox.value = '';
          
          // Simulation delay
          setTimeout(() => {
              const loading = document.createElement('div');
              loading.className = 'sim-msg agent';
              loading.innerText = 'Processando sinapse...';
              msgBox.appendChild(loading);
              
              setTimeout(() => {
                  loading.remove();
                  addMsg('Para te dar uma resposta precisa, preciso entender se você já conferiu nosso catálogo oficial. Posso te enviar o link agora?', 'agent');
              }, 1500);
          }, 300);
      }

      sendBtn.onclick = handleSend;
      inputBox.onkeydown = (e) => e.key === 'Enter' && handleSend();
      document.getElementById('reset-sim').onclick = () => { msgBox.innerHTML = '<div class="sim-msg system">Simulação Iniciada. A Ara aguarda seu input como lead.</div>'; };
  <\/script> `], [" ", `<div style="display:flex; flex-direction:column; gap:2.5rem;" data-astro-cid-oyaf7hrq> <div class="glass-panel" style="padding:2.5rem; background:linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(167, 139, 250, 0.05)); border-color: rgba(0, 212, 255, 0.2);" data-astro-cid-oyaf7hrq> <h2 style="font-size:2.5rem; font-weight:900; color:white; margin:0;" class="text-gradient" data-astro-cid-oyaf7hrq>AI Simulation Lab 🧪</h2> <p style="color:#94a3b8; margin:0.5rem 0 0; font-size:1.1rem;" data-astro-cid-oyaf7hrq>Teste scripts e comportamentos da Ara antes de enviar para produção.</p> </div> <div style="display:grid; grid-template-columns: 1fr 1.2fr; gap:2rem; height: 700px;" data-astro-cid-oyaf7hrq> <!-- Controls --> <div class="glass-panel" style="padding:2.5rem; display:flex; flex-direction:column; gap:2rem; overflow-y:auto;" data-astro-cid-oyaf7hrq> <div data-astro-cid-oyaf7hrq> <h3 style="margin:0 0 1rem; color:var(--neon-blue);" data-astro-cid-oyaf7hrq>Configuração do Cenário</h3> <div style="display:flex; flex-direction:column; gap:1.5rem;" data-astro-cid-oyaf7hrq> <div data-astro-cid-oyaf7hrq> <label style="display:block; font-size:0.8rem; font-weight:800; color:#64748b; margin-bottom:0.8rem; text-transform:uppercase;" data-astro-cid-oyaf7hrq>Tipo de Lead</label> <select class="sim-input" data-astro-cid-oyaf7hrq> <option data-astro-cid-oyaf7hrq>Novo Lead (Frio)</option> <option data-astro-cid-oyaf7hrq>Cliente Recorrente</option> <option data-astro-cid-oyaf7hrq>Lead Crítico (Reclamação)</option> <option data-astro-cid-oyaf7hrq>Interessado em Preço</option> </select> </div> <div data-astro-cid-oyaf7hrq> <label style="display:block; font-size:0.8rem; font-weight:800; color:#64748b; margin-bottom:0.8rem; text-transform:uppercase;" data-astro-cid-oyaf7hrq>Contexto Adicional (Override)</label> <textarea class="sim-textarea" placeholder="Ex: O cliente já comprou 2x e está em dúvida sobre o frete para o Nordeste..." data-astro-cid-oyaf7hrq></textarea> </div> <div style="padding:1rem; background:rgba(255,255,255,0.03); border-radius:12px; border:1px solid rgba(255,255,255,0.05);" data-astro-cid-oyaf7hrq> <div style="display:flex; justify-content:space-between; align-items:center;" data-astro-cid-oyaf7hrq> <span style="font-weight:700; font-size:0.9rem;" data-astro-cid-oyaf7hrq>Monitoramento de Sinapse</span> <span style="color:var(--neon-green); font-size:0.75rem; font-weight:900;" data-astro-cid-oyaf7hrq>ATIVO</span> </div> <div style="margin-top:1rem; font-size:0.75rem; color:#64748b; line-height:1.5;" data-astro-cid-oyaf7hrq>
A Ara simulará o processamento real usando o modelo **Gemini 2.0 Flash**.
</div> </div> <button id="reset-sim" style="width:100%; padding:1rem; background:rgba(255,0,0,0.05); color:#fca5a5; border:1px solid rgba(255,0,0,0.1); border-radius:10px; font-weight:700; cursor:pointer;" data-astro-cid-oyaf7hrq>Limpar Simulação</button> </div> </div> </div> <!-- Chat Sandbox --> <div class="glass-panel" style="padding:0; position:relative; display:flex; flex-direction:column; border-color: rgba(0, 212, 255, 0.1);" data-astro-cid-oyaf7hrq> <div style="padding:1.5rem; border-bottom:1px solid rgba(255,255,255,0.05); background:rgba(0,0,0,0.2); display:flex; justify-content:space-between;" data-astro-cid-oyaf7hrq> <span style="font-weight:800; color:white;" data-astro-cid-oyaf7hrq>Sandbox: Conversa com Ara</span> <span style="color:var(--neon-blue); font-size:0.7rem; font-weight:900;" data-astro-cid-oyaf7hrq>MODO TESTE</span> </div> <div id="sim-messages" style="flex:1; padding:2rem; overflow-y:auto; display:flex; flex-direction:column; gap:1rem;" data-astro-cid-oyaf7hrq> <!-- Sim messages --> <div class="sim-msg system" data-astro-cid-oyaf7hrq>Simulação Iniciada. A Ara aguarda seu input como lead.</div> </div> <div style="padding:2rem; border-top:1px solid rgba(255,255,255,0.05);" data-astro-cid-oyaf7hrq> <div style="position:relative;" data-astro-cid-oyaf7hrq> <input type="text" id="sim-input-box" placeholder="Digite como um lead: 'Olá, qual o valor do frete?'" style="width:100%; padding:1.2rem; background:rgba(0,0,0,0.4); border:1px solid rgba(255,255,255,0.1); border-radius:12px; color:white; outline:none;" data-astro-cid-oyaf7hrq> <button id="send-sim" style="position:absolute; right:10px; top:50%; transform:translateY(-50%); background:var(--neon-blue); color:black; border:none; padding:8px 20px; border-radius:8px; font-weight:900; cursor:pointer;" data-astro-cid-oyaf7hrq>ENVIAR</button> </div> </div> </div> </div> </div>  <script>
      const msgBox = document.getElementById('sim-messages');
      const inputBox = document.getElementById('sim-input-box');
      const sendBtn = document.getElementById('send-sim');

      function addMsg(text, type) {
          const div = document.createElement('div');
          div.className = \\\`sim-msg \\\${type}\\\`;
          div.innerHTML = text;
          msgBox.appendChild(div);
          msgBox.scrollTop = msgBox.scrollHeight;
      }

      async function handleSend() {
          const text = inputBox.value.trim();
          if (!text) return;

          addMsg(text, 'user');
          inputBox.value = '';
          
          // Simulation delay
          setTimeout(() => {
              const loading = document.createElement('div');
              loading.className = 'sim-msg agent';
              loading.innerText = 'Processando sinapse...';
              msgBox.appendChild(loading);
              
              setTimeout(() => {
                  loading.remove();
                  addMsg('Para te dar uma resposta precisa, preciso entender se você já conferiu nosso catálogo oficial. Posso te enviar o link agora?', 'agent');
              }, 1500);
          }, 300);
      }

      sendBtn.onclick = handleSend;
      inputBox.onkeydown = (e) => e.key === 'Enter' && handleSend();
      document.getElementById('reset-sim').onclick = () => { msgBox.innerHTML = '<div class="sim-msg system">Simulação Iniciada. A Ara aguarda seu input como lead.</div>'; };
  <\/script> `])), maybeRenderHead()) })}`;
}, "/home/lele/usenexo/getnexo-site/src/pages/dashboard/simulacao.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/dashboard/simulacao.astro";
const $$url = "/dashboard/simulacao";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Simulacao,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
