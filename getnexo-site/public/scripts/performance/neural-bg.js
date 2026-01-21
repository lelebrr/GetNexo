/**
 * Neural Background Animation System
 *
 * @description Sistema de fundo neural animado otimizado para performance,
 * com suporte a temas dinâmicos, controles de acessibilidade e integração.
 *
 * @version 2.0.0
 * @author GetNexo Team
 * @license MIT
 *
 * Funcionalidades:
 * - Animação de partículas neurais com conexões dinâmicas
 * - Suporte a múltiplos temas visuais
 * - Controles de velocidade e pausa
 * - Otimização para dispositivos móveis e baixa potência
 * - Métricas de performance em tempo real
 * - Sistema de fallback para navegadores antigos
 * - Controles de acessibilidade via teclado
 * - Integração com sistema de animações principal
 * - Cache inteligente de configurações via localStorage
 * - Modo debug para desenvolvimento
 * - Microinterações: hover, click feedback, transições suaves
 * - Feedback háptico em dispositivos compatíveis
 *
 * Uso:
 * - Inclua o script no HTML: <script src="scripts/performance/neural-bg.js"></script>
 * - Certifique-se de ter um canvas com id="neural-bg"
 * - API global: window.neuralBG.pause(), setSpeed(speed), setTheme(theme), getPerformance(), toggleDebug()
 *
 * Controles de teclado:
 * - P: Pausar/Retomar animação
 * - +: Aumentar velocidade
 * - -: Diminuir velocidade
 *
 * Compatibilidade:
 * - Navegadores modernos com suporte a Canvas 2D
 * - Fallback automático para navegadores antigos
 * - Otimizado para mobile e desktop
 *
 * Performance:
 * - Limite máximo de 200 partículas para controle de memória
 * - Redução automática de densidade em dispositivos móveis
 * - Monitoramento de uso de memória (se disponível)
 * - FPS dinâmico baseado em performance
 */

// Configurações globais
const neuralConfig = {
    speed: 1, // Multiplicador de velocidade
    theme: 'default', // Tema atual
    paused: false, // Para controles de acessibilidade
    debug: false, // Modo debug
    performance: { fps: 0, lastTime: 0, frames: 0 } // Métricas
};

// Temas disponíveis
const themes = {
    default: {
        particleColor: 'rgba(0, 212, 255, 0.2)',
        connectionColor: 'rgba(0, 255, 157, 0.1)',
        bgGradient: 'linear-gradient(135deg, #030712 0%, #0f172a 50%, #1e293b 100%)',
        glowColor: '#00d4ff'
    },
    dark: {
        particleColor: 'rgba(255, 0, 100, 0.2)',
        connectionColor: 'rgba(255, 100, 0, 0.1)',
        bgGradient: 'linear-gradient(135deg, #000000 0%, #1a0a1e 50%, #2d1b36 100%)',
        glowColor: '#ff0064'
    },
    neural: {
        particleColor: 'rgba(0, 255, 100, 0.2)',
        connectionColor: 'rgba(100, 255, 0, 0.1)',
        bgGradient: 'linear-gradient(135deg, #0a0f1c 0%, #1a2b3c 50%, #2c5f5d 100%)',
        glowColor: '#00ff64'
    },
    cosmic: {
        particleColor: 'rgba(147, 51, 234, 0.2)',
        connectionColor: 'rgba(59, 130, 246, 0.1)',
        bgGradient: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
        glowColor: '#9333ea'
    }
};

(function () {
    const canvas = document.getElementById('neural-bg');
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) {
        // Fallback para navegadores antigos
        console.warn('Canvas não suportado. Fundo neural desabilitado.');
        return;
    }

    let particles = [];
    let mouse = { x: null, y: null, radius: 150 };
    let animationId;
    let waveOffset = 0; // Para efeito de ondas
    let glowIntensity = 0; // Intensidade do brilho

    // Microinterações
    let microInteractions = {
        clickFeedback: { active: false, x: 0, y: 0, time: 0 },
        hoverParticles: new Set(),
        themeTransition: { active: false, progress: 0, fromTheme: null, toTheme: null }
    };

    // Otimização de memória: limitar partículas
    const maxParticles = 200; // Máximo para evitar uso excessivo de memória

    function initNeural() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        particles = [];

        // Animações responsivas: ajustes baseados no dispositivo e orientação
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const aspectRatio = screenWidth / screenHeight;
        const isMobile = screenWidth < 768;
        const isTablet = screenWidth < 1024 && screenWidth >= 768;
        const isLandscape = aspectRatio > 1.2;
        const isPortrait = aspectRatio < 0.8;
        const isSmallScreen = screenWidth < 480;

        // Ajustar densidade baseada no dispositivo e orientação
        let densityDivisor;
        if (isSmallScreen) densityDivisor = 60000; // Muito reduzido para telas pequenas
        else if (isMobile) densityDivisor = isLandscape ? 35000 : 45000; // Menos em landscape mobile
        else if (isTablet) densityDivisor = 20000;
        else densityDivisor = 12000; // Desktop normal

        let density = Math.min((canvas.width * canvas.height) / densityDivisor, maxParticles);

        // Ajustar velocidade base e parâmetros responsivos
        const baseSpeed = isSmallScreen ? 0.6 : isMobile ? 0.8 : isTablet ? 0.9 : 1.0;
        const responsiveRadius = isSmallScreen ? 80 : isMobile ? 120 : isTablet ? 140 : 150;

        // Ajustar raio do mouse para dispositivos touch
        mouse.radius = responsiveRadius;

        // Lazy loading: reduzir ainda mais se performance baixa
        if (window.performance && window.performance.memory) {
            const usedMemory = window.performance.memory.usedJSHeapSize / 1048576; // MB
            if (usedMemory > 50) density *= 0.5; // Reduzir se memória alta
        }

        for (let i = 0; i < density; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                baseSize: Math.random() * 2 + 0.5,
                size: 0, // Será calculado
                speedX: (Math.random() * 0.4 - 0.2) * neuralConfig.speed,
                speedY: (Math.random() * 0.4 - 0.2) * neuralConfig.speed,
                life: Math.random() * 100,
                pulse: Math.random() * Math.PI * 2
            });
        }

        // Aplicar tema
        applyTheme();
    }

    function applyTheme() {
        const theme = themes[neuralConfig.theme] || themes.default;
        particles.forEach(p => {
            p.color = theme.particleColor;
            p.connectionColor = theme.connectionColor;
        });
    }

    function animateNeural(currentTime) {
        if (neuralConfig.paused) return;

        // Métricas de performance
        if (neuralConfig.debug) {
            neuralConfig.performance.frames++;
            if (currentTime - neuralConfig.performance.lastTime >= 1000) {
                neuralConfig.performance.fps = Math.round(neuralConfig.performance.frames * 1000 / (currentTime - neuralConfig.performance.lastTime));
                neuralConfig.performance.frames = 0;
                neuralConfig.performance.lastTime = currentTime;
                console.log(`Neural BG FPS: ${neuralConfig.performance.fps}`);
            }
        }

        // Aplicar gradiente de fundo do tema
        const theme = themes[neuralConfig.theme] || themes.default;
        ctx.fillStyle = theme.bgGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Efeito de ondas
        waveOffset += 0.005 * neuralConfig.speed;
        glowIntensity = Math.sin(waveOffset * 2) * 0.3 + 0.7;

        // Microinterações - animação de feedback de clique
        if (microInteractions.clickFeedback.active) {
            microInteractions.clickFeedback.time += 0.05;
            if (microInteractions.clickFeedback.time > Math.PI * 2) {
                microInteractions.clickFeedback.active = false;
            }
        }

        // Transição de tema suave
        if (microInteractions.themeTransition.active) {
            microInteractions.themeTransition.progress += 0.02;
            if (microInteractions.themeTransition.progress >= 1) {
                microInteractions.themeTransition.active = false;
                microInteractions.themeTransition.fromTheme = null;
                microInteractions.themeTransition.toTheme = null;
            }
        }

        particles.forEach((p, i) => {
            // Animação melhorada com pulsação e ondas
            p.life += 0.02 * neuralConfig.speed;
            p.pulse += 0.05 * neuralConfig.speed;

            // Movimento otimizado com efeito de ondas
            const waveEffect = Math.sin(p.life + waveOffset) * 0.5;
            p.x += (p.speedX + waveEffect) * neuralConfig.speed;
            p.y += (p.speedY + waveEffect) * neuralConfig.speed;

            // Borda responsiva com efeito de wrap-around
            if (p.x > canvas.width + 50) p.x = -50;
            else if (p.x < -50) p.x = canvas.width + 50;
            if (p.y > canvas.height + 50) p.y = -50;
            else if (p.y < -50) p.y = canvas.height + 50;

            // Interação com mouse aprimorada
            if (mouse.x) {
                let dx = mouse.x - p.x;
                let dy = mouse.y - p.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    let force = (mouse.radius - dist) / mouse.radius;
                    p.x -= dx * force * 0.02 * neuralConfig.speed;
                    p.y -= dy * force * 0.02 * neuralConfig.speed;
                    // Aumentar tamanho ao interagir
                    p.interactionSize = force * 2;
                } else {
                    p.interactionSize = 0;
                }
            }

            // Gradiente para efeito neural com brilho dinâmico
            const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.baseSize * 3);
            const baseColor = p.color.replace('0.2', (0.3 * glowIntensity).toString());
            const glowColor = theme.glowColor + Math.floor(glowIntensity * 60).toString(16).padStart(2, '0');
            gradient.addColorStop(0, glowColor);
            gradient.addColorStop(0.5, baseColor);
            gradient.addColorStop(1, 'transparent');

            ctx.fillStyle = gradient;
            p.size = p.baseSize * (1 + Math.sin(p.pulse) * 0.4 + p.interactionSize);
            ctx.shadowColor = theme.glowColor;
            ctx.shadowBlur = p.size * 2 * glowIntensity;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0; // Resetar sombra

            // Microinteração - efeito hover nas partículas
            if (microInteractions.hoverParticles.has(i)) {
                // Partículas em hover ficam mais brilhantes
                ctx.shadowColor = theme.glowColor;
                ctx.shadowBlur = p.size * 3 * glowIntensity;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * 1.2, 0, Math.PI * 2);
                ctx.strokeStyle = theme.glowColor;
                ctx.lineWidth = 2;
                ctx.stroke();
                ctx.shadowBlur = 0;
            }

            // Conexões neurais aprimoradas - limitadas para performance
            if (!window.innerWidth < 768 && i % 2 === 0) { // Mais conexões
                for (let j = i + 1; j < Math.min(i + 15, particles.length); j++) { // Mais conexões
                    let p2 = particles[j];
                    let dx = p.x - p2.x;
                    let dy = p.y - p2.y;
                    let dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) { // Distância maior
                        const opacity = (0.15 * glowIntensity * (1 - dist / 120));
                        ctx.strokeStyle = p.connectionColor.replace('0.1', opacity.toString());
                        ctx.lineWidth = 0.5 + (glowIntensity * 0.3);
                        ctx.globalAlpha = opacity;
                        ctx.beginPath();
                        // Curva de Bézier para conexões mais orgânicas
                        const midX = (p.x + p2.x) / 2;
                        const midY = (p.y + p2.y) / 2;
                        const controlOffset = dist * 0.2;
                        ctx.moveTo(p.x, p.y);
                        ctx.quadraticCurveTo(midX + controlOffset * Math.sin(waveOffset + i), midY + controlOffset * Math.cos(waveOffset + j), p2.x, p2.y);
                        ctx.stroke();
                        ctx.globalAlpha = 1;
                    }
                }
            }
        });

        // Microinteração - efeito de feedback de clique
        if (microInteractions.clickFeedback.active) {
            const radius = Math.sin(microInteractions.clickFeedback.time) * 50 + 20;
            const alpha = (1 - microInteractions.clickFeedback.time / (Math.PI * 2)) * 0.5;

            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(microInteractions.clickFeedback.x, microInteractions.clickFeedback.y, radius, 0, Math.PI * 2);
            ctx.stroke();

            // Ondas concêntricas
            for (let i = 1; i <= 3; i++) {
                const waveRadius = radius * (1 + i * 0.3);
                const waveAlpha = alpha * (1 - i * 0.3);
                if (waveAlpha > 0) {
                    ctx.strokeStyle = `rgba(0, 212, 255, ${waveAlpha})`;
                    ctx.lineWidth = 2 - i * 0.3;
                    ctx.beginPath();
                    ctx.arc(microInteractions.clickFeedback.x, microInteractions.clickFeedback.y, waveRadius, 0, Math.PI * 2);
                    ctx.stroke();
                }
            }
        }

        // Fallback para navegadores sem requestAnimationFrame
        if (typeof requestAnimationFrame !== 'undefined') {
            animationId = requestAnimationFrame(animateNeural);
        } else {
            setTimeout(() => animateNeural(Date.now()), 16); // ~60fps
        }
    }

    // Controles de acessibilidade
    function togglePause() {
        neuralConfig.paused = !neuralConfig.paused;
        if (!neuralConfig.paused) {
            animateNeural(Date.now());
        } else {
            if (animationId) cancelAnimationFrame(animationId);
        }
    }

    // Mudar velocidade
    function setSpeed(newSpeed) {
        neuralConfig.speed = Math.max(0.1, Math.min(3, newSpeed));
        initNeural(); // Reinicializar para aplicar nova velocidade
    }

    // Mudar tema com transição suave
    function setTheme(themeName) {
        if (themes[themeName] && themeName !== neuralConfig.theme) {
            microInteractions.themeTransition = {
                active: true,
                progress: 0,
                fromTheme: neuralConfig.theme,
                toTheme: themeName
            };
            neuralConfig.theme = themeName;
            applyTheme();
        }
    }

    // Event listeners responsivos
    window.addEventListener('mousemove', e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;

        // Microinteração - detectar hover sobre partículas
        microInteractions.hoverParticles.clear();
        particles.forEach((p, i) => {
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < p.size * 2) {
                microInteractions.hoverParticles.add(i);
            }
        });
    });

    // Microinteração - feedback de clique no canvas
    canvas.addEventListener('click', e => {
        microInteractions.clickFeedback = {
            active: true,
            x: e.clientX,
            y: e.clientY,
            time: 0
        };

        // Pequena vibração se suportado (feedback háptico)
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    });

    // Touch events para dispositivos móveis
    window.addEventListener('touchmove', e => {
        if (e.touches.length > 0) {
            mouse.x = e.touches[0].clientX;
            mouse.y = e.touches[0].clientY;
        }
    });

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initNeural();
    });

    // Orientação change para dispositivos móveis
    window.addEventListener('orientationchange', () => {
        // Pequeno delay para permitir que a tela se ajuste
        setTimeout(() => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initNeural();
        }, 100);
    });

    // Controles de teclado para acessibilidade
    window.addEventListener('keydown', e => {
        if (e.key === 'p' || e.key === 'P') togglePause();
        if (e.key === '+') setSpeed(neuralConfig.speed + 0.1);
        if (e.key === '-') setSpeed(neuralConfig.speed - 0.1);
    });

    // Integração com sistema de animações principal (exemplo)
    window.neuralBG = {
        pause: () => {
            togglePause();
            window.neuralBG.isPaused = neuralConfig.paused;
        },
        setSpeed,
        setTheme: (themeName) => {
            setTheme(themeName);
            // Atualizar gradiente de fundo do body se tema mudar
            const theme = themes[themeName] || themes.default;
            document.body.style.background = theme.bgGradient;
        },
        getPerformance: () => ({ fps: neuralConfig.performance.fps }),
        toggleDebug: () => { neuralConfig.debug = !neuralConfig.debug; },
        isPaused: false,
        getThemes: () => Object.keys(themes),
        addCustomTheme: (name, config) => {
            if (config.particleColor && config.connectionColor && config.bgGradient && config.glowColor) {
                themes[name] = config;
                // Salvar tema customizado
                const customThemes = JSON.parse(localStorage.getItem('neural-custom-themes') || '{}');
                customThemes[name] = config;
                localStorage.setItem('neural-custom-themes', JSON.stringify(customThemes));
            }
        }
    };

    // Carregar temas customizados
    const customThemes = localStorage.getItem('neural-custom-themes');
    if (customThemes) {
        try {
            Object.assign(themes, JSON.parse(customThemes));
        } catch (e) { }
    }

    // Cache inteligente: usar localStorage para configurações
    const savedConfig = localStorage.getItem('neural-bg-config');
    if (savedConfig) {
        try {
            Object.assign(neuralConfig, JSON.parse(savedConfig));
        } catch (e) { }
    }

    // Aplicar tema inicial ao body
    const initialTheme = themes[neuralConfig.theme] || themes.default;
    document.body.style.background = initialTheme.bgGradient;

    // Salvar configurações
    window.addEventListener('beforeunload', () => {
        localStorage.setItem('neural-bg-config', JSON.stringify({
            speed: neuralConfig.speed,
            theme: neuralConfig.theme
        }));
    });

    initNeural();
    animateNeural(Date.now());
})();
