import { NextRequest, NextResponse } from 'next/server'
import { allListings } from '@/lib/data'
import { embedQuery } from '@/lib/rag/embeddings'
import { search, hasEmbeddings } from '@/lib/rag/vectorStore'

/**
 * POST /api/search
 * Body: { query: string, limit?: number }
 *
 * Semantic (RAG) product search:
 *   1. Embed the user's natural-language query with Voyage AI
 *   2. Rank cached listing embeddings by cosine similarity
 *   3. Return listings in ranked order with their similarity score
 *
 * Falls back to a 200 with a `fallback: true` flag (instead of erroring)
 * if VOYAGE_API_KEY isn't configured or embeddings haven't been generated
 * yet, so the UI can gracefully drop back to keyword search.
 */
export async function POST(req: NextRequest) {
  try {
    const { query, limit = 20 } = await req.json()

    if (!query || typeof query !== 'string' || !query.trim()) {
      return NextResponse.json({ error: 'query is required' }, { status: 400 })
    }

    if (!process.env.VOYAGE_API_KEY || !hasEmbeddings()) {
      return NextResponse.json({
        fallback: true,
        reason: !process.env.VOYAGE_API_KEY
          ? 'VOYAGE_API_KEY not configured'
          : 'No embeddings cached — run `npm run embed`',
        results: [],
      })
    }

    const queryEmbedding = await embedQuery(query)
    const ranked = search(queryEmbedding, limit)

    // Join ranked ids back to full listing objects, preserving rank order
    const listingsById = new Map(allListings.map(l => [l.id, l]))
    const results = ranked
      .map(r => {
        const listing = listingsById.get(r.id)
        return listing ? { ...listing, score: r.score } : null
      })
      .filter(Boolean)

    return NextResponse.json({ fallback: false, results })
  } catch (err: any) {
    console.error('Search error:', err)
    return NextResponse.json(
      { error: 'Search failed', fallback: true, results: [] },
      { status: 500 }
    )
  }
}
