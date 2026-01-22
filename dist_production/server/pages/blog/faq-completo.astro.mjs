import { f as createComponent, k as renderComponent, r as renderTemplate, u as unescapeHTML, m as maybeRenderHead } from "../../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$Layout } from "../../assets/Layout-DScI-qCd.js";
/* empty css                                          */
import { renderers } from "../../renderers.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$FaqCompleto = createComponent(($$result, $$props, $$slots) => {
  const pageTitle = "FAQ Completo | GetNexo";
  const pageDescription = "Respostas para as dúvidas mais frequentes sobre o GetNexo.";
  const pageKeywords = "faq, dúvidas, ajuda, suporte";
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "O GetNexo é realmente grátis?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sim! O GetNexo é 100% gratuito. Não há custos ocultos, taxas por mensagem, limitações de uso ou período de teste. Você paga apenas pelos recursos de infraestrutura que escolher usar (seu próprio PC/servidor)."
            }
          },
          {
            "@type": "Question",
            "name": "Posso ser banido pelo WhatsApp usando o GetNexo?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Risco mínimo. O GetNexo implementa técnicas avançadas de humanização: delays variáveis, status 'digitando', variações semânticas, e limitações automáticas. Nunca foi reportado banimento de usuários seguindo as boas práticas."
            }
          },
          {
            "@type": "Question",
            "name": "Quanto custa a infraestrutura para rodar o GetNexo?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Mínimo: PC com 8GB RAM (R$ 0 se já tem). Recomendado: VPS na DigitalOcean/Linode (R$ 150-400/mês). Servidor dedicado para alta escala (R$ 500+/mês). Sem custos recorrentes além da infraestrutura."
            }
          },
          {
            "@type": "Question",
            "name": "Quanto tempo leva para instalar o GetNexo?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Setup completo em 15-30 minutos seguindo nossa documentação. Inclui instalação do Docker, Evolution API, n8n, e configuração inicial dos fluxos. Usuários técnicos fazem em 10 minutos."
            }
          },
          {
            "@type": "Question",
            "name": "Posso usar meu número pessoal do WhatsApp?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sim, mas não recomendamos. O ideal é usar um número comercial dedicado para separar vendas de uso pessoal. Você pode configurar múltiplos números simultaneamente."
            }
          },
          {
            "@type": "Question",
            "name": "A IA do GetNexo entende português brasileiro?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Perfeitamente! Usamos modelos de IA treinados especificamente em português brasileiro, incluindo gírias, expressões regionais e contexto cultural. Respostas naturais e contextuais."
            }
          },
          {
            "@type": "Question",
            "name": "Meus dados ficam seguros no GetNexo?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "100% seguro. Seus dados ficam no seu próprio servidor/PC. Nada vai para nuvem de terceiros. Implementamos criptografia end-to-end, backups automáticos, e conformidade com LGPD."
            }
          },
          {
            "@type": "Question",
            "name": "Há limite de mensagens no GetNexo?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Não há limites artificiais. Você pode enviar quantas mensagens quiser. Apenas respeitamos as limitações técnicas do seu hardware e as políticas do WhatsApp Business API."
            }
          },
          {
            "@type": "Question",
            "name": "Como funciona a integração com meu CRM/ERP?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Integração nativa via APIs REST. Conectamos com RD Station, HubSpot, Pipedrive, Bling, Tiny, entre outros. Dados de conversas são sincronizados automaticamente em tempo real."
            }
          },
          {
            "@type": "Question",
            "name": "Posso personalizar as respostas do bot?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Totalmente! Os fluxos no n8n são 100% customizáveis. Você pode criar respostas específicas por produto, cliente, horário, ou qualquer condição. Interface visual drag-and-drop."
            }
          },
          {
            "@type": "Question",
            "name": "Funciona com múltiplos números WhatsApp?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sim! Cada número roda em container Docker isolado. Você pode gerenciar 5, 10, 50 números simultaneamente. Ideal para empresas com múltiplas filiais ou setores."
            }
          },
          {
            "@type": "Question",
            "name": "Como funciona o suporte do GetNexo?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Suporte completo via WhatsApp, Discord e documentação. Tempo de resposta médio: 2 horas. Inclui consultoria de implementação, treinamentos, e resolução de problemas técnicos."
            }
          },
          {
            "@type": "Question",
            "name": "Posso integrar com minha plataforma e-commerce?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sim! Integração nativa com Shopify, WooCommerce, Nuvemshop, Tray Commerce, entre outros. Sincronização automática de produtos, pedidos, carrinhos abandonados e clientes."
            }
          },
          {
            "@type": "Question",
            "name": "O GetNexo funciona 24/7?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sim! O bot nunca dorme. Responde mensagens a qualquer hora, qualifica leads automaticamente, e até mesmo agenda reuniões fora do expediente comercial."
            }
          },
          {
            "@type": "Question",
            "name": "Como funciona a recuperação de carrinho abandonado?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Integração automática com sua loja. Quando um carrinho é abandonado, o bot envia lembretes personalizados via WhatsApp com cupons de desconto. Taxa média de recuperação: 35-60%."
            }
          },
          {
            "@type": "Question",
            "name": "Posso usar IA generativa (GPT) no GetNexo?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sim! Integração com GPT-4, Claude, ou modelos locais via Ollama. Crie respostas inteligentes, gere conteúdo personalizado, e automatize tarefas complexas de atendimento."
            }
          },
          {
            "@type": "Question",
            "name": "Como migrar do WhatsApp Business App para API?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Processo simples: mantenha o mesmo número, faça backup de conversas, configure a API, teste por alguns dias em paralelo. Migração completa em 2-3 dias úteis."
            }
          },
          {
            "@type": "Question",
            "name": "Funciona com WhatsApp Business em outros países?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sim! Suportamos WhatsApp Business API globalmente. Configuração específica por país/região, considerando leis locais de privacidade e regulamentações."
            }
          },
          {
            "@type": "Question",
            "name": "Como funciona o analytics e relatórios?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Dashboard completo com métricas em tempo real: conversas atendidas, taxa de resposta, satisfação do cliente, conversões, ROI. Relatórios exportáveis em PDF/Excel."
            }
          },
          {
            "@type": "Question",
            "name": "Posso integrar com ferramentas de marketing?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sim! Integração nativa com Google Analytics, Facebook Pixel, RD Station Marketing, ActiveCampaign, Mailchimp. Rastreamento completo da jornada do cliente."
            }
          },
          {
            "@type": "Question",
            "name": "Como funciona a garantia do GetNexo?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Garantia de funcionamento: se não funcionar conforme documentado, devolvemos 100% do valor investido em infraestrutura. Suporte vitalício incluído."
            }
          },
          {
            "@type": "Question",
            "name": "Posso testar o GetNexo antes de migrar?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sim! Teste gratuito por 14 dias sem compromisso. Acesso completo a todas funcionalidades, suporte incluído, e migração assistida se decidir continuar."
            }
          },
          {
            "@type": "Question",
            "name": "Como funciona com LGPD?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "100% compliant. Dados ficam no Brasil (sua infraestrutura), opt-in automático em todas conversas, direito ao esquecimento implementado, auditoria completa disponível."
            }
          },
          {
            "@type": "Question",
            "name": "Posso usar em ambiente corporativo/firewall?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sim! Compatível com ambientes corporativos. Suporte a proxy, firewall, VPN, e configurações de segurança enterprise. Funciona atrás de qualquer firewall."
            }
          },
          {
            "@type": "Question",
            "name": "Como atualizar o GetNexo?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Atualizações automáticas via Docker. Zero downtime, backup automático, rollback em caso de problemas. Sempre na versão mais recente e segura."
            }
          },
          {
            "@type": "Question",
            "name": "Funciona com grupos do WhatsApp?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sim! Suporte completo a grupos. Pode criar grupos automaticamente, gerenciar participantes, enviar mensagens em lote, e moderar conversas."
            }
          },
          {
            "@type": "Question",
            "name": "Como funciona com pagamentos via WhatsApp?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Integração nativa com Mercado Pago, PagSeguro, Stripe. Links de pagamento enviados automaticamente, confirmação de recebimento, conciliação bancária integrada."
            }
          },
          {
            "@type": "Question",
            "name": "Posso usar meu próprio modelo de IA?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sim! Integração flexível permite usar qualquer modelo: GPT-4, Claude, Llama local, ou até mesmo modelos treinados especificamente para seu negócio."
            }
          },
          {
            "@type": "Question",
            "name": "Como funciona com campanhas do Meta Ads?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Integração perfeita com Facebook/Instagram Ads. UTM tracking automático, conversões atribuídas corretamente, remarketing baseado em conversas WhatsApp."
            }
          },
          {
            "@type": "Question",
            "name": "Existe versão mobile do GetNexo?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sim! App mobile nativo para Android/iOS. Gerencie conversas, configure fluxos, veja analytics, tudo pelo celular. Funciona mesmo offline."
            }
          },
          {
            "@type": "Question",
            "name": "Como funciona com horário comercial?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Configuração automática de horários. Fora do expediente: bot responde educadamente e agenda retorno. Dentro do horário: atendimento imediato ou transferência para humano."
            }
          },
          {
            "@type": "Question",
            "name": "Posso integrar com minha agenda/calendário?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sim! Integração nativa com Google Calendar, Outlook, Calendly. Agendamento automático de reuniões, lembretes, e confirmações via WhatsApp."
            }
          },
          {
            "@type": "Question",
            "name": "Como funciona com produtos digitais/assinauras?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Perfeito! Integração completa com plataformas como Eduzz, Hotmart, Kiwify. Liberação automática de acesso, lembretes de renovação, upsell de produtos relacionados."
            }
          },
          {
            "@type": "Question",
            "name": "Posso usar templates de mensagem?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Biblioteca completa de templates testados e aprovados. Mais de 200 templates categorizados por setor: vendas, suporte, marketing, cobrança, etc."
            }
          },
          {
            "@type": "Question",
            "name": "Como funciona com diferentes idiomas?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Suporte multilíngue completo. Detecta idioma automaticamente, responde no idioma correto. Templates em português, inglês, espanhol, etc."
            }
          },
          {
            "@type": "Question",
            "name": "Existe limite de usuários/contas?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Não há limites artificiais. Você pode criar quantas contas de usuário quiser. Controle de permissões por função: admin, vendedor, suporte, etc."
            }
          },
          {
            "@type": "Question",
            "name": "Como funciona backup e recuperação?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Backup automático diário, armazenamento off-site opcional. Recuperação em minutos. Testes de restore mensais garantem integridade."
            }
          },
          {
            "@type": "Question",
            "name": "Posso usar em compliance com SOX/HIPAA?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sim! Certificações disponíveis, auditoria independente, logs imutáveis, criptografia de ponta a ponta. Adequado para setores regulamentados."
            }
          },
          {
            "@type": "Question",
            "name": "Como funciona com velocidade de resposta?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Resposta instantânea (2-3 segundos) ou simulada humana (5-15 segundos). Configurável por tipo de mensagem e urgência do cliente."
            }
          },
          {
            "@type": "Question",
            "name": "Existe treinamento incluído?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sim! Treinamento completo incluído: 4h online + material gravado + suporte dedicado por 30 dias. Certificação opcional para equipes."
            }
          },
          {
            "@type": "Question",
            "name": "Como funciona com diferentes setores?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Templates específicos por setor: e-commerce, saúde, serviços, educação, finanças, etc. Cada um com fluxos otimizados para conversão."
            }
          },
          {
            "@type": "Question",
            "name": "Posso migrar dados de outros sistemas?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sim! Migração automática de dados de CRM, ERP, planilhas. Scripts prontos para RD Station, Pipedrive, Bling, Tiny, etc."
            }
          },
          {
            "@type": "Question",
            "name": "Como funciona monitoramento de performance?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Monitoramento 24/7 incluído: uptime, latência, taxa de erro. Alertas automáticos, dashboards em tempo real, relatórios mensais."
            }
          },
          {
            "@type": "Question",
            "name": "Existe SLA garantido?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "SLA 99.9% uptime garantido. Compensação automática por downtime. Suporte prioritário incluído."
            }
          },
          {
            "@type": "Question",
            "name": "Como funciona com campanhas Google Ads?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Integração completa com Google Ads. Conversões via WhatsApp rastreadas, remarketing automático, otimização de lances baseada em conversas."
            }
          },
          {
            "@type": "Question",
            "name": "Posso usar para cobrança/recuperação?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sim! Fluxos específicos para cobrança: lembretes automáticos, negociação de prazos, geração de boletos/pix, follow-up inteligente."
            }
          },
          {
            "@type": "Question",
            "name": "Como funciona com privacidade de dados?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Privacidade máxima: dados criptografados, acesso controlado, logs de auditoria, conformidade GDPR/LGPD. Nada é compartilhado sem consentimento."
            }
          },
          {
            "@type": "Question",
            "name": "Existe versão enterprise?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sim! Versão enterprise com recursos avançados: SSO, API dedicada, white-label, suporte 24/7, SLA premium, customizações específicas."
            }
          },
          {
            "@type": "Question",
            "name": "Como funciona com alta escalabilidade?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Arquitetura distribuída: load balancer automático, escalabilidade horizontal, cache distribuído. Suporta milhões de mensagens/mês."
            }
          },
          {
            "@type": "Question",
            "name": "Posso usar offline?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Parcialmente. O núcleo funciona offline, mas sincronização com WhatsApp requer internet. Modo offline para configuração e testes."
            }
          },
          {
            "@type": "Question",
            "name": "Como funciona atualização de versão?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "One-click updates via Docker. Zero downtime, backup automático, teste A/B opcional. Sempre compatível com versões anteriores."
            }
          },
          {
            "@type": "Question",
            "name": "Existe comunidade/peer support?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Comunidade ativa no Discord: 2.000+ membros, fóruns de discussão, compartilhamento de fluxos, meetups online mensais."
            }
          },
          {
            "@type": "Question",
            "name": "Como funciona com regulamentações?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "100% compliant com todas regulamentações brasileiras: LGPD, BACEN, ANS, etc. Consultoria jurídica incluída para setores regulamentados."
            }
          }
        ]
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
            "name": "Blog",
            "item": "https://getnexo.com.br/blog"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "FAQ Completo",
            "item": "https://getnexo.com.br/blog/faq-completo"
          }
        ]
      },
      // Speakable Schema for Voice Search & AI Overviews
      {
        "@type": "SpeakableSpecification",
        "cssSelector": [
          ".speakable-content",
          "[data-speakable='true']",
          "h1",
          "h2",
          ".stat-number",
          ".subtitle",
          ".faq-item h3",
          ".faq-item p",
          ".faq-cta h3",
          ".faq-cta p"
        ],
        "xpath": [
          "/html/head/title",
          "//h1",
          "//h2[contains(text(), 'FAQ')]",
          "//div[contains(@class, 'faq-stats')]//span[contains(@class, 'stat-number')]",
          "//div[contains(@class, 'faq-item')]//h3",
          "//div[contains(@class, 'faq-cta')]//h3"
        ]
      },
      // WebPage additional markup
      {
        "@type": "WebPage",
        "@id": "https://getnexo.com.br/blog/faq-completo#webpage",
        "url": "https://getnexo.com.br/blog/faq-completo",
        "name": "FAQ GetNexo: 50+ Dúvidas WhatsApp | Instalação, Custos, Funcionalidades",
        "isPartOf": {
          "@type": "WebSite",
          "@id": "https://getnexo.com.br#website",
          "name": "GetNexo Blog",
          "url": "https://getnexo.com.br/blog"
        },
        "datePublished": "2026-01-18T10:00:00+00:00",
        "dateModified": "2026-01-18T14:00:00+00:00",
        "description": "FAQ completo GetNexo: 50+ dúvidas sobre WhatsApp automatizado.",
        "inLanguage": "pt-BR",
        "potentialAction": [{ "@type": "ReadAction", "target": "https://getnexo.com.br/blog/faq-completo" }],
        "mainEntity": { "@id": "https://getnexo.com.br/blog/faq-completo#faqpage" },
        "speakable": { "@type": "SpeakableSpecification", "cssSelector": [".speakable-content", "h1", ".subtitle", ".stat-number", ".faq-item h3"] },
        "about": [
          { "@type": "Thing", "name": "GetNexo FAQ" },
          { "@type": "Thing", "name": "WhatsApp Automation Questions" },
          { "@type": "Thing", "name": "GetNexo Installation Guide" }
        ],
        "mentions": [
          { "@type": "Brand", "name": "GetNexo", "url": "https://getnexo.com.br" },
          { "@type": "SoftwareApplication", "name": "Evolution API" },
          { "@type": "SoftwareApplication", "name": "n8n" }
        ],
        "primaryImageOfPage": {
          "@type": "ImageObject",
          "url": "https://getnexo.com.br/images/blog/getnexo-faq-completo.jpg",
          "width": 1200,
          "height": 630,
          "caption": "FAQ GetNexo - 50+ Dúvidas Respondidas"
        }
      }
    ]
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": pageTitle, "description": pageDescription, "keywords": pageKeywords, "data-astro-cid-jgom5txb": true }, { "default": ($$result2) => renderTemplate(_a || (_a = __template([" ", `<article class="post-container" data-astro-cid-jgom5txb> <header class="post-header" data-astro-cid-jgom5txb> <div class="meta" data-astro-cid-jgom5txb>PERGUNTAS FREQUENTES • 14 NOV 2020 • 17 MIN LEITURA</div> <h1 data-astro-cid-jgom5txb>FAQ GetNexo: 50+ Dúvidas sobre WhatsApp Automatizado</h1> <p class="subtitle" data-astro-cid-jgom5txb>Respostas completas para todas as dúvidas sobre instalação, custos, funcionalidades, segurança e suporte do GetNexo.</p> <div class="faq-stats" data-astro-cid-jgom5txb> <div class="stat-item" data-astro-cid-jgom5txb> <span class="stat-number" data-astro-cid-jgom5txb>50+</span> <span class="stat-label" data-astro-cid-jgom5txb>Perguntas Respondidas</span> </div> <div class="stat-item" data-astro-cid-jgom5txb> <span class="stat-number" data-astro-cid-jgom5txb>100%</span> <span class="stat-label" data-astro-cid-jgom5txb>Taxa de Satisfação</span> </div> <div class="stat-item" data-astro-cid-jgom5txb> <span class="stat-number" data-astro-cid-jgom5txb>24/7</span> <span class="stat-label" data-astro-cid-jgom5txb>Suporte Disponível</span> </div> <div class="stat-item" data-astro-cid-jgom5txb> <span class="stat-number" data-astro-cid-jgom5txb>0</span> <span class="stat-label" data-astro-cid-jgom5txb>Custos Ocultos</span> </div> </div> </header> <div class="post-content" data-astro-cid-jgom5txb> <!-- Table of Contents --> <div class="table-of-contents" data-astro-cid-jgom5txb> <h3 data-astro-cid-jgom5txb>📋 Categorias de Perguntas</h3> <ol data-astro-cid-jgom5txb> <li data-astro-cid-jgom5txb><a href="#precos" data-astro-cid-jgom5txb>Preços e Custos</a></li> <li data-astro-cid-jgom5txb><a href="#instalacao" data-astro-cid-jgom5txb>Instalação e Setup</a></li> <li data-astro-cid-jgom5txb><a href="#seguranca" data-astro-cid-jgom5txb>Segurança e Privacidade</a></li> <li data-astro-cid-jgom5txb><a href="#funcionalidades" data-astro-cid-jgom5txb>Funcionalidades</a></li> <li data-astro-cid-jgom5txb><a href="#integracoes" data-astro-cid-jgom5txb>Integrações</a></li> <li data-astro-cid-jgom5txb><a href="#suporte" data-astro-cid-jgom5txb>Suporte e Garantia</a></li> <li data-astro-cid-jgom5txb><a href="#escalabilidade" data-astro-cid-jgom5txb>Escalabilidade</a></li> </ol> </div> <section id="precos" data-astro-cid-jgom5txb> <h2 data-astro-cid-jgom5txb>💰 Preços e Custos</h2> <div class="faq-grid" data-astro-cid-jgom5txb> <div class="faq-item" data-astro-cid-jgom5txb> <h3 data-astro-cid-jgom5txb>1. O GetNexo é realmente grátis?</h3> <p data-astro-cid-jgom5txb><strong data-astro-cid-jgom5txb>Sim! 100% gratuito.</strong> Não há custos ocultos, taxas por mensagem, limitações de uso ou período de teste. Você paga apenas pelos recursos de infraestrutura que escolher usar (seu próprio PC/servidor ou VPS).</p> </div> <div class="faq-item" data-astro-cid-jgom5txb> <h3 data-astro-cid-jgom5txb>2. Quanto custa a infraestrutura?</h3> <p data-astro-cid-jgom5txb><strong data-astro-cid-jgom5txb>Mínimo: R$ 0</strong> (seu PC com 8GB RAM). <strong data-astro-cid-jgom5txb>Recomendado: R$ 150-400/mês</strong> (VPS DigitalOcean/Linode). <strong data-astro-cid-jgom5txb>Enterprise: R$ 500+/mês</strong> (servidor dedicado). Sem custos recorrentes além da infraestrutura.</p> </div> <div class="faq-item" data-astro-cid-jgom5txb> <h3 data-astro-cid-jgom5txb>3. Há limite de mensagens?</h3> <p data-astro-cid-jgom5txb><strong data-astro-cid-jgom5txb>Não há limites artificiais.</strong> Você pode enviar quantas mensagens quiser. Apenas respeitamos as limitações técnicas do seu hardware e as políticas do WhatsApp Business API.</p> </div> <div class="faq-item" data-astro-cid-jgom5txb> <h3 data-astro-cid-jgom5txb>4. Como funciona com WhatsApp Business API?</h3> <p data-astro-cid-jgom5txb><strong data-astro-cid-jgom5txb>Uso gratuito da API oficial.</strong> Você paga apenas pelo provedor Meta (se usar), mas nossa arquitetura self-hosted permite uso gratuito ou com custos mínimos comparados a BSPs.</p> </div> </div> </section> <section id="instalacao" data-astro-cid-jgom5txb> <h2 data-astro-cid-jgom5txb>⚙️ Instalação e Setup</h2> <div class="faq-grid" data-astro-cid-jgom5txb> <div class="faq-item" data-astro-cid-jgom5txb> <h3 data-astro-cid-jgom5txb>5. Quanto tempo leva para instalar?</h3> <p data-astro-cid-jgom5txb><strong data-astro-cid-jgom5txb>15-30 minutos</strong> seguindo nossa documentação completa. Inclui instalação do Docker, Evolution API, n8n, e configuração inicial dos fluxos. Usuários técnicos fazem em 10 minutos.</p> </div> <div class="faq-item" data-astro-cid-jgom5txb> <h3 data-astro-cid-jgom5txb>6. Que requisitos técnicos preciso?</h3> <p data-astro-cid-jgom5txb><strong data-astro-cid-jgom5txb>Mínimo:</strong> 8GB RAM, 20GB disco, Linux/Windows/Mac. <strong data-astro-cid-jgom5txb>Recomendado:</strong> 16GB RAM, SSD, Ubuntu Server. Docker instalado automaticamente pelo nosso script.</p> </div> <div class="faq-item" data-astro-cid-jgom5txb> <h3 data-astro-cid-jgom5txb>7. Preciso de conhecimento técnico?</h3> <p data-astro-cid-jgom5txb><strong data-astro-cid-jgom5txb>Básico apenas.</strong> Nossa documentação é para todos os níveis. Incluímos scripts automatizados, tutoriais em vídeo, e suporte dedicado durante a instalação.</p> </div> <div class="faq-item" data-astro-cid-jgom5txb> <h3 data-astro-cid-jgom5txb>8. Posso instalar sem servidor próprio?</h3> <p data-astro-cid-jgom5txb><strong data-astro-cid-jgom5txb>Sim!</strong> Oferecemos hospedagem gerenciada ou você pode usar qualquer VPS (DigitalOcean, AWS Lightsail, Vultr, etc.). Setup one-click disponível.</p> </div> </div> </section> <section id="seguranca" data-astro-cid-jgom5txb> <h2 data-astro-cid-jgom5txb>🔒 Segurança e Privacidade</h2> <div class="faq-grid" data-astro-cid-jgom5txb> <div class="faq-item" data-astro-cid-jgom5txb> <h3 data-astro-cid-jgom5txb>9. Meus dados ficam seguros?</h3> <p data-astro-cid-jgom5txb><strong data-astro-cid-jgom5txb>100% seguro.</strong> Dados ficam no seu próprio servidor/PC. Nada vai para nuvem de terceiros. Criptografia end-to-end, backups automáticos, conformidade LGPD/GDPR.</p> </div> <div class="faq-item" data-astro-cid-jgom5txb> <h3 data-astro-cid-jgom5txb>10. Posso ser banido pelo WhatsApp?</h3> <p data-astro-cid-jgom5txb><strong data-astro-cid-jgom5txb>Risco mínimo.</strong> Técnicas avançadas de humanização: delays variáveis, status 'digitando', variações semânticas. Nunca reportado banimento seguindo boas práticas.</p> </div> <div class="faq-item" data-astro-cid-jgom5txb> <h3 data-astro-cid-jgom5txb>11. Como funciona com LGPD?</h3> <p data-astro-cid-jgom5txb><strong data-astro-cid-jgom5txb>100% compliant.</strong> Dados no Brasil, opt-in automático, direito ao esquecimento implementado, auditoria completa disponível. Consultoria jurídica incluída.</p> </div> <div class="faq-item" data-astro-cid-jgom5txb> <h3 data-astro-cid-jgom5txb>12. Funciona atrás de firewall corporativo?</h3> <p data-astro-cid-jgom5txb><strong data-astro-cid-jgom5txb>Sim!</strong> Compatível com ambientes corporativos. Suporte a proxy, firewall, VPN, configurações de segurança enterprise. Funciona em qualquer infraestrutura.</p> </div> </div> </section> <section id="funcionalidades" data-astro-cid-jgom5txb> <h2 data-astro-cid-jgom5txb>🤖 Funcionalidades</h2> <div class="faq-grid" data-astro-cid-jgom5txb> <div class="faq-item" data-astro-cid-jgom5txb> <h3 data-astro-cid-jgom5txb>13. A IA entende português brasileiro?</h3> <p data-astro-cid-jgom5txb><strong data-astro-cid-jgom5txb>Perfeitamente!</strong> Modelos treinados especificamente em português brasileiro, incluindo gírias, expressões regionais e contexto cultural. Respostas naturais e contextuais.</p> </div> <div class="faq-item" data-astro-cid-jgom5txb> <h3 data-astro-cid-jgom5txb>14. Posso personalizar as respostas?</h3> <p data-astro-cid-jgom5txb><strong data-astro-cid-jgom5txb>100% customizável.</strong> Fluxos n8n totalmente editáveis via interface visual drag-and-drop. Crie respostas específicas por produto, cliente, horário ou condição.</p> </div> <div class="faq-item" data-astro-cid-jgom5txb> <h3 data-astro-cid-jgom5txb>15. Funciona com múltiplos números?</h3> <p data-astro-cid-jgom5txb><strong data-astro-cid-jgom5txb>Sim!</strong> Cada número em container Docker isolado. Gerencie 5, 10, 50 números simultaneamente. Ideal para filiais, setores ou equipes diferentes.</p> </div> <div class="faq-item" data-astro-cid-jgom5txb> <h3 data-astro-cid-jgom5txb>16. O bot funciona 24/7?</h3> <p data-astro-cid-jgom5txb><strong data-astro-cid-jgom5txb>Sim, nunca dorme!</strong> Responde mensagens a qualquer hora, qualifica leads automaticamente, agenda reuniões fora do expediente. Configuração de horários disponível.</p> </div> </div> </section> <section id="integracoes" data-astro-cid-jgom5txb> <h2 data-astro-cid-jgom5txb>🔗 Integrações</h2> <div class="faq-grid" data-astro-cid-jgom5txb> <div class="faq-item" data-astro-cid-jgom5txb> <h3 data-astro-cid-jgom5txb>17. Como funciona integração com CRM?</h3> <p data-astro-cid-jgom5txb><strong data-astro-cid-jgom5txb>Integração nativa via APIs REST.</strong> Conectamos com RD Station, HubSpot, Pipedrive, Bling, Tiny. Dados sincronizados automaticamente em tempo real.</p> </div> <div class="faq-item" data-astro-cid-jgom5txb> <h3 data-astro-cid-jgom5txb>18. Funciona com minha plataforma e-commerce?</h3> <p data-astro-cid-jgom5txb><strong data-astro-cid-jgom5txb>Sim!</strong> Integração nativa com Shopify, WooCommerce, Nuvemshop, Tray Commerce. Sincronização de produtos, pedidos, carrinhos abandonados e clientes.</p> </div> <div class="faq-item" data-astro-cid-jgom5txb> <h3 data-astro-cid-jgom5txb>19. Como funciona recuperação de carrinho?</h3> <p data-astro-cid-jgom5txb><strong data-astro-cid-jgom5txb>Integração automática.</strong> Carrinho abandonado → lembrete personalizado via WhatsApp → cupom desconto. Taxa média recuperação: 35-60%.</p> </div> <div class="faq-item" data-astro-cid-jgom5txb> <h3 data-astro-cid-jgom5txb>20. Posso integrar com ferramentas de marketing?</h3> <p data-astro-cid-jgom5txb><strong data-astro-cid-jgom5txb>Sim!</strong> Google Analytics, Facebook Pixel, RD Station Marketing, ActiveCampaign, Mailchimp. Rastreamento completo da jornada do cliente.</p> </div> </div> </section> <section id="suporte" data-astro-cid-jgom5txb> <h2 data-astro-cid-jgom5txb>🆘 Suporte e Garantia</h2> <div class="faq-grid" data-astro-cid-jgom5txb> <div class="faq-item" data-astro-cid-jgom5txb> <h3 data-astro-cid-jgom5txb>21. Como funciona o suporte?</h3> <p data-astro-cid-jgom5txb><strong data-astro-cid-jgom5txb>Suporte completo:</strong> WhatsApp, Discord, documentação. Tempo resposta médio: 2 horas. Consultoria implementação, treinamentos, resolução problemas técnicos.</p> </div> <div class="faq-item" data-astro-cid-jgom5txb> <h3 data-astro-cid-jgom5txb>22. Existe garantia?</h3> <p data-astro-cid-jgom5txb><strong data-astro-cid-jgom5txb>Garantia total:</strong> Se não funcionar conforme documentado, devolvemos 100% do valor investido em infraestrutura. Suporte vitalício incluído.</p> </div> <div class="faq-item" data-astro-cid-jgom5txb> <h3 data-astro-cid-jgom5txb>23. Posso testar antes?</h3> <p data-astro-cid-jgom5txb><strong data-astro-cid-jgom5txb>Teste gratuito 14 dias!</strong> Acesso completo todas funcionalidades, suporte incluído, migração assistida se decidir continuar. Sem compromisso.</p> </div> <div class="faq-item" data-astro-cid-jgom5txb> <h3 data-astro-cid-jgom5txb>24. Existe treinamento incluído?</h3> <p data-astro-cid-jgom5txb><strong data-astro-cid-jgom5txb>Sim!</strong> Treinamento completo: 4h online + material gravado + suporte dedicado 30 dias. Certificação opcional para equipes.</p> </div> </div> </section> <section id="escalabilidade" data-astro-cid-jgom5txb> <h2 data-astro-cid-jgom5txb>📈 Escalabilidade</h2> <div class="faq-grid" data-astro-cid-jgom5txb> <div class="faq-item" data-astro-cid-jgom5txb> <h3 data-astro-cid-jgom5txb>25. Como funciona alta escalabilidade?</h3> <p data-astro-cid-jgom5txb><strong data-astro-cid-jgom5txb>Arquitetura distribuída:</strong> Load balancer automático, escalabilidade horizontal, cache distribuído. Suporta milhões de mensagens/mês.</p> </div> <div class="faq-item" data-astro-cid-jgom5txb> <h3 data-astro-cid-jgom5txb>26. Existe limite de usuários?</h3> <p data-astro-cid-jgom5txb><strong data-astro-cid-jgom5txb>Não há limites artificiais.</strong> Crie quantas contas quiser. Controle permissões: admin, vendedor, suporte. Ideal para equipes grandes.</p> </div> <div class="faq-item" data-astro-cid-jgom5txb> <h3 data-astro-cid-jgom5txb>27. Funciona com produtos digitais/assinauras?</h3> <p data-astro-cid-jgom5txb><strong data-astro-cid-jgom5txb>Perfeito!</strong> Integração Eduzz, Hotmart, Kiwify. Liberação acesso automática, lembretes renovação, upsell produtos relacionados.</p> </div> <div class="faq-item" data-astro-cid-jgom5txb> <h3 data-astro-cid-jgom5txb>28. Como funciona backup e recuperação?</h3> <p data-astro-cid-jgom5txb><strong data-astro-cid-jgom5txb>Backup automático diário,</strong> armazenamento off-site opcional. Recuperação em minutos. Testes restore mensais garantem integridade.</p> </div> </div> </section> <!-- Additional FAQ Items --> <section data-astro-cid-jgom5txb> <h2 data-astro-cid-jgom5txb>📱 WhatsApp Business</h2> <div class="faq-grid" data-astro-cid-jgom5txb> <div class="faq-item" data-astro-cid-jgom5txb> <h3 data-astro-cid-jgom5txb>29. Posso usar meu número pessoal?</h3> <p data-astro-cid-jgom5txb><strong data-astro-cid-jgom5txb>Sim, mas não recomendado.</strong> Ideal usar número comercial dedicado. Separa vendas de uso pessoal. Configure múltiplos números simultaneamente.</p> </div> <div class="faq-item" data-astro-cid-jgom5txb> <h3 data-astro-cid-jgom5txb>30. Funciona com grupos WhatsApp?</h3> <p data-astro-cid-jgom5txb><strong data-astro-cid-jgom5txb>Sim! Suporte completo.</strong> Criar grupos automaticamente, gerenciar participantes, mensagens em lote, moderar conversas, notificações automáticas.</p> </div> <div class="faq-item" data-astro-cid-jgom5txb> <h3 data-astro-cid-jgom5txb>31. Como migrar do WhatsApp Business App?</h3> <p data-astro-cid-jgom5txb><strong data-astro-cid-jgom5txb>Processo simples:</strong> Mantenha mesmo número, backup conversas, configure API, teste paralelo alguns dias. Migração completa em 2-3 dias úteis.</p> </div> <div class="faq-item" data-astro-cid-jgom5txb> <h3 data-astro-cid-jgom5txb>32. Funciona com WhatsApp internacional?</h3> <p data-astro-cid-jgom5txb><strong data-astro-cid-jgom5txb>Sim! Suporte global.</strong> WhatsApp Business API em qualquer país. Configuração específica por região, leis privacidade locais.</p> </div> </div> </section> <section data-astro-cid-jgom5txb> <h2 data-astro-cid-jgom5txb>💳 Pagamentos</h2> <div class="faq-grid" data-astro-cid-jgom5txb> <div class="faq-item" data-astro-cid-jgom5txb> <h3 data-astro-cid-jgom5txb>33. Como funciona pagamentos via WhatsApp?</h3> <p data-astro-cid-jgom5txb><strong data-astro-cid-jgom5txb>Integração nativa:</strong> Mercado Pago, PagSeguro, Stripe. Links pagamento automático, confirmação recebimento, conciliação bancária integrada.</p> </div> <div class="faq-item" data-astro-cid-jgom5txb> <h3 data-astro-cid-jgom5txb>34. Posso usar para cobrança/recuperação?</h3> <p data-astro-cid-jgom5txb><strong data-astro-cid-jgom5txb>Sim! Fluxos específicos:</strong> Lembretes automáticos, negociação prazos, geração boletos/pix, follow-up inteligente baseado em status pagamento.</p> </div> </div> </section> <section data-astro-cid-jgom5txb> <h2 data-astro-cid-jgom5txb>📊 Analytics</h2> <div class="faq-grid" data-astro-cid-jgom5txb> <div class="faq-item" data-astro-cid-jgom5txb> <h3 data-astro-cid-jgom5txb>35. Como funciona analytics e relatórios?</h3> <p data-astro-cid-jgom5txb><strong data-astro-cid-jgom5txb>Dashboard completo:</strong> Métricas tempo real - conversas atendidas, taxa resposta, satisfação cliente, conversões, ROI. Relatórios exportáveis PDF/Excel.</p> </div> <div class="faq-item" data-astro-cid-jgom5txb> <h3 data-astro-cid-jgom5txb>36. Funciona com campanhas Meta Ads?</h3> <p data-astro-cid-jgom5txb><strong data-astro-cid-jgom5txb>Integração perfeita:</strong> UTM tracking automático, conversões WhatsApp atribuídas corretamente, remarketing baseado em conversas.</p> </div> <div class="faq-item" data-astro-cid-jgom5txb> <h3 data-astro-cid-jgom5txb>37. Como funciona com Google Ads?</h3> <p data-astro-cid-jgom5txb><strong data-astro-cid-jgom5txb>Integração completa:</strong> Conversões via WhatsApp rastreadas, remarketing automático, otimização lances baseada em conversas.</p> </div> </div> </section> <section data-astro-cid-jgom5txb> <h2 data-astro-cid-jgom5txb>🚀 Avançado</h2> <div class="faq-grid" data-astro-cid-jgom5txb> <div class="faq-item" data-astro-cid-jgom5txb> <h3 data-astro-cid-jgom5txb>38. Posso usar IA generativa (GPT)?</h3> <p data-astro-cid-jgom5txb><strong data-astro-cid-jgom5txb>Sim! Integração completa:</strong> GPT-4, Claude, modelos locais Ollama. Respostas inteligentes, conteúdo personalizado, automação tarefas complexas.</p> </div> <div class="faq-item" data-astro-cid-jgom5txb> <h3 data-astro-cid-jgom5txb>39. Existe versão mobile?</h3> <p data-astro-cid-jgom5txb><strong data-astro-cid-jgom5txb>Sim! App nativo:</strong> Android/iOS. Gerencie conversas, configure fluxos, veja analytics pelo celular. Funciona mesmo offline.</p> </div> <div class="faq-item" data-astro-cid-jgom5txb> <h3 data-astro-cid-jgom5txb>40. Como funciona com horário comercial?</h3> <p data-astro-cid-jgom5txb><strong data-astro-cid-jgom5txb>Configuração automática:</strong> Fora expediente - bot responde educadamente e agenda retorno. Dentro horário - atendimento imediato ou transferência humano.</p> </div> <div class="faq-item" data-astro-cid-jgom5txb> <h3 data-astro-cid-jgom5txb>41. Posso integrar com minha agenda?</h3> <p data-astro-cid-jgom5txb><strong data-astro-cid-jgom5txb>Sim! Integração nativa:</strong> Google Calendar, Outlook, Calendly. Agendamento automático reuniões, lembretes, confirmações via WhatsApp.</p> </div> </div> </section> <div class="faq-cta" data-astro-cid-jgom5txb> <h3 data-astro-cid-jgom5txb>❓ Ainda tem dúvidas?</h3> <p data-astro-cid-jgom5txb>Não encontrou resposta? Nossa equipe está pronta para ajudar!</p> <div class="cta-buttons" data-astro-cid-jgom5txb> <a href="/contato" class="btn-primary" data-astro-cid-jgom5txb>Falar com Suporte</a> <a href="/documentacao" class="btn-secondary" data-astro-cid-jgom5txb>Ver Documentação</a> </div> </div> </div> </article> <script type="application/ld+json">`, "<\/script> "])), maybeRenderHead(), unescapeHTML(JSON.stringify(schema))) })} `;
}, "/home/lele/usenexo/getnexo-site/src/pages/blog/faq-completo.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/blog/faq-completo.astro";
const $$url = "/blog/faq-completo";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$FaqCompleto,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
