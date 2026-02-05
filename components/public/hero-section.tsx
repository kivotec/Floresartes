"use client"

import Link from "next/link"
import { Phone, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"

export function HeroSection() {
  const { settings } = useStore()

  if (!settings?.whatsappNumber) {
    return null
  }

  const whatsappLink = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
    settings.whatsappDefaultMessage || "Olá! Gostaria de fazer um pedido."
  )}`
  const heroTitle = settings.heroTitle || "Flores que Falam por Você"
  const heroSubtitle =
    settings.heroSubtitle ||
    "Presenteie quem você ama com buquês exclusivos, feitos com carinho e flores frescas."
  const ctaMainText = settings.ctaMainText || "Monte seu Buquê"
  const ctaSecondaryText = settings.ctaSecondaryText || "Falar no WhatsApp"

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=1920')",
        }}
      >
        <div className="absolute inset-0 bg-foreground/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block text-secondary text-sm md:text-base font-medium tracking-widest uppercase mb-4">
            Buquês Exclusivos
          </span>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-card mb-6 leading-tight text-balance">
            {heroTitle}
          </h1>

          <p className="text-lg md:text-xl text-card/90 mb-10 max-w-2xl mx-auto leading-relaxed text-pretty">
            {heroSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="rounded-full px-8 py-6 text-lg bg-secondary text-secondary-foreground hover:bg-secondary/90"
            >
              <Link href="/personalizar">
                <Sparkles className="h-5 w-5 mr-2" />
                {ctaMainText}
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full px-8 py-6 text-lg border-card text-card hover:bg-card/10 bg-transparent"
            >
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <Phone className="h-5 w-5 mr-2" />
                {ctaSecondaryText}
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-card/50 rounded-full flex items-start justify-center p-1">
          <div className="w-1.5 h-3 bg-card/50 rounded-full" />
        </div>
      </div>
    </section>
  )
}
