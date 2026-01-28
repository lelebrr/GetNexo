import { defineConfig } from 'astro/config';
import partytown from '@astrojs/partytown';
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
        partytown({
            config: {
                forward: ['dataLayer.push', 'gtag'],
                debug: false,
                resolveUrl: function (url) {
                    // Resolve URLs for third-party scripts
                    if (url.hostname === 'www.googletagmanager.com') {
                        return url;
                    }
                    return url;
                },
            },
        }),
    ],
    compressHTML: true,
    build: {
        inlineStylesheets: 'always', // Inlining de CSS crítico para evitar bloqueio de renderização
        // Otimização: gerar chunks CSS menores para melhor paralelização
        chunkSizeWarningLimit: 200, // Reduzido de 500 para 200 KB
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
        headers: {
            // CSP avançada com proteção contra XSS (para ambiente de desenvolvimento)
            // Em produção, o middleware gera nonces dinamicamente
            'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' *.cloudflare.com static.cloudflareinsights.com https://cdn.jsdelivr.net https://unpkg.com https://cdnjs.cloudflare.com https://api.getnexo.com.br https://*.getnexo.com.br https://www.googletagmanager.com; worker-src 'self' blob:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unpkg.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net; img-src * data: blob:; font-src 'self' https://fonts.gstatic.com; connect-src *; object-src 'none'; base-uri 'none'; frame-ancestors *; script-src-elem 'self' 'unsafe-inline' https://unpkg.com https://cdn.jsdelivr.net; style-src-elem 'self' 'unsafe-inline' https://unpkg.com https://cdn.jsdelivr.net https://fonts.googleapis.com;",
            // Cache otimizado: 1 ano para assets estáticos, 1 dia para APIs
            'Cache-Control': 'public, max-age=31536000, immutable',
            // HSTS forte para todos os ambientes (não apenas Vercel)
            'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
        }
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
            target: 'es2017',
            // cssCodeSplit: true, // Removed to allow Astro inlineStylesheets: 'always' to work fully
            chunkSizeWarningLimit: 200,
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
        esbuild: {
            drop: isDev ? [] : ['console', 'debugger'],
            minify: true,
        },
        optimizeDeps: {
            include: ['react', 'react-dom']
        }
    }
});
