# Bot WhatsApp com Geração de Imagens IA

Bot inteligente que responde perguntas sobre produtos. Se o produto não estiver no estoque, gera imagem com IA e dados falsos automaticamente.

## Funcionalidades

- ✅ Verifica produtos reais no estoque
- 🤖 Gera imagens com IA (Puter.js + fallbacks)
- 📊 Cria dados falsos (preço, estoque, descrição)
- 📱 Envia fotos no WhatsApp

## Instalação

1. Instale as dependências:
```bash
npm install
```

2. Configure a chave da Hugging Face (fallback):
   - Crie conta em [huggingface.co](https://huggingface.co)
   - Vá em Settings > Access Tokens
   - Copie a token e coloque em `.env`:
```bash
HF_KEY=hf_sua_chave_aqui
```

## Como rodar

```bash
npm start
```

Escaneie o QR code no terminal com seu WhatsApp.

## Exemplo de conversa

**Cliente:** Ei, tem uma lata de cerveja?

**Bot:** Aguarda 5s... tô criando pra você 😎

*[Envia foto gerada]*

**Bot:** Aqui ó: lata de cerveja por R$ 5,99. Estoque: 8 unidades. Fecha?

## APIs de Imagem

1. **Puter.js** (recomendado): Gratuito, ilimitado, alta qualidade
2. **Pixazo AI**: Fallback gratuito
3. **Hugging Face**: Último recurso (precisa chave)

## Produtos Reais

O bot tem 25 produtos reais no estoque. Para outros, gera com IA.