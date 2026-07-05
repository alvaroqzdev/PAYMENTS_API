
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

RUN npx prisma generate

EXPOSE ${API_PORT}

CMD ["node", "src/server.js"]