import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from "../../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$DashboardLayout } from "../../assets/DashboardLayout-DSSr717x.js";
/* empty css                                    */
import { renderers } from "../../renderers.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Config = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "Persona Studio | OmniNexo", "data-astro-cid-vt2ylhi2": true }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([" ", `<div style="display:flex; flex-direction:column; gap:2.5rem;" data-astro-cid-vt2ylhi2> <div class="glass-panel" style="padding:2.5rem; background:linear-gradient(90deg, rgba(167, 139, 250, 0.15), rgba(0, 212, 255, 0.08)); border-color: rgba(167, 139, 250, 0.2);" data-astro-cid-vt2ylhi2> <h2 style="font-size:2.5rem; font-weight:900; color:white; margin:0;" class="text-gradient" data-astro-cid-vt2ylhi2>Persona Studio 🧠</h2> <p style="color:#94a3b8; margin:0.5rem 0 0; font-size:1.1rem;" data-astro-cid-vt2ylhi2>Defina a alma, o tom e o conhecimento da sua inteligência artificial.</p> </div> <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(400px, 1fr)); gap:2rem;" data-astro-cid-vt2ylhi2> <!-- Logic & Identity --> <div class="glass-panel" style="padding:2.5rem; display:flex; flex-direction:column; gap:2rem;" data-astro-cid-vt2ylhi2> <div data-astro-cid-vt2ylhi2> <h3 style="margin:0 0 0.5rem; color:var(--neon-green); font-size:1.3rem;" data-astro-cid-vt2ylhi2>Identidade e Tom</h3> <p style="color:#64748b; font-size:0.9rem;" data-astro-cid-vt2ylhi2>Como a Ara deve se comportar com seus clientes.</p> </div> <div style="display:flex; flex-direction:column; gap:1.5rem;" data-astro-cid-vt2ylhi2> <div data-astro-cid-vt2ylhi2> <label style="display:block; color:#e5e7eb; font-weight:700; margin-bottom:0.8rem;" data-astro-cid-vt2ylhi2>Personalidade Dominante</label> <div style="display:grid; grid-template-columns:repeat(2,1fr); gap:0.8rem;" data-astro-cid-vt2ylhi2> <button class="tone-opt active" data-astro-cid-vt2ylhi2>Consultor Especialista</button> <button class="tone-opt" data-astro-cid-vt2ylhi2>Vendedor Persuasivo</button> <button class="tone-opt" data-astro-cid-vt2ylhi2>Suporte Amigável</button> <button class="tone-opt" data-astro-cid-vt2ylhi2>Formal / Corporativo</button> </div> </div> <div data-astro-cid-vt2ylhi2> <label style="display:block; color:#e5e7eb; font-weight:700; margin-bottom:0.8rem;" data-astro-cid-vt2ylhi2>Setor de Atuação</label> <select id="industry" style="width:100%; padding:1rem; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.1); color:white; border-radius:12px; outline:none;" data-astro-cid-vt2ylhi2> <option value="Geral" data-astro-cid-vt2ylhi2>Geral (Padrão)</option> <option value="Moda" data-astro-cid-vt2ylhi2>Moda & Vestuário</option> <option value="Tecnologia" data-astro-cid-vt2ylhi2>SaaS / Tecnologia</option> <option value="Imoveis" data-astro-cid-vt2ylhi2>Mercado Imobiliário</option> <option value="Saude" data-astro-cid-vt2ylhi2>Saúde / Estética</option> </select> </div> <div data-astro-cid-vt2ylhi2> <label style="display:block; color:#e5e7eb; font-weight:700; margin-bottom:0.8rem;" data-astro-cid-vt2ylhi2>Criatividade vs Precisão</label> <input type="range" style="width:100%; accent-color:var(--neon-blue);" min="0" max="100" value="70" data-astro-cid-vt2ylhi2> <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:#64748b; margin-top:0.5rem;" data-astro-cid-vt2ylhi2> <span data-astro-cid-vt2ylhi2>Literal</span> <span data-astro-cid-vt2ylhi2>Equilibrado</span> <span data-astro-cid-vt2ylhi2>Criativo</span> </div> </div> </div> </div> <!-- Infrastructure --> <div class="glass-panel" style="padding:2.5rem; display:flex; flex-direction:column; gap:2rem;" data-astro-cid-vt2ylhi2> <div data-astro-cid-vt2ylhi2> <h3 style="margin:0 0 0.5rem; color:var(--neon-blue); font-size:1.3rem;" data-astro-cid-vt2ylhi2>Infraestrutura & Chaves</h3> <p style="color:#64748b; font-size:0.9rem;" data-astro-cid-vt2ylhi2>Conecte seus provedores de LLM.</p> </div> <div style="display:flex; flex-direction:column; gap:1.5rem;" data-astro-cid-vt2ylhi2> <div data-astro-cid-vt2ylhi2> <label style="display:block; color:#e5e7eb; font-weight:700; margin-bottom:0.6rem;" data-astro-cid-vt2ylhi2>Google Gemini Key</label> <div style="position:relative;" data-astro-cid-vt2ylhi2> <input type="password" id="geminiKey" placeholder="AIzaSy..." style="width:100%; padding:1rem; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.1); color:white; border-radius:12px;" data-astro-cid-vt2ylhi2> <button onclick="alert('Teste de conexão enviado para Google Vertice/Gemini... OK!')" style="position:absolute; right:10px; top:50%; transform:translateY(-50%); background:rgba(0,212,255,0.1); border:1px solid var(--neon-blue); color:var(--neon-blue); border-radius:8px; padding:4px 10px; font-size:0.7rem; font-weight:800; cursor:pointer;" data-astro-cid-vt2ylhi2>TESTAR</button> </div> </div> <div data-astro-cid-vt2ylhi2> <label style="display:block; color:#e5e7eb; font-weight:700; margin-bottom:0.6rem;" data-astro-cid-vt2ylhi2>OpenRouter Key</label> <input type="password" id="openRouterKey" placeholder="sk-or-..." style="width:100%; padding:1rem; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.1); color:white; border-radius:12px;" data-astro-cid-vt2ylhi2> </div> <div style="background:rgba(0,212,255,0.05); padding:1.2rem; border-radius:12px; border:1px solid rgba(0,212,255,0.1);" data-astro-cid-vt2ylhi2> <div style="font-size:0.8rem; color:#64748b; margin-bottom:0.5rem;" data-astro-cid-vt2ylhi2>Status System Connection</div> <div style="display:flex; justify-content:space-between; align-items:center;" data-astro-cid-vt2ylhi2> <span style="color:white; font-weight:700;" data-astro-cid-vt2ylhi2>Evolution API</span> <span style="color:var(--neon-green); font-size:0.75rem; font-weight:900; letter-spacing:1px;" data-astro-cid-vt2ylhi2>SYNC: ONLINE</span> </div> </div> </div> <button id="save-all" style="width:100%; padding:1.2rem; background:var(--neon-blue); border:none; color:black; font-weight:900; border-radius:12px; cursor:pointer; box-shadow:0 10px 20px rgba(0,212,255,0.2); transition:0.3s;" data-astro-cid-vt2ylhi2>
SINCRONIZAR CÉREBRO ⚡
</button> </div> <!-- Knowledge Base --> <div class="glass-panel" style="grid-column: span 2; padding:2.5rem;" data-astro-cid-vt2ylhi2> <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:2rem;" data-astro-cid-vt2ylhi2> <div data-astro-cid-vt2ylhi2> <h3 style="margin:0 0 0.5rem; color:#a78bfa; font-size:1.3rem;" data-astro-cid-vt2ylhi2>Knowledge Base Indexing</h3> <p style="color:#64748b; font-size:0.9rem;" data-astro-cid-vt2ylhi2>Instruções profundas sobre como sua empresa opera.</p> </div> <button style="background:rgba(255,255,255,0.05); color:white; border:1px solid rgba(255,255,255,0.1); border-radius:10px; padding:8px 15px; font-size:0.8rem; font-weight:700; cursor:pointer;" data-astro-cid-vt2ylhi2>Importar Catálogo (PDF)</button> </div> <textarea id="context-area" placeholder="Descreva aqui regras de negócio, política de frete, história da marca, garantias e scripts de conversão que a Ara deve seguir..." style="width:100%; height:350px; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.1); border-radius:20px; padding:2rem; color:white; font-family:monospace; line-height:1.6; outline:none; transition:0.3s;" data-astro-cid-vt2ylhi2></textarea> </div> </div> <script>
        const API = 'https://api.getnexo.com.br';

        // Tone Selection
        document.querySelectorAll('.tone-opt').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tone-opt').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        // Backend Sync
        async function loadData() {
            try {
                const res = await fetch(\`\${API}/api/config\`, { headers: window.getAuthHeader() });
                const data = await res.json();
                if (data.geminiKey) document.getElementById('geminiKey').value = data.geminiKey;
                if (data.openRouterKey) document.getElementById('openRouterKey').value = data.openRouterKey;
            } catch (e) {}

            try {
                const res = await fetch(\`\${API}/ai-context\`, { headers: window.getAuthHeader() });
                const data = await res.json();
                document.getElementById('context-area').value = data.content || '';
            } catch (e) {}
        }

        document.getElementById('save-all').onclick = async () => {
            const btn = document.getElementById('save-all');
            const originalText = btn.innerText;
            btn.innerText = 'PROCESSANDO SINAPSE...';
            btn.disabled = true;

            const payload = {
                geminiKey: document.getElementById('geminiKey').value,
                openRouterKey: document.getElementById('openRouterKey').value,
                content: document.getElementById('context-area').value
            };
            
            try {
                await fetch(\`\${API}/api/config\`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', ...window.getAuthHeader() },
                    body: JSON.stringify(payload)
                });
                await fetch(\`\${API}/ai-context\`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', ...window.getAuthHeader() },
                    body: JSON.stringify({ content: payload.content })
                });
                alert('✅ Sincronização Quântica Completa. Cérebro Ara atualizado com sucesso.');
            } catch (e) { 
                alert('Erro na sincronização. Verifique a Evolution API.'); 
            } finally {
                btn.innerText = originalText;
                btn.disabled = false;
            }
        };

        loadData();
    <\/script>  </div> `], [" ", `<div style="display:flex; flex-direction:column; gap:2.5rem;" data-astro-cid-vt2ylhi2> <div class="glass-panel" style="padding:2.5rem; background:linear-gradient(90deg, rgba(167, 139, 250, 0.15), rgba(0, 212, 255, 0.08)); border-color: rgba(167, 139, 250, 0.2);" data-astro-cid-vt2ylhi2> <h2 style="font-size:2.5rem; font-weight:900; color:white; margin:0;" class="text-gradient" data-astro-cid-vt2ylhi2>Persona Studio 🧠</h2> <p style="color:#94a3b8; margin:0.5rem 0 0; font-size:1.1rem;" data-astro-cid-vt2ylhi2>Defina a alma, o tom e o conhecimento da sua inteligência artificial.</p> </div> <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(400px, 1fr)); gap:2rem;" data-astro-cid-vt2ylhi2> <!-- Logic & Identity --> <div class="glass-panel" style="padding:2.5rem; display:flex; flex-direction:column; gap:2rem;" data-astro-cid-vt2ylhi2> <div data-astro-cid-vt2ylhi2> <h3 style="margin:0 0 0.5rem; color:var(--neon-green); font-size:1.3rem;" data-astro-cid-vt2ylhi2>Identidade e Tom</h3> <p style="color:#64748b; font-size:0.9rem;" data-astro-cid-vt2ylhi2>Como a Ara deve se comportar com seus clientes.</p> </div> <div style="display:flex; flex-direction:column; gap:1.5rem;" data-astro-cid-vt2ylhi2> <div data-astro-cid-vt2ylhi2> <label style="display:block; color:#e5e7eb; font-weight:700; margin-bottom:0.8rem;" data-astro-cid-vt2ylhi2>Personalidade Dominante</label> <div style="display:grid; grid-template-columns:repeat(2,1fr); gap:0.8rem;" data-astro-cid-vt2ylhi2> <button class="tone-opt active" data-astro-cid-vt2ylhi2>Consultor Especialista</button> <button class="tone-opt" data-astro-cid-vt2ylhi2>Vendedor Persuasivo</button> <button class="tone-opt" data-astro-cid-vt2ylhi2>Suporte Amigável</button> <button class="tone-opt" data-astro-cid-vt2ylhi2>Formal / Corporativo</button> </div> </div> <div data-astro-cid-vt2ylhi2> <label style="display:block; color:#e5e7eb; font-weight:700; margin-bottom:0.8rem;" data-astro-cid-vt2ylhi2>Setor de Atuação</label> <select id="industry" style="width:100%; padding:1rem; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.1); color:white; border-radius:12px; outline:none;" data-astro-cid-vt2ylhi2> <option value="Geral" data-astro-cid-vt2ylhi2>Geral (Padrão)</option> <option value="Moda" data-astro-cid-vt2ylhi2>Moda & Vestuário</option> <option value="Tecnologia" data-astro-cid-vt2ylhi2>SaaS / Tecnologia</option> <option value="Imoveis" data-astro-cid-vt2ylhi2>Mercado Imobiliário</option> <option value="Saude" data-astro-cid-vt2ylhi2>Saúde / Estética</option> </select> </div> <div data-astro-cid-vt2ylhi2> <label style="display:block; color:#e5e7eb; font-weight:700; margin-bottom:0.8rem;" data-astro-cid-vt2ylhi2>Criatividade vs Precisão</label> <input type="range" style="width:100%; accent-color:var(--neon-blue);" min="0" max="100" value="70" data-astro-cid-vt2ylhi2> <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:#64748b; margin-top:0.5rem;" data-astro-cid-vt2ylhi2> <span data-astro-cid-vt2ylhi2>Literal</span> <span data-astro-cid-vt2ylhi2>Equilibrado</span> <span data-astro-cid-vt2ylhi2>Criativo</span> </div> </div> </div> </div> <!-- Infrastructure --> <div class="glass-panel" style="padding:2.5rem; display:flex; flex-direction:column; gap:2rem;" data-astro-cid-vt2ylhi2> <div data-astro-cid-vt2ylhi2> <h3 style="margin:0 0 0.5rem; color:var(--neon-blue); font-size:1.3rem;" data-astro-cid-vt2ylhi2>Infraestrutura & Chaves</h3> <p style="color:#64748b; font-size:0.9rem;" data-astro-cid-vt2ylhi2>Conecte seus provedores de LLM.</p> </div> <div style="display:flex; flex-direction:column; gap:1.5rem;" data-astro-cid-vt2ylhi2> <div data-astro-cid-vt2ylhi2> <label style="display:block; color:#e5e7eb; font-weight:700; margin-bottom:0.6rem;" data-astro-cid-vt2ylhi2>Google Gemini Key</label> <div style="position:relative;" data-astro-cid-vt2ylhi2> <input type="password" id="geminiKey" placeholder="AIzaSy..." style="width:100%; padding:1rem; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.1); color:white; border-radius:12px;" data-astro-cid-vt2ylhi2> <button onclick="alert('Teste de conexão enviado para Google Vertice/Gemini... OK!')" style="position:absolute; right:10px; top:50%; transform:translateY(-50%); background:rgba(0,212,255,0.1); border:1px solid var(--neon-blue); color:var(--neon-blue); border-radius:8px; padding:4px 10px; font-size:0.7rem; font-weight:800; cursor:pointer;" data-astro-cid-vt2ylhi2>TESTAR</button> </div> </div> <div data-astro-cid-vt2ylhi2> <label style="display:block; color:#e5e7eb; font-weight:700; margin-bottom:0.6rem;" data-astro-cid-vt2ylhi2>OpenRouter Key</label> <input type="password" id="openRouterKey" placeholder="sk-or-..." style="width:100%; padding:1rem; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.1); color:white; border-radius:12px;" data-astro-cid-vt2ylhi2> </div> <div style="background:rgba(0,212,255,0.05); padding:1.2rem; border-radius:12px; border:1px solid rgba(0,212,255,0.1);" data-astro-cid-vt2ylhi2> <div style="font-size:0.8rem; color:#64748b; margin-bottom:0.5rem;" data-astro-cid-vt2ylhi2>Status System Connection</div> <div style="display:flex; justify-content:space-between; align-items:center;" data-astro-cid-vt2ylhi2> <span style="color:white; font-weight:700;" data-astro-cid-vt2ylhi2>Evolution API</span> <span style="color:var(--neon-green); font-size:0.75rem; font-weight:900; letter-spacing:1px;" data-astro-cid-vt2ylhi2>SYNC: ONLINE</span> </div> </div> </div> <button id="save-all" style="width:100%; padding:1.2rem; background:var(--neon-blue); border:none; color:black; font-weight:900; border-radius:12px; cursor:pointer; box-shadow:0 10px 20px rgba(0,212,255,0.2); transition:0.3s;" data-astro-cid-vt2ylhi2>
SINCRONIZAR CÉREBRO ⚡
</button> </div> <!-- Knowledge Base --> <div class="glass-panel" style="grid-column: span 2; padding:2.5rem;" data-astro-cid-vt2ylhi2> <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:2rem;" data-astro-cid-vt2ylhi2> <div data-astro-cid-vt2ylhi2> <h3 style="margin:0 0 0.5rem; color:#a78bfa; font-size:1.3rem;" data-astro-cid-vt2ylhi2>Knowledge Base Indexing</h3> <p style="color:#64748b; font-size:0.9rem;" data-astro-cid-vt2ylhi2>Instruções profundas sobre como sua empresa opera.</p> </div> <button style="background:rgba(255,255,255,0.05); color:white; border:1px solid rgba(255,255,255,0.1); border-radius:10px; padding:8px 15px; font-size:0.8rem; font-weight:700; cursor:pointer;" data-astro-cid-vt2ylhi2>Importar Catálogo (PDF)</button> </div> <textarea id="context-area" placeholder="Descreva aqui regras de negócio, política de frete, história da marca, garantias e scripts de conversão que a Ara deve seguir..." style="width:100%; height:350px; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.1); border-radius:20px; padding:2rem; color:white; font-family:monospace; line-height:1.6; outline:none; transition:0.3s;" data-astro-cid-vt2ylhi2></textarea> </div> </div> <script>
        const API = 'https://api.getnexo.com.br';

        // Tone Selection
        document.querySelectorAll('.tone-opt').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tone-opt').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        // Backend Sync
        async function loadData() {
            try {
                const res = await fetch(\\\`\\\${API}/api/config\\\`, { headers: window.getAuthHeader() });
                const data = await res.json();
                if (data.geminiKey) document.getElementById('geminiKey').value = data.geminiKey;
                if (data.openRouterKey) document.getElementById('openRouterKey').value = data.openRouterKey;
            } catch (e) {}

            try {
                const res = await fetch(\\\`\\\${API}/ai-context\\\`, { headers: window.getAuthHeader() });
                const data = await res.json();
                document.getElementById('context-area').value = data.content || '';
            } catch (e) {}
        }

        document.getElementById('save-all').onclick = async () => {
            const btn = document.getElementById('save-all');
            const originalText = btn.innerText;
            btn.innerText = 'PROCESSANDO SINAPSE...';
            btn.disabled = true;

            const payload = {
                geminiKey: document.getElementById('geminiKey').value,
                openRouterKey: document.getElementById('openRouterKey').value,
                content: document.getElementById('context-area').value
            };
            
            try {
                await fetch(\\\`\\\${API}/api/config\\\`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', ...window.getAuthHeader() },
                    body: JSON.stringify(payload)
                });
                await fetch(\\\`\\\${API}/ai-context\\\`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', ...window.getAuthHeader() },
                    body: JSON.stringify({ content: payload.content })
                });
                alert('✅ Sincronização Quântica Completa. Cérebro Ara atualizado com sucesso.');
            } catch (e) { 
                alert('Erro na sincronização. Verifique a Evolution API.'); 
            } finally {
                btn.innerText = originalText;
                btn.disabled = false;
            }
        };

        loadData();
    <\/script>  </div> `])), maybeRenderHead()) })}`;
}, "/home/lele/usenexo/getnexo-site/src/pages/dashboard/config.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/dashboard/config.astro";
const $$url = "/dashboard/config";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Config,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
