'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import { allListings, categories } from '@/lib/data'

const CONDITIONS = ['All','Excellent','Very Good','Good']
const SORT_OPTIONS = ['Newest','Price: Low to High','Price: High to Low','Most Popular']

export default function BrowsePage() {
  const [search,    setSearch]    = useState('')
  const [category,  setCategory]  = useState('all')
  const [condition, setCondition] = useState('All')
  const [sort,      setSort]      = useState('Newest')
  const [showFilters, setShowFilters] = useState(false)

  const filtered = allListings.filter(l => {
    const matchSearch = l.title.toLowerCase().includes(search.toLowerCase())
    const matchCat    = category === 'all' || l.category.toLowerCase().includes(category.toLowerCase())
    const matchCond   = condition === 'All' || l.condition === condition
    return matchSearch && matchCat && matchCond
  })

  return (
    <>
      <Navbar />
      <main style={{ background: '#F5F0EA', minHeight: '100vh' }}>

        {/* Page header */}
        <div style={{ background: '#FFFFFF', borderBottom: '1px solid #EDE8E2', padding: '28px 24px' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 700, color: '#2C1A0E', marginBottom: 4 }}>Browse Listings</h1>
            <p style={{ fontFamily: 'DM Sans', fontSize: 14, color: '#7A6055' }}>{filtered.length} treasures available</p>
          </div>
        </div>

        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 24px', display: 'grid', gridTemplateColumns: '240px 1fr', gap: 28, alignItems: 'start' }}>

          {/* Sidebar filters */}
          <div style={{ background: '#FFFFFF', borderRadius: 12, padding: '22px', boxShadow: '0 2px 8px rgba(44,26,14,.06)', position: 'sticky', top: 88 }}>
            <div style={{ fontFamily: 'DM Sans', fontSize: 14, fontWeight: 600, color: '#2C1A0E', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 6 }}>
              <SlidersHorizontal size={16} color="#C4663A" />
              Filters
            </div>

            {/* Category */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: 'DM Sans', fontSize: 12, fontWeight: 600, color: '#7A6055', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10 }}>Category</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[{ id: 'all', name: 'All Categories' }, ...categories].map(cat => (
                  <button key={cat.id} onClick={() => setCategory(cat.id)}
                    style={{ textAlign: 'left', padding: '7px 10px', borderRadius: 7, border: 'none', background: category === cat.id ? '#F5DDD3' : 'transparent', color: category === cat.id ? '#C4663A' : '#2C1A0E', fontFamily: 'DM Sans', fontSize: 13, cursor: 'pointer', transition: 'all .15s', fontWeight: category === cat.id ? 500 : 400 }}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Condition */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: 'DM Sans', fontSize: 12, fontWeight: 600, color: '#7A6055', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10 }}>Condition</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {CONDITIONS.map(c => (
                  <button key={c} onClick={() => setCondition(c)}
                    style={{ textAlign: 'left', padding: '7px 10px', borderRadius: 7, border: 'none', background: condition === c ? '#F5DDD3' : 'transparent', color: condition === c ? '#C4663A' : '#2C1A0E', fontFamily: 'DM Sans', fontSize: 13, cursor: 'pointer', transition: 'all .15s', fontWeight: condition === c ? 500 : 400 }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset */}
            {(category !== 'all' || condition !== 'All' || search) && (
              <button
                onClick={() => { setCategory('all'); setCondition('All'); setSearch('') }}
                style={{ width: '100%', padding: '9px', border: '1px solid #EDE8E2', borderRadius: 8, background: 'transparent', fontFamily: 'DM Sans', fontSize: 13, color: '#7A6055', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}
              >
                <X size={13} /> Clear filters
              </button>
            )}
          </div>

          {/* Main content */}
          <div>
            {/* Search + sort bar */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 24, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 220, position: 'relative' }}>
                <Search size={16} color="#7A6055" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Search treasures..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px 10px 38px', border: '1.5px solid #EDE8E2', borderRadius: 9, background: '#FFFFFF', fontFamily: 'DM Sans', fontSize: 13, color: '#2C1A0E', outline: 'none' }}
                />
              </div>
              <select value={sort} onChange={e => setSort(e.target.value)}
                style={{ padding: '10px 14px', border: '1.5px solid #EDE8E2', borderRadius: 9, background: '#FFFFFF', fontFamily: 'DM Sans', fontSize: 13, color: '#2C1A0E', cursor: 'pointer', outline: 'none' }}
              >
                {SORT_OPTIONS.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>

            {/* Grid */}
            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', fontFamily: 'DM Sans', fontSize: 15, color: '#7A6055' }}>
                No treasures found. Try adjusting your filters.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18 }}>
                {filtered.map((listing, i) => (
                  <motion.div
                    key={listing.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * .05 }}
                  >
                    <ProductCard listing={listing} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
