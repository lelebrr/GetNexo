import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from "../../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$Layout } from "../../assets/Layout-DScI-qCd.js";
/* empty css                                 */
import { renderers } from "../../renderers.mjs";
const $$Crm = createComponent(($$result, $$props, $$slots) => {
  const title = "CRM WhatsApp: Kanban, Multi-Agente e Analytics | GetNexo";
  const description = "Gestão completa de leads no WhatsApp. Kanban visual, atendimento multi-agente, histórico unificado, SLA automático e relatórios de performance em tempo real.";
  const keywords = "crm whatsapp, kanban whatsapp, multi agente whatsapp, gestão leads whatsapp, atendimento equipe whatsapp, pipeline vendas whatsapp, getnexo crm, helpdesk whatsapp";
  const stats = [
    { value: "3x", label: "mais produtivo", desc: "que planilhas e emails" },
    { value: "< 2min", label: "tempo resposta", desc: "com atribuição automática" },
    { value: "100%", label: "histórico", desc: "de todas conversas salvo" },
    { value: "∞", label: "agentes", desc: "no mesmo número WhatsApp" }
  ];
  const features = [
    {
      icon: "📋",
      title: "Kanban Visual",
      description: "Arraste e solte leads entre colunas personalizadas. Visualize todo seu funil de vendas em tempo real.",
      details: [
        "Colunas customizáveis",
        "Drag and drop intuitivo",
        "Cores e prioridades",
        "Filtros por agente/tag"
      ]
    },
    {
      icon: "👥",
      title: "Multi-Agente",
      description: "Toda sua equipe atendendo no mesmo número WhatsApp. Atribuição automática ou manual de conversas.",
      details: [
        "Número único para todos",
        "Distribuição round-robin",
        "Transferência entre agentes",
        "Supervisão em tempo real"
      ]
    },
    {
      icon: "🏷️",
      title: "Tags e Segmentos",
      description: "Organize leads com tags automáticas ou manuais. Crie segmentos para campanhas e follow-ups.",
      details: [
        "Tags ilimitadas",
        "Automação por comportamento",
        "Segmentos dinâmicos",
        "Exportação por filtro"
      ]
    },
    {
      icon: "📝",
      title: "Notas e Histórico",
      description: "Mantenha contexto completo de cada cliente. Notas internas, histórico de compras e interações anteriores.",
      details: [
        "Notas internas privadas",
        "Histórico completo",
        "Anexos e documentos",
        "Timeline de eventos"
      ]
    },
    {
      icon: "🛎️",
      title: "SLA e Alertas",
      description: "Nunca perca um lead por demora. Alertas automáticos quando conversas passam do tempo limite.",
      details: [
        "SLA por prioridade",
        "Alertas em tempo real",
        "Escalação automática",
        "Relatório de violações"
      ]
    },
    {
      icon: "📊",
      title: "Analytics Completo",
      description: "Métricas de performance individual e da equipe. Entenda quem vende mais e por quê.",
      details: [
        "Tempo médio de resposta",
        "Taxa de conversão",
        "Ranking de agentes",
        "Export para Excel/BI"
      ]
    }
  ];
  const pipelineStages = [
    { name: "Novo Lead", color: "#00d4ff", count: 24, desc: "Leads que acabaram de chegar" },
    { name: "Qualificando", color: "#eab308", count: 18, desc: "Em processo de qualificação" },
    { name: "Proposta Enviada", color: "#a855f7", count: 12, desc: "Aguardando retorno" },
    { name: "Negociando", color: "#f97316", count: 8, desc: "Em negociação de valores" },
    { name: "Fechado/Ganho", color: "#00ff9d", count: 45, desc: "Vendas concluídas" },
    { name: "Perdido", color: "#ef4444", count: 15, desc: "Leads não convertidos" }
  ];
  const teamRoles = [
    { role: "Administrador", icon: "👑", desc: "Acesso total ao sistema", permissions: ["Configurações", "Relatórios", "Gestão de equipe", "Todos os chats"] },
    { role: "Supervisor", icon: "👔", desc: "Gestão da equipe e métricas", permissions: ["Ver todos os chats", "Relatórios", "Transferir conversas", "Editar leads"] },
    { role: "Atendente", icon: "💬", desc: "Atendimento ao cliente", permissions: ["Seus chats", "Notas", "Tags", "Histórico"] },
    { role: "Visualizador", icon: "👁️", desc: "Apenas leitura", permissions: ["Ver chats", "Ver relatórios", "Sem edição"] }
  ];
  const integrations = [
    { name: "Google Calendar", icon: "📅", desc: "Agende reuniões direto do chat" },
    { name: "Google Sheets", icon: "📊", desc: "Exporte leads automaticamente" },
    { name: "Webhooks", icon: "🔗", desc: "Integre com qualquer sistema" },
    { name: "Zapier/n8n", icon: "⚡", desc: "Automações avançadas" }
  ];
  const faqs = [
    {
      q: "Quantos agentes podem usar o mesmo número?",
      a: "Não há limite! Você pode ter quantos atendentes quiser logados simultaneamente no mesmo número WhatsApp. A distribuição de conversas pode ser automática (round-robin) ou manual."
    },
    {
      q: "Os agentes veem as conversas uns dos outros?",
      a: "Depende da configuração de permissões. Administradores e Supervisores podem ver todos os chats. Atendentes normalmente veem apenas os chats atribuídos a eles, mas isso é configurável."
    },
    {
      q: "Como funciona a atribuição automática?",
      a: "Quando um novo lead chega, o sistema distribui automaticamente para o agente disponível usando round-robin ou baseado em carga de trabalho. Você também pode criar regras por departamento, horário ou origem do lead."
    },
    {
      q: "Posso customizar as colunas do Kanban?",
      a: "Sim! Você pode criar quantas colunas quiser, renomeá-las, definir cores e ordenar conforme seu processo de vendas. Exemplos: Novo → Qualificando → Proposta → Negociando → Fechado."
    },
    {
      q: "O histórico fica salvo por quanto tempo?",
      a: "Para sempre! Todas as conversas, notas, anexos e eventos ficam salvos indefinidamente. Você pode buscar qualquer interação feita com um cliente, mesmo que tenha sido há anos."
    },
    {
      q: "Consigo ver métricas individuais dos atendentes?",
      a: "Sim! O dashboard mostra tempo médio de resposta, quantidade de atendimentos, taxa de conversão e satisfação de cada agente. Ideal para bonificações e treinamentos."
    }
  ];
  const useCases = [
    { industry: "Vendas B2B", icon: "💼", benefit: "Pipeline visual de negociações" },
    { industry: "Suporte Técnico", icon: "🔧", benefit: "Tickets e escalação automática" },
    { industry: "Imobiliárias", icon: "🏠", benefit: "Gestão de visitas e propostas" },
    { industry: "Clínicas", icon: "🏥", benefit: "Agendamento e follow-up" }
  ];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": title, "description": description, "keywords": keywords, "data-astro-cid-fnea74ll": true }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<section class="prod-hero" data-astro-cid-fnea74ll> <div class="hero-badge" data-astro-cid-fnea74ll>📋 Gestão Inteligente</div> <h1 data-astro-cid-fnea74ll>CRM completo no <span class="text-gradient" data-astro-cid-fnea74ll>WhatsApp</span></h1> <p class="hero-subtitle" data-astro-cid-fnea74ll>
Transforme seu WhatsApp em uma central de vendas organizada. Kanban visual, equipe multi-agente, histórico unificado e métricas em tempo real.
</p> <div class="hero-stats" data-astro-cid-fnea74ll> ${stats.map((stat) => renderTemplate`<div class="stat-card glass-panel" data-astro-cid-fnea74ll> <span class="stat-value" data-astro-cid-fnea74ll>${stat.value}</span> <span class="stat-label" data-astro-cid-fnea74ll>${stat.label}</span> <span class="stat-desc" data-astro-cid-fnea74ll>${stat.desc}</span> </div>`)} </div> <div class="hero-ctas" data-astro-cid-fnea74ll> <a href="/criar-bot" class="btn-primary-glow" data-astro-cid-fnea74ll>Ativar Meu CRM</a> <a href="/demo" class="btn-outline" data-astro-cid-fnea74ll>Ver Demonstração →</a> </div> </section>  <section class="kanban-section" data-astro-cid-fnea74ll> <h2 data-astro-cid-fnea74ll>Visualize seu <span class="text-gradient" data-astro-cid-fnea74ll>funil de vendas</span></h2> <p class="section-subtitle" data-astro-cid-fnea74ll>Arraste e solte leads entre colunas. Tudo em tempo real.</p> <div class="kanban-preview" data-astro-cid-fnea74ll> ${pipelineStages.map((stage) => renderTemplate`<div class="kanban-column glass-panel" data-astro-cid-fnea74ll> <div class="column-header"${addAttribute(`border-color: ${stage.color}`, "style")} data-astro-cid-fnea74ll> <span class="column-dot"${addAttribute(`background: ${stage.color}`, "style")} data-astro-cid-fnea74ll></span> <span class="column-name" data-astro-cid-fnea74ll>${stage.name}</span> <span class="column-count" data-astro-cid-fnea74ll>${stage.count}</span> </div> <div class="column-body" data-astro-cid-fnea74ll> <div class="lead-card-mini" data-astro-cid-fnea74ll> <span class="lead-avatar" data-astro-cid-fnea74ll>👤</span> <span class="lead-name" data-astro-cid-fnea74ll>Lead exemplo</span> </div> <div class="lead-card-mini" data-astro-cid-fnea74ll> <span class="lead-avatar" data-astro-cid-fnea74ll>👤</span> <span class="lead-name" data-astro-cid-fnea74ll>Lead exemplo</span> </div> <p class="column-desc" data-astro-cid-fnea74ll>${stage.desc}</p> </div> </div>`)} </div> </section>  <section class="features-section" data-astro-cid-fnea74ll> <h2 data-astro-cid-fnea74ll>Recursos do <span class="text-gradient" data-astro-cid-fnea74ll>CRM GetNexo</span></h2> <p class="section-subtitle" data-astro-cid-fnea74ll>Tudo que sua equipe precisa para vender mais</p> <div class="features-grid" data-astro-cid-fnea74ll> ${features.map((feature) => renderTemplate`<div class="feature-card glass-panel" data-astro-cid-fnea74ll> <div class="feature-header" data-astro-cid-fnea74ll> <span class="feature-icon" data-astro-cid-fnea74ll>${feature.icon}</span> <h3 data-astro-cid-fnea74ll>${feature.title}</h3> </div> <p class="feature-desc" data-astro-cid-fnea74ll>${feature.description}</p> <ul class="feature-details" data-astro-cid-fnea74ll> ${feature.details.map((d) => renderTemplate`<li data-astro-cid-fnea74ll>✓ ${d}</li>`)} </ul> </div>`)} </div> </section>  <section class="roles-section" data-astro-cid-fnea74ll> <h2 data-astro-cid-fnea74ll>Controle de <span class="text-gradient" data-astro-cid-fnea74ll>permissões</span></h2> <p class="section-subtitle" data-astro-cid-fnea74ll>Defina exatamente o que cada membro da equipe pode fazer</p> <div class="roles-grid" data-astro-cid-fnea74ll> ${teamRoles.map((tr) => renderTemplate`<div class="role-card glass-panel" data-astro-cid-fnea74ll> <div class="role-header" data-astro-cid-fnea74ll> <span class="role-icon" data-astro-cid-fnea74ll>${tr.icon}</span> <div data-astro-cid-fnea74ll> <h4 data-astro-cid-fnea74ll>${tr.role}</h4> <span class="role-desc" data-astro-cid-fnea74ll>${tr.desc}</span> </div> </div> <ul class="role-permissions" data-astro-cid-fnea74ll> ${tr.permissions.map((p) => renderTemplate`<li data-astro-cid-fnea74ll>• ${p}</li>`)} </ul> </div>`)} </div> </section>  <section class="multiagent-section" data-astro-cid-fnea74ll> <div class="glass-panel multiagent-box" data-astro-cid-fnea74ll> <div class="ma-content" data-astro-cid-fnea74ll> <h2 data-astro-cid-fnea74ll>Equipe inteira no <span class="text-gradient" data-astro-cid-fnea74ll>mesmo número</span></h2> <p data-astro-cid-fnea74ll>Seus clientes falam com um único número, mas sua equipe trabalha de forma organizada. Cada agente vê seus chats, supervisores monitoram tudo.</p> <div class="ma-features" data-astro-cid-fnea74ll> <div class="ma-feature" data-astro-cid-fnea74ll> <span class="maf-icon" data-astro-cid-fnea74ll>🔄</span> <div data-astro-cid-fnea74ll> <strong data-astro-cid-fnea74ll>Distribuição Automática</strong> <span data-astro-cid-fnea74ll>Round-robin ou por carga</span> </div> </div> <div class="ma-feature" data-astro-cid-fnea74ll> <span class="maf-icon" data-astro-cid-fnea74ll>➡️</span> <div data-astro-cid-fnea74ll> <strong data-astro-cid-fnea74ll>Transferência Fácil</strong> <span data-astro-cid-fnea74ll>Passe chats entre agentes</span> </div> </div> <div class="ma-feature" data-astro-cid-fnea74ll> <span class="maf-icon" data-astro-cid-fnea74ll>👁️</span> <div data-astro-cid-fnea74ll> <strong data-astro-cid-fnea74ll>Supervisão em Tempo Real</strong> <span data-astro-cid-fnea74ll>Veja quem está atendendo o quê</span> </div> </div> <div class="ma-feature" data-astro-cid-fnea74ll> <span class="maf-icon" data-astro-cid-fnea74ll>📊</span> <div data-astro-cid-fnea74ll> <strong data-astro-cid-fnea74ll>Métricas por Agente</strong> <span data-astro-cid-fnea74ll>Performance individual</span> </div> </div> </div> </div> <div class="ma-preview" data-astro-cid-fnea74ll> <div class="team-widget" data-astro-cid-fnea74ll> <div class="tw-header" data-astro-cid-fnea74ll> <span data-astro-cid-fnea74ll>👥 Equipe Online (5)</span> </div> <div class="tw-list" data-astro-cid-fnea74ll> <div class="agent-row online" data-astro-cid-fnea74ll> <span class="agent-avatar" data-astro-cid-fnea74ll>👩</span> <span class="agent-name" data-astro-cid-fnea74ll>Ana</span> <span class="agent-chats" data-astro-cid-fnea74ll>8 chats</span> </div> <div class="agent-row online" data-astro-cid-fnea74ll> <span class="agent-avatar" data-astro-cid-fnea74ll>👨</span> <span class="agent-name" data-astro-cid-fnea74ll>Carlos</span> <span class="agent-chats" data-astro-cid-fnea74ll>6 chats</span> </div> <div class="agent-row online" data-astro-cid-fnea74ll> <span class="agent-avatar" data-astro-cid-fnea74ll>👩</span> <span class="agent-name" data-astro-cid-fnea74ll>Maria</span> <span class="agent-chats" data-astro-cid-fnea74ll>5 chats</span> </div> <div class="agent-row away" data-astro-cid-fnea74ll> <span class="agent-avatar" data-astro-cid-fnea74ll>👨</span> <span class="agent-name" data-astro-cid-fnea74ll>João</span> <span class="agent-status" data-astro-cid-fnea74ll>Ausente</span> </div> </div> </div> </div> </div> </section>  <section class="workflow-section" data-astro-cid-fnea74ll> <h2 data-astro-cid-fnea74ll>Como funciona na <span class="text-gradient" data-astro-cid-fnea74ll>prática</span></h2> <p class="section-subtitle" data-astro-cid-fnea74ll>Do primeiro "oi" até o fechamento da venda</p> <div class="steps-container" data-astro-cid-fnea74ll> <div class="step-card glass-panel" data-astro-cid-fnea74ll> <div class="step-num" data-astro-cid-fnea74ll>1</div> <div class="step-icon" data-astro-cid-fnea74ll>💬</div> <h3 data-astro-cid-fnea74ll>O Lead Chega</h3> <p data-astro-cid-fnea74ll>Cliente envia mensagem no WhatsApp. A IA atende em segundos, 24/7, garantindo resposta imediata sem fila de espera.</p> </div> <div class="step-arrow" data-astro-cid-fnea74ll>➜</div> <div class="step-card glass-panel" data-astro-cid-fnea74ll> <div class="step-num" data-astro-cid-fnea74ll>2</div> <div class="step-icon" data-astro-cid-fnea74ll>🤖</div> <h3 data-astro-cid-fnea74ll>Qualificação</h3> <p data-astro-cid-fnea74ll>O sistema coleta nome, email e interesse. Baseado nas respostas, move o card automaticamente para a coluna "Qualificado" no Kanban.</p> </div> <div class="step-arrow" data-astro-cid-fnea74ll>➜</div> <div class="step-card glass-panel" data-astro-cid-fnea74ll> <div class="step-num" data-astro-cid-fnea74ll>3</div> <div class="step-icon" data-astro-cid-fnea74ll>🤝</div> <h3 data-astro-cid-fnea74ll>Negociação</h3> <p data-astro-cid-fnea74ll>Seu agente humano assume com todo histórico. Envia áudios, PDFs e propostas direto da tela do chat.</p> </div> <div class="step-arrow" data-astro-cid-fnea74ll>➜</div> <div class="step-card glass-panel" data-astro-cid-fnea74ll> <div class="step-num" data-astro-cid-fnea74ll>4</div> <div class="step-icon" data-astro-cid-fnea74ll>💰</div> <h3 data-astro-cid-fnea74ll>Fechamento</h3> <p data-astro-cid-fnea74ll>Negócio Ganho! Automação envia link de PIX/Boleto e agradecimento. Lead vai para automação de pós-venda.</p> </div> </div> </section>  <section class="comparison-section" data-astro-cid-fnea74ll> <h2 data-astro-cid-fnea74ll>Por que o <span class="text-gradient" data-astro-cid-fnea74ll>GetNexo</span> é superior?</h2> <p class="section-subtitle" data-astro-cid-fnea74ll>Não somos apenas um "bot". Somos uma plataforma de crescimento.</p> <div class="comparison-table glass-panel" data-astro-cid-fnea74ll> <div class="comp-header" data-astro-cid-fnea74ll> <div class="comp-col feature-col" data-astro-cid-fnea74ll>Diferencial</div> <div class="comp-col nexo-col" data-astro-cid-fnea74ll>GetNexo AI</div> <div class="comp-col other-col" data-astro-cid-fnea74ll>WhastApp Business</div> <div class="comp-col other-col" data-astro-cid-fnea74ll>CRMs Padrão</div> </div> <div class="comp-row" data-astro-cid-fnea74ll> <div class="comp-col feature-col" data-astro-cid-fnea74ll> <strong data-astro-cid-fnea74ll>Atendimento Multi-Agente</strong> <span data-astro-cid-fnea74ll>Várias pessoas no mesmo número</span> </div> <div class="comp-col nexo-col" data-astro-cid-fnea74ll>✅ Ilimitado & Organizado</div> <div class="comp-col other-col" data-astro-cid-fnea74ll>⚠️ Limitado (4 telas/caos)</div> <div class="comp-col other-col" data-astro-cid-fnea74ll>❌ Não Nativo</div> </div> <div class="comp-row" data-astro-cid-fnea74ll> <div class="comp-col feature-col" data-astro-cid-fnea74ll> <strong data-astro-cid-fnea74ll>Pipeline Visual</strong> <span data-astro-cid-fnea74ll>Kanban de arrastar e soltar</span> </div> <div class="comp-col nexo-col" data-astro-cid-fnea74ll>✅ Nativo no Chat</div> <div class="comp-col other-col" data-astro-cid-fnea74ll>❌ Lista Infinita</div> <div class="comp-col other-col" data-astro-cid-fnea74ll>⚠️ Em outra aba/sistema</div> </div> <div class="comp-row" data-astro-cid-fnea74ll> <div class="comp-col feature-col" data-astro-cid-fnea74ll> <strong data-astro-cid-fnea74ll>Inteligência Artificial</strong> <span data-astro-cid-fnea74ll>Respostas inteligentes e treino</span> </div> <div class="comp-col nexo-col" data-astro-cid-fnea74ll>✅ IA Generativa (GPT/Claude)</div> <div class="comp-col other-col" data-astro-cid-fnea74ll>❌ Apenas Respostas Rápidas</div> <div class="comp-col other-col" data-astro-cid-fnea74ll>⚠️ Custos Extras Altos</div> </div> <div class="comp-row" data-astro-cid-fnea74ll> <div class="comp-col feature-col" data-astro-cid-fnea74ll> <strong data-astro-cid-fnea74ll>Custo por Usuário</strong> <span data-astro-cid-fnea74ll>Escalabilidade da equipe</span> </div> <div class="comp-col nexo-col" data-astro-cid-fnea74ll>✅ Preço Fixo (Equipe Ilimitada!)</div> <div class="comp-col other-col" data-astro-cid-fnea74ll>✅ Grátis</div> <div class="comp-col other-col" data-astro-cid-fnea74ll>❌ Caro (Cobra por cabeça)</div> </div> </div> </section> <section class="use-cases-section" data-astro-cid-fnea74ll> <h2 data-astro-cid-fnea74ll>Ideal para <span class="text-gradient" data-astro-cid-fnea74ll>diversos segmentos</span></h2> <div class="use-cases-grid" data-astro-cid-fnea74ll> ${useCases.map((uc) => renderTemplate`<div class="use-case-card glass-panel" data-astro-cid-fnea74ll> <span class="uc-icon" data-astro-cid-fnea74ll>${uc.icon}</span> <h4 data-astro-cid-fnea74ll>${uc.industry}</h4> <p data-astro-cid-fnea74ll>${uc.benefit}</p> </div>`)} </div> </section>  <section class="integrations-section" data-astro-cid-fnea74ll> <h2 data-astro-cid-fnea74ll>Integra com suas <span class="text-gradient" data-astro-cid-fnea74ll>ferramentas</span></h2> <div class="integrations-grid" data-astro-cid-fnea74ll> ${integrations.map((int) => renderTemplate`<div class="integration-card glass-panel" data-astro-cid-fnea74ll> <span class="int-icon" data-astro-cid-fnea74ll>${int.icon}</span> <div data-astro-cid-fnea74ll> <strong data-astro-cid-fnea74ll>${int.name}</strong> <span data-astro-cid-fnea74ll>${int.desc}</span> </div> </div>`)} </div> <a href="/integracoes" class="link-more" data-astro-cid-fnea74ll>Ver todas integrações →</a> </section>  <section class="faq-section" data-astro-cid-fnea74ll> <h2 data-astro-cid-fnea74ll>Perguntas <span class="text-gradient" data-astro-cid-fnea74ll>frequentes</span></h2> <div class="faq-list" data-astro-cid-fnea74ll> ${faqs.map((faq) => renderTemplate`<details class="faq-item glass-panel" data-astro-cid-fnea74ll> <summary data-astro-cid-fnea74ll> <span class="faq-q" data-astro-cid-fnea74ll>${faq.q}</span> <span class="faq-toggle" data-astro-cid-fnea74ll>+</span> </summary> <p class="faq-a" data-astro-cid-fnea74ll>${faq.a}</p> </details>`)} </div> </section>  <section class="final-cta" data-astro-cid-fnea74ll> <div class="glass-panel cta-box" data-astro-cid-fnea74ll> <h2 data-astro-cid-fnea74ll>Organize sua <span class="text-gradient" data-astro-cid-fnea74ll>operação de vendas</span></h2> <p data-astro-cid-fnea74ll>Chega de planilhas e conversas perdidas. Centralize tudo em um CRM integrado ao WhatsApp.</p> <div class="cta-buttons" data-astro-cid-fnea74ll> <a href="/criar-bot" class="btn-primary-glow" data-astro-cid-fnea74ll>Começar Gratuitamente</a> <a href="/precos" class="btn-outline" data-astro-cid-fnea74ll>Ver Planos</a> </div> <p class="cta-note" data-astro-cid-fnea74ll>Sem cartão de crédito • Agentes ilimitados • Suporte incluso</p> </div> </section> ` })} `;
}, "/home/lele/usenexo/getnexo-site/src/pages/produtos/crm.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/produtos/crm.astro";
const $$url = "/produtos/crm";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Crm,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
