import { f as createComponent, k as renderComponent, r as renderTemplate, u as unescapeHTML, h as addAttribute, m as maybeRenderHead } from "../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$Layout } from "../assets/Layout-DScI-qCd.js";
/* empty css                                */
import { renderers } from "../renderers.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Index = createComponent(($$result, $$props, $$slots) => {
  const pageTitle = "Blog GetNexo | Estratégias de Automação e IA";
  const pageDescription = "Artigos sobre automação de WhatsApp, vendas com IA, e estratégias de escala para negócios digitais.";
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": "https://getnexo.com.br/blog#collectionpage",
    "name": pageTitle,
    "description": pageDescription,
    "url": "https://getnexo.com.br/blog",
    "isPartOf": {
      "@type": "WebSite",
      "@id": "https://getnexo.com.br#website",
      "name": "GetNexo",
      "url": "https://getnexo.com.br"
    },
    "publisher": {
      "@type": "Organization",
      "name": "GetNexo",
      "logo": {
        "@type": "ImageObject",
        "url": "https://getnexo.com.br/logo.svg",
        "width": 512,
        "height": 512
      }
    },
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "IA no Atendimento: O Guia Definitivo 2026", "url": "https://getnexo.com.br/blog/guia-ia-atendimento-2026" },
        { "@type": "ListItem", "position": 2, "name": "Gamificação de Vendas: Estratégias de Elite", "url": "https://getnexo.com.br/blog/gamificacao-vendas-estrategias" },
        { "@type": "ListItem", "position": 3, "name": "Análise de Sentimento: O Coração da Retenção", "url": "https://getnexo.com.br/blog/analise-sentimento-retencao" },
        { "@type": "ListItem", "position": 4, "name": "Tickets Inteligentes: O Futuro do Suporte", "url": "https://getnexo.com.br/blog/tickets-inteligentes-evolucao" },
        { "@type": "ListItem", "position": 5, "name": "Fidelização 4.0: O Poder da Recompensa IA", "url": "https://getnexo.com.br/blog/programa-fidelidade-4-0" },
        { "@type": "ListItem", "position": 6, "name": "WhatsApp em Larga Escala: Estratégias de Automação", "url": "https://getnexo.com.br/blog/whatsapp-automacao-escala" },
        { "@type": "ListItem", "position": 7, "name": "O CRM Inteligente: A Era do GPT-4", "url": "https://getnexo.com.br/blog/crm-futuro-gpt4" },
        { "@type": "ListItem", "position": 8, "name": "Agentes de Vendas Virtuais: O Guia do ARA", "url": "https://getnexo.com.br/blog/criando-agentes-vendas-virtuais" },
        { "@type": "ListItem", "position": 9, "name": "Vendas Preditivas: O Poder da IA no Ecommerce", "url": "https://getnexo.com.br/blog/vendas-preditivas-ia" },
        { "@type": "ListItem", "position": 10, "name": "Recuperação de Carrinho no WhatsApp", "url": "https://getnexo.com.br/blog/recuperacao-carrinho-whatsapp" },
        { "@type": "ListItem", "position": 11, "name": "Omnichannel 2026: Do PDV ao WhatsApp", "url": "https://getnexo.com.br/blog/omnichannel-pdv-whatsapp" },
        { "@type": "ListItem", "position": 12, "name": "Assinaturas e Recorrência no Ecommerce", "url": "https://getnexo.com.br/blog/assinaturas-recorrencia-ecommerce" },
        { "@type": "ListItem", "position": 13, "name": "Segurança e LGPD no WhatsApp Business", "url": "https://getnexo.com.br/blog/seguranca-lgpd-whatsapp-business" },
        { "@type": "ListItem", "position": 14, "name": "Audio-Commerce: O Futuro da Busca por Voz", "url": "https://getnexo.com.br/blog/audio-commerce-busca-voz" },
        { "@type": "ListItem", "position": 15, "name": "Dashboards Analytics Enterprise: BI Real-time", "url": "https://getnexo.com.br/blog/dashboard-analytics-enterprise" },
        { "@type": "ListItem", "position": 16, "name": "Pós-Venda Pró-ativo: Retenção com IA", "url": "https://getnexo.com.br/blog/pos-venda-proativo-ia" },
        { "@type": "ListItem", "position": 17, "name": "GetNexo vs Blip vs Zenvia: O Comparativo Real", "url": "https://getnexo.com.br/blog/comparativo-getnexo-blip-zenvia" },
        { "@type": "ListItem", "position": 18, "name": "Como Dobrar o ROI no WhatsApp Marketing", "url": "https://getnexo.com.br/blog/dobrar-roi-whatsapp-marketing" },
        { "@type": "ListItem", "position": 19, "name": "Vendas High-Ticket: O Guia de Luxo no WhatsApp", "url": "https://getnexo.com.br/blog/vendas-high-ticket-whatsapp" },
        { "@type": "ListItem", "position": 20, "name": "WhatsApp para Imobiliárias: Captação e Visitas", "url": "https://getnexo.com.br/blog/whatsapp-automação-imobiliaria" },
        { "@type": "ListItem", "position": 21, "name": "Saúde Digital: WhatsApp para Clínicas e Médicos", "url": "https://getnexo.com.br/blog/whatsapp-clinicas-saude-lgpd" },
        { "@type": "ListItem", "position": 22, "name": "Guia de Guerra Black Friday 2026: Automação", "url": "https://getnexo.com.br/blog/black-friday-2026-automacao" },
        { "@type": "ListItem", "position": 23, "name": "SaaS Growth: Escalando com a API do WhatsApp", "url": "https://getnexo.com.br/blog/saas-growth-whatsapp-api" },
        { "@type": "ListItem", "position": 24, "name": "IA Lead Scoring: Identifique Clientes Ouro", "url": "https://getnexo.com.br/blog/lead-scoring-ia-qualificacao" },
        { "@type": "ListItem", "position": 25, "name": "O Custo Oculto do Atendimento 100% Humano", "url": "https://getnexo.com.br/blog/custo-atendimento-humano-vs-ia" },
        { "@type": "ListItem", "position": 26, "name": "Guia da API Oficial do WhatsApp para Devs", "url": "https://getnexo.com.br/blog/guia-api-oficial-whatsapp-devs" },
        { "@type": "ListItem", "position": 27, "name": "ChatGPT no WhatsApp: Vendas Automáticas 2026", "url": "https://getnexo.com.br/blog/integrar-chatgpt-whatsapp" },
        { "@type": "ListItem", "position": 28, "name": "Meta Ads para WhatsApp: Estratégias de Elite", "url": "https://getnexo.com.br/blog/estrategias-meta-ads-whatsapp" },
        { "@type": "ListItem", "position": 29, "name": "Escala para Infoprodutores: Automação", "url": "https://getnexo.com.br/blog/chatbot-infoprodutores-escala" },
        { "@type": "ListItem", "position": 30, "name": "Agendamento Automático por WhatsApp", "url": "https://getnexo.com.br/blog/automacao-agendamento-liberais" },
        { "@type": "ListItem", "position": 31, "name": "WhatsApp API vs Web: O Guia Definitivo", "url": "https://getnexo.com.br/blog/whatsapp-api-vs-web-2026" },
        { "@type": "ListItem", "position": 32, "name": "Reduzindo CPL com Qualificação por IA", "url": "https://getnexo.com.br/blog/reduzindo-cpl-qualificacao-ia" },
        { "@type": "ListItem", "position": 33, "name": "LGPD no WhatsApp: Guia de Conformidade", "url": "https://getnexo.com.br/blog/seguranca-lgpd-whatsapp-2026" },
        { "@type": "ListItem", "position": 34, "name": "7 Scripts de Vendas no WhatsApp", "url": "https://getnexo.com.br/blog/scripts-vendas-whatsapp-gatilhos" },
        { "@type": "ListItem", "position": 35, "name": "CRM + WhatsApp: O Motor da sua Escala", "url": "https://getnexo.com.br/blog/crm-whatsapp-combo-escala" },
        { "@type": "ListItem", "position": 36, "name": "IA Generativa: O Fim das Filas de Espera", "url": "https://getnexo.com.br/blog/ia-generativa-atendimento-futuro" }
      ]
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://getnexo.com.br" },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://getnexo.com.br/blog" }
      ]
    }
  };
  const speakableSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SpeakableSpecification",
        "cssSelector": [".hero-title", ".hero-subtitle", ".blog-card h2", ".header-badge", ".newsletter-content h3"],
        "xpath": ["/html/head/title", "//h1", "//h2", "//article//h2//a"]
      },
      {
        "@type": "WebPage",
        "@id": "https://getnexo.com.br/blog#webpage",
        "url": "https://getnexo.com.br/blog",
        "name": pageTitle,
        "isPartOf": { "@type": "WebSite", "@id": "https://getnexo.com.br#website", "name": "GetNexo", "url": "https://getnexo.com.br" },
        "datePublished": "2026-01-18T10:00:00+00:00",
        "dateModified": "2026-01-18T14:00:00+00:00",
        "inLanguage": "pt-BR",
        "speakable": { "@type": "SpeakableSpecification", "cssSelector": [".hero-title", ".hero-subtitle", ".blog-card h2"] },
        "about": [
          { "@type": "Thing", "name": "Automação WhatsApp" },
          { "@type": "Thing", "name": "Vendas com IA" },
          { "@type": "Thing", "name": "Tráfego Pago WhatsApp" }
        ],
        "mentions": [
          { "@type": "Brand", "name": "GetNexo" },
          { "@type": "Brand", "name": "WhatsApp Business" },
          { "@type": "Brand", "name": "n8n" }
        ],
        "primaryImageOfPage": { "@type": "ImageObject", "url": "https://getnexo.com.br/images/blog-og.png", "width": 1200, "height": 630 }
      },
      {
        "@type": "DefinedTermSet",
        "name": "Voice Search Keywords - Blog GetNexo",
        "hasDefinedTerm": [
          { "@type": "DefinedTerm", "name": "blog automação whatsapp", "description": "Blog sobre automação WhatsApp" },
          { "@type": "DefinedTerm", "name": "dicas vendas whatsapp", "description": "Dicas de vendas pelo WhatsApp" },
          { "@type": "DefinedTerm", "name": "como vender pelo whatsapp", "description": "Tutoriais de vendas WhatsApp" },
          { "@type": "DefinedTerm", "name": "ia vendas whatsapp", "description": "IA para vendas no WhatsApp" },
          { "@type": "DefinedTerm", "name": "chatbot whatsapp gratis", "description": "Chatbot WhatsApp gratuito" },
          { "@type": "DefinedTerm", "name": "automação marketing whatsapp", "description": "Automação de marketing WhatsApp" },
          { "@type": "DefinedTerm", "name": "click to whatsapp ads", "description": "Anúncios Click to WhatsApp" },
          { "@type": "DefinedTerm", "name": "recuperar carrinho abandonado", "description": "Recuperação de carrinho abandonado" }
        ]
      }
    ]
  };
  const posts = [
    {
      slug: "guia-ia-atendimento-2026",
      title: "IA no Atendimento: O Guia Definitivo 2026",
      category: "Inteligência Artificial",
      date: "Jan 2026",
      excerpt: "Como a IA Generativa está redefinindo a lealdade do cliente e a eficiência operacional.",
      featured: true
    },
    {
      slug: "gamificacao-vendas-estrategias",
      title: "Gamificação de Vendas: Estratégias de Elite",
      category: "Produtividade",
      date: "Jan 2026",
      excerpt: "Transforme metas em conquistas e vendedores em campeões através da psicologia dos jogos.",
      featured: true
    },
    {
      slug: "analise-sentimento-retencao",
      title: "Análise de Sentimento: O Coração da Retenção",
      category: "Customer Experience",
      date: "Jan 2026",
      excerpt: "Entenda como o cliente se sente em tempo real e antecipe o churn com precisão.",
      featured: true
    },
    {
      slug: "tickets-inteligentes-evolucao",
      title: "Tickets Inteligentes: O Futuro do Suporte",
      category: "Operações",
      date: "Jan 2026",
      excerpt: "Evolua de pilhas de tickets para fluxos automatizados de resolução inteligente.",
      featured: true
    },
    {
      slug: "programa-fidelidade-4-0",
      title: "Fidelização 4.0: O Poder da Recompensa IA",
      category: "Growth",
      date: "Jan 2026",
      excerpt: "Como criar programas de fidelidade que realmente retêm clientes usando IA.",
      featured: false
    },
    {
      slug: "whatsapp-automacao-escala",
      title: "WhatsApp em Larga Escala: Automação 2026",
      category: "WhatsApp",
      date: "Jan 2026",
      excerpt: "Gerencie milhares de conversas com a precisão de um atendimento individual.",
      featured: false
    },
    {
      slug: "crm-futuro-gpt4",
      title: "O CRM Inteligente: A Era do GPT-4",
      category: "CRM & IA",
      date: "Jan 2026",
      excerpt: "Qualificação automática de leads e insights preditivos integrados ao seu CRM.",
      featured: false
    },
    {
      slug: "criando-agentes-vendas-virtuais",
      title: "Agentes de Vendas Virtuais: O Guia ARA",
      category: "Vendas Autônomas",
      date: "Jan 2026",
      excerpt: "Tenha um time de vendas que nunca dorme e bate metas com consistência.",
      featured: false
    },
    {
      slug: "vendas-preditivas-ia",
      title: "Vendas Preditivas: IA no Ecommerce",
      category: "Data Science",
      date: "Jan 2026",
      excerpt: "Saiba o que o seu cliente quer comprar antes mesmo dele saber.",
      featured: true
    },
    {
      slug: "recuperacao-carrinho-whatsapp",
      title: "Recuperação de Carrinho: WhatsApp",
      category: "Conversão",
      date: "Jan 2026",
      excerpt: "Como recuperar até 45% das vendas perdidas com automação inteligente.",
      featured: true
    },
    {
      slug: "omnichannel-pdv-whatsapp",
      title: "Omnichannel 2026: Guia Completo",
      category: "Arquitetura",
      date: "Jan 2026",
      excerpt: "Integre sua loja física, seu site e seu WhatsApp em uma única rede.",
      featured: false
    },
    {
      slug: "assinaturas-recorrencia-ecommerce",
      title: "Assinaturas & Recorrência: Escala",
      category: "Business Model",
      date: "Jan 2026",
      excerpt: "O segredo para um faturamento previsível e escalável no digital.",
      featured: false
    },
    {
      slug: "seguranca-lgpd-whatsapp-business",
      title: "Segurança & LGPD no WhatsApp",
      category: "Compliance",
      date: "Jan 2026",
      excerpt: "Mantenha sua empresa segura e dentro das normas da LGPD em 2026.",
      featured: false
    },
    {
      slug: "audio-commerce-busca-voz",
      title: "Audio-Commerce: Futuro da Voz",
      category: "Innovation",
      date: "Jan 2026",
      excerpt: "O crescimento exponencial das vendas por áudio e buscas por voz.",
      featured: false
    },
    {
      slug: "dashboard-analytics-enterprise",
      title: "BI Enterprise: Gestão por Dados",
      category: "Management",
      date: "Jan 2026",
      excerpt: "Dashboards em tempo real para controle total da sua operação.",
      featured: false
    },
    {
      slug: "pos-venda-proativo-ia",
      title: "Pós-Venda Ativo: Fidelização IA",
      category: "Experience",
      date: "Jan 2026",
      excerpt: "Transforme suporte em lucro com atendimento pró-ativo e inteligente.",
      featured: false
    },
    {
      slug: "comparativo-getnexo-blip-zenvia",
      title: "GetNexo vs Blip vs Zenvia",
      category: "Comparativo",
      date: "Jan 2026",
      excerpt: "O guia definitivo para escolher sua plataforma de WhatsApp API.",
      featured: true
    },
    {
      slug: "dobrar-roi-whatsapp-marketing",
      title: "Dobrar ROI no WhatsApp",
      category: "Marketing",
      date: "Jan 2026",
      excerpt: "Estratégias avançadas para maximizar o retorno das suas campanhas.",
      featured: true
    },
    {
      slug: "vendas-high-ticket-whatsapp",
      title: "Vendas High-Ticket: Guia Luxo",
      category: "Estratégia",
      date: "Jan 2026",
      excerpt: "Como fechar grandes negócios e vendas consultivas pelo chat.",
      featured: false
    },
    {
      slug: "whatsapp-automação-imobiliaria",
      title: "WhatsApp para Imobiliárias",
      category: "Real Estate",
      date: "Jan 2026",
      excerpt: "Automatize captação e agendamento de visitas com eficiência.",
      featured: false
    },
    {
      slug: "whatsapp-clinicas-saude-lgpd",
      title: "Saúde Digital: Clínicas & LGPD",
      category: "Healthcare",
      date: "Jan 2026",
      excerpt: "Agendamento seguro e conformidade completa no setor de saúde.",
      featured: false
    },
    {
      slug: "black-friday-2026-automacao",
      title: "Black Friday 2026: Guia",
      category: "Sazonal",
      date: "Jan 2026",
      excerpt: "Prepare sua operação para a maior guerra de vendas do ano.",
      featured: false
    },
    {
      slug: "saas-growth-whatsapp-api",
      title: "SaaS Growth: Onboarding IA",
      category: "SaaS",
      date: "Jan 2026",
      excerpt: "Escalando seu software com automação inteligente no WhatsApp.",
      featured: false
    },
    {
      slug: "lead-scoring-ia-qualificacao",
      title: "AI Lead Scoring: Leads Ouro",
      category: "Inteligência",
      date: "Jan 2026",
      excerpt: "Identifique e priorize leads de alta intenção automaticamente.",
      featured: false
    },
    {
      slug: "custo-atendimento-humano-vs-ia",
      title: "Humano vs IA: O Custo Real",
      category: "Análise",
      date: "Jan 2026",
      excerpt: "Por que o modelo híbrido é o segredo da lucratividade em 2026.",
      featured: false
    },
    {
      slug: "guia-api-oficial-whatsapp-devs",
      title: "Guia WhatsApp API para Devs",
      category: "Dev",
      date: "Jan 2026",
      excerpt: "Tudo o que você precisa para uma integração robusta e escalável.",
      featured: false
    },
    {
      slug: "integrar-chatgpt-whatsapp",
      title: "ChatGPT + WhatsApp: Vendas",
      category: "IA & Vendas",
      date: "Jan 2026",
      excerpt: "Como integrar a IA do momento no seu WhatsApp para vender 24/7.",
      featured: true
    },
    {
      slug: "estrategias-meta-ads-whatsapp",
      title: "Meta Ads para WhatsApp 2026",
      category: "Marketing",
      date: "Jan 2026",
      excerpt: "Estratégias avançadas de tráfego pago para escala conversacional.",
      featured: true
    },
    {
      slug: "chatbot-infoprodutores-escala",
      title: "Escala para Infoprodutores",
      category: "Infoprodutos",
      date: "Jan 2026",
      excerpt: "Automação avançada para lançamentos e funis perpétuos de sucesso.",
      featured: false
    },
    {
      slug: "automacao-agendamento-liberais",
      title: "Agendamento Automático",
      category: "Produtividade",
      date: "Jan 2026",
      excerpt: "Otimize sua agenda e reduza faltas com automação inteligente.",
      featured: false
    },
    {
      slug: "whatsapp-api-vs-web-2026",
      title: "WhatsApp API vs Web: Guia",
      category: "Tecnologia",
      date: "Jan 2026",
      excerpt: "Descubra qual a melhor opção para a escala profissional do seu negócio.",
      featured: false
    },
    {
      slug: "reduzindo-cpl-qualificacao-ia",
      title: "Reduzindo CPL com IA",
      category: "Performance",
      date: "Jan 2026",
      excerpt: "Como qualificar leads automaticamente e reduzir seus custos de aquisição.",
      featured: true
    },
    {
      slug: "seguranca-lgpd-whatsapp-2026",
      title: "LGPD no WhatsApp Corporate",
      category: "Compliance",
      date: "Jan 2026",
      excerpt: "Guia completo de segurança e conformidade para empresas em 2026.",
      featured: false
    },
    {
      slug: "scripts-vendas-whatsapp-gatilhos",
      title: "7 Scripts de Vendas Elite",
      category: "Vendas",
      date: "Jan 2026",
      excerpt: "Modelos prontos com gatilhos mentais para conversão imediata.",
      featured: true
    },
    {
      slug: "crm-whatsapp-combo-escala",
      title: "CRM + WhatsApp: O Combo",
      category: "Estratégia",
      date: "Jan 2026",
      excerpt: "O segredo das empresas que escalam com organização e dados.",
      featured: false
    },
    {
      slug: "ia-generativa-atendimento-futuro",
      title: "Suporte com IA Generativa",
      category: "Inovação",
      date: "Jan 2026",
      excerpt: "Acabe com as filas de espera e reduza custos drasticamente.",
      featured: true
    }
  ];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": pageTitle, "description": pageDescription, "data-astro-cid-5tznm7mj": true }, { "default": ($$result2) => renderTemplate(_a || (_a = __template([" ", '<div class="blog-index-page" data-astro-cid-5tznm7mj> <header class="blog-header" data-astro-cid-5tznm7mj> <div class="custom-container" data-astro-cid-5tznm7mj> <span class="header-badge animate-fade-in" data-astro-cid-5tznm7mj>Estratégias & Insights</span> <h1 class="hero-title animate-title" data-astro-cid-5tznm7mj>Blog <span class="text-gradient" data-astro-cid-5tznm7mj>GetNexo</span></h1> <p class="hero-subtitle animate-fade-in delay-200" data-astro-cid-5tznm7mj>\nAprenda a escalar sua operação com IA, automação avançada e tráfego de alta performance no WhatsApp.\n</p> </div> </header> <main class="blog-main" data-astro-cid-5tznm7mj> <div class="custom-container" data-astro-cid-5tznm7mj> <!-- Featured Grid --> <div class="blog-grid" data-astro-cid-5tznm7mj> ', ` </div> <!-- Newsletter / Community CTA --> <section class="newsletter-section glass-panel" data-astro-cid-5tznm7mj> <div class="newsletter-content" data-astro-cid-5tznm7mj> <h3 data-astro-cid-5tznm7mj>Escala no WhatsApp Toda Semana</h3> <p data-astro-cid-5tznm7mj>Receba scripts e táticas de automação direto no seu e-mail (ou WhatsApp).</p> <form class="newsletter-form" data-astro-cid-5tznm7mj> <input type="email" placeholder="Seu melhor e-mail" required data-astro-cid-5tznm7mj> <button type="submit" class="btn-primary-glow" data-astro-cid-5tznm7mj>Inscrever-me</button> </form> </div> </section> </div> </main> </div> <script>
    // Blog Search Filtering Logic
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('q')?.toLowerCase();

    if (searchQuery) {
      const posts = document.querySelectorAll('.blog-card');
      let found = 0;

      posts.forEach(post => {
        const title = post.querySelector('h2').textContent.toLowerCase();
        const excerpt = post.querySelector('p').textContent.toLowerCase();
        const category = post.querySelector('.card-category').textContent.toLowerCase();

        if (title.includes(searchQuery) || excerpt.includes(searchQuery) || category.includes(searchQuery)) {
          post.style.display = 'flex';
          found++;
        } else {
          post.style.display = 'none';
        }
      });

      // Show Search Query indicator
      const headerTitle = document.querySelector('.hero-title');
      if (headerTitle) {
        headerTitle.innerHTML = \`Busca: <span class="text-gradient">\${searchQuery}</span>\`;
      }

      // Handle No Results
      if (found === 0) {
        const grid = document.querySelector('.blog-grid');
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-search glass-panel';
        emptyState.innerHTML = \`
          <h3>Nenhum resultado para "\${searchQuery}"</h3>
          <p>Tente termos mais genéricos ou explore nossas categorias.</p>
          <a href="/blog" class="btn-primary-glow">Ver todos os artigos</a>
        \`;
        grid.style.display = 'block';
        grid.appendChild(emptyState);
      }
    }
  <\/script>  <script type="application/ld+json">`, '<\/script> <script type="application/ld+json">', "<\/script> "], [" ", '<div class="blog-index-page" data-astro-cid-5tznm7mj> <header class="blog-header" data-astro-cid-5tznm7mj> <div class="custom-container" data-astro-cid-5tznm7mj> <span class="header-badge animate-fade-in" data-astro-cid-5tznm7mj>Estratégias & Insights</span> <h1 class="hero-title animate-title" data-astro-cid-5tznm7mj>Blog <span class="text-gradient" data-astro-cid-5tznm7mj>GetNexo</span></h1> <p class="hero-subtitle animate-fade-in delay-200" data-astro-cid-5tznm7mj>\nAprenda a escalar sua operação com IA, automação avançada e tráfego de alta performance no WhatsApp.\n</p> </div> </header> <main class="blog-main" data-astro-cid-5tznm7mj> <div class="custom-container" data-astro-cid-5tznm7mj> <!-- Featured Grid --> <div class="blog-grid" data-astro-cid-5tznm7mj> ', ` </div> <!-- Newsletter / Community CTA --> <section class="newsletter-section glass-panel" data-astro-cid-5tznm7mj> <div class="newsletter-content" data-astro-cid-5tznm7mj> <h3 data-astro-cid-5tznm7mj>Escala no WhatsApp Toda Semana</h3> <p data-astro-cid-5tznm7mj>Receba scripts e táticas de automação direto no seu e-mail (ou WhatsApp).</p> <form class="newsletter-form" data-astro-cid-5tznm7mj> <input type="email" placeholder="Seu melhor e-mail" required data-astro-cid-5tznm7mj> <button type="submit" class="btn-primary-glow" data-astro-cid-5tznm7mj>Inscrever-me</button> </form> </div> </section> </div> </main> </div> <script>
    // Blog Search Filtering Logic
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('q')?.toLowerCase();

    if (searchQuery) {
      const posts = document.querySelectorAll('.blog-card');
      let found = 0;

      posts.forEach(post => {
        const title = post.querySelector('h2').textContent.toLowerCase();
        const excerpt = post.querySelector('p').textContent.toLowerCase();
        const category = post.querySelector('.card-category').textContent.toLowerCase();

        if (title.includes(searchQuery) || excerpt.includes(searchQuery) || category.includes(searchQuery)) {
          post.style.display = 'flex';
          found++;
        } else {
          post.style.display = 'none';
        }
      });

      // Show Search Query indicator
      const headerTitle = document.querySelector('.hero-title');
      if (headerTitle) {
        headerTitle.innerHTML = \\\`Busca: <span class="text-gradient">\\\${searchQuery}</span>\\\`;
      }

      // Handle No Results
      if (found === 0) {
        const grid = document.querySelector('.blog-grid');
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-search glass-panel';
        emptyState.innerHTML = \\\`
          <h3>Nenhum resultado para "\\\${searchQuery}"</h3>
          <p>Tente termos mais genéricos ou explore nossas categorias.</p>
          <a href="/blog" class="btn-primary-glow">Ver todos os artigos</a>
        \\\`;
        grid.style.display = 'block';
        grid.appendChild(emptyState);
      }
    }
  <\/script>  <script type="application/ld+json">`, '<\/script> <script type="application/ld+json">', "<\/script> "])), maybeRenderHead(), posts.map((post) => renderTemplate`<article${addAttribute(["blog-card glass-panel", { "featured": post.featured }], "class:list")} data-astro-cid-5tznm7mj> <div class="card-content" data-astro-cid-5tznm7mj> <div class="card-meta" data-astro-cid-5tznm7mj> <span class="card-category" data-astro-cid-5tznm7mj>${post.category}</span> <span class="card-date" data-astro-cid-5tznm7mj>${post.date}</span> </div> <h2 data-astro-cid-5tznm7mj><a${addAttribute(`/blog/${post.slug}`, "href")} data-astro-cid-5tznm7mj>${post.title}</a></h2> <p data-astro-cid-5tznm7mj>${post.excerpt}</p> <a${addAttribute(`/blog/${post.slug}`, "href")} class="read-more" data-astro-cid-5tznm7mj>
Ler Artigo
<span class="arrow" data-astro-cid-5tznm7mj>→</span> </a> </div> </article>`), unescapeHTML(JSON.stringify(schema)), unescapeHTML(JSON.stringify(speakableSchema))) })} `;
}, "/home/lele/usenexo/getnexo-site/src/pages/blog/index.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/blog/index.astro";
const $$url = "/blog";
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
