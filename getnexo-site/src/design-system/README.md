# Neuro Design System

Design System completo com componentes reutilizáveis padronizados, micro-interações sutis, loading states otimizados, error handling gracioso, mobile-first responsive, accessibility WCAG 2.2 AA+, dark/light mode systemico, themes customizáveis, motion design guidelines, focus visible indicators, skip links e ARIA labels completos.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Instalação](#instalação)
- [Estrutura](#estrutura)
- [Tokens de Design](#tokens-de-design)
- [Sistema de Temas](#sistema-de-temas)
- [Componentes](#componentes)
- [Acessibilidade](#acessibilidade)
- [Motion Design](#motion-design)
- [Configuração via Admin](#configuração-via-admin)
- [Exemplos de Uso](#exemplos-de-uso)
- [Documentação](#documentação)
- [Testes](#testes)
- [Contribuição](#contribuição)

## 🎯 Visão Geral

O Neuro Design System é um sistema completo de design que inclui:

- ✅ **Componentes reutilizáveis padronizados**: Button, Input, Card, Loading, Toast
- ✅ **Micro-interações sutis**: Animações suaves e não distraídas
- ✅ **Loading states otimizados**: Diferentes variantes de loading
- ✅ **Error handling gracioso**: Mensagens de erro amigáveis
- ✅ **Mobile-first responsive**: Design responsivo mobile-first
- ✅ **Accessibility WCAG 2.2 AA+**: Acessibilidade total
- ✅ **Dark/Light mode systemico**: Tema claro e escuro
- ✅ **Themes customizáveis**: Configuração via Admin
- ✅ **Motion design guidelines**: Diretrizes de animação
- ✅ **Focus visible indicators**: Indicadores de foco visíveis
- ✅ **Skip links**: Navegação por teclado
- ✅ **ARIA labels completos**: Atributos ARIA completos

## 📦 Instalação

### Pré-requisitos

- React 18+
- Node.js 18+
- npm ou yarn

### Instalação

```bash
cd getnexo-site
npm install
```

### Configuração

1. Importe o Design System no seu projeto:

```javascript
import { 
  ThemeProvider, 
  Button, 
  Input, 
  Card,
  Loading,
  ToastProvider,
  SkipLinks,
  useTheme,
  useToast,
  designSystemUtils
} from './design-system';
```

2. Envolva sua aplicação com o ThemeProvider:

```javascript
function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <SkipLinks />
        <YourApp />
      </ToastProvider>
    </ThemeProvider>
  );
}
```

## 📁 Estrutura

```
getnexo-site/src/design-system/
├── tokens/
│   ├── colors.js          # Tokens de cores
│   ├── typography.js      # Tokens de tipografia
│   └── spacing.js         # Tokens de espaçamento
├── theme/
│   └── ThemeContext.jsx   # Contexto de tema
├── components/
│   ├── Button.jsx         # Componente Button
│   ├── Input.jsx          # Componente Input
│   ├── Card.jsx           # Componente Card
│   ├── Loading.jsx        # Componente Loading
│   ├── Toast.jsx          # Componente Toast
│   └── SkipLinks.jsx      # Componente SkipLinks
├── motion/
│   └── motion-guidelines.js # Diretrizes de motion
├── admin/
│   └── DesignSystemConfig.jsx # Configuração via Admin
└── index.js               # Export principal
```

## 🎨 Tokens de Design

### Cores

```javascript
import { colors, getColor } from './design-system';

// Uso básico
const primaryColor = colors.primary[600]; // #3b82f6

// Com tema
const darkPrimary = getColor('primary.600', 'dark'); // #3b82f6 (dark mode)
```

### Tipografia

```javascript
import { typography, getTypography } from './design-system';

// Uso básico
const h1Style = typography.scale.mobile.h1;

// Com helper
const h1Style = getTypography('h1', 'desktop');
```

### Espaçamento

```javascript
import { spacing, getSpacing } from './design-system';

// Uso básico
const padding = spacing.space[4]; // 1rem

// Com helper
const padding = getSpacing(4); // 1rem
```

## 🌓 Sistema de Temas

### Uso Básico

```javascript
import { useTheme } from './design-system';

function MyComponent() {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  
  return (
    <div style={{ 
      background: isDarkMode ? '#09090b' : '#ffffff',
      color: isDarkMode ? '#fafafa' : '#18181b'
    }}>
      <button onClick={toggleTheme}>
        {isDarkMode ? '☀️' : '🌙'}
      </button>
    </div>
  );
}
```

### Configuração de Tema

```javascript
import { useThemeConfig } from './design-system';

function ThemeConfigurator() {
  const { updateTheme, resetTheme, exportTheme, importTheme } = useThemeConfig();
  
  const handleUpdate = () => {
    updateTheme({
      mode: 'dark',
      primaryColor: 'primary',
      motionEnabled: true,
    });
  };
  
  return (
    <div>
      <button onClick={handleUpdate}>Atualizar Tema</button>
      <button onClick={resetTheme}>Resetar Tema</button>
      <button onClick={() => navigator.clipboard.writeText(exportTheme())}>
        Exportar Configuração
      </button>
    </div>
  );
}
```

## 🧩 Componentes

### Button

```javascript
import { Button } from './design-system';

function MyComponent() {
  return (
    <div>
      {/* Button básico */}
      <Button variant="primary" size="medium">
        Clique aqui
      </Button>
      
      {/* Button com loading */}
      <Button variant="primary" loading={true}>
        Carregando...
      </Button>
      
      {/* Button com ícone */}
      <Button variant="secondary" icon={<Icon />}>
        Com ícone
      </Button>
      
      {/* Button grupo */}
      <Button.Group gap="medium">
        <Button variant="primary">Salvar</Button>
        <Button variant="outline">Cancelar</Button>
      </Button.Group>
      
      {/* Button ícone */}
      <Button.Icon 
        icon={<Icon />} 
        variant="ghost" 
        ariaLabel="Fechar"
      />
    </div>
  );
}
```

### Input

```javascript
import { Input } from './design-system';

function MyComponent() {
  const [value, setValue] = useState('');
  
  return (
    <div>
      {/* Input básico */}
      <Input
        label="Nome"
        placeholder="Digite seu nome"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      
      {/* Input com erro */}
      <Input
        label="Email"
        placeholder="Digite seu email"
        error="Email inválido"
      />
      
      {/* Input com sucesso */}
      <Input
        label="Senha"
        placeholder="Digite sua senha"
        success="Senha forte!"
      />
      
      {/* Input com aviso */}
      <Input
        label="Telefone"
        placeholder="Digite seu telefone"
        warning="Formato: (XX) XXXXX-XXXX"
      />
      
      {/* Input com ícone */}
      <Input
        label="Buscar"
        placeholder="Buscar..."
        icon={<SearchIcon />}
        iconPosition="left"
      />
      
      {/* Input com prefixo/sufixo */}
      <Input
        label="Valor"
        placeholder="0.00"
        prefix="R$"
        suffix=",00"
      />
      
      {/* Input senha */}
      <Input.Password
        label="Senha"
        placeholder="Digite sua senha"
        showToggle={true}
      />
      
      {/* Input grupo */}
      <Input.Group gap="medium">
        <Input label="Nome" placeholder="Nome" />
        <Input label="Sobrenome" placeholder="Sobrenome" />
      </Input.Group>
    </div>
  );
}
```

### Card

```javascript
import { Card } from './design-system';

function MyComponent() {
  return (
    <div>
      {/* Card básico */}
      <Card
        variant="elevated"
        size="medium"
        title="Título do Card"
        description="Descrição do card"
      >
        Conteúdo do card
      </Card>
      
      {/* Card com ações */}
      <Card
        variant="outlined"
        size="medium"
        title="Card com ações"
        description="Com botões no rodapé"
        footer={
          <>
            <Button variant="primary" size="small">Confirmar</Button>
            <Button variant="outline" size="small">Cancelar</Button>
          </>
        }
      >
        Conteúdo do card
      </Card>
      
      {/* Card grupo */}
      <Card.Group columns={3} gap="medium">
        <Card variant="elevated" size="small" title="Card 1" />
        <Card variant="elevated" size="small" title="Card 2" />
        <Card variant="elevated" size="small" title="Card 3" />
      </Card.Group>
      
      {/* Card skeleton */}
      <Card.Skeleton size="medium" />
      
      {/* Card error */}
      <Card.Error 
        title="Erro ao carregar"
        message="Não foi possível carregar os dados"
        onRetry={() => console.log('Tentar novamente')}
      />
      
      {/* Card success */}
      <Card.Success 
        title="Sucesso!"
        message="Dados salvos com sucesso"
      />
      
      {/* Card warning */}
      <Card.Warning 
        title="Atenção"
        message="Verifique os dados antes de continuar"
      />
    </div>
  );
}
```

### Loading

```javascript
import { Loading } from './design-system';

function MyComponent() {
  return (
    <div>
      {/* Loading spinner */}
      <Loading
        variant="spinner"
        color="primary"
        text="Carregando..."
      />
      
      {/* Loading dots */}
      <Loading
        variant="dots"
        color="secondary"
        text="Processando..."
      />
      
      {/* Loading bars */}
      <Loading
        variant="bars"
        color="accent"
        text="Aguarde..."
      />
      
      {/* Loading pulse */}
      <Loading
        variant="pulse"
        color="success"
        text="Carregando dados..."
      />
      
      {/* Loading overlay */}
      <Loading.Overlay
        variant="spinner"
        text="Carregando..."
      />
      
      {/* Loading fullscreen */}
      <Loading.FullScreen
        variant="spinner"
        text="Carregando aplicação..."
      />
      
      {/* Loading skeleton */}
      <Loading.Skeleton
        count={3}
        height="20px"
        variant="line"
      />
      
      {/* Loading skeleton card */}
      <Loading.Skeleton
        height="120px"
        variant="card"
      />
    </div>
  );
}
```

### Toast

```javascript
import { ToastProvider, useToast } from './design-system';

function MyComponent() {
  const { addToast } = useToast();
  
  const showSuccess = () => {
    addToast('Operação realizada com sucesso!', {
      type: 'success',
      duration: 3000,
    });
  };
  
  const showError = () => {
    addToast('Erro ao processar a solicitação!', {
      type: 'error',
      duration: 5000,
      action: {
        label: 'Tentar novamente',
        onClick: () => console.log('Tentando novamente...'),
      },
    });
  };
  
  const showWarning = () => {
    addToast('Atenção: verifique os dados!', {
      type: 'warning',
      duration: 4000,
    });
  };
  
  const showInfo = () => {
    addToast('Informação: dados atualizados', {
      type: 'info',
      duration: 3000,
    });
  };
  
  return (
    <div>
      <button onClick={showSuccess}>Sucesso</button>
      <button onClick={showError}>Erro</button>
      <button onClick={showWarning}>Aviso</button>
      <button onClick={showInfo}>Info</button>
    </div>
  );
}

// App principal
function App() {
  return (
    <ToastProvider position="top-right" duration={3000}>
      <MyComponent />
    </ToastProvider>
  );
}
```

### SkipLinks

```javascript
import { SkipLinks, useSkipLinks } from './design-system';

function MyComponent() {
  const { SkipLinks: SkipLinksComponent } = useSkipLinks();
  
  return (
    <div>
      <SkipLinksComponent />
      
      {/* Seu conteúdo */}
      <main id="main-content">
        <h1>Conteúdo Principal</h1>
      </main>
      
      <nav id="main-navigation">
        {/* Navegação */}
      </nav>
      
      <footer id="footer">
        {/* Rodapé */}
      </footer>
    </div>
  );
}
```

## ♿ Acessibilidade

### Focus Indicators

```javascript
import { FocusIndicator } from './design-system';

function MyComponent() {
  return (
    <FocusIndicator>
      <button>Botão com indicador de foco</button>
    </FocusIndicator>
  );
}
```

### ARIA Labels

```javascript
import { Button } from './design-system';

function MyComponent() {
  return (
    <div>
      {/* Botão com ARIA label */}
      <Button
        variant="primary"
        ariaLabel="Fechar modal"
        ariaDescribedBy="description"
      >
        Fechar
      </Button>
      
      {/* Input com ARIA */}
      <input
        type="text"
        aria-label="Buscar"
        aria-describedby="search-help"
        aria-required="true"
        aria-invalid="false"
      />
    </div>
  );
}
```

### Reduced Motion

```javascript
import { useMotion } from './design-system';

function MyComponent() {
  const { shouldAnimate } = useMotion();
  
  const animationStyle = shouldAnimate() ? {
    animation: 'fadeIn 200ms ease-out',
  } : {
    animation: 'none',
  };
  
  return (
    <div style={animationStyle}>
      Conteúdo animado
    </div>
  );
}
```

## 🎬 Motion Design

### Micro-interações

```javascript
import { useMotion, microInteractions } from './design-system';

function MyComponent() {
  const { getMotionDuration, getMotionTiming, shouldAnimate } = useMotion();
  
  const buttonStyle = {
    transition: shouldAnimate() 
      ? `all ${getMotionDuration('fast')} ${getMotionTiming('ease')}`
      : 'none',
    transform: 'translateY(0)',
  };
  
  const handleHover = () => {
    if (shouldAnimate()) {
      buttonStyle.transform = 'translateY(-1px)';
    }
  };
  
  return (
    <button
      style={buttonStyle}
      onMouseEnter={handleHover}
      onMouseLeave={() => { buttonStyle.transform = 'translateY(0)'; }}
    >
      Botão com micro-interação
    </button>
  );
}
```

### Animações

```javascript
import { motionGuidelines } from './design-system';

function MyComponent() {
  const { keyframes } = motionGuidelines;
  
  return (
    <div>
      {/* Spin animation */}
      <div style={{ animation: 'spin 1s linear infinite' }}>
        ⚙️
      </div>
      
      {/* Pulse animation */}
      <div style={{ animation: 'pulse 2s ease-in-out infinite' }}>
        🔔
      </div>
      
      {/* Bounce animation */}
      <div style={{ animation: 'bounce 1s ease-in-out infinite' }}>
        🏀
      </div>
      
      {/* Shake animation */}
      <div style={{ animation: 'shake 400ms ease-in-out' }}>
        ⚠️
      </div>
    </div>
  );
}
```

## ⚙️ Configuração via Admin

### Painel de Configuração

```javascript
import { DesignSystemConfigWithProviders } from './design-system';

function AdminPage() {
  return (
    <div>
      <h1>Configuração do Design System</h1>
      <DesignSystemConfigWithProviders />
    </div>
  );
}
```

### Exportar/Importar Configuração

```javascript
import { useThemeConfig } from './design-system';

function ConfigManager() {
  const { exportTheme, importTheme, validateTheme } = useThemeConfig();
  
  const handleExport = () => {
    const config = exportTheme();
    navigator.clipboard.writeText(config);
    console.log('Configuração exportada!');
  };
  
  const handleImport = (configString) => {
    const validation = validateTheme(JSON.parse(configString));
    if (validation.valid) {
      importTheme(configString);
      console.log('Configuração importada!');
    } else {
      console.error('Erro:', validation.errors);
    }
  };
  
  return (
    <div>
      <button onClick={handleExport}>Exportar</button>
      <input 
        type="text" 
        placeholder="Cole a configuração JSON"
        onChange={(e) => handleImport(e.target.value)}
      />
    </div>
  );
}
```

## 📚 Exemplos de Uso

### Exemplo 1: Formulário Completo

```javascript
import { 
  Card, 
  Input, 
  Button, 
  Loading, 
  ToastProvider, 
  useToast 
} from './design-system';

function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const { addToast } = useToast();
  
  const validate = () => {
    const newErrors = {};
    if (!name) newErrors.name = 'Nome é obrigatório';
    if (!email) newErrors.email = 'Email é obrigatório';
    if (!message) newErrors.message = 'Mensagem é obrigatória';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async () => {
    if (!validate()) return;
    
    setLoading(true);
    
    try {
      // Simular envio
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      addToast('Mensagem enviada com sucesso!', {
        type: 'success',
        duration: 3000,
      });
      
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      addToast('Erro ao enviar mensagem!', {
        type: 'error',
        duration: 5000,
        action: {
          label: 'Tentar novamente',
          onClick: handleSubmit,
        },
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card
      variant="elevated"
      size="large"
      title="Entre em Contato"
      description="Preencha o formulário abaixo"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Input
          label="Nome"
          placeholder="Digite seu nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          required
        />
        
        <Input
          label="Email"
          placeholder="Digite seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          required
        />
        
        <Input
          label="Mensagem"
          placeholder="Digite sua mensagem"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          error={errors.message}
          multiline
          rows={4}
          required
        />
        
        {loading ? (
          <Loading
            variant="spinner"
            text="Enviando..."
            color="primary"
          />
        ) : (
          <Button
            variant="primary"
            size="large"
            onClick={handleSubmit}
            fullWidth
          >
            Enviar Mensagem
          </Button>
        )}
      </div>
    </Card>
  );
}

// App principal
function App() {
  return (
    <ToastProvider position="top-right" duration={3000}>
      <ContactForm />
    </ToastProvider>
  );
}
```

### Exemplo 2: Dashboard com Cards

```javascript
import { Card, CardGroup, Loading } from './design-system';

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  
  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setData([
        { title: 'Usuários', value: '1,234', change: '+12%' },
        { title: 'Vendas', value: 'R$ 45.678', change: '+8%' },
        { title: 'Pedidos', value: '892', change: '-2%' },
        { title: 'Receita', value: 'R$ 123.456', change: '+15%' },
      ]);
      setLoading(false);
    }, 2000);
  }, []);
  
  if (loading) {
    return (
      <Loading
        variant="spinner"
        text="Carregando dashboard..."
        fullscreen={false}
      />
    );
  }
  
  return (
    <Card.Group columns={4} gap="medium">
      {data.map((item, index) => (
        <Card
          key={index}
          variant="elevated"
          size="medium"
          title={item.title}
          description={item.value}
        >
          <div style={{ 
            color: item.change.startsWith('+') ? '#22c55e' : '#ef4444',
            fontWeight: 'bold'
          }}>
            {item.change}
          </div>
        </Card>
      ))}
    </Card.Group>
  );
}
```

### Exemplo 3: Modal com Focus Trap

```javascript
import { Card, Button, useFocusTrap } from './design-system';
import { useRef } from 'react';

function Modal({ isOpen, onClose }) {
  const modalRef = useRef(null);
  const { previousFocus } = useFocusTrap(modalRef, isOpen);
  
  if (!isOpen) return null;
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <Card
        ref={modalRef}
        variant="elevated"
        size="medium"
        title="Confirmar Ação"
        description="Tem certeza que deseja realizar esta ação?"
        footer={
          <>
            <Button variant="danger" size="small" onClick={onClose}>
              Cancelar
            </Button>
            <Button variant="primary" size="small" onClick={() => {
              console.log('Confirmado!');
              onClose();
            }}>
              Confirmar
            </Button>
          </>
        }
      >
        Esta ação não pode ser desfeita.
      </Card>
    </div>
  );
}
```

## 📖 Documentação

### Diretrizes de Design

#### Cores
- **Primária**: Azul (#3b82f6) - Ações principais
- **Secundária**: Roxo (#8b5cf6) - Ações secundárias
- **Acento**: Verde (#10b981) - Ações de destaque
- **Sucesso**: Verde (#22c55e) - Confirmações
- **Aviso**: Amarelo (#f59e0b) - Alertas
- **Erro**: Vermelho (#ef4444) - Erros

#### Tipografia
- **H1**: 3rem (48px) - Títulos principais
- **H2**: 2.25rem (36px) - Subtítulos
- **H3**: 1.875rem (30px) - Seções
- **Body**: 1.125rem (18px) - Texto principal
- **Small**: 0.875rem (14px) - Texto secundário

#### Espaçamento
- **Base**: 8px
- **Escala**: 0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128, 160, 192, 256, 384

#### Motion
- **Durações**: 75ms, 150ms, 200ms, 300ms, 500ms, 700ms
- **Easings**: ease, ease-in, ease-out, ease-in-out, linear
- **Intensidades**: low, medium, high

### Acessibilidade (WCAG 2.2 AA+)

#### Requisitos
1. **Contraste**: 4.5:1 para texto normal, 3:1 para texto grande
2. **Foco visível**: Indicadores de foco claros e visíveis
3. **Navegação por teclado**: Todos os elementos interativos acessíveis
4. **Skip links**: Links para pular para conteúdo principal
5. **ARIA labels**: Labels descritivos para todos os elementos
6. **Redução de movimento**: Respeitar preferência do usuário
7. **Alto contraste**: Suporte a modo de alto contraste

#### Testes de Acessibilidade
```javascript
// Teste de contraste
const contrast = getContrastColor('#ffffff'); // '#18181b'

// Teste de foco
const focusStyles = getFocusStyles();

// Teste de skip links
const skipLinkStyles = getSkipLinkStyles();

// Teste de redução de motion
const { reducedMotion } = useMotionPreferences();
```

### Performance

#### Otimizações
1. **Hardware acceleration**: Usar transform e opacity
2. **Lazy loading**: Carregar componentes sob demanda
3. **Memoização**: Evitar re-renders desnecessários
4. **Debounce**: Para eventos de input
5. **Throttle**: Para eventos de scroll

#### Métricas
- **FPS**: 60fps em todas as animações
- **TTI**: < 3s para interatividade
- **CLS**: < 0.1 para estabilidade visual
- **FID**: < 100ms para primeira interação

## 🧪 Testes

### Testes Unitários

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button, Input, Card } from './design-system';

describe('Design System Components', () => {
  test('Button renders correctly', () => {
    render(<Button variant="primary">Clique</Button>);
    expect(screen.getByText('Clique')).toBeInTheDocument();
  });
  
  test('Input handles change', () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test' } });
    expect(handleChange).toHaveBeenCalled();
  });
  
  test('Card renders with title', () => {
    render(<Card title="Test Title">Content</Card>);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });
});
```

### Testes de Acessibilidade

```javascript
import { axe } from 'jest-axe';

describe('Accessibility', () => {
  test('Button has proper ARIA attributes', async () => {
    const { container } = render(
      <Button ariaLabel="Close button">X</Button>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  test('Input has proper labels', async () => {
    const { container } = render(
      <Input label="Email" ariaRequired={true} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### Testes de Performance

```javascript
import { performance } from 'perf_hooks';

describe('Performance', () => {
  test('Button renders in < 16ms', () => {
    const start = performance.now();
    render(<Button>Test</Button>);
    const end = performance.now();
    expect(end - start).toBeLessThan(16);
  });
  
  test('Animation runs at 60fps', () => {
    const frameTimes = [];
    let frameCount = 0;
    
    const measureFrame = () => {
      frameCount++;
      if (frameCount < 60) {
        requestAnimationFrame(measureFrame);
      } else {
        const avgFrameTime = frameTimes.reduce((a, b) => a + b) / frameTimes.length;
        expect(avgFrameTime).toBeLessThan(16.67); // 60fps
      }
    };
    
    requestAnimationFrame(measureFrame);
  });
});
```

## 🤝 Contribuição

### Guia de Contribuição

1. **Fork** o repositório
2. **Clone** seu fork
3. **Crie** uma branch: `git checkout -b feature/nova-feature`
4. **Faça** suas alterações
5. **Commit**: `git commit -m 'Adiciona nova feature'`
6. **Push**: `git push origin feature/nova-feature`
7. **Crie** um Pull Request

### Padrões de Código

- **Componentes**: Usar TypeScript/PropTypes
- **Estilos**: Usar tokens do design system
- **Acessibilidade**: Incluir ARIA labels e testes
- **Documentação**: Atualizar README e comentários
- **Testes**: Cobertura mínima de 80%

### Checklist de Revisão

- [ ] Componente segue padrões do design system
- [ ] Acessibilidade WCAG 2.2 AA+ implementada
- [ ] Testes unitários e de acessibilidade
- [ ] Documentação atualizada
- [ ] Performance otimizada
- [ ] Dark/Light mode suportado
- [ ] Mobile-first responsive
- [ ] Micro-interações sutis

## 📄 Licença

MIT License - Copyright (c) 2026 Neuro Team

## 📞 Suporte

- **Documentação**: `/design-system/README.md`
- **Exemplos**: `/design-system/examples/`
- **Testes**: `/design-system/__tests__/`
- **Issues**: GitHub Issues

---

**Neuro Design System** - Construído com ❤️ para desenvolvedores e usuários
