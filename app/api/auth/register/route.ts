import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getPool, isDatabaseConfigured } from '@/lib/db'
import { ensureUsersTable, createSession, isValidEmail } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: 'Accounts are unavailable: database not configured.' }, { status: 503 })
  }
  try {
    const body = await req.json()
    const name = String(body.name ?? '').trim()
    const email = String(body.email ?? '').trim().toLowerCase()
    const password = String(body.password ?? '')

    if (name.length < 2) return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 })
    if (!isValidEmail(email)) return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    if (password.length < 8) return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })

    await ensureUsersTable()
    const hash = await bcrypt.hash(password, 10)

    try {
      const { rows } = await getPool().query(
        'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
        [name, email, hash]
      )
      await createSession(rows[0])
      return NextResponse.json({ user: rows[0] }, { status: 201 })
    } catch (e: any) {
      if (e.code === '23505') {
        return NextResponse.json({ error: 'An account with this email already exists. Try signing in.' }, { status: 409 })
      }
      throw e
    }
  } catch (err: any) {
    console.error('Register error:', err.message)
    return NextResponse.json({ error: 'Could not create account. Please try again.' }, { status: 500 })
  }
}
