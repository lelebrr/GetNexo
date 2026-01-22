import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, l as renderScript } from "../../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$ClientLayout } from "../../assets/ClientLayout-Cg0S0bz6.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef, useCallback } from "react";
import ReactApexChart from "react-apexcharts";
/* empty css                                   */
import { renderers } from "../../renderers.mjs";
const TicketPeaksChart = ({ data, title = "Picos de Tickets por Hora" }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const ticketCounts = hours.map((hour) => {
    const hourData = data.find((d) => d.hour === hour);
    return hourData ? hourData.count : 0;
  });
  const options = {
    chart: {
      type: "line",
      height: 350,
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true
        }
      },
      background: "transparent"
    },
    colors: ["#007bff"],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: "smooth",
      width: 3
    },
    grid: {
      borderColor: "#f1f1f1",
      row: {
        colors: ["#f8f9fa", "transparent"],
        opacity: 0.5
      }
    },
    xaxis: {
      categories: hours.map((h) => `${h}:00`),
      title: {
        text: "Hora do Dia"
      },
      labels: {
        style: {
          colors: "#6c757d"
        }
      }
    },
    yaxis: {
      title: {
        text: "Número de Tickets"
      },
      labels: {
        style: {
          colors: "#6c757d"
        }
      }
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "vertical",
        shadeIntensity: 0.25,
        gradientToColors: void 0,
        inverseColors: false,
        opacityFrom: 0.85,
        opacityTo: 0.85,
        stops: [50, 0, 100]
      }
    },
    tooltip: {
      theme: "light",
      x: {
        show: true,
        format: "HH:mm"
      },
      y: {
        formatter: function(value) {
          return value + " tickets";
        }
      }
    },
    markers: {
      size: 4,
      colors: ["#007bff"],
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 6
      }
    },
    title: {
      text: title,
      align: "left",
      style: {
        fontSize: "16px",
        fontWeight: "bold",
        color: "#333"
      }
    }
  };
  const series = [{
    name: "Tickets",
    data: ticketCounts
  }];
  return /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg shadow-sm border p-4", children: /* @__PURE__ */ jsx(
    ReactApexChart,
    {
      options,
      series,
      type: "line",
      height: 350
    }
  ) });
};
const ChannelDistributionChart = ({ data, title = "Distribuição por Canal" }) => {
  const channelNames = {
    whatsapp: "WhatsApp",
    facebook: "Facebook",
    email: "Email",
    chat: "Chat",
    phone: "Telefone",
    other: "Outros"
  };
  const series = data.map((item) => item.count);
  const labels = data.map((item) => channelNames[item.channel] || item.channel);
  const colors = ["#25D366", "#1877F2", "#EA4335", "#007bff", "#28a745", "#6c757d"];
  const options = {
    chart: {
      type: "pie",
      height: 350,
      toolbar: {
        show: true,
        tools: {
          download: true
        }
      }
    },
    colors,
    labels,
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      fontSize: "14px"
    },
    dataLabels: {
      enabled: true,
      formatter: function(val, opts) {
        return opts.w.globals.series[opts.seriesIndex] + " (" + val.toFixed(1) + "%)";
      },
      style: {
        fontSize: "12px",
        colors: ["#fff"]
      },
      dropShadow: {
        enabled: false
      }
    },
    tooltip: {
      y: {
        formatter: function(value) {
          return value + " tickets";
        }
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: "60%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total",
              formatter: function(w) {
                return w.globals.seriesTotals.reduce((a, b) => a + b, 0);
              }
            }
          }
        }
      }
    },
    title: {
      text: title,
      align: "left",
      style: {
        fontSize: "16px",
        fontWeight: "bold",
        color: "#333"
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 300
        },
        legend: {
          position: "bottom"
        }
      }
    }]
  };
  return /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg shadow-sm border p-4", children: /* @__PURE__ */ jsx(
    ReactApexChart,
    {
      options,
      series,
      type: "donut",
      height: 350
    }
  ) });
};
const AIResolutionChart = ({ data, title = "Taxa de Resolução IA vs Humano" }) => {
  const categories = data.map((item) => item.resolver);
  const resolutionRates = data.map((item) => parseFloat(item.resolution_rate.toFixed(2)));
  const options = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: {
        show: true,
        tools: {
          download: true
        }
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded"
      }
    },
    colors: ["#28a745", "#dc3545"],
    // Green for AI, Red for Human (if needed)
    dataLabels: {
      enabled: true,
      formatter: function(val) {
        return val + "%";
      },
      offsetY: -20,
      style: {
        fontSize: "12px",
        colors: ["#304758"]
      }
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"]
    },
    grid: {
      borderColor: "#f1f1f1",
      row: {
        colors: ["#f8f9fa", "transparent"],
        opacity: 0.5
      }
    },
    xaxis: {
      categories,
      title: {
        text: "Tipo de Resolução"
      },
      labels: {
        style: {
          colors: "#6c757d"
        }
      }
    },
    yaxis: {
      title: {
        text: "Taxa de Resolução (%)"
      },
      labels: {
        style: {
          colors: "#6c757d"
        },
        formatter: function(value) {
          return value + "%";
        }
      },
      min: 0,
      max: 100
    },
    fill: {
      opacity: 0.8
    },
    tooltip: {
      y: {
        formatter: function(val) {
          return val + "% de resolução";
        }
      }
    },
    title: {
      text: title,
      align: "left",
      style: {
        fontSize: "16px",
        fontWeight: "bold",
        color: "#333"
      }
    },
    annotations: {
      yaxis: [{
        y: 80,
        borderColor: "#28a745",
        label: {
          borderColor: "#28a745",
          style: {
            color: "#fff",
            background: "#28a745"
          },
          text: "Meta: 80%"
        }
      }]
    }
  };
  const series = [{
    name: "Taxa de Resolução",
    data: resolutionRates
  }];
  return /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg shadow-sm border p-4", children: /* @__PURE__ */ jsx(
    ReactApexChart,
    {
      options,
      series,
      type: "bar",
      height: 350
    }
  ) });
};
const SalesChart = ({ data, title = "Vendas no Chat" }) => {
  return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-sm border p-6", children: [
    /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-4 text-gray-800", children: title }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-3xl font-bold text-green-600 mb-2", children: [
          "R$ ",
          data.today.toLocaleString("pt-BR", { minimumFractionDigits: 2 })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-600", children: "Hoje" }),
        /* @__PURE__ */ jsxs("div", { className: "text-xs text-green-500 mt-1", children: [
          "+",
          ((data.today - data.yesterday) / data.yesterday * 100).toFixed(1),
          "% vs ontem"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-3xl font-bold text-blue-600 mb-2", children: [
          "R$ ",
          data.yesterday.toLocaleString("pt-BR", { minimumFractionDigits: 2 })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-600", children: "Ontem" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6", children: [
      /* @__PURE__ */ jsx("h4", { className: "text-sm font-medium text-gray-700 mb-3", children: "Vendas por Canal (Hoje)" }),
      /* @__PURE__ */ jsx("div", { className: "space-y-3", children: data.by_channel.map((channel, index) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ jsx("div", { className: `w-3 h-3 rounded-full ${channel.channel === "whatsapp" ? "bg-green-500" : channel.channel === "facebook" ? "bg-blue-600" : channel.channel === "email" ? "bg-red-500" : "bg-gray-500"}` }),
          /* @__PURE__ */ jsx("span", { className: "text-sm capitalize", children: channel.channel })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ jsxs("span", { className: "text-sm font-medium", children: [
            "R$ ",
            channel.today.toFixed(2)
          ] }),
          /* @__PURE__ */ jsx("span", { className: `text-xs px-2 py-1 rounded ${channel.today > channel.yesterday ? "bg-green-100 text-green-800" : channel.today < channel.yesterday ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"}`, children: channel.today > channel.yesterday ? "↑" : channel.today < channel.yesterday ? "↓" : "→" })
        ] })
      ] }, index)) })
    ] })
  ] });
};
const AgentClicksHeatmap = ({ data, title = "Cliques de Agentes" }) => {
  const maxClicks = Math.max(...data.map((item) => item.clicks));
  const getHeatColor = (clicks) => {
    if (clicks === 0) return "bg-gray-100";
    const intensity = clicks / maxClicks;
    if (intensity >= 0.8) return "bg-red-500";
    if (intensity >= 0.6) return "bg-orange-500";
    if (intensity >= 0.4) return "bg-yellow-500";
    if (intensity >= 0.2) return "bg-green-400";
    return "bg-green-200";
  };
  return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-sm border p-4", children: [
    /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-4 text-gray-800", children: title }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4", children: data.map((agent, index) => /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("div", { className: `w-full h-16 rounded-lg flex items-center justify-center text-white font-bold text-lg ${getHeatColor(agent.clicks)}`, children: agent.clicks }),
      /* @__PURE__ */ jsx("div", { className: "mt-2 text-xs text-gray-600 truncate", title: agent.agent, children: agent.agent.length > 10 ? agent.agent.substring(0, 10) + "..." : agent.agent })
    ] }, index)) }),
    /* @__PURE__ */ jsxs("div", { className: "mt-4 flex justify-center space-x-2 text-xs", children: [
      /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "Menos" }),
      /* @__PURE__ */ jsx("div", { className: "w-4 h-4 bg-green-200 rounded" }),
      /* @__PURE__ */ jsx("div", { className: "w-4 h-4 bg-green-400 rounded" }),
      /* @__PURE__ */ jsx("div", { className: "w-4 h-4 bg-yellow-500 rounded" }),
      /* @__PURE__ */ jsx("div", { className: "w-4 h-4 bg-orange-500 rounded" }),
      /* @__PURE__ */ jsx("div", { className: "w-4 h-4 bg-red-500 rounded" }),
      /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "Mais" })
    ] })
  ] });
};
const ConversionFunnelChart = ({ data, title = "Funil de Conversão" }) => {
  const stages = [
    { name: "Viu", value: data.saw, color: "bg-blue-500" },
    { name: "Contatou", value: data.contacted, color: "bg-blue-400" },
    { name: "Qualificado", value: data.qualified, color: "bg-blue-300" },
    { name: "Comprou", value: data.purchased, color: "bg-green-500" }
  ];
  const maxValue = Math.max(...stages.map((s) => s.value));
  return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-sm border p-4", children: [
    /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-4 text-gray-800", children: title }),
    /* @__PURE__ */ jsx("div", { className: "space-y-2", children: stages.map((stage, index) => {
      const percentage = (stage.value / stages[0].value * 100).toFixed(1);
      const width = stage.value / maxValue * 100;
      return /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4", children: [
        /* @__PURE__ */ jsx("div", { className: "w-20 text-sm text-gray-600 text-right", children: stage.name }),
        /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxs("div", { className: "relative h-8 bg-gray-200 rounded", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: `h-full ${stage.color} rounded transition-all duration-500`,
              style: { width: `${width}%` }
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 flex items-center justify-center text-white font-bold text-sm", children: [
            stage.value,
            " (",
            percentage,
            "%)"
          ] })
        ] }) })
      ] }, index);
    }) }),
    /* @__PURE__ */ jsx("div", { className: "mt-4 pt-4 border-t", children: /* @__PURE__ */ jsxs("div", { className: "text-sm text-gray-600", children: [
      "Taxa de conversão: ",
      (data.purchased / data.saw * 100).toFixed(2),
      "%"
    ] }) })
  ] });
};
const NPSChart = ({ data, title = "NPS Semanal" }) => {
  const options = {
    chart: {
      type: "line",
      height: 300,
      toolbar: {
        show: true
      }
    },
    colors: ["#007bff"],
    stroke: {
      curve: "smooth",
      width: 3
    },
    xaxis: {
      categories: data.map((item) => item.week)
    },
    yaxis: {
      title: {
        text: "NPS Score"
      },
      min: 0,
      max: 10
    },
    tooltip: {
      y: {
        formatter: function(value) {
          return value.toFixed(1);
        }
      }
    },
    title: {
      text: title,
      align: "left",
      style: {
        fontSize: "16px",
        fontWeight: "bold"
      }
    }
  };
  const series = [{
    name: "NPS",
    data: data.map((item) => item.nps)
  }];
  return /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg shadow-sm border p-4", children: /* @__PURE__ */ jsx(
    ReactApexChart,
    {
      options,
      series,
      type: "line",
      height: 300
    }
  ) });
};
const ResponseTimesChart = ({ data, title = "Tempo Médio de Resposta" }) => {
  const options = {
    chart: {
      type: "bar",
      height: 300
    },
    plotOptions: {
      bar: {
        horizontal: true,
        dataLabels: {
          position: "top"
        }
      }
    },
    colors: ["#28a745", "#dc3545"],
    xaxis: {
      title: {
        text: "Tempo Médio (minutos)"
      }
    },
    tooltip: {
      y: {
        formatter: function(value) {
          return value.toFixed(1) + " min";
        }
      }
    },
    title: {
      text: title,
      align: "left"
    }
  };
  const series = [{
    name: "Tempo Médio",
    data: data.map((item) => ({
      x: item.resolver,
      y: item.resolver === "IA" ? item.avg_first_response : item.avg_resolution
    }))
  }];
  return /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg shadow-sm border p-4", children: /* @__PURE__ */ jsx(
    ReactApexChart,
    {
      options,
      series,
      type: "bar",
      height: 300
    }
  ) });
};
const TopComplaintsChart = ({ data, title = "Top Reclamações por Produto" }) => {
  return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-sm border p-4", children: [
    /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-4 text-gray-800", children: title }),
    /* @__PURE__ */ jsx("div", { className: "space-y-3", children: data.slice(0, 5).map((complaint, index) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
        /* @__PURE__ */ jsxs("span", { className: "text-sm font-medium text-gray-600", children: [
          "#",
          index + 1
        ] }),
        /* @__PURE__ */ jsx("span", { className: "text-sm", children: complaint.product })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsx("div", { className: "w-20 bg-gray-200 rounded-full h-2", children: /* @__PURE__ */ jsx(
          "div",
          {
            className: "bg-red-500 h-2 rounded-full",
            style: { width: `${complaint.count / Math.max(...data.map((d) => d.count)) * 100}%` }
          }
        ) }),
        /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-gray-700", children: complaint.count })
      ] })
    ] }, index)) })
  ] });
};
const BrazilHeatmap = ({ data, title = "Chamados por Região do Brasil" }) => {
  const regions = [
    { name: "Sudeste", states: ["SP", "RJ", "MG", "ES"], color: "bg-red-500" },
    { name: "Sul", states: ["RS", "SC", "PR"], color: "bg-orange-500" },
    { name: "Nordeste", states: ["BA", "PE", "CE", "RN", "PB", "AL", "SE", "MA", "PI"], color: "bg-yellow-500" },
    { name: "Norte", states: ["AM", "PA", "RR", "AP", "TO", "RO", "AC"], color: "bg-green-500" },
    { name: "Centro-Oeste", states: ["GO", "MT", "MS", "DF"], color: "bg-blue-500" }
  ];
  const maxCount = Math.max(...data.map((d) => d.count));
  return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-sm border p-4", children: [
    /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-4 text-gray-800", children: title }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: regions.map((region, index) => {
      const regionData = data.find((d) => d.region === region.name);
      const count = regionData ? regionData.count : 0;
      const intensity = maxCount > 0 ? count / maxCount * 100 : 0;
      return /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: `w-full h-16 rounded-lg flex items-center justify-center text-white font-bold text-lg mb-2 ${region.color} opacity-${Math.max(20, Math.round(intensity / 10) * 10)}`,
            style: { backgroundColor: count === 0 ? "#f3f4f6" : void 0 },
            children: count
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-600", children: region.name })
      ] }, index);
    }) }),
    /* @__PURE__ */ jsxs("div", { className: "mt-4 text-sm text-gray-600", children: [
      "Total de chamados: ",
      data.reduce((sum, d) => sum + d.count, 0)
    ] })
  ] });
};
const QueueAbandonmentIndicator = ({ data, title = "Abandono de Fila" }) => {
  const getAbandonmentColor = (rate) => {
    if (rate < 5) return "text-green-600 bg-green-100";
    if (rate < 10) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };
  return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-sm border p-4", children: [
    /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-4 text-gray-800", children: title }),
    /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxs("div", { className: `inline-flex items-center px-4 py-2 rounded-full text-2xl font-bold mb-2 ${getAbandonmentColor(data.rate)}`, children: [
        data.rate.toFixed(1),
        "%"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-sm text-gray-600", children: [
        data.abandoned,
        " de ",
        data.total_tickets,
        " tickets abandonados"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-4 pt-4 border-t", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
        /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "Taxa aceitável:" }),
        /* @__PURE__ */ jsx("span", { className: "font-medium", children: "< 5%" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm mt-1", children: [
        /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "Meta atual:" }),
        /* @__PURE__ */ jsx("span", { className: "font-medium", children: "2-3%" })
      ] })
    ] })
  ] });
};
const AnalyticsDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("30d");
  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);
  useEffect(() => {
    const handleTimeRangeChange = (event) => {
      setTimeRange(event.detail.range);
    };
    const handleRefresh = () => {
      loadAnalyticsData();
    };
    window.addEventListener("timeRangeChanged", handleTimeRangeChange);
    window.addEventListener("refreshAnalytics", handleRefresh);
    return () => {
      window.removeEventListener("timeRangeChanged", handleTimeRangeChange);
      window.removeEventListener("refreshAnalytics", handleRefresh);
    };
  }, []);
  const loadAnalyticsData = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Usuário não autenticado.");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`/api/support/analytics/dashboard?range=${timeRange}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setAnalyticsData(data);
      } else {
        setError(data.error || "Erro ao carregar dados de analytics.");
      }
    } catch (err) {
      setError("Erro de conexão.");
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsxs("div", { className: "flex justify-center items-center h-64", children: [
      /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" }),
      /* @__PURE__ */ jsx("span", { className: "ml-3 text-gray-600", children: "Carregando dashboard..." })
    ] });
  }
  if (error) {
    return /* @__PURE__ */ jsxs("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4 text-center", children: [
      /* @__PURE__ */ jsx("p", { className: "text-red-600 font-medium", children: error }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: loadAnalyticsData,
          className: "mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors",
          children: "Tentar Novamente"
        }
      )
    ] });
  }
  if (!analyticsData) {
    return /* @__PURE__ */ jsx("div", { className: "text-center text-gray-500", children: "Nenhum dado disponível para o período selecionado." });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsx(
        TicketPeaksChart,
        {
          data: analyticsData.ticket_peaks || [],
          title: "Picos de Tickets por Hora"
        }
      ),
      /* @__PURE__ */ jsx(
        ChannelDistributionChart,
        {
          data: analyticsData.channel_distribution || [],
          title: "Distribuição por Canal"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsx(
        AIResolutionChart,
        {
          data: analyticsData.ai_resolution || [],
          title: "Taxa de Resolução IA vs Humano"
        }
      ),
      /* @__PURE__ */ jsx(
        SalesChart,
        {
          data: analyticsData.sales_comparison || { today: 0, yesterday: 0, by_channel: [] },
          title: "Vendas no Chat"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsx(
        AgentClicksHeatmap,
        {
          data: analyticsData.agent_clicks_heatmap || [],
          title: "Cliques de Agentes"
        }
      ),
      /* @__PURE__ */ jsx(
        ConversionFunnelChart,
        {
          data: analyticsData.conversion_funnel || { saw: 0, contacted: 0, qualified: 0, purchased: 0 },
          title: "Funil de Conversão"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsx(
        NPSChart,
        {
          data: analyticsData.nps_weekly || [],
          title: "NPS Semanal"
        }
      ),
      /* @__PURE__ */ jsx(
        ResponseTimesChart,
        {
          data: analyticsData.response_times || [],
          title: "Tempo Médio de Resposta"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsx(
        TopComplaintsChart,
        {
          data: analyticsData.top_complaints || [],
          title: "Top Reclamações por Produto"
        }
      ),
      /* @__PURE__ */ jsx(
        BrazilHeatmap,
        {
          data: analyticsData.brazil_heatmap || [],
          title: "Chamados por Região do Brasil"
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-6", children: /* @__PURE__ */ jsx(
      QueueAbandonmentIndicator,
      {
        data: analyticsData.queue_abandonment || { rate: 0, abandoned: 0, total_tickets: 0 },
        title: "Abandono de Fila"
      }
    ) }),
    /* @__PURE__ */ jsx("div", { className: "mt-8 p-4 bg-gray-50 rounded-lg text-sm", children: /* @__PURE__ */ jsxs("details", { children: [
      /* @__PURE__ */ jsx("summary", { className: "cursor-pointer font-medium", children: "Dados brutos (debug)" }),
      /* @__PURE__ */ jsx("pre", { className: "mt-2 text-xs overflow-auto max-h-96", children: JSON.stringify(analyticsData, null, 2) })
    ] }) })
  ] });
};
const MagicMap = ({
  pageUrl = null,
  realTime = true,
  showHeatmap = true,
  showUserPaths = true,
  showContextMessages = true,
  refreshInterval = 2e3,
  maxUsers = 50
}) => {
  const [magicMapData, setMagicMapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [pagePreview, setPagePreview] = useState(null);
  const [contextMessages, setContextMessages] = useState([]);
  const canvasRef = useRef(null);
  useRef(null);
  const intervalRef = useRef(null);
  const fetchMagicMapData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Usuário não autenticado");
        return;
      }
      const params = new URLSearchParams({
        real_time: realTime.toString(),
        ...pageUrl && { page_url: pageUrl }
      });
      const response = await fetch(`/api/tracking/magic-map?${params}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      const data = await response.json();
      setMagicMapData(data);
      setError(null);
      if (showContextMessages) {
        updateContextMessages(data.sessions);
      }
    } catch (err) {
      setError("Erro ao carregar dados do Magic Map");
    } finally {
      setLoading(false);
    }
  }, [pageUrl, realTime, showContextMessages]);
  const updateContextMessages = useCallback((sessions) => {
    const messages = [];
    sessions.forEach((session) => {
      const lastActivity = new Date(session.last_activity);
      const now = /* @__PURE__ */ new Date();
      const inactiveSeconds = Math.floor((now - lastActivity) / 1e3);
      let message = "";
      let type = "info";
      let icon = "👤";
      if (inactiveSeconds > 300) {
        message = `Cliente inativo há ${Math.floor(inactiveSeconds / 60)} minutos`;
        type = "warning";
        icon = "😴";
      } else if (session.mouse_position) {
        const scrollPercent = Math.round(session.scroll_position.y / (session.viewport.height - window.innerHeight) * 100) || 0;
        message = `Cliente navegando - Scroll: ${scrollPercent}%`;
        type = "success";
        icon = "🖱️";
      } else if (session.max_scroll_depth > 75) {
        message = `Cliente engajado - Scroll profundo (${session.max_scroll_depth}%)`;
        type = "success";
        icon = "📖";
      } else {
        message = `Cliente visualizando página há ${Math.floor(session.duration / 60)} minutos`;
        type = "info";
        icon = "👁️";
      }
      messages.push({
        session_id: session.session_id,
        visitor_id: session.visitor_id.substring(0, 8) + "...",
        message,
        type,
        icon,
        duration: session.duration,
        page_views: session.page_views,
        device_type: session.device_type,
        current_page: session.current_page,
        last_activity: session.last_activity
      });
    });
    setContextMessages(messages.slice(0, 10));
  }, []);
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !magicMapData) return;
    const ctx = canvas.getContext("2d");
    const { sessions } = magicMapData;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#f8f9fa";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, 80);
    ctx.strokeStyle = "#e9ecef";
    ctx.strokeRect(0, 0, canvas.width, 80);
    sessions.slice(0, maxUsers).forEach((session, index) => {
      const color = getUserColor(index);
      const position = getUserPosition(session, canvas);
      if (showUserPaths && session.mouse_position) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.3;
        const lastX = position.x - session.mouse_position.x * canvas.width / session.viewport.width;
        const lastY = position.y - session.mouse_position.y * canvas.height / session.viewport.height;
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(position.x, position.y);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(position.x, position.y, 8, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.stroke();
      const now = Date.now();
      const lastActivity = new Date(session.last_activity).getTime();
      const inactiveTime = (now - lastActivity) / 1e3;
      if (inactiveTime < 30) {
        ctx.strokeStyle = "#28a745";
        ctx.lineWidth = 3;
        ctx.stroke();
      } else if (inactiveTime < 300) {
        ctx.strokeStyle = "#007bff";
        ctx.lineWidth = 2;
        ctx.stroke();
      } else {
        ctx.strokeStyle = "#6c757d";
        ctx.setLineDash([2, 2]);
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.setLineDash([]);
      }
      drawDeviceIcon(ctx, position.x, position.y - 15, session.device_type);
    });
    if (showHeatmap && pageUrl) {
      drawHeatmap(ctx, canvas);
    }
  }, [magicMapData, showUserPaths, showHeatmap, pageUrl, maxUsers]);
  const getUserColor = (index) => {
    const colors = [
      "#007bff",
      "#28a745",
      "#dc3545",
      "#ffc107",
      "#6f42c1",
      "#e83e8c",
      "#fd7e14",
      "#20c997",
      "#6c757d",
      "#17a2b8"
    ];
    return colors[index % colors.length];
  };
  const getUserPosition = (session, canvas) => {
    if (session.mouse_position) {
      return {
        x: session.mouse_position.x / session.viewport.width * canvas.width,
        y: session.mouse_position.y / session.viewport.height * canvas.height
      };
    } else {
      const scrollRatio = session.scroll_position.y / (session.viewport.height - window.innerHeight);
      return {
        x: canvas.width / 2 + (Math.random() - 0.5) * 100,
        // Variação horizontal
        y: 100 + scrollRatio * (canvas.height - 200)
        // Baseado no scroll
      };
    }
  };
  const drawDeviceIcon = (ctx, x, y, deviceType) => {
    ctx.font = "12px Arial";
    ctx.fillStyle = "#666";
    ctx.textAlign = "center";
    let icon = "💻";
    if (deviceType === "mobile") icon = "📱";
    else if (deviceType === "tablet") icon = "📱";
    ctx.fillText(icon, x, y);
  };
  const drawHeatmap = (ctx, canvas) => {
    const gradient = ctx.createRadialGradient(
      canvas.width / 2,
      canvas.height / 2,
      0,
      canvas.width / 2,
      canvas.height / 2,
      150
    );
    gradient.addColorStop(0, "rgba(0, 123, 255, 0.3)");
    gradient.addColorStop(1, "rgba(0, 123, 255, 0.05)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };
  useEffect(() => {
    fetchMagicMapData();
    if (realTime) {
      intervalRef.current = setInterval(fetchMagicMapData, refreshInterval);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchMagicMapData, realTime, refreshInterval]);
  useEffect(() => {
    if (magicMapData) {
      drawCanvas();
    }
  }, [magicMapData, drawCanvas]);
  const handleRefresh = () => {
    setLoading(true);
    fetchMagicMapData();
  };
  if (loading && !magicMapData) {
    return /* @__PURE__ */ jsxs("div", { className: "flex justify-center items-center h-96", children: [
      /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" }),
      /* @__PURE__ */ jsx("span", { className: "ml-3 text-gray-600", children: "Carregando Magic Map..." })
    ] });
  }
  if (error) {
    return /* @__PURE__ */ jsxs("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4 text-center", children: [
      /* @__PURE__ */ jsx("p", { className: "text-red-600 font-medium", children: error }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handleRefresh,
          className: "mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors",
          children: "Tentar Novamente"
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "🗺️ Magic Map - Usuários em Tempo Real" }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600", children: [
          magicMapData?.active_sessions || 0,
          " usuários ativos",
          pageUrl && ` na página ${pageUrl}`
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleRefresh,
            className: "px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 transition-colors",
            children: "🔄 Atualizar"
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
          /* @__PURE__ */ jsx("span", { className: `w-2 h-2 rounded-full ${realTime ? "bg-green-500" : "bg-gray-400"}` }),
          "Tempo Real ",
          realTime ? "ON" : "OFF"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "relative border rounded-lg overflow-hidden bg-gray-50", children: [
      /* @__PURE__ */ jsx(
        "canvas",
        {
          ref: canvasRef,
          width: 1200,
          height: 800,
          className: "w-full h-auto cursor-crosshair",
          style: { maxHeight: "600px" }
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "absolute top-2 right-2 bg-white bg-opacity-90 rounded p-2 text-xs", children: /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsx("div", { className: "w-3 h-3 bg-blue-500 rounded" }),
          /* @__PURE__ */ jsx("span", { children: "Ativo (últimos 30s)" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsx("div", { className: "w-3 h-3 bg-green-500 rounded" }),
          /* @__PURE__ */ jsx("span", { children: "Movimento do mouse" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsx("div", { className: "w-3 h-3 bg-gray-400 rounded border border-dashed border-gray-600" }),
          /* @__PURE__ */ jsx("span", { children: "Inativo" })
        ] })
      ] }) }),
      loading && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" }) })
    ] }),
    showContextMessages && contextMessages.length > 0 && /* @__PURE__ */ jsxs("div", { className: "bg-white border rounded-lg p-4", children: [
      /* @__PURE__ */ jsx("h4", { className: "font-medium text-gray-900 mb-3", children: "📝 Atividades Recentes" }),
      /* @__PURE__ */ jsx("div", { className: "space-y-2 max-h-40 overflow-y-auto", children: contextMessages.map((msg, index) => /* @__PURE__ */ jsxs("div", { className: `flex items-start gap-3 p-2 rounded text-sm ${msg.type === "warning" ? "bg-yellow-50 border-l-4 border-yellow-400" : msg.type === "success" ? "bg-green-50 border-l-4 border-green-400" : "bg-blue-50 border-l-4 border-blue-400"}`, children: [
        /* @__PURE__ */ jsx("span", { className: "text-lg", children: msg.icon }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsx("div", { className: "font-medium text-gray-900", children: msg.visitor_id }),
          /* @__PURE__ */ jsx("div", { className: "text-gray-600", children: msg.message }),
          /* @__PURE__ */ jsxs("div", { className: "text-xs text-gray-500 mt-1", children: [
            msg.page_views,
            " páginas • ",
            Math.floor(msg.duration / 60),
            "min • ",
            msg.device_type
          ] })
        ] })
      ] }, msg.session_id)) })
    ] }),
    selectedUser && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg p-6 max-w-md w-full mx-4", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-4", children: "Detalhes do Usuário" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-sm", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("strong", { children: "ID:" }),
          " ",
          selectedUser.visitor_id
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Dispositivo:" }),
          " ",
          selectedUser.device_type
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Duração:" }),
          " ",
          Math.floor(selectedUser.duration / 60),
          " minutos"
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Páginas:" }),
          " ",
          selectedUser.page_views
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Scroll Máx:" }),
          " ",
          selectedUser.max_scroll_depth,
          "%"
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("strong", { children: "Última atividade:" }),
          " ",
          new Date(selectedUser.last_activity).toLocaleString()
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex justify-end mt-6", children: /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setSelectedUser(null),
          className: "px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700",
          children: "Fechar"
        }
      ) })
    ] }) })
  ] });
};
const HeatmapChart = ({
  pageUrl,
  dateRange = "7d",
  deviceType = null,
  heatmapType = "click",
  // 'click', 'scroll', 'attention'
  width = 800,
  height = 600,
  showLegend = true
}) => {
  const [heatmapData, setHeatmapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const canvasRef = useRef(null);
  useEffect(() => {
    fetchHeatmapData();
  }, [pageUrl, dateRange, deviceType, heatmapType]);
  const fetchHeatmapData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Usuário não autenticado");
        return;
      }
      const params = new URLSearchParams({
        range: dateRange,
        ...deviceType && { device_type: deviceType },
        ...pageUrl && { page_url: pageUrl }
      });
      const response = await fetch(`/api/tracking/analytics?${params}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      const data = await response.json();
      if (data.heatmap_data && data.heatmap_data.length > 0) {
        setHeatmapData(data.heatmap_data[0]);
      } else {
        setHeatmapData(null);
      }
      setError(null);
    } catch (err) {
      setError("Erro ao carregar heatmap");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (heatmapData && canvasRef.current) {
      drawHeatmap();
    }
  }, [heatmapData, heatmapType]);
  const drawHeatmap = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#f8f9fa";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, 60);
    ctx.strokeStyle = "#e9ecef";
    ctx.strokeRect(0, 0, width, 60);
    let dataPoints = [];
    let maxIntensity = 0;
    switch (heatmapType) {
      case "click":
        dataPoints = heatmapData.clicks_data || [];
        maxIntensity = Math.max(...dataPoints.map((d) => d.count), 1);
        break;
      case "scroll":
        dataPoints = heatmapData.scroll_data || [];
        maxIntensity = Math.max(...dataPoints.map((d) => d.frequency), 1);
        break;
      case "attention":
        dataPoints = heatmapData.attention_data || [];
        maxIntensity = Math.max(...dataPoints.map((d) => d.attention_time), 1);
        break;
      default:
        dataPoints = heatmapData.clicks_data || [];
        maxIntensity = Math.max(...dataPoints.map((d) => d.count), 1);
    }
    if (dataPoints.length === 0) {
      ctx.fillStyle = "#666";
      ctx.font = "16px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Nenhum dado de heatmap disponível", width / 2, height / 2);
      return;
    }
    dataPoints.forEach((point) => {
      let intensity;
      switch (heatmapType) {
        case "click":
          intensity = point.count / maxIntensity;
          break;
        case "scroll":
          intensity = point.frequency / maxIntensity;
          break;
        case "attention":
          intensity = point.attention_time / maxIntensity;
          break;
        default:
          intensity = point.count / maxIntensity;
      }
      const x = point.x / heatmapData.viewport_width * width;
      const y = point.y / heatmapData.viewport_height * height;
      const radius = Math.max(10, intensity * 30);
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, `rgba(255, 0, 0, ${intensity * 0.8})`);
      gradient.addColorStop(0.5, `rgba(255, 165, 0, ${intensity * 0.6})`);
      gradient.addColorStop(1, `rgba(255, 255, 0, ${intensity * 0.2})`);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fill();
      if (intensity > 0.7) {
        ctx.fillStyle = "#fff";
        ctx.font = "12px Arial";
        ctx.textAlign = "center";
        const value = heatmapType === "click" ? point.count : heatmapType === "scroll" ? point.frequency : Math.round(point.attention_time / 1e3) + "s";
        ctx.fillText(value.toString(), x, y + 4);
      }
    });
  };
  const getHeatmapTypeLabel = () => {
    switch (heatmapType) {
      case "click":
        return "Cliques";
      case "scroll":
        return "Scroll";
      case "attention":
        return "Atenção";
      default:
        return "Cliques";
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsxs("div", { className: "flex justify-center items-center h-64", children: [
      /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" }),
      /* @__PURE__ */ jsx("span", { className: "ml-2 text-gray-600", children: "Carregando heatmap..." })
    ] });
  }
  if (error) {
    return /* @__PURE__ */ jsxs("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4 text-center", children: [
      /* @__PURE__ */ jsx("p", { className: "text-red-600", children: error }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: fetchHeatmapData,
          className: "mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700",
          children: "Tentar Novamente"
        }
      )
    ] });
  }
  if (!heatmapData) {
    return /* @__PURE__ */ jsx("div", { className: "bg-gray-50 border border-gray-200 rounded-lg p-8 text-center", children: /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "Nenhum dado de heatmap disponível para o período selecionado." }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-lg font-semibold text-gray-900", children: [
          "🔥 Heatmap - ",
          getHeatmapTypeLabel()
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600", children: [
          "Página: ",
          heatmapData.page_url
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: /* @__PURE__ */ jsxs(
        "select",
        {
          value: heatmapType,
          onChange: (e) => setHeatmapType(e.target.value),
          className: "px-3 py-1 border border-gray-300 rounded text-sm",
          children: [
            /* @__PURE__ */ jsx("option", { value: "click", children: "Cliques" }),
            /* @__PURE__ */ jsx("option", { value: "scroll", children: "Scroll" }),
            /* @__PURE__ */ jsx("option", { value: "attention", children: "Atenção" })
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "relative border rounded-lg overflow-hidden bg-white", children: [
      /* @__PURE__ */ jsx(
        "canvas",
        {
          ref: canvasRef,
          width,
          height,
          className: "block",
          style: {
            width: "100%",
            height: "auto",
            maxWidth: width,
            maxHeight: height
          }
        }
      ),
      showLegend && /* @__PURE__ */ jsx("div", { className: "absolute bottom-2 left-2 bg-white bg-opacity-90 rounded p-2", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs", children: [
        /* @__PURE__ */ jsx("span", { children: "Menos" }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
          /* @__PURE__ */ jsx("div", { className: "w-3 h-3 rounded-full bg-yellow-300" }),
          /* @__PURE__ */ jsx("div", { className: "w-3 h-3 rounded-full bg-orange-400" }),
          /* @__PURE__ */ jsx("div", { className: "w-3 h-3 rounded-full bg-red-500" })
        ] }),
        /* @__PURE__ */ jsx("span", { children: "Mais" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-blue-50 p-3 rounded", children: [
        /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-blue-600", children: heatmapData.total_sessions }),
        /* @__PURE__ */ jsx("div", { className: "text-sm text-blue-800", children: "Sessões" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-green-50 p-3 rounded", children: [
        /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-green-600", children: heatmapData.total_events }),
        /* @__PURE__ */ jsx("div", { className: "text-sm text-green-800", children: "Eventos" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-purple-50 p-3 rounded", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-2xl font-bold text-purple-600", children: [
          Math.round(heatmapData.avg_session_duration),
          "s"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-sm text-purple-800", children: "Duração Média" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-orange-50 p-3 rounded", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-2xl font-bold text-orange-600", children: [
          Math.round(heatmapData.bounce_rate * 100),
          "%"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-sm text-orange-800", children: "Bounce Rate" })
      ] })
    ] })
  ] });
};
const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "ClientLayout", $$ClientLayout, { "title": "Dashboard Analytics Avançado - GetNexo Pro", "data-astro-cid-lsm4nuzv": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-gray-50" data-astro-cid-lsm4nuzv> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-astro-cid-lsm4nuzv>  <div class="text-center mb-12" data-astro-cid-lsm4nuzv> <div class="inline-block p-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl border border-purple-100" data-astro-cid-lsm4nuzv> <h1 class="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4" data-astro-cid-lsm4nuzv>
📊 Dashboard Analytics Avançado
</h1> <p class="text-gray-600 text-lg max-w-2xl mx-auto" data-astro-cid-lsm4nuzv>
Monitore o desempenho completo do seu suporte com métricas avançadas,
                        gráficos interativos e insights em tempo real.
</p> </div> </div>  <div class="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" data-astro-cid-lsm4nuzv> <div data-astro-cid-lsm4nuzv> <h2 class="text-2xl font-bold text-gray-900" data-astro-cid-lsm4nuzv>Analytics de Suporte</h2> <p class="text-gray-600 mt-1" data-astro-cid-lsm4nuzv>Dados atualizados em tempo real</p> </div> <div class="flex gap-3" data-astro-cid-lsm4nuzv> <select id="time-range-select" class="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500" data-astro-cid-lsm4nuzv> <option value="7d" data-astro-cid-lsm4nuzv>Últimos 7 dias</option> <option value="30d" selected data-astro-cid-lsm4nuzv>Últimos 30 dias</option> <option value="90d" data-astro-cid-lsm4nuzv>Últimos 90 dias</option> <option value="1y" data-astro-cid-lsm4nuzv>Último ano</option> </select> <button id="refresh-btn" class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 font-medium" data-astro-cid-lsm4nuzv> <span data-astro-cid-lsm4nuzv>🔄</span>
Atualizar
</button> </div> </div>  <div class="mb-8" data-astro-cid-lsm4nuzv> ${renderComponent($$result2, "MagicMap", MagicMap, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/lele/usenexo/getnexo-site/src/components/analytics/MagicMap.jsx", "client:component-export": "default", "data-astro-cid-lsm4nuzv": true })} </div>  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8" data-astro-cid-lsm4nuzv> ${renderComponent($$result2, "HeatmapChart", HeatmapChart, { "pageUrl": "/", "dateRange": "7d", "heatmapType": "click", "title": "Heatmap de Cliques - Home", "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/lele/usenexo/getnexo-site/src/components/analytics/HeatmapChart.jsx", "client:component-export": "default", "data-astro-cid-lsm4nuzv": true })} ${renderComponent($$result2, "HeatmapChart", HeatmapChart, { "pageUrl": "/precos", "dateRange": "7d", "heatmapType": "attention", "title": "Heatmap de Atenção - Preços", "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/lele/usenexo/getnexo-site/src/components/analytics/HeatmapChart.jsx", "client:component-export": "default", "data-astro-cid-lsm4nuzv": true })} </div>  ${renderComponent($$result2, "AnalyticsDashboard", AnalyticsDashboard, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/lele/usenexo/getnexo-site/src/components/analytics/AnalyticsDashboard.jsx", "client:component-export": "default", "data-astro-cid-lsm4nuzv": true })} </div> </div> ${renderScript($$result2, "/home/lele/usenexo/getnexo-site/src/pages/dashboard/analytics/index.astro?astro&type=script&index=0&lang.ts")}  ` })}`;
}, "/home/lele/usenexo/getnexo-site/src/pages/dashboard/analytics/index.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/dashboard/analytics/index.astro";
const $$url = "/dashboard/analytics";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
