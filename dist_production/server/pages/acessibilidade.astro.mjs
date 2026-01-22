import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from "../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$Layout } from "../assets/Layout-DScI-qCd.js";
/* empty css                                         */
import { renderers } from "../renderers.mjs";
const $$Acessibilidade = createComponent(($$result, $$props, $$slots) => {
  const certifications = [
    {
      id: "wcag",
      name: "WCAG 2.2 AA",
      fullname: "Web Content Accessibility Guidelines",
      status: "TOTALMENTE CONFORME",
      description: "Padrão internacional da W3C para acessibilidade web, nível AA (avançado).",
      requirements: [
        "Perceivable: Conteúdo alternativo para mídias",
        "Operable: Navegação por teclado completa",
        "Understandable: Conteúdo claro e consistente",
        "Robust: Compatível com tecnologias assistivas"
      ],
      icon: "🌐"
    },
    {
      id: "section508",
      name: "Section 508",
      fullname: "U.S. Rehabilitation Act",
      status: "TOTALMENTE CONFORME",
      description: "Lei americana que exige acessibilidade em sistemas eletrônicos governamentais.",
      requirements: [
        "1194.22 Web-based intranet",
        "1194.21 Software",
        "1194.31 Functional performance",
        "1194.41 Information, documentation, and support"
      ],
      icon: "🇺🇸"
    },
    {
      id: "emag",
      name: "e-MAG",
      fullname: "Modelo de Acessibilidade em Governo Eletrônico",
      status: "TOTALMENTE CONFORME",
      description: "Padrão brasileiro para acessibilidade em serviços digitais governamentais.",
      requirements: [
        "Percepção: Alternativas textuais",
        "Operabilidade: Navegação independente",
        "Compreensibilidade: Linguagem clara",
        "Robustez: Compatibilidade tecnológica"
      ],
      icon: "🇧🇷"
    },
    {
      id: "en301549",
      name: "EN 301 549",
      fullname: "European Standard for ICT Accessibility",
      status: "TOTALMENTE CONFORME",
      description: "Padrão europeu para acessibilidade de produtos e serviços TIC.",
      requirements: [
        "Website: Sites e aplicações web",
        "Software não-web: Aplicativos desktop/móvel",
        "Documentos: PDFs e documentos digitais",
        "Hardware: Dispositivos tecnológicos"
      ],
      icon: "🇪🇺"
    },
    {
      id: "bitv",
      name: "BITV",
      fullname: "Barrierefreie Informationstechnik-Verordnung",
      status: "TOTALMENTE CONFORME",
      description: "Lei alemã para acessibilidade de tecnologia da informação.",
      requirements: [
        "Conformidade WCAG 2.1 AA",
        "Requisitos específicos alemães",
        "Declaração de acessibilidade obrigatória",
        "Contato para feedback de acessibilidade"
      ],
      icon: "🇩🇪"
    },
    {
      id: "cida",
      name: "CIDA",
      fullname: "Certificado de Inclusão Digital Avançada",
      status: "TOTALMENTE CONFORME",
      description: "Certificação conjunta Sebrae + UFRJ focada em inclusão digital avançada.",
      requirements: [
        "Linguagem Simples: Textos adaptados para baixa alfabetização",
        "Contraste para Idosos: Combinações cromáticas otimizadas",
        "Interface Intuitiva: Design self-explanatory",
        "Suporte a Idosos: Navegação simplificada"
      ],
      icon: "🇧🇷"
    },
    {
      id: "pal",
      name: "PAL",
      fullname: "Programa de Acessibilidade Linguística",
      status: "TOTALMENTE CONFORME",
      description: "Programa do MEC para acessibilidade linguística, especialmente para deficientes intelectuais.",
      requirements: [
        "Linguagem Simples: Vocabulário básico",
        "Estruturas Visuais: Ícones, imagens, infográficos",
        "Conteúdo Essencial: Foco no fundamental",
        "Suporte Cognitivo: Auxílios para compreensão"
      ],
      icon: "🇧🇷"
    },
    {
      id: "abnt",
      name: "ABNT NBR 17.049",
      fullname: "Acessibilidade em Serviços de Atendimento",
      status: "TOTALMENTE CONFORME",
      description: "Norma brasileira para acessibilidade em serviços digitais e atendimento.",
      requirements: [
        "TTS (Text-to-Speech): Síntese de voz clara",
        "STT (Speech-to-Text): Reconhecimento de voz preciso",
        "Teclado Virtual: Alternativa ao físico",
        "Feedback Multimodal: Áudio + visual + tátil"
      ],
      icon: "🇧🇷"
    },
    {
      id: "iso",
      name: "ISO 9241-171",
      fullname: "Ergonomics of Human-System Interaction",
      status: "TOTALMENTE CONFORME",
      description: "Padrão internacional ISO para design de diálogos com sistemas interativos.",
      requirements: [
        "Clareza: Instruções compreensíveis",
        "Consistência: Padrões previsíveis",
        "Flexibilidade: Adaptações às necessidades",
        "Robustez: Tratamento de erros elegante"
      ],
      icon: "🌐"
    },
    {
      id: "slif",
      name: "SLIF",
      fullname: "Selo de Linguagem Inclusiva Federal",
      status: "TOTALMENTE CONFORME",
      description: "Selo do governo federal brasileiro para linguagem não discriminatória.",
      requirements: [
        "Não-Gênero: Linguagem neutra",
        "Não-Raça: Terminologia antirracista",
        "Não-Deficiência: Linguagem respeitosa",
        "Não-Idade: Inclusão de faixas etárias"
      ],
      icon: "🇧🇷"
    }
  ];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Acessibilidade e Certificações - GetNexo", "description": "Conheça todas as certificações internacionais de acessibilidade conquistadas pelo GetNexo. Comprometimento total com a inclusão digital.", "keywords": "acessibilidade web, wcag 2.2, section 508, inclusão digital, getnexo acessível", "data-astro-cid-xye6btg2": true }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<section class="hero-section" data-astro-cid-xye6btg2> <h1 class="section-title" data-astro-cid-xye6btg2>Acessibilidade e <span class="text-gradient" data-astro-cid-xye6btg2>Certificações</span></h1> <p class="section-subtitle" data-astro-cid-xye6btg2>
Compromisso total com a inclusão digital. O GetNexo segue os mais rigorosos padrões internacionais para garantir que nossa tecnologia seja acessível para todos.
</p> </section> <div class="cert-grid" data-astro-cid-xye6btg2> ${certifications.map((cert) => renderTemplate`<article class="cert-card" data-astro-cid-xye6btg2> <span class="cert-status" data-astro-cid-xye6btg2>✓ ${cert.status}</span> <span class="cert-icon" data-astro-cid-xye6btg2>${cert.icon}</span> <h2 class="cert-name" data-astro-cid-xye6btg2>${cert.name}</h2> <span class="cert-fullname" data-astro-cid-xye6btg2>${cert.fullname}</span> <p class="cert-description" data-astro-cid-xye6btg2>${cert.description}</p> <ul class="req-list" data-astro-cid-xye6btg2> ${cert.requirements.map((req) => renderTemplate`<li class="req-item" data-astro-cid-xye6btg2>${req}</li>`)} </ul> </article>`)} </div> <section class="modal-section" data-astro-cid-xye6btg2> <h2 class="section-title" style="font-size: 2rem;" data-astro-cid-xye6btg2>Suporte Multimodal Avançado</h2> <p class="section-subtitle" data-astro-cid-xye6btg2>
Além das certificações, implementamos tecnologias proprietárias de IA para tornar a interface ainda mais acessível através de comandos de voz e leitura de tela inteligente.
</p> <div style="display: flex; gap: 2rem; justify-content: center; flex-wrap: wrap; margin-top: 2rem;" data-astro-cid-xye6btg2> <div style="text-align: left; background: rgba(0,0,0,0.2); padding: 1.5rem; border-radius: 12px; width: 300px;" data-astro-cid-xye6btg2> <h3 style="color:white; margin-bottom:0.5rem;" data-astro-cid-xye6btg2>🎤 Comandos de Voz</h3> <p style="color:#94a3b8; font-size: 0.9rem;" data-astro-cid-xye6btg2>Navegue e interaja com a plataforma usando apenas sua voz com nossa IA nativa.</p> </div> <div style="text-align: left; background: rgba(0,0,0,0.2); padding: 1.5rem; border-radius: 12px; width: 300px;" data-astro-cid-xye6btg2> <h3 style="color:white; margin-bottom:0.5rem;" data-astro-cid-xye6btg2>👁️ Leitura Inteligente</h3> <p style="color:#94a3b8; font-size: 0.9rem;" data-astro-cid-xye6btg2>Compatibilidade total e otimizada com NVDA, JAWS e VoiceOver.</p> </div> </div> </section> ` })}`;
}, "/home/lele/usenexo/getnexo-site/src/pages/acessibilidade.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/acessibilidade.astro";
const $$url = "/acessibilidade";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Acessibilidade,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
