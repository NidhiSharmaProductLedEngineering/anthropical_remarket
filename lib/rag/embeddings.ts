/**
 * Embeddings client — Voyage AI (voyage-3-lite)
 *
 * Anthropic recommends Voyage AI for embeddings since Claude models don't
 * expose a native embeddings endpoint. voyage-3-lite is small, cheap, and
 * fast enough for query-time embedding in a search API route.
 *
 * Get a free key at https://dash.voyageai.com — set VOYAGE_API_KEY in .env.local
 */

const VOYAGE_API_URL = 'https://api.voyageai.com/v1/embeddings'
const MODEL = 'voyage-3-lite'

export async function embedText(text: string): Promise<number[]> {
  return embedBatch([text]).then(r => r[0])
}

export async function embedBatch(texts: string[]): Promise<number[][]> {
  const apiKey = process.env.VOYAGE_API_KEY
  if (!apiKey) {
    throw new Error(
      'VOYAGE_API_KEY is not set. Add it to .env.local — see .env.example.'
    )
  }

  const res = await fetch(VOYAGE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      input: texts,
      model: MODEL,
      input_type: 'document',
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Voyage AI embeddings request failed (${res.status}): ${body}`)
  }

  const data = await res.json()
  return data.data
    .sort((a: any, b: any) => a.index - b.index)
    .map((d: any) => d.embedding)
}

/** Same as embedBatch but tags the request as a search query, not a document.
 *  Voyage's asymmetric models rank better when query/document are tagged differently. */
export async function embedQuery(text: string): Promise<number[]> {
  const apiKey = process.env.VOYAGE_API_KEY
  if (!apiKey) {
    throw new Error(
      'VOYAGE_API_KEY is not set. Add it to .env.local — see .env.example.'
    )
  }

  const res = await fetch(VOYAGE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      input: [text],
      model: MODEL,
      input_type: 'query',
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Voyage AI embeddings request failed (${res.status}): ${body}`)
  }

  const data = await res.json()
  return data.data[0].embedding
}
