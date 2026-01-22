import { f as createComponent, k as renderComponent, r as renderTemplate, l as renderScript, m as maybeRenderHead } from "../../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$ResellerLayout } from "../../assets/ResellerLayout-BGTF-fbt.js";
/* empty css                                  */
import { renderers } from "../../renderers.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Dash = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "ResellerLayout", $$ResellerLayout, { "title": "Dashboard Revendedor - GetNexo", "data-astro-cid-t4qzq7en": true }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([" ", '<div style="padding: 2rem; max-width: 1400px; margin: 0 auto;" data-astro-cid-t4qzq7en> <!-- Welcome Header --> <div style="text-align: center; margin-bottom: 3rem;" data-astro-cid-t4qzq7en> <h1 style="font-size: 2.5rem; font-weight: 900; color: #00ff9d; margin: 0; background: linear-gradient(90deg, #00d4ff, #00ff9d); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" data-astro-cid-t4qzq7en>\n🏪 Centro de Revendas GetNexo\n</h1> <p style="color: #94a3b8; font-size: 1.1rem; margin: 1rem 0;" data-astro-cid-t4qzq7en>\nGerencie seus clientes, acompanhe comissões e maximize seus lucros\n</p> </div> <!-- Quick Actions Bar --> <div style="display: flex; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap;" data-astro-cid-t4qzq7en> <button class="action-btn primary" onclick="addNewClient()" data-astro-cid-t4qzq7en> <span data-astro-cid-t4qzq7en>👥</span> Novo Cliente\n</button> <button class="action-btn secondary" onclick="generateReferralLink()" data-astro-cid-t4qzq7en> <span data-astro-cid-t4qzq7en>🔗</span> Link de Indicação\n</button> <button class="action-btn info" onclick="viewCommissions()" data-astro-cid-t4qzq7en> <span data-astro-cid-t4qzq7en>💰</span> Comissões\n</button> <button class="action-btn warning" onclick="supportPanel()" data-astro-cid-t4qzq7en> <span data-astro-cid-t4qzq7en>🆘</span> Suporte\n</button> </div> <!-- Main Stats Grid --> <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 3rem;" data-astro-cid-t4qzq7en> <!-- Revenue Card --> <div class="stats-card revenue" data-astro-cid-t4qzq7en> <div class="card-header" data-astro-cid-t4qzq7en> <div class="card-icon" data-astro-cid-t4qzq7en>💰</div> <div class="card-title" data-astro-cid-t4qzq7en>Receita Total</div> </div> <div class="card-value" id="total-revenue" data-astro-cid-t4qzq7en>Carregando...</div> <div class="card-subtitle" data-astro-cid-t4qzq7en> <span class="positive" data-astro-cid-t4qzq7en>↗️ +12%</span> vs mês passado\n</div> </div> <!-- Commission Card --> <div class="stats-card commission" data-astro-cid-t4qzq7en> <div class="card-header" data-astro-cid-t4qzq7en> <div class="card-icon" data-astro-cid-t4qzq7en>🎯</div> <div class="card-title" data-astro-cid-t4qzq7en>Comissão Este Mês</div> </div> <div class="card-value" id="monthly-commission" data-astro-cid-t4qzq7en>Carregando...</div> <div class="card-subtitle" data-astro-cid-t4qzq7en>\nMeta: <span id="commission-goal" data-astro-cid-t4qzq7en>R$ 5.000</span> </div> <div class="progress-bar" data-astro-cid-t4qzq7en> <div class="progress-fill" id="commission-progress" style="width: 68%;" data-astro-cid-t4qzq7en></div> </div> </div> <!-- Active Clients --> <div class="stats-card clients" data-astro-cid-t4qzq7en> <div class="card-header" data-astro-cid-t4qzq7en> <div class="card-icon" data-astro-cid-t4qzq7en>👥</div> <div class="card-title" data-astro-cid-t4qzq7en>Clientes Ativos</div> </div> <div class="card-value" id="active-clients" data-astro-cid-t4qzq7en>Carregando...</div> <div class="card-subtitle" data-astro-cid-t4qzq7en> <span class="positive" data-astro-cid-t4qzq7en>↗️ +3</span> novos este mês\n</div> </div> <!-- Pending Commissions --> <div class="stats-card pending" data-astro-cid-t4qzq7en> <div class="card-header" data-astro-cid-t4qzq7en> <div class="card-icon" data-astro-cid-t4qzq7en>⏳</div> <div class="card-title" data-astro-cid-t4qzq7en>Comissões Pendentes</div> </div> <div class="card-value" id="pending-commissions" data-astro-cid-t4qzq7en>Carregando...</div> <div class="card-subtitle" data-astro-cid-t4qzq7en>\nLiberação: <span id="next-payout" data-astro-cid-t4qzq7en>15 Jan</span> </div> </div> </div> <!-- Charts Section --> <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 3rem;" data-astro-cid-t4qzq7en> <!-- Commission Chart --> <div class="chart-card" data-astro-cid-t4qzq7en> <div class="chart-header" data-astro-cid-t4qzq7en> <h3 data-astro-cid-t4qzq7en>📈 Comissões por Mês</h3> <select id="chart-period" data-astro-cid-t4qzq7en> <option value="6" data-astro-cid-t4qzq7en>Últimos 6 meses</option> <option value="12" selected data-astro-cid-t4qzq7en>Último ano</option> <option value="24" data-astro-cid-t4qzq7en>Últimos 2 anos</option> </select> </div> <div class="chart-container" data-astro-cid-t4qzq7en> <canvas id="commissionChart" width="400" height="250" data-astro-cid-t4qzq7en></canvas> </div> </div> <!-- Clients Growth --> <div class="chart-card" data-astro-cid-t4qzq7en> <div class="chart-header" data-astro-cid-t4qzq7en> <h3 data-astro-cid-t4qzq7en>📊 Crescimento de Clientes</h3> <div class="chart-legend" data-astro-cid-t4qzq7en> <span class="legend-item active" data-astro-cid-t4qzq7en>🔵 Ativos</span> <span class="legend-item" data-astro-cid-t4qzq7en>🔴 Inativos</span> </div> </div> <div class="chart-container" data-astro-cid-t4qzq7en> <canvas id="clientsChart" width="400" height="250" data-astro-cid-t4qzq7en></canvas> </div> </div> </div> <!-- Recent Clients Table --> <div class="table-card" data-astro-cid-t4qzq7en> <div class="table-header" data-astro-cid-t4qzq7en> <h3 data-astro-cid-t4qzq7en>👥 Clientes Recentes</h3> <button class="btn-outline" onclick="viewAllClients()" data-astro-cid-t4qzq7en>Ver Todos</button> </div> <div class="table-responsive" data-astro-cid-t4qzq7en> <table class="clients-table" data-astro-cid-t4qzq7en> <thead data-astro-cid-t4qzq7en> <tr data-astro-cid-t4qzq7en> <th data-astro-cid-t4qzq7en>Cliente</th> <th data-astro-cid-t4qzq7en>Plano</th> <th data-astro-cid-t4qzq7en>Status</th> <th data-astro-cid-t4qzq7en>Comissão</th> <th data-astro-cid-t4qzq7en>Data</th> <th data-astro-cid-t4qzq7en>Ações</th> </tr> </thead> <tbody id="clients-table-body" data-astro-cid-t4qzq7en> <tr data-astro-cid-t4qzq7en> <td colspan="6" style="text-align: center; padding: 2rem; color: #94a3b8;" data-astro-cid-t4qzq7en>Carregando clientes...</td> </tr> </tbody> </table> </div> </div> <!-- Marketing Tools --> <div class="marketing-section" data-astro-cid-t4qzq7en> <h3 style="color: #00ff9d; margin-bottom: 1.5rem;" data-astro-cid-t4qzq7en>🚀 Ferramentas de Marketing</h3> <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;" data-astro-cid-t4qzq7en> <div class="marketing-card" data-astro-cid-t4qzq7en> <div class="marketing-icon" data-astro-cid-t4qzq7en>📢</div> <div class="marketing-content" data-astro-cid-t4qzq7en> <h4 data-astro-cid-t4qzq7en>Landing Page Personalizada</h4> <p data-astro-cid-t4qzq7en>Crie páginas de vendas otimizadas para conversão</p> <button class="btn-primary" onclick="createLandingPage()" data-astro-cid-t4qzq7en>Criar Página</button> </div> </div> <div class="marketing-card" data-astro-cid-t4qzq7en> <div class="marketing-icon" data-astro-cid-t4qzq7en>🎨</div> <div class="marketing-content" data-astro-cid-t4qzq7en> <h4 data-astro-cid-t4qzq7en>Material de Marketing</h4> <p data-astro-cid-t4qzq7en>Banners, posts e conteúdo pronto para usar</p> <button class="btn-primary" onclick="downloadMaterials()" data-astro-cid-t4qzq7en>Baixar Materiais</button> </div> </div> <div class="marketing-card" data-astro-cid-t4qzq7en> <div class="marketing-icon" data-astro-cid-t4qzq7en>📊</div> <div class="marketing-content" data-astro-cid-t4qzq7en> <h4 data-astro-cid-t4qzq7en>Relatórios de Performance</h4> <p data-astro-cid-t4qzq7en>Acompanhe conversões e ROI dos seus clientes</p> <button class="btn-primary" onclick="generateReport()" data-astro-cid-t4qzq7en>Gerar Relatório</button> </div> </div> </div> </div> </div>  ', `  <script>
        const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000' : '/api-proxy';

        // Enhanced data loading
        async function loadDashboardData() {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(\`\${API_URL}/api/revenda/dashboard\`, {
                    headers: { 'Authorization': token }
                });
                const data = await res.json();

                // Update stats
                updateStats(data);

                // Load charts
                loadCommissionChart(data.commissions || []);
                loadClientsChart(data.clientsGrowth || []);

                // Load clients table
                loadClientsTable(data.recentClients || []);

            } catch (e) {
                console.error('API Error, using fallback', e);
                loadMockData();
            }
        }

        function updateStats(data) {
            document.getElementById('total-revenue').textContent = 'R$ ' + (data.totalRevenue || 4820).toLocaleString('pt-BR');
            document.getElementById('monthly-commission').textContent = 'R$ ' + (data.monthlyCommission || 3240).toLocaleString('pt-BR');
            document.getElementById('active-clients').textContent = data.activeClients || 18;
            document.getElementById('pending-commissions').textContent = 'R$ ' + (data.pendingCommissions || 1200).toLocaleString('pt-BR');
            document.getElementById('commission-progress').style.width = (data.commissionProgress || 68) + '%';
        }

        function loadCommissionChart(commissions) {
            const ctx = document.getElementById('commissionChart').getContext('2d');
            const labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
            const data = commissions.length > 0 ? commissions : [1200, 1900, 1500, 2500, 2200, 3100, 2800, 3500, 2900, 3800, 3200, 4100];

            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Comissões (R$)',
                        data: data,
                        borderColor: '#00ff9d',
                        backgroundColor: 'rgba(0, 255, 157, 0.1)',
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
        }

        function loadClientsChart(clientsGrowth) {
            const ctx = document.getElementById('clientsChart').getContext('2d');
            const labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
            const activeData = clientsGrowth.active || [5, 8, 12, 15, 18, 22];
            const inactiveData = clientsGrowth.inactive || [2, 3, 4, 3, 5, 4];

            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Clientes Ativos',
                        data: activeData,
                        borderColor: '#00d4ff',
                        backgroundColor: 'rgba(0, 212, 255, 0.1)',
                        borderWidth: 2,
                        tension: 0.4
                    }, {
                        label: 'Clientes Inativos',
                        data: inactiveData,
                        borderColor: '#f87171',
                        backgroundColor: 'rgba(248, 113, 113, 0.1)',
                        borderWidth: 2,
                        tension: 0.4
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

        function loadClientsTable(clients) {
            const tbody = document.getElementById('clients-table-body');

            if (clients.length === 0) {
                tbody.innerHTML = \`
                    <tr>
                        <td colspan="6" style="text-align: center; padding: 2rem; color: #94a3b8;">Nenhum cliente ainda</td>
                    </tr>
                \`;
                return;
            }

            tbody.innerHTML = clients.map(client => \`
                <tr>
                    <td>
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                            <img src="\${client.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(client.name) + '&background=00d4ff&color=000'}" style="width: 32px; height: 32px; border-radius: 50%;" alt="Avatar">
                            <div>
                                <div style="color: white; font-weight: 600;">\${client.name}</div>
                                <div style="color: #64748b; font-size: 0.8rem;">\${client.email}</div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <span style="background: rgba(0, 255, 157, 0.1); color: #00ff9d; padding: 4px 8px; border-radius: 12px; font-size: 0.8rem; font-weight: 600;">\${client.plan || 'Professional'}</span>
                    </td>
                    <td>
                        <span style="background: rgba(0, 255, 157, 0.1); color: #00ff9d; padding: 4px 8px; border-radius: 12px; font-size: 0.8rem; font-weight: 600;">Ativo</span>
                    </td>
                    <td style="color: #00ff9d; font-weight: 600;">R$ \${client.commission || Math.floor(Math.random() * 500)}</td>
                    <td style="color: #94a3b8;">\${client.date || '15 Jan 2024'}</td>
                    <td>
                        <button style="background: rgba(0, 212, 255, 0.1); color: #00d4ff; border: 1px solid rgba(0, 212, 255, 0.3); padding: 4px 8px; border-radius: 6px; cursor: pointer; font-size: 0.8rem;" onclick="viewClient('\${client.id}')">Ver</button>
                    </td>
                </tr>
            \`).join('');
        }

        function loadMockData() {
            // Mock data for demo
            updateStats({
                totalRevenue: 15420,
                monthlyCommission: 3240,
                activeClients: 18,
                pendingCommissions: 1200,
                commissionProgress: 68
            });

            loadCommissionChart([]);
            loadClientsChart({});

            loadClientsTable([
                { id: 1, name: 'João Silva', email: 'joao@email.com', plan: 'Professional', commission: 297, date: '15 Jan' },
                { id: 2, name: 'Maria Santos', email: 'maria@email.com', plan: 'Starter', commission: 97, date: '12 Jan' },
                { id: 3, name: 'Pedro Costa', email: 'pedro@email.com', plan: 'Professional', commission: 297, date: '10 Jan' }
            ]);
        }

        // Action functions
        function addNewClient() {
            alert('Funcionalidade: Adicionar novo cliente\\nEm breve será implementada a interface completa para cadastro de clientes.');
        }

        function generateReferralLink() {
            const referralLink = \`https://getnexo.com.br/?ref=\${Math.random().toString(36).substr(2, 9)}\`;
            navigator.clipboard.writeText(referralLink).then(() => {
                alert('Link de indicação copiado!\\n' + referralLink);
            });
        }

        function viewCommissions() {
            alert('Funcionalidade: Visualizar detalhes de comissões\\nEm breve será implementada a página completa de extratos.');
        }

        function supportPanel() {
            window.open('/contato', '_blank');
        }

        function viewAllClients() {
            alert('Funcionalidade: Ver todos os clientes\\nEm breve será implementada a página completa de gestão de clientes.');
        }

        function viewClient(clientId) {
            alert(\`Funcionalidade: Ver detalhes do cliente \${clientId}\\nEm breve será implementada a página de detalhes do cliente.\`);
        }

        function createLandingPage() {
            alert('Funcionalidade: Criar landing page personalizada\\nEm breve será implementada a ferramenta de criação de páginas.');
        }

        function downloadMaterials() {
            alert('Funcionalidade: Baixar materiais de marketing\\nEm breve será implementada a galeria de materiais prontos.');
        }

        function generateReport() {
            alert('Funcionalidade: Gerar relatório de performance\\nEm breve será implementada a geração automática de relatórios.');
        }

        // Initialize
        loadDashboardData();
    <\/script> `], [" ", '<div style="padding: 2rem; max-width: 1400px; margin: 0 auto;" data-astro-cid-t4qzq7en> <!-- Welcome Header --> <div style="text-align: center; margin-bottom: 3rem;" data-astro-cid-t4qzq7en> <h1 style="font-size: 2.5rem; font-weight: 900; color: #00ff9d; margin: 0; background: linear-gradient(90deg, #00d4ff, #00ff9d); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" data-astro-cid-t4qzq7en>\n🏪 Centro de Revendas GetNexo\n</h1> <p style="color: #94a3b8; font-size: 1.1rem; margin: 1rem 0;" data-astro-cid-t4qzq7en>\nGerencie seus clientes, acompanhe comissões e maximize seus lucros\n</p> </div> <!-- Quick Actions Bar --> <div style="display: flex; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap;" data-astro-cid-t4qzq7en> <button class="action-btn primary" onclick="addNewClient()" data-astro-cid-t4qzq7en> <span data-astro-cid-t4qzq7en>👥</span> Novo Cliente\n</button> <button class="action-btn secondary" onclick="generateReferralLink()" data-astro-cid-t4qzq7en> <span data-astro-cid-t4qzq7en>🔗</span> Link de Indicação\n</button> <button class="action-btn info" onclick="viewCommissions()" data-astro-cid-t4qzq7en> <span data-astro-cid-t4qzq7en>💰</span> Comissões\n</button> <button class="action-btn warning" onclick="supportPanel()" data-astro-cid-t4qzq7en> <span data-astro-cid-t4qzq7en>🆘</span> Suporte\n</button> </div> <!-- Main Stats Grid --> <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 3rem;" data-astro-cid-t4qzq7en> <!-- Revenue Card --> <div class="stats-card revenue" data-astro-cid-t4qzq7en> <div class="card-header" data-astro-cid-t4qzq7en> <div class="card-icon" data-astro-cid-t4qzq7en>💰</div> <div class="card-title" data-astro-cid-t4qzq7en>Receita Total</div> </div> <div class="card-value" id="total-revenue" data-astro-cid-t4qzq7en>Carregando...</div> <div class="card-subtitle" data-astro-cid-t4qzq7en> <span class="positive" data-astro-cid-t4qzq7en>↗️ +12%</span> vs mês passado\n</div> </div> <!-- Commission Card --> <div class="stats-card commission" data-astro-cid-t4qzq7en> <div class="card-header" data-astro-cid-t4qzq7en> <div class="card-icon" data-astro-cid-t4qzq7en>🎯</div> <div class="card-title" data-astro-cid-t4qzq7en>Comissão Este Mês</div> </div> <div class="card-value" id="monthly-commission" data-astro-cid-t4qzq7en>Carregando...</div> <div class="card-subtitle" data-astro-cid-t4qzq7en>\nMeta: <span id="commission-goal" data-astro-cid-t4qzq7en>R$ 5.000</span> </div> <div class="progress-bar" data-astro-cid-t4qzq7en> <div class="progress-fill" id="commission-progress" style="width: 68%;" data-astro-cid-t4qzq7en></div> </div> </div> <!-- Active Clients --> <div class="stats-card clients" data-astro-cid-t4qzq7en> <div class="card-header" data-astro-cid-t4qzq7en> <div class="card-icon" data-astro-cid-t4qzq7en>👥</div> <div class="card-title" data-astro-cid-t4qzq7en>Clientes Ativos</div> </div> <div class="card-value" id="active-clients" data-astro-cid-t4qzq7en>Carregando...</div> <div class="card-subtitle" data-astro-cid-t4qzq7en> <span class="positive" data-astro-cid-t4qzq7en>↗️ +3</span> novos este mês\n</div> </div> <!-- Pending Commissions --> <div class="stats-card pending" data-astro-cid-t4qzq7en> <div class="card-header" data-astro-cid-t4qzq7en> <div class="card-icon" data-astro-cid-t4qzq7en>⏳</div> <div class="card-title" data-astro-cid-t4qzq7en>Comissões Pendentes</div> </div> <div class="card-value" id="pending-commissions" data-astro-cid-t4qzq7en>Carregando...</div> <div class="card-subtitle" data-astro-cid-t4qzq7en>\nLiberação: <span id="next-payout" data-astro-cid-t4qzq7en>15 Jan</span> </div> </div> </div> <!-- Charts Section --> <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 3rem;" data-astro-cid-t4qzq7en> <!-- Commission Chart --> <div class="chart-card" data-astro-cid-t4qzq7en> <div class="chart-header" data-astro-cid-t4qzq7en> <h3 data-astro-cid-t4qzq7en>📈 Comissões por Mês</h3> <select id="chart-period" data-astro-cid-t4qzq7en> <option value="6" data-astro-cid-t4qzq7en>Últimos 6 meses</option> <option value="12" selected data-astro-cid-t4qzq7en>Último ano</option> <option value="24" data-astro-cid-t4qzq7en>Últimos 2 anos</option> </select> </div> <div class="chart-container" data-astro-cid-t4qzq7en> <canvas id="commissionChart" width="400" height="250" data-astro-cid-t4qzq7en></canvas> </div> </div> <!-- Clients Growth --> <div class="chart-card" data-astro-cid-t4qzq7en> <div class="chart-header" data-astro-cid-t4qzq7en> <h3 data-astro-cid-t4qzq7en>📊 Crescimento de Clientes</h3> <div class="chart-legend" data-astro-cid-t4qzq7en> <span class="legend-item active" data-astro-cid-t4qzq7en>🔵 Ativos</span> <span class="legend-item" data-astro-cid-t4qzq7en>🔴 Inativos</span> </div> </div> <div class="chart-container" data-astro-cid-t4qzq7en> <canvas id="clientsChart" width="400" height="250" data-astro-cid-t4qzq7en></canvas> </div> </div> </div> <!-- Recent Clients Table --> <div class="table-card" data-astro-cid-t4qzq7en> <div class="table-header" data-astro-cid-t4qzq7en> <h3 data-astro-cid-t4qzq7en>👥 Clientes Recentes</h3> <button class="btn-outline" onclick="viewAllClients()" data-astro-cid-t4qzq7en>Ver Todos</button> </div> <div class="table-responsive" data-astro-cid-t4qzq7en> <table class="clients-table" data-astro-cid-t4qzq7en> <thead data-astro-cid-t4qzq7en> <tr data-astro-cid-t4qzq7en> <th data-astro-cid-t4qzq7en>Cliente</th> <th data-astro-cid-t4qzq7en>Plano</th> <th data-astro-cid-t4qzq7en>Status</th> <th data-astro-cid-t4qzq7en>Comissão</th> <th data-astro-cid-t4qzq7en>Data</th> <th data-astro-cid-t4qzq7en>Ações</th> </tr> </thead> <tbody id="clients-table-body" data-astro-cid-t4qzq7en> <tr data-astro-cid-t4qzq7en> <td colspan="6" style="text-align: center; padding: 2rem; color: #94a3b8;" data-astro-cid-t4qzq7en>Carregando clientes...</td> </tr> </tbody> </table> </div> </div> <!-- Marketing Tools --> <div class="marketing-section" data-astro-cid-t4qzq7en> <h3 style="color: #00ff9d; margin-bottom: 1.5rem;" data-astro-cid-t4qzq7en>🚀 Ferramentas de Marketing</h3> <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;" data-astro-cid-t4qzq7en> <div class="marketing-card" data-astro-cid-t4qzq7en> <div class="marketing-icon" data-astro-cid-t4qzq7en>📢</div> <div class="marketing-content" data-astro-cid-t4qzq7en> <h4 data-astro-cid-t4qzq7en>Landing Page Personalizada</h4> <p data-astro-cid-t4qzq7en>Crie páginas de vendas otimizadas para conversão</p> <button class="btn-primary" onclick="createLandingPage()" data-astro-cid-t4qzq7en>Criar Página</button> </div> </div> <div class="marketing-card" data-astro-cid-t4qzq7en> <div class="marketing-icon" data-astro-cid-t4qzq7en>🎨</div> <div class="marketing-content" data-astro-cid-t4qzq7en> <h4 data-astro-cid-t4qzq7en>Material de Marketing</h4> <p data-astro-cid-t4qzq7en>Banners, posts e conteúdo pronto para usar</p> <button class="btn-primary" onclick="downloadMaterials()" data-astro-cid-t4qzq7en>Baixar Materiais</button> </div> </div> <div class="marketing-card" data-astro-cid-t4qzq7en> <div class="marketing-icon" data-astro-cid-t4qzq7en>📊</div> <div class="marketing-content" data-astro-cid-t4qzq7en> <h4 data-astro-cid-t4qzq7en>Relatórios de Performance</h4> <p data-astro-cid-t4qzq7en>Acompanhe conversões e ROI dos seus clientes</p> <button class="btn-primary" onclick="generateReport()" data-astro-cid-t4qzq7en>Gerar Relatório</button> </div> </div> </div> </div> </div>  ', `  <script>
        const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000' : '/api-proxy';

        // Enhanced data loading
        async function loadDashboardData() {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(\\\`\\\${API_URL}/api/revenda/dashboard\\\`, {
                    headers: { 'Authorization': token }
                });
                const data = await res.json();

                // Update stats
                updateStats(data);

                // Load charts
                loadCommissionChart(data.commissions || []);
                loadClientsChart(data.clientsGrowth || []);

                // Load clients table
                loadClientsTable(data.recentClients || []);

            } catch (e) {
                console.error('API Error, using fallback', e);
                loadMockData();
            }
        }

        function updateStats(data) {
            document.getElementById('total-revenue').textContent = 'R$ ' + (data.totalRevenue || 4820).toLocaleString('pt-BR');
            document.getElementById('monthly-commission').textContent = 'R$ ' + (data.monthlyCommission || 3240).toLocaleString('pt-BR');
            document.getElementById('active-clients').textContent = data.activeClients || 18;
            document.getElementById('pending-commissions').textContent = 'R$ ' + (data.pendingCommissions || 1200).toLocaleString('pt-BR');
            document.getElementById('commission-progress').style.width = (data.commissionProgress || 68) + '%';
        }

        function loadCommissionChart(commissions) {
            const ctx = document.getElementById('commissionChart').getContext('2d');
            const labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
            const data = commissions.length > 0 ? commissions : [1200, 1900, 1500, 2500, 2200, 3100, 2800, 3500, 2900, 3800, 3200, 4100];

            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Comissões (R$)',
                        data: data,
                        borderColor: '#00ff9d',
                        backgroundColor: 'rgba(0, 255, 157, 0.1)',
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
        }

        function loadClientsChart(clientsGrowth) {
            const ctx = document.getElementById('clientsChart').getContext('2d');
            const labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
            const activeData = clientsGrowth.active || [5, 8, 12, 15, 18, 22];
            const inactiveData = clientsGrowth.inactive || [2, 3, 4, 3, 5, 4];

            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Clientes Ativos',
                        data: activeData,
                        borderColor: '#00d4ff',
                        backgroundColor: 'rgba(0, 212, 255, 0.1)',
                        borderWidth: 2,
                        tension: 0.4
                    }, {
                        label: 'Clientes Inativos',
                        data: inactiveData,
                        borderColor: '#f87171',
                        backgroundColor: 'rgba(248, 113, 113, 0.1)',
                        borderWidth: 2,
                        tension: 0.4
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

        function loadClientsTable(clients) {
            const tbody = document.getElementById('clients-table-body');

            if (clients.length === 0) {
                tbody.innerHTML = \\\`
                    <tr>
                        <td colspan="6" style="text-align: center; padding: 2rem; color: #94a3b8;">Nenhum cliente ainda</td>
                    </tr>
                \\\`;
                return;
            }

            tbody.innerHTML = clients.map(client => \\\`
                <tr>
                    <td>
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                            <img src="\\\${client.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(client.name) + '&background=00d4ff&color=000'}" style="width: 32px; height: 32px; border-radius: 50%;" alt="Avatar">
                            <div>
                                <div style="color: white; font-weight: 600;">\\\${client.name}</div>
                                <div style="color: #64748b; font-size: 0.8rem;">\\\${client.email}</div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <span style="background: rgba(0, 255, 157, 0.1); color: #00ff9d; padding: 4px 8px; border-radius: 12px; font-size: 0.8rem; font-weight: 600;">\\\${client.plan || 'Professional'}</span>
                    </td>
                    <td>
                        <span style="background: rgba(0, 255, 157, 0.1); color: #00ff9d; padding: 4px 8px; border-radius: 12px; font-size: 0.8rem; font-weight: 600;">Ativo</span>
                    </td>
                    <td style="color: #00ff9d; font-weight: 600;">R$ \\\${client.commission || Math.floor(Math.random() * 500)}</td>
                    <td style="color: #94a3b8;">\\\${client.date || '15 Jan 2024'}</td>
                    <td>
                        <button style="background: rgba(0, 212, 255, 0.1); color: #00d4ff; border: 1px solid rgba(0, 212, 255, 0.3); padding: 4px 8px; border-radius: 6px; cursor: pointer; font-size: 0.8rem;" onclick="viewClient('\\\${client.id}')">Ver</button>
                    </td>
                </tr>
            \\\`).join('');
        }

        function loadMockData() {
            // Mock data for demo
            updateStats({
                totalRevenue: 15420,
                monthlyCommission: 3240,
                activeClients: 18,
                pendingCommissions: 1200,
                commissionProgress: 68
            });

            loadCommissionChart([]);
            loadClientsChart({});

            loadClientsTable([
                { id: 1, name: 'João Silva', email: 'joao@email.com', plan: 'Professional', commission: 297, date: '15 Jan' },
                { id: 2, name: 'Maria Santos', email: 'maria@email.com', plan: 'Starter', commission: 97, date: '12 Jan' },
                { id: 3, name: 'Pedro Costa', email: 'pedro@email.com', plan: 'Professional', commission: 297, date: '10 Jan' }
            ]);
        }

        // Action functions
        function addNewClient() {
            alert('Funcionalidade: Adicionar novo cliente\\\\nEm breve será implementada a interface completa para cadastro de clientes.');
        }

        function generateReferralLink() {
            const referralLink = \\\`https://getnexo.com.br/?ref=\\\${Math.random().toString(36).substr(2, 9)}\\\`;
            navigator.clipboard.writeText(referralLink).then(() => {
                alert('Link de indicação copiado!\\\\n' + referralLink);
            });
        }

        function viewCommissions() {
            alert('Funcionalidade: Visualizar detalhes de comissões\\\\nEm breve será implementada a página completa de extratos.');
        }

        function supportPanel() {
            window.open('/contato', '_blank');
        }

        function viewAllClients() {
            alert('Funcionalidade: Ver todos os clientes\\\\nEm breve será implementada a página completa de gestão de clientes.');
        }

        function viewClient(clientId) {
            alert(\\\`Funcionalidade: Ver detalhes do cliente \\\${clientId}\\\\nEm breve será implementada a página de detalhes do cliente.\\\`);
        }

        function createLandingPage() {
            alert('Funcionalidade: Criar landing page personalizada\\\\nEm breve será implementada a ferramenta de criação de páginas.');
        }

        function downloadMaterials() {
            alert('Funcionalidade: Baixar materiais de marketing\\\\nEm breve será implementada a galeria de materiais prontos.');
        }

        function generateReport() {
            alert('Funcionalidade: Gerar relatório de performance\\\\nEm breve será implementada a geração automática de relatórios.');
        }

        // Initialize
        loadDashboardData();
    <\/script> `])), maybeRenderHead(), renderScript($$result2, "/home/lele/usenexo/getnexo-site/src/pages/revenda/dash.astro?astro&type=script&index=0&lang.ts")) })}`;
}, "/home/lele/usenexo/getnexo-site/src/pages/revenda/dash.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/revenda/dash.astro";
const $$url = "/revenda/dash";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Dash,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
