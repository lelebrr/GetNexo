import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from "../../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$DashboardLayout } from "../../assets/DashboardLayout-DSSr717x.js";
import { renderers } from "../../renderers.mjs";
const $$Roles = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "Gerenciar Funções | OmniNexo" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div style="display:flex; flex-direction:column; gap:2.5rem;"> <div class="glass-panel" style="padding:2.5rem; background:linear-gradient(90deg, rgba(167, 139, 250, 0.15), rgba(0, 212, 255, 0.05)); border-color: rgba(167, 139, 250, 0.2);"> <h2 style="font-size:2.5rem; font-weight:900; color:white; margin:0;" class="text-gradient">Permissões & Matriz RBAC</h2> <p style="color:#94a3b8; margin:0.5rem 0 0; font-size:1.1rem;">Defina o que cada nível hierárquico pode acessar no ecossistema.</p> </div> ${renderComponent($$result2, "RolesManager", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "/home/lele/usenexo/getnexo-site/src/components/RolesManager.jsx", "client:component-export": "default" })} </div> ` })}`;
}, "/home/lele/usenexo/getnexo-site/src/pages/dashboard/roles.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/dashboard/roles.astro";
const $$url = "/dashboard/roles";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Roles,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
