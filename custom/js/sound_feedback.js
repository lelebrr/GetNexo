/**
 * GetNexo Sound Feedback - Sistema de Áudio UX Imersivo
 * Experiências sonoras dinâmicas com síntese procedural e efeitos 3D
 */

class SoundManager {
    constructor(options = {}) {
        this.options = {
            masterVolume: 0.7,
            enableSpatialAudio: true,
            enableVoiceSynthesis: true,
            enableProceduralSounds: true,
            voiceLang: 'pt-BR',
            voiceRate: 0.9,
            voicePitch: 1.1,
            ...options
        };

        this.audioContext = null;
        this.masterGain = null;
        this.spatialManager = null;
        this.voiceSynth = null;
        this.soundLibrary = {};
        this.activeSounds = new Map();
        this.currentTheme = 'default';

        // Emotional audio themes
        this.themes = {
            default: {
                primaryColor: '#3b82f6',
                mood: 'neutral',
                baseFrequency: 440,
                harmonics: [1, 2, 3, 4]
            },
            success: {
                primaryColor: '#10b981',
                mood: 'positive',
                baseFrequency: 523, // C5
                harmonics: [1, 2, 3, 5]
            },
            error: {
                primaryColor: '#ef4444',
                mood: 'negative',
                baseFrequency: 220, // A3
                harmonics: [1, 1.5, 2, 3]
            },
            warning: {
                primaryColor: '#f59e0b',
                mood: 'caution',
                baseFrequency: 330, // E4
                harmonics: [1, 1.8, 2.5, 3.2]
            },
            celebration: {
                primaryColor: '#ec4899',
                mood: 'excited',
                baseFrequency: 659, // E5
                harmonics: [1, 2, 3, 4, 5, 6]
            }
        };

        this.init();
    }

    async init() {
        try {
            // Initialize Web Audio API
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.audioContext.createGain();
            this.masterGain.gain.value = this.options.masterVolume;
            this.masterGain.connect(this.audioContext.destination);

            // Initialize spatial audio manager
            if (this.options.enableSpatialAudio) {
                this.spatialManager = new SpatialAudioManager(this.audioContext, this.masterGain);
            }

            // Initialize voice synthesis
            if (this.options.enableVoiceSynthesis && 'speechSynthesis' in window) {
                this.voiceSynth = new VoiceSynthesizer(this.options);
            }

            // Load sound library
            await this.loadSoundLibrary();

            // Setup event listeners
            this.setupEventListeners();

            console.log('🔊 Sound Manager initialized');

        } catch (error) {
            console.warn('❌ Failed to initialize Sound Manager:', error);
            this.fallbackMode = true;
        }
    }

    setupEventListeners() {
        // Mouse interactions
        document.addEventListener('click', (e) => {
            this.playSound('click', {
                position: { x: e.clientX, y: e.clientY },
                intensity: 0.8
            });
        });

        document.addEventListener('mouseenter', (e) => {
            if (e.target.matches('button, a, [role="button"], input[type="submit"]')) {
                this.playSound('hover', {
                    position: { x: e.clientX, y: e.clientY },
                    intensity: 0.3
                });
            }
        }, true);

        // Form interactions
        document.addEventListener('submit', (e) => {
            this.playSound('success', { theme: 'success', intensity: 0.9 });
        });

        document.addEventListener('invalid', (e) => {
            e.preventDefault();
            this.playSound('error', { theme: 'error', intensity: 0.7 });
        }, true);

        // Scroll feedback
        let scrollTimeout;
        document.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            this.playSound('scroll', { intensity: 0.2 });
            scrollTimeout = setTimeout(() => {
                // Scroll end sound
            }, 150);
        });

        // Keyboard interactions
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.playSound('confirm', { intensity: 0.6 });
            } else if (e.key === 'Escape') {
                this.playSound('cancel', { intensity: 0.5 });
            }
        });

        // Page visibility (tab switching)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.playSound('minimize', { intensity: 0.3 });
            } else {
                this.playSound('restore', { intensity: 0.4 });
            }
        });

        // Custom events for complex interactions
        document.addEventListener('nexo:cart:add', () => {
            this.playSound('success', { theme: 'celebration', intensity: 1.0 });
            this.speak('Produto adicionado ao carrinho!', 'happy');
        });

        document.addEventListener('nexo:checkout:complete', () => {
            this.playSound('celebration', { theme: 'celebration', intensity: 1.0, duration: 3 });
            this.speak('Compra realizada com sucesso! Obrigado pela preferência.', 'excited');
        });

        document.addEventListener('nexo:form:error', () => {
            this.playSound('error', { theme: 'error', intensity: 0.8 });
            this.speak('Por favor, verifique os dados informados.', 'concerned');
        });
    }

    async loadSoundLibrary() {
        // Generate procedural sounds instead of loading audio files
        this.soundLibrary = {
            click: () => this.generateClickSound(),
            hover: () => this.generateHoverSound(),
            success: () => this.generateSuccessSound(),
            error: () => this.generateErrorSound(),
            warning: () => this.generateWarningSound(),
            celebration: () => this.generateCelebrationSound(),
            confirm: () => this.generateConfirmSound(),
            cancel: () => this.generateCancelSound(),
            scroll: () => this.generateScrollSound(),
            minimize: () => this.generateMinimizeSound(),
            restore: () => this.generateRestoreSound()
        };

        console.log('🎵 Sound library loaded with procedural synthesis');
    }

    playSound(soundName, options = {}) {
        if (this.fallbackMode || !this.audioContext) {
            // Fallback to simple audio cues
            this.fallbackSound(soundName, options);
            return;
        }

        const soundGenerator = this.soundLibrary[soundName];
        if (!soundGenerator) {
            console.warn(`Sound '${soundName}' not found`);
            return;
        }

        try {
            const soundBuffer = soundGenerator();

            // Get or create audio source
            const source = this.audioContext.createBufferSource();
            source.buffer = soundBuffer;

            // Create gain node for volume control
            const gainNode = this.audioContext.createGain();
            gainNode.gain.value = options.intensity || 0.7;

            // Apply spatial positioning if enabled
            if (this.spatialManager && options.position) {
                this.spatialManager.positionSound(source, options.position);
            } else {
                source.connect(gainNode);
                gainNode.connect(this.masterGain);
            }

            // Apply theme-based filtering
            if (options.theme) {
                this.applyThemeFilter(source, options.theme);
            }

            // Start playback
            source.start();

            // Store active sound for management
            const soundId = Date.now() + '_' + Math.random();
            this.activeSounds.set(soundId, {
                source,
                gainNode,
                startTime: this.audioContext.currentTime,
                duration: soundBuffer.duration
            });

            // Auto cleanup
            setTimeout(() => {
                this.activeSounds.delete(soundId);
            }, (soundBuffer.duration * 1000) + 100);

        } catch (error) {
            console.warn('Error playing sound:', error);
            this.fallbackSound(soundName, options);
        }
    }

    generateClickSound() {
        const duration = 0.1;
        const sampleRate = this.audioContext.sampleRate;
        const frameCount = duration * sampleRate;
        const buffer = this.audioContext.createBuffer(1, frameCount, sampleRate);
        const channelData = buffer.getChannelData(0);

        // Generate click envelope
        for (let i = 0; i < frameCount; i++) {
            const t = i / sampleRate;
            const envelope = Math.exp(-t * 30); // Exponential decay
            const noise = (Math.random() - 0.5) * 2;
            channelData[i] = noise * envelope * 0.3;
        }

        return buffer;
    }

    generateHoverSound() {
        const duration = 0.2;
        const sampleRate = this.audioContext.sampleRate;
        const frameCount = duration * sampleRate;
        const buffer = this.audioContext.createBuffer(1, frameCount, sampleRate);
        const channelData = buffer.getChannelData(0);

        const frequency = 800;
        const harmonics = [1, 0.3, 0.1];

        for (let i = 0; i < frameCount; i++) {
            const t = i / sampleRate;
            let sample = 0;

            // Generate harmonic series
            harmonics.forEach((amplitude, index) => {
                const freq = frequency * (index + 1);
                sample += Math.sin(2 * Math.PI * freq * t) * amplitude;
            });

            // Apply fade in/out
            const fadeTime = 0.05;
            let envelope = 1;
            if (t < fadeTime) {
                envelope = t / fadeTime;
            } else if (t > duration - fadeTime) {
                envelope = (duration - t) / fadeTime;
            }

            channelData[i] = sample * envelope * 0.1;
        }

        return buffer;
    }

    generateSuccessSound() {
        const duration = 0.8;
        const sampleRate = this.audioContext.sampleRate;
        const frameCount = duration * sampleRate;
        const buffer = this.audioContext.createBuffer(1, frameCount, sampleRate);
        const channelData = buffer.getChannelData(0);

        // Major chord progression: C4 -> G4 -> C5
        const notes = [
            { freq: 261.63, start: 0.0, duration: 0.2 },   // C4
            { freq: 392.00, start: 0.2, duration: 0.2 },   // G4
            { freq: 523.25, start: 0.4, duration: 0.4 }    // C5
        ];

        for (let i = 0; i < frameCount; i++) {
            const t = i / sampleRate;
            let sample = 0;

            notes.forEach(note => {
                if (t >= note.start && t < note.start + note.duration) {
                    const noteTime = t - note.start;
                    const envelope = Math.sin(Math.PI * noteTime / note.duration); // Sine envelope
                    sample += Math.sin(2 * Math.PI * note.freq * noteTime) * envelope;
                }
            });

            // Add gentle reverb tail
            if (t > 0.6) {
                const reverb = Math.sin(2 * Math.PI * 440 * t) * Math.exp(-(t - 0.6) * 2);
                sample += reverb * 0.3;
            }

            channelData[i] = sample * 0.15;
        }

        return buffer;
    }

    generateErrorSound() {
        const duration = 0.6;
        const sampleRate = this.audioContext.sampleRate;
        const frameCount = duration * sampleRate;
        const buffer = this.audioContext.createBuffer(1, frameCount, sampleRate);
        const channelData = buffer.getChannelData(0);

        // Minor chord with dissonance
        const frequencies = [220, 277.18, 329.63]; // A3, C#4, E4 (minor)

        for (let i = 0; i < frameCount; i++) {
            const t = i / sampleRate;
            let sample = 0;

            frequencies.forEach(freq => {
                // Add slight detuning for dissonance
                const detunedFreq = freq * (1 + Math.sin(t * 10) * 0.005);
                sample += Math.sin(2 * Math.PI * detunedFreq * t);
            });

            // Apply harsh envelope
            const envelope = Math.exp(-t * 1.5) * (1 + Math.sin(t * 50) * 0.3);
            channelData[i] = sample * envelope * 0.08;
        }

        return buffer;
    }

    generateWarningSound() {
        const duration = 1.0;
        const sampleRate = this.audioContext.sampleRate;
        const frameCount = duration * sampleRate;
        const buffer = this.audioContext.createBuffer(1, frameCount, sampleRate);
        const channelData = buffer.getChannelData(0);

        // Pulsing warning tone
        const baseFreq = 440;
        const pulseFreq = 2; // Hz

        for (let i = 0; i < frameCount; i++) {
            const t = i / sampleRate;

            // Square wave with pulse modulation
            const square = Math.sin(2 * Math.PI * baseFreq * t) > 0 ? 0.7 : -0.7;
            const pulse = Math.sin(2 * Math.PI * pulseFreq * t) * 0.5 + 0.5;

            channelData[i] = square * pulse * 0.1;
        }

        return buffer;
    }

    generateCelebrationSound() {
        const duration = 2.0;
        const sampleRate = this.audioContext.sampleRate;
        const frameCount = duration * sampleRate;
        const buffer = this.audioContext.createBuffer(1, frameCount, sampleRate);
        const channelData = buffer.getChannelData(0);

        // Complex celebration with multiple voices
        const voices = [
            { freq: 523.25, delay: 0.0 },   // C5
            { freq: 659.25, delay: 0.1 },   // E5
            { freq: 783.99, delay: 0.2 },   // G5
            { freq: 1046.5, delay: 0.3 },   // C6
            { freq: 1318.5, delay: 0.4 },   // E6
            { freq: 1567.98, delay: 0.5 }   // G6
        ];

        for (let i = 0; i < frameCount; i++) {
            const t = i / sampleRate;
            let sample = 0;

            voices.forEach(voice => {
                if (t >= voice.delay) {
                    const voiceTime = t - voice.delay;
                    const envelope = Math.exp(-voiceTime * 0.5);
                    const oscillation = Math.sin(2 * Math.PI * voice.freq * voiceTime);

                    // Add harmonics
                    sample += oscillation * envelope * 0.8;
                    sample += Math.sin(2 * Math.PI * voice.freq * 2 * voiceTime) * envelope * 0.3;
                    sample += Math.sin(2 * Math.PI * voice.freq * 3 * voiceTime) * envelope * 0.1;
                }
            });

            // Add sparkle effect
            if (Math.random() < 0.01) {
                sample += (Math.random() - 0.5) * 0.5;
            }

            channelData[i] = sample * 0.05;
        }

        return buffer;
    }

    generateConfirmSound() {
        const duration = 0.15;
        const sampleRate = this.audioContext.sampleRate;
        const frameCount = duration * sampleRate;
        const buffer = this.audioContext.createBuffer(1, frameCount, sampleRate);
        const channelData = buffer.getChannelData(0);

        const frequency = 600;

        for (let i = 0; i < frameCount; i++) {
            const t = i / sampleRate;
            const envelope = 1 - (t / duration); // Linear fade out
            channelData[i] = Math.sin(2 * Math.PI * frequency * t) * envelope * 0.2;
        }

        return buffer;
    }

    generateCancelSound() {
        const duration = 0.2;
        const sampleRate = this.audioContext.sampleRate;
        const frameCount = duration * sampleRate;
        const buffer = this.audioContext.createBuffer(1, frameCount, sampleRate);
        const channelData = buffer.getChannelData(0);

        // Descending tone
        for (let i = 0; i < frameCount; i++) {
            const t = i / sampleRate;
            const progress = t / duration;
            const frequency = 400 - (progress * 200); // 400Hz to 200Hz
            const envelope = 1 - progress;

            channelData[i] = Math.sin(2 * Math.PI * frequency * t) * envelope * 0.15;
        }

        return buffer;
    }

    generateScrollSound() {
        const duration = 0.05;
        const sampleRate = this.audioContext.sampleRate;
        const frameCount = duration * sampleRate;
        const buffer = this.audioContext.createBuffer(1, frameCount, sampleRate);
        const channelData = buffer.getChannelData(0);

        // Very short, high-frequency tick
        const frequency = 1200;

        for (let i = 0; i < frameCount; i++) {
            const t = i / sampleRate;
            const envelope = Math.exp(-t * 50);
            channelData[i] = Math.sin(2 * Math.PI * frequency * t) * envelope * 0.05;
        }

        return buffer;
    }

    generateMinimizeSound() {
        const duration = 0.3;
        const sampleRate = this.audioContext.sampleRate;
        const frameCount = duration * sampleRate;
        const buffer = this.audioContext.createBuffer(1, frameCount, sampleRate);
        const channelData = buffer.getChannelData(0);

        // Descending cascade
        const notes = [440, 415, 392, 370, 349]; // Quick descending scale

        for (let i = 0; i < frameCount; i++) {
            const t = i / sampleRate;
            const noteIndex = Math.floor(t / duration * notes.length);
            const freq = notes[Math.min(noteIndex, notes.length - 1)];
            const envelope = Math.exp(-(t % (duration / notes.length)) * 20);

            channelData[i] = Math.sin(2 * Math.PI * freq * t) * envelope * 0.1;
        }

        return buffer;
    }

    generateRestoreSound() {
        const duration = 0.3;
        const sampleRate = this.audioContext.sampleRate;
        const frameCount = duration * sampleRate;
        const buffer = this.audioContext.createBuffer(1, frameCount, sampleRate);
        const channelData = buffer.getChannelData(0);

        // Ascending cascade
        const notes = [349, 370, 392, 415, 440]; // Quick ascending scale

        for (let i = 0; i < frameCount; i++) {
            const t = i / sampleRate;
            const noteIndex = Math.floor(t / duration * notes.length);
            const freq = notes[Math.min(noteIndex, notes.length - 1)];
            const envelope = Math.exp(-(t % (duration / notes.length)) * 20);

            channelData[i] = Math.sin(2 * Math.PI * freq * t) * envelope * 0.1;
        }

        return buffer;
    }

    applyThemeFilter(source, themeName) {
        const theme = this.themes[themeName];
        if (!theme) return;

        // Create filter based on theme
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = theme.baseFrequency * 2;
        filter.Q.value = 1;

        source.connect(filter);
        filter.connect(this.masterGain);

        return filter;
    }

    speak(text, emotion = 'neutral') {
        if (!this.voiceSynth) {
            console.log(`🤖 ${text}`);
            return;
        }

        this.voiceSynth.speak(text, emotion);
    }

    setTheme(themeName) {
        if (this.themes[themeName]) {
            this.currentTheme = themeName;
            console.log(`🎵 Audio theme changed to: ${themeName}`);
        }
    }

    setMasterVolume(volume) {
        this.options.masterVolume = Math.max(0, Math.min(1, volume));
        if (this.masterGain) {
            this.masterGain.gain.value = this.options.masterVolume;
        }
    }

    createCustomSound(frequencies, duration = 1.0, envelope = 'adsr') {
        const sampleRate = this.audioContext.sampleRate;
        const frameCount = duration * sampleRate;
        const buffer = this.audioContext.createBuffer(1, frameCount, sampleRate);
        const channelData = buffer.getChannelData(0);

        for (let i = 0; i < frameCount; i++) {
            const t = i / sampleRate;
            let sample = 0;

            // Mix frequencies
            frequencies.forEach(freq => {
                sample += Math.sin(2 * Math.PI * freq * t);
            });

            sample /= frequencies.length; // Normalize

            // Apply envelope
            let envelopeValue = 1;
            if (envelope === 'adsr') {
                const attack = 0.1;
                const decay = 0.2;
                const sustain = 0.7;
                const release = 0.8;

                if (t < attack) {
                    envelopeValue = t / attack;
                } else if (t < decay) {
                    envelopeValue = 1 - ((t - attack) / (decay - attack)) * (1 - sustain);
                } else if (t < release) {
                    envelopeValue = sustain;
                } else {
                    envelopeValue = sustain * (1 - (t - release) / (duration - release));
                }
            }

            channelData[i] = sample * envelopeValue * 0.1;
        }

        return buffer;
    }

    playSequence(soundSequence, interval = 200) {
        soundSequence.forEach((soundConfig, index) => {
            setTimeout(() => {
                this.playSound(soundConfig.name, soundConfig.options);
            }, index * interval);
        });
    }

    stopAllSounds() {
        this.activeSounds.forEach(sound => {
            try {
                sound.source.stop();
            } catch (e) {
                // Sound might already be stopped
            }
        });
        this.activeSounds.clear();
    }

    fallbackSound(soundName, options) {
        // Simple fallback using Web Audio API beeps
        const duration = 200;
        const frequency = {
            click: 800,
            hover: 600,
            success: 523,
            error: 220,
            warning: 330
        }[soundName] || 440;

        // Use vibration API as fallback for mobile
        if (navigator.vibrate && options.intensity > 0.5) {
            navigator.vibrate(duration);
        }

        console.log(`🔊 ${soundName} (${options.intensity || 0.5})`);
    }

    destroy() {
        this.stopAllSounds();

        if (this.audioContext) {
            this.audioContext.close();
        }

        console.log('🔇 Sound Manager destroyed');
    }
}

class SpatialAudioManager {
    constructor(audioContext, outputNode) {
        this.audioContext = audioContext;
        this.outputNode = outputNode;
        this.listener = audioContext.listener;

        // Set up 3D audio listener
        this.updateListenerPosition();

        // Update listener position on resize/move
        window.addEventListener('resize', () => this.updateListenerPosition());
        window.addEventListener('deviceorientation', (e) => {
            if (e.gamma && e.beta) {
                this.updateListenerOrientation(e.alpha, e.beta, e.gamma);
            }
        });
    }

    updateListenerPosition() {
        // Position listener at center of screen
        this.listener.positionX.value = window.innerWidth / 2;
        this.listener.positionY.value = window.innerHeight / 2;
        this.listener.positionZ.value = 0;
    }

    updateListenerOrientation(alpha, beta, gamma) {
        // Convert device orientation to audio orientation
        const alphaRad = (alpha || 0) * Math.PI / 180;
        const betaRad = (beta || 0) * Math.PI / 180;

        this.listener.forwardX.value = Math.sin(alphaRad) * Math.cos(betaRad);
        this.listener.forwardY.value = Math.sin(betaRad);
        this.listener.forwardZ.value = -Math.cos(alphaRad) * Math.cos(betaRad);

        this.listener.upX.value = 0;
        this.listener.upY.value = 1;
        this.listener.upZ.value = 0;
    }

    positionSound(source, position) {
        const panner = this.audioContext.createPanner();
        panner.panningModel = 'HRTF';
        panner.distanceModel = 'inverse';
        panner.refDistance = 100;
        panner.maxDistance = 1000;
        panner.rolloffFactor = 1;

        // Set sound position
        panner.positionX.value = position.x || 0;
        panner.positionY.value = position.y || 0;
        panner.positionZ.value = 0;

        source.connect(panner);
        panner.connect(this.outputNode);

        return panner;
    }
}

class VoiceSynthesizer {
    constructor(options) {
        this.options = options;
        this.synth = window.speechSynthesis;
        this.currentUtterance = null;
        this.voices = [];

        this.loadVoices();
        this.synth.addEventListener('voiceschanged', () => this.loadVoices());
    }

    loadVoices() {
        this.voices = this.synth.getVoices();
        this.selectedVoice = this.voices.find(voice =>
            voice.lang.startsWith(this.options.voiceLang) && voice.localService
        ) || this.voices.find(voice => voice.lang.startsWith(this.options.voiceLang)) || this.voices[0];
    }

    speak(text, emotion = 'neutral') {
        if (!this.synth) return;

        // Stop current speech
        if (this.currentUtterance) {
            this.synth.cancel();
        }

        this.currentUtterance = new SpeechSynthesisUtterance(text);

        // Configure voice
        if (this.selectedVoice) {
            this.currentUtterance.voice = this.selectedVoice;
        }

        // Adjust parameters based on emotion
        const emotionSettings = {
            neutral: { rate: this.options.voiceRate, pitch: this.options.voicePitch },
            happy: { rate: this.options.voiceRate * 1.1, pitch: this.options.voicePitch * 1.2 },
            sad: { rate: this.options.voiceRate * 0.9, pitch: this.options.voicePitch * 0.8 },
            excited: { rate: this.options.voiceRate * 1.3, pitch: this.options.voicePitch * 1.3 },
            concerned: { rate: this.options.voiceRate * 0.8, pitch: this.options.voicePitch * 0.9 },
            angry: { rate: this.options.voiceRate * 0.7, pitch: this.options.voicePitch * 0.7 }
        };

        const settings = emotionSettings[emotion] || emotionSettings.neutral;
        this.currentUtterance.rate = settings.rate;
        this.currentUtterance.pitch = settings.pitch;
        this.currentUtterance.volume = 0.8;

        // Add event listeners
        this.currentUtterance.onend = () => {
            this.currentUtterance = null;
        };

        this.currentUtterance.onerror = (e) => {
            console.warn('Speech synthesis error:', e);
            this.currentUtterance = null;
        };

        this.synth.speak(this.currentUtterance);
    }

    stop() {
        if (this.synth) {
            this.synth.cancel();
            this.currentUtterance = null;
        }
    }
}

// Auto-initialization
document.addEventListener('DOMContentLoaded', async () => {
    // Create global sound manager instance
    window.soundManager = new SoundManager({
        masterVolume: 0.6,
        enableSpatialAudio: true,
        enableVoiceSynthesis: true,
        enableProceduralSounds: true
    });

    // Add global sound trigger functions
    window.playSound = (soundName, options) => {
        if (window.soundManager) {
            window.soundManager.playSound(soundName, options);
        }
    };

    window.speakText = (text, emotion) => {
        if (window.soundManager) {
            window.soundManager.speak(text, emotion);
        }
    };

    // Demo keyboard controls
    document.addEventListener('keydown', (e) => {
        switch (e.key.toLowerCase()) {
            case 'q':
                window.playSound('click');
                break;
            case 'w':
                window.playSound('success', { theme: 'success' });
                break;
            case 'e':
                window.playSound('error', { theme: 'error' });
                break;
            case 'r':
                window.playSound('celebration', { theme: 'celebration' });
                break;
            case 't':
                window.speakText('Olá! Sou o assistente de áudio do GetNexo!', 'happy');
                break;
        }
    });

    console.log('🎵 Sound Manager Active! Press Q/W/E/R/T for sounds, or interact with the page!');
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SoundManager;
}