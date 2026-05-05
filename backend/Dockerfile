ARG NODE_IMAGE=node:20-alpine

FROM ${NODE_IMAGE} AS deps
WORKDIR /app
RUN command -v npm >/dev/null 2>&1 || apk add --no-cache nodejs npm
COPY package.json package-lock.json ./
RUN npm ci

FROM ${NODE_IMAGE} AS builder
WORKDIR /app
RUN command -v npm >/dev/null 2>&1 || apk add --no-cache nodejs npm
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run prisma:generate && npm run build

FROM ${NODE_IMAGE} AS runner
ENV NODE_ENV=production
WORKDIR /app
RUN command -v node >/dev/null 2>&1 || apk add --no-cache nodejs npm
RUN addgroup -S app && adduser -S app -G app
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
USER app
EXPOSE 3001
CMD ["node", "dist/main.js"]
