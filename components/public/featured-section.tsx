"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BouquetCard } from "./bouquet-card"
import { useStore } from "@/lib/store"

export function FeaturedSection() {
  const { bouquets, isLoading } = useStore()

  const featuredBouquets = bouquets.filter((b) => b.featured && b.active).slice(0, 3)

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-sm text-muted-foreground uppercase tracking-widest">
            Seleção Especial
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mt-2 mb-4 text-balance">
            Buquês Mais Vendidos
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Descubra nossos arranjos mais queridos, criados com as flores mais frescas e entregues
            com todo carinho.
          </p>
        </div>

        {/* Featured Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            <div className="col-span-full flex justify-center py-12">
              <p className="text-muted-foreground">Carregando buquês...</p>
            </div>
          ) : featuredBouquets.length > 0 ? (
            featuredBouquets.map((bouquet) => (
              <BouquetCard key={bouquet.id} bouquet={bouquet} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">Nenhum buquê destacado no momento</p>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg" className="rounded-full px-8 bg-transparent">
            <Link href="/catalogo">
              Ver Todos os Buquês
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
