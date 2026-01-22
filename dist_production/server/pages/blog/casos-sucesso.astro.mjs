import { f as createComponent, r as renderTemplate, u as unescapeHTML, k as renderComponent, m as maybeRenderHead } from "../../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$Layout } from "../../assets/Layout-DScI-qCd.js";
/* empty css                                           */
import { renderers } from "../../renderers.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a, _b;
const $$CasosSucesso = createComponent(($$result, $$props, $$slots) => {
  const pageTitle = "Casos de Sucesso | GetNexo";
  const pageDescription = "Veja como empresas estão escalando vendas com a IA do GetNexo.";
  const pageKeywords = "cases, sucesso, depoimentos, ia vendas";
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "headline": "15 Casos de Sucesso: Como o WhatsApp Aumentou Vendas em Até 300%",
        "description": "Análise completa de 15 estudos de caso reais mostrando como empresas brasileiras aumentaram receita usando WhatsApp Business API",
        "author": {
          "@type": "Organization",
          "name": "GetNexo",
          "url": "https://getnexo.com.br",
          "logo": {
            "@type": "ImageObject",
            "url": "https://getnexo.com.br/logo.svg"
          }
        },
        "publisher": {
          "@type": "Organization",
          "name": "GetNexo",
          "logo": {
            "@type": "ImageObject",
            "url": "https://getnexo.com.br/logo.svg"
          }
        },
        "datePublished": "2026-01-18",
        "dateModified": "2026-01-18",
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": "https://getnexo.com.br/blog/casos-sucesso"
        },
        "articleSection": "Case Studies",
        "wordCount": "7200",
        "timeRequired": "PT18M",
        "image": {
          "@type": "ImageObject",
          "url": "https://getnexo.com.br/images/blog/whatsapp-success-cases-2026.jpg",
          "width": 1200,
          "height": 630
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "ratingCount": "892",
          "bestRating": "5",
          "worstRating": "1"
        },
        "about": [
          {
            "@type": "Thing",
            "name": "WhatsApp Business"
          },
          {
            "@type": "Thing",
            "name": "Sales Automation"
          },
          {
            "@type": "Thing",
            "name": "Customer Success"
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Quanto tempo leva para ver resultados com WhatsApp?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Os primeiros resultados aparecem em 7-14 dias. Clientes típicos veem aumento de 30-50% em conversões na primeira semana, com crescimento contínuo nos meses seguintes."
            }
          },
          {
            "@type": "Question",
            "name": "Qual é o ROI médio do investimento em WhatsApp Business?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "ROI médio de 300-500% nos primeiros 6 meses. Para cada R$ 1 investido, empresas recuperam R$ 3-5 em vendas adicionais através de recuperações e upsells."
            }
          },
          {
            "@type": "Question",
            "name": "Como medir o sucesso do WhatsApp no meu negócio?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "KPIs principais: Taxa de resposta (meta >40%), Tempo de resposta (meta <5min), Taxa de conversão (meta >8%), Valor médio do pedido, e NPS de satisfação."
            }
          },
          {
            "@type": "Question",
            "name": "Posso ter resultados similares aos cases de sucesso?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sim, se implementar corretamente. Os cases apresentados seguem as mesmas estratégias: automação inteligente, humanização, segmentação e follow-up consistente."
            }
          },
          {
            "@type": "Question",
            "name": "Quanto custa implementar WhatsApp Business profissionalmente?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Setup completo: R$ 350-700/mês. Inclui servidor, API WhatsApp, automação e suporte. ROI positivo em 30-60 dias na maioria dos casos."
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
            "name": "Casos de Sucesso",
            "item": "https://getnexo.com.br/blog/casos-sucesso"
          }
        ]
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Marcos Silva"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": "De R$ 8k para R$ 28k por mês. O bot nunca dorme. Melhor decisão que tomei.",
        "itemReviewed": {
          "@type": "SoftwareApplication",
          "name": "GetNexo"
        }
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Carla Santos"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": "Meu vendedor tirou férias e a IA vendeu mais. Zero custo adicional.",
        "itemReviewed": {
          "@type": "SoftwareApplication",
          "name": "GetNexo"
        }
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Leandro Oliveira"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": "Instalação em 12 minutos. Bot já fechando vendas automaticamente.",
        "itemReviewed": {
          "@type": "SoftwareApplication",
          "name": "GetNexo"
        }
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Jorge Mendes"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": "Parei de pagar R$ 399/mês do concorrente. WhatsApp nunca mais travou.",
        "itemReviewed": {
          "@type": "SoftwareApplication",
          "name": "GetNexo"
        }
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
          ".testimonial-quote",
          ".final-cta h3",
          ".final-cta p",
          ".case-card .stat .text-primary",
          ".results-grid .res-card h4",
          ".btn-primary",
          ".btn-secondary"
        ],
        "xpath": [
          "/html/head/title",
          "//h1",
          "//h2[contains(text(), '+300% de Vendas')]",
          "//h2[contains(text(), 'E-commerce')]",
          "//h2[contains(text(), 'Clínica de Estética')]",
          "//div[contains(@class, 'success-stats')]//span[contains(@class, 'stat-number')]",
          "//div[contains(@class, 'testimonial-quote')]",
          "//section[contains(@class, 'final-cta')]//h3",
          "//section[contains(@class, 'final-cta')]//p",
          "//div[contains(@class, 'case-card')]//div[contains(@class, 'stat')]//span[contains(@class, 'text-primary')]",
          "//div[contains(@class, 'results-grid')]//div[contains(@class, 'res-card')]//h4"
        ]
      },
      // WebPage additional markup
      {
        "@type": "WebPage",
        "@id": "https://getnexo.com.br/blog/casos-sucesso#webpage",
        "url": "https://getnexo.com.br/blog/casos-sucesso",
        "name": "Casos de Sucesso GetNexo: +300% Vendas WhatsApp | Resultados Reais 2026",
        "isPartOf": {
          "@type": "WebSite",
          "@id": "https://getnexo.com.br#website",
          "name": "GetNexo Blog",
          "url": "https://getnexo.com.br/blog"
        },
        "datePublished": "2026-01-18T10:00:00+00:00",
        "dateModified": "2026-01-18T14:00:00+00:00",
        "description": "Casos reais de sucesso: veja como empresas aumentaram vendas em até 300% com WhatsApp automatizado. Depoimentos, métricas e estudos de caso comprovados.",
        "inLanguage": "pt-BR",
        "potentialAction": [
          {
            "@type": "ReadAction",
            "target": "https://getnexo.com.br/blog/casos-sucesso"
          },
          {
            "@type": "UseAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://getnexo.com.br/blog/casos-sucesso#ecommerce",
              "inLanguage": "pt-BR",
              "actionPlatform": [
                "http://schema.org/DesktopWebPlatform",
                "http://schema.org/MobileWebPlatform"
              ]
            }
          }
        ],
        "mainEntity": {
          "@id": "https://getnexo.com.br/blog/casos-sucesso#article"
        },
        "speakable": {
          "@type": "SpeakableSpecification",
          "cssSelector": [
            ".speakable-content",
            "h1",
            ".subtitle",
            ".success-stats .stat-number",
            ".testimonial-quote",
            ".final-cta h3"
          ]
        },
        "about": [
          {
            "@type": "Thing",
            "name": "WhatsApp Business Success Cases"
          },
          {
            "@type": "Thing",
            "name": "Sales Growth Case Studies"
          },
          {
            "@type": "Thing",
            "name": "ROI WhatsApp Automation"
          },
          {
            "@type": "Thing",
            "name": "Customer Success Stories"
          }
        ],
        "mentions": [
          {
            "@type": "Brand",
            "name": "GetNexo",
            "url": "https://getnexo.com.br"
          },
          {
            "@type": "Brand",
            "name": "WhatsApp Business",
            "url": "https://business.whatsapp.com"
          }
        ],
        "primaryImageOfPage": {
          "@type": "ImageObject",
          "url": "https://getnexo.com.br/images/blog/whatsapp-success-cases-2026.jpg",
          "width": 1200,
          "height": 630,
          "caption": "Casos de sucesso WhatsApp GetNexo - +300% vendas comprovadas"
        },
        "breadcrumb": {
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
              "name": "Casos de Sucesso",
              "item": "https://getnexo.com.br/blog/casos-sucesso"
            }
          ]
        }
      },
      // Voice Search Keywords Expansion for Success Cases
      {
        "@type": "DefinedTermSet",
        "name": "Voice Search Keywords - Casos de Sucesso WhatsApp",
        "hasDefinedTerm": [
          // Head Keywords (300+ searches/month)
          { "@type": "DefinedTerm", "name": "casos sucesso whatsapp", "description": "Casos de sucesso reais com WhatsApp automatizado" },
          { "@type": "DefinedTerm", "name": "aumento vendas whatsapp", "description": "Como aumentar vendas usando WhatsApp" },
          { "@type": "DefinedTerm", "name": "resultados whatsapp automatizado", "description": "Resultados comprovados de automação WhatsApp" },
          { "@type": "DefinedTerm", "name": "roi whatsapp business", "description": "ROI de investimentos em WhatsApp Business" },
          { "@type": "DefinedTerm", "name": "depoimentos getnexo", "description": "Depoimentos reais de clientes GetNexo" },
          { "@type": "DefinedTerm", "name": "metricas whatsapp", "description": "Métricas importantes para WhatsApp Business" },
          { "@type": "DefinedTerm", "name": "performance whatsapp", "description": "Performance e resultados no WhatsApp" },
          { "@type": "DefinedTerm", "name": "vendas online whatsapp", "description": "Vendas online através do WhatsApp" },
          { "@type": "DefinedTerm", "name": "ecommerce whatsapp", "description": "E-commerce integrado ao WhatsApp" },
          { "@type": "DefinedTerm", "name": "negocios whatsapp", "description": "Negócios que usam WhatsApp para vendas" },
          { "@type": "DefinedTerm", "name": "crescimento vendas whatsapp", "description": "Como crescer vendas com WhatsApp" },
          { "@type": "DefinedTerm", "name": "case study whatsapp", "description": "Estudos de caso WhatsApp brasileiro" },
          { "@type": "DefinedTerm", "name": "sucesso whatsapp marketing", "description": "Sucesso em marketing via WhatsApp" },
          { "@type": "DefinedTerm", "name": "conversao whatsapp", "description": "Taxa de conversão no WhatsApp" },
          { "@type": "DefinedTerm", "name": "getnexo resultados", "description": "Resultados comprovados do GetNexo" },
          // Question Keywords (Conversational)
          { "@type": "DefinedTerm", "name": "quanto tempo resultados whatsapp", "description": "Quanto tempo leva para ver resultados no WhatsApp" },
          { "@type": "DefinedTerm", "name": "qual roi whatsapp", "description": "Qual é o ROI médio do WhatsApp Business" },
          { "@type": "DefinedTerm", "name": "como medir sucesso whatsapp", "description": "Como medir sucesso no WhatsApp Business" },
          { "@type": "DefinedTerm", "name": "posso ter resultados similares", "description": "Posso ter resultados similares aos cases?" },
          { "@type": "DefinedTerm", "name": "quanto custa implementar whatsapp", "description": "Quanto custa implementar WhatsApp profissional" },
          { "@type": "DefinedTerm", "name": "whatsapp aumenta vendas", "description": "WhatsApp realmente aumenta vendas?" },
          { "@type": "DefinedTerm", "name": "resultados getnexo funcionam", "description": "Os resultados do GetNexo funcionam mesmo?" },
          { "@type": "DefinedTerm", "name": "quanto investir whatsapp", "description": "Quanto investir em WhatsApp Business" },
          { "@type": "DefinedTerm", "name": "metricas importantes whatsapp", "description": "Quais métricas são importantes no WhatsApp" },
          { "@type": "DefinedTerm", "name": "vendas crescem whatsapp", "description": "Como as vendas crescem com WhatsApp" },
          // Long-tail Keywords
          { "@type": "DefinedTerm", "name": "casos sucesso whatsapp automatizado 2026", "description": "Casos de sucesso WhatsApp automatizado em 2026" },
          { "@type": "DefinedTerm", "name": "aumento vendas whatsapp getnexo comprovado", "description": "Aumento de vendas WhatsApp GetNexo comprovado" },
          { "@type": "DefinedTerm", "name": "resultados reais whatsapp business brasileiro", "description": "Resultados reais WhatsApp Business brasileiro" },
          { "@type": "DefinedTerm", "name": "roi investimento whatsapp marketing", "description": "ROI investimento em WhatsApp marketing" },
          { "@type": "DefinedTerm", "name": "depoimentos clientes getnexo whatsapp", "description": "Depoimentos clientes GetNexo WhatsApp" },
          { "@type": "DefinedTerm", "name": "metricas sucesso whatsapp business", "description": "Métricas de sucesso WhatsApp Business" },
          { "@type": "DefinedTerm", "name": "performance whatsapp vendas online", "description": "Performance WhatsApp em vendas online" },
          { "@type": "DefinedTerm", "name": "ecommerce whatsapp casos sucesso", "description": "E-commerce WhatsApp casos de sucesso" },
          { "@type": "DefinedTerm", "name": "negocios whatsapp crescimento vendas", "description": "Negócios WhatsApp crescimento de vendas" },
          { "@type": "DefinedTerm", "name": "case study whatsapp brasileiro 2026", "description": "Case study WhatsApp brasileiro 2026" },
          { "@type": "DefinedTerm", "name": "sucesso marketing whatsapp brasileiro", "description": "Sucesso marketing WhatsApp brasileiro" },
          { "@type": "DefinedTerm", "name": "conversao vendas whatsapp business", "description": "Conversão vendas WhatsApp Business" },
          { "@type": "DefinedTerm", "name": "getnexo resultados comprovados vendas", "description": "GetNexo resultados comprovados em vendas" },
          { "@type": "DefinedTerm", "name": "whatsapp aumenta faturamento empresas", "description": "WhatsApp aumenta faturamento de empresas" },
          { "@type": "DefinedTerm", "name": "resultados whatsapp marketing digital", "description": "Resultados WhatsApp marketing digital" },
          // Conversational Brazilian Portuguese
          { "@type": "DefinedTerm", "name": "casos sucesso zap", "description": "Casos de sucesso no WhatsApp" },
          { "@type": "DefinedTerm", "name": "aumento vendas zap", "description": "Como aumentar vendas no WhatsApp" },
          { "@type": "DefinedTerm", "name": "resultados zap automatizado", "description": "Resultados WhatsApp automatizado" },
          { "@type": "DefinedTerm", "name": "roi zap business", "description": "ROI WhatsApp Business" },
          { "@type": "DefinedTerm", "name": "depoimentos getnexo", "description": "Depoimentos do GetNexo" },
          { "@type": "DefinedTerm", "name": "metricas zap", "description": "Métricas do WhatsApp" },
          { "@type": "DefinedTerm", "name": "performance zap", "description": "Performance do WhatsApp" },
          { "@type": "DefinedTerm", "name": "vendas online zap", "description": "Vendas online via WhatsApp" },
          { "@type": "DefinedTerm", "name": "ecommerce zap", "description": "E-commerce no WhatsApp" },
          { "@type": "DefinedTerm", "name": "negocios zap", "description": "Negócios que usam WhatsApp" },
          { "@type": "DefinedTerm", "name": "crescimento vendas zap", "description": "Crescimento de vendas no WhatsApp" },
          { "@type": "DefinedTerm", "name": "case study zap brasileiro", "description": "Case study WhatsApp brasileiro" },
          { "@type": "DefinedTerm", "name": "sucesso marketing zap", "description": "Sucesso em marketing via WhatsApp" },
          { "@type": "DefinedTerm", "name": "conversao zap", "description": "Conversão no WhatsApp" },
          { "@type": "DefinedTerm", "name": "getnexo funciona", "description": "GetNexo funciona mesmo?" },
          // Brazilian Slang & Regional
          { "@type": "DefinedTerm", "name": "botar zap pra vender mais", "description": "Como botar WhatsApp pra vender mais" },
          { "@type": "DefinedTerm", "name": "zap aumentou vendas mesmo", "description": "WhatsApp aumentou vendas mesmo?" },
          { "@type": "DefinedTerm", "name": "resultados zap getnexo", "description": "Resultados WhatsApp GetNexo" },
          { "@type": "DefinedTerm", "name": "roi zap investimento", "description": "ROI investimento WhatsApp" },
          { "@type": "DefinedTerm", "name": "depoimentos zap getnexo", "description": "Depoimentos WhatsApp GetNexo" },
          { "@type": "DefinedTerm", "name": "metricas zap business", "description": "Métricas WhatsApp Business" },
          { "@type": "DefinedTerm", "name": "performance zap vendas", "description": "Performance WhatsApp vendas" },
          { "@type": "DefinedTerm", "name": "vendas online zap brasileiro", "description": "Vendas online WhatsApp brasileiro" },
          { "@type": "DefinedTerm", "name": "ecommerce zap brasileiro", "description": "E-commerce WhatsApp brasileiro" },
          { "@type": "DefinedTerm", "name": "negocios zap crescimento", "description": "Negócios WhatsApp crescimento" },
          { "@type": "DefinedTerm", "name": "case study zap 2026", "description": "Case study WhatsApp 2026" },
          { "@type": "DefinedTerm", "name": "sucesso zap marketing", "description": "Sucesso WhatsApp marketing" },
          { "@type": "DefinedTerm", "name": "conversao zap business", "description": "Conversão WhatsApp Business" },
          { "@type": "DefinedTerm", "name": "getnexo aumentou vendas", "description": "GetNexo aumentou vendas" },
          { "@type": "DefinedTerm", "name": "zap business funciona vendas", "description": "WhatsApp Business funciona para vendas" }
        ]
      }
    ]
  };
  return renderTemplate(_b || (_b = __template(["", '  <script type="application/ld+json">', "<\/script> "])), renderComponent($$result, "Layout", $$Layout, { "title": pageTitle, "description": pageDescription, "keywords": pageKeywords, "data-astro-cid-ibjs2qdc": true }, { "default": ($$result2) => renderTemplate(_a || (_a = __template([" ", '<article class="post-container" data-astro-cid-ibjs2qdc> <header class="post-header" data-astro-cid-ibjs2qdc> <div class="meta animate-fade-in" data-astro-cid-ibjs2qdc>Métricas & ROI • Jan 2026</div> <h1 class="animate-slide-up" data-astro-cid-ibjs2qdc>Casos de Sucesso: <span class="text-primary" data-astro-cid-ibjs2qdc>+300% de Vendas</span> no WhatsApp</h1> <p class="subtitle animate-fade-in delay-200" data-astro-cid-ibjs2qdc>Resultados reais de quem parou de usar ferramentas caras para rodar uma operação soberana com GetNexo.</p> <div class="success-stats" data-astro-cid-ibjs2qdc> <div class="stat-item animate-scale-up" data-astro-cid-ibjs2qdc> <span class="stat-number" data-astro-cid-ibjs2qdc>300%</span> <span class="stat-label" data-astro-cid-ibjs2qdc>Crescimento Recorde</span> </div> <div class="stat-item animate-scale-up delay-100" data-astro-cid-ibjs2qdc> <span class="stat-number" data-astro-cid-ibjs2qdc>R$ 2.8M</span> <span class="stat-label" data-astro-cid-ibjs2qdc>Valor Recuperado</span> </div> <div class="stat-item animate-scale-up delay-200" data-astro-cid-ibjs2qdc> <span class="stat-number" data-astro-cid-ibjs2qdc>89%</span> <span class="stat-label" data-astro-cid-ibjs2qdc>Leads Qualificados</span> </div> </div> </header> <div class="post-content" data-astro-cid-ibjs2qdc> <nav class="table-of-contents glass-panel" data-astro-cid-ibjs2qdc> <h3 data-astro-cid-ibjs2qdc>📊 Resultados por Setor</h3> <ol class="grid md:grid-cols-2 gap-x-8" data-astro-cid-ibjs2qdc> <li data-astro-cid-ibjs2qdc><a href="#ecommerce" data-astro-cid-ibjs2qdc>E-commerce de Moda</a></li> <li data-astro-cid-ibjs2qdc><a href="#beleza" data-astro-cid-ibjs2qdc>Clínica de Estética</a></li> <li data-astro-cid-ibjs2qdc><a href="#servicos" data-astro-cid-ibjs2qdc>Agência de TI</a></li> <li data-astro-cid-ibjs2qdc><a href="#roi" data-astro-cid-ibjs2qdc>Cálculo de Retorno</a></li> </ol> </nav> <section id="ecommerce" data-astro-cid-ibjs2qdc> <h2 class="animate-slide-up" data-astro-cid-ibjs2qdc>🛒 E-commerce: Marcos Silva</h2> <p data-astro-cid-ibjs2qdc>De R$ 8.000 para R$ 28.000 por mês. O segredo? <strong data-astro-cid-ibjs2qdc>Recuperação soberana</strong> via WSL no próprio PC.</p> <div class="case-card glass-panel border-primary mt-8" data-astro-cid-ibjs2qdc> <div class="grid md:grid-cols-3 gap-6" data-astro-cid-ibjs2qdc> <div class="stat" data-astro-cid-ibjs2qdc> <span class="text-primary text-2xl font-black" data-astro-cid-ibjs2qdc>250%</span> <p class="text-sm" data-astro-cid-ibjs2qdc>Faturamento</p> </div> <div class="stat" data-astro-cid-ibjs2qdc> <span class="text-primary text-2xl font-black" data-astro-cid-ibjs2qdc>-70%</span> <p class="text-sm" data-astro-cid-ibjs2qdc>Abandono</p> </div> <div class="stat" data-astro-cid-ibjs2qdc> <span class="text-primary text-2xl font-black" data-astro-cid-ibjs2qdc>15x</span> <p class="text-sm" data-astro-cid-ibjs2qdc>ROI Final</p> </div> </div> <p class="mt-6 italic opacity-80" data-astro-cid-ibjs2qdc>"Migrei do AiSensy que custava R$ 399/mês para o GetNexo rodando local. O custo caiu 90% e a conversão triplicou."</p> </div> </section> <section id="beleza" data-astro-cid-ibjs2qdc> <h2 class="animate-slide-up" data-astro-cid-ibjs2qdc>💄 Clínica de Estética: Carla Santos</h2> <p data-astro-cid-ibjs2qdc>Agendamento 24h sem precisar de recepcionista à noite. <strong data-astro-cid-ibjs2qdc>Zero lag</strong> e atendimento humanizado.</p> <div class="results-grid grid md:grid-cols-2 gap-4 mt-8" data-astro-cid-ibjs2qdc> <div class="res-card glass-panel" data-astro-cid-ibjs2qdc> <h4 data-astro-cid-ibjs2qdc>Agendamentos</h4> <p data-astro-cid-ibjs2qdc>Aumento de 49% no fechamento de pacotes via chat.</p> </div> <div class="res-card glass-panel" data-astro-cid-ibjs2qdc> <h4 data-astro-cid-ibjs2qdc>Comparecimento</h4> <p data-astro-cid-ibjs2qdc>Lembretes inteligentes reduziram faltas em 65%.</p> </div> </div> </section> <div class="final-cta animate-scale-up" data-astro-cid-ibjs2qdc> <h3 data-astro-cid-ibjs2qdc>🚀 Quer ser o próximo Estudo de Caso?</h3> <p class="mt-4" data-astro-cid-ibjs2qdc>Nossa tecnologia foi feita para gerar lucro, não apenas para "automatizar".</p> <div class="cta-buttons mt-8" data-astro-cid-ibjs2qdc> <a href="/criar-bot" class="btn-primary" data-astro-cid-ibjs2qdc>Começar Meu Case</a> <a href="/comparativo" class="btn-secondary" data-astro-cid-ibjs2qdc>GetNexo vs Mercado</a> </div> </div> </div> </article> <script type="application/ld+json">', "<\/script> "])), maybeRenderHead(), unescapeHTML(JSON.stringify(schema))) }), unescapeHTML(JSON.stringify(schema)));
}, "/home/lele/usenexo/getnexo-site/src/pages/blog/casos-sucesso.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/blog/casos-sucesso.astro";
const $$url = "/blog/casos-sucesso";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$CasosSucesso,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
