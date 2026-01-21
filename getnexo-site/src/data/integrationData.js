export const integrationData = [
    // E-commerce
    {
        slug: "shopify",
        name: "Shopify",
        category: "E-commerce",
        color: "#96bf48",
        description: "Sincronize pedidos, produtos e clientes entre Shopify e WhatsApp em tempo real.",
        features: ["Recuperação de carrinho abandonado", "Notificação de status de pedido", "Catálogo sincronizado no WhatsApp", "Suporte ao cliente automatizado"],
        painPoints: ["Perda de vendas no checkout", "Suporte lento via email", "Falta de rastreabilidade"],
        benefits: ["Aumento de 30% na conversão", "Atendimento 24/7", "Redução de devoluções"]
    },
    {
        slug: "woocommerce",
        name: "WooCommerce",
        category: "E-commerce",
        color: "#96588a",
        description: "Plugin nativo para WordPress que transforma seu WooCommerce em uma máquina de vendas no WhatsApp.",
        features: ["Envio de PIX copia e cola", "Rastreamento de correios automático", "Recuperação de boletos pendentes", "Chatbot de vendas integrado"],
        painPoints: ["Abandono de carrinho alto", "Dificuldade em confirmar pagamentos", "Gestão manual de pedidos"],
        benefits: ["Checkout transparente", "Pagamentos instantâneos", "Fidelização de clientes"]
    },
    {
        slug: "nuvemshop",
        name: "Nuvemshop",
        category: "E-commerce",
        color: "#263e69",
        description: "Automação completa para a maior plataforma de e-commerce da América Latina.",
        features: ["Atualização de status de entrega", "Ofertas personalizadas pós-venda", "Pesquisa de satisfação automatizada", "Gestão de devoluções"],
        painPoints: ["Falta de comunicação pós-venda", "Baixa taxa de recompra", "Processos manuais demorados"],
        benefits: ["Melhor experiência do cliente", "Aumento do LTV", "Operação simplificada"]
    },
    { slug: "yampi", name: "Yampi", category: "E-commerce", color: "#6c63ff", description: "Potencialize seu checkout transparente com recuperação agressiva via WhatsApp.", features: ["Recuperação de checkout em 5min", "Upsell de produtos", "Confirmação de dados cadastrais"], painPoints: ["Leads frios", "Venda perdida no pagamento"], benefits: ["Conversão recorde", "Vendas adicionais automáticas"] },
    { slug: "cartx", name: "Cartx", category: "E-commerce", color: "#ff4d4d", description: "Sistema de recuperação de receita para dropshipping e e-commerce tradicional.", features: ["Funil de recuperação infinito", "Seguimento de pedidos", "Suporte pré-venda com IA"], painPoints: ["Carrinhos abandonados", "Dúvidas no checkout"], benefits: ["Receita extra garantida", "Redução de chargeback"] },
    { slug: "vtex", name: "VTEX", category: "E-commerce", color: "#f71963", description: "Solução Enterprise para grandes operações de varejo integradas ao WhatsApp.", features: ["Omnichannel real", "Integração com lojas físicas", "Vendedor digital (Clienteling)"], painPoints: ["Silos de dados", "Experiência desconexa"], benefits: ["Unificação de canais", "Escala global"] },
    { slug: "wake-commerce", name: "Wake Commerce", category: "E-commerce", color: "#000000", description: "Ecossistema completo para varejistas que buscam performance máxima.", features: ["Inteligência de dados", "Personalização em massa", "Campanhas segmentadas"], painPoints: ["Marketing genérico", "Baixo engajamento"], benefits: ["Alta relevância", "Retorno sobre Ad spend"] },
    { slug: "tray", name: "Tray", category: "E-commerce", color: "#0047bb", description: "Conecte sua loja Tray ao maior canal de vendas do Brasil.", features: ["Marketplace integration", "Gestão de perguntas do Mercado Livre", "Avisos de estoque"], painPoints: ["Gestão descentralizada", "Perda de timing"], benefits: ["Controle total", "Agilidade nas respostas"] },
    { slug: "loja-integrada", name: "Loja Integrada", category: "E-commerce", color: "#2acfac", description: "Simples, rápido e poderoso. Leve sua Loja Integrada para o WhatsApp.", features: ["Botão flutuante inteligente", "Cupom de primeira compra", "Aviso de pedido enviado"], painPoints: ["Loja pouco interativa", "Dificuldade de conversão"], benefits: ["Loja viva", "Primeira venda rápida"] },
    { slug: "vnda", name: "Vnda", category: "E-commerce", color: "#1a1a1a", description: "Para marcas DNVB que exigem design e experiência premium.", features: ["Experiência de marca consistente", "Curadoria de produtos via chat", "Clube de assinaturas"], painPoints: ["Atendimento robótico", "Perda de identidade"], benefits: ["Branding forte", "Comunidade engajada"] },
    { slug: "uappi", name: "Uappi", category: "E-commerce", color: "#ff9900", description: "Checkout e plataforma focados em performance e mobile-first.", features: ["Mobile commerce nativo", "Pagamento one-click no chat", "Login social via WhatsApp"], painPoints: ["Fricção no mobile", "Checkout lento"], benefits: ["Conversão mobile alta", "Rapidez"] },
    { slug: "iset", name: "Iset", category: "E-commerce", color: "#00a2e8", description: "Plataforma robusta customizável com integração total de API.", features: ["B2B e B2C no mesmo bot", "Tabelas de preço dinâmicas", "Representantes comerciais"], painPoints: ["Complexidade B2B", "Necessidade de customização"], benefits: ["Flexibilidade total", "Atendimento híbrido"] },

    // ERPs
    { slug: "bling", name: "Bling", category: "ERP", color: "#25d366", description: "Automatize a emissão de notas e logística diretamente pelo WhatsApp.", features: ["Envio de NF-e e XML", "Rastreio automático", "Aviso de boleto gerado"], painPoints: ["Processos manuais de backoffice", "Cliente sem informação"], benefits: ["Operação enxuta", "Transparência total"] },
    { slug: "tiny", name: "Tiny", category: "ERP", color: "#0055ff", description: "Eficiência operacional para e-commerce com notificações proativas.", features: ["Separação de pedido (Picking) aviso", "Expedição confirmada", "Gestão de fornecedores"], painPoints: ["Erros de expedição", "Atrasos na comunicação"], benefits: ["Logística precisa", "Cliente informado"] },
    { slug: "totvs-protheus", name: "Totvs Protheus", category: "ERP", color: "#00aec7", description: "O poder do maior ERP do Brasil conectado à agilidade do WhatsApp.", features: ["Workflow de aprovação", "Consultas de RH e Estoque", "BI no WhatsApp"], painPoints: ["ERP complexo e lento", "Falta de mobilidade"], benefits: ["Empresa na palma da mão", "Decisões rápidas"] },
    { slug: "linx", name: "Linx", category: "ERP", color: "#e30613", description: "Revolução para o varejo físico e omni com integração Linx.", features: ["Prateleira infinita", "Retire na loja", "Promoções geolocalizadas"], painPoints: ["Ruptura de estoque", "Lojas físicas vazias"], benefits: ["Tráfego para loja", "Venda sem estoque local"] },
    { slug: "sankhya", name: "Sankhya", category: "ERP", color: "#4caf50", description: "Gestão inteligente que conversa com você pelo WhatsApp.", features: ["Dashboards executivos push", "Alertas de metas", "Gestão de equipe de campo"], painPoints: ["Gestão reativa", "Falta de dados em tempo real"], benefits: ["Gestão proativa", "Equipe alinhada"] },
    { slug: "alterdata", name: "Alterdata", category: "ERP", color: "#cc0000", description: "Soluções contábeis e de varejo integradas para automação fiscal.", features: ["Cobrança de inadimplentes", "Envio de guias e impostos", "Agendamento de serviços"], painPoints: ["Inadimplência alta", "Burocracia no atendimento"], benefits: ["Caixa saudável", "Contador 2.0"] },
    { slug: "data-system", name: "Data System", category: "ERP", color: "#ff6600", description: "Especialista em lojas de calçados e confecções.", features: ["CRM para varejo de moda", "Condicional via WhatsApp", "Aniversariantes do dia"], painPoints: ["Venda passiva", "Cliente esquecido"], benefits: ["Loja sempre cheia", "Relacionamento ativo"] },
    { slug: "alternativa", name: "Alternativa", category: "ERP", color: "#333333", description: "ERP parrudo para grandes redes e franquias.", features: ["Padronização de rede", "Comunicação franqueado-franqueadora", "Pedidos de reposição"], painPoints: ["Descontrole na rede", "Comunicação falha"], benefits: ["Rede unificada", "Padrão de qualidade"] },

    // Pagamentos
    { slug: "mercado-pago", name: "Mercado Pago", category: "Pagamentos", color: "#009ee3", description: "Receba via PIX e Cartão diretamente na conversa do WhatsApp.", features: ["Link de pagamento dinâmico", "Divisão de pagamentos (Split)", "Aviso de pagamento aprovado"], painPoints: ["Fricção para pagar", "Taxas altas de outras maquininhas"], benefits: ["Recebimento na hora", "Maior conversão"] },
    { slug: "pagseguro", name: "PagSeguro", category: "Pagamentos", color: "#96c12e", description: "Segurança e facilidade do PagBank no seu atendimento automático.", features: ["Venda digitada segura", "Boleto híbrido", "Recorrência no cartão"], painPoints: ["Medo de fraude", "Gestão de assinaturas difícil"], benefits: ["Venda segura", "Recorrência garantida"] },
    { slug: "cielo", name: "Cielo", category: "Pagamentos", color: "#00adef", description: "Líder em pagamentos agora integrada ao seu fluxo de chat.", features: ["Link Super Link", "Pagamento por aproximação (NFC) via celular", "Conciliação automática"], painPoints: ["Conciliação financeira manual", "Erros de cobrança"], benefits: ["Controle financeiro", "Facilidade de uso"] },
    { slug: "stone", name: "Stone", category: "Pagamentos", color: "#00a651", description: "Atendimento humano e tecnologia de ponta em pagamentos.", features: ["Conciliação bancária integrada", "Antecipação de recebíveis via bot", "Gestão de chargeback"], painPoints: ["Fluxo de caixa apertado", "Burocracia bancária"], benefits: ["Saúde financeira", "Parceria estratégica"] },
    { slug: "pagar-me", name: "Pagar.me", category: "Pagamentos", color: "#8224e3", description: "Infraestrutura de pagamento digital para quem quer escalar.", features: ["Retentativa inteligente", "Antifraude integrado", "Checkout transparente no chat"], painPoints: ["Pagamentos recusados", "Fraudes no e-commerce"], benefits: ["Aprovação máxima", "Segurança total"] },
    { slug: "vindi", name: "Vindi", category: "Pagamentos", color: "#f37021", description: "Especialista em economia da recorrência e assinaturas.", features: ["Gestão de inadimplência automática", "Régua de cobrança WhatsApp", "Atualização de cartão vencido"], painPoints: ["Churn involuntário", "Cobrança manual trabalhosa"], benefits: ["Receita previsível", "Inadimplência zero"] },
    { slug: "getnet", name: "Getnet", category: "Pagamentos", color: "#ff0000", description: "Solução global do Santander para pagamentos omnichannel.", features: ["Integração com caixa físico", "Link de pagamento internacional", "Split de pagamento"], painPoints: ["Dificuldade em vender global", "Sistemas desconexos"], benefits: ["Venda global", "Omnichannel real"] },

    // CRM
    { slug: "rd-station", name: "RD Station", category: "CRM", color: "#36cbd3", description: "Marketing e Vendas integrados para gerar e converter leads.", features: ["Lead Scoring via WhatsApp", "Gatilho de entrada em fluxo", "Histórico de conversa no CRM"], painPoints: ["Leads desqualificados", "Marketing e Vendas desalinhados"], benefits: ["Leads quentes", "Smarketing funcional"] },
    { slug: "crm-bonus", name: "CRM&Bonus", category: "CRM", color: "#000000", description: "A maior plataforma de Giftback do mundo no seu WhatsApp.", features: ["Envio de bônus automático", "Lembrete de expiração de bônus", "Pesquisa NPS"], painPoints: ["Cliente não volta", "Custo de aquisição alto"], benefits: ["Recompra garantida", "CAC reduzido"] },
    { slug: "wake-experience", name: "Wake Experience", category: "CRM", color: "#4a4a4a", description: "CDP e CRM para criar jornadas de cliente inesquecíveis.", features: ["Visão única do cliente", "Clusterização automática", "Jornadas hyper-personalizadas"], painPoints: ["Dados fragmentados", "Comunicação genérica"], benefits: ["Experiência VIP", "Loyalty extremo"] },
    { slug: "hubspot", name: "HubSpot", category: "CRM", color: "#ff7a59", description: "Inbound Marketing e CRM de classe mundial integrado.", features: ["Criação de tickets de suporte", "Sincronização de contatos bidirecional", "Automação de tarefas de vendas"], painPoints: ["CRM desatualizado", "Falta de processo"], benefits: ["Processo azeitado", "Escalabilidade global"] },

    // Logística
    {
        slug: "correios",
        name: "Correios",
        category: "Logística",
        color: "#ffcc00",
        description: "O maior operador logístico do Brasil na sua automação.",
        features: ["Cálculo de frete em tempo real", "Rastreamento passo a passo", "Aviso de objeto aguardando retirada"],
        painPoints: ["Cliente ansioso ('Cadê meu pedido?')", "Frete mal calculado", "Dificuldade em gerenciar devoluções"],
        benefits: ["Cliente tranquilo", "Precisão no custo", "Logística reversa facilitada"]
    },
    { slug: "melhor-envio", name: "Melhor Envio", category: "Logística", color: "#14bba5", description: "Cotação simultânea em diversas transportadoras.", features: ["Comparativo de preço e prazo no chat", "Geração de etiqueta automática", "Rastreio unificado"], painPoints: ["Frete caro", "Gestão de múltiplas transportadoras"], benefits: ["Frete mais barato", "Logística simplificada"] },
    {
        slug: "loggi",
        name: "Loggi",
        category: "Logística",
        color: "#00a1ff",
        description: "Tecnologia e agilidade para entregas expressas via WhatsApp.",
        features: ["Solicitação de coleta via chat", "Acompanhamento em tempo real", "Prova de entrega digital"],
        painPoints: ["Entregas lentas", "Falta de visibilidade urbana", "Dificuldade em acionar motoboys"],
        benefits: ["Entrega no mesmo dia", "Modernidade", "Rastreabilidade total do entregador"]
    },
    { slug: "99-entrega", name: "99 Entrega", category: "Logística", color: "#d9d926", description: "Entregas corporativas rápidas usando a frota da 99.", features: ["Chamar motoboy via WhatsApp", "Link de acompanhamento", "Pagamento corporativo"], painPoints: ["Falta de motoboys", "Custo fixo com frota"], benefits: ["Frota sob demanda", "Custo variável"] },
    { slug: "frenet", name: "Frenet", category: "Logística", color: "#2d3e50", description: "Gateway de fretes que conecta você às melhores opções.", features: ["Regras de frete avançadas", "Bloqueio de transportadoras problemáticas", "Auditoria de faturas"], painPoints: ["Prejuízo com frete", "Áreas de risco"], benefits: ["Gestão profissional", "Lucro no frete"] },

    // Infoprodutos
    { slug: "hotmart", name: "Hotmart", category: "Infoprodutos", color: "#f04e23", description: "Escale suas vendas de cursos e infoprodutos com automação Hotmart.", features: ["Recuperação de boleto vencido", "HotLeads no WhatsApp", "Entrega de acesso automática"], painPoints: ["Conversão de boleto baixa", "Pirataria"], benefits: ["Recuperação de até 40%", "Gestão de alunos"] },
    { slug: "kiwify", name: "Kiwify", category: "Infoprodutos", color: "#3dc13c", description: "A plataforma para quem joga o jogo do high-stakes.", features: ["Upsell de 1 clique no chat", "Recuperação de checkout instantânea", "Área de membros integrada"], painPoints: ["Checkout complexo", "Perda de impulso de compra"], benefits: ["Venda impulsiva", "Máxima rentabilidade"] },
    { slug: "eduzz", name: "Eduzz", category: "Infoprodutos", color: "#ffc107", description: "Ecossistema completo para produtores e afiliados.", features: ["Automação para afiliados", "Cobrança de recorrência", "Funil de vendas perpétuo"], painPoints: ["Gestão de afiliados difícil", "Vendas instáveis"], benefits: ["Exército de afiliados", "Venda recorrente"] },

    // Ferramentas
    { slug: "n8n", name: "n8n", category: "Automação", color: "#ff6b6b", description: "Workflow Automation gratuito e open-source com nós nativos GetNexo.", features: ["Triggers de mensagem recebida", "Lógica complexa de decisão", "Conexão com +500 apps", "Hospedagem própria ou nuvem"], painPoints: ["Limitações de ferramentas pagas", "Alto custo de automação"], benefits: ["Liberdade total", "Custo zero de licença"] },
    { slug: "make", name: "Make", category: "Automação", color: "#6e44ff", description: "Antigo Integromat. Crie cenários visuais complexos e poderosos.", features: ["Interface visual drag-and-drop", "Tratamento de erros avançado", "Agendamento de tarefas", "Iteradores e agregadores"], painPoints: ["API complexa", "Dificuldade de visualização"], benefits: ["Poder visual", "Qualquer fluxo possível"] },
    { slug: "zapier", name: "Zapier", category: "Automação", color: "#ff4f00", description: "O rei das integrações. Conecte o GetNexo a 5000+ apps em minutos.", features: ["Zaps prontos para uso", "Filtros e formatadores", "Webhooks confiáveis", "Automação sem código"], painPoints: ["Falta de integração direta", "Tempo de desenvolvimento"], benefits: ["Conectividade universal", "Velocidade de implantação"] },
    { slug: "google-sheets", name: "Google Sheets", category: "Dados", color: "#0f9d58", description: "Transforme suas planilhas em banco de dados e CRM simplificado.", features: ["Salvar leads na planilha", "Ler dados da planilha para o chat", "Dashboards simples", "Backup de contatos"], painPoints: ["Complexidade de banco de dados", "Perda de dados"], benefits: ["Simplicidade", "Gratuito"] },
    { slug: "calendly", name: "Calendly", category: "Agendamento", color: "#006bff", description: "Agendamento de reuniões e consultas sem vai-e-vem de mensagens.", features: ["Envio de link de agenda", "Confirmação automática", "Lembrete pré-reunião", "Reagendamento fácil"], painPoints: ["No-show em reuniões", "Tempo perdido agendando"], benefits: ["Agenda cheia", "Profissionalismo"] },
];
