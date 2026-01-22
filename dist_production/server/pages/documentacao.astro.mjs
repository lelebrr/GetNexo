import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from "../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$Layout } from "../assets/Layout-DScI-qCd.js";
import { renderers } from "../renderers.mjs";
const $$Documentacao = createComponent(($$result, $$props, $$slots) => {
  const pageTitle = "Documentação GetNexo";
  const pageDescription = "Documentação técnica completa GetNexo.";
  const pageKeywords = "documentacao getnexo";
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": pageTitle, "description": pageDescription, "keywords": pageKeywords }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<h1>Documentação</h1> <p>Documentação técnica do GetNexo.</p> ` })}`;
}, "/home/lele/usenexo/getnexo-site/src/pages/documentacao.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/documentacao.astro";
const $$url = "/documentacao";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Documentacao,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
