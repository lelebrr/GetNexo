// GetNexo Plugin Manager - Sistema Básico de Extensibilidade
(function () {
    class PluginManager {
        constructor() {
            this.plugins = new Map();
            this.hooks = new Map();
            this.initialized = false;
        }

        // Registrar um plugin
        register(name, plugin) {
            if (this.plugins.has(name)) {
                console.warn(`Plugin ${name} já está registrado. Sobrescrevendo.`);
            }

            this.plugins.set(name, {
                ...plugin,
                name,
                enabled: plugin.enabled !== false,
                priority: plugin.priority || 10
            });

            console.log(`Plugin ${name} registrado com sucesso.`);

            // Se já inicializado, inicializar o novo plugin
            if (this.initialized && plugin.init) {
                try {
                    plugin.init(this.getAPI());
                } catch (e) {
                    console.error(`Erro ao inicializar plugin ${name}:`, e);
                }
            }
        }

        // Desregistrar plugin
        unregister(name) {
            const plugin = this.plugins.get(name);
            if (plugin && plugin.destroy) {
                try {
                    plugin.destroy();
                } catch (e) {
                    console.error(`Erro ao destruir plugin ${name}:`, e);
                }
            }
            this.plugins.delete(name);
            console.log(`Plugin ${name} removido.`);
        }

        // Habilitar plugin
        enable(name) {
            const plugin = this.plugins.get(name);
            if (plugin && !plugin.enabled) {
                plugin.enabled = true;
                if (plugin.onEnable) {
                    plugin.onEnable(this.getAPI());
                }
                this.savePluginState();
            }
        }

        // Desabilitar plugin
        disable(name) {
            const plugin = this.plugins.get(name);
            if (plugin && plugin.enabled) {
                plugin.enabled = false;
                if (plugin.onDisable) {
                    plugin.onDisable();
                }
                this.savePluginState();
            }
        }

        // Executar hook
        async runHook(hookName, ...args) {
            const hookPlugins = Array.from(this.plugins.values())
                .filter(p => p.enabled && p.hooks && p.hooks[hookName])
                .sort((a, b) => (a.priority || 10) - (b.priority || 10));

            const results = [];
            for (const plugin of hookPlugins) {
                try {
                    const result = await plugin.hooks[hookName](...args, this.getAPI());
                    results.push(result);
                } catch (e) {
                    console.error(`Erro no hook ${hookName} do plugin ${plugin.name}:`, e);
                }
            }
            return results;
        }

        // Adicionar hook listener
        addHook(hookName, callback, priority = 10) {
            if (!this.hooks.has(hookName)) {
                this.hooks.set(hookName, []);
            }
            this.hooks.get(hookName).push({ callback, priority });
            this.hooks.get(hookName).sort((a, b) => a.priority - b.priority);
        }

        // Executar hooks internos
        async triggerHook(hookName, ...args) {
            const listeners = this.hooks.get(hookName) || [];
            for (const listener of listeners) {
                try {
                    await listener.callback(...args);
                } catch (e) {
                    console.error(`Erro em hook listener ${hookName}:`, e);
                }
            }
        }

        // API exposta aos plugins
        getAPI() {
            return {
                registerHook: (name, callback, priority) => this.addHook(name, callback, priority),
                runHook: (name, ...args) => this.runHook(name, ...args),
                getPlugins: () => Array.from(this.plugins.keys()),
                getPlugin: (name) => this.plugins.get(name),
                setSetting: (key, value) => {
                    const settings = JSON.parse(localStorage.getItem('nexo-plugin-settings') || '{}');
                    settings[key] = value;
                    localStorage.setItem('nexo-plugin-settings', JSON.stringify(settings));
                },
                getSetting: (key, defaultValue) => {
                    const settings = JSON.parse(localStorage.getItem('nexo-plugin-settings') || '{}');
                    return settings[key] !== undefined ? settings[key] : defaultValue;
                }
            };
        }

        // Salvar estado dos plugins
        savePluginState() {
            const state = {};
            for (const [name, plugin] of this.plugins) {
                state[name] = { enabled: plugin.enabled };
            }
            localStorage.setItem('nexo-plugins-state', JSON.stringify(state));
        }

        // Carregar estado dos plugins
        loadPluginState() {
            const state = localStorage.getItem('nexo-plugins-state');
            if (state) {
                try {
                    const parsed = JSON.parse(state);
                    for (const [name, config] of Object.entries(parsed)) {
                        const plugin = this.plugins.get(name);
                        if (plugin) {
                            plugin.enabled = config.enabled;
                        }
                    }
                } catch (e) {
                    console.warn('Erro ao carregar estado dos plugins:', e);
                }
            }
        }

        // Inicializar todos os plugins
        async init() {
            if (this.initialized) return;

            this.loadPluginState();

            // Inicializar plugins habilitados em ordem de prioridade
            const enabledPlugins = Array.from(this.plugins.values())
                .filter(p => p.enabled)
                .sort((a, b) => (a.priority || 10) - (b.priority || 10));

            for (const plugin of enabledPlugins) {
                try {
                    if (plugin.init) {
                        await plugin.init(this.getAPI());
                    }
                    console.log(`Plugin ${plugin.name} inicializado.`);
                } catch (e) {
                    console.error(`Erro ao inicializar plugin ${plugin.name}:`, e);
                    this.disable(plugin.name); // Desabilitar plugin com erro
                }
            }

            this.initialized = true;
            this.triggerHook('pluginsReady');
        }

        // Carregar plugin dinamicamente
        async loadPlugin(url, name) {
            try {
                const response = await fetch(url);
                const code = await response.text();
                const pluginFunction = new Function('api', `return (${code})`);
                const plugin = pluginFunction(this.getAPI());
                this.register(name, plugin);
                return true;
            } catch (e) {
                console.error(`Erro ao carregar plugin ${name} de ${url}:`, e);
                return false;
            }
        }
    }

    // Instância global
    window.PluginManager = new PluginManager();

    // Plugins padrão incluídos
    window.PluginManager.register('neural-controls', {
        priority: 1,
        init(api) {
            // Hook para adicionar controles neurais ao UI
            api.registerHook('uiReady', () => {
                // Já implementado no ui-features.js
                console.log('Controles neurais prontos via plugin.');
            });
        }
    });

    window.PluginManager.register('accessibility-enhancements', {
        priority: 2,
        init(api) {
            // Hook para melhorias de acessibilidade
            api.registerHook('uiReady', () => {
                // Adicionar atalhos de teclado adicionais
                document.addEventListener('keydown', (e) => {
                    if (e.altKey && e.key === 'a') {
                        e.preventDefault();
                        const a11yBtn = document.getElementById('a11y-toggle');
                        if (a11yBtn) a11yBtn.click();
                    }
                });
            });
        }
    });

    // Inicializar quando DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => window.PluginManager.init());
    } else {
        window.PluginManager.init();
    }

})();