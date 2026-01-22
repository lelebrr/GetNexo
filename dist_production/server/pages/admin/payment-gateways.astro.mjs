import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from "../../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$AdminLayout } from "../../assets/AdminLayout-htIlQTkN.js";
import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { renderers } from "../../renderers.mjs";
const PaymentAnalyticsChart = ({
  timeRange = "30d",
  showChart = true,
  compact = false
}) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);
  const loadAnalytics = async () => {
    try {
      const response = await fetch(`/api/payments/analytics/conversion?range=${timeRange}`);
      const data = await response.json();
      if (response.ok) {
        setAnalytics(data.analytics);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  const formatCurrency = (value, currency = "BRL") => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency
    }).format(value);
  };
  const formatPercent = (value) => {
    return `${(value * 100).toFixed(1)}%`;
  };
  if (loading) {
    return /* @__PURE__ */ jsxs("div", { className: "animate-pulse", children: [
      /* @__PURE__ */ jsx("div", { className: "h-4 bg-gray-200 rounded w-3/4 mb-2" }),
      /* @__PURE__ */ jsx("div", { className: "h-8 bg-gray-200 rounded w-1/2 mb-4" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("div", { className: "h-3 bg-gray-200 rounded" }),
        /* @__PURE__ */ jsx("div", { className: "h-3 bg-gray-200 rounded w-5/6" })
      ] })
    ] });
  }
  if (!analytics) {
    return /* @__PURE__ */ jsx("div", { className: "text-center text-gray-500 py-4", children: "Erro ao carregar analytics de pagamentos" });
  }
  if (compact) {
    return /* @__PURE__ */ jsxs("div", { className: "bg-white p-4 rounded-lg border border-gray-200", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-gray-800 mb-3", children: "📊 Conversão de Pagamentos" }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-blue-600", children: analytics.total }),
          /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-600", children: "Total" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-green-600", children: formatPercent(analytics.conversion_rate / 100) }),
          /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-600", children: "Conversão" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-purple-600", children: formatCurrency(analytics.total_amount) }),
          /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-600", children: "Valor Total" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-orange-600", children: formatCurrency(analytics.completed_amount) }),
          /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-600", children: "Valor Pago" })
        ] })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 rounded-lg border border-gray-200", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-800", children: "📊 Analytics de Pagamentos" }),
      /* @__PURE__ */ jsxs("span", { className: "text-sm text-gray-500", children: [
        "Período: ",
        timeRange
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-6", children: [
      /* @__PURE__ */ jsx("div", { className: "bg-blue-50 p-4 rounded-lg", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
        /* @__PURE__ */ jsx("div", { className: "w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3", children: /* @__PURE__ */ jsx("span", { className: "text-blue-600 text-sm", children: "💳" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-blue-600", children: analytics.total }),
          /* @__PURE__ */ jsx("div", { className: "text-sm text-blue-600", children: "Transações Totais" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "bg-green-50 p-4 rounded-lg", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
        /* @__PURE__ */ jsx("div", { className: "w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3", children: /* @__PURE__ */ jsx("span", { className: "text-green-600 text-sm", children: "✅" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-green-600", children: analytics.completed }),
          /* @__PURE__ */ jsx("div", { className: "text-sm text-green-600", children: "Pagamentos Completados" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "bg-purple-50 p-4 rounded-lg", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
        /* @__PURE__ */ jsx("div", { className: "w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3", children: /* @__PURE__ */ jsx("span", { className: "text-purple-600 text-sm", children: "📈" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-purple-600", children: formatPercent(analytics.conversion_rate / 100) }),
          /* @__PURE__ */ jsx("div", { className: "text-sm text-purple-600", children: "Taxa de Conversão" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "bg-orange-50 p-4 rounded-lg", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
        /* @__PURE__ */ jsx("div", { className: "w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3", children: /* @__PURE__ */ jsx("span", { className: "text-orange-600 text-sm", children: "💰" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-orange-600", children: formatCurrency(analytics.completed_amount) }),
          /* @__PURE__ */ jsx("div", { className: "text-sm text-orange-600", children: "Receita Total" })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsx("h4", { className: "text-md font-semibold text-gray-700 mb-3", children: "Status das Transações" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-2 bg-green-50 rounded", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm text-green-700", children: "Completadas" }),
          /* @__PURE__ */ jsxs("span", { className: "text-sm font-medium text-green-700", children: [
            analytics.completed,
            " (",
            formatPercent(analytics.completed / analytics.total),
            ")"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-2 bg-yellow-50 rounded", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm text-yellow-700", children: "Pendentes" }),
          /* @__PURE__ */ jsxs("span", { className: "text-sm font-medium text-yellow-700", children: [
            analytics.pending,
            " (",
            formatPercent(analytics.pending / analytics.total),
            ")"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-2 bg-red-50 rounded", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm text-red-700", children: "Falhas" }),
          /* @__PURE__ */ jsxs("span", { className: "text-sm font-medium text-red-700", children: [
            analytics.failed,
            " (",
            formatPercent(analytics.failed / analytics.total),
            ")"
          ] })
        ] })
      ] })
    ] }),
    analytics.by_gateway && Object.keys(analytics.by_gateway).length > 0 && /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsx("h4", { className: "text-md font-semibold text-gray-700 mb-3", children: "Performance por Gateway" }),
      /* @__PURE__ */ jsx("div", { className: "space-y-3", children: Object.entries(analytics.by_gateway).map(([gateway, stats]) => /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 p-3 rounded-lg", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-800 capitalize", children: gateway }),
          /* @__PURE__ */ jsxs("span", { className: "text-sm text-gray-600", children: [
            stats.total,
            " transações"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: /* @__PURE__ */ jsx(
          "div",
          {
            className: "bg-green-500 h-2 rounded-full",
            style: {
              width: `${stats.total > 0 ? stats.completed / stats.total * 100 : 0}%`
            }
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "text-xs text-gray-600 mt-1", children: [
          stats.completed,
          " de ",
          stats.total,
          " completadas (",
          formatPercent(stats.completed / stats.total),
          ")"
        ] })
      ] }, gateway)) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-blue-50 p-4 rounded-lg", children: [
      /* @__PURE__ */ jsx("h4", { className: "text-sm font-semibold text-blue-800 mb-2", children: "💡 Insights" }),
      /* @__PURE__ */ jsxs("ul", { className: "text-sm text-blue-700 space-y-1", children: [
        analytics.conversion_rate < 50 && /* @__PURE__ */ jsx("li", { children: "• Taxa de conversão abaixo do ideal. Considere otimizar o fluxo de pagamento." }),
        analytics.conversion_rate > 80 && /* @__PURE__ */ jsx("li", { children: "• Excelente taxa de conversão! Continue com as boas práticas." }),
        analytics.failed > analytics.total * 0.1 && /* @__PURE__ */ jsx("li", { children: "• Alto índice de falhas. Verifique configuração dos gateways." }),
        analytics.pending > analytics.total * 0.2 && /* @__PURE__ */ jsx("li", { children: "• Muitos pagamentos pendentes. Considere lembretes automáticos." })
      ] })
    ] })
  ] });
};
const $$PaymentGateways = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Configuração de Gateways de Pagamento" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"> <!-- Header --> <div class="mb-8"> <h1 class="text-3xl font-bold text-gray-900">💳 Gateways de Pagamento</h1> <p class="mt-2 text-gray-600">
Configure gateways de pagamento, moedas e analytics de conversão
</p> </div> <!-- Analytics Overview --> <div class="mb-8"> ${renderComponent($$result2, "PaymentAnalyticsChart", PaymentAnalyticsChart, { "client:load": true, "timeRange": "30d", "client:component-hydration": "load", "client:component-path": "/home/lele/usenexo/getnexo-site/src/components/analytics/PaymentAnalyticsChart.jsx", "client:component-export": "default" })} </div> <!-- Gateway Configuration --> <div class="bg-white shadow rounded-lg mb-8"> <div class="px-6 py-4 border-b border-gray-200"> <h2 class="text-lg font-medium text-gray-900">Configuração de Gateways</h2> <p class="mt-1 text-sm text-gray-600">
Configure suas credenciais de pagamento para aceitar pagamentos via WhatsApp Pay
</p> </div> <div class="p-6 space-y-6"> <!-- Mercado Pago --> <div class="border border-gray-200 rounded-lg p-4"> <div class="flex items-center justify-between mb-4"> <div class="flex items-center"> <img src="/images/mercadopago-logo.png" alt="Mercado Pago" class="w-8 h-8 mr-3" onerror="this.style.display='none'"> <div> <h3 class="text-lg font-medium text-gray-900">Mercado Pago</h3> <p class="text-sm text-gray-600">Aceite pagamentos Pix e cartão no Brasil</p> </div> </div> <div class="flex items-center"> <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
Ativo
</span> </div> </div> <form class="space-y-4"> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"> <div> <label class="block text-sm font-medium text-gray-700 mb-1">
Access Token
</label> <input type="password" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="APP_USR-..."> </div> <div> <label class="block text-sm font-medium text-gray-700 mb-1">
Public Key
</label> <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="APP_USR-..."> </div> </div> <div class="flex items-center"> <input type="checkbox" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" checked> <label class="ml-2 block text-sm text-gray-900">
Habilitar Pix automático
</label> </div> <div class="flex justify-end"> <button type="submit" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
Salvar Configuração
</button> </div> </form> </div> <!-- Stripe --> <div class="border border-gray-200 rounded-lg p-4"> <div class="flex items-center justify-between mb-4"> <div class="flex items-center"> <img src="/images/stripe-logo.png" alt="Stripe" class="w-8 h-8 mr-3" onerror="this.style.display='none'"> <div> <h3 class="text-lg font-medium text-gray-900">Stripe</h3> <p class="text-sm text-gray-600">Pagamentos internacionais com cartão e Pix</p> </div> </div> <div class="flex items-center"> <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
Configurar
</span> </div> </div> <form class="space-y-4"> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"> <div> <label class="block text-sm font-medium text-gray-700 mb-1">
Secret Key
</label> <input type="password" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="sk_live_..."> </div> <div> <label class="block text-sm font-medium text-gray-700 mb-1">
Publishable Key
</label> <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="pk_live_..."> </div> </div> <div class="flex items-center space-x-4"> <div class="flex items-center"> <input type="checkbox" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"> <label class="ml-2 block text-sm text-gray-900">
Habilitar cartões
</label> </div> <div class="flex items-center"> <input type="checkbox" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"> <label class="ml-2 block text-sm text-gray-900">
Habilitar Pix
</label> </div> </div> <div class="flex justify-end"> <button type="submit" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
Salvar Configuração
</button> </div> </form> </div> </div> </div> <!-- Currency Configuration --> <div class="bg-white shadow rounded-lg mb-8"> <div class="px-6 py-4 border-b border-gray-200"> <h2 class="text-lg font-medium text-gray-900">Configuração de Moedas</h2> <p class="mt-1 text-sm text-gray-600">
Configure moedas suportadas e taxas de câmbio
</p> </div> <div class="p-6"> <div class="space-y-4"> <!-- BRL - Real Brasileiro --> <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg"> <div class="flex items-center"> <span class="text-2xl mr-3">🇧🇷</span> <div> <h3 class="text-lg font-medium text-gray-900">Real Brasileiro (BRL)</h3> <p class="text-sm text-gray-600">Moeda padrão do Brasil</p> </div> </div> <div class="flex items-center space-x-2"> <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
Ativo
</span> <button class="text-gray-400 hover:text-gray-600"> <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"> <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path> </svg> </button> </div> </div> <!-- USD - Dólar Americano --> <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg"> <div class="flex items-center"> <span class="text-2xl mr-3">🇺🇸</span> <div> <h3 class="text-lg font-medium text-gray-900">Dólar Americano (USD)</h3> <p class="text-sm text-gray-600">Moeda internacional</p> </div> </div> <div class="flex items-center space-x-2"> <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
Ativo
</span> <div class="text-sm text-gray-600">
1 USD = 5.50 BRL
</div> </div> </div> <!-- EUR - Euro --> <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg"> <div class="flex items-center"> <span class="text-2xl mr-3">🇪🇺</span> <div> <h3 class="text-lg font-medium text-gray-900">Euro (EUR)</h3> <p class="text-sm text-gray-600">Moeda europeia</p> </div> </div> <div class="flex items-center space-x-2"> <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
Ativo
</span> <div class="text-sm text-gray-600">
1 EUR = 6.00 BRL
</div> </div> </div> </div> <div class="mt-6"> <button class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"> <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path> </svg>
Adicionar Moeda
</button> </div> </div> </div> <!-- Payment Templates --> <div class="bg-white shadow rounded-lg"> <div class="px-6 py-4 border-b border-gray-200"> <h2 class="text-lg font-medium text-gray-900">Templates de Pagamento</h2> <p class="mt-1 text-sm text-gray-600">
Configure templates pré-definidos para pagamentos recorrentes
</p> </div> <div class="p-6"> <div class="space-y-4"> <div class="border border-gray-200 rounded-lg p-4"> <div class="flex items-center justify-between mb-2"> <h3 class="text-lg font-medium text-gray-900">Consulta Básica</h3> <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
Ativo
</span> </div> <p class="text-sm text-gray-600 mb-3">Pagamento para consulta de 30 minutos</p> <div class="flex items-center justify-between"> <span class="text-lg font-semibold text-green-600">R$ 50,00</span> <div class="space-x-2"> <button class="text-blue-600 hover:text-blue-800 text-sm">Editar</button> <button class="text-red-600 hover:text-red-800 text-sm">Excluir</button> </div> </div> </div> <div class="border border-gray-200 rounded-lg p-4"> <div class="flex items-center justify-between mb-2"> <h3 class="text-lg font-medium text-gray-900">Pacote Premium</h3> <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
Ativo
</span> </div> <p class="text-sm text-gray-600 mb-3">Pacote completo com 5 consultas</p> <div class="flex items-center justify-between"> <span class="text-lg font-semibold text-green-600">R$ 200,00</span> <div class="space-x-2"> <button class="text-blue-600 hover:text-blue-800 text-sm">Editar</button> <button class="text-red-600 hover:text-red-800 text-sm">Excluir</button> </div> </div> </div> </div> <div class="mt-6"> <button class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"> <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path> </svg>
Novo Template
</button> </div> </div> </div> </div> ` })}`;
}, "/home/lele/usenexo/getnexo-site/src/pages/admin/payment-gateways.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/admin/payment-gateways.astro";
const $$url = "/admin/payment-gateways";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$PaymentGateways,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
