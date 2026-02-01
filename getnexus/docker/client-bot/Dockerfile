FROM node:20-alpine AS base

WORKDIR /app

COPY package.json package-lock.json ./
# If package-lock doesn't exist yet, we can skip it or use npm install
# Ideally we should generate it.
# For now, suppressing errors if lockfile is missing by using install if ci fails
RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["node", "bot.js"]
