import { _ as __variableDynamicImportRuntimeHelper, $ as $$Layout } from "../assets/Layout-DScI-qCd.js";
import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate, h as addAttribute, u as unescapeHTML, m as maybeRenderHead } from "../assets/astro/server-MCYX8tFF.js";
import "piccolore";
/* empty css                                */
import { renderers } from "../renderers.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://getnexo.com.br");
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const title = "GetNexo: A Melhor Plataforma de IA para Vendas no WhatsApp | API Oficial";
  const description = "Scale suas vendas 24h por dia com a IA mais avançada para WhatsApp. API Oficial Meta, PIX Nativo, Recuperação de Carrinhos e Automação de Altíssima Conversão.";
  const keywords = "melhor plataforma whatsapp vendas, ia para whatsapp, api whatsapp oficial, automação de vendas whatsapp, recuperar carrinho whatsapp, pix no whatsapp, getnexo ia";
  const lang = Astro2.url.pathname.split("/")[1] || "pt";
  const { default: t } = await __variableDynamicImportRuntimeHelper(/* @__PURE__ */ Object.assign({ "../../i18n/en.json": () => import("../assets/en-BajIFjBr.js"), "../../i18n/es.json": () => import("../assets/es-k6dLh2tK.js"), "../../i18n/fr.json": () => import("../assets/fr-CDveqv2A.js"), "../../i18n/pt.json": () => import("../assets/pt-DS2qK9FO.js") }), `../../i18n/${lang}.json`, 4);
  const homeSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://getnexo.com.br/#organization",
        "name": "GetNexo",
        "url": "https://getnexo.com.br",
        "logo": "https://getnexo.com.br/logo.svg",
        "sameAs": [
          "https://linkedin.com/company/getnexo",
          "https://instagram.com/getnexo",
          "https://github.com/lelebrr"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://getnexo.com.br/#website",
        "url": "https://getnexo.com.br",
        "name": "GetNexo",
        "publisher": { "@id": "https://getnexo.com.br/#organization" },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://getnexo.com.br/buscar?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "O GetNexo usa API Oficial?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sim, o GetNexo é 100% compatível com a API Oficial da Meta via Evolution API, garantindo segurança e zero risco de banimento."
            }
          },
          {
            "@type": "Question",
            "name": "Como funciona a IA para vendas?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Nossa IA é treinada com os dados do seu negócio e catálogo de produtos, permitindo que ela tire dúvidas, sugira produtos e feche vendas automaticamente 24h por dia."
            }
          },
          {
            "@type": "Question",
            "name": "Tem suporte para PIX?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sim, temos PIX Nativo. O bot gera o código copia e cola ou QR Code e confirma o pagamento instantaneamente na conversa."
            }
          }
        ]
      }
    ]
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": title, "description": description, "keywords": keywords, "isLanding": true }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([' <script type="application/ld+json">', "<\/script>  ", '<section class="hero-split"> <div class="hero-content"> <div class="hero-badge reveal">A revolução das vendas chegou 🚀</div> <h1 class="hero-title reveal">', '</h1> <p class="hero-subtitle reveal"> ', ' </p> <div class="hero-ctas reveal"> <a', ' class="btn-primary-glow">', '</a> <button onclick="abrirModalDemo()" class="btn-outline">', ` →</button> </div> <div class="hero-trust reveal"> <span>✅ API Oficial Meta</span> <span>✅ Setup em 12min</span> <span>✅ Zero Mensalidade</span> </div> </div> <div class="hero-visual reveal"> <div class="hologram-container"> <div class="hologram-core"> <div class="hologram-ring ring-1"></div> <div class="hologram-ring ring-2"></div> <div class="hologram-ring ring-3"></div> <div class="ara-avatar">✨</div> <div class="hologram-shards"> <span></span><span></span><span></span><span></span> </div> </div> <div class="hologram-base"></div> <div class="hologram-glow"></div> <!-- Floating Mini Chat UI next to Hologram --> <div class="floating-chat glass-panel"> <div class="chat-header-mini">Nexus IA</div> <div class="chat-body-mini" id="hero-chat"></div> </div> </div> </div> </section>  <div class="section-header reveal"> <h2 class="text-gradient">A Infraestrutura Definitiva para Escalar suas Vendas</h2> <p>A única plataforma que combina IA Generativa, PIX Nativo e Automação Oficial Meta para transformar seu Chat em uma máquina de lucro 24h por dia.</p> </div> <div class="grid-cards"> <div class="glass-panel p-card reveal"> <div class="p-icon">🤖</div> <h3>IA Generativa de Vendas</h3> <p>Agente virtual treinado com seu catálogo que converte leads em lucro 24/7 de forma humanizada.</p> <a href="/produtos/automacao" class="p-link">Explorar IA →</a> </div> <div class="glass-panel p-card reveal"> <div class="p-icon">💰</div> <h3>Checkout & PIX Nativo</h3> <p>Experiência de compra fluida com geração de PIX e confirmação automática sem sair do chat.</p> <a href="/produtos/vendas" class="p-link">Ver Checkout →</a> </div> <div class="glass-panel p-card reveal"> <div class="p-icon">🚀</div> <h3>Broadcast & Ads de Alta Performance</h3> <p>Envios em massa inteligentes e Click-to-WhatsApp Ads com mensuração de ROI em tempo real.</p> <a href="/produtos/marketing" class="p-link">Ativar Ads →</a> </div> <div class="glass-panel p-card reveal"> <div class="p-icon">👥</div> <h3>Pipeline & CRM Estratégico</h3> <p>Visão 360º do seu funil com gestão multi-agente e automação inteligente de follow-up.</p> <a href="/produtos/crm" class="p-link">Gerir Leads →</a> </div> </div>  <section class="metrics-section glass-panel reveal"> <div class="metric-item"> <span class="m-val">10x</span> <span class="m-label">Mais Conversão</span> </div> <div class="metric-divider"></div> <div class="metric-item"> <span class="m-val">24/7</span> <span class="m-label">Disponibilidade</span> </div> <div class="metric-divider"></div> <div class="metric-item"> <span class="m-val">R$ 0</span> <span class="m-label">Mensalidade Fixa</span> </div> </section>  <section class="final-cta reveal"> <div class="glass-panel cta-box"> <h2 class="text-gradient">Pronto para transformar seu Chat em uma Máquina de Vendas?</h2> <p>Domine o WhatsApp com a infraestrutura mais robusta do mercado. Ative sua IA em menos de 10 minutos.</p> <div class="cta-actions"> <a href="/criar-bot" class="btn-primary-glow">Criar Conta Grátis</a> <a href="/precos" class="btn-outline">Ver Planos Pro</a> </div> </div> </section>  <div id="demo-modal" class="fixed inset-0 hidden z-[9999]" style="background: rgba(0,0,0,0.9); backdrop-filter: blur(8px);"> <div class="modal-wrapper flex items-center justify-center min-h-screen p-4"> <div class="bg-void-black border-2 border-neon-blue rounded-3xl p-8 w-full max-w-2xl shadow-[0_0_50px_rgba(0,247,255,0.3)] relative"> <div class="flex justify-between items-center mb-6"> <div> <h3 class="text-2xl text-cyber-gold font-jetbrains mb-2">Escolha sua Demo IA</h3> <p class="text-gray-300">Veja como o GetNexo funciona em diferentes plataformas</p> </div> <button onclick="fecharModalDemo()" class="text-neon-blue hover:text-white transition-colors p-2" style="font-size: 2.5rem; line-height: 1;">&times;</button> </div> <div class="grid grid-cols-1 md:grid-cols-2 gap-6"> <!-- Chat Completo --> <div class="demo-option bg-matrix-black/50 border border-matrix-green/30 rounded-xl p-6 hover:bg-matrix-green/10 transition-all cursor-pointer" onclick="abrirModalChat()"> <div class="flex items-center space-x-4 mb-4"> <div class="w-12 h-12 bg-matrix-green/20 rounded-full flex items-center justify-center"> <span class="text-2xl">💬</span> </div> <div> <h4 class="text-xl text-matrix-green font-medium">Chat Completo</h4> <p class="text-gray-400 text-sm">IA responde e fala sozinha</p> </div> </div> <div class="space-y-2 text-xs text-gray-400"> <div class="flex items-center"> <span class="text-matrix-green mr-2">✓</span> <span>IA responde automaticamente</span> </div> <div class="flex items-center"> <span class="text-matrix-green mr-2">✓</span> <span>Voz e síntese de fala</span> </div> <div class="flex items-center"> <span class="text-matrix-green mr-2">✓</span> <span>Cards interativos dinâmicos</span> </div> </div> </div> <!-- Demo IA Interativa --> <div class="demo-option bg-matrix-black/50 border border-cyber-gold/30 rounded-xl p-6 hover:bg-cyber-gold/10 transition-all cursor-pointer" onclick="abrirModalIA()"> <div class="flex items-center space-x-4 mb-4"> <div class="w-12 h-12 bg-cyber-gold/20 rounded-full flex items-center justify-center"> <span class="text-2xl">🤖</span> </div> <div> <h4 class="text-xl text-cyber-gold font-medium">Demo IA Interativa</h4> <p class="text-gray-400 text-sm">Busca inteligente + multimídia</p> </div> </div> <div class="space-y-2 text-xs text-gray-400"> <div class="flex items-center"> <span class="text-cyber-gold mr-2">✓</span> <span>Busca inteligente por voz</span> </div> <div class="flex items-center"> <span class="text-cyber-gold mr-2">✓</span> <span>Vídeos, áudios e 360°</span> </div> <div class="flex items-center"> <span class="text-cyber-gold mr-2">✓</span> <span>Catalogo JSON integrado</span> </div> </div> </div> <!-- Demo WhatsApp --> <div class="demo-option bg-matrix-black/50 border border-cyber-gold/30 rounded-xl p-6 hover:bg-cyber-gold/10 transition-all cursor-pointer" onclick="window.open('https://wa.me/5511999999999?text=Oi%2C+quero+ver+a+demo+IA+do+GetNexo', '_blank')"> <div class="flex items-center space-x-4 mb-4"> <div class="w-12 h-12 bg-cyber-gold/20 rounded-full flex items-center justify-center"> <span class="text-2xl">💬</span> </div> <div> <h4 class="text-xl text-cyber-gold font-medium">Demo no WhatsApp</h4> <p class="text-gray-400 text-sm">Experiência real no WhatsApp</p> </div> </div> <div class="space-y-2 text-xs text-gray-400"> <div class="flex items-center"> <span class="text-cyber-gold mr-2">✓</span> <span>API Oficial Meta integrada</span> </div> <div class="flex items-center"> <span class="text-cyber-gold mr-2">✓</span> <span>PIX e pagamentos diretos</span> </div> <div class="flex items-center"> <span class="text-cyber-gold mr-2">✓</span> <span>Automação 24/7 real</span> </div> </div> </div> <!-- Demo Facebook - Em Breve --> <div class="demo-option bg-matrix-black/50 border border-gray-600 rounded-xl p-6 relative cursor-not-allowed"> <div class="absolute top-3 right-3 bg-gray-600 text-white text-xs px-2 py-1 rounded">
Em Breve
</div> <div class="flex items-center space-x-4 mb-4 opacity-60"> <div class="w-12 h-12 bg-gray-600/20 rounded-full flex items-center justify-center"> <span class="text-2xl">📘</span> </div> <div> <h4 class="text-xl text-gray-400 font-medium">Demo no Facebook</h4> <p class="text-gray-500 text-sm">Integração Messenger</p> </div> </div> <div class="space-y-2 text-xs text-gray-500 opacity-60"> <div class="flex items-center"> <span class="text-gray-400 mr-2">⏳</span> <span>Chatbots no Messenger</span> </div> <div class="flex items-center"> <span class="text-gray-400 mr-2">⏳</span> <span>Ads e conversão automática</span> </div> <div class="flex items-center"> <span class="text-gray-400 mr-2">⏳</span> <span>Comentários inteligentes</span> </div> </div> </div> <!-- Demo Instagram - Em Breve --> <div class="demo-option bg-matrix-black/50 border border-gray-600 rounded-xl p-6 relative cursor-not-allowed"> <div class="absolute top-3 right-3 bg-gray-600 text-white text-xs px-2 py-1 rounded">
Em Breve
</div> <div class="flex items-center space-x-4 mb-4 opacity-60"> <div class="w-12 h-12 bg-gray-600/20 rounded-full flex items-center justify-center"> <span class="text-2xl">📸</span> </div> <div> <h4 class="text-xl text-gray-400 font-medium">Demo no Instagram</h4> <p class="text-gray-500 text-sm">Direct e Stories</p> </div> </div> <div class="space-y-2 text-xs text-gray-500 opacity-60"> <div class="flex items-center"> <span class="text-gray-400 mr-2">⏳</span> <span>Respostas no Direct</span> </div> <div class="flex items-center"> <span class="text-gray-400 mr-2">⏳</span> <span>Stories interativos</span> </div> <div class="flex items-center"> <span class="text-gray-400 mr-2">⏳</span> <span>Comentários automáticos</span> </div> </div> </div> </div> <div class="mt-8 pt-6 border-t border-neon-blue/30 text-center"> <p class="text-gray-400 text-sm mb-4">Não sabe qual escolher?</p> <div class="flex flex-col sm:flex-row gap-3 justify-center"> <button onclick="abrirModalChat()" class="bg-matrix-green text-black px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all">
💬 Chat IA Completo
</button> <button onclick="abrirModalIA()" class="bg-cyber-gold text-black px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all">
🤖 Demo Multimídia
</button> </div> </div> </div> </div> <!-- Modal Chat Completo --> <div id="chat-modal" class="fixed inset-0 hidden z-[9999]" style="background: rgba(0,0,0,0.95); backdrop-filter: blur(8px);"> <div class="modal-wrapper flex items-center justify-center min-h-screen p-4"> <div class="bg-void-black border-2 border-neon-blue rounded-3xl p-6 w-full max-w-4xl h-[85vh] flex flex-col shadow-[0_0_50px_rgba(0,247,255,0.3)] relative"> <div class="flex justify-between items-center mb-4"> <div> <h3 class="text-2xl text-cyber-gold font-jetbrains">Demo GetNexo – IA Multimídia</h3> <p class="text-gray-300">IA responde e fala sozinha</p> </div> <button onclick="fecharModalChat()" class="text-neon-blue text-3xl hover:text-white">×</button> </div> <div class="chat-container flex-1 overflow-hidden flex flex-col"> <div class="chat-box flex-1 overflow-y-auto border border-neon-blue rounded p-4 mb-4 space-y-2" id="chat-messages-modal"> <!-- Mensagem inicial --> <div class="flex justify-start"> <div class="bg-neon-blue/20 border border-neon-blue/50 rounded-2xl px-4 py-3 max-w-md"> <p class="text-white text-sm">🚀 <strong>Olá! Bem-vindo ao Chat IA do GetNexo!</strong></p> <p class="text-gray-300 text-xs mt-2">Eu sou um assistente inteligente capaz de:</p> <ul class="text-xs text-neon-blue mt-1 space-y-1"> <li>• 💬 Conversar naturalmente sobre produtos</li> <li>• 🔍 Buscar itens em catálogo JSON</li> <li>• 🛒 Mostrar cards interativos com preços</li> <li>• 🔄 Exibir visualizações 360° dos produtos</li> <li>• 🎤 Responder por voz</li> </ul> <p class="text-cyber-gold text-xs mt-2 font-medium">💡 Teste comigo! Experimente:</p> <div class="flex flex-wrap gap-1 mt-2"> <button onclick="preencherMensagemModal('Quero um tênis branco')" class="bg-matrix-green/20 hover:bg-matrix-green/30 text-matrix-green text-xs px-2 py-1 rounded border border-matrix-green/30">Quero um tênis branco</button> <button onclick="preencherMensagemModal('Tem algum carro preto?')" class="bg-cyber-gold/20 hover:bg-cyber-gold/30 text-cyber-gold text-xs px-2 py-1 rounded border border-cyber-gold/30">Tem carro preto?</button> <button onclick="preencherMensagemModal('Procurando um PC gamer')" class="bg-neon-blue/20 hover:bg-neon-blue/30 text-neon-blue text-xs px-2 py-1 rounded border border-neon-blue/30">PC gamer barato</button> </div> </div> </div> </div> <div class="input-bar flex gap-2"> <input id="chat-input-modal" type="text" placeholder="Pergunte qualquer coisa..." class="flex-1 bg-void-black border border-neon-blue text-white rounded p-2" onkeydown="handleKeyPressModal(event)"> <button onclick="sendMessageModal()" class="bg-cyber-gold text-black px-4 py-2 rounded">Enviar</button> <button onclick="iniciarVozModal()" class="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded">🎤 Voz</button> </div> </div> </div> </div> <!-- Modal Demo IA Interativa --> <div id="ia-modal" class="fixed inset-0 hidden z-[9999]" style="background: rgba(0,0,0,0.95); backdrop-filter: blur(8px);"> <div class="modal-wrapper flex items-center justify-center min-h-screen p-4"> <div class="bg-void-black border-2 border-neon-blue rounded-3xl p-6 w-full max-w-6xl h-[90vh] overflow-hidden flex flex-col shadow-[0_0_50px_rgba(0,247,255,0.3)] relative"> <div class="flex justify-between items-center mb-4"> <div> <h3 class="text-2xl text-cyber-gold font-jetbrains">Demo IA Interativa GetNexo</h3> <p class="text-gray-300">Busca inteligente + multimídia</p> </div> <button onclick="fecharModalIA()" class="text-neon-blue text-3xl hover:text-white">×</button> </div> <div class="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-3 gap-6"> <!-- Chat Interface --> <div class="lg:col-span-2 bg-void-black/90 border border-neon-blue/50 rounded-2xl p-4 flex flex-col h-full"> <div class="flex items-center mb-4"> <div class="w-3 h-3 bg-matrix-green rounded-full mr-3"></div> <h4 class="text-xl text-cyber-gold font-jetbrains">Assistente IA</h4> </div> <div id="ia-chat-messages" class="flex-1 overflow-y-auto mb-4 space-y-4"> <!-- Mensagem inicial --> <div class="flex justify-start"> <div class="bg-neon-blue/20 border border-neon-blue/50 rounded-2xl px-4 py-3 max-w-md"> <p class="text-white text-sm">🚀 <strong>Olá! Bem-vindo à Demo IA do GetNexo!</strong></p> <p class="text-gray-300 text-xs mt-2">Eu sou um assistente inteligente capaz de:</p> <ul class="text-xs text-neon-blue mt-1 space-y-1"> <li>• 💬 Conversar naturalmente sobre produtos</li> <li>• 🔍 Buscar itens em catálogo JSON</li> <li>• 🛒 Mostrar cards interativos com preços</li> <li>• 🔄 Exibir visualizações 360° dos produtos</li> <li>• 🤖 Usar IA para entender suas necessidades</li> </ul> <p class="text-cyber-gold text-xs mt-2 font-medium">💡 Teste comigo! Experimente dizer:</p> <div class="flex flex-wrap gap-1 mt-2"> <button onclick="preencherMensagemIA('apartamento 2 quartos')" class="bg-matrix-green/20 hover:bg-matrix-green/30 text-matrix-green text-xs px-2 py-1 rounded border border-matrix-green/30">Apartamento 2 quartos</button> <button onclick="preencherMensagemIA('PC gamer barato')" class="bg-cyber-gold/20 hover:bg-cyber-gold/30 text-cyber-gold text-xs px-2 py-1 rounded border border-cyber-gold/30">PC Gamer</button> <button onclick="preencherMensagemIA('pizza vegana')" class="bg-neon-blue/20 hover:bg-neon-blue/30 text-neon-blue text-xs px-2 py-1 rounded border border-neon-blue/30">Pizza vegana</button> </div> </div> </div> </div> <div class="border-t border-neon-blue/30 pt-4"> <div class="flex space-x-2"> <input id="ia-chat-input" type="text" placeholder="Digite sua pergunta sobre produtos..." class="flex-1 bg-matrix-black border border-neon-blue/50 rounded-xl px-4 py-3 text-white placeholder-gray-400" onkeydown="handleKeyPressIA(event)"> <button onclick="sendMessageIA()" class="bg-cyber-gold hover:bg-yellow-400 text-black px-6 py-3 rounded-xl font-medium">📤 Enviar</button> <button onclick="iniciarVozIA()" class="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-xl font-medium">🎤 Voz</button> </div> </div> </div> <!-- Product Showcase --> <div class="space-y-4 bg-void-black/90 border border-neon-blue/50 rounded-2xl p-4 overflow-y-auto"> <h4 class="text-lg text-cyber-gold font-jetbrains mb-4">🎯 Produtos em Destaque</h4> <div class="space-y-3"> <div class="border border-matrix-green/30 rounded-lg p-3 bg-matrix-black/50 hover:bg-matrix-green/10 transition-colors cursor-pointer" onclick="mostrarProdutoIA('carro', 0)"> <div class="flex items-center space-x-2"> <span class="text-2xl">🚗</span> <div class="flex-1"> <h5 class="text-cyber-gold text-sm font-medium">Cruze RS Turbo 2026</h5> <p class="text-neon-blue text-xs">Preto • R$ 129.990</p> </div> </div> </div> <div class="border border-cyber-gold/30 rounded-lg p-3 bg-matrix-black/50 hover:bg-cyber-gold/10 transition-colors cursor-pointer" onclick="mostrarProdutoIA('celular', 0)"> <div class="flex items-center space-x-2"> <span class="text-2xl">📱</span> <div class="flex-1"> <h5 class="text-cyber-gold text-sm font-medium">iPhone 15 128GB</h5> <p class="text-neon-blue text-xs">Azul • R$ 4.299</p> </div> </div> </div> <div class="border border-neon-blue/30 rounded-lg p-3 bg-matrix-black/50 hover:bg-neon-blue/10 transition-colors cursor-pointer" onclick="mostrarProdutoIA('computador', 0)"> <div class="flex items-center space-x-2"> <span class="text-2xl">💻</span> <div class="flex-1"> <h5 class="text-cyber-gold text-sm font-medium">PC Warrior i5 12ª</h5> <p class="text-neon-blue text-xs">RTX 3060 • R$ 4.990</p> </div> </div> </div> </div> </div> </div> </div> </div> <!-- Modal para produto IA --> <div id="product-modal-ia" class="fixed inset-0 bg-black/80 hidden z-60 flex items-center justify-center"> <div class="bg-void-black border border-neon-blue rounded-2xl p-6 max-w-md w-full mx-4"> <div class="flex justify-between items-center mb-4"> <h4 class="text-xl text-cyber-gold font-jetbrains">Produto Encontrado</h4> <button onclick="fecharModalProdutoIA()" class="text-neon-blue text-2xl hover:text-white">×</button> </div> <div id="product-content-ia"></div> </div> </div> <script>
  // Funções do modal demo
  window.abrirModalDemo = function() {
    const modal = document.getElementById('demo-modal');
    modal.classList.remove('hidden');
    modal.style.display = 'block';
  };

  window.fecharModalDemo = function() {
    const modal = document.getElementById('demo-modal');
    modal.classList.add('hidden');
    modal.style.display = 'none';
  };

  // Modal Chat Completo
  window.abrirModalChat = function() {
    fecharModalDemo();
    setTimeout(() => {
        document.getElementById('chat-modal').classList.remove('hidden');
        document.getElementById('chat-modal').style.display = 'block';
    }, 100);
  };

  window.fecharModalChat = function() {
    document.getElementById('chat-modal').classList.add('hidden');
    document.getElementById('chat-modal').style.display = 'none';
  };

  // Modal Demo IA
  window.abrirModalIA = function() {
    fecharModalDemo();
    setTimeout(() => {
        document.getElementById('ia-modal').classList.remove('hidden');
        document.getElementById('ia-modal').style.display = 'block';
    }, 100);
  };

  window.fecharModalIA = function() {
    document.getElementById('ia-modal').classList.add('hidden');
    document.getElementById('ia-modal').style.display = 'none';
  };

  // Produto IA
  window.fecharModalProdutoIA = function() {
    document.getElementById('product-modal-ia').classList.add('hidden');
  };

  // Funções Chat Modal
  window.preencherMensagemModal = function(texto) {
    document.getElementById('chat-input-modal').value = texto;
    sendMessageModal();
  };

  window.handleKeyPressModal = function(event) {
    if (event.key === 'Enter') {
      sendMessageModal();
    }
  };

  window.sendMessageModal = function() {
    const input = document.getElementById('chat-input-modal');
    const message = input.value.trim();
    if (!message) return;

    addMessageModal(message, 'user');
    input.value = '';

    setTimeout(() => {
      addMessageModal('🤖 Esta é uma demonstração do Chat IA do GetNexo. Em uma implementação real, a IA responderia automaticamente com informações sobre produtos do catálogo.', 'bot');
    }, 1000);
  };

  window.iniciarVozModal = function() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Seu navegador não suporta reconhecimento de voz.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    const btn = event.currentTarget;
    const originalText = btn.innerHTML;

    recognition.onstart = () => {
      btn.innerHTML = 'Ouvindo...';
      btn.classList.add('bg-red-600');
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      document.getElementById('chat-input-modal').value = transcript;
      window.sendMessageModal();
    };

    recognition.onend = () => {
      btn.innerHTML = originalText;
      btn.classList.remove('bg-red-600');
    };

    recognition.start();
  };

  function addMessageModal(text, sender) {
    const messagesDiv = document.getElementById('chat-messages-modal');
    const messageDiv = document.createElement('div');
    messageDiv.className = \`flex \${sender === 'user' ? 'justify-end' : 'justify-start'}\`;

    const bubbleClass = sender === 'user'
      ? 'bg-cyber-gold text-black'
      : 'bg-neon-blue/20 border border-neon-blue/50 text-white';

    messageDiv.innerHTML = \`
      <div class="\${bubbleClass} rounded-2xl px-4 py-3 max-w-xs">
        <p class="text-sm whitespace-pre-line">\${text}</p>
      </div>
    \`;

    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  // Funções IA Modal
  window.preencherMensagemIA = function(texto) {
    document.getElementById('ia-chat-input').value = texto;
    sendMessageIA();
  };

  window.handleKeyPressIA = function(event) {
    if (event.key === 'Enter') {
      sendMessageIA();
    }
  };

  window.sendMessageIA = function() {
    const input = document.getElementById('ia-chat-input');
    const message = input.value.trim();
    if (!message) return;

    addMessageIA(message, 'user');
    input.value = '';

    setTimeout(() => {
      addMessageIA('🤖 Demo IA: Buscando produtos... Encontrei resultados relevantes!', 'bot');
      setTimeout(() => {
        mostrarProdutoIA('computador', 0);
      }, 1000);
    }, 1500);
  };

  window.iniciarVozIA = function() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Seu navegador não suporta reconhecimento de voz.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    const btn = event.currentTarget;
    const originalText = btn.innerHTML;

    recognition.onstart = () => {
      btn.innerHTML = 'Ouvindo...';
      btn.classList.add('bg-red-600');
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      document.getElementById('ia-chat-input').value = transcript;
      window.sendMessageIA();
    };

    recognition.onend = () => {
      btn.innerHTML = originalText;
      btn.classList.remove('bg-red-600');
    };

    recognition.start();
  };

  function addMessageIA(text, sender) {
    const messagesDiv = document.getElementById('ia-chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = \`flex \${sender === 'user' ? 'justify-end' : 'justify-start'}\`;

    const bubbleClass = sender === 'user'
      ? 'bg-cyber-gold text-black'
      : 'bg-neon-blue/20 border border-neon-blue/50 text-white';

    messageDiv.innerHTML = \`
      <div class="\${bubbleClass} rounded-2xl px-4 py-3 max-w-md">
        <p class="text-sm whitespace-pre-line">\${text}</p>
      </div>
    \`;

    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  window.mostrarProdutoIA = function(categoria, index) {
    const produtos = {
      carro: { nome: 'Cruze RS Turbo 2026', cor: 'Preto', preco: 129990, imagem: '/images/cruze.jpg' },
      celular: { nome: 'iPhone 15 128GB', cor: 'Azul', preco: 4299, imagem: '/images/iphone.jpg' },
      computador: { nome: 'PC Warrior i5 12ª', cpu: 'i5-12400F', ram: '16GB', preco: 4990, imagem: '/images/pc.jpg' }
    };

    const produto = produtos[categoria];

    const content = \`
      <img src="\${produto.imagem}" alt="\${produto.nome}" class="w-full h-48 object-cover rounded-lg mb-4" onerror="this.src='/logo.svg'" />
      <h4 class="text-xl text-cyber-gold font-jetbrains mb-2">\${produto.nome}</h4>
      <div class="text-sm text-gray-300 mb-4">
        \${produto.cor ? \`<p>Cor: \${produto.cor}</p>\` : ''}
        \${produto.cpu ? \`<p>CPU: \${produto.cpu}</p>\` : ''}
        \${produto.ram ? \`<p>RAM: \${produto.ram}</p>\` : ''}
      </div>
      <p class="text-2xl text-matrix-green font-bold mb-4">R$ \${produto.preco.toLocaleString('pt-BR')}</p>
      <div class="flex space-x-2">
        <button onclick="alert('Produto adicionado ao carrinho!')" class="bg-cyber-gold hover:bg-yellow-400 text-black px-4 py-2 rounded font-medium">Comprar Agora</button>
      </div>
    \`;

    document.getElementById('product-content-ia').innerHTML = content;
    document.getElementById('product-modal-ia').classList.remove('hidden');
  };

  // Fechar modal ao clicar fora
  document.addEventListener('click', function(event) {
    const demoModal = document.getElementById('demo-modal');
    const chatModal = document.getElementById('chat-modal');
    const iaModal = document.getElementById('ia-modal');
    const productModal = document.getElementById('product-modal-ia');

    if (event.target === demoModal) fecharModalDemo();
    if (event.target === chatModal) fecharModalChat();
    if (event.target === iaModal) fecharModalIA();
    if (event.target === productModal) fecharModalProdutoIA();
  });

  // Fechar modal com ESC
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      fecharModalDemo();
      fecharModalChat();
      fecharModalIA();
      fecharModalProdutoIA();
    }
  });
<\/script> <script src="/scripts/performance/home-animations.js" defer><\/script> </div> </div></div>`], [' <script type="application/ld+json">', "<\/script>  ", '<section class="hero-split"> <div class="hero-content"> <div class="hero-badge reveal">A revolução das vendas chegou 🚀</div> <h1 class="hero-title reveal">', '</h1> <p class="hero-subtitle reveal"> ', ' </p> <div class="hero-ctas reveal"> <a', ' class="btn-primary-glow">', '</a> <button onclick="abrirModalDemo()" class="btn-outline">', ` →</button> </div> <div class="hero-trust reveal"> <span>✅ API Oficial Meta</span> <span>✅ Setup em 12min</span> <span>✅ Zero Mensalidade</span> </div> </div> <div class="hero-visual reveal"> <div class="hologram-container"> <div class="hologram-core"> <div class="hologram-ring ring-1"></div> <div class="hologram-ring ring-2"></div> <div class="hologram-ring ring-3"></div> <div class="ara-avatar">✨</div> <div class="hologram-shards"> <span></span><span></span><span></span><span></span> </div> </div> <div class="hologram-base"></div> <div class="hologram-glow"></div> <!-- Floating Mini Chat UI next to Hologram --> <div class="floating-chat glass-panel"> <div class="chat-header-mini">Nexus IA</div> <div class="chat-body-mini" id="hero-chat"></div> </div> </div> </div> </section>  <div class="section-header reveal"> <h2 class="text-gradient">A Infraestrutura Definitiva para Escalar suas Vendas</h2> <p>A única plataforma que combina IA Generativa, PIX Nativo e Automação Oficial Meta para transformar seu Chat em uma máquina de lucro 24h por dia.</p> </div> <div class="grid-cards"> <div class="glass-panel p-card reveal"> <div class="p-icon">🤖</div> <h3>IA Generativa de Vendas</h3> <p>Agente virtual treinado com seu catálogo que converte leads em lucro 24/7 de forma humanizada.</p> <a href="/produtos/automacao" class="p-link">Explorar IA →</a> </div> <div class="glass-panel p-card reveal"> <div class="p-icon">💰</div> <h3>Checkout & PIX Nativo</h3> <p>Experiência de compra fluida com geração de PIX e confirmação automática sem sair do chat.</p> <a href="/produtos/vendas" class="p-link">Ver Checkout →</a> </div> <div class="glass-panel p-card reveal"> <div class="p-icon">🚀</div> <h3>Broadcast & Ads de Alta Performance</h3> <p>Envios em massa inteligentes e Click-to-WhatsApp Ads com mensuração de ROI em tempo real.</p> <a href="/produtos/marketing" class="p-link">Ativar Ads →</a> </div> <div class="glass-panel p-card reveal"> <div class="p-icon">👥</div> <h3>Pipeline & CRM Estratégico</h3> <p>Visão 360º do seu funil com gestão multi-agente e automação inteligente de follow-up.</p> <a href="/produtos/crm" class="p-link">Gerir Leads →</a> </div> </div>  <section class="metrics-section glass-panel reveal"> <div class="metric-item"> <span class="m-val">10x</span> <span class="m-label">Mais Conversão</span> </div> <div class="metric-divider"></div> <div class="metric-item"> <span class="m-val">24/7</span> <span class="m-label">Disponibilidade</span> </div> <div class="metric-divider"></div> <div class="metric-item"> <span class="m-val">R$ 0</span> <span class="m-label">Mensalidade Fixa</span> </div> </section>  <section class="final-cta reveal"> <div class="glass-panel cta-box"> <h2 class="text-gradient">Pronto para transformar seu Chat em uma Máquina de Vendas?</h2> <p>Domine o WhatsApp com a infraestrutura mais robusta do mercado. Ative sua IA em menos de 10 minutos.</p> <div class="cta-actions"> <a href="/criar-bot" class="btn-primary-glow">Criar Conta Grátis</a> <a href="/precos" class="btn-outline">Ver Planos Pro</a> </div> </div> </section>  <div id="demo-modal" class="fixed inset-0 hidden z-[9999]" style="background: rgba(0,0,0,0.9); backdrop-filter: blur(8px);"> <div class="modal-wrapper flex items-center justify-center min-h-screen p-4"> <div class="bg-void-black border-2 border-neon-blue rounded-3xl p-8 w-full max-w-2xl shadow-[0_0_50px_rgba(0,247,255,0.3)] relative"> <div class="flex justify-between items-center mb-6"> <div> <h3 class="text-2xl text-cyber-gold font-jetbrains mb-2">Escolha sua Demo IA</h3> <p class="text-gray-300">Veja como o GetNexo funciona em diferentes plataformas</p> </div> <button onclick="fecharModalDemo()" class="text-neon-blue hover:text-white transition-colors p-2" style="font-size: 2.5rem; line-height: 1;">&times;</button> </div> <div class="grid grid-cols-1 md:grid-cols-2 gap-6"> <!-- Chat Completo --> <div class="demo-option bg-matrix-black/50 border border-matrix-green/30 rounded-xl p-6 hover:bg-matrix-green/10 transition-all cursor-pointer" onclick="abrirModalChat()"> <div class="flex items-center space-x-4 mb-4"> <div class="w-12 h-12 bg-matrix-green/20 rounded-full flex items-center justify-center"> <span class="text-2xl">💬</span> </div> <div> <h4 class="text-xl text-matrix-green font-medium">Chat Completo</h4> <p class="text-gray-400 text-sm">IA responde e fala sozinha</p> </div> </div> <div class="space-y-2 text-xs text-gray-400"> <div class="flex items-center"> <span class="text-matrix-green mr-2">✓</span> <span>IA responde automaticamente</span> </div> <div class="flex items-center"> <span class="text-matrix-green mr-2">✓</span> <span>Voz e síntese de fala</span> </div> <div class="flex items-center"> <span class="text-matrix-green mr-2">✓</span> <span>Cards interativos dinâmicos</span> </div> </div> </div> <!-- Demo IA Interativa --> <div class="demo-option bg-matrix-black/50 border border-cyber-gold/30 rounded-xl p-6 hover:bg-cyber-gold/10 transition-all cursor-pointer" onclick="abrirModalIA()"> <div class="flex items-center space-x-4 mb-4"> <div class="w-12 h-12 bg-cyber-gold/20 rounded-full flex items-center justify-center"> <span class="text-2xl">🤖</span> </div> <div> <h4 class="text-xl text-cyber-gold font-medium">Demo IA Interativa</h4> <p class="text-gray-400 text-sm">Busca inteligente + multimídia</p> </div> </div> <div class="space-y-2 text-xs text-gray-400"> <div class="flex items-center"> <span class="text-cyber-gold mr-2">✓</span> <span>Busca inteligente por voz</span> </div> <div class="flex items-center"> <span class="text-cyber-gold mr-2">✓</span> <span>Vídeos, áudios e 360°</span> </div> <div class="flex items-center"> <span class="text-cyber-gold mr-2">✓</span> <span>Catalogo JSON integrado</span> </div> </div> </div> <!-- Demo WhatsApp --> <div class="demo-option bg-matrix-black/50 border border-cyber-gold/30 rounded-xl p-6 hover:bg-cyber-gold/10 transition-all cursor-pointer" onclick="window.open('https://wa.me/5511999999999?text=Oi%2C+quero+ver+a+demo+IA+do+GetNexo', '_blank')"> <div class="flex items-center space-x-4 mb-4"> <div class="w-12 h-12 bg-cyber-gold/20 rounded-full flex items-center justify-center"> <span class="text-2xl">💬</span> </div> <div> <h4 class="text-xl text-cyber-gold font-medium">Demo no WhatsApp</h4> <p class="text-gray-400 text-sm">Experiência real no WhatsApp</p> </div> </div> <div class="space-y-2 text-xs text-gray-400"> <div class="flex items-center"> <span class="text-cyber-gold mr-2">✓</span> <span>API Oficial Meta integrada</span> </div> <div class="flex items-center"> <span class="text-cyber-gold mr-2">✓</span> <span>PIX e pagamentos diretos</span> </div> <div class="flex items-center"> <span class="text-cyber-gold mr-2">✓</span> <span>Automação 24/7 real</span> </div> </div> </div> <!-- Demo Facebook - Em Breve --> <div class="demo-option bg-matrix-black/50 border border-gray-600 rounded-xl p-6 relative cursor-not-allowed"> <div class="absolute top-3 right-3 bg-gray-600 text-white text-xs px-2 py-1 rounded">
Em Breve
</div> <div class="flex items-center space-x-4 mb-4 opacity-60"> <div class="w-12 h-12 bg-gray-600/20 rounded-full flex items-center justify-center"> <span class="text-2xl">📘</span> </div> <div> <h4 class="text-xl text-gray-400 font-medium">Demo no Facebook</h4> <p class="text-gray-500 text-sm">Integração Messenger</p> </div> </div> <div class="space-y-2 text-xs text-gray-500 opacity-60"> <div class="flex items-center"> <span class="text-gray-400 mr-2">⏳</span> <span>Chatbots no Messenger</span> </div> <div class="flex items-center"> <span class="text-gray-400 mr-2">⏳</span> <span>Ads e conversão automática</span> </div> <div class="flex items-center"> <span class="text-gray-400 mr-2">⏳</span> <span>Comentários inteligentes</span> </div> </div> </div> <!-- Demo Instagram - Em Breve --> <div class="demo-option bg-matrix-black/50 border border-gray-600 rounded-xl p-6 relative cursor-not-allowed"> <div class="absolute top-3 right-3 bg-gray-600 text-white text-xs px-2 py-1 rounded">
Em Breve
</div> <div class="flex items-center space-x-4 mb-4 opacity-60"> <div class="w-12 h-12 bg-gray-600/20 rounded-full flex items-center justify-center"> <span class="text-2xl">📸</span> </div> <div> <h4 class="text-xl text-gray-400 font-medium">Demo no Instagram</h4> <p class="text-gray-500 text-sm">Direct e Stories</p> </div> </div> <div class="space-y-2 text-xs text-gray-500 opacity-60"> <div class="flex items-center"> <span class="text-gray-400 mr-2">⏳</span> <span>Respostas no Direct</span> </div> <div class="flex items-center"> <span class="text-gray-400 mr-2">⏳</span> <span>Stories interativos</span> </div> <div class="flex items-center"> <span class="text-gray-400 mr-2">⏳</span> <span>Comentários automáticos</span> </div> </div> </div> </div> <div class="mt-8 pt-6 border-t border-neon-blue/30 text-center"> <p class="text-gray-400 text-sm mb-4">Não sabe qual escolher?</p> <div class="flex flex-col sm:flex-row gap-3 justify-center"> <button onclick="abrirModalChat()" class="bg-matrix-green text-black px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all">
💬 Chat IA Completo
</button> <button onclick="abrirModalIA()" class="bg-cyber-gold text-black px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all">
🤖 Demo Multimídia
</button> </div> </div> </div> </div> <!-- Modal Chat Completo --> <div id="chat-modal" class="fixed inset-0 hidden z-[9999]" style="background: rgba(0,0,0,0.95); backdrop-filter: blur(8px);"> <div class="modal-wrapper flex items-center justify-center min-h-screen p-4"> <div class="bg-void-black border-2 border-neon-blue rounded-3xl p-6 w-full max-w-4xl h-[85vh] flex flex-col shadow-[0_0_50px_rgba(0,247,255,0.3)] relative"> <div class="flex justify-between items-center mb-4"> <div> <h3 class="text-2xl text-cyber-gold font-jetbrains">Demo GetNexo – IA Multimídia</h3> <p class="text-gray-300">IA responde e fala sozinha</p> </div> <button onclick="fecharModalChat()" class="text-neon-blue text-3xl hover:text-white">×</button> </div> <div class="chat-container flex-1 overflow-hidden flex flex-col"> <div class="chat-box flex-1 overflow-y-auto border border-neon-blue rounded p-4 mb-4 space-y-2" id="chat-messages-modal"> <!-- Mensagem inicial --> <div class="flex justify-start"> <div class="bg-neon-blue/20 border border-neon-blue/50 rounded-2xl px-4 py-3 max-w-md"> <p class="text-white text-sm">🚀 <strong>Olá! Bem-vindo ao Chat IA do GetNexo!</strong></p> <p class="text-gray-300 text-xs mt-2">Eu sou um assistente inteligente capaz de:</p> <ul class="text-xs text-neon-blue mt-1 space-y-1"> <li>• 💬 Conversar naturalmente sobre produtos</li> <li>• 🔍 Buscar itens em catálogo JSON</li> <li>• 🛒 Mostrar cards interativos com preços</li> <li>• 🔄 Exibir visualizações 360° dos produtos</li> <li>• 🎤 Responder por voz</li> </ul> <p class="text-cyber-gold text-xs mt-2 font-medium">💡 Teste comigo! Experimente:</p> <div class="flex flex-wrap gap-1 mt-2"> <button onclick="preencherMensagemModal('Quero um tênis branco')" class="bg-matrix-green/20 hover:bg-matrix-green/30 text-matrix-green text-xs px-2 py-1 rounded border border-matrix-green/30">Quero um tênis branco</button> <button onclick="preencherMensagemModal('Tem algum carro preto?')" class="bg-cyber-gold/20 hover:bg-cyber-gold/30 text-cyber-gold text-xs px-2 py-1 rounded border border-cyber-gold/30">Tem carro preto?</button> <button onclick="preencherMensagemModal('Procurando um PC gamer')" class="bg-neon-blue/20 hover:bg-neon-blue/30 text-neon-blue text-xs px-2 py-1 rounded border border-neon-blue/30">PC gamer barato</button> </div> </div> </div> </div> <div class="input-bar flex gap-2"> <input id="chat-input-modal" type="text" placeholder="Pergunte qualquer coisa..." class="flex-1 bg-void-black border border-neon-blue text-white rounded p-2" onkeydown="handleKeyPressModal(event)"> <button onclick="sendMessageModal()" class="bg-cyber-gold text-black px-4 py-2 rounded">Enviar</button> <button onclick="iniciarVozModal()" class="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded">🎤 Voz</button> </div> </div> </div> </div> <!-- Modal Demo IA Interativa --> <div id="ia-modal" class="fixed inset-0 hidden z-[9999]" style="background: rgba(0,0,0,0.95); backdrop-filter: blur(8px);"> <div class="modal-wrapper flex items-center justify-center min-h-screen p-4"> <div class="bg-void-black border-2 border-neon-blue rounded-3xl p-6 w-full max-w-6xl h-[90vh] overflow-hidden flex flex-col shadow-[0_0_50px_rgba(0,247,255,0.3)] relative"> <div class="flex justify-between items-center mb-4"> <div> <h3 class="text-2xl text-cyber-gold font-jetbrains">Demo IA Interativa GetNexo</h3> <p class="text-gray-300">Busca inteligente + multimídia</p> </div> <button onclick="fecharModalIA()" class="text-neon-blue text-3xl hover:text-white">×</button> </div> <div class="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-3 gap-6"> <!-- Chat Interface --> <div class="lg:col-span-2 bg-void-black/90 border border-neon-blue/50 rounded-2xl p-4 flex flex-col h-full"> <div class="flex items-center mb-4"> <div class="w-3 h-3 bg-matrix-green rounded-full mr-3"></div> <h4 class="text-xl text-cyber-gold font-jetbrains">Assistente IA</h4> </div> <div id="ia-chat-messages" class="flex-1 overflow-y-auto mb-4 space-y-4"> <!-- Mensagem inicial --> <div class="flex justify-start"> <div class="bg-neon-blue/20 border border-neon-blue/50 rounded-2xl px-4 py-3 max-w-md"> <p class="text-white text-sm">🚀 <strong>Olá! Bem-vindo à Demo IA do GetNexo!</strong></p> <p class="text-gray-300 text-xs mt-2">Eu sou um assistente inteligente capaz de:</p> <ul class="text-xs text-neon-blue mt-1 space-y-1"> <li>• 💬 Conversar naturalmente sobre produtos</li> <li>• 🔍 Buscar itens em catálogo JSON</li> <li>• 🛒 Mostrar cards interativos com preços</li> <li>• 🔄 Exibir visualizações 360° dos produtos</li> <li>• 🤖 Usar IA para entender suas necessidades</li> </ul> <p class="text-cyber-gold text-xs mt-2 font-medium">💡 Teste comigo! Experimente dizer:</p> <div class="flex flex-wrap gap-1 mt-2"> <button onclick="preencherMensagemIA('apartamento 2 quartos')" class="bg-matrix-green/20 hover:bg-matrix-green/30 text-matrix-green text-xs px-2 py-1 rounded border border-matrix-green/30">Apartamento 2 quartos</button> <button onclick="preencherMensagemIA('PC gamer barato')" class="bg-cyber-gold/20 hover:bg-cyber-gold/30 text-cyber-gold text-xs px-2 py-1 rounded border border-cyber-gold/30">PC Gamer</button> <button onclick="preencherMensagemIA('pizza vegana')" class="bg-neon-blue/20 hover:bg-neon-blue/30 text-neon-blue text-xs px-2 py-1 rounded border border-neon-blue/30">Pizza vegana</button> </div> </div> </div> </div> <div class="border-t border-neon-blue/30 pt-4"> <div class="flex space-x-2"> <input id="ia-chat-input" type="text" placeholder="Digite sua pergunta sobre produtos..." class="flex-1 bg-matrix-black border border-neon-blue/50 rounded-xl px-4 py-3 text-white placeholder-gray-400" onkeydown="handleKeyPressIA(event)"> <button onclick="sendMessageIA()" class="bg-cyber-gold hover:bg-yellow-400 text-black px-6 py-3 rounded-xl font-medium">📤 Enviar</button> <button onclick="iniciarVozIA()" class="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-xl font-medium">🎤 Voz</button> </div> </div> </div> <!-- Product Showcase --> <div class="space-y-4 bg-void-black/90 border border-neon-blue/50 rounded-2xl p-4 overflow-y-auto"> <h4 class="text-lg text-cyber-gold font-jetbrains mb-4">🎯 Produtos em Destaque</h4> <div class="space-y-3"> <div class="border border-matrix-green/30 rounded-lg p-3 bg-matrix-black/50 hover:bg-matrix-green/10 transition-colors cursor-pointer" onclick="mostrarProdutoIA('carro', 0)"> <div class="flex items-center space-x-2"> <span class="text-2xl">🚗</span> <div class="flex-1"> <h5 class="text-cyber-gold text-sm font-medium">Cruze RS Turbo 2026</h5> <p class="text-neon-blue text-xs">Preto • R$ 129.990</p> </div> </div> </div> <div class="border border-cyber-gold/30 rounded-lg p-3 bg-matrix-black/50 hover:bg-cyber-gold/10 transition-colors cursor-pointer" onclick="mostrarProdutoIA('celular', 0)"> <div class="flex items-center space-x-2"> <span class="text-2xl">📱</span> <div class="flex-1"> <h5 class="text-cyber-gold text-sm font-medium">iPhone 15 128GB</h5> <p class="text-neon-blue text-xs">Azul • R$ 4.299</p> </div> </div> </div> <div class="border border-neon-blue/30 rounded-lg p-3 bg-matrix-black/50 hover:bg-neon-blue/10 transition-colors cursor-pointer" onclick="mostrarProdutoIA('computador', 0)"> <div class="flex items-center space-x-2"> <span class="text-2xl">💻</span> <div class="flex-1"> <h5 class="text-cyber-gold text-sm font-medium">PC Warrior i5 12ª</h5> <p class="text-neon-blue text-xs">RTX 3060 • R$ 4.990</p> </div> </div> </div> </div> </div> </div> </div> </div> <!-- Modal para produto IA --> <div id="product-modal-ia" class="fixed inset-0 bg-black/80 hidden z-60 flex items-center justify-center"> <div class="bg-void-black border border-neon-blue rounded-2xl p-6 max-w-md w-full mx-4"> <div class="flex justify-between items-center mb-4"> <h4 class="text-xl text-cyber-gold font-jetbrains">Produto Encontrado</h4> <button onclick="fecharModalProdutoIA()" class="text-neon-blue text-2xl hover:text-white">×</button> </div> <div id="product-content-ia"></div> </div> </div> <script>
  // Funções do modal demo
  window.abrirModalDemo = function() {
    const modal = document.getElementById('demo-modal');
    modal.classList.remove('hidden');
    modal.style.display = 'block';
  };

  window.fecharModalDemo = function() {
    const modal = document.getElementById('demo-modal');
    modal.classList.add('hidden');
    modal.style.display = 'none';
  };

  // Modal Chat Completo
  window.abrirModalChat = function() {
    fecharModalDemo();
    setTimeout(() => {
        document.getElementById('chat-modal').classList.remove('hidden');
        document.getElementById('chat-modal').style.display = 'block';
    }, 100);
  };

  window.fecharModalChat = function() {
    document.getElementById('chat-modal').classList.add('hidden');
    document.getElementById('chat-modal').style.display = 'none';
  };

  // Modal Demo IA
  window.abrirModalIA = function() {
    fecharModalDemo();
    setTimeout(() => {
        document.getElementById('ia-modal').classList.remove('hidden');
        document.getElementById('ia-modal').style.display = 'block';
    }, 100);
  };

  window.fecharModalIA = function() {
    document.getElementById('ia-modal').classList.add('hidden');
    document.getElementById('ia-modal').style.display = 'none';
  };

  // Produto IA
  window.fecharModalProdutoIA = function() {
    document.getElementById('product-modal-ia').classList.add('hidden');
  };

  // Funções Chat Modal
  window.preencherMensagemModal = function(texto) {
    document.getElementById('chat-input-modal').value = texto;
    sendMessageModal();
  };

  window.handleKeyPressModal = function(event) {
    if (event.key === 'Enter') {
      sendMessageModal();
    }
  };

  window.sendMessageModal = function() {
    const input = document.getElementById('chat-input-modal');
    const message = input.value.trim();
    if (!message) return;

    addMessageModal(message, 'user');
    input.value = '';

    setTimeout(() => {
      addMessageModal('🤖 Esta é uma demonstração do Chat IA do GetNexo. Em uma implementação real, a IA responderia automaticamente com informações sobre produtos do catálogo.', 'bot');
    }, 1000);
  };

  window.iniciarVozModal = function() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Seu navegador não suporta reconhecimento de voz.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    const btn = event.currentTarget;
    const originalText = btn.innerHTML;

    recognition.onstart = () => {
      btn.innerHTML = 'Ouvindo...';
      btn.classList.add('bg-red-600');
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      document.getElementById('chat-input-modal').value = transcript;
      window.sendMessageModal();
    };

    recognition.onend = () => {
      btn.innerHTML = originalText;
      btn.classList.remove('bg-red-600');
    };

    recognition.start();
  };

  function addMessageModal(text, sender) {
    const messagesDiv = document.getElementById('chat-messages-modal');
    const messageDiv = document.createElement('div');
    messageDiv.className = \\\`flex \\\${sender === 'user' ? 'justify-end' : 'justify-start'}\\\`;

    const bubbleClass = sender === 'user'
      ? 'bg-cyber-gold text-black'
      : 'bg-neon-blue/20 border border-neon-blue/50 text-white';

    messageDiv.innerHTML = \\\`
      <div class="\\\${bubbleClass} rounded-2xl px-4 py-3 max-w-xs">
        <p class="text-sm whitespace-pre-line">\\\${text}</p>
      </div>
    \\\`;

    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  // Funções IA Modal
  window.preencherMensagemIA = function(texto) {
    document.getElementById('ia-chat-input').value = texto;
    sendMessageIA();
  };

  window.handleKeyPressIA = function(event) {
    if (event.key === 'Enter') {
      sendMessageIA();
    }
  };

  window.sendMessageIA = function() {
    const input = document.getElementById('ia-chat-input');
    const message = input.value.trim();
    if (!message) return;

    addMessageIA(message, 'user');
    input.value = '';

    setTimeout(() => {
      addMessageIA('🤖 Demo IA: Buscando produtos... Encontrei resultados relevantes!', 'bot');
      setTimeout(() => {
        mostrarProdutoIA('computador', 0);
      }, 1000);
    }, 1500);
  };

  window.iniciarVozIA = function() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Seu navegador não suporta reconhecimento de voz.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    const btn = event.currentTarget;
    const originalText = btn.innerHTML;

    recognition.onstart = () => {
      btn.innerHTML = 'Ouvindo...';
      btn.classList.add('bg-red-600');
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      document.getElementById('ia-chat-input').value = transcript;
      window.sendMessageIA();
    };

    recognition.onend = () => {
      btn.innerHTML = originalText;
      btn.classList.remove('bg-red-600');
    };

    recognition.start();
  };

  function addMessageIA(text, sender) {
    const messagesDiv = document.getElementById('ia-chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = \\\`flex \\\${sender === 'user' ? 'justify-end' : 'justify-start'}\\\`;

    const bubbleClass = sender === 'user'
      ? 'bg-cyber-gold text-black'
      : 'bg-neon-blue/20 border border-neon-blue/50 text-white';

    messageDiv.innerHTML = \\\`
      <div class="\\\${bubbleClass} rounded-2xl px-4 py-3 max-w-md">
        <p class="text-sm whitespace-pre-line">\\\${text}</p>
      </div>
    \\\`;

    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  window.mostrarProdutoIA = function(categoria, index) {
    const produtos = {
      carro: { nome: 'Cruze RS Turbo 2026', cor: 'Preto', preco: 129990, imagem: '/images/cruze.jpg' },
      celular: { nome: 'iPhone 15 128GB', cor: 'Azul', preco: 4299, imagem: '/images/iphone.jpg' },
      computador: { nome: 'PC Warrior i5 12ª', cpu: 'i5-12400F', ram: '16GB', preco: 4990, imagem: '/images/pc.jpg' }
    };

    const produto = produtos[categoria];

    const content = \\\`
      <img src="\\\${produto.imagem}" alt="\\\${produto.nome}" class="w-full h-48 object-cover rounded-lg mb-4" onerror="this.src='/logo.svg'" />
      <h4 class="text-xl text-cyber-gold font-jetbrains mb-2">\\\${produto.nome}</h4>
      <div class="text-sm text-gray-300 mb-4">
        \\\${produto.cor ? \\\`<p>Cor: \\\${produto.cor}</p>\\\` : ''}
        \\\${produto.cpu ? \\\`<p>CPU: \\\${produto.cpu}</p>\\\` : ''}
        \\\${produto.ram ? \\\`<p>RAM: \\\${produto.ram}</p>\\\` : ''}
      </div>
      <p class="text-2xl text-matrix-green font-bold mb-4">R$ \\\${produto.preco.toLocaleString('pt-BR')}</p>
      <div class="flex space-x-2">
        <button onclick="alert('Produto adicionado ao carrinho!')" class="bg-cyber-gold hover:bg-yellow-400 text-black px-4 py-2 rounded font-medium">Comprar Agora</button>
      </div>
    \\\`;

    document.getElementById('product-content-ia').innerHTML = content;
    document.getElementById('product-modal-ia').classList.remove('hidden');
  };

  // Fechar modal ao clicar fora
  document.addEventListener('click', function(event) {
    const demoModal = document.getElementById('demo-modal');
    const chatModal = document.getElementById('chat-modal');
    const iaModal = document.getElementById('ia-modal');
    const productModal = document.getElementById('product-modal-ia');

    if (event.target === demoModal) fecharModalDemo();
    if (event.target === chatModal) fecharModalChat();
    if (event.target === iaModal) fecharModalIA();
    if (event.target === productModal) fecharModalProdutoIA();
  });

  // Fechar modal com ESC
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      fecharModalDemo();
      fecharModalChat();
      fecharModalIA();
      fecharModalProdutoIA();
    }
  });
<\/script> <script src="/scripts/performance/home-animations.js" defer><\/script> </div> </div></div>`])), unescapeHTML(JSON.stringify(homeSchema)), maybeRenderHead(), unescapeHTML(t.hero.title.replace("Vende Sozinha", '<span class="text-gradient">Vende Sozinha</span>')), t.hero.subtitle, addAttribute(`/${lang}/criar-bot`, "href"), t.hero.cta_primary, t.hero.cta_secondary) })}`;
}, "/home/lele/usenexo/getnexo-site/src/pages/es/index.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/es/index.astro";
const $$url = "/es";
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
