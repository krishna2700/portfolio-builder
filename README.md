# Portfolio Builder

A multi-tenant SaaS where anyone can sign up, upload their resume, pick a theme, and get a live
portfolio at their own `yoursite.com/their-name` link — no coding required.

**What it does, end to end:**
1. A user signs up with email + password.
2. They pick a username — that becomes their public URL (`/username`).
3. They upload a PDF resume (and optionally a photo). An LLM (OpenAI) reads the resume and
   extracts structured content: name, title, bio, work experience, projects, and skills.
4. They review/correct the AI-extracted fields.
5. They pick one of 12 themes (each with its own color palette, font pairing, and background
   animation).
6. Their portfolio goes live immediately at `/username` — a full Hero/About/Experience/Work/Skills/Contact
   page rendered in their chosen theme.
7. They can log back into `/dashboard` any time to edit content, change their theme, or copy their
   link.

This repo is a sibling project to [krishna2700/portfolio](https://github.com/krishna2700/portfolio)
and [krishna2700/pal-portfolio](https://github.com/krishna2700/pal-portfolio) — those are two
individual, hand-built portfolios; this one is the *generator* that lets anyone build their own.

## Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **UI:** Tailwind CSS v4, Framer Motion, canvas-based background animations
- **Database:** PostgreSQL via [Neon](https://neon.tech) (serverless driver) + Prisma ORM
- **File storage:** Neon Object Storage (S3-compatible) for uploaded resumes and photos
- **Auth:** Email + password, JWT session cookie (`jose`), bcrypt-hashed passwords
- **AI:** OpenAI (`gpt-4o-mini`) with structured JSON-schema output, for resume → structured content

## How the multi-tenancy works

- `User` — one row per signed-up account (email + hashed password).
- `Portfolio` — one row per user (1:1), holding their `slug` (the `/username` part of the URL),
  their chosen `themeId`, and a single `content` JSON column with everything extracted from their
  resume (hero, about, experience, projects, skill tiers).
- `Theme` — 12 seeded rows, each a self-contained design: a color palette, a font pairing (loaded
  dynamically from Google Fonts), and a background animation key.
- The dynamic route `src/app/[slug]/page.tsx` looks up a `Portfolio` by slug, resolves its `Theme`,
  and renders one shared set of section components (`src/components/portfolio/*`) with that
  theme's CSS variables and animation — so "12 themes" means 12 color/font/animation combinations
  rendered through one well-built layout, not 12 separately hand-built pages.

Reserved names (`api`, `admin`, `login`, etc. — see `src/lib/slug.ts`) can't be claimed as usernames
so they never collide with the app's own routes.

## Prerequisites

- Node.js 20+
- A Postgres database — a free [Neon](https://neon.tech) project (this was built/tested against one,
  with **Object Storage** also enabled on the same project for file uploads)
- An [OpenAI API key](https://platform.openai.com/api-keys) — required for the resume-parsing step

## Setup

### 1. Install dependencies

```bash
npm install --legacy-peer-deps
```

### 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

| Variable | What it's for |
|---|---|
| `DATABASE_URL` | Pooled Postgres connection string (app runtime) |
| `DIRECT_URL` | Direct (non-pooled) Postgres connection string (Prisma Migrate) |
| `AWS_ENDPOINT_URL_S3`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `S3_BUCKET` | Neon Object Storage credentials — where uploaded resumes/photos are stored. Create a **Public** visibility bucket so uploaded files are viewable at their URL. |
| `AUTH_JWT_SECRET` | Random secret signing user session JWTs — generate with `openssl rand -hex 32` |
| `NEXTAUTH_URL` | `http://localhost:3000` for local dev |
| `OPENAI_API_KEY` | Powers the resume → structured-content extraction. Without it, the "upload resume" step in onboarding will fail with a clear error. |

**Getting a Neon database + object storage (if you don't have one yet):**
1. Create a free project at [console.neon.tech](https://console.neon.tech).
2. When creating the project, also enable **Object storage** and set a bucket's visibility to
   **Public** (anonymous read of uploaded files — needed so resumes/photos are viewable at their URL).
3. Copy the pooled connection string into `DATABASE_URL`, the direct one into `DIRECT_URL`, and the
   generated S3 credentials into the `AWS_*` / `S3_BUCKET` variables.

Prisma also reads env vars via `dotenv/config` (see `prisma.config.ts`), which only loads a plain
`.env` file, not `.env.local`. So **also copy `.env.local` to `.env`** before running any `prisma`
commands:

```bash
cp .env.local .env
```

(`.env` is gitignored, same as `.env.local` — this is just a local convenience step.)

### 3. Set up the database

```bash
npx prisma migrate deploy   # creates User, Portfolio, Theme tables
npx prisma generate         # generates the Prisma client
npm run seed:themes         # seeds the 12 built-in themes
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). If port 3000 is already in use, Next.js picks
the next free port automatically — check the terminal output for the actual URL.

## Using it end to end (as a visitor creating their own portfolio)

1. Go to `/` and click **Create your portfolio**.
2. **Sign up** with an email and password (`/signup`).
3. You're redirected to **`/onboarding`**, a 5-step wizard:
   - **Step 1 — Pick a name.** Type a username; it's checked for availability live as you type.
     This becomes your public link, `/your-name`.
   - **Step 2 — Upload your resume.** A PDF is required; a profile photo is optional. Clicking
     Continue sends the PDF to the server, which extracts its text and asks OpenAI to turn it into
     structured fields (name, title, bio, experience, projects, skills).
   - **Step 3 — Review your details.** The AI-extracted name, title, tagline, bio, email, location,
     GitHub, and LinkedIn are shown in editable fields — fix anything that's wrong. (Experience,
     projects, and skills are parsed too; fine-tune those later from the dashboard.)
   - **Step 4 — Pick a theme.** A grid of all 12 themes with a color swatch and animation name;
     click one to select it.
   - **Step 5 — Preview & publish.** A live, full-size preview of your actual portfolio in the
     chosen theme. Click **Publish my portfolio** to go live.
4. You land on **`/dashboard`**, where you can see and copy your public link
   (`yoursite.com/your-name`), open it live, edit your core content fields, switch themes, and save
   changes.
5. Your portfolio is now live for anyone at `/your-name` — no login required to view it.

## What's not included (by design, to keep scope tractable)

- A contact-form backend per generated portfolio (the Contact section links directly to `mailto:`
  instead).
- Deep editing of experience/projects/skill-tier lists from the dashboard (currently: name, title,
  tagline, bio, email, location, and theme). Extending the dashboard form to cover the rest of
  `PortfolioContent` (see `src/lib/content.ts`) is a natural next step.
- Deployment config/instructions — **this project has not been deployed anywhere yet.** When you're
  ready: import into Vercel, add all env vars from `.env.local`, and run
  `npx prisma migrate deploy` once against the production `DIRECT_URL` before the first request hits
  a fresh database.

## Project structure

| Path | What it is |
|---|---|
| `src/app/page.tsx` | Landing page |
| `src/app/signup`, `src/app/login` | Auth pages |
| `src/app/onboarding` | The 5-step resume → portfolio wizard |
| `src/app/dashboard` | Logged-in user's content/theme editor |
| `src/app/[slug]/page.tsx` | The public portfolio page for a given username |
| `src/app/api/*` | Auth, portfolio CRUD, resume parsing, and theme-list REST routes |
| `src/components/portfolio/*` | Shared, theme-driven section components (Hero, About, Experience, Projects, Skills, Contact) used by both the public page and the onboarding/live preview |
| `src/components/animations/*` | The 6 background-animation components (grid, neural, particles, orbit, matrix, minimal) shared across the 12 themes |
| `src/lib/themes.ts` | The 12 theme definitions (colors, fonts, animation) |
| `src/lib/content.ts` | The Zod schema for a portfolio's structured content |
| `src/lib/resumeParser.ts` | PDF text extraction + OpenAI structured-output call |
| `prisma/schema.prisma` | DB schema: `User`, `Portfolio`, `Theme` |
| `prisma/seed-themes.ts` | Seeds the 12 built-in themes (`npm run seed:themes`) |
