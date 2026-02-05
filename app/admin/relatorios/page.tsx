"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/admin/protected-route"
import { AdminSidebar } from "@/components/admin/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DollarSign,
  TrendingUp,
  Package,
  ShoppingBag,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

interface Order {
  id: string
  customerName: string
  totalPrice: number
  status: string
  createdAt: string
  flowers: Array<{ flowerName: string; quantity: number; unitPrice: number }>
}

interface DailySales {
  date: string
  total: number
  count: number
}

export default function ReportsPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [period, setPeriod] = useState<"7" | "30" | "90">("30")

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders")
        if (res.ok) {
          const data = await res.json()
          setOrders(data)
        }
      } catch (error) {
        console.error("Error fetching orders:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchOrders()
  }, [])

  // Filter orders by period
  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.createdAt)
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(period))
    return orderDate >= cutoffDate
  })

  // Calculate metrics
  const totalRevenue = filteredOrders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.totalPrice, 0)

  const totalOrders = filteredOrders.filter((o) => o.status !== "cancelled").length
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
  const cancelledOrders = filteredOrders.filter((o) => o.status === "cancelled").length

  // Previous period comparison
  const previousPeriodStart = new Date()
  previousPeriodStart.setDate(previousPeriodStart.getDate() - parseInt(period) * 2)
  const previousPeriodEnd = new Date()
  previousPeriodEnd.setDate(previousPeriodEnd.getDate() - parseInt(period))

  const previousPeriodOrders = orders.filter((order) => {
    const orderDate = new Date(order.createdAt)
    return orderDate >= previousPeriodStart && orderDate < previousPeriodEnd
  })

  const previousRevenue = previousPeriodOrders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.totalPrice, 0)

  const revenueChange =
    previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0

  // Daily sales data
  const dailySales: DailySales[] = []
  const dateMap = new Map<string, { total: number; count: number }>()

  filteredOrders
    .filter((o) => o.status !== "cancelled")
    .forEach((order) => {
      const date = new Date(order.createdAt).toLocaleDateString("pt-BR")
      const existing = dateMap.get(date) || { total: 0, count: 0 }
      dateMap.set(date, {
        total: existing.total + order.totalPrice,
        count: existing.count + 1,
      })
    })

  dateMap.forEach((value, key) => {
    dailySales.push({ date: key, total: value.total, count: value.count })
  })

  dailySales.sort((a, b) => {
    const dateA = new Date(a.date.split("/").reverse().join("-"))
    const dateB = new Date(b.date.split("/").reverse().join("-"))
    return dateB.getTime() - dateA.getTime()
  })

  // Top flowers
  const flowerSales = new Map<string, { quantity: number; revenue: number }>()
  filteredOrders
    .filter((o) => o.status !== "cancelled")
    .forEach((order) => {
      order.flowers?.forEach((flower) => {
        const existing = flowerSales.get(flower.flowerName) || { quantity: 0, revenue: 0 }
        flowerSales.set(flower.flowerName, {
          quantity: existing.quantity + flower.quantity,
          revenue: existing.revenue + flower.quantity * flower.unitPrice,
        })
      })
    })

  const topFlowers = Array.from(flowerSales.entries())
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5)

  // Status distribution
  const statusCounts = {
    pending: filteredOrders.filter((o) => o.status === "pending").length,
    confirmed: filteredOrders.filter((o) => o.status === "confirmed").length,
    preparing: filteredOrders.filter((o) => o.status === "preparing").length,
    ready: filteredOrders.filter((o) => o.status === "ready").length,
    delivered: filteredOrders.filter((o) => o.status === "delivered").length,
    cancelled: filteredOrders.filter((o) => o.status === "cancelled").length,
  }

  const formatPrice = (price: number) => `R$ ${price.toFixed(2).replace(".", ",")}`

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />

        <main className="flex-1 p-4 md:p-8 md:ml-64">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">Relatorios</h1>
                <p className="text-muted-foreground mt-1">Acompanhe o desempenho das vendas</p>
              </div>
              <Select value={period} onValueChange={(v) => setPeriod(v as "7" | "30" | "90")}>
                <SelectTrigger className="w-48">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Ultimos 7 dias</SelectItem>
                  <SelectItem value="30">Ultimos 30 dias</SelectItem>
                  <SelectItem value="90">Ultimos 90 dias</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground">Carregando relatorios...</p>
              </div>
            ) : (
              <>
                {/* Main Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Faturamento</p>
                          <p className="text-2xl font-bold text-foreground mt-1">
                            {formatPrice(totalRevenue)}
                          </p>
                          <div className="flex items-center mt-2">
                            {revenueChange >= 0 ? (
                              <ArrowUpRight className="h-4 w-4 text-green-600" />
                            ) : (
                              <ArrowDownRight className="h-4 w-4 text-red-600" />
                            )}
                            <span
                              className={`text-sm ${revenueChange >= 0 ? "text-green-600" : "text-red-600"}`}
                            >
                              {Math.abs(revenueChange).toFixed(1)}%
                            </span>
                            <span className="text-sm text-muted-foreground ml-1">vs periodo anterior</span>
                          </div>
                        </div>
                        <div className="p-3 bg-primary/10 rounded-xl">
                          <DollarSign className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Pedidos</p>
                          <p className="text-2xl font-bold text-foreground mt-1">{totalOrders}</p>
                          <p className="text-sm text-muted-foreground mt-2">
                            {cancelledOrders} cancelados
                          </p>
                        </div>
                        <div className="p-3 bg-accent/30 rounded-xl">
                          <ShoppingBag className="h-6 w-6 text-accent-foreground" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Ticket Medio</p>
                          <p className="text-2xl font-bold text-foreground mt-1">
                            {formatPrice(avgOrderValue)}
                          </p>
                          <p className="text-sm text-muted-foreground mt-2">por pedido</p>
                        </div>
                        <div className="p-3 bg-secondary rounded-xl">
                          <TrendingUp className="h-6 w-6 text-secondary-foreground" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Taxa Conversao</p>
                          <p className="text-2xl font-bold text-foreground mt-1">
                            {totalOrders + cancelledOrders > 0
                              ? ((totalOrders / (totalOrders + cancelledOrders)) * 100).toFixed(0)
                              : 0}
                            %
                          </p>
                          <p className="text-sm text-muted-foreground mt-2">pedidos entregues</p>
                        </div>
                        <div className="p-3 bg-muted rounded-xl">
                          <Package className="h-6 w-6 text-muted-foreground" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {/* Daily Sales */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Vendas Diarias</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {dailySales.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">
                          Nenhuma venda no periodo
                        </p>
                      ) : (
                        <div className="space-y-3 max-h-80 overflow-y-auto">
                          {dailySales.slice(0, 10).map((day) => (
                            <div
                              key={day.date}
                              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                            >
                              <div>
                                <p className="font-medium">{day.date}</p>
                                <p className="text-sm text-muted-foreground">
                                  {day.count} pedido{day.count !== 1 ? "s" : ""}
                                </p>
                              </div>
                              <p className="font-bold text-primary">{formatPrice(day.total)}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Top Flowers */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Flores Mais Vendidas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {topFlowers.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">
                          Nenhuma venda no periodo
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {topFlowers.map((flower, index) => (
                            <div
                              key={flower.name}
                              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                                  {index + 1}
                                </div>
                                <div>
                                  <p className="font-medium">{flower.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {flower.quantity} unidades
                                  </p>
                                </div>
                              </div>
                              <p className="font-bold">{formatPrice(flower.revenue)}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Status Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>Distribuicao por Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                      <div className="text-center p-4 bg-yellow-50 rounded-xl">
                        <p className="text-2xl font-bold text-yellow-700">{statusCounts.pending}</p>
                        <p className="text-sm text-yellow-600">Pendentes</p>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-xl">
                        <p className="text-2xl font-bold text-blue-700">{statusCounts.confirmed}</p>
                        <p className="text-sm text-blue-600">Confirmados</p>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-xl">
                        <p className="text-2xl font-bold text-purple-700">{statusCounts.preparing}</p>
                        <p className="text-sm text-purple-600">Preparando</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-xl">
                        <p className="text-2xl font-bold text-green-700">{statusCounts.ready}</p>
                        <p className="text-sm text-green-600">Prontos</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-xl">
                        <p className="text-2xl font-bold text-gray-700">{statusCounts.delivered}</p>
                        <p className="text-sm text-gray-600">Entregues</p>
                      </div>
                      <div className="text-center p-4 bg-red-50 rounded-xl">
                        <p className="text-2xl font-bold text-red-700">{statusCounts.cancelled}</p>
                        <p className="text-sm text-red-600">Cancelados</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
