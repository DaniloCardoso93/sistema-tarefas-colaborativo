# Estágio de Build
FROM node:20-slim AS builder
WORKDIR /app
RUN corepack enable
COPY . .
RUN yarn install
# BUILD APENAS o 'api-gateway'
RUN yarn turbo run build --filter=api-gateway

# Estágio de Produção
FROM node:20-slim
WORKDIR /app
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.pnp.cjs ./ .pnp.cjs
COPY --from=builder /app/.yarn/releases ./ ./.yarn/releases
COPY --from=builder /app/apps/api-gateway/dist ./dist
RUN yarn install --production
EXPOSE 3001
CMD ["node", "dist/main"]