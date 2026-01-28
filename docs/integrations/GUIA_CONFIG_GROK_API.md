# 🎯 GUIA: Como Configurar API Key do Grok (xAI)

## 📋 **INSTRUÇÕES PARA PREENCHER A TELA**

### **Campos da Tela "Create API key"**

#### **1. Name** (Nome da API Key)
```
Getnexo
```
✅ **Pronto** - Já preenchido

#### **2. Permissions** (Permissões)
```
☑️ All
```
✅ **Selecionar "All"** - Dá acesso completo às funcionalidades

#### **3. Custom Rate limits** (Limites de Taxa)
```
☑️ Optional
```
✅ **Deixar desmarcado** - Usa limites padrão gratuitos

#### **4. TPM / RPM / QPM** (Tokens/Minuto, Requests/Minuto, Queries/Minuto)
```
Deixar vazio - usar padrão
```
✅ **Não alterar** - Limites gratuitos são suficientes

---

## 🎯 **PASSOS DETALHADOS**

### **1. Acesse a Tela**
- Vá para: https://x.ai/
- Faça login na sua conta
- No menu lateral esquerdo, clique em **"API Keys"**

### **2. Clique "Create API key"**
- Botão azul no topo direito

### **3. Preencha os Campos**
```
Name: Getnexo
Permissions: All (selecionado)
Custom Rate limits: Não marcado
TPM/RPM/QPM: Deixar vazio
```

### **4. Clique "Create API key"**
- Botão azul na parte inferior

### **5. COPIE A CHAVE GERADA**
- A chave aparece em uma modal
- **COMEÇA COM `gk-`**
- **EXEMPLO**: `gk-abcd1234567890...`
- ⚠️ **IMPORTANTE**: Copie imediatamente - não aparece novamente!

---

## 📁 **ONDE COLOCAR A CHAVE**

### **Arquivo: `getnexo-site/.env`**
```env
# === APIs de IA ===
HF_KEY=YOUR_HUGGINGFACE_API_KEY  # ← SUA CHAVE AQUI
GROK_API_KEY=gk-abcd1234567890...  # ← SUA CHAVE AQUI
```

### **Como Criar o Arquivo**
```bash
# No terminal, dentro da pasta getnexo-site
touch .env
# Edite o arquivo e adicione as linhas acima
```

---

## ✅ **TESTAR SE FUNCIONA**

### **1. Reiniciar o Servidor**
```bash
cd getnexo-site
npm run dev
```

### **2. Verificar no Console**
- Abra http://localhost:4321/demo
- Abra o console do navegador (F12)
- Deve aparecer: "Grok API configurada" ou similar

### **3. Testar no Chat**
- Digite algo no demo
- Deve usar Grok em vez do fallback

---

## 💰 **CUSTOS**

- **Gratuito**: Até 1000 tokens/dia
- **Pago**: Acima disso (~$0.01 por 1000 tokens)
- **Para MVP**: Completamente gratuito

---

## 🎯 **RESULTADO**

Após configurar, o sistema terá:
- ✅ Respostas de chat mais inteligentes
- ✅ Melhor compreensão de contexto
- ✅ Respostas mais naturais em português

**🚀 PRONTO PARA USAR GROK NO SEU SISTEMA!**