# ---- Build stage ----
FROM node:18-bookworm-slim AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build -- --configuration production

# ---- Serve stage ----
FROM nginx:1.27-alpine

COPY --from=build /app/dist/bkpwebseite /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
