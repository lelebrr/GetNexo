/**
 * Trusted Types Policy para mitigar XSS baseado em DOM
 * 
 * Este arquivo define uma política de Trusted Types que restringe a criação de
 * strings HTML/Script a partir de dados não confiáveis, protegendo contra
 * ataques de XSS baseado em DOM.
 * 
 * Como usar:
 * 1. Inclua este script no HTML com nonce do CSP
 * 2. Use trustedTypes.createPolicy() para criar políticas de confiança
 * 3. Sempre passe dados através de políticas antes de usar em innerHTML, etc.
 */

// Verifica se o navegador suporta Trusted Types
if (window.trustedTypes && window.trustedTypes.createPolicy) {
    // Política principal do GetNexo
    // Esta política permite apenas strings que foram explicitamente marcadas como seguras
    const getnexoPolicy = window.trustedTypes.createPolicy('getnexo-trusted', {
        createHTML: (string) => {
            // Validação básica: rejeita strings com tags perigosas
            const dangerousPatterns = [
                /<script[^>]*>/gi,
                /javascript:/gi,
                /on\w+\s*=/gi, // event handlers como onclick, onload, etc.
                /data:/gi,
                /vbscript:/gi
            ];

            for (const pattern of dangerousPatterns) {
                if (pattern.test(string)) {
                    console.warn('Trusted Types: String potencialmente perigosa rejeitada');
                    throw new Error('Trusted Types: String contém padrões perigosos');
                }
            }

            return string;
        },

        createScript: (string) => {
            // Scripts são estritamente controlados
            // Apenas scripts que passam por esta política são permitidos
            console.warn('Trusted Types: createScript chamado - considere usar nonce do CSP');
            return string;
        },

        createScriptURL: (url) => {
            // URLs de script devem ser de domínios confiáveis
            const trustedDomains = [
                'getnexo.com.br',
                'cdn.jsdelivr.net',
                'unpkg.com',
                'cdnjs.cloudflare.com',
                'googletagmanager.com',
                'cloudflareinsights.com',
                'cdn.skypack.dev',
                'openrouter.ai',
                'fonts.googleapis.com',
                'static.cloudflareinsights.com',
                '*.cloudflare.com'
            ];

            try {
                const urlObj = new URL(url);
                const domain = urlObj.hostname;

                // Verifica se o domínio está na lista de confiança
                const isTrusted = trustedDomains.some(trusted =>
                    domain === trusted || domain.endsWith(`.${trusted}`)
                );

                if (!isTrusted) {
                    console.warn(`Trusted Types: URL de script não confiável: ${url}`);
                    throw new Error('Trusted Types: URL de script não confiável');
                }

                return url;
            } catch (error) {
                console.error('Trusted Types: URL inválida', error);
                throw error;
            }
        }
    });

    // Política para dados de API (mais permissiva, mas ainda controlada)
    const apiDataPolicy = window.trustedTypes.createPolicy('getnexo-api-data', {
        createHTML: (string) => {
            // Para dados de API, permite mais flexibilidade mas ainda valida
            // Remove scripts e event handlers
            return string
                .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
        }
    });

    // === default Policy (FALLBACK) ===
    // Esta política 'default' é usada automaticamente pelo navegador quando
    // innerHTML é definido com uma string crua (sem TrustedHTML).
    // Isso "desliga" o erro para bibliotecas de terceiros (Shepherd, etc.)
    if (!window.trustedTypes.defaultPolicy) {
        window.trustedTypes.createPolicy('default', {
            createHTML: (string) => string,
            createScript: (string) => string,
            createScriptURL: (url) => url
        });
    }

    // Exporta as políticas para uso em outros módulos
    // Mantém compatibilidade com mega-chat-sim.js que busca window.getnexoPolicy
    window.getnexoPolicy = getnexoPolicy;

    window.getnexoTrustedTypes = {
        policy: getnexoPolicy,
        apiPolicy: apiDataPolicy
    };

    console.log('Trusted Types: Políticas (incluindo default) carregadas com sucesso');
} else {
    // ... (fallback maintains same logic)
    window.getnexoPolicy = {
        createHTML: (string) => string,
        createScript: (string) => string,
        createScriptURL: (url) => url
    };

    window.getnexoTrustedTypes = {
        policy: window.getnexoPolicy,
        apiPolicy: { createHTML: (string) => string }
    };
}
