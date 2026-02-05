"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Save, RotateCcw, MessageCircle, Type, Globe } from "lucide-react"
import { ProtectedRoute } from "@/components/admin/protected-route"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useStore } from "@/lib/store"
import { initialSettings } from "@/lib/data"

export default function AdminSettingsPage() {
  const { settings, updateSettings } = useStore()
  const [formData, setFormData] = useState(settings)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setFormData(settings)
  }, [settings])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateSettings(formData)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleReset = () => {
    setFormData(initialSettings)
    updateSettings(initialSettings)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const whatsappPreviewLink = `https://wa.me/${formData.whatsappNumber}?text=${encodeURIComponent(formData.whatsappDefaultMessage)}`

  return (
    <ProtectedRoute>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground mt-1">
            Configure as informações gerais do site
          </p>
        </div>

        {saved && (
          <Alert className="mb-6 bg-accent/30 border-accent">
            <AlertDescription className="text-accent-foreground">
              Configurações salvas com sucesso!
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Site Info */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                <CardTitle>Informações do Site</CardTitle>
              </div>
              <CardDescription>
                Configure o nome e textos principais do site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Nome do Site</Label>
                <Input
                  id="siteName"
                  value={formData.siteName}
                  onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                  placeholder="Flor & Arte"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="heroTitle">Título do Hero (Página Inicial)</Label>
                <Input
                  id="heroTitle"
                  value={formData.heroTitle}
                  onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                  placeholder="Flores que Falam por Você"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="heroSubtitle">Subtítulo do Hero</Label>
                <Textarea
                  id="heroSubtitle"
                  value={formData.heroSubtitle}
                  onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                  rows={3}
                  placeholder="Presenteie quem você ama..."
                />
              </div>
            </CardContent>
          </Card>

          {/* CTA Texts */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Type className="h-5 w-5 text-primary" />
                <CardTitle>Textos de Chamada para Ação (CTA)</CardTitle>
              </div>
              <CardDescription>
                Configure os textos dos botões de ação
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ctaMainText">CTA Principal</Label>
                <Input
                  id="ctaMainText"
                  value={formData.ctaMainText}
                  onChange={(e) => setFormData({ ...formData, ctaMainText: e.target.value })}
                  placeholder="Monte seu Buquê"
                />
                <p className="text-xs text-muted-foreground">
                  Botão para personalização de buquês
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ctaSecondaryText">CTA Secundário</Label>
                <Input
                  id="ctaSecondaryText"
                  value={formData.ctaSecondaryText}
                  onChange={(e) => setFormData({ ...formData, ctaSecondaryText: e.target.value })}
                  placeholder="Falar no WhatsApp"
                />
                <p className="text-xs text-muted-foreground">
                  Botão de contato via WhatsApp
                </p>
              </div>
            </CardContent>
          </Card>

          {/* WhatsApp Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                <CardTitle>Configurações do WhatsApp</CardTitle>
              </div>
              <CardDescription>
                Configure o número e mensagem padrão do WhatsApp
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="whatsappNumber">Número do WhatsApp</Label>
                <Input
                  id="whatsappNumber"
                  value={formData.whatsappNumber}
                  onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                  placeholder="5511999999999"
                />
                <p className="text-xs text-muted-foreground">
                  Formato: código do país + DDD + número (sem espaços ou caracteres especiais)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsappDefaultMessage">Mensagem Padrão</Label>
                <Textarea
                  id="whatsappDefaultMessage"
                  value={formData.whatsappDefaultMessage}
                  onChange={(e) => setFormData({ ...formData, whatsappDefaultMessage: e.target.value })}
                  rows={3}
                  placeholder="Olá! Gostaria de fazer um pedido."
                />
                <p className="text-xs text-muted-foreground">
                  Mensagem pré-preenchida ao clicar no botão de WhatsApp
                </p>
              </div>

              {/* WhatsApp Preview */}
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium text-foreground mb-2">Pré-visualização do Link:</p>
                <a
                  href={whatsappPreviewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline break-all"
                >
                  {whatsappPreviewLink}
                </a>
                <div className="mt-3">
                  <Button asChild variant="outline" size="sm">
                    <a href={whatsappPreviewLink} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Testar Link
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="w-full sm:w-auto bg-transparent"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Restaurar Padrões
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              <Save className="h-4 w-4 mr-2" />
              Salvar Configurações
            </Button>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  )
}
