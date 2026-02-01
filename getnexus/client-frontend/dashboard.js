let clienteToken = localStorage.getItem('token');
const apiBase = 'http://localhost:3000/api/v1';

function updateUI() {
    if (clienteToken) {
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('dashboardSection').style.display = 'block';
        carregarDados();
    } else {
        document.getElementById('loginSection').style.display = 'block';
        document.getElementById('dashboardSection').style.display = 'none';
    }
}

function fazerLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch(`${apiBase}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
        .then(r => r.json())
        .then(data => {
            if (data.token) {
                clienteToken = data.token;
                localStorage.setItem('token', clienteToken);
                updateUI();
            } else {
                alert('Erro: ' + data.error);
            }
        });
}

function registrar() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch(`${apiBase}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, nome_loja: 'Loja Teste ' + Date.now() })
    })
        .then(r => r.json())
        .then(data => {
            if (data.token) {
                clienteToken = data.token;
                localStorage.setItem('token', clienteToken);
                updateUI();
            } else {
                alert('Erro: ' + data.error);
            }
        });
}

function carregarDados() {
    // Nome da loja vem do JWT
    try {
        const payload = JSON.parse(atob(clienteToken.split('.')[1]));
        document.getElementById('nomeLoja').textContent = payload.nome_loja;

        // Busca uso
        fetch(`${apiBase}/usage`, {
            headers: { 'Authorization': `Bearer ${clienteToken}` }
        })
            .then(r => r.json())
            .then(dados => {
                document.getElementById('memoria').textContent = `${dados.memory} MB`;
                document.getElementById('msgs').textContent = dados.messages;
                document.getElementById('status').textContent = dados.status;

                if (dados.memory > 1024) {
                    const extra = dados.memory - 1024;
                    document.getElementById('extra').textContent = extra;
                    document.getElementById('valorExtra').textContent = (extra * 0.02).toFixed(2);
                    document.getElementById('alerta').style.display = 'block';
                }
            })
            .catch(e => console.error('Erro uso:', e));
    } catch (e) {
        console.error("Invalid token");
        localStorage.removeItem('token');
        updateUI();
    }
}

// Abre chat ao clicar
function abrirChat() {
    const payload = JSON.parse(atob(clienteToken.split('.')[1]));
    const frame = document.getElementById('chatframe');
    frame.style.display = 'block';
    // Using localhost/chat path just for demo/testing or strict structure
    frame.src = `https://${payload.client_id}.getnexo.app/chat`;
}

updateUI();
