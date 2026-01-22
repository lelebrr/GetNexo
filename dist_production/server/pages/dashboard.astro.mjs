import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, l as renderScript } from "../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$ClientLayout } from "../assets/ClientLayout-Cg0S0bz6.js";
/* empty css                                */
import { renderers } from "../renderers.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "ClientLayout", $$ClientLayout, { "title": "Dashboard - GetNexo Pro", "data-astro-cid-y55gmoyq": true }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template(["  ", "  ", `<div style="padding: 2rem; max-width: 1400px; margin: 0 auto;" data-astro-cid-y55gmoyq> <!-- Welcome Header --> <div class="welcome-header" data-astro-cid-y55gmoyq> <h1 data-astro-cid-y55gmoyq>🚀 Bem-vindo ao GetNexo Pro</h1> <p data-astro-cid-y55gmoyq>Gerencie seus projetos, monitore serviços e maximize sua produtividade</p> </div> <!-- Quick Actions --> <div class="quick-actions" data-astro-cid-y55gmoyq> <div class="action-card primary" onclick="createNewProject()" data-astro-cid-y55gmoyq> <span class="action-icon" data-astro-cid-y55gmoyq>📁</span> <div class="action-title" data-astro-cid-y55gmoyq>Novo Projeto</div> <div class="action-desc" data-astro-cid-y55gmoyq>Comece um novo projeto do zero</div> </div> <div class="action-card success" onclick="exploreServices()" data-astro-cid-y55gmoyq> <span class="action-icon" data-astro-cid-y55gmoyq>🛒</span> <div class="action-title" data-astro-cid-y55gmoyq>Explorar Serviços</div> <div class="action-desc" data-astro-cid-y55gmoyq>Descubra novos serviços disponíveis</div> </div> <div class="action-card warning" onclick="viewAnalytics()" data-astro-cid-y55gmoyq> <span class="action-icon" data-astro-cid-y55gmoyq>📊</span> <div class="action-title" data-astro-cid-y55gmoyq>Ver Analytics</div> <div class="action-desc" data-astro-cid-y55gmoyq>Acompanhe seu desempenho</div> </div> <div class="action-card danger" onclick="getSupport()" data-astro-cid-y55gmoyq> <span class="action-icon" data-astro-cid-y55gmoyq>🆘</span> <div class="action-title" data-astro-cid-y55gmoyq>Suporte</div> <div class="action-desc" data-astro-cid-y55gmoyq>Precisa de ajuda? Estamos aqui</div> </div> </div> <!-- Stats Grid --> <div class="stats-grid" data-astro-cid-y55gmoyq> <div class="stat-card" data-astro-cid-y55gmoyq> <div class="stat-header" data-astro-cid-y55gmoyq> <div class="stat-icon" data-astro-cid-y55gmoyq>📁</div> <div class="stat-title" data-astro-cid-y55gmoyq>Projetos Ativos</div> </div> <div class="stat-value" id="active-projects" data-astro-cid-y55gmoyq>0</div> <div class="stat-desc" data-astro-cid-y55gmoyq> <span class="change-positive" data-astro-cid-y55gmoyq>↗️ +2</span> este mês
</div> </div> <div class="stat-card" data-astro-cid-y55gmoyq> <div class="stat-header" data-astro-cid-y55gmoyq> <div class="stat-icon" data-astro-cid-y55gmoyq>⚙️</div> <div class="stat-title" data-astro-cid-y55gmoyq>Serviços Ativos</div> </div> <div class="stat-value" id="active-services" data-astro-cid-y55gmoyq>0</div> <div class="stat-desc" data-astro-cid-y55gmoyq> <span class="change-positive" data-astro-cid-y55gmoyq>↗️ +1</span> esta semana
</div> </div> <div class="stat-card" data-astro-cid-y55gmoyq> <div class="stat-header" data-astro-cid-y55gmoyq> <div class="stat-icon" data-astro-cid-y55gmoyq>💰</div> <div class="stat-title" data-astro-cid-y55gmoyq>Gastos Mensais</div> </div> <div class="stat-value" id="monthly-spend" data-astro-cid-y55gmoyq>R$ 0</div> <div class="stat-desc" data-astro-cid-y55gmoyq> <span class="change-negative" data-astro-cid-y55gmoyq>↗️ +15%</span> vs mês anterior
</div> </div> <div class="stat-card" data-astro-cid-y55gmoyq> <div class="stat-header" data-astro-cid-y55gmoyq> <div class="stat-icon" data-astro-cid-y55gmoyq>🎯</div> <div class="stat-title" data-astro-cid-y55gmoyq>Taxa de Sucesso</div> </div> <div class="stat-value" id="success-rate" data-astro-cid-y55gmoyq>0%</div> <div class="stat-desc" data-astro-cid-y55gmoyq>
Baseado em projetos concluídos
</div> </div> </div> <!-- Charts Section --> <div class="charts-section" data-astro-cid-y55gmoyq> <div class="chart-card" data-astro-cid-y55gmoyq> <div class="chart-header" data-astro-cid-y55gmoyq> <h3 data-astro-cid-y55gmoyq>Uso de Serviços (30 dias)</h3> <select id="usage-period" data-astro-cid-y55gmoyq> <option value="7" data-astro-cid-y55gmoyq>Últimos 7 dias</option> <option value="30" selected data-astro-cid-y55gmoyq>Últimos 30 dias</option> <option value="90" data-astro-cid-y55gmoyq>Últimos 90 dias</option> </select> </div> <div class="chart-container" data-astro-cid-y55gmoyq> <canvas id="usageChart" width="400" height="250" data-astro-cid-y55gmoyq></canvas> </div> </div> <div class="chart-card" data-astro-cid-y55gmoyq> <div class="chart-header" data-astro-cid-y55gmoyq> <h3 data-astro-cid-y55gmoyq>Projetos por Status</h3> <div class="chart-legend" data-astro-cid-y55gmoyq> <span class="legend-item active" data-astro-cid-y55gmoyq>🔵 Em Andamento</span> <span class="legend-item" data-astro-cid-y55gmoyq>🟡 Planejado</span> <span class="legend-item" data-astro-cid-y55gmoyq>🟢 Concluído</span> </div> </div> <div class="chart-container" data-astro-cid-y55gmoyq> <canvas id="projectsChart" width="400" height="250" data-astro-cid-y55gmoyq></canvas> </div> </div> </div> <!-- Recent Activity --> <div class="recent-activity" data-astro-cid-y55gmoyq> <div class="activity-header" data-astro-cid-y55gmoyq> <h3 data-astro-cid-y55gmoyq>Atividade Recente</h3> <a href="/dashboard/atividade" class="btn btn-outline" data-astro-cid-y55gmoyq>Ver Tudo</a> </div> <div id="activity-list" data-astro-cid-y55gmoyq> <!-- Activity items will be loaded here --> </div> </div> <!-- Services Overview --> <div class="services-section" data-astro-cid-y55gmoyq> <div class="services-header" data-astro-cid-y55gmoyq> <h3 data-astro-cid-y55gmoyq>Serviços Ativos</h3> <a href="/dashboard/servicos" class="btn btn-primary" data-astro-cid-y55gmoyq>Gerenciar Serviços</a> </div> <div class="services-grid" id="services-grid" data-astro-cid-y55gmoyq> <!-- Service cards will be loaded here --> </div> </div> </div> <script>
        const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000' : '/api-proxy';

        // Load dashboard data
        async function loadDashboardData() {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(\`\${API_URL}/api/dashboard\`, {
                    headers: { 'Authorization': token }
                });
                const data = await res.json();

                updateStats(data);
                loadCharts(data);
                loadActivity(data.recentActivity || []);
                loadServices(data.activeServices || []);

            } catch (e) {
                console.error('API Error, using fallback', e);
                loadMockData();
            }
        }

        function updateStats(data) {
            document.getElementById('active-projects').textContent = data.activeProjects || 0;
            document.getElementById('active-services').textContent = data.activeServices?.length || 0;
            document.getElementById('monthly-spend').textContent = 'R$ ' + (data.monthlySpend || 0).toLocaleString('pt-BR');
            document.getElementById('success-rate').textContent = (data.successRate || 0) + '%';
        }

        function loadCharts(data) {
            // Usage Chart
            const usageCtx = document.getElementById('usageChart').getContext('2d');
            const usageLabels = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'];
            const usageData = data.usageData || [45, 52, 38, 61];

            new Chart(usageCtx, {
                type: 'line',
                data: {
                    labels: usageLabels,
                    datasets: [{
                        label: 'Uso (%)',
                        data: usageData,
                        borderColor: '#00d4ff',
                        backgroundColor: 'rgba(0, 212, 255, 0.1)',
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: {
                            grid: { color: 'rgba(255, 255, 255, 0.05)' },
                            ticks: { color: '#94a3b8' }
                        },
                        x: {
                            grid: { display: false },
                            ticks: { color: '#94a3b8' }
                        }
                    }
                }
            });

            // Projects Chart
            const projectsCtx = document.getElementById('projectsChart').getContext('2d');
            const projectsData = data.projectsStatus || {
                andamento: 5,
                planejado: 3,
                concluido: 12
            };

            new Chart(projectsCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Em Andamento', 'Planejado', 'Concluído'],
                    datasets: [{
                        data: [projectsData.andamento, projectsData.planejado, projectsData.concluido],
                        backgroundColor: ['#00d4ff', '#fbbf24', '#00ff9d'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } }
                }
            });
        }

        function loadActivity(activities) {
            const activityList = document.getElementById('activity-list');

            if (activities.length === 0) {
                activityList.innerHTML = '<div style="text-align: center; padding: 2rem; color: #94a3b8;">Nenhuma atividade recente</div>';
                return;
            }

            activityList.innerHTML = activities.map(activity => \`
                <div class="activity-item">
                    <div class="activity-icon">\${activity.icon || '📝'}</div>
                    <div class="activity-content">
                        <h4>\${activity.title}</h4>
                        <p>\${activity.description}</p>
                    </div>
                    <div class="activity-time">\${activity.time || 'há pouco'}</div>
                </div>
            \`).join('');
        }

        function loadServices(services) {
            const servicesGrid = document.getElementById('services-grid');

            if (services.length === 0) {
                servicesGrid.innerHTML = '<div style="text-align: center; padding: 2rem; color: #94a3b8; grid-column: 1 / -1;">Nenhum serviço ativo</div>';
                return;
            }

            servicesGrid.innerHTML = services.map(service => \`
                <div class="service-card">
                    <div class="service-header">
                        <div class="service-icon">\${service.icon || '⚙️'}</div>
                        <div class="service-title">\${service.name}</div>
                        <div class="service-status status-\${service.status || 'active'}">\${service.status === 'active' ? 'Ativo' : 'Inativo'}</div>
                    </div>
                    <div class="service-desc">\${service.description}</div>
                    <div class="service-metrics">
                        <div class="metric">Uso: <strong>\${service.usage || 0}%</strong></div>
                        <div class="metric">Custo: <strong>R$ \${service.cost || 0}</strong></div>
                    </div>
                </div>
            \`).join('');
        }

        function loadMockData() {
            updateStats({
                activeProjects: 5,
                activeServices: [],
                monthlySpend: 299,
                successRate: 87
            });

            loadCharts({});
            loadActivity([
                { icon: '📁', title: 'Novo projeto criado', description: 'Projeto "Landing Page" foi iniciado', time: '2h atrás' },
                { icon: '⚙️', title: 'Serviço ativado', description: 'SEO Automation foi habilitado', time: '1d atrás' },
                { icon: '💰', title: 'Pagamento processado', description: 'Fatura de janeiro paga com sucesso', time: '3d atrás' }
            ]);

            loadServices([
                { name: 'SEO Automation', description: 'Otimização automática de SEO para seus sites', status: 'active', usage: 85, cost: 99, icon: '🔍' },
                { name: 'Analytics Pro', description: 'Relatórios avançados de analytics', status: 'active', usage: 72, cost: 149, icon: '📊' }
            ]);
        }

        // Action functions
        function createNewProject() {
            alert('Funcionalidade: Criar novo projeto\\nEm breve será implementada a interface completa para criação de projetos.');
        }

        function exploreServices() {
            window.location.href = '/dashboard/servicos/loja';
        }

        function viewAnalytics() {
            window.location.href = '/dashboard/analytics';
        }

        function getSupport() {
            window.location.href = '/dashboard/suporte';
        }

        // Initialize
        loadDashboardData();
    <\/script> `], ["  ", "  ", `<div style="padding: 2rem; max-width: 1400px; margin: 0 auto;" data-astro-cid-y55gmoyq> <!-- Welcome Header --> <div class="welcome-header" data-astro-cid-y55gmoyq> <h1 data-astro-cid-y55gmoyq>🚀 Bem-vindo ao GetNexo Pro</h1> <p data-astro-cid-y55gmoyq>Gerencie seus projetos, monitore serviços e maximize sua produtividade</p> </div> <!-- Quick Actions --> <div class="quick-actions" data-astro-cid-y55gmoyq> <div class="action-card primary" onclick="createNewProject()" data-astro-cid-y55gmoyq> <span class="action-icon" data-astro-cid-y55gmoyq>📁</span> <div class="action-title" data-astro-cid-y55gmoyq>Novo Projeto</div> <div class="action-desc" data-astro-cid-y55gmoyq>Comece um novo projeto do zero</div> </div> <div class="action-card success" onclick="exploreServices()" data-astro-cid-y55gmoyq> <span class="action-icon" data-astro-cid-y55gmoyq>🛒</span> <div class="action-title" data-astro-cid-y55gmoyq>Explorar Serviços</div> <div class="action-desc" data-astro-cid-y55gmoyq>Descubra novos serviços disponíveis</div> </div> <div class="action-card warning" onclick="viewAnalytics()" data-astro-cid-y55gmoyq> <span class="action-icon" data-astro-cid-y55gmoyq>📊</span> <div class="action-title" data-astro-cid-y55gmoyq>Ver Analytics</div> <div class="action-desc" data-astro-cid-y55gmoyq>Acompanhe seu desempenho</div> </div> <div class="action-card danger" onclick="getSupport()" data-astro-cid-y55gmoyq> <span class="action-icon" data-astro-cid-y55gmoyq>🆘</span> <div class="action-title" data-astro-cid-y55gmoyq>Suporte</div> <div class="action-desc" data-astro-cid-y55gmoyq>Precisa de ajuda? Estamos aqui</div> </div> </div> <!-- Stats Grid --> <div class="stats-grid" data-astro-cid-y55gmoyq> <div class="stat-card" data-astro-cid-y55gmoyq> <div class="stat-header" data-astro-cid-y55gmoyq> <div class="stat-icon" data-astro-cid-y55gmoyq>📁</div> <div class="stat-title" data-astro-cid-y55gmoyq>Projetos Ativos</div> </div> <div class="stat-value" id="active-projects" data-astro-cid-y55gmoyq>0</div> <div class="stat-desc" data-astro-cid-y55gmoyq> <span class="change-positive" data-astro-cid-y55gmoyq>↗️ +2</span> este mês
</div> </div> <div class="stat-card" data-astro-cid-y55gmoyq> <div class="stat-header" data-astro-cid-y55gmoyq> <div class="stat-icon" data-astro-cid-y55gmoyq>⚙️</div> <div class="stat-title" data-astro-cid-y55gmoyq>Serviços Ativos</div> </div> <div class="stat-value" id="active-services" data-astro-cid-y55gmoyq>0</div> <div class="stat-desc" data-astro-cid-y55gmoyq> <span class="change-positive" data-astro-cid-y55gmoyq>↗️ +1</span> esta semana
</div> </div> <div class="stat-card" data-astro-cid-y55gmoyq> <div class="stat-header" data-astro-cid-y55gmoyq> <div class="stat-icon" data-astro-cid-y55gmoyq>💰</div> <div class="stat-title" data-astro-cid-y55gmoyq>Gastos Mensais</div> </div> <div class="stat-value" id="monthly-spend" data-astro-cid-y55gmoyq>R$ 0</div> <div class="stat-desc" data-astro-cid-y55gmoyq> <span class="change-negative" data-astro-cid-y55gmoyq>↗️ +15%</span> vs mês anterior
</div> </div> <div class="stat-card" data-astro-cid-y55gmoyq> <div class="stat-header" data-astro-cid-y55gmoyq> <div class="stat-icon" data-astro-cid-y55gmoyq>🎯</div> <div class="stat-title" data-astro-cid-y55gmoyq>Taxa de Sucesso</div> </div> <div class="stat-value" id="success-rate" data-astro-cid-y55gmoyq>0%</div> <div class="stat-desc" data-astro-cid-y55gmoyq>
Baseado em projetos concluídos
</div> </div> </div> <!-- Charts Section --> <div class="charts-section" data-astro-cid-y55gmoyq> <div class="chart-card" data-astro-cid-y55gmoyq> <div class="chart-header" data-astro-cid-y55gmoyq> <h3 data-astro-cid-y55gmoyq>Uso de Serviços (30 dias)</h3> <select id="usage-period" data-astro-cid-y55gmoyq> <option value="7" data-astro-cid-y55gmoyq>Últimos 7 dias</option> <option value="30" selected data-astro-cid-y55gmoyq>Últimos 30 dias</option> <option value="90" data-astro-cid-y55gmoyq>Últimos 90 dias</option> </select> </div> <div class="chart-container" data-astro-cid-y55gmoyq> <canvas id="usageChart" width="400" height="250" data-astro-cid-y55gmoyq></canvas> </div> </div> <div class="chart-card" data-astro-cid-y55gmoyq> <div class="chart-header" data-astro-cid-y55gmoyq> <h3 data-astro-cid-y55gmoyq>Projetos por Status</h3> <div class="chart-legend" data-astro-cid-y55gmoyq> <span class="legend-item active" data-astro-cid-y55gmoyq>🔵 Em Andamento</span> <span class="legend-item" data-astro-cid-y55gmoyq>🟡 Planejado</span> <span class="legend-item" data-astro-cid-y55gmoyq>🟢 Concluído</span> </div> </div> <div class="chart-container" data-astro-cid-y55gmoyq> <canvas id="projectsChart" width="400" height="250" data-astro-cid-y55gmoyq></canvas> </div> </div> </div> <!-- Recent Activity --> <div class="recent-activity" data-astro-cid-y55gmoyq> <div class="activity-header" data-astro-cid-y55gmoyq> <h3 data-astro-cid-y55gmoyq>Atividade Recente</h3> <a href="/dashboard/atividade" class="btn btn-outline" data-astro-cid-y55gmoyq>Ver Tudo</a> </div> <div id="activity-list" data-astro-cid-y55gmoyq> <!-- Activity items will be loaded here --> </div> </div> <!-- Services Overview --> <div class="services-section" data-astro-cid-y55gmoyq> <div class="services-header" data-astro-cid-y55gmoyq> <h3 data-astro-cid-y55gmoyq>Serviços Ativos</h3> <a href="/dashboard/servicos" class="btn btn-primary" data-astro-cid-y55gmoyq>Gerenciar Serviços</a> </div> <div class="services-grid" id="services-grid" data-astro-cid-y55gmoyq> <!-- Service cards will be loaded here --> </div> </div> </div> <script>
        const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000' : '/api-proxy';

        // Load dashboard data
        async function loadDashboardData() {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(\\\`\\\${API_URL}/api/dashboard\\\`, {
                    headers: { 'Authorization': token }
                });
                const data = await res.json();

                updateStats(data);
                loadCharts(data);
                loadActivity(data.recentActivity || []);
                loadServices(data.activeServices || []);

            } catch (e) {
                console.error('API Error, using fallback', e);
                loadMockData();
            }
        }

        function updateStats(data) {
            document.getElementById('active-projects').textContent = data.activeProjects || 0;
            document.getElementById('active-services').textContent = data.activeServices?.length || 0;
            document.getElementById('monthly-spend').textContent = 'R$ ' + (data.monthlySpend || 0).toLocaleString('pt-BR');
            document.getElementById('success-rate').textContent = (data.successRate || 0) + '%';
        }

        function loadCharts(data) {
            // Usage Chart
            const usageCtx = document.getElementById('usageChart').getContext('2d');
            const usageLabels = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'];
            const usageData = data.usageData || [45, 52, 38, 61];

            new Chart(usageCtx, {
                type: 'line',
                data: {
                    labels: usageLabels,
                    datasets: [{
                        label: 'Uso (%)',
                        data: usageData,
                        borderColor: '#00d4ff',
                        backgroundColor: 'rgba(0, 212, 255, 0.1)',
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: {
                            grid: { color: 'rgba(255, 255, 255, 0.05)' },
                            ticks: { color: '#94a3b8' }
                        },
                        x: {
                            grid: { display: false },
                            ticks: { color: '#94a3b8' }
                        }
                    }
                }
            });

            // Projects Chart
            const projectsCtx = document.getElementById('projectsChart').getContext('2d');
            const projectsData = data.projectsStatus || {
                andamento: 5,
                planejado: 3,
                concluido: 12
            };

            new Chart(projectsCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Em Andamento', 'Planejado', 'Concluído'],
                    datasets: [{
                        data: [projectsData.andamento, projectsData.planejado, projectsData.concluido],
                        backgroundColor: ['#00d4ff', '#fbbf24', '#00ff9d'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } }
                }
            });
        }

        function loadActivity(activities) {
            const activityList = document.getElementById('activity-list');

            if (activities.length === 0) {
                activityList.innerHTML = '<div style="text-align: center; padding: 2rem; color: #94a3b8;">Nenhuma atividade recente</div>';
                return;
            }

            activityList.innerHTML = activities.map(activity => \\\`
                <div class="activity-item">
                    <div class="activity-icon">\\\${activity.icon || '📝'}</div>
                    <div class="activity-content">
                        <h4>\\\${activity.title}</h4>
                        <p>\\\${activity.description}</p>
                    </div>
                    <div class="activity-time">\\\${activity.time || 'há pouco'}</div>
                </div>
            \\\`).join('');
        }

        function loadServices(services) {
            const servicesGrid = document.getElementById('services-grid');

            if (services.length === 0) {
                servicesGrid.innerHTML = '<div style="text-align: center; padding: 2rem; color: #94a3b8; grid-column: 1 / -1;">Nenhum serviço ativo</div>';
                return;
            }

            servicesGrid.innerHTML = services.map(service => \\\`
                <div class="service-card">
                    <div class="service-header">
                        <div class="service-icon">\\\${service.icon || '⚙️'}</div>
                        <div class="service-title">\\\${service.name}</div>
                        <div class="service-status status-\\\${service.status || 'active'}">\\\${service.status === 'active' ? 'Ativo' : 'Inativo'}</div>
                    </div>
                    <div class="service-desc">\\\${service.description}</div>
                    <div class="service-metrics">
                        <div class="metric">Uso: <strong>\\\${service.usage || 0}%</strong></div>
                        <div class="metric">Custo: <strong>R$ \\\${service.cost || 0}</strong></div>
                    </div>
                </div>
            \\\`).join('');
        }

        function loadMockData() {
            updateStats({
                activeProjects: 5,
                activeServices: [],
                monthlySpend: 299,
                successRate: 87
            });

            loadCharts({});
            loadActivity([
                { icon: '📁', title: 'Novo projeto criado', description: 'Projeto "Landing Page" foi iniciado', time: '2h atrás' },
                { icon: '⚙️', title: 'Serviço ativado', description: 'SEO Automation foi habilitado', time: '1d atrás' },
                { icon: '💰', title: 'Pagamento processado', description: 'Fatura de janeiro paga com sucesso', time: '3d atrás' }
            ]);

            loadServices([
                { name: 'SEO Automation', description: 'Otimização automática de SEO para seus sites', status: 'active', usage: 85, cost: 99, icon: '🔍' },
                { name: 'Analytics Pro', description: 'Relatórios avançados de analytics', status: 'active', usage: 72, cost: 149, icon: '📊' }
            ]);
        }

        // Action functions
        function createNewProject() {
            alert('Funcionalidade: Criar novo projeto\\\\nEm breve será implementada a interface completa para criação de projetos.');
        }

        function exploreServices() {
            window.location.href = '/dashboard/servicos/loja';
        }

        function viewAnalytics() {
            window.location.href = '/dashboard/analytics';
        }

        function getSupport() {
            window.location.href = '/dashboard/suporte';
        }

        // Initialize
        loadDashboardData();
    <\/script> `])), renderScript($$result2, "/home/lele/usenexo/getnexo-site/src/pages/dashboard/index.astro?astro&type=script&index=0&lang.ts"), maybeRenderHead()) })}`;
}, "/home/lele/usenexo/getnexo-site/src/pages/dashboard/index.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/dashboard/index.astro";
const $$url = "/dashboard";
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
