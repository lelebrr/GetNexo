import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from "../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$Layout } from "../assets/Layout-DScI-qCd.js";
import { g as glossaryData } from "../assets/glossaryData-BWy0O2to.js";
/* empty css                                    */
import { renderers } from "../renderers.mjs";
const $$Glossario = createComponent(($$result, $$props, $$slots) => {
  const title = "Glossário do WhatsApp Marketing e Automação | Dicionário GetNexo";
  const description = "Entenda todos os termos técnicos do mundo de APIs de WhatsApp, Chatbots e Automação. O dicionário completo para empresas modernas.";
  const keywords = "glossario whatsapp, o que é webhook, dicionario automacao, termos tecnicos whatsapp, api cloud definicao";
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": title, "description": description, "keywords": keywords, "data-astro-cid-rfjopv7t": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="gloss-hero relative overflow-hidden" data-astro-cid-rfjopv7t> <div class="absolute inset-0 bg-gradient-to-b from-[#0f172a] to-black z-[-1]" data-astro-cid-rfjopv7t></div> <div class="container mx-auto px-6 max-w-4xl text-center py-20 pb-10" data-astro-cid-rfjopv7t> <div class="hero-badge" data-astro-cid-rfjopv7t>Dicionário Técnico</div> <h1 class="text-gradient mb-6" data-astro-cid-rfjopv7t>Glossário da Automação</h1> <p class="text-slate-400 text-xl max-w-2xl mx-auto" data-astro-cid-rfjopv7t>
Domine a linguagem dos desenvolvedores e especialistas em growth.
</p> </div> </section> <section class="gloss-grid pb-24" data-astro-cid-rfjopv7t> <div class="container mx-auto px-6 max-w-6xl" data-astro-cid-rfjopv7t> <!-- Search (Visual Only) --> <div class="max-w-xl mx-auto mb-16 relative" data-astro-cid-rfjopv7t> <input type="text" placeholder="Buscar termo (ex: Webhook)..." class="w-full bg-white/5 border border-white/10 rounded-full py-4 px-6 text-white outline-none focus:border-[#00ff9d] transition" data-astro-cid-rfjopv7t> <span class="absolute right-6 top-4 text-slate-500" data-astro-cid-rfjopv7t>🔍</span> </div> <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6" data-astro-cid-rfjopv7t> ${glossaryData.sort((a, b) => a.term.localeCompare(b.term)).map((item) => renderTemplate`<a${addAttribute(`/glossario/${item.slug}`, "href")} class="gloss-card glass-panel group" data-astro-cid-rfjopv7t> <h3 class="text-xl font-bold text-white group-hover:text-[#00ff9d] transition mb-3" data-astro-cid-rfjopv7t>${item.term}</h3> <p class="text-slate-400 text-sm line-clamp-3 leading-relaxed" data-astro-cid-rfjopv7t> ${item.definition} </p> <span class="read-more" data-astro-cid-rfjopv7t>Ler definição completa →</span> </a>`)} </div> </div> </section> ` })} `;
}, "/home/lele/usenexo/getnexo-site/src/pages/glossario.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/glossario.astro";
const $$url = "/glossario";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Glossario,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
