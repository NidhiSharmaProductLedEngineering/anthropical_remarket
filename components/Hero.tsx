'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'

const stagger = { hidden: {}, show: { transition: { staggerChildren: .12 } } }
const up = { hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: .6, ease: [.22,1,.36,1] as const } } }

const STATS = [
  { value: '10K+', label: 'Active Sellers' },
  { value: '50K+', label: 'Items Listed' },
  { value: '95%',  label: 'Happy Buyers' },
]

export default function Hero() {
  return (
    <section style={{ position: 'relative', minHeight: 580, display: 'flex', alignItems: 'center', overflow: 'hidden' }}>

      {/* Background image — warm vintage flatlay */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <img
          src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1600&q=80&fit=crop"
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {/* Fade overlay — left side opaque, right fades out */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, #F5F0EA 30%, rgba(245,240,234,.85) 55%, rgba(245,240,234,.3) 100%)' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1280, margin: '0 auto', padding: '80px 24px 60px', width: '100%' }}>
        <motion.div variants={stagger} initial="hidden" animate="show" style={{ maxWidth: 560 }}>

          {/* Badge */}
          <motion.div variants={up} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '6px 14px', background: 'rgba(78,122,94,.12)', borderRadius: 20, marginBottom: 24 }}>
            <Sparkles size={14} color="#4E7A5E" />
            <span style={{ fontFamily: 'DM Sans', fontSize: 13, color: '#4E7A5E', fontWeight: 500 }}>Sustainable shopping made beautiful</span>
          </motion.div>

          {/* Heading */}
          <motion.h1 variants={up} style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(3rem,6vw,5rem)', lineHeight: 1.08, color: '#2C1A0E', marginBottom: 20 }}>
            Discover<br />
            <em style={{ color: '#C4663A', fontStyle: 'italic' }}>Pre-Loved</em><br />
            Treasures
          </motion.h1>

          {/* Subtext */}
          <motion.p variants={up} style={{ fontFamily: 'DM Sans', fontSize: 16, lineHeight: 1.75, color: '#7A6055', marginBottom: 32, maxWidth: 440 }}>
            Join our community of treasure hunters. Buy and sell unique vintage clothing, jewelry, watches, and more — all with a story to tell.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={up} style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/browse">
              <motion.button
                whileHover={{ background: '#A34E28' }}
                whileTap={{ scale: .97 }}
                style={{ padding: '14px 28px', background: '#C4663A', color: '#FFFFFF', border: 'none', borderRadius: 10, fontFamily: 'DM Sans', fontSize: 15, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'background .18s' }}
              >
                Start Exploring →
              </motion.button>
            </Link>
            <Link href="/sell">
              <motion.button
                whileHover={{ background: '#F5DDD3' }}
                whileTap={{ scale: .97 }}
                style={{ padding: '14px 28px', background: 'transparent', color: '#2C1A0E', border: '1.5px solid #2C1A0E', borderRadius: 10, fontFamily: 'DM Sans', fontSize: 15, fontWeight: 500, cursor: 'pointer', transition: 'background .18s' }}
              >
                Sell Your Items
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div variants={up} style={{ display: 'flex', gap: 40, marginTop: 40 }}>
            {STATS.map(s => (
              <div key={s.label}>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 26, fontWeight: 700, color: '#2C1A0E' }}>{s.value}</div>
                <div style={{ fontFamily: 'DM Sans', fontSize: 13, color: '#7A6055', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
