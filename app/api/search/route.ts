import { NextRequest, NextResponse } from 'next/server'
import { allListings } from '@/lib/data'
import { embedQuery } from '@/lib/rag/embeddings'
import { search as searchLocal, hasEmbeddings } from '@/lib/rag/vectorStore'
import { semanticSearchDb } from '@/lib/rag/pgSearch'
import { isDatabaseConfigured } from '@/lib/db'

/**
 * POST /api/search
 * Body: { query: string, limit?: number }
 *
 * Semantic (RAG) product search, in order of preference:
 *   1. Postgres + pgvector (if DATABASE_URL is set) — the production path
 *   2. In-memory JSON cache (if lib/rag/embeddings-data.json was generated
 *      via `npm run embed`) — for local dev without a database
 *   3. Graceful fallback flag if neither is available, so the UI can drop
 *      back to plain keyword search instead of erroring
 */
export async function POST(req: NextRequest) {
  try {
    const { query, limit = 20 } = await req.json()

    if (!query || typeof query !== 'string' || !query.trim()) {
      return NextResponse.json({ error: 'query is required' }, { status: 400 })
    }

    if (!process.env.VOYAGE_API_KEY) {
      return NextResponse.json({
        fallback: true,
        reason: 'VOYAGE_API_KEY not configured',
        results: [],
      })
    }

    // Path 1: Postgres + pgvector
    if (isDatabaseConfigured()) {
      try {
        const queryEmbedding = await embedQuery(query)
        const results = await semanticSearchDb(queryEmbedding, limit)
        if (results.length > 0) {
          return NextResponse.json({ fallback: false, source: 'postgres', results })
        }
        // DB configured but empty (setup script not run yet) — fall through
      } catch (dbErr: any) {
        console.error('Postgres search failed, falling back to local cache:', dbErr.message)
        // fall through to path 2
      }
    }

    // Path 2: in-memory JSON cache
    if (hasEmbeddings()) {
      const queryEmbedding = await embedQuery(query)
      const ranked = searchLocal(queryEmbedding, limit)
      const listingsById = new Map(allListings.map(l => [l.id, l]))
      const results = ranked
        .map(r => {
          const listing = listingsById.get(r.id)
          return listing ? { ...listing, score: r.score } : null
        })
        .filter(Boolean)

      return NextResponse.json({ fallback: false, source: 'local-cache', results })
    }

    // Path 3: nothing configured yet
    return NextResponse.json({
      fallback: true,
      reason: 'No database or embeddings cache available — run `npm run db:setup` or `npm run embed`',
      results: [],
    })
  } catch (err: any) {
    console.error('Search error:', err)
    return NextResponse.json(
      { error: 'Search failed', fallback: true, results: [] },
      { status: 500 }
    )
  }
}
