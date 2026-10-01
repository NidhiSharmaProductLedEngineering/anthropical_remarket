import { NextRequest, NextResponse } from 'next/server'
import { getPool, isDatabaseConfigured } from '@/lib/db'
import { getSessionUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

/**
 * GET /api/messages/thread?listingId=X&otherUserId=Y
 *
 * Returns full message history between the signed-in user and otherUserId,
 * scoped to one listing. Marks any unread messages from the other person
 * as read as a side effect (standard "opening a thread reads it" behavior).
 */
export async function GET(req: NextRequest) {
  if (!isDatabaseConfigured()) return NextResponse.json({ messages: [] })
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 })

  const listingId = req.nextUrl.searchParams.get('listingId')
  const otherUserId = Number(req.nextUrl.searchParams.get('otherUserId'))
  if (!listingId || !otherUserId) {
    return NextResponse.json({ error: 'listingId and otherUserId are required.' }, { status: 400 })
  }

  try {
    const pool = getPool()

    await pool.query(
      `UPDATE messages SET read_at = now()
       WHERE listing_id = $1 AND sender_id = $2 AND receiver_id = $3 AND read_at IS NULL`,
      [listingId, otherUserId, user.id]
    )

    const { rows } = await pool.query(
      `SELECT id, sender_id, receiver_id, body, created_at
       FROM messages
       WHERE listing_id = $1
         AND ((sender_id = $2 AND receiver_id = $3) OR (sender_id = $3 AND receiver_id = $2))
       ORDER BY created_at ASC`,
      [listingId, user.id, otherUserId]
    )

    const { rows: listingRows } = await pool.query(
      'SELECT id, title, image, seller_id FROM listings WHERE id = $1',
      [listingId]
    )
    const { rows: userRows } = await pool.query(
      'SELECT id, name FROM users WHERE id = $1',
      [otherUserId]
    )

    return NextResponse.json({
      messages: rows.map(m => ({
        id: m.id, senderId: m.sender_id, receiverId: m.receiver_id,
        body: m.body, createdAt: m.created_at, fromMe: m.sender_id === user.id,
      })),
      listing: listingRows[0] ? { id: listingRows[0].id, title: listingRows[0].title, image: listingRows[0].image, sellerId: listingRows[0].seller_id } : null,
      otherUser: userRows[0] ? { id: userRows[0].id, name: userRows[0].name } : null,
    })
  } catch (err: any) {
    console.error('Fetch thread error:', err.message)
    return NextResponse.json({ error: 'Could not load conversation.' }, { status: 500 })
  }
}
