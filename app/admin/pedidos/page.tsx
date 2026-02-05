"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/admin/protected-route"
import { AdminSidebar } from "@/components/admin/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Package, Clock, CheckCircle, XCircle, Eye, RefreshCw } from "lucide-react"

interface Order {
  id: string
  customerName: string
  customerPhone: string
  totalPrice: number
  status: "pending" | "confirmed" | "preparing" | "ready" | "delivered" | "cancelled"
  notes: string | null
  createdAt: string
  flowers: Array<{
    flowerId: string
    flowerName: string
    quantity: number
    unitPrice: number
  }>
  colors: Array<{
    colorId: string
    colorName: string
    hexCode: string
  }>
  complements: Array<{
    complementId: string
    complementName: string
    price: number
  }>
}

const statusConfig = {
  pending: { label: "Pendente", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  confirmed: { label: "Confirmado", color: "bg-blue-100 text-blue-800", icon: CheckCircle },
  preparing: { label: "Preparando", color: "bg-purple-100 text-purple-800", icon: Package },
  ready: { label: "Pronto", color: "bg-green-100 text-green-800", icon: CheckCircle },
  delivered: { label: "Entregue", color: "bg-gray-100 text-gray-800", icon: CheckCircle },
  cancelled: { label: "Cancelado", color: "bg-red-100 text-red-800", icon: XCircle },
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>("all")

  const fetchOrders = async () => {
    setIsLoading(true)
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

  useEffect(() => {
    fetchOrders()
  }, [])

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      })
      if (res.ok) {
        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId ? { ...order, status: newStatus as Order["status"] } : order
          )
        )
        if (selectedOrder?.id === orderId) {
          setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus as Order["status"] } : null))
        }
      }
    } catch (error) {
      console.error("Error updating order:", error)
    }
  }

  const filteredOrders =
    filterStatus === "all" ? orders : orders.filter((o) => o.status === filterStatus)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatPrice = (price: number) => {
    return `R$ ${price.toFixed(2).replace(".", ",")}`
  }

  const pendingCount = orders.filter((o) => o.status === "pending").length
  const preparingCount = orders.filter((o) => o.status === "preparing").length
  const todayCount = orders.filter((o) => {
    const orderDate = new Date(o.createdAt).toDateString()
    const today = new Date().toDateString()
    return orderDate === today
  }).length

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />

        <main className="flex-1 p-4 md:p-8 md:ml-64">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">Pedidos</h1>
                <p className="text-muted-foreground mt-1">Gerencie os pedidos recebidos</p>
              </div>
              <Button onClick={fetchOrders} variant="outline" className="gap-2 bg-transparent">
                <RefreshCw className="h-4 w-4" />
                Atualizar
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Clock className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
                      <p className="text-sm text-muted-foreground">Pendentes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Package className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{preparingCount}</p>
                      <p className="text-sm text-muted-foreground">Em preparo</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{todayCount}</p>
                      <p className="text-sm text-muted-foreground">Hoje</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-4 mb-6">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="confirmed">Confirmados</SelectItem>
                  <SelectItem value="preparing">Preparando</SelectItem>
                  <SelectItem value="ready">Prontos</SelectItem>
                  <SelectItem value="delivered">Entregues</SelectItem>
                  <SelectItem value="cancelled">Cancelados</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Orders Table */}
            <Card>
              <CardHeader>
                <CardTitle>Lista de Pedidos ({filteredOrders.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Carregando pedidos...</p>
                  </div>
                ) : filteredOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                    <p className="text-muted-foreground">Nenhum pedido encontrado</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Data</TableHead>
                          <TableHead>Cliente</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Acoes</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredOrders.map((order) => {
                          const StatusIcon = statusConfig[order.status].icon
                          return (
                            <TableRow key={order.id}>
                              <TableCell className="whitespace-nowrap">
                                {formatDate(order.createdAt)}
                              </TableCell>
                              <TableCell>
                                <div>
                                  <p className="font-medium">{order.customerName}</p>
                                  <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
                                </div>
                              </TableCell>
                              <TableCell className="font-medium">
                                {formatPrice(order.totalPrice)}
                              </TableCell>
                              <TableCell>
                                <Badge className={statusConfig[order.status].color}>
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {statusConfig[order.status].label}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedOrder(order)}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Select
                                    value={order.status}
                                    onValueChange={(value) => updateOrderStatus(order.id, value)}
                                  >
                                    <SelectTrigger className="w-32 h-8">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="pending">Pendente</SelectItem>
                                      <SelectItem value="confirmed">Confirmado</SelectItem>
                                      <SelectItem value="preparing">Preparando</SelectItem>
                                      <SelectItem value="ready">Pronto</SelectItem>
                                      <SelectItem value="delivered">Entregue</SelectItem>
                                      <SelectItem value="cancelled">Cancelado</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>

        {/* Order Details Dialog */}
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Detalhes do Pedido</DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Cliente</p>
                    <p className="font-medium">{selectedOrder.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Telefone</p>
                    <p className="font-medium">{selectedOrder.customerPhone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Data</p>
                    <p className="font-medium">{formatDate(selectedOrder.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge className={statusConfig[selectedOrder.status].color}>
                      {statusConfig[selectedOrder.status].label}
                    </Badge>
                  </div>
                </div>

                {selectedOrder.flowers.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Flores</p>
                    <div className="space-y-1">
                      {selectedOrder.flowers.map((f, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span>{f.quantity}x {f.flowerName}</span>
                          <span>{formatPrice(f.quantity * f.unitPrice)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedOrder.colors.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Cores</p>
                    <div className="flex gap-2">
                      {selectedOrder.colors.map((c, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: c.hexCode }}
                          />
                          <span className="text-sm">{c.colorName}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedOrder.complements.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Complementos</p>
                    <div className="space-y-1">
                      {selectedOrder.complements.map((cp, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span>{cp.complementName}</span>
                          <span>{formatPrice(cp.price)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedOrder.notes && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Observacoes</p>
                    <p className="text-sm bg-muted p-2 rounded">{selectedOrder.notes}</p>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total</span>
                    <span className="text-xl font-bold text-primary">
                      {formatPrice(selectedOrder.totalPrice)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  )
}
