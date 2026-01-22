import fs from 'fs';
import path from 'path';

const data = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

// Sitemaps
const sitemaps = [
    { lang: 'pt', file: 'public/sitemap-pt.xml' },
    { lang: 'es', file: 'public/sitemap-es.xml' },
    { lang: 'fr', file: 'public/sitemap-fr.xml' },
    { lang: 'en', file: 'public/sitemap-en.xml' }
];

// Atualiza cada um
sitemaps.forEach(s => {
    const xml = fs.readFileSync(s.file, 'utf8');
    const novaData = xml.replace(/<lastmod>[^<]+<\/lastmod>/g, `<lastmod>${data}</lastmod>`);
    fs.writeFileSync(s.file, novaData, 'utf8');
    console.log(`✅ Atualizado: ${s.lang}`);
});

// Sitemap master será gerado pelo Astro build
console.log('✅ Todos os sitemaps atualizados!');