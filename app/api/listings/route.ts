import { NextResponse } from 'next/server'
import { allListings } from '@/lib/data'
import { getAllListingsFromDb } from '@/lib/rag/pgSearch'
import { isDatabaseConfigured } from '@/lib/db'

/**
 * GET /api/listings
 *
 * Returns listings from Postgres when DATABASE_URL is configured (the
 * production path — run `npm run db:setup` once to seed it), otherwise
 * falls back to the static array in lib/data.ts so the app still works
 * with zero setup.
 */
export async function GET() {
  if (isDatabaseConfigured()) {
    try {
      const listings = await getAllListingsFromDb()
      if (listings.length > 0) {
        return NextResponse.json({ source: 'postgres', listings })
      }
    } catch (err: any) {
      console.error('Failed to load listings from Postgres, using static fallback:', err.message)
    }
  }

  return NextResponse.json({ source: 'static', listings: allListings })
}
