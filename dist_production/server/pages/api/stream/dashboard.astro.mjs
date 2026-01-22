import { v as verifyToken } from "../../../assets/auth-bbOfVkaL.js";
import { l as logger } from "../../../assets/logger-DtfYvGVK.js";
import { g as getMetrics } from "../../../assets/metrics-DjHhW9eo.js";
import { renderers } from "../../../renderers.mjs";
let businessData = {
  totalUsers: 1250,
  activeUsers: 890,
  totalOrders: 2456,
  totalRevenue: 185430.5,
  monthlyRevenue: [
    12500,
    15800,
    14200,
    18900,
    22100,
    19800,
    25600,
    28900,
    31200,
    27800,
    33400,
    36500
  ],
  monthlyUsers: [
    800,
    920,
    1050,
    1180,
    1320,
    1480,
    1650,
    1820,
    1990,
    2150,
    2300,
    2450
  ],
  churnRate: 0.05,
  conversionRate: 0.023,
  avgOrderValue: 75.5,
  customerLifetimeValue: 450,
  lastUpdated: /* @__PURE__ */ new Date()
};
function updateBusinessData() {
  businessData.totalUsers += Math.floor(Math.random() * 10);
  businessData.activeUsers = Math.floor(businessData.totalUsers * (0.6 + Math.random() * 0.3));
  businessData.totalOrders += Math.floor(Math.random() * 5);
  businessData.totalRevenue += Math.floor(Math.random() * 1e3);
  businessData.lastUpdated = /* @__PURE__ */ new Date();
  logger.business("Business data updated", businessData);
}
function calculateKPIs() {
  const data = businessData;
  const currentMonth = (/* @__PURE__ */ new Date()).getMonth();
  const userGrowth = data.monthlyUsers[currentMonth] - data.monthlyUsers[currentMonth - 1] || 0;
  const revenueGrowth = data.monthlyRevenue[currentMonth] - data.monthlyRevenue[currentMonth - 1] || 0;
  const churnRisk = data.churnRate > 0.08 ? "high" : data.churnRate > 0.05 ? "medium" : "low";
  const revenueRisk = revenueGrowth < -5e3 ? "high" : revenueGrowth < -1e3 ? "medium" : "low";
  return {
    // Core KPIs
    totalUsers: data.totalUsers,
    activeUsers: data.activeUsers,
    totalOrders: data.totalOrders,
    totalRevenue: data.totalRevenue,
    monthlyRevenue: data.monthlyRevenue[currentMonth],
    monthlyUsers: data.monthlyUsers[currentMonth],
    // Calculated metrics
    userGrowth,
    revenueGrowth,
    userGrowthPercent: (userGrowth / data.monthlyUsers[currentMonth - 1] * 100).toFixed(2),
    revenueGrowthPercent: (revenueGrowth / data.monthlyRevenue[currentMonth - 1] * 100).toFixed(2),
    // Business metrics
    churnRate: (data.churnRate * 100).toFixed(2),
    conversionRate: (data.conversionRate * 100).toFixed(2),
    avgOrderValue: data.avgOrderValue,
    customerLifetimeValue: data.customerLifetimeValue,
    // Risk assessment
    churnRisk,
    revenueRisk,
    overallRisk: churnRisk === "high" || revenueRisk === "high" ? "high" : churnRisk === "medium" || revenueRisk === "medium" ? "medium" : "low",
    // Projections (simple linear forecast)
    projectedRevenue: data.monthlyRevenue[currentMonth] + revenueGrowth,
    projectedUsers: data.monthlyUsers[currentMonth] + userGrowth,
    lastUpdated: data.lastUpdated
  };
}
function generateForecast(months = 6) {
  const data = businessData;
  const currentMonth = (/* @__PURE__ */ new Date()).getMonth();
  const forecasts = [];
  const revenueTrend = data.monthlyRevenue.slice(-3).reduce((a, b) => a + b) / 3;
  const userTrend = data.monthlyUsers.slice(-3).reduce((a, b) => a + b) / 3;
  for (let i = 1; i <= months; i++) {
    const month = /* @__PURE__ */ new Date();
    month.setMonth(currentMonth + i);
    forecasts.push({
      month: month.toISOString().slice(0, 7),
      projectedRevenue: Math.round(revenueTrend * (1 + i * 0.05)),
      // 5% growth per month
      projectedUsers: Math.round(userTrend * (1 + i * 0.03)),
      // 3% growth per month
      confidence: Math.max(0.5, 1 - i * 0.1)
      // Confidence decreases over time
    });
  }
  return forecasts;
}
const RISK_THRESHOLDS = {
  churnRate: { high: 0.15 },
  revenueDecline: { high: -1e4 },
  userDecline: { high: -300 }
};
function checkRisks(kpis) {
  const risks = [];
  if (kpis.churnRate > RISK_THRESHOLDS.churnRate.high) {
    risks.push({
      type: "churn",
      level: "high",
      message: `Taxa de churn muito alta: ${kpis.churnRate}%`,
      action: "Implementar retenção de clientes"
    });
  }
  if (kpis.revenueGrowth < RISK_THRESHOLDS.revenueDecline.high) {
    risks.push({
      type: "revenue",
      level: "high",
      message: `Declínio severo de receita: R$ ${kpis.revenueGrowth}`,
      action: "Revisar estratégia de vendas"
    });
  }
  if (kpis.userGrowth < RISK_THRESHOLDS.userDecline.high) {
    risks.push({
      type: "users",
      level: "high",
      message: `Perda significativa de usuários: ${kpis.userGrowth}`,
      action: "Investigar causas de abandono"
    });
  }
  return risks;
}
setInterval(updateBusinessData, 6e4);
const GET = async ({ request }) => {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Token não fornecido" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  const token = authHeader.slice(7);
  const decoded = verifyToken(token);
  if (!decoded) {
    return new Response(JSON.stringify({ error: "Token inválido" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  const kpis = calculateKPIs();
  const forecasts = generateForecast(3);
  const risks = checkRisks(kpis);
  await getMetrics();
  const dashboardData = {
    ...kpis,
    forecasts,
    risks,
    systemMetrics: {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage()
    },
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  };
  return new Response(JSON.stringify(dashboardData), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
