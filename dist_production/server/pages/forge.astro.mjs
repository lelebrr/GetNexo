import { f as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead } from "../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$Layout } from "../assets/Layout-DScI-qCd.js";
/* empty css                                */
import { renderers } from "../renderers.mjs";
const $$Forge = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "NexoPlatformForge - Gerador de Plugins", "data-astro-cid-dj4oqcez": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="forge-container" data-astro-cid-dj4oqcez> <div class="forge-header" data-astro-cid-dj4oqcez> <h1 data-astro-cid-dj4oqcez>NEXO PLATFORM <span class="gradient-text" data-astro-cid-dj4oqcez>FORGE</span></h1> <p data-astro-cid-dj4oqcez>Gere seu plugin de teste personalizado em 30 segundos.</p> </div> <div class="forge-console" id="console-step-1" data-astro-cid-dj4oqcez> <div class="step-indicator" data-astro-cid-dj4oqcez>PASSO 1: IDENTIFICAÇÃO DO ALVO</div> <div class="input-group" data-astro-cid-dj4oqcez> <label for="domain-input" data-astro-cid-dj4oqcez>DOMÍNIO DA LOJA</label> <input type="text" id="domain-input" placeholder="ex: minhaloja.com.br" data-astro-cid-dj4oqcez> <button id="btn-detect" class="btn-forge" data-astro-cid-dj4oqcez>Rastrear Plataforma</button> </div> <div id="detection-status" class="status-line" data-astro-cid-dj4oqcez></div> </div> <div class="forge-console hidden" id="console-step-2" data-astro-cid-dj4oqcez> <div class="step-indicator" data-astro-cid-dj4oqcez>PASSO 2: CONFIGURAÇÃO DO ARTEFATO</div> <div class="detected-box" data-astro-cid-dj4oqcez> <span class="label" data-astro-cid-dj4oqcez>Plataforma Detectada:</span> <span id="detected-platform-name" class="value" data-astro-cid-dj4oqcez>...</span> <span class="edit-link" onclick="document.getElementById('platform-select-container').classList.remove('hidden')" data-astro-cid-dj4oqcez>[Alterar]</span> </div> <div id="platform-select-container" class="hidden input-group" style="margin-top: 1rem;" data-astro-cid-dj4oqcez> <label data-astro-cid-dj4oqcez>Selecione Manualmente:</label> <select id="platform-select" data-astro-cid-dj4oqcez> <option value="woo" data-astro-cid-dj4oqcez>WooCommerce</option> <option value="shopify" data-astro-cid-dj4oqcez>Shopify</option> <option value="bling" data-astro-cid-dj4oqcez>Bling (Loja Virtual)</option> <option value="nuvem" data-astro-cid-dj4oqcez>Nuvemshop</option> <option value="tray" data-astro-cid-dj4oqcez>Tray</option> </select> </div> <div class="input-group" data-astro-cid-dj4oqcez> <label for="phone-input" data-astro-cid-dj4oqcez>WHATSAPP (Para Suporte e Teste)</label> <input type="text" id="phone-input" placeholder="+55 11 99999-9999" data-astro-cid-dj4oqcez> </div> <button id="btn-generate" class="btn-forge btn-lg" data-astro-cid-dj4oqcez>FORJAR PLUGIN AGORA</button> </div> <div class="forge-console hidden" id="console-step-3" data-astro-cid-dj4oqcez> <div class="step-indicator" data-astro-cid-dj4oqcez>STATUS: CONCLUÍDO</div> <div class="success-message" data-astro-cid-dj4oqcez> <h2 data-astro-cid-dj4oqcez>PLUGIN GERADO COM SUCESSO</h2> <p data-astro-cid-dj4oqcez>O download do seu arquivo <code data-astro-cid-dj4oqcez>plugin_teste.zip</code> começou.</p> <p class="crypto-note" data-astro-cid-dj4oqcez>Conteúdo criptografado AES-256. Validade: 7 Dias.</p> </div> <button onclick="location.reload()" class="btn-ghost" data-astro-cid-dj4oqcez>Gerar Novo</button> </div> </main> ` })}  ${renderScript($$result, "/home/lele/usenexo/getnexo-site/src/pages/forge.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/lele/usenexo/getnexo-site/src/pages/forge.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/forge.astro";
const $$url = "/forge";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Forge,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
