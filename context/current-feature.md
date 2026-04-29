# Current Feature

## Status

Not Started

## Goals

<!-- Goals go here -->

## Notes

<!-- Notes go here -->

## History

## Collection Create

### Status

Completed

### Goals

- Add `createCollection(userId, { name, description })` function to `src/lib/db/collections.ts`
- Create `src/actions/collections.ts` with a Zod-validated `createCollection` server action (name required, description optional); follow `{ success, data, error }` pattern
- Create `src/components/collections/NewCollectionDialog.tsx` — modal with name (required) and description (optional) fields; toast on success or failure; `router.refresh()` on success to reflect the new collection
- Add `onNewCollection` prop to `TopBar`; render a "New Collection" button alongside the existing "New" button
- Update `DashboardShell` to hold `newCollectionOpen` state and render `<NewCollectionDialog>`
- Collections are user-scoped: always pass `session.user.id` and scope DB queries to the authenticated user

### History

- **2026-04-28** — Created branch `feature/collection-create`. Added `CreateCollectionData` type and `createCollection(userId, data)` to `src/lib/db/collections.ts` (user-scoped, returns `CollectionWithDetails`). Created `src/actions/collections.ts` (Zod: name required, description optional; `{ success, data, error }` pattern). Created `src/components/collections/NewCollectionDialog.tsx` (name + description fields, toast on success/failure, `router.refresh()` on save, Enter-key submit, resets on close). Added `onNewCollection` prop to `TopBar` with `FolderPlus` outline button alongside existing "New" button. Updated `DashboardShell` to hold `newCollectionOpen` state and render `<NewCollectionDialog>`. Installed shadcn `textarea` and `label` components. `tsc --noEmit` passes clean.
- **2026-04-28** — Merged into main. Feature complete.

## Quick Wins — Security & Quality

### Status

Completed

### Goals

- Extract bcrypt salt rounds into shared constant
- Debounce ItemDrawer fetch + res.ok guard
- Auto-prepend https:// to link URLs; close open redirect on callbackUrl
- Zod validation for register and change-password API routes
- Replace `<img>` with `next/image` in gallery and drawer
- Upload rate limiting (20 req / 1 h per user)

### History

- **2026-04-28** — Created branch `feature/quick-wins-security-quality`. Created `src/lib/password.ts` (`BCRYPT_ROUNDS = 12`, `hashPassword`, `verifyPassword`); removed direct `bcryptjs` imports from `app/api/register/route.ts`, `app/api/auth/reset-password/route.ts`, `app/api/profile/change-password/route.ts`, and `src/auth.ts`. Debounced `ItemDrawer` fetch `useEffect` by 150 ms with `setTimeout`/`clearTimeout` cleanup; added `res.ok` guard before JSON cast. Added `normalizeUrl` (prepends `https://` when no protocol present) to `NewItemDialog.tsx` and `ItemDrawer.tsx` save path; validated `callbackUrl` starts with `/` in `app/sign-in/page.tsx`. Replaced raw `as` casts with Zod schemas in `app/api/register/route.ts` (name/email/password/confirmPassword with `refine` for match) and `app/api/profile/change-password/route.ts`. Replaced `<img>` with `<NextImage fill>` in `ImageThumbnailCard` (parent gains `relative`) and `ItemDrawer` image preview; inlined conditional `FileText`/`File` icon in `FileListRow` to fix dynamic component-during-render lint error. Added `uploadLimiter` (20 req / 1 h, keyed by `userId`) to `src/lib/rate-limit.ts`; applied in `app/api/upload/route.ts` after auth check. `tsc --noEmit` passes clean.
- **2026-04-28** — Merged into main. Feature complete.

## File List View

### Status

Completed

### Goals

- Single-column list layout with rows (like Google Drive/Dropbox) for `/items/files`
- Each row shows: file icon (by extension), file name, file size, upload date, download button
- Row hover highlight
- Click row opens ItemDrawer
- Download button triggers direct download (stop propagation)
- Responsive: stack info vertically on mobile

### History

- **2026-04-28** — Created branch `feature/file-list-view`. Added `FileListRow` component to `src/components/items/ItemsListContent.tsx` (file icon by extension via `getFileIcon` helper — `FileText` for pdf/doc/txt/csv/md/etc., `File` as default; row shows `fileName ?? title`, description, `formatBytes(fileSize)`, `formatDate(createdAt)`, download `<a>` with `stopPropagation`; desktop: size + date inline via `hidden sm:flex`; mobile: stacked below name via `sm:hidden`; hover `bg-secondary/50`). Added `isFileList` flag (`typeLabel === 'files'`) to render rows inside `glass-card` with `divide-y divide-border` instead of the grid. Images and all other types unchanged. `tsc --noEmit` passes clean.
- **2026-04-28** — Merged into main. Feature complete.

## Image Gallery View

### Status

Completed

### Goals

- Create an image thumbnail card to replace the current item card
- Show an image grid/gallery with 3 columns
- Display image thumbnail with 16:9 aspect ratio (`aspect-video`)
- Use `object-cover` to fill the card (may crop edges)
- Subtle hover zoom effect (5% scale with 300ms transition)

### History

- **2026-04-28** — Created branch `feature/image-gallery-view`. Added `ImageThumbnailCard` component to `src/components/items/ItemsListContent.tsx` (16:9 `aspect-video` thumbnail, `object-cover`, 5% hover scale with 300ms transition, image proxied through `/api/files/${item.fileUrl}`, fallback icon when no `fileUrl`, title + description below). Added `isImageGallery` flag (detects `typeLabel === 'images'`) to switch between a 3-column thumbnail grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`) and the existing 2-column item card grid. `tsc --noEmit` passes clean.
- **2026-04-28** — Merged into main. Feature complete.

## File Upload with Cloudflare R2

### Status

Completed

### Goals

- Create upload API route for R2
- Stick to `lib/db/items.ts` for Prisma/DB functions
- Create `FileUpload` component with drag-and-drop
- Update create item modal to use `FileUpload` for file/image types
- Delete files from R2 when items are deleted
- Create download proxy API route (avoids CORS issues)
- Add download button in `ItemDrawer` for file types
- Show upload progress indicator
- Display image preview for images, file info for files

### History

- **2026-04-28** — Created branch `feature/file-upload-r2`. Installed `@aws-sdk/client-s3`. Created `src/lib/r2.ts` (S3Client pointed at R2 endpoint, `uploadToR2`, `deleteFromR2`, `getFromR2`). Created `app/api/upload/route.ts` (POST: auth, MIME/size validation — images 5 MB, files 10 MB — uploads to R2, returns `{ key, fileName, fileSize, mimeType }`). Created `app/api/files/[...key]/route.ts` (GET: auth, user-scoped key check, streams object from R2 with `Content-Disposition: inline`). Created `src/components/ui/FileUpload.tsx` (drag-and-drop zone, XHR upload with progress bar, object-URL image preview, file info card with clear button, exports `UploadResult` type). Updated `src/lib/db/items.ts`: added `fileUrl`, `fileName`, `fileSize` to `ItemWithType`, `CreateItemData`, `mapItem`, and `createItem`. Updated `src/actions/items.ts`: added `file`/`image` to `ALLOWED_TYPES` (→ `FILE` content type), Zod validates `fileKey` required for those types. Updated `src/components/items/NewItemDialog.tsx`: added File and Image type buttons; shows `<FileUpload>` for those types; `isValid` gates on upload completion. Updated `src/components/items/ItemDrawer.tsx`: view mode shows image preview + download link or file info card + download link; edit mode shows non-editable file name/size row. Updated `app/api/items/[id]/route.ts` DELETE: calls `deleteFromR2` before removing DB record. Updated `.env.example` with `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`. `tsc --noEmit` passes clean.
- **2026-04-28** — Merged into main. Feature complete.

## Markdown Editor

### Status

Completed

### Goals

- Create `MarkdownEditor` component with tabbed interface (Write/Preview)
- Replace Textarea with `MarkdownEditor` for notes and prompts only; keep `CodeEditor` for snippets and commands
- Use `react-markdown` with `remark-gfm` for GitHub Flavored Markdown support
- Match existing dark theme styling (`bg-[#1e1e1e]` container, `bg-[#2d2d2d]` header)
- Add copy button in header (same style as `CodeEditor`)
- Support both display (readonly) and edit modes
- In readonly mode, only show Preview tab; in edit mode, default to Write tab
- Fluid height with max 400px, matching `CodeEditor` behavior

### History

- **2026-04-28** — Created branch `feature/markdown-editor`. Installed `react-markdown` and `remark-gfm`. Created `src/components/ui/MarkdownEditor.tsx` (Write/Preview tabs, copy button with check feedback, auto-growing textarea min 100px max 400px via scrollHeight ref, `react-markdown` + `remark-gfm` for GFM preview, readonly mode shows Preview tab only, matching dark theme `bg-[#1e1e1e]`/`bg-[#2d2d2d]`). Added `.markdown-preview` CSS block to `app/globals.css` (h1–h6 sizing, inline/block code, lists, blockquotes with indigo accent, links, tables, hr, strong, em). Updated `src/components/items/NewItemDialog.tsx`: added `MARKDOWN_TYPES` set; note/prompt content now uses `<MarkdownEditor onChange>` instead of plain textarea. Updated `src/components/items/ItemDrawer.tsx`: added `MARKDOWN_TYPES` and `showMarkdown` derived flag; edit mode uses `<MarkdownEditor onChange>` and view mode uses `<MarkdownEditor readOnly>` for note/prompt types. `tsc --noEmit` passes clean.
- **2026-04-28** — Merged into main. Feature complete.

## Code Editor

### Status

Completed

### Goals

- Create `CodeEditor` component using Monaco Editor with dark theme
- Replace Textarea with `CodeEditor` for snippets and commands only; keep Textarea for notes, prompts, and other non-code types
- Add macOS-style window dots (red/yellow/green) in the editor header
- Add a quick copy button in the editor header
- Display the language label in the editor header next to the copy button
- Support both display (readonly) and edit modes
- Make editor height fluid with a max height of 400px and a styled scrollbar matching the theme

### History

- **2026-04-28** — Created branch `feature/code-editor`. Installed `@monaco-editor/react`. Created `src/components/ui/CodeEditor.tsx` (macOS traffic-light dots, language label, copy button with check feedback, Monaco Editor with `vs-dark` theme, no minimap, word wrap, fluid height via `onDidContentSizeChange` min 100px max 360px, 6px themed scrollbar, readonly mode with line numbers off). Updated `src/components/items/ItemDrawer.tsx`: display mode replaces `<pre>` block with `<CodeEditor readOnly>` for snippet/command; edit mode replaces content textarea with `<CodeEditor onChange>`. Updated `src/components/items/NewItemDialog.tsx`: snippet/command content textarea replaced with `<CodeEditor onChange>`. Notes, prompts, and links keep plain textarea. `tsc --noEmit` passes clean.
- **2026-04-28** — Merged into main. Feature complete.

# Previous Features

## Item Create

### Status

Completed

### Goals

- Use shadcn Dialog component, opened from "New Item" button in top bar
- Type selector: snippet, prompt, command, note, link
- Fields shown based on selected type:
  - All types: title (required), description, tags
  - snippet/command: content, language
  - prompt/note: content
  - link: URL (required)
- Server action `createItem` with Zod validation
- Query function `createItem` in `lib/db/items.ts`
- Toast on success, close modal and refresh list

### History

- **2026-04-28** — Created branch `feature/item-create`. Added `CreateItemData` type, `createItem(userId, data)` query, and `getItemTypeByName(name)` helper to `src/lib/db/items.ts`. Added `createItem` server action to `src/actions/items.ts` (Zod validation, `CONTENT_TYPE_MAP` snippet/prompt/command/note→TEXT, link→URL, URL required+valid for link type). Created `src/components/items/NewItemDialog.tsx` (client: type selector buttons, shared fields title/description/tags, conditional content for non-link types, language for snippet/command, URL for link, resets on close, toast + router.refresh on success). Updated `src/components/dashboard/TopBar.tsx` with `onNewItem` prop wired to "New" button. Updated `src/components/dashboard/DashboardShell.tsx` to hold `newItemOpen` state and render `<NewItemDialog>`. `tsc --noEmit` passes clean.
- **2026-04-28** — Merged into main. Feature complete.

## Item Drawer

### Status

Completed

### Goals

- Use shadcn Sheet component, opens from the right
- Clicking an ItemCard opens the drawer with that item's full data
- Works on both dashboard and items list pages
- Action bar with Favorite (star, yellow when active), Pin, Copy, Edit (pencil), and Delete (trash, right-aligned)
- Client wrapper component to manage drawer state (pages are server components)
- Fetch full item detail on click via `/api/items/[id]` (no page navigation)
- Show skeleton/loading state while fetching
- Card data stays server-fetched; only full detail is client-fetched on open

### History

- **2026-04-28** — Created branch `feature/item-drawer`. Installed shadcn Sheet component (Base UI variant). Added `getItemById(id, userId)` to `src/lib/db/items.ts` (scoped to user). Created `app/api/items/[id]/route.ts` (GET: auth check, returns item JSON, 401/404 on error). Created `src/components/items/ItemDrawer.tsx` (client: controlled Sheet, fetches on itemId change, skeleton loading, action bar with Favorite/Pin/Copy/Edit/Delete, content + metadata display). Converted `src/components/items/ItemsListContent.tsx` to client component — added drawer state + onClick on each card. Converted `src/components/dashboard/MainContent.tsx` to client component — added drawer state + onClick on PinnedItemCard and RecentItemRow. `tsc --noEmit` passes clean.
- **2026-04-28** — Merged into main. Feature complete.

## Items List View

### Status

Completed

### Goals

- Create dynamic route `/items/[type]` (e.g., `/items/snippets`, `/items/notes`)
- Fetch and display items filtered by type
- Responsive grid of ItemCard components
- Two columns on medium and up
- Each card has left border colored by item type
- Follow existing codebase patterns

### History

- **2026-04-24** — Created branch `feature/item-list-view`. Added `getItemsByTypeName` to `src/lib/db/items.ts` (filters by `itemType.name`, ordered by `updatedAt desc`). Created `src/components/items/ItemsListContent.tsx` (2-column responsive grid, each card with `border-l-4` colored by item type, empty state, item count subtitle). Created `app/items/[type]/page.tsx` (server component: converts plural slug to singular via `PLURAL_TO_SINGULAR` map, 404s on unknown type, auth-protected redirect, fetches all data in parallel, renders inside `DashboardShell`). `tsc --noEmit` passes clean.
- **2026-04-24** — Merged into main. Feature complete.

## Rate Limiting for Auth

### Status

Completed

### Goals

- Add rate limiting to `/api/auth/callback/credentials` (5 attempts / 15 min, keyed by IP + email)
- Add rate limiting to `/api/auth/register` (3 attempts / 1 hour, keyed by IP)
- Add rate limiting to `/api/auth/forgot-password` (3 attempts / 1 hour, keyed by IP)
- Add rate limiting to `/api/auth/reset-password` (5 attempts / 15 min, keyed by IP)
- Add rate limiting to `/api/auth/resend-verification` (3 attempts / 15 min, keyed by IP + email)
- Create reusable `src/lib/rate-limit.ts` utility using Upstash Redis + `@upstash/ratelimit`
- Return 429 responses with `Retry-After` header and user-friendly message
- Display rate limit errors on the frontend
- Fail open if Upstash is unavailable

### History

- **2026-04-20** — Created branch `feature/rate-limiting-auth`. Installed `@upstash/ratelimit` and `@upstash/redis`. Created `src/lib/rate-limit.ts` (5 pre-configured sliding-window Ratelimit instances, `getIP` helper, `rateLimit` wrapper with fail-open catch). Added login rate limiting to `src/auth.ts` via custom `RateLimitError extends CredentialsSignin` (code `"rate_limit"`, keyed by IP + email). Added IP-keyed rate limiting to `app/api/register/route.ts`, `app/api/auth/forgot-password/route.ts`, `app/api/auth/reset-password/route.ts`. Created `app/api/auth/resend-verification/route.ts` (IP + email keyed, always returns success). Updated `app/sign-in/sign-in-form.tsx` to show rate limit message on `result.code === "rate_limit"`. Updated `app/forgot-password/page.tsx` to surface API error. Converted `app/verify-email/page.tsx` to client component with resend form. Updated sign-out `callbackUrl` to `/dashboard`. Updated `.env.example` with Upstash vars. `tsc --noEmit` passes clean.
- **2026-04-20** — Merged into main. Feature complete.

## Profile Page

### Status

Completed

### Goals

- Create profile page at `/profile` route (protected)
- Display user info: email, name, avatar (GitHub image or initials fallback), account creation date
- Show usage stats: total items, total collections, item type breakdown (snippets, prompts, notes, commands, links, files, images)
- Add "Change password" action — email/password users only (hidden for GitHub OAuth users)
- Add "Delete account" action with confirmation dialog to prevent accidental deletion

### History

- **2026-04-20** — Created branch `feature/profile-page`. Created `src/lib/db/profile.ts` (`getProfileData`, `getProfileStats` — scoped to userId, includes `isOAuthUser` check via accounts relation). Created `app/api/profile/change-password/route.ts` (POST: validates current password with bcrypt, hashes new, updates user; email users only). Created `app/api/profile/delete-account/route.ts` (DELETE: deletes user by session id). Created `src/components/profile/ProfileContent.tsx` (client: user info card with avatar, stats section with type breakdown, actions section with ChangePasswordDialog hidden for OAuth users and DeleteAccountDialog with confirmation). Created `app/profile/page.tsx` (server component: auth-protected, fetches all data in parallel, renders inside DashboardShell). `tsc --noEmit` passes clean.
- **2026-04-20** — Merged into main. Feature complete.

## Forgot Password

### Status

Completed

### Goals

- Add "Forgot password?" link on `/sign-in` → `/forgot-password`
- Create `/forgot-password` page: email form, POST to `/api/auth/forgot-password`
- `POST /api/auth/forgot-password`: store `password-reset:{email}` token in `VerificationToken` (1h expiry), send reset email via Resend; always return success (no email enumeration)
- Create `/reset-password` page: read `?token=` from URL, new-password + confirm form
- `POST /api/auth/reset-password`: validate token, check expiry, bcrypt-hash new password, update `User.password`, delete token
- Redirect to `/sign-in?reset=1` with success banner; reuse `VerificationToken` model, no schema changes

### History

- **2026-04-20** — Created branch `feature/forgot-password`. Added `sendPasswordResetEmail` to `src/lib/email.ts`. Created `app/api/auth/forgot-password/route.ts` (POST: stores `password-reset:{email}` token in `VerificationToken`, expires 1h, sends reset email; always returns success to avoid email enumeration). Created `app/api/auth/reset-password/route.ts` (POST: validates token, checks expiry, hashes new password with bcrypt, updates `User.password`, deletes token, returns success). Created `app/forgot-password/page.tsx` (email form with post-submit success state). Created `app/reset-password/page.tsx` (reads `?token=` via `useSearchParams`, new-password + confirm form). Updated `app/sign-in/page.tsx` + `sign-in-form.tsx` to pass `reset` prop and render success banner on `?reset=1`. Added "Forgot password?" link below sign-in button. `tsc --noEmit` passes clean.
- **2026-04-20** — Merged into main. Feature complete.

## Email Verification on Register

### Status

Completed

### Goals

- After `POST /api/auth/register` succeeds, generate a secure token, store it in `VerificationToken` (identifier = email, expires = 24h), and send a verification email via Resend with a `/api/auth/verify-email?token=...` link
- Create `GET /api/auth/verify-email` route: validate token exists and is not expired, set `User.emailVerified = now()`, delete the token, redirect to `/sign-in?verified=1`
- On the `/sign-in` page, detect `?verified=1` and show a success toast/message ("Email verified — you can now sign in")
- After registration, redirect to a `/verify-email` page (instead of directly to sign-in) telling the user to check their inbox
- Install and use the `resend` npm package for sending email; use `RESEND_API_KEY` already in `.env`

### Notes

- Resend `onboarding@resend.dev` sandbox only delivers to the Resend account owner's email. Set `EMAIL_FROM` in `.env` to a verified domain address to send to any recipient.

### History

- **2026-04-20** — Created branch `feature/email-verification-on-register`. Installed `resend`. Created `src/lib/email.ts` (Resend client + `sendVerificationEmail` helper using `RESEND_API_KEY` and `NEXTAUTH_URL`). Updated `app/api/register/route.ts` to generate a `crypto.randomUUID()` token, store it in `VerificationToken` (expires 24h), and send verification email after user creation. Created `app/api/auth/verify-email/route.ts` (GET: validates token, checks expiry, sets `User.emailVerified`, deletes token, redirects to `/sign-in?verified=1`). Created `app/verify-email/page.tsx` (holding page: "check your inbox"). Updated `app/register/page.tsx` to redirect to `/verify-email` on success. Updated `app/sign-in/page.tsx` + `sign-in-form.tsx` to pass and render a success banner on `?verified=1`. `tsc --noEmit` passes clean.
- **2026-04-20** — Merged into main. Feature complete.

# Previous Features

## Auth UI - Sign In, Register & Sign Out

### Status

Completed

### Goals

- Create custom `/sign-in` page with email/password fields, "Sign in with GitHub" button, and link to register
- Create custom `/register` page with name, email, password, confirm password fields; submit to `/api/auth/register`; redirect to sign-in on success
- Update bottom of sidebar to show user avatar (GitHub image or initials fallback), user name, and dropdown with "Sign out" link
- Clicking sidebar avatar/icon navigates to `/profile`
- Create reusable avatar component handling both GitHub image and initials cases

### Notes

See full spec at `context/features/auth-spec-files/auth-phase-3-spec.md`.

### History

- **2026-04-20** — Loaded spec from `context/features/auth-spec-files/auth-phase-3-spec.md`.
- **2026-04-20** — Created branch `feature/auth-ui-sign-in-register-sign-out`. Updated `src/auth.config.ts` with `pages: { signIn: '/sign-in' }`. Updated `src/proxy.ts` to redirect to `/sign-in`. Created `app/sign-in/page.tsx` (client, credentials form + GitHub OAuth button). Created `app/register/page.tsx` (client, full registration form → POST `/api/auth/register` → redirect to sign-in). Created `src/components/ui/UserAvatar.tsx` (GitHub image or initials fallback). Updated `app/dashboard/page.tsx` to fetch session via `auth()` and pass user to DashboardShell. Updated `src/components/dashboard/DashboardShell.tsx` to accept and forward user prop. Rewrote `src/components/dashboard/Sidebar.tsx` footer: real user data, UserAvatar, chevron-toggled dropdown with "Sign out" action; avatar in collapsed mode links to `/profile`. `tsc --noEmit` passes clean.
- **2026-04-20** — Merged into main. Feature complete.

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

## Add Item to Collections

### Status

Completed

### Goals

- Add `getCollectionsForSelect(userId)` DB helper for dropdowns
- Extend `ItemWithType` with `collections` array
- Update `createItem` and `updateItem` to sync `ItemCollection` junction records
- Create `CollectionSelector` multi-select component (Popover + Command)
- Integrate collection selection into `NewItemDialog` and `ItemDrawer`
- Thread collections prop through `DashboardShell`, `ItemsListContent`, `MainContent`
- Fetch collections in parallel on dashboard and items list pages

### History

- **2026-04-29** — Created branch `feature/add-item-to-collections`. Added `getCollectionsForSelect` to `src/lib/db/collections.ts`. Extended `ItemWithType` in `src/lib/db/items.ts` with `collections` array and updated `createItem`/`updateItem` to sync `ItemCollection` records via `deleteMany` + `createMany`. Updated `getItemById` to include collections relation. Added `collectionIds` to Zod schemas in `src/actions/items.ts`. Created `src/components/collections/CollectionSelector.tsx` (shadcn Popover + Command checkbox multi-select with summary badge). Integrated `CollectionSelector` into `NewItemDialog` and `ItemDrawer`. Threaded `collections` prop through `DashboardShell`, `ItemsListContent`, and `MainContent`. Fetched `getCollectionsForSelect` in parallel on `app/dashboard/page.tsx` and `app/items/[type]/page.tsx`. Installed shadcn `command`, `popover`, and `input-group` components. `tsc --noEmit` passes clean.
- **2026-04-29** — Merged into main. Feature complete.
