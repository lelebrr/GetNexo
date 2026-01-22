import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from "../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$Layout } from "../assets/Layout-DScI-qCd.js";
import { renderers } from "../renderers.mjs";
const $$Test = createComponent(($$result, $$props, $$slots) => {
  const title = "Test Page";
  const description = "Test description";
  const keywords = "test";
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": title, "description": description, "keywords": keywords }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<h1>Test</h1> <p>Test page</p> ` })}`;
}, "/home/lele/usenexo/getnexo-site/src/pages/test.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/test.astro";
const $$url = "/test";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Test,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
