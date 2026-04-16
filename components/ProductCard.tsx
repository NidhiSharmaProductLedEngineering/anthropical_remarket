'use client'

import { useState } from 'react'
import { Heart, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Listing } from '@/lib/data'

export default function ProductCard({ listing }: { listing: Listing }) {
  const [liked, setLiked] = useState(listing.liked)

  return (
    <motion.div
      whileHover={{ y: -4 }}
      style={{ background: '#FFFFFF', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(44,26,14,.08)', cursor: 'pointer', transition: 'box-shadow .22s' }}
      onMouseOver={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(44,26,14,.14)' }}
      onMouseOut={e =>  { (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(44,26,14,.08)' }}
    >
      {/* Image */}
      <div style={{ position: 'relative', paddingBottom: '75%', overflow: 'hidden' }}>
        <img
          src={listing.image}
          alt={listing.title}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .4s ease' }}
          onMouseOver={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.05)' }}
          onMouseOut={e =>  { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)' }}
        />

        {/* Category badge */}
        <div style={{ position: 'absolute', bottom: 10, left: 10, background: 'rgba(255,255,255,.92)', padding: '4px 10px', borderRadius: 20, fontFamily: 'DM Sans', fontSize: 12, fontWeight: 500, color: '#2C1A0E' }}>
          {listing.category}
        </div>

        {/* Heart */}
        <button
          onClick={e => { e.stopPropagation(); setLiked(l => !l) }}
          style={{ position: 'absolute', top: 10, right: 10, width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,.92)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .15s' }}
        >
          <Heart size={14} fill={liked ? '#C4663A' : 'none'} color={liked ? '#C4663A' : '#7A6055'} />
        </button>
      </div>

      {/* Info */}
      <div style={{ padding: '14px 16px' }}>
        <div style={{ fontFamily: 'DM Sans', fontSize: 14, fontWeight: 500, color: '#2C1A0E', marginBottom: 6, lineHeight: 1.35 }}>
          {listing.title}
        </div>
        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, fontWeight: 700, color: '#2C1A0E', marginBottom: 8 }}>
          {listing.currency} {listing.price.toLocaleString()}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'DM Sans', fontSize: 12, color: '#7A6055' }}>
          <span>{listing.seller}</span>
          <span style={{ color: '#C4A882' }}>•</span>
          <MapPin size={11} color="#7A6055" />
          <span>{listing.location}</span>
        </div>
      </div>
    </motion.div>
  )
}
