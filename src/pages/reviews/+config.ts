import type { Config } from "vike/types";

// SSR (not prerendered) — mirrors `articles/+config.ts`: the `+data` loader
// reads `?q`/`?tag`/`?page`/`?sort` live, and keeping one route non-prerendered
// is what makes Vike emit the production server entry.
export default {
  title: "Zaú Júlio - Reviews",
  prerender: false,
} satisfies Config;
