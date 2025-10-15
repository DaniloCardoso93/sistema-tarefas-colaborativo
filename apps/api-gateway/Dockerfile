# Estágio de Build
FROM node:20-slim AS builder
WORKDIR /app
RUN corepack enable
COPY . .
RUN yarn install
RUN yarn turbo run build --filter=api-gateway

# Estágio de Produção
FROM node:20-slim
WORKDIR /app

COPY --from=builder /app/apps/api-gateway/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api-gateway/package.json ./package.json

EXPOSE 3001
CMD ["node", "dist/main"]