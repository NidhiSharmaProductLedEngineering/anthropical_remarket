/**
 * Vector store — in-memory cosine similarity search.
 *
 * This project has no database yet, so embeddings are precomputed once
 * (see scripts/generate-embeddings.ts) and cached to
 * lib/rag/embeddings-data.json, then loaded into memory at request time.
 *
 * This is intentionally the same shape a pgvector-backed store would use —
 * `search()` takes a query vector and returns ranked ids — so swapping this
 * file for a real Postgres + pgvector query later is a drop-in change.
 * See db/schema.sql for the equivalent production schema.
 */

import embeddingsData from './embeddings-data.json'

export interface EmbeddedListing {
  id: string
  embedding: number[]
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0
  let normA = 0
  let normB = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }
  if (normA === 0 || normB === 0) return 0
  return dot / (Math.sqrt(normA) * Math.sqrt(normB))
}

export interface RankedResult {
  id: string
  score: number
}

/**
 * Ranks all cached listing embeddings against a query embedding.
 * Returns results sorted by similarity, highest first.
 */
export function search(queryEmbedding: number[], limit = 20): RankedResult[] {
  const data = embeddingsData as EmbeddedListing[]

  return data
    .map(item => ({
      id: item.id,
      score: cosineSimilarity(queryEmbedding, item.embedding),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

export function hasEmbeddings(): boolean {
  return (embeddingsData as EmbeddedListing[]).length > 0
}
