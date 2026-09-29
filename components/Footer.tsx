'use client'

import Link from 'next/link'
import { Instagram, Twitter, Facebook } from 'lucide-react'

const cols = [
  { title: 'Marketplace', links: [
    { label: 'Browse All',    href: '/browse' },
    { label: 'Categories',    href: '/browse' },
    { label: 'How It Works',  href: null },
    { label: 'Pricing',       href: null },
  ]},
  { title: 'Company', links: [
    { label: 'About Us', href: null },
    { label: 'Careers',  href: null },
    { label: 'Press',    href: null },
    { label: 'Blog',     href: null },
  ]},
  { title: 'Support', links: [
    { label: 'Help Center', href: null },
    { label: 'Safety Tips', href: null },
    { label: 'Contact Us',  href: null },
    { label: 'FAQ',         href: null },
  ]},
  { title: 'Legal', links: [
    { label: 'Privacy Policy',    href: null },
    { label: 'Terms of Service',  href: null },
    { label: 'Cookie Policy',     href: null },
  ]},
]

export default function Footer() {
  return (
    <footer style={{ background: '#F8F4EC', borderTop: '1px solid #E9E1D3', padding: '56px 24px 32px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr repeat(4,1fr)', gap: 40, marginBottom: 48 }}>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 1, marginBottom: 12 }}>
              <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 700, color: '#16110D' }}>Re</span>
              <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 700, color: '#B8925A', fontStyle: 'italic' }}>Market</span>
            </div>
            <p style={{ fontFamily: 'DM Sans', fontSize: 13, color: '#7A6B5C', lineHeight: 1.65, marginBottom: 20, maxWidth: 220 }}>
              Authenticated pre-loved luxury — designer handbags, fine jewellery, timepieces and couture.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <button key={i} disabled title="Not linked yet" style={{ width: 36, height: 36, borderRadius: '50%', border: '1.5px solid #D4C4B8', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'not-allowed', color: '#7A6B5C', opacity: 0.45 }}>
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>

          {/* Link cols */}
          {cols.map(col => (
            <div key={col.title}>
              <div style={{ fontFamily: 'DM Sans', fontSize: 13, fontWeight: 600, color: '#16110D', marginBottom: 14, letterSpacing: '.01em' }}>
                {col.title}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {col.links.map(link => link.href ? (
                  <Link key={link.label} href={link.href} style={{ fontFamily: 'DM Sans', fontSize: 13, color: '#7A6B5C', textDecoration: 'none', transition: 'color .15s' }}
                    onMouseOver={e => { (e.currentTarget as HTMLElement).style.color = '#B8925A' }}
                    onMouseOut={e =>  { (e.currentTarget as HTMLElement).style.color = '#7A6B5C' }}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <span key={link.label} title="Page not built yet" style={{ fontFamily: 'DM Sans', fontSize: 13, color: '#7A6B5C', opacity: 0.45, cursor: 'default' }}>
                    {link.label}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid #E9E1D3', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontFamily: 'DM Sans', fontSize: 12, color: '#7A6B5C' }}>© 2025 ReMarket. All rights reserved.</span>
          <span style={{ fontFamily: 'DM Sans', fontSize: 12, color: '#7A6B5C' }}>Built by Nidhi Sharma · UAE</span>
        </div>
      </div>
    </footer>
  )
}
