# DevStash — Project Overview

> **One fast, searchable, AI-enhanced hub for all your dev knowledge & resources.**

---

## Table of Contents

1. [Problem](#1-problem)
2. [Target Users](#2-target-users)
3. [Features](#3-features)
4. [Data Models](#4-data-models)
5. [Tech Stack](#5-tech-stack)
6. [UI/UX Guidelines](#6-uiux-guidelines)
7. [Monetization](#7-monetization)
8. [Project Structure (Suggested)](#8-project-structure-suggested)

---

## 1. Problem

Developers scatter their essentials across too many places:

| Resource | Typical Location |
|---|---|
| Code snippets | VS Code, Notion |
| AI prompts | Chat history |
| Context files | Buried in projects |
| Useful links | Browser bookmarks |
| Documentation | Random folders |
| Commands | `.txt` files / bash history |
| Templates | GitHub Gists |

This causes constant context switching, lost knowledge, and inconsistent workflows. **DevStash solves this with a single, unified home for everything a developer needs to remember and reuse.**

---

## 2. Target Users

| Persona | Primary Need |
|---|---|
| 🧑‍💻 **Everyday Developer** | Fast access to snippets, prompts, commands, and links |
| 🤖 **AI-first Developer** | Stores and organizes prompts, system messages, workflows |
| 🎓 **Content Creator / Educator** | Code blocks, explanations, and course notes in one place |
| 🏗️ **Full-stack Builder** | Patterns, boilerplates, and API examples at hand |

---

## 3. Features

### A. Items & Item Types

Items are the core unit of DevStash. Each item has a **type** that governs its behavior and display.

**System Types** (built-in, non-editable):

| Type | Icon | Color | Content Kind | Route |
|---|---|---|---|---|
| `snippet` | `<Code />` | `#3b82f6` Blue | text | `/items/snippets` |
| `prompt` | `<Sparkles />` | `#8b5cf6` Purple | text | `/items/prompts` |
| `note` | `<StickyNote />` | `#fde047` Yellow | text | `/items/notes` |
| `command` | `<Terminal />` | `#f97316` Orange | text | `/items/commands` |
| `link` | `<Link />` | `#10b981` Emerald | url | `/items/links` |
| `file` | `<File />` | `#6b7280` Gray | file | `/items/files` ⭐ Pro |
| `image` | `<Image />` | `#ec4899` Pink | file | `/items/images` ⭐ Pro |

> Custom types are planned for a future Pro release.

Items are accessed and created quickly via a **slide-in drawer** — no full page navigation required.

---

### B. Collections

Collections are named groups that can hold items of **any type**. Items can belong to **multiple collections** (many-to-many).

**Examples:**

- `React Patterns` → snippets, notes
- `Context Files` → files
- `Python Snippets` → snippets
- `Interview Prep` → snippets, commands, links

---

### C. Search

Unified search across all of:

- Item **titles**
- Item **content**
- **Tags**
- **Types**

---

### D. Authentication

- Email / password
- GitHub OAuth

Powered by **NextAuth v5**.

---

### E. General Features

- ⭐ Favorite collections and items
- 📌 Pin items to top
- 🕐 Recently used items
- 📥 Import code from a file
- ✍️ Markdown editor for text-based types
- 📁 File upload for `file` / `image` types
- 📤 Export data (JSON / ZIP) — Pro
- 🌙 Dark mode by default, light mode available
- 🗂️ Add/remove items to/from multiple collections
- 🔍 View which collections an item belongs to

---

### F. AI Features (Pro Only)

| Feature | Description |
|---|---|
| 🏷️ Auto-tag suggestions | Suggests relevant tags when saving an item |
| 📝 AI Summaries | Generates a short summary of any item |
| 💡 Explain This Code | Breaks down what a snippet or command does |
| ✨ Prompt Optimizer | Rewrites and improves AI prompts |

> **Note:** During development, all users will have access to all features regardless of plan status.

---

## 4. Data Models

> ⚠️ **Rough Draft** — These Prisma models are a starting point and will evolve. Do not run `db push`; always use proper migrations.

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// --- Enums ---

enum ContentType {
  TEXT
  FILE
  URL
}

// --- Models ---

model User {
  id                   String       @id @default(cuid())
  name                 String?
  email                String       @unique
  emailVerified        DateTime?
  image                String?
  password             String?      // null for OAuth users
  isPro                Boolean      @default(false)
  stripeCustomerId     String?      @unique
  stripeSubscriptionId String?      @unique
  createdAt            DateTime     @default(now())
  updatedAt            DateTime     @updatedAt

  items                Item[]
  collections          Collection[]
  itemTypes            ItemType[]
  accounts             Account[]
  sessions             Session[]
}

model Item {
  id          String      @id @default(cuid())
  title       String
  description String?
  contentType ContentType
  content     String?     // Text content (snippet, note, prompt, command)
  url         String?     // For link types
  fileUrl     String?     // Cloudflare R2 URL
  fileName    String?     // Original filename
  fileSize    Int?        // Bytes
  language    String?     // e.g. "typescript", "python" — for syntax highlighting
  isFavorite  Boolean     @default(false)
  isPinned    Boolean     @default(false)
  lastUsedAt  DateTime?
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  userId      String
  user        User        @relation(fields: [userId], references: [id], onDelete: Cascade)

  itemTypeId  String
  itemType    ItemType    @relation(fields: [itemTypeId], references: [id])

  tags        TagsOnItems[]
  collections ItemCollection[]
}

model ItemType {
  id       String  @id @default(cuid())
  name     String  // "snippet", "prompt", "note", etc.
  icon     String  // Lucide icon name, e.g. "Code", "Sparkles"
  color    String  // Hex color, e.g. "#3b82f6"
  isSystem Boolean @default(false)

  userId   String?
  user     User?   @relation(fields: [userId], references: [id], onDelete: Cascade)

  items    Item[]
}

model Collection {
  id            String   @id @default(cuid())
  name          String
  description   String?
  isFavorite    Boolean  @default(false)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  defaultTypeId String?

  userId        String
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  items         ItemCollection[]
}

model ItemCollection {
  itemId       String
  collectionId String
  addedAt      DateTime @default(now())

  item         Item       @relation(fields: [itemId], references: [id], onDelete: Cascade)
  collection   Collection @relation(fields: [collectionId], references: [id], onDelete: Cascade)

  @@id([itemId, collectionId])
}

model Tag {
  id    String        @id @default(cuid())
  name  String        @unique
  items TagsOnItems[]
}

model TagsOnItems {
  itemId String
  tagId  String

  item   Item @relation(fields: [itemId], references: [id], onDelete: Cascade)
  tag    Tag  @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([itemId, tagId])
}

// --- NextAuth Models ---

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}
```

---

## 5. Tech Stack

### Core

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) + [React 19](https://react.dev/) |
| Language | TypeScript |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) |
| Database | [Neon](https://neon.tech/) — Serverless PostgreSQL |
| ORM | [Prisma 7](https://www.prisma.io/docs) |
| Auth | [NextAuth v5](https://authjs.dev/) |
| File Storage | [Cloudflare R2](https://developers.cloudflare.com/r2/) |
| AI | OpenAI `gpt-4o-mini` |
| Caching | Redis *(optional / TBD)* |

### Rendering Strategy

- **SSR pages** with dynamic React components
- **API routes** for backend logic (item storage, file uploads, AI calls)
- Single monorepo — no separate backend service

### Key Libraries to Consider

| Purpose | Package |
|---|---|
| Markdown editing | [`@uiw/react-md-editor`](https://github.com/uiw/react-md-editor) or [`tiptap`](https://tiptap.dev/) |
| Syntax highlighting | [`shiki`](https://shiki.style/) or [`prism-react-renderer`](https://github.com/FormidableLabs/prism-react-renderer) |
| Drag & drop | [`@dnd-kit/core`](https://dndkit.com/) |
| Payments | [`stripe`](https://stripe.com/docs/api) + [`@stripe/stripe-js`](https://stripe.com/docs/stripe-js) |
| Toasts | [`sonner`](https://sonner.emilkowal.ski/) |
| Icons | [`lucide-react`](https://lucide.dev/) |
| Validation | [`zod`](https://zod.dev/) |

> ⚠️ **Migration rule:** Never use `prisma db push` in any environment. Always generate and run proper migrations via `prisma migrate dev` (dev) and `prisma migrate deploy` (prod).

---

## 6. UI/UX Guidelines

### Aesthetic

- Modern, minimal, **developer-focused**
- **Dark mode by default**, light mode toggle available
- Reference apps: [Notion](https://notion.so), [Linear](https://linear.app), [Raycast](https://raycast.com)
- Clean typography, generous whitespace, subtle borders and shadows

### Layout

```
┌─────────────────────────────────────────────────────────┐
│  Sidebar (collapsible)     │  Main Content Area          │
│                            │                             │
│  ▸ Snippets                │  [ Collection Cards Grid ]  │
│  ▸ Prompts                 │                             │
│  ▸ Commands                │  ┌──────┐  ┌──────┐        │
│  ▸ Notes                   │  │  🔵  │  │  🟣  │        │
│  ▸ Links                   │  │React │  │Prompt│        │
│  ▸ Files (Pro)             │  │Ptrns │  │Bank  │        │
│  ▸ Images (Pro)            │  └──────┘  └──────┘        │
│  ─────────────             │                             │
│  Collections               │  [ Item Cards below ]       │
│  ▸ React Patterns          │                             │
│  ▸ Python Snippets         │                             │
│  ▸ Interview Prep          │  ┌─────────────────────┐   │
│                            │  │ Item Drawer (overlay)│   │
│                            │  │ opens on item click  │   │
│                            │  └─────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

- **Sidebar:** Item type links + latest collections. Collapses to icon rail.
- **Main area:** Color-coded collection cards (background color = dominant item type). Items display below as color-coded cards (border color = item type).
- **Item drawer:** Slides in on item click for quick view/edit without leaving the page.
- **Mobile:** Sidebar becomes a bottom drawer or hamburger menu.

### Type Colors & Icons (Lucide)

| Type | Color | Hex | Lucide Icon |
|---|---|---|---|
| Snippet | 🔵 Blue | `#3b82f6` | `<Code />` |
| Prompt | 🟣 Purple | `#8b5cf6` | `<Sparkles />` |
| Command | 🟠 Orange | `#f97316` | `<Terminal />` |
| Note | 🟡 Yellow | `#fde047` | `<StickyNote />` |
| File | ⚫ Gray | `#6b7280` | `<File />` |
| Image | 🩷 Pink | `#ec4899` | `<Image />` |
| Link | 🟢 Emerald | `#10b981` | `<Link />` |

### Micro-interactions

- Smooth transitions on drawer open/close and sidebar collapse
- Hover states on all cards
- Toast notifications (via `sonner`) for create, copy, delete, error actions
- Loading skeletons for async content

---

## 7. Monetization

### Freemium Model

| Feature | Free | Pro ($8/mo or $72/yr) |
|---|---|---|
| Items | 50 total | Unlimited |
| Collections | 3 | Unlimited |
| Item Types | All except file/image | All types |
| File & Image uploads | ❌ | ✅ |
| AI features | ❌ | ✅ |
| Custom types | ❌ | ✅ *(coming soon)* |
| Export (JSON/ZIP) | ❌ | ✅ |
| Priority support | ❌ | ✅ |
| Search | Basic | Full |

> **Dev note:** Pro gates are stubbed in the codebase but not enforced during development — all features are accessible to all users until launch prep.

Payments handled via **Stripe** — store `stripeCustomerId` and `stripeSubscriptionId` on the `User` model.

---

## 8. Project Structure (Suggested)

```
devstash/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/
│   │   ├── items/
│   │   │   └── [type]/        # /items/snippets, /items/prompts, etc.
│   │   ├── collections/
│   │   │   └── [id]/
│   │   └── layout.tsx         # Sidebar + main layout
│   ├── api/
│   │   ├── items/
│   │   ├── collections/
│   │   ├── upload/
│   │   ├── ai/
│   │   └── auth/
│   └── layout.tsx
├── components/
│   ├── ui/                    # shadcn/ui primitives
│   ├── items/
│   ├── collections/
│   ├── drawers/
│   └── sidebar/
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   ├── r2.ts
│   └── openai.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── types/
└── constants/
    └── item-types.ts          # System type definitions (color, icon, slug)
```

---

*Last updated: April 2026*
