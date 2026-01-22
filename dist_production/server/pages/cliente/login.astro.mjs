import { e as createAstro, f as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, m as maybeRenderHead } from "../../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$Layout } from "../../assets/Layout-DScI-qCd.js";
import { l as verifyMagicLink, g as generateToken } from "../../assets/auth-bbOfVkaL.js";
/* empty css                                   */
import { renderers } from "../../renderers.mjs";
const $$Astro = createAstro("https://getnexo.com.br");
const $$Login = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Login;
  const token = Astro2.url.searchParams.get("token");
  let user = null;
  let error = null;
  if (token) {
    user = verifyMagicLink(token);
    if (!user) {
      error = "Link inválido ou expirado";
    }
  }
  if (user && !error) {
    generateToken(user);
    return Astro2.redirect("/cliente/hub");
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Login - Portal do Cliente", "data-astro-cid-hpyi5dpa": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="login-container" data-astro-cid-hpyi5dpa> <div class="login-card" data-astro-cid-hpyi5dpa> <h1 data-astro-cid-hpyi5dpa>Portal do Cliente</h1> <p data-astro-cid-hpyi5dpa>Acesse seu hub unificado sem senha</p> ${error && renderTemplate`<div class="error" data-astro-cid-hpyi5dpa>${error}</div>`} <div class="login-methods" data-astro-cid-hpyi5dpa> <form action="/api/auth/magic-link" method="POST" class="login-form" data-astro-cid-hpyi5dpa> <input type="email" name="email" placeholder="Seu email" required data-astro-cid-hpyi5dpa> <button type="submit" data-astro-cid-hpyi5dpa>Receber Link Mágico</button> </form> <form action="/api/auth/whatsapp-link" method="POST" class="login-form" data-astro-cid-hpyi5dpa> <input type="tel" name="phone" placeholder="Seu WhatsApp" required data-astro-cid-hpyi5dpa> <button type="submit" data-astro-cid-hpyi5dpa>Receber via WhatsApp</button> </form> <div class="qr-section" data-astro-cid-hpyi5dpa> <p data-astro-cid-hpyi5dpa>Ou escaneie o QR Code:</p> <div id="qr-code" data-astro-cid-hpyi5dpa></div> </div> </div> </div> </div> ` })}  ${renderScript($$result, "/home/lele/usenexo/getnexo-site/src/pages/cliente/login.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/lele/usenexo/getnexo-site/src/pages/cliente/login.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/cliente/login.astro";
const $$url = "/cliente/login";
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
