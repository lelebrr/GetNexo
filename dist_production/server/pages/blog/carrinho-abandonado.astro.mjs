import { f as createComponent, r as renderTemplate, u as unescapeHTML, k as renderComponent, m as maybeRenderHead } from "../../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$Layout } from "../../assets/Layout-DScI-qCd.js";
/* empty css                                                 */
import { renderers } from "../../renderers.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a, _b;
const $$CarrinhoAbandonado = createComponent(($$result, $$props, $$slots) => {
  const pageTitle = "Recuperar Carrinho Abandonado | GetNexo";
  const pageDescription = "Estratégias infalíveis para recuperar vendas com automação no WhatsApp.";
  const pageKeywords = "recuperação carrinho, whatsapp automação, e-commerce";
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "headline": "Como Recuperar Carrinho Abandonado via WhatsApp: Guia Definitivo 2026",
        "description": "Estratégias comprovadas para recuperar até 60% dos carrinhos abandonados usando WhatsApp Business API com automação inteligente",
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
          "@id": "https://getnexo.com.br/blog/carrinho-abandonado"
        },
        "articleSection": "E-commerce Guide",
        "wordCount": "6500",
        "timeRequired": "PT16M",
        "image": {
          "@type": "ImageObject",
          "url": "https://getnexo.com.br/images/blog/cart-recovery-whatsapp-2026.jpg",
          "width": 1200,
          "height": 630
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "ratingCount": "756",
          "bestRating": "5",
          "worstRating": "1"
        },
        "about": [
          {
            "@type": "Thing",
            "name": "Cart Abandonment Recovery"
          },
          {
            "@type": "Thing",
            "name": "WhatsApp Marketing"
          },
          {
            "@type": "Thing",
            "name": "E-commerce Automation"
          }
        ],
        "mentions": [
          {
            "@type": "SoftwareApplication",
            "name": "Shopify"
          },
          {
            "@type": "SoftwareApplication",
            "name": "WooCommerce"
          },
          {
            "@type": "SoftwareApplication",
            "name": "GetNexo"
          }
        ]
      },
      {
        "@type": "HowTo",
        "name": "Como Implementar Recuperação de Carrinho Abandonado no WhatsApp",
        "description": "Passo a passo completo para configurar sistema de recuperação automática de carrinhos abandonados usando WhatsApp",
        "totalTime": "PT30M",
        "supply": [
          {
            "@type": "HowToItem",
            "name": "Plataforma e-commerce ativa"
          },
          {
            "@type": "HowToItem",
            "name": "WhatsApp Business API"
          },
          {
            "@type": "HowToItem",
            "name": "Webhook de abandono configurado"
          },
          {
            "@type": "HowToItem",
            "name": "Sistema de desconto automático"
          }
        ],
        "step": [
          {
            "@type": "HowToStep",
            "name": "Configure webhooks na sua loja",
            "text": "Configure webhooks no Shopify/WooCommerce para detectar abandonos em tempo real",
            "position": 1,
            "image": "https://getnexo.com.br/images/tutorial/webhook-setup.jpg"
          },
          {
            "@type": "HowToStep",
            "name": "Importe dados do cliente",
            "text": "Colete nome, telefone WhatsApp e produtos abandonados via webhook",
            "position": 2,
            "image": "https://getnexo.com.br/images/tutorial/customer-data.jpg"
          },
          {
            "@type": "HowToStep",
            "name": "Configure sequência de mensagens",
            "text": "Crie 3-5 mensagens personalizadas com diferentes abordagens e timing",
            "position": 3,
            "image": "https://getnexo.com.br/images/tutorial/message-sequence.jpg"
          },
          {
            "@type": "HowToStep",
            "name": "Implemente desconto inteligente",
            "text": "Configure sistema de desconto automático baseado no valor do carrinho",
            "position": 4,
            "image": "https://getnexo.com.br/images/tutorial/discount-system.jpg"
          },
          {
            "@type": "HowToStep",
            "name": "Monitore e otimize performance",
            "text": "Acompanhe métricas de recuperação e ajuste mensagens baseado em dados",
            "position": 5,
            "image": "https://getnexo.com.br/images/tutorial/analytics-monitoring.jpg"
          }
        ],
        "tool": [
          {
            "@type": "HowToTool",
            "name": "Shopify"
          },
          {
            "@type": "HowToTool",
            "name": "WooCommerce"
          },
          {
            "@type": "HowToTool",
            "name": "GetNexo Platform"
          }
        ],
        "result": {
          "@type": "Thing",
          "name": "Sistema automatizado de recuperação de carrinho abandonado com taxa de sucesso >50%"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Qual é a melhor hora para enviar lembretes de carrinho abandonado?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Primeiro lembrete: 30 minutos após abandono. Segundo lembrete: 24 horas depois. Terceiro lembrete: 72 horas depois. Evite fins de semana para não parecer invasivo."
            }
          },
          {
            "@type": "Question",
            "name": "Quanto desconto oferecer na recuperação de carrinho?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "5-15% dependendo do valor do carrinho. Para carrinhos < R$ 100: 10% desconto. Carrinhos R$ 100-500: 7% desconto. Carrinhos > R$ 500: 5% desconto ou frete grátis."
            }
          },
          {
            "@type": "Question",
            "name": "Posso usar WhatsApp para recuperar carrinhos de todos os países?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sim, WhatsApp Business API funciona globalmente. Mas considere leis de privacidade locais (LGPD no Brasil, GDPR na Europa) e horários locais para não enviar mensagens fora do expediente."
            }
          },
          {
            "@type": "Question",
            "name": "Como evitar que o cliente fique irritado com as mensagens?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Use linguagem amigável, dê opção de cancelar ('responda SAIR'), limite a 3 mensagens máximo, e sempre ofereça valor real (desconto legítimo, não spam)."
            }
          },
          {
            "@type": "Question",
            "name": "Qual é o ROI médio da recuperação de carrinho abandonado?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "ROI médio de 300-800% dependendo do nicho. Para cada R$ 1 investido em automação, recupera-se R$ 3-8 em vendas adicionais através de carrinhos salvos."
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
            "name": "Carrinho Abandonado",
            "item": "https://getnexo.com.br/blog/carrinho-abandonado"
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
          ".final-cta h3",
          ".final-cta p"
        ],
        "xpath": [
          "/html/head/title",
          "//h1",
          "//h2[contains(text(), 'Carrinho')]",
          "//div[contains(@class, 'recovery-stats')]//span[contains(@class, 'stat-number')]",
          "//div[contains(@class, 'final-cta')]//h3"
        ]
      },
      // WebPage additional markup
      {
        "@type": "WebPage",
        "@id": "https://getnexo.com.br/blog/carrinho-abandonado#webpage",
        "url": "https://getnexo.com.br/blog/carrinho-abandonado",
        "name": "Recuperação Carrinho Abandonado WhatsApp: +300% Conversão | Scripts 2026",
        "isPartOf": {
          "@type": "WebSite",
          "@id": "https://getnexo.com.br#website",
          "name": "GetNexo Blog",
          "url": "https://getnexo.com.br/blog"
        },
        "datePublished": "2026-01-18T10:00:00+00:00",
        "dateModified": "2026-01-18T14:00:00+00:00",
        "description": "Guia completo recuperação carrinho abandonado via WhatsApp. Scripts comprovados, fluxos automáticos.",
        "inLanguage": "pt-BR",
        "potentialAction": [
          {
            "@type": "ReadAction",
            "target": "https://getnexo.com.br/blog/carrinho-abandonado"
          }
        ],
        "mainEntity": {
          "@id": "https://getnexo.com.br/blog/carrinho-abandonado#article"
        },
        "speakable": {
          "@type": "SpeakableSpecification",
          "cssSelector": [
            ".speakable-content",
            "h1",
            ".subtitle",
            ".stat-number",
            ".final-cta h3"
          ]
        },
        "about": [
          {
            "@type": "Thing",
            "name": "Cart Abandonment Recovery WhatsApp"
          },
          {
            "@type": "Thing",
            "name": "E-commerce Automation"
          },
          {
            "@type": "Thing",
            "name": "WhatsApp Sales Scripts"
          }
        ],
        "mentions": [
          {
            "@type": "Brand",
            "name": "GetNexo",
            "url": "https://getnexo.com.br"
          },
          {
            "@type": "SoftwareApplication",
            "name": "Shopify"
          },
          {
            "@type": "SoftwareApplication",
            "name": "WooCommerce"
          }
        ],
        "primaryImageOfPage": {
          "@type": "ImageObject",
          "url": "https://getnexo.com.br/images/blog/cart-recovery-whatsapp-2026.jpg",
          "width": 1200,
          "height": 630,
          "caption": "Recuperação Carrinho Abandonado WhatsApp - GetNexo"
        }
      }
    ]
  };
  return renderTemplate(_b || (_b = __template(["", '  <script type="application/ld+json">', "<\/script> "])), renderComponent($$result, "Layout", $$Layout, { "title": pageTitle, "description": pageDescription, "keywords": pageKeywords, "data-astro-cid-mgnpaeam": true }, { "default": ($$result2) => renderTemplate(_a || (_a = __template([" ", '<article class="post-container" data-astro-cid-mgnpaeam> <header class="post-header" data-astro-cid-mgnpaeam> <div class="meta animate-fade-in" data-astro-cid-mgnpaeam>E-commerce • Jan 2026</div> <h1 class="animate-slide-up" data-astro-cid-mgnpaeam>Recuperação de <span class="text-primary" data-astro-cid-mgnpaeam>Carrinho Abandonado</span> via WhatsApp</h1> <p class="subtitle animate-fade-in delay-200" data-astro-cid-mgnpaeam>Scripts comprovados e automações que recuperam até 60% das vendas que você já tinha conquistado.</p> <div class="recovery-stats" data-astro-cid-mgnpaeam> <div class="stat-item animate-scale-up" data-astro-cid-mgnpaeam> <span class="stat-number" data-astro-cid-mgnpaeam>60%</span> <span class="stat-label" data-astro-cid-mgnpaeam>Taxa de Resgate</span> </div> <div class="stat-item animate-scale-up delay-100" data-astro-cid-mgnpaeam> <span class="stat-number" data-astro-cid-mgnpaeam>800%</span> <span class="stat-label" data-astro-cid-mgnpaeam>ROI Médio</span> </div> <div class="stat-item animate-scale-up delay-200" data-astro-cid-mgnpaeam> <span class="stat-number" data-astro-cid-mgnpaeam>30min</span> <span class="stat-label" data-astro-cid-mgnpaeam>Timing Ideal</span> </div> </div> </header> <div class="post-content" data-astro-cid-mgnpaeam> <nav class="table-of-contents glass-panel" data-astro-cid-mgnpaeam> <h3 data-astro-cid-mgnpaeam>📋 Estratégias de Resgate</h3> <ol class="grid md:grid-cols-2 gap-x-8" data-astro-cid-mgnpaeam> <li data-astro-cid-mgnpaeam><a href="#por-que-abandonam" data-astro-cid-mgnpaeam>O Mistério do Abandono</a></li> <li data-astro-cid-mgnpaeam><a href="#timing" data-astro-cid-mgnpaeam>O Poder do Pulo do Gato</a></li> <li data-astro-cid-mgnpaeam><a href="#scripts" data-astro-cid-mgnpaeam>Scripts que Não Parecem Bot</a></li> <li data-astro-cid-mgnpaeam><a href="#fluxo" data-astro-cid-mgnpaeam>Automação Sem Falhas</a></li> </ol> </nav> <section id="por-que-abandonam" data-astro-cid-mgnpaeam> <h2 class="animate-slide-up" data-astro-cid-mgnpaeam>🛒 Por que eles abandonam?</h2> <p data-astro-cid-mgnpaeam>Não é falta de interesse, é interrupção. No mobile, uma notificação é o suficiente para o cliente esquecer o checkout.</p> <div class="reasons-list grid md:grid-cols-2 gap-4 mt-8" data-astro-cid-mgnpaeam> <div class="reason-card glass-panel" data-astro-cid-mgnpaeam> <h4 data-astro-cid-mgnpaeam>23% Frete Surpresa</h4> <p data-astro-cid-mgnpaeam>O valor da entrega mata a empolgação no último segundo.</p> </div> <div class="reason-card glass-panel" data-astro-cid-mgnpaeam> <h4 data-astro-cid-mgnpaeam>18% Cadastro Lento</h4> <p data-astro-cid-mgnpaeam>Formulários infinitos são o maior repelente de vendas.</p> </div> </div> </section> <section id="timing" data-astro-cid-mgnpaeam> <h2 class="animate-slide-up" data-astro-cid-mgnpaeam>⏰ O Timing é TUDO</h2> <p data-astro-cid-mgnpaeam>Enviar na hora errada é pedir para ser bloqueado. Enviar na hora certa é fechar a venda.</p> <div class="timeline-box glass-panel blur mt-8" data-astro-cid-mgnpaeam> <div class="timeline-item" data-astro-cid-mgnpaeam> <div class="time-tag" data-astro-cid-mgnpaeam>30 MIN</div> <p data-astro-cid-mgnpaeam><strong data-astro-cid-mgnpaeam>A Abordagem Amigável:</strong> "Aconteceu algum erro no pagamento?"</p> </div> <div class="timeline-item mt-6" data-astro-cid-mgnpaeam> <div class="time-tag" data-astro-cid-mgnpaeam>24 HORAS</div> <p data-astro-cid-mgnpaeam><strong data-astro-cid-mgnpaeam>O Benefício Real:</strong> "Aqui está um cupom para te ajudar a decidir."</p> </div> </div> </section> <section id="scripts" data-astro-cid-mgnpaeam> <h2 class="animate-slide-up" data-astro-cid-mgnpaeam>📝 Scripts de Alta Conversão</h2> <div class="script-card glass-panel mt-8" data-astro-cid-mgnpaeam> <h4 class="text-primary" data-astro-cid-mgnpaeam>O Script Invisível</h4> <div class="script-box glass-panel bg-opacity-10 mt-4 italic" data-astro-cid-mgnpaeam>\n"Oi [Nome]! Vi que o [Produto] ainda está separado aqui no seu carrinho. Quase finalizei pra você, mas achei melhor perguntar se você teve alguma dúvida técnica. Qual é o seu maior desafio hoje com isso?"\n</div> </div> </section> <div class="final-cta animate-scale-up" data-astro-cid-mgnpaeam> <h3 data-astro-cid-mgnpaeam>🚀 Pare de Perder Dinheiro Agora</h3> <p class="mt-4" data-astro-cid-mgnpaeam>Cada carrinho abandonado é um cliente que disse "quase". No WhatsApp, o "quase" vira "com certeza".</p> <div class="cta-buttons mt-8" data-astro-cid-mgnpaeam> <a href="/criar-bot" class="btn-primary" data-astro-cid-mgnpaeam>Ativar Recuperação</a> <a href="/documentacao" class="btn-secondary" data-astro-cid-mgnpaeam>Ver Guia Técnico</a> </div> </div> </div> </article> <script type="application/ld+json">', "<\/script> "])), maybeRenderHead(), unescapeHTML(JSON.stringify(schema))) }), unescapeHTML(JSON.stringify(schema)));
}, "/home/lele/usenexo/getnexo-site/src/pages/blog/carrinho-abandonado.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/blog/carrinho-abandonado.astro";
const $$url = "/blog/carrinho-abandonado";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$CarrinhoAbandonado,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
