import vikeReact from "vike-react/config";

import type { Config } from "vike/types";

// Global Vike configuration inherited by every page unless overridden
// (https://vike.dev/config). Per-route titles/descriptions live in each page's
// +config.ts / +title.ts / +Head.tsx. Per-locale `<html lang>` lives in +lang.ts
// (Vike forbids runtime functions in +config.ts).
const config: Config = {
  // Default document head; route-level files override these.
  title: "Zaú Júlio",
  description: "Full Stack Developer | Tech Lead | Systems Engineer",

  extends: [vikeReact],

  // Prerender every page to static HTML (SSG); the Hono server adds live search.
  // MDX bodies render inline into the pre-rendered HTML because the generated
  // `modules.ts` uses an eager glob (no Suspense fallback) — see HyperDown codegen.
  // `partial: true` keeps the production server entry (`dist/server/index.mjs`)
  // in the build for hybrid SSG + SSR — without it a fully-prerendered build is
  // emitted as pure static and the server (live `+data` search) is dropped.
  prerender: { partial: true },

  // Expose the URL-derived locale (+ its canonical/display tags and the
  // locale-prefixed pathname, all set by +onBeforeRoute) to the browser so
  // <Link>, the language switcher, date formatting, and useSearchParamsNav can
  // build locale-aware output without recomputing it per component.
  passToClient: ["locale", "canonical", "displayLocale", "urlPathnameLocalized"],
};

export default config;
