'use client'

import { motion } from 'framer-motion'
import { Leaf, Users, ShieldCheck } from 'lucide-react'

const features = [
  { icon: Leaf,        title: 'Sustainable',  desc: 'Give pre-loved items a second life' },
  { icon: Users,       title: 'Community',    desc: 'Connect with fellow treasure hunters' },
  { icon: ShieldCheck, title: 'Secure',       desc: 'Safe transactions, buyer protection' },
]

export default function CTASection() {
  return (
    <section style={{ background: '#3D2510', padding: '80px 24px', position: 'relative', overflow: 'hidden' }}>
      {/* Decorative circles */}
      <div style={{ position: 'absolute', top: -60, left: -60, width: 200, height: 200, borderRadius: '50%', background: 'rgba(196,102,58,.2)' }} />
      <div style={{ position: 'absolute', bottom: -80, right: -40, width: 260, height: 260, borderRadius: '50%', background: 'rgba(196,102,58,.12)' }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center', position: 'relative', zIndex: 1 }}>

        {/* Left */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .6 }}
        >
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.15, marginBottom: 20 }}>
            Ready to Start Your<br />
            <em style={{ color: '#C4663A' }}>Treasure Hunt?</em>
          </h2>
          <p style={{ fontFamily: 'DM Sans', fontSize: 15, color: '#C4A882', lineHeight: 1.75, marginBottom: 32, maxWidth: 420 }}>
            Join thousands of users who buy and sell unique pre-loved items every day. Create your free account and start exploring.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <motion.button
              whileHover={{ background: '#F5F0EA' }}
              whileTap={{ scale: .97 }}
              style={{ padding: '14px 26px', background: '#FFFFFF', color: '#2C1A0E', border: 'none', borderRadius: 10, fontFamily: 'DM Sans', fontSize: 14, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'background .18s' }}
            >
              Create Free Account →
            </motion.button>
            <motion.button
              whileHover={{ borderColor: '#FFFFFF', color: '#FFFFFF' }}
              whileTap={{ scale: .97 }}
              style={{ padding: '14px 26px', background: 'transparent', color: '#C4A882', border: '1.5px solid rgba(196,168,130,.5)', borderRadius: 10, fontFamily: 'DM Sans', fontSize: 14, fontWeight: 500, cursor: 'pointer', transition: 'all .18s' }}
            >
              Browse First
            </motion.button>
          </div>
        </motion.div>

        {/* Right — feature cards */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .6, delay: .1 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
        >
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * .1 }}
              style={{ background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 12, padding: '20px 22px', display: 'flex', alignItems: 'center', gap: 16 }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(196,102,58,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <f.icon size={20} color="#C4663A" />
              </div>
              <div>
                <div style={{ fontFamily: 'DM Sans', fontSize: 15, fontWeight: 500, color: '#FFFFFF', marginBottom: 3 }}>{f.title}</div>
                <div style={{ fontFamily: 'DM Sans', fontSize: 13, color: '#C4A882' }}>{f.desc}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
