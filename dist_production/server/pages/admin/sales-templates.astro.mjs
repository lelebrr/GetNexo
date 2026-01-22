import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, l as renderScript } from "../../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$AdminLayout } from "../../assets/AdminLayout-htIlQTkN.js";
import { renderers } from "../../renderers.mjs";
const $$SalesTemplates = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Templates de Vendas" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div id="sales-templates-root" class="min-h-screen bg-gray-50"> <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8"> <!-- Loading state --> <div id="loading-state" class="flex items-center justify-center min-h-[400px]"> <div class="text-center"> <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div> <p class="mt-4 text-gray-600">Carregando templates...</p> </div> </div> <!-- Main content --> <div id="main-content" class="hidden"> <!-- Content will be rendered here by React --> </div> </div> </div> ${renderScript($$result2, "/home/lele/usenexo/getnexo-site/src/pages/admin/sales-templates.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "/home/lele/usenexo/getnexo-site/src/pages/admin/sales-templates.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/admin/sales-templates.astro";
const $$url = "/admin/sales-templates";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$SalesTemplates,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
