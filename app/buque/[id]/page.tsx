"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { MessageCircle, ArrowLeft, Sparkles, Check, ChevronLeft, ChevronRight } from "lucide-react"
import { Header } from "@/components/public/header"
import { Footer } from "@/components/public/footer"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"

export default function BouquetDetailPage() {
  const params = useParams()
  const id = params.id as string
  const { bouquets, sizes, settings, isLoading } = useStore()
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSizeId, setSelectedSizeId] = useState<string>("")

  const bouquet = bouquets.find((b) => b.id === id && b.active)
  const activeSizes = sizes.filter((s) => s.active).sort((a, b) => a.order - b.order)

  // Show loading or not found state
  if (isLoading) {
    return (
      <>
        <Header />
        <main className="pt-16 md:pt-20 min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">Carregando...</p>
        </main>
      </>
    )
  }

  if (!bouquet || !settings?.whatsappNumber) {
    return (
      <>
        <Header />
        <main className="pt-16 md:pt-20 min-h-screen flex flex-col items-center justify-center gap-4">
          <p className="text-muted-foreground text-lg">Buque nao encontrado</p>
          <Button asChild variant="outline" className="rounded-full bg-transparent">
            <Link href="/catalogo">Voltar ao Catalogo</Link>
          </Button>
        </main>
      </>
    )
  }

  const selectedSize = sizes.find((s) => s.id === selectedSizeId)
  const finalPrice = selectedSize ? selectedSize.price : bouquet.price
  const sizeName = selectedSize ? ` - Tamanho ${selectedSize.name}` : ""

  // WhatsApp message with order summary
  const orderSummary = `
*Pedido - ${bouquet.name}*
${sizeName ? `Tamanho: ${selectedSize?.name}` : "Tamanho: Padrao"}
Valor: R$ ${finalPrice.toFixed(2).replace(".", ",")}
`.trim()

  const whatsappMessage = `Ola! Gostaria de fazer um pedido:\n\n${orderSummary}\n\nPor favor, confirme a disponibilidade!`
  const whatsappLink = `https://wa.me/5511981713690?text=${encodeURIComponent(whatsappMessage)}`

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % bouquet.images.length)
  }

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + bouquet.images.length) % bouquet.images.length)
  }

  return (
    <>
      <Header />
      <main className="pt-16 md:pt-20 pb-24 md:pb-8">
        <div className="container mx-auto px-4 py-4 md:py-8">
          {/* Back Link */}
          <Link
            href="/catalogo"
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-4 md:mb-6 text-sm md:text-base py-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Catalogo
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
            {/* Image Gallery - Mobile Swipe Friendly */}
            <div className="space-y-3 md:space-y-4">
              <div className="relative aspect-square rounded-xl md:rounded-2xl overflow-hidden bg-muted">
                <Image
                  src={bouquet.images[selectedImage] || "/placeholder.svg"}
                  alt={bouquet.name}
                  fill
                  className="object-cover"
                  priority
                />
                {/* Mobile Navigation Arrows */}
                {bouquet.images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                      aria-label="Imagem anterior"
                    >
                      <ChevronLeft className="h-5 w-5 md:h-6 md:w-6 text-foreground" />
                    </button>
                    <button
                      type="button"
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                      aria-label="Proxima imagem"
                    >
                      <ChevronRight className="h-5 w-5 md:h-6 md:w-6 text-foreground" />
                    </button>
                    {/* Image Indicators */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {bouquet.images.map((_, index) => (
                        <button
                          type="button"
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            selectedImage === index ? "bg-primary w-4" : "bg-card/70"
                          }`}
                          aria-label={`Ver imagem ${index + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
              {/* Desktop Thumbnails */}
              {bouquet.images.length > 1 && (
                <div className="hidden md:flex gap-3">
                  {bouquet.images.map((image, index) => (
                    <button
                      type="button"
                      key={image}
                      onClick={() => setSelectedImage(index)}
                      className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index ? "border-primary ring-2 ring-primary/30" : "border-transparent hover:border-primary/50"
                      }`}
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${bouquet.name} - Imagem ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <span className="text-xs md:text-sm text-muted-foreground uppercase tracking-wider">
                {bouquet.category}
              </span>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mt-1 md:mt-2 mb-3 md:mb-4">
                {bouquet.name}
              </h1>

              {/* Price - Prominent Display */}
              <p className="text-2xl md:text-3xl font-bold text-primary mb-4 md:mb-6">
                R$ {finalPrice.toFixed(2).replace(".", ",")}
              </p>

              {/* Size Selection - Touch Friendly */}
              {activeSizes.length > 0 && (
                <div className="mb-4 md:mb-6">
                  <h3 className="text-sm font-medium text-foreground mb-3">Escolha o tamanho:</h3>
                  <div className="grid grid-cols-2 gap-2 md:gap-3">
                    {activeSizes.map((size) => (
                      <button
                        type="button"
                        key={size.id}
                        onClick={() => setSelectedSizeId(size.id)}
                        className={`relative p-3 md:p-4 rounded-xl border-2 transition-all text-center min-h-[70px] active:scale-[0.98] ${
                          selectedSizeId === size.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        {selectedSizeId === size.id && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                            <Check className="h-3 w-3 text-primary-foreground" />
                          </div>
                        )}
                        <span className="font-medium text-foreground block text-sm md:text-base">{size.name}</span>
                        <span className="text-xs md:text-sm text-muted-foreground">
                          R$ {size.price.toFixed(2).replace(".", ",")}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="text-muted-foreground mb-4 md:mb-6">
                <p className="leading-relaxed text-sm md:text-base">{bouquet.description}</p>
              </div>

              {/* Features */}
              <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                <div className="flex items-center gap-3 text-foreground">
                  <Check className="h-4 w-4 md:h-5 md:w-5 text-accent flex-shrink-0" />
                  <span className="text-sm md:text-base">Flores frescas e selecionadas</span>
                </div>
                <div className="flex items-center gap-3 text-foreground">
                  <Check className="h-4 w-4 md:h-5 md:w-5 text-accent flex-shrink-0" />
                  <span className="text-sm md:text-base">Embalagem premium</span>
                </div>
                {bouquet.allowsCustomization && (
                  <div className="flex items-center gap-3 text-foreground">
                    <Check className="h-4 w-4 md:h-5 md:w-5 text-accent flex-shrink-0" />
                    <span className="text-sm md:text-base">Disponivel para personalizacao</span>
                  </div>
                )}
              </div>

              {/* Order Summary Card */}
              <div className="bg-muted rounded-xl p-4 mb-4 md:mb-6">
                <h4 className="font-semibold text-foreground mb-2 text-sm md:text-base">Resumo do Pedido</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Buque:</span>
                    <span className="text-foreground font-medium">{bouquet.name}</span>
                  </div>
                  {selectedSize && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tamanho:</span>
                      <span className="text-foreground font-medium">{selectedSize.name}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-border mt-2">
                    <span className="text-foreground font-semibold">Total:</span>
                    <span className="text-primary font-bold text-lg">
                      R$ {finalPrice.toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Desktop CTAs */}
              <div className="hidden md:flex flex-col sm:flex-row gap-3 mt-auto">
                <Button asChild size="lg" className="rounded-full flex-1 h-14 text-base">
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Comprar pelo WhatsApp
                  </a>
                </Button>
                {bouquet.allowsCustomization && (
                  <Button asChild variant="outline" size="lg" className="rounded-full flex-1 h-14 text-base bg-transparent">
                    <Link href="/personalizar">
                      <Sparkles className="h-5 w-5 mr-2" />
                      Personalizar
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Fixed CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 md:hidden z-50 safe-area-inset-bottom">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">Total:</span>
          <span className="text-xl font-bold text-primary">
            R$ {finalPrice.toFixed(2).replace(".", ",")}
          </span>
        </div>
        <div className="flex gap-2">
          <Button asChild size="lg" className="rounded-full flex-1 h-14 text-base">
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-5 w-5 mr-2" />
              Comprar
            </a>
          </Button>
          {bouquet.allowsCustomization && (
            <Button asChild variant="outline" size="lg" className="rounded-full h-14 px-4 bg-transparent">
              <Link href="/personalizar">
                <Sparkles className="h-5 w-5" />
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="hidden md:block">
        <Footer />
      </div>
    </>
  )
}
