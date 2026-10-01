import { NextRequest, NextResponse } from 'next/server'
import { allListings, type Listing } from '@/lib/data'
import { getAllListingsFromDb, createListingInDb } from '@/lib/rag/pgSearch'
import { isDatabaseConfigured } from '@/lib/db'
import { getSessionUser } from '@/lib/auth'
import { embedText } from '@/lib/rag/embeddings'

export const dynamic = 'force-dynamic'

const CATEGORIES = ['Clothing', 'Jewelry', 'Watches', 'Purses & Bags', 'Crockery']
const CONDITIONS = ['Excellent', 'Very Good', 'Good', 'Fair']

/**
 * GET /api/listings — Postgres-backed with a static fallback for zero-setup dev.
 */
export async function GET() {
  if (isDatabaseConfigured()) {
    try {
      const listings = await getAllListingsFromDb()
      if (listings.length > 0) return NextResponse.json({ source: 'postgres', listings })
    } catch (err: any) {
      console.error('Failed to load listings from Postgres, using static fallback:', err.message)
    }
  }
  return NextResponse.json({ source: 'static', listings: allListings })
}

/**
 * POST /api/listings — creates a real listing owned by the signed-in user.
 * This is what /sell actually calls now; it used to just show a fake
 * success screen without saving anything.
 */
export async function POST(req: NextRequest) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: 'Listing creation is unavailable: database not configured.' }, { status: 503 })
  }
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'You must be signed in to list an item.' }, { status: 401 })

  try {
    const body = await req.json()
    const title = String(body.title ?? '').trim()
    const category = String(body.category ?? '')
    const condition = String(body.condition ?? '')
    const price = Number(body.price)
    const location = String(body.location ?? '').trim() || 'UAE'
    const image = String(body.image ?? '')

    if (title.length < 3) return NextResponse.json({ error: 'Please enter a title.' }, { status: 400 })
    if (!CATEGORIES.includes(category)) return NextResponse.json({ error: 'Please select a valid category.' }, { status: 400 })
    if (!CONDITIONS.includes(condition)) return NextResponse.json({ error: 'Please select a valid condition.' }, { status: 400 })
    if (!Number.isFinite(price) || price <= 0) return NextResponse.json({ error: 'Please enter a valid price.' }, { status: 400 })
    if (!image) return NextResponse.json({ error: 'Please add a photo.' }, { status: 400 })
    if (image.length > 8 * 1024 * 1024) return NextResponse.json({ error: 'Photo is too large.' }, { status: 400 })

    const id = `u_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

    let embedding: number[] | null = null
    if (process.env.VOYAGE_API_KEY) {
      try {
        embedding = await embedText(`${title}. Category: ${category}. Condition: ${condition}. Sold by ${user.name} in ${location}.`)
      } catch (e: any) {
        console.error('Embedding failed for new listing, saving without one:', e.message)
      }
    }

    const listing: Listing = await createListingInDb({
      id, title, price, currency: 'Dhs', category, seller: user.name, sellerId: user.id,
      location, image, condition, embedding,
    })

    return NextResponse.json({ listing }, { status: 201 })
  } catch (err: any) {
    console.error('Create listing error:', err.message)
    return NextResponse.json({ error: 'Could not create listing. Please try again.' }, { status: 500 })
  }
}
