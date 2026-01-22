import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from "../../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$Layout } from "../../assets/Layout-DScI-qCd.js";
/* empty css                                        */
import { renderers } from "../../renderers.mjs";
const $$ECommerce = createComponent(($$result, $$props, $$slots) => {
  const title = "Recuperação de Carrinho e Vendas no WhatsApp para E-commerce | GetNexo";
  const description = "Aumente as vendas do seu E-commerce em até 35% recuperando carrinhos abandonados, boletos e PIX pendentes automaticamente no WhatsApp com IA.";
  const keywords = "recuperação carrinho whatsapp, automação e-commerce whatsapp, bot para loja virtual, shopify whatsapp, nuvemshop whatsapp, woocommerce whatsapp";
  const stats = [
    { value: "35%", label: "Mais Conversão", desc: "Em carrinhos abandonados" },
    { value: "98%", label: "Taxa de Abertura", desc: "Imbatível contra E-mail" },
    { value: "Zero", label: "Setup", desc: "Integração plug & play" },
    { value: "24h", label: "Vendas", desc: "O bot vende enquanto você dorme" }
  ];
  const painPoints = [
    {
      icon: "🛒",
      title: "Carrinhos Abandonados",
      desc: "Cerca de 70% dos clientes desistem na hora de pagar. O e-mail marketing cai no spam. O WhatsApp chega na tela de bloqueio e converte."
    },
    {
      icon: "📄",
      title: "Boletos não Pagos",
      desc: "O cliente gera o boleto e esquece. O GetNexo envia o código de barras e o PIX copia-e-cola automaticamente antes do vencimento."
    },
    {
      icon: "📦",
      title: "Onde está meu pedido?",
      desc: "Reduza o suporte (SAC). O bot informa o status de rastreio automaticamente, tirando a carga da sua equipe de atendimento."
    }
  ];
  const features = [
    {
      title: "Integração Nativa",
      desc: "Conecta com Shopify, Nuvemshop, WooCommerce, VTEX e Yampi em minutos. Sem necessidade de programador.",
      icon: "🔌"
    },
    {
      title: "Catálogo no WhatsApp",
      desc: "Sincronize seus produtos. O cliente pode navegar, escolher variantes (cor/tamanho) e fechar o pedido diretamente no chat.",
      icon: "🛍️"
    },
    {
      title: "Ofertas Relâmpago",
      desc: "Envie promoções de Black Friday ou queima de estoque para sua base de clientes antigos com apenas um clique (Broadcast seguro).",
      icon: "🔥"
    }
  ];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": title, "description": description, "keywords": keywords, "data-astro-cid-vml57txz": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="segment-hero" data-astro-cid-vml57txz> <div class="hero-content" data-astro-cid-vml57txz> <div class="badge" data-astro-cid-vml57txz>Para E-commerce e Dropshipping</div> <h1 data-astro-cid-vml57txz>Transforme Carrinhos Abandonados em <span class="text-gradient" data-astro-cid-vml57txz>Lucro Líquido</span></h1> <p class="hero-text" data-astro-cid-vml57txz>
Pare de deixar dinheiro na mesa. A automação GetNexo recupera até 35% das vendas perdidas abordando seu cliente no canal que ele mais usa: o WhatsApp.
</p> <div class="hero-btns" data-astro-cid-vml57txz> <a href="/criar-bot" class="btn-primary-glow" data-astro-cid-vml57txz>Conectar Minha Loja</a> <a href="/demo" class="btn-outline" data-astro-cid-vml57txz>Ver Recuperação ao Vivo</a> </div> </div> <div class="hero-stats" data-astro-cid-vml57txz> ${stats.map((s) => renderTemplate`<div class="stat-item glass-panel" data-astro-cid-vml57txz> <span class="stat-val" data-astro-cid-vml57txz>${s.value}</span> <span class="stat-lbl" data-astro-cid-vml57txz>${s.label}</span> <span class="stat-dsc" data-astro-cid-vml57txz>${s.desc}</span> </div>`)} </div> </section> <section class="seo-content" data-astro-cid-vml57txz> <h2 data-astro-cid-vml57txz>A ferramenta secreta dos <span class="text-gradient" data-astro-cid-vml57txz>Grandes Players</span></h2> <p data-astro-cid-vml57txz>
O segredo das operações de e-commerce que escalam não é apenas "tráfego barato". É a **eficiência no fundo do funil**. 
      Para cada R$ 100,00 que você investe em ads, provavelmente R$ 70,00 está indo para pessoas que clicam, colocam no carrinho e saem.
</p> <p data-astro-cid-vml57txz>
O e-mail de recuperação padrão tem 10% de abertura. **O WhatsApp tem 98%.**
      Fazer a conta é simples: Usar o GetNexo é matematicamente a decisão mais lucrativa que você pode tomar hoje para sua loja.
</p> </section> <section class="pain-section" data-astro-cid-vml57txz> <h2 data-astro-cid-vml57txz>Onde você está <span class="text-gradient" data-astro-cid-vml57txz>perdendo dinheiro</span>?</h2> <div class="pain-grid" data-astro-cid-vml57txz> ${painPoints.map((p) => renderTemplate`<div class="pain-card glass-panel" data-astro-cid-vml57txz> <span class="pain-icon" data-astro-cid-vml57txz>${p.icon}</span> <h3 data-astro-cid-vml57txz>${p.title}</h3> <p data-astro-cid-vml57txz>${p.desc}</p> </div>`)} </div> </section> <section class="features-section" data-astro-cid-vml57txz> <h2 data-astro-cid-vml57txz>Funcionalidades de Vendas</h2> <div class="feat-grid" data-astro-cid-vml57txz> ${features.map((f) => renderTemplate`<div class="feat-card glass-panel" data-astro-cid-vml57txz> <div class="feat-header" data-astro-cid-vml57txz> <span class="feat-icon" data-astro-cid-vml57txz>${f.icon}</span> <h3 data-astro-cid-vml57txz>${f.title}</h3> </div> <p data-astro-cid-vml57txz>${f.desc}</p> </div>`)} </div> </section> <section class="deep-dive" data-astro-cid-vml57txz> <article data-astro-cid-vml57txz> <h3 data-astro-cid-vml57txz>Checkout Transparente no WhatsApp</h3> <p data-astro-cid-vml57txz>
O GetNexo não é apenas um "bot de mensagem". Ele é um terminal de vendas. Com a nossa tecnologia de <strong data-astro-cid-vml57txz>PIX Nativo</strong>, 
        o cliente recebe o código Copia e Cola dentro da conversa. Assim que ele paga, o sistema reconhece o pagamento em tempo real, 
        agradece o cliente e já move o pedido para "Pago" no seu ERP.
</p> <h3 data-astro-cid-vml57txz>Suporte Humanizado Híbrido</h3> <p data-astro-cid-vml57txz>
E se o cliente tiver uma dúvida sobre o tamanho? A IA responde. 
        E se for uma troca complexa? A IA transfere para um atendente humano.
        Tudo isso acontece no mesmo número, mantendo o histórico unificado. Você nunca mais vai perder uma venda porque "ninguém respondeu o direct".
</p> </article> </section> <section class="final-cta" data-astro-cid-vml57txz> <div class="cta-box glass-panel" data-astro-cid-vml57txz> <h2 data-astro-cid-vml57txz>Venda Mais Hoje Mesmo</h2> <p data-astro-cid-vml57txz>Conecte sua loja Shopify, Nuvemshop ou Cartx em menos de 5 minutos.</p> <a href="/criar-bot" class="btn-primary-glow" data-astro-cid-vml57txz>Começar Teste Grátis</a> </div> </section> ` })} `;
}, "/home/lele/usenexo/getnexo-site/src/pages/segmentos/e-commerce.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/segmentos/e-commerce.astro";
const $$url = "/segmentos/e-commerce";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$ECommerce,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
