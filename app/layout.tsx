import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ReMarket — Buy & Sell Pre-Loved Luxury',
  description: 'A marketplace to buy and sell pre-loved designer handbags, fine jewellery, timepieces and couture — message sellers directly, meet locally.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
