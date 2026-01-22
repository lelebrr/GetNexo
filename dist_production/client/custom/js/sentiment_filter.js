
// JetNexo Neuro-Semantics
// "We feel what they feel."
// Analyzes sentiment in real-time to prioritize urgent tickets.

class SentimentFilter {
    constructor() {
        this.angerKeywords = ['hate', 'broken', 'stupid', 'scam', 'refund', 'wait', 'annoyed', 'frustrated', 'slow', 'bug', 'error', 'terrible', 'worst', 'angry', 'mad', 'furious'];
        this.loveKeywords = ['great', 'awesome', 'thanks', 'love', 'fast', 'excellent', 'perfect', 'amazing', 'fantastic', 'happy', 'satisfied', 'wonderful'];
        this.frustrationKeywords = ['not working', 'doesn\'t work', 'can\'t', 'won\'t', 'fail', 'crash', 'stuck'];
        this.satisfactionKeywords = ['works well', 'easy', 'smooth', 'helpful', 'responsive'];
        this.emojiMap = {
            '😊': 1, '😀': 1, '😍': 2, '❤️': 1, '👍': 1, '🙌': 1,
            '😢': -1, '😠': -2, '😡': -2, '👎': -1, '💔': -1, '😞': -1
        };
    }

    analyze(text) {
        let score = 0; // 0 = Neutral, >0 = Happy/Satisfied, <0 = Angry/Frustrated

        const lowerText = text.toLowerCase();
        const words = lowerText.split(' ');

        // Analyze keywords
        words.forEach(w => {
            if (this.angerKeywords.includes(w)) score -= 2;
            if (this.loveKeywords.includes(w)) score += 1;
            if (this.frustrationKeywords.some(f => lowerText.includes(f))) score -= 1.5;
            if (this.satisfactionKeywords.some(s => lowerText.includes(s))) score += 1.5;
        });

        // Analyze emojis
        for (const [emoji, value] of Object.entries(this.emojiMap)) {
            if (text.includes(emoji)) score += value;
        }

        // Detect negation (simple)
        if (lowerText.includes('not') || lowerText.includes('não')) {
            score *= -0.5; // Reduce intensity
        }

        const packet = {
            text: text,
            score: Math.round(score * 10) / 10, // Round to 1 decimal
            sentiment: this.getSentiment(score),
            priority: this.getPriority(score),
            action: this.getAction(score)
        };

        console.log("🧠 [Semantics] Analysis Result:", packet);
        return packet;
    }

    getSentiment(score) {
        if (score > 1) return 'POSITIVE';
        if (score < -1) return 'NEGATIVE';
        return 'NEUTRAL';
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
