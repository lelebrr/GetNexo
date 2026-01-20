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
};
