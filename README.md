# DevStash

> One fast, searchable, AI-enhanced hub for all your dev knowledge & resources.

Developers scatter snippets, prompts, commands, notes, links, and files across dozens of tools. DevStash brings everything into a single unified home — organized, searchable, and instantly accessible.

## Features

- **7 item types** — snippets, prompts, notes, commands, links, files, images
- **Collections** — group any mix of item types; items can belong to multiple collections
- **Unified search** — search across titles, content, tags, and types
- **Item drawer** — quick view/edit without leaving the page
- **Favorites & pins** — star items and collections, pin items to the top
- **Markdown editor** — for text-based item types
- **Dark mode by default**, light mode toggle
- **AI features** (Pro) — auto-tags, summaries, code explanation, prompt optimizer
- **File & image uploads** (Pro) — stored on Cloudflare R2

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 + React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Database | Neon (Serverless PostgreSQL) |
| ORM | Prisma 7 |
| Auth | NextAuth v5 |
| File Storage | Cloudflare R2 |
| AI | OpenAI gpt-4o-mini |

## Getting Started

### Prerequisites

- Node.js 20+
- A [Neon](https://neon.tech) PostgreSQL database
- Environment variables set (see below)

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file at the root:

```env
DATABASE_URL=
AUTH_SECRET=
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=
```

### Database Setup

```bash
npx prisma migrate dev
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Commands

```bash
npm run dev      # start dev server
npm run build    # production build
npm run start    # serve production build
npm run lint     # run ESLint
```

## Project Structure

```
my-app/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (auth)/          # Login & register routes
│   │   ├── (dashboard)/     # Main app (items, collections)
│   │   └── api/             # API routes
│   ├── components/          # UI components
│   ├── actions/             # Server Actions
│   ├── lib/                 # Prisma client, auth, utilities
│   └── types/               # TypeScript types
├── prisma/
│   ├── schema.prisma
│   └── migrations/
└── context/                 # Project documentation
```

## Monetization

Freemium model — free tier supports 50 items and 3 collections. Pro ($8/mo) unlocks unlimited items, file/image uploads, AI features, custom types, and data export.

> All features are accessible to all users during development regardless of plan status.
