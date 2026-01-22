import { f as createComponent, r as renderTemplate, k as renderComponent, m as maybeRenderHead, u as unescapeHTML, h as addAttribute } from "../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$Layout } from "../assets/Layout-DScI-qCd.js";
/* empty css                                      */
import { renderers } from "../renderers.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Integracoes = createComponent(($$result, $$props, $$slots) => {
  const title = "Integrações GetNexo 2026 - Conecte WhatsApp IA com +50 Plataformas | Shopify, WooCommerce, Hotmart, VTEX, Bling, PagSeguro";
  const description = "Integrações completas GetNexo: conecte WhatsApp IA com Shopify, WooCommerce, Nuvemshop, Hotmart, Kiwify, VTEX, Bling, PagSeguro, Melhor Envio, n8n, Make. Automação total de vendas, pedidos e atendimento em tempo real.";
  const keywords = "integração whatsapp shopify, whatsapp woocommerce, whatsapp hotmart, whatsapp kiwify, whatsapp vtex, whatsapp bling, whatsapp pagseguro, whatsapp melhor envio, n8n whatsapp, make whatsapp, zapier whatsapp, getnexo integrações, api whatsapp integracao, automacao whatsapp vendas, e-commerce whatsapp, infoprodutos whatsapp, erp whatsapp integracao, crm whatsapp sync, logistica whatsapp rastreio, pagamentos whatsapp pix";
  const integrations = [
    // E-commerce
    { slug: "shopify", name: "Shopify", icon: "🛍️", category: "E-commerce", status: "active", desc: "Sincronize produtos, pedidos e recupere carrinhos automaticamente" },
    { slug: "woocommerce", name: "WooCommerce", icon: "🔌", category: "E-commerce", status: "active", desc: "Plugin nativo para lojas WordPress com PIX no checkout" },
    { slug: "nuvemshop", name: "Nuvemshop", icon: "☁️", category: "E-commerce", status: "active", desc: "Integração oficial com a maior plataforma LATAM" },
    { slug: "yampi", name: "Yampi", icon: "🛒", category: "E-commerce", status: "active", desc: "Checkouts transparentes de alta conversão" },
    { slug: "cartx", name: "Cartx", icon: "📦", category: "E-commerce", status: "active", desc: "Automação de carrinho abandonado" },
    { slug: "vtex", name: "VTEX", icon: "🚀", category: "E-commerce", status: "active", desc: "Enterprise commerce com automação avançada" },
    { slug: "wake-commerce", name: "Wake Commerce", icon: "🏬", category: "E-commerce", status: "active", desc: "Plataforma robusta para grandes varejistas" },
    { slug: "tray", name: "Tray", icon: "🛒", category: "E-commerce", status: "active", desc: "Ecossistema completo de vendas" },
    { slug: "loja-integrada", name: "Loja Integrada", icon: "🏪", category: "E-commerce", status: "active", desc: "Popular entre PMEs, fácil conexão" },
    { slug: "vnda", name: "Vnda", icon: "🛍️", category: "E-commerce", status: "active", desc: " Omnichannel nativo para marcas DNVB" },
    { slug: "uappi", name: "Uappi", icon: "🆙", category: "E-commerce", status: "active", desc: "Performance e flexibilidade no checkout" },
    { slug: "iset", name: "Iset", icon: "🔢", category: "E-commerce", status: "active", desc: "Plataforma completa para gestão de loja virtual" },
    // ERPs
    { slug: "bling", name: "Bling", icon: "📑", category: "ERP & Gestão", status: "active", desc: "Emissão de notas e gestão de pedidos" },
    { slug: "tiny", name: "Tiny", icon: "🐜", category: "ERP & Gestão", status: "active", desc: "Backoffice automatizado para e-commerce" },
    { slug: "totvs-protheus", name: "Totvs Protheus", icon: "🏢", category: "ERP & Gestão", status: "active", desc: "O maior ERP do Brasil integrado ao WhatsApp" },
    { slug: "linx", name: "Linx", icon: "🛒", category: "ERP & Gestão", status: "active", desc: "Líder em varejo físico e digital" },
    { slug: "sankhya", name: "Sankhya", icon: "🔄", category: "ERP & Gestão", status: "active", desc: "Gestão corporativa inteligente" },
    { slug: "alterdata", name: "Alterdata", icon: "💻", category: "ERP & Gestão", status: "active", desc: "Soluções contábeis e empresariais" },
    { slug: "data-system", name: "Data System", icon: "📉", category: "ERP & Gestão", status: "active", desc: "Especialista em varejo de calçados e roupas" },
    { slug: "alternativa", name: "Alternativa", icon: "🅰️", category: "ERP & Gestão", status: "active", desc: "ERP robusto para redes de lojas" },
    // Pagamentos
    { slug: "mercado-pago", name: "Mercado Pago", icon: "🤝", category: "Pagamentos", status: "active", desc: "Link de pagamento e PIX no chat" },
    { slug: "pagseguro", name: "PagSeguro", icon: "📱", category: "Pagamentos", status: "active", desc: "Vendas seguras com antifraude" },
    { slug: "cielo", name: "Cielo", icon: "💳", category: "Pagamentos", status: "active", desc: "Líder em pagamentos eletrônicos" },
    { slug: "stone", name: "Stone", icon: "🟢", category: "Pagamentos", status: "active", desc: "Soluções financeiras completas" },
    { slug: "pagar-me", name: "Pagar.me", icon: "🐦", category: "Pagamentos", status: "active", desc: "Infraestrutura de pagamento digital" },
    { slug: "vindi", name: "Vindi", icon: "🔄", category: "Pagamentos", status: "active", desc: "Especialista em recorrência e assinaturas" },
    { slug: "getnet", name: "Getnet", icon: "🔴", category: "Pagamentos", status: "active", desc: "Santander Global Pago" },
    // CRM
    { slug: "rd-station", name: "RD Station", icon: "📉", category: "CRM", status: "active", desc: "Marketing Automation líder no Brasil" },
    { slug: "crm-bonus", name: "CRM&Bonus", icon: "🎁", category: "CRM", status: "active", desc: "Giftback e fidelização de clientes" },
    { slug: "wake-experience", name: "Wake Experience", icon: "🏬", category: "CRM", status: "active", desc: "CDP e CRM para varejo" },
    { slug: "hubspot", name: "HubSpot", icon: "🧲", category: "CRM", status: "active", desc: "Sincronização bidirecional de Leads e Negócios" },
    // Logística/Envios
    { slug: "correios", name: "Correios", icon: "📦", category: "Logística", status: "active", desc: "Rastreio nacional automatizado" },
    { slug: "melhor-envio", name: "Melhor Envio", icon: "🚚", category: "Logística", status: "active", desc: "Cotação de frete simultânea" },
    { slug: "loggi", name: "Loggi", icon: "🛵", category: "Logística", status: "active", desc: "Entregas expressas locais" },
    { slug: "99-entrega", name: "99 Entrega", icon: "🚕", category: "Logística", status: "active", desc: "Delivery corporativo rápido" },
    { slug: "frenet", name: "Frenet", icon: "🚛", category: "Logística", status: "active", desc: "Gateway de fretes inteligente" },
    // Infoprodutos
    { slug: "hotmart", name: "Hotmart", icon: "🔥", category: "Infoprodutos", status: "active", desc: "Recuperação de vendas líder" },
    { slug: "kiwify", name: "Kiwify", icon: "🥝", category: "Infoprodutos", status: "active", desc: "Checkout high-stakes" },
    { slug: "eduzz", name: "Eduzz", icon: "📱", category: "Infoprodutos", status: "active", desc: "Ecossistema de afiliados" },
    // Automação & Outros
    { slug: "n8n", name: "n8n", icon: "⚙️", category: "Automação", status: "active", desc: "Workflows low-code ilimitados" },
    { slug: "make", name: "Make", icon: "🔧", category: "Automação", status: "active", desc: "Integrações visuais complexas" },
    { slug: "zapier", name: "Zapier", icon: "⚡", category: "Automação", status: "active", desc: "Conecte com 6000+ apps sem código" },
    { slug: "google-sheets", name: "Google Sheets", icon: "📊", category: "Dados", status: "active", desc: "Planilhas como banco de dados" },
    { slug: "calendly", name: "Calendly", icon: "📅", category: "Agendamento", status: "active", desc: "Agendamento de reuniões" }
  ];
  const relatedPosts = [
    {
      slug: "seguranca-lgpd-whatsapp-business",
      title: "Segurança & LGPD no WhatsApp",
      category: "Compliance",
      excerpt: "Mantenha sua empresa segura e dentro das normas da LGPD em 2026."
    },
    {
      slug: "whatsapp-automacao-escala",
      title: "WhatsApp em Larga Escala",
      category: "WhatsApp",
      excerpt: "Gerencie milhares de conversas com a precisão de um atendimento individual."
    },
    {
      slug: "audio-commerce-busca-voz",
      title: "Audio-Commerce: Futuro da Voz",
      category: "Innovation",
      excerpt: "O crescimento exponencial das vendas por áudio e buscas por voz."
    }
  ];
  const categories = [...new Set(integrations.map((i) => i.category))];
  return renderTemplate(_a || (_a = __template(["", "  <script>\n  // Tab filtering\n  const tabs = document.querySelectorAll('.tab');\n  const cards = document.querySelectorAll('.integration-card');\n\n  tabs.forEach(tab => {\n    tab.addEventListener('click', () => {\n      tabs.forEach(t => t.classList.remove('active'));\n      tab.classList.add('active');\n      \n      const filter = tab.dataset.filter;\n      cards.forEach(card => {\n        if (filter === 'all' || card.dataset.category === filter) {\n          card.style.display = 'block';\n        } else {\n          card.style.display = 'none';\n        }\n      });\n    });\n  });\n<\/script>"])), renderComponent($$result, "Layout", $$Layout, { "title": title, "description": description, "keywords": keywords, "data-astro-cid-jh5e3237": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="integrations-hero" data-astro-cid-jh5e3237> <div class="hero-badge" data-astro-cid-jh5e3237>🔗 Ecossistema Aberto</div> <h1 data-astro-cid-jh5e3237>Integrações GetNexo: Conecte WhatsApp IA com <span class="text-gradient" data-astro-cid-jh5e3237>+50 Plataformas</span></h1> <p class="hero-desc" data-astro-cid-jh5e3237>
Conecte o GetNexo com Shopify, WooCommerce, Hotmart, VTEX, Bling, PagSeguro, Melhor Envio e muito mais. Automatize vendas, pedidos, pagamentos e atendimento em tempo real. Setup em minutos, resultados imediatos.
</p> </section> <section class="intro-benefits" data-astro-cid-jh5e3237> <div class="container" data-astro-cid-jh5e3237> <h2 data-astro-cid-jh5e3237>Por Que Integrar GetNexo com Suas Ferramentas? Potencialize Seus Resultados</h2> <p data-astro-cid-jh5e3237>O GetNexo não é apenas um chatbot - é uma ponte inteligente entre WhatsApp e todos os seus sistemas. Nossas integrações vão muito além de conexões básicas, oferecendo automação completa que transforma conversas em vendas reais.</p> <div class="benefits-grid" data-astro-cid-jh5e3237> <div class="benefit-card" data-astro-cid-jh5e3237> <div class="benefit-icon" data-astro-cid-jh5e3237>🚀</div> <h3 data-astro-cid-jh5e3237>Setup Instantâneo</h3> <p data-astro-cid-jh5e3237>Configure integrações em menos de 5 minutos. Nossas APIs plug-and-play eliminam complexidade técnica e permitem foco no que realmente importa: vender mais.</p> </div> <div class="benefit-card" data-astro-cid-jh5e3237> <div class="benefit-icon" data-astro-cid-jh5e3237>💰</div> <h3 data-astro-cid-jh5e3237>Aumento de Receita</h3> <p data-astro-cid-jh5e3237>Empresas integradas relatam aumento médio de 300% nas conversões do WhatsApp. Cada integração adiciona uma camada de automação inteligente aos seus processos.</p> </div> <div class="benefit-card" data-astro-cid-jh5e3237> <div class="benefit-icon" data-astro-cid-jh5e3237>⚡</div> <h3 data-astro-cid-jh5e3237>Sincronização Bidirecional</h3> <p data-astro-cid-jh5e3237>Dados fluem perfeitamente entre sistemas. Atualizações no e-commerce refletem imediatamente no WhatsApp, garantindo consistência total.</p> </div> <div class="benefit-card" data-astro-cid-jh5e3237> <div class="benefit-icon" data-astro-cid-jh5e3237>🛡️</div> <h3 data-astro-cid-jh5e3237>Segurança Empresarial</h3> <p data-astro-cid-jh5e3237>Criptografia de ponta a ponta, conformidade LGPD e auditoria completa. Seus dados estão mais seguros conosco do que em qualquer outro lugar.</p> </div> <div class="benefit-card" data-astro-cid-jh5e3237> <div class="benefit-icon" data-astro-cid-jh5e3237>📊</div> <h3 data-astro-cid-jh5e3237>Analytics Avançado</h3> <p data-astro-cid-jh5e3237>Acompanhe performance de cada integração em tempo real. Dashboards customizados mostram ROI exato de cada canal integrado.</p> </div> <div class="benefit-card" data-astro-cid-jh5e3237> <div class="benefit-icon" data-astro-cid-jh5e3237>🤖</div> <h3 data-astro-cid-jh5e3237>IA Context Aware</h3> <p data-astro-cid-jh5e3237>Nossa IA entende dados de todos os sistemas integrados, oferecendo respostas personalizadas baseadas no histórico completo do cliente.</p> </div> </div> <p data-astro-cid-jh5e3237>Saiba mais sobre como nossas <a href="/sobre" data-astro-cid-jh5e3237>tecnologias avançadas</a> potencializam cada integração e como ajudamos empresas a escalarem seus resultados no <a href="/blog/whatsapp-automacao-escala" data-astro-cid-jh5e3237>WhatsApp em larga escala</a>.</p> </div> </section> <section class="use-cases" data-astro-cid-jh5e3237> <div class="container" data-astro-cid-jh5e3237> <h2 data-astro-cid-jh5e3237>Casos de Uso Reais: Como Nossas Integrações Transformam Negócios</h2> <h3 data-astro-cid-jh5e3237>E-commerce Integrado</h3> <p data-astro-cid-jh5e3237>Conecte Shopify/WooCommerce ao WhatsApp e veja seus clientes comprarem diretamente no chat. Recuperação automática de carrinhos abandonados, atualização de status de pedidos em tempo real, e notificações inteligentes de entrega.</p> <div class="case-study" data-astro-cid-jh5e3237> <h4 data-astro-cid-jh5e3237>Caso Real: Loja de Roupas Online</h4> <ul data-astro-cid-jh5e3237> <li data-astro-cid-jh5e3237>✅ 450% aumento em conversões via WhatsApp</li> <li data-astro-cid-jh5e3237>✅ 60% redução no tempo de resposta</li> <li data-astro-cid-jh5e3237>✅ 25% aumento no ticket médio</li> <li data-astro-cid-jh5e3237>✅ Recuperação de 35% dos carrinhos abandonados</li> </ul> </div> <h3 data-astro-cid-jh5e3237>ERP e Gestão Empresarial</h3> <p data-astro-cid-jh5e3237>Integre Totvs Protheus, Bling ou Tiny com WhatsApp. Emita notas fiscais, consulte estoque, atualize pedidos e forneça atendimento pós-venda automático baseado nos dados do ERP.</p> <div class="case-study" data-astro-cid-jh5e3237> <h4 data-astro-cid-jh5e3237>Caso Real: Distribuidora de Peças Automotivas</h4> <ul data-astro-cid-jh5e3237> <li data-astro-cid-jh5e3237>✅ Consulta de estoque em tempo real via WhatsApp</li> <li data-astro-cid-jh5e3237>✅ Emissão automática de notas fiscais</li> <li data-astro-cid-jh5e3237>✅ Pedidos de reposição inteligentes</li> <li data-astro-cid-jh5e3237>✅ Suporte técnico contextualizado</li> </ul> </div> <h3 data-astro-cid-jh5e3237>Pagamentos e Financeiro</h3> <p data-astro-cid-jh5e3237>Conecte PagSeguro, Mercado Pago ou Stone. Gere PIX automático, confirme pagamentos instantaneamente e envie comprovantes diretamente no WhatsApp.</p> <div class="case-study" data-astro-cid-jh5e3237> <h4 data-astro-cid-jh5e3237>Caso Real: Consultoria Financeira</h4> <ul data-astro-cid-jh5e3237> <li data-astro-cid-jh5e3237>✅ Pagamentos recorrentes automatizados</li> <li data-astro-cid-jh5e3237>✅ Confirmação instantânea de recebimentos</li> <li data-astro-cid-jh5e3237>✅ Lembretes inteligentes de vencimentos</li> <li data-astro-cid-jh5e3237>✅ Relatórios financeiros no WhatsApp</li> </ul> </div> <h3 data-astro-cid-jh5e3237>Infoprodutos e Cursos</h3> <p data-astro-cid-jh5e3237>Integre Hotmart, Kiwify ou Eduzz. Automatize vendas de cursos, controle de acesso, suporte aos alunos e lembretes de progresso diretamente no WhatsApp.</p> <div class="case-study" data-astro-cid-jh5e3237> <h4 data-astro-cid-jh5e3237>Caso Real: Plataforma de Cursos Online</h4> <ul data-astro-cid-jh5e3237> <li data-astro-cid-jh5e3237>✅ Suporte 24/7 aos alunos</li> <li data-astro-cid-jh5e3237>✅ Lembretes automáticos de aulas</li> <li data-astro-cid-jh5e3237>✅ Certificações enviadas via WhatsApp</li> <li data-astro-cid-jh5e3237>✅ Vendas cruzadas inteligentes</li> </ul> </div> <p data-astro-cid-jh5e3237>Descubra mais casos de sucesso e veja como implementar essas estratégias no seu negócio através do nosso <a href="/blog" data-astro-cid-jh5e3237>blog especializado</a> em <a href="/blog/whatsapp-automacao-escala" data-astro-cid-jh5e3237>automação WhatsApp</a>.</p> </div> </section> <section class="integration-guide" data-astro-cid-jh5e3237> <div class="container" data-astro-cid-jh5e3237> <h2 data-astro-cid-jh5e3237>Guia Completo: Como Integrar Qualquer Sistema ao GetNexo</h2> <h3 data-astro-cid-jh5e3237>Passo 1: Escolha Sua Plataforma</h3> <p data-astro-cid-jh5e3237>Selecione a integração desejada em nosso catálogo completo. Cada plataforma tem documentação específica e suporte dedicado da nossa equipe.</p> <h3 data-astro-cid-jh5e3237>Passo 2: Configuração Técnica</h3> <p data-astro-cid-jh5e3237>Utilize nossas APIs RESTful bem documentadas. Fornecemos SDKs em múltiplas linguagens e webhooks para sincronização bidirecional.</p> <h3 data-astro-cid-jh5e3237>Passo 3: Mapeamento de Dados</h3> <p data-astro-cid-jh5e3237>Configure como os dados fluem entre sistemas. Defina campos obrigatórios, validações e regras de negócio específicas do seu processo.</p> <h3 data-astro-cid-jh5e3237>Passo 4: Testes e Validação</h3> <p data-astro-cid-jh5e3237>Teste todas as funcionalidades em ambiente sandbox. Nossa equipe realiza validação completa antes do go-live.</p> <h3 data-astro-cid-jh5e3237>Passo 5: Monitoramento Contínuo</h3> <p data-astro-cid-jh5e3237>Acompanhe performance em tempo real. Receba alertas automáticos e relatórios detalhados sobre cada integração.</p> <div class="integration-tips" data-astro-cid-jh5e3237> <h4 data-astro-cid-jh5e3237>Dicas para Integrações de Sucesso</h4> <ul data-astro-cid-jh5e3237> <li data-astro-cid-jh5e3237><strong data-astro-cid-jh5e3237>Comece Pequeno:</strong> Teste com um produto/serviço antes de integrar tudo</li> <li data-astro-cid-jh5e3237><strong data-astro-cid-jh5e3237>Valide Dados:</strong> Garanta que informações sejam consistentes entre sistemas</li> <li data-astro-cid-jh5e3237><strong data-astro-cid-jh5e3237>Monitore Performance:</strong> Configure alertas para quedas ou lentidão</li> <li data-astro-cid-jh5e3237><strong data-astro-cid-jh5e3237>Treine Equipe:</strong> Certifique-se que todos entendam o novo fluxo</li> <li data-astro-cid-jh5e3237><strong data-astro-cid-jh5e3237>Faça Backup:</strong> Sempre tenha plano B para situações críticas</li> </ul> </div> </div> </section> <section class="integrations-grid-section" data-astro-cid-jh5e3237> <div class="filter-tabs" data-astro-cid-jh5e3237> <button class="tab active" data-filter="all" data-astro-cid-jh5e3237>Todas</button> ${categories.map((cat) => renderTemplate`<button class="tab"${addAttribute(cat, "data-filter")} data-astro-cid-jh5e3237>${cat}</button>`)} </div> <div class="integrations-grid" data-astro-cid-jh5e3237> ${integrations.map((int) => renderTemplate`<a${addAttribute(`/integracoes/${int.slug}`, "href")}${addAttribute(`integration-card glass-panel ${int.status}`, "class")}${addAttribute(int.category, "data-category")} data-astro-cid-jh5e3237> <div class="int-header" data-astro-cid-jh5e3237> <span class="int-icon" data-astro-cid-jh5e3237>${int.icon}</span> ${int.status === "coming" && renderTemplate`<span class="coming-badge" data-astro-cid-jh5e3237>Em breve</span>`} </div> <h3 data-astro-cid-jh5e3237>${int.name}</h3> <span class="int-category" data-astro-cid-jh5e3237>${int.category}</span> <p data-astro-cid-jh5e3237>${int.desc}</p> </a>`)} </div> </section> <section class="api-section" data-astro-cid-jh5e3237> <div class="glass-panel api-box" data-astro-cid-jh5e3237> <div class="api-content" data-astro-cid-jh5e3237> <h2 data-astro-cid-jh5e3237>API Premium <span class="text-gradient" data-astro-cid-jh5e3237>RESTful</span></h2> <p data-astro-cid-jh5e3237>
Para integrações customizadas, use nossa API completa. Envie mensagens, receba webhooks, 
          gerencie contatos e crie experiências únicas.
</p> <div class="api-features" data-astro-cid-jh5e3237> <span data-astro-cid-jh5e3237>📄 OpenAPI 3.0</span> <span data-astro-cid-jh5e3237>🔐 OAuth 2.0</span> <span data-astro-cid-jh5e3237>📡 Webhooks</span> <span data-astro-cid-jh5e3237>📊 Rate Limits Dedicados</span> </div> <a href="/documentacao" class="btn-docs" data-astro-cid-jh5e3237>Ver Documentação →</a> </div> <div class="api-code" data-astro-cid-jh5e3237> <pre data-astro-cid-jh5e3237><code data-astro-cid-jh5e3237>${unescapeHTML(`curl -X POST https://api.getnexo.com.br/v1/messages \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -d '{
    "to": "5511999999999",
    "type": "text",
    "text": "Olá! Seu pedido foi confirmado"
  }'`)}</code></pre> </div> </div> </section> <section class="cta-section" data-astro-cid-jh5e3237> <h2 data-astro-cid-jh5e3237>Precisa de uma integração <span class="text-gradient" data-astro-cid-jh5e3237>customizada</span>?</h2> <p data-astro-cid-jh5e3237>Nossa equipe pode ajudar a conectar o GetNexo com qualquer sistema.</p> <div class="cta-buttons" data-astro-cid-jh5e3237> <a href="/contato" class="btn-primary" data-astro-cid-jh5e3237>Falar com Especialista</a> <a href="/criar-bot" class="btn-outline" data-astro-cid-jh5e3237>Começar Gratuitamente</a> </div> </section> ${renderComponent($$result2, "RelatedArticles", RelatedArticles, { "articles": relatedPosts, "data-astro-cid-jh5e3237": true })} ` }));
}, "/home/lele/usenexo/getnexo-site/src/pages/integracoes.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/integracoes.astro";
const $$url = "/integracoes";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Integracoes,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
