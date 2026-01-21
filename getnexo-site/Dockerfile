FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 4321

ENV HOST=0.0.0.0
ENV PORT=4321
CMD ["npm", "run", "start"]
