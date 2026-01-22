import { f as createComponent, r as renderTemplate, k as renderComponent, m as maybeRenderHead } from "../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$Layout } from "../assets/Layout-DScI-qCd.js";
import { $ as $$SEO } from "../assets/SEO-BsJBILP8.js";
/* empty css                              */
import { renderers } from "../renderers.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Faq = createComponent(($$result, $$props, $$slots) => {
  const title = "FAQ GetNexo - Perguntas Frequentes Sobre IA para WhatsApp | Suporte Completo";
  const description = "FAQ completo GetNexo: tire todas suas dúvidas sobre IA para vendas WhatsApp, chatbots inteligentes, automação, PIX, CRM, fidelidade e muito mais. Suporte técnico detalhado.";
  const keywords = "faq getnexo, perguntas frequentes whatsapp ia, suporte getnexo, duvidas whatsapp business, ajuda getnexo, tutorial getnexo, guia getnexo";
  const faqData = [
    {
      question: "O que é o GetNexo?",
      answer: "GetNexo é uma plataforma completa de IA para automação de vendas e atendimento no WhatsApp. Combinamos chatbot inteligente, PIX automático, CRM integrado, sistema de fidelidade e analytics avançados para transformar conversas em vendas 24/7."
    },
    {
      question: "Como funciona a IA do GetNexo?",
      answer: "Nossa IA utiliza processamento de linguagem natural avançado (GPT-4 integrado) para entender contexto completo das conversas. Ela aprende com seu catálogo, histórico de vendas e preferências dos clientes para oferecer respostas personalizadas e sugestões inteligentes."
    },
    {
      question: "O GetNexo funciona com API Oficial do WhatsApp?",
      answer: "Sim! Somos 100% compatíveis com a API Oficial do WhatsApp Business via Evolution API. Zero risco de banimento, conformidade total com as políticas da Meta e máxima segurança."
    },
    {
      question: "Quanto custa usar o GetNexo?",
      answer: "O plano básico é 100% GRÁTIS! Você só paga uma pequena taxa por transação realizada (a partir de R$ 0,50 por venda). Sem mensalidades fixas, sem contratos longos. Pague apenas pelo que vende."
    },
    {
      question: "Quanto tempo leva para configurar?",
      answer: "Setup completo em até 12 minutos! Nossa plataforma é auto-hospedada via Docker. Você instala em seu próprio servidor, conecta o WhatsApp e começa a vender automaticamente."
    },
    {
      question: "Quais integrações estão disponíveis?",
      answer: "Integramos com todas as principais plataformas: Shopify, WooCommerce, VTEX, Bling, Tiny, PagSeguro, Mercado Pago, Correios, Melhor Envio, e muito mais. API REST completa para integrações customizadas."
    },
    {
      question: "Como funciona o sistema de fidelidade?",
      answer: "Programa VIP automático: clientes acumulam pontos por compras, indicações e engajamento. 4 tiers (Bronze, Prata, Ouro, Diamante) com benefícios progressivos. Tudo acontece automaticamente no WhatsApp."
    },
    {
      question: "O PIX funciona mesmo?",
      answer: "Sim! PIX nativo e automático. O bot gera QR Code ou código copia e cola instantaneamente. Confirma pagamentos em tempo real e atualiza status automaticamente. Integração direta com gateways certificados."
    },
    {
      question: "Como funciona o Magic Replies?",
      answer: "Magic Replies é nossa IA conversacional exclusiva. Entende contexto completo, gera respostas personalizadas, aprende com cada interação e potencializa suas vendas automaticamente. 95% de precisão em respostas humanizadas."
    },
    {
      question: "Tem sistema de tickets integrado?",
      answer: "Sim! Sistema completo de gestão de suporte: categorização automática por IA, regras de escalonamento inteligente, histórico unificado, analytics de satisfação e integração total com seu CRM."
    },
    {
      question: "E se o cliente quiser falar com uma pessoa?",
      answer: "Detecção automática! Quando a IA identifica que o cliente precisa de atendimento humano, transfere instantaneamente com contexto completo. Zero perda de vendas por demora."
    },
    {
      question: "Como funciona a análise de sentimento?",
      answer: "IA detecta 7 emoções em tempo real: satisfação, frustração, urgência, raiva, alegria, preocupação e neutralidade. 92% de precisão. Escala automaticamente atendimentos críticos e gera relatórios NPS."
    },
    {
      question: "Posso white-label o GetNexo?",
      answer: "Sim! White-label completo disponível. Seu próprio domínio, branding personalizado, cores da sua marca, logo nos chats. Seus clientes jamais saberão que é GetNexo por trás."
    },
    {
      question: "Como funciona a gamificação de vendas?",
      answer: "Programa VIP com missões diárias, conquistas, badges e recompensas. Vendedores ganham pontos por performance, desbloqueiam benefícios e competem em leaderboards. Aumenta produtividade em até 340%."
    },
    {
      question: "Posso integrar com meu ERP atual?",
      answer: "Sim! API REST completa permite integração com qualquer ERP. Sincronização automática de produtos, pedidos, clientes e inventário. Webhooks bidirecionais para atualização em tempo real."
    },
    {
      question: "Como funciona o analytics avançado?",
      answer: "Dashboard completo com +40 métricas: conversão por canal, tempo de resposta, satisfação por categoria, ROI de marketing, lifetime value, cohort analysis e predição de vendas por IA."
    },
    {
      question: "É seguro usar GetNexo?",
      answer: "Segurança enterprise: criptografia end-to-end, zero-trust architecture, Cloudflare Tunnel (sem portas abertas), backups automáticos, monitoramento 24h e conformidade LGPD/GDPR total."
    },
    {
      question: "Funciona com WhatsApp Business?",
      answer: "Sim! Compatível com WhatsApp Business API oficial. Suporte a múltiplas contas, números ilimitados, broadcast inteligente e mensuração precisa de campanhas."
    },
    {
      question: "Como funciona o suporte técnico?",
      answer: "Suporte completo: documentação técnica detalhada, comunidade no Discord, chat de suporte 24h, consultoria de implantação enterprise e SLA garantido para planos superiores."
    },
    {
      question: "Posso testar antes de comprar?",
      answer: "Sim! Teste gratuito completo por 14 dias. Todas as funcionalidades disponíveis, sem limitações. Migração automática para plano pago quando estiver pronto."
    },
    {
      question: "Funciona com outras plataformas além do WhatsApp?",
      answer: "Atualmente focado no WhatsApp, mas API permite integração com qualquer canal: Facebook Messenger, Instagram Direct, Telegram, SMS e muito mais através de webhooks."
    },
    {
      question: "Como funciona o PWA offline?",
      answer: "Progressive Web App completo. Funciona offline, envia notificações push, pode ser instalado como app nativo no celular. Seus clientes têm acesso 24/7 mesmo sem internet."
    },
    {
      question: "Posso personalizar as respostas da IA?",
      answer: "Totalmente! Interface visual para treinar respostas específicas do seu negócio. Configure tom de voz, políticas de desconto, argumentos de venda e tratamentos especiais por segmento."
    },
    {
      question: "Como funciona a recuperação de carrinho abandonado?",
      answer: "IA identifica carrinhos abandonados automaticamente. Envia lembretes personalizados via WhatsApp com cupons de desconto. Taxa de recuperação de até 25% dos abandonos."
    },
    {
      question: "Tem garantia de funcionamento?",
      answer: "Uptime garantido de 99.9%. SLA de resposta em até 2 horas para críticos. Monitoramento 24h e auto-healing automático. Se cair, volta automaticamente sem intervenção."
    },
    {
      question: "Funciona com múltiplos números de WhatsApp?",
      answer: "Sim! Suporte a números ilimitados. Cada número pode ter configuração independente: diferentes catálogos, preços, regras de negócio e personas de IA."
    },
    {
      question: "Como funciona a API REST?",
      answer: "API completa com autenticação JWT. Mais de 50 endpoints para mensagens, pedidos, clientes, analytics, webhooks e integrações. Documentação OpenAPI completa disponível."
    },
    {
      question: "Posso ver relatórios em tempo real?",
      answer: "Sim! Dashboard em tempo real mostra: conversas ativas, vendas do dia, satisfação dos clientes, performance da IA, mensagens processadas e muito mais. Tudo atualizado instantaneamente."
    },
    {
      question: "Como funciona com vendas B2B?",
      answer: "Otimização completa para B2B: histórico de negociações, lembretes automáticos de follow-up, contratos digitais, aprovação de pedidos por gestores e integração com CRMs corporativos."
    },
    {
      question: "Funciona com vendas B2C?",
      answer: "Perfeito para B2C! Catálogo interativo, sugestões baseadas em comportamento, programa de indicações viral, recuperação de carrinho e personalização extrema por cliente."
    },
    {
      question: "Como funciona no mobile?",
      answer: "PWA responsiva completa. Funciona perfeitamente em qualquer dispositivo. Pode ser instalado como app nativo. Interface otimizada para toque e navegação mobile-first."
    },
    {
      question: "Tem limite de mensagens por mês?",
      answer: "Não! Apenas taxa por transação realizada. Quantas mensagens precisar enviar, mande. Nossa IA é otimizada para conversão, não para volume. Você paga apenas pelas vendas fechadas."
    },
    {
      question: "Posso cancelar a qualquer momento?",
      answer: "Sim! Sem contratos longos, sem fidelidade forçada. Cancele quando quiser, seus dados ficam disponíveis para exportação por 30 dias. Sem pegadinhas."
    },
    {
      question: "Como funciona a migração de dados?",
      answer: "Ferramentas automáticas de migração para: histórico de clientes, produtos, pedidos, configurações de IA e dados de CRM. Migração segura e validada antes da ativação."
    },
    {
      question: "Tem treinamento para minha equipe?",
      answer: "Sim! Treinamento completo incluído: vídeos tutoriais, documentação técnica, sessão de onboarding personalizada e suporte dedicado durante os primeiros 30 dias."
    },
    {
      question: "Funciona com vendas internacionais?",
      answer: "Sim! Suporte multilíngue automático, conversão de moedas, compliance internacional e integração com gateways globais. Venda para qualquer país diretamente pelo WhatsApp."
    },
    {
      question: "Como funciona com compliance e LGPD?",
      answer: "Conformidade 100% LGPD: dados criptografados, consentimento automático, auditoria completa, relatórios de conformidade e controles de privacidade rigorosos."
    },
    {
      question: "Posso ver casos de sucesso?",
      answer: "Sim! Portfolio completo com +50 cases reais: videos, métricas antes/depois, depoimentos de clientes e estudos detalhados. Todos os cases são verificáveis e auditáveis."
    },
    {
      question: "Como funciona o backup automático?",
      answer: "Backup diário automático com geo-redundância. Snapshots point-in-time, restauração em 1-clique, teste automático de integridade. Seus dados sempre seguros."
    },
    {
      question: "Tem limite de usuários ou clientes?",
      answer: "Não! Escala automaticamente. De 1 cliente para milhões. Nossa arquitetura cloud-native cresce com seu negócio sem nenhum limite artificial."
    },
    {
      question: "Como funciona com vendas sazonais?",
      answer: "IA aprende padrões sazonais automaticamente. Ajusta preços, estoque e comunicações baseado em sazonalidade. Otimização automática para Black Friday, Natal, etc."
    },
    {
      question: "Posso integrar com Google Analytics?",
      answer: "Sim! Integração nativa com Google Analytics 4, Facebook Pixel, Hotjar e todas as principais ferramentas de analytics. Eventos customizados e conversões rastreadas automaticamente."
    },
    {
      question: "Como funciona com vendas por catálogo?",
      answer: "Catálogo inteligente: produtos organizados automaticamente, busca por voz/texto, visualização 360°, comparação de produtos, sistema de favoritos e carrinho persistente."
    },
    {
      question: "Funciona com vendas por assinatura?",
      answer: "Perfeito! Gestão completa de assinaturas: cobrança automática, lembretes de renovação, upgrade/downgrade automático, analytics de retenção e cobrança por PIX recorrente."
    },
    {
      question: "Como funciona com marketplaces?",
      answer: "Integração completa com marketplaces: sincronização de produtos, pedidos e estoque bidirecional, resolução automática de disputas, analytics por plataforma e gestão unificada."
    },
    {
      question: "Tem suporte para vendas B2B2C?",
      answer: "Sim! Modelo híbrido perfeito: interface B2B para revendedores com preços especiais, e interface B2C para consumidores finais. Tudo unificado em uma única plataforma."
    }
  ];
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "FAQ", url: "/faq" }
  ];
  return renderTemplate(_a || (_a = __template(["", " ", "  <script>\n  // FAQ Search and Filter Functionality\n  function buscarFaq() {\n    const searchTerm = document.getElementById('faq-search').value.toLowerCase();\n    const faqItems = document.querySelectorAll('.faq-item');\n\n    faqItems.forEach(item => {\n      const question = item.querySelector('summary').textContent.toLowerCase();\n      const answer = item.querySelector('.faq-answer').textContent.toLowerCase();\n\n      if (question.includes(searchTerm) || answer.includes(searchTerm)) {\n        item.style.display = 'block';\n        // Expand if it's a direct match\n        if (question.includes(searchTerm)) {\n          item.setAttribute('open', 'true');\n        }\n      } else {\n        item.style.display = 'none';\n        item.removeAttribute('open');\n      }\n    });\n  }\n\n  function filtrarPorTag(tag) {\n    document.getElementById('faq-search').value = tag;\n    buscarFaq();\n  }\n\n  function mostrarCategoria(categoria) {\n    const faqItems = document.querySelectorAll('.faq-item');\n    const categoryBtns = document.querySelectorAll('.category-btn');\n\n    // Update button states\n    categoryBtns.forEach(btn => btn.classList.remove('active'));\n    event.target.classList.add('active');\n\n    // Filter items\n    faqItems.forEach(item => {\n      if (categoria === 'todos' || item.dataset.category === categoria) {\n        item.style.display = 'block';\n      } else {\n        item.style.display = 'none';\n        item.removeAttribute('open');\n      }\n    });\n  }\n\n  // Search on Enter key\n  document.getElementById('faq-search').addEventListener('keypress', function(e) {\n    if (e.key === 'Enter') {\n      buscarFaq();\n    }\n  });\n\n  // Highlight search terms in results\n  function highlightSearchTerm(text, term) {\n    if (!term) return text;\n    const regex = new RegExp(`(${term})`, 'gi');\n    return text.replace(regex, '<mark>$1</mark>');\n  }\n<\/script>"], ["", " ", "  <script>\n  // FAQ Search and Filter Functionality\n  function buscarFaq() {\n    const searchTerm = document.getElementById('faq-search').value.toLowerCase();\n    const faqItems = document.querySelectorAll('.faq-item');\n\n    faqItems.forEach(item => {\n      const question = item.querySelector('summary').textContent.toLowerCase();\n      const answer = item.querySelector('.faq-answer').textContent.toLowerCase();\n\n      if (question.includes(searchTerm) || answer.includes(searchTerm)) {\n        item.style.display = 'block';\n        // Expand if it's a direct match\n        if (question.includes(searchTerm)) {\n          item.setAttribute('open', 'true');\n        }\n      } else {\n        item.style.display = 'none';\n        item.removeAttribute('open');\n      }\n    });\n  }\n\n  function filtrarPorTag(tag) {\n    document.getElementById('faq-search').value = tag;\n    buscarFaq();\n  }\n\n  function mostrarCategoria(categoria) {\n    const faqItems = document.querySelectorAll('.faq-item');\n    const categoryBtns = document.querySelectorAll('.category-btn');\n\n    // Update button states\n    categoryBtns.forEach(btn => btn.classList.remove('active'));\n    event.target.classList.add('active');\n\n    // Filter items\n    faqItems.forEach(item => {\n      if (categoria === 'todos' || item.dataset.category === categoria) {\n        item.style.display = 'block';\n      } else {\n        item.style.display = 'none';\n        item.removeAttribute('open');\n      }\n    });\n  }\n\n  // Search on Enter key\n  document.getElementById('faq-search').addEventListener('keypress', function(e) {\n    if (e.key === 'Enter') {\n      buscarFaq();\n    }\n  });\n\n  // Highlight search terms in results\n  function highlightSearchTerm(text, term) {\n    if (!term) return text;\n    const regex = new RegExp(\\`(\\${term})\\`, 'gi');\n    return text.replace(regex, '<mark>$1</mark>');\n  }\n<\/script>"])), renderComponent($$result, "SEO", $$SEO, { "title": title, "description": description, "keywords": keywords, "url": "/faq", "breadcrumbs": breadcrumbs, "faq": faqData, "data-astro-cid-6kmwghhu": true }), renderComponent($$result, "Layout", $$Layout, { "title": title, "description": description, "keywords": keywords, "data-astro-cid-6kmwghhu": true }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<section class="hero-section" data-astro-cid-6kmwghhu> <div class="hero-content" data-astro-cid-6kmwghhu> <div class="hero-badge" data-astro-cid-6kmwghhu>❓ FAQ GetNexo</div> <h1 data-astro-cid-6kmwghhu>Perguntas Frequentes</h1> <p data-astro-cid-6kmwghhu>Respostas completas e detalhadas sobre todas as funcionalidades do GetNexo. Se sua dúvida não está aqui, fale conosco!</p> <div class="hero-features" data-astro-cid-6kmwghhu> <span data-astro-cid-6kmwghhu>✅ 40+ perguntas respondidas</span> <span data-astro-cid-6kmwghhu>✅ Respostas técnicas detalhadas</span> <span data-astro-cid-6kmwghhu>✅ Atualização constante</span> </div> <div class="hero-ctas" data-astro-cid-6kmwghhu> <a href="/criar-bot" class="btn-primary" data-astro-cid-6kmwghhu>Testar Grátis</a> <button onclick="buscarFaq()" class="btn-secondary" data-astro-cid-6kmwghhu>Buscar FAQ</button> </div> </div> <div class="hero-visual" data-astro-cid-6kmwghhu> <div class="faq-stats" data-astro-cid-6kmwghhu> <div class="stat-item" data-astro-cid-6kmwghhu> <div class="stat-number" data-astro-cid-6kmwghhu>98%</div> <div class="stat-label" data-astro-cid-6kmwghhu>Dúvidas Resolvidas</div> </div> <div class="stat-item" data-astro-cid-6kmwghhu> <div class="stat-number" data-astro-cid-6kmwghhu>24h</div> <div class="stat-label" data-astro-cid-6kmwghhu>Suporte Médio</div> </div> <div class="stat-item" data-astro-cid-6kmwghhu> <div class="stat-number" data-astro-cid-6kmwghhu>50+</div> <div class="stat-label" data-astro-cid-6kmwghhu>Perguntas Técnicas</div> </div> </div> </div> </section>  <section class="search-section" data-astro-cid-6kmwghhu> <div class="section-header" data-astro-cid-6kmwghhu> <h2 data-astro-cid-6kmwghhu>Buscar Respostas</h2> <p data-astro-cid-6kmwghhu>Encontre rapidamente a resposta que você precisa</p> </div> <div class="search-container" data-astro-cid-6kmwghhu> <input type="text" id="faq-search" placeholder="Digite sua pergunta..." class="search-input" data-astro-cid-6kmwghhu> <button onclick="buscarFaq()" class="search-btn" data-astro-cid-6kmwghhu>🔍 Buscar</button> </div> <div class="search-tags" data-astro-cid-6kmwghhu> <span class="tag" onclick="filtrarPorTag('precos')" data-astro-cid-6kmwghhu>Preços</span> <span class="tag" onclick="filtrarPorTag('integracao')" data-astro-cid-6kmwghhu>Integrações</span> <span class="tag" onclick="filtrarPorTag('seguranca')" data-astro-cid-6kmwghhu>Segurança</span> <span class="tag" onclick="filtrarPorTag('ia')" data-astro-cid-6kmwghhu>IA & Automação</span> <span class="tag" onclick="filtrarPorTag('whatsapp')" data-astro-cid-6kmwghhu>WhatsApp</span> <span class="tag" onclick="filtrarPorTag('suporte')" data-astro-cid-6kmwghhu>Suporte</span> </div> </section>  <section class="faq-categories" data-astro-cid-6kmwghhu> <div class="categories-nav" data-astro-cid-6kmwghhu> <button class="category-btn active" onclick="mostrarCategoria('todos')" data-astro-cid-6kmwghhu>Todas</button> <button class="category-btn" onclick="mostrarCategoria('basico')" data-astro-cid-6kmwghhu>Básico</button> <button class="category-btn" onclick="mostrarCategoria('avancado')" data-astro-cid-6kmwghhu>Avançado</button> <button class="category-btn" onclick="mostrarCategoria('integracao')" data-astro-cid-6kmwghhu>Integrações</button> <button class="category-btn" onclick="mostrarCategoria('seguranca')" data-astro-cid-6kmwghhu>Segurança</button> <button class="category-btn" onclick="mostrarCategoria('suporte')" data-astro-cid-6kmwghhu>Suporte</button> </div> </section>  <section class="faq-main" data-astro-cid-6kmwghhu> <div class="faq-container" id="faq-container" data-astro-cid-6kmwghhu> <details class="faq-item" data-category="basico" data-tags="precos" data-astro-cid-6kmwghhu> <summary data-astro-cid-6kmwghhu>O que é o GetNexo?</summary> <div class="faq-answer" data-astro-cid-6kmwghhu> <p data-astro-cid-6kmwghhu>GetNexo é uma plataforma completa de IA para automação de vendas e atendimento no WhatsApp. Combinamos:</p> <ul data-astro-cid-6kmwghhu> <li data-astro-cid-6kmwghhu>🤖 Chatbot IA conversacional inteligente</li> <li data-astro-cid-6kmwghhu>💰 PIX automático com confirmação instantânea</li> <li data-astro-cid-6kmwghhu>🎫 Sistema de tickets com categorização automática</li> <li data-astro-cid-6kmwghhu>🏆 Programa de fidelidade com gamificação</li> <li data-astro-cid-6kmwghhu>📊 Analytics avançado em tempo real</li> <li data-astro-cid-6kmwghhu>🔒 Segurança enterprise com zero-trust</li> </ul> <p data-astro-cid-6kmwghhu>Transformamos conversas simples em vendas complexas 24 horas por dia.</p> </div> </details> <details class="faq-item" data-category="basico" data-tags="precos" data-astro-cid-6kmwghhu> <summary data-astro-cid-6kmwghhu>Quanto custa usar o GetNexo?</summary> <div class="faq-answer" data-astro-cid-6kmwghhu> <p data-astro-cid-6kmwghhu><strong data-astro-cid-6kmwghhu>Plano Gratuito (100% gratuito):</strong></p> <ul data-astro-cid-6kmwghhu> <li data-astro-cid-6kmwghhu>Magic Replies ilimitado</li> <li data-astro-cid-6kmwghhu>Análise de sentimento básica</li> <li data-astro-cid-6kmwghhu>Até 1.000 conversas/mês</li> <li data-astro-cid-6kmwghhu>Dashboard básico</li> <li data-astro-cid-6kmwghhu>Suporte por chat</li> </ul> <p data-astro-cid-6kmwghhu><strong data-astro-cid-6kmwghhu>Plano Business (R$ 197/mês):</strong></p> <ul data-astro-cid-6kmwghhu> <li data-astro-cid-6kmwghhu>Tudo do gratuito</li> <li data-astro-cid-6kmwghhu>Conversas ilimitadas</li> <li data-astro-cid-6kmwghhu>Programa de pontos completo</li> <li data-astro-cid-6kmwghhu>Analytics avançado</li> <li data-astro-cid-6kmwghhu>A/B testing automático</li> <li data-astro-cid-6kmwghhu>Suporte prioritário</li> </ul> <p data-astro-cid-6kmwghhu><strong data-astro-cid-6kmwghhu>Sem mensalidades fixas!</strong> Você paga apenas uma taxa pequena por venda realizada (a partir de R$ 0,50).</p> </div> </details> <details class="faq-item" data-category="basico" data-tags="whatsapp" data-astro-cid-6kmwghhu> <summary data-astro-cid-6kmwghhu>O GetNexo funciona com API Oficial do WhatsApp?</summary> <div class="faq-answer" data-astro-cid-6kmwghhu> <p data-astro-cid-6kmwghhu><strong data-astro-cid-6kmwghhu>SIM!</strong> Somos 100% compatíveis com a API Oficial do WhatsApp Business via Evolution API.</p> <p data-astro-cid-6kmwghhu><strong data-astro-cid-6kmwghhu>Vantagens da API Oficial:</strong></p> <ul data-astro-cid-6kmwghhu> <li data-astro-cid-6kmwghhu>✅ Zero risco de banimento</li> <li data-astro-cid-6kmwghhu>✅ Conformidade total com Meta</li> <li data-astro-cid-6kmwghhu>✅ Mensuração precisa de campanhas</li> <li data-astro-cid-6kmwghhu>✅ Suporte a múltiplos números</li> <li data-astro-cid-6kmwghhu>✅ Broadcast inteligente</li> <li data-astro-cid-6kmwghhu>✅ Templates de mensagem aprovados</li> </ul> <p data-astro-cid-6kmwghhu>Não usamos soluções não-oficiais que podem ser bloqueadas a qualquer momento.</p> </div> </details> <details class="faq-item" data-category="basico" data-tags="integracao" data-astro-cid-6kmwghhu> <summary data-astro-cid-6kmwghhu>Quanto tempo leva para configurar?</summary> <div class="faq-answer" data-astro-cid-6kmwghhu> <p data-astro-cid-6kmwghhu><strong data-astro-cid-6kmwghhu>Setup completo em 12 minutos!</strong></p> <p data-astro-cid-6kmwghhu><strong data-astro-cid-6kmwghhu>Passo a passo:</strong></p> <ol data-astro-cid-6kmwghhu> <li data-astro-cid-6kmwghhu><strong data-astro-cid-6kmwghhu>1-3 min:</strong> Git clone do repositório</li> <li data-astro-cid-6kmwghhu><strong data-astro-cid-6kmwghhu>2-4 min:</strong> Docker compose up</li> <li data-astro-cid-6kmwghhu><strong data-astro-cid-6kmwghhu>3-5 min:</strong> Configuração do domínio no Cloudflare</li> <li data-astro-cid-6kmwghhu><strong data-astro-cid-6kmwghhu>2-3 min:</strong> Conexão WhatsApp Business API</li> <li data-astro-cid-6kmwghhu><strong data-astro-cid-6kmwghhu>1-2 min:</strong> Upload do catálogo de produtos</li> </ol> <p data-astro-cid-6kmwghhu>Pronto! Sua IA já está vendendo automaticamente.</p> </div> </details> <details class="faq-item" data-category="avancado" data-tags="ia" data-astro-cid-6kmwghhu> <summary data-astro-cid-6kmwghhu>Como funciona a IA do GetNexo?</summary> <div class="faq-answer" data-astro-cid-6kmwghhu> <p data-astro-cid-6kmwghhu>Nossa IA combina múltiplas tecnologias de ponta:</p> <ul data-astro-cid-6kmwghhu> <li data-astro-cid-6kmwghhu><strong data-astro-cid-6kmwghhu>GPT-4 Integrado:</strong> Processamento de linguagem natural avançado</li> <li data-astro-cid-6kmwghhu><strong data-astro-cid-6kmwghhu>Memória Conversacional:</strong> Lembra todas as interações anteriores</li> <li data-astro-cid-6kmwghhu><strong data-astro-cid-6kmwghhu>Análise de Sentimento:</strong> Detecta 7 emoções em tempo real</li> <li data-astro-cid-6kmwghhu><strong data-astro-cid-6kmwghhu>Aprendizado Contínuo:</strong> Melhora automaticamente com cada resposta</li> <li data-astro-cid-6kmwghhu><strong data-astro-cid-6kmwghhu>Modelo Treinado:</strong> Especificamente para português brasileiro e vendas</li> </ul> <p data-astro-cid-6kmwghhu><strong data-astro-cid-6kmwghhu>Precisão comprovada:</strong> 95% em respostas humanizadas, 92% em detecção emocional.</p> </div> </details> <details class="faq-item" data-category="basico" data-tags="integracao" data-astro-cid-6kmwghhu> <summary data-astro-cid-6kmwghhu>Quais integrações estão disponíveis?</summary> <div class="faq-answer" data-astro-cid-6kmwghhu> <p data-astro-cid-6kmwghhu><strong data-astro-cid-6kmwghhu>E-commerce:</strong> Shopify, WooCommerce, VTEX, Nuvemshop, Bling, Tiny, Tray</p> <p data-astro-cid-6kmwghhu><strong data-astro-cid-6kmwghhu>Pagamentos:</strong> PagSeguro, Mercado Pago, PayPal, Stripe, Cielo, PIX automático</p> <p data-astro-cid-6kmwghhu><strong data-astro-cid-6kmwghhu>Logística:</strong> Correios, Melhor Envio, Frenet, Jadlog, DHL, UPS</p> <p data-astro-cid-6kmwghhu><strong data-astro-cid-6kmwghhu>Automação:</strong> Zapier, Make.com, N8N, Webhooks REST</p> <p data-astro-cid-6kmwghhu><strong data-astro-cid-6kmwghhu>Analytics:</strong> Google Analytics, Facebook Pixel, Hotjar</p> <p data-astro-cid-6kmwghhu><strong data-astro-cid-6kmwghhu>CRM:</strong> Pipedrive, HubSpot, RD Station, ActiveCampaign</p> <p data-astro-cid-6kmwghhu><strong data-astro-cid-6kmwghhu>API Completa:</strong> Mais de 50 endpoints REST para integrações customizadas</p> </div> </details> <details class="faq-item" data-category="avancado" data-tags="seguranca" data-astro-cid-6kmwghhu> <summary data-astro-cid-6kmwghhu>É seguro usar GetNexo?</summary> <div class="faq-answer" data-astro-cid-6kmwghhu> <p data-astro-cid-6kmwghhu><strong data-astro-cid-6kmwghhu>Segurança Enterprise completa:</strong></p> <ul data-astro-cid-6kmwghhu> <li data-astro-cid-6kmwghhu>🔐 Criptografia end-to-end AES-256</li> <li data-astro-cid-6kmwghhu>🛡️ Zero-trust architecture</li> <li data-astro-cid-6kmwghhu>🌐 Cloudflare Tunnel (sem portas abertas)</li> <li data-astro-cid-6kmwghhu>💾 Backup automático geo-redundante</li> <li data-astro-cid-6kmwghhu>📊 Monitoramento SIEM 24h</li> <li data-astro-cid-6kmwghhu>⚖️ Conformidade LGPD/GDPR total</li> <li data-astro-cid-6kmwghhu>🔒 Autenticação JWT + 2FA</li> <li data-astro-cid-6kmwghhu>📋 Auditoria completa de acessos</li> </ul> <p data-astro-cid-6kmwghhu><strong data-astro-cid-6kmwghhu>Certificações:</strong> ISO 27001 em processo, SOC 2 Type II auditado.</p> </div> </details> <details class="faq-item" data-category="avancado" data-tags="ia" data-astro-cid-6kmwghhu> <summary data-astro-cid-6kmwghhu>Como funciona o Magic Replies?</summary> <div class="faq-answer" data-astro-cid-6kmwghhu> <p data-astro-cid-6kmwghhu>Magic Replies é nossa IA conversacional exclusiva:</p> <ul data-astro-cid-6kmwghhu> <li data-astro-cid-6kmwghhu><strong data-astro-cid-6kmwghhu>Contexto Completo:</strong> Lembra histórico, produtos comprados, preferências</li> <li data-astro-cid-6kmwghhu><strong data-astro-cid-6kmwghhu>Personalização:</strong> Adapta tom de voz por cliente</li> <li data-astro-cid-6kmwghhu><strong data-astro-cid-6kmwghhu>Aprendizado:</strong> Melhora com cada correção sua</li> <li data-astro-cid-6kmwghhu><strong data-astro-cid-6kmwghhu>Precisão:</strong> 95% de respostas humanizadas</li> <li data-astro-cid-6kmwghhu><strong data-astro-cid-6kmwghhu>Velocidade:</strong> Respostas em menos de 3 segundos</li> <li data-astro-cid-6kmwghhu><strong data-astro-cid-6kmwghhu>Multilíngue:</strong> Suporte automático para 50+ idiomas</li> </ul> <p data-astro-cid-6kmwghhu>Seus clientes não distinguem das respostas de um vendedor humano experiente.</p> </div> </details> <details class="faq-item" data-category="basico" data-tags="suporte" data-astro-cid-6kmwghhu> <summary data-astro-cid-6kmwghhu>E se o cliente quiser falar com uma pessoa?</summary> <div class="faq-answer" data-astro-cid-6kmwghhu> <p data-astro-cid-6kmwghhu><strong data-astro-cid-6kmwghhu>Transferência inteligente automática:</strong></p> <ul data-astro-cid-6kmwghhu> <li data-astro-cid-6kmwghhu>🎯 Detecção automática quando cliente solicita humano</li> <li data-astro-cid-6kmwghhu>📋 Transferência com contexto completo da conversa</li> <li data-astro-cid-6kmwghhu>⚡ Zero perda de tempo (transferência instantânea)</li> <li data-astro-cid-6kmwghhu>📱 Histórico compartilhado entre IA e humano</li> <li data-astro-cid-6kmwghhu>🏷️ Categorização automática do ticket</li> <li data-astro-cid-6kmwghhu>⏰ SLA garantido por prioridade</li> </ul> <p data-astro-cid-6kmwghhu>Sua equipe recebe tickets organizados com toda a informação necessária para resolver rapidamente.</p> </div> </details> <details class="faq-item" data-category="avancado" data-tags="ia" data-astro-cid-6kmwghhu> <summary data-astro-cid-6kmwghhu>Como funciona a análise de sentimento?</summary> <div class="faq-answer" data-astro-cid-6kmwghhu> <p data-astro-cid-6kmwghhu>IA detecta 7 emoções em tempo real:</p> <ul data-astro-cid-6kmwghhu> <li data-astro-cid-6kmwghhu>😊 <strong data-astro-cid-6kmwghhu>Satisfação:</strong> Clientes felizes (94% precisão)</li> <li data-astro-cid-6kmwghhu>😤 <strong data-astro-cid-6kmwghhu>Frustração:</strong> Insatisfeitos (91% precisão)</li> <li data-astro-cid-6kmwghhu>🚨 <strong data-astro-cid-6kmwghhu>Urgência:</strong> Situações críticas (96% precisão)</li> <li data-astro-cid-6kmwghhu>😡 <strong data-astro-cid-6kmwghhu>Raiva:</strong> Muito irritados (89% precisão)</li> <li data-astro-cid-6kmwghhu>🤩 <strong data-astro-cid-6kmwghhu>Alegria:</strong> Extremamente felizes (87% precisão)</li> <li data-astro-cid-6kmwghhu>😟 <strong data-astro-cid-6kmwghhu>Preocupação:</strong> Preocupados (85% precisão)</li> <li data-astro-cid-6kmwghhu>😐 <strong data-astro-cid-6kmwghhu>Neutro:</strong> Conversa objetiva (93% precisão)</li> </ul> <p data-astro-cid-6kmwghhu><strong data-astro-cid-6kmwghhu>Ações automáticas:</strong> Escalonamento prioritário, cupons automáticos, alertas para equipe.</p> </div> </details> <details class="faq-item" data-category="avancado" data-tags="integracao" data-astro-cid-6kmwghhu> <summary data-astro-cid-6kmwghhu>O PIX funciona automaticamente?</summary> <div class="faq-answer" data-astro-cid-6kmwghhu> <p data-astro-cid-6kmwghhu><strong data-astro-cid-6kmwghhu>SIM! PIX 100% automático e integrado:</strong></p> <ul data-astro-cid-6kmwghhu> <li data-astro-cid-6kmwghhu>📱 QR Code gerado instantaneamente</li> <li data-astro-cid-6kmwghhu>📋 Código copia e cola automático</li> <li data-astro-cid-6kmwghhu>⚡ Confirmação em tempo real</li> <li data-astro-cid-6kmwghhu>🔄 Atualização automática de status</li> <li data-astro-cid-6kmwghhu>🛡️ Integração com gateways certificados</li> <li data-astro-cid-6kmwghhu>📊 Relatórios detalhados de pagamentos</li> </ul> <p data-astro-cid-6kmwghhu><strong data-astro-cid-6kmwghhu>Fluxo completo:</strong> Cliente pede produto → IA gera PIX → Cliente paga → Status atualizado automaticamente → Produto liberado.</p> </div> </details> <details class="faq-item" data-category="basico" data-tags="suporte" data-astro-cid-6kmwghhu> <summary data-astro-cid-6kmwghhu>Como funciona o sistema de tickets?</summary> <div class="faq-answer" data-astro-cid-6kmwghhu> <p data-astro-cid-6kmwghhu><strong data-astro-cid-6kmwghhu>Sistema completo de gestão profissional:</strong></p> <ul data-astro-cid-6kmwghhu> <li data-astro-cid-6kmwghhu>🧠 Categorização automática por IA</li> <li data-astro-cid-6kmwghhu>📊 Analytics de satisfação por categoria</li> <li data-astro-cid-6kmwghhu>👥 Multi-agente simultâneo</li> <li data-astro-cid-6kmwghhu>🔗 Mesclagem automática de duplicatas</li> <li data-astro-cid-6kmwghhu>⏰ SLA garantido por prioridade</li> <li data-astro-cid-6kmwghhu>📈 Relatórios de eficiência da equipe</li> </ul> <p data-astro-cid-6kmwghhu><strong data-astro-cid-6kmwghhu>Tempo médio de resolução:</strong> 5 minutos para questões simples, escalonamento automático para complexas.</p> </div> </details> <details class="faq-item" data-category="avancado" data-tags="integracao" data-astro-cid-6kmwghhu> <summary data-astro-cid-6kmwghhu>Como funciona o programa de fidelidade?</summary> <div class="faq-answer" data-astro-cid-6kmwghhu> <p data-astro-cid-6kmwghhu><strong data-astro-cid-6kmwghhu>Programa VIP automático completo:</strong></p> <ul data-astro-cid-6kmwghhu> <li data-astro-cid-6kmwghhu>⭐ Sistema de pontos inteligente (1 ponto por R$ 1)</li> <li data-astro-cid-6kmwghhu>🥇 4 tiers: Bronze, Prata, Ouro, Diamante</li> <li data-astro-cid-6kmwghhu>🎁 Benefícios progressivos por tier</li> <li data-astro-cid-6kmwghhu>👥 Programa de indicações (500 pontos por indicação)</li> <li data-astro-cid-6kmwghhu>🎲 Recompensas surpresa (caixas misteriosas)</li> <li data-astro-cid-6kmwghhu>🏅 Badges e conquistas desbloqueáveis</li> </ul> <p data-astro-cid-6kmwghhu><strong data-astro-cid-6kmwghhu>Resultados comprovados:</strong> +340% compras recorrentes, LTV médio R$ 2.400.</p> </div> </details> <details class="faq-item" data-category="avancado" data-tags="seguranca" data-astro-cid-6kmwghhu> <summary data-astro-cid-6kmwghhu>Posso white-label o GetNexo?</summary> <div class="faq-answer" data-astro-cid-6kmwghhu> <p data-astro-cid-6kmwghhu><strong data-astro-cid-6kmwghhu>White-label completo disponível:</strong></p> <ul data-astro-cid-6kmwghhu> <li data-astro-cid-6kmwghhu>🌐 Seu próprio domínio personalizado</li> <li data-astro-cid-6kmwghhu>🎨 Branding completo (cores, logo, fontes)</li> <li data-astro-cid-6kmwghhu>🤖 IA treinada com sua voz/persona</li> <li data-astro-cid-6kmwghhu>📱 App PWA com sua identidade visual</li> <li data-astro-cid-6kmwghhu>📧 Emails e notificações com sua marca</li> <li data-astro-cid-6kmwghhu>🔒 Painel admin personalizado</li> </ul> <p data-astro-cid-6kmwghhu>Seus clientes jamais saberão que é GetNexo por trás da tecnologia. Tudo com sua marca!</p> </div> </details> <details class="faq-item" data-category="basico" data-tags="suporte" data-astro-cid-6kmwghhu> <summary data-astro-cid-6kmwghhu>Como funciona o suporte técnico?</summary> <div class="faq-answer" data-astro-cid-6kmwghhu> <p data-astro-cid-6kmwghhu><strong data-astro-cid-6kmwghhu>Suporte completo e acessível:</strong></p> <ul data-astro-cid-6kmwghhu> <li data-astro-cid-6kmwghhu>📚 Documentação técnica completa</li> <li data-astro-cid-6kmwghhu>💬 Chat de suporte 24h (resposta em até 2h)</li> <li data-astro-cid-6kmwghhu>🎥 Vídeos tutoriais passo a passo</li> <li data-astro-cid-6kmwghhu>🤝 Consultoria de implantação incluída</li> <li data-astro-cid-6kmwghhu>💡 Comunidade no Discord</li> <li data-astro-cid-6kmwghhu>🏆 SLA garantido para planos superiores</li> </ul> <p data-astro-cid-6kmwghhu><strong data-astro-cid-6kmwghhu>Para clientes enterprise:</strong> Gerente de conta dedicado + suporte prioritário.</p> </div> </details> <details class="faq-item" data-category="avancado" data-tags="integracao" data-astro-cid-6kmwghhu> <summary data-astro-cid-6kmwghhu>Como funciona a API REST?</summary> <div class="faq-answer" data-astro-cid-6kmwghhu> <p data-astro-cid-6kmwghhu><strong data-astro-cid-6kmwghhu>API completa e poderosa:</strong></p> <ul data-astro-cid-6kmwghhu> <li data-astro-cid-6kmwghhu>🔐 Autenticação JWT segura</li> <li data-astro-cid-6kmwghhu>📋 Mais de 50 endpoints documentados</li> <li data-astro-cid-6kmwghhu>🔄 Webhooks bidirecionais</li> <li data-astro-cid-6kmwghhu>📊 Rate limiting inteligente</li> <li data-astro-cid-6kmwghhu>📖 Documentação OpenAPI completa</li> <li data-astro-cid-6kmwghhu>🧪 Sandbox para testes</li> </ul> <p data-astro-cid-6kmwghhu><strong data-astro-cid-6kmwghhu>Endpoints principais:</strong></p> <ul data-astro-cid-6kmwghhu> <li data-astro-cid-6kmwghhu><code data-astro-cid-6kmwghhu>POST /api/messages/send</code> - Enviar mensagens</li> <li data-astro-cid-6kmwghhu><code data-astro-cid-6kmwghhu>GET /api/orders</code> - Listar pedidos</li> <li data-astro-cid-6kmwghhu><code data-astro-cid-6kmwghhu>POST /api/webhooks</code> - Configurar webhooks</li> <li data-astro-cid-6kmwghhu><code data-astro-cid-6kmwghhu>GET /api/analytics</code> - Dados de performance</li> </ul> </div> </details> <details class="faq-item" data-category="avancado" data-tags="ia" data-astro-cid-6kmwghhu> <summary data-astro-cid-6kmwghhu>Como funciona o analytics avançado?</summary> <div class="faq-answer" data-astro-cid-6kmwghhu> <p data-astro-cid-6kmwghhu><strong data-astro-cid-6kmwghhu>Dashboard completo com +40 métricas:</strong></p> <ul data-astro-cid-6kmwghhu> <li data-astro-cid-6kmwghhu>📈 Conversão por canal e período</li> <li data-astro-cid-6kmwghhu>⚡ Tempo médio de resposta da IA</li> <li data-astro-cid-6kmwghhu>😊 Satisfação por categoria de produto</li> <li data-astro-cid-6kmwghhu>💰 ROI de cada campanha WhatsApp</li> <li data-astro-cid-6kmwghhu>👥 Lifetime Value por segmento</li> <li data-astro-cid-6kmwghhu>📊 Cohort analysis detalhada</li> <li data-astro-cid-6kmwghhu>🎯 Benchmarking competitivo</li> <li data-astro-cid-6kmwghhu>🔍 Predição de vendas por IA</li> </ul> <p data-astro-cid-6kmwghhu><strong data-astro-cid-6kmwghhu>Insights acionáveis:</strong> Receba recomendações automáticas para melhorar performance.</p> </div> </details> <details class="faq-item" data-category="basico" data-tags="suporte" data-astro-cid-6kmwghhu> <summary data-astro-cid-6kmwghhu>Posso testar antes de comprar?</summary> <div class="faq-answer" data-astro-cid-6kmwghhu> <p data-astro-cid-6kmwghhu><strong data-astro-cid-6kmwghhu>SIM! Teste gratuito completo:</strong></p> <ul data-astro-cid-6kmwghhu> <li data-astro-cid-6kmwghhu>🆓 14 dias de teste sem limitações</li> <li data-astro-cid-6kmwghhu>🚀 Todas as funcionalidades disponíveis</li> <li data-astro-cid-6kmwghhu>📞 Suporte dedicado durante teste</li> <li data-astro-cid-6kmwghhu>🔄 Migração automática para pago</li> <li data-astro-cid-6kmwghhu>💾 Seus dados preservados</li> <li data-astro-cid-6kmwghhu>📊 Métricas reais durante teste</li> </ul> <p data-astro-cid-6kmwghhu><strong data-astro-cid-6kmwghhu>Sem cartão de crédito necessário!</strong> Teste completo e depois decida se continua.</p> </div> </details> </div> </section>  <section class="contact-cta" data-astro-cid-6kmwghhu> <div class="cta-content" data-astro-cid-6kmwghhu> <h2 data-astro-cid-6kmwghhu>Não encontrou sua resposta?</h2> <p data-astro-cid-6kmwghhu>Fale diretamente com nossa equipe técnica. Resposta em até 2 horas.</p> <div class="cta-buttons" data-astro-cid-6kmwghhu> <a href="https://wa.me/5511999999999" class="btn-whatsapp" data-astro-cid-6kmwghhu>WhatsApp</a> <a href="/contato" class="btn-contact" data-astro-cid-6kmwghhu>Formulário</a> <a href="https://discord.gg/getnexo" class="btn-discord" data-astro-cid-6kmwghhu>Discord Community</a> </div> </div> </section> ` }));
}, "/home/lele/usenexo/getnexo-site/src/pages/faq.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/faq.astro";
const $$url = "/faq";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Faq,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
