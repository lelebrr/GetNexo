// dynamic Black Friday Engine
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Check Redis Flag (simulated via API call)
    // const response = await fetch('/api/check-bf-mode');
    // const { active } = await response.json();
    const active = true; // Force True for Demo

    if (active) {
        enableBlackFridayMode();
    }
});

function enableBlackFridayMode() {
    console.log("⚫ BLACK FRIDAY MODE ACTIVATED");

    // 1. Discount Override (80% OFF)
    document.querySelectorAll('.price').forEach(el => {
        const original = el.innerText;
        el.innerHTML = `<span style="text-decoration:line-through;opacity:0.6">${original}</span> <span style="color:#FF0000;font-weight:bold;font-size:1.2em">80% OFF</span>`;
    });

    // 2. Real-time Countdown (Top Bar)
    const bar = document.createElement('div');
    bar.style.cssText = "position:fixed;top:0;left:0;width:100%;background:#000;color:#FFD500;text-align:center;padding:10px;font-weight:bold;z-index:99999;border-bottom:2px solid #FFD500;";
    bar.id = 'bf-countdown';
    document.body.prepend(bar);

    setInterval(() => {
        const now = new Date();
        const end = new Date();
        end.setHours(23, 59, 59);

        const diff = end - now;
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);

        bar.innerText = `🔥 BLACK FRIDAY USE NEXO: Só mais ${h}h ${m}m ${s}s! 80% DE DESCONTO AGORA! 🔥`;
    }, 1000);

    // 3. Chat Upsell Injection
    // Using Chatwoot SDK to send proactive message
    setTimeout(() => {
        if (window.$chatwoot) {
            window.$chatwoot.toggle(true);
            // Simulate agent message
            console.log("🤖 AI Agent: 'Ei, vi que está olhando os preços. Liberei um domínio grátis se fechar agora!'");
        }
    }, 5000);
}
