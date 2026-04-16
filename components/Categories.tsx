'use client'

import { motion } from 'framer-motion'
import { Shirt, Gem, Watch, ShoppingBag, UtensilsCrossed } from 'lucide-react'
import { categories } from '@/lib/data'

const ICONS: Record<string, React.ElementType> = {
  Shirt, Gem, Watch, ShoppingBag, UtensilsCrossed,
}

export default function Categories() {
  return (
    <section style={{ background: '#F0EBE3', padding: '80px 24px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 48 }}
        >
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem,4vw,2.8rem)', fontWeight: 700, color: '#2C1A0E', marginBottom: 12 }}>
            Browse by Category
          </h2>
          <p style={{ fontFamily: 'DM Sans', fontSize: 15, color: '#7A6055', lineHeight: 1.6, maxWidth: 480, margin: '0 auto' }}>
            Explore our curated collection of pre-loved treasures across five unique categories
          </p>
        </motion.div>

        {/* Category cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 16 }}>
          {categories.map((cat, i) => {
            const Icon = ICONS[cat.icon]
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * .08 }}
                whileHover={{ y: -4 }}
                className="lift"
                style={{ background: '#FFFFFF', borderRadius: 16, padding: '28px 20px', textAlign: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(44,26,14,.06)', transition: 'all .22s' }}
              >
                {/* Icon circle */}
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#F5DDD3', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Icon size={24} color="#C4663A" />
                </div>

                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 17, fontWeight: 600, color: '#2C1A0E', marginBottom: 6 }}>{cat.name}</div>
                <div style={{ fontFamily: 'DM Sans', fontSize: 13, color: '#7A6055', marginBottom: 10, lineHeight: 1.4 }}>{cat.description}</div>
                <div style={{ fontFamily: 'DM Sans', fontSize: 13, color: '#C4663A', fontWeight: 500 }}>
                  {cat.count.toLocaleString()} items
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
