# Vike (Hono) SSR image for @repo/portifolio.
#
# IMPORTANT: the build context is the MONOREPO ROOT, not this folder — the image
# needs the root package.json/bun.lock/turbo.json and the packages/* workspaces.
# Build from the repo root:  docker build -f apps/portifolio/Dockerfile .
# or via compose from here:  docker compose up --build  (context is set to ../..)

# ── Stage 1: Install dependencies and build ──────────────────
FROM oven/bun:1-alpine AS builder

WORKDIR /app

# Copy workspace manifests first for better layer caching.
COPY package.json bun.lock turbo.json ./
COPY apps/portifolio/package.json apps/portifolio/
COPY packages/configs/package.json packages/configs/
COPY packages/HyperDown/package.json packages/HyperDown/
COPY packages/HyperJson/package.json packages/HyperJson/
COPY packages/scaffold/package.json packages/scaffold/

RUN bun install --frozen-lockfile

# Copy the rest of the sources and build. Build the two engines first (their dist
# is consumed by the app's Vite plugins), then the Vike app. We invoke each
# package's build directly rather than `turbo run build`, because the Turbo build
# task gates on lint/format (`check`) — a dev/CI concern enforced by the
# pre-commit hook, not something a production image build should run.
#
# The Vike build emits a hybrid output: prerendered HTML (SSG) in
# apps/portifolio/dist/client, the SSR production server in dist/server, and the
# content SQLite DBs in dist/metadata.
COPY . .
RUN cd packages/HyperDown && bun run build \
  && cd ../HyperJson && bun run build \
  && cd ../../apps/portifolio && bun run build

# ── Stage 2: Run the Vike (Hono) SSR server ──────────────────
FROM oven/bun:1-alpine AS runner

ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /app

# Bring the whole built workspace over — the SSR server imports workspace
# packages and dependencies from the hoisted node_modules, and reads the
# prerendered pages + SQLite DBs from apps/portifolio/dist at request time.
COPY --from=builder /app ./

WORKDIR /app/apps/portifolio

EXPOSE 3000

# Serves prerendered pages (SSG), runs `+data` loaders for live search (SSR),
# and ships the client bundle for hydration (CSR). Reads dist/metadata/*.db.
CMD ["bun", "dist/server/index.mjs"]
