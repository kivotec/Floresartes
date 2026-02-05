"use client"

import { useState } from "react"
import { MessageCircle, Check, Plus, Minus } from "lucide-react"
import { Header } from "@/components/public/header"
import { Footer } from "@/components/public/footer"
import { WhatsAppButton } from "@/components/public/whatsapp-button"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useStore } from "@/lib/store"

interface FlowerSelection {
  id: string
  quantity: number
}

interface Selection {
  flowers: FlowerSelection[]
  colors: string[]
  complements: string[]
}

export default function CustomizationPage() {
  const { flowers, colors, complements, settings } = useStore()

  const [selection, setSelection] = useState<Selection>({
    flowers: [],
    colors: [],
    complements: [],
  })

  const activeFlowers = flowers.filter((f) => f.active).sort((a, b) => a.order - b.order)
  const activeColors = colors.filter((c) => c.active).sort((a, b) => a.order - b.order)
  const activeComplements = complements.filter((c) => c.active).sort((a, b) => a.order - b.order)

  // Get flower selection by id
  const getFlowerQuantity = (flowerId: string): number => {
    const flower = selection.flowers.find((f) => f.id === flowerId)
    return flower?.quantity || 0
  }

  // Update flower quantity
  const updateFlowerQuantity = (flowerId: string, delta: number) => {
    setSelection((prev) => {
      const existing = prev.flowers.find((f) => f.id === flowerId)
      if (existing) {
        const newQuantity = Math.max(0, existing.quantity + delta)
        if (newQuantity === 0) {
          return {
            ...prev,
            flowers: prev.flowers.filter((f) => f.id !== flowerId),
          }
        }
        return {
          ...prev,
          flowers: prev.flowers.map((f) =>
            f.id === flowerId ? { ...f, quantity: newQuantity } : f
          ),
        }
      }
      if (delta > 0) {
        return {
          ...prev,
          flowers: [...prev.flowers, { id: flowerId, quantity: delta }],
        }
      }
      return prev
    })
  }

  // Set flower quantity directly
  const setFlowerQuantity = (flowerId: string, quantity: number) => {
    const qty = Math.max(0, Math.floor(quantity))
    setSelection((prev) => {
      if (qty === 0) {
        return {
          ...prev,
          flowers: prev.flowers.filter((f) => f.id !== flowerId),
        }
      }
      const existing = prev.flowers.find((f) => f.id === flowerId)
      if (existing) {
        return {
          ...prev,
          flowers: prev.flowers.map((f) =>
            f.id === flowerId ? { ...f, quantity: qty } : f
          ),
        }
      }
      return {
        ...prev,
        flowers: [...prev.flowers, { id: flowerId, quantity: qty }],
      }
    })
  }

  // Toggle color selection
  const toggleColor = (colorId: string) => {
    setSelection((prev) => ({
      ...prev,
      colors: prev.colors.includes(colorId)
        ? prev.colors.filter((id) => id !== colorId)
        : [...prev.colors, colorId],
    }))
  }

  // Toggle complement selection
  const toggleComplement = (complementId: string) => {
    setSelection((prev) => ({
      ...prev,
      complements: prev.complements.includes(complementId)
        ? prev.complements.filter((id) => id !== complementId)
        : [...prev.complements, complementId],
    }))
  }

  // Calculate total price
  const calculateTotal = () => {
    // Sum of (flower price * quantity)
    const flowersTotal = selection.flowers.reduce((sum, sel) => {
      const flower = flowers.find((f) => f.id === sel.id)
      return sum + (flower?.price || 0) * sel.quantity
    }, 0)

    // Sum of colors additional price
    const colorsTotal = selection.colors.reduce((sum, colorId) => {
      const color = colors.find((c) => c.id === colorId)
      return sum + (color?.price || 0)
    }, 0)

    // Sum of complements price
    const complementsTotal = selection.complements.reduce((sum, compId) => {
      const complement = complements.find((c) => c.id === compId)
      return sum + (complement?.price || 0)
    }, 0)

    return flowersTotal + colorsTotal + complementsTotal
  }

  const totalPrice = calculateTotal()

  // Build WhatsApp message
  const buildWhatsAppMessage = () => {
    const flowerDetails = selection.flowers
      .map((sel) => {
        const flower = flowers.find((f) => f.id === sel.id)
        if (!flower) return null
        const subtotal = flower.price * sel.quantity
        return `  - ${flower.name}: ${sel.quantity}x (R$ ${subtotal.toFixed(2).replace(".", ",")})`
      })
      .filter(Boolean)
      .join("\n")

    const colorNames = selection.colors
      .map((id) => colors.find((c) => c.id === id)?.name)
      .filter(Boolean)
      .join(", ")

    const complementDetails = selection.complements
      .map((id) => {
        const complement = complements.find((c) => c.id === id)
        if (!complement) return null
        return `  - ${complement.name} (R$ ${complement.price.toFixed(2).replace(".", ",")})`
      })
      .filter(Boolean)
      .join("\n")

    let message = `Olá! Gostaria de fazer um pedido de buquê personalizado:\n\n`
    
    if (flowerDetails) {
      message += `*Flores:*\n${flowerDetails}\n\n`
    }
    
    if (colorNames) {
      message += `*Cores escolhidas:* ${colorNames}\n\n`
    }
    
    if (complementDetails) {
      message += `*Complementos:*\n${complementDetails}\n\n`
    }
    
    message += `*Total estimado:* R$ ${totalPrice.toFixed(2).replace(".", ",")}\n\n`
    message += `Por favor, confirme a disponibilidade!`

    return message
  }

  const whatsappLink = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(buildWhatsAppMessage())}`

  const isValid = selection.flowers.length > 0

  const totalFlowers = selection.flowers.reduce((sum, f) => sum + f.quantity, 0)

  return (
    <>
      <Header />
      <main className="pt-20 md:pt-24">
        {/* Page Header */}
        <section className="py-8 md:py-12 bg-muted">
          <div className="container mx-auto px-4 text-center">
            <span className="text-sm text-muted-foreground uppercase tracking-widest">
              Crie o seu
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mt-2 mb-4 text-balance">
              Monte Seu Buquê
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Escolha suas flores favoritas, cores e complementos. O valor é calculado automaticamente.
            </p>
          </div>
        </section>

        {/* Customization Builder */}
        <section className="py-8 md:py-12 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Options Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Flowers Selection */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl">1. Escolha as Flores</CardTitle>
                    <p className="text-muted-foreground text-sm">
                      Selecione as flores e defina a quantidade de cada uma
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {activeFlowers.map((flower) => {
                        const qty = getFlowerQuantity(flower.id)
                        const isSelected = qty > 0
                        return (
                          <div
                            key={flower.id}
                            className={`relative p-4 rounded-xl border-2 transition-all ${
                              isSelected
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <span className="font-medium text-foreground block truncate">
                                  {flower.name}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  R$ {flower.price.toFixed(2).replace(".", ",")} /un.
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="h-10 w-10 rounded-full shrink-0 bg-transparent"
                                  onClick={() => updateFlowerQuantity(flower.id, -1)}
                                  disabled={qty === 0}
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <input
                                  type="number"
                                  min="0"
                                  value={qty}
                                  onChange={(e) => setFlowerQuantity(flower.id, Number.parseInt(e.target.value) || 0)}
                                  className="w-14 h-10 text-center font-medium border rounded-lg bg-background text-foreground"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="h-10 w-10 rounded-full shrink-0 bg-transparent"
                                  onClick={() => updateFlowerQuantity(flower.id, 1)}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            {isSelected && (
                              <div className="mt-2 text-right">
                                <span className="text-sm font-medium text-primary">
                                  Subtotal: R$ {(flower.price * qty).toFixed(2).replace(".", ",")}
                                </span>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Colors Selection */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl">2. Escolha as Cores</CardTitle>
                    <p className="text-muted-foreground text-sm">
                      Selecione uma ou mais cores para seu buquê (algumas podem ter valor adicional)
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {activeColors.map((color) => {
                        const isSelected = selection.colors.includes(color.id)
                        return (
                          <button
                            type="button"
                            key={color.id}
                            onClick={() => toggleColor(color.id)}
                            className={`relative p-4 rounded-xl border-2 transition-all ${
                              isSelected
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            {isSelected && (
                              <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                <Check className="h-3 w-3 text-primary-foreground" />
                              </div>
                            )}
                            <div
                              className="w-8 h-8 rounded-full mx-auto mb-2 border border-border"
                              style={{ backgroundColor: color.hexCode }}
                            />
                            <span className="font-medium text-foreground text-sm block">
                              {color.name}
                            </span>
                            {color.price > 0 && (
                              <span className="text-xs text-muted-foreground">
                                +R$ {color.price.toFixed(2).replace(".", ",")}
                              </span>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Complements Selection */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl">3. Complementos (Opcional)</CardTitle>
                    <p className="text-muted-foreground text-sm">
                      Adicione itens especiais ao seu buquê
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {activeComplements.map((complement) => {
                        const isSelected = selection.complements.includes(complement.id)
                        return (
                          <button
                            type="button"
                            key={complement.id}
                            onClick={() => toggleComplement(complement.id)}
                            className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                              isSelected
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            {isSelected && (
                              <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                <Check className="h-3 w-3 text-primary-foreground" />
                              </div>
                            )}
                            <span className="font-medium text-foreground block pr-6">
                              {complement.name}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              R$ {complement.price.toFixed(2).replace(".", ",")}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Summary Column */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <Card className="bg-muted border-0">
                    <CardHeader>
                      <CardTitle className="text-xl">Resumo do Pedido</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Flowers Summary */}
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">
                          Flores ({totalFlowers} un.):
                        </span>
                        {selection.flowers.length > 0 ? (
                          <ul className="mt-1 space-y-1">
                            {selection.flowers.map((sel) => {
                              const flower = flowers.find((f) => f.id === sel.id)
                              if (!flower) return null
                              return (
                                <li key={sel.id} className="text-foreground text-sm flex justify-between">
                                  <span>{flower.name} x{sel.quantity}</span>
                                  <span className="font-medium">
                                    R$ {(flower.price * sel.quantity).toFixed(2).replace(".", ",")}
                                  </span>
                                </li>
                              )
                            })}
                          </ul>
                        ) : (
                          <p className="text-sm text-muted-foreground">Nenhuma selecionada</p>
                        )}
                      </div>

                      {/* Colors Summary */}
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Cores:</span>
                        {selection.colors.length > 0 ? (
                          <div className="flex flex-wrap gap-2 mt-1">
                            {selection.colors.map((colorId) => {
                              const color = colors.find((c) => c.id === colorId)
                              if (!color) return null
                              return (
                                <span
                                  key={colorId}
                                  className="inline-flex items-center gap-1 px-2 py-1 bg-background rounded-full text-xs"
                                >
                                  <span
                                    className="w-3 h-3 rounded-full border border-border"
                                    style={{ backgroundColor: color.hexCode }}
                                  />
                                  {color.name}
                                  {color.price > 0 && (
                                    <span className="text-muted-foreground">
                                      (+R$ {color.price.toFixed(2).replace(".", ",")})
                                    </span>
                                  )}
                                </span>
                              )
                            })}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">Nenhuma selecionada</p>
                        )}
                      </div>

                      {/* Complements Summary */}
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Complementos:</span>
                        {selection.complements.length > 0 ? (
                          <ul className="mt-1 space-y-1">
                            {selection.complements.map((compId) => {
                              const complement = complements.find((c) => c.id === compId)
                              if (!complement) return null
                              return (
                                <li key={compId} className="text-foreground text-sm flex justify-between">
                                  <span>{complement.name}</span>
                                  <span className="font-medium">
                                    R$ {complement.price.toFixed(2).replace(".", ",")}
                                  </span>
                                </li>
                              )
                            })}
                          </ul>
                        ) : (
                          <p className="text-sm text-muted-foreground">Nenhum</p>
                        )}
                      </div>

                      {/* Total */}
                      <div className="border-t border-border pt-4 mt-4">
                        <div className="flex items-center justify-between text-xl font-bold">
                          <span className="text-foreground">Total:</span>
                          <span className="text-primary">
                            R$ {totalPrice.toFixed(2).replace(".", ",")}
                          </span>
                        </div>
                      </div>

                      {/* WhatsApp Button */}
                      <Button
                        asChild
                        size="lg"
                        className="w-full rounded-full mt-4 h-14 text-base"
                        disabled={!isValid}
                      >
                        <a
                          href={isValid ? whatsappLink : "#"}
                          target={isValid ? "_blank" : undefined}
                          rel={isValid ? "noopener noreferrer" : undefined}
                          className={!isValid ? "pointer-events-none opacity-50" : ""}
                        >
                          <MessageCircle className="h-5 w-5 mr-2" />
                          Finalizar no WhatsApp
                        </a>
                      </Button>

                      {!isValid && (
                        <p className="text-xs text-muted-foreground text-center">
                          Adicione pelo menos uma flor para continuar
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
