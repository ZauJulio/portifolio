# Zaú Júlio — Portfolio

<p align="center">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white" />
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" />
  <img alt="Vike" src="https://img.shields.io/badge/Vike-0.4-CA4DF6?logo=react&logoColor=white" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" />
  <img alt="Bun" src="https://img.shields.io/badge/Bun-1-000000?logo=bun&logoColor=white" />
  <img alt="License" src="https://img.shields.io/badge/license-MIT-green" />
</p>

<p align="center">
  <strong>Live:</strong> <a href="https://zaujulio.vercel.app">zaujulio.vercel.app</a>
</p>

Personal portfolio — a [Vike](https://vike.dev/) hybrid SSG + SSR site (React 19, Hono,
bilingual: `/` en, `/pt`) and the reference consumer of the
[**Virtus**](https://github.com/ZauJulio/virtus) content engines:

- [`@virtus/hyper-down`](https://www.npmjs.com/package/@virtus/hyper-down) — Markdown/MDX →
  SQLite (contentless FTS5), queried server-side in `+data` loaders. Powers the searchable
  `articles` and `cooking` sections.
- [`@virtus/hyper-json`](https://www.npmjs.com/package/@virtus/hyper-json) — JSON Schema →
  validated, typed JSON imports. Powers `profile`, `projects`, `skills`, `education`,
  `languages`, `music`, and `photography`.

## Commands

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

## Layout

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
.hyper-down/          HyperDown codegen output (builders, MDX module maps) — generated
.hyper-json/          HyperJson codegen output (ambient types) — generated
e2e/                  Playwright specs
```

## How content is loaded

- **Listings** (`articles`, `cooking`): the `+data` loader reads the URL query
  (`q`/`tag`/`cuisine`/`page`/`sort`/`dir`), runs the HyperDown repository server-side
  (SQLite FTS5), and returns serializable results; the page patches the query via
  `useSearchParamsNav` to revalidate. Served live (SSR, `prerender: false`).
- **Details** (`@slug`): metadata via `getMetaBySlug`; MDX body resolved with
  `createContentResolver` and rendered with `MdxRender`. Prerendered (SSG).
- **JSON pages** import typed content directly (validated at build time by HyperJson).

## Deploy

**Vercel** (`vite-plugin-vercel` Build Output API, SSR via `node:sqlite`) — or any
Bun/Node host via `Dockerfile` / `bun run start`. Content `.db` indexes are build
artifacts: regenerated on every build, never committed.

## License

[MIT](./LICENSE) © Zaú Júlio
