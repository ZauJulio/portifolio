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

## Quick start

> Requires **Bun** (package manager pinned to `bun@1.3.5`).

```bash
bun install

bun run dev         # Vike dev server
bun run build       # build (engines' codegen + SSG prerender + server bundle)
bun run preview     # preview the production build
bun run typecheck   # tsc across the workspace
bun run test        # vitest unit/component tests
bun run check       # oxlint + oxfmt (OXC — not ESLint/Prettier/Biome)
```

End-to-end specs (Playwright) live in [`apps/portifolio/e2e`](./apps/portifolio/e2e):
`bun --cwd apps/portifolio run test:e2e`.

## Layout

```text
apps/portifolio/      the Vike app (see its README for architecture details)
packages/configs/     shared tsconfig/oxlint/oxfmt/Tailwind presets
frontmatter.json      content-type definitions (FrontMatter CMS format)
.frontmatter/         FrontMatter CMS templates
```

## Deploy

Deployed on **Vercel** (`vite-plugin-vercel` Build Output, SSR via `node:sqlite`).
Content `.db` indexes are build artifacts — regenerated on every build, never committed.

## License

[MIT](./LICENSE) © Zaú Júlio
