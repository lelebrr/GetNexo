import { f as createComponent, k as renderComponent, r as renderTemplate, u as unescapeHTML, m as maybeRenderHead } from "../../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$Layout } from "../../assets/Layout-DScI-qCd.js";
/* empty css                                 */
import { renderers } from "../../renderers.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Wsl = createComponent(($$result, $$props, $$slots) => {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "headline": "WSL + GetNexo: IA de Vendas em PC de 8GB com Segurança Máxima",
        "description": "Como rodar assistente de vendas IA no WSL em PC de 8GB. Segurança completa, sem risco de ban, arquitetura zero-trust e performance otimizada.",
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
        "datePublished": "2026-01-19",
        "dateModified": "2026-01-19",
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": "https://getnexo.com.br/blog/wsl"
        },
        "articleSection": "Technical Setup",
        "wordCount": "2000",
        "timeRequired": "PT15M",
        "image": {
          "@type": "ImageObject",
          "url": "https://getnexo.com.br/images/blog/wsl-getnexo-pc-8gb.jpg",
          "width": 1200,
          "height": 630
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "ratingCount": "523",
          "bestRating": "5",
          "worstRating": "1"
        },
        "about": [
          {
            "@type": "SoftwareApplication",
            "name": "Windows Subsystem for Linux"
          },
          {
            "@type": "Thing",
            "name": "Computador de Baixo Custo"
          },
          {
            "@type": "Thing",
            "name": "Segurança de Dados"
          }
        ],
        "mentions": [
          {
            "@type": "SoftwareApplication",
            "name": "GetNexo"
          },
          {
            "@type": "SoftwareApplication",
            "name": "WSL2"
          },
          {
            "@type": "SoftwareApplication",
            "name": "Docker"
          }
        ]
      },
      {
        "@type": "HowTo",
        "name": "Como Configurar GetNexo no WSL em PC de 8GB",
        "description": "Guia passo a passo para instalar e configurar GetNexo no WSL2 em computadores com apenas 8GB de RAM.",
        "totalTime": "PT30M",
        "supply": [
          {
            "@type": "HowToItem",
            "name": "PC Windows 10/11 com 8GB RAM"
          },
          {
            "@type": "HowToItem",
            "name": "20GB espaço livre em SSD"
          },
          {
            "@type": "HowToItem",
            "name": "Processador Intel i5 ou superior"
          }
        ],
        "step": [
          {
            "@type": "HowToStep",
            "name": "Habilitar WSL2 no Windows",
            "text": "Ativar subsistema Windows para Linux 2 através do PowerShell como administrador.",
            "position": 1,
            "image": "https://getnexo.com.br/images/tutorial/wsl2-enable.jpg"
          },
          {
            "@type": "HowToStep",
            "name": "Instalar distribuição Linux",
            "text": "Instalar Ubuntu ou outra distribuição Linux compatível através da Microsoft Store.",
            "position": 2,
            "image": "https://getnexo.com.br/images/tutorial/ubuntu-install.jpg"
          },
          {
            "@type": "HowToStep",
            "name": "Instalar Docker Desktop",
            "text": "Configurar Docker Desktop com integração WSL2 para isolamento de aplicações.",
            "position": 3,
            "image": "https://getnexo.com.br/images/tutorial/docker-wsl.jpg"
          },
          {
            "@type": "HowToStep",
            "name": "Configurar GetNexo",
            "text": "Fazer download e configuração inicial do GetNexo com parâmetros otimizados para baixo consumo.",
            "position": 4,
            "image": "https://getnexo.com.br/images/tutorial/getnexo-wsl-setup.jpg"
          }
        ],
        "tool": [
          {
            "@type": "HowToTool",
            "name": "Windows PowerShell"
          },
          {
            "@type": "HowToTool",
            "name": "WSL2"
          },
          {
            "@type": "HowToTool",
            "name": "Docker Desktop"
          }
        ],
        "result": {
          "@type": "Thing",
          "name": "Instalação completa do GetNexo rodando em PC de baixo custo com segurança máxima"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Meu PC de 8GB consegue rodar IA de vendas?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sim! O GetNexo é otimizado para baixo consumo. Com WSL2 e Docker, roda perfeitamente em PCs com 8GB RAM, usando apenas 2-3GB durante operação normal."
            }
          },
          {
            "@type": "Question",
            "name": "É seguro rodar no meu PC pessoal?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Extremamente seguro! Arquitetura zero-trust: dados ficam locais, criptografia AES-256, Cloudflare Tunnel protege conexões. Nada sai do seu PC sem autorização."
            }
          },
          {
            "@type": "Question",
            "name": "O WSL2 afeta performance do Windows?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Não! WSL2 é integrado ao Windows e roda em background. O impacto é mínimo - similar a executar qualquer aplicação comum."
            }
          },
          {
            "@type": "Question",
            "name": "Preciso de placa de vídeo para IA?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Não obrigatório. Usamos modelos otimizados que rodam na CPU. GPU acelera processamento, mas não é necessária para funcionamento básico."
            }
          },
          {
            "@type": "Question",
            "name": "Posso usar em notebook antigo?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sim! Notebooks com i5 de 8ª geração ou superior funcionam perfeitamente. O importante é ter SSD para boa performance."
            }
          }
        ]
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://getnexo.com.br" },
          { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://getnexo.com.br/blog" },
          { "@type": "ListItem", "position": 3, "name": "WSL Setup", "item": "https://getnexo.com.br/blog/wsl" }
        ]
      },
      // Speakable Schema for Voice Search & AI Overviews
      {
        "@type": "SpeakableSpecification",
        "cssSelector": [".speakable-content", "[data-speakable='true']", "h1", "h2", ".stat-number", ".subtitle", ".final-cta h3", ".final-cta p"],
        "xpath": ["/html/head/title", "//h1", "//h2[contains(text(), 'WSL')]", "//div[contains(@class, 'tech-stats')]//span[contains(@class, 'stat-number')]", "//div[contains(@class, 'final-cta')]//h3"]
      },
      // WebPage additional markup
      {
        "@type": "WebPage",
        "@id": "https://getnexo.com.br/blog/wsl#webpage",
        "url": "https://getnexo.com.br/blog/wsl",
        "name": "WSL GetNexo: IA Vendas em PC 8GB | Segurança Máxima Sem Ban",
        "isPartOf": { "@type": "WebSite", "@id": "https://getnexo.com.br#website", "name": "GetNexo Blog", "url": "https://getnexo.com.br/blog" },
        "datePublished": "2026-01-19T10:00:00+00:00",
        "dateModified": "2026-01-19T14:00:00+00:00",
        "description": "Rodar GetNexo no WSL: assistente de vendas IA em PC de 8GB sem lag.",
        "inLanguage": "pt-BR",
        "potentialAction": [{ "@type": "ReadAction", "target": "https://getnexo.com.br/blog/wsl" }],
        "mainEntity": { "@id": "https://getnexo.com.br/blog/wsl#article" },
        "speakable": { "@type": "SpeakableSpecification", "cssSelector": [".speakable-content", "h1", ".subtitle", ".stat-number"] },
        "about": [{ "@type": "Thing", "name": "WSL2 Setup" }, { "@type": "Thing", "name": "Low-Cost AI Deployment" }],
        "mentions": [{ "@type": "Brand", "name": "GetNexo", "url": "https://getnexo.com.br" }, { "@type": "SoftwareApplication", "name": "WSL2" }, { "@type": "SoftwareApplication", "name": "Docker" }],
        "primaryImageOfPage": { "@type": "ImageObject", "url": "https://getnexo.com.br/images/blog/wsl-getnexo-pc-8gb.jpg", "width": 1200, "height": 630, "caption": "WSL GetNexo PC 8GB" }
      }
    ]
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "data-astro-cid-vz3kmytd": true }, { "default": ($$result2) => renderTemplate(_a || (_a = __template([" ", '<article class="post-container" data-astro-cid-vz3kmytd> <header class="post-header" data-astro-cid-vz3kmytd> <div class="meta animate-fade-in" data-astro-cid-vz3kmytd>Setup Técnico • Jan 2026</div> <h1 class="animate-slide-up" data-astro-cid-vz3kmytd>IA de Vendas em <span class="text-primary" data-astro-cid-vz3kmytd>PC de 8GB?</span><br data-astro-cid-vz3kmytd>O Poder do WSL + GetNexo</h1> <p class="subtitle animate-fade-in delay-200" data-astro-cid-vz3kmytd>Segurança total, sem lag e sem risco de banimento. Descubra como rodar sua operação soberana no seu próprio hardware.</p> <div class="tech-stats" data-astro-cid-vz3kmytd> <div class="stat-item animate-scale-up" data-astro-cid-vz3kmytd> <span class="stat-number" data-astro-cid-vz3kmytd>8GB</span> <span class="stat-label" data-astro-cid-vz3kmytd>RAM Mínima</span> </div> <div class="stat-item animate-scale-up delay-100" data-astro-cid-vz3kmytd> <span class="stat-number" data-astro-cid-vz3kmytd>100%</span> <span class="stat-label" data-astro-cid-vz3kmytd>Soberania</span> </div> <div class="stat-item animate-scale-up delay-200" data-astro-cid-vz3kmytd> <span class="stat-number" data-astro-cid-vz3kmytd>Zero</span> <span class="stat-label" data-astro-cid-vz3kmytd>Risco de Ban</span> </div> </div> </header> <div class="post-content" data-astro-cid-vz3kmytd> <nav class="table-of-contents glass-panel" data-astro-cid-vz3kmytd> <h3 data-astro-cid-vz3kmytd>📋 Guia de Implementação</h3> <ol data-astro-cid-vz3kmytd> <li data-astro-cid-vz3kmytd><a href="#vantage" data-astro-cid-vz3kmytd>Vantagens do WSL2</a></li> <li data-astro-cid-vz3kmytd><a href="#requisitos" data-astro-cid-vz3kmytd>Requisitos de Hardware</a></li> <li data-astro-cid-vz3kmytd><a href="#seguranca" data-astro-cid-vz3kmytd>Arquitetura Zero-Trust</a></li> <li data-astro-cid-vz3kmytd><a href="#anti-ban" data-astro-cid-vz3kmytd>Inteligência Anti-Ban</a></li> </ol> </nav> <section id="vantage" data-astro-cid-vz3kmytd> <h2 class="animate-slide-up" data-astro-cid-vz3kmytd>🚀 Por que WSL2?</h2> <p data-astro-cid-vz3kmytd>O <strong data-astro-cid-vz3kmytd>Windows Subsystem for Linux (WSL2)</strong> é a ponte perfeita. Ele permite que você execute um kernel Linux real dentro do seu Windows, garantindo que o Docker rode com performance nativa e consumo mínimo de recursos.</p> <div class="feature-grid grid md:grid-cols-2 gap-4" data-astro-cid-vz3kmytd> <div class="feature-card glass-panel" data-astro-cid-vz3kmytd> <h4 data-astro-cid-vz3kmytd>Performance</h4> <p data-astro-cid-vz3kmytd>Acesso direto ao hardware sem a lentidão de máquinas virtuais tradicionais.</p> </div> <div class="feature-card glass-panel" data-astro-cid-vz3kmytd> <h4 data-astro-cid-vz3kmytd>Isolamento</h4> <p data-astro-cid-vz3kmytd>Sua IA roda em um ambiente protegido, sem interferir no seu Windows pessoal.</p> </div> </div> </section> <section id="requisitos" data-astro-cid-vz3kmytd> <h2 class="animate-slide-up" data-astro-cid-vz3kmytd>💻 Hardware Necessário</h2> <p data-astro-cid-vz3kmytd>Esqueça servidores de R$ 500/mês. Você já tem o que precisa:</p> <div class="requirements-box glass-panel blur" data-astro-cid-vz3kmytd> <ul class="space-y-3" data-astro-cid-vz3kmytd> <li data-astro-cid-vz3kmytd>✅ <strong data-astro-cid-vz3kmytd>CPU:</strong> Intel i5 / Ryzen 3 ou superior</li> <li data-astro-cid-vz3kmytd>✅ <strong data-astro-cid-vz3kmytd>RAM:</strong> 8GB (trabalhando em PC comum)</li> <li data-astro-cid-vz3kmytd>✅ <strong data-astro-cid-vz3kmytd>Disco:</strong> SSD com 20GB livres (crítico para velocidade)</li> <li data-astro-cid-vz3kmytd>✅ <strong data-astro-cid-vz3kmytd>OS:</strong> Windows 10/11 atualizado</li> </ul> </div> </section> <section id="seguranca" data-astro-cid-vz3kmytd> <h2 class="animate-slide-up" data-astro-cid-vz3kmytd>🛡️ Arquitetura Zero-Trust</h2> <p data-astro-cid-vz3kmytd>O GetNexo no WSL não apenas roda sua IA, ele protege seus dados como um cofre digital:</p> <div class="security-steps grid md:grid-cols-2 gap-6 mt-8" data-astro-cid-vz3kmytd> <div class="step-card glass-panel" data-astro-cid-vz3kmytd> <span class="step-num" data-astro-cid-vz3kmytd>01</span> <h4 data-astro-cid-vz3kmytd>Zero Portas Abertas</h4> <p data-astro-cid-vz3kmytd>Nenhuma invasão externa é possível através do seu roteador.</p> </div> <div class="step-card glass-panel" data-astro-cid-vz3kmytd> <span class="step-num" data-astro-cid-vz3kmytd>02</span> <h4 data-astro-cid-vz3kmytd>Cloudflare Tunnel</h4> <p data-astro-cid-vz3kmytd>Conexão criptografada de ponta a ponta sem expor seu IP real.</p> </div> </div> </section> <section id="anti-ban" data-astro-cid-vz3kmytd> <h2 class="animate-slide-up" data-astro-cid-vz3kmytd>🚫 Inteligência Anti-Ban</h2> <p data-astro-cid-vz3kmytd>O maior medo de quem automatiza é perder o número. No WSL, o GetNexo simula um comportamento 100% humano:</p> <div class="anti-ban-list glass-panel" data-astro-cid-vz3kmytd> <p data-astro-cid-vz3kmytd><strong data-astro-cid-vz3kmytd>Estratégias Ativas:</strong></p> <ul class="mt-4 space-y-2" data-astro-cid-vz3kmytd> <li data-astro-cid-vz3kmytd>• Emulação de digitador real (velocidade variável)</li> <li data-astro-cid-vz3kmytd>• Intervalos randômicos entre mensagens</li> <li data-astro-cid-vz3kmytd>• IP mascarado via Túnel Cloudflare</li> <li data-astro-cid-vz3kmytd>• Conexão estável via Kernel Linux</li> </ul> </div> </section> <div class="final-cta animate-scale-up" data-astro-cid-vz3kmytd> <h3 data-astro-cid-vz3kmytd>🚀 Pronto para Transformar seu PC?</h3> <p class="mt-4" data-astro-cid-vz3kmytd>Comece sua operação soberana hoje mesmo. Menos custo, mais segurança, lucro máximo.</p> <div class="cta-buttons mt-8" data-astro-cid-vz3kmytd> <a href="/documentacao" class="btn-primary" data-astro-cid-vz3kmytd>Ver Passo a Passo</a> <a href="/criar-bot" class="btn-secondary" data-astro-cid-vz3kmytd>Testar Agora</a> </div> </div> </div> </article> <script type="application/ld+json">', "<\/script> "])), maybeRenderHead(), unescapeHTML(JSON.stringify(schema))) })}  `;
}, "/home/lele/usenexo/getnexo-site/src/pages/blog/wsl.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/blog/wsl.astro";
const $$url = "/blog/wsl";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Wsl,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
