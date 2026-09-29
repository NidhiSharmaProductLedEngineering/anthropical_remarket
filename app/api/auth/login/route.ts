import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getPool, isDatabaseConfigured } from '@/lib/db'
import { ensureUsersTable, createSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: 'Sign in is unavailable: database not configured.' }, { status: 503 })
  }
  try {
    const body = await req.json()
    const email = String(body.email ?? '').trim().toLowerCase()
    const password = String(body.password ?? '')
    if (!email || !password) return NextResponse.json({ error: 'Enter your email and password.' }, { status: 400 })

    await ensureUsersTable()
    const { rows } = await getPool().query(
      'SELECT id, name, email, password_hash FROM users WHERE email = $1',
      [email]
    )
    const user = rows[0]
    // Same message for unknown email and wrong password — don't reveal which accounts exist.
    const ok = user && (await bcrypt.compare(password, user.password_hash))
    if (!ok) return NextResponse.json({ error: 'Incorrect email or password.' }, { status: 401 })

    await createSession({ id: user.id, name: user.name, email: user.email })
    return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } })
  } catch (err: any) {
    console.error('Login error:', err.message)
    return NextResponse.json({ error: 'Could not sign in. Please try again.' }, { status: 500 })
  }
}
