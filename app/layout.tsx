import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ReMarket — Pre-Loved Luxury, Authenticated',
  description: 'A curated marketplace for authenticated pre-loved designer handbags, fine jewellery, timepieces and couture.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
