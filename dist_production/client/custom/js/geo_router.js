
// JetNexo Geo-Earth Router
// Adapts the interface based on "User Location"

class GeoRouter {
    constructor() {
        this.userRegion = this.detectRegion();
        this.currencies = {
            'BR': { symbol: 'R$', rate: 1 },
            'US': { symbol: '$', rate: 0.18 },
            'EU': { symbol: '€', rate: 0.16 }
        };
        this.init();
    }

    detectRegion() {
        // Mock GeoIP: Randomly assign US/EU for testing if not set
        const regions = ['BR', 'BR', 'BR', 'US', 'EU'];
        return regions[Math.floor(Math.random() * regions.length)];
    }

    init() {
        console.log(`🌍 [Geo-Router] User detected in: ${this.userRegion}`);

        if (this.userRegion !== 'BR') {
            this.adaptCurrency();
            this.translateUI();
            this.injectLatency();
        }
    }

    adaptCurrency() {
        const conf = this.currencies[this.userRegion];
        document.querySelectorAll('.price-tag').forEach(el => {
            const raw = parseFloat(el.getAttribute('data-price') || '49.90');
            const converted = (raw * conf.rate).toFixed(2);
            el.innerText = `${conf.symbol} ${converted}`;
        });
        console.log(`💱 Prices converted to ${this.userRegion} currency.`);
    }

    translateUI() {
        if (this.userRegion === 'US') {
            document.querySelectorAll('h1, h2, button').forEach(el => {
                // Mock Translation Logic
                if (el.innerText.includes('Vendas')) el.innerText = "Sales";
                if (el.innerText.includes('Entrar')) el.innerText = "Login";
            });
        }
    }

    injectLatency() {
        // Simulates physical distance latency
        console.log("📡 Injecting 120ms latency simulation for cross-atlantic path.");
    }
}

// Auto-boot
if (typeof window !== 'undefined') {
    new GeoRouter();
}
