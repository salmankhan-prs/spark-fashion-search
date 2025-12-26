FROM oven/bun:1.2.4-slim AS base
WORKDIR /app

FROM base AS prod-deps
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

FROM base AS build
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM oven/bun:1.2.4-alpine AS runner
WORKDIR /app
COPY --from=prod-deps --chown=bun:bun /app/node_modules ./node_modules
COPY --from=build --chown=bun:bun /app/dist ./dist
COPY --from=build --chown=bun:bun /app/package.json ./package.json
USER bun
EXPOSE 8080
CMD ["bun", "run", "dist/index.js"]
