import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import node from '@astrojs/node';
import vercel from '@astrojs/vercel/serverless';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import { initSocket } from './src/server.js';

// Otimização automática de imagens WebP
import sharp from 'sharp';

const isVercel = process.env.VERCEL === '1';
const isDev = process.env.NODE_ENV !== 'production';

export default defineConfig({
    output: 'server',
    adapter: isVercel ? vercel({
        webAnalytics: { enabled: true }
    }) : node({
        mode: 'standalone',
        server: './src/server-entry.js'
    }),
    site: 'https://getnexo.com.br',
    trailingSlash: 'never',
    devToolbar: {
        enabled: false
    },
    logging: {
        level: 'info' // 'debug' pra ver MUITO mais
    },
    integrations: [
        react(),
        tailwind({ applyBaseStyles: false }),
        sitemap({
            i18n: {
                defaultLocale: 'pt',
                locales: {
                    pt: 'pt-BR',
                    en: 'en-US',
                    es: 'es-ES',
                    fr: 'fr-FR'
                }
            }
        }),

    ],
    compressHTML: true,
    build: {
        inlineStylesheets: 'always', // Inlining de CSS crítico para evitar bloqueio de renderização
        // Otimização: gerar chunks CSS menores para melhor paralelização
        chunkSizeWarningLimit: 150, // Reduzido para 150 KB para melhor performance
        minify: 'esbuild',
        esbuild: {
            drop: ['console', 'debugger', 'unused'],
            minify: true,
            legalComments: 'none'
        }
    },
    image: {
        service: {
            entrypoint: 'astro/assets/services/sharp',
            config: {
                // Otimização automática para WebP
                formats: ['webp', 'png', 'jpg'],
                defaultQuality: 85,
                // Compressão agressiva para performance
                webp: {
                    quality: 80,
                    effort: 6
                },
                png: {
                    quality: 85,
                    compressionLevel: 9
                },
                jpg: {
                    quality: 85,
                    progressive: true
                }
            }
        }
    },
    // Compressão gzip/brotli para assets estáticos
    server: {
        host: '0.0.0.0', // Permite conexões de qualquer interface de rede
        port: 4321, // Porta padrão para o container e healthchecks
        host: '0.0.0.0', // Permite conexões de qualquer interface de rede
        port: 4321, // Porta padrão para o container e healthchecks
    },
    vite: {
        logLevel: 'info', // ou 'debug' pra ficar mais verboso ainda
        optimizeDeps: {
            include: ['react', 'react-dom']
        },
        resolve: {
            dedupe: ['react', 'react-dom']
        },
        server: {
            allowedHosts: ['getnexo.com.br', 'admin.getnexo.com.br', 'www.getnexo.com.br', 'chat.getnexo.com.br'],
            hmr: true,
            watch: {
                usePolling: true // se tiver problemas com arquivos não detectando mudança
            }
        },
        plugins: !isVercel ? [{
            name: 'socket-io',
            configureServer(server) {
                initSocket(server.httpServer);
            }
        }] : [],
        build: {
            target: 'es2017',
            // cssCodeSplit: true, // Removed to allow Astro inlineStylesheets: 'always' to work fully
            chunkSizeWarningLimit: 150,
            modulePreload: {
                polyfill: false
            },
            rollupOptions: {
                output: {
                    chunkFileNames: 'assets/[name]-[hash].js',
                    assetFileNames: (assetInfo) => {
                        if (assetInfo.name && assetInfo.name.endsWith('.css')) {
                            return 'assets/[name]-[hash].css';
                        }
                        return 'assets/[name]-[hash].[ext]';
                    },
                    // Removed manualChunks for CSS to allow proper inlining by Astro
                }
            }
        },
        optimizeDeps: {
            include: ['react', 'react-dom']
        }
    }
});
