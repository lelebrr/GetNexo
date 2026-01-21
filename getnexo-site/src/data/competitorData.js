export const competitorData = [
    {
        slug: "twilio",
        name: "Twilio",
        type: "API Provider",
        color: "#F22F46",
        verdict: "Melhor para programadores. GetNexo é melhor para empresas.",
        comparison: {
            priceModel: "Custo por mensagem (U$ 0.05/msg)",
            setupTime: "Semanas (Requer Dev)",
            interface: "Apenas API (Sem interface visual)",
            support: "Ticket (Lento)",
            features: ["API Pura", "SMS", "Email"]
        },
        getnexoAdvantage: {
            priceModel: "Fixo (Zero custo por mensagem)",
            setupTime: "12 Minutos (No-Code)",
            interface: "Interface Visual Completa",
            support: "WhatsApp Direto",
            features: ["IA Nativa", "Kanban de Vendas", "Agendamento"]
        },
        whySwitch: "Se você está cansado de pagar faturas variáveis em dólar e depender de desenvolvedores para mudar uma vírgula no seu bot, o GetNexo é a solução.",
        seoTitle: "Twilio vs GetNexo: Qual a melhor API de WhatsApp em 2026?",
        painPoints: ["Cobrança em Dólar", "Complexidade Técnica", "Sem interface para atendentes"]
    },
    {
        slug: "manychat",
        name: "ManyChat",
        type: "Chatbot Builder",
        color: "#0084FF",
        verdict: "Ótimo para Instagram, fraco para WhatsApp Business no Brasil.",
        comparison: {
            priceModel: "Por Contato Ativo (Escala caro)",
            setupTime: "Rápido",
            interface: "Visual Builder",
            support: "Comunidade",
            features: ["Fluxos Visuais", "Instagram Direct"]
        },
        getnexoAdvantage: {
            priceModel: "Contatos Ilimitados",
            setupTime: "Rápido",
            interface: "Visual Builder + Code",
            support: "WhatsApp Direto",
            features: ["PIX Nativo", "Integração ERP Brasil", "IA Generativa"]
        },
        whySwitch: "O ManyChat cobra por contato. Se você tem uma lista de 10.000 clientes, sua fatura explode. No GetNexo, sua base é ilimitada.",
        seoTitle: "ManyChat ou GetNexo? Comparativo de Automação WhatsApp",
        painPoints: ["Cobrança por Lead", "Falta de Gateways BR (PIX)", "Suporte em Inglês"]
    },
    {
        slug: "z-api",
        name: "Z-API",
        type: "Unoficial API",
        color: "#25D366",
        verdict: "Instável. Risco de banimento alto.",
        comparison: {
            priceModel: "Mensalidade Fixa",
            setupTime: "Rápido (QR Code)",
            interface: "Apenas API",
            support: "WhatsApp",
            features: ["API Básica", "Webhooks"]
        },
        getnexoAdvantage: {
            priceModel: "Mensalidade Fixa + Oficial",
            setupTime: "Rápido (Cloud API)",
            interface: "Plataforma Completa",
            support: "WhatsApp",
            features: ["Anti-Banimento (Oficial)", "IA Nativa", "Multi-Agente"]
        },
        whySwitch: "A Z-API usa engenharia reversa (não oficial). Seu número pode cair a qualquer momento. O GetNexo usa a API Oficial da Meta, garantindo estabilidade e selo verde.",
        seoTitle: "Z-API é segura? Veja comparativo com GetNexo Oficial",
        painPoints: ["Risco de Banimento", "Instabilidade", "Falta de Interface"]
    },
    {
        slug: "wati",
        name: "Wati",
        type: "BSP Official",
        color: "#00D1B2",
        verdict: "Bom, mas caro e suporte gringo.",
        comparison: {
            priceModel: "Mensalidade Alta + Taxa Meta",
            setupTime: "Médio",
            interface: "CRM Básico",
            support: "Email",
            features: ["Green Tick", "Broadcast"]
        },
        getnexoAdvantage: {
            priceModel: "Custo Brasil (em Reais)",
            setupTime: "Rápido",
            interface: "CRM Brasileiro Completo",
            support: "WhatsApp PT-BR",
            features: ["PIX e Boletos", "Integração Logística", "DRE Financeiro"]
        },
        whySwitch: "O Wati é excelente, mas não entende o mercado brasileiro (PIX, CEP, CPF). O GetNexo é feito no Brasil para empresas brasileiras.",
        seoTitle: "Wati vs GetNexo: Qual CRM WhatsApp escolher?",
        painPoints: ["Preço em Dólar", "Sem PIX", "Interface em Inglês"]
    }
];
