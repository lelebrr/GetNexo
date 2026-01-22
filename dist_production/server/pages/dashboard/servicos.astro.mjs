import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, l as renderScript } from "../../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$ClientLayout } from "../../assets/ClientLayout-Cg0S0bz6.js";
/* empty css                                   */
import { renderers } from "../../renderers.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "ClientLayout", $$ClientLayout, { "title": "Serviços - GetNexo Pro", "data-astro-cid-is5kimha": true }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template(["  ", "  ", `<div style="padding: 2rem; max-width: 1400px; margin: 0 auto;" data-astro-cid-is5kimha> <!-- Header --> <div class="services-header" data-astro-cid-is5kimha> <h1 data-astro-cid-is5kimha>⚙️ Meus Serviços</h1> <p data-astro-cid-is5kimha>Gerencie e monitore todos os seus serviços ativos</p> </div> <!-- Service Metrics Dashboard --> <div class="metrics-dashboard" data-astro-cid-is5kimha> <div class="metrics-grid" data-astro-cid-is5kimha> <div class="metric-card" data-astro-cid-is5kimha> <div class="metric-header" data-astro-cid-is5kimha> <div class="metric-icon" data-astro-cid-is5kimha>⚙️</div> <div class="metric-title" data-astro-cid-is5kimha>Serviços Ativos</div> </div> <div class="metric-value" id="active-services-count" data-astro-cid-is5kimha>0</div> <div class="metric-desc" data-astro-cid-is5kimha> <span class="change-positive" data-astro-cid-is5kimha>↗️ +2</span> este mês
</div> </div> <div class="metric-card" data-astro-cid-is5kimha> <div class="metric-header" data-astro-cid-is5kimha> <div class="metric-icon" data-astro-cid-is5kimha>💰</div> <div class="metric-title" data-astro-cid-is5kimha>Gasto Mensal</div> </div> <div class="metric-value" id="monthly-spend" data-astro-cid-is5kimha>R$ 0</div> <div class="metric-desc" data-astro-cid-is5kimha> <span class="change-negative" data-astro-cid-is5kimha>↗️ +8%</span> vs mês anterior
</div> </div> <div class="metric-card" data-astro-cid-is5kimha> <div class="metric-header" data-astro-cid-is5kimha> <div class="metric-icon" data-astro-cid-is5kimha>📈</div> <div class="metric-title" data-astro-cid-is5kimha>Uso Médio</div> </div> <div class="metric-value" id="average-usage" data-astro-cid-is5kimha>0%</div> <div class="metric-desc" data-astro-cid-is5kimha> <span class="change-positive" data-astro-cid-is5kimha>↗️ +5%</span> vs semana anterior
</div> </div> <div class="metric-card" data-astro-cid-is5kimha> <div class="metric-header" data-astro-cid-is5kimha> <div class="metric-icon" data-astro-cid-is5kimha>⏱️</div> <div class="metric-title" data-astro-cid-is5kimha>Uptime Médio</div> </div> <div class="metric-value" id="average-uptime" data-astro-cid-is5kimha>99.9%</div> <div class="metric-desc" data-astro-cid-is5kimha> <span class="change-positive" data-astro-cid-is5kimha>↗️ +0.1%</span> este mês
</div> </div> </div> <!-- Usage Chart --> <div class="usage-chart-section" data-astro-cid-is5kimha> <div class="chart-header" data-astro-cid-is5kimha> <h3 data-astro-cid-is5kimha>Uso de Serviços - Últimos 7 dias</h3> <select id="usage-period" onchange="updateUsageChart()" data-astro-cid-is5kimha> <option value="7" data-astro-cid-is5kimha>7 dias</option> <option value="30" data-astro-cid-is5kimha>30 dias</option> <option value="90" data-astro-cid-is5kimha>90 dias</option> </select> </div> <div class="chart-container" data-astro-cid-is5kimha> <canvas id="servicesUsageChart" width="400" height="200" data-astro-cid-is5kimha></canvas> </div> </div> </div> <!-- Tabs --> <div class="tabs" data-astro-cid-is5kimha> <div class="tab active" onclick="showTab('active')" data-astro-cid-is5kimha>Ativos <span class="tab-count" id="active-tab-count" data-astro-cid-is5kimha>(0)</span></div> <div class="tab" onclick="showTab('available')" data-astro-cid-is5kimha>Disponíveis <span class="tab-count" id="available-tab-count" data-astro-cid-is5kimha>(0)</span></div> <div class="tab" onclick="showTab('history')" data-astro-cid-is5kimha>Histórico <span class="tab-count" id="history-tab-count" data-astro-cid-is5kimha>(0)</span></div> <div class="tab" onclick="showTab('analytics')" data-astro-cid-is5kimha>Analytics</div> </div> <!-- Actions --> <div class="services-actions" data-astro-cid-is5kimha> <div data-astro-cid-is5kimha> <h2 style="color: white; margin: 0;" id="current-tab-title" data-astro-cid-is5kimha>Serviços Ativos</h2> <p style="color: #94a3b8; margin: 0.5rem 0 0 0;" data-astro-cid-is5kimha>Total de serviços: <span id="total-services" data-astro-cid-is5kimha>0</span></p> </div> <div style="display: flex; gap: 1rem;" data-astro-cid-is5kimha> <a href="/dashboard/servicos/loja" class="btn btn-outline" data-astro-cid-is5kimha>Loja de Serviços</a> <a href="/dashboard/servicos/historico" class="btn btn-primary" id="history-btn" data-astro-cid-is5kimha>Ver Histórico</a> </div> </div> <!-- Services Grid --> <div class="services-grid" id="services-grid" data-astro-cid-is5kimha> <!-- Services will be loaded here --> </div> <!-- Analytics Tab Content (hidden by default) --> <div class="analytics-content" id="analytics-content" style="display: none;" data-astro-cid-is5kimha> <div class="analytics-grid" data-astro-cid-is5kimha> <div class="analytics-card" data-astro-cid-is5kimha> <h4 data-astro-cid-is5kimha>📊 Performance por Serviço</h4> <div class="performance-list" id="performance-list" data-astro-cid-is5kimha> <!-- Performance metrics will be loaded here --> </div> </div> <div class="analytics-card" data-astro-cid-is5kimha> <h4 data-astro-cid-is5kimha>💡 Recomendações</h4> <div class="recommendations-list" id="recommendations-list" data-astro-cid-is5kimha> <!-- Recommendations will be loaded here --> </div> </div> </div> </div> </div> <script>
        const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000' : '/api-proxy';
        let currentTab = 'active';
        let servicesUsageChart;

        // Load all service data
        async function loadServicesData() {
            try {
                const token = localStorage.getItem('token');

                // Load metrics
                const metricsRes = await fetch(\`\${API_URL}/api/services/metrics\`, {
                    headers: { 'Authorization': token }
                });
                const metrics = await metricsRes.json();
                updateMetrics(metrics);

                // Load services for current tab
                await loadServices(currentTab);

                // Load usage chart
                loadUsageChart();

            } catch (e) {
                console.error('Error loading services data, using mock data', e);
                loadMockServicesData();
            }
        }

        async function loadServices(tab = 'active') {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(\`\${API_URL}/api/services?tab=\${tab}\`, {
                    headers: { 'Authorization': token }
                });
                const services = await res.json();
                renderServices(services, tab);
                updateTabCounts(services, tab);
            } catch (e) {
                console.error('Error loading services, using mock data', e);
                loadMockServices(tab);
            }
        }

        function updateMetrics(metrics) {
            document.getElementById('active-services-count').textContent = metrics.activeServices || 0;
            document.getElementById('monthly-spend').textContent = 'R$ ' + (metrics.monthlySpend || 0).toFixed(2).replace('.', ',');
            document.getElementById('average-usage').textContent = (metrics.averageUsage || 0) + '%';
            document.getElementById('average-uptime').textContent = (metrics.averageUptime || 99.9) + '%';
        }

        function loadUsageChart() {
            const ctx = document.getElementById('servicesUsageChart').getContext('2d');

            if (servicesUsageChart) {
                servicesUsageChart.destroy();
            }

            const labels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
            const data = [65, 72, 68, 75, 82, 78, 85];

            servicesUsageChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Uso Médio (%)',
                        data: data,
                        borderColor: '#00d4ff',
                        backgroundColor: 'rgba(0, 212, 255, 0.1)',
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true,
                        pointBackgroundColor: '#00d4ff',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 6,
                        pointHoverRadius: 8
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
        }

        function renderServices(services, tab) {
            const grid = document.getElementById('services-grid');
            const total = document.getElementById('total-services');
            const title = document.getElementById('current-tab-title');

            total.textContent = services.length;

            // Update title
            const titles = {
                'active': 'Serviços Ativos',
                'available': 'Serviços Disponíveis',
                'history': 'Histórico de Serviços',
                'analytics': 'Analytics de Serviços'
            };
            title.textContent = titles[tab] || 'Serviços';

            if (tab === 'analytics') {
                showAnalyticsContent();
                return;
            }

            hideAnalyticsContent();

            if (services.length === 0) {
                let emptyMessage = '';
                if (tab === 'active') {
                    emptyMessage = \`
                        <h3>🚀 Explore nossos serviços</h3>
                        <p>Você ainda não tem serviços ativos. Que tal conhecer nossas opções?</p>
                        <a href="/dashboard/servicos/loja" class="btn btn-primary" style="margin-top: 1rem;">Ir para Loja</a>
                    \`;
                } else if (tab === 'available') {
                    emptyMessage = \`
                        <h3>📦 Serviços disponíveis</h3>
                        <p>Carregando serviços disponíveis...</p>
                    \`;
                } else {
                    emptyMessage = \`
                        <h3>📚 Histórico vazio</h3>
                        <p>Você ainda não utilizou nenhum serviço.</p>
                    \`;
                }

                grid.innerHTML = \`<div class="empty-state">\${emptyMessage}</div>\`;
                return;
            }

            grid.innerHTML = services.map(service => \`
                <div class="service-card">
                    <div class="service-header">
                        <div class="service-icon">\${service.icon || '⚙️'}</div>
                        <div class="service-title">\${service.name}</div>
                        <div class="service-status status-\${service.status}">\${getStatusText(service.status)}</div>
                    </div>
                    <div class="service-desc">\${service.description}</div>
                    <div class="service-metrics">
                        <div class="metric">Uso: <strong>\${service.usage || 0}%</strong></div>
                        <div class="metric">Custo: <strong>R$ \${service.cost || 0}</strong></div>
                        <div class="metric">\${tab === 'history' ? 'Período' : 'Desde'}: <strong>\${service.period || service.since || 'N/A'}</strong></div>
                        \${tab === 'active' ? \`<div class="metric">Uptime: <strong>\${service.uptime || 99.9}%</strong></div>\` : ''}
                    </div>
                    <div class="service-actions">
                        \${tab === 'active' ? \`
                            <button class="btn btn-outline" onclick="configureService('\${service.id}')">Configurar</button>
                            <button class="btn btn-outline" onclick="viewLogs('\${service.id}')">Logs</button>
                            <button class="btn btn-danger" onclick="stopService('\${service.id}')">Parar</button>
                        \` : tab === 'available' ? \`
                            <button class="btn btn-primary" onclick="activateService('\${service.id}')">Ativar</button>
                            <button class="btn btn-outline" onclick="viewDetails('\${service.id}')">Detalhes</button>
                        \` : \`
                            <button class="btn btn-outline" onclick="viewServiceHistory('\${service.id}')">Detalhes</button>
                            <button class="btn btn-outline" onclick="reactivateService('\${service.id}')">Reativar</button>
                        \`}
                    </div>
                </div>
            \`).join('');
        }

        function updateTabCounts(services, tab) {
            const counts = {
                active: services.filter(s => s.status === 'active').length,
                available: services.filter(s => s.status === 'available').length,
                history: services.filter(s => s.status === 'completed').length
            };

            document.getElementById('active-tab-count').textContent = \`(\${counts.active})\`;
            document.getElementById('available-tab-count').textContent = \`(\${counts.available})\`;
            document.getElementById('history-tab-count').textContent = \`(\${counts.history})\`;
        }

        function showAnalyticsContent() {
            const grid = document.getElementById('services-grid');
            const analytics = document.getElementById('analytics-content');

            grid.style.display = 'none';
            analytics.style.display = 'block';

            // Load analytics data
            loadPerformanceMetrics();
            loadRecommendations();
        }

        function hideAnalyticsContent() {
            const grid = document.getElementById('services-grid');
            const analytics = document.getElementById('analytics-content');

            grid.style.display = 'grid';
            analytics.style.display = 'none';
        }

        function loadPerformanceMetrics() {
            const performanceList = document.getElementById('performance-list');
            const mockPerformance = [
                { name: 'SEO Automation', usage: 85, uptime: 99.8, responseTime: 245 },
                { name: 'Analytics Pro', usage: 72, uptime: 99.9, responseTime: 189 },
                { name: 'Chatbot IA', usage: 45, uptime: 99.7, responseTime: 312 }
            ];

            performanceList.innerHTML = mockPerformance.map(item => \`
                <div class="performance-item">
                    <div class="service-icon">\${item.name === 'SEO Automation' ? '🔍' : item.name === 'Analytics Pro' ? '📊' : '🤖'}</div>
                    <div>
                        <div style="color: white; font-weight: 600;">\${item.name}</div>
                        <div style="color: #94a3b8; font-size: 0.8rem;">Performance metrics</div>
                    </div>
                    <div class="performance-metrics">
                        <div class="metric">Uso: <strong>\${item.usage}%</strong></div>
                        <div class="metric">Uptime: <strong>\${item.uptime}%</strong></div>
                        <div class="metric">Resp: <strong>\${item.responseTime}ms</strong></div>
                    </div>
                </div>
            \`).join('');
        }

        function loadRecommendations() {
            const recommendationsList = document.getElementById('recommendations-list');
            const mockRecommendations = [
                { icon: '⚡', title: 'Otimizar SEO Automation', desc: 'Uso abaixo do ideal, considere ajustar configurações' },
                { icon: '💰', title: 'Plano Chatbot', desc: 'Upgrade pode melhorar performance em 40%' },
                { icon: '🔧', title: 'Manutenção Analytics', desc: 'Atualização disponível para melhor estabilidade' }
            ];

            recommendationsList.innerHTML = mockRecommendations.map(rec => \`
                <div class="recommendation-item">
                    <div class="service-icon">\${rec.icon}</div>
                    <div>
                        <div style="color: white; font-weight: 600;">\${rec.title}</div>
                        <div style="color: #94a3b8; font-size: 0.8rem;">\${rec.desc}</div>
                    </div>
                    <button class="btn btn-outline" style="margin-left: auto;">Aplicar</button>
                </div>
            \`).join('');
        }

        function getStatusText(status) {
            const statuses = {
                'active': 'Ativo',
                'inactive': 'Inativo',
                'paused': 'Pausado',
                'available': 'Disponível',
                'completed': 'Concluído'
            };
            return statuses[status] || 'Ativo';
        }

        function loadMockServicesData() {
            updateMetrics({
                activeServices: 3,
                monthlySpend: 247,
                averageUsage: 67,
                averageUptime: 99.8
            });

            loadUsageChart();
            loadMockServices('active');
        }

        function loadMockServices(tab) {
            let mockServices = [];

            if (tab === 'active') {
                mockServices = [
                    {
                        id: '1',
                        name: 'SEO Automation',
                        description: 'Otimização automática de SEO para seus sites',
                        status: 'active',
                        usage: 85,
                        cost: 99,
                        since: 'Jan 2026',
                        uptime: 99.8,
                        icon: '🔍'
                    },
                    {
                        id: '2',
                        name: 'Analytics Pro',
                        description: 'Relatórios avançados de analytics',
                        status: 'active',
                        usage: 72,
                        cost: 149,
                        since: 'Dez 2025',
                        uptime: 99.9,
                        icon: '📊'
                    }
                ];
            } else if (tab === 'available') {
                mockServices = [
                    {
                        id: '3',
                        name: 'Chatbot IA',
                        description: 'Assistente virtual inteligente para atendimento',
                        status: 'available',
                        cost: 79,
                        icon: '🤖'
                    },
                    {
                        id: '4',
                        name: 'Email Marketing',
                        description: 'Campanhas de email automatizadas',
                        status: 'available',
                        cost: 59,
                        icon: '📧'
                    }
                ];
            } else {
                mockServices = [
                    {
                        id: '5',
                        name: 'Backup Cloud',
                        description: 'Serviço de backup em nuvem',
                        status: 'completed',
                        cost: 29,
                        period: 'Nov-Dez 2025',
                        icon: '☁️'
                    }
                ];
            }

            renderServices(mockServices, tab);
            updateTabCounts(mockServices, tab);
        }

        function showTab(tab) {
            currentTab = tab;
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            event.target.classList.add('active');

            const historyBtn = document.getElementById('history-btn');
            if (tab === 'history') {
                historyBtn.style.display = 'none';
            } else {
                historyBtn.style.display = 'inline-block';
            }

            loadServices(tab);
        }

        function updateUsageChart() {
            // Refresh usage chart with new period
            loadUsageChart();
        }

        function configureService(serviceId) {
            window.location.href = \`/dashboard/servicos/\${serviceId}/config\`;
        }

        function viewLogs(serviceId) {
            window.open(\`/dashboard/servicos/\${serviceId}/logs\`, '_blank');
        }

        function stopService(serviceId) {
            if (confirm('Tem certeza que deseja parar este serviço?')) {
                alert('Serviço parado com sucesso!');
                loadServices(currentTab);
            }
        }

        function activateService(serviceId) {
            alert('Serviço ativado com sucesso!');
            loadServices(currentTab);
        }

        function viewDetails(serviceId) {
            window.location.href = \`/dashboard/servicos/loja/\${serviceId}\`;
        }

        function viewServiceHistory(serviceId) {
            window.location.href = \`/dashboard/servicos/historico/\${serviceId}\`;
        }

        function reactivateService(serviceId) {
            if (confirm('Deseja reativar este serviço?')) {
                alert('Serviço reativado com sucesso!');
                loadServices(currentTab);
            }
        }

        // Initialize
        loadServicesData();
    <\/script> `], ["  ", "  ", `<div style="padding: 2rem; max-width: 1400px; margin: 0 auto;" data-astro-cid-is5kimha> <!-- Header --> <div class="services-header" data-astro-cid-is5kimha> <h1 data-astro-cid-is5kimha>⚙️ Meus Serviços</h1> <p data-astro-cid-is5kimha>Gerencie e monitore todos os seus serviços ativos</p> </div> <!-- Service Metrics Dashboard --> <div class="metrics-dashboard" data-astro-cid-is5kimha> <div class="metrics-grid" data-astro-cid-is5kimha> <div class="metric-card" data-astro-cid-is5kimha> <div class="metric-header" data-astro-cid-is5kimha> <div class="metric-icon" data-astro-cid-is5kimha>⚙️</div> <div class="metric-title" data-astro-cid-is5kimha>Serviços Ativos</div> </div> <div class="metric-value" id="active-services-count" data-astro-cid-is5kimha>0</div> <div class="metric-desc" data-astro-cid-is5kimha> <span class="change-positive" data-astro-cid-is5kimha>↗️ +2</span> este mês
</div> </div> <div class="metric-card" data-astro-cid-is5kimha> <div class="metric-header" data-astro-cid-is5kimha> <div class="metric-icon" data-astro-cid-is5kimha>💰</div> <div class="metric-title" data-astro-cid-is5kimha>Gasto Mensal</div> </div> <div class="metric-value" id="monthly-spend" data-astro-cid-is5kimha>R$ 0</div> <div class="metric-desc" data-astro-cid-is5kimha> <span class="change-negative" data-astro-cid-is5kimha>↗️ +8%</span> vs mês anterior
</div> </div> <div class="metric-card" data-astro-cid-is5kimha> <div class="metric-header" data-astro-cid-is5kimha> <div class="metric-icon" data-astro-cid-is5kimha>📈</div> <div class="metric-title" data-astro-cid-is5kimha>Uso Médio</div> </div> <div class="metric-value" id="average-usage" data-astro-cid-is5kimha>0%</div> <div class="metric-desc" data-astro-cid-is5kimha> <span class="change-positive" data-astro-cid-is5kimha>↗️ +5%</span> vs semana anterior
</div> </div> <div class="metric-card" data-astro-cid-is5kimha> <div class="metric-header" data-astro-cid-is5kimha> <div class="metric-icon" data-astro-cid-is5kimha>⏱️</div> <div class="metric-title" data-astro-cid-is5kimha>Uptime Médio</div> </div> <div class="metric-value" id="average-uptime" data-astro-cid-is5kimha>99.9%</div> <div class="metric-desc" data-astro-cid-is5kimha> <span class="change-positive" data-astro-cid-is5kimha>↗️ +0.1%</span> este mês
</div> </div> </div> <!-- Usage Chart --> <div class="usage-chart-section" data-astro-cid-is5kimha> <div class="chart-header" data-astro-cid-is5kimha> <h3 data-astro-cid-is5kimha>Uso de Serviços - Últimos 7 dias</h3> <select id="usage-period" onchange="updateUsageChart()" data-astro-cid-is5kimha> <option value="7" data-astro-cid-is5kimha>7 dias</option> <option value="30" data-astro-cid-is5kimha>30 dias</option> <option value="90" data-astro-cid-is5kimha>90 dias</option> </select> </div> <div class="chart-container" data-astro-cid-is5kimha> <canvas id="servicesUsageChart" width="400" height="200" data-astro-cid-is5kimha></canvas> </div> </div> </div> <!-- Tabs --> <div class="tabs" data-astro-cid-is5kimha> <div class="tab active" onclick="showTab('active')" data-astro-cid-is5kimha>Ativos <span class="tab-count" id="active-tab-count" data-astro-cid-is5kimha>(0)</span></div> <div class="tab" onclick="showTab('available')" data-astro-cid-is5kimha>Disponíveis <span class="tab-count" id="available-tab-count" data-astro-cid-is5kimha>(0)</span></div> <div class="tab" onclick="showTab('history')" data-astro-cid-is5kimha>Histórico <span class="tab-count" id="history-tab-count" data-astro-cid-is5kimha>(0)</span></div> <div class="tab" onclick="showTab('analytics')" data-astro-cid-is5kimha>Analytics</div> </div> <!-- Actions --> <div class="services-actions" data-astro-cid-is5kimha> <div data-astro-cid-is5kimha> <h2 style="color: white; margin: 0;" id="current-tab-title" data-astro-cid-is5kimha>Serviços Ativos</h2> <p style="color: #94a3b8; margin: 0.5rem 0 0 0;" data-astro-cid-is5kimha>Total de serviços: <span id="total-services" data-astro-cid-is5kimha>0</span></p> </div> <div style="display: flex; gap: 1rem;" data-astro-cid-is5kimha> <a href="/dashboard/servicos/loja" class="btn btn-outline" data-astro-cid-is5kimha>Loja de Serviços</a> <a href="/dashboard/servicos/historico" class="btn btn-primary" id="history-btn" data-astro-cid-is5kimha>Ver Histórico</a> </div> </div> <!-- Services Grid --> <div class="services-grid" id="services-grid" data-astro-cid-is5kimha> <!-- Services will be loaded here --> </div> <!-- Analytics Tab Content (hidden by default) --> <div class="analytics-content" id="analytics-content" style="display: none;" data-astro-cid-is5kimha> <div class="analytics-grid" data-astro-cid-is5kimha> <div class="analytics-card" data-astro-cid-is5kimha> <h4 data-astro-cid-is5kimha>📊 Performance por Serviço</h4> <div class="performance-list" id="performance-list" data-astro-cid-is5kimha> <!-- Performance metrics will be loaded here --> </div> </div> <div class="analytics-card" data-astro-cid-is5kimha> <h4 data-astro-cid-is5kimha>💡 Recomendações</h4> <div class="recommendations-list" id="recommendations-list" data-astro-cid-is5kimha> <!-- Recommendations will be loaded here --> </div> </div> </div> </div> </div> <script>
        const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000' : '/api-proxy';
        let currentTab = 'active';
        let servicesUsageChart;

        // Load all service data
        async function loadServicesData() {
            try {
                const token = localStorage.getItem('token');

                // Load metrics
                const metricsRes = await fetch(\\\`\\\${API_URL}/api/services/metrics\\\`, {
                    headers: { 'Authorization': token }
                });
                const metrics = await metricsRes.json();
                updateMetrics(metrics);

                // Load services for current tab
                await loadServices(currentTab);

                // Load usage chart
                loadUsageChart();

            } catch (e) {
                console.error('Error loading services data, using mock data', e);
                loadMockServicesData();
            }
        }

        async function loadServices(tab = 'active') {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(\\\`\\\${API_URL}/api/services?tab=\\\${tab}\\\`, {
                    headers: { 'Authorization': token }
                });
                const services = await res.json();
                renderServices(services, tab);
                updateTabCounts(services, tab);
            } catch (e) {
                console.error('Error loading services, using mock data', e);
                loadMockServices(tab);
            }
        }

        function updateMetrics(metrics) {
            document.getElementById('active-services-count').textContent = metrics.activeServices || 0;
            document.getElementById('monthly-spend').textContent = 'R$ ' + (metrics.monthlySpend || 0).toFixed(2).replace('.', ',');
            document.getElementById('average-usage').textContent = (metrics.averageUsage || 0) + '%';
            document.getElementById('average-uptime').textContent = (metrics.averageUptime || 99.9) + '%';
        }

        function loadUsageChart() {
            const ctx = document.getElementById('servicesUsageChart').getContext('2d');

            if (servicesUsageChart) {
                servicesUsageChart.destroy();
            }

            const labels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
            const data = [65, 72, 68, 75, 82, 78, 85];

            servicesUsageChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Uso Médio (%)',
                        data: data,
                        borderColor: '#00d4ff',
                        backgroundColor: 'rgba(0, 212, 255, 0.1)',
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true,
                        pointBackgroundColor: '#00d4ff',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 6,
                        pointHoverRadius: 8
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
        }

        function renderServices(services, tab) {
            const grid = document.getElementById('services-grid');
            const total = document.getElementById('total-services');
            const title = document.getElementById('current-tab-title');

            total.textContent = services.length;

            // Update title
            const titles = {
                'active': 'Serviços Ativos',
                'available': 'Serviços Disponíveis',
                'history': 'Histórico de Serviços',
                'analytics': 'Analytics de Serviços'
            };
            title.textContent = titles[tab] || 'Serviços';

            if (tab === 'analytics') {
                showAnalyticsContent();
                return;
            }

            hideAnalyticsContent();

            if (services.length === 0) {
                let emptyMessage = '';
                if (tab === 'active') {
                    emptyMessage = \\\`
                        <h3>🚀 Explore nossos serviços</h3>
                        <p>Você ainda não tem serviços ativos. Que tal conhecer nossas opções?</p>
                        <a href="/dashboard/servicos/loja" class="btn btn-primary" style="margin-top: 1rem;">Ir para Loja</a>
                    \\\`;
                } else if (tab === 'available') {
                    emptyMessage = \\\`
                        <h3>📦 Serviços disponíveis</h3>
                        <p>Carregando serviços disponíveis...</p>
                    \\\`;
                } else {
                    emptyMessage = \\\`
                        <h3>📚 Histórico vazio</h3>
                        <p>Você ainda não utilizou nenhum serviço.</p>
                    \\\`;
                }

                grid.innerHTML = \\\`<div class="empty-state">\\\${emptyMessage}</div>\\\`;
                return;
            }

            grid.innerHTML = services.map(service => \\\`
                <div class="service-card">
                    <div class="service-header">
                        <div class="service-icon">\\\${service.icon || '⚙️'}</div>
                        <div class="service-title">\\\${service.name}</div>
                        <div class="service-status status-\\\${service.status}">\\\${getStatusText(service.status)}</div>
                    </div>
                    <div class="service-desc">\\\${service.description}</div>
                    <div class="service-metrics">
                        <div class="metric">Uso: <strong>\\\${service.usage || 0}%</strong></div>
                        <div class="metric">Custo: <strong>R$ \\\${service.cost || 0}</strong></div>
                        <div class="metric">\\\${tab === 'history' ? 'Período' : 'Desde'}: <strong>\\\${service.period || service.since || 'N/A'}</strong></div>
                        \\\${tab === 'active' ? \\\`<div class="metric">Uptime: <strong>\\\${service.uptime || 99.9}%</strong></div>\\\` : ''}
                    </div>
                    <div class="service-actions">
                        \\\${tab === 'active' ? \\\`
                            <button class="btn btn-outline" onclick="configureService('\\\${service.id}')">Configurar</button>
                            <button class="btn btn-outline" onclick="viewLogs('\\\${service.id}')">Logs</button>
                            <button class="btn btn-danger" onclick="stopService('\\\${service.id}')">Parar</button>
                        \\\` : tab === 'available' ? \\\`
                            <button class="btn btn-primary" onclick="activateService('\\\${service.id}')">Ativar</button>
                            <button class="btn btn-outline" onclick="viewDetails('\\\${service.id}')">Detalhes</button>
                        \\\` : \\\`
                            <button class="btn btn-outline" onclick="viewServiceHistory('\\\${service.id}')">Detalhes</button>
                            <button class="btn btn-outline" onclick="reactivateService('\\\${service.id}')">Reativar</button>
                        \\\`}
                    </div>
                </div>
            \\\`).join('');
        }

        function updateTabCounts(services, tab) {
            const counts = {
                active: services.filter(s => s.status === 'active').length,
                available: services.filter(s => s.status === 'available').length,
                history: services.filter(s => s.status === 'completed').length
            };

            document.getElementById('active-tab-count').textContent = \\\`(\\\${counts.active})\\\`;
            document.getElementById('available-tab-count').textContent = \\\`(\\\${counts.available})\\\`;
            document.getElementById('history-tab-count').textContent = \\\`(\\\${counts.history})\\\`;
        }

        function showAnalyticsContent() {
            const grid = document.getElementById('services-grid');
            const analytics = document.getElementById('analytics-content');

            grid.style.display = 'none';
            analytics.style.display = 'block';

            // Load analytics data
            loadPerformanceMetrics();
            loadRecommendations();
        }

        function hideAnalyticsContent() {
            const grid = document.getElementById('services-grid');
            const analytics = document.getElementById('analytics-content');

            grid.style.display = 'grid';
            analytics.style.display = 'none';
        }

        function loadPerformanceMetrics() {
            const performanceList = document.getElementById('performance-list');
            const mockPerformance = [
                { name: 'SEO Automation', usage: 85, uptime: 99.8, responseTime: 245 },
                { name: 'Analytics Pro', usage: 72, uptime: 99.9, responseTime: 189 },
                { name: 'Chatbot IA', usage: 45, uptime: 99.7, responseTime: 312 }
            ];

            performanceList.innerHTML = mockPerformance.map(item => \\\`
                <div class="performance-item">
                    <div class="service-icon">\\\${item.name === 'SEO Automation' ? '🔍' : item.name === 'Analytics Pro' ? '📊' : '🤖'}</div>
                    <div>
                        <div style="color: white; font-weight: 600;">\\\${item.name}</div>
                        <div style="color: #94a3b8; font-size: 0.8rem;">Performance metrics</div>
                    </div>
                    <div class="performance-metrics">
                        <div class="metric">Uso: <strong>\\\${item.usage}%</strong></div>
                        <div class="metric">Uptime: <strong>\\\${item.uptime}%</strong></div>
                        <div class="metric">Resp: <strong>\\\${item.responseTime}ms</strong></div>
                    </div>
                </div>
            \\\`).join('');
        }

        function loadRecommendations() {
            const recommendationsList = document.getElementById('recommendations-list');
            const mockRecommendations = [
                { icon: '⚡', title: 'Otimizar SEO Automation', desc: 'Uso abaixo do ideal, considere ajustar configurações' },
                { icon: '💰', title: 'Plano Chatbot', desc: 'Upgrade pode melhorar performance em 40%' },
                { icon: '🔧', title: 'Manutenção Analytics', desc: 'Atualização disponível para melhor estabilidade' }
            ];

            recommendationsList.innerHTML = mockRecommendations.map(rec => \\\`
                <div class="recommendation-item">
                    <div class="service-icon">\\\${rec.icon}</div>
                    <div>
                        <div style="color: white; font-weight: 600;">\\\${rec.title}</div>
                        <div style="color: #94a3b8; font-size: 0.8rem;">\\\${rec.desc}</div>
                    </div>
                    <button class="btn btn-outline" style="margin-left: auto;">Aplicar</button>
                </div>
            \\\`).join('');
        }

        function getStatusText(status) {
            const statuses = {
                'active': 'Ativo',
                'inactive': 'Inativo',
                'paused': 'Pausado',
                'available': 'Disponível',
                'completed': 'Concluído'
            };
            return statuses[status] || 'Ativo';
        }

        function loadMockServicesData() {
            updateMetrics({
                activeServices: 3,
                monthlySpend: 247,
                averageUsage: 67,
                averageUptime: 99.8
            });

            loadUsageChart();
            loadMockServices('active');
        }

        function loadMockServices(tab) {
            let mockServices = [];

            if (tab === 'active') {
                mockServices = [
                    {
                        id: '1',
                        name: 'SEO Automation',
                        description: 'Otimização automática de SEO para seus sites',
                        status: 'active',
                        usage: 85,
                        cost: 99,
                        since: 'Jan 2026',
                        uptime: 99.8,
                        icon: '🔍'
                    },
                    {
                        id: '2',
                        name: 'Analytics Pro',
                        description: 'Relatórios avançados de analytics',
                        status: 'active',
                        usage: 72,
                        cost: 149,
                        since: 'Dez 2025',
                        uptime: 99.9,
                        icon: '📊'
                    }
                ];
            } else if (tab === 'available') {
                mockServices = [
                    {
                        id: '3',
                        name: 'Chatbot IA',
                        description: 'Assistente virtual inteligente para atendimento',
                        status: 'available',
                        cost: 79,
                        icon: '🤖'
                    },
                    {
                        id: '4',
                        name: 'Email Marketing',
                        description: 'Campanhas de email automatizadas',
                        status: 'available',
                        cost: 59,
                        icon: '📧'
                    }
                ];
            } else {
                mockServices = [
                    {
                        id: '5',
                        name: 'Backup Cloud',
                        description: 'Serviço de backup em nuvem',
                        status: 'completed',
                        cost: 29,
                        period: 'Nov-Dez 2025',
                        icon: '☁️'
                    }
                ];
            }

            renderServices(mockServices, tab);
            updateTabCounts(mockServices, tab);
        }

        function showTab(tab) {
            currentTab = tab;
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            event.target.classList.add('active');

            const historyBtn = document.getElementById('history-btn');
            if (tab === 'history') {
                historyBtn.style.display = 'none';
            } else {
                historyBtn.style.display = 'inline-block';
            }

            loadServices(tab);
        }

        function updateUsageChart() {
            // Refresh usage chart with new period
            loadUsageChart();
        }

        function configureService(serviceId) {
            window.location.href = \\\`/dashboard/servicos/\\\${serviceId}/config\\\`;
        }

        function viewLogs(serviceId) {
            window.open(\\\`/dashboard/servicos/\\\${serviceId}/logs\\\`, '_blank');
        }

        function stopService(serviceId) {
            if (confirm('Tem certeza que deseja parar este serviço?')) {
                alert('Serviço parado com sucesso!');
                loadServices(currentTab);
            }
        }

        function activateService(serviceId) {
            alert('Serviço ativado com sucesso!');
            loadServices(currentTab);
        }

        function viewDetails(serviceId) {
            window.location.href = \\\`/dashboard/servicos/loja/\\\${serviceId}\\\`;
        }

        function viewServiceHistory(serviceId) {
            window.location.href = \\\`/dashboard/servicos/historico/\\\${serviceId}\\\`;
        }

        function reactivateService(serviceId) {
            if (confirm('Deseja reativar este serviço?')) {
                alert('Serviço reativado com sucesso!');
                loadServices(currentTab);
            }
        }

        // Initialize
        loadServicesData();
    <\/script> `])), renderScript($$result2, "/home/lele/usenexo/getnexo-site/src/pages/dashboard/servicos/index.astro?astro&type=script&index=0&lang.ts"), maybeRenderHead()) })}`;
}, "/home/lele/usenexo/getnexo-site/src/pages/dashboard/servicos/index.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/dashboard/servicos/index.astro";
const $$url = "/dashboard/servicos";
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
