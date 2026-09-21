# Database Setup (Neon Postgres, free)

ReMarket's listings and search index now run on a real Postgres database
with the pgvector extension — not a static array. [Neon](https://neon.tech)
is used here because it has a genuinely free tier (no credit card,
0.5 GB storage, always-on for a hobby project), pgvector is enabled by
default, and it works natively with Vercel deployments.

## Setup

1. **Create a free Neon project**
   - Go to https://neon.tech → sign up → "Create a project"
   - Name it `remarket`, pick a region close to you (e.g. `aws-me-central-1`
     if available, otherwise the nearest one)

2. **Copy your connection string**
   - In the Neon dashboard: Connection Details → copy the pooled connection
     string (starts with `postgresql://` and ends with `?sslmode=require`)
   - Paste it into `.env.local` as `DATABASE_URL`

3. **Run the setup script**
   ```bash
   npm install
   npm run db:setup
   ```
   This does three things in one pass:
   - Creates the `vector` extension and `listings` table (from `db/schema.sql`)
   - Seeds it with every listing from `lib/data.ts`
   - Embeds each listing with Voyage AI and stores the vector

   Re-running this command is safe — it upserts, so it also works as your
   "sync listings after editing `lib/data.ts`" command.

4. **Verify**
   ```bash
   npm run dev
   ```
   Open `/browse` — listings are now served from Postgres
   (`GET /api/listings`), and searching uses pgvector's `<=>` operator
   for ranking (`POST /api/search`), not the in-memory JSON cache.

## Deploying

Add `DATABASE_URL` and `VOYAGE_API_KEY` to your Vercel project's
Environment Variables (Project Settings → Environment Variables), then
redeploy. Neon's free tier handles this fine — no separate production
database needed for a project this size.

## What runs where

| Layer | Without DATABASE_URL | With DATABASE_URL |
|---|---|---|
| Listings | Static array (`lib/data.ts`) | Postgres `listings` table |
| Search | In-memory cosine similarity over `lib/rag/embeddings-data.json` (if `npm run embed` was run) | pgvector `<=>` operator, indexed |
| Setup needed | None | `npm run db:setup` once |

The static/JSON path still works with zero setup — that's intentional, so
the project degrades gracefully rather than breaking for anyone who clones
it without a database. But the deployed version should use Postgres.
