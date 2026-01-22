import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from "../../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$ClientLayout } from "../../assets/ClientLayout-Cg0S0bz6.js";
/* empty css                                       */
import { renderers } from "../../renderers.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Atividade = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "ClientLayout", $$ClientLayout, { "title": "Atividade - GetNexo Pro", "data-astro-cid-fcm4zznc": true }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template(["  ", `<div style="padding: 2rem; max-width: 1000px; margin: 0 auto;" data-astro-cid-fcm4zznc> <!-- Header --> <div class="activity-header" data-astro-cid-fcm4zznc> <h1 data-astro-cid-fcm4zznc>📈 Atividade Recente</h1> <p data-astro-cid-fcm4zznc>Acompanhe todas as ações e eventos do seu painel</p> </div> <!-- Filters --> <div class="activity-filters" data-astro-cid-fcm4zznc> <div class="filters-grid" data-astro-cid-fcm4zznc> <div class="filter-group" data-astro-cid-fcm4zznc> <label class="filter-label" data-astro-cid-fcm4zznc>Tipo</label> <select class="filter-select" id="type-filter" data-astro-cid-fcm4zznc> <option value="all" selected data-astro-cid-fcm4zznc>Todas as atividades</option> <option value="project" data-astro-cid-fcm4zznc>Projetos</option> <option value="service" data-astro-cid-fcm4zznc>Serviços</option> <option value="system" data-astro-cid-fcm4zznc>Sistema</option> </select> </div> <div class="filter-group" data-astro-cid-fcm4zznc> <label class="filter-label" data-astro-cid-fcm4zznc>Período</label> <select class="filter-select" id="period-filter" data-astro-cid-fcm4zznc> <option value="today" data-astro-cid-fcm4zznc>Hoje</option> <option value="week" selected data-astro-cid-fcm4zznc>Esta semana</option> <option value="month" data-astro-cid-fcm4zznc>Este mês</option> <option value="all" data-astro-cid-fcm4zznc>Todo período</option> </select> </div> <div class="filter-group" data-astro-cid-fcm4zznc> <button class="btn btn-primary" onclick="applyFilters()" data-astro-cid-fcm4zznc>Aplicar Filtros</button> </div> </div> </div> <!-- Timeline --> <div class="activity-timeline" id="activity-timeline" data-astro-cid-fcm4zznc> <!-- Activity items will be loaded here --> </div> </div> <script>
        async function loadActivity() {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(\`\${API_URL}/api/activity\`, {
                    headers: { 'Authorization': token }
                });
                const activities = await res.json();
                renderActivity(activities);
            } catch (e) {
                console.error('Error loading activity, using mock data', e);
                loadMockActivity();
            }
        }

        function renderActivity(activities) {
            const timeline = document.getElementById('activity-timeline');

            if (activities.length === 0) {
                timeline.innerHTML = \`
                    <div class="empty-state">
                        <h3>📭 Nenhuma atividade</h3>
                        <p>Não há atividades recentes para exibir.</p>
                    </div>
                \`;
                return;
            }

            timeline.innerHTML = activities.map(activity => \`
                <div class="timeline-item">
                    <div class="activity-type type-\${activity.type}">\${activity.type}</div>
                    <div class="activity-item">
                        <div class="activity-icon">\${activity.icon}</div>
                        <div class="activity-content">
                            <h4>\${activity.title}</h4>
                            <p>\${activity.description}</p>
                        </div>
                        <div class="activity-time">\${activity.time}</div>
                    </div>
                </div>
            \`).join('');
        }

        function loadMockActivity() {
            const mockActivities = [
                {
                    id: '1',
                    title: 'Novo projeto criado',
                    description: 'Projeto "Landing Page E-commerce" foi iniciado com sucesso',
                    type: 'project',
                    icon: '📁',
                    time: '2 horas atrás'
                },
                {
                    id: '2',
                    title: 'Serviço ativado',
                    description: 'SEO Automation Pro foi ativado e está funcionando',
                    type: 'service',
                    icon: '⚙️',
                    time: '5 horas atrás'
                },
                {
                    id: '3',
                    title: 'Pagamento processado',
                    description: 'Fatura de janeiro foi paga com sucesso',
                    type: 'system',
                    icon: '💰',
                    time: '1 dia atrás'
                },
                {
                    id: '4',
                    title: 'Template usado',
                    description: 'Template "E-commerce React" foi usado para criar um novo projeto',
                    type: 'project',
                    icon: '📋',
                    time: '2 dias atrás'
                },
                {
                    id: '5',
                    title: 'Serviço parado',
                    description: 'Analytics Pro foi temporariamente pausado',
                    type: 'service',
                    icon: '⏸️',
                    time: '3 dias atrás'
                }
            ];

            renderActivity(mockActivities);
        }

        function applyFilters() {
            const type = document.getElementById('type-filter').value;
            const period = document.getElementById('period-filter').value;

            console.log('Aplicando filtros:', { type, period });
            // Reload activity with filters
            loadActivity();
        }

        // Initialize
        loadActivity();
    <\/script> `], ["  ", `<div style="padding: 2rem; max-width: 1000px; margin: 0 auto;" data-astro-cid-fcm4zznc> <!-- Header --> <div class="activity-header" data-astro-cid-fcm4zznc> <h1 data-astro-cid-fcm4zznc>📈 Atividade Recente</h1> <p data-astro-cid-fcm4zznc>Acompanhe todas as ações e eventos do seu painel</p> </div> <!-- Filters --> <div class="activity-filters" data-astro-cid-fcm4zznc> <div class="filters-grid" data-astro-cid-fcm4zznc> <div class="filter-group" data-astro-cid-fcm4zznc> <label class="filter-label" data-astro-cid-fcm4zznc>Tipo</label> <select class="filter-select" id="type-filter" data-astro-cid-fcm4zznc> <option value="all" selected data-astro-cid-fcm4zznc>Todas as atividades</option> <option value="project" data-astro-cid-fcm4zznc>Projetos</option> <option value="service" data-astro-cid-fcm4zznc>Serviços</option> <option value="system" data-astro-cid-fcm4zznc>Sistema</option> </select> </div> <div class="filter-group" data-astro-cid-fcm4zznc> <label class="filter-label" data-astro-cid-fcm4zznc>Período</label> <select class="filter-select" id="period-filter" data-astro-cid-fcm4zznc> <option value="today" data-astro-cid-fcm4zznc>Hoje</option> <option value="week" selected data-astro-cid-fcm4zznc>Esta semana</option> <option value="month" data-astro-cid-fcm4zznc>Este mês</option> <option value="all" data-astro-cid-fcm4zznc>Todo período</option> </select> </div> <div class="filter-group" data-astro-cid-fcm4zznc> <button class="btn btn-primary" onclick="applyFilters()" data-astro-cid-fcm4zznc>Aplicar Filtros</button> </div> </div> </div> <!-- Timeline --> <div class="activity-timeline" id="activity-timeline" data-astro-cid-fcm4zznc> <!-- Activity items will be loaded here --> </div> </div> <script>
        async function loadActivity() {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(\\\`\\\${API_URL}/api/activity\\\`, {
                    headers: { 'Authorization': token }
                });
                const activities = await res.json();
                renderActivity(activities);
            } catch (e) {
                console.error('Error loading activity, using mock data', e);
                loadMockActivity();
            }
        }

        function renderActivity(activities) {
            const timeline = document.getElementById('activity-timeline');

            if (activities.length === 0) {
                timeline.innerHTML = \\\`
                    <div class="empty-state">
                        <h3>📭 Nenhuma atividade</h3>
                        <p>Não há atividades recentes para exibir.</p>
                    </div>
                \\\`;
                return;
            }

            timeline.innerHTML = activities.map(activity => \\\`
                <div class="timeline-item">
                    <div class="activity-type type-\\\${activity.type}">\\\${activity.type}</div>
                    <div class="activity-item">
                        <div class="activity-icon">\\\${activity.icon}</div>
                        <div class="activity-content">
                            <h4>\\\${activity.title}</h4>
                            <p>\\\${activity.description}</p>
                        </div>
                        <div class="activity-time">\\\${activity.time}</div>
                    </div>
                </div>
            \\\`).join('');
        }

        function loadMockActivity() {
            const mockActivities = [
                {
                    id: '1',
                    title: 'Novo projeto criado',
                    description: 'Projeto "Landing Page E-commerce" foi iniciado com sucesso',
                    type: 'project',
                    icon: '📁',
                    time: '2 horas atrás'
                },
                {
                    id: '2',
                    title: 'Serviço ativado',
                    description: 'SEO Automation Pro foi ativado e está funcionando',
                    type: 'service',
                    icon: '⚙️',
                    time: '5 horas atrás'
                },
                {
                    id: '3',
                    title: 'Pagamento processado',
                    description: 'Fatura de janeiro foi paga com sucesso',
                    type: 'system',
                    icon: '💰',
                    time: '1 dia atrás'
                },
                {
                    id: '4',
                    title: 'Template usado',
                    description: 'Template "E-commerce React" foi usado para criar um novo projeto',
                    type: 'project',
                    icon: '📋',
                    time: '2 dias atrás'
                },
                {
                    id: '5',
                    title: 'Serviço parado',
                    description: 'Analytics Pro foi temporariamente pausado',
                    type: 'service',
                    icon: '⏸️',
                    time: '3 dias atrás'
                }
            ];

            renderActivity(mockActivities);
        }

        function applyFilters() {
            const type = document.getElementById('type-filter').value;
            const period = document.getElementById('period-filter').value;

            console.log('Aplicando filtros:', { type, period });
            // Reload activity with filters
            loadActivity();
        }

        // Initialize
        loadActivity();
    <\/script> `])), maybeRenderHead()) })}`;
}, "/home/lele/usenexo/getnexo-site/src/pages/dashboard/atividade.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/dashboard/atividade.astro";
const $$url = "/dashboard/atividade";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Atividade,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
