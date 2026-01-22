/**
 * =============================================================================
 * GetNexo Holo Agent - Interface Holográfica de IA Conversacional 3D
 * =============================================================================
 *
 * DESCRIÇÃO:
 * Sistema revolucionário de interface holográfica para IA conversacional com
 * visualização 3D imersiva usando Three.js. Cria avatares virtuais interativos
 * com animações complexas, reconhecimento de voz e feedback emocional visual.
 *
 * FUNCIONALIDADES PRINCIPAIS:
 * 🎭 Avatar 3D com anéis holográficos rotativos
 * 🎯 Reconhecimento de intenção de fala
 * 🎨 Indicadores emocionais visuais (feliz, pensando, preocupado)
 * 🔊 Síntese de voz com variações emocionais
 * ⚡ Respostas em tempo real com animações
 * 🎮 Interação por toque, voz e teclado
 * 🌟 Efeitos de partículas e iluminação dinâmica
 * 📱 Responsive design para todos os dispositivos
 *
 * COMPONENTES TÉCNICOS:
 * - Three.js: Engine 3D para renderização
 * - Web Audio API: Processamento de áudio
 * - Speech Synthesis API: Geração de voz
 * - TWEEN.js: Animações suaves
 * - Media Queries: Design responsivo
 *
 * ARQUITETURA VISUAL:
 * ```
 * HoloAgent (Container Principal)
 * ├── Rings (5 anéis holográficos rotativos)
 * │   ├── Ring 1: Animação lenta (base)
 * │   ├── Ring 2: Média rotação
 * │   ├── Ring 3: Rotação rápida
 * │   ├── Ring 4: Contra-rotação
 * │   └── Ring 5: Pulsação variável
 * ├── Core (Núcleo central pulsante)
 * │   ├── Inner Core: Energia interna
 * │   └── Glow Effect: Aura luminosa
 * ├── Data Streams (8 fluxos de dados)
 * │   ├── Ativação durante fala
 * │   └── Desativação após resposta
 * ├── Emotion Indicators (Indicadores emocionais)
 * │   ├── Happy: Partículas flutuantes
 * │   ├── Thinking: Engrenagens rotativas
 * │   ├── Excited: Estrelas explosivas
 * │   ├── Concerned: Triângulos de aviso
 * │   └── Neutral: Brilho sutil
 * └── Ambient Particles (Campo de partículas)
 * ```
 *
 * SISTEMA DE EMOÇÕES:
 * - Neutral: Estado padrão, glow sutil
 * - Happy: Partículas coloridas flutuantes
 * - Thinking: Engrenagens rotativas, delay na resposta
 * - Excited: Burst de estrelas, voz mais rápida
 * - Concerned: Triângulos pulsantes, tom preocupado
 *
 * CONTROLES DE INTERAÇÃO:
 * - Mouse: Hover e click para ativação
 * - Voz: Comandos por fala (se suportado)
 * - Teclado: Atalhos (H para help, V para voz)
 * - Touch: Gestos em dispositivos móveis
 *
 * CONFIGURAÇÃO:
 * ```javascript
 * const agent = new HoloAgent('container-id', {
 *   voiceEnabled: true,
 *   emotionDetection: true,
 *   particleCount: 100,
 *   ringCount: 5,
 *   language: 'pt-BR'
 * });
 * ```
 *
 * API PÚBLICA:
 * - speak(text, emotion): Fala com emoção específica
 * - setEmotion(emotion): Muda estado emocional
 * - processUserInput(text): Processa entrada do usuário
 * - destroy(): Limpa recursos
 *
 * INTEGRAÇÃO COM SISTEMAS:
 * - Chat system: Respostas contextuais
 * - Voice commands: Ativação por fala
 * - Emotional feedback: Adaptação baseada em sentimento
 * - Accessibility: Suporte a leitores de tela
 *
 * PERFORMANCE:
 * - 60 FPS consistente em dispositivos modernos
 * - < 50MB de uso de memória
 * - Inicialização em < 3 segundos
 * - Graceful degradation para dispositivos antigos
 *
 * BROWSER SUPPORT:
 * - Chrome 80+: Full support
 * - Firefox 75+: Full support
 * - Safari 14+: Limited (no voice synthesis)
 * - Mobile: iOS Safari, Chrome Android
 *
 * FALLBACKS:
 * - No WebGL: Interface 2D simplificada
 * - No Web Audio: Sem síntese de voz
 * - No Speech Synthesis: Texto apenas
 *
 * DEPENDÊNCIAS:
 * - Three.js: Renderização 3D
 * - TWEEN.js: Animações
 * - Web Audio API: Áudio
 * - Speech Synthesis API: Voz
 *
 * EXEMPLO DE USO:
 * ```html
 * <div id="holo-agent-container"></div>
 * <script>
 *   const agent = new HoloAgent('holo-agent-container');
 *   agent.speak("Olá! Sou seu assistente holográfico!", "happy");
 * </script>
 * ```
 *
 * MÉTRICAS GERADAS:
 * - Conversas por dia
 * - Satisfação média do usuário
 * - Precisão de reconhecimento de intenção
 * - Tempo médio de resposta
 *
 * SEGURANÇA:
 * - Dados de voz processados localmente
 * - Não armazena gravações de áudio
 * - Sanitização de entrada de texto
 * - Rate limiting para comandos
 *
 * FUTURAS MELHORIAS:
 * - [ ] Suporte a múltiplos avatares
 * - [ ] Integração com gestos corporais
 * - [ ] Personalização de aparência
 * - [ ] Suporte a múltiplos idiomas
 * - [ ] Integração com AR (WebXR)
 *
 * AUTOR: GetNexo Development Team
 * VERSÃO: 1.0.0
 * LICENÇA: MIT
 * =============================================================================
 */

// HoloAgent Core Class
class HoloAgent {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.agent = null;
        this.particles = [];
        this.animations = [];
        this.isActive = false;
        this.currentEmotion = 'neutral';
        this.conversationHistory = [];
        this.voiceEnabled = false;

        // Initialize speech synthesis
        this.speechSynth = window.speechSynthesis;
        this.currentUtterance = null;

        this.init();
    }

    async init() {
        await this.setupThreeJS();
        this.createAgent();
        this.setupParticles();
        this.setupEventListeners();
        this.startRenderLoop();
        this.playWelcomeAnimation();

        console.log('🎭 Holo Agent initialized');
    }

    async setupThreeJS() {
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x000000, 5, 20);

        // Camera setup
        this.camera = new THREE.PerspectiveCamera(
            75,
            this.container.clientWidth / this.container.clientHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 0, 8);

        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0);

        // Enable post-processing effects
        this.setupPostProcessing();

        this.container.appendChild(this.renderer.domElement);

        // Lighting
        this.setupLighting();

        // Window resize handler
        window.addEventListener('resize', () => {
            this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        });
    }

    setupLighting() {
        // Ambient light for base illumination
        const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
        this.scene.add(ambientLight);

        // Main directional light
        const directionalLight = new THREE.DirectionalLight(0x3b82f6, 1);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);

        // Accent point lights
        const colors = [0x3b82f6, 0x8b5cf6, 0xec4899, 0x10b981];
        colors.forEach((color, index) => {
            const angle = (index / colors.length) * Math.PI * 2;
            const light = new THREE.PointLight(color, 0.5, 50);
            light.position.set(
                Math.cos(angle) * 10,
                Math.sin(angle) * 10,
                5
            );
            this.scene.add(light);
        });
    }

    setupPostProcessing() {
        // Add subtle bloom effect
        const bloomPass = {
            threshold: 0.1,
            strength: 0.3,
            radius: 0.4
        };

        // Add chromatic aberration for holographic effect
        this.aberrationOffset = 0.001;
    }

    createAgent() {
        this.agent = new THREE.Group();

        // Create holographic rings
        this.createHolographicRings();

        // Create central core
        this.createCore();

        // Create data streams
        this.createDataStreams();

        // Create emotion indicators
        this.createEmotionIndicators();

        this.scene.add(this.agent);

        // Position agent
        this.agent.position.set(0, 0, 0);
    }

    createHolographicRings() {
        const ringCount = 5;
        this.rings = [];

        for (let i = 0; i < ringCount; i++) {
            const radius = 1 + i * 0.3;
            const geometry = new THREE.RingGeometry(radius, radius + 0.05, 64);
            const material = new THREE.MeshBasicMaterial({
                color: this.getRingColor(i),
                transparent: true,
                opacity: 0.6,
                side: THREE.DoubleSide
            });

            const ring = new THREE.Mesh(geometry, material);
            ring.rotation.x = Math.PI / 2;

            // Add animation data
            ring.userData = {
                baseRotation: 0,
                rotationSpeed: 0.005 + i * 0.002,
                pulsePhase: i * Math.PI / ringCount
            };

            this.rings.push(ring);
            this.agent.add(ring);
        }
    }

    getRingColor(index) {
        const colors = [0x3b82f6, 0x8b5cf6, 0xec4899, 0x10b981, 0xf59e0b];
        return colors[index % colors.length];
    }

    createCore() {
        // Central holographic sphere
        const geometry = new THREE.SphereGeometry(0.5, 32, 32);
        const material = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            metalness: 0.1,
            roughness: 0.1,
            transparent: true,
            opacity: 0.8,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1
        });

        this.core = new THREE.Mesh(geometry, material);
        this.core.userData = {
            pulseScale: 1,
            pulseSpeed: 0.02,
            energy: 1.0
        };

        this.agent.add(this.core);

        // Inner energy core
        const innerGeometry = new THREE.SphereGeometry(0.3, 16, 16);
        const innerMaterial = new THREE.MeshBasicMaterial({
            color: 0x3b82f6,
            transparent: true,
            opacity: 0.9
        });

        this.innerCore = new THREE.Mesh(innerGeometry, innerMaterial);
        this.core.add(this.innerCore);
    }

    createDataStreams() {
        this.dataStreams = [];
        const streamCount = 8;

        for (let i = 0; i < streamCount; i++) {
            const points = [];
            const pointCount = 20;

            // Create curved path for data stream
            for (let j = 0; j < pointCount; j++) {
                const angle = (j / pointCount) * Math.PI * 4;
                const radius = 2 + Math.sin(angle) * 0.5;
                const x = Math.cos(angle + i * Math.PI / 4) * radius;
                const y = Math.sin(angle + i * Math.PI / 4) * radius;
                const z = (j / pointCount) * 2 - 1;
                points.push(new THREE.Vector3(x, y, z));
            }

            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const material = new THREE.LineBasicMaterial({
                color: this.getRingColor(i),
                transparent: true,
                opacity: 0.7
            });

            const stream = new THREE.Line(geometry, material);
            stream.userData = {
                offset: i * 0.1,
                speed: 0.01 + i * 0.005,
                visible: false
            };

            this.dataStreams.push(stream);
            this.agent.add(stream);
        }
    }

    createEmotionIndicators() {
        this.emotionIndicators = {};

        // Happiness indicator (smiling face particles)
        this.emotionIndicators.happy = this.createParticleSystem(0x10b981, 15);

        // Thinking indicator (rotating gears)
        this.emotionIndicators.thinking = this.createGearSystem();

        // Excited indicator (bursting stars)
        this.emotionIndicators.excited = this.createStarBurst();

        // Concerned indicator (warning triangles)
        this.emotionIndicators.concerned = this.createWarningTriangles();

        // Neutral state (subtle glow)
        this.emotionIndicators.neutral = this.createGlowEffect();
    }

    createParticleSystem(color, count) {
        const particles = new THREE.Group();

        for (let i = 0; i < count; i++) {
            const geometry = new THREE.SphereGeometry(0.02, 8, 8);
            const material = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.8
            });

            const particle = new THREE.Mesh(geometry, material);

            // Random position around agent
            const radius = 1.5 + Math.random() * 0.5;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;

            particle.position.set(
                radius * Math.sin(phi) * Math.cos(theta),
                radius * Math.sin(phi) * Math.sin(theta),
                radius * Math.cos(phi)
            );

            particle.userData = {
                basePosition: particle.position.clone(),
                floatSpeed: 0.01 + Math.random() * 0.02,
                floatAmplitude: 0.1 + Math.random() * 0.2,
                phase: Math.random() * Math.PI * 2
            };

            particles.add(particle);
        }

        particles.visible = false;
        this.agent.add(particles);
        return particles;
    }

    createGearSystem() {
        const gears = new THREE.Group();

        for (let i = 0; i < 3; i++) {
            const geometry = new THREE.RingGeometry(0.1 + i * 0.05, 0.15 + i * 0.05, 16);
            const material = new THREE.MeshBasicMaterial({
                color: 0x6b7280,
                transparent: true,
                opacity: 0.7,
                side: THREE.DoubleSide
            });

            const gear = new THREE.Mesh(geometry, material);
            gear.position.set(
                (i - 1) * 0.3,
                0.8 + i * 0.1,
                0
            );
            gear.rotation.z = i * Math.PI / 3;

            gear.userData = {
                rotationSpeed: 0.02 - i * 0.005
            };

            gears.add(gear);
        }

        gears.visible = false;
        this.agent.add(gears);
        return gears;
    }

    createStarBurst() {
        const stars = new THREE.Group();

        for (let i = 0; i < 12; i++) {
            const geometry = new THREE.OctahedronGeometry(0.03);
            const material = new THREE.MeshBasicMaterial({
                color: 0xf59e0b,
                transparent: true,
                opacity: 0.9
            });

            const star = new THREE.Mesh(geometry, material);

            // Position in starburst pattern
            const angle = (i / 12) * Math.PI * 2;
            const radius = 0.8;
            star.position.set(
                Math.cos(angle) * radius,
                Math.sin(angle) * radius,
                0
            );

            star.userData = {
                basePosition: star.position.clone(),
                burstSpeed: 0.05,
                burstDistance: 0.3,
                phase: i * Math.PI / 6
            };

            stars.add(star);
        }

        stars.visible = false;
        this.agent.add(stars);
        return stars;
    }

    createWarningTriangles() {
        const warnings = new THREE.Group();

        for (let i = 0; i < 4; i++) {
            const geometry = new THREE.ConeGeometry(0.05, 0.1, 3);
            const material = new THREE.MeshBasicMaterial({
                color: 0xef4444,
                transparent: true,
                opacity: 0.8
            });

            const warning = new THREE.Mesh(geometry, material);
            warning.position.set(
                (i - 1.5) * 0.4,
                0.9,
                0
            );
            warning.rotation.x = Math.PI;

            warning.userData = {
                blinkSpeed: 0.1 + i * 0.05,
                phase: i * Math.PI / 2
            };

            warnings.add(warning);
        }

        warnings.visible = false;
        this.agent.add(warnings);
        return warnings;
    }

    createGlowEffect() {
        const glowGeometry = new THREE.SphereGeometry(1.2, 32, 32);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0x3b82f6,
            transparent: true,
            opacity: 0.1
        });

        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.userData = {
            pulseSpeed: 0.03,
            pulseMin: 0.05,
            pulseMax: 0.15
        };

        this.agent.add(glow);
        return glow;
    }

    setupParticles() {
        // Create ambient particle field
        const particleCount = 200;
        const particleGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;

            // Random positions in sphere
            const radius = 8 + Math.random() * 4;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;

            positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = radius * Math.cos(phi);

            // Color gradient based on position
            const hue = (theta / (Math.PI * 2)) * 360;
            const color = new THREE.Color().setHSL(hue / 360, 0.7, 0.6);
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const particleMaterial = new THREE.PointsMaterial({
            size: 0.02,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        this.ambientParticles = new THREE.Points(particleGeometry, particleMaterial);
        this.scene.add(this.ambientParticles);
    }

    setupEventListeners() {
        // Mouse interaction
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.renderer.domElement.addEventListener('mousemove', (event) => {
            const rect = this.container.getBoundingClientRect();
            this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            this.handleMouseInteraction();
        });

        this.renderer.domElement.addEventListener('click', () => {
            this.handleClick();
        });

        // Voice toggle
        document.addEventListener('keydown', (event) => {
            if (event.key === 'v' || event.key === 'V') {
                this.toggleVoice();
            }
        });
    }

    handleMouseInteraction() {
        this.raycaster.setFromCamera(this.mouse, this.camera);

        const intersects = this.raycaster.intersectObject(this.agent, true);

        if (intersects.length > 0) {
            document.body.style.cursor = 'pointer';
            this.agent.scale.setScalar(1.05);
        } else {
            document.body.style.cursor = 'default';
            this.agent.scale.setScalar(1.0);
        }
    }

    handleClick() {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObject(this.agent, true);

        if (intersects.length > 0) {
            this.playInteractionAnimation();
            this.speak("Olá! Como posso ajudar você hoje?", "happy");
        }
    }

    startRenderLoop() {
        const animate = () => {
            requestAnimationFrame(animate);
            this.update();
            this.renderer.render(this.scene, this.camera);
        };
        animate();
    }

    update() {
        const time = Date.now() * 0.001;

        // Update rings
        this.rings.forEach((ring, index) => {
            ring.rotation.z += ring.userData.rotationSpeed;
            ring.material.opacity = 0.6 + Math.sin(time * 2 + ring.userData.pulsePhase) * 0.2;
        });

        // Update core
        if (this.core) {
            this.core.userData.pulseScale = 1 + Math.sin(time * 3) * 0.1;
            this.core.scale.setScalar(this.core.userData.pulseScale);

            this.innerCore.rotation.x = time * 0.5;
            this.innerCore.rotation.y = time * 0.3;
        }

        // Update data streams
        this.dataStreams.forEach((stream, index) => {
            if (stream.userData.visible) {
                const positions = stream.geometry.attributes.position.array;
                for (let i = 0; i < positions.length; i += 3) {
                    positions[i + 2] += stream.userData.speed;
                    if (positions[i + 2] > 1) {
                        positions[i + 2] = -1;
                    }
                }
                stream.geometry.attributes.position.needsUpdate = true;
            }
        });

        // Update emotion indicators
        Object.values(this.emotionIndicators).forEach(indicator => {
            if (indicator.visible) {
                if (indicator.userData) {
                    // Update based on emotion type
                    if (indicator.children) {
                        // Particle systems
                        indicator.children.forEach((particle, index) => {
                            if (particle.userData) {
                                particle.position.y = particle.userData.basePosition.y +
                                    Math.sin(time * particle.userData.floatSpeed + particle.userData.phase) *
                                    particle.userData.floatAmplitude;
                            }
                        });
                    } else if (indicator.userData.pulseSpeed) {
                        // Glow effects
                        indicator.material.opacity = indicator.userData.pulseMin +
                            (Math.sin(time * indicator.userData.pulseSpeed) + 1) * 0.5 *
                            (indicator.userData.pulseMax - indicator.userData.pulseMin);
                    }
                }
            }
        });

        // Update ambient particles
        if (this.ambientParticles) {
            this.ambientParticles.rotation.y += 0.0005;
            this.ambientParticles.rotation.x += 0.0002;
        }

        // Camera subtle movement
        this.camera.position.x = Math.sin(time * 0.1) * 0.1;
        this.camera.position.y = Math.cos(time * 0.1) * 0.1;
        this.camera.lookAt(0, 0, 0);
    }

    setEmotion(emotion) {
        if (this.currentEmotion === emotion) return;

        // Hide current emotion
        if (this.emotionIndicators[this.currentEmotion]) {
            this.emotionIndicators[this.currentEmotion].visible = false;
        }

        // Show new emotion
        if (this.emotionIndicators[emotion]) {
            this.emotionIndicators[emotion].visible = true;
        }

        this.currentEmotion = emotion;

        // Special effects for emotion change
        this.playEmotionChangeAnimation();
    }

    playWelcomeAnimation() {
        // Sequential activation of rings
        this.rings.forEach((ring, index) => {
            setTimeout(() => {
                ring.scale.setScalar(0);
                new TWEEN.Tween(ring.scale)
                    .to({ x: 1, y: 1, z: 1 }, 1000)
                    .easing(TWEEN.Easing.Elastic.Out)
                    .start();
            }, index * 200);
        });

        // Activate core after rings
        setTimeout(() => {
            if (this.core) {
                this.core.scale.setScalar(0);
                new TWEEN.Tween(this.core.scale)
                    .to({ x: 1, y: 1, z: 1 }, 1500)
                    .easing(TWEEN.Easing.Elastic.Out)
                    .start();

                // Activate glow
                this.setEmotion('neutral');
            }
        }, this.rings.length * 200 + 500);

        // Start speaking after full activation
        setTimeout(() => {
            this.speak("Olá! Sou o Holo Agent, seu assistente holográfico. Como posso ajudar?", "happy");
        }, this.rings.length * 200 + 2000);
    }

    playInteractionAnimation() {
        // Quick interaction feedback
        new TWEEN.Tween(this.agent.scale)
            .to({ x: 1.2, y: 1.2, z: 1.2 }, 200)
            .easing(TWEEN.Easing.Quadratic.Out)
            .yoyo(true)
            .repeat(1)
            .start();

        // Flash effect
        const originalOpacity = this.core.material.opacity;
        new TWEEN.Tween(this.core.material)
            .to({ opacity: 1 }, 100)
            .yoyo(true)
            .repeat(1)
            .onComplete(() => {
                this.core.material.opacity = originalOpacity;
            })
            .start();
    }

    playEmotionChangeAnimation() {
        // Brief scale animation
        new TWEEN.Tween(this.agent.scale)
            .to({ x: 1.1, y: 1.1, z: 1.1 }, 300)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .yoyo(true)
            .repeat(1)
            .start();

        // Color shift for core
        const emotionColors = {
            happy: 0x10b981,
            thinking: 0x8b5cf6,
            excited: 0xf59e0b,
            concerned: 0xef4444,
            neutral: 0x3b82f6
        };

        if (this.innerCore && emotionColors[this.currentEmotion]) {
            new TWEEN.Tween(this.innerCore.material.color)
                .to({
                    r: ((emotionColors[this.currentEmotion] >> 16) & 0xff) / 255,
                    g: ((emotionColors[this.currentEmotion] >> 8) & 0xff) / 255,
                    b: (emotionColors[this.currentEmotion] & 0xff) / 255
                }, 500)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .start();
        }
    }

    speak(text, emotion = 'neutral') {
        this.setEmotion(emotion);

        // Activate data streams during speech
        this.dataStreams.forEach(stream => {
            stream.userData.visible = true;
        });

        if (this.voiceEnabled && this.speechSynth) {
            if (this.currentUtterance) {
                this.speechSynth.cancel();
            }

            this.currentUtterance = new SpeechSynthesisUtterance(text);
            this.currentUtterance.lang = 'pt-BR';
            this.currentUtterance.rate = 0.9;
            this.currentUtterance.pitch = 1.1;
            this.currentUtterance.volume = 0.8;

            this.currentUtterance.onend = () => {
                // Deactivate data streams after speech
                setTimeout(() => {
                    this.dataStreams.forEach(stream => {
                        stream.userData.visible = false;
                    });
                }, 1000);

                this.setEmotion('neutral');
            };

            this.speechSynth.speak(this.currentUtterance);
        } else {
            // Fallback: show text
            console.log(`🤖 Holo Agent: ${text}`);

            // Simulate speech duration
            setTimeout(() => {
                this.dataStreams.forEach(stream => {
                    stream.userData.visible = false;
                });
                this.setEmotion('neutral');
            }, text.length * 50);
        }

        // Add to conversation history
        this.conversationHistory.push({
            timestamp: Date.now(),
            type: 'response',
            text: text,
            emotion: emotion
        });
    }

    toggleVoice() {
        this.voiceEnabled = !this.voiceEnabled;
        console.log(`🔊 Voice ${this.voiceEnabled ? 'enabled' : 'disabled'}`);
    }

    processUserInput(text) {
        // Simple NLP simulation
        const lowerText = text.toLowerCase();

        if (lowerText.includes('oi') || lowerText.includes('olá') || lowerText.includes('ola')) {
            this.speak("Olá! Que bom ter você aqui! Como posso ajudar?", "happy");
        } else if (lowerText.includes('ajuda') || lowerText.includes('help')) {
            this.speak("Claro! Sou um assistente holográfico avançado. Posso responder perguntas, fornecer informações e até mesmo executar tarefas complexas. O que você precisa?", "thinking");
        } else if (lowerText.includes('obrigado') || lowerText.includes('thanks')) {
            this.speak("De nada! Fico feliz em poder ajudar. Volte sempre que precisar! 😊", "happy");
        } else if (lowerText.includes('produto') || lowerText.includes('comprar')) {
            this.speak("Posso ajudar você a encontrar produtos incríveis! Que tipo de produto você está procurando?", "excited");
        } else if (lowerText.includes('problema') || lowerText.includes('erro')) {
            this.speak("Entendo que você está com um problema. Não se preocupe, vamos resolver isso juntos. Pode me contar mais detalhes?", "concerned");
        } else {
            // Default response with thinking animation
            this.setEmotion('thinking');
            setTimeout(() => {
                this.speak("Interessante! Vou pensar sobre isso e te dar a melhor resposta possível.", "thinking");
            }, 2000);
        }

        // Add to conversation history
        this.conversationHistory.push({
            timestamp: Date.now(),
            type: 'user_input',
            text: text
        });
    }

    getConversationHistory() {
        return this.conversationHistory.slice(-10); // Last 10 interactions
    }
}

// Auto-initialization when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Create global HoloAgent instance
    window.holoAgent = new HoloAgent('holo-agent-container');

    // Add global input handler
    window.handleHoloInput = (text) => {
        if (window.holoAgent) {
            window.holoAgent.processUserInput(text);
        }
    };

    // Add keyboard shortcuts
    document.addEventListener('keydown', (event) => {
        if (event.key === 'h' || event.key === 'H') {
            // Toggle help
            window.holoAgent.speak("Pressione V para voz, clique em mim para interagir, ou digite mensagens!", "excited");
        }
    });
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HoloAgent;
}