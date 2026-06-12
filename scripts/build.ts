import { cpSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { build } from "vike/api";

// `vike build` (CLI) force-exits right after prerendering (forceExit is true for
// any CLI run), killing the process before vite-plugin-vercel's `buildApp` hook
// emits `.vercel/output/` — so Vercel deploys failed with an empty Build Output.
// The `vike/api` path skips that force-exit; the explicit exit(0) replaces it,
// since prerendering leaves live handles (pino worker, SQLite) that would
// otherwise hang the process.
await build();

// Ship the HyperDown SQLite metadata DBs inside each serverless function: the
// lambda filesystem is the `.func` directory (cwd = /var/task), and the engine's
// SSR client probes `<cwd>/metadata/<name>.db` in production. vite-plugin-vercel
// only traces statically-imported assets, so the `.db` files (resolved via fs at
// runtime) must be copied in explicitly.
const output = ".vercel/output";
const metadataDir = join(output, "metadata");
const functionsDir = join(output, "functions");
if (existsSync(metadataDir) && existsSync(functionsDir)) {
  for (const fn of readdirSync(functionsDir).filter((dir) => dir.endsWith(".func"))) {
    cpSync(metadataDir, join(functionsDir, fn, "metadata"), { recursive: true });
  }
}

process.exit(0);
