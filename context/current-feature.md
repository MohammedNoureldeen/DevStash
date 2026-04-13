# Current Feature

Dashboard Collections

## Status

<!-- Not Started|In Progress|Completed -->

In Progress

## Goals

- Create src/lib/db/collections.ts with data fetching functions
- Fetch collections directly in server component
- Collection card border color derived from most-used content type in that collection
- Show small icons of all types in that collection
- Keep the current design. You can also reference the screenshot
- Update collection stats display

## Notes

See full spec at `context/features/dashboard-collections-spec.md`.

Key constraints:
- Replace dummy collection data in main dashboard area with actual database data
- Use Prisma to fetch from Neon database
- Do not add items underneath yet - that will be done later
- Reference `context/screenshots/dashboard-ui-main.png` for layout/design

## History

<!-- Keep this updated. Earliest to latest -->

- **2026-04-12** — Initial Next.js 15 + Tailwind CSS v4 project setup. Cleared boilerplate (SVGs, default page styles). Added `context/` directory with project overview, coding standards, AI interaction, and current feature docs.
- **2026-04-12** — Set current feature to Dashboard UI Phase 1.
- **2026-04-12** — Implemented phase 1: ShadCN UI init, Button/Input components, `/dashboard` route, dark mode, TopBar with search and new item button, sidebar and main placeholders.
- **2026-04-12** — Implemented phase 2: collapsible sidebar with item type links, favorite/recent collections, user avatar, mobile drawer, DashboardShell layout component.
- **2026-04-12** — Implemented phase 3: MainContent component with 4 stats cards, pinned items cards, recent collections grid, and recent items list (up to 10).
- **2026-04-12** — Created branch `feature/dashboard-ui-phase-3` and verified phase 3 requirements are implemented and marked complete.
- **2026-04-12** — Set current feature to Neon PostgreSQL + Prisma Setup.
- **2026-04-13** — Created branch `feature/neon-prisma-setup`. Installed Prisma 7 + `@prisma/adapter-pg` + `pg`. Created `prisma/schema.prisma` (Prisma 7 format: provider `prisma-client`, output `../generated/prisma`, no URL in datasource). Created `prisma.config.ts` at root (datasource URL via `dotenv` + `process.env`). Created `src/lib/prisma.ts` singleton using `PrismaPg` driver adapter. Created `.env.example`. `prisma generate` and `tsc --noEmit` both pass.
- **2026-04-13** — Added Neon dev + production connection strings to `.env`. Ran `prisma migrate dev --name init` — migration `20260412222311_init` created and applied to dev branch. All 10 tables live in Neon.
- **2026-04-13** — Created `prisma/seed.ts` with demo user, 7 system item types, and 5 collections containing 18 items (React hooks/patterns, AI prompts, Docker/CI-CD configs, terminal commands, design resource links).

# Previous Features

## Neon PostgreSQL + Prisma Setup

### Status

Completed

### Goals

- Set up Prisma 7 ORM with Neon PostgreSQL (serverless)
- Create initial schema based on data models in `context/project-overview.md`
- Include NextAuth models (Account, Session, VerificationToken)
- Add appropriate indexes and cascade deletes
- Use migrations (`prisma migrate dev`) — never `db push`

### Notes

See full spec at `context/features/database-spec.md`.

Key constraints:
- Always use a development branch in Neon; never work directly on production branch
- Prisma 7 has breaking changes — review upgrade guide before implementing
- DATABASE_URL points to the development branch

### History

- **2026-04-12** — Initial Next.js 15 + Tailwind CSS v4 project setup. Cleared boilerplate (SVGs, default page styles). Added `context/` directory with project overview, coding standards, AI interaction, and current feature docs.
- **2026-04-12** — Set current feature to Dashboard UI Phase 1.
- **2026-04-12** — Implemented phase 1: ShadCN UI init, Button/Input components, `/dashboard` route, dark mode, TopBar with search and new item button, sidebar and main placeholders.
- **2026-04-12** — Implemented phase 2: collapsible sidebar with item type links, favorite/recent collections, user avatar, mobile drawer, DashboardShell layout component.
- **2026-04-12** — Implemented phase 3: MainContent component with 4 stats cards, pinned items cards, recent collections grid, and recent items list (up to 10).
- **2026-04-12** — Created branch `feature/dashboard-ui-phase-3` and verified phase 3 requirements are implemented and marked complete.
- **2026-04-12** — Set current feature to Neon PostgreSQL + Prisma Setup.
- **2026-04-13** — Created branch `feature/neon-prisma-setup`. Installed Prisma 7 + `@prisma/adapter-pg` + `pg`. Created `prisma/schema.prisma` (Prisma 7 format: provider `prisma-client`, output `../generated/prisma`, no URL in datasource). Created `prisma.config.ts` at root (datasource URL via `dotenv` + `process.env`). Created `src/lib/prisma.ts` singleton using `PrismaPg` driver adapter. Created `.env.example`. `prisma generate` and `tsc --noEmit` both pass.
- **2026-04-13** — Added Neon dev + production connection strings to `.env`. Ran `prisma migrate dev --name init` — migration `20260412222311_init` created and applied to dev branch. All 10 tables live in Neon.
