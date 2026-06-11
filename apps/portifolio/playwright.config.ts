import { defineConfig, devices } from "@playwright/test";

// Playwright config: build the app, then run e2e against the production server.
//
// The app is hybrid: the article/recipe listings are SSR (`prerender: false`,
// live `+data` full-text search) while everything else (detail `@slug`, home,
// static pages) is prerendered (SSG). The SSR listings keep Vike's Hono
// production entry (`dist/server/index.mjs`, run by the `start` script) in the
// build, so the suite exercises SSG, live-search SSR and client hydration together.
const PORT = Number(process.env.PORT ?? 4173);
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  // One retry locally (two in CI): the single SSR server under parallel workers
  // has transient timing jitter. (The SSR cold-init race is fixed at the source
  // in HyperDown's SSR client, and the hash-scroll spec now runs under reduced
  // motion for an instant settle, so this retry is only a safety net for
  // incidental contention.)
  retries: process.env.CI ? 2 : 1,
  reporter: "list",
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    // Build first (no-op when cached by turbo), then run the Hono production server.
    command: "bun run build && bun run start",
    env: { PORT: String(PORT) },
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
