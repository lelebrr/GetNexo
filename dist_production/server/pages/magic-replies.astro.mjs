import { f as createComponent, r as renderTemplate, k as renderComponent, m as maybeRenderHead } from "../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$Layout } from "../assets/Layout-DScI-qCd.js";
import { $ as $$SEO } from "../assets/SEO-BsJBILP8.js";
/* empty css                                        */
import { renderers } from "../renderers.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$MagicReplies = createComponent(($$result, $$props, $$slots) => {
  const title = "Magic Replies GetNexo - Respostas Inteligentes de IA no WhatsApp | Automação Conversacional";
  const description = "Magic Replies revoluciona o atendimento WhatsApp com IA que entende contexto completo, gera respostas personalizadas e aprende com cada interação. 95% precisão, respostas em 3 segundos.";
  const keywords = "magic replies whatsapp, respostas inteligentes ia, automação conversacional whatsapp, ia atendimento whatsapp, chatbot resposta inteligente, respostas automaticas whatsapp, ia whatsapp contexto, aprendizado continuo whatsapp, ia vendas whatsapp, chatbot inteligente, respostas automaticas conversacionais";
  const faqData = [
    {
      question: "Como funciona o Magic Replies?",
      answer: "Magic Replies utiliza IA generativa treinada especificamente para seu negócio. Ela analisa o histórico completo da conversa, produtos já comprados, perfil do cliente e gera respostas personalizadas em 3 segundos."
    },
    {
      question: "Quanto tempo leva para treinar a IA?",
      answer: "Setup básico em 30 minutos. A IA começa respondendo imediatamente e alcança performance de especialista em 7 dias de uso contínuo."
    },
    {
      question: "Qual é a precisão das respostas?",
      answer: "95% de precisão na análise de sentimento e geração de respostas. Cada interação melhora a IA através de aprendizado contínuo."
    },
    {
      question: "Magic Replies substitui meus vendedores?",
      answer: "Não substitui completamente, mas potencializa muito! Cuida de 80% das interações rotineiras, liberando vendedores para vendas complexas."
    },
    {
      question: "Como sei se as respostas estão boas?",
      answer: "Dashboard mostra métricas em tempo real: satisfação do cliente, taxa de conversão, tempo de resposta. Você aprova ou rejeita respostas."
    }
  ];
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Produtos", url: "/produtos" },
    { name: "Magic Replies", url: "/magic-replies" }
  ];
  return renderTemplate(_a || (_a = __template(["", " ", `  <script>
  // Magic Replies Demo Animation
  let currentStep = 1;
  const totalSteps = 5;

  function showMagicReply(step) {
    const messages = document.getElementById('magic-chat');
    const existingBot = messages.querySelector('.message.bot');

    if (existingBot) {
      existingBot.remove();
    }

    const replies = [
      "Olá! Bem-vindo à nossa loja! Temos vários modelos do Nike Air Max. Qual tamanho você calça?",
      "Perfeito! Temos o Air Max 90 em preto tamanho 42 por R$299. É nosso best-seller! Tem garantia de 2 anos.",
      "Frete grátis para compras acima de R$200! Podemos entregar amanhã mesmo. Quer que eu reserve este par?",
      "Excelente escolha! Aqui está seu link de checkout seguro: [PROCESSANDO...]. Aceitamos PIX, cartão ou boleto.",
      "Pedido confirmado! 🎉 PIX aprovado automaticamente. Seu tênis sai para entrega hoje. Qualquer dúvida, estou aqui 24h!"
    ];

    const botMessage = document.createElement('div');
    botMessage.className = 'message bot';
    botMessage.innerHTML = \`<div class="typing-indicator"><span></span><span></span><span></span></div>\`;

    messages.appendChild(botMessage);

    setTimeout(() => {
      botMessage.innerHTML = replies[step - 1];
    }, 2000);
  }

  function nextStep() {
    currentStep = currentStep >= totalSteps ? 1 : currentStep + 1;
    showMagicReply(currentStep);
  }

  // Auto-play demo
  setInterval(nextStep, 8000);

  // Initial reply
  setTimeout(() => showMagicReply(1), 2000);

  function abrirDemo() {
    // Implement demo modal
    alert('Demo interativo em desenvolvimento! Magic Replies é a tecnologia mais avançada de IA conversacional do mercado.');
  }
<\/script>`], ["", " ", `  <script>
  // Magic Replies Demo Animation
  let currentStep = 1;
  const totalSteps = 5;

  function showMagicReply(step) {
    const messages = document.getElementById('magic-chat');
    const existingBot = messages.querySelector('.message.bot');

    if (existingBot) {
      existingBot.remove();
    }

    const replies = [
      "Olá! Bem-vindo à nossa loja! Temos vários modelos do Nike Air Max. Qual tamanho você calça?",
      "Perfeito! Temos o Air Max 90 em preto tamanho 42 por R$299. É nosso best-seller! Tem garantia de 2 anos.",
      "Frete grátis para compras acima de R$200! Podemos entregar amanhã mesmo. Quer que eu reserve este par?",
      "Excelente escolha! Aqui está seu link de checkout seguro: [PROCESSANDO...]. Aceitamos PIX, cartão ou boleto.",
      "Pedido confirmado! 🎉 PIX aprovado automaticamente. Seu tênis sai para entrega hoje. Qualquer dúvida, estou aqui 24h!"
    ];

    const botMessage = document.createElement('div');
    botMessage.className = 'message bot';
    botMessage.innerHTML = \\\`<div class="typing-indicator"><span></span><span></span><span></span></div>\\\`;

    messages.appendChild(botMessage);

    setTimeout(() => {
      botMessage.innerHTML = replies[step - 1];
    }, 2000);
  }

  function nextStep() {
    currentStep = currentStep >= totalSteps ? 1 : currentStep + 1;
    showMagicReply(currentStep);
  }

  // Auto-play demo
  setInterval(nextStep, 8000);

  // Initial reply
  setTimeout(() => showMagicReply(1), 2000);

  function abrirDemo() {
    // Implement demo modal
    alert('Demo interativo em desenvolvimento! Magic Replies é a tecnologia mais avançada de IA conversacional do mercado.');
  }
<\/script>`])), renderComponent($$result, "SEO", $$SEO, { "title": title, "description": description, "keywords": keywords, "url": "/magic-replies", "type": "product", "breadcrumbs": breadcrumbs, "faq": faqData, "data-astro-cid-2tgokjsz": true }), renderComponent($$result, "Layout", $$Layout, { "title": title, "description": description, "keywords": keywords, "data-astro-cid-2tgokjsz": true }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<section class="hero-section" data-astro-cid-2tgokjsz> <div class="hero-content" data-astro-cid-2tgokjsz> <div class="hero-badge" data-astro-cid-2tgokjsz>✨ Tecnologia Exclusiva</div> <h1 data-astro-cid-2tgokjsz>Magic Replies: IA que Conhece seus Clientes Melhor que Você</h1> <p data-astro-cid-2tgokjsz>Sistema de respostas inteligentes que entende contexto completo, gera respostas personalizadas e aprende com cada interação. Transforme conversas simples em vendas complexas.</p> <div class="hero-features" data-astro-cid-2tgokjsz> <span data-astro-cid-2tgokjsz>✅ 95% Precisão</span> <span data-astro-cid-2tgokjsz>✅ 3s Resposta</span> <span data-astro-cid-2tgokjsz>✅ Contexto Completo</span> </div> <div class="hero-ctas" data-astro-cid-2tgokjsz> <a href="/criar-bot" class="btn-primary" data-astro-cid-2tgokjsz>Ativar Magic Replies Grátis</a> <button onclick="abrirDemo()" class="btn-secondary" data-astro-cid-2tgokjsz>Ver Demo em Ação</button> </div> </div> <div class="hero-visual" data-astro-cid-2tgokjsz> <div class="magic-demo" data-astro-cid-2tgokjsz> <div class="chat-window" data-astro-cid-2tgokjsz> <div class="chat-header" data-astro-cid-2tgokjsz>Magic Replies Demo</div> <div class="chat-messages" id="magic-chat" data-astro-cid-2tgokjsz> <div class="message user" data-astro-cid-2tgokjsz>Olá, vocês têm tênis Nike Air Max?</div> <div class="message bot typing" data-astro-cid-2tgokjsz> <div class="typing-indicator" data-astro-cid-2tgokjsz> <span data-astro-cid-2tgokjsz></span><span data-astro-cid-2tgokjsz></span><span data-astro-cid-2tgokjsz></span> </div> </div> </div> </div> </div> </div> </section>  <section class="technology-deep" data-astro-cid-2tgokjsz> <div class="section-header" data-astro-cid-2tgokjsz> <h2 data-astro-cid-2tgokjsz>A Tecnologia Mais Avançada de IA Conversacional</h2> <p data-astro-cid-2tgokjsz>Magic Replies combina múltiplas tecnologias de IA para criar respostas impossíveis de distinguir de humanos</p> </div> <div class="tech-showcase" data-astro-cid-2tgokjsz> <div class="tech-feature" data-astro-cid-2tgokjsz> <div class="tech-icon" data-astro-cid-2tgokjsz>🧠</div> <h3 data-astro-cid-2tgokjsz>Processamento de Linguagem Natural Avançado</h3> <p data-astro-cid-2tgokjsz>GPT-4 integrado com modelos customizados treinados especificamente para seu catálogo de produtos e histórico de vendas.</p> <div class="tech-specs" data-astro-cid-2tgokjsz> <span data-astro-cid-2tgokjsz>🎯 Precisão: 95%</span> <span data-astro-cid-2tgokjsz>⚡ Velocidade: <3s</span> <span data-astro-cid-2tgokjsz>🗣️ Idiomas: 50+</span> </div> </div> <div class="tech-feature" data-astro-cid-2tgokjsz> <div class="tech-icon" data-astro-cid-2tgokjsz>📚</div> <h3 data-astro-cid-2tgokjsz>Memória Conversacional Completa</h3> <p data-astro-cid-2tgokjsz>Lembra de todas as interações anteriores, produtos mostrados, preços discutidos e preferências do cliente.</p> <div class="tech-specs" data-astro-cid-2tgokjsz> <span data-astro-cid-2tgokjsz>💾 Histórico: Ilimitado</span> <span data-astro-cid-2tgokjsz>🔍 Busca: Instantânea</span> <span data-astro-cid-2tgokjsz>🎭 Contexto: Completo</span> </div> </div> <div class="tech-feature" data-astro-cid-2tgokjsz> <div class="tech-icon" data-astro-cid-2tgokjsz>🎯</div> <h3 data-astro-cid-2tgokjsz>Análise de Sentimento em Tempo Real</h3> <p data-astro-cid-2tgokjsz>Detecta emoções do cliente automaticamente: satisfação, urgência, frustração, raiva. Ajusta tom de voz dinamicamente.</p> <div class="tech-specs" data-astro-cid-2tgokjsz> <span data-astro-cid-2tgokjsz>😊 Emoções: 7 tipos</span> <span data-astro-cid-2tgokjsz>📊 Precisão: 92%</span> <span data-astro-cid-2tgokjsz>🔄 Adaptação: Automática</span> </div> </div> <div class="tech-feature" data-astro-cid-2tgokjsz> <div class="tech-icon" data-astro-cid-2tgokjsz>🚀</div> <h3 data-astro-cid-2tgokjsz>Aprendizado Contínuo</h3> <p data-astro-cid-2tgokjsz>Cada resposta é analisada e a IA aprende. Melhora automaticamente com feedback humano e resultados de vendas.</p> <div class="tech-specs" data-astro-cid-2tgokjsz> <span data-astro-cid-2tgokjsz>📈 Melhoria: Diária</span> <span data-astro-cid-2tgokjsz>🎯 A/B Testing: Automático</span> <span data-astro-cid-2tgokjsz>🔧 Otimização: Contínua</span> </div> </div> </div> </section>  <section class="workflow-section" data-astro-cid-2tgokjsz> <div class="section-header" data-astro-cid-2tgokjsz> <h2 data-astro-cid-2tgokjsz>Do Primeiro Contato à Venda Fechada</h2> <p data-astro-cid-2tgokjsz>Magic Replies guia cada conversa estrategicamente</p> </div> <div class="workflow-interactive" data-astro-cid-2tgokjsz> <div class="workflow-step active" data-step="1" data-astro-cid-2tgokjsz> <div class="step-icon" data-astro-cid-2tgokjsz>👋</div> <h3 data-astro-cid-2tgokjsz>Saudação Personalizada</h3> <p data-astro-cid-2tgokjsz>Cliente manda primeira mensagem. IA reconhece cliente recorrente, VIP ou novo e personaliza saudação.</p> <div class="step-example" data-astro-cid-2tgokjsz> <strong data-astro-cid-2tgokjsz>Cliente Novo:</strong> "Olá, bom dia"<br data-astro-cid-2tgokjsz> <strong data-astro-cid-2tgokjsz>Magic Reply:</strong> "Bom dia! Bem-vindo à nossa loja! Vejo que é sua primeira vez aqui. Como posso ajudar?"
</div> </div> <div class="workflow-step" data-step="2" data-astro-cid-2tgokjsz> <div class="step-icon" data-astro-cid-2tgokjsz>🔍</div> <h3 data-astro-cid-2tgokjsz>Entendimento Profundo</h3> <p data-astro-cid-2tgokjsz>IA analisa intenção real por trás da mensagem, considerando contexto, urgência e necessidades implícitas.</p> <div class="step-example" data-astro-cid-2tgokjsz> <strong data-astro-cid-2tgokjsz>Cliente:</strong> "Preciso de um tênis urgente"<br data-astro-cid-2tgokjsz> <strong data-astro-cid-2tgokjsz>Análise IA:</strong> Urgência alta + Produto específico = Priorizar entrega rápida e sugestões similares
</div> </div> <div class="workflow-step" data-step="3" data-astro-cid-2tgokjsz> <div class="step-icon" data-astro-cid-2tgokjsz>💡</div> <h3 data-astro-cid-2tgokjsz>Sugestões Inteligentes</h3> <p data-astro-cid-2tgokjsz>Não apenas responde pergunta, mas sugere produtos complementares baseados no perfil e comportamento.</p> <div class="step-example" data-astro-cid-2tgokjsz> <strong data-astro-cid-2tgokjsz>Cliente:</strong> "Quero um tênis Nike"<br data-astro-cid-2tgokjsz> <strong data-astro-cid-2tgokjsz>Magic Reply:</strong> "Temos o Air Max 90 por R$299! Combina perfeitamente com nossa meia esportiva por R$29. Kit completo sai por R$328. Interessa?"
</div> </div> <div class="workflow-step" data-step="4" data-astro-cid-2tgokjsz> <div class="step-icon" data-astro-cid-2tgokjsz>🎯</div> <h3 data-astro-cid-2tgokjsz>Conversão Estratégica</h3> <p data-astro-cid-2tgokjsz>Identifica objeções comuns e as trata automaticamente com argumentos preparados e personalizados.</p> <div class="step-example" data-astro-cid-2tgokjsz> <strong data-astro-cid-2tgokjsz>Cliente:</strong> "Está caro demais"<br data-astro-cid-2tgokjsz> <strong data-astro-cid-2tgokjsz>Magic Reply:</strong> "Entendo sua preocupação! Mas este tênis tem garantia estendida de 2 anos e frete grátis. Valorizando, sai mais barato que concorrentes similares."
</div> </div> <div class="workflow-step" data-step="5" data-astro-cid-2tgokjsz> <div class="step-icon" data-astro-cid-2tgokjsz>✅</div> <h3 data-astro-cid-2tgokjsz>Fechamento Otimizado</h3> <p data-astro-cid-2tgokjsz>Quando cliente está pronto, guia suavemente para checkout com PIX automático e confirmação instantânea.</p> <div class="step-example" data-astro-cid-2tgokjsz> <strong data-astro-cid-2tgokjsz>Cliente:</strong> "Pode enviar?"<br data-astro-cid-2tgokjsz> <strong data-astro-cid-2tgokjsz>Magic Reply:</strong> "Perfeito! Aqui está seu link de checkout seguro: [LINK]. PIX automático aprovado em segundos. Qualquer dúvida, estou aqui!"
</div> </div> </div> </section>  <section class="performance-metrics" data-astro-cid-2tgokjsz> <div class="section-header" data-astro-cid-2tgokjsz> <h2 data-astro-cid-2tgokjsz>Resultados Comprovados em Produção</h2> <p data-astro-cid-2tgokjsz>Números reais de clientes usando Magic Replies 24/7</p> </div> <div class="metrics-grid" data-astro-cid-2tgokjsz> <div class="metric-card" data-astro-cid-2tgokjsz> <div class="metric-value" data-astro-cid-2tgokjsz>95%</div> <div class="metric-label" data-astro-cid-2tgokjsz>Precisão das Respostas</div> <div class="metric-description" data-astro-cid-2tgokjsz>Clientes não distinguem das respostas humanas</div> <div class="metric-trend" data-astro-cid-2tgokjsz>↗️ +12% vs humanos</div> </div> <div class="metric-card" data-astro-cid-2tgokjsz> <div class="metric-value" data-astro-cid-2tgokjsz>3s</div> <div class="metric-label" data-astro-cid-2tgokjsz>Tempo Médio de Resposta</div> <div class="metric-description" data-astro-cid-2tgokjsz>Respostas instantâneas 24 horas</div> <div class="metric-trend" data-astro-cid-2tgokjsz>⚡ 10x mais rápido</div> </div> <div class="metric-card" data-astro-cid-2tgokjsz> <div class="metric-value" data-astro-cid-2tgokjsz>340%</div> <div class="metric-label" data-astro-cid-2tgokjsz>Aumento Conversão Noturna</div> <div class="metric-description" data-astro-cid-2tgokjsz>Vendas crescem mesmo dormindo</div> <div class="metric-trend" data-astro-cid-2tgokjsz>💰 R$ 45k/mês extra</div> </div> <div class="metric-card" data-astro-cid-2tgokjsz> <div class="metric-value" data-astro-cid-2tgokjsz>87%</div> <div class="metric-label" data-astro-cid-2tgokjsz>Redução Custo Atendimento</div> <div class="metric-description" data-astro-cid-2tgokjsz>80% das conversas resolvidas automaticamente</div> <div class="metric-trend" data-astro-cid-2tgokjsz>💸 -R$ 8.500/mês</div> </div> </div> </section>  <section class="use-cases" data-astro-cid-2tgokjsz> <div class="section-header" data-astro-cid-2tgokjsz> <h2 data-astro-cid-2tgokjsz>Magic Replies em Diferentes Cenários</h2> <p data-astro-cid-2tgokjsz>Cada tipo de negócio se beneficia de forma única</p> </div> <div class="cases-showcase" data-astro-cid-2tgokjsz> <div class="case-study" data-astro-cid-2tgokjsz> <div class="case-header" data-astro-cid-2tgokjsz> <div class="case-icon" data-astro-cid-2tgokjsz>🛍️</div> <h3 data-astro-cid-2tgokjsz>E-commerce de Moda</h3> </div> <div class="case-content" data-astro-cid-2tgokjsz> <p data-astro-cid-2tgokjsz>Cliente pergunta sobre vestidos. IA lembra que ela comprou vestido vermelho há 3 meses e sugere combinações perfeitas.</p> <div class="case-quote" data-astro-cid-2tgokjsz>
"Magic Replies conhece minhas clientes melhor que eu! Sugestões personalizadas aumentaram ticket médio em 40%!" - Maria Silva, Fashion Store
</div> </div> </div> <div class="case-study" data-astro-cid-2tgokjsz> <div class="case-header" data-astro-cid-2tgokjsz> <div class="case-icon" data-astro-cid-2tgokjsz>🍕</div> <h3 data-astro-cid-2tgokjsz>Restaurante Delivery</h3> </div> <div class="case-content" data-astro-cid-2tgokjsz> <p data-astro-cid-2tgokjsz>Cliente pede pizza. IA lembra seus sabores favoritos, endereço de entrega e sugere acompanhamentos automaticamente.</p> <div class="case-quote" data-astro-cid-2tgokjsz>
"Clientes adoram quando lembramos seus pedidos anteriores. Conversão subiu de 15% para 45%!" - João Santos, Pizzaria
</div> </div> </div> <div class="case-study" data-astro-cid-2tgokjsz> <div class="case-header" data-astro-cid-2tgokjsz> <div class="case-icon" data-astro-cid-2tgokjsz>🏥</div> <h3 data-astro-cid-2tgokjsz>Clínica de Saúde</h3> </div> <div class="case-content" data-astro-cid-2tgokjsz> <p data-astro-cid-2tgokjsz>Paciente marca consulta. IA lembra histórico médico, medicações atuais e sugere horários ideais automaticamente.</p> <div class="case-quote" data-astro-cid-2tgokjsz>
"Magic Replies trata pacientes como VIPs. Agendamento automático reduziu faltas em 60%!" - Dra. Ana Costa, Clinica
</div> </div> </div> </div> </section>  <section class="advanced-features" data-astro-cid-2tgokjsz> <div class="section-header" data-astro-cid-2tgokjsz> <h2 data-astro-cid-2tgokjsz>Recursos Avançados Exclusivos</h2> <p data-astro-cid-2tgokjsz>Funcionalidades que só existem no GetNexo</p> </div> <div class="features-grid" data-astro-cid-2tgokjsz> <div class="feature-card" data-astro-cid-2tgokjsz> <div class="feature-icon" data-astro-cid-2tgokjsz>🎭</div> <h3 data-astro-cid-2tgokjsz>Personalização por Personalidade</h3> <p data-astro-cid-2tgokjsz>IA adapta tom de voz baseado na personalidade do cliente: formal para executivos, descontraído para jovens, paciente para idosos.</p> </div> <div class="feature-card" data-astro-cid-2tgokjsz> <div class="feature-icon" data-astro-cid-2tgokjsz>🌍</div> <h3 data-astro-cid-2tgokjsz>Multilíngue Automático</h3> <p data-astro-cid-2tgokjsz>Detecta idioma automaticamente e responde na mesma língua. Suporte para 50+ idiomas com sotaque cultural local.</p> </div> <div class="feature-card" data-astro-cid-2tgokjsz> <div class="feature-icon" data-astro-cid-2tgokjsz>🕒</div> <h3 data-astro-cid-2tgokjsz>Horário Comportamental</h3> <p data-astro-cid-2tgokjsz>Adapta respostas baseado na hora: mensagens motivacionais pela manhã, lembretes suaves à noite, urgência nos horários de pico.</p> </div> <div class="feature-card" data-astro-cid-2tgokjsz> <div class="feature-icon" data-astro-cid-2tgokjsz>📊</div> <h3 data-astro-cid-2tgokjsz>Analytics de Conversa</h3> <p data-astro-cid-2tgokjsz>Relatórios detalhados: palavras-chave mais usadas, objeções comuns, produtos mais perguntados, horários de pico.</p> </div> <div class="feature-card" data-astro-cid-2tgokjsz> <div class="feature-icon" data-astro-cid-2tgokjsz>🔄</div> <h3 data-astro-cid-2tgokjsz>A/B Testing Automático</h3> <p data-astro-cid-2tgokjsz>Testa diferentes abordagens automaticamente e aprende qual gera mais vendas para cada tipo de cliente.</p> </div> <div class="feature-card" data-astro-cid-2tgokjsz> <div class="feature-icon" data-astro-cid-2tgokjsz>🎯</div> <h3 data-astro-cid-2tgokjsz>Upsell Context Aware</h3> <p data-astro-cid-2tgokjsz>Sugere produtos complementares baseado no contexto completo da conversa, não apenas no produto principal.</p> </div> </div> </section>  <section class="pricing-comparison" data-astro-cid-2tgokjsz> <div class="section-header" data-astro-cid-2tgokjsz> <h2 data-astro-cid-2tgokjsz>Magic Replies Incluído Gratuitamente</h2> <p data-astro-cid-2tgokjsz>Não é um add-on caro. É a base da sua estratégia de vendas</p> </div> <div class="pricing-table" data-astro-cid-2tgokjsz> <div class="pricing-plan featured" data-astro-cid-2tgokjsz> <div class="plan-header" data-astro-cid-2tgokjsz> <h3 data-astro-cid-2tgokjsz>Plano Gratuito</h3> <div class="plan-price" data-astro-cid-2tgokjsz>R$ 0<span data-astro-cid-2tgokjsz>/mês</span></div> <p data-astro-cid-2tgokjsz>Magic Replies completo + todas funcionalidades básicas</p> </div> <ul class="plan-features" data-astro-cid-2tgokjsz> <li data-astro-cid-2tgokjsz>✅ Magic Replies Ilimitado</li> <li data-astro-cid-2tgokjsz>✅ Até 1.000 conversas/mês</li> <li data-astro-cid-2tgokjsz>✅ Contexto completo</li> <li data-astro-cid-2tgokjsz>✅ Aprendizado automático</li> <li data-astro-cid-2tgokjsz>✅ Dashboard básico</li> <li data-astro-cid-2tgokjsz>✅ Suporte por chat</li> </ul> <a href="/criar-bot" class="plan-cta" data-astro-cid-2tgokjsz>Começar Grátis</a> </div> <div class="pricing-plan" data-astro-cid-2tgokjsz> <div class="plan-header" data-astro-cid-2tgokjsz> <h3 data-astro-cid-2tgokjsz>Business</h3> <div class="plan-price" data-astro-cid-2tgokjsz>R$ 197<span data-astro-cid-2tgokjsz>/mês</span></div> <p data-astro-cid-2tgokjsz>Para empresas que querem maximizar resultados</p> </div> <ul class="plan-features" data-astro-cid-2tgokjsz> <li data-astro-cid-2tgokjsz>✅ Tudo do Gratuito</li> <li data-astro-cid-2tgokjsz>✅ Conversas ilimitadas</li> <li data-astro-cid-2tgokjsz>✅ Personalização avançada</li> <li data-astro-cid-2tgokjsz>✅ Analytics completo</li> <li data-astro-cid-2tgokjsz>✅ A/B testing automático</li> <li data-astro-cid-2tgokjsz>✅ Suporte prioritário</li> </ul> <a href="/precos" class="plan-cta secondary" data-astro-cid-2tgokjsz>Ver Todos Planos</a> </div> </div> </section>  <section class="faq-section" data-astro-cid-2tgokjsz> <div class="section-header" data-astro-cid-2tgokjsz> <h2 data-astro-cid-2tgokjsz>Perguntas Sobre Magic Replies</h2> </div> <div class="faq-list" data-astro-cid-2tgokjsz> <details class="faq-item" data-astro-cid-2tgokjsz> <summary data-astro-cid-2tgokjsz>Magic Replies substitui meus vendedores?</summary> <div class="faq-answer" data-astro-cid-2tgokjsz> <p data-astro-cid-2tgokjsz>Não substitui completamente, mas potencializa muito! Magic Replies cuida de 80% das interações rotineiras (consultas, dúvidas básicas, sugestões), liberando seus vendedores para focarem em vendas complexas, negociação e relacionamento com clientes VIP.</p> </div> </details> <details class="faq-item" data-astro-cid-2tgokjsz> <summary data-astro-cid-2tgokjsz>Como sei se as respostas estão boas?</summary> <div class="faq-answer" data-astro-cid-2tgokjsz> <p data-astro-cid-2tgokjsz>Dashboard completo mostra métricas em tempo real: satisfação do cliente, taxa de conversão, tempo de resposta, e taxa de escalação para humano. Você aprova ou rejeita respostas automaticamente.</p> </div> </details> <details class="faq-item" data-astro-cid-2tgokjsz> <summary data-astro-cid-2tgokjsz>Magic Replies funciona com meu catálogo atual?</summary> <div class="faq-answer" data-astro-cid-2tgokjsz> <p data-astro-cid-2tgokjsz>Sim! Integra automaticamente com Shopify, WooCommerce, VTEX, Bling e outros. Se não usa nenhum, nossa IA aprende através de uploads CSV ou API simples. Setup leva menos de 30 minutos.</p> </div> </details> <details class="faq-item" data-astro-cid-2tgokjsz> <summary data-astro-cid-2tgokjsz>E se o cliente quiser falar com pessoa real?</summary> <div class="faq-answer" data-astro-cid-2tgokjsz> <p data-astro-cid-2tgokjsz>Magic Replies detecta automaticamente quando deve transferir. Basta cliente dizer "falar com pessoa" ou "atendente humano" - transferência instantânea com contexto completo para o vendedor.</p> </div> </details> <details class="faq-item" data-astro-cid-2tgokjsz> <summary data-astro-cid-2tgokjsz>Magic Replies aprende com meus erros?</summary> <div class="faq-answer" data-astro-cid-2tgokjsz> <p data-astro-cid-2tgokjsz>Sim! Cada correção que você faz ensina a IA. Se você corrige uma resposta, ela aprende o padrão correto. Com 50 correções, a IA raramente erra novamente naquele tipo de situação.</p> </div> </details> </div> </section>  <section class="final-cta" data-astro-cid-2tgokjsz> <div class="cta-content" data-astro-cid-2tgokjsz> <h2 data-astro-cid-2tgokjsz>Transforme seu WhatsApp em uma Máquina de Vendas Inteligente</h2> <p data-astro-cid-2tgokjsz>Magic Replies + GetNexo = Clientes felizes 24h por dia. Setup em 12 minutos.</p> <a href="/criar-bot" class="btn-primary-large" data-astro-cid-2tgokjsz>Ativar Magic Replies Agora →</a> </div> </section> ` }));
}, "/home/lele/usenexo/getnexo-site/src/pages/magic-replies.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/magic-replies.astro";
const $$url = "/magic-replies";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$MagicReplies,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
