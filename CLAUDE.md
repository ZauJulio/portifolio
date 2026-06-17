# Agent Guidelines

## STRICT MANDATORY PROCEDURE FOR CODE EDITS

Whenever you (the AI agent) edit, modify, refactor, or add **CODE** to this repository, you **MUST** run the following commands **in order**:

1. **`bun run check`** — `oxlint` + `oxfmt`. ⚠️ This project uses **OXC**, NOT Biome or ESLint.
2. **`bun run typecheck`** — `tsc --noEmit`.
3. **`bun run test`** — vitest unit/component suites.
4. **`bun run build`** — ensures the project builds without errors.

If **any** command fails or produces **ANY** warnings or errors, fix them before considering the task complete. **Do not ask for permission to fix errors — just fix them, then rerun the checks.**

---

## Repository shape

Flat single-package Bun repo (no workspaces, no turbo). The app lives at the root: Vike hybrid SSG + SSR (React 19, Hono, bilingual `/` en, `/pt`).

The content engines are consumed **from npm** — [`@indago/hyper-down`](https://www.npmjs.com/package/@indago/hyper-down) (Markdown/MDX → SQLite FTS5, SSR-only) and [`@indago/hyper-json`](https://www.npmjs.com/package/@indago/hyper-json) (JSON Schema → typed content). Their source lives in the [indago](https://github.com/ZauJulio/indago) repo; each ships a `.agents/` reference tree inside the installed package.

---

## Architecture Notes

### Content flow (engines)

- **SSR-only**: HyperDown SQLite is queried exclusively on the server, in Vike `+data` loaders, through the generated lazy `<type>Repository` (`.hyper-down/content/<type>/builder.ts`). There is no client-side database.
- SQLite stores **only frontmatter metadata**; the MD/MDX body is tokenized into the contentless FTS5 index but never stored. Bodies load via the codegen-generated eager `import.meta.glob` map (`@hyper-down/default` → `contentModules`), resolved with `createContentResolver` and rendered with `MdxRender`.
- **`hyperdownMdxPlugin` MUST be listed before `vike()`/`react()`** in `vite.config.ts`.
- Loaders read the `.db` with `bun:sqlite` — or `node:sqlite` (Node ≥22, e.g. Vercel). Production prefers `dist/metadata/<name>.db`.
- Listing pages are URL-driven (`q`/`tag`/`cuisine`/`page`/`sort`/`dir` from `pageContext.urlParsed.search`); detail pages use `getMetaBySlug` + the resolver.
- Content `.db` files are build artifacts — regenerated every build, never committed.
- Content types are defined in `frontmatter.json` (root, FrontMatter CMS format); `hyperdown.config.json` points at it and at `./content`.
- **Articles are `index: "composed"`** (`hyperdown.config.json#database.indexByCollection.article`): the writer also builds an `article_sections` table + per-section FTS and stores the heading tree on each row's `sections` column. `getMetaBySlug` returns `meta.sections` (a `SectionNode[]`); `searchSections()` powers section-level search. `remarkHeadingBadges` (in `vite.config.ts` remark plugins) strips `#[label/#color]` heading badges from the body so `rehype-slug` anchors stay clean — they re-surface as sidebar pills.

### Tutorials, search & reading state

- **Tutorial articles** (frontmatter `tags` includes `"tutorial"`) render `TutorialSidebar` (`src/components/TutorialSidebar.tsx`) — it wraps the lib's `<Sidebar/>` (`@indago/hyper-down` + `sidebar.css`) fed `article.sections`, with brand theming, scroll-spy active highlight (`use-active-section.ts`), viewport-height compression, a desktop left panel + a mobile hamburger drawer. The article container gets `lg:pl-72` only when tutorial.
- **`ArticleSearch`** (`src/components/ArticleSearch.tsx`) shows on every article detail page. Plain text → all-articles search; a leading `#` → current-page sections only (dashed border, reduced contrast). Detail pages are prerendered, so it fetches the **Hono `/api/search`** JSON route (`src/server/hono.ts`, registered before `vike(app)`) → `{ pages, sections }` via `articleRepository.search` + `searchSections`.
- **Reading state** (`use-reading-state.ts`): opened articles/recipes are recorded in `localStorage` (`portifolio:reading`); detail pages call `markRead` on mount, listing cards (`ArticleCard`/`RecipeCard`) dim when read. SSR starts empty and hydrates post-mount (no hydration mismatch).

### The Vike app

- **Vike** (`vike` + `vike-react` + `vike-server` + `@vikejs/hono`), **hybrid SSG + SSR**: global `prerender: { partial: true }`; listings (`articles/`, `cooking/`) set `prerender: false` so `+data` search is live SSR (this also keeps `dist/server/index.mjs` in the build); detail pages (`@slug`) set `prerender: true`. `+config.ts` sets `passToClient: ["locale", "canonical", "displayLocale", "urlPathnameLocalized"]`.
- **i18n is locale-stripping** (`src/i18n.ts` + `src/pages/+onBeforeRoute.ts`): default locale `en` is prefix-free; `pt-BR` lives under `/pt`. `+onBeforeRoute` strips the prefix and sets `pageContext.locale` + `urlLogical`.
  - ⚠️ **`urlLogical` MUST include the query string and hash** — Vike re-parses `urlParsed` from it; a pathname-only value silently empties every URL-driven loader. Build it as `urlPathnameWithoutLocale + searchOriginal + hashOriginal`.
- **`useSearchParamsNav`**: must build the target from **`window.location.pathname`** (locale-prefixed), not `pageContext.urlPathname` (locale-stripped) — otherwise `/pt` visitors get bounced to the default locale. Passes `keepScrollPosition: true`.
- **`useSearchDebounce`**: the guard `searchInput === serverQuery` makes it Strict-Mode-safe — never replace it with an `isFirstRender` ref.
- **`PageMinimap`**: `cloneArticleInto` **must strip every descendant `id`** from the clone, or hash navigation targets the mirror copy.
- **Article hash scroll**: Vike intercepts `<a href="#…">` via `pushState`, so a **capture-phase** click listener handles TOC clicks.
- E2E (Playwright, `e2e/`) covers these behaviors as regression specs.

### Deploy (Vercel)

- `vite-plugin-vercel` is enabled only when `VERCEL=1` (Vercel sets it); it rewrites the build into `.vercel/output/` (Build Output API). Locally/Docker, a plain build yields a runnable SSR server (`bun run start`).
- The production domain is **zaujulio.com.br** (custom domain on Vercel; the project keeps its default `*.vercel.app` alias too). `.vercel/project.json` (gitignored, local) links the checkout to the Vercel project. Site URLs come from `VITE_SITE_URL` (canonical/OG/hreflang in `+Head.tsx`) and `hyperdown.config.json` `siteUrl` (sitemap) — keep both on the production domain.

### Auto-generated — Do Not Edit Manually

- `.hyper-down/**` (`content/*/{types,builder,modules}.ts`, `default.ts`)
- `.hyper-json/src/content/**` (`generated.d.ts`, per-type `types.ts`)

Regenerated by the engines' Vite plugins on every build (idempotent writes).
