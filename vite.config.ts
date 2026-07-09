import { fileURLToPath } from "node:url";

import {
  hyperdownMdxPlugin,
  hyperdownPlugin,
  hyperdownSitemapPlugin,
  remarkHeadingBadges,
} from "@indago/hyper-down/plugins";
import { hyperjsonSitemapPlugin, hyperjsonValidationPlugin } from "@indago/hyper-json/plugins";
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

// Enable Vercel output only when running in Vercel.
const isVercel = Boolean(process.env.VERCEL);

export default defineConfig(({ mode }) => ({
  base: "/",
  // App code in src/, static files in public/, JSON/MDX content in ./content.
  publicDir: "public",
  resolve: {
    alias: {
      "@": r("./src"),
      "@content": r("./content"),
      "@hyper-down": r("./.hyper-down"),
      "@hyper-json": r("./.hyper-json"),
    },
    // Keep a single React instance (important when linked packages are used).
    // The `@indago/*` packages are symlinked to the indago workspace, which has
    // its own physically-distinct `react` install; deduping every React entry
    // point (incl. jsx-runtime) collapses them to this app's single copy —
    // otherwise a lib component (e.g. MdxRender) intermittently loads the second
    // copy and crashes with "more than one copy of React" / null dispatcher.
    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "react-dom/client",
      "react-dom/server",
    ],
  },
  plugins: [
    // Must run before Vike/React.
    hyperdownMdxPlugin({
      // remarkHeadingBadges strips badge markers before anchors are slugged.
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
    // Order matters: HyperDown writes base URLs, HyperJson appends JSON URLs.
    hyperdownSitemapPlugin(),
    hyperjsonValidationPlugin(),
    hyperjsonSitemapPlugin(),
    ...(isVercel
      ? [
          vercel({
            // Keep literal .html URLs (for the Search Console verification file).
            cleanUrls: false,
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
    // Keep HyperDown bundled for virtual module transforms; keep SQLite builtins external.
    external: ["pino", "pino-pretty", "bun:sqlite", "node:sqlite"],
    noExternal: ["tw-animate-css", "@indago/hyper-down"],
  },
  environments: {
    // Mirror SSR bundling rules for Vercel's dedicated build environment.
    vercel_node: {
      resolve: {
        external: ["pino", "pino-pretty", "bun:sqlite", "node:sqlite"],
        noExternal: ["tw-animate-css", "@indago/hyper-down"],
      },
    },
  },
  optimizeDeps: {
    exclude: ["pino-pretty", "pino-abstract-transport", "sonic-boom", "split2"],
    // Force pre-bundling for runtime-loaded Mermaid modules. React entry points
    // + the client-facing `@indago/hyper-down` browser components are force-
    // included so they are pre-bundled against the SAME shared React copy.
    //
    // Previously `@indago/hyper-down` sat in `exclude` (to keep its SSR-only
    // virtual-module transforms out of the optimizer): excluded deps are served
    // as raw source, so its bare `import "react"` / `"react/jsx-runtime"` was
    // NOT rewritten to the optimized `deps/react.js` the app code uses — two
    // React instances on the client → intermittent "more than one copy of
    // React" / null-dispatcher hook crash on client-side nav to any page that
    // renders a lib component (MdxRender), gone on F5. Including it collapses
    // both onto one React. SSR bundling is governed separately by `ssr.*`.
    include: [
      "mermaid",
      "react",
      "react-dom",
      "react-dom/client",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@indago/hyper-down",
    ],
  },
  build: {
    minify: mode === "production" ? "oxc" : false,
    chunkSizeWarningLimit: 3000,
    // Keep content databases as emitted assets for SSR.
    assetsInlineLimit: (filePath: string) => (filePath.endsWith(".db") ? false : undefined),
    // Vite 8 uses rolldownOptions.
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            // Isolate the preload helper from heavy lazy vendors (Mermaid).
            { name: "vite-preload", test: "preload-helper", priority: 100, minSize: 0 },
            { name: "mermaid-vendor", test: "mermaid", priority: 10 },
            { name: "markdown-math", test: "katex", priority: 10 },
          ],
        },
      },
    },
  },
}));
