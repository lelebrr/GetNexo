import { f as createComponent, r as renderTemplate, k as renderComponent, m as maybeRenderHead } from "../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$Layout } from "../assets/Layout-DScI-qCd.js";
/* empty css                              */
import { renderers } from "../renderers.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$404 = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate(_a || (_a = __template(["", "  <script>\n  // Konami Code Easter Egg\n  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown'];\n  let konamiIndex = 0;\n  \n  document.addEventListener('keydown', (e) => {\n    if (e.key === konamiCode[konamiIndex]) {\n      konamiIndex++;\n      if (konamiIndex === konamiCode.length) {\n        document.body.style.transition = 'all 1s';\n        document.body.style.filter = 'hue-rotate(180deg)';\n        setTimeout(() => {\n          alert('🎮 Matrix Mode Activated! You found the secret.');\n        }, 500);\n        konamiIndex = 0;\n      }\n    } else {\n      konamiIndex = 0;\n    }\n  });\n<\/script>"])), renderComponent($$result, "Layout", $$Layout, { "title": "404 - Página não encontrada | GetNexo", "data-astro-cid-zetdm5md": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="error-container" data-astro-cid-zetdm5md> <div class="glitch-wrapper" data-astro-cid-zetdm5md> <h1 class="glitch" data-text="404" data-astro-cid-zetdm5md>404</h1> </div> <div class="message-box" data-astro-cid-zetdm5md> <h2 data-astro-cid-zetdm5md>🔮 Você se perdeu na Matrix...</h2> <p data-astro-cid-zetdm5md>A página que você procura não existe nesta dimensão.</p> <div class="suggestions" data-astro-cid-zetdm5md> <p data-astro-cid-zetdm5md>Talvez você queira:</p> <ul data-astro-cid-zetdm5md> <li data-astro-cid-zetdm5md><a href="/" data-astro-cid-zetdm5md>🏠 Voltar para o início</a></li> <li data-astro-cid-zetdm5md><a href="/blog" data-astro-cid-zetdm5md>📚 Ler nosso blog</a></li> <li data-astro-cid-zetdm5md><a href="/oferta" data-astro-cid-zetdm5md>🔥 Ver nossa oferta</a></li> <li data-astro-cid-zetdm5md><a href="#" onclick="if(window.$chatwoot){window.$chatwoot.toggle()}else{window.location.href='/contato'}; return false;" data-astro-cid-zetdm5md>💬 Falar com o Nexo</a></li> </ul> </div> </div> <div class="easter-egg" data-astro-cid-zetdm5md> <p data-astro-cid-zetdm5md>Ou pressione <kbd data-astro-cid-zetdm5md>↑</kbd> <kbd data-astro-cid-zetdm5md>↑</kbd> <kbd data-astro-cid-zetdm5md>↓</kbd> <kbd data-astro-cid-zetdm5md>↓</kbd> para algo especial...</p> </div> </div> ` }));
}, "/home/lele/usenexo/getnexo-site/src/pages/404.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/404.astro";
const $$url = "/404";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$404,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
