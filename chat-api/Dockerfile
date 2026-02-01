# Dockerfile para o backend Node.js
# Use nginx:alpine to bypass network issues with node:20-alpine
FROM nginx:alpine

# Install Node.js, npm and build tools manually
RUN apk add --no-cache nodejs npm python3 make g++ gcc

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
