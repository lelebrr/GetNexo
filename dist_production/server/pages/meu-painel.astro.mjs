import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from "../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$PanelLayout } from "../assets/PanelLayout-DPSIprMA.js";
/* empty css                                */
import { renderers } from "../renderers.mjs";
const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "PanelLayout", $$PanelLayout, { "title": "Meu Painel", "data-astro-cid-l25rmc7h": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="dashboard-grid" data-astro-cid-l25rmc7h> <div class="stat-card" data-astro-cid-l25rmc7h> <h3 data-astro-cid-l25rmc7h>Vendas Hoje</h3> <div class="value" data-astro-cid-l25rmc7h>R$ 1.540,50</div> <div class="trend positive" data-astro-cid-l25rmc7h>+12% vs ontem</div> </div> <div class="stat-card" data-astro-cid-l25rmc7h> <h3 data-astro-cid-l25rmc7h>Conversão</h3> <div class="value" data-astro-cid-l25rmc7h>3.2%</div> <div class="trend positive" data-astro-cid-l25rmc7h>+0.4%</div> </div> <div class="stat-card" data-astro-cid-l25rmc7h> <h3 data-astro-cid-l25rmc7h>Ticket Médio</h3> <div class="value" data-astro-cid-l25rmc7h>R$ 145,00</div> </div> <div class="stat-card" data-astro-cid-l25rmc7h> <h3 data-astro-cid-l25rmc7h>ROI Estimado</h3> <div class="value" data-astro-cid-l25rmc7h>450%</div> <div class="trend" data-astro-cid-l25rmc7h>Investimento: R$ 0</div> </div> </div> <div class="recent-activity-section" data-astro-cid-l25rmc7h> <h2 data-astro-cid-l25rmc7h>Atividade Recente</h2> <div class="activity-list" data-astro-cid-l25rmc7h> <div class="activity-item" data-astro-cid-l25rmc7h> <span class="dot" data-astro-cid-l25rmc7h></span> <span class="text" data-astro-cid-l25rmc7h>Pedido #1024 recuperado via WhatsApp</span> <span class="time" data-astro-cid-l25rmc7h>10 min atrás</span> </div> <div class="activity-item" data-astro-cid-l25rmc7h> <span class="dot" data-astro-cid-l25rmc7h></span> <span class="text" data-astro-cid-l25rmc7h>Novo lead capturado: Maria Silva</span> <span class="time" data-astro-cid-l25rmc7h>32 min atrás</span> </div> </div> </div> ` })} `;
}, "/home/lele/usenexo/getnexo-site/src/pages/meu-painel/index.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/meu-painel/index.astro";
const $$url = "/meu-painel";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
