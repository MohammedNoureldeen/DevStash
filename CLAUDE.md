# DevStash
A developer Knowledge hub for snippets, commands , prompts, notes, files ,images, links , and custome tyoes.

## context files
Read the following to get the full context of the project
- @context/project-overview
- @context/coding-standards.md
- @context/project-overview
- @context/ai-interaction


## Commands

```bash
npm run dev      # start dev server
npm run build    # production build
npm run start    # serve production build
npm run lint     # run ESLint
```

No test runner is configured.

## Stack versions (non-obvious)

- **Next.js 16.2.3** — read `node_modules/next/dist/docs/` before writing any Next.js code; APIs differ from common training data
- **React 19.2.4**
- **Tailwind CSS v4** — configured via `@tailwindcss/postcss`; uses `@import "tailwindcss"` in CSS (not `@tailwind` directives); theme tokens use `@theme` blocks, not `tailwind.config.js`

## Architecture

App Router only (`app/` directory). No Pages Router.

- `app/layout.tsx` — root layout; loads Geist Sans + Geist Mono via `next/font/google`, applies them as CSS variables (`--font-geist-sans`, `--font-geist-mono`)
- `app/globals.css` — single `@import "tailwindcss"` entry point for Tailwind v4
- `app/page.tsx` — home route (`/`)
- `next.config.ts` — empty config, TypeScript
