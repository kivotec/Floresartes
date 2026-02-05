"use client"

import Image from "next/image"
import Link from "next/link"
import { MessageCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { Bouquet } from "@/lib/types"
import { useStore } from "@/lib/store"

interface BouquetCardProps {
  bouquet: Bouquet
}

export function BouquetCard({ bouquet }: BouquetCardProps) {
  const { settings } = useStore()

  if (!settings?.whatsappNumber) {
    return null
  }

  return (
    <Link href={`/buque/${bouquet.id}`} className="block group">
      <Card className="overflow-hidden bg-card border-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full">
        <div className="relative aspect-[4/5] overflow-hidden">
          <Image
            src={bouquet.images[0] || "/placeholder.svg"}
            alt={bouquet.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {bouquet.featured && (
            <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-medium px-3 py-1.5 rounded-full">
              Destaque
            </span>
          )}
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300" />
        </div>
        <CardContent className="p-4 md:p-5">
          <div className="mb-2 md:mb-3">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              {bouquet.category}
            </span>
            <h3 className="text-lg md:text-xl font-semibold text-foreground mt-1 leading-tight line-clamp-1">
              {bouquet.name}
            </h3>
          </div>
          <p className="text-muted-foreground text-sm mb-3 md:mb-4 line-clamp-2 leading-relaxed">
            {bouquet.shortDescription}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xl md:text-2xl font-bold text-primary">
              R$ {bouquet.price.toFixed(2).replace(".", ",")}
            </span>
            {bouquet.allowsCustomization && (
              <span className="text-xs text-accent-foreground bg-accent/30 px-2 py-1 rounded-full hidden sm:inline-block">
                Personalizavel
              </span>
            )}
          </div>
          {/* Mobile-friendly indicator */}
          <div className="mt-3 md:mt-4 flex items-center justify-center gap-2 text-primary text-sm font-medium">
            <MessageCircle className="h-4 w-4" />
            <span>Ver detalhes</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
