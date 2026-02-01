/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
    theme: {
        extend: {
            colors: {
                jet: {
                    500: '#FF0033',
                    600: '#CC002A',
                    700: '#990021',
                },
                nex: {
                    400: '#FFD500',
                    500: '#FFCC00',
                    600: '#CC9900',
                },
                // Dark Futurist Palette
                'void-black': '#000000',
                'neon-blue': '#00F7FF',
                'cyber-gold': '#FFD500',
                'matrix-green': '#00B2A9',
                'urgency-red': '#FF0033',
            },
        },
    },
    plugins: [],
    safelist: [
        {
            pattern: /(bg|text|ring|border)-(indigo|cyan|purple|emerald|orange|rose|pink|green|yellow|blue|red|teal|violet|amber|gray|lime)-(400|500|600)/,
            variants: ['hover', 'group-hover'],
        },
        {
            pattern: /(bg|border)-(indigo|cyan|purple|emerald|orange|rose|pink|green|yellow|blue|red|teal|violet|amber|gray|lime)-(400|500|600)\/20/,
        },
        {
            pattern: /(bg|border)-(indigo|cyan|purple|emerald|orange|rose|pink|green|yellow|blue|red|teal|violet|amber|gray|lime)-(500|600)\/10/,
        },
        'bg-indigo-600/20',
        'text-indigo-400',
        'ring-indigo-500/50'
    ]
};
