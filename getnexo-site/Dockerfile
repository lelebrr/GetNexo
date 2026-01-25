# Dockerfile para o frontend Astro
FROM node:20-alpine

WORKDIR /app

# Copiar arquivos de configuração
COPY package*.json ./
COPY astro.config.mjs ./
COPY tsconfig.json ./

# Instalar dependências
RUN npm install

# Copiar código fonte
COPY src ./src
COPY public ./public
COPY . .

# Build da aplicação
RUN npm run build

# Instalar nginx
RUN apk add --no-cache nginx

# Criar diretório para nginx
RUN mkdir -p /run/nginx

# Criar configuração do nginx
RUN echo 'server {\
    listen 4321;\
    include /etc/nginx/mime.types;\
    default_type application/octet-stream;\
    root /app/dist;\
    index index.html;\
    \
    # Headers de segurança HSTS (HTTP Strict Transport Security)\
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;\
    \
    # Headers para controlar Cloudflare\
    add_header Cache-Control "no-transform";\
    add_header CF-RAY "disable-rocket-loader";\
    add_header X-Frame-Options "SAMEORIGIN" always;\
    \
    # Configuração para SPA (Single Page Application)\
    location / {\
    try_files $uri $uri/ /index.html;\
    add_header Cache-Control "no-cache, no-store, must-revalidate";\
    add_header Pragma "no-cache";\
    add_header Expires "0";\
    }\
    \
    # Configuração para arquivos estáticos\
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|json|map|glb)$ {\
    expires 1y;\
    add_header Cache-Control "public, immutable, no-transform";\
    add_header X-Content-Type-Options "nosniff";\
    access_log off;\
    }\
    \
    # Configuração específica para JavaScript\
    location ~* \.js$ {\
    expires 1y;\
    add_header Cache-Control "public, immutable, no-transform";\
    add_header Content-Type application/javascript;\
    add_header X-Content-Type-Options "nosniff";\
    access_log off;\
    }\
    \
    # Configuração específica para CSS\
    location ~* \.css$ {\
    expires 1y;\
    add_header Cache-Control "public, immutable, no-transform";\
    add_header Content-Type text/css;\
    add_header X-Content-Type-Options "nosniff";\
    access_log off;\
    }\
    }' > /etc/nginx/http.d/default.conf

# Ajustar permissões após build - será executado após o COPY . .
# RUN chmod -R 755 /app/dist && chown -R nginx:nginx /app/dist

# Expor porta
EXPOSE 4321

# Comando para iniciar o servidor SSR
CMD ["node", "./dist/server/entry.mjs"]
