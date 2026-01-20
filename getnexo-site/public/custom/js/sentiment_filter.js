
// JetNexo Neuro-Semantics
// "We feel what they feel."
// Analyzes sentiment in real-time to prioritize urgent tickets.

class SentimentFilter {
    constructor() {
        this.angerKeywords = ['hate', 'broken', 'stupid', 'scam', 'refund', 'wait'];
        this.loveKeywords = ['great', 'awesome', 'thanks', 'love', 'fast'];
    }

    analyze(text) {
        let score = 0; // 0 = Neutral, >0 = Happy, <0 = Angry

        const words = text.toLowerCase().split(' ');

        words.forEach(w => {
            if (this.angerKeywords.includes(w)) score -= 2;
            if (this.loveKeywords.includes(w)) score += 1;
        });

        const packet = {
            text: text,
            score: score,
            priority: this.getPriority(score),
            action: this.getAction(score)
        };

        console.log("🧠 [Semantics] Analysis Result:", packet);
        return packet;
    }

    getPriority(score) {
        if (score <= -2) return 'CRITICAL (DEFCON 1)';
        if (score < 0) return 'HIGH';
        return 'NORMAL';
    }

    getAction(score) {
        if (score <= -2) return '🚨 ROUTE TO SENIOR AGENT IMMEDIATELY';
        if (score > 2) return '⭐ ASK FOR REVIEW';
        return '🤖 AI AUTO-REPLY';
    }
}

// Export for browser or node
if (typeof module !== 'undefined') module.exports = SentimentFilter;
// Browser global
if (typeof window !== 'undefined') window.sentiment = new SentimentFilter();
