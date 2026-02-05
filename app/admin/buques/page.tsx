"use client"

import React from "react"

import { useState } from "react"
import { Plus, Pencil, Trash2, Eye, EyeOff, Star, StarOff } from "lucide-react"
import { ProtectedRoute } from "@/components/admin/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { useStore } from "@/lib/store"
import type { Bouquet } from "@/lib/types"

const emptyBouquet = {
  name: "",
  description: "",
  shortDescription: "",
  price: 0,
  images: [""],
  category: "",
  allowsCustomization: true,
  featured: false,
  active: true,
}

export default function AdminBouquetsPage() {
  const { bouquets, addBouquet, updateBouquet, deleteBouquet } = useStore()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingBouquet, setEditingBouquet] = useState<Bouquet | null>(null)
  const [formData, setFormData] = useState(emptyBouquet)

  const handleOpenCreate = () => {
    setEditingBouquet(null)
    setFormData(emptyBouquet)
    setIsDialogOpen(true)
  }

  const handleOpenEdit = (bouquet: Bouquet) => {
    setEditingBouquet(bouquet)
    setFormData({
      name: bouquet.name,
      description: bouquet.description,
      shortDescription: bouquet.shortDescription,
      price: bouquet.price,
      images: bouquet.images,
      category: bouquet.category,
      allowsCustomization: bouquet.allowsCustomization,
      featured: bouquet.featured,
      active: bouquet.active,
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingBouquet) {
      updateBouquet(editingBouquet.id, formData)
    } else {
      addBouquet(formData)
    }
    setIsDialogOpen(false)
    setFormData(emptyBouquet)
  }

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images]
    newImages[index] = value
    setFormData({ ...formData, images: newImages })
  }

  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ""] })
  }

  const removeImageField = (index: number) => {
    if (formData.images.length > 1) {
      const newImages = formData.images.filter((_, i) => i !== index)
      setFormData({ ...formData, images: newImages })
    }
  }

  return (
    <ProtectedRoute>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Buquês</h1>
            <p className="text-muted-foreground mt-1">Gerencie seu catálogo de buquês</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleOpenCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Buquê
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingBouquet ? "Editar Buquê" : "Criar Novo Buquê"}
                </DialogTitle>
                <DialogDescription>
                  {editingBouquet
                    ? "Atualize as informações do buquê"
                    : "Preencha as informações do novo buquê"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="Ex: Romântico, Tropical, Clássico"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shortDescription">Descrição Curta</Label>
                  <Input
                    id="shortDescription"
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    placeholder="Uma breve descrição para o card"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição Completa</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Preço (R$)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: Number.parseFloat(e.target.value) || 0 })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Imagens (URLs)</Label>
                  {formData.images.map((image, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={image}
                        onChange={(e) => handleImageChange(index, e.target.value)}
                        placeholder="https://..."
                        required
                      />
                      {formData.images.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeImageField(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={addImageField}>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Imagem
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="active">Ativo</Label>
                    <Switch
                      id="active"
                      checked={formData.active}
                      onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="featured">Destaque</Label>
                    <Switch
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="allowsCustomization">Personalizável</Label>
                    <Switch
                      id="allowsCustomization"
                      checked={formData.allowsCustomization}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, allowsCustomization: checked })
                      }
                    />
                  </div>
                </div>

                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      Cancelar
                    </Button>
                  </DialogClose>
                  <Button type="submit">{editingBouquet ? "Salvar" : "Criar"}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Bouquets List */}
        <Card>
          <CardHeader>
            <CardTitle>Catálogo ({bouquets.length} buquês)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bouquets.map((bouquet) => (
                <div
                  key={bouquet.id}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-lg bg-muted"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg bg-secondary overflow-hidden flex-shrink-0">
                      <img
                        src={bouquet.images[0] || "/placeholder.svg"}
                        alt={bouquet.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-foreground">{bouquet.name}</p>
                        {bouquet.featured && <Star className="h-4 w-4 text-primary fill-primary" />}
                        {!bouquet.active && (
                          <span className="text-xs bg-muted-foreground/20 text-muted-foreground px-2 py-0.5 rounded">
                            Inativo
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{bouquet.category}</p>
                      <p className="text-sm font-semibold text-primary">
                        R$ {bouquet.price.toFixed(2).replace(".", ",")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateBouquet(bouquet.id, { active: !bouquet.active })}
                      title={bouquet.active ? "Desativar" : "Ativar"}
                    >
                      {bouquet.active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        updateBouquet(bouquet.id, { featured: !bouquet.featured })
                      }
                      title={bouquet.featured ? "Remover destaque" : "Destacar"}
                    >
                      {bouquet.featured ? (
                        <StarOff className="h-4 w-4" />
                      ) : (
                        <Star className="h-4 w-4" />
                      )}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleOpenEdit(bouquet)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-destructive bg-transparent">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir buquê?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação não pode ser desfeita. O buquê "{bouquet.name}" será
                            permanentemente removido.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteBouquet(bouquet.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
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
      </div>
    </ProtectedRoute>
  )
}
