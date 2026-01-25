# 🎤 Demo de Chat com Voz - GetNexo

Componente React que demonstra chat inteligente com síntese de voz usando Web Speech API.

## ✅ Arquivos Criados

### `getnexo-site/src/components/useVoice.js`
Hook reutilizável que encapsula a Web Speech API:
- `speak(text)`: Fala o texto em português brasileiro
- `stop()`: Para a fala atual
- `isAvailable`: Verifica se o navegador suporta

### `getnexo-site/src/components/VoiceChatDemo.jsx`
Componente principal do demo:
- Conversa fixa de 6 mensagens (cliente/bot)
- Botões "Ouvir" em cada mensagem
- Botão "Limpar Chat" para reset
- Design moderno com gradiente cyan-green
- Feedback visual durante reprodução

### `getnexo-site/src/pages/demo.astro`
Página de demonstração:
- Fundo escuro profissional
- Componente React integrado via Astro
- Acessível em `/demo`

## 🎯 Funcionalidades

- **Voz Brasileira**: Usa `pt-BR` com voz nativa quando disponível
- **Fallback**: Alerta se navegador não suportar
- **Controles**: Play/stop individual por mensagem
- **Responsive**: Funciona em desktop e mobile
- **Acessível**: Botões com feedback visual

## 🚀 Como Testar

1. Acesse: `http://localhost:4321/demo`
2. Clique nos botões "🔊 Ouvir" em cada mensagem
3. Teste o botão "Limpar Chat"
4. Verifique em diferentes navegadores

## 🔧 Compatibilidade

- ✅ Chrome/Chromium (melhor suporte)
- ✅ Edge
- ✅ Safari (iOS/macOS)
- ❌ Firefox (suporte limitado)
- ❌ Navegadores móveis antigos

## 💡 Uso em Outros Componentes

```jsx
import { useVoice } from './useVoice'

function MeuComponente() {
  const { speak, isAvailable } = useVoice()

  return (
    <button onClick={() => speak("Olá mundo!")}>
      Falar
    </button>
  )
}
```

## 🎨 Personalização

- **Voz**: Ajuste `rate`, `pitch` e `volume` no hook
- **Mensagens**: Edite array `mensagensDemo`
- **Estilo**: Modifique classes Tailwind
- **Idioma**: Troque `lang` para outros idiomas

Pronto para impressionar visitantes com tecnologia de voz avançada! 🔥