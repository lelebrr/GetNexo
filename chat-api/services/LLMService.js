const axios = require('axios');

class LLMService {
    constructor() {
        // DeepSeek / OpenAI Compatible
        this.deepSeekKey = process.env.DEEPSEEK_API_KEY;
        this.deepSeekUrl = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions';

        // Google / Gemini
        this.googleKey = process.env.GOOGLE_API_KEY;
        this.googleUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
    }

    async analyzeSEO(seoData) {
        if (!this.deepSeekKey) {
            return this._mockSEOResponse(seoData);
        }

        try {
            const prompt = `
                Analyze the following SEO metrics for a website and provide 3 actionable recommendations and a summary.
                Data: ${JSON.stringify(seoData)}
                Format: JSON { recommendations: [{ type, message, priority }], summary: string }
            `;

            const response = await axios.post(this.deepSeekUrl, {
                model: "deepseek-chat",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7
            }, {
                headers: { 'Authorization': `Bearer ${this.deepSeekKey}` }
            });

            return JSON.parse(response.data.choices[0].message.content);
        } catch (error) {
            console.error('LLM SEO Error:', error.message);
            return this._mockSEOResponse(seoData);
        }
    }

    async analyzeSecurity(securityData) {
        if (!this.googleKey) {
            return this._mockSecurityResponse(securityData);
        }

        try {
             // Implementation for Gemini
             const prompt = `Analyze this security log summary and provide a risk assessment insight. Data: ${JSON.stringify(securityData)}`;
             const url = `${this.googleUrl}?key=${this.googleKey}`;

             const response = await axios.post(url, {
                 contents: [{ parts: [{ text: prompt }] }]
             });

             return response.data.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error('LLM Security Error:', error.message);
            return this._mockSecurityResponse(securityData);
        }
    }

    _mockSEOResponse(data) {
        // Heuristic fallback based on real data
        const recs = [];
        if (!data.h1) recs.push({ type: 'Content', message: 'H1 tag is missing. Add a main heading.', priority: 'High' });
        else if (data.h1.length < 10) recs.push({ type: 'Content', message: 'H1 tag is too short. Make it descriptive.', priority: 'Medium' });

        if (!data.description) recs.push({ type: 'Meta', message: 'Meta Description missing.', priority: 'High' });

        if (data.loadTime > 2000) recs.push({ type: 'Technical', message: `Load time is high (${data.loadTime}ms). Optimize images.`, priority: 'High' });

        return {
            recommendations: recs.length ? recs : [{ type: 'General', message: 'SEO looks good based on basic technical checks.', priority: 'Low' }],
            summary: 'Analysis performed by internal rule engine (AI unavailable).'
        };
    }

    _mockSecurityResponse(data) {
        if (data.failed_logins > 5) return "High number of failed logins detected. Suggest enabling stricter rate limiting.";
        return "System activity appears normal. No immediate threats detected based on current logs.";
    }
}

module.exports = new LLMService();
