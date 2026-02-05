'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type {
  Bouquet,
  FlowerType,
  ColorOption,
  SizeOption,
  ComplementItem,
  SiteSettings,
} from './types'
import {
  initialBouquets,
  initialFlowers,
  initialColors,
  initialSizes,
  initialComplements,
  initialSettings,
} from './data'

interface StoreContextType {
  // Data loading
  isLoading: boolean

  // Bouquets
  bouquets: Bouquet[]
  addBouquet: (bouquet: Omit<Bouquet, 'id' | 'createdAt'>) => void
  updateBouquet: (id: string, bouquet: Partial<Bouquet>) => void
  deleteBouquet: (id: string) => void

  // Flowers
  flowers: FlowerType[]
  addFlower: (flower: Omit<FlowerType, 'id'>) => void
  updateFlower: (id: string, flower: Partial<FlowerType>) => void
  deleteFlower: (id: string) => void

  // Colors
  colors: ColorOption[]
  addColor: (color: Omit<ColorOption, 'id'>) => void
  updateColor: (id: string, color: Partial<ColorOption>) => void
  deleteColor: (id: string) => void

  // Sizes
  sizes: SizeOption[]
  addSize: (size: Omit<SizeOption, 'id'>) => void
  updateSize: (id: string, size: Partial<SizeOption>) => void
  deleteSize: (id: string) => void

  // Complements
  complements: ComplementItem[]
  addComplement: (complement: Omit<ComplementItem, 'id'>) => void
  updateComplement: (id: string, complement: Partial<ComplementItem>) => void
  deleteComplement: (id: string) => void

  // Settings
  settings: SiteSettings
  updateSettings: (settings: Partial<SiteSettings>) => void
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [bouquets, setBouquets] = useState<Bouquet[]>(initialBouquets)
  const [flowers, setFlowers] = useState<FlowerType[]>(initialFlowers)
  const [colors, setColors] = useState<ColorOption[]>(initialColors)
  const [sizes, setSizes] = useState<SizeOption[]>(initialSizes)
  const [complements, setComplements] = useState<ComplementItem[]>(initialComplements)
  const [settings, setSettings] = useState<SiteSettings>(initialSettings)

  // Fetch data from API on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bouquetsRes, customizationsRes, settingsRes] = await Promise.all([
          fetch('/api/bouquets'),
          fetch('/api/customizations'),
          fetch('/api/settings'),
        ])

        if (bouquetsRes.ok) {
          const bouquetsData = await bouquetsRes.json()
          setBouquets(bouquetsData)
          console.log('[v0] Loaded bouquets from API:', bouquetsData.length)
        }

        if (customizationsRes.ok) {
          const customizationsData = await customizationsRes.json()
          setFlowers(customizationsData.flowers)
          setColors(customizationsData.colors)
          setSizes(customizationsData.sizes)
          setComplements(customizationsData.complements)
          console.log('[v0] Loaded customizations from API')
        }

        if (settingsRes.ok) {
          const settingsData = await settingsRes.json()
          // Map API response (snake_case) to SiteSettings (camelCase)
          const mappedSettings: SiteSettings = {
            whatsappNumber: settingsData.whatsapp_number || initialSettings.whatsappNumber,
            whatsappDefaultMessage:
              settingsData.whatsapp_message_template || initialSettings.whatsappDefaultMessage,
            siteName: settingsData.site_title || initialSettings.siteName,
            heroTitle: initialSettings.heroTitle,
            heroSubtitle: initialSettings.heroSubtitle,
            ctaMainText: initialSettings.ctaMainText,
            ctaSecondaryText: initialSettings.ctaSecondaryText,
          }
          setSettings(mappedSettings)
          console.log('[v0] Loaded settings from API:', mappedSettings)
        }
      } catch (error) {
        console.error('[v0] Failed to fetch data from API:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Bouquet operations
  const addBouquet = (bouquet: Omit<Bouquet, 'id' | 'createdAt'>) => {
    const newBouquet: Bouquet = {
      ...bouquet,
      id: generateId(),
      createdAt: new Date().toISOString().split('T')[0],
    }
    setBouquets((prev) => [...prev, newBouquet])
  }

  const updateBouquet = (id: string, bouquet: Partial<Bouquet>) => {
    setBouquets((prev) => prev.map((b) => (b.id === id ? { ...b, ...bouquet } : b)))
  }

  const deleteBouquet = (id: string) => {
    setBouquets((prev) => prev.filter((b) => b.id !== id))
  }

  // Flower operations
  const addFlower = (flower: Omit<FlowerType, 'id'>) => {
    const newFlower: FlowerType = { ...flower, id: generateId() }
    setFlowers((prev) => [...prev, newFlower])
  }

  const updateFlower = (id: string, flower: Partial<FlowerType>) => {
    setFlowers((prev) => prev.map((f) => (f.id === id ? { ...f, ...flower } : f)))
  }

  const deleteFlower = (id: string) => {
    setFlowers((prev) => prev.filter((f) => f.id !== id))
  }

  // Color operations
  const addColor = (color: Omit<ColorOption, 'id'>) => {
    const newColor: ColorOption = { ...color, id: generateId() }
    setColors((prev) => [...prev, newColor])
  }

  const updateColor = (id: string, color: Partial<ColorOption>) => {
    setColors((prev) => prev.map((c) => (c.id === id ? { ...c, ...color } : c)))
  }

  const deleteColor = (id: string) => {
    setColors((prev) => prev.filter((c) => c.id !== id))
  }

  // Size operations
  const addSize = (size: Omit<SizeOption, 'id'>) => {
    const newSize: SizeOption = { ...size, id: generateId() }
    setSizes((prev) => [...prev, newSize])
  }

  const updateSize = (id: string, size: Partial<SizeOption>) => {
    setSizes((prev) => prev.map((s) => (s.id === id ? { ...s, ...size } : s)))
  }

  const deleteSize = (id: string) => {
    setSizes((prev) => prev.filter((s) => s.id !== id))
  }

  // Complement operations
  const addComplement = (complement: Omit<ComplementItem, 'id'>) => {
    const newComplement: ComplementItem = { ...complement, id: generateId() }
    setComplements((prev) => [...prev, newComplement])
  }

  const updateComplement = (id: string, complement: Partial<ComplementItem>) => {
    setComplements((prev) => prev.map((c) => (c.id === id ? { ...c, ...complement } : c)))
  }

  const deleteComplement = (id: string) => {
    setComplements((prev) => prev.filter((c) => c.id !== id))
  }

  // Settings operations
  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
  }

  return (
    <StoreContext.Provider
      value={{
        isLoading,
        bouquets,
        addBouquet,
        updateBouquet,
        deleteBouquet,
        flowers,
        addFlower,
        updateFlower,
        deleteFlower,
        colors,
        addColor,
        updateColor,
        deleteColor,
        sizes,
        addSize,
        updateSize,
        deleteSize,
        complements,
        addComplement,
        updateComplement,
        deleteComplement,
        settings,
        updateSettings,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider')
  }
  return context
}
