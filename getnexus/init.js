(function () {
    // Pega o ID do cliente da URL ou do storage
    const params = new URLSearchParams(window.location.search);
    const clientId = params.get('client') || sessionStorage.getItem('getnexo_client');

    if (!clientId) {
        console.warn('GetNexo: nenhum cliente identificado');
        return;
    }

    // Evita rodar duas vezes
    if (document.getElementById('getnexo-widget')) {
        return;
    }

    // Cria o widget flutuante
    const widget = document.createElement('div');
    widget.id = 'getnexo-widget';
    widget.style.position = 'fixed';
    widget.style.bottom = '20px';
    widget.style.right = '20px';
    widget.style.backgroundColor = '#00bfff';
    widget.style.color = 'white';
    widget.style.padding = '12px 18px';
    widget.style.borderRadius = '25px';
    widget.style.fontFamily = 'sans-serif';
    widget.style.fontSize = '14px';
    widget.style.cursor = 'pointer';
    widget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
    widget.style.zIndex = '9999';
    widget.textContent = 'Fale com o bot';

    // Abre o iframe ao clicar
    widget.onclick = () => {
        const iframe = document.createElement('iframe');
        iframe.src = `https://${clientId}.getnexo.app/chat`;
        iframe.style.border = 'none';
        iframe.style.width = '100%';
        iframe.style.height = '100vh';
        iframe.style.position = 'fixed';
        iframe.style.top = '0';
        iframe.style.left = '0';
        iframe.style.background = 'white';
        iframe.style.zIndex = '9999';
        document.body.appendChild(iframe);
    };

    // Fecha o iframe ao clicar fora
    window.addEventListener('click', (e) => {
        if (e.target.tagName === 'HTML') {
            const iframe = document.querySelector('iframe');
            if (iframe) iframe.remove();
        }
    });

    // Salva no storage pra não perder
    sessionStorage.setItem('getnexo_client', clientId);

    // Insere no body
    document.body.appendChild(widget);

    console.log(`✅ GetNexo carregado para o cliente: ${clientId}`);

    // Registra instalação
    fetch('http://localhost:3000/api/v1/install', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            client_id: clientId,
            site_url: window.location.origin,
            timestamp: new Date().toISOString()
        })
    })
        .then(() => console.log('Instalação registrada no GetNexus'))
        .catch(e => console.warn('Falha ao registrar instalação:', e));
})();
