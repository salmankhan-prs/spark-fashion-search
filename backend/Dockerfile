# syntax=docker/dockerfile:1

# ══════════════════════════════════════════════════════════════════════════════
# Stage 1: Install dependencies
# ══════════════════════════════════════════════════════════════════════════════
FROM oven/bun:1.1.38-alpine AS deps

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# ══════════════════════════════════════════════════════════════════════════════
# Stage 2: Build
# ══════════════════════════════════════════════════════════════════════════════
FROM oven/bun:1.1.38-alpine AS build

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun build src/index.ts --outdir=dist --target=bun

# ══════════════════════════════════════════════════════════════════════════════
# Stage 3: Production
# ══════════════════════════════════════════════════════════════════════════════
FROM oven/bun:1.1.38-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Create non-root user for security
RUN addgroup --system --gid 1001 spark && \
    adduser --system --uid 1001 spark

# Copy production dependencies and built files
COPY --from=deps --chown=spark:spark /app/node_modules ./node_modules
COPY --from=build --chown=spark:spark /app/dist ./dist
COPY --from=build --chown=spark:spark /app/package.json ./

# Copy drizzle migrations if needed
COPY --from=build --chown=spark:spark /app/drizzle ./drizzle

USER spark

# Fly.io uses PORT env variable
ENV PORT=8080
EXPOSE 8080

CMD ["bun", "run", "dist/index.js"]
