// src/components/hooks/useVoice.js
export function useVoice() {
    const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    const isAvailable = synth !== null;

    const speak = (text) => {
        if (!isAvailable) {
            console.warn('SpeechSynthesis não suportado neste navegador');
            return;
        }

        synth.cancel(); // Limpa qualquer fala anterior pra não sobrepor

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';
        utterance.rate = 1.05;      // um pouco mais rápido que o normal
        utterance.pitch = 1.1;      // voz um pouco mais aguda, mais "natural"
        utterance.volume = 1.0;

        utterance.onend = () => console.log('Fala terminada');
        utterance.onerror = (e) => console.error('Erro na fala:', e);

        synth.speak(utterance);
    };

    const stop = () => {
        if (isAvailable) synth.cancel();
    };

    return { speak, stop, isAvailable };
}