import { f as createComponent, r as renderTemplate, k as renderComponent, m as maybeRenderHead } from "../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$Layout } from "../assets/Layout-DScI-qCd.js";
/* empty css                                             */
import { renderers } from "../renderers.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a, _b;
const $$AnaliseSentimento = createComponent(($$result, $$props, $$slots) => {
  const title = "Análise de Sentimento WhatsApp - IA Detecta Emoções em Tempo Real | GetNexo";
  const description = "Análise de sentimento avançada no WhatsApp. IA detecta satisfação, frustração, urgência e raiva automaticamente. 92% precisão, escalonamento inteligente, relatórios NPS.";
  const keywords = "analise sentimento whatsapp, ia emocao whatsapp, deteccao sentimento tempo real, analise sentimento cliente, nps whatsapp, satisfacao cliente whatsapp, escalonamento automatico whatsapp";
  return renderTemplate(_b || (_b = __template(["", `  <script>
  function verDemoSentimento() {
    // Interactive sentiment demo
    const sentiments = [
      { text: "Adorei o produto! 5 estrelas!", emotion: "satisfaction", score: "95%" },
      { text: "Por que demorou tanto?", emotion: "frustration", score: "78%" },
      { text: "Quanto custa?", emotion: "neutral", score: "45%" },
      { text: "ESTOU MUITO BRAVO!", emotion: "anger", score: "92%" },
      { text: "UAU! Melhor compra da vida!", emotion: "joy", score: "98%" }
    ];

    let currentIndex = 0;
    const interval = setInterval(() => {
      const sentiment = sentiments[currentIndex];
      const container = document.querySelector('.sentiment-stream');

      const newItem = document.createElement('div');
      newItem.className = \`sentiment-item \${sentiment.emotion}\`;
      newItem.innerHTML = \`
        <div class="sentiment-icon">\${getEmotionIcon(sentiment.emotion)}</div>
        <div class="sentiment-content">
          <span class="sentiment-text">"\${sentiment.text}"</span>
          <span class="sentiment-score">\${sentiment.score} \${getEmotionLabel(sentiment.emotion)}</span>
        </div>
      \`;

      container.insertBefore(newItem, container.firstChild);

      // Remove old items to keep only 3-4 visible
      while (container.children.length > 4) {
        container.removeChild(container.lastChild);
      }

      currentIndex = (currentIndex + 1) % sentiments.length;
    }, 3000);

    function getEmotionIcon(emotion) {
      const icons = {
        satisfaction: '😊',
        frustration: '😤',
        neutral: '😐',
        anger: '😡',
        joy: '🤩'
      };
      return icons[emotion] || '😐';
    }

    function getEmotionLabel(emotion) {
      const labels = {
        satisfaction: 'Satisfação',
        frustration: 'Frustração',
        neutral: 'Neutro',
        anger: 'Raiva',
        joy: 'Alegria'
      };
      return labels[emotion] || 'Neutro';
    }
  }

  // Start demo automatically
  setTimeout(verDemoSentimento, 2000);
<\/script>`], ["", `  <script>
  function verDemoSentimento() {
    // Interactive sentiment demo
    const sentiments = [
      { text: "Adorei o produto! 5 estrelas!", emotion: "satisfaction", score: "95%" },
      { text: "Por que demorou tanto?", emotion: "frustration", score: "78%" },
      { text: "Quanto custa?", emotion: "neutral", score: "45%" },
      { text: "ESTOU MUITO BRAVO!", emotion: "anger", score: "92%" },
      { text: "UAU! Melhor compra da vida!", emotion: "joy", score: "98%" }
    ];

    let currentIndex = 0;
    const interval = setInterval(() => {
      const sentiment = sentiments[currentIndex];
      const container = document.querySelector('.sentiment-stream');

      const newItem = document.createElement('div');
      newItem.className = \\\`sentiment-item \\\${sentiment.emotion}\\\`;
      newItem.innerHTML = \\\`
        <div class="sentiment-icon">\\\${getEmotionIcon(sentiment.emotion)}</div>
        <div class="sentiment-content">
          <span class="sentiment-text">"\\\${sentiment.text}"</span>
          <span class="sentiment-score">\\\${sentiment.score} \\\${getEmotionLabel(sentiment.emotion)}</span>
        </div>
      \\\`;

      container.insertBefore(newItem, container.firstChild);

      // Remove old items to keep only 3-4 visible
      while (container.children.length > 4) {
        container.removeChild(container.lastChild);
      }

      currentIndex = (currentIndex + 1) % sentiments.length;
    }, 3000);

    function getEmotionIcon(emotion) {
      const icons = {
        satisfaction: '😊',
        frustration: '😤',
        neutral: '😐',
        anger: '😡',
        joy: '🤩'
      };
      return icons[emotion] || '😐';
    }

    function getEmotionLabel(emotion) {
      const labels = {
        satisfaction: 'Satisfação',
        frustration: 'Frustração',
        neutral: 'Neutro',
        anger: 'Raiva',
        joy: 'Alegria'
      };
      return labels[emotion] || 'Neutro';
    }
  }

  // Start demo automatically
  setTimeout(verDemoSentimento, 2000);
<\/script>`])), renderComponent($$result, "Layout", $$Layout, { "title": title, "description": description, "keywords": keywords, "data-astro-cid-zju54x4q": true }, { "default": ($$result2) => renderTemplate(_a || (_a = __template([' <script type="application/ld+json">\n  {\n    "@context": "https://schema.org",\n    "@graph": [\n      {\n        "@type": "SoftwareApplication",\n        "@id": "https://getnexo.com.br/analise-sentimento",\n        "name": "GetNexo Sentiment Analysis",\n        "applicationCategory": "BusinessApplication",\n        "description": "Análise avançada de sentimento no WhatsApp com IA que detecta emoções em tempo real",\n        "offers": {\n          "@type": "Offer",\n          "price": "0",\n          "priceCurrency": "BRL",\n          "description": "Funcionalidade incluída no plano gratuito"\n        },\n        "aggregateRating": {\n          "@ratingValue": "4.9",\n          "ratingCount": "500"\n        }\n      },\n      {\n        "@type": "FAQPage",\n        "mainEntity": [\n          {\n            "@type": "Question",\n            "name": "Como funciona a análise de sentimento?",\n            "acceptedAnswer": {\n              "@type": "Answer",\n              "text": "Nossa IA analisa cada mensagem em tempo real, identificando 7 tipos de emoções: satisfação, frustração, urgência, raiva, neutralidade, alegria e preocupação. Processamento em menos de 3 segundos."\n            }\n          },\n          {\n            "@type": "Question",\n            "name": "Qual é a precisão da detecção?",\n            "acceptedAnswer": {\n              "@type": "Answer",\n              "text": "92% de precisão após treinamento específico no português brasileiro. Melhoramos continuamente com dados reais de clientes."\n            }\n          }\n        ]\n      }\n    ]\n  }\n  <\/script>  ', '<section class="hero-section" data-astro-cid-zju54x4q> <div class="hero-content" data-astro-cid-zju54x4q> <div class="hero-badge" data-astro-cid-zju54x4q>🎭 IA Emocional</div> <h1 data-astro-cid-zju54x4q>Conheça os Sentimentos dos Seus Clientes Antes que Eles Digam</h1> <p data-astro-cid-zju54x4q>IA que lê nas entrelinhas do WhatsApp. Detecta satisfação, frustração, urgência e raiva automaticamente. Escalona atendimentos críticos e gera relatórios NPS precisos.</p> <div class="hero-features" data-astro-cid-zju54x4q> <span data-astro-cid-zju54x4q>✅ 92% Precisão</span> <span data-astro-cid-zju54x4q>✅ 7 Emoções Detectadas</span> <span data-astro-cid-zju54x4q>✅ Escalona Automaticamente</span> </div> <div class="hero-ctas" data-astro-cid-zju54x4q> <a href="/criar-bot" class="btn-primary" data-astro-cid-zju54x4q>Ativar Análise de Sentimento</a> <button onclick="verDemoSentimento()" class="btn-secondary" data-astro-cid-zju54x4q>Ver Demo em Tempo Real</button> </div> </div> <div class="hero-visual" data-astro-cid-zju54x4q> <div class="sentiment-dashboard" data-astro-cid-zju54x4q> <div class="dashboard-header" data-astro-cid-zju54x4q>🎭 Análise de Sentimento - Tempo Real</div> <div class="sentiment-stream" data-astro-cid-zju54x4q> <div class="sentiment-item positive" data-astro-cid-zju54x4q> <div class="sentiment-icon" data-astro-cid-zju54x4q>😊</div> <div class="sentiment-content" data-astro-cid-zju54x4q> <span class="sentiment-text" data-astro-cid-zju54x4q>"Adorei o produto! Chegou super rápido"</span> <span class="sentiment-score" data-astro-cid-zju54x4q>95% Satisfação</span> </div> </div> <div class="sentiment-item urgent" data-astro-cid-zju54x4q> <div class="sentiment-icon" data-astro-cid-zju54x4q>😤</div> <div class="sentiment-content" data-astro-cid-zju54x4q> <span class="sentiment-text" data-astro-cid-zju54x4q>"Já faz 3 dias que pedi e nada!"</span> <span class="sentiment-score" data-astro-cid-zju54x4q>78% Frustração - ESCALADO</span> </div> </div> <div class="sentiment-item neutral" data-astro-cid-zju54x4q> <div class="sentiment-icon" data-astro-cid-zju54x4q>😐</div> <div class="sentiment-content" data-astro-cid-zju54x4q> <span class="sentiment-text" data-astro-cid-zju54x4q>"Quanto custa o frete?"</span> <span class="sentiment-score" data-astro-cid-zju54x4q>45% Neutro</span> </div> </div> </div> </div> </div> </section>  <section class="emotions-deep" data-astro-cid-zju54x4q> <div class="section-header" data-astro-cid-zju54x4q> <h2 data-astro-cid-zju54x4q>7 Emoções Detectadas com Precisão Científica</h2> <p data-astro-cid-zju54x4q>Cada sentimento é uma oportunidade para melhorar seu atendimento</p> </div> <div class="emotions-grid" data-astro-cid-zju54x4q> <div class="emotion-card satisfaction" data-astro-cid-zju54x4q> <div class="emotion-header" data-astro-cid-zju54x4q> <div class="emotion-icon" data-astro-cid-zju54x4q>😊</div> <h3 data-astro-cid-zju54x4q>Satisfação</h3> </div> <p data-astro-cid-zju54x4q>Clientes felizes que elogiam seu produto/serviço. Use para identificar pontos positivos e gerar cases de sucesso.</p> <div class="emotion-stats" data-astro-cid-zju54x4q> <span data-astro-cid-zju54x4q>Precisão: 94%</span> <span data-astro-cid-zju54x4q>Auto-gerar: Cases de sucesso</span> </div> </div> <div class="emotion-card frustration" data-astro-cid-zju54x4q> <div class="emotion-header" data-astro-cid-zju54x4q> <div class="emotion-icon" data-astro-cid-zju54x4q>😤</div> <h3 data-astro-cid-zju54x4q>Frustração</h3> </div> <p data-astro-cid-zju54x4q>Clientes insatisfeitos com algum aspecto. Escalona automaticamente para atendimento prioritário VIP.</p> <div class="emotion-stats" data-astro-cid-zju54x4q> <span data-astro-cid-zju54x4q>Precisão: 91%</span> <span data-astro-cid-zju54x4q>Escalonamento: Automático</span> </div> </div> <div class="emotion-card urgency" data-astro-cid-zju54x4q> <div class="emotion-header" data-astro-cid-zju54x4q> <div class="emotion-icon" data-astro-cid-zju54x4q>🚨</div> <h3 data-astro-cid-zju54x4q>Urgência</h3> </div> <p data-astro-cid-zju54x4q>Situações que precisam de resposta imediata. Prioriza na fila e notifica equipe com alertas sonoros.</p> <div class="emotion-stats" data-astro-cid-zju54x4q> <span data-astro-cid-zju54x4q>Precisão: 96%</span> <span data-astro-cid-zju54x4q>Resposta: <5 min</span> </div> </div> <div class="emotion-card anger" data-astro-cid-zju54x4q> <div class="emotion-header" data-astro-cid-zju54x4q> <div class="emotion-icon" data-astro-cid-zju54x4q>😡</div> <h3 data-astro-cid-zju54x4q>Raiva</h3> </div> <p data-astro-cid-zju54x4q>Clientes muito irritados. Escalona para gerente sênior e gera relatório automático de incidente crítico.</p> <div class="emotion-stats" data-astro-cid-zju54x4q> <span data-astro-cid-zju54x4q>Precisão: 89%</span> <span data-astro-cid-zju54x4q>Escalação: Gerente</span> </div> </div> <div class="emotion-card joy" data-astro-cid-zju54x4q> <div class="emotion-header" data-astro-cid-zju54x4q> <div class="emotion-icon" data-astro-cid-zju54x4q>🤩</div> <h3 data-astro-cid-zju54x4q>Alegria</h3> </div> <p data-astro-cid-zju54x4q>Clientes extremamente felizes. Oportunidade para upselling e indicação. Gera cupons de agradecimento automático.</p> <div class="emotion-stats" data-astro-cid-zju54x4q> <span data-astro-cid-zju54x4q>Precisão: 87%</span> <span data-astro-cid-zju54x4q>Auto-ação: Cupom desconto</span> </div> </div> <div class="emotion-card concern" data-astro-cid-zju54x4q> <div class="emotion-header" data-astro-cid-zju54x4q> <div class="emotion-icon" data-astro-cid-zju54x4q>😟</div> <h3 data-astro-cid-zju54x4q>Preocupação</h3> </div> <p data-astro-cid-zju54x4q>Clientes preocupados com algum aspecto. Oferece garantias extras e suporte adicional automaticamente.</p> <div class="emotion-stats" data-astro-cid-zju54x4q> <span data-astro-cid-zju54x4q>Precisão: 85%</span> <span data-astro-cid-zju54x4q>Auto-resposta: Garantias</span> </div> </div> <div class="emotion-card neutral" data-astro-cid-zju54x4q> <div class="emotion-header" data-astro-cid-zju54x4q> <div class="emotion-icon" data-astro-cid-zju54x4q>😐</div> <h3 data-astro-cid-zju54x4q>Neutro</h3> </div> <p data-astro-cid-zju54x4q>Conversas objetivas sem emoção aparente. Mantém atendimento padrão mas monitora evolução da conversa.</p> <div class="emotion-stats" data-astro-cid-zju54x4q> <span data-astro-cid-zju54x4q>Precisão: 93%</span> <span data-astro-cid-zju54x4q>Ação: Monitoramento</span> </div> </div> </div> </section>  <section class="technology-section" data-astro-cid-zju54x4q> <div class="section-header" data-astro-cid-zju54x4q> <h2 data-astro-cid-zju54x4q>Tecnologia de Ponta em Processamento de Linguagem Natural</h2> <p data-astro-cid-zju54x4q>Modelo treinado especificamente para o português brasileiro do WhatsApp</p> </div> <div class="tech-features" data-astro-cid-zju54x4q> <div class="tech-feature" data-astro-cid-zju54x4q> <div class="tech-icon" data-astro-cid-zju54x4q>🧠</div> <h3 data-astro-cid-zju54x4q>Modelo BERT Customizado</h3> <p data-astro-cid-zju54x4q>Baseado no BERTimbau, fine-tunado com milhões de mensagens reais do WhatsApp brasileiro. Entende gírias, erros de digitação e contexto cultural.</p> </div> <div class="tech-feature" data-astro-cid-zju54x4q> <div class="tech-icon" data-astro-cid-zju54x4q>⚡</div> <h3 data-astro-cid-zju54x4q>Processamento em Tempo Real</h3> <p data-astro-cid-zju54x4q>Análise completa em menos de 3 segundos. Funciona mesmo com mensagens longas, emojis e áudios transcritos automaticamente.</p> </div> <div class="tech-feature" data-astro-cid-zju54x4q> <div class="tech-icon" data-astro-cid-zju54x4q>📚</div> <h3 data-astro-cid-zju54x4q>Dataset Brasileiro</h3> <p data-astro-cid-zju54x4q>Treinado com 50 milhões de mensagens reais do WhatsApp brasileiro. Conhece o jeitinho brasileiro de falar e expressar emoções.</p> </div> <div class="tech-feature" data-astro-cid-zju54x4q> <div class="tech-icon" data-astro-cid-zju54x4q>🔄</div> <h3 data-astro-cid-zju54x4q>Aprendizado Contínuo</h3> <p data-astro-cid-zju54x4q>Melhora automaticamente com cada interação. Correções manuais ensinam o sistema a ser mais preciso com o tempo.</p> </div> </div> </section>  <section class="auto-actions" data-astro-cid-zju54x4q> <div class="section-header" data-astro-cid-zju54x4q> <h2 data-astro-cid-zju54x4q>Ações Automáticas Baseadas em Sentimento</h2> <p data-astro-cid-zju54x4q>Cada emoção dispara uma resposta inteligente e personalizada</p> </div> <div class="actions-workflow" data-astro-cid-zju54x4q> <div class="action-step" data-astro-cid-zju54x4q> <div class="action-icon" data-astro-cid-zju54x4q>1️⃣</div> <h3 data-astro-cid-zju54x4q>Detecção</h3> <p data-astro-cid-zju54x4q>Mensagem chega → IA analisa → Sentimento identificado</p> </div> <div class="action-arrow" data-astro-cid-zju54x4q>→</div> <div class="action-step" data-astro-cid-zju54x4q> <div class="action-icon" data-astro-cid-zju54x4q>2️⃣</div> <h3 data-astro-cid-zju54x4q>Classificação</h3> <p data-astro-cid-zju54x4q>Sentimento mapeado → Urgência calculada → Prioridade definida</p> </div> <div class="action-arrow" data-astro-cid-zju54x4q>→</div> <div class="action-step" data-astro-cid-zju54x4q> <div class="action-icon" data-astro-cid-zju54x4q>3️⃣</div> <h3 data-astro-cid-zju54x4q>Ação Automática</h3> <p data-astro-cid-zju54x4q>Regra aplicada → Notificações enviadas → Relatório gerado</p> </div> </div> <div class="actions-examples" data-astro-cid-zju54x4q> <div class="action-example" data-astro-cid-zju54x4q> <div class="action-trigger" data-astro-cid-zju54x4q>😤 Frustração Detectada</div> <div class="action-result" data-astro-cid-zju54x4q>→ Escalonamento para atendente sênior + cupom de desconto automático</div> </div> <div class="action-example" data-astro-cid-zju54x4q> <div class="action-trigger" data-astro-cid-zju54x4q>🤩 Alegria Extrema</div> <div class="action-result" data-astro-cid-zju54x4q>→ Geração de case de sucesso + indicação automática para amigos</div> </div> <div class="action-example" data-astro-cid-zju54x4q> <div class="action-trigger" data-astro-cid-zju54x4q>🚨 Urgência Alta</div> <div class="action-result" data-astro-cid-zju54x4q>→ Notificação push para equipe + resposta prioritária em 2 min</div> </div> </div> </section>  <section class="performance-metrics" data-astro-cid-zju54x4q> <div class="section-header" data-astro-cid-zju54x4q> <h2 data-astro-cid-zju54x4q>Resultados Comprovados em Produção</h2> <p data-astro-cid-zju54x4q>Números que mostram o impacto real da análise de sentimento</p> </div> <div class="metrics-dashboard" data-astro-cid-zju54x4q> <div class="metric-item" data-astro-cid-zju54x4q> <div class="metric-value" data-astro-cid-zju54x4q>92%</div> <div class="metric-label" data-astro-cid-zju54x4q>Precisão Média</div> <div class="metric-breakdown" data-astro-cid-zju54x4q> <span data-astro-cid-zju54x4q>Satisfação: 94%</span> <span data-astro-cid-zju54x4q>Frustração: 91%</span> <span data-astro-cid-zju54x4q>Urgência: 96%</span> </div> </div> <div class="metric-item" data-astro-cid-zju54x4q> <div class="metric-value" data-astro-cid-zju54x4q>3s</div> <div class="metric-label" data-astro-cid-zju54x4q>Tempo de Análise</div> <div class="metric-breakdown" data-astro-cid-zju54x4q> <span data-astro-cid-zju54x4q>Processamento: <1s</span> <span data-astro-cid-zju54x4q>Classificação: <2s</span> <span data-astro-cid-zju54x4q>Ação: Instantâneo</span> </div> </div> <div class="metric-item" data-astro-cid-zju54x4q> <div class="metric-value" data-astro-cid-zju54x4q>67%</div> <div class="metric-label" data-astro-cid-zju54x4q>Redução Reclamações</div> <div class="metric-breakdown" data-astro-cid-zju54x4q> <span data-astro-cid-zju54x4q>Escalonamento: +45%</span> <span data-astro-cid-zju54x4q>Resolução: +22%</span> <span data-astro-cid-zju54x4q>Prevenção: +89%</span> </div> </div> <div class="metric-item" data-astro-cid-zju54x4q> <div class="metric-value" data-astro-cid-zju54x4q>4.8/5</div> <div class="metric-label" data-astro-cid-zju54x4q>NPS Melhorado</div> <div class="metric-breakdown" data-astro-cid-zju54x4q> <span data-astro-cid-zju54x4q>Antes: 3.2/5</span> <span data-astro-cid-zju54x4q>Depois: 4.8/5</span> <span data-astro-cid-zju54x4q>Melhoria: +50%</span> </div> </div> </div> </section>  <section class="real-cases" data-astro-cid-zju54x4q> <div class="section-header" data-astro-cid-zju54x4q> <h2 data-astro-cid-zju54x4q>Casos Reais de Análise de Sentimento</h2> <p data-astro-cid-zju54x4q>Como a detecção emocional salvou vendas e melhorou atendimento</p> </div> <div class="cases-stories" data-astro-cid-zju54x4q> <div class="case-story" data-astro-cid-zju54x4q> <div class="case-emotion" data-astro-cid-zju54x4q>😤 Frustração → 🤩 Satisfação</div> <h3 data-astro-cid-zju54x4q>"Já faz 3 dias que pedi e nada!"</h3> <p data-astro-cid-zju54x4q>Cliente frustrado com demora na entrega. Sistema detectou frustração alta, escalou automaticamente para gerente que resolveu com frete express grátis. Cliente deu 5 estrelas e indicou 3 amigos.</p> <div class="case-result" data-astro-cid-zju54x4q>💰 Venda salva + 3 indicações + Avaliação 5★</div> </div> <div class="case-story" data-astro-cid-zju54x4q> <div class="case-emotion" data-astro-cid-zju54x4q>🚨 Urgência → ✅ Resolvido</div> <h3 data-astro-cid-zju54x4q>"PRECISO devolver AGORA!"</h3> <p data-astro-cid-zju54x4q>Cliente em pânico precisava devolver produto urgente. Detecção de urgência ativou protocolo VIP: coleta agendada em 1 hora, reembolso imediato no cartão. Cliente se tornou embaixador da marca.</p> <div class="case-result" data-astro-cid-zju54x4q>🏆 Cliente VIP + Marketing boca a boca</div> </div> <div class="case-story" data-astro-cid-zju54x4q> <div class="case-emotion" data-astro-cid-zju54x4q>😊 Satisfação → 💎 Lifetime Value</div> <h3 data-astro-cid-zju54x4q>"Melhor atendimento que já tive!"</h3> <p data-astro-cid-zju54x4q>Cliente satisfeito elogiou atendimento. Sistema detectou alegria, gerou automaticamente cupom de 20% desconto e adicionou programa fidelidade. Cliente fez 3 compras extras no mês.</p> <div class="case-result" data-astro-cid-zju54x4q>📈 +180% no lifetime value do cliente</div> </div> </div> </section>  <section class="nps-integration" data-astro-cid-zju54x4q> <div class="section-header" data-astro-cid-zju54x4q> <h2 data-astro-cid-zju54x4q>NPS Automático e Relatórios Avançados</h2> <p data-astro-cid-zju54x4q>Transforme cada interação em dados acionáveis</p> </div> <div class="nps-features" data-astro-cid-zju54x4q> <div class="nps-feature" data-astro-cid-zju54x4q> <div class="nps-icon" data-astro-cid-zju54x4q>📊</div> <h3 data-astro-cid-zju54x4q>Dashboard NPS em Tempo Real</h3> <p data-astro-cid-zju54x4q>Acompanhe satisfação do cliente em tempo real. Gráficos atualizados a cada interação com drill-down por produto, região e período.</p> </div> <div class="nps-feature" data-astro-cid-zju54x4q> <div class="nps-icon" data-astro-cid-zju54x4q>🎯</div> <h3 data-astro-cid-zju54x4q>Pesquisas Automáticas</h3> <p data-astro-cid-zju54x4q>Após cada atendimento, sistema envia pesquisa NPS personalizada baseada no sentimento detectado durante a conversa.</p> </div> <div class="nps-feature" data-astro-cid-zju54x4q> <div class="nps-icon" data-astro-cid-zju54x4q>📈</div> <h3 data-astro-cid-zju54x4q>Relatórios Executivos</h3> <p data-astro-cid-zju54x4q>Relatórios semanais com tendências de satisfação, pontos de melhoria e comparações com benchmarks do mercado.</p> </div> </div> </section>  <section class="pricing-section" data-astro-cid-zju54x4q> <div class="section-header" data-astro-cid-zju54x4q> <h2 data-astro-cid-zju54x4q>Análise de Sentimento Gratuita</h2> <p data-astro-cid-zju54x4q>Funcionalidade essencial incluída em todos os planos</p> </div> <div class="pricing-comparison" data-astro-cid-zju54x4q> <div class="pricing-card included" data-astro-cid-zju54x4q> <div class="card-header" data-astro-cid-zju54x4q> <h3 data-astro-cid-zju54x4q>Plano Gratuito</h3> <div class="price" data-astro-cid-zju54x4q>R$ 0</div> </div> <ul class="features-list" data-astro-cid-zju54x4q> <li data-astro-cid-zju54x4q>✅ Análise de Sentimento Básica</li> <li data-astro-cid-zju54x4q>✅ 7 Emoções Detectadas</li> <li data-astro-cid-zju54x4q>✅ Escalona Frustração Alta</li> <li data-astro-cid-zju54x4q>✅ Dashboard NPS Simples</li> <li data-astro-cid-zju54x4q>✅ Até 1.000 mensagens/mês</li> </ul> <a href="/criar-bot" class="cta-button" data-astro-cid-zju54x4q>Começar Grátis</a> </div> <div class="pricing-card premium" data-astro-cid-zju54x4q> <div class="card-header" data-astro-cid-zju54x4q> <h3 data-astro-cid-zju54x4q>Business</h3> <div class="price" data-astro-cid-zju54x4q>R$ 197<span data-astro-cid-zju54x4q>/mês</span></div> </div> <ul class="features-list" data-astro-cid-zju54x4q> <li data-astro-cid-zju54x4q>✅ Tudo do Gratuito</li> <li data-astro-cid-zju54x4q>✅ Ações Automáticas Avançadas</li> <li data-astro-cid-zju54x4q>✅ Relatórios NPS Detalhados</li> <li data-astro-cid-zju54x4q>✅ API de Integração</li> <li data-astro-cid-zju54x4q>✅ Mensagens Ilimitadas</li> </ul> <a href="/precos" class="cta-button secondary" data-astro-cid-zju54x4q>Ver Planos</a> </div> </div> </section>  <section class="faq-section" data-astro-cid-zju54x4q> <div class="section-header" data-astro-cid-zju54x4q> <h2 data-astro-cid-zju54x4q>Perguntas Sobre Análise de Sentimento</h2> </div> <div class="faq-list" data-astro-cid-zju54x4q> <details class="faq-item" data-astro-cid-zju54x4q> <summary data-astro-cid-zju54x4q>A análise funciona com áudios e imagens?</summary> <div class="faq-answer" data-astro-cid-zju54x4q> <p data-astro-cid-zju54x4q>Sim! Áudios são transcritos automaticamente pela IA e analisados pelo mesmo modelo de sentimento. Imagens são analisadas por OCR para texto e detecção visual básica de expressões.</p> </div> </details> <details class="faq-item" data-astro-cid-zju54x4q> <summary data-astro-cid-zju54x4q>Como sei que a detecção está correta?</summary> <div class="faq-answer" data-astro-cid-zju54x4q> <p data-astro-cid-zju54x4q>Dashboard mostra precisão em tempo real. Você pode corrigir manualmente qualquer detecção errada - o sistema aprende com suas correções e melhora automaticamente.</p> </div> </details> <details class="faq-item" data-astro-cid-zju54x4q> <summary data-astro-cid-zju54x4q>A análise funciona em outros idiomas?</summary> <div class="faq-answer" data-astro-cid-zju54x4q> <p data-astro-cid-zju54x4q>Atualmente otimizada para português brasileiro. Suporte para espanhol, inglês e francês em desenvolvimento. Precisão cai para ~75% em outros idiomas.</p> </div> </details> <details class="faq-item" data-astro-cid-zju54x4q> <summary data-astro-cid-zju54x4q>E se o cliente usar sarcasmo ou ironia?</summary> <div class="faq-answer" data-astro-cid-zju54x4q> <p data-astro-cid-zju54x4q>Nosso modelo é treinado para detectar sarcasmo contextual. Quando não tem certeza (abaixo de 70% confiança), classifica como "neutro" e prioriza para análise humana.</p> </div> </details> </div> </section>  <section class="final-cta" data-astro-cid-zju54x4q> <div class="cta-content" data-astro-cid-zju54x4q> <h2 data-astro-cid-zju54x4q>Entenda seus Clientes como Nunca Antes</h2> <p data-astro-cid-zju54x4q>Análise de sentimento 24/7 + escalonamento automático = Satisfação do cliente no máximo. Setup em 5 minutos.</p> <a href="/criar-bot" class="btn-primary-large" data-astro-cid-zju54x4q>Ativar Análise de Sentimento →</a> </div> </section> '])), maybeRenderHead()) }));
}, "/home/lele/usenexo/getnexo-site/src/pages/analise-sentimento.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/analise-sentimento.astro";
const $$url = "/analise-sentimento";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$AnaliseSentimento,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
