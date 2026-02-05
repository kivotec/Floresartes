// ========== BOUQUET TYPES ==========
export interface Bouquet {
  id: string
  name: string
  description: string
  shortDescription: string
  price: number
  images: string[]
  category: string
  allowsCustomization: boolean
  featured: boolean
  active: boolean
  createdAt: string
}

// ========== CUSTOMIZATION TYPES ==========
export interface CustomizationItem {
  id: string
  name: string
  image?: string
  active: boolean
  order: number
}

export interface FlowerType extends CustomizationItem {
  category: 'flower'
  price: number
}

export interface ColorOption extends CustomizationItem {
  category: 'color'
  hexCode: string
  price: number
}

export interface SizeOption extends CustomizationItem {
  category: 'size'
  price: number
  priceModifier: number
}

export interface ComplementItem extends CustomizationItem {
  category: 'complement'
  type: 'ribbon' | 'wrapping' | 'card' | 'other'
  price: number
}

export type CustomizationCategory = FlowerType | ColorOption | SizeOption | ComplementItem

// ========== SETTINGS TYPES ==========
export interface SiteSettings {
  whatsappNumber: string
  whatsappDefaultMessage: string
  ctaMainText: string
  ctaSecondaryText: string
  heroTitle: string
  heroSubtitle: string
  siteName: string
}

// ========== CUSTOMIZATION SELECTION ==========
export interface CustomizationSelection {
  flowers: string[]
  size: string
  complements: string[]
}
