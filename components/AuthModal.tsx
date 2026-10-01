'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

export interface AuthUser { id: number; name: string; email: string }
type Mode = 'signin' | 'signup'

interface Props {
  open: boolean
  initialMode: Mode
  onClose: () => void
  onSuccess: (user: AuthUser) => void
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '13px 14px', border: '1px solid #E9E1D3', borderRadius: 2,
  background: '#FFFFFF', fontFamily: 'DM Sans', fontSize: 14, color: '#16110D', outline: 'none',
}
const labelStyle: React.CSSProperties = {
  display: 'block', fontFamily: 'DM Sans', fontSize: 11, letterSpacing: '.16em',
  textTransform: 'uppercase', color: '#7A6B5C', marginBottom: 7, fontWeight: 500,
}

export default function AuthModal({ open, initialMode, onClose, onSuccess }: Props) {
  const [mode, setMode] = useState<Mode>(initialMode)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => { if (open) { setMode(initialMode); setError('') } }, [open, initialMode])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`/api/auth/${mode === 'signin' ? 'login' : 'register'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Something went wrong.'); return }
      setPassword('')
      onSuccess(data.user)
      onClose()
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          style={{ position: 'fixed', inset: 0, background: 'rgba(22,17,13,.72)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12 }}
            onClick={e => e.stopPropagation()}
            role="dialog" aria-modal="true" aria-label={mode === 'signin' ? 'Sign in' : 'Create account'}
            style={{ width: '100%', maxWidth: 420, maxHeight: '90vh', overflowY: 'auto', background: '#F8F4EC', borderRadius: 2, padding: '36px 28px 30px', position: 'relative', borderTop: '2px solid #B8925A', boxShadow: '0 30px 80px rgba(0,0,0,.45)' }}
          >
            <button onClick={onClose} aria-label="Close" style={{ position: 'absolute', top: 14, right: 14, background: 'none', border: 'none', cursor: 'pointer', color: '#7A6B5C', padding: 6 }}>
              <X size={18} />
            </button>

            <div className="eyebrow" style={{ color: '#B8925A', marginBottom: 10 }}>ReMarket</div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, Playfair Display, serif', fontSize: 30, fontWeight: 500, color: '#16110D', marginBottom: 6, lineHeight: 1.1 }}>
              {mode === 'signin' ? 'Welcome back' : 'Join ReMarket'}
            </h2>
            <p style={{ fontFamily: 'DM Sans', fontSize: 13, color: '#7A6B5C', marginBottom: 24 }}>
              {mode === 'signin' ? 'Sign in to your account.' : 'Create an account to buy and sell pre-loved luxury.'}
            </p>

            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
              {mode === 'signup' && (
                <div>
                  <label style={labelStyle} htmlFor="auth-name">Full name</label>
                  <input id="auth-name" style={inputStyle} value={name} onChange={e => setName(e.target.value)} autoComplete="name" required />
                </div>
              )}
              <div>
                <label style={labelStyle} htmlFor="auth-email">Email</label>
                <input id="auth-email" type="email" style={inputStyle} value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" required />
              </div>
              <div>
                <label style={labelStyle} htmlFor="auth-password">Password</label>
                <input id="auth-password" type="password" style={inputStyle} value={password} onChange={e => setPassword(e.target.value)} autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} minLength={mode === 'signup' ? 8 : undefined} required />
                {mode === 'signup' && <div style={{ fontFamily: 'DM Sans', fontSize: 11, color: '#7A6B5C', marginTop: 6 }}>At least 8 characters</div>}
              </div>

              {error && (
                <div role="alert" style={{ fontFamily: 'DM Sans', fontSize: 13, color: '#9B2C2C', background: '#FBEDEA', border: '1px solid #F0CFC8', padding: '10px 12px', borderRadius: 2 }}>
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading}
                style={{ marginTop: 4, padding: '14px', background: loading ? '#D9C08F' : '#16110D', color: '#F8F4EC', border: 'none', borderRadius: 2, fontFamily: 'DM Sans', fontSize: 12, letterSpacing: '.18em', textTransform: 'uppercase', fontWeight: 500, cursor: loading ? 'wait' : 'pointer' }}>
                {loading ? 'Please wait…' : mode === 'signin' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: 20, fontFamily: 'DM Sans', fontSize: 13, color: '#7A6B5C' }}>
              {mode === 'signin' ? 'New to ReMarket? ' : 'Already have an account? '}
              <button onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError('') }}
                style={{ background: 'none', border: 'none', color: '#8E6F3E', fontWeight: 500, cursor: 'pointer', fontFamily: 'DM Sans', fontSize: 13, textDecoration: 'underline' }}>
                {mode === 'signin' ? 'Create an account' : 'Sign in'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
