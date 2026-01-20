// Neuro-Pricing: The Sales Closer (REAL)
// Detects hesitation and requests real coupon from backend.

(function () {
    let mouseHistory = [];
    let lastTime = Date.now();
    const HESITATION_THRESHOLD = 2000;
    let hasOfferedDiscount = false;

    // API Endpoint (adjust if needed)
    const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:3006' : 'https://api.getnexo.com.br';

    document.addEventListener('mousemove', (e) => {
        if (hasOfferedDiscount) return;
        if (e.clientY < 10) triggerExitIntent();
    });

    async function triggerExitIntent() {
        if (hasOfferedDiscount) return;
        hasOfferedDiscount = true;

        console.log("🧠 Neuro-Engine: Exit Intent Detected. Requesting offer...");

        try {
            // Call Backend
            const res = await fetch(`${API_URL}/api/neuro/offer`, { method: 'POST' });
            const data = await res.json();

            if (data.eligible) {
                showModal(data.code, data.discount);
                if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
            }
        } catch (e) {
            console.error("Neuro Auth Failed:", e);
        }
    }

    function showModal(code, discount) {
        const modal = document.createElement('div');
        modal.innerHTML = `
            <div style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);z-index:99999;display:flex;align-items:center;justify-content:center;">
                <div style="background:#111;border:2px solid #ff0033;padding:2rem;text-align:center;color:white;font-family:'JetBrains Mono';max-width:500px;box-shadow: 0 0 50px rgba(255, 0, 51, 0.3);">
                    <h1 style="color:#ff0033; margin:0;">⚠️ ESPERE. NÃO VÁ.</h1>
                    <p style="margin:1rem 0;">A Kira autorizou uma oferta única para você.</p>
                    <h2 style="font-size:3.5rem;color:#00ff9d;margin:1rem 0;">${discount} OFF</h2>
                    <p style="color:#888; font-size:1.2rem;">Cupom: <strong style="color:white; border:1px dashed white; padding:0.2rem 0.5rem;">${code}</strong></p>
                    <p style="color:#ff0033; font-size:0.8rem;">Expira em 60 segundos</p>
                    
                    <button onclick="this.parentElement.parentElement.remove()" 
                        style="background:#ff0033;color:white;border:none;padding:1rem 2rem;margin-top:1rem;cursor:pointer;font-weight:bold;font-size:1rem;width:100%;">
                        RESGATAR AGORA
                    </button>
                    <button onclick="this.parentElement.parentElement.remove()" 
                        style="background:transparent;color:#666;border:none;padding:1rem;margin-top:0.5rem;cursor:pointer;">
                        Ignorar oferta
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    console.log("🧠 Neuro-Pricing (Real) loaded.");
})();
