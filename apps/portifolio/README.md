# @repo/portifolio

The personal portfolio of Zaú Júlio — a [Vike](https://vike.dev/) SSG + SSR site and the
reference consumer of the [HyperDown](../../packages/HyperDown) and
[HyperJson](../../packages/HyperJson) content engines.

**Live:** [zaujulio.vercel.app](https://zaujulio.vercel.app)

## Stack

- **Vike** (`vike` + `vike-react` + `vike-server` + `@vikejs/hono`) — hybrid SSG + SSR:
  global `prerender: { partial: true }`, listings opt out (`prerender: false`) so full-text
  search is served live by Hono, detail pages are prerendered to static HTML.
- **React 19**, **Tailwind v4**, **i18next** (bilingual: `/` English, `/pt` Portuguese).
- **HyperDown** for Markdown/MDX content (`article`, `recipe`) → SQLite + lazy MDX.
- **HyperJson** for structured JSON content (`profile`, `projects`, `skills`, `education`,
  `languages`, `music`, `photography`) → validated, typed imports.
- MDX pipeline: `remark-gfm` / `remark-math` / `remark-frontmatter` + `rehype-slug` /
  `rehype-katex` / `rehype-highlight`.

## Commands

```bash
bun run dev        # Vike dev server (default :3000, this repo runs :3001)
bun run build      # Vike build (SSG prerender + server bundle)
bun run preview    # preview the production build
bun run start      # serve the prerendered site (server/static.ts)
bun run typecheck  # tsc --noEmit
bun run test       # vitest (component/unit)
bun run test:e2e   # Playwright end-to-end specs (e2e/)
```

## Layout

```text
src/pages/            Vike pages (+Page/+data/+config), filesystem-routed
  +onBeforeRoute.ts   i18n locale-stripping (/pt → urlLogical, sets pageContext.locale)
  +Layout.tsx         shared shell; applies the URL-derived locale to i18next
  index/              home
  articles/           HyperDown articles listing + @slug/ detail
  cooking/            HyperDown recipes listing + @slug/ detail
  music/ photography/ links/   HyperJson-backed pages
src/components/       shared UI (Link, PageHeader, PageMinimap, Breadcrumbs, …)
src/hooks/            use-search-params-nav, use-search-debounce
content/<type>/       source content (.mdx for article/recipe, .json for the rest)
.hyper-down/          HyperDown codegen output (builders, MDX module maps) — generated
.hyper-json/          HyperJson codegen output (ambient types) — generated
e2e/                  Playwright specs
```

## How content is loaded

- **Listings** (`articles`, `cooking`): the `+data` loader reads the URL query
  (`q`/`tag`/`cuisine`/`page`/`sort`/`dir`) from `pageContext.urlParsed.search`, runs the
  HyperDown `ContentRepository` server-side (SQLite), and returns serializable results. The
  page reads them with `useData` and patches the query via `useSearchParamsNav` to revalidate.
- **Details** (`@slug`): the loader fetches metadata via `getMetaBySlug`; the component
  resolves the MDX body with `createContentResolver` and renders it with `MdxRender`.
- **JSON pages** import typed content directly (validated at build time by HyperJson).

## i18n notes

The default locale (`en`) is served prefix-free; `pt-BR` lives under `/pt`. `+onBeforeRoute`
strips the prefix into `urlLogical` (**including the query string and hash** — Vike re-parses
`urlParsed` from it) and exposes `pageContext.locale`. `useSearchParamsNav` navigates using the
real `window.location.pathname` so the `/pt` prefix is preserved across filter/search/sort.

> Want the same setup outside this repo? `bun create virtus-app` scaffolds an app on this
> exact architecture (Vike, React Router v7, TanStack Start, or Next.js).
