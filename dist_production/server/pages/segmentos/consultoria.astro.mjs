import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from "../../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$Layout } from "../../assets/Layout-DScI-qCd.js";
/* empty css                                         */
import { renderers } from "../../renderers.mjs";
const $$Consultoria = createComponent(($$result, $$props, $$slots) => {
  const title = "Automação de Agendamento para Consultores e Serviços | GetNexo";
  const description = "Automatize o agendamento de reuniões e qualificação de clientes. Ideal para advocacia, contabilidade, consultoria e venda de serviços B2B via WhatsApp.";
  const keywords = "whatsapp para advogados, whatsapp para contadores, agendamento reunião whatsapp, automação de consultoria, crm serviços, bot agendamento";
  const stats = [
    { value: "100%", label: "Agenda", desc: "Sincronizada em tempo real" },
    { value: "Quali", label: "Ficação", desc: "Filtro automático de clientes" },
    { value: "Docs", label: "Envio", desc: "Receba PDFs/Fotos no chat" },
    { value: "24/7", label: "Recepção", desc: "Seu escritório nunca fecha" }
  ];
  const painPoints = [
    {
      icon: "📅",
      title: "Vai e Vem de Agenda",
      desc: "'Tem horário terça? Não. E quarta?'. Elimine essa troca de mensagens. O cliente vê seus horários livres e reserva sozinho."
    },
    {
      icon: "⚖️",
      title: "Cliente sem Perfil",
      desc: "Não perca tempo em reuniões com quem não pode pagar seus honorários. A IA faz perguntas filtro (orçamento, tamanho da empresa) antes de liberar a agenda."
    },
    {
      icon: "📂",
      title: "Cobrar Documentos",
      desc: "Automatize o follow-up de documentos pendentes. O sistema cobra o cliente educadamente até ele enviar o que falta."
    }
  ];
  const features = [
    {
      title: "Integração Google/Outlook",
      desc: "Conecte sua agenda pessoal. Assim que o cliente marca no WhatsApp, o horário é bloqueado no seu calendário para evitar conflitos.",
      icon: "🔗"
    },
    {
      title: "Lembretes Automáticos",
      desc: "Reduza o No-Show em reuniões online ou presenciais. Avisos enviados 1 dia antes e 1 hora antes com o link do Zoom/Google Meet.",
      icon: "🔔"
    },
    {
      title: "Gestão de Leads B2B",
      desc: "Kanban visual para acompanhar negociações de alto valor. Mova card de 'Proposta Enviada' para 'Aguardando Contrato' com um clique.",
      icon: "💼"
    }
  ];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": title, "description": description, "keywords": keywords, "data-astro-cid-opy4ctv6": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="segment-hero" data-astro-cid-opy4ctv6> <div class="hero-content" data-astro-cid-opy4ctv6> <div class="badge" data-astro-cid-opy4ctv6>Para Consultores e Prestadores de Serviço</div> <h1 data-astro-cid-opy4ctv6>Sua Agenda Cheia, <span class="text-gradient" data-astro-cid-opy4ctv6>Sem Secretária</span></h1> <p class="hero-text" data-astro-cid-opy4ctv6>
Automatize a entrada de clientes no seu negócio. Qualificação, agendamento e recebimento de documentos no piloto automático.
</p> <div class="hero-btns" data-astro-cid-opy4ctv6> <a href="/criar-bot" class="btn-primary-glow" data-astro-cid-opy4ctv6>Automatizar Minha Agenda</a> <a href="/demo" class="btn-outline" data-astro-cid-opy4ctv6>Ver Agendamento</a> </div> </div> <div class="hero-stats" data-astro-cid-opy4ctv6> ${stats.map((s) => renderTemplate`<div class="stat-item glass-panel" data-astro-cid-opy4ctv6> <span class="stat-val" data-astro-cid-opy4ctv6>${s.value}</span> <span class="stat-lbl" data-astro-cid-opy4ctv6>${s.label}</span> <span class="stat-dsc" data-astro-cid-opy4ctv6>${s.desc}</span> </div>`)} </div> </section> <section class="seo-content" data-astro-cid-opy4ctv6> <h2 data-astro-cid-opy4ctv6>Profissionalismo desde o <span class="text-gradient" data-astro-cid-opy4ctv6>Primeiro "Oi"</span></h2> <p data-astro-cid-opy4ctv6>
Para advogados, contadores e consultores, a imagem é tudo. 
      Quando um cliente potencial entra em contato e recebe um atendimento rápido, organizado e tecnologicamente avançado, seu valor percebido dispara.
</p> <p data-astro-cid-opy4ctv6>
O **GetNexo** atua como um concierge digital. Ele recebe o cliente, entende a demanda (ex: Trabalhista, Tributário, Consultoria Financeira) 
      e encaminha para o sócio especialista ou agenda uma reunião de diagnóstico automaticamente.
</p> </section> <section class="pain-section" data-astro-cid-opy4ctv6> <h2 data-astro-cid-opy4ctv6>Pare de Vender Tempo, Venda Valor</h2> <div class="pain-grid" data-astro-cid-opy4ctv6> ${painPoints.map((p) => renderTemplate`<div class="pain-card glass-panel" data-astro-cid-opy4ctv6> <span class="pain-icon" data-astro-cid-opy4ctv6>${p.icon}</span> <h3 data-astro-cid-opy4ctv6>${p.title}</h3> <p data-astro-cid-opy4ctv6>${p.desc}</p> </div>`)} </div> </section> <section class="features-section" data-astro-cid-opy4ctv6> <h2 data-astro-cid-opy4ctv6>Escritório Digital</h2> <div class="feat-grid" data-astro-cid-opy4ctv6> ${features.map((f) => renderTemplate`<div class="feat-card glass-panel" data-astro-cid-opy4ctv6> <div class="feat-header" data-astro-cid-opy4ctv6> <span class="feat-icon" data-astro-cid-opy4ctv6>${f.icon}</span> <h3 data-astro-cid-opy4ctv6>${f.title}</h3> </div> <p data-astro-cid-opy4ctv6>${f.desc}</p> </div>`)} </div> </section> <section class="deep-dive" data-astro-cid-opy4ctv6> <article data-astro-cid-opy4ctv6> <h3 data-astro-cid-opy4ctv6>Cobrança de Honorários Recorrentes</h3> <p data-astro-cid-opy4ctv6>
Para serviços com mensalidade (contabilidade, assessoria), o GetNexo automatiza o envio de notas fiscais e boletos/PIX mensalmente.
        Em caso de atraso, ele inicia uma régua de cobrança amigável, preservando o relacionamento humano para casos extremos.
</p> <h3 data-astro-cid-opy4ctv6>Workflow de Documentos</h3> <p data-astro-cid-opy4ctv6>
Precisa do RG, Comprovante de Residência e Contrato Social? O bot pede lista. O cliente manda foto pelo WhatsApp. O bot salva tudo numa pasta organizada no Google Drive/Dropbox automaticamente.
        Fim da bagunça de arquivos perdidos no chat.
</p> </article> </section> <section class="final-cta" data-astro-cid-opy4ctv6> <div class="cta-box glass-panel" data-astro-cid-opy4ctv6> <h2 data-astro-cid-opy4ctv6>Otimize seu Tempo Intelectual</h2> <p data-astro-cid-opy4ctv6>Deixe a burocracia de agendamento e triagem com a IA.</p> <a href="/criar-bot" class="btn-primary-glow" data-astro-cid-opy4ctv6>Começar Agora</a> </div> </section> ` })} `;
}, "/home/lele/usenexo/getnexo-site/src/pages/segmentos/consultoria.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/segmentos/consultoria.astro";
const $$url = "/segmentos/consultoria";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Consultoria,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
