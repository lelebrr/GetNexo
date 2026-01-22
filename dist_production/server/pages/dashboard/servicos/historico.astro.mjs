import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from "../../../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$ClientLayout } from "../../../assets/ClientLayout-Cg0S0bz6.js";
/* empty css                                      */
import { renderers } from "../../../renderers.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "ClientLayout", $$ClientLayout, { "title": "Histórico de Serviços - GetNexo Pro", "data-astro-cid-yyrmtezw": true }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template(["  ", `<div style="padding: 2rem; max-width: 1000px; margin: 0 auto;" data-astro-cid-yyrmtezw> <!-- Header --> <div class="history-header" data-astro-cid-yyrmtezw> <h1 data-astro-cid-yyrmtezw>📚 Histórico de Serviços</h1> <p data-astro-cid-yyrmtezw>Acompanhe todos os serviços que você já utilizou</p> </div> <!-- Timeline --> <div class="history-timeline" id="history-timeline" data-astro-cid-yyrmtezw> <!-- History items will be loaded here --> </div> </div> <script>
        async function loadServiceHistory() {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(\`\${API_URL}/api/services/history\`, {
                    headers: { 'Authorization': token }
                });
                const history = await res.json();
                renderHistory(history);
            } catch (e) {
                console.error('Error loading history, using mock data', e);
                loadMockHistory();
            }
        }

        function renderHistory(history) {
            const timeline = document.getElementById('history-timeline');

            if (history.length === 0) {
                timeline.innerHTML = \`
                    <div class="empty-state">
                        <h3>📭 Histórico vazio</h3>
                        <p>Você ainda não utilizou nenhum serviço. <a href="/dashboard/servicos/loja" style="color: #00d4ff;">Explore nossa loja</a></p>
                    </div>
                \`;
                return;
            }

            timeline.innerHTML = history.map(item => \`
                <div class="timeline-item \${item.status}">
                    <div class="service-header">
                        <div class="service-icon">\${item.icon}</div>
                        <div class="service-title">\${item.name}</div>
                        <div class="service-status status-\${item.status}">\${getStatusText(item.status)}</div>
                    </div>
                    <div class="service-period">\${item.period}</div>
                    <div class="service-desc">\${item.description}</div>
                    <div class="service-metrics">
                        <div class="metric">Custo: <strong>R$ \${item.cost}</strong></div>
                        <div class="metric">Uso: <strong>\${item.usage || 0}%</strong></div>
                        <div class="metric">Duração: <strong>\${item.duration}</strong></div>
                    </div>
                    <div style="margin-top: 1rem;">
                        <button class="btn btn-outline" onclick="viewDetails('\${item.id}')">Ver Detalhes</button>
                    </div>
                </div>
            \`).join('');
        }

        function getStatusText(status) {
            const statuses = {
                'completed': 'Concluído',
                'failed': 'Falhou',
                'active': 'Ativo'
            };
            return statuses[status] || 'Ativo';
        }

        function loadMockHistory() {
            const mockHistory = [
                {
                    id: '1',
                    name: 'SEO Automation Pro',
                    description: 'Serviço de otimização automática de SEO',
                    status: 'completed',
                    period: 'Janeiro 2026',
                    cost: 99,
                    usage: 85,
                    duration: '30 dias',
                    icon: '🔍'
                },
                {
                    id: '2',
                    name: 'Analytics Pro',
                    description: 'Relatórios avançados de analytics',
                    status: 'completed',
                    period: 'Dezembro 2025',
                    cost: 149,
                    usage: 92,
                    duration: '45 dias',
                    icon: '📊'
                },
                {
                    id: '3',
                    name: 'Chatbot IA Plus',
                    description: 'Assistente virtual inteligente',
                    status: 'failed',
                    period: 'Novembro 2025',
                    cost: 79,
                    usage: 23,
                    duration: '7 dias',
                    icon: '🤖'
                }
            ];

            renderHistory(mockHistory);
        }

        function viewDetails(serviceId) {
            window.location.href = \`/dashboard/servicos/historico/\${serviceId}\`;
        }

        // Initialize
        loadServiceHistory();
    <\/script> `], ["  ", `<div style="padding: 2rem; max-width: 1000px; margin: 0 auto;" data-astro-cid-yyrmtezw> <!-- Header --> <div class="history-header" data-astro-cid-yyrmtezw> <h1 data-astro-cid-yyrmtezw>📚 Histórico de Serviços</h1> <p data-astro-cid-yyrmtezw>Acompanhe todos os serviços que você já utilizou</p> </div> <!-- Timeline --> <div class="history-timeline" id="history-timeline" data-astro-cid-yyrmtezw> <!-- History items will be loaded here --> </div> </div> <script>
        async function loadServiceHistory() {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(\\\`\\\${API_URL}/api/services/history\\\`, {
                    headers: { 'Authorization': token }
                });
                const history = await res.json();
                renderHistory(history);
            } catch (e) {
                console.error('Error loading history, using mock data', e);
                loadMockHistory();
            }
        }

        function renderHistory(history) {
            const timeline = document.getElementById('history-timeline');

            if (history.length === 0) {
                timeline.innerHTML = \\\`
                    <div class="empty-state">
                        <h3>📭 Histórico vazio</h3>
                        <p>Você ainda não utilizou nenhum serviço. <a href="/dashboard/servicos/loja" style="color: #00d4ff;">Explore nossa loja</a></p>
                    </div>
                \\\`;
                return;
            }

            timeline.innerHTML = history.map(item => \\\`
                <div class="timeline-item \\\${item.status}">
                    <div class="service-header">
                        <div class="service-icon">\\\${item.icon}</div>
                        <div class="service-title">\\\${item.name}</div>
                        <div class="service-status status-\\\${item.status}">\\\${getStatusText(item.status)}</div>
                    </div>
                    <div class="service-period">\\\${item.period}</div>
                    <div class="service-desc">\\\${item.description}</div>
                    <div class="service-metrics">
                        <div class="metric">Custo: <strong>R$ \\\${item.cost}</strong></div>
                        <div class="metric">Uso: <strong>\\\${item.usage || 0}%</strong></div>
                        <div class="metric">Duração: <strong>\\\${item.duration}</strong></div>
                    </div>
                    <div style="margin-top: 1rem;">
                        <button class="btn btn-outline" onclick="viewDetails('\\\${item.id}')">Ver Detalhes</button>
                    </div>
                </div>
            \\\`).join('');
        }

        function getStatusText(status) {
            const statuses = {
                'completed': 'Concluído',
                'failed': 'Falhou',
                'active': 'Ativo'
            };
            return statuses[status] || 'Ativo';
        }

        function loadMockHistory() {
            const mockHistory = [
                {
                    id: '1',
                    name: 'SEO Automation Pro',
                    description: 'Serviço de otimização automática de SEO',
                    status: 'completed',
                    period: 'Janeiro 2026',
                    cost: 99,
                    usage: 85,
                    duration: '30 dias',
                    icon: '🔍'
                },
                {
                    id: '2',
                    name: 'Analytics Pro',
                    description: 'Relatórios avançados de analytics',
                    status: 'completed',
                    period: 'Dezembro 2025',
                    cost: 149,
                    usage: 92,
                    duration: '45 dias',
                    icon: '📊'
                },
                {
                    id: '3',
                    name: 'Chatbot IA Plus',
                    description: 'Assistente virtual inteligente',
                    status: 'failed',
                    period: 'Novembro 2025',
                    cost: 79,
                    usage: 23,
                    duration: '7 dias',
                    icon: '🤖'
                }
            ];

            renderHistory(mockHistory);
        }

        function viewDetails(serviceId) {
            window.location.href = \\\`/dashboard/servicos/historico/\\\${serviceId}\\\`;
        }

        // Initialize
        loadServiceHistory();
    <\/script> `])), maybeRenderHead()) })}`;
}, "/home/lele/usenexo/getnexo-site/src/pages/dashboard/servicos/historico/index.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/dashboard/servicos/historico/index.astro";
const $$url = "/dashboard/servicos/historico";
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
