/**
 * Precomputes embeddings for every listing in lib/data.ts and writes them
 * to lib/rag/embeddings-data.json.
 *
 * Run this once whenever listings change:
 *   npm run embed
 *
 * In production with a real database, this logic would run as a migration
 * / background job that writes vectors into a pgvector column instead of
 * a JSON file — see db/schema.sql for that shape.
 */

import 'dotenv/config'
import { writeFileSync } from 'fs'
import path from 'path'
import { allListings, type Listing } from '../lib/data'
import { embedBatch } from '../lib/rag/embeddings'

function listingToText(listing: Listing): string {
  // What actually gets embedded: title + category + condition + seller.
  // This is the "document" side of RAG — richer text here means better
  // recall for natural-language queries like "elegant vintage jewelry".
  return [
    listing.title,
    `Category: ${listing.category}`,
    `Condition: ${listing.condition}`,
    `Sold by ${listing.seller} in ${listing.location}`,
  ].join('. ')
}

async function main() {
  console.log(`Embedding ${allListings.length} listings with Voyage AI...`)

  const texts = allListings.map(listingToText)
  const embeddings = await embedBatch(texts)

  const output = allListings.map((listing, i) => ({
    id: listing.id,
    embedding: embeddings[i],
  }))

  const outPath = path.join(__dirname, '../lib/rag/embeddings-data.json')
  writeFileSync(outPath, JSON.stringify(output, null, 2))

  console.log(`Wrote ${output.length} embeddings to ${outPath}`)
}

main().catch(err => {
  console.error('Failed to generate embeddings:', err.message)
  process.exit(1)
})
