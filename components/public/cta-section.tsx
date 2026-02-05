"use client"

import Link from "next/link"
import { Sparkles, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"

export function CTASection() {
  const { settings } = useStore()

  if (!settings?.whatsappNumber) {
    return null
  }

  const whatsappLink = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
    settings.whatsappDefaultMessage || "Olá! Gostaria de fazer um pedido."
  )}`
  const ctaMainText = settings.ctaMainText || "Monte seu Buquê"
  const ctaSecondaryText = settings.ctaSecondaryText || "Falar no WhatsApp"

  return (
    <section className="py-20 md:py-28 bg-primary relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-secondary/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-6 text-balance">
            Pronto para Surpreender Quem Você Ama?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-10 leading-relaxed">
            Monte um buquê único e personalizado ou fale diretamente conosco para criar o presente
            perfeito.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="rounded-full px-8 py-6 text-lg bg-card text-foreground hover:bg-card/90"
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
              className="rounded-full px-8 py-6 text-lg border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
            >
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-5 w-5 mr-2" />
                {ctaSecondaryText}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
