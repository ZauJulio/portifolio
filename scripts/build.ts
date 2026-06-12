import { build } from "vike/api";

// `vike build` (CLI) force-exits right after prerendering (forceExit is true for
// any CLI run), killing the process before vite-plugin-vercel's `buildApp` hook
// emits `.vercel/output/` — so Vercel deploys failed with an empty Build Output.
// The `vike/api` path skips that force-exit; the explicit exit(0) replaces it,
// since prerendering leaves live handles (pino worker, SQLite) that would
// otherwise hang the process.
await build();
process.exit(0);
