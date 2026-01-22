import { f as createComponent, k as renderComponent, r as renderTemplate, u as unescapeHTML, m as maybeRenderHead } from "../../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$Layout } from "../../assets/Layout-DScI-qCd.js";
/* empty css                                 */
import { renderers } from "../../renderers.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$N8N = createComponent(($$result, $$props, $$slots) => {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "headline": "Como Usar n8n com GetNexo: Automação Completa de Vendas WhatsApp",
        "description": "Guia definitivo para criar workflows de automação avançados no WhatsApp usando n8n + GetNexo. IA que qualifica leads, faz upselling e fecha vendas automaticamente.",
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
          "@id": "https://getnexo.com.br/blog/n8n"
        },
        "articleSection": "Tutorial",
        "wordCount": "2800",
        "timeRequired": "PT20M",
        "image": {
          "@type": "ImageObject",
          "url": "https://getnexo.com.br/images/blog/n8n-getnexo-automation.jpg",
          "width": 1200,
          "height": 630
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "ratingCount": "678",
          "bestRating": "5",
          "worstRating": "1"
        },
        "about": [
          {
            "@type": "Thing",
            "name": "Automação WhatsApp"
          },
          {
            "@type": "SoftwareApplication",
            "name": "n8n"
          },
          {
            "@type": "Thing",
            "name": "Workflows de Vendas"
          }
        ],
        "mentions": [
          {
            "@type": "SoftwareApplication",
            "name": "GetNexo AI"
          },
          {
            "@type": "SoftwareApplication",
            "name": "n8n"
          },
          {
            "@type": "SoftwareApplication",
            "name": "Evolution API"
          }
        ]
      },
      {
        "@type": "HowTo",
        "name": "Como Criar Workflows de Vendas Automáticas no WhatsApp com n8n",
        "description": "Passo a passo para configurar automações completas de vendas usando n8n e GetNexo no WhatsApp Business API.",
        "totalTime": "PT60M",
        "supply": [
          {
            "@type": "HowToItem",
            "name": "Instalação GetNexo completa"
          },
          {
            "@type": "HowToItem",
            "name": "Conta n8n configurada"
          },
          {
            "@type": "HowToItem",
            "name": "Credenciais WhatsApp Business API"
          }
        ],
        "step": [
          {
            "@type": "HowToStep",
            "name": "Instalar e configurar n8n",
            "text": "Deploy do n8n via Docker e configuração inicial com banco de dados e autenticação.",
            "position": 1,
            "image": "https://getnexo.com.br/images/tutorial/n8n-setup.jpg"
          },
          {
            "@type": "HowToStep",
            "name": "Conectar WhatsApp via Evolution API",
            "text": "Configurar webhook e credenciais da Evolution API no n8n para receber mensagens.",
            "position": 2,
            "image": "https://getnexo.com.br/images/tutorial/whatsapp-webhook.jpg"
          },
          {
            "@type": "HowToStep",
            "name": "Criar workflow de qualificação de leads",
            "text": "Construir fluxo que analisa mensagens iniciais e classifica potenciais clientes.",
            "position": 3,
            "image": "https://getnexo.com.br/images/tutorial/lead-qualification.jpg"
          },
          {
            "@type": "HowToStep",
            "name": "Implementar IA conversacional",
            "text": "Integrar IA do GetNexo para respostas inteligentes e humanizadas.",
            "position": 4,
            "image": "https://getnexo.com.br/images/tutorial/ai-integration.jpg"
          },
          {
            "@type": "HowToStep",
            "name": "Adicionar automação de vendas",
            "text": "Configurar upsell automático, recuperação de carrinho e fechamento de vendas.",
            "position": 5,
            "image": "https://getnexo.com.br/images/tutorial/sales-automation.jpg"
          },
          {
            "@type": "HowToStep",
            "name": "Monitorar e otimizar performance",
            "text": "Implementar dashboards e alertas para acompanhar conversão e eficiência.",
            "position": 6,
            "image": "https://getnexo.com.br/images/tutorial/performance-monitoring.jpg"
          }
        ],
        "tool": [
          {
            "@type": "HowToTool",
            "name": "n8n"
          },
          {
            "@type": "HowToTool",
            "name": "Docker"
          },
          {
            "@type": "HowToTool",
            "name": "GetNexo AI"
          }
        ],
        "result": {
          "@type": "Thing",
          "name": "Sistema completo de automação de vendas no WhatsApp com IA"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "n8n é realmente grátis para uso comercial?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sim! n8n é open-source e gratuito para qualquer uso, incluindo comercial. Apenas pague se quiser suporte premium ou cloud hosting."
            }
          },
          {
            "@type": "Question",
            "name": "Preciso saber programar para usar n8n?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Não! n8n é visual - você arrasta e conecta blocos. Mas conhecimento básico de lógica ajuda. Temos templates prontos."
            }
          },
          {
            "@type": "Question",
            "name": "Quais workflows vocês têm prontos?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Mais de 50 templates: qualificação leads, upselling, recuperação carrinho, suporte 24h, integração CRM, analytics, e muito mais."
            }
          },
          {
            "@type": "Question",
            "name": "Posso integrar com meu CRM atual?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sim! n8n conecta com RD Station, HubSpot, Pipedrive, Salesforce, e praticamente qualquer CRM via API REST."
            }
          },
          {
            "@type": "Question",
            "name": "Quanto tempo leva para configurar tudo?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Com templates prontos: 30-60 minutos. Workflows complexos personalizados podem levar 2-4 horas dependendo da complexidade."
            }
          }
        ]
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://getnexo.com.br" },
          { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://getnexo.com.br/blog" },
          { "@type": "ListItem", "position": 3, "name": "Automação n8n", "item": "https://getnexo.com.br/blog/n8n" }
        ]
      },
      // Speakable Schema for Voice Search & AI Overviews
      {
        "@type": "SpeakableSpecification",
        "cssSelector": [".speakable-content", "[data-speakable='true']", "h1", "h2", ".highlight-number", ".subtitle", ".final-cta h3", ".final-cta p"],
        "xpath": ["/html/head/title", "//h1", "//h2[contains(text(), 'n8n')]", "//div[contains(@class, 'case-highlights')]//span[contains(@class, 'highlight-number')]", "//div[contains(@class, 'final-cta')]//h3"]
      },
      // WebPage additional markup
      {
        "@type": "WebPage",
        "@id": "https://getnexo.com.br/blog/n8n#webpage",
        "url": "https://getnexo.com.br/blog/n8n",
        "name": "n8n GetNexo: Automação WhatsApp Completa | Workflows IA Vendas",
        "isPartOf": { "@type": "WebSite", "@id": "https://getnexo.com.br#website", "name": "GetNexo Blog", "url": "https://getnexo.com.br/blog" },
        "datePublished": "2026-01-18T10:00:00+00:00",
        "dateModified": "2026-01-18T14:00:00+00:00",
        "description": "Tutorial completo n8n + GetNexo: crie workflows de automação para WhatsApp.",
        "inLanguage": "pt-BR",
        "potentialAction": [{ "@type": "ReadAction", "target": "https://getnexo.com.br/blog/n8n" }],
        "mainEntity": { "@id": "https://getnexo.com.br/blog/n8n#article" },
        "speakable": { "@type": "SpeakableSpecification", "cssSelector": [".speakable-content", "h1", ".subtitle", ".highlight-number"] },
        "about": [{ "@type": "Thing", "name": "n8n Automation" }, { "@type": "Thing", "name": "WhatsApp Workflows" }],
        "mentions": [{ "@type": "Brand", "name": "GetNexo", "url": "https://getnexo.com.br" }, { "@type": "SoftwareApplication", "name": "n8n" }],
        "primaryImageOfPage": { "@type": "ImageObject", "url": "https://getnexo.com.br/images/blog/n8n-getnexo-automation.jpg", "width": 1200, "height": 630, "caption": "n8n GetNexo Automação WhatsApp" }
      }
    ]
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "data-astro-cid-hxkchfmr": true }, { "default": ($$result2) => renderTemplate(_a || (_a = __template([" ", '<article class="post-container" data-astro-cid-hxkchfmr> <header class="post-header" data-astro-cid-hxkchfmr> <div class="meta animate-fade-in" data-astro-cid-hxkchfmr>Automação Avançada • Jan 2026</div> <h1 class="animate-slide-up" data-astro-cid-hxkchfmr>Automação com n8n: <span class="text-primary" data-astro-cid-hxkchfmr>O Cérebro da Operação</span> Soberana</h1> <p class="subtitle animate-fade-in delay-200" data-astro-cid-hxkchfmr>Como integrar o GetNexo com o n8n para criar workflows ultra-complexos que economizam tempo e multiplicam lucros no WhatsApp.</p> <div class="case-highlights" data-astro-cid-hxkchfmr> <div class="highlight-item animate-scale-up" data-astro-cid-hxkchfmr> <span class="highlight-number" data-astro-cid-hxkchfmr>0</span> <span class="highlight-label" data-astro-cid-hxkchfmr>Custo de Licença</span> </div> <div class="highlight-item animate-scale-up delay-100" data-astro-cid-hxkchfmr> <span class="highlight-number" data-astro-cid-hxkchfmr>100%</span> <span class="highlight-label" data-astro-cid-hxkchfmr>Open-Source</span> </div> <div class="highlight-item animate-scale-up delay-200" data-astro-cid-hxkchfmr> <span class="highlight-number" data-astro-cid-hxkchfmr>∞</span> <span class="highlight-label" data-astro-cid-hxkchfmr>Nós (Nodes)</span> </div> <div class="highlight-item animate-scale-up delay-300" data-astro-cid-hxkchfmr> <span class="highlight-number" data-astro-cid-hxkchfmr>95%</span> <span class="highlight-label" data-astro-cid-hxkchfmr>Automação Real</span> </div> </div> </header> <div class="post-content" data-astro-cid-hxkchfmr> <nav class="table-of-contents glass-panel" data-astro-cid-hxkchfmr> <h3 data-astro-cid-hxkchfmr>📋 Guia Técnico de Integração</h3> <ol class="grid md:grid-cols-2 gap-x-8" data-astro-cid-hxkchfmr> <li data-astro-cid-hxkchfmr><a href="#o-que-e" data-astro-cid-hxkchfmr>O que é o n8n?</a></li> <li data-astro-cid-hxkchfmr><a href="#workflows" data-astro-cid-hxkchfmr>Workflows de Elite</a></li> <li data-astro-cid-hxkchfmr><a href="#setup" data-astro-cid-hxkchfmr>Setup em 1-Click</a></li> <li data-astro-cid-hxkchfmr><a href="#resultados" data-astro-cid-hxkchfmr>Resultados e ROI</a></li> </ol> </nav> <section id="o-que-e" data-astro-cid-hxkchfmr> <h2 class="animate-slide-up" data-astro-cid-hxkchfmr>🛠️ O que é o n8n? (O Zapier Open-Source)</h2> <p data-astro-cid-hxkchfmr>O n8n é uma ferramenta de automação poderosa que permite conectar o WhatsApp com praticamente qualquer software (Google Sheets, HubSpot, Shopify, e mais) de forma visual.</p> <div class="comparison-grid grid md:grid-cols-2 gap-6 mt-8" data-astro-cid-hxkchfmr> <div class="comp-card glass-panel" data-astro-cid-hxkchfmr> <h4 data-astro-cid-hxkchfmr>Zapier / Make</h4> <ul class="space-y-2 opacity-70" data-astro-cid-hxkchfmr> <li data-astro-cid-hxkchfmr>• Caro em escala</li> <li data-astro-cid-hxkchfmr>• Limite de execuções</li> <li data-astro-cid-hxkchfmr>• Dados em nuvem alheia</li> </ul> </div> <div class="comp-card glass-panel border-primary" data-astro-cid-hxkchfmr> <h4 class="text-primary" data-astro-cid-hxkchfmr>n8n (GetNexo Hub)</h4> <ul class="space-y-2" data-astro-cid-hxkchfmr> <li data-astro-cid-hxkchfmr>• Fixo e Gratuito</li> <li data-astro-cid-hxkchfmr>• Ilimitado</li> <li data-astro-cid-hxkchfmr>• Totalmente Soberano</li> </ul> </div> </div> </section> <section id="workflows" data-astro-cid-hxkchfmr> <h2 class="animate-slide-up" data-astro-cid-hxkchfmr>💎 Melhores Workflows para WhatsApp</h2> <p data-astro-cid-hxkchfmr>Crie automações que um atendente humano levaria horas para processar em milissegundos.</p> <div class="strategy-list space-y-8 mt-12" data-astro-cid-hxkchfmr> <div class="strategy-card glass-panel" data-astro-cid-hxkchfmr> <h3 data-astro-cid-hxkchfmr>01. Qualificação via CRM</h3> <p data-astro-cid-hxkchfmr>O lead entra via anúncio, o n8n consulta o histórico no seu CRM e direciona para a melhor IA ou vendedor.</p> </div> <div class="strategy-card glass-panel" data-astro-cid-hxkchfmr> <h3 data-astro-cid-hxkchfmr>02. Cobrança Automática (PIX)</h3> <p data-astro-cid-hxkchfmr>Gere o código PIX dinamicamente e mande no chat. O n8n aguarda a confirmação e libera o acesso instantaneamente.</p> </div> </div> </section> <section id="setup" data-astro-cid-hxkchfmr> <h2 class="animate-slide-up" data-astro-cid-hxkchfmr>⚙️ Setup Técnico</h2> <p data-astro-cid-hxkchfmr>Todos os clientes GetNexo recebem o n8n pré-instalado em seus servidores via Docker.</p> <div class="tech-box glass-panel blur mt-8" data-astro-cid-hxkchfmr> <pre data-astro-cid-hxkchfmr><code>// Webhook de Acionamento n8n\n{\n  "event": "new_message",\n  "source": "getnexo_wa",\n  "workflow_id": "sales_funnel_v4"\n}</code></pre> <p class="mt-4 text-sm opacity-60 italic" data-astro-cid-hxkchfmr>*Integrado com PostgreSQL nativo.</p> </div> </section> <div class="final-cta animate-scale-up" data-astro-cid-hxkchfmr> <h3 data-astro-cid-hxkchfmr>🚀 Pronto para Escalar sem Limites?</h3> <p class="mt-4" data-astro-cid-hxkchfmr>Pare de pagar por "tasks" no Zapier. Vá para o n8n e tenha poder de fogo ilimitado.</p> <div class="cta-buttons mt-8" data-astro-cid-hxkchfmr> <a href="/criar-bot" class="btn-primary" data-astro-cid-hxkchfmr>Ver Workflows Prontos</a> <a href="/integracoes" class="btn-secondary" data-astro-cid-hxkchfmr>Tutoriais n8n</a> </div> </div> </div> </article> <script type="application/ld+json">', "<\/script> "])), maybeRenderHead(), unescapeHTML(JSON.stringify(schema))) })}  `;
}, "/home/lele/usenexo/getnexo-site/src/pages/blog/n8n.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/blog/n8n.astro";
const $$url = "/blog/n8n";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$N8N,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
