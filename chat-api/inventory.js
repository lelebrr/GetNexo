// --- MULTI-INDUSTRY MOCK DATABASE (HIGH FIDELITY) ---

// Helpers
function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randomItem(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randomPrice(min, max) { return Math.floor(min + Math.random() * (max - min)); }

// UNSPLASH CURATED COLLECTION (Best quality for each niche)
const IMAGES = {
    'moda': ['photo-1515886657613-9f3515b0c78f', 'photo-1529139574466-a302d27460dec', 'photo-1434389677669-e08b4cac3105', 'photo-1483985988355-763728e1935b'],
    'tech': ['photo-1511707171634-5f897ff02aa9', 'photo-1550009158-9ebf69173e03', 'photo-1525547719571-a2d4ac8945e2', 'photo-1593642702821-c8da6771f0c6'],
    'beauty': ['photo-1522335789203-abd316128437', 'photo-1596462502278-27bfdd403348', 'photo-1512496015851-a90fb38ba796'],
    'food': ['photo-1565299624946-b28f40a0ae38', 'photo-1568901346375-23c9450c58cd', 'photo-1555939594-58d7cb561ad1'],
    'furniture': ['photo-1555041469-a586c61ea9bc', 'photo-1567538096630-e0c55bd6374c', 'photo-1524758631624-e2822e304c36'],
    'pet': ['photo-1587559070757-f72a388edbba', 'photo-1583337130417-3346a1be7dee', 'photo-1537151608828-ea2b11777ee8'],
    'service': ['photo-1521791136064-7986c2920216', 'photo-1600880292203-757bb62b4baf']
};

const GENERATORS = {
    'Concessionária': () => {
        // ... Existing Logic Preserved for cars ...
        const CARS_DB = [
            { model: 'Jeep Compass', brand: 'Jeep', img: 'https://images.unsplash.com/photo-1626077388041-33211b30186a?auto=format&fit=crop&w=800&q=80', link360: 'https://carshow360.net/en/jeep/compass/limited-ii-11910' },
            { model: 'Dacia Duster', brand: 'Dacia', img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80', link360: 'https://carshow360.net/en/dacia/duster/extreme-iii-12240' },
            { model: 'Skoda Octavia', brand: 'Skoda', img: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80', link360: 'https://carshow360.net/en/skoda/octavia/iv-sportline-iv-12222' },
            { model: 'Mercedes V-Class', brand: 'Mercedes', img: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80', link360: 'https://carshow360.net/en/mercedes/v/klasa-300d-avantgarde-4matic-w447-12203' },
            { model: 'Porsche 911', brand: 'Porsche', img: 'https://images.unsplash.com/photo-1503376763036-066120622c74?auto=format&fit=crop&w=800&q=80', link360: 'https://carshow360.net/en/porsche/911/carrera-4s-992-11487' },
            { model: 'Renault Rafale', brand: 'Renault', img: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80', link360: 'https://carshow360.net/en/renault/rafale/atelier-alpine-i-12230' }
        ];
        const car = randomItem(CARS_DB);
        return {
            produto: `${car.brand} ${car.model}`,
            detalhes: `Ano ${randomInt(2023, 2025)} | Pronta Entrega`,
            preco: randomPrice(150000, 600000),
            imagem: car.img,
            condicao: 'Novo',
            link_360: car.link360,
            keywords: [car.brand, car.model, 'carro']
        };
    },
    'Moda & Vestuário': () => {
        const TYPES = ['Vestido', 'Blusa', 'Calça', 'Jaqueta', 'Saia', 'Camisa'];
        const ADJS = ['Floral', 'Jeans', 'Couro', 'Linho', 'Seda'];
        const BRANDS = ['Zara', 'H&M', 'Farm', 'Amaro', 'Renner'];
        const prod = `${randomItem(TYPES)} ${randomItem(ADJS)}`;
        const img = randomItem(IMAGES['moda']);
        return {
            produto: `${prod} - ${randomItem(BRANDS)}`,
            detalhes: 'Coleção Verão 2025',
            preco: randomPrice(89, 499),
            imagem: `https://images.unsplash.com/${img}?auto=format&fit=crop&w=800&q=80`,
            keywords: [prod, 'moda', 'roupa']
        };
    },
    'Eletrônicos': () => {
        const PRODS = [
            { n: 'iPhone 15 Pro', b: 'Apple', p: 7000 },
            { n: 'Samsung S24 Ultra', b: 'Samsung', p: 6500 },
            { n: 'MacBook Air M3', b: 'Apple', p: 9000 },
            { n: 'Sony WH-1000XM5', b: 'Sony', p: 2000 }
        ];
        const p = randomItem(PRODS);
        const img = randomItem(IMAGES['tech']);
        return {
            produto: p.n,
            detalhes: 'Novo | Garantia 1 Ano',
            preco: p.p + randomInt(-200, 200),
            imagem: `https://images.unsplash.com/${img}?auto=format&fit=crop&w=800&q=80`,
            keywords: [p.n, p.b, 'eletronico']
        };
    },
    'Imobiliária': () => {
        const TYPES = ['Apartamento', 'Casa', 'Cobertura', 'Loft'];
        const LOCS = ['Jardins', 'Leblon', 'Barra', 'Centro', 'Vila Nova'];
        const link360 = 'https://carshow360.net/en/mercedes/v/klasa-300d-avantgarde-4matic-w447-12203'; // Placeholder for Real Estate 360 if available
        return {
            produto: `${randomItem(TYPES)} em ${randomItem(LOCS)}`,
            detalhes: `${randomInt(50, 200)}m² | ${randomInt(2, 4)} Quartos`,
            preco: randomPrice(250000, 1500000), // Lower range to allow searches like "até 500k"
            imagem: `https://images.unsplash.com/photo-1600596542815-60c37c6525fa?auto=format&fit=crop&w=800&q=80`, // Reliable House ID
            // We can also have 360 for real estate if we had a provider
            link_360: link360,
            keywords: ['imovel', 'casa', 'aluguel']
        };
    },
    'Alimentação/Delivery': () => {
        const ITEMS = ['Combo Família', 'Pizza Grande', 'Sushi Box', 'Hambúrguer Artesanal'];
        const img = randomItem(IMAGES['food']);
        return {
            produto: randomItem(ITEMS),
            detalhes: 'Entrega Grátis hoje',
            preco: randomPrice(30, 120),
            imagem: `https://images.unsplash.com/${img}?auto=format&fit=crop&w=800&q=80`,
            keywords: ['comida', 'fome', 'lanche']
        };
    },
    'Móveis & Decoração': () => {
        const ITEMS = ['Sofá 3 Lugares', 'Mesa de Jantar', 'Poltrona Design', 'Luminária de Piso'];
        const img = randomItem(IMAGES['furniture']);
        return {
            produto: randomItem(ITEMS),
            detalhes: 'Design Exclusivo',
            preco: randomPrice(500, 4000),
            imagem: `https://images.unsplash.com/${img}?auto=format&fit=crop&w=800&q=80`,
            keywords: ['moveis', 'casa', 'decoracao']
        };
    },
    'Cosméticos': () => {
        const ITEMS = ['Kit Skincare', 'Perfume Floral', 'Batom Matte', 'Sérum Facial'];
        const img = randomItem(IMAGES['beauty']);
        return {
            produto: `${randomItem(ITEMS)} Premium`,
            detalhes: 'Fórmula Vegana',
            preco: randomPrice(50, 300),
            imagem: `https://images.unsplash.com/${img}?auto=format&fit=crop&w=800&q=80`,
            keywords: ['beleza', 'maquiagem']
        };
    },
    'Pet Shop': () => {
        const ITEMS = ['Caminha Confort', 'Ração Premium', 'Brinquedo Interativo', 'Coleira Ajustável'];
        const img = randomItem(IMAGES['pet']);
        return {
            produto: randomItem(ITEMS),
            detalhes: 'Satisfação Garantida',
            preco: randomPrice(20, 200),
            imagem: `https://images.unsplash.com/${img}?auto=format&fit=crop&w=800&q=80`,
            keywords: ['pet', 'cachorro', 'gato']
        };
    },
    'Serviços/Infoproduto': () => {
        const ITEMS = ['Curso de Marketing', 'Mentoria Financeira', 'E-book de Receitas', 'Consultoria Online'];
        const img = randomItem(IMAGES['service']);
        return {
            produto: randomItem(ITEMS),
            detalhes: 'Acesso Imediato',
            preco: randomPrice(97, 997),
            imagem: `https://images.unsplash.com/${img}?auto=format&fit=crop&w=800&q=80`,
            keywords: ['curso', 'servico', 'digital']
        };
    },
    'Auto Peças': () => {
        // Reusing mechanic feel
        return {
            produto: `Kit Revisão ${randomItem(['Fiat', 'VW', 'GM'])}`,
            detalhes: 'Óleo + Filtros',
            preco: randomPrice(200, 600),
            imagem: 'https://images.unsplash.com/photo-1486262715619-72a3678760ba?auto=format&fit=crop&w=800&q=80',
            keywords: ['peca', 'carro']
        };
    },
    'Geral': () => ({})
};

function generateIndustryInventory(industry, count = 200) {
    const generator = GENERATORS[industry] || GENERATORS['Geral'];
    let inventory = [];
    // Generate larger inventory for better "Search" feel
    for (let i = 0; i < count; i++) {
        const item = generator();
        if (item.produto) {
            inventory.push({
                id: `${industry.substring(0, 3).toUpperCase()}-${randomInt(10000, 99999)}`,
                ...item
            });
        }
    }
    return inventory;
}

// ... searchInventory logic preserved (just ensures match) ...
function searchInventory(query, industry) {
    if (!industry) industry = 'Geral';
    // Generate fresh robust stock - 200 items is plenty for a "dense" feel in a 1ms execution
    let stock = generateIndustryInventory(industry, 200);

    // Calculate total fictional stock count to show "Scale"
    const totalFakeStock = 1340 + Math.floor(Math.random() * 200);

    const q = query.toLowerCase();
    const matches = stock.filter(item =>
        item.produto.toLowerCase().includes(q) ||
        item.keywords.some(k => k.toLowerCase().includes(q))
    );

    // Fallback if no specific match, show popular items
    const results = (matches.length > 0) ? matches.slice(0, 5) : stock.slice(0, 5);

    let responseText = `(Sistema: O usuário buscou na base de ${totalFakeStock} itens. Encontrei ${matches.length} resultados exatos. Mostrando os melhores:)\n\n`;

    results.forEach(i => {
        responseText += `- ${i.produto} | ${i.detalhes} | R$ ${i.preco.toLocaleString('pt-BR')}`;
        responseText += `\n   -> IMAGEM: ${i.imagem}`;
        if (i.link_360) {
            responseText += `\n   -> 360: ${i.link_360}`;
        }
        responseText += `\n`;
    });
    return responseText;
}

module.exports = { searchInventory };
