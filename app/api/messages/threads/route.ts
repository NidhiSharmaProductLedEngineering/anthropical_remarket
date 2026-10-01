import { NextResponse } from 'next/server'
import { getPool, isDatabaseConfigured } from '@/lib/db'
import { getSessionUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

/**
 * GET /api/messages/threads
 *
 * Lists every conversation the signed-in user is part of — one row per
 * (listing, other person) pair, with the listing's title/image, the other
 * person's name, the most recent message, and how many are unread.
 */
export async function GET() {
  if (!isDatabaseConfigured()) return NextResponse.json({ threads: [] })
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 })

  try {
    const pool = getPool()
    const { rows } = await pool.query(
      `WITH my_messages AS (
         SELECT
           listing_id,
           CASE WHEN sender_id = $1 THEN receiver_id ELSE sender_id END AS other_user_id,
           body, created_at, sender_id, read_at
         FROM messages
         WHERE sender_id = $1 OR receiver_id = $1
       ),
       ranked AS (
         SELECT *, ROW_NUMBER() OVER (
           PARTITION BY listing_id, other_user_id ORDER BY created_at DESC
         ) AS rn
         FROM my_messages
       )
       SELECT
         r.listing_id, r.other_user_id, r.body AS last_message, r.created_at AS last_at,
         l.title AS listing_title, l.image AS listing_image,
         u.name AS other_user_name,
         (SELECT COUNT(*) FROM messages m
          WHERE m.listing_id = r.listing_id AND m.sender_id = r.other_user_id
            AND m.receiver_id = $1 AND m.read_at IS NULL) AS unread_count
       FROM ranked r
       JOIN listings l ON l.id = r.listing_id
       JOIN users u ON u.id = r.other_user_id
       WHERE r.rn = 1
       ORDER BY r.created_at DESC`,
      [user.id]
    )

    const threads = rows.map(r => ({
      listingId: r.listing_id,
      listingTitle: r.listing_title,
      listingImage: r.listing_image,
      otherUserId: r.other_user_id,
      otherUserName: r.other_user_name,
      lastMessage: r.last_message,
      lastAt: r.last_at,
      unreadCount: Number(r.unread_count),
    }))

    return NextResponse.json({ threads })
  } catch (err: any) {
    console.error('List threads error:', err.message)
    return NextResponse.json({ error: 'Could not load messages.' }, { status: 500 })
  }
}
