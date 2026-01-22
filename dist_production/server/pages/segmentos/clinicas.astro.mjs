import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from "../../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$Layout } from "../../assets/Layout-DScI-qCd.js";
/* empty css                                      */
import { renderers } from "../../renderers.mjs";
const $$Clinicas = createComponent(($$result, $$props, $$slots) => {
  const title = "Agendamento e Confirmação Automática para Clínicas e Médicos | GetNexo";
  const description = "Reduza o 'no-show' da sua clínica em 80% com confirmação automática de consultas via WhatsApp. Agendamento 24h, triagem de pacientes e integração com agenda médica.";
  const keywords = "whatsapp para clinicas, confirmação consulta whatsapp, chatbot medico, agendamento automatico whatsapp, crm saude, automação consultorio";
  const stats = [
    { value: "-80%", label: "Faltas", desc: "Redução drástica de No-Show" },
    { value: "24h", label: "Marcação", desc: "Agende fora do horário comercial" },
    { value: "100%", label: "Seguro", desc: "LGPD Compliance" },
    { value: "Auto", label: "Lembretes", desc: "Envio automático dia antes" }
  ];
  const painPoints = [
    {
      icon: "📅",
      title: "Paciente que falta",
      desc: "O paciente esquece e você perde o horário (e o dinheiro). O GetNexo confirma 24h antes e, se ele cancelar, já avisa a lista de espera."
    },
    {
      icon: "📞",
      title: "Telefone Ocupado",
      desc: "Sua secretária não dá conta de atender e confirmar ao mesmo tempo. Com a automação, ela foca no atendimento presencial de qualidade."
    },
    {
      icon: "📋",
      title: "Triagem Repetitiva",
      desc: "A automação já pergunta: Convênio ou Particular? Primeira vez ou Retorno? Qual especialidade? Entregando o paciente pronto."
    }
  ];
  const features = [
    {
      title: "Integração com Agenda",
      desc: "Google Calendar, Doctoralia ou sistema próprio. O bot vê seus horários livres e oferece apenas o que está disponível.",
      icon: "📆"
    },
    {
      title: "Campanhas de Retorno",
      desc: "O sistema lembra automaticamente pacientes que precisam voltar em 6 meses para check-up, gerando receita recorrente.",
      icon: "🔄"
    },
    {
      title: "Dúvidas Pós-Consulta",
      desc: "Instruções de preparo para exames ou cuidados pós-operatórios enviados automaticamente, reduzindo a ansiedade do paciente.",
      icon: "🩺"
    }
  ];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": title, "description": description, "keywords": keywords, "data-astro-cid-lzrxs5dz": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="segment-hero" data-astro-cid-lzrxs5dz> <div class="hero-content" data-astro-cid-lzrxs5dz> <div class="badge" data-astro-cid-lzrxs5dz>Para Clínicas e Consultórios</div> <h1 data-astro-cid-lzrxs5dz>Acabe com as faltas e <span class="text-gradient" data-astro-cid-lzrxs5dz>lote sua agenda</span></h1> <p class="hero-text" data-astro-cid-lzrxs5dz>
Secretária virtual no WhatsApp que trabalha 24h por dia. Confirma consultas, reagenda horários e tira dúvidas dos pacientes sem ocupar sua recepção.
</p> <div class="hero-btns" data-astro-cid-lzrxs5dz> <a href="/criar-bot" class="btn-primary-glow" data-astro-cid-lzrxs5dz>Automatizar Minha Clínica</a> <a href="/demo" class="btn-outline" data-astro-cid-lzrxs5dz>Simular Agendamento</a> </div> </div> <div class="hero-stats" data-astro-cid-lzrxs5dz> ${stats.map((s) => renderTemplate`<div class="stat-item glass-panel" data-astro-cid-lzrxs5dz> <span class="stat-val" data-astro-cid-lzrxs5dz>${s.value}</span> <span class="stat-lbl" data-astro-cid-lzrxs5dz>${s.label}</span> <span class="stat-dsc" data-astro-cid-lzrxs5dz>${s.desc}</span> </div>`)} </div> </section> <section class="seo-content" data-astro-cid-lzrxs5dz> <h2 data-astro-cid-lzrxs5dz>A revolução no atendimento de <span class="text-gradient" data-astro-cid-lzrxs5dz>Saúde</span></h2> <p data-astro-cid-lzrxs5dz>
A experiência do paciente começa muito antes dele entrar no consultório. Começa quando ele tenta marcar a consulta. 
      Se ele precisa ligar 3 vezes ou esperar 4 horas por uma resposta no WhatsApp, ele procura outro profissional.
</p> <p data-astro-cid-lzrxs5dz>
Com o **GetNexo Saúde**, você oferece uma experiência premium. O paciente manda mensagem domingo à noite e sai com a consulta agendada para terça-feira. 
      A percepção de profissionalismo e eficiência da sua clínica aumenta imediatamente.
</p> </section> <section class="pain-section" data-astro-cid-lzrxs5dz> <h2 data-astro-cid-lzrxs5dz>Sintomas de uma gestão manual</h2> <div class="pain-grid" data-astro-cid-lzrxs5dz> ${painPoints.map((p) => renderTemplate`<div class="pain-card glass-panel" data-astro-cid-lzrxs5dz> <span class="pain-icon" data-astro-cid-lzrxs5dz>${p.icon}</span> <h3 data-astro-cid-lzrxs5dz>${p.title}</h3> <p data-astro-cid-lzrxs5dz>${p.desc}</p> </div>`)} </div> </section> <section class="features-section" data-astro-cid-lzrxs5dz> <h2 data-astro-cid-lzrxs5dz>Tratamento Completo</h2> <div class="feat-grid" data-astro-cid-lzrxs5dz> ${features.map((f) => renderTemplate`<div class="feat-card glass-panel" data-astro-cid-lzrxs5dz> <div class="feat-header" data-astro-cid-lzrxs5dz> <span class="feat-icon" data-astro-cid-lzrxs5dz>${f.icon}</span> <h3 data-astro-cid-lzrxs5dz>${f.title}</h3> </div> <p data-astro-cid-lzrxs5dz>${f.desc}</p> </div>`)} </div> </section> <section class="deep-dive" data-astro-cid-lzrxs5dz> <article data-astro-cid-lzrxs5dz> <h3 data-astro-cid-lzrxs5dz>Inteligência Artificial na Triagem</h3> <p data-astro-cid-lzrxs5dz>
Ao contrário de "chatbots burros" que frustram pacientes com menus infinitos, nossa **IA Generativa** entende linguagem natural. 
        O paciente pode dizer: <em data-astro-cid-lzrxs5dz>"Doutor, meu filho está com febre desde ontem, tem horário hoje?"</em>
E a IA responde com empatia, verificando urgência e encaixes, ou orientando ir ao pronto-socorro se configurado para emergências.
</p> <h3 data-astro-cid-lzrxs5dz>Marketing Médico Ético</h3> <p data-astro-cid-lzrxs5dz>
Mantenha sua base ativa respeitando as normas. O GetNexo permite enviar mensagens informativas de saúde, lembretes de vacinas ou campanhas de check-up (Novembro Azul, Outubro Rosa) para seus pacientes cadastrados, 
        fortalecendo o vínculo médico-paciente e a fidelização.
</p> </article> </section> <section class="final-cta" data-astro-cid-lzrxs5dz> <div class="cta-box glass-panel" data-astro-cid-lzrxs5dz> <h2 data-astro-cid-lzrxs5dz>Modernize seu Consultório</h2> <p data-astro-cid-lzrxs5dz>Teste gratuitamente e veja a diferença na rotina da sua recepção.</p> <a href="/criar-bot" class="btn-primary-glow" data-astro-cid-lzrxs5dz>Começar Agora</a> </div> </section> ` })} `;
}, "/home/lele/usenexo/getnexo-site/src/pages/segmentos/clinicas.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/segmentos/clinicas.astro";
const $$url = "/segmentos/clinicas";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Clinicas,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
