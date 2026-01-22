import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from "../../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$ClientLayout } from "../../assets/ClientLayout-Cg0S0bz6.js";
import { T as TicketList } from "../../assets/TicketList-C_RCWgbE.js";
import { renderers } from "../../renderers.mjs";
const $$Chamados = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "ClientLayout", $$ClientLayout, { "title": "Chamados - Portal do Cliente" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="bg-white rounded-lg shadow p-6"> <h2 class="text-xl font-semibold mb-4">Meus Chamados</h2> <p class="text-gray-600 mb-6">Gerencie seus tickets de suporte aqui.</p> ${renderComponent($$result2, "TicketList", TicketList, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/lele/usenexo/getnexo-site/src/components/tickets/TicketList.jsx", "client:component-export": "default" })} </div> ` })}`;
}, "/home/lele/usenexo/getnexo-site/src/pages/cliente/chamados.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/cliente/chamados.astro";
const $$url = "/cliente/chamados";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Chamados,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
