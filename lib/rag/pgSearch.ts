import { getPool } from '../db'
import type { Listing } from '../data'

interface ListingRow {
  id: string
  title: string
  price: string // numeric comes back as string from pg
  currency: string
  category: string
  seller: string
  location: string
  image: string
  condition: string
  score?: string
}

function rowToListing(row: ListingRow): Listing & { score?: number } {
  return {
    id: row.id,
    title: row.title,
    price: Number(row.price),
    currency: row.currency,
    category: row.category,
    seller: row.seller,
    location: row.location,
    image: row.image,
    condition: row.condition,
    liked: false,
    ...(row.score !== undefined ? { score: Number(row.score) } : {}),
  }
}

/** All listings, straight from Postgres — used by GET /api/listings. */
export async function getAllListingsFromDb(): Promise<Listing[]> {
  const pool = getPool()
  const { rows } = await pool.query<ListingRow>(
    `SELECT id, title, price, currency, category, seller, location, image, condition
     FROM listings ORDER BY created_at DESC`
  )
  return rows.map(rowToListing)
}

/**
 * Ranks listings by cosine similarity to a query embedding using pgvector's
 * <=> operator. This is the real-database equivalent of
 * lib/rag/vectorStore.ts's in-memory version — same shape, same caller
 * contract, just backed by an index instead of a JS array.
 */
export async function semanticSearchDb(
  queryEmbedding: number[],
  limit = 20
): Promise<(Listing & { score: number })[]> {
  const pool = getPool()
  const vectorLiteral = `[${queryEmbedding.join(',')}]`

  const { rows } = await pool.query<ListingRow>(
    `SELECT id, title, price, currency, category, seller, location, image, condition,
            1 - (embedding <=> $1) AS score
     FROM listings
     WHERE embedding IS NOT NULL
     ORDER BY embedding <=> $1
     LIMIT $2`,
    [vectorLiteral, limit]
  )

  return rows.map(r => rowToListing(r) as Listing & { score: number })
}
