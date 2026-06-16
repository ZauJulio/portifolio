import { cpSync, existsSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";

import { build } from "vike/api";

// `vike build` (CLI) force-exits right after prerendering (forceExit is true for
// any CLI run), killing the process before vite-plugin-vercel's `buildApp` hook
// emits `.vercel/output/` — so Vercel deploys failed with an empty Build Output.
// The `vike/api` path skips that force-exit; the explicit exit(0) replaces it,
// since prerendering leaves live handles (pino worker, SQLite) that would
// otherwise hang the process.
await build();

// Reconcile the served sitemap with the freshly generated one. The HyperDown
// sitemap plugin regenerates `public/sitemap.xml` (draft-aware) in `closeBundle`,
// but Vite copies `public/` into the client output at the START of the client
// build — before `closeBundle` runs. So the emitted `dist/client/sitemap.xml`
// (and the Vercel static mirror) is one build stale and can still list a page
// that was just flipped to `draft: true`. Overwrite the copies with the fresh
// one now that the build (and its closeBundle) has completed.
const freshSitemap = "public/sitemap.xml";
if (existsSync(freshSitemap)) {
  for (const dest of ["dist/client/sitemap.xml", ".vercel/output/static/sitemap.xml"]) {
    if (existsSync(dirname(dest))) cpSync(freshSitemap, dest);
  }
}

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
