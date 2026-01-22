import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from "../../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$ResellerLayout } from "../../assets/ResellerLayout-BGTF-fbt.js";
import { renderers } from "../../renderers.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Gerar = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "ResellerLayout", $$ResellerLayout, { "title": "Gerar Novo Cliente" }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([" ", `<header class="bg-void-black border-b border-neon-blue p-4 mb-8"> <h2 class="text-neon-blue font-jetbrains" style="color: #00f3ff; font-family: 'JetBrains Mono';">Gerar Novo Cliente</h2> </header> <main style="max-width: 42rem; margin: 0 auto; padding: 1.5rem;"> <div style="background: #050505; border: 1px solid #00ff41; border-radius: 0.5rem; padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem;"> <label style="display: flex; flex-direction: column; color: #fff;">
Nome da loja
<input id="input-nome" type="text" style="margin-top: 0.25rem; padding: 0.5rem; background: #050505; border: 1px solid #00f3ff; color: #fff; border-radius: 0.25rem;"> </label> <label style="display: flex; flex-direction: column; color: #fff;">
Domínio (ex: lojaexemplo.com)
<input id="input-dominio" type="text" style="margin-top: 0.25rem; padding: 0.5rem; background: #050505; border: 1px solid #00f3ff; color: #fff; border-radius: 0.25rem;"> </label> <label style="display: flex; flex-direction: column; color: #fff;">
Plataforma
<select id="input-plataforma" style="margin-top: 0.25rem; padding: 0.5rem; background: #050505; border: 1px solid #00f3ff; color: #fff; border-radius: 0.25rem;"> <option value="woo">WooCommerce</option> <option value="shopify">Shopify</option> <option value="bling">Bling</option> <option value="nuvem">Nuvemshop</option> <option value="tray">Tray</option> <option value="vtex">VTEX</option> </select> </label> <label style="display: flex; flex-direction: column; color: #fff;">
WhatsApp (BR)
<input id="input-whats" type="text" placeholder="+5511999999999" style="margin-top: 0.25rem; padding: 0.5rem; background: #050505; border: 1px solid #00f3ff; color: #fff; border-radius: 0.25rem;"> </label> <label style="display: flex; flex-direction: column; color: #fff;">
IA
<select id="input-ia" style="margin-top: 0.25rem; padding: 0.5rem; background: #050505; border: 1px solid #00f3ff; color: #fff; border-radius: 0.25rem;"> <option value="gemini">Gemini</option> <option value="grok">Grok</option> <option value="deepseek">DeepSeek</option> </select> </label> <button id="btn-criar" style="background: #ffd700; color: black; width: 100%; padding: 0.75rem; border-radius: 0.25rem; font-weight: bold; cursor: pointer; transition: background 0.2s; border: none; margin-top: 1rem;">
Gerar Cliente + Plugin
</button> </div> </main> <script>
        const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000' : '/api-proxy';
        
        document.getElementById('btn-criar').addEventListener('click', async () => {
            const btn = document.getElementById('btn-criar');
            const nome = document.getElementById('input-nome').value;
            const dominio = document.getElementById('input-dominio').value;
            const plataforma = document.getElementById('input-plataforma').value;
            const whats = document.getElementById('input-whats').value;
            const ia = document.getElementById('input-ia').value;

            if (!nome || !dominio || !whats) return alert('Preencha tudo!');

            btn.disabled = true;
            btn.textContent = 'Criando...';

            try {
                // Using existing endpoint /api/revenda/clientes which matches the functionality
                const response = await fetch(\`\${API_URL}/api/revenda/clientes\`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token') },
                    body: JSON.stringify({ nome, domain: dominio, platform: plataforma, whatsapp: whats, ia })
                });
                
                const data = await response.json();

                if (response.ok || data.ok) { // Check both to be safe
                    alert('Cliente criado! ZIP enviado por e-mail.'); // Message from user request
                    window.location.href = '/revenda/clientes';
                } else {
                    alert(data.error || 'Erro ao criar cliente');
                }
            } catch (e) {
                console.error(e);
                alert('Erro de conexão');
            } finally {
                btn.disabled = false;
                btn.textContent = 'Gerar Cliente + Plugin';
            }
        });
    <\/script> `], [" ", `<header class="bg-void-black border-b border-neon-blue p-4 mb-8"> <h2 class="text-neon-blue font-jetbrains" style="color: #00f3ff; font-family: 'JetBrains Mono';">Gerar Novo Cliente</h2> </header> <main style="max-width: 42rem; margin: 0 auto; padding: 1.5rem;"> <div style="background: #050505; border: 1px solid #00ff41; border-radius: 0.5rem; padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem;"> <label style="display: flex; flex-direction: column; color: #fff;">
Nome da loja
<input id="input-nome" type="text" style="margin-top: 0.25rem; padding: 0.5rem; background: #050505; border: 1px solid #00f3ff; color: #fff; border-radius: 0.25rem;"> </label> <label style="display: flex; flex-direction: column; color: #fff;">
Domínio (ex: lojaexemplo.com)
<input id="input-dominio" type="text" style="margin-top: 0.25rem; padding: 0.5rem; background: #050505; border: 1px solid #00f3ff; color: #fff; border-radius: 0.25rem;"> </label> <label style="display: flex; flex-direction: column; color: #fff;">
Plataforma
<select id="input-plataforma" style="margin-top: 0.25rem; padding: 0.5rem; background: #050505; border: 1px solid #00f3ff; color: #fff; border-radius: 0.25rem;"> <option value="woo">WooCommerce</option> <option value="shopify">Shopify</option> <option value="bling">Bling</option> <option value="nuvem">Nuvemshop</option> <option value="tray">Tray</option> <option value="vtex">VTEX</option> </select> </label> <label style="display: flex; flex-direction: column; color: #fff;">
WhatsApp (BR)
<input id="input-whats" type="text" placeholder="+5511999999999" style="margin-top: 0.25rem; padding: 0.5rem; background: #050505; border: 1px solid #00f3ff; color: #fff; border-radius: 0.25rem;"> </label> <label style="display: flex; flex-direction: column; color: #fff;">
IA
<select id="input-ia" style="margin-top: 0.25rem; padding: 0.5rem; background: #050505; border: 1px solid #00f3ff; color: #fff; border-radius: 0.25rem;"> <option value="gemini">Gemini</option> <option value="grok">Grok</option> <option value="deepseek">DeepSeek</option> </select> </label> <button id="btn-criar" style="background: #ffd700; color: black; width: 100%; padding: 0.75rem; border-radius: 0.25rem; font-weight: bold; cursor: pointer; transition: background 0.2s; border: none; margin-top: 1rem;">
Gerar Cliente + Plugin
</button> </div> </main> <script>
        const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000' : '/api-proxy';
        
        document.getElementById('btn-criar').addEventListener('click', async () => {
            const btn = document.getElementById('btn-criar');
            const nome = document.getElementById('input-nome').value;
            const dominio = document.getElementById('input-dominio').value;
            const plataforma = document.getElementById('input-plataforma').value;
            const whats = document.getElementById('input-whats').value;
            const ia = document.getElementById('input-ia').value;

            if (!nome || !dominio || !whats) return alert('Preencha tudo!');

            btn.disabled = true;
            btn.textContent = 'Criando...';

            try {
                // Using existing endpoint /api/revenda/clientes which matches the functionality
                const response = await fetch(\\\`\\\${API_URL}/api/revenda/clientes\\\`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token') },
                    body: JSON.stringify({ nome, domain: dominio, platform: plataforma, whatsapp: whats, ia })
                });
                
                const data = await response.json();

                if (response.ok || data.ok) { // Check both to be safe
                    alert('Cliente criado! ZIP enviado por e-mail.'); // Message from user request
                    window.location.href = '/revenda/clientes';
                } else {
                    alert(data.error || 'Erro ao criar cliente');
                }
            } catch (e) {
                console.error(e);
                alert('Erro de conexão');
            } finally {
                btn.disabled = false;
                btn.textContent = 'Gerar Cliente + Plugin';
            }
        });
    <\/script> `])), maybeRenderHead()) })}`;
}, "/home/lele/usenexo/getnexo-site/src/pages/revenda/gerar.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/revenda/gerar.astro";
const $$url = "/revenda/gerar";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Gerar,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
