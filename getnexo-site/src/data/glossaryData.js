export const glossaryData = [
    {
        slug: "api-oficial",
        term: "API Oficial WhatsApp (Cloud API)",
        definition: "Interface de programação oficial fornecida pela Meta (Facebook) que permite a empresas enviarem e receberem mensagens em larga escala de forma legal e segura.",
        details: "Diferente de soluções piratas que emulam um celular, a API Oficial se conecta diretamente aos servidores do WhatsApp/Meta. Isso garante alta entregabilidade, zero risco de banimento por 'uso de software não oficial' e acesso a recursos avançados como botões interativos e mensagens de lista.",
        related: ["BSP", "Webhook", "HSM"]
    },
    {
        slug: "webhook",
        term: "Webhook",
        definition: "Mecanismo que permite que um sistema (como o WhatsApp) notifique outro sistema (seu servidor) automaticamente sempre que um evento ocorre.",
        details: "No contexto do WhatsApp, um Webhook é disparado sempre que você recebe uma mensagem, o status de uma mensagem muda (ex: lida) ou um botão é clicado. É a base para criar chatbots responsivos em tempo real.",
        related: ["API Oficial", "JSON"]
    },
    {
        slug: "hsm",
        term: "HSM (Template Message)",
        definition: "Highly Structured Message. São modelos de mensagem pré-aprovados pela Meta para iniciar conversas ativas com clientes (Notificações).",
        details: "Para evitar spam, a Meta exige que todas as mensagens enviadas por empresas fora da janela de 24h sejam templates aprovados. Eles podem conter variáveis {{1}}, botões de ação e mídia.",
        related: ["Janela de 24h", "API Oficial"]
    },
    {
        slug: "janela-24h",
        term: "Janela de Atendimento de 24h",
        definition: "Período de tempo em que uma empresa pode responder livremente a um cliente após receber uma mensagem dele.",
        details: "Quando um cliente envia uma mensagem, abre-se uma sessão de 24 horas. Dentro desse período, a empresa pode enviar qualquer tipo de mensagem (texto, áudio, imagem) sem custo adicional e sem aprovação de template. O GetNexo otimiza o uso dessa janela.",
        related: ["HSM", "Sessão"]
    },
    {
        slug: "bsp",
        term: "BSP (Business Solution Provider)",
        definition: "Parceiro oficial da Meta autorizado a revender o acesso à API do WhatsApp Business.",
        details: "Exemplos incluem Twilio, Gupshup e Wati. Geralmente, BSPs cobram uma taxa adicional sobre o preço oficial da Meta. O GetNexo permite conectar-se diretamente à Cloud API (sem BSP) ou usar sua própria infraestrutura.",
        related: ["API Oficial"]
    },
    {
        slug: "chatbot-ia",
        term: "Chatbot com IA Generativa",
        definition: "Assistente virtual que usa Grandes Modelos de Linguagem (LLMs) como GPT ou Llama para entender e gerar respostas naturais.",
        details: "Diferente de bots de regras (árvore de decisão), a IA Generativa entende contexto, intenção e pode responder perguntas complexas sobre produtos sem precisar de configuração manual para cada frase.",
        related: ["LLM", "RAG"]
    },
    {
        slug: "n8n",
        term: "n8n",
        definition: "Ferramenta de automação de fluxo de trabalho baseada em nós, open-source e 'fair-code'.",
        details: "Integrado ao GetNexo, o n8n permite criar lógica complexa (ex: Se cliente pagou -> Enviar Whats; Se não -> Enviar Email) conectando mais de 500 aplicativos visuais.",
        related: ["Webhook", "Zapier"]
    },
    {
        slug: "notificacao-ativa",
        term: "Notificação Ativa (Broadcast)",
        definition: "Envio de mensagens em massa para uma lista de contatos que optaram por receber comunicações (Opt-in).",
        details: "Com a API Oficial, notificações ativas têm alta taxa de entrega e leitura. São ideais para recuperação de carrinhos, avisos de promoções e atualizações de pedidos.",
        related: ["HSM", "Opt-in"]
    }
];
