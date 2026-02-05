"use client"

import React from "react"
import { useState } from "react"
import { Plus, Pencil, Trash2, Eye, EyeOff, Flower, Palette, Gift } from "lucide-react"
import { ProtectedRoute } from "@/components/admin/protected-route"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useStore } from "@/lib/store"
import type { FlowerType, ColorOption, ComplementItem } from "@/lib/types"

export default function AdminCustomizationPage() {
  const {
    flowers,
    addFlower,
    updateFlower,
    deleteFlower,
    colors,
    addColor,
    updateColor,
    deleteColor,
    complements,
    addComplement,
    updateComplement,
    deleteComplement,
  } = useStore()

  // Dialog state
  const [isFlowerDialogOpen, setIsFlowerDialogOpen] = useState(false)
  const [isColorDialogOpen, setIsColorDialogOpen] = useState(false)
  const [isComplementDialogOpen, setIsComplementDialogOpen] = useState(false)

  // Edit state
  const [editingFlower, setEditingFlower] = useState<FlowerType | null>(null)
  const [editingColor, setEditingColor] = useState<ColorOption | null>(null)
  const [editingComplement, setEditingComplement] = useState<ComplementItem | null>(null)

  // Form state
  const [flowerForm, setFlowerForm] = useState({ name: "", price: 10, active: true, order: 1 })
  const [colorForm, setColorForm] = useState({ name: "", hexCode: "#F4C2C2", price: 0, active: true, order: 1 })
  const [complementForm, setComplementForm] = useState({
    name: "",
    type: "ribbon" as "ribbon" | "wrapping" | "card" | "other",
    price: 10,
    active: true,
    order: 1,
  })

  // Flower handlers
  const handleOpenFlowerCreate = () => {
    setEditingFlower(null)
    setFlowerForm({ name: "", price: 10, active: true, order: flowers.length + 1 })
    setIsFlowerDialogOpen(true)
  }

  const handleOpenFlowerEdit = (flower: FlowerType) => {
    setEditingFlower(flower)
    setFlowerForm({ name: flower.name, price: flower.price, active: flower.active, order: flower.order })
    setIsFlowerDialogOpen(true)
  }

  const handleFlowerSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingFlower) {
      updateFlower(editingFlower.id, { ...flowerForm, category: "flower" })
    } else {
      addFlower({ ...flowerForm, category: "flower" })
    }
    setIsFlowerDialogOpen(false)
  }

  // Color handlers
  const handleOpenColorCreate = () => {
    setEditingColor(null)
    setColorForm({ name: "", hexCode: "#F4C2C2", price: 0, active: true, order: colors.length + 1 })
    setIsColorDialogOpen(true)
  }

  const handleOpenColorEdit = (color: ColorOption) => {
    setEditingColor(color)
    setColorForm({ name: color.name, hexCode: color.hexCode, price: color.price, active: color.active, order: color.order })
    setIsColorDialogOpen(true)
  }

  const handleColorSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingColor) {
      updateColor(editingColor.id, { ...colorForm, category: "color" })
    } else {
      addColor({ ...colorForm, category: "color" })
    }
    setIsColorDialogOpen(false)
  }

  // Complement handlers
  const handleOpenComplementCreate = () => {
    setEditingComplement(null)
    setComplementForm({ name: "", type: "ribbon", price: 10, active: true, order: complements.length + 1 })
    setIsComplementDialogOpen(true)
  }

  const handleOpenComplementEdit = (complement: ComplementItem) => {
    setEditingComplement(complement)
    setComplementForm({ name: complement.name, type: complement.type, price: complement.price, active: complement.active, order: complement.order })
    setIsComplementDialogOpen(true)
  }

  const handleComplementSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingComplement) {
      updateComplement(editingComplement.id, { ...complementForm, category: "complement" })
    } else {
      addComplement({ ...complementForm, category: "complement" })
    }
    setIsComplementDialogOpen(false)
  }

  const getComplementTypeLabel = (type: string) => {
    switch (type) {
      case "ribbon": return "Laco"
      case "wrapping": return "Embalagem"
      case "card": return "Cartao"
      case "other": return "Outro"
      default: return type
    }
  }

  return (
    <ProtectedRoute>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Personalizacao</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie os itens disponiveis para personalizacao de buques
          </p>
        </div>

        <Tabs defaultValue="flowers" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 h-auto gap-2">
            <TabsTrigger value="flowers" className="gap-2">
              <Flower className="h-4 w-4" />
              Flores
            </TabsTrigger>
            <TabsTrigger value="colors" className="gap-2">
              <Palette className="h-4 w-4" />
              Cores
            </TabsTrigger>
            <TabsTrigger value="complements" className="gap-2">
              <Gift className="h-4 w-4" />
              Complementos
            </TabsTrigger>
          </TabsList>

          {/* Flowers Tab */}
          <TabsContent value="flowers">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Tipos de Flores</CardTitle>
                  <CardDescription>Flores disponiveis para selecao com preco unitario</CardDescription>
                </div>
                <Button onClick={handleOpenFlowerCreate}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Flor
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {flowers.sort((a, b) => a.order - b.order).map((flower) => (
                    <div
                      key={flower.id}
                      className={`flex items-center justify-between p-4 rounded-lg border ${
                        flower.active ? "bg-card" : "bg-muted opacity-60"
                      }`}
                    >
                      <div>
                        <p className="font-medium text-foreground">{flower.name}</p>
                        <p className="text-sm text-primary font-semibold">
                          R$ {flower.price.toFixed(2).replace(".", ",")} /un.
                        </p>
                        <p className="text-xs text-muted-foreground">Ordem: {flower.order}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => updateFlower(flower.id, { active: !flower.active })}
                        >
                          {flower.active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleOpenFlowerEdit(flower)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir flor?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acao nao pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteFlower(flower.id)} className="bg-destructive text-destructive-foreground">
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Flower Dialog */}
            <Dialog open={isFlowerDialogOpen} onOpenChange={setIsFlowerDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingFlower ? "Editar Flor" : "Nova Flor"}</DialogTitle>
                  <DialogDescription>
                    {editingFlower ? "Atualize as informacoes da flor" : "Adicione um novo tipo de flor"}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleFlowerSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="flower-name">Nome</Label>
                    <Input
                      id="flower-name"
                      value={flowerForm.name}
                      onChange={(e) => setFlowerForm({ ...flowerForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="flower-price">Preco Unitario (R$)</Label>
                    <Input
                      id="flower-price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={flowerForm.price}
                      onChange={(e) => setFlowerForm({ ...flowerForm, price: Number.parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="flower-order">Ordem de exibicao</Label>
                    <Input
                      id="flower-order"
                      type="number"
                      min="1"
                      value={flowerForm.order}
                      onChange={(e) => setFlowerForm({ ...flowerForm, order: Number.parseInt(e.target.value) || 1 })}
                      required
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="flower-active">Ativo</Label>
                    <Switch
                      id="flower-active"
                      checked={flowerForm.active}
                      onCheckedChange={(checked) => setFlowerForm({ ...flowerForm, active: checked })}
                    />
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="outline">Cancelar</Button>
                    </DialogClose>
                    <Button type="submit">{editingFlower ? "Salvar" : "Criar"}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Colors Tab */}
          <TabsContent value="colors">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Opcoes de Cores</CardTitle>
                  <CardDescription>Cores disponiveis para selecao com preco adicional opcional</CardDescription>
                </div>
                <Button onClick={handleOpenColorCreate}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Cor
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {colors.sort((a, b) => a.order - b.order).map((color) => (
                    <div
                      key={color.id}
                      className={`flex items-center justify-between p-4 rounded-lg border ${
                        color.active ? "bg-card" : "bg-muted opacity-60"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full border-2 border-border"
                          style={{ backgroundColor: color.hexCode }}
                        />
                        <div>
                          <p className="font-medium text-foreground">{color.name}</p>
                          {color.price > 0 ? (
                            <p className="text-sm text-primary font-semibold">
                              +R$ {color.price.toFixed(2).replace(".", ",")}
                            </p>
                          ) : (
                            <p className="text-sm text-muted-foreground">Sem adicional</p>
                          )}
                          <p className="text-xs text-muted-foreground">Ordem: {color.order}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => updateColor(color.id, { active: !color.active })}
                        >
                          {color.active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleOpenColorEdit(color)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir cor?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acao nao pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteColor(color.id)} className="bg-destructive text-destructive-foreground">
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Color Dialog */}
            <Dialog open={isColorDialogOpen} onOpenChange={setIsColorDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingColor ? "Editar Cor" : "Nova Cor"}</DialogTitle>
                  <DialogDescription>
                    {editingColor ? "Atualize as informacoes da cor" : "Adicione uma nova opcao de cor"}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleColorSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="color-name">Nome</Label>
                    <Input
                      id="color-name"
                      value={colorForm.name}
                      onChange={(e) => setColorForm({ ...colorForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="color-hex">Cor (Hex)</Label>
                    <div className="flex gap-2">
                      <Input
                        id="color-hex"
                        type="color"
                        value={colorForm.hexCode}
                        onChange={(e) => setColorForm({ ...colorForm, hexCode: e.target.value })}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={colorForm.hexCode}
                        onChange={(e) => setColorForm({ ...colorForm, hexCode: e.target.value })}
                        placeholder="#F4C2C2"
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="color-price">Preco Adicional (R$)</Label>
                    <Input
                      id="color-price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={colorForm.price}
                      onChange={(e) => setColorForm({ ...colorForm, price: Number.parseFloat(e.target.value) || 0 })}
                    />
                    <p className="text-xs text-muted-foreground">Deixe 0 para cores sem adicional</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="color-order">Ordem de exibicao</Label>
                    <Input
                      id="color-order"
                      type="number"
                      min="1"
                      value={colorForm.order}
                      onChange={(e) => setColorForm({ ...colorForm, order: Number.parseInt(e.target.value) || 1 })}
                      required
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="color-active">Ativo</Label>
                    <Switch
                      id="color-active"
                      checked={colorForm.active}
                      onCheckedChange={(checked) => setColorForm({ ...colorForm, active: checked })}
                    />
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="outline">Cancelar</Button>
                    </DialogClose>
                    <Button type="submit">{editingColor ? "Salvar" : "Criar"}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Complements Tab */}
          <TabsContent value="complements">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Complementos</CardTitle>
                  <CardDescription>Itens adicionais para os buques</CardDescription>
                </div>
                <Button onClick={handleOpenComplementCreate}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Complemento
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {complements.sort((a, b) => a.order - b.order).map((complement) => (
                    <div
                      key={complement.id}
                      className={`flex items-center justify-between p-4 rounded-lg border ${
                        complement.active ? "bg-card" : "bg-muted opacity-60"
                      }`}
                    >
                      <div>
                        <p className="font-medium text-foreground">{complement.name}</p>
                        <p className="text-sm text-primary font-semibold">
                          R$ {complement.price.toFixed(2).replace(".", ",")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {getComplementTypeLabel(complement.type)} - Ordem: {complement.order}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => updateComplement(complement.id, { active: !complement.active })}
                        >
                          {complement.active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleOpenComplementEdit(complement)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir complemento?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acao nao pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteComplement(complement.id)} className="bg-destructive text-destructive-foreground">
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Complement Dialog */}
            <Dialog open={isComplementDialogOpen} onOpenChange={setIsComplementDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingComplement ? "Editar Complemento" : "Novo Complemento"}</DialogTitle>
                  <DialogDescription>
                    {editingComplement ? "Atualize as informacoes do complemento" : "Adicione um novo complemento"}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleComplementSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="complement-name">Nome</Label>
                    <Input
                      id="complement-name"
                      value={complementForm.name}
                      onChange={(e) => setComplementForm({ ...complementForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="complement-type">Tipo</Label>
                    <Select
                      value={complementForm.type}
                      onValueChange={(value: "ribbon" | "wrapping" | "card" | "other") =>
                        setComplementForm({ ...complementForm, type: value })
                      }
                    >
                      <SelectTrigger id="complement-type">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ribbon">Laco</SelectItem>
                        <SelectItem value="wrapping">Embalagem</SelectItem>
                        <SelectItem value="card">Cartao</SelectItem>
                        <SelectItem value="other">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="complement-price">Preco (R$)</Label>
                    <Input
                      id="complement-price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={complementForm.price}
                      onChange={(e) => setComplementForm({ ...complementForm, price: Number.parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="complement-order">Ordem de exibicao</Label>
                    <Input
                      id="complement-order"
                      type="number"
                      min="1"
                      value={complementForm.order}
                      onChange={(e) => setComplementForm({ ...complementForm, order: Number.parseInt(e.target.value) || 1 })}
                      required
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="complement-active">Ativo</Label>
                    <Switch
                      id="complement-active"
                      checked={complementForm.active}
                      onCheckedChange={(checked) => setComplementForm({ ...complementForm, active: checked })}
                    />
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="outline">Cancelar</Button>
                    </DialogClose>
                    <Button type="submit">{editingComplement ? "Salvar" : "Criar"}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  )
}
