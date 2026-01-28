const axios = require('axios');
const cheerio = require('cheerio');

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

            // Score Calculation Rule
            let score = 100;
            if (!title) score -= 20;
            if (!description) score -= 15;
            if (!h1) score -= 15;
            if (imagesWithoutAlt > 0) score -= 10;
            if (loadTime > 1500) score -= 10;
            if (loadTime > 3000) score -= 10;

            return {
                url,
                loadTime,
                title,
                description,
                h1,
                images: { total: images, missing_alt: imagesWithoutAlt },
                links,
                score: Math.max(0, score),
                health_status: score > 80 ? 'Excellent' : (score > 50 ? 'Fair' : 'Critical')
            };

        } catch (error) {
            return {
                error: error.message,
                score: 0,
                images: { total: 0, missing_alt: 0 },
                health_status: 'Unreachable'
            };
        }
    }
}

module.exports = new SeoAnalyzer();
