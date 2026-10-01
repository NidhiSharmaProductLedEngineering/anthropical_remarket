import { getPool } from '../db'
import type { Listing } from '../data'

interface ListingRow {
  id: string
  title: string
  price: string
  currency: string
  category: string
  seller: string
  seller_id: number | null
  location: string
  image: string
  condition: string
  score?: string
}

function rowToListing(row: ListingRow): Listing & { score?: number } {
  return {
    id: row.id, title: row.title, price: Number(row.price), currency: row.currency,
    category: row.category, seller: row.seller, sellerId: row.seller_id,
    location: row.location, image: row.image, condition: row.condition, liked: false,
    ...(row.score !== undefined ? { score: Number(row.score) } : {}),
  }
}

export async function getAllListingsFromDb(): Promise<Listing[]> {
  const pool = getPool()
  const { rows } = await pool.query<ListingRow>(
    `SELECT id, title, price, currency, category, seller, seller_id, location, image, condition
     FROM listings ORDER BY created_at DESC`
  )
  return rows.map(rowToListing)
}

export async function getListingByIdFromDb(id: string): Promise<Listing | null> {
  const pool = getPool()
  const { rows } = await pool.query<ListingRow>(
    `SELECT id, title, price, currency, category, seller, seller_id, location, image, condition
     FROM listings WHERE id = $1`,
    [id]
  )
  return rows[0] ? rowToListing(rows[0]) : null
}

export async function semanticSearchDb(queryEmbedding: number[], limit = 20): Promise<(Listing & { score: number })[]> {
  const pool = getPool()
  const vectorLiteral = `[${queryEmbedding.join(',')}]`
  const { rows } = await pool.query<ListingRow>(
    `SELECT id, title, price, currency, category, seller, seller_id, location, image, condition,
            1 - (embedding <=> $1) AS score
     FROM listings WHERE embedding IS NOT NULL
     ORDER BY embedding <=> $1 LIMIT $2`,
    [vectorLiteral, limit]
  )
  return rows.map(r => rowToListing(r) as Listing & { score: number })
}

export async function createListingInDb(input: {
  id: string; title: string; price: number; currency: string; category: string;
  seller: string; sellerId: number; location: string; image: string; condition: string;
  embedding: number[] | null
}): Promise<Listing> {
  const pool = getPool()
  const vectorLiteral = input.embedding ? `[${input.embedding.join(',')}]` : null
  const { rows } = await pool.query<ListingRow>(
    `INSERT INTO listings (id, title, price, currency, category, seller, seller_id, location, image, condition, embedding)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
     RETURNING id, title, price, currency, category, seller, seller_id, location, image, condition`,
    [input.id, input.title, input.price, input.currency, input.category, input.seller, input.sellerId, input.location, input.image, input.condition, vectorLiteral]
  )
  return rowToListing(rows[0])
}
