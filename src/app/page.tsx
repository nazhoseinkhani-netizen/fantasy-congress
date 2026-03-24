import { HeroSection } from '@/components/landing/hero-section'
import { HowItWorks } from '@/components/landing/how-it-works'
import { FeaturedCarousel } from '@/components/landing/featured-carousel'
import { AlvaFooter } from '@/components/landing/alva-footer'

export default function Home() {
  return (
    <div className="space-y-16 pb-16">
      <HeroSection />
      <HowItWorks />
      <FeaturedCarousel />
      <AlvaFooter variant="full" />
    </div>
  )
}
