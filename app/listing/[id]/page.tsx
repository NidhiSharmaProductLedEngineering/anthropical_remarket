'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, Heart, ShieldCheck } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { allListings, type Listing } from '@/lib/data'

export default function ListingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string

  const [listing, setListing] = useState<Listing | null>(
    allListings.find(l => l.id === id) ?? null
  )
  const [liked, setLiked] = useState(false)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    // Static data gives an instant render; replace with the Postgres-backed
    // copy once /api/listings responds, same pattern as the browse page.
    fetch('/api/listings')
      .then(res => res.json())
      .then(data => {
        const match = (data.listings as Listing[])?.find(l => l.id === id)
        if (match) {
          setListing(match)
        } else if (!allListings.find(l => l.id === id)) {
          setNotFound(true)
        }
      })
      .catch(() => {
        if (!allListings.find(l => l.id === id)) setNotFound(true)
      })
  }, [id])

  if (notFound) {
    return (
      <>
        <Navbar />
        <main style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24 }}>
          <p style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: '#2C1A0E' }}>Listing not found</p>
          <button onClick={() => router.push('/browse')} style={{ padding: '10px 20px', background: '#C4663A', color: '#fff', border: 'none', borderRadius: 8, fontFamily: 'DM Sans', fontSize: 14, cursor: 'pointer' }}>
            Back to Browse
          </button>
        </main>
        <Footer />
      </>
    )
  }

  if (!listing) return null // brief instant, static lookup covers almost all cases

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px 64px' }}>
        <button
          onClick={() => router.back()}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#7A6055', fontFamily: 'DM Sans', fontSize: 13, marginBottom: 24, padding: 0 }}
        >
          <ArrowLeft size={15} /> Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}
        >
          {/* Image */}
          <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', background: '#F5F0EA', paddingBottom: '90%' }}>
            <img
              src={listing.image}
              alt={listing.title}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <button
              onClick={() => setLiked(l => !l)}
              style={{ position: 'absolute', top: 14, right: 14, width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,.92)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Heart size={17} fill={liked ? '#C4663A' : 'none'} color={liked ? '#C4663A' : '#7A6055'} />
            </button>
          </div>

          {/* Details */}
          <div>
            <div style={{ fontFamily: 'DM Sans', fontSize: 12, fontWeight: 500, color: '#C4663A', background: '#F5DDD3', display: 'inline-block', padding: '4px 12px', borderRadius: 20, marginBottom: 16 }}>
              {listing.category}
            </div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, fontWeight: 700, color: '#2C1A0E', marginBottom: 12, lineHeight: 1.2 }}>
              {listing.title}
            </h1>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 700, color: '#2C1A0E', marginBottom: 24 }}>
              {listing.currency} {listing.price.toLocaleString()}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28, paddingBottom: 28, borderBottom: '1px solid #EDE8E2' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'DM Sans', fontSize: 14, color: '#4A3628' }}>
                <MapPin size={15} color="#7A6055" /> {listing.location}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'DM Sans', fontSize: 14, color: '#4A3628' }}>
                <ShieldCheck size={15} color="#7A6055" /> Condition: {listing.condition}
              </div>
              <div style={{ fontFamily: 'DM Sans', fontSize: 14, color: '#4A3628' }}>
                Sold by <strong>{listing.seller}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                disabled
                title="Buyer-seller messaging isn't built yet"
                style={{ flex: 1, padding: '14px 24px', background: '#E8DFD5', color: '#9A8A78', border: 'none', borderRadius: 10, fontFamily: 'DM Sans', fontSize: 14, fontWeight: 600, cursor: 'not-allowed' }}
              >
                Contact Seller (coming soon)
              </button>
              <button
                onClick={() => router.push('/browse')}
                style={{ padding: '14px 24px', background: 'transparent', color: '#2C1A0E', border: '1.5px solid #EDE8E2', borderRadius: 10, fontFamily: 'DM Sans', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}
              >
                Keep Browsing
              </button>
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </>
  )
}
