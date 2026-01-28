const axios = require('axios');
const cheerio = require('cheerio');
const db = require('../db');

class SeoAnalyzer {
    async analyze(url) {
        const startTime = Date.now();
        try {
            const res = await axios.get(url, {
                timeout: 5000,
                headers: { 'User-Agent': 'GetNexo-SEO-Bot/1.0' }
            });
            const loadTime = Date.now() - startTime;
            const $ = cheerio.load(res.data);

            const title = $('title').text().trim();
            const description = $('meta[name="description"]').attr('content') || '';
            const h1 = $('h1').first().text().trim();
            const images = $('img').length;
            const imagesWithoutAlt = $('img:not([alt])').length;
            const links = $('a').length;

            // Simple Keyword Extraction
            const text = $('body').text();
            const words = text.toLowerCase().match(/\b(\w{4,})\b/g) || [];
            const freq = {};
            words.forEach(w => freq[w] = (freq[w] || 0) + 1);
            const topKeywords = Object.entries(freq)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(e => e[0]);

            // Visits from analytics_logs
            const now = new Date();
            const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
            const visits7d = db.prepare("SELECT COUNT(*) as count FROM analytics_logs WHERE created_at >= ?").get(last7d).count;

            // Score Calculation Rule
            let score = 100;
            if (!title) score -= 20;
            if (!description) score -= 15;
            if (!h1) score -= 15;
            if (imagesWithoutAlt > 0) score -= 10;
            if (loadTime > 1500) score -= 10;
            if (loadTime > 3000) score -= 10;

            const niche = db.prepare("SELECT value FROM settings WHERE key = 'store_name'").get()?.value || 'E-commerce';

            return {
                url,
                loadTime,
                title,
                description,
                h1,
                images: { total: images, missing_alt: imagesWithoutAlt },
                links,
                top_keywords: topKeywords,
                visits_last_7d: visits7d,
                niche,
                score: Math.max(0, score),
                health_status: score > 80 ? 'Excellent' : (score > 50 ? 'Fair' : 'Critical')
            };

        } catch (error) {
            console.error('SEO Analyzer Error:', error.message);
            return {
                error: error.message,
                score: 0,
                images: { total: 0, missing_alt: 0 },
                health_status: 'Unreachable',
                top_keywords: [],
                visits_last_7d: 0
            };
        }
    }
}

module.exports = new SeoAnalyzer();
