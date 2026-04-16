import Link from 'next/link'
import { Instagram, Twitter, Facebook } from 'lucide-react'

const cols = [
  { title: 'Marketplace', links: ['Browse All','Categories','How It Works','Pricing'] },
  { title: 'Company',     links: ['About Us','Careers','Press','Blog'] },
  { title: 'Support',     links: ['Help Center','Safety Tips','Contact Us','FAQ'] },
  { title: 'Legal',       links: ['Privacy Policy','Terms of Service','Cookie Policy'] },
]

export default function Footer() {
  return (
    <footer style={{ background: '#F5F0EA', borderTop: '1px solid #EDE8E2', padding: '56px 24px 32px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr repeat(4,1fr)', gap: 40, marginBottom: 48 }}>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 1, marginBottom: 12 }}>
              <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 700, color: '#2C1A0E' }}>Re</span>
              <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 700, color: '#C4663A', fontStyle: 'italic' }}>Market</span>
            </div>
            <p style={{ fontFamily: 'DM Sans', fontSize: 13, color: '#7A6055', lineHeight: 1.65, marginBottom: 20, maxWidth: 220 }}>
              Your destination for unique pre-loved treasures. Shop sustainably, sell easily.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <button key={i} style={{ width: 36, height: 36, borderRadius: '50%', border: '1.5px solid #D4C4B8', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#7A6055', transition: 'all .15s' }}
                  onMouseOver={e => { (e.currentTarget as HTMLElement).style.borderColor = '#C4663A'; (e.currentTarget as HTMLElement).style.color = '#C4663A' }}
                  onMouseOut={e =>  { (e.currentTarget as HTMLElement).style.borderColor = '#D4C4B8'; (e.currentTarget as HTMLElement).style.color = '#7A6055' }}
                >
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>

          {/* Link cols */}
          {cols.map(col => (
            <div key={col.title}>
              <div style={{ fontFamily: 'DM Sans', fontSize: 13, fontWeight: 600, color: '#2C1A0E', marginBottom: 14, letterSpacing: '.01em' }}>
                {col.title}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {col.links.map(link => (
                  <Link key={link} href="/" style={{ fontFamily: 'DM Sans', fontSize: 13, color: '#7A6055', textDecoration: 'none', transition: 'color .15s' }}
                    onMouseOver={e => { (e.currentTarget as HTMLElement).style.color = '#C4663A' }}
                    onMouseOut={e =>  { (e.currentTarget as HTMLElement).style.color = '#7A6055' }}
                  >
                    {link}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid #EDE8E2', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontFamily: 'DM Sans', fontSize: 12, color: '#7A6055' }}>© 2025 ReMarket. All rights reserved.</span>
          <span style={{ fontFamily: 'DM Sans', fontSize: 12, color: '#7A6055' }}>Built by Nidhi Sharma · UAE</span>
        </div>
      </div>
    </footer>
  )
}
