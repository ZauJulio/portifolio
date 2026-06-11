# Vike (Hono) SSR image for the portfolio.
# Build:  docker build -t portifolio .    or    docker compose up --build

# ── Stage 1: Install dependencies and build ──────────────────
FROM oven/bun:1-alpine AS builder

WORKDIR /app

# Manifests first for better layer caching.
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# The Vike build emits a hybrid output: prerendered HTML (SSG) in dist/client,
# the SSR production server in dist/server, and the content SQLite DBs in
# dist/metadata.
COPY . .
RUN bun run build

# ── Stage 2: Run the Vike (Hono) SSR server ──────────────────
FROM oven/bun:1-alpine AS runner

ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /app

# The SSR server imports dependencies from node_modules and reads the
# prerendered pages + SQLite DBs from dist/ at request time.
COPY --from=builder /app ./

EXPOSE 3000

# Serves prerendered pages (SSG), runs `+data` loaders for live search (SSR),
# and ships the client bundle for hydration (CSR). Reads dist/metadata/*.db.
CMD ["bun", "dist/server/index.mjs"]
