'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, MessageCircle, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import AuthModal, { type AuthUser } from './AuthModal'

const NAV_LINKS = [
  { label: 'Browse', href: '/browse' },
  { label: 'Sell', href: '/sell' },
]

export default function Navbar() {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'signin' | 'signup'>('signin')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [unread, setUnread] = useState(0)

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => setUser(d.user ?? null)).catch(() => {})
  }, [])

  useEffect(() => {
    if (!user) { setUnread(0); return }
    fetch('/api/messages/threads').then(r => r.json()).then(d => {
      const count = (d.threads ?? []).reduce((sum: number, t: any) => sum + t.unreadCount, 0)
      setUnread(count)
    }).catch(() => {})
  }, [user])

  function openModal(mode: 'signin' | 'signup') { setModalMode(mode); setModalOpen(true); setMobileOpen(false) }

  async function signOut() {
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {})
    setUser(null)
    setMobileOpen(false)
    router.refresh()
  }

  const linkStyle: React.CSSProperties = { fontFamily: 'DM Sans', fontSize: 12, letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(248,244,236,.82)', textDecoration: 'none' }

  return (
    <>
      <header style={{ background: '#16110D', borderBottom: '1px solid rgba(184,146,90,.35)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'baseline', gap: 2 }}>
            <span style={{ fontFamily: 'Cormorant Garamond, Playfair Display, serif', fontSize: 27, fontWeight: 500, color: '#F8F4EC' }}>Re</span>
            <span className="gold-text" style={{ fontFamily: 'Cormorant Garamond, Playfair Display, serif', fontSize: 27, fontWeight: 500, fontStyle: 'italic' }}>Market</span>
          </Link>

          <nav className="desktop-nav" style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
            {NAV_LINKS.map(l => (
              <Link key={l.label} href={l.href} style={linkStyle}>{l.label}</Link>
            ))}
          </nav>

          <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button aria-label="Search" onClick={() => router.push('/browse')}
              style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: '#F8F4EC' }}>
              <Search size={17} />
            </button>

            {user && (
              <button aria-label="Messages" onClick={() => router.push('/messages')}
                style={{ position: 'relative', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: '#F8F4EC' }}>
                <MessageCircle size={17} />
                {unread > 0 && <span style={{ position: 'absolute', top: 4, right: 4, width: 8, height: 8, borderRadius: '50%', background: '#B8925A' }} />}
              </button>
            )}

            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div title={user.email} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <span style={{ width: 30, height: 30, borderRadius: '50%', background: '#B8925A', color: '#16110D', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Sans', fontSize: 12, fontWeight: 600 }}>
                    {user.name.trim().charAt(0).toUpperCase()}
                  </span>
                  <span style={{ fontFamily: 'DM Sans', fontSize: 13, color: '#F8F4EC' }}>{user.name.split(' ')[0]}</span>
                </div>
                <button onClick={signOut}
                  style={{ padding: '8px 16px', background: 'transparent', border: '1px solid rgba(217,192,143,.5)', color: '#D9C08F', borderRadius: 2, fontFamily: 'DM Sans', fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', cursor: 'pointer' }}>
                  Sign Out
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <button onClick={() => openModal('signin')}
                  style={{ padding: '9px 18px', background: 'transparent', border: '1px solid rgba(217,192,143,.55)', color: '#D9C08F', borderRadius: 2, fontFamily: 'DM Sans', fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', fontWeight: 500, cursor: 'pointer' }}>
                  Sign In
                </button>
                <button onClick={() => openModal('signup')}
                  style={{ padding: '9px 18px', background: '#B8925A', border: '1px solid #B8925A', color: '#16110D', borderRadius: 2, fontFamily: 'DM Sans', fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', fontWeight: 500, cursor: 'pointer' }}>
                  Join
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="mobile-toggle" aria-label="Menu" onClick={() => setMobileOpen(o => !o)}
            style={{ display: 'none', background: 'none', border: 'none', color: '#F8F4EC', cursor: 'pointer', padding: 6 }}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu panel */}
        {mobileOpen && (
          <div className="mobile-panel" style={{ borderTop: '1px solid rgba(184,146,90,.25)', padding: '16px 20px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {NAV_LINKS.map(l => (
              <Link key={l.label} href={l.href} onClick={() => setMobileOpen(false)} style={{ ...linkStyle, fontSize: 14 }}>{l.label}</Link>
            ))}
            {user && (
              <Link href="/messages" onClick={() => setMobileOpen(false)} style={{ ...linkStyle, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                Messages {unread > 0 && <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#B8925A', display: 'inline-block' }} />}
              </Link>
            )}
            <div style={{ height: 1, background: 'rgba(184,146,90,.2)', margin: '6px 0' }} />
            {user ? (
              <>
                <span style={{ fontFamily: 'DM Sans', fontSize: 13, color: 'rgba(248,244,236,.6)' }}>Signed in as {user.name}</span>
                <button onClick={signOut} style={{ alignSelf: 'flex-start', padding: '9px 16px', background: 'transparent', border: '1px solid rgba(217,192,143,.5)', color: '#D9C08F', borderRadius: 2, fontFamily: 'DM Sans', fontSize: 12, letterSpacing: '.1em', textTransform: 'uppercase', cursor: 'pointer' }}>
                  Sign Out
                </button>
              </>
            ) : (
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => openModal('signin')} style={{ flex: 1, padding: '11px', background: 'transparent', border: '1px solid rgba(217,192,143,.55)', color: '#D9C08F', borderRadius: 2, fontFamily: 'DM Sans', fontSize: 12, letterSpacing: '.1em', textTransform: 'uppercase', cursor: 'pointer' }}>Sign In</button>
                <button onClick={() => openModal('signup')} style={{ flex: 1, padding: '11px', background: '#B8925A', border: 'none', color: '#16110D', borderRadius: 2, fontFamily: 'DM Sans', fontSize: 12, letterSpacing: '.1em', textTransform: 'uppercase', cursor: 'pointer' }}>Join</button>
              </div>
            )}
          </div>
        )}
      </header>

      <AuthModal open={modalOpen} initialMode={modalMode} onClose={() => setModalOpen(false)} onSuccess={u => { setUser(u); router.refresh() }} />

      <style jsx>{`
        @media (max-width: 760px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: flex !important; align-items: center; justify-content: center; }
        }
      `}</style>
    </>
  )
}
