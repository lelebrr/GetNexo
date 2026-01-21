import { defineConfig } from 'astro/config';
import partytown from '@astrojs/partytown';
import react from '@astrojs/react';
import node from '@astrojs/node';
import vercel from '@astrojs/vercel/serverless';
import tailwind from '@astrojs/tailwind';
import { initSocket } from './src/server.js';

const isVercel = process.env.VERCEL === '1';

export default defineConfig({
    output: 'server',
    adapter: isVercel
        ? vercel({ webAnalytics: { enabled: true } })
        : node({
            mode: 'standalone',
            server: './src/server-entry.js'
        }),
    site: 'https://getnexo.com.br',
    trailingSlash: 'never',
    devToolbar: {
        enabled: false
    },
    integrations: [
        react(),
        tailwind({ applyBaseStyles: false }),
        // sitemap(),
        partytown({
            config: {
                forward: ['dataLayer.push'],
                debug: false,
            },
        }),
    ],
    compressHTML: true,
    build: {
        inlineStylesheets: 'always', // Crítico para LCP
        assetsPrefix: '/assets', // Organização
    },
    // Compressão gzip/brotli para assets estáticos
    server: {
        headers: {
            'Content-Encoding': 'gzip, br',
            'Cache-Control': 'public, max-age=31536000, immutable'
        }
    },
    vite: {
        server: {
            allowedHosts: ['getnexo.com.br', 'admin.getnexo.com.br', 'www.getnexo.com.br', 'chat.getnexo.com.br']
        },
        plugins: !isVercel ? [{
            name: 'socket-io',
            configureServer(server) {
                initSocket(server.httpServer);
            }
        }] : [],
        build: {
            target: 'es2022',
            cssCodeSplit: true,
            chunkSizeWarningLimit: 500,
            rollupOptions: {
                output: {
                    manualChunks: {
                        'vendor': ['react', 'react-dom', 'astro'],
                    }
                }
            }
        },
        esbuild: {
            drop: ['console', 'debugger'],
        },
        // SSR config removida para evitar conflito CJS/ESM com React
        optimizeDeps: {
            // Garante que React seja pré-empacotado para dev
            include: ['react', 'react-dom']
        }
    }
});
