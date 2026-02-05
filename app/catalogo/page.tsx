"use client"

import { useState } from "react"
import { Header } from "@/components/public/header"
import { Footer } from "@/components/public/footer"
import { WhatsAppButton } from "@/components/public/whatsapp-button"
import { BouquetCard } from "@/components/public/bouquet-card"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"

export default function CatalogPage() {
  const { bouquets, isLoading } = useStore()
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos")

  const activeBouquets = bouquets.filter((b) => b.active)
  const categories = ["Todos", ...new Set(activeBouquets.map((b) => b.category))]

  const filteredBouquets =
    selectedCategory === "Todos"
      ? activeBouquets
      : activeBouquets.filter((b) => b.category === selectedCategory)

  return (
    <>
      <Header />
      <main className="pt-16 md:pt-20">
        {/* Page Header */}
        <section className="py-8 md:py-16 bg-muted">
          <div className="container mx-auto px-4 text-center">
            <span className="text-xs md:text-sm text-muted-foreground uppercase tracking-widest">
              Nossa Colecao
            </span>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-foreground mt-2 mb-3 md:mb-4 text-balance">
              Catalogo de Buques
            </h1>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Explore nossa selecao de buques exclusivos, cada um criado com flores frescas e muito carinho.
            </p>
          </div>
        </section>

        {/* Filters - Horizontal Scroll on Mobile */}
        <section className="py-4 md:py-6 border-b border-border bg-background sticky top-14 md:top-20 z-40">
          <div className="container mx-auto px-4">
            <div className="flex md:flex-wrap md:justify-center gap-2 overflow-x-auto pb-2 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  className="rounded-full whitespace-nowrap flex-shrink-0 h-10 px-4 text-sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Products Grid - 2 columns on mobile */}
        <section className="py-6 md:py-12 bg-background">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="text-center py-12 md:py-16">
                <p className="text-muted-foreground text-base md:text-lg">Carregando buques...</p>
              </div>
            ) : filteredBouquets.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 lg:gap-8">
                {filteredBouquets.map((bouquet) => (
                  <BouquetCard key={bouquet.id} bouquet={bouquet} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 md:py-16">
                <p className="text-muted-foreground text-base md:text-lg">
                  Nenhum buque encontrado nesta categoria.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
