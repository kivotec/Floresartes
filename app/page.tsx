"use client"

import { Header } from "@/components/public/header"
import { Footer } from "@/components/public/footer"
import { HeroSection } from "@/components/public/hero-section"
import { FeaturedSection } from "@/components/public/featured-section"
import { BenefitsSection } from "@/components/public/benefits-section"
import { CTASection } from "@/components/public/cta-section"
import { WhatsAppButton } from "@/components/public/whatsapp-button"

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <FeaturedSection />
        <BenefitsSection />
        <CTASection />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
