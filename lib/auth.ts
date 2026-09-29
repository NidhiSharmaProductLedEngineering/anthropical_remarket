import { SignJWT, jwtVerify } from 'jose'
import { createHash } from 'crypto'
import { cookies } from 'next/headers'
import { getPool } from './db'

export const SESSION_COOKIE = 'remarket_session'
const SESSION_DAYS = 7

export interface SessionUser {
  id: number
  name: string
  email: string
}

/**
 * Session signing key. Prefer a dedicated AUTH_SECRET (generate with
 * `openssl rand -base64 32`). If it isn't set we derive a key from
 * DATABASE_URL — that string already contains a private password and never
 * changes, so it's safe key material and means sign-in works with zero
 * extra setup.
 */
function getSecret(): Uint8Array {
  const raw = process.env.AUTH_SECRET || process.env.DATABASE_URL
  if (!raw) throw new Error('AUTH_NOT_CONFIGURED')
  return createHash('sha256').update(raw).digest()
}

let tableReady = false
export async function ensureUsersTable() {
  if (tableReady) return
  await getPool().query(`
    CREATE TABLE IF NOT EXISTS users (
      id            SERIAL PRIMARY KEY,
      name          TEXT NOT NULL,
      email         TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `)
  tableReady = true
}

export async function createSession(user: SessionUser) {
  const token = await new SignJWT({ name: user.name, email: user.email })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(String(user.id))
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(getSecret())

  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  })
}

export function clearSession() {
  cookies().set(SESSION_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 })
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const token = cookies().get(SESSION_COOKIE)?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, getSecret())
    return {
      id: Number(payload.sub),
      name: String(payload.name),
      email: String(payload.email),
    }
  } catch {
    return null
  }
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
