FROM nginx:alpine

# Install Node.js and npm
RUN apk add --no-cache nodejs npm python3 make g++ gcc

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY astro.config.mjs ./
COPY tsconfig.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY src ./src
COPY public ./public
COPY . .

# Check if astro is installed (debug step)
RUN npm list astro || true

# Build the application
# We use npx to ensure we find the binary
RUN npx astro build

# Expose port
EXPOSE 4321

# Set host to 0.0.0.0
ENV HOST=0.0.0.0
ENV PORT=4321
ENV NODE_ENV=production

# Start SSR server
CMD ["node", "./dist/server/entry.mjs"]
