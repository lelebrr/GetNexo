import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from "../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$Layout } from "../assets/Layout-DScI-qCd.js";
/* empty css                              */
import { renderers } from "../renderers.mjs";
const $$Api = createComponent(($$result, $$props, $$slots) => {
  const apiStatus = {
    "status": 200,
    "message": "Welcome to the Evolution API, it is working!",
    "version": "2.2.2"
  };
  const messagePayload = {
    "number": "5511999999999",
    "message": "Oi, quer fechar uma venda hoje?"
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "API Premium RESTful GetNexo – Automação e Integração Profissional", "data-astro-cid-gtzdsgas": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="container" data-astro-cid-gtzdsgas> <h1 data-astro-cid-gtzdsgas>Documentação da API GetNexo</h1> <p data-astro-cid-gtzdsgas>API RESTful de alta performance baseada na Evolution API – integração premium para n8n, CRM e IA.</p> <div class="endpoint" data-astro-cid-gtzdsgas> <h2 data-astro-cid-gtzdsgas>Status da API</h2> <code data-astro-cid-gtzdsgas>GET https://api.getnexo.com.br/status</code> <pre data-astro-cid-gtzdsgas>${JSON.stringify(apiStatus, null, 2)}</pre> </div> <div class="endpoint" data-astro-cid-gtzdsgas> <h2 data-astro-cid-gtzdsgas>Enviar Mensagem</h2> <code data-astro-cid-gtzdsgas>POST https://api.getnexo.com.br/send-message</code> <pre data-astro-cid-gtzdsgas>${JSON.stringify(messagePayload, null, 2)}</pre> </div> <p data-astro-cid-gtzdsgas><a href="https://api.getnexo.com.br/manager" target="_blank" data-astro-cid-gtzdsgas>Acessar Manager da Evolution API</a></p> <p data-astro-cid-gtzdsgas><a href="/" data-astro-cid-gtzdsgas>← Voltar ao site</a></p> </section> ` })} `;
}, "/home/lele/usenexo/getnexo-site/src/pages/api.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/api.astro";
const $$url = "/api";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Api,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
