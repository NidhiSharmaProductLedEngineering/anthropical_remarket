import type { Metadata } from 'next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ReMarket — Buy & Sell Pre-Loved Treasures',
  description: 'Join our community of treasure hunters. Buy and sell unique vintage clothing, jewelry, watches, and more — all with a story to tell.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  )
}
