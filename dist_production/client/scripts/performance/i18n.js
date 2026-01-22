// GetNexo Internationalization (i18n) System
(function () {
    class I18nManager {
        constructor() {
            this.currentLang = 'pt-BR';
            this.translations = {};
            this.fallbackLang = 'pt-BR';
            this.initialized = false;
        }

        // Carregar traduções
        async loadTranslations(lang) {
            try {
                const response = await fetch(`/locales/${lang}.json`);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const translations = await response.json();
                this.translations[lang] = translations;
                return true;
            } catch (e) {
                console.warn(`Erro ao carregar traduções para ${lang}:`, e);
                return false;
            }
        }

        // Definir idioma
        async setLanguage(lang) {
            if (!this.translations[lang]) {
                const loaded = await this.loadTranslations(lang);
                if (!loaded) return false;
            }

            this.currentLang = lang;
            localStorage.setItem('nexo-lang', lang);
            document.documentElement.lang = lang;

            // Aplicar traduções
            this.applyTranslations();

            // Disparar evento de mudança de idioma
            window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));

            return true;
        }

        // Obter tradução
        t(key, params = {}) {
            const keys = key.split('.');
            let value = this.translations[this.currentLang];

            // Navegar pela estrutura aninhada
            for (const k of keys) {
                value = value?.[k];
            }

            // Fallback para idioma padrão
            if (value === undefined && this.currentLang !== this.fallbackLang) {
                value = this.translations[this.fallbackLang];
                for (const k of keys) {
                    value = value?.[k];
                }
            }

            // Se ainda undefined, retornar a chave
            if (value === undefined) {
                console.warn(`Chave de tradução não encontrada: ${key}`);
                return key;
            }

            // Substituir parâmetros
            if (typeof value === 'string') {
                return value.replace(/\{\{(\w+)\}\}/g, (match, param) => params[param] || match);
            }

            return value;
        }

        // Aplicar traduções no DOM
        applyTranslations() {
            // Elementos com data-i18n
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                const attr = el.getAttribute('data-i18n-attr');

                if (attr) {
                    el.setAttribute(attr, this.t(key));
                } else {
                    if (el.tagName === 'INPUT' && el.type === 'placeholder') {
                        el.placeholder = this.t(key);
                    } else {
                        el.textContent = this.t(key);
                    }
                }
            });

            // Elementos com data-i18n-html (para HTML)
            document.querySelectorAll('[data-i18n-html]').forEach(el => {
                const key = el.getAttribute('data-i18n-html');
                el.innerHTML = this.t(key);
            });

            // Atualizar direção do texto se necessário
            const isRTL = ['ar', 'he', 'fa'].includes(this.currentLang.split('-')[0]);
            document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
        }

        // Obter idiomas disponíveis
        getAvailableLanguages() {
            return [
                { code: 'pt-BR', name: 'Português (Brasil)', flag: '🇧🇷' },
                { code: 'en', name: 'English', flag: '🇺🇸' },
                { code: 'es', name: 'Español', flag: '🇪🇸' },
                { code: 'fr', name: 'Français', flag: '🇫🇷' }
            ];
        }

        // Detectar idioma do navegador
        detectBrowserLanguage() {
            const browserLang = navigator.language || navigator.userLanguage;
            const available = this.getAvailableLanguages().map(l => l.code);

            // Verificar correspondência exata
            if (available.includes(browserLang)) {
                return browserLang;
            }

            // Verificar correspondência de idioma base
            const baseLang = browserLang.split('-')[0];
            const match = available.find(lang => lang.startsWith(baseLang));
            return match || this.fallbackLang;
        }

        // Inicializar
        async init() {
            if (this.initialized) return;

            // Carregar idioma salvo ou detectar do navegador
            const savedLang = localStorage.getItem('nexo-lang');
            const targetLang = savedLang || this.detectBrowserLanguage();

            // Carregar traduções do idioma padrão primeiro
            await this.loadTranslations(this.fallbackLang);

            // Definir idioma
            if (targetLang !== this.fallbackLang) {
                await this.setLanguage(targetLang);
            } else {
                this.currentLang = this.fallbackLang;
                document.documentElement.lang = this.fallbackLang;
                this.applyTranslations();
            }

            this.initialized = true;
            console.log(`i18n inicializado com idioma: ${this.currentLang}`);
        }

        // API global
        getAPI() {
            return {
                t: (key, params) => this.t(key, params),
                setLanguage: (lang) => this.setLanguage(lang),
                getCurrentLanguage: () => this.currentLang,
                getAvailableLanguages: () => this.getAvailableLanguages()
            };
        }
    }

    // Instância global
    window.I18n = new I18nManager();

    // Inicializar quando DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => window.I18n.init());
    } else {
        window.I18n.init();
    }

})();