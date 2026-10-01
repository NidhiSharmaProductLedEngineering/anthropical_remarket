'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Upload, CheckCircle, X as XIcon } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AuthModal, { type AuthUser } from '@/components/AuthModal'

const CATEGORIES = ['Clothing','Jewelry','Watches','Purses & Bags','Crockery']
const CONDITIONS = ['Excellent','Very Good','Good','Fair']
const MAX_IMAGE_BYTES = 6 * 1024 * 1024

export default function SellPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [user, setUser] = useState<AuthUser | null>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  const [form, setForm] = useState({ title: '', category: '', condition: '', price: '', description: '', location: '' })
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null)
  const [imageError, setImageError] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [createdListingId, setCreatedListingId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => { setUser(d.user ?? null); setAuthChecked(true) })
  }, [])

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageError('')
    if (file.size > MAX_IMAGE_BYTES) {
      setImageError('Photo must be under 6MB.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => setImageDataUrl(reader.result as string)
    reader.onerror = () => setImageError('Could not read that file. Try another photo.')
    reader.readAsDataURL(file)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitError('')

    if (!imageDataUrl) { setImageError('Please add a photo.'); return }

    setSubmitting(true)
    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title, category: form.category, condition: form.condition,
          price: Number(form.price), location: form.location || 'UAE', image: imageDataUrl,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setSubmitError(data.error || 'Could not create listing.'); return }
      setCreatedListingId(data.listing.id)
    } catch {
      setSubmitError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // Not signed in — gate the form
  if (authChecked && !user) {
    return (
      <>
        <Navbar />
        <main style={{ background: '#F8F4EC', minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24, textAlign: 'center' }}>
          <p style={{ fontFamily: 'Cormorant Garamond, Playfair Display, serif', fontSize: 26, color: '#16110D' }}>Sign in to list an item</p>
          <p style={{ fontFamily: 'DM Sans', fontSize: 13, color: '#7A6B5C', maxWidth: 340 }}>You need an account so buyers can message you directly about your listing.</p>
          <button onClick={() => setModalOpen(true)} style={{ padding: '12px 28px', background: '#16110D', color: '#F8F4EC', border: 'none', borderRadius: 2, fontFamily: 'DM Sans', fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', cursor: 'pointer' }}>
            Sign In / Join
          </button>
        </main>
        <Footer />
        <AuthModal open={modalOpen} initialMode="signin" onClose={() => setModalOpen(false)} onSuccess={u => { setUser(u); router.refresh() }} />
      </>
    )
  }

  if (createdListingId) {
    return (
      <>
        <Navbar />
        <main style={{ background: '#F8F4EC', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <motion.div initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }} style={{ background: '#FFFFFF', borderRadius: 4, padding: '48px 36px', textAlign: 'center', maxWidth: 420, width: '100%' }}>
            <CheckCircle size={52} color="#B8925A" style={{ margin: '0 auto 18px' }} />
            <h2 style={{ fontFamily: 'Cormorant Garamond, Playfair Display, serif', fontSize: 26, color: '#16110D', marginBottom: 12 }}>Listing Created</h2>
            <p style={{ fontFamily: 'DM Sans', fontSize: 14, color: '#7A6B5C', lineHeight: 1.65, marginBottom: 24 }}>
              Your item is now live on ReMarket. Buyers can find it and message you directly.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => router.push(`/listing/${createdListingId}`)} style={{ padding: '12px 22px', background: '#B8925A', color: '#16110D', border: 'none', borderRadius: 2, fontFamily: 'DM Sans', fontSize: 12, letterSpacing: '.1em', textTransform: 'uppercase', fontWeight: 500, cursor: 'pointer' }}>
                View Listing
              </button>
              <button onClick={() => { setCreatedListingId(null); setForm({ title: '', category: '', condition: '', price: '', description: '', location: '' }); setImageDataUrl(null) }}
                style={{ padding: '12px 22px', background: 'transparent', color: '#16110D', border: '1px solid #E9E1D3', borderRadius: 2, fontFamily: 'DM Sans', fontSize: 12, letterSpacing: '.1em', textTransform: 'uppercase', cursor: 'pointer' }}>
                List Another
              </button>
            </div>
          </motion.div>
        </main>
        <Footer />
      </>
    )
  }

  const inputStyle: React.CSSProperties = { width: '100%', padding: '11px 14px', border: '1.5px solid #E9E1D3', borderRadius: 4, background: '#FAFAF8', fontFamily: 'DM Sans', fontSize: 14, color: '#16110D', outline: 'none' }
  const labelStyle: React.CSSProperties = { fontFamily: 'DM Sans', fontSize: 13, fontWeight: 500, color: '#16110D', display: 'block', marginBottom: 6 }

  return (
    <>
      <Navbar />
      <main style={{ background: '#F8F4EC', minHeight: '100vh', padding: '32px 16px 48px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 26 }}>
            <h1 style={{ fontFamily: 'Cormorant Garamond, Playfair Display, serif', fontSize: 'clamp(1.7rem,5vw,2.1rem)', fontWeight: 500, color: '#16110D', marginBottom: 8 }}>Sell Your Item</h1>
            <p style={{ fontFamily: 'DM Sans', fontSize: 14, color: '#7A6B5C' }}>List your pre-loved luxury piece and connect directly with buyers across the UAE</p>
          </motion.div>

          <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1 }}
            style={{ background: '#FFFFFF', borderRadius: 4, padding: '24px 20px', boxShadow: '0 2px 12px rgba(22,17,13,.07)', display: 'flex', flexDirection: 'column', gap: 20 }}
          >
            <div>
              <label style={labelStyle}>Photo *</label>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={onPickFile} style={{ display: 'none' }} />
              {imageDataUrl ? (
                <div style={{ position: 'relative', width: '100%', maxWidth: 220 }}>
                  <img src={imageDataUrl} alt="Preview" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: 8, border: '1px solid #E9E1D3' }} />
                  <button type="button" onClick={() => setImageDataUrl(null)}
                    style={{ position: 'absolute', top: 6, right: 6, width: 26, height: 26, borderRadius: '50%', background: 'rgba(22,17,13,.75)', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <XIcon size={13} />
                  </button>
                </div>
              ) : (
                <div onClick={() => fileInputRef.current?.click()}
                  style={{ border: '2px dashed #D4C4B8', borderRadius: 8, padding: '30px 20px', textAlign: 'center', cursor: 'pointer', background: '#FDF9F7' }}>
                  <Upload size={26} color="#B8925A" style={{ margin: '0 auto 8px' }} />
                  <div style={{ fontFamily: 'DM Sans', fontSize: 13.5, fontWeight: 500, color: '#16110D' }}>Click to upload a photo</div>
                  <div style={{ fontFamily: 'DM Sans', fontSize: 11.5, color: '#7A6B5C', marginTop: 3 }}>PNG or JPG, up to 6MB</div>
                </div>
              )}
              {imageError && <div style={{ fontFamily: 'DM Sans', fontSize: 12, color: '#9B2C2C', marginTop: 6 }}>{imageError}</div>}
            </div>

            <div>
              <label style={labelStyle}>Item title *</label>
              <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Chanel Classic Flap Bag" style={inputStyle} required />
            </div>

            <div className="sell-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
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

            <div className="sell-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={labelStyle}>Price (Dhs) *</label>
                <input type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="0" style={inputStyle} required min={1} />
              </div>
              <div>
                <label style={labelStyle}>Location</label>
                <input value={form.location} onChange={e => set('location', e.target.value)} placeholder="e.g. Dubai, UAE" style={inputStyle} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Description</label>
              <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={4} placeholder="Describe your item — its story, history, and any special details…" style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} />
            </div>

            {submitError && (
              <div role="alert" style={{ fontFamily: 'DM Sans', fontSize: 13, color: '#9B2C2C', background: '#FBEDEA', border: '1px solid #F0CFC8', padding: '10px 12px', borderRadius: 4 }}>
                {submitError}
              </div>
            )}

            <motion.button type="submit" disabled={submitting}
              whileHover={{ background: '#8E6F3E' }} whileTap={{ scale: .98 }}
              style={{ padding: '14px', background: submitting ? '#D9C08F' : '#B8925A', color: '#16110D', border: 'none', borderRadius: 4, fontFamily: 'DM Sans', fontSize: 13, fontWeight: 600, letterSpacing: '.04em', cursor: submitting ? 'wait' : 'pointer' }}>
              {submitting ? 'Publishing…' : 'Publish Listing →'}
            </motion.button>

            <p style={{ fontFamily: 'DM Sans', fontSize: 12, color: '#7A6B5C', textAlign: 'center' }}>
              Your listing is public and buyers can message you about it directly.
            </p>
          </motion.form>
        </div>
      </main>
      <Footer />

      <style jsx>{`
        @media (max-width: 520px) {
          .sell-grid-2 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
