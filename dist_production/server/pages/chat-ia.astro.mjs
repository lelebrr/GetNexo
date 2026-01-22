import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from "../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$Layout } from "../assets/Layout-DScI-qCd.js";
import { renderers } from "../renderers.mjs";
const $$ChatIa = createComponent(($$result, $$props, $$slots) => {
  const title = "Chat IA Automatizado GetNexo - Respostas Inteligentes 24h WhatsApp | Magic Replies GPT-4";
  const description = "Chat IA avançado que responde automaticamente no WhatsApp. Magic Replies treinados no seu negócio com GPT-4. Análise de sentimento em tempo real. Nunca mais perca vendas por demora. Setup em 5 minutos.";
  const keywords = "chat ia automatizado whatsapp, respostas inteligentes whatsapp, ia whatsapp vendas, magic replies gpt4, análise sentimento whatsapp, chat automatico 24h, bot conversacional whatsapp, ia vendas online, atendimento automatico whatsapp, chatbot whatsapp gratis";
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": title, "description": description, "keywords": keywords }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<h1>Chat IA</h1> <p>Teste basico</p> ` })}`;
}, "/home/lele/usenexo/getnexo-site/src/pages/chat-ia.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/chat-ia.astro";
const $$url = "/chat-ia";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$ChatIa,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
