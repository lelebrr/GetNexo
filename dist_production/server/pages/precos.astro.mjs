import { f as createComponent, r as renderTemplate, k as renderComponent, m as maybeRenderHead, h as addAttribute, u as unescapeHTML } from "../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$Layout } from "../assets/Layout-DScI-qCd.js";
/* empty css                                 */
import { renderers } from "../renderers.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a, _b;
const $$Precos = createComponent(($$result, $$props, $$slots) => {
  const title = "Planos e Preços GetNexo | Melhor Custo-Benefício em Automação WhatsApp";
  const description = "Compare planos do GetNexo: Starter, Pro e Enterprise. Automação WhatsApp com IA, chaves de API ilimitadas e suporte premium.";
  const keywords = "preço getnexo, planos whatsapp api, automação whatsapp valor, custo benefício whatsapp bot";
  const plans = [
    {
      name: "Self-Hosted",
      type: "Código Aberto",
      price: "Grátis",
      period: "",
      description: "Ideal para desenvolvedores e empresas com equipe técnica.",
      features: [
        { text: "Mensagens ilimitadas", included: true, highlight: true },
        { text: "Todos os recursos liberados", included: true, highlight: false },
        { text: "Seus dados, sua soberania", included: true, highlight: false },
        { text: "Multi-agente ilimitado", included: true, highlight: false },
        { text: "Atualizações da comunidade", included: true, highlight: false },
        { text: "Instalação por sua conta", included: false, highlight: false },
        { text: "Suporte via comunidade", included: false, highlight: false }
      ],
      cta: "Baixar no GitHub",
      ctaLink: "https://github.com/lelebrr",
      popular: false
    },
    {
      name: "GetNexo Pro",
      type: "Nuvem Gerenciada",
      price: "R$ 97",
      period: "/mês",
      description: "Nós cuidamos de tudo. Você só vende.",
      features: [
        { text: "Tudo do plano Grátis", included: true, highlight: true },
        { text: "Servidores NVMe ultra-rápidos", included: true, highlight: false },
        { text: "Ativação em 5 minutos", included: true, highlight: false },
        { text: "Backups automáticos diários", included: true, highlight: false },
        { text: "SSL e domínio incluso", included: true, highlight: false },
        { text: "Suporte VIP via WhatsApp", included: true, highlight: true },
        { text: "Atualizações automáticas", included: true, highlight: false }
      ],
      cta: "Começar Agora",
      ctaLink: "/criar-bot",
      popular: true
    },
    {
      name: "Enterprise",
      type: "Grandes Operações",
      price: "Custom",
      period: "",
      description: "Para operações de alto volume e requisitos específicos.",
      features: [
        { text: "Múltiplas instâncias de IA", included: true, highlight: true },
        { text: "API RESTful dedicada (Alta Vazão)", included: true, highlight: false },
        { text: "Consultoria de IA inclusa", included: true, highlight: false },
        { text: "SLA garantido em contrato", included: true, highlight: false },
        { text: "White Label completo", included: true, highlight: false },
        { text: "Gerente de conta dedicado", included: true, highlight: true },
        { text: "Treinamento para equipe", included: true, highlight: false }
      ],
      cta: "Falar com Consultor",
      ctaLink: "/contato",
      popular: false
    }
  ];
  const comparison = [
    { feature: "Mensagens/mês", selfhosted: "∞ Ilimitado", pro: "∞ Ilimitado", enterprise: "∞ Ilimitado" },
    { feature: "IA Generativa", selfhosted: "OpenAI/Gemini", pro: "OpenAI/Gemini", enterprise: "Modelo customizado" },
    { feature: "Agentes simultâneos", selfhosted: "Ilimitado", pro: "Ilimitado", enterprise: "Ilimitado" },
    { feature: "Checkout PIX", selfhosted: "✓", pro: "✓", enterprise: "✓" },
    { feature: "CRM Kanban", selfhosted: "✓", pro: "✓", enterprise: "✓" },
    { feature: "Broadcast", selfhosted: "✓", pro: "✓", enterprise: "Prioridade" },
    { feature: "Integrações", selfhosted: "Todas", pro: "Todas", enterprise: "Todas + Custom" },
    { feature: "Suporte", selfhosted: "Comunidade", pro: "VIP WhatsApp", enterprise: "Dedicado 24/7" },
    { feature: "SLA uptime", selfhosted: "N/A", pro: "99.5%", enterprise: "99.9%" },
    { feature: "Backups", selfhosted: "Manual", pro: "Automático", enterprise: "Automático + Geo" }
  ];
  const addons = [
    { name: "Número WhatsApp Adicional", price: "R$ 47/mês", desc: "Cada número extra para múltiplos negócios" },
    { name: "Instalação Assistida", price: "R$ 297 único", desc: "Setup completo self-hosted com treinamento" },
    { name: "Consultoria de IA", price: "R$ 197/hora", desc: "Otimização de prompts e fluxos" },
    { name: "White Label", price: "Sob consulta", desc: "Sua marca, seu domínio, interface customizada" }
  ];
  const guarantees = [
    { icon: "💰", title: "7 dias grátis", desc: "Teste o plano Pro sem compromisso" },
    { icon: "🔒", title: "Sem fidelidade", desc: "Cancele quando quiser, sem multa" },
    { icon: "📊", title: "Sem taxa por msg", desc: "Pague apenas a mensalidade fixa" },
    { icon: "🔄", title: "Migração grátis", desc: "Ajudamos a trazer seus dados" }
  ];
  const faqs = [
    {
      q: "Tem taxa por mensagem enviada?",
      a: "Não! Você paga apenas a mensalidade do plano Pro (R$ 97) ou nada no self-hosted. As únicas taxas adicionais são as cobradas pela Meta se você exceder o limite gratuito da API Cloud (primeiras 1000 conversas/mês são grátis)."
    },
    {
      q: "Qual a diferença entre Self-Hosted e Pro?",
      a: "No Self-Hosted você instala e mantém tudo no seu servidor. No Pro, nós cuidamos de infraestrutura, backups, SSL, atualizações e oferecemos suporte VIP. Os recursos de IA e automação são idênticos em ambos."
    },
    {
      q: "Posso começar grátis e migrar pro Pro depois?",
      a: "Sim! Muitos clientes começam self-hosted para testar e depois migram para a nuvem Pro quando querem praticidade. A migração é simples e ajudamos no processo."
    },
    {
      q: "Se eu cancelar, perco meus dados?",
      a: "Não. Você pode exportar todos os seus dados antes de cancelar. No self-hosted, os dados já são seus. No Pro, fornecemos backup completo para download."
    },
    {
      q: "Quais formas de pagamento aceitam?",
      a: "PIX (com 5% desconto), cartão de crédito (até 12x), boleto e transferência bancária. Para Enterprise, condições especiais são negociadas."
    },
    {
      q: "E se eu precisar de mais de 3 números?",
      a: "Sem problemas! Cada número adicional custa R$ 47/mês. Para volumes maiores (10+), oferecemos desconto progressivo no plano Enterprise."
    }
  ];
  const testimonialPricing = [
    { name: "Ricardo", company: "Loja Virtual", text: "Gastava R$ 4.500/mês com 3 atendentes. Hoje pago R$ 97 e a IA faz mais que eles faziam!", avatar: "👨‍💼" },
    { name: "Fernanda", company: "Clínica Estética", text: "O ROI foi absurdo. Primeira semana já tinha recuperado 6 meses de mensalidade.", avatar: "👩‍⚕️" }
  ];
  const priceSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://getnexo.com.br/#organization",
        "name": "GetNexo",
        "alternateName": "getnexo",
        "url": "https://getnexo.com.br",
        "logo": {
          "@type": "ImageObject",
          "url": "https://getnexo.com.br/logo.svg",
          "width": 512,
          "height": 512
        },
        "sameAs": [
          "https://github.com/lelebrr",
          "https://linkedin.com/company/getnexo",
          "https://instagram.com/getnexo"
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+55-11-99999-9999",
          "contactType": "customer service",
          "availableLanguage": "Portuguese",
          "areaServed": "BR"
        }
      },
      {
        "@type": "WebPage",
        "@id": "https://getnexo.com.br/precos/#webpage",
        "url": "https://getnexo.com.br/precos",
        "name": "Preços GetNexo - Planos Transparentes Sem Surpresas | GetNexo",
        "description": "Escolha o plano ideal: Self-hosted gratuito, Nuvem Pro a partir de R$97/mês ou Enterprise customizado. Sem taxa por mensagem, sem fidelidade, ROI garantido.",
        "isPartOf": {
          "@id": "https://getnexo.com.br/#website"
        },
        "primaryImageOfPage": {
          "@type": "ImageObject",
          "url": "https://getnexo.com.br/precos-hero.jpg"
        },
        "datePublished": "2024-01-01",
        "dateModified": "2024-01-01"
      },
      {
        "@type": "FAQPage",
        "mainEntity": faqs.map((faq) => ({
          "@type": "Question",
          "name": faq.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.a
          }
        }))
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://getnexo.com.br"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Preços",
            "item": "https://getnexo.com.br/precos"
          }
        ]
      },
      {
        "@type": "Offer",
        "name": "GetNexo Pro",
        "description": "Plano nuvem gerenciado com suporte VIP",
        "price": "97",
        "priceCurrency": "BRL",
        "priceValidUntil": "2024-12-31",
        "seller": {
          "@type": "Organization",
          "@id": "https://getnexo.com.br/#organization"
        },
        "availability": "https://schema.org/InStock"
      }
    ]
  };
  return renderTemplate(_b || (_b = __template(["", " <script>\n  const leadSlider = document.getElementById('lead-slider');\n  const costSlider = document.getElementById('cost-slider');\n  const leadVal = document.getElementById('lead-value');\n  const costVal = document.getElementById('cost-value');\n  const roiSavings = document.getElementById('roi-savings');\n\n  function updateROI() {\n    const leads = parseInt(leadSlider.value);\n    const costPerHuman = parseInt(costSlider.value);\n    \n    let humansSaved = 1;\n    if (leads > 2000) humansSaved = 3;\n    if (leads > 10000) humansSaved = 6;\n    if (leads > 30000) humansSaved = 12;\n\n    const totalCostSaved = (humansSaved * costPerHuman) - 97;\n    \n    leadVal.innerText = leads.toLocaleString();\n    costVal.innerText = `R$ ${costPerHuman.toLocaleString()}`;\n    roiSavings.innerText = `R$ ${Math.max(0, totalCostSaved).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;\n  }\n\n  leadSlider?.addEventListener('input', updateROI);\n  costSlider?.addEventListener('input', updateROI);\n  updateROI();\n<\/script> "], ["", " <script>\n  const leadSlider = document.getElementById('lead-slider');\n  const costSlider = document.getElementById('cost-slider');\n  const leadVal = document.getElementById('lead-value');\n  const costVal = document.getElementById('cost-value');\n  const roiSavings = document.getElementById('roi-savings');\n\n  function updateROI() {\n    const leads = parseInt(leadSlider.value);\n    const costPerHuman = parseInt(costSlider.value);\n    \n    let humansSaved = 1;\n    if (leads > 2000) humansSaved = 3;\n    if (leads > 10000) humansSaved = 6;\n    if (leads > 30000) humansSaved = 12;\n\n    const totalCostSaved = (humansSaved * costPerHuman) - 97;\n    \n    leadVal.innerText = leads.toLocaleString();\n    costVal.innerText = \\`R$ \\${costPerHuman.toLocaleString()}\\`;\n    roiSavings.innerText = \\`R$ \\${Math.max(0, totalCostSaved).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\\`;\n  }\n\n  leadSlider?.addEventListener('input', updateROI);\n  costSlider?.addEventListener('input', updateROI);\n  updateROI();\n<\/script> "])), renderComponent($$result, "Layout", $$Layout, { "title": title, "description": description, "keywords": keywords, "data-astro-cid-trulbuyk": true }, { "default": ($$result2) => renderTemplate(_a || (_a = __template(["  ", '<section class="pricing-hero" data-astro-cid-trulbuyk> <div class="hero-badge" data-astro-cid-trulbuyk>💰 ROI Imbatível</div> <h1 data-astro-cid-trulbuyk>Preços <span class="text-gradient" data-astro-cid-trulbuyk>transparentes</span></h1> <p class="hero-subtitle" data-astro-cid-trulbuyk>\nSem surpresas. Sem taxas ocultas. Sem fidelidade. Escolha o plano que funciona para você.\n</p> </section>  <section class="guarantees-section" data-astro-cid-trulbuyk> <div class="guarantees-grid" data-astro-cid-trulbuyk> ', ' </div> </section>  <section class="pricing-cards-section" data-astro-cid-trulbuyk> <div class="pricing-grid" data-astro-cid-trulbuyk> ', ' </div> </section>  <section class="roi-calculator-section" data-astro-cid-trulbuyk> <h2 data-astro-cid-trulbuyk>Calcule sua <span class="text-gradient" data-astro-cid-trulbuyk>economia</span></h2> <p class="section-subtitle" data-astro-cid-trulbuyk>Veja quanto você pode economizar substituindo atendentes ou SaaS caros</p> <div class="roi-wrapper glass-panel" data-astro-cid-trulbuyk> <div class="roi-controls" data-astro-cid-trulbuyk> <div class="control-group" data-astro-cid-trulbuyk> <label data-astro-cid-trulbuyk>Leads Mensais: <span id="lead-value" data-astro-cid-trulbuyk>5.000</span></label> <input type="range" id="lead-slider" min="500" max="50000" step="500" value="5000" class="premium-slider" data-astro-cid-trulbuyk> </div> <div class="control-group" data-astro-cid-trulbuyk> <label data-astro-cid-trulbuyk>Custo por Agente/SaaS: <span id="cost-value" data-astro-cid-trulbuyk>R$ 1.500</span></label> <input type="range" id="cost-slider" min="500" max="10000" step="100" value="1500" class="premium-slider" data-astro-cid-trulbuyk> </div> </div> <div class="roi-result" data-astro-cid-trulbuyk> <div class="result-card" data-astro-cid-trulbuyk> <span class="res-label" data-astro-cid-trulbuyk>Economia Mensal Estimada</span> <span class="res-value" id="roi-savings" data-astro-cid-trulbuyk>R$ 4.500,00</span> <p data-astro-cid-trulbuyk>Baseado em 1 IA substituindo 3 atendentes.</p> </div> </div> </div> </section>  <section class="comparison-section" data-astro-cid-trulbuyk> <h2 data-astro-cid-trulbuyk>Comparativo <span class="text-gradient" data-astro-cid-trulbuyk>detalhado</span></h2> <div class="comparison-table glass-panel" data-astro-cid-trulbuyk> <div class="table-header" data-astro-cid-trulbuyk> <span data-astro-cid-trulbuyk>Recurso</span> <span data-astro-cid-trulbuyk>Self-Hosted</span> <span class="highlight" data-astro-cid-trulbuyk>Pro</span> <span data-astro-cid-trulbuyk>Enterprise</span> </div> ', ' </div> </section>  <section class="addons-section" data-astro-cid-trulbuyk> <h2 data-astro-cid-trulbuyk>Complementos <span class="text-gradient" data-astro-cid-trulbuyk>opcionais</span></h2> <div class="addons-grid" data-astro-cid-trulbuyk> ', ' </div> </section>  <section class="testimonials-section" data-astro-cid-trulbuyk> <h2 data-astro-cid-trulbuyk>O que clientes <span class="text-gradient" data-astro-cid-trulbuyk>dizem do preço</span></h2> <div class="testimonials-grid" data-astro-cid-trulbuyk> ', ' </div> </section>  <section class="faq-section" data-astro-cid-trulbuyk> <h2 data-astro-cid-trulbuyk>Perguntas sobre <span class="text-gradient" data-astro-cid-trulbuyk>preços</span></h2> <div class="faq-list" data-astro-cid-trulbuyk> ', ' </div> </section>  <section class="final-cta" data-astro-cid-trulbuyk> <div class="glass-panel cta-box" data-astro-cid-trulbuyk> <h2 data-astro-cid-trulbuyk>Pronto para <span class="text-gradient" data-astro-cid-trulbuyk>economizar</span>?</h2> <p data-astro-cid-trulbuyk>Comece gratuitamente ou escolha o plano Pro para suporte VIP.</p> <div class="cta-buttons" data-astro-cid-trulbuyk> <a href="/criar-bot" class="btn-primary-glow" data-astro-cid-trulbuyk>Começar Grátis</a> <a href="/contato" class="btn-outline" data-astro-cid-trulbuyk>Falar com Vendas</a> </div> <p class="cta-note" data-astro-cid-trulbuyk>Teste 7 dias grátis • Sem cartão de crédito • Cancele quando quiser</p> </div> </section> <script type="application/ld+json">', "<\/script> "])), maybeRenderHead(), guarantees.map((g) => renderTemplate`<div class="guarantee-item" data-astro-cid-trulbuyk> <span class="g-icon" data-astro-cid-trulbuyk>${g.icon}</span> <div data-astro-cid-trulbuyk> <strong data-astro-cid-trulbuyk>${g.title}</strong> <span data-astro-cid-trulbuyk>${g.desc}</span> </div> </div>`), plans.map((plan) => renderTemplate`<div${addAttribute(`pricing-card glass-panel ${plan.popular ? "featured" : ""}`, "class")} data-astro-cid-trulbuyk> ${plan.popular && renderTemplate`<div class="popular-badge" data-astro-cid-trulbuyk>Mais Escolhido</div>`} <div class="card-type" data-astro-cid-trulbuyk>${plan.type}</div> <h3 data-astro-cid-trulbuyk>${plan.name}</h3> <div class="card-price" data-astro-cid-trulbuyk> ${plan.price}<span data-astro-cid-trulbuyk>${plan.period}</span> </div> <p class="card-desc" data-astro-cid-trulbuyk>${plan.description}</p> <ul class="card-features" data-astro-cid-trulbuyk> ${plan.features.map((f) => renderTemplate`<li${addAttribute(f.highlight ? "highlight" : "", "class")} data-astro-cid-trulbuyk> ${f.included ? "✅" : "❌"} <span data-astro-cid-trulbuyk>${unescapeHTML(f.text)}</span> </li>`)} </ul> <a${addAttribute(plan.ctaLink, "href")}${addAttribute(plan.popular ? "btn-xl-glow" : "btn-outline-glow", "class")}${addAttribute(plan.ctaLink.startsWith("http") ? "_blank" : "_self", "target")} data-astro-cid-trulbuyk> ${plan.cta} </a> </div>`), comparison.map((row) => renderTemplate`<div class="table-row" data-astro-cid-trulbuyk> <span class="row-feature" data-astro-cid-trulbuyk>${row.feature}</span> <span data-astro-cid-trulbuyk>${row.selfhosted}</span> <span class="highlight" data-astro-cid-trulbuyk>${row.pro}</span> <span data-astro-cid-trulbuyk>${row.enterprise}</span> </div>`), addons.map((addon) => renderTemplate`<div class="addon-card glass-panel" data-astro-cid-trulbuyk> <div class="addon-info" data-astro-cid-trulbuyk> <strong data-astro-cid-trulbuyk>${addon.name}</strong> <span data-astro-cid-trulbuyk>${addon.desc}</span> </div> <span class="addon-price" data-astro-cid-trulbuyk>${addon.price}</span> </div>`), testimonialPricing.map((t) => renderTemplate`<div class="testimonial-card glass-panel" data-astro-cid-trulbuyk> <div class="t-header" data-astro-cid-trulbuyk> <span class="t-avatar" data-astro-cid-trulbuyk>${t.avatar}</span> <div class="t-info" data-astro-cid-trulbuyk> <strong data-astro-cid-trulbuyk>${t.name}</strong> <span data-astro-cid-trulbuyk>${t.company}</span> </div> </div> <p class="t-text" data-astro-cid-trulbuyk>"${t.text}"</p> </div>`), faqs.map((faq) => renderTemplate`<details class="faq-item glass-panel" data-astro-cid-trulbuyk> <summary data-astro-cid-trulbuyk> <span class="faq-q" data-astro-cid-trulbuyk>${faq.q}</span> <span class="faq-toggle" data-astro-cid-trulbuyk>+</span> </summary> <p class="faq-a" data-astro-cid-trulbuyk>${faq.a}</p> </details>`), unescapeHTML(JSON.stringify(priceSchema))) }));
}, "/home/lele/usenexo/getnexo-site/src/pages/precos.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/precos.astro";
const $$url = "/precos";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Precos,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
