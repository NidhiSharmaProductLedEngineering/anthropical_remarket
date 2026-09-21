# Semantic Product Search (RAG)

Browse page search now supports natural-language queries — e.g. "elegant
vintage jewelry" or "something for a formal event" — in addition to plain
keyword matching.

## How it works

1. **Offline (once, or whenever listings change):** `npm run embed` reads
   every listing from `lib/data.ts`, embeds a text summary of each
   (title + category + condition + seller) using Voyage AI's
   `voyage-3-lite` model, and caches the vectors to
   `lib/rag/embeddings-data.json`.
2. **At request time:** `POST /api/search` embeds the user's query with the
   same model (tagged as a query rather than a document, for Voyage's
   asymmetric retrieval mode), then ranks all cached listing embeddings by
   cosine similarity in `lib/rag/vectorStore.ts`.
3. **On the client:** the browse page debounces the search input, calls
   `/api/search`, and swaps in the ranked results. If no API key is
   configured or nothing is cached yet, it falls back silently to the
   original substring match — the feature degrades gracefully rather than
   breaking the page.

## Why Voyage AI, not OpenAI

Anthropic recommends Voyage AI as the embeddings provider for Claude-based
RAG pipelines, since Claude itself doesn't expose an embeddings endpoint.
`voyage-3-lite` is inexpensive and fast enough to embed a query inline on
every search request.

## Setup

```bash
cp .env.example .env.local
# add your key from https://dash.voyageai.com to VOYAGE_API_KEY

npm install
npm run embed     # generates lib/rag/embeddings-data.json
npm run dev
```

## Path to production

This currently runs in-memory against a JSON file because the project has
no database yet. `db/schema.sql` defines the equivalent pgvector schema —
moving to Postgres means replacing the JSON cache with a table and
`lib/rag/vectorStore.ts`'s `search()` with the `ORDER BY embedding <=> $1`
query documented in that file. Nothing else in the pipeline changes.
