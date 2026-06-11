import type { Config } from "vike/types";

// Detail pages are static (SSG): every recipe slug is enumerated and prerendered
// to HTML, overriding the parent listing's `prerender: false` (SSR).
export default {
  prerender: true,
} satisfies Config;
