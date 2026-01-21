const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
const acme = require('acme-client');
const { Cloudflare } = require('cloudflare');

/**
 * Gera CSS dinâmico baseado na configuração de white-label
 * @param {Object} whiteLabelConfig - Configuração do cliente
 * @returns {string} CSS compilado
 */
async function generateDynamicCSS(whiteLabelConfig) {
    try {
        const templatePath = path.join(__dirname, '../../custom/css/templates/base.css');
        let template = await fs.readFile(templatePath, 'utf-8');

        // Extrair configurações
        const { branding } = whiteLabelConfig;
        const { colorPalette, customCss, background, logo } = branding;

        // Substituir placeholders
        template = template.replace('/*PRIMARY_COLOR*/', colorPalette.primary);
        template = template.replace('/*SECONDARY_COLOR*/', colorPalette.secondary);
        template = template.replace('/*ACCENT_COLOR*/', colorPalette.accent);
        template = template.replace('/*BACKGROUND_COLOR*/', colorPalette.background);

        // Adicionar CSS custom
        if (customCss) {
            template = template.replace('/*CUSTOM_CSS*/', customCss);
        } else {
            template = template.replace('/*CUSTOM_CSS*/', '');
        }

        // Adicionar estilos para background
        let backgroundStyles = '';
        if (background) {
            backgroundStyles = `
.animated-bg {
    background-image: url("${background}") !important;
    background-size: cover !important;
    background-position: center !important;
    background-repeat: no-repeat !important;
}`;
        }
        template = template.replace('/*BACKGROUND_STYLES*/', backgroundStyles);

        // Adicionar estilos para logo
        let logoStyles = '';
        if (logo) {
            logoStyles = `
.logo-box {
    background-image: url("${logo}") !important;
    background-size: contain !important;
    background-repeat: no-repeat !important;
    background-position: center !important;
}`;
        }
        template = template.replace('/*LOGO_STYLES*/', logoStyles);

        return template;
    } catch (error) {
        console.error('Erro ao gerar CSS dinâmico:', error);
        throw error;
    }
}

/**
 * Verifica se existe override de template para o cliente
 * @param {string} clientId - ID do cliente
 * @returns {string|null} Caminho do template customizado ou null
 */
async function getClientTemplate(clientId) {
    const clientTemplatePath = path.join(__dirname, '../../custom/css/templates', `${clientId}.css`);
    try {
        await fs.access(clientTemplatePath);
        return clientTemplatePath;
    } catch {
        return null;
    }
}

/**
 * Gera CSS compilado para um cliente específico
 * @param {string} clientId - ID do cliente
 * @returns {string} CSS final
 */
async function generateCSS(clientId) {
    try {
        // Verificar se existe template customizado para o cliente
        const clientTemplate = await getClientTemplate(clientId);
        if (clientTemplate) {
            return await fs.readFile(clientTemplate, 'utf-8');
        }

        // Caso contrário, usar base com configuração dinâmica
        const WhiteLabelConfig = require('../models/WhiteLabelConfig');
        const config = await WhiteLabelConfig.findOne({ client_id: clientId });

        if (!config) {
            throw new Error(`Configuração white-label não encontrada para cliente: ${clientId}`);
        }

        return await generateDynamicCSS(config);
    } catch (error) {
        console.error(`Erro ao gerar CSS para cliente ${clientId}:`, error);
        throw error;
    }
}

/**
 * Valida se um domínio é válido e acessível
 * @param {string} domain - Domínio a validar
 * @returns {Promise<boolean>} Verdadeiro se válido
 */
async function validateDomain(domain) {
    try {
        // Regex básica para domínio
        const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/;
        if (!domainRegex.test(domain)) {
            return false;
        }

        // Verificar se domínio responde (DNS lookup básico)
        const dns = require('dns').promises;
        await dns.lookup(domain);
        return true;
    } catch (error) {
        console.error(`Erro ao validar domínio ${domain}:`, error.message);
        return false;
    }
}

/**
 * Configura CNAME no Cloudflare
 * @param {string} domain - Domínio a configurar
 * @param {string} target - Target do CNAME
 * @returns {Promise<Object>} Resultado da configuração
 */
async function configureCloudflareCNAME(domain, target = 'getnexo.com.br') {
    try {
        const cf = new Cloudflare({
            apiToken: process.env.CLOUDFLARE_API_TOKEN
        });

        // Buscar zona
        const zones = await cf.zones.list({ name: domain.split('.').slice(-2).join('.') });
        if (!zones.result || zones.result.length === 0) {
            throw new Error(`Zona não encontrada para domínio: ${domain}`);
        }

        const zone = zones.result[0];

        // Criar ou atualizar CNAME
        const record = await cf.dns.records.create(zone.id, {
            type: 'CNAME',
            name: domain,
            content: target,
            ttl: 300,
            proxied: true
        });

        return {
            success: true,
            record: record.result,
            zone: zone.name
        };
    } catch (error) {
        console.error(`Erro ao configurar CNAME para ${domain}:`, error.message);
        throw error;
    }
}

/**
 * Gera certificado SSL via Let's Encrypt
 * @param {string} domain - Domínio para gerar certificado
 * @returns {Promise<Object>} Certificado e chave
 */
async function generateSSL(domain) {
    try {
        // Chaves Let's Encrypt
        const accountKey = await acme.forge.createPrivateKey();

        // Criar cliente ACME
        const client = new acme.Client({
            directoryUrl: acme.directory.letsencrypt.production,
            accountKey: accountKey
        });

        // Registrar conta
        await client.createAccount({
            termsOfServiceAgreed: true,
            contact: ['mailto:admin@getnexo.com.br']
        });

        // Criar chave privada para domínio
        const [key, csr] = await acme.forge.createCsr({
            commonName: domain,
            altNames: [domain, `www.${domain}`]
        });

        // Solicitar certificado
        const cert = await client.auto({
            csr,
            email: 'admin@getnexo.com.br',
            termsOfServiceAgreed: true,
            challengeCreateFn: async (authz, challenge, keyAuthorization) => {
                // Implementar challenge HTTP-01
                // Criar arquivo em .well-known/acme-challenge/
                const challengePath = path.join(__dirname, '../../public/.well-known/acme-challenge', challenge.token);
                await fs.mkdir(path.dirname(challengePath), { recursive: true });
                await fs.writeFile(challengePath, keyAuthorization);
            },
            challengeRemoveFn: async (authz, challenge, keyAuthorization) => {
                // Remover arquivo de challenge
                const challengePath = path.join(__dirname, '../../public/.well-known/acme-challenge', challenge.token);
                try {
                    await fs.unlink(challengePath);
                } catch (e) {
                    // Ignore se arquivo não existir
                }
            }
        });

        return {
            success: true,
            certificate: cert.toString(),
            privateKey: key.toString(),
            issuedAt: new Date(),
            expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 dias
            domain
        };
    } catch (error) {
        console.error(`Erro ao gerar SSL para ${domain}:`, error.message);
        throw error;
    }
}

/**
 * Atualiza configuração dinâmica do Traefik
 * @param {string} clientId - ID do cliente
 * @param {string} domain - Domínio configurado
 * @param {Object} ssl - Configuração SSL
 * @returns {Promise<boolean>} Sucesso da atualização
 */
async function updateTraefikConfig(clientId, domain, ssl = null) {
    try {
        const traefikConfigPath = path.join(__dirname, '../../config/traefik_dynamic.yml');

        // Ler configuração atual
        let config = '';
        try {
            config = await fs.readFile(traefikConfigPath, 'utf-8');
        } catch (e) {
            // Arquivo não existe, começar vazio
            config = 'http:\n  routers:\n  services:\n';
        }

        // Adicionar router para o domínio
        const routerConfig = `
  ${clientId}-router:
    rule: "Host(\`${domain}\`)"
    service: "${clientId}-service"
    ${ssl ? 'tls: {}' : ''}
    middlewares:
      - "mtls-auth"
`;

        const serviceConfig = `
  ${clientId}-service:
    loadBalancer:
      servers:
        - url: "http://getnexo-site:4321"
`;

        // Adicionar configurações
        const updatedConfig = config
            .replace(/http:\s*routers:/, `http:\n  routers:${routerConfig}`)
            .replace(/http:\s*services:/, `http:\n  services:${serviceConfig}`);

        await fs.writeFile(traefikConfigPath, updatedConfig);

        return true;
    } catch (error) {
        console.error(`Erro ao atualizar Traefik config para ${clientId}:`, error.message);
        throw error;
    }
}

module.exports = {
    generateDynamicCSS,
    generateCSS,
    getClientTemplate,
    validateDomain,
    configureCloudflareCNAME,
    generateSSL,
    updateTraefikConfig
};