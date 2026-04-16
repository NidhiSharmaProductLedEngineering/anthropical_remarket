import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Categories from '@/components/Categories'
import FeaturedFinds from '@/components/FeaturedFinds'
import CTASection from '@/components/CTASection'
import Footer from '@/components/Footer'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Categories />
        <FeaturedFinds />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
