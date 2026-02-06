"use client"

import Link from "next/link"
import { Heart } from "lucide-react"
import { useStore } from "@/lib/store"

export function Footer() {
  const { settings } = useStore()

  if (!settings?.whatsappNumber) {
    return null
  }

  const siteName = settings.siteName || "Flor & Arte"
  const formattedWhatsapp = settings.whatsappNumber.replace(/(\d{2})(\d{2})(\d{5})(\d{4})/, "$1 ($2) $3-$4")

  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-semibold mb-4">{siteName}</h3>
            <p className="text-primary-foreground/80 leading-relaxed">
              Buquês exclusivos feitos com amor e dedicação para tornar seus momentos ainda mais
              especiais.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Navegação</h4>
            <nav className="flex flex-col gap-2">
              <Link href="/" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Início
              </Link>
              <Link href="/catalogo" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Catálogo
              </Link>
              <Link href="/personalizar" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Personalizar
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contato</h4>
            <p className="text-primary-foreground/80 mb-2">
              WhatsApp:{" "}
              <a
                href={`https://wa.me/${settings.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-foreground transition-colors underline"
              >
                +{formattedWhatsapp}
              </a>
            </p>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-primary-foreground/80 text-sm">
            {new Date().getFullYear()} {siteName}. Todos os direitos reservados.
          </p>
          <p className="text-primary-foreground/80 text-sm flex items-center gap-1">
            Feito com <Heart className="h-4 w-4 fill-current" /> para você por 
            <a
              href="https://kivotec.vercel.app"
              target="_blank"
              className="hover:text-primary-foreground transition-colors"
            >
              Kivotec
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
