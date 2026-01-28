const axios = require('axios');

class LLMService {
    constructor() {
        this.deepSeekKey = process.env.DEEPSEEK_API_KEY;
        this.deepSeekUrl = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions';
        this.googleKey = process.env.GOOGLE_API_KEY;
        this.googleUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
    }

    async analyzeSEO(seoData) {
        const prompt = `
            Analyze the following SEO metrics for a website in the "${seoData.niche}" niche.
            Data: ${JSON.stringify(seoData)}
            
            Tasks:
            1. Provide 3-5 actionable SEO recommendations.
            2. Suggest 5 high-value keywords to target based on niche and current keywords.
            3. List 3 potential competitors in the "${seoData.niche}" industry and what they do better.
            4. Provide a summary of current performance.

            Format your response as a JSON object:
            {
                "recommendations": [{ "type": "Meta|Technical|Content", "message": "...", "priority": "High|Medium|Low" }],
                "suggested_keywords": ["keyword1", "keyword2", ...],
                "competitors": [{ "name": "...", "advantage": "..." }],
                "summary": "..."
            }
        `;

        if (!this.deepSeekKey) return this._mockSEOResponse(seoData);

        try {
            const response = await axios.post(this.deepSeekUrl, {
                model: "deepseek-chat",
                messages: [{ role: "user", content: prompt }],
                response_format: { type: "json_object" },
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
        const prompt = `
            Analyze this security snapshot for an e-commerce platform.
            Data: ${JSON.stringify(securityData)}
            
            Identify:
            1. Any immediate threats (Brute force, DDoS patterns, SQLi attempts).
            2. Recommendations for fixing vulnerabilities.
            3. Risk level assessment (0-100).
            4. Suspicious activity summary.

            Format: JSON { threats: [], recommendations: [], risk_score: number, summary: string }
        `;

        if (!this.googleKey) return this._mockSecurityResponse(securityData);

        try {
            const url = `${this.googleUrl}?key=${this.googleKey}`;
            const response = await axios.post(url, {
                contents: [{ parts: [{ text: prompt }] }]
            });

            // Extract JSON from Gemini response (might need cleaning)
            let text = response.data.candidates[0].content.parts[0].text;
            text = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(text);
        } catch (error) {
            console.error('LLM Security Error:', error.message);
            return this._mockSecurityResponse(securityData);
        }
    }

    _mockSEOResponse(data) {
        const recs = [];
        if (!data.h1) recs.push({ type: 'Content', message: 'H1 tag is missing. Add a main heading.', priority: 'High' });
        if (!data.description) recs.push({ type: 'Meta', message: 'Meta Description missing.', priority: 'High' });
        if (data.loadTime > 1500) recs.push({ type: 'Technical', message: `Load time is high (${data.loadTime}ms).`, priority: 'Medium' });

        return {
            recommendations: recs.length ? recs : [{ type: 'General', message: 'SEO looks good based on technical checks.', priority: 'Low' }],
            suggested_keywords: ['automacao whatsapp', 'ia para vendas', 'chatbot inteligente', 'crm integrado', 'nexo api'],
            competitors: [
                { name: 'Z-API', advantage: 'API stable and well documented' },
                { name: 'WPPConnect', advantage: 'Open source community support' },
                { name: 'Evolution API', advantage: 'High performance GO implementation' }
            ],
            summary: 'Analysis based on internal heuristics. AI keys missing for real-time market research.'
        };
    }

    _mockSecurityResponse(data) {
        const threats = [];
        if (data.auth_failures_1h > 10) threats.push('Potential Brute Force attempt detected on login endpoints.');
        if (data.suspicious_ips_found > 0) threats.push('High traffic volume from specific IPs reaching thresholds.');

        return {
            threats: threats.length ? threats : ['No immediate critical threats detected.'],
            recommendations: ['Enable 2FA for admin accounts', 'Review IP block list', 'Monitor server error logs'],
            risk_score: data.threat_level === 'High' ? 85 : (data.threat_level === 'Medium' ? 45 : 10),
            summary: 'Security snapshot based on database event analysis.'
        };
    }
}

module.exports = new LLMService();
