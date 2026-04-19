# Current Feature

## Status

<!-- Not Started|In Progress|Completed -->

## Goals

<!-- Add goals here -->

## Notes

<!-- Add notes here -->

## History

<!-- Keep this updated. Earliest to latest -->

# Previous Features

## Auth Credentials: Email/Password Provider

### Status

Completed

### Goals

- Add `password` field to `User` model via migration (if not already present)
- Update `auth.config.ts` with Credentials provider placeholder (`authorize: () => null`)
- Update `auth.ts` to override Credentials provider with bcrypt validation logic
- Create registration API route `POST /api/auth/register` (name, email, password, confirmPassword)
- Validate passwords match, check for existing user, hash with bcryptjs, create user in DB
- GitHub OAuth must continue to work after changes

### Notes

See full spec at `context/features/auth-spec-files/auth-phase-2-spec.md`.

### History

- **2026-04-19** — Loaded spec from `context/features/auth-spec-files/auth-phase-2-spec.md`.
- **2026-04-19** — Created branch `feature/auth-credentials-email-password`. `password` field already present in schema (no migration needed). Updated `src/auth.config.ts` with Credentials provider placeholder (`authorize: () => null`). Updated `src/auth.ts` to override Credentials with bcrypt validation. Created `src/app/api/auth/register/route.ts` (POST handler: validates fields, checks passwords match, checks for existing user, hashes with bcrypt salt 12, creates user). `tsc --noEmit` passes clean.
- **2026-04-19** — Merged into main. Feature complete.

# Previous Features

## Auth Setup - NextAuth + GitHub Provider

### Status

Completed

### Goals

- Install NextAuth v5 (`next-auth@beta`) and `@auth/prisma-adapter`
- Set up split auth config pattern for edge compatibility
- Add GitHub OAuth provider
- Protect `/dashboard/*` routes using Next.js 16 proxy
- Redirect unauthenticated users to sign-in

### Notes

See full spec at `context/features/auth-spec-files/auth-phase-1-spec.md`.

### History

- **2026-04-19** — Loaded spec from `context/features/auth-spec-files/auth-phase-1-spec.md`.
- **2026-04-19** — Created branch `feature/auth-nextauth-github`. Installed `next-auth@beta` (5.0.0-beta.31) and `@auth/prisma-adapter`. Created `src/auth.config.ts` (edge-compatible, GitHub provider), `src/auth.ts` (Prisma adapter + JWT strategy + session/jwt callbacks to expose `user.id`), `src/app/api/auth/[...nextauth]/route.ts` (GET/POST handlers), `src/proxy.ts` (named `proxy` export, redirects unauthenticated `/dashboard/*` to sign-in), `src/types/next-auth.d.ts` (Session extended with `user.id`). `tsc --noEmit` passes clean.
- **2026-04-19** — Merged into main. Feature complete.

## Add Pro Badge to Sidebar

### Status

Completed

### Goals

- Add a PRO badge next to the "Files" and "Images" item types in the sidebar
- Use the shadcn/ui Badge component
- Badge is clean and subtle in appearance
- "PRO" text is all uppercase
- Badge is styled in gold

### Notes

See full spec at `context/features/add-pro-badge-sidebar.md`.

### History

- **2026-04-19** — Set current feature to Add Pro Badge to Sidebar.
- **2026-04-19** — Created branch `feature/add-pro-badge-sidebar`. Installed shadcn/ui Badge component. Added `PRO_TYPES` set for `file` and `image`. Rendered gold PRO badge in sidebar item row for those types. `tsc --noEmit` passes clean.
- **2026-04-19** — Redesigned sidebar: compact "Navigation" header, `PanelLeftClose/Open` toggle (plain `<button>` to fix click), `SYSTEM_TYPE_ORDER` in `items.ts` to filter and order the 7 canonical types. Inserted correct system item types into Neon Dev branch. Fixed issue where data was inserted into production branch instead of Dev branch.

# Previous Features

## Dashboard Items — Real Data

### Status

Completed

### Goals

- Create `src/lib/db/items.ts` with data fetching functions
- Fetch pinned and recent items directly in server component (replace mock data)
- Item card icon/border color derived from the item type
- Display item type tags and all existing card details
- If no pinned items exist, hide that section entirely
- Update stats card counts from real database data

### Notes

See full spec at `context/features/dashboard-items-spec.md`.

### History

- **2026-04-17** — Set current feature to Dashboard Items — Real Data.
- **2026-04-17** — Created branch `feature/dashboard-items`. Created `src/lib/db/items.ts` with `getPinnedItems`, `getRecentItems`, `getDashboardStats`. Updated `app/dashboard/page.tsx` to fetch all data in parallel. Rewrote `MainContent.tsx` to accept real props — removed all mock-data imports, pinned section hidden when empty. Fixed `prisma/seed.ts` Prisma 7 import path and `itemType.upsert` → `findFirst`+`create`. `tsc --noEmit` passes clean.

## Dashboard Collections

### Status

Completed

### Goals

- Create src/lib/db/collections.ts with data fetching functions
- Fetch collections directly in server component
- Collection card border color derived from most-used content type in that collection
- Show small icons of all types in that collection
- Keep the current design
- Update collection stats display

### Notes

See full spec at `context/features/dashboard-collections-spec.md`.

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
