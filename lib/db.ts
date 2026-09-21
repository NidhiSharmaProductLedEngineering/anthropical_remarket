import { Pool } from 'pg'

/**
 * Postgres connection pool, backed by Neon (https://neon.tech) — a free,
 * serverless Postgres provider with pgvector support out of the box.
 *
 * Set DATABASE_URL in .env.local to your Neon connection string
 * (see .env.example and docs/DATABASE_SETUP.md).
 *
 * If DATABASE_URL isn't set, everything that uses this pool should catch
 * the error and fall back gracefully — see app/api/search/route.ts and
 * app/api/listings/route.ts.
 */

let pool: Pool | null = null

export function getPool(): Pool {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set. See .env.example.')
  }

  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      // Neon requires SSL; rejectUnauthorized: false is standard for
      // Neon's pooled connection strings which use a managed cert chain
      // not always present in serverless runtimes.
      ssl: { rejectUnauthorized: false },
      max: 5,
    })
  }

  return pool
}

export function isDatabaseConfigured(): boolean {
  return !!process.env.DATABASE_URL
}
