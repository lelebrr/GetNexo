import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from "../../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$DashboardLayout } from "../../assets/DashboardLayout-DSSr717x.js";
import { renderers } from "../../renderers.mjs";
const $$Flows = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "Fluxos de IA | OmniNexo" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2rem;"> <div> <h1 style="font-size:2rem; font-weight:800; color:white; margin:0;">Construtor de Inteligência</h1> <p style="color:#94a3b8; margin:0.5rem 0 0;">Crie fluxos de conversa automáticos para vender, atender e encantar.</p> </div> <div style="display:flex; gap:10px;"> <button style="background:rgba(255,255,255,0.05); color:white; border:1px solid rgba(255,255,255,0.1); padding:10px 20px; border-radius:10px; cursor:pointer;" onclick="alert('Galeria de templates em breve!')">
📂 Templates
</button> <button style="background:var(--neon-green); color:black; font-weight:800; border:none; padding:10px 20px; border-radius:10px; cursor:pointer; box-shadow:0 0 15px rgba(0,255,157,0.2);">
▶️ Testar Fluxo
</button> </div> </div>   ${renderComponent($$result2, "FlowEditor", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "/home/lele/usenexo/getnexo-site/src/components/FlowEditor.jsx", "client:component-export": "default" })} ` })}`;
}, "/home/lele/usenexo/getnexo-site/src/pages/dashboard/flows.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/dashboard/flows.astro";
const $$url = "/dashboard/flows";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Flows,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
