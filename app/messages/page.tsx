'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Send, MessageCircle } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

interface Thread {
  listingId: string
  listingTitle: string
  listingImage: string
  otherUserId: number
  otherUserName: string
  lastMessage: string
  lastAt: string
  unreadCount: number
}

interface ThreadMessage {
  id: number
  body: string
  createdAt: string
  fromMe: boolean
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function MessagesInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeListingId = searchParams.get('listingId')
  const activeOtherUserId = searchParams.get('otherUserId')

  const [threads, setThreads] = useState<Thread[] | null>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [signedIn, setSignedIn] = useState(false)

  const [messages, setMessages] = useState<ThreadMessage[]>([])
  const [threadMeta, setThreadMeta] = useState<{ listingTitle?: string; otherUserName?: string }>({})
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => {
      setSignedIn(!!d.user)
      setAuthChecked(true)
    })
  }, [])

  function loadThreads() {
    fetch('/api/messages/threads').then(r => r.json()).then(d => setThreads(d.threads ?? []))
  }

  useEffect(() => { if (signedIn) loadThreads() }, [signedIn])

  useEffect(() => {
    if (!signedIn || !activeListingId || !activeOtherUserId) return
    fetch(`/api/messages/thread?listingId=${activeListingId}&otherUserId=${activeOtherUserId}`)
      .then(r => r.json())
      .then(d => {
        setMessages(d.messages ?? [])
        setThreadMeta({ listingTitle: d.listing?.title, otherUserName: d.otherUser?.name })
        loadThreads() // refresh unread counts in the list
      })
  }, [signedIn, activeListingId, activeOtherUserId])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  async function send() {
    if (!draft.trim() || !activeListingId) return
    setSending(true)
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId: activeListingId, toUserId: activeOtherUserId, body: draft.trim() }),
      })
      if (res.ok) {
        setDraft('')
        const d = await fetch(`/api/messages/thread?listingId=${activeListingId}&otherUserId=${activeOtherUserId}`).then(r => r.json())
        setMessages(d.messages ?? [])
        loadThreads()
      }
    } finally {
      setSending(false)
    }
  }

  if (authChecked && !signedIn) {
    return (
      <>
        <Navbar />
        <main style={{ minHeight: '55vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: 24, textAlign: 'center' }}>
          <MessageCircle size={36} color="#B8925A" />
          <p style={{ fontFamily: 'Cormorant Garamond, Playfair Display, serif', fontSize: 24, color: '#16110D' }}>Sign in to see your messages</p>
          <Link href="/browse" style={{ fontFamily: 'DM Sans', fontSize: 13, color: '#8E6F3E', textDecoration: 'underline' }}>Back to Browse</Link>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 16px 60px' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, Playfair Display, serif', fontSize: 30, color: '#16110D', marginBottom: 20 }}>Messages</h1>

        <div className="messages-layout" style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20, minHeight: 500 }}>
          {/* Thread list */}
          <div style={{ border: '1px solid #E9E1D3', borderRadius: 4, overflow: 'hidden', background: '#FFFFFF' }}>
            {threads === null ? (
              <div style={{ padding: 20, fontFamily: 'DM Sans', fontSize: 13, color: '#7A6B5C' }}>Loading…</div>
            ) : threads.length === 0 ? (
              <div style={{ padding: 24, fontFamily: 'DM Sans', fontSize: 13, color: '#7A6B5C', textAlign: 'center' }}>
                No conversations yet. Message a seller from any listing to start one.
              </div>
            ) : (
              threads.map(t => {
                const isActive = t.listingId === activeListingId && String(t.otherUserId) === activeOtherUserId
                return (
                  <button
                    key={`${t.listingId}-${t.otherUserId}`}
                    onClick={() => router.push(`/messages?listingId=${t.listingId}&otherUserId=${t.otherUserId}`)}
                    style={{ width: '100%', textAlign: 'left', display: 'flex', gap: 10, padding: '12px 14px', background: isActive ? '#F5F0E6' : 'transparent', border: 'none', borderBottom: '1px solid #F0EBE0', cursor: 'pointer' }}
                  >
                    <img src={t.listingImage} alt="" style={{ width: 44, height: 44, borderRadius: 4, objectFit: 'cover', flexShrink: 0 }} />
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6 }}>
                        <span style={{ fontFamily: 'DM Sans', fontSize: 13, fontWeight: 600, color: '#16110D', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.otherUserName}</span>
                        {t.unreadCount > 0 && (
                          <span style={{ background: '#B8925A', color: '#16110D', fontSize: 10, fontWeight: 700, borderRadius: 10, minWidth: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px' }}>{t.unreadCount}</span>
                        )}
                      </div>
                      <div style={{ fontFamily: 'DM Sans', fontSize: 11, color: '#8E6F3E', marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.listingTitle}</div>
                      <div style={{ fontFamily: 'DM Sans', fontSize: 12, color: '#7A6B5C', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.lastMessage}</div>
                    </div>
                  </button>
                )
              })
            )}
          </div>

          {/* Active thread */}
          <div style={{ border: '1px solid #E9E1D3', borderRadius: 4, background: '#FFFFFF', display: 'flex', flexDirection: 'column', minHeight: 500 }}>
            {!activeListingId ? (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7A6B5C', fontFamily: 'DM Sans', fontSize: 13, padding: 24, textAlign: 'center' }}>
                Select a conversation to view it
              </div>
            ) : (
              <>
                <div style={{ padding: '14px 18px', borderBottom: '1px solid #F0EBE0' }}>
                  <div style={{ fontFamily: 'DM Sans', fontWeight: 600, fontSize: 14, color: '#16110D' }}>{threadMeta.otherUserName}</div>
                  <div style={{ fontFamily: 'DM Sans', fontSize: 12, color: '#8E6F3E' }}>{threadMeta.listingTitle}</div>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 380 }}>
                  {messages.map(m => (
                    <div key={m.id} style={{ alignSelf: m.fromMe ? 'flex-end' : 'flex-start', maxWidth: '75%' }}>
                      <div style={{ background: m.fromMe ? '#16110D' : '#F5F0E6', color: m.fromMe ? '#F8F4EC' : '#16110D', padding: '9px 13px', borderRadius: 10, fontFamily: 'DM Sans', fontSize: 13.5, lineHeight: 1.5 }}>
                        {m.body}
                      </div>
                      <div style={{ fontFamily: 'DM Sans', fontSize: 10, color: '#A89680', marginTop: 3, textAlign: m.fromMe ? 'right' : 'left' }}>{timeAgo(m.createdAt)}</div>
                    </div>
                  ))}
                  <div ref={bottomRef} />
                </div>
                <div style={{ display: 'flex', gap: 8, padding: '12px 14px', borderTop: '1px solid #F0EBE0' }}>
                  <input
                    value={draft}
                    onChange={e => setDraft(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
                    placeholder="Type a message…"
                    style={{ flex: 1, padding: '10px 12px', border: '1px solid #E9E1D3', borderRadius: 4, fontFamily: 'DM Sans', fontSize: 13, outline: 'none' }}
                  />
                  <button onClick={send} disabled={sending || !draft.trim()}
                    style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#16110D', color: '#F8F4EC', border: 'none', borderRadius: 4, cursor: sending ? 'wait' : 'pointer', opacity: draft.trim() ? 1 : 0.4, flexShrink: 0 }}>
                    <Send size={15} />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />

      <style jsx global>{`
        @media (max-width: 760px) {
          .messages-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}

export default function MessagesPage() {
  return (
    <Suspense fallback={null}>
      <MessagesInner />
    </Suspense>
  )
}
