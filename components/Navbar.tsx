'use client'

import Link from 'next/link'
import { Search, Heart, ShoppingBag, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header style={{ background: '#FFFFFF', borderBottom: '1px solid #EDE8E2', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'baseline', gap: 1 }}>
          <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 700, color: '#2C1A0E' }}>Re</span>
          <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 700, color: '#C4663A', fontStyle: 'italic' }}>Market</span>
        </Link>

        {/* Nav links — desktop */}
        <nav style={{ display: 'flex', gap: 32, alignItems: 'center' }} className="hidden md:flex">
          {['Browse', 'Categories', 'Sell', 'About'].map(link => (
            <Link
              key={link}
              href={link === 'Browse' ? '/browse' : link === 'Sell' ? '/sell' : '/'}
              style={{ fontFamily: 'DM Sans', fontSize: 14, color: '#2C1A0E', textDecoration: 'none', transition: 'color .15s' }}
              onMouseOver={e => { (e.currentTarget as HTMLElement).style.color = '#C4663A' }}
              onMouseOut={e =>  { (e.currentTarget as HTMLElement).style.color = '#2C1A0E' }}
            >
              {link}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Icons */}
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            {[Search, Heart, ShoppingBag].map((Icon, i) => (
              <button key={i} style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: '#2C1A0E', borderRadius: 8, transition: 'background .15s' }}
                onMouseOver={e => { (e.currentTarget as HTMLElement).style.background = '#F5F0EA' }}
                onMouseOut={e =>  { (e.currentTarget as HTMLElement).style.background = 'none' }}
              >
                <Icon size={18} />
              </button>
            ))}
          </div>

          {/* Auth buttons */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button style={{ padding: '8px 18px', background: 'transparent', border: '1.5px solid #C4663A', color: '#C4663A', borderRadius: 8, fontFamily: 'DM Sans', fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all .15s' }}
              onMouseOver={e => { (e.currentTarget as HTMLElement).style.background = '#F5DDD3' }}
              onMouseOut={e =>  { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
            >
              Sign In
            </button>
            <button style={{ padding: '8px 18px', background: '#C4663A', border: '1.5px solid #C4663A', color: '#FFFFFF', borderRadius: 8, fontFamily: 'DM Sans', fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all .15s' }}
              onMouseOver={e => { (e.currentTarget as HTMLElement).style.background = '#A34E28' }}
              onMouseOut={e =>  { (e.currentTarget as HTMLElement).style.background = '#C4663A' }}
            >
              Join Free
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
