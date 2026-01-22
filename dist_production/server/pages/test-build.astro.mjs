import { f as createComponent, n as renderHead, r as renderTemplate } from "../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import "clsx";
import { renderers } from "../renderers.mjs";
const $$TestBuild = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`<html lang="pt-BR"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Teste Build</title>${renderHead()}</head> <body> <h1>Teste Build</h1> <p>Página de teste simples.</p> </body></html>`;
}, "/home/lele/usenexo/getnexo-site/src/pages/test-build.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/test-build.astro";
const $$url = "/test-build";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$TestBuild,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
