import { f as createComponent, k as renderComponent, r as renderTemplate, h as addAttribute, m as maybeRenderHead, u as unescapeHTML } from "../../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$Layout } from "../../assets/Layout-DScI-qCd.js";
/* empty css                                       */
import { renderers } from "../../renderers.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Automacao = createComponent(($$result, $$props, $$slots) => {
  const title = "Automação WhatsApp com IA Generativa | Crie Chatbots Inteligentes | GetNexo";
  const description = "Plataforma de Automação para WhatsApp com IA (Llama 3/GPT-4). Crie fluxos visuais, recupere carrinhos e atenda 24/7 sem codificação. Teste Grátis!";
  const keywords = "automação whatsapp, chatbot ia whatsapp, ia generativa whatsapp, n8n whatsapp, typebot whatsapp, recuperação de carrinho whatsapp, bot atendimento whatsapp, getnexo automação";
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "GetNexo Automation AI",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web, iOS, Android",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "BRL",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.95",
      "ratingCount": "840"
    },
    "description": description,
    "featureList": [
      "Construtor de Fluxo Visual",
      "IA Generativa com RAG Local",
      "Integração Nativa n8n/Typebot",
      "Webhooks Ilimitados",
      "Disparo Agendado"
    ]
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "A IA substitui humanos?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ela substitui o trabalho repetitivo. A IA tria, qualifica e resolve 80% das dúvidas. Casos complexos ou vendas de alto valor são transferidos automaticamente para sua equipe humana no momento certo."
        }
      },
      {
        "@type": "Question",
        "name": "Preciso saber programar?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Zero código! Nosso construtor é visual (drag & drop). Você arrasta blocos, conecta setas e pronto. Para usuários avançados, temos Low-Code com JavaScript e n8n."
        }
      },
      {
        "@type": "Question",
        "name": "Funciona com áudio?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sim! Graças à tecnologia Whisper (OpenAI), nosso bot ouve, transcreve e entende áudios como se fosse texto. E também pode responder enviando áudio, se configurado."
        }
      },
      {
        "@type": "Question",
        "name": "Posso treinar com meus dados?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Com certeza. Faça upload ou cole seus PDFs, DOCs e URLs do site. Nossa tecnologia RAG (Retrieval-Augmented Generation) aprende sobre sua empresa em minutos."
        }
      }
    ]
  };
  const aiFeatures = [
    {
      icon: "🧠",
      title: "RAG Local & Privacidade",
      desc: "Seus dados não treinam IAs públicas. Usamos Vector DB privado para garantir que o bot saiba tudo sobre SUA empresa, sem alucinações."
    },
    {
      icon: "🔄",
      title: "Roteamento Multi-LLM",
      desc: "O sistema escolhe inteligentemente entre GPT-4o, Claude 3.5 ou Llama 3 dependendo da complexidade da pergunta e custo."
    },
    {
      icon: "🎨",
      title: "Visão Computacional",
      desc: "O bot 'enxerga'. Envie a foto de um produto com defeito e ele identifica o problema. Envie um comprovante e ele valida o PIX."
    },
    {
      icon: "🗣️",
      title: "Processamento de Voz",
      desc: "Transcreve áudios recebidos instantaneamente e responde em texto ou áudio sintético ultra-realista (TTS)."
    }
  ];
  const integrations = [
    { name: "n8n", icon: "⚡", desc: "Automação infinita open-source" },
    { name: "Typebot", icon: "🤖", desc: "Construtor visual de conversas" },
    { name: "ChatGPT", icon: "🧠", desc: "Inteligência Generativa Nativa" },
    { name: "Webhooks", icon: "🔗", desc: "Conecte com qualquer API REST" },
    { name: "Google Sheets", icon: "📊", desc: "Banco de dados simples e ágil" },
    { name: "Stripe/MercadoPago", icon: "💳", desc: "Cobranças direto no chat" }
  ];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": title, "description": description, "keywords": keywords, "data-astro-cid-hxbe6eys": true }, { "default": ($$result2) => renderTemplate(_a || (_a = __template(['  <script type="application/ld+json">', '<\/script> <script type="application/ld+json">', "<\/script>  ", '<section class="prod-hero relative overflow-hidden" data-astro-cid-hxbe6eys> <!-- Background Effects --> <div class="absolute top-0 right-1/2 translate-x-1/2 w-[800px] h-[600px] bg-purple-500/20 blur-[120px] rounded-full -z-10 animate-pulse-slow" data-astro-cid-hxbe6eys></div> <div class="hero-badge animate-fade-in-up" data-astro-cid-hxbe6eys>⚡ Automação de Próxima Geração</div> <h1 class="animate-fade-in-up delay-100" data-astro-cid-hxbe6eys>O Cérebro Digital da <br data-astro-cid-hxbe6eys><span class="text-gradient" data-astro-cid-hxbe6eys>Sua Operação</span></h1> <p class="hero-subtitle animate-fade-in-up delay-200" data-astro-cid-hxbe6eys>\nMuito além de um chatbot. Crie fluxos complexos, integre com APIs e use IA Generativa para atender, vender e suportar 24/7.\n</p> <div class="hero-ctas animate-fade-in-up delay-300" data-astro-cid-hxbe6eys> <a href="/criar-bot" class="btn-primary-glow group" data-astro-cid-hxbe6eys>\nCriar Meu Primeiro Bot\n<span class="group-hover:translate-x-1 transition-transform inline-block" data-astro-cid-hxbe6eys>→</span> </a> <a href="#como-funciona" class="btn-outline" data-astro-cid-hxbe6eys>\nVer em Ação\n</a> </div> </section>  <section class="py-20 px-5 max-w-7xl mx-auto" id="como-funciona" data-astro-cid-hxbe6eys> <div class="text-center mb-16" data-astro-cid-hxbe6eys> <h2 class="text-3xl font-bold text-white mb-4" data-astro-cid-hxbe6eys>Construa sem <span class="text-gradient" data-astro-cid-hxbe6eys>Programar</span></h2> <p class="text-slate-400 max-w-2xl mx-auto" data-astro-cid-hxbe6eys>Arraste, solte e conecte. Nosso construtor visual permite criar desde auto-atendimentos simples até funis de vendas complexos em minutos.</p> </div> <div class="glass-panel p-1 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden group hover:border-primary/30 transition-colors" data-astro-cid-hxbe6eys> <div class="bg-[#0f172a] rounded-xl relative h-[500px] w-full overflow-hidden pattern-grid-lg" data-astro-cid-hxbe6eys> <!-- Nodes (Simulated) --> <div class="absolute top-10 left-10 bg-[#1e293b] p-4 rounded-lg border border-green-500/50 w-64 shadow-lg" data-astro-cid-hxbe6eys> <div class="flex items-center justify-between mb-2" data-astro-cid-hxbe6eys> <span class="text-xs font-bold text-green-400 uppercase tracking-wider" data-astro-cid-hxbe6eys>Gatilho</span> <span class="text-slate-500" data-astro-cid-hxbe6eys>⚡</span> </div> <p class="text-white font-medium text-sm" data-astro-cid-hxbe6eys>Mensagem Recebida</p> <div class="mt-2 text-xs text-slate-400" data-astro-cid-hxbe6eys>Contém: "preço" ou "orçamento"</div> <!-- Output Dot --> <div class="absolute top-1/2 -right-3 w-4 h-4 bg-slate-500 rounded-full border-4 border-[#0f172a]" data-astro-cid-hxbe6eys></div> </div> <!-- Connection Line CSS --> <svg class="absolute inset-0 w-full h-full pointer-events-none z-0" data-astro-cid-hxbe6eys> <path d="M 320 60 C 400 60, 400 150, 480 150" fill="none" stroke="#64748b" stroke-width="2" stroke-dasharray="5,5" class="animate-dash" data-astro-cid-hxbe6eys></path> <path d="M 730 180 C 800 180, 800 280, 850 280" fill="none" stroke="#64748b" stroke-width="2" data-astro-cid-hxbe6eys></path> </svg> <div class="absolute top-28 left-[480px] bg-[#1e293b] p-4 rounded-lg border border-purple-500/50 w-64 shadow-lg z-10" data-astro-cid-hxbe6eys> <div class="flex items-center justify-between mb-2" data-astro-cid-hxbe6eys> <span class="text-xs font-bold text-purple-400 uppercase tracking-wider" data-astro-cid-hxbe6eys>Ação IA</span> <span class="text-slate-500" data-astro-cid-hxbe6eys>🧠</span> </div> <p class="text-white font-medium text-sm" data-astro-cid-hxbe6eys>Analisar Intenção</p> <div class="mt-2 text-xs text-slate-400" data-astro-cid-hxbe6eys>Modelo: GPT-4o Mini</div> <!-- Input Dot --> <div class="absolute top-1/2 -left-3 w-4 h-4 bg-slate-500 rounded-full border-4 border-[#0f172a]" data-astro-cid-hxbe6eys></div> <!-- Output Dot --> <div class="absolute top-1/2 -right-3 w-4 h-4 bg-slate-500 rounded-full border-4 border-[#0f172a]" data-astro-cid-hxbe6eys></div> </div> <div class="absolute top-60 left-[850px] bg-[#1e293b] p-4 rounded-lg border border-blue-500/50 w-64 shadow-lg z-10" data-astro-cid-hxbe6eys> <div class="flex items-center justify-between mb-2" data-astro-cid-hxbe6eys> <span class="text-xs font-bold text-blue-400 uppercase tracking-wider" data-astro-cid-hxbe6eys>Resposta</span> <span class="text-slate-500" data-astro-cid-hxbe6eys>💬</span> </div> <p class="text-white font-medium text-sm" data-astro-cid-hxbe6eys>Enviar Catálogo PDF</p> <div class="mt-2 text-xs text-slate-400" data-astro-cid-hxbe6eys>Delay: 2 segundos</div> <!-- Input Dot --> <div class="absolute top-1/2 -left-3 w-4 h-4 bg-slate-500 rounded-full border-4 border-[#0f172a]" data-astro-cid-hxbe6eys></div> </div> <!-- Floating UI Elements --> <div class="absolute bottom-5 right-5 bg-black/60 backdrop-blur px-4 py-2 rounded-full border border-white/10 text-xs text-slate-300" data-astro-cid-hxbe6eys>\n● Auto-Saving...\n</div> </div> </div> </section>  <section class="py-24 bg-gradient-to-b from-transparent to-black/30" data-astro-cid-hxbe6eys> <div class="max-w-7xl mx-auto px-5" data-astro-cid-hxbe6eys> <div class="mb-16 text-center" data-astro-cid-hxbe6eys> <span class="text-purple-400 font-bold tracking-wider text-sm uppercase mb-2 block" data-astro-cid-hxbe6eys>Inteligência Artificial Real</span> <h2 class="text-4xl font-black text-white" data-astro-cid-hxbe6eys>Mais que um Chatbot. <br data-astro-cid-hxbe6eys>Uma <span class="text-gradient" data-astro-cid-hxbe6eys>Mente Digital.</span></h2> </div> <div class="grid md:grid-cols-2 gap-8" data-astro-cid-hxbe6eys> ', ' </div> </div> </section>  <section class="py-20" data-astro-cid-hxbe6eys> <div class="max-w-5xl mx-auto px-5" data-astro-cid-hxbe6eys> <h2 class="text-center text-3xl font-bold text-white mb-12" data-astro-cid-hxbe6eys>Automação: <span class="text-gradient" data-astro-cid-hxbe6eys>Passado vs Futuro</span></h2> <div class="overflow-x-auto rounded-2xl border border-white/10" data-astro-cid-hxbe6eys> <table class="w-full text-left border-collapse" data-astro-cid-hxbe6eys> <thead data-astro-cid-hxbe6eys> <tr class="bg-white/5" data-astro-cid-hxbe6eys> <th class="p-4 text-slate-300 font-medium" data-astro-cid-hxbe6eys>Capacidade</th> <th class="p-4 text-primary font-black bg-primary/5 border-b-2 border-primary" data-astro-cid-hxbe6eys>GetNexo AI 🚀</th> <th class="p-4 text-slate-500 font-medium" data-astro-cid-hxbe6eys>Chatbots Antigos (ManyChat, etc)</th> </tr> </thead> <tbody class="text-sm" data-astro-cid-hxbe6eys> ', ' </tbody> </table> </div> </div> </section>  <section class="py-20 px-5 max-w-6xl mx-auto" data-astro-cid-hxbe6eys> <h2 class="text-center text-3xl font-bold text-white mb-16" data-astro-cid-hxbe6eys>O Bot que fala com <span class="text-gradient" data-astro-cid-hxbe6eys>Todo Mundo</span></h2> <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4" data-astro-cid-hxbe6eys> ', ' </div> </section>  <section class="py-24 px-5 max-w-3xl mx-auto" data-astro-cid-hxbe6eys> <h2 class="text-3xl font-bold text-white text-center mb-10" data-astro-cid-hxbe6eys>Dúvidas Frequentes</h2> <div class="space-y-4" data-astro-cid-hxbe6eys> ', ' </div> </section>  <section class="py-20 text-center px-5 relative" data-astro-cid-hxbe6eys> <div class="max-w-4xl mx-auto glass-panel p-12 rounded-3xl relative overflow-hidden" data-astro-cid-hxbe6eys> <!-- Glow Effect --> <div class="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent pointer-events-none" data-astro-cid-hxbe6eys></div> <h2 class="text-4xl md:text-5xl font-black text-white mb-6" data-astro-cid-hxbe6eys>\nPare de perder tempo respondendo <br data-astro-cid-hxbe6eys> <span class="text-purple-400" data-astro-cid-hxbe6eys>perguntas repetidas.</span> </h2> <p class="text-xl text-slate-300 mb-10 max-w-2xl mx-auto" data-astro-cid-hxbe6eys>\nAutomatize 80% do seu atendimento hoje e deixe sua equipe focar no que importa: Fechar Vendas.\n</p> <div class="flex flex-col md:flex-row gap-4 justify-center items-center relative z-10" data-astro-cid-hxbe6eys> <a href="/criar-bot" class="btn-primary-glow bg-purple-500 hover:bg-purple-400 border-none text-white shadow-purple-500/20" data-astro-cid-hxbe6eys>\nAtivar Automação Grátis\n</a> </div> <p class="mt-6 text-sm text-slate-500" data-astro-cid-hxbe6eys>\nSetup em 5 minutos • Sem cartão de crédito\n</p> </div> </section> '])), unescapeHTML(JSON.stringify(schema)), unescapeHTML(JSON.stringify(faqSchema)), maybeRenderHead(), aiFeatures.map((feat) => renderTemplate`<div class="feature-card glass-panel group hover:bg-white/5" data-astro-cid-hxbe6eys> <div class="flex items-start gap-4" data-astro-cid-hxbe6eys> <span class="text-4xl bg-white/5 p-3 rounded-xl" data-astro-cid-hxbe6eys>${feat.icon}</span> <div data-astro-cid-hxbe6eys> <h3 class="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors" data-astro-cid-hxbe6eys>${feat.title}</h3> <p class="text-slate-400 leading-relaxed" data-astro-cid-hxbe6eys>${feat.desc}</p> </div> </div> </div>`), [
    ["Flexibilidade", "✅ fluxos Infinitos + Código Custom", "⚠️ Limitado aos blocos padrões"],
    ["Treinamento IA", "✅ RAG (Lê seus PDFs/Site)", "❌ Apenas palavras-chave"],
    ["Canais", "✅ WhatsApp, Instagram, Web", "⚠️ Focado em um canal"],
    ["Integrações", "✅ Webhooks, HTTP, n8n Nativo", "⚠️ Depende de Zapier (Pago)"],
    ["Preço Escala", "✅ Fixo (Sem surpresas)", "❌ Cobra por contato/lead"]
  ].map(([feature, nexo, old], idx) => renderTemplate`<tr${addAttribute(`border-t border-white/5 ${idx % 2 === 0 ? "bg-white/[0.02]" : ""}`, "class")} data-astro-cid-hxbe6eys> <td class="p-4 text-white font-medium" data-astro-cid-hxbe6eys>${feature}</td> <td class="p-4 text-green-400 font-bold bg-primary/5" data-astro-cid-hxbe6eys>${nexo}</td> <td class="p-4 text-slate-500" data-astro-cid-hxbe6eys>${old}</td> </tr>`), integrations.map((int) => renderTemplate`<div class="glass-panel p-6 text-center hover:bg-white/10 transition-all hover:scale-105 cursor-default" data-astro-cid-hxbe6eys> <span class="text-3xl block mb-3" data-astro-cid-hxbe6eys>${int.icon}</span> <h4 class="text-white font-bold mb-1" data-astro-cid-hxbe6eys>${int.name}</h4> <p class="text-xs text-slate-500" data-astro-cid-hxbe6eys>${int.desc}</p> </div>`), faqSchema.mainEntity.map((faq) => renderTemplate`<details class="glass-panel p-4 rounded-xl group cursor-pointer open:bg-white/10 transition-colors" data-astro-cid-hxbe6eys> <summary class="flex justify-between items-center font-bold text-white list-none" data-astro-cid-hxbe6eys> ${faq.name} <span class="text-primary text-xl group-open:rotate-45 transition-transform" data-astro-cid-hxbe6eys>+</span> </summary> <p class="mt-4 text-slate-400 leading-relaxed border-t border-white/5 pt-4 animate-fade-in" data-astro-cid-hxbe6eys> ${faq.acceptedAnswer.text} </p> </details>`)) })} `;
}, "/home/lele/usenexo/getnexo-site/src/pages/produtos/automacao.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/produtos/automacao.astro";
const $$url = "/produtos/automacao";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Automacao,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
