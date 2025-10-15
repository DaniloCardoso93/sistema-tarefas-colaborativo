# Estágio de Build
FROM node:20-slim AS builder
WORKDIR /app
RUN corepack enable
COPY . .
RUN yarn install
RUN yarn turbo run build --filter=tasks-service

# Estágio de Produção
FROM node:20-slim
WORKDIR /app

COPY --from=builder /app/apps/tasks-service/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/tasks-service/package.json ./package.json

EXPOSE 3001
CMD ["node", "dist/main"]