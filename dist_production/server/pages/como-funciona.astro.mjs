import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from "../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$Layout } from "../assets/Layout-DScI-qCd.js";
/* empty css                                        */
import { renderers } from "../renderers.mjs";
const $$ComoFunciona = createComponent(($$result, $$props, $$slots) => {
  const title = "Como Funciona o GetNexo - Automação WhatsApp em 4 Passos";
  const description = "Entenda como o GetNexo transforma seu WhatsApp em uma máquina de vendas automática. Do primeiro contato ao pagamento confirmado, tudo com IA e API Oficial Meta.";
  const keywords = "como funciona getnexo, automação whatsapp tutorial, configurar chatbot whatsapp, setup whatsapp ia, getnexo passo a passo, integrar whatsapp negócio";
  const steps = [
    {
      num: "01",
      icon: "🔌",
      title: "Conecte seu WhatsApp",
      description: "Vincule seu número à plataforma GetNexo em menos de 2 minutos. Usamos a API Oficial Cloud do Meta para garantir segurança e estabilidade.",
      details: [
        "Conexão via QR Code ou API Cloud Meta",
        "Não bloqueia seu número",
        "Funciona com número existente",
        "Múltiplos dispositivos simultâneos"
      ],
      time: "2 min"
    },
    {
      num: "02",
      icon: "🧠",
      title: "Configure a IA",
      description: "Ensine a IA sobre seu negócio. Adicione FAQ, produtos, preços e tom de voz. Ela aprende e responde como seu melhor vendedor.",
      details: [
        "Upload de documentos e FAQ",
        "Catálogo de produtos sincronizado",
        "Tom de voz personalizável",
        "Contexto de negócio específico"
      ],
      time: "10 min"
    },
    {
      num: "03",
      icon: "⚙️",
      title: "Configure automações",
      description: "Defina fluxos automáticos: boas-vindas, qualificação de leads, agendamentos, checkout e follow-ups. A IA cuida de tudo.",
      details: [
        "Flow builder visual",
        "Gatilhos por palavra-chave",
        "Integrações com CRM e e-commerce",
        "Horário de funcionamento"
      ],
      time: "15 min"
    },
    {
      num: "04",
      icon: "🚀",
      title: "Comece a vender",
      description: "Pronto! Sua IA está ativa 24/7, respondendo clientes, qualificando leads, gerando PIX e fechando vendas automaticamente.",
      details: [
        "Atendimento 24 horas",
        "Checkout PIX automático",
        "Relatórios em tempo real",
        "Escale sem limites"
      ],
      time: "∞"
    }
  ];
  const architecture = [
    { layer: "Cliente", icon: "📱", desc: "Envia mensagem no WhatsApp", color: "#00d4ff" },
    { layer: "API Meta", icon: "🔗", desc: "Webhooks oficiais", color: "#a855f7" },
    { layer: "GetNexo", icon: "⚡", desc: "Processa e envia para IA", color: "#00ff9d" },
    { layer: "IA Generativa", icon: "🧠", desc: "Gera resposta inteligente", color: "#eab308" },
    { layer: "Integrações", icon: "🔌", desc: "CRM, e-commerce, PIX", color: "#f97316" },
    { layer: "Resposta", icon: "💬", desc: "Cliente recebe no WhatsApp", color: "#00d4ff" }
  ];
  const deployOptions = [
    {
      name: "Nuvem GetNexo",
      icon: "☁️",
      recommended: true,
      price: "A partir de R$ 97/mês",
      features: ["Zero configuração", "Uptime 99.9%", "Suporte prioritário", "Backups automáticos", "SSL incluso"]
    },
    {
      name: "Self-Hosted",
      icon: "🖥️",
      recommended: false,
      price: "Gratuito",
      features: ["Docker Compose", "Controle total", "Seus dados", "Sem mensalidade", "Comunidade ativa"]
    },
    {
      name: "VPS Personalizado",
      icon: "🎛️",
      recommended: false,
      price: "Sob consulta",
      features: ["Instalação assistida", "Configuração otimizada", "Treinamento incluso", "SLA customizado", "Suporte dedicado"]
    }
  ];
  const techStack = [
    { name: "Meta Cloud API", desc: "API oficial para WhatsApp Business", category: "Conexão" },
    { name: "OpenAI / Gemini", desc: "IA generativa para respostas", category: "Inteligência" },
    { name: "Node.js", desc: "Backend de alta performance", category: "Servidor" },
    { name: "PostgreSQL", desc: "Banco de dados robusto", category: "Dados" },
    { name: "Redis", desc: "Cache e filas em tempo real", category: "Performance" },
    { name: "React", desc: "Dashboard moderno", category: "Interface" }
  ];
  const faqs = [
    {
      q: "Preciso de conhecimento técnico para usar?",
      a: "Não! Se você escolher a opção Nuvem GetNexo, tudo é gerenciado por nós. Você só precisa conectar seu WhatsApp e configurar a IA pelo painel visual. Para self-hosted, conhecimento básico de Docker é útil, mas temos tutoriais passo a passo."
    },
    {
      q: "Quanto tempo leva para configurar?",
      a: "Na nuvem, você pode estar vendendo em menos de 30 minutos. O processo envolve: conectar WhatsApp (2 min), configurar IA (10 min), definir automações (15 min). Clientes mais complexos podem levar 1-2 horas para otimizar."
    },
    {
      q: "Meu número pode ser banido?",
      a: "Usando a API Oficial Meta Cloud (que é o padrão do GetNexo), o risco de ban é praticamente zero. Diferente de soluções não-oficiais, aqui você está dentro das regras do WhatsApp Business."
    },
    {
      q: "Posso usar meu número pessoal?",
      a: "Sim, desde que seja um número que pode receber SMS para verificação. Recomendamos um número dedicado para negócios, mas não é obrigatório. O número continua funcionando normalmente no seu celular."
    },
    {
      q: "Como a IA aprende sobre meu negócio?",
      a: "Você alimenta a IA com: documentos (PDF, TXT), FAQ, descrição de produtos, tom de voz desejado e exemplos de conversas. A IA usa esses dados para contextualizar respostas. Quanto mais informação, melhor ela responde."
    },
    {
      q: "Consigo integrar com meu e-commerce?",
      a: "Sim! Temos integrações nativas com Shopify, WooCommerce, Nuvemshop e via API/Webhooks com qualquer sistema. Produtos, estoque e pedidos sincronizam automaticamente."
    }
  ];
  const timeline = [
    { time: "0:00", action: "Cliente envia: 'Oi, quero saber o preço'" },
    { time: "0:02", action: "IA responde com catálogo e preços" },
    { time: "0:15", action: "Cliente escolhe produto" },
    { time: "0:20", action: "IA gera PIX automático" },
    { time: "0:45", action: "Cliente paga" },
    { time: "0:46", action: "Webhook confirma pagamento" },
    { time: "0:47", action: "Cliente recebe confirmação" },
    { time: "0:48", action: "Pedido cai no ERP" }
  ];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": title, "description": description, "keywords": keywords, "data-astro-cid-aq4dqmmo": true }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<section class="how-hero" data-astro-cid-aq4dqmmo> <div class="hero-badge" data-astro-cid-aq4dqmmo>⚡ Setup em 30 minutos</div> <h1 data-astro-cid-aq4dqmmo>Como o GetNexo <span class="text-gradient" data-astro-cid-aq4dqmmo>transforma seu WhatsApp</span></h1> <p class="hero-subtitle" data-astro-cid-aq4dqmmo>
Do primeiro contato ao pagamento confirmado. Entenda exatamente como a magia acontece — sem segredos, sem termos técnicos complicados.
</p> <div class="hero-ctas" data-astro-cid-aq4dqmmo> <a href="/criar-bot" class="btn-primary-glow" data-astro-cid-aq4dqmmo>Começar Agora</a> <a href="/demo" class="btn-outline" data-astro-cid-aq4dqmmo>Ver em Ação →</a> </div> </section>  <section class="steps-section" data-astro-cid-aq4dqmmo> <h2 data-astro-cid-aq4dqmmo>4 passos para <span class="text-gradient" data-astro-cid-aq4dqmmo>automatizar vendas</span></h2> <p class="section-subtitle" data-astro-cid-aq4dqmmo>Do zero ao primeiro bot vendendo em menos de 30 minutos</p> <div class="steps-grid" data-astro-cid-aq4dqmmo> ${steps.map((step) => renderTemplate`<div class="step-card glass-panel" data-astro-cid-aq4dqmmo> <div class="step-header" data-astro-cid-aq4dqmmo> <span class="step-num" data-astro-cid-aq4dqmmo>${step.num}</span> <span class="step-time" data-astro-cid-aq4dqmmo>⏱️ ${step.time}</span> </div> <span class="step-icon" data-astro-cid-aq4dqmmo>${step.icon}</span> <h3 data-astro-cid-aq4dqmmo>${step.title}</h3> <p class="step-desc" data-astro-cid-aq4dqmmo>${step.description}</p> <ul class="step-details" data-astro-cid-aq4dqmmo> ${step.details.map((d) => renderTemplate`<li data-astro-cid-aq4dqmmo>✓ ${d}</li>`)} </ul> </div>`)} </div> </section>  <section class="architecture-section" data-astro-cid-aq4dqmmo> <h2 data-astro-cid-aq4dqmmo>Arquitetura <span class="text-gradient" data-astro-cid-aq4dqmmo>simplificada</span></h2> <p class="section-subtitle" data-astro-cid-aq4dqmmo>Entenda o fluxo de uma mensagem</p> <div class="architecture-flow" data-astro-cid-aq4dqmmo> ${architecture.map((layer, i) => renderTemplate`<div class="arch-node" data-astro-cid-aq4dqmmo> <div class="arch-icon"${addAttribute(`background: ${layer.color}20; border-color: ${layer.color}`, "style")} data-astro-cid-aq4dqmmo> <span data-astro-cid-aq4dqmmo>${layer.icon}</span> </div> <strong${addAttribute(`color: ${layer.color}`, "style")} data-astro-cid-aq4dqmmo>${layer.layer}</strong> <span class="arch-desc" data-astro-cid-aq4dqmmo>${layer.desc}</span> ${i < architecture.length - 1 && renderTemplate`<div class="arch-arrow" data-astro-cid-aq4dqmmo>↓</div>`} </div>`)} </div> </section>  <section class="timeline-section" data-astro-cid-aq4dqmmo> <div class="glass-panel timeline-box" data-astro-cid-aq4dqmmo> <div class="timeline-content" data-astro-cid-aq4dqmmo> <h2 data-astro-cid-aq4dqmmo>Veja uma venda <span class="text-gradient" data-astro-cid-aq4dqmmo>acontecer</span></h2> <p data-astro-cid-aq4dqmmo>Acompanhe o tempo real de uma conversão automática</p> </div> <div class="timeline-visual" data-astro-cid-aq4dqmmo> ${timeline.map((t) => renderTemplate`<div class="timeline-item" data-astro-cid-aq4dqmmo> <span class="tl-time" data-astro-cid-aq4dqmmo>${t.time}</span> <div class="tl-dot" data-astro-cid-aq4dqmmo></div> <span class="tl-action" data-astro-cid-aq4dqmmo>${t.action}</span> </div>`)} <div class="timeline-result glass-panel" data-astro-cid-aq4dqmmo> <span class="result-icon" data-astro-cid-aq4dqmmo>🎉</span> <span class="result-text" data-astro-cid-aq4dqmmo>Venda concluída em menos de 1 minuto!</span> </div> </div> </div> </section>  <section class="deploy-section" data-astro-cid-aq4dqmmo> <h2 data-astro-cid-aq4dqmmo>Escolha como <span class="text-gradient" data-astro-cid-aq4dqmmo>hospedar</span></h2> <p class="section-subtitle" data-astro-cid-aq4dqmmo>Nuvem gerenciada ou self-hosted — você decide</p> <div class="deploy-grid" data-astro-cid-aq4dqmmo> ${deployOptions.map((opt) => renderTemplate`<div${addAttribute(`deploy-card glass-panel ${opt.recommended ? "recommended" : ""}`, "class")} data-astro-cid-aq4dqmmo> ${opt.recommended && renderTemplate`<span class="rec-badge" data-astro-cid-aq4dqmmo>Recomendado</span>`} <span class="deploy-icon" data-astro-cid-aq4dqmmo>${opt.icon}</span> <h3 data-astro-cid-aq4dqmmo>${opt.name}</h3> <span class="deploy-price" data-astro-cid-aq4dqmmo>${opt.price}</span> <ul class="deploy-features" data-astro-cid-aq4dqmmo> ${opt.features.map((f) => renderTemplate`<li data-astro-cid-aq4dqmmo>✓ ${f}</li>`)} </ul> <a href="/criar-bot"${addAttribute(opt.recommended ? "btn-primary-glow" : "btn-outline", "class")} data-astro-cid-aq4dqmmo> ${opt.recommended ? "Começar" : "Saiba mais"} </a> </div>`)} </div> </section>  <section class="tech-section" data-astro-cid-aq4dqmmo> <h2 data-astro-cid-aq4dqmmo>Tecnologia de <span class="text-gradient" data-astro-cid-aq4dqmmo>ponta</span></h2> <p class="section-subtitle" data-astro-cid-aq4dqmmo>Stack moderna e escalável</p> <div class="tech-grid" data-astro-cid-aq4dqmmo> ${techStack.map((tech) => renderTemplate`<div class="tech-card glass-panel" data-astro-cid-aq4dqmmo> <span class="tech-category" data-astro-cid-aq4dqmmo>${tech.category}</span> <strong data-astro-cid-aq4dqmmo>${tech.name}</strong> <span class="tech-desc" data-astro-cid-aq4dqmmo>${tech.desc}</span> </div>`)} </div> </section>  <section class="faq-section" data-astro-cid-aq4dqmmo> <h2 data-astro-cid-aq4dqmmo>Perguntas <span class="text-gradient" data-astro-cid-aq4dqmmo>frequentes</span></h2> <div class="faq-list" data-astro-cid-aq4dqmmo> ${faqs.map((faq) => renderTemplate`<details class="faq-item glass-panel" data-astro-cid-aq4dqmmo> <summary data-astro-cid-aq4dqmmo> <span class="faq-q" data-astro-cid-aq4dqmmo>${faq.q}</span> <span class="faq-toggle" data-astro-cid-aq4dqmmo>+</span> </summary> <p class="faq-a" data-astro-cid-aq4dqmmo>${faq.a}</p> </details>`)} </div> </section>  <section class="final-cta" data-astro-cid-aq4dqmmo> <div class="glass-panel cta-box" data-astro-cid-aq4dqmmo> <h2 data-astro-cid-aq4dqmmo>Pronto para <span class="text-gradient" data-astro-cid-aq4dqmmo>começar</span>?</h2> <p data-astro-cid-aq4dqmmo>Crie seu bot em minutos e veja suas vendas automatizarem.</p> <div class="cta-buttons" data-astro-cid-aq4dqmmo> <a href="/criar-bot" class="btn-primary-glow" data-astro-cid-aq4dqmmo>Criar Meu Bot Grátis</a> <a href="/documentacao" class="btn-outline" data-astro-cid-aq4dqmmo>Ver Documentação</a> </div> <p class="cta-note" data-astro-cid-aq4dqmmo>Sem cartão de crédito • Setup em 30 min • Suporte incluso</p> </div> </section> ` })} `;
}, "/home/lele/usenexo/getnexo-site/src/pages/como-funciona.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/como-funciona.astro";
const $$url = "/como-funciona";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$ComoFunciona,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
