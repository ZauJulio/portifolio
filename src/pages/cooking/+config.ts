import type { Config } from "vike/types";

export default {
  title: "Zaú Júlio - Cooking",

  // SSR (not prerendered): the `+data` loader reads `?q`/`?cuisine`/`?page`/`?sort`
  // from the URL and runs on every request under the Hono server, so full-text
  // search is live. Keeping ≥1 route `prerender: false` is also what makes Vike
  // emit the production server entry (`dist/server/index.mjs`) — `partial: true`
  // drops it when every route is prerendered. SSR still returns full HTML on
  // request, so the listing stays crawlable.
  prerender: false,
} satisfies Config;
