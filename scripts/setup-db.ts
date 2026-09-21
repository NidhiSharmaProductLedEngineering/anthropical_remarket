/**
 * One-time (and re-runnable) setup for the Postgres-backed listings table:
 *   1. Applies db/schema.sql (creates the pgvector extension + listings table)
 *   2. Upserts every listing from lib/data.ts into Postgres
 *   3. Embeds each listing with Voyage AI and stores the vector
 *
 * Requires DATABASE_URL (Neon or any Postgres with pgvector) and
 * VOYAGE_API_KEY to be set — see .env.example and docs/DATABASE_SETUP.md.
 *
 * Run:
 *   npm run db:setup
 *
 * Safe to re-run — INSERT uses ON CONFLICT DO UPDATE, so this doubles as
 * the "sync listings + re-embed" command whenever lib/data.ts changes.
 */

import 'dotenv/config'
import { readFileSync } from 'fs'
import path from 'path'
import { getPool } from '../lib/db'
import { allListings, type Listing } from '../lib/data'
import { embedBatch } from '../lib/rag/embeddings'

function listingToText(listing: Listing): string {
  return [
    listing.title,
    `Category: ${listing.category}`,
    `Condition: ${listing.condition}`,
    `Sold by ${listing.seller} in ${listing.location}`,
  ].join('. ')
}

async function main() {
  const pool = getPool()

  console.log('Applying schema...')
  const schema = readFileSync(path.join(__dirname, '../db/schema.sql'), 'utf-8')
  // Strip the trailing example query comment block so it doesn't get executed.
  const executable = schema.split('-- Example production query')[0]
  await pool.query(executable)

  console.log(`Embedding ${allListings.length} listings with Voyage AI...`)
  const texts = allListings.map(listingToText)
  const embeddings = await embedBatch(texts)

  console.log('Upserting listings + embeddings into Postgres...')
  for (let i = 0; i < allListings.length; i++) {
    const l = allListings[i]
    const vectorLiteral = `[${embeddings[i].join(',')}]`

    await pool.query(
      `INSERT INTO listings (id, title, price, currency, category, seller, location, image, condition, embedding)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (id) DO UPDATE SET
         title = EXCLUDED.title,
         price = EXCLUDED.price,
         currency = EXCLUDED.currency,
         category = EXCLUDED.category,
         seller = EXCLUDED.seller,
         location = EXCLUDED.location,
         image = EXCLUDED.image,
         condition = EXCLUDED.condition,
         embedding = EXCLUDED.embedding`,
      [l.id, l.title, l.price, l.currency, l.category, l.seller, l.location, l.image, l.condition, vectorLiteral]
    )
  }

  console.log(`Done. ${allListings.length} listings synced to Postgres with embeddings.`)
  await pool.end()
}

main().catch(err => {
  console.error('Database setup failed:', err.message)
  process.exit(1)
})
