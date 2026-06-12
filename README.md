# Zaú Júlio — Portfolio

<p align="center">
  <a href="https://zaujulio.vercel.app"><img alt="Live" src="https://img.shields.io/badge/live-zaujulio.vercel.app-black?logo=vercel" /></a>
  <a href="https://github.com/ZauJulio/muttum"><img alt="Powered by Muttum" src="https://img.shields.io/badge/powered%20by-Muttum-801336" /></a>
  <a href="./LICENSE"><img alt="MIT" src="https://img.shields.io/badge/license-MIT-green" /></a>
</p>

<p align="center">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white" />
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" />
  <img alt="Vike" src="https://img.shields.io/badge/Vike-0.4-CA4DF6?logo=react&logoColor=white" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" />
  <img alt="Hono" src="https://img.shields.io/badge/Hono-4-E36002?logo=hono&logoColor=white" />
  <img alt="Tailwind" src="https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white" />
  <img alt="Bun" src="https://img.shields.io/badge/Bun-1-000000?logo=bun&logoColor=white" />
</p>

Personal portfolio — a [Vike](https://vike.dev/) **hybrid SSG + SSR** site (React 19,
Hono, bilingual: `/` en · `/pt` pt-BR) and the reference consumer of the
[**Muttum**](https://github.com/ZauJulio/muttum) content engines.

## Summary

- [Stack](#stack)
- [Quick start](#quick-start)
- [Project structure](#project-structure)
- [How content is loaded](#how-content-is-loaded)
- [Authoring content](#authoring-content)
- [i18n](#i18n)
- [Testing](#testing)
- [Deploy](#deploy)

## Stack

- **Vike** (`vike` + `vike-react` + `vike-server` + `@vikejs/hono`) — hybrid rendering:
  global `prerender: { partial: true }`; the `articles`/`cooking` **listings opt out**
  (`prerender: false`) so full-text search runs live on the server; **detail pages are
  prerendered** to static HTML.
- [`@muttum/hyper-down`](https://www.npmjs.com/package/@muttum/hyper-down) — Markdown/MDX →
  SQLite (contentless FTS5), queried server-side in `+data` loaders. Powers the searchable
  `articles` and `cooking` sections.
- [`@muttum/hyper-json`](https://www.npmjs.com/package/@muttum/hyper-json) — JSON Schema →
  validated, typed JSON imports. Powers `profile`, `projects`, `skills`, `education`,
  `languages`, `music`, and `photography`.
- **React 19** · **Tailwind v4** · **i18next** · MDX pipeline with
  `remark-gfm`/`remark-math` + `rehype-slug`/`rehype-katex`/`rehype-highlight`.

## Quick start

> Requires **Bun** (package manager pinned to `bun@1.3.5`).

```bash
bun install

bun run dev        # Vike dev server
bun run build      # engines' codegen + SSG prerender + server bundle
bun run preview    # preview the production build
bun run start      # serve the production build (bun dist/server/index.mjs)
bun run typecheck  # tsc --noEmit
bun run test       # vitest (component/unit)
bun run test:e2e   # Playwright end-to-end specs (e2e/)
bun run check      # oxlint + oxfmt (OXC — not ESLint/Prettier/Biome)
```

## Project structure

```text
src/pages/            Vike pages (+Page/+data/+config), filesystem-routed
  +onBeforeRoute.ts   i18n locale-stripping (/pt → urlLogical, sets pageContext.locale)
  +Layout.tsx         shared shell; applies the URL-derived locale to i18next
  articles/ cooking/  HyperDown listings (live SSR search) + @slug/ details (SSG)
  music/ photography/ links/   HyperJson-backed pages
src/components/       shared UI (Link, PageHeader, PageMinimap, Breadcrumbs, …)
src/hooks/            use-search-params-nav, use-search-debounce
content/<type>/       source content (.mdx for article/recipe, .json for the rest)
frontmatter.json      content-type definitions (FrontMatter CMS format)
hyperdown.config.json / hyperjson.config.json   engine configs
.hyper-down/          HyperDown codegen output (builders, MDX module maps) — generated
.hyper-json/          HyperJson codegen output (ambient types) — generated
__tests__/            vitest component/unit tests
e2e/                  Playwright specs
```

## How content is loaded

- **Listings** (`/articles`, `/cooking`): the `+data` loader reads the URL query
  (`q`/`tag`/`cuisine`/`page`/`sort`/`dir`), runs the HyperDown repository server-side
  (SQLite FTS5 `MATCH`), and returns serializable results; the page patches the query via
  `useSearchParamsNav` to revalidate. Served live (SSR).
- **Details** (`/articles/:slug`, `/cooking/:slug`): metadata via `getMetaBySlug`; the MDX
  body is resolved with `createContentResolver` and rendered with `MdxRender`. Prerendered
  (SSG) with the body inlined in the HTML.
- **JSON pages** import typed content directly — validated against each folder's
  `schema.json` at build time.

## Authoring content

- **Articles / recipes** — add an `.mdx` file under `content/article/<lang>/` or
  `content/recipe/<lang>/` (the filename is the slug) with the front-matter fields defined
  in `frontmatter.json`. The build regenerates the SQLite indexes — `.db` files are build
  artifacts, never committed.
- **Structured data** — edit the `.json` under `content/<type>/<lang>/`; HyperJson
  validates it against the sibling `schema.json` and regenerates the ambient types.
- [Front Matter CMS](https://frontmatter.codes/) users get templates under
  `.frontmatter/templates/`.

## i18n

The default locale (`en`) is served prefix-free; `pt-BR` lives under `/pt`.
`+onBeforeRoute` strips the prefix into `urlLogical` (**including query string and hash**
— Vike re-parses `urlParsed` from it) and exposes `pageContext.locale`.
`useSearchParamsNav` navigates from the real `window.location.pathname`, so the `/pt`
prefix survives search/filter/sort navigation.

## Testing

- **Unit/component** (`__tests__/`, vitest + happy-dom + Testing Library): routing,
  i18n-aware components, hooks (incl. the Strict-Mode-safe search debounce).
- **E2E** (`e2e/`, Playwright): i18n navigation, live search, hash scroll, minimap —
  regression specs for every routing/i18n gotcha documented in [CLAUDE.md](./CLAUDE.md).

## Deploy

- **Vercel** — `vite-plugin-vercel` (enabled when `VERCEL=1`) rewrites the build into
  `.vercel/output/` (Build Output API); SSR runs on `node:sqlite`, reading the content
  databases from `dist/metadata/`.
- **Docker / any Bun host** — `docker compose up --build`, or `bun run build && bun run
start` (Hono SSR server on `:3000`).

## License

[MIT](./LICENSE) © Zaú Júlio
