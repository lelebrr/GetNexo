import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from "../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$Layout } from "../assets/Layout-DScI-qCd.js";
/* empty css                                 */
import { renderers } from "../renderers.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Buscar = createComponent(($$result, $$props, $$slots) => {
  const title = "Buscar no GetNexo – Encontre o que precisa";
  const description = "Busque por tutoriais, documentação e recursos no GetNexo";
  const keywords = "buscar getnexo, busca site, encontrar conteudo";
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": title, "description": description, "keywords": keywords, "data-astro-cid-zw4xnwu6": true }, { "default": ($$result2) => renderTemplate(_a || (_a = __template([" ", `<div class="search-page" data-astro-cid-zw4xnwu6> <div class="container animate-fade-in" data-astro-cid-zw4xnwu6> <h1 class="text-gradient" data-astro-cid-zw4xnwu6>O que você está procurando?</h1> <p data-astro-cid-zw4xnwu6>Explore nosso ecossistema de inteligência e automação.</p> <div class="search-box glass-panel" data-astro-cid-zw4xnwu6> <input type="text" id="search-input" placeholder="Ex: Automação Imobiliária, Meta Ads, PIX..." autofocus data-astro-cid-zw4xnwu6> <button id="search-btn" data-astro-cid-zw4xnwu6>Buscar Agora 🔍</button> </div> <div class="popular-searches reveal" data-astro-cid-zw4xnwu6> <h2 data-astro-cid-zw4xnwu6>Buscas Recomendadas</h2> <div class="tags" data-astro-cid-zw4xnwu6> <a href="/blog/integrar-chatgpt-whatsapp" class="tag" data-astro-cid-zw4xnwu6>ChatGPT no WhatsApp</a> <a href="/blog/whatsapp-automação-imobiliaria" class="tag" data-astro-cid-zw4xnwu6>Setor Imobiliário</a> <a href="/blog/seguranca-lgpd-whatsapp-2026" class="tag" data-astro-cid-zw4xnwu6>LGPD & Segurança</a> <a href="/precos" class="tag" data-astro-cid-zw4xnwu6>Tabela de Preços</a> <a href="/integracoes" class="tag" data-astro-cid-zw4xnwu6>Integrações API</a> </div> </div> </div> </div>  <script>
  document.getElementById('search-btn').addEventListener('click', () => {
    const query = document.getElementById('search-input').value.trim();
    if (query) {
      window.location.href = \`/blog?q=\${encodeURIComponent(query)}\`;
    }
  });

  document.getElementById('search-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      document.getElementById('search-btn').click();
    }
  });
<\/script> `], [" ", `<div class="search-page" data-astro-cid-zw4xnwu6> <div class="container animate-fade-in" data-astro-cid-zw4xnwu6> <h1 class="text-gradient" data-astro-cid-zw4xnwu6>O que você está procurando?</h1> <p data-astro-cid-zw4xnwu6>Explore nosso ecossistema de inteligência e automação.</p> <div class="search-box glass-panel" data-astro-cid-zw4xnwu6> <input type="text" id="search-input" placeholder="Ex: Automação Imobiliária, Meta Ads, PIX..." autofocus data-astro-cid-zw4xnwu6> <button id="search-btn" data-astro-cid-zw4xnwu6>Buscar Agora 🔍</button> </div> <div class="popular-searches reveal" data-astro-cid-zw4xnwu6> <h2 data-astro-cid-zw4xnwu6>Buscas Recomendadas</h2> <div class="tags" data-astro-cid-zw4xnwu6> <a href="/blog/integrar-chatgpt-whatsapp" class="tag" data-astro-cid-zw4xnwu6>ChatGPT no WhatsApp</a> <a href="/blog/whatsapp-automação-imobiliaria" class="tag" data-astro-cid-zw4xnwu6>Setor Imobiliário</a> <a href="/blog/seguranca-lgpd-whatsapp-2026" class="tag" data-astro-cid-zw4xnwu6>LGPD & Segurança</a> <a href="/precos" class="tag" data-astro-cid-zw4xnwu6>Tabela de Preços</a> <a href="/integracoes" class="tag" data-astro-cid-zw4xnwu6>Integrações API</a> </div> </div> </div> </div>  <script>
  document.getElementById('search-btn').addEventListener('click', () => {
    const query = document.getElementById('search-input').value.trim();
    if (query) {
      window.location.href = \\\`/blog?q=\\\${encodeURIComponent(query)}\\\`;
    }
  });

  document.getElementById('search-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      document.getElementById('search-btn').click();
    }
  });
<\/script> `])), maybeRenderHead()) })}`;
}, "/home/lele/usenexo/getnexo-site/src/pages/buscar.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/buscar.astro";
const $$url = "/buscar";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Buscar,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
