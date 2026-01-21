# Guia de Integração do Design System

Este guia explica como integrar o Design System Neuro em componentes existentes.

## 📋 Índice

- [Integração Básica](#integração-básica)
- [Integração em Componentes React](#integração-em-componentes-react)
- [Integração em Páginas Astro](#integração-em-páginas-astro)
- [Migração de Componentes Existentes](#migração-de-componentes-existentes)
- [Exemplos Práticos](#exemplos-práticos)

## 🚀 Integração Básica

### 1. Importar o Design System

```javascript
// Em componentes React/JSX
import { 
  ThemeProvider, 
  Button, 
  Input, 
  Card,
  Loading,
  ToastProvider,
  useTheme,
  useToast,
  designSystemUtils
} from './design-system';

// Em páginas Astro
import { Button, Card, Input } from '../design-system';
```

### 2. Envolva sua aplicação com os Providers

```javascript
// App.jsx ou Layout principal
import { ThemeProvider, ToastProvider, SkipLinks } from './design-system';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider position="top-right" duration={3000}>
        <SkipLinks />
        <YourApp />
      </ToastProvider>
    </ThemeProvider>
  );
}
```

## 🧩 Integração em Componentes React

### Exemplo 1: Componente de Login

**Antes (sem Design System):**
```javascript
import React, { useState } from 'react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Lógica de login
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Senha</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Carregando...' : 'Entrar'}
      </button>
    </form>
  );
}
```

**Depois (com Design System):**
```javascript
import React, { useState } from 'react';
import { Card, Input, Button, Loading, useToast } from '../design-system';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      addToast('Preencha todos os campos!', { type: 'error' });
      return;
    }

    setLoading(true);

    try {
      // Lógica de login
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      addToast('Login realizado com sucesso!', { type: 'success' });
      setEmail('');
      setPassword('');
    } catch (error) {
      addToast('Erro ao fazer login!', { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      variant="elevated"
      size="medium"
      title="Login"
      description="Faça login para acessar o sistema"
    >
      <form onSubmit={handleSubmit}>
        <Input
          label="Email"
          placeholder="Digite seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
          ariaRequired={true}
          fullWidth
        />

        <Input.Password
          label="Senha"
          placeholder="Digite sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          ariaRequired={true}
          fullWidth
        />

        {loading ? (
          <Loading variant="spinner" text="Autenticando..." />
        ) : (
          <Button
            variant="primary"
            size="large"
            type="submit"
            fullWidth
            ariaLabel="Fazer login"
          >
            Entrar
          </Button>
        )}
      </form>
    </Card>
  );
}
```

### Exemplo 2: Componente de Formulário de Contato

**Antes (sem Design System):**
```javascript
import React, { useState } from 'react';

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Nome é obrigatório';
    if (!formData.email) newErrors.email = 'Email é obrigatório';
    if (!formData.message) newErrors.message = 'Mensagem é obrigatória';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      // Enviar formulário
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Mensagem enviada!');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      alert('Erro ao enviar!');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      <div className="form-group">
        <label>Nome</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className={errors.name ? 'error' : ''}
        />
        {errors.name && <span className="error-text">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          className={errors.email ? 'error' : ''}
        />
        {errors.email && <span className="error-text">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label>Mensagem</label>
        <textarea
          value={formData.message}
          onChange={(e) => handleChange('message', e.target.value)}
          className={errors.message ? 'error' : ''}
          rows={4}
        />
        {errors.message && <span className="error-text">{errors.message}</span>}
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Enviando...' : 'Enviar'}
      </button>
    </form>
  );
}
```

**Depois (com Design System):**
```javascript
import React, { useState } from 'react';
import { Card, Input, Button, Loading, useToast } from '../design-system';

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Nome é obrigatório';
    if (!formData.email) newErrors.email = 'Email é obrigatório';
    if (!formData.message) newErrors.message = 'Mensagem é obrigatória';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      // Enviar formulário
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      addToast('Mensagem enviada com sucesso!', { type: 'success' });
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      addToast('Erro ao enviar mensagem!', { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Card
      variant="elevated"
      size="large"
      title="Entre em Contato"
      description="Preencha o formulário abaixo"
    >
      <form onSubmit={handleSubmit}>
        <Input
          label="Nome Completo"
          placeholder="Digite seu nome"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          error={errors.name}
          required
          ariaRequired={true}
          fullWidth
        />

        <Input
          label="Email"
          placeholder="Digite seu email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          error={errors.email}
          required
          ariaRequired={true}
          fullWidth
        />

        <Input
          label="Mensagem"
          placeholder="Digite sua mensagem"
          value={formData.message}
          onChange={(e) => handleChange('message', e.target.value)}
          error={errors.message}
          multiline
          rows={4}
          required
          ariaRequired={true}
          fullWidth
        />

        {loading ? (
          <Loading variant="spinner" text="Enviando..." />
        ) : (
          <Button
            variant="primary"
            size="large"
            type="submit"
            fullWidth
            ariaLabel="Enviar formulário"
          >
            Enviar Mensagem
          </Button>
        )}
      </form>
    </Card>
  );
}
```

## 🌌 Integração em Páginas Astro

### Exemplo 1: Página de Login

**Antes (sem Design System):**
```astro
---
import Layout from '../layouts/Layout.astro';
---

<Layout title="Login">
  <main>
    <div class="login-container">
      <h1>Login</h1>
      <form class="login-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div class="form-group">
          <label for="password">Senha</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit">Entrar</button>
      </form>
    </div>
  </main>
</Layout>

<style>
  .login-container {
    max-width: 400px;
    margin: 2rem auto;
    padding: 2rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .login-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  label {
    font-weight: 500;
  }

  input {
    padding: 0.75rem;
    border: 1px solid #d4d4d8;
    border-radius: 4px;
    font-size: 1rem;
  }

  button {
    padding: 0.75rem 1.5rem;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 4px;
    font-weight: 600;
    cursor: pointer;
  }

  button:hover {
    background: #2563eb;
  }
</style>
```

**Depois (com Design System):**
```astro
---
import Layout from '../layouts/Layout.astro';
import { Card, Input, Button, Loading } from '../design-system';
---

<Layout title="Login">
  <main>
    <div class="login-container">
      <Card
        variant="elevated"
        size="medium"
        title="Login"
        description="Faça login para acessar o sistema"
      >
        <form class="login-form">
          <Input
            label="Email"
            placeholder="Digite seu email"
            type="email"
            required
            ariaRequired={true}
            fullWidth
          />

          <Input.Password
            label="Senha"
            placeholder="Digite sua senha"
            required
            ariaRequired={true}
            fullWidth
          />

          <Button
            variant="primary"
            size="large"
            type="submit"
            fullWidth
            ariaLabel="Fazer login"
          >
            Entrar
          </Button>
        </form>
      </Card>
    </div>
  </main>
</Layout>

<style>
  .login-container {
    max-width: 400px;
    margin: 2rem auto;
    padding: 1rem;
  }

  .login-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
</style>
```

### Exemplo 2: Página de Dashboard

**Antes (sem Design System):**
```astro
---
import Layout from '../layouts/Layout.astro';
---

<Layout title="Dashboard">
  <main>
    <div class="dashboard">
      <h1>Dashboard</h1>
      <div class="stats-grid">
        <div class="stat-card">
          <h3>Usuários</h3>
          <p class="stat-value">1,234</p>
          <p class="stat-change positive">+12%</p>
        </div>
        <div class="stat-card">
          <h3>Vendas</h3>
          <p class="stat-value">R$ 45.678</p>
          <p class="stat-change positive">+8%</p>
        </div>
        <div class="stat-card">
          <h3>Pedidos</h3>
          <p class="stat-value">892</p>
          <p class="stat-change negative">-2%</p>
        </div>
        <div class="stat-card">
          <h3>Receita</h3>
          <p class="stat-value">R$ 123.456</p>
          <p class="stat-change positive">+15%</p>
        </div>
      </div>
    </div>
  </main>
</Layout>

<style>
  .dashboard {
    padding: 2rem;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    margin-top: 2rem;
  }

  .stat-card {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .stat-card h3 {
    margin: 0 0 0.5rem 0;
    font-size: 0.875rem;
    color: #71717a;
  }

  .stat-value {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;
  }

  .stat-change {
    font-size: 0.875rem;
    margin: 0.25rem 0 0 0;
  }

  .positive {
    color: #22c55e;
  }

  .negative {
    color: #ef4444;
  }
</style>
```

**Depois (com Design System):**
```astro
---
import Layout from '../layouts/Layout.astro';
import { Card, CardGroup } from '../design-system';
---

<Layout title="Dashboard">
  <main>
    <div class="dashboard">
      <h1>Dashboard</h1>
      <CardGroup columns={4} gap="medium">
        <Card
          variant="elevated"
          size="medium"
          title="Usuários"
          description="1,234"
        >
          <p class="stat-change positive">+12%</p>
        </Card>
        <Card
          variant="elevated"
          size="medium"
          title="Vendas"
          description="R$ 45.678"
        >
          <p class="stat-change positive">+8%</p>
        </Card>
        <Card
          variant="elevated"
          size="medium"
          title="Pedidos"
          description="892"
        >
          <p class="stat-change negative">-2%</p>
        </Card>
        <Card
          variant="elevated"
          size="medium"
          title="Receita"
          description="R$ 123.456"
        >
          <p class="stat-change positive">+15%</p>
        </Card>
      </CardGroup>
    </div>
  </main>
</Layout>

<style>
  .dashboard {
    padding: 2rem;
  }

  .stat-change {
    font-size: 0.875rem;
    font-weight: 600;
    margin: 0;
  }

  .positive {
    color: #22c55e;
  }

  .negative {
    color: #ef4444;
  }
</style>
```

## 🔄 Migração de Componentes Existentes

### Passo 1: Identificar componentes para migração

```javascript
// Lista de componentes que podem ser migrados
const componentsToMigrate = [
  'Button',
  'Input',
  'Card',
  'Modal',
  'Toast',
  'Loading',
  'Dropdown',
  'Tabs',
  'Accordion',
  'Tooltip',
];
```

### Passo 2: Criar wrapper de compatibilidade

```javascript
// components/compat/Button.jsx
import React from 'react';
import { Button as DesignButton } from '../design-system';

/**
 * Wrapper de compatibilidade para migração gradual
 * Mantém a mesma API do componente antigo
 */
export const Button = ({ 
  children, 
  variant = 'primary',
  size = 'medium',
  onClick,
  disabled = false,
  loading = false,
  className = '',
  style = {},
  ...props 
}) => {
  // Mapear variantes antigas para novas
  const variantMap = {
    'primary': 'primary',
    'secondary': 'secondary',
    'danger': 'danger',
    'outline': 'outline',
    'ghost': 'ghost',
    'default': 'primary',
  };

  // Mapear tamanhos antigos para novos
  const sizeMap = {
    'small': 'small',
    'medium': 'medium',
    'large': 'large',
    'default': 'medium',
  };

  return (
    <DesignButton
      variant={variantMap[variant] || 'primary'}
      size={sizeMap[size] || 'medium'}
      onClick={onClick}
      disabled={disabled}
      loading={loading}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </DesignButton>
  );
};
```

### Passo 3: Atualizar importações gradualmente

```javascript
// Antes
import { Button } from './components/Button';

// Depois (gradual)
import { Button } from './components/compat/Button';

// Ou diretamente
import { Button } from '../design-system';
```

### Passo 4: Atualizar estilos CSS

```css
/* Antes */
.button-primary {
  background: #3b82f6;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 600;
}

/* Depois (remover, usar tokens do design system) */
/* Os estilos são aplicados automaticamente via componentes */
```

## 📊 Exemplos Práticos

### Exemplo 1: Lista de Tarefas

```javascript
import React, { useState } from 'react';
import { Card, Input, Button, Loading, useToast } from '../design-system';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const addTask = () => {
    if (!newTask.trim()) {
      addToast('Digite uma tarefa!', { type: 'error' });
      return;
    }

    setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
    setNewTask('');
    addToast('Tarefa adicionada!', { type: 'success' });
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
    addToast('Tarefa removida!', { type: 'warning' });
  };

  return (
    <Card
      variant="elevated"
      size="medium"
      title="Lista de Tarefas"
      description="Gerencie suas tarefas diárias"
    >
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <Input
          placeholder="Nova tarefa..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          fullWidth
        />
        <Button variant="primary" size="medium" onClick={addTask}>
          Adicionar
        </Button>
      </div>

      {loading ? (
        <Loading variant="dots" text="Carregando tarefas..." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {tasks.length === 0 ? (
            <div style={{ color: '#71717a', textAlign: 'center', padding: '2rem' }}>
              Nenhuma tarefa ainda. Adicione uma tarefa!
            </div>
          ) : (
            tasks.map(task => (
              <Card
                key={task.id}
                variant="outlined"
                size="small"
                title={task.text}
                description={task.completed ? 'Concluída' : 'Pendente'}
                footer={
                  <>
                    <Button
                      variant={task.completed ? 'success' : 'outline'}
                      size="small"
                      onClick={() => toggleTask(task.id)}
                    >
                      {task.completed ? 'Desmarcar' : 'Concluir'}
                    </Button>
                    <Button
                      variant="danger"
                      size="small"
                      onClick={() => deleteTask(task.id)}
                    >
                      Excluir
                    </Button>
                  </>
                }
              />
            ))
          )}
        </div>
      )}
    </Card>
  );
}
```

### Exemplo 2: Modal de Confirmação

```javascript
import React, { useState } from 'react';
import { Card, Button, useToast } from '../design-system';

function DeleteConfirmation() {
  const [isOpen, setIsOpen] = useState(false);
  const { addToast } = useToast();

  const handleDelete = () => {
    // Lógica de exclusão
    addToast('Item excluído com sucesso!', { type: 'success' });
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <Button variant="danger" onClick={() => setIsOpen(true)}>
        Excluir Item
      </Button>
    );
  }

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
        variant="elevated"
        size="medium"
        title="Confirmar Exclusão"
        description="Tem certeza que deseja excluir este item?"
        footer={
          <>
            <Button variant="outline" size="small" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button variant="danger" size="small" onClick={handleDelete}>
              Excluir
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

### Exemplo 3: Formulário com Validação em Tempo Real

```javascript
import React, { useState } from 'react';
import { Card, Input, Button, useToast } from '../design-system';

function RegistrationForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const { addToast } = useToast();

  const validateField = (field, value) => {
    switch (field) {
      case 'name':
        if (!value) return 'Nome é obrigatório';
        if (value.length < 3) return 'Nome deve ter pelo menos 3 caracteres';
        return '';
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) return 'Email é obrigatório';
        if (!emailRegex.test(value)) return 'Email inválido';
        return '';
      case 'password':
        if (!value) return 'Senha é obrigatória';
        if (value.length < 6) return 'Senha deve ter pelo menos 6 caracteres';
        return '';
      case 'confirmPassword':
        if (!value) return 'Confirme a senha';
        if (value !== formData.password) return 'As senhas não coincidem';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar todos os campos
    const newErrors = {};
    Object.keys(formData).forEach(field => {
      newErrors[field] = validateField(field, formData[field]);
    });
    setErrors(newErrors);

    // Verificar se há erros
    const hasErrors = Object.values(newErrors).some(error => error);
    
    if (!hasErrors) {
      addToast('Cadastro realizado com sucesso!', { type: 'success' });
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
    } else {
      addToast('Corrija os erros no formulário!', { type: 'error' });
    }
  };

  return (
    <Card
      variant="elevated"
      size="medium"
      title="Cadastro"
      description="Crie sua conta"
    >
      <form onSubmit={handleSubmit}>
        <Input
          label="Nome"
          placeholder="Digite seu nome"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          error={errors.name}
          success={!errors.name && formData.name ? 'Nome válido!' : ''}
          required
          ariaRequired={true}
          fullWidth
        />

        <Input
          label="Email"
          placeholder="Digite seu email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          error={errors.email}
          success={!errors.email && formData.email ? 'Email válido!' : ''}
          type="email"
          required
          ariaRequired={true}
          fullWidth
        />

        <Input.Password
          label="Senha"
          placeholder="Digite sua senha"
          value={formData.password}
          onChange={(e) => handleChange('password', e.target.value)}
          error={errors.password}
          success={!errors.password && formData.password ? 'Senha válida!' : ''}
          required
          ariaRequired={true}
          fullWidth
        />

        <Input.Password
          label="Confirmar Senha"
          placeholder="Confirme sua senha"
          value={formData.confirmPassword}
          onChange={(e) => handleChange('confirmPassword', e.target.value)}
          error={errors.confirmPassword}
          success={!errors.confirmPassword && formData.confirmPassword ? 'Senhas coincidem!' : ''}
          required
          ariaRequired={true}
          fullWidth
        />

        <Button
          variant="primary"
          size="large"
          type="submit"
          fullWidth
          ariaLabel="Cadastrar"
        >
          Cadastrar
        </Button>
      </form>
    </Card>
  );
}
```

## 🎯 Dicas de Migração

### 1. Comece com componentes simples
- Button, Input, Card são ótimos pontos de partida
- Evite migrar componentes complexos de uma vez

### 2. Use wrappers de compatibilidade
- Mantenha a API do componente antigo
- Facilita a migração gradual

### 3. Atualize estilos gradualmente
- Remova estilos CSS antigos
- Use tokens do design system

### 4. Teste cada componente
- Teste funcionalidades
- Teste acessibilidade
- Teste responsividade

### 5. Documente as mudanças
- Anote o que foi alterado
- Compartilhe com a equipe

## 📚 Recursos Adicionais

### Tokens de Design Disponíveis
```javascript
import { 
  colors, 
  typography, 
  spacing,
  designSystemUtils 
} from '../design-system';

// Cores
const primaryColor = colors.primary[600];

// Tipografia
const h1Style = typography.scale.mobile.h1;

// Espaçamento
const padding = spacing.space[4];

// Utilitários
const contrastColor = designSystemUtils.getContrastColor('#ffffff');
```

### Hooks de Utilidade
```javascript
import { 
  useTheme, 
  useToast, 
  useMotion, 
  useAccessibility 
} from '../design-system';

// Tema
const { theme, isDarkMode, toggleTheme } = useTheme();

// Toast
const { addToast } = useToast();

// Motion
const { shouldAnimate, getMotionDuration } = useMotion();

// Acessibilidade
const { getFocusStyles, getSkipLinkStyles } = useAccessibility();
```

## 🚀 Próximos Passos

1. **Identifique** os componentes que precisam de migração
2. **Priorize** por ordem de importância
3. **Crie** wrappers de compatibilidade se necessário
4. **Migre** gradualmente, componente por componente
5. **Teste** cada componente migrado
6. **Documente** as mudanças
7. **Compartilhe** com a equipe

---

**Neuro Design System** - Guia de Integração v1.0.0
