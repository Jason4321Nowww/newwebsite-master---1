FROM node:18-bookworm-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .

# uploads dir must exist even before a volume is mounted over it
RUN mkdir -p uploads/actions uploads/articles uploads/events uploads/press uploads/products

EXPOSE 5000

CMD ["node", "server.js"]