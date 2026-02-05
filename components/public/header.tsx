"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, Phone } from "lucide-react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { settings, isLoading } = useStore()

  if (!settings?.whatsappNumber) {
    return null
  }

  const whatsappLink = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
    settings.whatsappDefaultMessage || "Olá! Gostaria de fazer um pedido."
  )}`
  const siteName = (settings.siteName || "Flor & Arte").replace(" - Buquês Exclusivos", "")
  const ctaText = settings.ctaSecondaryText || "Falar no WhatsApp"

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl md:text-3xl font-semibold text-primary tracking-tight">
              {siteName}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-foreground/80 hover:text-primary transition-colors font-medium"
            >
              Inicio
            </Link>
            <Link
              href="/catalogo"
              className="text-foreground/80 hover:text-primary transition-colors font-medium"
            >
              Catalogo
            </Link>
            <Link
              href="/personalizar"
              className="text-foreground/80 hover:text-primary transition-colors font-medium"
            >
              Personalizar
            </Link>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Button asChild variant="default" size="lg" className="rounded-full gap-2">
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <Phone className="h-4 w-4" />
                {ctaText}
              </a>
            </Button>
          </div>

          {/* Mobile Menu Button - Larger touch target */}
          
        </div>

        {/* Mobile Menu - Full screen overlay */}
        {isMenuOpen && (
          <div className="md:hidden fixed inset-x-0 top-14 bottom-0 bg-background z-50 overflow-y-auto">
            <nav className="flex flex-col p-4 gap-2">
              <Link
                href="/"
                className="text-foreground hover:text-primary transition-colors font-medium py-4 px-4 rounded-xl hover:bg-muted active:bg-muted text-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link
                href="/catalogo"
                className="text-foreground hover:text-primary transition-colors font-medium py-4 px-4 rounded-xl hover:bg-muted active:bg-muted text-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Catalogo
              </Link>
              <Link
                href="/personalizar"
                className="text-foreground hover:text-primary transition-colors font-medium py-4 px-4 rounded-xl hover:bg-muted active:bg-muted text-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Personalizar
              </Link>
              <div className="pt-4 mt-2 border-t border-border">
                <Button asChild variant="default" size="lg" className="rounded-full gap-2 w-full h-14 text-base">
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer" onClick={() => setIsMenuOpen(false)}>
                    <Phone className="h-5 w-5" />
                    {ctaText}
                  </a>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
