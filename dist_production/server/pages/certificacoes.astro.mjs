import { f as createComponent, r as renderTemplate, k as renderComponent, m as maybeRenderHead, h as addAttribute } from "../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$Layout } from "../assets/Layout-DScI-qCd.js";
/* empty css                                        */
import { renderers } from "../renderers.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Certificacoes = createComponent(($$result, $$props, $$slots) => {
  const badges = [
    // Tuas 7 originais
    { name: "Ara SpeedSeal", desc: "Roda liso em 8 GB RAM – LCP abaixo de oito-zero-zero ms em 3G brasileiro.", icon: "⚡", color: "text-green-400 bg-green-950" },
    { name: "VoiceFirst Verified", desc: "Schema speakable em todas as páginas – pronto pra Google Assistant, Gemini Live, Siri.", icon: "🎙️", color: "text-cyan-400 bg-cyan-950" },
    { name: "PIX Instant Certified", desc: "PIX direto no chat em menos de três segundos – sem redirecionar.", icon: "💰", color: "text-emerald-400 bg-emerald-950" },
    { name: "Brasilizado 2026", desc: "Gírias, horário local, LGPD, pix, boleto – feito pro Brasil que não para.", icon: "🇧🇷", color: "text-yellow-500 bg-yellow-950" },
    { name: "MicroPayment Master", desc: "PIX, QR, boleto, cripto – paga como quiser, no zap mesmo.", icon: "🛒", color: "text-purple-400 bg-purple-950" },
    { name: "Zero Ban Guarantee", desc: "WhatsApp oficial, delays inteligentes – zero risco de bloqueio.", icon: "🛡️", color: "text-red-400 bg-red-950" },
    { name: "Offline First", desc: "Chat salva offline, sincroniza depois – nem o 4G vai te abandonar.", icon: "📱", color: "text-gray-300 bg-zinc-900" },
    // As novas
    { name: "LGPD Seal", desc: "Dados armazenados no Brasil, só com consentimento claro – 100% conforme LGPD.", icon: "🔒", color: "text-indigo-400 bg-indigo-950" },
    { name: "PageSpeed 100", desc: "Nota perfeita no Google PageSpeed – mobile e desktop, zero espera.", icon: "📊", color: "text-red-500 bg-red-950" },
    { name: "Bing Verified", desc: "Indexado, sitemap aprovado, zero erro – visível no Bing e Copilot.", icon: "🟦", color: "text-blue-500 bg-blue-950" },
    { name: "IA Powered", desc: "Usa IA real pra vender, atender e fechar negócio. Nada de blá blá. Só resultado.", icon: "🤖", color: "text-green-500 bg-green-950" }
  ];
  return renderTemplate(_a || (_a = __template(["", "  <!-- Speakable pro voice search --> <script>\n  document.querySelectorAll('[role=\"article\"]').forEach(el => {\n    el.addEventListener('focus', () => {\n      // Anuncia nome do badge pra leitor de tela\n      const name = el.querySelector('h3').textContent;\n      const live = document.createElement('div');\n      live.setAttribute('aria-live', 'polite');\n      live.setAttribute('class', 'sr-only');\n      live.textContent = `Badge: ${name}`;\n      el.appendChild(live);\n      // Remove depois de falar pra nao poluir DOM\n      setTimeout(() => live.remove(), 1000);\n    });\n    \n    // Suporte a teclado para tooltip\n    el.setAttribute('tabindex', '0');\n  });\n<\/script>"], ["", "  <!-- Speakable pro voice search --> <script>\n  document.querySelectorAll('[role=\"article\"]').forEach(el => {\n    el.addEventListener('focus', () => {\n      // Anuncia nome do badge pra leitor de tela\n      const name = el.querySelector('h3').textContent;\n      const live = document.createElement('div');\n      live.setAttribute('aria-live', 'polite');\n      live.setAttribute('class', 'sr-only');\n      live.textContent = \\`Badge: \\${name}\\`;\n      el.appendChild(live);\n      // Remove depois de falar pra nao poluir DOM\n      setTimeout(() => live.remove(), 1000);\n    });\n    \n    // Suporte a teclado para tooltip\n    el.setAttribute('tabindex', '0');\n  });\n<\/script>"])), renderComponent($$result, "Layout", $$Layout, { "title": "Certificações GetNexo | Gratuitas, Reais e Exclusivas", "description": "Conheça as certificações de performance, segurança e inovação da GetNexo. Ninguém tem. Só tu.", "data-astro-cid-d6tllehd": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="min-h-screen bg-zinc-50 dark:bg-zinc-900 p-8 flex flex-col items-center justify-center pt-32" data-astro-cid-d6tllehd> <h1 class="text-4xl font-bold mb-4 text-zinc-800 dark:text-white" data-astro-cid-d6tllehd>Certificações GetNexo</h1> <p class="text-zinc-600 dark:text-zinc-400 mb-8 text-center max-w-lg" data-astro-cid-d6tllehd>
Todas gratuitas. Todas reais. Todas testadas.
<br class="hidden md:block" data-astro-cid-d6tllehd>Ninguém tem.
<span class="text-green-500" data-astro-cid-d6tllehd>Só tu.</span> </p> <!-- Grid – agora 2/3/5 colunas dependendo da tela --> <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 max-w-7xl w-full" data-astro-cid-d6tllehd> ${badges.map((badge) => renderTemplate`<div role="article"${addAttribute(`Badge: ${badge.name}`, "aria-label")} class="group relative" data-astro-cid-d6tllehd> <!-- Card --> <div class="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-300 h-full flex flex-col items-center justify-between" data-astro-cid-d6tllehd> <span class="text-5xl block my-4" data-astro-cid-d6tllehd>${badge.icon}</span> <h3${addAttribute(`font-bold text-lg ${badge.color.split(" ")[0]}`, "class")} data-astro-cid-d6tllehd>${badge.name}</h3> </div> <!-- Tooltip com hover --> <div class="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300
                   bg-zinc-900 dark:bg-zinc-800 text-white px-4 py-2 rounded text-sm min-w-[200px] z-10 border border-zinc-700 shadow-xl" style="visibility: hidden; transition: opacity 0.3s, visibility 0.3s;" data-astro-cid-d6tllehd> ${badge.desc} </div> </div>`)} </div> <!-- CTA --> <a href="/demo" class="mt-16 px-8 py-4 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition text-lg shadow-lg hover:shadow-green-500/20" data-astro-cid-d6tllehd>
Testa agora → getnexo.com.br/demo
</a> </section> ` }));
}, "/home/lele/usenexo/getnexo-site/src/pages/certificacoes.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/certificacoes.astro";
const $$url = "/certificacoes";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Certificacoes,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
