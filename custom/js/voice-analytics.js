// Voice Analytics & Sentiment Engine
// Uses Web Speech API (Browser) + Backend Tone Analyzer

if ('webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'pt-BR';

    let isListening = false;
    const voiceBtn = document.getElementById('voice-trigger');

    if (voiceBtn) {
        voiceBtn.onclick = () => {
            if (isListening) recognition.stop();
            else recognition.start();
            isListening = !isListening;
        };
    }

    recognition.onstart = () => {
        console.log("🎤 Voice Recognition Started");
        document.body.style.border = "5px solid yellow"; // Listening state
    };

    recognition.onend = () => {
        console.log("🎤 Voice Recognition Stopped");
        document.body.style.border = "none";
    };

    recognition.onresult = async (event) => {
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
            }
        }

        if (finalTranscript) {
            console.log("🗣️ User said:", finalTranscript);

            // 1. Send to Tone Analyzer (Mock or n8n)
            try {
                // Mock Analysis (Real implementation would hit /api/tone)
                const sentimentScore = analyzeSentimentLocal(finalTranscript);

                console.log(`📊 Sentiment Score: ${sentimentScore}/10`);
                updateUI(sentimentScore);

                // 2. Send to Chatwoot Widget
                if (window.$chatwoot) {
                    window.$chatwoot.setCustomAttributes({
                        last_sentiment: sentimentScore,
                        last_voice_msg: finalTranscript
                    });
                }
            } catch (e) {
                console.error("Sentiment Analysis Error:", e);
            }
        }
    };
}

function analyzeSentimentLocal(text) {
    // Simple Keyword Matching (Fallback if API is down)
    const badWords = ['cancelar', 'ruim', 'demora', 'caro', 'bosta', 'droga'];
    const goodWords = ['comprar', 'bom', 'legal', 'ótimo', 'maravilha', 'pix'];

    let score = 5; // Neutral
    text = text.toLowerCase();

    badWords.forEach(w => { if (text.includes(w)) score -= 2; });
    goodWords.forEach(w => { if (text.includes(w)) score += 2; });

    return Math.max(0, Math.min(10, score));
}

function updateUI(score) {
    let color = 'gray';
    if (score < 4) color = 'red'; // Anger
    else if (score > 6) color = '#00ff00'; // Happy

    document.body.style.border = `5px solid ${color}`;

    // Toast Notification
    const toast = document.createElement('div');
    toast.innerText = `Sentiment: ${score}/10`;
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.background = color;
    toast.style.color = 'black';
    toast.style.padding = '10px';
    toast.style.borderRadius = '5px';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}
