import { e as createAstro, f as createComponent, r as renderTemplate, h as addAttribute, al as defineScriptVars, l as renderScript, m as maybeRenderHead } from "../../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import "clsx";
/* empty css                                      */
import { renderers } from "../../renderers.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://getnexo.com.br");
const $$Sentinel = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Sentinel;
  const isAdminMaximo = Astro2.request.headers.get("x-admin-token") === "sentinel-admin-max-2026";
  if (!isAdminMaximo) {
    return Astro2.redirect("/admin/login?error=acesso-negado");
  }
  const dados = {
    uptime: "14 dias 8h",
    ciclos: 1432,
    tokens: 22500,
    postsHoje: 6,
    backlinks: 523,
    reels: 9,
    rankMedio: { pt: 3.2, es: 7.1, fr: 5.4, en: 6.8 },
    keywordsTop: [
      { palavra: "automação whatsapp", pos: 2, var: 1, ctr: 8.1 },
      { palavra: "chatbot loja", pos: 3, var: -1, ctr: 5.6 },
      { palavra: "pix whatsapp", pos: 1, var: 0, ctr: 12.3 }
    ],
    outreach: [
      { site: "blogtech.com.br", status: "Enviado", tempo: "3h" },
      { site: "ecommercetips.com", status: "Aceito", tempo: "0" }
    ],
    social: { views: 3800 },
    velocidade: { pt: 1.1, es: 1.6, fr: 2, en: 1.4 },
    alerta: [
      { hora: "17:45", msg: "Mercado subiu 1.9% em 'chatbot loja' → post gerado em 7min" },
      { hora: "16:33", msg: "Backlink aceito – +1 DR 45" }
    ],
    recursos: { cpu: 72, ram: 4.1, disco: 2.3, rede: 1.2 }
  };
  return renderTemplate(_a || (_a = __template(["", '<div class="min-h-screen bg-void-black text-white p-8" data-astro-cid-e7phdjlt> <h1 class="text-4xl font-jetbrains text-neon-blue mb-8" data-astro-cid-e7phdjlt>Sentinel v8 – SEO War Machine</h1>  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12" data-astro-cid-e7phdjlt> <div class="bg-gray-900 border border-cyan-500 rounded p-6" data-astro-cid-e7phdjlt> <h2 class="text-cyan-400 mb-2" data-astro-cid-e7phdjlt>Uptime & Ciclos</h2> <p class="text-3xl text-gold" data-astro-cid-e7phdjlt>', '</p> <p class="text-sm text-gray-400" data-astro-cid-e7phdjlt>Ciclos: ', '</p> </div> <div class="bg-gray-900 border border-cyan-500 rounded p-6" data-astro-cid-e7phdjlt> <h2 class="text-cyan-400 mb-2" data-astro-cid-e7phdjlt>Recursos</h2> <p class="text-2xl" data-astro-cid-e7phdjlt>CPU ', "% | RAM ", ' GB</p> <p class="text-sm" data-astro-cid-e7phdjlt>Disco ', " GB | Rede ", ' Mb/s</p> </div> <div class="bg-gray-900 border border-cyan-500 rounded p-6" data-astro-cid-e7phdjlt> <h2 class="text-cyan-400 mb-2" data-astro-cid-e7phdjlt>Tokens IA</h2> <p class="text-3xl text-gold" data-astro-cid-e7phdjlt>', '</p> <p class="text-sm text-gray-400" data-astro-cid-e7phdjlt>Economia estimada: R$ 2.430</p> </div> </div>  <section class="mb-12" data-astro-cid-e7phdjlt> <h2 class="text-2xl text-neon-blue mb-4" data-astro-cid-e7phdjlt>Rank Tracker – 300 Keywords</h2> <div class="bg-gray-900 border border-cyan-500 rounded p-6" data-astro-cid-e7phdjlt> <canvas id="rankChart" data-astro-cid-e7phdjlt></canvas> ', " <script>(function(){", `
        new Chart(document.getElementById('rankChart'), {
          type: 'radar',
          data: {
            labels: ['PT', 'ES', 'FR', 'EN'],
            datasets: [{
              label: 'Posição Média',
              data: rankData,
              backgroundColor: 'rgba(0, 247, 255, 0.2)',
              borderColor: '#00f7ff'
            }]
          }
        });
      })();<\/script> </div> </section>  <section class="mb-12" data-astro-cid-e7phdjlt> <h2 class="text-2xl text-neon-blue mb-4" data-astro-cid-e7phdjlt>Top Keywords</h2> <table class="w-full border border-cyan-500" data-astro-cid-e7phdjlt> <thead class="bg-gray-900" data-astro-cid-e7phdjlt> <tr data-astro-cid-e7phdjlt><th data-astro-cid-e7phdjlt>Palavra</th><th data-astro-cid-e7phdjlt>Pos</th><th data-astro-cid-e7phdjlt>Var</th><th data-astro-cid-e7phdjlt>CTR</th></tr> </thead> <tbody data-astro-cid-e7phdjlt> `, ' </tbody> </table> </section>  <section class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12" data-astro-cid-e7phdjlt> <div class="bg-gray-900 border border-cyan-500 rounded p-6" data-astro-cid-e7phdjlt> <h2 class="text-cyan-400 mb-4" data-astro-cid-e7phdjlt>Backlinks</h2> <p class="text-3xl text-gold" data-astro-cid-e7phdjlt>', '</p> <p data-astro-cid-e7phdjlt>Pendentes: 1.200</p> </div> <div class="bg-gray-900 border border-cyan-500 rounded p-6" data-astro-cid-e7phdjlt> <h2 class="text-cyan-400 mb-4" data-astro-cid-e7phdjlt>Outreach Ativo</h2> <ul data-astro-cid-e7phdjlt> ', ' </ul> </div> </section>  <section class="mb-12" data-astro-cid-e7phdjlt> <h2 class="text-2xl text-neon-blue mb-4" data-astro-cid-e7phdjlt>Produção Hoje</h2> <div class="grid grid-cols-3 gap-4" data-astro-cid-e7phdjlt> <div class="bg-gray-900 border border-cyan-500 rounded p-4 text-center" data-astro-cid-e7phdjlt> <p class="text-gold text-3xl" data-astro-cid-e7phdjlt>', '</p> <p data-astro-cid-e7phdjlt>Posts</p> </div> <div class="bg-gray-900 border border-cyan-500 rounded p-4 text-center" data-astro-cid-e7phdjlt> <p class="text-gold text-3xl" data-astro-cid-e7phdjlt>', '</p> <p data-astro-cid-e7phdjlt>Reels</p> </div> <div class="bg-gray-900 border border-cyan-500 rounded p-4 text-center" data-astro-cid-e7phdjlt> <p class="text-gold text-3xl" data-astro-cid-e7phdjlt>', '</p> <p data-astro-cid-e7phdjlt>Views</p> </div> </div> </section>  <section class="mb-12" data-astro-cid-e7phdjlt> <h2 class="text-2xl text-neon-blue mb-4" data-astro-cid-e7phdjlt>Velocidade (LCP)</h2> <div class="grid grid-cols-4 gap-4" data-astro-cid-e7phdjlt> ', ' </div> </section>  <section class="mb-12" data-astro-cid-e7phdjlt> <h2 class="text-2xl text-neon-blue mb-4" data-astro-cid-e7phdjlt>Alerta de Guerra (ao vivo)</h2> <div class="bg-gray-900 border border-red-500 rounded p-6 max-h-96 overflow-y-auto" data-astro-cid-e7phdjlt> <ul class="space-y-2" data-astro-cid-e7phdjlt> ', ' </ul> </div> </section>  <div class="fixed bottom-8 right-8 space-x-4" data-astro-cid-e7phdjlt> <button class="bg-red-600 hover:bg-red-700 px-6 py-3 rounded text-xl" data-astro-cid-e7phdjlt>🔴 PARAR TUDO</button> <button class="bg-yellow-600 hover:bg-yellow-700 px-6 py-3 rounded text-xl" data-astro-cid-e7phdjlt>🟡 PAUSAR</button> <button class="bg-green-600 hover:bg-green-700 px-6 py-3 rounded text-xl" data-astro-cid-e7phdjlt>🟢 FORÇAR CICLO</button> </div> </div> '])), maybeRenderHead(), dados.uptime, dados.ciclos, dados.recursos.cpu, dados.recursos.ram, dados.recursos.disco, dados.recursos.rede, dados.tokens.toLocaleString(), renderScript($$result, "/home/lele/usenexo/getnexo-site/src/pages/admin/sentinel.astro?astro&type=script&index=0&lang.ts"), defineScriptVars({ rankData: [dados.rankMedio.pt, dados.rankMedio.es, dados.rankMedio.fr, dados.rankMedio.en] }), dados.keywordsTop.map((k) => renderTemplate`<tr class="border-b border-cyan-800" data-astro-cid-e7phdjlt> <td data-astro-cid-e7phdjlt>${k.palavra}</td> <td class="text-gold" data-astro-cid-e7phdjlt>${k.pos}</td> <td${addAttribute(k.var > 0 ? "text-green-400" : "text-red-400", "class")} data-astro-cid-e7phdjlt>${k.var > 0 ? "+" : ""}${k.var}</td> <td data-astro-cid-e7phdjlt>${k.ctr}%</td> </tr>`), dados.backlinks, dados.outreach.map((o) => renderTemplate`<li data-astro-cid-e7phdjlt>${o.site} – ${o.status} (${o.tempo})</li>`), dados.postsHoje, dados.reels, dados.social.views.toLocaleString(), Object.entries(dados.velocidade).map(([lang, tempo]) => renderTemplate`<div class="bg-gray-900 border border-cyan-500 rounded p-4 text-center" data-astro-cid-e7phdjlt> <p class="text-sm" data-astro-cid-e7phdjlt>${lang.toUpperCase()}</p> <p class="text-3xl text-gold" data-astro-cid-e7phdjlt>${tempo}s</p> </div>`), dados.alerta.map((a) => renderTemplate`<li class="text-sm" data-astro-cid-e7phdjlt>[ ${a.hora} ] ${a.msg}</li>`));
}, "/home/lele/usenexo/getnexo-site/src/pages/admin/sentinel.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/admin/sentinel.astro";
const $$url = "/admin/sentinel";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Sentinel,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
