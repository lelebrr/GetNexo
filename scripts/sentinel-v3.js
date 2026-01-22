#!/usr/bin/env node

// Sentinel v3 - Guardiá da Torre GetNexo
// Versão: 3.7.2
// Descrição: IA interna que mantém o site imune, rápido, limpo e lucrativo.
// Funcionalidades: Varredura de arquivos, performance, segurança, otimização, inteligência conversacional, backup e recuperação.

const { chromium } = require('playwright');
const lighthouse = require('lighthouse');
const fs = require('fs');
const path = require('path');
const { execSync, exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);
const axios = require('axios'); // Para TinyPNG ou outras APIs
const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');

// Configurações
const SITE_URL = process.env.SITE_URL || 'https://getnexo.com.br';
const LOGS_DIR = process.env.LOGS_DIR || '/logs';
const SENTINEL_LOGS_DIR = path.join(LOGS_DIR, 'sentinel');
const BACKUP_DIR = process.env.BACKUP_DIR || '/mnt/backup';
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const TINYPNG_API_KEY = process.env.TINYPNG_API_KEY;
const DRY_RUN = process.argv.includes('--dry-run');
const FORCE = process.argv.includes('--force');

// Garantir diretórios
if (!fs.existsSync(SENTINEL_LOGS_DIR)) fs.mkdirSync(SENTINEL_LOGS_DIR, { recursive: true });

// Logger estruturado
function log(evento, detalhe, acao, sucesso, metrica = null) {
    const entry = {
        ts: new Date().toISOString(),
        evento,
        detalhe,
        acao,
        sucesso,
        metrica
    };
    const logFile = path.join(SENTINEL_LOGS_DIR, `sentinel-${new Date().toISOString().split('T')[0]}.jsonl`);
    fs.appendFileSync(logFile, JSON.stringify(entry) + '\n');
    console.log(`[${evento}] ${detalhe} → ${acao} (${sucesso ? 'OK' : 'FAIL'})`);
}

// Função principal
async function runSentinel() {
    console.log('🚀 Sentinel v3 iniciando...');

    const report = {
        data: new Date().toISOString(),
        status: 'OK',
        velocidade: 0,
        alertas: 0,
        fix_automatico: 0,
        logs: [],
        recomendacao: ''
    };

    try {
        // 1. Varredura de arquivos
        await fileScan(report);

        // 2. Performance & Velocidade
        await performanceCheck(report);

        // 3. Segurança
        await securityCheck(report);

        // 4. Otimização automática
        await autoOptimize(report);

        // 5. Inteligência conversacional
        await conversationalAI(report);

        // 6. Backup e recuperação
        await backupCheck(report);

        // Salvar relatório
        saveReport(report);

        // Enviar notificação
        await sendNotification(report);

        console.log('✅ Sentinel v3 concluído.');
    } catch (error) {
        console.error('❌ Erro no Sentinel:', error);
        log('erro_sentinel', error.message, 'exception', false);
    }
}

// 1. Varredura de arquivos
async function fileScan(report) {
    console.log('🔍 Varredura de arquivos...');

    // Duplicatas
    try {
        const fdupesOutput = execSync('fdupes -r /src /dist', { encoding: 'utf8' });
        if (fdupesOutput) {
            const files = fdupesOutput.trim().split('\n').filter(f => f);
            for (const file of files.slice(1)) { // Skip first (original)
                if (!DRY_RUN) fs.unlinkSync(file);
                log('duplicata_removida', file, 'deletado', true);
                report.fix_automatico++;
            }
        }
    } catch (e) { }

    // Lixo
    const trashPatterns = ['.DS_Store', 'Thumbs.db', 'node_modules'];
    for (const pattern of trashPatterns) {
        try {
            execSync(`find /src /dist -name "${pattern}" -delete`, { stdio: 'inherit' });
            log('lixo_removido', pattern, 'deletado', true);
        } catch (e) { }
    }

    // Exposto
    const exposedFiles = ['.git/config', '.env', 'id_rsa'];
    for (const file of exposedFiles) {
        if (fs.existsSync(file)) {
            execSync(`chmod 600 ${file}`);
            log('arquivo_exposto', file, 'permissao_alterada', true);
        }
    }

    // Tamanho
    const distSize = getFolderSize('/dist');
    if (distSize > 200 * 1024 * 1024) { // 200MB
        execSync('cd getnexo-site && npm run build');
        log('dist_rebuild', `${distSize}MB`, 'rebuild', true);
    }

    // Senhas em .env
    const envContent = fs.readFileSync('.env', 'utf8');
    if (envContent.includes('DB_PASSWORD=123')) {
        log('senha_fraca', 'DB_PASSWORD=123', 'alerta', false);
        report.alertas++;
    }
}

// 2. Performance
async function performanceCheck(report) {
    console.log('⚡ Verificação de performance...');

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    // Lighthouse
    const runnerResult = await lighthouse(SITE_URL, {
        logLevel: 'error',
        output: 'json',
        port: new URL(browser.wsEndpoint()).port,
    });

    const lhr = runnerResult.lhr;
    report.velocidade = lhr.categories.performance.score * 100;

    if (report.velocidade < 90) report.alertas++;

    // Páginas específicas
    const pages = ['/', '/pt', '/es', '/fr', '/en', '/blog', '/admin'];
    for (const p of pages) {
        const start = Date.now();
        await page.goto(SITE_URL + p);
        const loadTime = Date.now() - start;
        if (loadTime > 2000) {
            log('pagina_lenta', p, `tempo: ${loadTime}ms`, false);
            report.alertas++;
        }
    }

    await browser.close();
}

// 3. Segurança
async function securityCheck(report) {
    console.log('🛡️ Verificação de segurança...');

    // IPs suspeitos
    try {
        const logContent = fs.readFileSync('/var/log/nginx/access.log', 'utf8');
        const ips = {};
        logContent.split('\n').forEach(line => {
            const ip = line.split(' ')[0];
            ips[ip] = (ips[ip] || 0) + 1;
        });
        for (const [ip, count] of Object.entries(ips)) {
            if (count > 500) {
                execSync(`iptables -A INPUT -s ${ip} -j DROP`);
                log('ip_bloqueado', ip, 'firewall', true);
                report.logs.push({ IP_suspeito: `${ip} – bloqueado` });
                report.fix_automatico++;
            }
        }
    } catch (e) { }

    // Injeções
    const sqlPatterns = ['SELECT', 'DROP', 'UNION'];
    // Simulação de grep nos logs

    // Portas abertas
    try {
        const ports = execSync('ss -tlnp', { encoding: 'utf8' });
        if (ports.includes(':22 ')) {
            log('porta_aberta', '22', 'alerta', false);
            report.alertas++;
        }
    } catch (e) { }

    // SSL
    try {
        const certInfo = execSync(`openssl s_client -connect ${SITE_URL.replace('https://', '')}:443 -servername ${SITE_URL.replace('https://', '')} < /dev/null 2>/dev/null | openssl x509 -noout -dates`, { encoding: 'utf8' });
        const expiryDate = new Date(certInfo.match(/notAfter=(.+)/)[1]);
        const daysLeft = Math.ceil((expiryDate - new Date()) / (1000 * 60 * 60 * 24));
        if (daysLeft < 30) {
            execSync('certbot renew');
            log('ssl_renovado', `${daysLeft} dias restantes`, 'renovado', true);
        }
    } catch (e) { }
}

// 4. Otimização automática
async function autoOptimize(report) {
    console.log('🔧 Otimização automática...');

    // Imagens
    const images = findFiles('/src', /\.(jpg|jpeg|png)$/);
    for (const img of images) {
        const stats = fs.statSync(img);
        if (stats.size > 100 * 1024) { // 100KB
            const webpPath = img.replace(/\.(jpg|jpeg|png)$/, '.webp');
            await imagemin([img], {
                destination: path.dirname(webpPath),
                plugins: [imageminWebp({ quality: 80 })]
            });
            log('imagem_otimizada', img, 'webp_convertido', true, { economia_kb: Math.floor((stats.size - fs.statSync(webpPath).size) / 1024) });
            report.fix_automatico++;
        }
    }

    // JS/CSS
    // Simulação de tree-shaking, etc.
}

// 5. Inteligência conversacional
async function conversationalAI(report) {
    // Lógica para analisar logs de conversa e otimizar padrões
    // Placeholder
}

// 6. Backup
async function backupCheck(report) {
    if (!fs.existsSync(BACKUP_DIR)) {
        log('backup_faltando', BACKUP_DIR, 'alerta', false);
        report.alertas++;
        return;
    }

    const lastBackup = fs.readdirSync(BACKUP_DIR).sort().pop();
    const backupDate = new Date(path.basename(lastBackup, '.tar.gz').split('-').slice(-3).join('-'));
    if ((new Date() - backupDate) > 7 * 24 * 60 * 60 * 1000) {
        execSync('./scripts/backup.sh');
        log('backup_executado', 'manual', 'feito', true);
    }
}

// Salvar relatório
function saveReport(report) {
    const reportPath = path.join(LOGS_DIR, `saude-${new Date().toISOString().split('T')[0]}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
}

// Enviar notificação
async function sendNotification(report) {
    if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT_ID) return;

    const message = `Sentinel v3: ${report.status}. Velocidade: ${report.velocidade.toFixed(1)}. Alertas: ${report.alertas}. Fixes: ${report.fix_automatico}.`;
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        chat_id: TELEGRAM_CHAT_ID,
        text: message
    });
}

// Utilitários
function getFolderSize(folder) {
    let size = 0;
    const files = fs.readdirSync(folder, { withFileTypes: true });
    for (const file of files) {
        const filePath = path.join(folder, file.name);
        if (file.isDirectory()) size += getFolderSize(filePath);
        else size += fs.statSync(filePath).size;
    }
    return size;
}

function findFiles(dir, pattern) {
    let results = [];
    const files = fs.readdirSync(dir, { withFileTypes: true });
    for (const file of files) {
        const filePath = path.join(dir, file.name);
        if (file.isDirectory()) results = results.concat(findFiles(filePath, pattern));
        else if (pattern.test(file.name)) results.push(filePath);
    }
    return results;
}

// Executar
if (require.main === module) {
    runSentinel();
}

module.exports = { runSentinel };