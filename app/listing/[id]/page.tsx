'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, Heart, ShieldCheck } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AuthModal, { type AuthUser } from '@/components/AuthModal'
import { allListings, type Listing } from '@/lib/data'

export default function ListingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string

  const [listing, setListing] = useState<Listing | null>(allListings.find(l => l.id === id) ?? null)
  const [liked, setLiked] = useState(false)
  const [notFound, setNotFound] = useState(false)

  const [user, setUser] = useState<AuthUser | null>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    fetch('/api/listings')
      .then(res => res.json())
      .then(data => {
        const match = (data.listings as Listing[])?.find(l => l.id === id)
        if (match) setListing(match)
        else if (!allListings.find(l => l.id === id)) setNotFound(true)
      })
      .catch(() => { if (!allListings.find(l => l.id === id)) setNotFound(true) })

    fetch('/api/auth/me').then(r => r.json()).then(d => { setUser(d.user ?? null); setAuthChecked(true) })
  }, [id])

  function handleContactSeller() {
    if (!user) { setModalOpen(true); return }
    if (!listing?.sellerId) return
    router.push(`/messages?listingId=${listing.id}&otherUserId=${listing.sellerId}`)
  }

  if (notFound) {
    return (
      <>
        <Navbar />
        <main style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24 }}>
          <p style={{ fontFamily: 'Cormorant Garamond, Playfair Display, serif', fontSize: 22, color: '#16110D' }}>Listing not found</p>
          <button onClick={() => router.push('/browse')} style={{ padding: '10px 20px', background: '#B8925A', color: '#16110D', border: 'none', borderRadius: 4, fontFamily: 'DM Sans', fontSize: 14, cursor: 'pointer' }}>
            Back to Browse
          </button>
        </main>
        <Footer />
      </>
    )
  }

  if (!listing) return null

  const isOwnListing = user && listing.sellerId === user.id
  const contactLabel = !authChecked ? 'Contact Seller'
    : !user ? 'Sign In to Contact Seller'
    : isOwnListing ? "This Is Your Listing"
    : !listing.sellerId ? 'No Seller Account to Message'
    : 'Message Seller'
  const contactDisabled = authChecked && user && (isOwnListing || !listing.sellerId)

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 16px 56px' }}>
        <button onClick={() => router.back()}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#7A6B5C', fontFamily: 'DM Sans', fontSize: 13, marginBottom: 22, padding: 0 }}>
          <ArrowLeft size={15} /> Back
        </button>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="listing-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>

          <div style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', background: '#F8F4EC', paddingBottom: '90%' }}>
            <img src={listing.image} alt={listing.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            <button onClick={() => setLiked(l => !l)}
              style={{ position: 'absolute', top: 14, right: 14, width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,.92)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Heart size={17} fill={liked ? '#B8925A' : 'none'} color={liked ? '#B8925A' : '#7A6B5C'} />
            </button>
          </div>

          <div>
            <div style={{ fontFamily: 'DM Sans', fontSize: 12, fontWeight: 500, color: '#8E6F3E', background: '#EFE5D2', display: 'inline-block', padding: '4px 12px', borderRadius: 20, marginBottom: 16 }}>
              {listing.category}
            </div>
            <h1 style={{ fontFamily: 'Cormorant Garamond, Playfair Display, serif', fontSize: 'clamp(1.7rem,5vw,2.2rem)', fontWeight: 500, color: '#16110D', marginBottom: 10, lineHeight: 1.2 }}>
              {listing.title}
            </h1>
            <div style={{ fontFamily: 'Cormorant Garamond, Playfair Display, serif', fontSize: 26, fontWeight: 600, color: '#16110D', marginBottom: 22 }}>
              {listing.currency} {listing.price.toLocaleString()}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 26, paddingBottom: 26, borderBottom: '1px solid #E9E1D3' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'DM Sans', fontSize: 14, color: '#3A2F26' }}>
                <MapPin size={15} color="#7A6B5C" /> {listing.location}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'DM Sans', fontSize: 14, color: '#3A2F26' }}>
                <ShieldCheck size={15} color="#7A6B5C" /> Condition: {listing.condition}
              </div>
              <div style={{ fontFamily: 'DM Sans', fontSize: 14, color: '#3A2F26' }}>Sold by <strong>{listing.seller}</strong></div>
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button
                onClick={handleContactSeller}
                disabled={!!contactDisabled}
                title={!listing.sellerId && user ? 'This demo listing has no seller account to message' : undefined}
                style={{ flex: 1, minWidth: 180, padding: '14px 24px', background: contactDisabled ? '#E8DFD5' : '#16110D', color: contactDisabled ? '#9A8A78' : '#F8F4EC', border: 'none', borderRadius: 4, fontFamily: 'DM Sans', fontSize: 13, fontWeight: 600, letterSpacing: '.02em', cursor: contactDisabled ? 'not-allowed' : 'pointer' }}
              >
                {contactLabel}
              </button>
              <button onClick={() => router.push('/browse')}
                style={{ padding: '14px 24px', background: 'transparent', color: '#16110D', border: '1.5px solid #E9E1D3', borderRadius: 4, fontFamily: 'DM Sans', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
                Keep Browsing
              </button>
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />

      <AuthModal open={modalOpen} initialMode="signin" onClose={() => setModalOpen(false)}
        onSuccess={u => { setUser(u); if (listing?.sellerId) router.push(`/messages?listingId=${listing.id}&otherUserId=${listing.sellerId}`) }} />

      <style jsx>{`
        @media (max-width: 720px) {
          .listing-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
        }
      `}</style>
    </>
  )
}
