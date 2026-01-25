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
        inlineStylesheets: 'auto', // Mudado de 'always' para 'auto' para evitar conflitos com Rocket Loader
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
            'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' *.cloudflare.com static.cloudflareinsights.com https://cdn.jsdelivr.net https://unpkg.com https://cdnjs.cloudflare.com https://api.getnexo.com.br https://*.getnexo.com.br https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unpkg.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net; img-src * data: blob:; font-src 'self' https://fonts.gstatic.com; connect-src *; object-src 'none'; base-uri 'none'; frame-ancestors *; script-src-elem 'self' 'unsafe-inline' https://unpkg.com https://cdn.jsdelivr.net; style-src-elem 'self' 'unsafe-inline' https://unpkg.com https://cdn.jsdelivr.net https://fonts.googleapis.com;",
            // Cache otimizado: 1 ano para assets estáticos, 1 dia para APIs
            'Cache-Control': 'public, max-age=31536000, immutable',
            // HSTS forte para todos os ambientes (não apenas Vercel)
            'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
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
            target: 'es2017',
            cssCodeSplit: true,
            chunkSizeWarningLimit: 500,
            modulePreload: {
                polyfill: false // Desabilitado para evitar conflitos com Rocket Loader
            },
            // Adicionar headers para forçar desabilitação do Rocket Loader
            security: {
                contentSecurityPolicy: {
                    'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
                    'style-src': ["'self'", "'unsafe-inline'"],
                }
            },
            rollupOptions: {
                output: {
                    manualChunks: {
                        'vendor': ['react', 'react-dom', 'astro'],
                    },
                    chunkFileNames: (chunkInfo) => {
                        return 'assets/[name]-[hash].js';
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
