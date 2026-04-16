'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, Sparkles, CheckCircle } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const CATEGORIES = ['Clothing','Jewelry','Watches','Purses & Bags','Crockery']
const CONDITIONS = ['Excellent','Very Good','Good','Fair']

export default function SellPage() {
  const [form, setForm] = useState({ title: '', category: '', condition: '', price: '', description: '', location: '' })
  const [generating, setGenerating] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const generateDesc = async () => {
    if (!form.title || !form.category) return
    setGenerating(true)
    await new Promise(r => setTimeout(r, 1400))
    set('description', `This beautiful ${form.title} is a must-have for any treasure hunter. In ${form.condition || 'great'} condition, this ${form.category.toLowerCase()} piece carries a story of quality and style. A rare find that deserves a loving new home.`)
    setGenerating(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await new Promise(r => setTimeout(r, 800))
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <>
        <Navbar />
        <main style={{ background: '#F5F0EA', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <motion.div initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }} style={{ background: '#FFFFFF', borderRadius: 16, padding: '56px 48px', textAlign: 'center', maxWidth: 420 }}>
            <CheckCircle size={56} color="#4E7A5E" style={{ margin: '0 auto 20px' }} />
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 26, color: '#2C1A0E', marginBottom: 12 }}>Listing Created!</h2>
            <p style={{ fontFamily: 'DM Sans', fontSize: 14, color: '#7A6055', lineHeight: 1.65, marginBottom: 24 }}>
              Your item is now live on ReMarket. Our community will discover your treasure soon.
            </p>
            <button onClick={() => setSubmitted(false)} style={{ padding: '12px 28px', background: '#C4663A', color: '#FFFFFF', border: 'none', borderRadius: 9, fontFamily: 'DM Sans', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
              List Another Item
            </button>
          </motion.div>
        </main>
        <Footer />
      </>
    )
  }

  const inputStyle: React.CSSProperties = { width: '100%', padding: '11px 14px', border: '1.5px solid #EDE8E2', borderRadius: 9, background: '#FAFAF8', fontFamily: 'DM Sans', fontSize: 14, color: '#2C1A0E', outline: 'none', transition: 'border-color .15s' }
  const labelStyle: React.CSSProperties = { fontFamily: 'DM Sans', fontSize: 13, fontWeight: 500, color: '#2C1A0E', display: 'block', marginBottom: 6 }

  return (
    <>
      <Navbar />
      <main style={{ background: '#F5F0EA', minHeight: '100vh', padding: '40px 24px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, fontWeight: 700, color: '#2C1A0E', marginBottom: 8 }}>Sell Your Item</h1>
            <p style={{ fontFamily: 'DM Sans', fontSize: 14, color: '#7A6055' }}>List your pre-loved treasure and reach thousands of buyers across the UAE</p>
          </motion.div>

          <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1 }}
            style={{ background: '#FFFFFF', borderRadius: 16, padding: '32px', boxShadow: '0 2px 12px rgba(44,26,14,.07)', display: 'flex', flexDirection: 'column', gap: 22 }}
          >

            {/* Photo upload */}
            <div>
              <label style={labelStyle}>Photos</label>
              <div style={{ border: '2px dashed #D4C4B8', borderRadius: 12, padding: '36px 24px', textAlign: 'center', cursor: 'pointer', background: '#FDF9F7', transition: 'border-color .15s' }}
                onMouseOver={e => { (e.currentTarget as HTMLElement).style.borderColor = '#C4663A' }}
                onMouseOut={e =>  { (e.currentTarget as HTMLElement).style.borderColor = '#D4C4B8' }}
              >
                <Upload size={28} color="#C4663A" style={{ margin: '0 auto 10px' }} />
                <div style={{ fontFamily: 'DM Sans', fontSize: 14, fontWeight: 500, color: '#2C1A0E', marginBottom: 4 }}>Click to upload photos</div>
                <div style={{ fontFamily: 'DM Sans', fontSize: 12, color: '#7A6055' }}>PNG, JPG up to 10MB each · Add up to 8 photos</div>
              </div>
            </div>

            {/* Title */}
            <div>
              <label style={labelStyle}>Item title *</label>
              <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Vintage Levi's Denim Jacket" style={inputStyle} required />
            </div>

            {/* Category + Condition */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={labelStyle}>Category *</label>
                <select value={form.category} onChange={e => set('category', e.target.value)} style={inputStyle} required>
                  <option value="">Select category</option>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Condition *</label>
                <select value={form.condition} onChange={e => set('condition', e.target.value)} style={inputStyle} required>
                  <option value="">Select condition</option>
                  {CONDITIONS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Price + Location */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={labelStyle}>Price (Dhs) *</label>
                <input type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="0" style={inputStyle} required min={1} />
              </div>
              <div>
                <label style={labelStyle}>Location</label>
                <input value={form.location} onChange={e => set('location', e.target.value)} placeholder="e.g. Dubai, UAE" style={inputStyle} />
              </div>
            </div>

            {/* Description + AI */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={{ ...labelStyle, marginBottom: 0 }}>Description</label>
                <button type="button" onClick={generateDesc} disabled={!form.title || !form.category || generating}
                  style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', background: generating ? '#F5DDD3' : '#F5DDD3', border: 'none', borderRadius: 6, fontFamily: 'DM Sans', fontSize: 12, color: '#C4663A', fontWeight: 500, cursor: form.title && form.category ? 'pointer' : 'not-allowed', opacity: form.title && form.category ? 1 : .5 }}
                >
                  <Sparkles size={13} /> {generating ? 'Generating…' : 'AI Write'}
                </button>
              </div>
              <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={4} placeholder="Describe your item — its story, history, and any special details…" style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} />
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              whileHover={{ background: '#A34E28' }}
              whileTap={{ scale: .98 }}
              style={{ padding: '14px', background: '#C4663A', color: '#FFFFFF', border: 'none', borderRadius: 10, fontFamily: 'DM Sans', fontSize: 15, fontWeight: 500, cursor: 'pointer', transition: 'background .18s' }}
            >
              Publish Listing →
            </motion.button>

            <p style={{ fontFamily: 'DM Sans', fontSize: 12, color: '#7A6055', textAlign: 'center' }}>
              By listing, you agree to our Terms of Service. ReMarket takes a 5% commission on successful sales.
            </p>
          </motion.form>
        </div>
      </main>
      <Footer />
    </>
  )
}
