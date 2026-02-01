// Final Implementation - Admin Dashboard JS
const apiBase = 'http://localhost:3000/api/admin/v1';
let adminToken = localStorage.getItem('adminToken');
let mainChart = null;

// Ensure Token
if (!adminToken) {
    adminToken = prompt("Enter Admin JWT:");
    if (adminToken) localStorage.setItem('adminToken', adminToken);
}

// Sidebar logic
document.querySelectorAll('.has-sub > a').forEach(item => {
    item.addEventListener('click', e => {
        const parent = item.parentElement;
        parent.classList.toggle('open');
    });
});

// Routing
function navigate(viewName) {
    // UI state
    document.querySelectorAll('[id^="view-"]').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.menu-item').forEach(el => el.classList.remove('active'));

    const viewMap = {
        'dashboard': { id: 'view-dashboard', title: 'Dashboard Principal', el: 'menu-dashboard' },
        'clients': { id: 'view-clients', title: 'Clientes & Pods', el: 'menu-docker' },
        'logs': { id: 'view-logs', title: 'Logs do Sistema', el: 'menu-logs' },
        'billing': { id: 'view-billing', title: 'Faturamento Extra', el: 'menu-docker' },
        'autoscale': { id: 'view-autoscale', title: 'Auto-Escala', el: 'menu-docker' }
    };

    const config = viewMap[viewName];
    if (config) {
        document.getElementById(config.id).classList.remove('hidden');
        document.getElementById('pageTitle').innerText = config.title;
        if (config.el) document.getElementById(config.el).classList.add('active');

        // Data Loaders
        if (viewName === 'dashboard') initDashboard();
        if (viewName === 'clients') refreshClients();
        if (viewName === 'logs') initLogsView();
        if (viewName === 'billing') loadBilling();
    } else {
        document.getElementById('view-placeholder').classList.remove('hidden');
        document.getElementById('placeholder-name').innerText = viewName;
        document.getElementById('pageTitle').innerText = 'Em Construção';
    }
}

// --- DATA LOADERS ---

function getAuth() {
    return { 'Authorization': `Bearer ${adminToken}`, 'Content-Type': 'application/json' };
}

async function initDashboard() {
    try {
        const clients = await fetch(`${apiBase}/all-clients`, { headers: getAuth() }).then(r => r.json());
        const summary = await fetch(`${apiBase}/metrics/summary`, { headers: getAuth() }).then(r => r.json());

        // Stats
        document.getElementById('stat-containers').innerText = clients.length;
        const totalMem = clients.reduce((acc, c) => acc + (c.memory_used || 0), 0);
        document.getElementById('stat-memory').innerText = (totalMem / (clients.length || 1)).toFixed(0) + " MB";
        const totalMsg = clients.reduce((acc, c) => acc + (c.messages_last_24h || 0), 0);
        document.getElementById('stat-messages').innerText = totalMsg;

        let billing = 0;
        clients.forEach(c => { if (c.memory_used > 1024) billing += (c.memory_used - 1024) * 0.02; });
        document.getElementById('stat-billing').innerText = billing.toFixed(2);

        // Chart
        renderChart(summary);
    } catch (e) { console.error(e); }
}

function renderChart(data) {
    if (mainChart) mainChart.destroy();

    const options = {
        series: [
            { name: 'Memória (MB)', data: data.map(d => d.mem) },
            { name: 'Mensagens', data: data.map(d => d.messages) }
        ],
        chart: { type: 'area', height: 350, toolbar: { show: false }, zoom: { enabled: false }, background: 'transparent' },
        colors: ['#00bfff', '#51cf66'],
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: 2 },
        xaxis: { categories: data.map(d => new Date(d.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })) },
        grid: { borderColor: '#f1f1f1' },
        tooltip: { theme: 'light' }
    };

    mainChart = new ApexCharts(document.querySelector("#main-chart"), options);
    mainChart.render();
}

async function refreshClients() {
    const tbody = document.querySelector('#tabela-clients tbody');
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Buscando dados em tempo real...</td></tr>';

    try {
        const clients = await fetch(`${apiBase}/all-clients`, { headers: getAuth() }).then(r => r.json());
        tbody.innerHTML = '';
        clients.forEach(c => {
            const tr = document.createElement('tr');
            const statusClass = c.docker_status === 'running' ? 'badge-success' : 'badge-danger';
            tr.innerHTML = `
                <td><code>${c.client_id}</code></td>
                <td><b>${c.nome_loja}</b></td>
                <td>${c.memory_used || 128} MB / <small>0.25 vCPU</small></td>
                <td><span class="badge ${statusClass}">${c.docker_status}</span></td>
                <td>
                    <button class="btn btn-outline" onclick="viewClientLogs('${c.client_id}')">Logs</button>
                    <button class="btn btn-primary" onclick="restartContainer('${c.client_id}')">Reiniciar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (e) { tbody.innerHTML = `<tr><td colspan="5" style="color:red;">Erro: ${e.message}</td></tr>`; }
}

function initLogsView() {
    fetch(`${apiBase}/all-clients`, { headers: getAuth() })
        .then(r => r.json())
        .then(clients => {
            const select = document.getElementById('log-client-select');
            select.innerHTML = clients.map(c => `<option value="${c.client_id}">${c.nome_loja} (${c.client_id})</option>`).join('');
        });
}

function viewClientLogs(id) {
    window.location.hash = '#logs';
    setTimeout(() => {
        document.getElementById('log-client-select').value = id;
        loadLogs();
    }, 100);
}

async function loadLogs() {
    const clientId = document.getElementById('log-client-select').value;
    const consoleEl = document.getElementById('log-console');
    consoleEl.innerHTML = 'Carregando logs do container...';

    try {
        const logs = await fetch(`${apiBase}/docker/logs/${clientId}`, { headers: getAuth() }).then(r => r.text());
        consoleEl.innerHTML = logs.split('\n').map(l => `<div class="log-line">${l}</div>`).join('');
        consoleEl.scrollTop = consoleEl.scrollHeight;
    } catch (e) { consoleEl.innerHTML = `<span style="color:red;">Erro ao obter logs: ${e.message}</span>`; }
}

async function loadBilling() {
    const tbody = document.querySelector('#tabela-billing tbody');
    tbody.innerHTML = '';
    try {
        const history = await fetch(`${apiBase}/billing/history`, { headers: getAuth() }).then(r => r.json());
        history.forEach(b => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${b.mes}</td>
                <td>${b.nome_loja}</td>
                <td style="color:#e03131; font-weight:bold;">R$ ${b.valor_extra.toFixed(2)}</td>
                <td>${new Date(b.created_at).toLocaleDateString()}</td>
             `;
            tbody.appendChild(tr);
        });
    } catch (e) { console.error(e); }
}

async function restartContainer(id) {
    if (!confirm("Tem certeza?")) return;
    const res = await fetch(`${apiBase}/restart`, {
        method: 'POST',
        headers: getAuth(),
        body: JSON.stringify({ client_id: id })
    }).then(r => r.json());
    alert(res.message || res.error);
    refreshClients();
}

function logout() { localStorage.removeItem('adminToken'); location.reload(); }

// Hash handling
window.onhashchange = () => {
    const h = window.location.hash.replace('#', '');
    if (!h || h === 'dashboard') navigate('dashboard');
    else if (h.startsWith('docker/')) navigate(h.split('/')[1]);
    else navigate(h);
};

// Start
window.onhashchange();
if (!window.location.hash) navigate('dashboard');
