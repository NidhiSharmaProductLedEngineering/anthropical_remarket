'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const stagger = { hidden: {}, show: { transition: { staggerChildren: .14 } } }
const up = { hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: .7, ease: [.22,1,.36,1] as const } } }

const PILLARS = [
  { title: 'Free to List',    note: 'No fees to post an item' },
  { title: 'Message Sellers', note: 'Chat directly, no middleman' },
  { title: 'Meet Locally',    note: 'Arrange the exchange yourselves' },
]

export default function Hero() {
  return (
    <section className="hero-section" style={{ position: 'relative', minHeight: 620, display: 'flex', alignItems: 'center', overflow: 'hidden', background: '#16110D' }}>

      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <img
          src="https://images.unsplash.com/photo-1589363463135-e811e08d8ace?w=1600&q=80&fit=crop"
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: .55 }}
        />
        <div className="hero-gradient" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(100deg, #16110D 28%, rgba(22,17,13,.82) 55%, rgba(22,17,13,.35) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 15% 20%, rgba(184,146,90,.16), transparent 55%)' }} />
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 1, background: 'linear-gradient(90deg, transparent, #B8925A, transparent)' }} />
      </div>

      <div className="hero-inner" style={{ position: 'relative', zIndex: 1, maxWidth: 1280, margin: '0 auto', padding: '96px 24px 72px', width: '100%' }}>
        <motion.div variants={stagger} initial="hidden" animate="show" style={{ maxWidth: 620 }}>

          <motion.div variants={up} className="eyebrow" style={{ color: '#D9C08F', marginBottom: 22, display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ width: 36, height: 1, background: '#B8925A', display: 'inline-block' }} />
            Buy &amp; Sell Directly · Pre-Loved Luxury
          </motion.div>

          <motion.h1 variants={up} className="hero-heading" style={{ fontFamily: 'Cormorant Garamond, Playfair Display, serif', fontWeight: 500, fontSize: 'clamp(2.6rem,8vw,5.6rem)', lineHeight: 1.04, color: '#F8F4EC', marginBottom: 22, letterSpacing: '-0.01em' }}>
            Timeless Luxury,<br />
            <em className="gold-text" style={{ fontStyle: 'italic', fontWeight: 500 }}>Pre-Loved</em>,<br />
            Perfectly Preserved.
          </motion.h1>

          <motion.p variants={up} style={{ fontFamily: 'DM Sans', fontSize: 16, lineHeight: 1.8, color: 'rgba(248,244,236,.72)', marginBottom: 34, maxWidth: 470, fontWeight: 300 }}>
            A marketplace for pre-loved designer handbags, fine jewellery, timepieces and couture — list your own, message sellers directly, and arrange the exchange between yourselves.
          </motion.p>

          <motion.div variants={up} style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <Link href="/browse">
              <motion.button whileHover={{ background: '#D9C08F' }} whileTap={{ scale: .97 }}
                style={{ padding: '15px 32px', background: '#B8925A', color: '#16110D', border: 'none', borderRadius: 2, fontFamily: 'DM Sans', fontSize: 12, fontWeight: 500, letterSpacing: '.16em', textTransform: 'uppercase', cursor: 'pointer', transition: 'background .2s' }}>
                Browse Listings
              </motion.button>
            </Link>
            <Link href="/sell">
              <motion.button whileHover={{ background: 'rgba(184,146,90,.14)' }} whileTap={{ scale: .97 }}
                style={{ padding: '15px 32px', background: 'transparent', color: '#F8F4EC', border: '1px solid rgba(217,192,143,.6)', borderRadius: 2, fontFamily: 'DM Sans', fontSize: 12, fontWeight: 500, letterSpacing: '.16em', textTransform: 'uppercase', cursor: 'pointer', transition: 'background .2s' }}>
                Sell an Item
              </motion.button>
            </Link>
          </motion.div>

          <motion.div variants={up} className="hero-pillars" style={{ display: 'flex', gap: 40, marginTop: 52, paddingTop: 26, borderTop: '1px solid rgba(217,192,143,.25)', flexWrap: 'wrap' }}>
            {PILLARS.map(p => (
              <div key={p.title}>
                <div style={{ fontFamily: 'Cormorant Garamond, Playfair Display, serif', fontSize: 19, color: '#D9C08F', fontWeight: 500 }}>{p.title}</div>
                <div style={{ fontFamily: 'DM Sans', fontSize: 12, color: 'rgba(248,244,236,.55)', marginTop: 3, letterSpacing: '.03em' }}>{p.note}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <style jsx>{`
        @media (max-width: 640px) {
          .hero-section { min-height: 560px; }
          .hero-inner { padding: 72px 18px 48px; }
          .hero-pillars { gap: 26px; }
        }
      `}</style>
    </section>
  )
}
