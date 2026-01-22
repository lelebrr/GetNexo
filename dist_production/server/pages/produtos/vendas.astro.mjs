import { f as createComponent, k as renderComponent, r as renderTemplate, h as addAttribute, m as maybeRenderHead, u as unescapeHTML } from "../../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$Layout } from "../../assets/Layout-DScI-qCd.js";
/* empty css                                    */
import { renderers } from "../../renderers.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Vendas = createComponent(($$result, $$props, $$slots) => {
  const title = "Checkout WhatsApp & Vendas PIX Automáticas | GetNexo";
  const description = "Venda 3x mais com checkout nativo no WhatsApp. Pagamentos PIX automáticos, catálogo inteligente, recuperação de carrinho e checkout sem sair do chat.";
  const keywords = "checkout whatsapp, pix whatsapp, vendas whatsapp, carrinho whatsapp, pagamento pix chat, api oficial whatsapp, getnexo vendas";
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "GetNexo Checkout & Vendas",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "BRL"
        },
        "description": "Plataforma de checkout e automação de vendas via PIX para WhatsApp.",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "ratingCount": "94"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "O pagamento PIX é automático?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sim. O GetNexo gera o QR Code e o código 'Copia e Cola' instantaneamente no chat. Assim que o cliente paga, o sistema recebe a confirmação bancária e libera o pedido automaticamente."
            }
          },
          {
            "@type": "Question",
            "name": "Integra com quais plataformas?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Integramos nativamente com Shopify, WooCommerce, Nuvemshop, Mercado Pago, PagSeguro e diversos bancos via API para conciliação PIX."
            }
          }
        ]
      }
    ]
  };
  const stats = [
    { value: "300%", label: "mais conversão", desc: "vs. sites tradicionais" },
    { value: "67%", label: "menos abandono", desc: "checkout direto no chat" },
    { value: "< 2min", label: "tempo de venda", desc: "da escolha ao pagamento" },
    { value: "100%", label: "PIX Automático", desc: "confirmação sem humano" }
  ];
  const features = [
    {
      icon: "🛒",
      title: "Checkout Nativo",
      description: "Seu cliente escolhe, adiciona ao carrinho e paga sem nunca fechar o WhatsApp. Simplicidade que gera lucro.",
      details: [
        "Carrinho persistente no chat",
        "Cálculo de frete automático",
        "Cupom de desconto por IA",
        "Seleção de variações (cor/tamanho)"
      ]
    },
    {
      icon: "💎",
      title: "PIX Express",
      description: "Gere cobranças dinâmicas com QR Code. O sistema monitora o banco e avisa o cliente sobre a aprovação em milisegundos.",
      details: [
        "QR Code dinâmico por pedido",
        "Copia e Cola in-chat",
        "Confirmação real-time",
        "Conciliação bancária direta"
      ]
    },
    {
      icon: "📈",
      title: "Recuperação Ativa",
      description: "A IA persegue os abandonos de carrinho com ofertas irresistíveis enviadas no momento certo.",
      details: [
        "Lembretes 2h/24h depois",
        "Gatilhos de escassez",
        "Link de checkout pronto",
        "Tracking de recuperação"
      ]
    },
    {
      icon: "🔌",
      title: "Eco-Sistema Integrado",
      description: "Sincronize pedidos e estoque com suas ferramentas favoritas de e-commerce e ERP.",
      details: [
        "Sync Shopify & WooCommerce",
        "Integração Bling/Tiny",
        "Webhooks personalizados",
        "API para desenvolvedores"
      ]
    }
  ];
  const steps = [
    { num: "01", title: "Interesse", desc: "Cliente pergunta ou clica no catálogo", icon: "👀" },
    { num: "02", title: "Escolha", desc: "IA apresenta produtos e variantes", icon: "🛍️" },
    { num: "03", title: "Checkout", desc: "Carrinho é fechado no próprio chat", icon: "✅" },
    { num: "04", title: "PIX", desc: "QR Code gerado e pago instantaneamente", icon: "💰" }
  ];
  const trustBadges = [
    { label: "PCI Compliance", icon: "🛡️" },
    { label: "PIX Bacen Ready", icon: "🇧🇷" },
    { label: "SSL Encrypted", icon: "🔒" },
    { label: "Official Meta API", icon: "✅" }
  ];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": title, "description": description, "keywords": keywords, "data-astro-cid-gf4any36": true }, { "default": ($$result2) => renderTemplate(_a || (_a = __template([' <script type="application/ld+json">', "<\/script>  ", '<section class="prod-hero relative py-20 px-4 text-center overflow-hidden" aria-label="Introdução Vendas WhatsApp" data-astro-cid-gf4any36> <div class="absolute inset-0 bg-gradient-to-b from-blue-900/10 to-transparent -z-10" data-astro-cid-gf4any36></div> <div class="hero-badge mb-6" data-astro-cid-gf4any36>💰 Venda 3x Mais no WhatsApp</div> <h1 class="text-4xl md:text-6xl font-black text-white mb-6 leading-tight" data-astro-cid-gf4any36>\nO Checkout que acontece <span class="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500" data-astro-cid-gf4any36>Dentro da Janela</span> </h1> <p class="hero-subtitle text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-10" data-astro-cid-gf4any36>\nReduza o abandono de carrinho em 67% oferecendo uma experiência de compra fluida via PIX, totalmente integrada ao catálogo da sua loja.\n</p> <div class="hero-ctas flex flex-col md:flex-row gap-4 justify-center mb-16" data-astro-cid-gf4any36> <a href="/criar-bot" class="btn-primary-glow px-10 py-4 rounded-xl font-bold bg-green-600 hover:bg-green-500 text-white transition-all shadow-lg shadow-green-500/20" data-astro-cid-gf4any36>\nAtivar Vendas no Chat\n</a> <a href="/demo" class="px-10 py-4 rounded-xl font-bold border border-slate-700 text-slate-300 hover:text-white transition-all bg-slate-800/30" data-astro-cid-gf4any36>\nVer Fluxo PIX →\n</a> </div> <!-- Stats Grid --> <div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto" data-astro-cid-gf4any36> ', ' </div> </section>  <section class="py-20 bg-slate-900/40 border-y border-white/5" aria-label="Passo a passo da venda" data-astro-cid-gf4any36> <div class="max-w-6xl mx-auto px-4" data-astro-cid-gf4any36> <h2 class="text-3xl font-bold text-white text-center mb-16" data-astro-cid-gf4any36>O Caminho Mais Curto para o <span class="text-green-400" data-astro-cid-gf4any36>Pagamento</span></h2> <div class="grid grid-cols-1 md:grid-cols-4 gap-8" data-astro-cid-gf4any36> ', ' </div> </div> </section>  <section class="py-20 px-4" aria-label="Demonstração do Checkout PIX" data-astro-cid-gf4any36> <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center" data-astro-cid-gf4any36> <div data-astro-cid-gf4any36> <h2 class="text-3xl md:text-4xl font-black text-white mb-6 leading-tight" data-astro-cid-gf4any36>Pagamento PIX com <span class="text-blue-400" data-astro-cid-gf4any36>Confirmação Instantânea</span></h2> <p class="text-slate-400 text-lg mb-8 leading-relaxed" data-astro-cid-gf4any36>\nEsqueça o envio manual de chaves. O GetNexo gera o QR Code na hora, com o valor exato, e seu cliente paga sem sair da conversa.\n</p> <ul class="space-y-4 mb-10" data-astro-cid-gf4any36> <li class="flex items-center gap-3 text-slate-300" data-astro-cid-gf4any36> <span class="w-2 h-2 rounded-full bg-green-400" data-astro-cid-gf4any36></span>\nGeração de QR Code dinâmico por pedido\n</li> <li class="flex items-center gap-3 text-slate-300" data-astro-cid-gf4any36> <span class="w-2 h-2 rounded-full bg-green-400" data-astro-cid-gf4any36></span>\nBotão de "Copia e Cola" acessível\n</li> <li class="flex items-center gap-3 text-slate-300" data-astro-cid-gf4any36> <span class="w-2 h-2 rounded-full bg-green-400" data-astro-cid-gf4any36></span>\nAviso de pagamento aprovado automático\n</li> <li class="flex items-center gap-3 text-slate-300" data-astro-cid-gf4any36> <span class="w-2 h-2 rounded-full bg-green-400" data-astro-cid-gf4any36></span>\nWebhook para integração com estoque/ERP\n</li> </ul> <div class="flex flex-wrap gap-4" data-astro-cid-gf4any36> ', ' </div> </div> <!-- PIX Visual Mockup --> <div class="flex justify-center" role="img" aria-label="Mockup de uma tela de celular exibindo o fechamento de um carrinho no WhatsApp com QR Code PIX e valor de R$127,90" data-astro-cid-gf4any36> <div class="pix-visual-container p-4 rounded-[3rem] bg-slate-800 border-4 border-slate-700 shadow-2xl relative" data-astro-cid-gf4any36> <div class="phone-screen bg-[#0a0f1a] rounded-[2.5rem] p-6 overflow-hidden w-[300px] min-h-[500px]" data-astro-cid-gf4any36> <div class="flex items-center gap-3 mb-8 pb-4 border-b border-white/5" data-astro-cid-gf4any36> <div class="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white" data-astro-cid-gf4any36>GN</div> <div data-astro-cid-gf4any36> <div class="text-white font-bold text-sm" data-astro-cid-gf4any36>GetNexo Checkout</div> <div class="text-green-500 text-[10px]" data-astro-cid-gf4any36>● Online</div> </div> </div> <div class="chat-bubble bg-slate-800 rounded-2xl rounded-tl-none p-4 text-white text-xs mb-4" data-astro-cid-gf4any36>\n✅ Pedido confirmado! <br data-astro-cid-gf4any36> <strong data-astro-cid-gf4any36>Items:</strong> Kit Gamer (1x)<br data-astro-cid-gf4any36> <strong data-astro-cid-gf4any36>Total: R$ 127,90</strong> </div> <div class="pix-card bg-white rounded-2xl p-6 text-center text-black" data-astro-cid-gf4any36> <div class="text-[10px] font-bold text-slate-500 uppercase mb-3" data-astro-cid-gf4any36>Escaneie para Pagar</div> <div class="qr-code w-32 h-32 mx-auto bg-slate-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden" data-astro-cid-gf4any36> <!-- Simulated QR with grid --> <div class="grid grid-cols-8 gap-1 p-2 w-full h-full opacity-80" data-astro-cid-gf4any36> ', ' </div> </div> <div class="text-xl font-black mb-1" data-astro-cid-gf4any36>R$ 127,90</div> <button class="w-full py-2 bg-green-600 text-white rounded-lg text-[10px] font-bold hover:bg-green-700 transition-colors focus:ring-2 focus:ring-green-400 outline-none" aria-label="Copiar código PIX" data-astro-cid-gf4any36>\nCOPIAR CÓDIGO PIX\n</button> </div> <div class="mt-4 text-center text-[10px] text-slate-600 font-medium" data-astro-cid-gf4any36>\n⏱ Expira em 14:59s\n</div> </div> </div> </div> </div> </section>  <section class="py-20 bg-[#0b101b]" data-astro-cid-gf4any36> <div class="max-w-7xl mx-auto px-4" data-astro-cid-gf4any36> <div class="grid grid-cols-1 md:grid-cols-2 gap-8" data-astro-cid-gf4any36> ', ' </div> </div> </section>  <section class="py-16 border-t border-white/5 bg-slate-950/50" data-astro-cid-gf4any36> <div class="max-w-6xl mx-auto px-4 text-center" data-astro-cid-gf4any36> <p class="text-xs font-bold text-slate-600 uppercase tracking-widest mb-10" data-astro-cid-gf4any36>Integração nativa com os maiores do mercado</p> <div class="flex flex-wrap justify-center gap-10 opacity-40 grayscale hover:grayscale-0 transition-all" data-astro-cid-gf4any36> <span class="text-white font-black text-xl" data-astro-cid-gf4any36>SHOPIFY</span> <span class="text-white font-black text-xl" data-astro-cid-gf4any36>WOOCOMMERCE</span> <span class="text-white font-black text-xl" data-astro-cid-gf4any36>NUVEMSHOP</span> <span class="text-white font-black text-xl" data-astro-cid-gf4any36>MERCADOPAGO</span> <span class="text-white font-black text-xl" data-astro-cid-gf4any36>PAGSEGURO</span> <span class="text-white font-black text-xl" data-astro-cid-gf4any36>BLING</span> </div> </div> </section>  <section class="py-20 px-4 max-w-4xl mx-auto" aria-label="Perguntas Frequentes" data-astro-cid-gf4any36> <h2 class="text-3xl font-bold text-white text-center mb-12" data-astro-cid-gf4any36>Perguntas Frequentes</h2> <div class="space-y-4" data-astro-cid-gf4any36> <details class="group bg-[#161b22] rounded-2xl border border-white/5 open:bg-[#1c2128] transition-all" data-astro-cid-gf4any36> <summary class="flex justify-between items-center cursor-pointer p-6 font-semibold text-white list-none focus:outline-none focus:ring-2 focus:ring-green-400 rounded-2xl" data-astro-cid-gf4any36> <span data-astro-cid-gf4any36>O GetNexo cobra comissão sobre as vendas?</span> <span class="transition-transform group-open:rotate-180" data-astro-cid-gf4any36>▼</span> </summary> <div class="px-6 pb-6 text-slate-400 text-sm leading-relaxed" data-astro-cid-gf4any36>\nNÃO cobramos comissão por venda efetuada. Você paga apenas a mensalidade do seu plano. Todas as taxas de intermediação são pagas diretamente ao seu provedor de pagamento (Mercado Pago, PagSeguro, etc.).\n</div> </details> <details class="group bg-[#161b22] rounded-2xl border border-white/5 open:bg-[#1c2128] transition-all" data-astro-cid-gf4any36> <summary class="flex justify-between items-center cursor-pointer p-6 font-semibold text-white list-none focus:outline-none focus:ring-2 focus:ring-green-400 rounded-2xl" data-astro-cid-gf4any36> <span data-astro-cid-gf4any36>É seguro receber via PIX pelo WhatsApp?</span> <span class="transition-transform group-open:rotate-180" data-astro-cid-gf4any36>▼</span> </summary> <div class="px-6 pb-6 text-slate-400 text-sm leading-relaxed" data-astro-cid-gf4any36>\nExtremamente seguro. O GetNexo não armazena seu dinheiro. Nós apenas conectamos seu WhatsApp à API oficial do seu banco ou gateway de pagamento. O dinheiro cai direto na sua conta e a confirmação é feita via protocolo SSL criptografado.\n</div> </details> <details class="group bg-[#161b22] rounded-2xl border border-white/5 open:bg-[#1c2128] transition-all" data-astro-cid-gf4any36> <summary class="flex justify-between items-center cursor-pointer p-6 font-semibold text-white list-none focus:outline-none focus:ring-2 focus:ring-green-400 rounded-2xl" data-astro-cid-gf4any36> <span data-astro-cid-gf4any36>Como funciona a sincronização de estoque?</span> <span class="transition-transform group-open:rotate-180" data-astro-cid-gf4any36>▼</span> </summary> <div class="px-6 pb-6 text-slate-400 text-sm leading-relaxed" data-astro-cid-gf4any36>\nSe você integrar com Shopify, Nuvemshop ou WooCommerce, o GetNexo consulta seu estoque em tempo real. Se um produto acaba na sua loja, a IA avisa automaticamente o cliente no WhatsApp que aquele item está indisponível, evitando vendas sem produto.\n</div> </details> </div> </section>  <section class="py-20 px-4 text-center" data-astro-cid-gf4any36> <div class="max-w-5xl mx-auto bg-gradient-to-br from-green-900/40 to-slate-900 rounded-[3rem] p-12 border border-green-500/20 shadow-2xl" data-astro-cid-gf4any36> <h2 class="text-3xl md:text-5xl font-black text-white mb-6" data-astro-cid-gf4any36>Pronto para Ver o <span class="text-green-400" data-astro-cid-gf4any36>PIX Caindo</span>?</h2> <p class="text-xl text-slate-300 mb-10 max-w-2xl mx-auto" data-astro-cid-gf4any36>\nJunte-se a mais de 2.000 empresas que transformaram o WhatsApp em sua principal máquina de vendas.\n</p> <div class="flex flex-col sm:flex-row justify-center gap-4" data-astro-cid-gf4any36> <a href="/criar-bot" class="px-10 py-5 bg-white text-green-900 font-bold rounded-2xl hover:bg-green-50 transition-colors text-lg shadow-xl shadow-white/5" data-astro-cid-gf4any36>\nComeçar Gratuitamente Agora\n</a> </div> <p class="mt-8 text-xs text-slate-500 font-medium" data-astro-cid-gf4any36>\nSetup assistido • Importação de catálogo inclusa • Cancele quando quiser\n</p> </div> </section> '])), unescapeHTML(JSON.stringify(schema)), maybeRenderHead(), stats.map((stat) => renderTemplate`<div class="p-6 rounded-2xl bg-[#0f172a]/50 border border-white/5 backdrop-blur-sm" data-astro-cid-gf4any36> <span class="block text-3xl font-black text-green-400" data-astro-cid-gf4any36>${stat.value}</span> <span class="block text-sm font-bold text-white uppercase mt-1" data-astro-cid-gf4any36>${stat.label}</span> <span class="block text-xs text-slate-500 mt-1" data-astro-cid-gf4any36>${stat.desc}</span> </div>`), steps.map((step, i) => renderTemplate`<div class="relative group" data-astro-cid-gf4any36> <div class="text-center p-8 rounded-3xl bg-[#1a1f2e] border border-slate-800 group-hover:border-green-500/30 transition-all h-full" data-astro-cid-gf4any36> <span class="text-5xl mb-6 block group-hover:scale-110 transition-transform" data-astro-cid-gf4any36>${step.icon}</span> <span class="inline-block px-3 py-1 bg-green-900/20 text-green-400 rounded-full text-xs font-bold mb-4" data-astro-cid-gf4any36>PASSO ${step.num}</span> <h3 class="text-xl font-bold text-white mb-2" data-astro-cid-gf4any36>${step.title}</h3> <p class="text-slate-400 text-sm" data-astro-cid-gf4any36>${step.desc}</p> </div> ${i < steps.length - 1 && renderTemplate`<div class="hidden md:block absolute top-1/2 -right-4 translate-x-1/2 -translate-y-1/2 text-green-900/30 text-4xl" data-astro-cid-gf4any36>→</div>`} </div>`), trustBadges.map((badge) => renderTemplate`<span class="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-slate-400 flex items-center gap-2" data-astro-cid-gf4any36> ${badge.icon} ${badge.label} </span>`), Array(64).fill(0).map((_, i) => renderTemplate`<div${addAttribute(`w-full h-full ${i % 3 == 0 ? "bg-black" : "bg-white"}`, "class")} data-astro-cid-gf4any36></div>`), features.map((f) => renderTemplate`<article class="p-8 rounded-3xl bg-[#131b2e] border border-white/5 hover:border-green-500/20 transition-all flex items-start gap-6 group" data-astro-cid-gf4any36> <span class="text-4xl p-4 bg-green-900/10 rounded-2xl group-hover:grayscale-0 grayscale transition-all" data-astro-cid-gf4any36>${f.icon}</span> <div data-astro-cid-gf4any36> <h3 class="text-xl font-bold text-white mb-3" data-astro-cid-gf4any36>${f.title}</h3> <p class="text-slate-400 text-sm leading-relaxed mb-6" data-astro-cid-gf4any36>${f.description}</p> <div class="grid grid-cols-2 gap-3" data-astro-cid-gf4any36> ${f.details.map((d) => renderTemplate`<div class="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1" data-astro-cid-gf4any36> <span class="text-green-500" data-astro-cid-gf4any36>✓</span> ${d} </div>`)} </div> </div> </article>`)) })} `;
}, "/home/lele/usenexo/getnexo-site/src/pages/produtos/vendas.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/produtos/vendas.astro";
const $$url = "/produtos/vendas";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Vendas,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
