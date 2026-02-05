"use client"

import { MessageCircle } from "lucide-react"
import { useStore } from "@/lib/store"

export function WhatsAppButton() {
  const { settings } = useStore()

  if (!settings?.whatsappNumber) {
    return null
  }

  const whatsappLink = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
    settings.whatsappDefaultMessage || "Olá! Gostaria de fazer um pedido."
  )}`

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-accent text-accent-foreground p-4 rounded-full shadow-lg hover:scale-110 transition-transform duration-300 flex items-center justify-center"
      aria-label="Falar no WhatsApp"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  )
}
