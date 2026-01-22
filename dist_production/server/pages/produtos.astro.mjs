import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from "../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$Layout } from "../assets/Layout-DScI-qCd.js";
/* empty css                                */
import { renderers } from "../renderers.mjs";
const $$Index = createComponent(($$result, $$props, $$slots) => {
  const title = "Soluções GetNexo - Automação WhatsApp com IA | Vendas, CRM e Marketing";
  const description = "Conheça todas as soluções GetNexo: Automação com IA, PIX nativo, CRM Kanban, Broadcast e Click-to-WhatsApp Ads. Ferramentas completas para escalar vendas no WhatsApp.";
  const keywords = "automação whatsapp, crm whatsapp, pix whatsapp, broadcast whatsapp, chatbot ia, getnexo produtos, vendas whatsapp";
  const products = [
    {
      icon: "🤖",
      title: "Automação com IA",
      description: "Chatbot inteligente com IA generativa que responde, qualifica leads e agenda reuniões automaticamente 24/7. Treinado com dados do seu negócio.",
      href: "/produtos/automacao",
      badge: "Mais Popular",
      features: ["Respostas humanizadas", "Qualificação automática", "Handoff para humano"]
    },
    {
      icon: "💰",
      title: "Vendas & Checkout PIX",
      description: "Pagamentos via PIX nativo dentro do WhatsApp. Gere cobranças, confirme pagamentos e gerencie pedidos sem sair da conversa.",
      href: "/produtos/vendas",
      badge: null,
      features: ["PIX copia e cola", "QR Code automático", "Webhook de confirmação"]
    },
    {
      icon: "📢",
      title: "Marketing & Broadcast",
      description: "Dispare mensagens para milhares de contatos com segmentação avançada. Integre Click-to-WhatsApp Ads e meça seu ROI.",
      href: "/produtos/marketing",
      badge: "Novo",
      features: ["Broadcast ilimitado", "Templates aprovados", "UTM tracking"]
    },
    {
      icon: "📊",
      title: "CRM Multi-Agente",
      description: "Organize leads em Kanban, atribua conversas para sua equipe, monitore SLA e nunca perca uma oportunidade de venda.",
      href: "/produtos/crm",
      badge: null,
      features: ["Kanban visual", "Multi-atendentes", "Métricas em tempo real"]
    }
  ];
  const useCases = [
    { icon: "🛒", title: "E-commerce", desc: "Recupere carrinhos abandonados e venda mais", href: "/segmentos/e-commerce" },
    { icon: "🏥", title: "Clínicas", desc: "Agende consultas e envie lembretes automáticos", href: "/segmentos/clinicas" },
    { icon: "🏠", title: "Imobiliárias", desc: "Qualifique leads e agende visitas 24h", href: "/segmentos/imobiliarias" },
    { icon: "📚", title: "Educação", desc: "Engaje alunos e automatize matrículas", href: "/segmentos/educacao" },
    { icon: "🍕", title: "Delivery", desc: "Receba pedidos e confirme pagamentos via PIX", href: "/segmentos/delivery" },
    { icon: "💼", title: "Consultoria", desc: "Agende reuniões e qualifique prospects", href: "/segmentos/consultoria" },
    { icon: "💻", title: "Agência Web", desc: "Automatize suporte, captação e relatórios", href: "/segmentos/agencia-web" },
    { icon: "➕", title: "Outros Segmentos", desc: "Turismo, Eventos, Varejo e muito mais", href: "/segmentos/outros" }
  ];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": title, "description": description, "keywords": keywords, "data-astro-cid-qcyxcsd4": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="products-hero" data-astro-cid-qcyxcsd4> <div class="hero-badge" data-astro-cid-qcyxcsd4>Ecossistema Completo</div> <h1 data-astro-cid-qcyxcsd4>Soluções <span class="text-gradient" data-astro-cid-qcyxcsd4>GetNexo</span></h1> <p class="hero-desc" data-astro-cid-qcyxcsd4>
Ferramentas poderosas para automatizar cada etapa do seu funil de vendas no WhatsApp — do primeiro contato ao pagamento confirmado.
</p> <div class="products-grid" data-astro-cid-qcyxcsd4> ${products.map((product) => renderTemplate`<a${addAttribute(product.href, "href")} class="product-card glass-panel" data-astro-cid-qcyxcsd4> ${product.badge && renderTemplate`<span class="card-badge" data-astro-cid-qcyxcsd4>${product.badge}</span>`} <div class="card-icon" data-astro-cid-qcyxcsd4>${product.icon}</div> <h3 data-astro-cid-qcyxcsd4>${product.title}</h3> <p data-astro-cid-qcyxcsd4>${product.description}</p> <ul class="feature-list" data-astro-cid-qcyxcsd4> ${product.features.map((f) => renderTemplate`<li data-astro-cid-qcyxcsd4>✓ ${f}</li>`)} </ul> <span class="learn-more" data-astro-cid-qcyxcsd4>Explorar solução →</span> </a>`)} </div> </section>  <section class="use-cases" data-astro-cid-qcyxcsd4> <h2 data-astro-cid-qcyxcsd4>Usado por <span class="text-gradient" data-astro-cid-qcyxcsd4>milhares de empresas</span></h2> <p class="section-desc" data-astro-cid-qcyxcsd4>Descubra como diferentes segmentos estão transformando suas vendas com GetNexo</p> <div class="cases-grid" data-astro-cid-qcyxcsd4> ${useCases.map((uc) => renderTemplate`<a${addAttribute(uc.href, "href")} class="case-card glass-panel" data-astro-cid-qcyxcsd4> <span class="case-icon" data-astro-cid-qcyxcsd4>${uc.icon}</span> <h4 data-astro-cid-qcyxcsd4>${uc.title}</h4> <p data-astro-cid-qcyxcsd4>${uc.desc}</p> </a>`)} </div> </section>  <section class="products-cta" data-astro-cid-qcyxcsd4> <div class="glass-panel cta-box" data-astro-cid-qcyxcsd4> <h2 data-astro-cid-qcyxcsd4>Pronto para <span class="text-gradient" data-astro-cid-qcyxcsd4>automatizar suas vendas</span>?</h2> <p data-astro-cid-qcyxcsd4>Comece gratuitamente e veja resultados em minutos, não dias.</p> <div class="cta-buttons" data-astro-cid-qcyxcsd4> <a href="/criar-bot" class="btn-primary" data-astro-cid-qcyxcsd4>Criar Meu Bot Grátis</a> <a href="/demo" class="btn-outline" data-astro-cid-qcyxcsd4>Ver Demonstração</a> </div> </div> </section> ` })} `;
}, "/home/lele/usenexo/getnexo-site/src/pages/produtos/index.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/produtos/index.astro";
const $$url = "/produtos";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
