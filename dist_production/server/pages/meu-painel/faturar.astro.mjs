import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from "../../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$PanelLayout } from "../../assets/PanelLayout-DPSIprMA.js";
/* empty css                                     */
import { renderers } from "../../renderers.mjs";
const $$Faturar = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "PanelLayout", $$PanelLayout, { "title": "Faturamento", "data-astro-cid-dhb6lvsg": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="billing-container" data-astro-cid-dhb6lvsg> <div class="current-plan" data-astro-cid-dhb6lvsg> <h2 data-astro-cid-dhb6lvsg>Plano Atual</h2> <div class="plan-card" data-astro-cid-dhb6lvsg> <div class="plan-header" data-astro-cid-dhb6lvsg> <h3 data-astro-cid-dhb6lvsg>Teste Grátis</h3> <span class="badge" data-astro-cid-dhb6lvsg>Ativo até 28/01</span> </div> <div class="price" data-astro-cid-dhb6lvsg>R$ 0,00<span data-astro-cid-dhb6lvsg>/mês</span></div> <ul data-astro-cid-dhb6lvsg> <li data-astro-cid-dhb6lvsg>✅ 1 Domínio</li> <li data-astro-cid-dhb6lvsg>✅ IA Básica</li> <li data-astro-cid-dhb6lvsg>❌ Sem Automação Avançada</li> </ul> </div> </div> <div class="upgrade-options" data-astro-cid-dhb6lvsg> <h2 data-astro-cid-dhb6lvsg>Melhore Seu Plano</h2> <div class="plan-card pro" data-astro-cid-dhb6lvsg> <div class="plan-header" data-astro-cid-dhb6lvsg> <h3 data-astro-cid-dhb6lvsg>Professional</h3> <span class="badge best-value" data-astro-cid-dhb6lvsg>Mais Popular</span> </div> <div class="price" data-astro-cid-dhb6lvsg>R$ 97<span data-astro-cid-dhb6lvsg>/mês</span></div> <p data-astro-cid-dhb6lvsg>Para quem quer vender de verdade.</p> <ul data-astro-cid-dhb6lvsg> <li data-astro-cid-dhb6lvsg>✅ Domínios Ilimitados</li> <li data-astro-cid-dhb6lvsg>✅ IA Premium (Gemini/Grok)</li> <li data-astro-cid-dhb6lvsg>✅ Recuperação de Carrinho</li> <li data-astro-cid-dhb6lvsg>✅ Suporte Prioritário</li> </ul> <button class="btn-upgrade" data-astro-cid-dhb6lvsg>MIGRAR AGORA</button> </div> </div> </div> ` })} `;
}, "/home/lele/usenexo/getnexo-site/src/pages/meu-painel/faturar.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/meu-painel/faturar.astro";
const $$url = "/meu-painel/faturar";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Faturar,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
