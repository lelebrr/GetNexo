/**
 * Magic Map - User Tracking System
 * Sistema de rastreamento de usuários para analytics avançado
 */

(function (window, document) {
    'use strict';

    // Configuração do tracking
    const TRACKING_CONFIG = {
        apiEndpoint: '/api/tracking',
        sessionTimeout: 30 * 60 * 1000, // 30 minutos
        eventBatchSize: 10,
        eventBatchTimeout: 5000,
        maxEventsPerMinute: 120,
        enableRealTime: true,
        enableHeatmap: true,
        enableAlerts: true,
        gdprRequired: true,
        anonymizeIP: true,
        samplingRate: 1.0
    };

    // Estado do tracking
    let trackingState = {
        sessionId: null,
        visitorId: null,
        isActive: false,
        gdprConsent: false,
        lastActivity: Date.now(),
        eventQueue: [],
        batchTimer: null,
        eventCount: 0,
        lastEventTime: 0,
        pageStartTime: Date.now(),
        scrollDepth: 0,
        maxScrollDepth: 0,
        mouseMovements: [],
        clickHeatmap: new Map(),
        attentionZones: new Map()
    };

    // Utilitários
    const utils = {
        // Gerar ID único
        generateId: function () {
            return Date.now().toString(36) + Math.random().toString(36).substr(2);
        },

        // Hash simples para anonimização
        hashString: function (str) {
            let hash = 0;
            if (str.length === 0) return hash;
            for (let i = 0; i < str.length; i++) {
                const char = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash; // Converter para 32-bit
            }
            return Math.abs(hash).toString(36);
        },

        // Detectar tipo de dispositivo
        getDeviceType: function () {
            const ua = navigator.userAgent;
            if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
                return 'tablet';
            }
            if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
                return 'mobile';
            }
            return 'desktop';
        },

        // Detectar navegador
        getBrowser: function () {
            const ua = navigator.userAgent;
            if (ua.includes('Chrome')) return 'Chrome';
            if (ua.includes('Firefox')) return 'Firefox';
            if (ua.includes('Safari')) return 'Safari';
            if (ua.includes('Edge')) return 'Edge';
            if (ua.includes('Opera')) return 'Opera';
            return 'Unknown';
        },

        // Detectar sistema operacional
        getOS: function () {
            const ua = navigator.userAgent;
            if (ua.includes('Windows')) return 'Windows';
            if (ua.includes('Mac')) return 'macOS';
            if (ua.includes('Linux')) return 'Linux';
            if (ua.includes('Android')) return 'Android';
            if (ua.includes('iOS')) return 'iOS';
            return 'Unknown';
        },

        // Obter parâmetros UTM da URL
        getUTMParameters: function () {
            const urlParams = new URLSearchParams(window.location.search);
            return {
                source: urlParams.get('utm_source'),
                medium: urlParams.get('utm_medium'),
                campaign: urlParams.get('utm_campaign'),
                term: urlParams.get('utm_term'),
                content: urlParams.get('utm_content')
            };
        },

        // Calcular profundidade de scroll
        getScrollDepth: function () {
            const documentHeight = Math.max(
                document.body.scrollHeight,
                document.body.offsetHeight,
                document.documentElement.clientHeight,
                document.documentElement.scrollHeight,
                document.documentElement.offsetHeight
            );
            const windowHeight = window.innerHeight;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            return Math.round((scrollTop / (documentHeight - windowHeight)) * 100);
        },

        // Obter elemento sob o cursor
        getElementInfo: function (event) {
            const element = event.target;
            if (!element) return null;

            return {
                selector: this.getElementSelector(element),
                text: element.textContent ? element.textContent.trim().substring(0, 100) : '',
                type: element.tagName.toLowerCase(),
                className: element.className,
                id: element.id
            };
        },

        // Gerar seletor CSS único para o elemento
        getElementSelector: function (element) {
            if (element.id) {
                return `#${element.id}`;
            }

            let path = [];
            while (element.nodeType === Node.ELEMENT_NODE) {
                let selector = element.nodeName.toLowerCase();
                if (element.className) {
                    selector += '.' + element.className.trim().split(/\s+/).join('.');
                }
                if (element.name) {
                    selector += `[name="${element.name}"]`;
                }

                // Adicionar nth-child se necessário
                let sibling = element.previousSibling;
                let nth = 1;
                while (sibling) {
                    if (sibling.nodeType === Node.ELEMENT_NODE && sibling.nodeName === element.nodeName) {
                        nth++;
                    }
                    sibling = sibling.previousSibling;
                }

                if (nth > 1) {
                    selector += `:nth-child(${nth})`;
                }

                path.unshift(selector);

                element = element.parentNode;
                if (!element || element.nodeName === 'HTML') break;
            }

            return path.join(' > ');
        },

        // Verificar se deve samplear o evento
        shouldSample: function () {
            return Math.random() < TRACKING_CONFIG.samplingRate;
        },

        // Rate limiting
        checkRateLimit: function () {
            const now = Date.now();
            if (now - trackingState.lastEventTime < 60000) { // por minuto
                trackingState.eventCount++;
                if (trackingState.eventCount > TRACKING_CONFIG.maxEventsPerMinute) {
                    return false;
                }
            } else {
                trackingState.eventCount = 1;
                trackingState.lastEventTime = now;
            }
            return true;
        }
    };

    // Sistema de consentimento GDPR
    const gdprManager = {
        consentKey: 'magicmap_gdpr_consent',
        consentVersion: '1.0',

        // Verificar se consentimento foi dado
        hasConsent: function () {
            if (!TRACKING_CONFIG.gdprRequired) return true;

            const consent = localStorage.getItem(this.consentKey);
            if (!consent) return false;

            try {
                const data = JSON.parse(consent);
                return data.consent === true && data.version === this.consentVersion;
            } catch (e) {
                return false;
            }
        },

        // Solicitar consentimento
        requestConsent: function () {
            if (this.hasConsent()) {
                trackingState.gdprConsent = true;
                gdprManager.initializeTracking();
                return;
            }

            // Criar modal de consentimento
            this.showConsentModal();
        },

        // Inicializar tracking após consentimento
        initializeTracking: function () {
            try {
                if (typeof window.MagicMap !== 'undefined' && typeof window.MagicMap.initializeTracking === 'function') {
                    window.MagicMap.initializeTracking();
                } else {
                    console.error('[MagicMap] initializeTracking method not found');
                }
            } catch (error) {
                console.error('[MagicMap] Error initializing tracking:', error);
            }
        },

        // Mostrar modal de consentimento
        showConsentModal: function () {
            const modal = document.createElement('div');
            modal.id = 'magicmap-consent-modal';
            modal.innerHTML = `
                <div style="
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 999999;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                ">
                    <div style="
                        background: white;
                        padding: 20px;
                        border-radius: 8px;
                        max-width: 500px;
                        width: 90%;
                        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    ">
                        <h3 style="margin: 0 0 10px 0; color: #333;">🍪 Privacidade e Cookies</h3>
                        <p style="margin: 0 0 15px 0; color: #666; font-size: 14px;">
                            Utilizamos cookies e tecnologias similares para melhorar sua experiência,
                            analisar o tráfego e personalizar conteúdo. Seus dados são processados
                            de forma anônima e respeitamos sua privacidade conforme a LGPD/GDPR.
                        </p>
                        <div style="display: flex; gap: 10px; justify-content: flex-end;">
                            <button id="magicmap-reject" style="
                                padding: 8px 16px;
                                border: 1px solid #ddd;
                                background: white;
                                border-radius: 4px;
                                cursor: pointer;
                                color: #666;
                            ">Rejeitar</button>
                            <button id="magicmap-accept" style="
                                padding: 8px 16px;
                                border: none;
                                background: #007bff;
                                color: white;
                                border-radius: 4px;
                                cursor: pointer;
                            ">Aceitar</button>
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            // Event listeners
            document.getElementById('magicmap-accept').onclick = () => {
                this.grantConsent();
                modal.remove();
            };

            document.getElementById('magicmap-reject').onclick = () => {
                this.denyConsent();
                modal.remove();
            };
        },

        // Conceder consentimento
        grantConsent: function () {
            const consentData = {
                consent: true,
                version: this.consentVersion,
                timestamp: new Date().toISOString(),
                ip: TRACKING_CONFIG.anonymizeIP ? utils.hashString(navigator.userAgent) : null
            };

            localStorage.setItem(this.consentKey, JSON.stringify(consentData));
            trackingState.gdprConsent = true;
            this.initializeTracking();
        },

        // Negar consentimento
        denyConsent: function () {
            trackingState.gdprConsent = false;
            localStorage.setItem(this.consentKey, JSON.stringify({
                consent: false,
                version: this.consentVersion,
                timestamp: new Date().toISOString()
            }));
        }
    };

    // API de comunicação
    const api = {
        // Enviar requisição para a API
        send: async function (endpoint, data) {
            try {
                const response = await fetch(`${TRACKING_CONFIG.apiEndpoint}${endpoint}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });

                if (!response.ok) {
                    console.warn('[MagicMap] API request failed:', response.status);
                }

                return response.json();
            } catch (error) {
                console.error('[MagicMap] API request error:', error);
                return null;
            }
        },

        // Inicializar sessão
        initializeSession: async function () {
            const sessionData = {
                visitor_id: trackingState.visitorId,
                ip_address: TRACKING_CONFIG.anonymizeIP ? utils.hashString(navigator.userAgent) : null,
                user_agent: navigator.userAgent,
                referrer: document.referrer,
                ...utils.getUTMParameters(),
                device_type: utils.getDeviceType(),
                browser: utils.getBrowser(),
                os: utils.getOS(),
                screen_resolution: `${screen.width}x${screen.height}`,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                language: navigator.language,
                gdpr_consent: trackingState.gdprConsent,
                gdpr_consent_date: trackingState.gdprConsent ? new Date().toISOString() : null,
                gdpr_consent_version: gdprManager.consentVersion,
                entry_page: window.location.href,
                start_time: new Date(trackingState.pageStartTime).toISOString()
            };

            const response = await this.send('/session/init', sessionData);
            if (response && response.session_id) {
                trackingState.sessionId = response.session_id;
                trackingState.isActive = true;
                console.log('[MagicMap] Session initialized:', trackingState.sessionId);
            }
        },

        // Enviar eventos em lote
        sendBatchEvents: async function () {
            if (trackingState.eventQueue.length === 0) return;

            const events = trackingState.eventQueue.splice(0);
            const response = await this.send('/events/batch', {
                session_id: trackingState.sessionId,
                events: events
            });

            if (response) {
                console.log(`[MagicMap] Sent ${events.length} events`);
            } else {
                // Re-adicionar eventos na fila em caso de falha
                trackingState.eventQueue.unshift(...events);
            }
        },

        // Atualizar atividade da sessão
        updateSessionActivity: async function () {
            if (!trackingState.sessionId) return;

            await this.send('/session/activity', {
                session_id: trackingState.sessionId,
                last_activity: new Date().toISOString(),
                page_views: trackingState.pageViews || 1,
                max_scroll_depth: trackingState.maxScrollDepth
            });
        },

        // Finalizar sessão
        endSession: async function () {
            if (!trackingState.sessionId) return;

            const duration = Math.floor((Date.now() - trackingState.pageStartTime) / 1000);
            await this.send('/session/end', {
                session_id: trackingState.sessionId,
                end_time: new Date().toISOString(),
                duration: duration,
                exit_page: window.location.href,
                max_scroll_depth: trackingState.maxScrollDepth,
                page_views: trackingState.pageViews || 1
            });

            trackingState.isActive = false;
        }
    };

    // Rastreadores de eventos
    const trackers = {
        // Rastreamento de cliques
        clicks: {
            init: function () {
                document.addEventListener('click', this.handleClick.bind(this), true);
            },

            handleClick: function (event) {
                if (!trackingState.isActive || !utils.shouldSample() || !utils.checkRateLimit()) return;

                const elementInfo = utils.getElementInfo(event);
                const scrollDepth = utils.getScrollDepth();

                const clickEvent = {
                    event_type: 'click',
                    page_url: window.location.href,
                    page_title: document.title,
                    element_selector: elementInfo?.selector,
                    element_text: elementInfo?.text,
                    element_type: elementInfo?.type,
                    position_x: event.clientX,
                    position_y: event.clientY,
                    viewport_width: window.innerWidth,
                    viewport_height: window.innerHeight,
                    scroll_x: window.pageXOffset,
                    scroll_y: window.pageYOffset,
                    scroll_depth: scrollDepth,
                    timestamp: new Date().toISOString(),
                    metadata: {
                        element_class: elementInfo?.className,
                        element_id: elementInfo?.id
                    }
                };

                trackingState.eventQueue.push(clickEvent);
                trackingState.lastActivity = Date.now();

                // Atualizar heatmap local
                if (TRACKING_CONFIG.enableHeatmap) {
                    const key = `${Math.floor(event.clientX / 10) * 10},${Math.floor(event.clientY / 10) * 10}`;
                    trackingState.clickHeatmap.set(key, (trackingState.clickHeatmap.get(key) || 0) + 1);
                }
            }
        },

        // Rastreamento de scroll
        scroll: {
            lastScrollTime: 0,
            scrollTimeout: null,

            init: function () {
                window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
            },

            handleScroll: function () {
                if (!trackingState.isActive) return;

                const now = Date.now();
                if (now - this.lastScrollTime < 100) return; // Throttle

                this.lastScrollTime = now;
                clearTimeout(this.scrollTimeout);

                this.scrollTimeout = setTimeout(() => {
                    if (!utils.shouldSample() || !utils.checkRateLimit()) return;

                    const scrollDepth = utils.getScrollDepth();
                    trackingState.maxScrollDepth = Math.max(trackingState.maxScrollDepth, scrollDepth);

                    const scrollEvent = {
                        event_type: 'scroll',
                        page_url: window.location.href,
                        page_title: document.title,
                        position_x: 0,
                        position_y: 0,
                        viewport_width: window.innerWidth,
                        viewport_height: window.innerHeight,
                        scroll_x: window.pageXOffset,
                        scroll_y: window.pageYOffset,
                        scroll_depth: scrollDepth,
                        timestamp: new Date().toISOString(),
                        duration: 100,
                        metadata: {
                            max_scroll_depth: trackingState.maxScrollDepth
                        }
                    };

                    trackingState.eventQueue.push(scrollEvent);
                    trackingState.lastActivity = now;
                }, 250);
            }
        },

        // Rastreamento de movimento do mouse
        mouse: {
            lastMouseTime: 0,
            mousePath: [],
            lastPosition: null,

            init: function () {
                document.addEventListener('mousemove', this.handleMouseMove.bind(this), { passive: true });
            },

            handleMouseMove: function (event) {
                if (!trackingState.isActive || !TRACKING_CONFIG.enableHeatmap) return;

                const now = Date.now();
                if (now - this.lastMouseTime < 50) return; // Throttle

                this.lastMouseTime = now;

                // Rastrear caminho do mouse
                const position = { x: event.clientX, y: event.clientY, time: now };
                this.mousePath.push(position);

                // Manter apenas últimos 50 pontos
                if (this.mousePath.length > 50) {
                    this.mousePath.shift();
                }

                // Calcular zonas de atenção
                if (this.lastPosition) {
                    const timeDiff = now - this.lastPosition.time;
                    const distance = Math.sqrt(
                        Math.pow(event.clientX - this.lastPosition.x, 2) +
                        Math.pow(event.clientY - this.lastPosition.y, 2)
                    );

                    if (timeDiff > 0 && distance < 100) { // Mouse parado ou movimento lento
                        const zoneKey = `${Math.floor(event.clientX / 25) * 25},${Math.floor(event.clientY / 25) * 25}`;
                        trackingState.attentionZones.set(zoneKey, (trackingState.attentionZones.get(zoneKey) || 0) + timeDiff);
                    }
                }

                this.lastPosition = position;

                // Enviar evento de movimento periodicamente
                if (this.mousePath.length >= 10 && utils.shouldSample() && utils.checkRateLimit()) {
                    const mouseEvent = {
                        event_type: 'mouse_move',
                        page_url: window.location.href,
                        page_title: document.title,
                        position_x: event.clientX,
                        position_y: event.clientY,
                        viewport_width: window.innerWidth,
                        viewport_height: window.innerHeight,
                        scroll_x: window.pageXOffset,
                        scroll_y: window.pageYOffset,
                        timestamp: new Date().toISOString(),
                        duration: now - (this.mousePath[0]?.time || now),
                        metadata: {
                            path_length: this.mousePath.length,
                            attention_zones: Object.fromEntries(trackingState.attentionZones)
                        }
                    };

                    trackingState.eventQueue.push(mouseEvent);
                    trackingState.lastActivity = now;
                    this.mousePath = []; // Reset path
                }
            }
        },

        // Rastreamento de visualização de página
        pageView: {
            init: function () {
                // Registrar pageview inicial
                this.trackPageView();

                // Rastrear mudanças de página (SPA)
                let currentUrl = window.location.href;
                const observer = new MutationObserver(() => {
                    if (window.location.href !== currentUrl) {
                        currentUrl = window.location.href;
                        this.trackPageView();
                    }
                });

                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            },

            trackPageView: function () {
                if (!trackingState.isActive) return;

                const pageViewEvent = {
                    event_type: 'page_view',
                    page_url: window.location.href,
                    page_title: document.title,
                    timestamp: new Date().toISOString(),
                    metadata: {
                        referrer: document.referrer,
                        load_time: performance.now(),
                        ...utils.getUTMParameters()
                    }
                };

                trackingState.eventQueue.push(pageViewEvent);
                trackingState.pageViews = (trackingState.pageViews || 0) + 1;
                trackingState.lastActivity = Date.now();
            }
        },

        // Rastreamento de formulários
        forms: {
            init: function () {
                document.addEventListener('submit', this.handleFormSubmit.bind(this));
                document.addEventListener('focus', this.handleFormFocus.bind(this), true);
                document.addEventListener('blur', this.handleFormBlur.bind(this), true);
            },

            handleFormSubmit: function (event) {
                if (!trackingState.isActive || !utils.shouldSample() || !utils.checkRateLimit()) return;

                const formEvent = {
                    event_type: 'form_submit',
                    page_url: window.location.href,
                    page_title: document.title,
                    element_selector: utils.getElementSelector(event.target),
                    element_type: 'form',
                    timestamp: new Date().toISOString(),
                    metadata: {
                        form_action: event.target.action,
                        form_method: event.target.method,
                        form_id: event.target.id,
                        form_class: event.target.className
                    }
                };

                trackingState.eventQueue.push(formEvent);
                trackingState.lastActivity = Date.now();
            },

            handleFormFocus: function (event) {
                if (!trackingState.isActive || event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA') return;

                trackingState.formFocusTime = Date.now();
            },

            handleFormBlur: function (event) {
                if (!trackingState.isActive || !trackingState.formFocusTime) return;
                if (event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA') return;

                const focusDuration = Date.now() - trackingState.formFocusTime;

                if (utils.shouldSample() && utils.checkRateLimit()) {
                    const focusEvent = {
                        event_type: 'form_focus',
                        page_url: window.location.href,
                        page_title: document.title,
                        element_selector: utils.getElementSelector(event.target),
                        element_type: event.target.tagName.toLowerCase(),
                        timestamp: new Date().toISOString(),
                        duration: focusDuration,
                        metadata: {
                            field_name: event.target.name,
                            field_type: event.target.type,
                            field_value_length: event.target.value ? event.target.value.length : 0
                        }
                    };

                    trackingState.eventQueue.push(focusEvent);
                }

                trackingState.formFocusTime = null;
                trackingState.lastActivity = Date.now();
            }
        }
    };

    // Sistema de alertas
    const alerts = {
        inactivityThreshold: TRACKING_CONFIG.inactivityThreshold || 300, // 5 minutos
        checkInterval: 30000, // verificar a cada 30 segundos

        init: function () {
            if (!TRACKING_CONFIG.enableAlerts) return;

            setInterval(this.checkInactivity.bind(this), this.checkInterval);
        },

        checkInactivity: function () {
            if (!trackingState.isActive) return;

            const now = Date.now();
            const inactiveTime = (now - trackingState.lastActivity) / 1000;

            if (inactiveTime > this.inactivityThreshold) {
                this.sendInactivityAlert(inactiveTime);
            }
        },

        sendInactivityAlert: function (inactiveSeconds) {
            // Enviar alerta para o servidor
            api.send('/alerts/inactivity', {
                session_id: trackingState.sessionId,
                visitor_id: trackingState.visitorId,
                inactive_seconds: inactiveSeconds,
                page_url: window.location.href,
                last_activity: new Date(trackingState.lastActivity).toISOString()
            });
        }
    };

    // Inicialização principal
    const magicMap = {
        init: function (config = {}) {
            // Mesclar configuração
            Object.assign(TRACKING_CONFIG, config);

            // Gerar visitor ID
            trackingState.visitorId = localStorage.getItem('magicmap_visitor_id') || utils.generateId();
            localStorage.setItem('magicmap_visitor_id', trackingState.visitorId);

            // Verificar consentimento GDPR
            gdprManager.requestConsent();
        },

        initializeTracking: function () {
            // Inicializar API
            api.initializeSession().then(() => {
                // Inicializar rastreadores
                trackers.clicks.init();
                trackers.scroll.init();
                trackers.mouse.init();
                trackers.pageView.init();
                trackers.forms.init();

                // Inicializar alertas
                alerts.init();

                // Iniciar envio em lote
                this.startBatchSending();

                // Atualizar atividade periodicamente
                setInterval(() => {
                    api.updateSessionActivity();
                }, 60000); // a cada minuto

                console.log('[MagicMap] Tracking initialized successfully');
            });
        },

        startBatchSending: function () {
            if (trackingState.batchTimer) return;

            trackingState.batchTimer = setInterval(() => {
                if (trackingState.eventQueue.length >= TRACKING_CONFIG.eventBatchSize) {
                    api.sendBatchEvents();
                }
            }, TRACKING_CONFIG.eventBatchTimeout);

            // Envio final ao fechar página
            window.addEventListener('beforeunload', () => {
                api.endSession();
                if (trackingState.eventQueue.length > 0) {
                    api.sendBatchEvents();
                }
            });

            // Envio ao ficar invisível (mobile)
            document.addEventListener('visibilitychange', () => {
                if (document.hidden && trackingState.eventQueue.length > 0) {
                    api.sendBatchEvents();
                }
            });
        },

        // API pública para uso externo
        trackEvent: function (eventType, data) {
            if (!trackingState.isActive) return;

            const customEvent = {
                event_type: eventType,
                page_url: window.location.href,
                page_title: document.title,
                timestamp: new Date().toISOString(),
                metadata: data
            };

            trackingState.eventQueue.push(customEvent);
            trackingState.lastActivity = Date.now();
        },

        getSessionData: function () {
            return {
                sessionId: trackingState.sessionId,
                visitorId: trackingState.visitorId,
                isActive: trackingState.isActive,
                gdprConsent: trackingState.gdprConsent,
                eventsQueued: trackingState.eventQueue.length,
                lastActivity: trackingState.lastActivity
            };
        },

        stop: function () {
            trackingState.isActive = false;
            if (trackingState.batchTimer) {
                clearInterval(trackingState.batchTimer);
                trackingState.batchTimer = null;
            }
            api.endSession();
        }
    };

    // Expor API global
    window.MagicMap = magicMap;

    // Auto-inicialização se não houver configuração manual
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            if (!window.MagicMapInitialized) {
                magicMap.init();
                window.MagicMapInitialized = true;
            }
        });
    } else {
        if (!window.MagicMapInitialized) {
            magicMap.init();
            window.MagicMapInitialized = true;
        }
    }

})(window, document);