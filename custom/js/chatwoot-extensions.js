/**
 * GetNexo Widget Extensions
 * Features: Tone Analyzer (TF.js), Mini-Games, Exit Intent, AR Preview
 */

// --- 1. Tone Analyzer (TensorFlow.js) ---
async function initToneAnalyzer() {
    console.log('🧠 Loading Tone Analyzer...');
    // Note: tfjs and toxicity must be loaded via <script> tags in the widget header
    // <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs"></script>
    // <script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/toxicity"></script>

    const threshold = 0.7;
    const model = await toxicity.load(threshold);

    window.detectTone = async (text) => {
        const predictions = await model.classify(text);
        // Index 6 is usually 'insult' or 'toxicity' depending on model version, generic check here:
        const toxicityScore = Math.max(...predictions.map(p => p.results[0].probabilities[1]));

        let sentiment = 'neutro';
        if (toxicityScore > 0.7) sentiment = 'raiva';
        else if (toxicityScore > 0.4) sentiment = 'frustrado';

        console.log(`Tone Detect: ${sentiment} (${toxicityScore.toFixed(2)})`);

        // Send to n8n Webhook
        if (sentiment !== 'neutro') {
            fetch('/webhook/tone', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text,
                    score: toxicityScore,
                    sentiment,
                    client_id: window.$chatwoot.getUser().id
                })
            });
        }
    };
}

// --- 2. Mini-Game Engine (CSS/JS) ---
const GameEngine = {
    spinWheel: () => {
        // Inject HTML for Wheel if not exists
        if (!document.getElementById('roleta-container')) {
            const div = document.createElement('div');
            div.id = 'roleta-container';
            div.innerHTML = `
        <div id="roleta" style="width:200px;height:200px;background:conic-gradient(#FFD500 0% 50%, #FF0033 50% 100%);border-radius:50%;transition: transform 3s cubic-bezier(0.25, 0.1, 0.25, 1); cursor:pointer;"></div>
        <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:20px;height:20px;background:#000;border-radius:50%;z-index:10;"></div>
      `;
            div.style.cssText = 'position:fixed;bottom:100px;right:20px;background:#fff;padding:10px;border-radius:20px;box-shadow:0 10px 30px rgba(0,0,0,0.3);z-index:9999;';
            document.body.appendChild(div);

            const el = document.getElementById('roleta');
            el.onclick = () => {
                const deg = 1800 + Math.random() * 360; // 5 spins + random
                el.style.transform = `rotate(${deg}deg)`;
                setTimeout(() => {
                    const premios = ['10% OFF', 'Frete Grátis', 'Brinde Surpresa', 'Pontos em Dobro'];
                    const premio = premios[Math.floor(Math.random() * premios.length)];
                    alert(`🎉 Parabéns! Você ganhou: ${premio}`);

                    // Send to n8n
                    fetch('/webhook/game', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            premio,
                            client_id: window.$chatwoot.getUser().id
                        })
                    });

                    div.remove(); // Close after win
                }, 3000);
            };
        }
    }
};

// --- 3. Exit Intent (Mouse Tracking) ---
let exitIntentTriggered = false;
document.addEventListener('mouseleave', (e) => {
    if (e.clientY < 10 && !exitIntentTriggered) {
        exitIntentTriggered = true;
        console.log('🚪 Exit Intent Detected!');

        // Show Custom Popup
        const popup = document.createElement('div');
        popup.innerHTML = `
      <div style="background:#000;color:#fff;padding:2rem;border-radius:10px;text-align:center;border:2px solid #FFD500;">
        <h3 style="color:#FFD500;margin:0 0 1rem 0;">NÃO VÁ EMBORA! 😱</h3>
        <p>Temos um cupom de <strong>15% OFF</strong> esperando por você.</p>
        <button onclick="window.$chatwoot.toggle('open');this.parentElement.remove()" style="background:#FFD500;color:#000;border:none;padding:0.5rem 1rem;border-radius:20px;font-weight:bold;margin-top:1rem;cursor:pointer;">RESGATAR AGORA</button>
      </div>
    `;
        popup.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:10000;box-shadow:0 20px 50px rgba(0,0,0,0.5);';
        document.body.appendChild(popup);

        // Track in n8n
        fetch('/webhook/tracking', {
            method: 'POST',
            body: JSON.stringify({ event: 'exit_intent', url: window.location.href })
        });
    }
});

// Init
window.addEventListener('load', () => {
    console.log('🚀 GetNexo Extensions Loaded');
    // Load TF.js dynamically if needed, or assume present
    // initToneAnalyzer(); 
});

// Expose to window for Chatwoot
window.GetNexo = {
    startGame: GameEngine.spinWheel
};
