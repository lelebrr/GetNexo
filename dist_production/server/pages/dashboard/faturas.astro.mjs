import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from "../../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$ClientLayout } from "../../assets/ClientLayout-Cg0S0bz6.js";
/* empty css                                     */
import { renderers } from "../../renderers.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Faturas = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "ClientLayout", $$ClientLayout, { "title": "Faturas - GetNexo Pro", "data-astro-cid-lqa55j6u": true }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template(["  ", `<div style="padding: 2rem; max-width: 1400px; margin: 0 auto;" data-astro-cid-lqa55j6u> <!-- Header --> <div class="bills-header" data-astro-cid-lqa55j6u> <h1 data-astro-cid-lqa55j6u>💰 Minhas Faturas</h1> <p data-astro-cid-lqa55j6u>Acompanhe e gerencie todos os seus pagamentos</p> </div> <!-- Summary --> <div class="bills-summary" data-astro-cid-lqa55j6u> <div class="summary-card" data-astro-cid-lqa55j6u> <div class="summary-header" data-astro-cid-lqa55j6u> <div class="summary-icon" data-astro-cid-lqa55j6u>💰</div> <div class="summary-title" data-astro-cid-lqa55j6u>Total em Aberto</div> </div> <div class="summary-value" id="total-open" data-astro-cid-lqa55j6u>R$ 0</div> <div class="summary-desc" data-astro-cid-lqa55j6u>
Faturas pendentes de pagamento
</div> </div> <div class="summary-card" data-astro-cid-lqa55j6u> <div class="summary-header" data-astro-cid-lqa55j6u> <div class="summary-icon" data-astro-cid-lqa55j6u>✅</div> <div class="summary-title" data-astro-cid-lqa55j6u>Pago este Mês</div> </div> <div class="summary-value" id="paid-month" data-astro-cid-lqa55j6u>R$ 0</div> <div class="summary-desc" data-astro-cid-lqa55j6u>
Total pago no mês atual
</div> </div> <div class="summary-card" data-astro-cid-lqa55j6u> <div class="summary-header" data-astro-cid-lqa55j6u> <div class="summary-icon" data-astro-cid-lqa55j6u>📊</div> <div class="summary-title" data-astro-cid-lqa55j6u>Próximo Vencimento</div> </div> <div class="summary-value" id="next-due" data-astro-cid-lqa55j6u>N/A</div> <div class="summary-desc" data-astro-cid-lqa55j6u>
Data do próximo pagamento
</div> </div> <div class="summary-card" data-astro-cid-lqa55j6u> <div class="summary-header" data-astro-cid-lqa55j6u> <div class="summary-icon" data-astro-cid-lqa55j6u>📈</div> <div class="summary-title" data-astro-cid-lqa55j6u>Média Mensal</div> </div> <div class="summary-value" id="monthly-avg" data-astro-cid-lqa55j6u>R$ 0</div> <div class="summary-desc" data-astro-cid-lqa55j6u>
Gasto médio por mês
</div> </div> </div> <!-- Filters --> <div class="filters-section" data-astro-cid-lqa55j6u> <div class="filters-grid" data-astro-cid-lqa55j6u> <div class="filter-group" data-astro-cid-lqa55j6u> <label class="filter-label" data-astro-cid-lqa55j6u>Status</label> <select class="filter-select" id="status-filter" data-astro-cid-lqa55j6u> <option value="all" selected data-astro-cid-lqa55j6u>Todas as faturas</option> <option value="paid" data-astro-cid-lqa55j6u>Pagas</option> <option value="pending" data-astro-cid-lqa55j6u>Pendentes</option> <option value="overdue" data-astro-cid-lqa55j6u>Vencidas</option> </select> </div> <div class="filter-group" data-astro-cid-lqa55j6u> <label class="filter-label" data-astro-cid-lqa55j6u>Período</label> <select class="filter-select" id="period-filter" data-astro-cid-lqa55j6u> <option value="all" selected data-astro-cid-lqa55j6u>Todos os períodos</option> <option value="current-month" data-astro-cid-lqa55j6u>Mês atual</option> <option value="last-month" data-astro-cid-lqa55j6u>Mês passado</option> <option value="last-3-months" data-astro-cid-lqa55j6u>Últimos 3 meses</option> <option value="last-year" data-astro-cid-lqa55j6u>Último ano</option> </select> </div> <div class="filter-group" data-astro-cid-lqa55j6u> <button class="btn btn-primary" onclick="applyFilters()" data-astro-cid-lqa55j6u>Aplicar Filtros</button> </div> </div> </div> <!-- Bills Table --> <div class="bills-table" data-astro-cid-lqa55j6u> <div class="table-header" data-astro-cid-lqa55j6u> <h3 data-astro-cid-lqa55j6u>Faturas Recentes</h3> <button class="btn btn-outline" onclick="exportBills()" data-astro-cid-lqa55j6u>Exportar</button> </div> <div class="bills-list" id="bills-list" data-astro-cid-lqa55j6u> <!-- Bills will be loaded here --> </div> </div> </div> <script>
        async function loadBills() {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(\`\${API_URL}/api/bills\`, {
                    headers: { 'Authorization': token }
                });
                const bills = await res.json();
                renderBills(bills);
                updateSummary(bills);
            } catch (e) {
                console.error('Error loading bills, using mock data', e);
                loadMockBills();
            }
        }

        function renderBills(bills) {
            const billsList = document.getElementById('bills-list');

            if (bills.length === 0) {
                billsList.innerHTML = \`
                    <div class="empty-state">
                        <h3>📭 Nenhuma fatura encontrada</h3>
                        <p>Não há faturas para exibir com os filtros atuais.</p>
                    </div>
                \`;
                return;
            }

            billsList.innerHTML = bills.map(bill => \`
                <div class="bill-item">
                    <div class="bill-info">
                        <h4>\${bill.description}</h4>
                        <p>ID: \${bill.id} • \${bill.period}</p>
                    </div>
                    <div class="bill-amount">R$ \${bill.amount}</div>
                    <div class="bill-date">\${bill.dueDate}</div>
                    <div class="bill-status status-\${bill.status}">\${getStatusText(bill.status)}</div>
                    <div class="bill-actions">
                        \${bill.status === 'pending' ? \`
                            <button class="btn btn-primary" onclick="payBill('\${bill.id}')">Pagar</button>
                        \` : bill.status === 'paid' ? \`
                            <button class="btn btn-outline" onclick="downloadBill('\${bill.id}')">Baixar</button>
                        \` : \`
                            <button class="btn btn-danger" onclick="payBill('\${bill.id}')">Pagar Agora</button>
                        \`}
                    </div>
                </div>
            \`).join('');
        }

        function updateSummary(bills) {
            const totalOpen = bills.filter(b => b.status === 'pending' || b.status === 'overdue')
                                   .reduce((sum, b) => sum + b.amount, 0);
            const paidMonth = bills.filter(b => b.status === 'paid' && b.period.includes('2026'))
                                   .reduce((sum, b) => sum + b.amount, 0);
            const nextDue = bills.filter(b => b.status === 'pending')
                                 .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))[0]?.dueDate || 'N/A';
            const monthlyAvg = bills.length > 0 ? bills.reduce((sum, b) => sum + b.amount, 0) / bills.length : 0;

            document.getElementById('total-open').textContent = 'R$ ' + totalOpen.toFixed(2).replace('.', ',');
            document.getElementById('paid-month').textContent = 'R$ ' + paidMonth.toFixed(2).replace('.', ',');
            document.getElementById('next-due').textContent = nextDue;
            document.getElementById('monthly-avg').textContent = 'R$ ' + monthlyAvg.toFixed(2).replace('.', ',');
        }

        function getStatusText(status) {
            const statuses = {
                'paid': 'Paga',
                'pending': 'Pendente',
                'overdue': 'Vencida'
            };
            return statuses[status] || 'Pendente';
        }

        function loadMockBills() {
            const mockBills = [
                {
                    id: 'FAT-2026-001',
                    description: 'Plano Professional - Janeiro 2026',
                    period: 'Janeiro 2026',
                    amount: 99.00,
                    dueDate: '15/01/2026',
                    status: 'paid'
                },
                {
                    id: 'FAT-2026-002',
                    description: 'SEO Automation Pro',
                    period: 'Janeiro 2026',
                    amount: 149.00,
                    dueDate: '20/01/2026',
                    status: 'pending'
                },
                {
                    id: 'FAT-2025-012',
                    description: 'Plano Professional - Dezembro 2025',
                    period: 'Dezembro 2025',
                    amount: 99.00,
                    dueDate: '15/12/2025',
                    status: 'paid'
                },
                {
                    id: 'FAT-2025-011',
                    description: 'Analytics Pro',
                    period: 'Dezembro 2025',
                    amount: 79.00,
                    dueDate: '18/12/2025',
                    status: 'overdue'
                }
            ];

            renderBills(mockBills);
            updateSummary(mockBills);
        }

        function payBill(billId) {
            if (confirm('Deseja proceder com o pagamento desta fatura?')) {
                alert('Redirecionando para gateway de pagamento...');
                // Implement payment logic
            }
        }

        function downloadBill(billId) {
            alert('Download da fatura em PDF será iniciado.');
            // Implement download logic
        }

        function applyFilters() {
            const status = document.getElementById('status-filter').value;
            const period = document.getElementById('period-filter').value;

            console.log('Aplicando filtros:', { status, period });
            // Reload bills with filters
            loadBills();
        }

        function exportBills() {
            alert('Funcionalidade de exportação será implementada em breve.');
        }

        // Initialize
        loadBills();
    <\/script> `], ["  ", `<div style="padding: 2rem; max-width: 1400px; margin: 0 auto;" data-astro-cid-lqa55j6u> <!-- Header --> <div class="bills-header" data-astro-cid-lqa55j6u> <h1 data-astro-cid-lqa55j6u>💰 Minhas Faturas</h1> <p data-astro-cid-lqa55j6u>Acompanhe e gerencie todos os seus pagamentos</p> </div> <!-- Summary --> <div class="bills-summary" data-astro-cid-lqa55j6u> <div class="summary-card" data-astro-cid-lqa55j6u> <div class="summary-header" data-astro-cid-lqa55j6u> <div class="summary-icon" data-astro-cid-lqa55j6u>💰</div> <div class="summary-title" data-astro-cid-lqa55j6u>Total em Aberto</div> </div> <div class="summary-value" id="total-open" data-astro-cid-lqa55j6u>R$ 0</div> <div class="summary-desc" data-astro-cid-lqa55j6u>
Faturas pendentes de pagamento
</div> </div> <div class="summary-card" data-astro-cid-lqa55j6u> <div class="summary-header" data-astro-cid-lqa55j6u> <div class="summary-icon" data-astro-cid-lqa55j6u>✅</div> <div class="summary-title" data-astro-cid-lqa55j6u>Pago este Mês</div> </div> <div class="summary-value" id="paid-month" data-astro-cid-lqa55j6u>R$ 0</div> <div class="summary-desc" data-astro-cid-lqa55j6u>
Total pago no mês atual
</div> </div> <div class="summary-card" data-astro-cid-lqa55j6u> <div class="summary-header" data-astro-cid-lqa55j6u> <div class="summary-icon" data-astro-cid-lqa55j6u>📊</div> <div class="summary-title" data-astro-cid-lqa55j6u>Próximo Vencimento</div> </div> <div class="summary-value" id="next-due" data-astro-cid-lqa55j6u>N/A</div> <div class="summary-desc" data-astro-cid-lqa55j6u>
Data do próximo pagamento
</div> </div> <div class="summary-card" data-astro-cid-lqa55j6u> <div class="summary-header" data-astro-cid-lqa55j6u> <div class="summary-icon" data-astro-cid-lqa55j6u>📈</div> <div class="summary-title" data-astro-cid-lqa55j6u>Média Mensal</div> </div> <div class="summary-value" id="monthly-avg" data-astro-cid-lqa55j6u>R$ 0</div> <div class="summary-desc" data-astro-cid-lqa55j6u>
Gasto médio por mês
</div> </div> </div> <!-- Filters --> <div class="filters-section" data-astro-cid-lqa55j6u> <div class="filters-grid" data-astro-cid-lqa55j6u> <div class="filter-group" data-astro-cid-lqa55j6u> <label class="filter-label" data-astro-cid-lqa55j6u>Status</label> <select class="filter-select" id="status-filter" data-astro-cid-lqa55j6u> <option value="all" selected data-astro-cid-lqa55j6u>Todas as faturas</option> <option value="paid" data-astro-cid-lqa55j6u>Pagas</option> <option value="pending" data-astro-cid-lqa55j6u>Pendentes</option> <option value="overdue" data-astro-cid-lqa55j6u>Vencidas</option> </select> </div> <div class="filter-group" data-astro-cid-lqa55j6u> <label class="filter-label" data-astro-cid-lqa55j6u>Período</label> <select class="filter-select" id="period-filter" data-astro-cid-lqa55j6u> <option value="all" selected data-astro-cid-lqa55j6u>Todos os períodos</option> <option value="current-month" data-astro-cid-lqa55j6u>Mês atual</option> <option value="last-month" data-astro-cid-lqa55j6u>Mês passado</option> <option value="last-3-months" data-astro-cid-lqa55j6u>Últimos 3 meses</option> <option value="last-year" data-astro-cid-lqa55j6u>Último ano</option> </select> </div> <div class="filter-group" data-astro-cid-lqa55j6u> <button class="btn btn-primary" onclick="applyFilters()" data-astro-cid-lqa55j6u>Aplicar Filtros</button> </div> </div> </div> <!-- Bills Table --> <div class="bills-table" data-astro-cid-lqa55j6u> <div class="table-header" data-astro-cid-lqa55j6u> <h3 data-astro-cid-lqa55j6u>Faturas Recentes</h3> <button class="btn btn-outline" onclick="exportBills()" data-astro-cid-lqa55j6u>Exportar</button> </div> <div class="bills-list" id="bills-list" data-astro-cid-lqa55j6u> <!-- Bills will be loaded here --> </div> </div> </div> <script>
        async function loadBills() {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(\\\`\\\${API_URL}/api/bills\\\`, {
                    headers: { 'Authorization': token }
                });
                const bills = await res.json();
                renderBills(bills);
                updateSummary(bills);
            } catch (e) {
                console.error('Error loading bills, using mock data', e);
                loadMockBills();
            }
        }

        function renderBills(bills) {
            const billsList = document.getElementById('bills-list');

            if (bills.length === 0) {
                billsList.innerHTML = \\\`
                    <div class="empty-state">
                        <h3>📭 Nenhuma fatura encontrada</h3>
                        <p>Não há faturas para exibir com os filtros atuais.</p>
                    </div>
                \\\`;
                return;
            }

            billsList.innerHTML = bills.map(bill => \\\`
                <div class="bill-item">
                    <div class="bill-info">
                        <h4>\\\${bill.description}</h4>
                        <p>ID: \\\${bill.id} • \\\${bill.period}</p>
                    </div>
                    <div class="bill-amount">R$ \\\${bill.amount}</div>
                    <div class="bill-date">\\\${bill.dueDate}</div>
                    <div class="bill-status status-\\\${bill.status}">\\\${getStatusText(bill.status)}</div>
                    <div class="bill-actions">
                        \\\${bill.status === 'pending' ? \\\`
                            <button class="btn btn-primary" onclick="payBill('\\\${bill.id}')">Pagar</button>
                        \\\` : bill.status === 'paid' ? \\\`
                            <button class="btn btn-outline" onclick="downloadBill('\\\${bill.id}')">Baixar</button>
                        \\\` : \\\`
                            <button class="btn btn-danger" onclick="payBill('\\\${bill.id}')">Pagar Agora</button>
                        \\\`}
                    </div>
                </div>
            \\\`).join('');
        }

        function updateSummary(bills) {
            const totalOpen = bills.filter(b => b.status === 'pending' || b.status === 'overdue')
                                   .reduce((sum, b) => sum + b.amount, 0);
            const paidMonth = bills.filter(b => b.status === 'paid' && b.period.includes('2026'))
                                   .reduce((sum, b) => sum + b.amount, 0);
            const nextDue = bills.filter(b => b.status === 'pending')
                                 .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))[0]?.dueDate || 'N/A';
            const monthlyAvg = bills.length > 0 ? bills.reduce((sum, b) => sum + b.amount, 0) / bills.length : 0;

            document.getElementById('total-open').textContent = 'R$ ' + totalOpen.toFixed(2).replace('.', ',');
            document.getElementById('paid-month').textContent = 'R$ ' + paidMonth.toFixed(2).replace('.', ',');
            document.getElementById('next-due').textContent = nextDue;
            document.getElementById('monthly-avg').textContent = 'R$ ' + monthlyAvg.toFixed(2).replace('.', ',');
        }

        function getStatusText(status) {
            const statuses = {
                'paid': 'Paga',
                'pending': 'Pendente',
                'overdue': 'Vencida'
            };
            return statuses[status] || 'Pendente';
        }

        function loadMockBills() {
            const mockBills = [
                {
                    id: 'FAT-2026-001',
                    description: 'Plano Professional - Janeiro 2026',
                    period: 'Janeiro 2026',
                    amount: 99.00,
                    dueDate: '15/01/2026',
                    status: 'paid'
                },
                {
                    id: 'FAT-2026-002',
                    description: 'SEO Automation Pro',
                    period: 'Janeiro 2026',
                    amount: 149.00,
                    dueDate: '20/01/2026',
                    status: 'pending'
                },
                {
                    id: 'FAT-2025-012',
                    description: 'Plano Professional - Dezembro 2025',
                    period: 'Dezembro 2025',
                    amount: 99.00,
                    dueDate: '15/12/2025',
                    status: 'paid'
                },
                {
                    id: 'FAT-2025-011',
                    description: 'Analytics Pro',
                    period: 'Dezembro 2025',
                    amount: 79.00,
                    dueDate: '18/12/2025',
                    status: 'overdue'
                }
            ];

            renderBills(mockBills);
            updateSummary(mockBills);
        }

        function payBill(billId) {
            if (confirm('Deseja proceder com o pagamento desta fatura?')) {
                alert('Redirecionando para gateway de pagamento...');
                // Implement payment logic
            }
        }

        function downloadBill(billId) {
            alert('Download da fatura em PDF será iniciado.');
            // Implement download logic
        }

        function applyFilters() {
            const status = document.getElementById('status-filter').value;
            const period = document.getElementById('period-filter').value;

            console.log('Aplicando filtros:', { status, period });
            // Reload bills with filters
            loadBills();
        }

        function exportBills() {
            alert('Funcionalidade de exportação será implementada em breve.');
        }

        // Initialize
        loadBills();
    <\/script> `])), maybeRenderHead()) })}`;
}, "/home/lele/usenexo/getnexo-site/src/pages/dashboard/faturas.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/dashboard/faturas.astro";
const $$url = "/dashboard/faturas";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Faturas,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
