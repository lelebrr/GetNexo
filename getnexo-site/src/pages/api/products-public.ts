import type { APIRoute } from 'astro';

// Mock data for products - replace with real database
const products = [
    { id: 1, name: 'Plugin WooCommerce', price: 97.00, stock: 100, category: 'ecommerce', image: '/images/woocommerce.png' },
    { id: 2, name: 'Plugin Shopify', price: 127.00, stock: 50, category: 'ecommerce', image: '/images/shopify.png' },
    { id: 3, name: 'Pacote Revenda Ouro', price: 997.00, stock: 10, category: 'revenda', image: '/images/pacote-ouro.png' },
    { id: 4, name: 'Tênis Branco', price: 199.90, stock: 25, category: 'moda', image: '/images/tenis-branco.png' },
    { id: 5, name: 'Tênis Preto', price: 199.90, stock: 30, category: 'moda', image: '/images/tenis-preto.png' },
    { id: 6, name: 'Bota Marrom', price: 299.90, stock: 15, category: 'moda', image: '/images/bota-marrom.png' },
    { id: 7, name: 'Chinelo Simples', price: 49.90, stock: 100, category: 'moda', image: '/images/chinelo.png' },
    { id: 8, name: 'Salto Bege', price: 399.90, stock: 20, category: 'moda', image: '/images/salto-bege.png' },
    { id: 9, name: 'Camiseta Branca', price: 79.90, stock: 80, category: 'moda', image: '/images/camiseta-branca.png' },
    { id: 10, name: 'Camiseta Preta', price: 79.90, stock: 75, category: 'moda', image: '/images/camiseta-preta.png' },
    { id: 11, name: 'Calça Jeans', price: 159.90, stock: 40, category: 'moda', image: '/images/calca-jeans.png' },
    { id: 12, name: 'Jaqueta Verde', price: 259.90, stock: 35, category: 'moda', image: '/images/jaqueta-verde.png' },
    { id: 13, name: 'Vestido Preto', price: 189.90, stock: 45, category: 'moda', image: '/images/vestido-preto.png' },
    { id: 14, name: 'Óculos de Sol', price: 299.90, stock: 60, category: 'moda', image: '/images/oculos-sol.png' },
    { id: 15, name: 'Relógio Prata', price: 499.90, stock: 25, category: 'moda', image: '/images/relogio-prata.png' },
    { id: 16, name: 'Bolsa Crossbody', price: 199.90, stock: 55, category: 'moda', image: '/images/bolsa.png' },
    { id: 17, name: 'Chapéu Fedora', price: 149.90, stock: 30, category: 'moda', image: '/images/chapeu.png' },
    { id: 18, name: 'Pulseira Prata', price: 99.90, stock: 70, category: 'moda', image: '/images/pulseira.png' },
    { id: 19, name: 'Celular Preto', price: 2999.90, stock: 12, category: 'eletronicos', image: '/images/celular.png' },
    { id: 20, name: 'Fone de Ouvido', price: 399.90, stock: 40, category: 'eletronicos', image: '/images/fone.png' },
    { id: 21, name: 'Smartwatch', price: 899.90, stock: 18, category: 'eletronicos', image: '/images/smartwatch.png' },
    { id: 22, name: 'Teclado Gamer', price: 599.90, stock: 22, category: 'eletronicos', image: '/images/teclado.png' },
    { id: 23, name: 'Carregador Wireless', price: 79.90, stock: 90, category: 'eletronicos', image: '/images/carregador.png' },
    { id: 24, name: 'Vasinho de Planta', price: 39.90, stock: 150, category: 'decoracao', image: '/images/vaso.png' },
    { id: 25, name: 'Mesa Centro', price: 799.90, stock: 8, category: 'moveis', image: '/images/mesa.png' },
    { id: 26, name: 'Cadeira Gamer', price: 1299.90, stock: 15, category: 'moveis', image: '/images/cadeira.png' },
    { id: 27, name: 'Abajur Minimal', price: 189.90, stock: 35, category: 'decoracao', image: '/images/abajur.png' },
    { id: 28, name: 'Quadro 3D', price: 99.90, stock: 65, category: 'decoracao', image: '/images/quadro.png' }
];

export const GET: APIRoute = async ({ url }) => {
    // Get query parameters
    const category = url.searchParams.get('category');
    const search = url.searchParams.get('search');

    // Filter products based on query parameters
    let filteredProducts = products;

    if (category) {
        filteredProducts = filteredProducts.filter(product =>
            product.category === category
        );
    }

    if (search) {
        const searchTerm = search.toLowerCase();
        filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
    }

    return new Response(JSON.stringify(filteredProducts), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=3600' // Cache por 1 hora
        }
    });
};