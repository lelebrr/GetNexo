import { JSDOM } from 'jsdom';

// Mock de setTimeout e setInterval
jest.useFakeTimers();

describe('PreSupportModal', () => {
  let dom;
  let window;
  let document;

  beforeEach(() => {
    // Configurar JSDOM
    dom = new JSDOM(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="speakable" content=".modal-header, #btn-text, #btn-voice, #voice-status">
        </head>
        <body>
          <!-- Skip Link para acessibilidade -->
          <a href="#main-content" class="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded z-50">
            Pular para conteúdo principal
          </a>

          <!-- Modal de Suporte -->
          <div id="pre-support-modal" class="fixed inset-0 z-50 hidden" role="dialog" aria-modal="true" aria-labelledby="modal-title" aria-describedby="modal-description">
            <!-- Overlay com blur -->
            <div class="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" aria-hidden="true"></div>

            <!-- Container do Modal -->
            <div class="flex items-center justify-center min-h-screen p-4">
              <div class="modal-content bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full relative">

                <!-- Botão Fechar -->
                <button id="close-modal" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors duration-200" aria-label="Fechar modal de suporte">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>

                <!-- Header -->
                <header class="text-center p-6 pb-4">
                  <div class="flex items-center justify-center gap-3 mb-3">
                    <span class="text-2xl" aria-hidden="true">✨</span>
                    <h2 id="modal-title" class="text-xl font-semibold text-gray-900 dark:text-white">
                      Como prefere falar conosco?
                    </h2>
                  </div>
                  <p id="modal-description" class="text-gray-600 dark:text-gray-300 text-sm">
                    Escolha sua forma preferida de comunicação
                  </p>
                </header>

                <!-- Opções -->
                <div class="px-6 pb-6">
                  <div class="grid grid-cols-1 gap-3">
                    <button id="btn-text" class="support-button group" data-mode="text" aria-describedby="text-description">
                      <span class="btn-icon text-2xl mb-2" aria-hidden="true">💬</span>
                      <span class="font-medium">Digitar</span>
                      <span id="text-description" class="sr-only">Abrir chat de texto para suporte</span>
                    </button>

                    <button id="btn-voice" class="support-button group" data-mode="voice" aria-describedby="voice-description">
                      <span class="btn-icon text-2xl mb-2" aria-hidden="true">🎤</span>
                      <span class="font-medium">Falar</span>
                      <span id="voice-description" class="sr-only">Iniciar reconhecimento de voz para suporte</span>
                    </button>
                  </div>

                  <!-- Feedback de Voz -->
                  <div id="voice-status" class="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hidden" role="status" aria-live="polite">
                    <div class="flex items-center justify-center gap-3">
                      <div id="voice-indicator" class="flex gap-1">
                        <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse" style="animation-delay: 0.1s"></div>
                        <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse" style="animation-delay: 0.2s"></div>
                      </div>
                      <span id="voice-feedback-text" class="text-sm text-gray-700 dark:text-gray-300">Ouvindo...</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Schema.org Speakable -->
          <script type="application/ld+json">
            {
              "@context": "https://schema.org",
              "@type": "WebPage",
              "speakable": {
                "@type": "SpeakableSpecification",
                "cssSelector": [".modal-header", "#btn-text", "#btn-voice", "#voice-status"]
              }
            }
          </script>
        </body>
      </html>
    `, {
      url: 'http://localhost',
      pretendToBeVisual: true,
      resources: 'usable'
    });

    window = dom.window;
    document = window.document;

    // Mock de navigator.permissions
    Object.defineProperty(window.navigator, 'permissions', {
      value: {
        query: jest.fn().mockResolvedValue({ state: 'granted' })
      },
      writable: true
    });

    // Mock de SpeechRecognition
    Object.defineProperty(window, 'SpeechRecognition', {
      value: jest.fn().mockImplementation(() => ({
        lang: '',
        interimResults: true,
        maxAlternatives: 1,
        continuous: false,
        start: jest.fn(),
        stop: jest.fn(),
        onstart: null,
        onresult: null,
        onerror: null,
        onend: null
      })),
      writable: true
    });

    Object.defineProperty(window, 'webkitSpeechRecognition', {
      value: window.SpeechRecognition,
      writable: true
    });

    // Mock de matchMedia
    Object.defineProperty(window, 'matchMedia', {
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn()
      })),
      writable: true
    });

    // Mock de fetch
    global.fetch = jest.fn();

    // Mock de alert
    window.alert = jest.fn();

    // Mock de $chatwoot
    Object.defineProperty(window, '$chatwoot', {
      value: { toggle: jest.fn() },
      writable: true
    });

    // Configuração global
    window.preSupportModalConfig = {
      primaryColor: '#00ffa3',
      language: 'pt-BR',
      voiceTimeout: 30000,
      enableAnalytics: true
    };
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  test('deve inicializar o modal corretamente', () => {
    // Simular a execução do script
    const scriptContent = `
      class PreSupportModal {
        private modal: HTMLElement | null;
        private closeBtn: HTMLElement | null;
        private textBtn: HTMLElement | null;
        private voiceBtn: HTMLElement | null;
        private voiceStatus: HTMLElement | null;
        private voiceFeedbackText: HTMLElement | null;
        private recognition: any = null;
        private isOpen: boolean = false;
        private mode: string | null = null;
        private config: any = {};

        constructor() {
          this.modal = document.getElementById('pre-support-modal');
          this.closeBtn = document.getElementById('close-modal');
          this.textBtn = document.getElementById('btn-text');
          this.voiceBtn = document.getElementById('btn-voice');
          this.voiceStatus = document.getElementById('voice-status');
          this.voiceFeedbackText = document.getElementById('voice-feedback-text');

          this.config = {
            primaryColor: '#00ffa3',
            language: 'pt-BR',
            voiceTimeout: 30000,
            enableAnalytics: true,
            ...((window as any).preSupportModalConfig || {})
          };

          this.init();
        }

        private init() {
          if (!this.modal) return;

          this.bindEvents();
          this.setupKeyboardNavigation();
          this.setupAutoShow();

          // Configuração global
          (window as any).modalInstance = this;
        }

        private bindEvents() {
          // Botão fechar
          this.closeBtn?.addEventListener('click', () => this.close());

          // Botões de modo
          this.textBtn?.addEventListener('click', () => this.selectText());
          this.voiceBtn?.addEventListener('click', () => this.selectVoice());

          // ESC para fechar
          document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
              this.close();
            }
          });

          // Click no overlay para fechar
          this.modal?.addEventListener('click', (e) => {
            if (e.target === this.modal) {
              this.close();
            }
          });
        }

        private setupKeyboardNavigation() {
          const focusableElements = this.modal?.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );

          if (focusableElements) {
            const firstElement = focusableElements[0] as HTMLElement;
            const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

            this.modal?.addEventListener('keydown', (e) => {
              if (e.key === 'Tab') {
                if (e.shiftKey) {
                  if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                  }
                } else {
                  if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                  }
                }
              }
            });
          }
        }

        private setupAutoShow() {
          // Mostrar modal após delay, respeitando preferências do usuário
          const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

          setTimeout(() => {
            if (!prefersReducedMotion && !this.isOpen) {
              this.open();
            }
          }, 2000);
        }

        // API Pública
        public open() {
          if (this.modal && !this.isOpen) {
            this.isOpen = true;
            this.modal.classList.remove('hidden');
            this.modal.classList.add('modal-enter');

            // Foco automático no primeiro botão
            setTimeout(() => {
              this.textBtn?.focus();
            }, 100);

            // Disparar evento
            window.dispatchEvent(new CustomEvent('preSupportModalOpened'));
          }
        }

        public close() {
          if (this.modal && this.isOpen) {
            this.isOpen = false;
            this.modal.classList.add('hidden');
            this.modal.classList.remove('modal-enter');

            // Parar reconhecimento de voz se ativo
            if (this.recognition) {
              this.recognition.stop();
            }

            // Disparar evento
            window.dispatchEvent(new CustomEvent('preSupportModalClosed'));
          }
        }

        public selectText() {
          this.mode = 'text';
          this.close();
          this.openChat();
        }

        public selectVoice() {
          this.mode = 'voice';
          this.startVoiceRecognition();
        }

        private startVoiceRecognition() {
          const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

          if (!SpeechRecognition) {
            this.showFallback('Seu navegador não suporta reconhecimento de voz. Use o modo texto.');
            return;
          }

          // Verificar permissões
          if (navigator.permissions) {
            navigator.permissions.query({ name: 'microphone' as PermissionName }).then((result) => {
              if (result.state === 'denied') {
                this.showFallback('Permissão de microfone negada. Permita o acesso ou use o modo texto.');
                return;
              }
              this.initializeRecognition(SpeechRecognition);
            }).catch(() => {
              this.initializeRecognition(SpeechRecognition);
            });
          } else {
            this.initializeRecognition(SpeechRecognition);
          }
        }

        private initializeRecognition(SpeechRecognition: any) {
          this.recognition = new SpeechRecognition();
          this.recognition.lang = this.config.language;
          this.recognition.interimResults = true;
          this.recognition.maxAlternatives = 1;
          this.recognition.continuous = false;

          this.recognition.onstart = () => {
            this.showVoiceFeedback('Ouvindo...');
          };

          this.recognition.onresult = (event: any) => {
            const lastResult = event.results[event.results.length - 1];
            const transcript = lastResult[0].transcript;

            this.showVoiceFeedback(transcript);

            if (lastResult.isFinal) {
              setTimeout(() => {
                this.sendVoiceMessage(transcript);
              }, 500);
            }
          };

          this.recognition.onerror = (event: any) => {
            let message = 'Erro ao reconhecer voz.';
            switch (event.error) {
              case 'no-speech':
                message = 'Nenhuma fala detectada. Tente novamente.';
                break;
              case 'audio-capture':
                message = 'Microfone não encontrado.';
                break;
              case 'not-allowed':
                message = 'Permissão de microfone negada.';
                break;
            }
            this.showFallback(message);
          };

          this.recognition.onend = () => {
            this.hideVoiceFeedback();
          };

          try {
            this.recognition.start();
          } catch (error) {
            this.showFallback('Erro ao iniciar reconhecimento de voz.');
          }
        }

        private showVoiceFeedback(text: string) {
          if (this.voiceStatus && this.voiceFeedbackText) {
            this.voiceStatus.classList.remove('hidden');
            this.voiceFeedbackText.textContent = text;
          }
        }

        private hideVoiceFeedback() {
          if (this.voiceStatus) {
            this.voiceStatus.classList.add('hidden');
          }
        }

        private showFallback(message: string) {
          this.hideVoiceFeedback();
          console.warn('PreSupportModal:', message);
          alert(message);
        }

        private openChat() {
          const win = window as any;
          if (win.$chatwoot) {
            win.$chatwoot.toggle();
          } else {
            window.location.href = '/contato';
          }
        }

        private async sendVoiceMessage(transcript: string) {
          try {
            const response = await fetch('/api/support/voice', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                message: transcript,
                userAgent: navigator.userAgent,
                timestamp: Date.now(),
                language: this.config.language
              })
            });

            if (response.ok) {
              this.close();
              this.openChat();
            } else {
              throw new Error('Erro na API');
            }
          } catch (error) {
            console.error('Erro ao enviar mensagem de voz:', error);
            this.showFallback('Erro ao processar mensagem de voz. Tente novamente.');
          }
        }
      }

      // Inicialização
      document.addEventListener('astro:page-load', () => {
        new PreSupportModal();
      });

      if (document.readyState === 'complete') {
        new PreSupportModal();
      } else {
        document.addEventListener('DOMContentLoaded', () => {
          new PreSupportModal();
        });
      }
    `;

    // Executar o script no contexto do JSDOM
    const script = document.createElement('script');
    script.textContent = scriptContent;
    document.head.appendChild(script);

    // Disparar DOMContentLoaded
    document.dispatchEvent(new Event('DOMContentLoaded'));
  });

  test('deve renderizar o modal inicialmente oculto', () => {
    const modal = document.getElementById('pre-support-modal');
    expect(modal).toBeInTheDocument();
    expect(modal).toHaveClass('hidden');
  });

  test('deve abrir o modal após delay', () => {
    const modal = document.getElementById('pre-support-modal');

    // Avançar timers
    jest.advanceTimersByTime(2000);

    expect(modal).not.toHaveClass('hidden');
    expect(modal).toHaveClass('modal-enter');
  });

  test('deve fechar o modal ao clicar no botão fechar', () => {
    const modal = document.getElementById('pre-support-modal');
    const closeBtn = document.getElementById('close-modal');

    // Abrir modal
    jest.advanceTimersByTime(2000);
    expect(modal).not.toHaveClass('hidden');

    // Fechar modal
    closeBtn.click();
    expect(modal).toHaveClass('hidden');
  });

  test('deve fechar o modal ao pressionar ESC', () => {
    const modal = document.getElementById('pre-support-modal');

    // Abrir modal
    jest.advanceTimersByTime(2000);
    expect(modal).not.toHaveClass('hidden');

    // Pressionar ESC
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(modal).toHaveClass('hidden');
  });

  test('deve selecionar modo texto e abrir chat', () => {
    const textBtn = document.getElementById('btn-text');
    const modal = document.getElementById('pre-support-modal');

    // Abrir modal
    jest.advanceTimersByTime(2000);
    expect(modal).not.toHaveClass('hidden');

    // Clicar em texto
    textBtn.click();

    expect(modal).toHaveClass('hidden');
    expect(window.$chatwoot.toggle).toHaveBeenCalled();
  });

  test('deve iniciar reconhecimento de voz ao clicar em falar', () => {
    const voiceBtn = document.getElementById('btn-voice');
    const modal = document.getElementById('pre-support-modal');
    const voiceStatus = document.getElementById('voice-status');

    // Abrir modal
    jest.advanceTimersByTime(2000);

    // Clicar em voz
    voiceBtn.click();

    expect(modal).not.toHaveClass('hidden'); // Modal permanece aberto
    expect(voiceStatus).not.toHaveClass('hidden');
  });

  test('deve lidar com erro de navegador sem suporte a voz', () => {
    // Remover SpeechRecognition do mock
    delete window.SpeechRecognition;
    delete window.webkitSpeechRecognition;

    const voiceBtn = document.getElementById('btn-voice');

    // Abrir modal
    jest.advanceTimersByTime(2000);

    // Clicar em voz
    voiceBtn.click();

    expect(window.alert).toHaveBeenCalledWith('Seu navegador não suporta reconhecimento de voz. Use o modo texto.');
  });

  test('deve enviar mensagem de voz com sucesso', async () => {
    const voiceBtn = document.getElementById('btn-voice');
    const modal = document.getElementById('pre-support-modal');

    // Mock de fetch para sucesso
    (global.fetch as any).mockResolvedValueOnce({ ok: true });

    // Abrir modal
    jest.advanceTimersByTime(2000);

    // Clicar em voz
    voiceBtn.click();

    // Simular resultado de voz
    const recognition = /** @type {any} */ (window).modalInstance.recognition;
    recognition.onstart();
    recognition.onresult({
      results: [
        {
          0: { transcript: 'Olá, preciso de ajuda' },
          isFinal: true
        }
      ]
    });

    // Avançar timer para enviar
    jest.advanceTimersByTime(500);

    await new Promise(resolve => setImmediate(resolve));

    expect(global.fetch).toHaveBeenCalledWith('/api/support/voice', expect.any(Object));
    expect(modal).toHaveClass('hidden');
    expect(window.$chatwoot.toggle).toHaveBeenCalled();
  });

  test('deve lidar com erro na API de voz', async () => {
    const voiceBtn = document.getElementById('btn-voice');

    // Mock de fetch para erro
    (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

    // Abrir modal
    jest.advanceTimersByTime(2000);

    // Clicar em voz
    voiceBtn.click();

    // Simular resultado de voz
    const recognition = /** @type {any} */ (window).modalInstance.recognition;
    recognition.onstart();
    recognition.onresult({
      results: [
        {
          0: { transcript: 'Teste' },
          isFinal: true
        }
      ]
    });

    // Avançar timer
    jest.advanceTimersByTime(500);

    await new Promise(resolve => setImmediate(resolve));

    expect(window.alert).toHaveBeenCalledWith('Erro ao processar mensagem de voz. Tente novamente.');
  });

  test('deve ter atributos de acessibilidade corretos', () => {
    const modal = document.getElementById('pre-support-modal');
    const title = document.getElementById('modal-title');
    const description = document.getElementById('modal-description');
    const textBtn = document.getElementById('btn-text');
    const voiceBtn = document.getElementById('btn-voice');
    const closeBtn = document.getElementById('close-modal');

    expect(modal).toHaveAttribute('role', 'dialog');
    expect(modal).toHaveAttribute('aria-modal', 'true');
    expect(modal).toHaveAttribute('aria-labelledby', 'modal-title');
    expect(modal).toHaveAttribute('aria-describedby', 'modal-description');

    expect(title).toHaveAttribute('id', 'modal-title');
    expect(description).toHaveAttribute('id', 'modal-description');

    expect(textBtn).toHaveAttribute('aria-describedby', 'text-description');
    expect(voiceBtn).toHaveAttribute('aria-describedby', 'voice-description');
    expect(closeBtn).toHaveAttribute('aria-label', 'Fechar modal de suporte');
  });
});