# Dockerfile para o backend Node.js
# FROM node:20-alpine
FROM getnexo/backend:latest

WORKDIR /app

# Copiar arquivos de configuração
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar código fonte
COPY . .

# Criar diretório para uploads
RUN mkdir -p uploads

# Expor porta
EXPOSE 3006

# Comando para iniciar
CMD ["node", "server.js"]
