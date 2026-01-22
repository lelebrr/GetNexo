import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from "../../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$Layout } from "../../assets/Layout-DScI-qCd.js";
/* empty css                                    */
import { renderers } from "../../renderers.mjs";
const $$Outros = createComponent(($$result, $$props, $$slots) => {
  const title = "Automação WhatsApp para Qualquer Negócio | GetNexo";
  const description = "Turismo, Eventos, Varejo, Estética, Automotivo e muito mais. Adapte o GetNexo para automatizar o antendimento e vendas do seu nicho específico.";
  const keywords = "whatsapp para turismo, whatsapp para eventos, crm automotivo whatsapp, bot para varejo, atendimento automatizado whatsapp, api whatsapp business";
  const stats = [
    { value: "100%", label: "Adaptável", desc: "Fluxos customizáveis (Arrastar e Soltar)" },
    { value: "API", label: "Aberta", desc: "Conecte com seu sistema via Webhooks" },
    { value: "IA", label: "Treinável", desc: "Aprende com seus PDFs e manuais" },
    { value: "Multi", label: "Canal", desc: "WhatsApp, Instagram e Webchat" }
  ];
  const painPoints = [
    {
      icon: "🧩",
      title: "Meu Negócio é Único",
      desc: "Você acha que 'robô de prateleira' não serve pra você? Nosso construtor de fluxos permite desenhar qualquer processo: check-in de hotel, agendamento de revisão de carro, venda de ingresso..."
    },
    {
      icon: "🔌",
      title: "Sistema Legado",
      desc: "Você usa um ERP antigo? Sem problemas. O GetNexo conecta via API/Webhook para consultar estoque, status de pedido ou saldo de cliente em tempo real."
    },
    {
      icon: "🌍",
      title: "Atendimento Bilíngue",
      desc: "Para turismo e hotelaria: A IA do GetNexo detecta o idioma do cliente e responde em Inglês, Espanhol ou Francês automaticamente."
    }
  ];
  const features = [
    {
      title: "Construtor de Fluxos (No-Code)",
      desc: "Desenhe sua árvore de decisão. 'Se cliente digitar 1, faça isso. Se tiver saldo X, faça aquilo'. Tudo visual, sem código.",
      icon: "🛠️"
    },
    {
      title: "Treinamento com Documentos",
      desc: "Tem um manual de 500 páginas sobre seus produtos ou normas? Faça upload do PDF e a IA vira especialista no seu negócio em 2 minutos.",
      icon: "🧠"
    },
    {
      title: "Agendamento de Eventos",
      desc: "Ideal para casas noturnas e workshops. Venda ingressos, gere QR Code e envie lembretes automáticos na véspera.",
      icon: "🎟️"
    }
  ];
  const segments = [
    { name: "Turismo & Hotelaria", desc: "Check-in, Concierge Virtual e Venda de Passeios" },
    { name: "Automotivo", desc: "Agendamento de Revisão, Venda de Peças e Test-drive" },
    { name: "Beleza & Estética", desc: "Agenda de procedimentos e lembretes de retorno" },
    { name: "Varejo Físico", desc: "Catálogo, Drive-thru e Clube de Fidelidade" },
    { name: "ONGs", desc: "Captação de doações e relacionamento com voluntários" },
    { name: "Logística", desc: "Rastreio de encomendas e aviso de entrega" }
  ];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": title, "description": description, "keywords": keywords, "data-astro-cid-ekowfnwj": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="segment-hero" data-astro-cid-ekowfnwj> <div class="hero-content" data-astro-cid-ekowfnwj> <div class="badge" data-astro-cid-ekowfnwj>Para Todos os Segmentos</div> <h1 data-astro-cid-ekowfnwj>A Automação que se <span class="text-gradient" data-astro-cid-ekowfnwj>Moldam ao Seu Negócio</span></h1> <p class="hero-text" data-astro-cid-ekowfnwj>
Não importa se você vende viagens, peças de carro ou ingressos. Se o seu cliente usa WhatsApp, o GetNexo funciona para você.
</p> <div class="hero-btns" data-astro-cid-ekowfnwj> <a href="/criar-bot" class="btn-primary-glow" data-astro-cid-ekowfnwj>Criar Fluxo Personalizado</a> <a href="/demo" class="btn-outline" data-astro-cid-ekowfnwj>Ver API</a> </div> </div> <div class="hero-stats" data-astro-cid-ekowfnwj> ${stats.map((s) => renderTemplate`<div class="stat-item glass-panel" data-astro-cid-ekowfnwj> <span class="stat-val" data-astro-cid-ekowfnwj>${s.value}</span> <span class="stat-lbl" data-astro-cid-ekowfnwj>${s.label}</span> <span class="stat-dsc" data-astro-cid-ekowfnwj>${s.desc}</span> </div>`)} </div> </section> <section class="seo-content" data-astro-cid-ekowfnwj> <h2 data-astro-cid-ekowfnwj>Flexibilidade Total com <span class="text-gradient" data-astro-cid-ekowfnwj>No-Code + IA</span></h2> <p data-astro-cid-ekowfnwj>
Muitas ferramentas de mercado te obrigam a seguir o "jeito deles". O GetNexo te dá uma tela em branco e ferramentas poderosas.
</p> <p data-astro-cid-ekowfnwj>
Você pode criar um funil simples de atendimento ou uma integração complexa que consulta seu banco de dados SQL, gera um PDF dinâmico e envia para o cliente. O limite é sua criatividade.
</p> </section> <section class="pain-section" data-astro-cid-ekowfnwj> <h2 data-astro-cid-ekowfnwj>Versatilidade para nichos específicos</h2> <div class="pain-grid" data-astro-cid-ekowfnwj> ${painPoints.map((p) => renderTemplate`<div class="pain-card glass-panel" data-astro-cid-ekowfnwj> <span class="pain-icon" data-astro-cid-ekowfnwj>${p.icon}</span> <h3 data-astro-cid-ekowfnwj>${p.title}</h3> <p data-astro-cid-ekowfnwj>${p.desc}</p> </div>`)} </div> </section> <section class="features-section" data-astro-cid-ekowfnwj> <h2 data-astro-cid-ekowfnwj>Ferramentas Universais</h2> <div class="feat-grid" data-astro-cid-ekowfnwj> ${features.map((f) => renderTemplate`<div class="feat-card glass-panel" data-astro-cid-ekowfnwj> <div class="feat-header" data-astro-cid-ekowfnwj> <span class="feat-icon" data-astro-cid-ekowfnwj>${f.icon}</span> <h3 data-astro-cid-ekowfnwj>${f.title}</h3> </div> <p data-astro-cid-ekowfnwj>${f.desc}</p> </div>`)} </div> </section> <section class="deep-dive" data-astro-cid-ekowfnwj> <article data-astro-cid-ekowfnwj> <h3 data-astro-cid-ekowfnwj>Outros Segmentos Atendidos</h3> <p data-astro-cid-ekowfnwj>O GetNexo já está operando em diversas verticais. Veja alguns exemplos de uso:</p> <div class="segments-grid" data-astro-cid-ekowfnwj> ${segments.map((s) => renderTemplate`<div class="seg-item" data-astro-cid-ekowfnwj> <strong data-astro-cid-ekowfnwj>${s.name}</strong> <span data-astro-cid-ekowfnwj>${s.desc}</span> </div>`)} </div> <h3 data-astro-cid-ekowfnwj>API para Desenvolvedores</h3> <p data-astro-cid-ekowfnwj>
Tem equipe de TI? Use nossa API REST e Webhooks para conectar o WhatsApp ao seu CRM proprietário, ERP SAP/Totvs ou qualquer sistema legado.
        Documentação completa e Swagger disponível.
</p> </article> </section> <section class="final-cta" data-astro-cid-ekowfnwj> <div class="cta-box glass-panel" data-astro-cid-ekowfnwj> <h2 data-astro-cid-ekowfnwj>Não achou seu segmento?</h2> <p data-astro-cid-ekowfnwj>Fale com nossos consultores. Desenhamos a solução sob medida para você.</p> <a href="/contato" class="btn-primary-glow" data-astro-cid-ekowfnwj>Falar com Consultor</a> </div> </section> ` })} `;
}, "/home/lele/usenexo/getnexo-site/src/pages/segmentos/outros.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/segmentos/outros.astro";
const $$url = "/segmentos/outros";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Outros,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
