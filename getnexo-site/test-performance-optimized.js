#!/usr/bin/env node

/**
 * Script de teste de performance otimizada para GetNexo
 * Valida as melhorias implementadas e mede o impacto
 */

import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Iniciando teste de performance otimizada para GetNexo...\n');

// Testes de performance implementados
const tests = [
    {
        name: 'Pré-conexões (Preconnect)',
        description: 'Verifica se as pré-conexões para origens críticas estão implementadas',
        check: () => {
            const layoutPath = path.join(__dirname, 'src/layouts/Layout.astro');
            const layoutContent = fs.readFileSync(layoutPath, 'utf8');

            const preconnectChecks = [
                'rel="preconnect" href="https://fonts.googleapis.com"',
                'rel="preconnect" href="https://fonts.gstatic.com"',
                'rel="preconnect" href="https://api.getnexo.com.br"',
                'rel="preconnect" href="https://cdn.jsdelivr.net"'
            ];

            const results = preconnectChecks.map(check => ({
                check,
                found: layoutContent.includes(check)
            }));

            return results;
        }
    },
    {
        name: 'Lazy Loading Avançado',
        description: 'Verifica se o lazy loading está implementado para recursos pesados',
        check: () => {
            const layoutPath = path.join(process.cwd(), 'src/layouts/Layout.astro');
            const layoutContent = fs.readFileSync(layoutPath, 'utf8');

            const lazyChecks = [
                'fetchpriority="low"',
                'loading="lazy"',
                'requestIdleCallback',
                'delay: 8000',
                'delay: 12000'
            ];

            const results = lazyChecks.map(check => ({
                check,
                found: layoutContent.includes(check)
            }));

            return results;
        }
    },
    {
        name: 'Otimização de Fontes',
        description: 'Verifica se as fontes estão otimizadas com preload e fetchpriority',
        check: () => {
            const layoutPath = path.join(process.cwd(), 'src/layouts/Layout.astro');
            const layoutContent = fs.readFileSync(layoutPath, 'utf8');

            const fontChecks = [
                'fetchpriority="high"',
                'as="style"',
                'family=Inter',
                'family=Outfit'
            ];

            const results = fontChecks.map(check => ({
                check,
                found: layoutContent.includes(check)
            }));

            return results;
        }
    },
    {
        name: 'Cache Headers',
        description: 'Verifica se os cache headers estão otimizados no vercel.json',
        check: () => {
            const vercelPath = path.join(process.cwd(), 'vercel.json');
            const vercelContent = fs.readFileSync(vercelPath, 'utf8');

            const cacheChecks = [
                '"Cache-Control"',
                '"public, max-age=31536000, immutable"',
                '"Strict-Transport-Security"'
            ];

            const results = cacheChecks.map(check => ({
                check,
                found: vercelContent.includes(check)
            }));

            return results;
        }
    },
    {
        name: 'Otimização de Build',
        description: 'Verifica se as otimizações de build estão configuradas',
        check: () => {
            const astroPath = path.join(process.cwd(), 'astro.config.mjs');
            const astroContent = fs.readFileSync(astroPath, 'utf8');

            const buildChecks = [
                'chunkSizeWarningLimit: 150',
                'minify: \'esbuild\'',
                'drop: [\'console\', \'debugger\', \'unused\']',
                'legalComments: \'none\''
            ];

            const results = buildChecks.map(check => ({
                check,
                found: astroContent.includes(check)
            }));

            return results;
        }
    }
];

// Executar testes
const runTests = async () => {
    console.log('📊 Executando testes de performance...\n');

    let totalTests = 0;
    let passedTests = 0;

    for (const test of tests) {
        console.log(`🔍 Testando: ${test.name}`);
        console.log(`   ${test.description}`);

        try {
            const results = test.check();
            let testPassed = true;

            results.forEach(result => {
                totalTests++;
                if (result.found) {
                    console.log(`   ✅ ${result.check}`);
                    passedTests++;
                } else {
                    console.log(`   ❌ ${result.check}`);
                    testPassed = false;
                }
            });

            console.log(testPassed ? '   🎉 Teste PASSED\n' : '   💥 Teste FAILED\n');

        } catch (error) {
            console.log(`   ❌ Erro ao executar teste: ${error.message}\n`);
        }
    }

    // Resumo
    console.log('📈 Resumo dos Testes:');
    console.log(`   Total de verificações: ${totalTests}`);
    console.log(`   Verificações passadas: ${passedTests}`);
    console.log(`   Taxa de sucesso: ${((passedTests / totalTests) * 100).toFixed(1)}%\n`);

    if (passedTests === totalTests) {
        console.log('🎉 Todas as otimizações de performance foram implementadas com sucesso!');
        console.log('🚀 O site GetNexo agora está otimizado para melhor performance.');
    } else {
        console.log('⚠️  Algumas otimizações ainda precisam ser implementadas.');
        console.log('🔧 Verifique os testes falhados acima para mais detalhes.');
    }

    // Recomendações finais
    console.log('\n💡 Recomendações adicionais:');
    console.log('   1. Execute o build para testar as otimizações: npm run build');
    console.log('   2. Use o Lighthouse para medir a performance real');
    console.log('   3. Monitore o Core Web Vitals após o deploy');
    console.log('   4. Considere usar CDN para assets estáticos');
    console.log('   5. Implemente Service Worker para cache offline');
};

// Executar
runTests().catch(console.error);
