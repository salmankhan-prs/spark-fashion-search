# syntax=docker/dockerfile:1

# ══════════════════════════════════════════════════════════════════════════════
# Stage 1: Production Dependencies
# ══════════════════════════════════════════════════════════════════════════════
FROM oven/bun:1.1.38-alpine AS deps

WORKDIR /app

ENV NODE_ENV=production
ENV HUSKY=0

COPY package.json ./
COPY bun.lockb* ./

RUN bun install --production

# ══════════════════════════════════════════════════════════════════════════════
# Stage 2: Build
# ══════════════════════════════════════════════════════════════════════════════
FROM oven/bun:1.1.38-alpine AS build

WORKDIR /app

ENV HUSKY=0

COPY package.json ./
COPY bun.lockb* ./

RUN bun install

COPY . .

RUN bun build src/index.ts --outdir=dist --target=bun

# ══════════════════════════════════════════════════════════════════════════════
# Stage 3: Runtime
# ══════════════════════════════════════════════════════════════════════════════
FROM oven/bun:1.1.38-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# Create non-root user (Fly best practice)
RUN addgroup -S spark && adduser -S spark -G spark

COPY --from=deps --chown=spark:spark /app/node_modules ./node_modules
COPY --from=build --chown=spark:spark /app/dist ./dist
COPY --from=build --chown=spark:spark /app/package.json ./

USER spark

EXPOSE 8080

CMD ["bun", "dist/index.js"]
