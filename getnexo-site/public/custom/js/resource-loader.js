(function () {
    // CSS Deferred Loading Logic (Replaces inline onload handlers)
    var deferredStyles = document.querySelectorAll('.deferred-styles');
    deferredStyles.forEach(function (link) {
        link.media = 'all'; // Switch immediately if script runs (async/defer might race)
        link.onload = function () { this.media = 'all'; }; // Redundant but safe
    });

    // Carregamento otimizado de recursos de terceiros - Reduzido ao mínimo essencial
    const thirdPartyResources = {
        modelViewer: {
            src: 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js',
            priority: 'low',
            delay: 8000, // Aumentado para reduzir impacto no LCP
            triggers: ['model-viewer', '[data-3d-model]', '.ar-viewer'],
            autoLoad: false
        },
        fontAwesome: {
            src: 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/js/all.min.js',
            priority: 'low',
            delay: 3000,
            triggers: ['.fa', '[data-icon]'],
            autoLoad: false
        }
    };

    const loaded = new Set();

    const loadResource = (key) => {
        if (loaded.has(key)) return;
        const res = thirdPartyResources[key];
        const script = document.createElement('script');
        script.src = res.src;
        script.async = true;
        script.defer = true;
        script.fetchpriority = 'low';
        script.crossOrigin = 'anonymous';
        script.setAttribute('data-priority', res.priority);

        // Aplicar nonce se disponível para conformidade com CSP
        const configNonce = window.GETNEXO_CONFIG && window.GETNEXO_CONFIG.nonce;
        if (configNonce) {
            script.nonce = configNonce;
        }

        script.onload = () => {
            loaded.add(key);
        };
        script.onerror = () => {
            console.warn(`Failed to load ${key} resource`);
        };

        // Adicionar script ao head com prioridade baixa
        document.head.appendChild(script);
    };

    // Carrega apenas quando o usuário interage com elementos específicos
    document.addEventListener('click', (e) => {
        Object.keys(thirdPartyResources).forEach(key => {
            const res = thirdPartyResources[key];
            if (res.triggers.some(t => e.target.closest(t))) {
                loadResource(key);
            }
        });
    }, { once: false, capture: true, passive: true });

    // Carregamento atrasado para não bloquear o LCP
    if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => {
            Object.keys(thirdPartyResources).forEach(key => {
                const res = thirdPartyResources[key];
                if (res.autoLoad) {
                    setTimeout(() => loadResource(key), res.delay);
                }
            });
        }, { timeout: 3000 });
    }
})();
