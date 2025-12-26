# syntax=docker/dockerfile:1

# ══════════════════════════════════════════════════════════════════════════════
# Stage 1: Dependencies
# ══════════════════════════════════════════════════════════════════════════════
FROM oven/bun:1.1.38-alpine AS deps

WORKDIR /app

# Copy package files
COPY package.json ./
COPY bun.lockb* ./

# Install production dependencies
RUN bun install --production

# ══════════════════════════════════════════════════════════════════════════════
# Stage 2: Build
# ══════════════════════════════════════════════════════════════════════════════
FROM oven/bun:1.1.38-alpine AS build

WORKDIR /app

COPY package.json ./
COPY bun.lockb* ./

# Install all deps (including dev)
RUN bun install

# Copy source
COPY . .

# Build (adjust entry if needed)
RUN bun build src/index.ts --outdir=dist --target=bun

# ══════════════════════════════════════════════════════════════════════════════
# Stage 3: Production Runtime
# ══════════════════════════════════════════════════════════════════════════════
FROM oven/bun:1.1.38-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# Non-root user (Fly best practice)
RUN addgroup -S spark && adduser -S spark -G spark

# Copy runtime files only
COPY --from=deps --chown=spark:spark /app/node_modules ./node_modules
COPY --from=build --chown=spark:spark /app/dist ./dist
COPY --from=build --chown=spark:spark /app/package.json ./

# Optional: drizzle migrations (safe even if missing)
COPY --from=build --chown=spark:spark /app/drizzle ./drizzle || true

USER spark

EXPOSE 8080

CMD ["bun", "dist/index.js"]
