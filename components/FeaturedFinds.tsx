'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import ProductCard from './ProductCard'
import { featuredListings } from '@/lib/data'

export default function FeaturedFinds() {
  return (
    <section style={{ background: '#F5F0EA', padding: '72px 24px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>

        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 36, flexWrap: 'wrap', gap: 16 }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.8rem,4vw,2.6rem)', fontWeight: 700, color: '#2C1A0E', marginBottom: 8 }}>
              Featured Finds
            </h2>
            <p style={{ fontFamily: 'DM Sans', fontSize: 14, color: '#7A6055' }}>
              Hand-picked treasures from our community of sellers
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <Link href="/browse">
              <motion.button
                whileHover={{ background: '#F5DDD3' }}
                style={{ padding: '10px 22px', background: 'transparent', border: '1.5px solid #C4663A', color: '#C4663A', borderRadius: 8, fontFamily: 'DM Sans', fontSize: 14, fontWeight: 500, cursor: 'pointer', transition: 'background .18s' }}
              >
                View All Listings
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* Product grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
          {featuredListings.slice(0, 6).map((listing, i) => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * .07 }}
            >
              <ProductCard listing={listing} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
