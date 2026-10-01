import { NextRequest, NextResponse } from 'next/server'
import { getPool, isDatabaseConfigured } from '@/lib/db'
import { getSessionUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

/**
 * POST /api/messages
 * Body: { listingId: string, body: string, toUserId?: number }
 *
 * Sends a message tied to a listing. The seller is implied by the listing
 * (listing.seller_id) — a buyer messaging a seller for the first time
 * doesn't need to pass toUserId. A seller replying within an existing
 * thread must pass toUserId (the buyer's id), since one listing can have
 * many different buyers messaging about it.
 */
export async function POST(req: NextRequest) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: 'Messaging is unavailable: database not configured.' }, { status: 503 })
  }
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'You must be signed in to send a message.' }, { status: 401 })

  try {
    const { listingId, body: text, toUserId } = await req.json()
    const trimmed = String(text ?? '').trim()
    if (!listingId) return NextResponse.json({ error: 'listingId is required.' }, { status: 400 })
    if (!trimmed) return NextResponse.json({ error: 'Message cannot be empty.' }, { status: 400 })
    if (trimmed.length > 2000) return NextResponse.json({ error: 'Message is too long.' }, { status: 400 })

    const pool = getPool()
    const { rows: listingRows } = await pool.query(
      'SELECT id, seller_id FROM listings WHERE id = $1',
      [listingId]
    )
    const listing = listingRows[0]
    if (!listing) return NextResponse.json({ error: 'Listing not found.' }, { status: 404 })
    if (!listing.seller_id) return NextResponse.json({ error: 'This listing has no seller account to message.' }, { status: 400 })

    let receiverId: number
    if (listing.seller_id === user.id) {
      if (!toUserId) return NextResponse.json({ error: 'toUserId is required when replying as the seller.' }, { status: 400 })
      receiverId = Number(toUserId)
    } else {
      receiverId = listing.seller_id
    }

    if (receiverId === user.id) {
      return NextResponse.json({ error: "You can't message yourself." }, { status: 400 })
    }

    const { rows } = await pool.query(
      `INSERT INTO messages (listing_id, sender_id, receiver_id, body)
       VALUES ($1, $2, $3, $4)
       RETURNING id, listing_id, sender_id, receiver_id, body, created_at`,
      [listingId, user.id, receiverId, trimmed]
    )

    return NextResponse.json({ message: rows[0] }, { status: 201 })
  } catch (err: any) {
    console.error('Send message error:', err.message)
    return NextResponse.json({ error: 'Could not send message. Please try again.' }, { status: 500 })
  }
}
