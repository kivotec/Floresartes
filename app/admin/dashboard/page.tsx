"use client"

import Link from "next/link"
import { Flower, Palette, Settings, TrendingUp, Package, Sparkles } from "lucide-react"
import { ProtectedRoute } from "@/components/admin/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"

export default function AdminDashboardPage() {
  const { bouquets, flowers, colors, sizes, complements } = useStore()

  const activeBouquets = bouquets.filter((b) => b.active)
  const totalCustomizationItems =
    flowers.filter((f) => f.active).length +
    colors.filter((c) => c.active).length +
    sizes.filter((s) => s.active).length +
    complements.filter((c) => c.active).length

  const stats = [
    {
      name: "Total de Buquês",
      value: bouquets.length,
      description: `${activeBouquets.length} ativos`,
      icon: Flower,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      name: "Itens de Personalização",
      value: totalCustomizationItems,
      description: "Flores, cores, tamanhos e complementos",
      icon: Palette,
      color: "text-accent-foreground",
      bg: "bg-accent/30",
    },
    {
      name: "Buquês em Destaque",
      value: bouquets.filter((b) => b.featured).length,
      description: "Exibidos na página inicial",
      icon: TrendingUp,
      color: "text-secondary-foreground",
      bg: "bg-secondary/50",
    },
    {
      name: "Personalizáveis",
      value: bouquets.filter((b) => b.allowsCustomization).length,
      description: "Buquês com personalização",
      icon: Sparkles,
      color: "text-primary",
      bg: "bg-primary/10",
    },
  ]

  const quickActions = [
    { name: "Novo Buquê", href: "/admin/buques", icon: Package },
    { name: "Gerenciar Personalização", href: "/admin/personalizacao", icon: Palette },
    { name: "Configurações", href: "/admin/configuracoes", icon: Settings },
  ]

  return (
    <ProtectedRoute>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Visão geral do seu negócio</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.name}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${stat.bg}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.name}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickActions.map((action) => (
                <Button
                  key={action.name}
                  asChild
                  variant="outline"
                  className="h-auto py-4 justify-start bg-transparent"
                >
                  <Link href={action.href}>
                    <action.icon className="h-5 w-5 mr-3" />
                    {action.name}
                  </Link>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Bouquets */}
        <Card className="mt-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Buquês Recentes</CardTitle>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/buques">Ver Todos</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bouquets.slice(0, 5).map((bouquet) => (
                <div
                  key={bouquet.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-secondary overflow-hidden">
                      <img
                        src={bouquet.images[0] || "/placeholder.svg"}
                        alt={bouquet.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{bouquet.name}</p>
                      <p className="text-sm text-muted-foreground">{bouquet.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">
                      R$ {bouquet.price.toFixed(2).replace(".", ",")}
                    </p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        bouquet.active
                          ? "bg-accent/30 text-accent-foreground"
                          : "bg-muted-foreground/20 text-muted-foreground"
                      }`}
                    >
                      {bouquet.active ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}
