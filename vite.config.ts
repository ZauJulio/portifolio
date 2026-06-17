import { fileURLToPath } from "node:url";

import {
  hyperdownMdxPlugin,
  hyperdownPlugin,
  hyperdownSitemapPlugin,
  remarkHeadingBadges,
} from "@indago/hyper-down/plugins";
import { hyperjsonValidationPlugin } from "@indago/hyper-json/plugins";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { common } from "lowlight";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { visualizer } from "rollup-plugin-visualizer";
import vike from "vike/plugin";
import { defineConfig } from "vite";
import { vercel } from "vite-plugin-vercel/vite";

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

// The Vercel plugin rewrites the build into `.vercel/output/`, which suppresses
// vike-server's standalone `dist/server/` entry. Only enable it on Vercel (which
// sets `VERCEL=1`); locally and in Docker, a plain build yields a runnable SSR
// server. Set `VERCEL=1` to force the Vercel output anywhere.
const isVercel = Boolean(process.env.VERCEL);

export default defineConfig(({ mode }) => ({
  base: "/",
  // Code lives in src/; static assets in the app-root `public/` (Vite default)
  // and the content collections in `./content` (imported via the `@content` alias).
  publicDir: "public",
  resolve: {
    alias: {
      "@": r("./src"),
      "@content": r("./content"),
      "@hyper-down": r("./.hyper-down"),
      "@hyper-json": r("./.hyper-json"),
    },
  },
  plugins: [
    // MUST run before Vike/React so *.mdx?raw bypass + MDX compile happen first.
    hyperdownMdxPlugin({
      // remarkHeadingBadges strips `#[label/#color]` tutorial badges from headings
      // (surfaced as sidebar pills) before rehypeSlug computes the anchor.
      remarkPlugins: [remarkMath, remarkFrontmatter, remarkGfm, remarkHeadingBadges],
      rehypePlugins: [
        rehypeSlug,
        [rehypeKatex, { output: "html" }],
        [rehypeHighlight, { languages: common }],
      ],
    }),
    vike(),
    react(),
    tailwindcss(),
    hyperdownPlugin(),
    hyperdownSitemapPlugin(),
    hyperjsonValidationPlugin(),
    ...(isVercel
      ? [
          vercel({
            // Keep `.html` URLs literal. Vercel's default cleanUrls 308-redirects
            // `/x.html` → `/x`, which breaks the Google Search Console file
            // (`public/google*.html`): Google fetches the exact `.html` URL and
            // the redirect lands on the SSR 404. Every app page is directory-index
            // (`<route>/index.html`), so cleanUrls is otherwise a no-op here.
            cleanUrls: false,
            // Build Output API serves everything with `max-age=0, must-revalidate`
            // by default. Hashed bundles are immutable by construction; public/
            // images get a day with a week of stale-while-revalidate.
            headers: [
              {
                source: "/assets/(.*)",
                headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
              },
              {
                source: "/(.*)\\.(avif|webp|png|jpg|jpeg|svg|ico|woff2)",
                headers: [
                  {
                    key: "Cache-Control",
                    value: "public, max-age=86400, stale-while-revalidate=604800",
                  },
                ],
              },
            ],
          }),
        ]
      : []),
    visualizer({
      filename: "dist/stats.html",
      gzipSize: true,
      brotliSize: true,
      template: "treemap",
    }),
  ],
  ssr: {
    // Bundle @indago/hyper-down server-side so its virtual:* imports are transformed
    // by the hyperdown plugin. Keep SQLite builtins external (lazy SSR search path).
    external: ["pino", "pino-pretty", "bun:sqlite", "node:sqlite"],
    noExternal: ["tw-animate-css", "@indago/hyper-down"],
  },
  environments: {
    // `ssr:` above only configures the "ssr" environment. vite-plugin-vercel builds
    // the serverless function in its own "vercel_node" environment, which otherwise
    // externalizes @indago/hyper-down — its virtual:* imports then reach the final
    // plugin-less bundling step unresolved and crash the lambda at request time.
    vercel_node: {
      resolve: {
        external: ["pino", "pino-pretty", "bun:sqlite", "node:sqlite"],
        noExternal: ["tw-animate-css", "@indago/hyper-down"],
      },
    },
  },
  optimizeDeps: {
    exclude: [
      "pino-pretty",
      "pino-abstract-transport",
      "sonic-boom",
      "split2",
      "@indago/hyper-down",
    ],
  },
  build: {
    minify: mode === "production" ? "oxc" : false,
    chunkSizeWarningLimit: 3000,
    // Never inline the content databases — keep them real assets for SSR loaders.
    assetsInlineLimit: (filePath: string) => (filePath.endsWith(".db") ? false : undefined),
    // rollupOptions is deprecated in Vite 8 — use rolldownOptions.
    // Note: Vike overrides chunkFileNames to always produce chunk-[hash].js, so
    // manualChunks names don't appear in filenames. They still control module
    // grouping, keeping mermaid's 75+ sub-modules in one stable lazy chunk.
    rolldownOptions: {
      output: {
        // rolldown-native chunking (manualChunks couldn't relocate the virtual
        // preload helper — rolldown merged the tiny chunk back). `priority` makes
        // the helper win over the mermaid group, and `minSize: 0` stops rolldown
        // from folding it back into a vendor chunk.
        advancedChunks: {
          groups: [
            // Vite's dynamic-import preload helper. Left in the mermaid vendor
            // chunk, every page that does a dynamic import (the home page
            // included) statically imports it — pulling all ~780 KiB of mermaid
            // onto the initial load path. Isolate it into its own ~1 KiB chunk.
            { name: "vite-preload", test: "preload-helper", priority: 100, minSize: 0 },
            { name: "mermaid-vendor", test: "mermaid", priority: 10 },
            { name: "markdown-math", test: "katex", priority: 10 },
          ],
        },
      },
    },
  },
}));
