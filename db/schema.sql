-- Production schema for ReMarket.

CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS listings (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  price       NUMERIC(10, 2) NOT NULL,
  currency    TEXT NOT NULL DEFAULT 'Dhs',
  category    TEXT NOT NULL,
  seller      TEXT NOT NULL,
  seller_id   INTEGER REFERENCES users(id) ON DELETE SET NULL,
  location    TEXT NOT NULL,
  image       TEXT NOT NULL,
  condition   TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  embedding   VECTOR(512)
);

-- Safe to run against an already-existing listings table from before
-- seller_id existed — seed/demo listings keep seller_id = NULL, and the
-- UI disables "Contact Seller" for those rather than pretending there's
-- someone real to message.
ALTER TABLE listings ADD COLUMN IF NOT EXISTS seller_id INTEGER REFERENCES users(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS messages (
  id          SERIAL PRIMARY KEY,
  listing_id  TEXT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  sender_id   INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  body        TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  read_at     TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS messages_listing_idx ON messages (listing_id);
CREATE INDEX IF NOT EXISTS messages_participants_idx ON messages (sender_id, receiver_id);

CREATE INDEX IF NOT EXISTS listings_embedding_idx ON listings
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- Example production search query, replacing lib/rag/vectorStore.ts's
-- in-memory cosine similarity loop:
--
-- SELECT id, title, price, currency, category, seller, seller_id, location, image, condition,
--        1 - (embedding <=> $1) AS score
-- FROM listings
-- ORDER BY embedding <=> $1
-- LIMIT $2;
