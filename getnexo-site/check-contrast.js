/**
 * Script para verificar problemas de contraste de cores no site
 * Identifica combinações de cores que não atendem aos padrões WCAG AA (4.5:1 para texto normal)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cores que precisam ser verificadas
const colorsToCheck = [
    { hex: '#94a3b8', name: 'slate-400' },
    { hex: '#cbd5e1', name: 'slate-300' },
    { hex: '#e2e8f0', name: 'slate-200' },
    { hex: '#f1f5f9', name: 'slate-100' },
    { hex: '#ffffff', name: 'white' },
    { hex: '#00d4ff', name: 'cyan-400' },
    { hex: '#00ff9d', name: 'green-400' },
    { hex: '#10b981', name: 'green-500' },
    { hex: '#22c55e', name: 'green-600' },
    { hex: '#3b82f6', name: 'blue-500' },
    { hex: '#f59e0b', name: 'amber-500' },
    { hex: '#ef4444', name: 'red-500' },
    { hex: '#f87171', name: 'red-400' },
    { hex: '#c084fc', name: 'purple-400' },
    { hex: '#8b5cf6', name: 'purple-500' },
    { hex: '#9c88ff', name: 'purple-300' },
    { hex: '#ff7a59', name: 'orange-400' },
    { hex: '#ffd700', name: 'gold' },
    { hex: '#ffff00', name: 'yellow' },
    { hex: '#000000', name: 'black' },
    { hex: '#020617', name: 'slate-950' },
    { hex: '#030712', name: 'slate-900' },
    { hex: '#0f172a', name: 'slate-800' },
    { hex: '#1e293b', name: 'slate-700' },
    { hex: '#334155', name: 'slate-600' },
    { hex: '#475569', name: 'slate-500' },
    { hex: '#64748b', name: 'slate-400' },
];

// Cores de fundo comuns
const backgroundColors = [
    { hex: '#020617', name: 'slate-950' },
    { hex: '#030712', name: 'slate-900' },
    { hex: '#0f172a', name: 'slate-800' },
    { hex: '#1e293b', name: 'slate-700' },
    { hex: '#334155', name: 'slate-600' },
    { hex: '#000000', name: 'black' },
    { hex: '#ffffff', name: 'white' },
    { hex: '#f9fafb', name: 'gray-50' },
];

// Função para converter hex para RGB
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// Função para calcular luminosidade relativa (WCAG)
function getLuminance(r, g, b) {
    const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Função para calcular contraste
function getContrastRatio(color1, color2) {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);

    if (!rgb1 || !rgb2) return 0;

    const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);

    return (lighter + 0.05) / (darker + 0.05);
}

// Função para verificar se a combinação atende ao WCAG AA
function meetsWCAGAA(contrastRatio, isLargeText = false) {
    if (isLargeText) {
        return contrastRatio >= 3.0; // Para texto grande (18pt+ ou 14pt+ bold)
    }
    return contrastRatio >= 4.5; // Para texto normal
}

// Função para verificar se a combinação atende ao WCAG AAA
function meetsWCAGAAA(contrastRatio, isLargeText = false) {
    if (isLargeText) {
        return contrastRatio >= 4.5; // Para texto grande (18pt+ ou 14pt+ bold)
    }
    return contrastRatio >= 7.0; // Para texto normal
}

// Função para verificar um arquivo
function checkFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const issues = [];

    // Regex para encontrar cores em CSS
    const colorRegex = /color:\s*([#\w\d]+)/gi;
    const bgColorRegex = /background(?:-color)?:\s*([#\w\d]+)/gi;
    const borderColorRegex = /border(?:-color)?:\s*([#\w\d]+)/gi;

    lines.forEach((line, index) => {
        const lineNumber = index + 1;

        // Verificar cores de texto
        let match;
        while ((match = colorRegex.exec(line)) !== null) {
            const textColor = match[1];
            const bgColorMatch = line.match(/background(?:-color)?:\s*([#\w\d]+)/);
            const bgColor = bgColorMatch ? bgColorMatch[1] : null;

            if (bgColor && textColor.startsWith('#')) {
                const contrast = getContrastRatio(textColor, bgColor);
                if (!meetsWCAGAA(contrast)) {
                    issues.push({
                        file: filePath,
                        line: lineNumber,
                        type: 'text-color',
                        textColor: textColor,
                        bgColor: bgColor,
                        contrast: contrast.toFixed(2),
                        wcagAA: meetsWCAGAA(contrast),
                        wcagAAA: meetsWCAGAAA(contrast),
                        content: line.trim()
                    });
                }
            }
        }

        // Verificar cores de fundo
        while ((match = bgColorRegex.exec(line)) !== null) {
            const bgColor = match[1];
            const textColorMatch = line.match(/color:\s*([#\w\d]+)/);
            const textColor = textColorMatch ? textColorMatch[1] : null;

            if (textColor && bgColor.startsWith('#')) {
                const contrast = getContrastRatio(textColor, bgColor);
                if (!meetsWCAGAA(contrast)) {
                    issues.push({
                        file: filePath,
                        line: lineNumber,
                        type: 'bg-color',
                        textColor: textColor,
                        bgColor: bgColor,
                        contrast: contrast.toFixed(2),
                        wcagAA: meetsWCAGAA(contrast),
                        wcagAAA: meetsWCAGAAA(contrast),
                        content: line.trim()
                    });
                }
            }
        }
    });

    return issues;
}

// Função para verificar todos os arquivos Astro
function checkAllAstroFiles() {
    const astroDir = path.join(__dirname, 'src');
    const issues = [];

    function scanDir(dir) {
        const items = fs.readdirSync(dir);

        items.forEach(item => {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                scanDir(fullPath);
            } else if (item.endsWith('.astro')) {
                const fileIssues = checkFile(fullPath);
                issues.push(...fileIssues);
            }
        });
    }

    scanDir(astroDir);
    return issues;
}

// Função para gerar relatório
function generateReport(issues) {
    console.log('\n=== RELATÓRIO DE CONTRASTE DE CORES ===\n');

    if (issues.length === 0) {
        console.log('✅ Nenhum problema de contraste encontrado!');
        return;
    }

    console.log(`⚠️  Encontrados ${issues.length} problemas de contraste:\n`);

    // Agrupar por arquivo
    const byFile = {};
    issues.forEach(issue => {
        if (!byFile[issue.file]) {
            byFile[issue.file] = [];
        }
        byFile[issue.file].push(issue);
    });

    // Exibir por arquivo
    Object.keys(byFile).forEach(file => {
        console.log(`\n📁 ${file}`);
        console.log('─'.repeat(80));

        byFile[file].forEach(issue => {
            const wcagStatus = issue.wcagAA ? '✅' : '❌';
            const wcagAAAStatus = issue.wcagAAA ? '✅' : '❌';

            console.log(`  Linha ${issue.line}: ${wcagStatus} WCAG AA (${issue.contrast}:1)`);
            console.log(`    Texto: ${issue.textColor} | Fundo: ${issue.bgColor}`);
            console.log(`    WCAG AAA: ${wcagAAAStatus}`);
            console.log(`    Código: ${issue.content.substring(0, 80)}${issue.content.length > 80 ? '...' : ''}`);
            console.log('');
        });
    });

    // Resumo
    console.log('\n=== RESUMO ===');
    console.log(`Total de problemas: ${issues.length}`);
    console.log(`Arquivos afetados: ${Object.keys(byFile).length}`);

    const critical = issues.filter(i => !i.wcagAA).length;
    const warning = issues.filter(i => i.wcagAA && !i.wcagAAA).length;

    console.log(`❌ Críticos (WCAG AA falha): ${critical}`);
    console.log(`⚠️  Aviso (WCAG AAA falha): ${warning}`);
}

// Função para gerar sugestões de correção
function generateSuggestions(issues) {
    console.log('\n=== SUGESTÕES DE CORREÇÃO ===\n');

    const suggestions = {};

    issues.forEach(issue => {
        const key = `${issue.textColor}-${issue.bgColor}`;
        if (!suggestions[key]) {
            suggestions[key] = {
                textColor: issue.textColor,
                bgColor: issue.bgColor,
                contrast: issue.contrast,
                count: 0,
                files: new Set()
            };
        }
        suggestions[key].count++;
        suggestions[key].files.add(issue.file);
    });

    Object.values(suggestions).forEach(sug => {
        console.log(`\nCombinação: Texto ${sug.textColor} / Fundo ${sug.bgColor}`);
        console.log(`Contraste atual: ${sug.contrast}:1`);
        console.log(`Ocorrências: ${sug.count} em ${sug.files.size} arquivo(s)`);

        // Sugerir cores alternativas baseadas no fundo
        const bgRgb = hexToRgb(sug.bgColor);
        if (bgRgb) {
            const bgLum = getLuminance(bgRgb.r, bgRgb.g, bgRgb.b);

            if (bgLum < 0.5) {
                // Fundo escuro - sugerir texto mais claro
                console.log('  Sugestão: Use texto mais claro (ex: #ffffff, #f1f5f9, #e2e8f0)');
            } else {
                // Fundo claro - sugerir texto mais escuro
                console.log('  Sugestão: Use texto mais escuro (ex: #1e293b, #334155, #475569)');
            }
        }
    });
}

// Executar verificação
try {
    const issues = checkAllAstroFiles();
    generateReport(issues);

    if (issues.length > 0) {
        generateSuggestions(issues);
    }

    // Salvar relatório em arquivo
    const report = {
        timestamp: new Date().toISOString(),
        totalIssues: issues.length,
        issues: issues.map(i => ({
            file: i.file,
            line: i.line,
            textColor: i.textColor,
            bgColor: i.bgColor,
            contrast: i.contrast,
            wcagAA: i.wcagAA,
            wcagAAA: i.wcagAAA
        }))
    };

    fs.writeFileSync(
        path.join(__dirname, 'contrast-report.json'),
        JSON.stringify(report, null, 2)
    );

    console.log('\n📄 Relatório salvo em: contrast-report.json');

} catch (error) {
    console.error('Erro ao verificar contraste:', error.message);
    process.exit(1);
}
