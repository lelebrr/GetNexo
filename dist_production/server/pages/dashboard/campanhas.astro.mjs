import { f as createComponent, k as renderComponent, r as renderTemplate } from "../../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$DashboardLayout } from "../../assets/DashboardLayout-DSSr717x.js";
import { renderers } from "../../renderers.mjs";
const $$Campanhas = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "Campanhas | OmniNexo" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "OmniChatApp", null, { "client:only": "react", "initialTab": "broadcast", "client:component-hydration": "only", "client:component-path": "/home/lele/usenexo/getnexo-site/src/components/OmniChatApp.jsx", "client:component-export": "default" })} ` })}`;
}, "/home/lele/usenexo/getnexo-site/src/pages/dashboard/campanhas.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/dashboard/campanhas.astro";
const $$url = "/dashboard/campanhas";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Campanhas,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
