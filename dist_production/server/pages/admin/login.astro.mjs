import { e as createAstro, f as createComponent, n as renderHead, o as renderSlot, r as renderTemplate, k as renderComponent, m as maybeRenderHead, l as renderScript } from "../../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import "clsx";
/* empty css                                   */
import { renderers } from "../../renderers.mjs";
const $$Astro = createAstro("https://getnexo.com.br");
const $$LoginLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$LoginLayout;
  const { title = "Admin Access | GetNexo" } = Astro2.props;
  return renderTemplate`<html lang="pt-BR"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title}</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">${renderHead()}</head> <body> ${renderSlot($$result, $$slots["default"])} </body></html>`;
}, "/home/lele/usenexo/getnexo-site/src/layouts/LoginLayout.astro", void 0);
const $$Login = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "LoginLayout", $$LoginLayout, { "title": "Admin Login | GetNexo", "data-astro-cid-rf56lckb": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="login-box cyber-card" data-astro-cid-rf56lckb> <div class="logo" data-astro-cid-rf56lckb>NEXUS<span class="dot" data-astro-cid-rf56lckb>.</span></div> <h2 data-astro-cid-rf56lckb>Access Terminal</h2> <p class="subtitle" data-astro-cid-rf56lckb>Enter credentials to initialize session</p> <form id="login-form" data-astro-cid-rf56lckb> <div class="input-group" data-astro-cid-rf56lckb> <label data-astro-cid-rf56lckb>Identifier</label> <input type="text" id="username" placeholder="Username" required data-astro-cid-rf56lckb> </div> <div class="input-group" data-astro-cid-rf56lckb> <label data-astro-cid-rf56lckb>Security Key</label> <input type="password" id="password" placeholder="••••••••" required data-astro-cid-rf56lckb> </div> <button type="submit" class="glow-btn" data-astro-cid-rf56lckb>Initialize Connection</button> <p id="error-msg" class="error-msg" data-astro-cid-rf56lckb></p> </form> </div> ${renderScript($$result2, "/home/lele/usenexo/getnexo-site/src/pages/admin/login.astro?astro&type=script&index=0&lang.ts")} ` })} `;
}, "/home/lele/usenexo/getnexo-site/src/pages/admin/login.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/admin/login.astro";
const $$url = "/admin/login";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
