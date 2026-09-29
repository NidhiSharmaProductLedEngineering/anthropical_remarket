'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, Heart, ShoppingBag } from 'lucide-react'
import { useState, useEffect } from 'react'
import AuthModal, { type AuthUser } from './AuthModal'

export default function Navbar() {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'signin' | 'signup'>('signin')

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => setUser(d.user ?? null))
      .catch(() => {})
  }, [])

  function openModal(mode: 'signin' | 'signup') { setModalMode(mode); setModalOpen(true) }

  async function signOut() {
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {})
    setUser(null)
    router.refresh()
  }

  const linkStyle: React.CSSProperties = { fontFamily: 'DM Sans', fontSize: 12, letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(248,244,236,.82)', textDecoration: 'none', transition: 'color .15s' }

  return (
    <>
      <header style={{ background: '#16110D', borderBottom: '1px solid rgba(184,146,90,.35)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'baseline', gap: 2 }}>
            <span style={{ fontFamily: 'Cormorant Garamond, Playfair Display, serif', fontSize: 30, fontWeight: 500, color: '#F8F4EC' }}>Re</span>
            <span className="gold-text" style={{ fontFamily: 'Cormorant Garamond, Playfair Display, serif', fontSize: 30, fontWeight: 500, fontStyle: 'italic' }}>Market</span>
          </Link>

          <nav style={{ display: 'flex', gap: 36, alignItems: 'center' }} className="hidden md:flex">
            {[
              { label: 'Browse', href: '/browse' },
              { label: 'Categories', href: '/browse' },
              { label: 'Sell', href: '/sell' },
            ].map(l => (
              <Link key={l.label} href={l.href} style={linkStyle}
                onMouseOver={e => { (e.currentTarget as HTMLElement).style.color = '#D9C08F' }}
                onMouseOut={e =>  { (e.currentTarget as HTMLElement).style.color = 'rgba(248,244,236,.82)' }}>
                {l.label}
              </Link>
            ))}
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              {[
                { Icon: Search, label: 'Search', onClick: () => router.push('/browse') },
                { Icon: Heart, label: 'Wishlist (coming soon)', onClick: undefined },
                { Icon: ShoppingBag, label: 'Cart (coming soon)', onClick: undefined },
              ].map(({ Icon, label, onClick }, i) => (
                <button key={i} aria-label={label} title={label} onClick={onClick}
                  style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: onClick ? 'pointer' : 'default', color: '#F8F4EC', borderRadius: 2, opacity: onClick ? 1 : 0.35 }}>
                  <Icon size={17} />
                </button>
              ))}
            </div>

            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div title={user.email} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <span style={{ width: 32, height: 32, borderRadius: '50%', background: '#B8925A', color: '#16110D', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Sans', fontSize: 13, fontWeight: 600 }}>
                    {user.name.trim().charAt(0).toUpperCase()}
                  </span>
                  <span style={{ fontFamily: 'DM Sans', fontSize: 13, color: '#F8F4EC' }}>{user.name.split(' ')[0]}</span>
                </div>
                <button onClick={signOut}
                  style={{ padding: '8px 16px', background: 'transparent', border: '1px solid rgba(217,192,143,.5)', color: '#D9C08F', borderRadius: 2, fontFamily: 'DM Sans', fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', cursor: 'pointer' }}>
                  Sign Out
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <button onClick={() => openModal('signin')}
                  style={{ padding: '9px 20px', background: 'transparent', border: '1px solid rgba(217,192,143,.55)', color: '#D9C08F', borderRadius: 2, fontFamily: 'DM Sans', fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', fontWeight: 500, cursor: 'pointer' }}
                  onMouseOver={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(184,146,90,.14)' }}
                  onMouseOut={e =>  { (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
                  Sign In
                </button>
                <button onClick={() => openModal('signup')}
                  style={{ padding: '9px 20px', background: '#B8925A', border: '1px solid #B8925A', color: '#16110D', borderRadius: 2, fontFamily: 'DM Sans', fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', fontWeight: 500, cursor: 'pointer' }}
                  onMouseOver={e => { (e.currentTarget as HTMLElement).style.background = '#D9C08F' }}
                  onMouseOut={e =>  { (e.currentTarget as HTMLElement).style.background = '#B8925A' }}>
                  Join
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <AuthModal open={modalOpen} initialMode={modalMode} onClose={() => setModalOpen(false)} onSuccess={u => { setUser(u); router.refresh() }} />
    </>
  )
}
