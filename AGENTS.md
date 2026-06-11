# AGENTS.md

Guidance for AI agents working in this repository. The canonical, detailed guidance lives
in **[CLAUDE.md](./CLAUDE.md)** — mandatory checks, architecture notes, i18n gotchas.

## Stack

Flat single-package Bun repo. **Vike** hybrid SSG + SSR (React 19, Hono, bilingual `/` en,
`/pt`). Content engines consumed from npm: `@virtus/hyper-down` (Markdown/MDX → SQLite
FTS5, SSR-only) and `@virtus/hyper-json` (JSON Schema → typed content) — source at
[ZauJulio/virtus](https://github.com/ZauJulio/virtus); each installed package ships a
`.agents/` reference tree. Linting/formatting via **OXC** (`oxlint` + `oxfmt`) — **not**
Biome/ESLint/Prettier.

## Mandatory checks after any code edit (run in order)

```bash
bun run check
bun run typecheck
bun run test
bun run build
```

Fix every error **and warning** before considering a task done.

## Content authoring

- Articles/recipes: `.mdx` under `content/<type>/<lang>/` (slug = filename); the build
  regenerates the SQLite indexes (never committed).
- Structured data: `.json` under `content/<type>/`, validated against the sibling
  `schema.json`.
- Content types are defined in `frontmatter.json` (FrontMatter CMS format).
