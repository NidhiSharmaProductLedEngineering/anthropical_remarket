-- Production schema for ReMarket, including pgvector for semantic search.
--
-- This project currently runs on static data + a JSON embeddings cache
-- (see lib/rag/vectorStore.ts) because there's no database wired up yet.
-- This file is the target schema for when listings move to Postgres —
-- at that point, lib/rag/vectorStore.ts's search() function gets replaced
-- with the query below and nothing else in the RAG pipeline changes.

CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE listings (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  price       NUMERIC(10, 2) NOT NULL,
  currency    TEXT NOT NULL DEFAULT 'Dhs',
  category    TEXT NOT NULL,
  seller      TEXT NOT NULL,
  location    TEXT NOT NULL,
  image       TEXT NOT NULL,
  condition   TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- voyage-3-lite outputs 512-dimension embeddings
  embedding   VECTOR(512)
);

-- Approximate nearest-neighbor index for fast cosine similarity search
-- at scale. IVFFlat is fine up to ~1M rows; HNSW is the upgrade path
-- beyond that.
CREATE INDEX listings_embedding_idx ON listings
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- Example production query, replacing lib/rag/vectorStore.ts's
-- in-memory cosine similarity loop:
--
-- SELECT id, title, price, currency, category, seller, location, image, condition,
--        1 - (embedding <=> $1) AS score
-- FROM listings
-- ORDER BY embedding <=> $1
-- LIMIT $2;
--
-- ($1 = query embedding as a vector literal, $2 = result limit)
