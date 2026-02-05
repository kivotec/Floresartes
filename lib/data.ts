import type {
  Bouquet,
  FlowerType,
  ColorOption,
  SizeOption,
  ComplementItem,
  SiteSettings,
} from "./types"

// ========== MOCK BOUQUETS ==========
export const initialBouquets: Bouquet[] = [
  {
    id: "1",
    name: "Encanto Rosa",
    description:
      "Um buquê deslumbrante com rosas cor-de-rosa de primeira qualidade, cuidadosamente arranjadas para transmitir amor e carinho. Perfeito para ocasiões especiais como aniversários, Dia das Mães ou simplesmente para demonstrar afeto. Cada rosa é selecionada à mão para garantir frescor e beleza duradoura.",
    shortDescription: "Rosas cor-de-rosa de primeira qualidade, perfeitas para demonstrar amor.",
    price: 149.9,
    images: [
      "https://images.unsplash.com/photo-1494972308805-463bc619d34e?w=800",
      "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=800",
    ],
    category: "Romântico",
    allowsCustomization: true,
    featured: true,
    active: true,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Jardim Tropical",
    description:
      "Uma explosão de cores vibrantes com flores tropicais exóticas. Este buquê traz a energia e a alegria dos trópicos para qualquer ambiente, com sua combinação única de orquídeas, helicônias e folhagens tropicais.",
    shortDescription: "Flores tropicais coloridas que trazem alegria e energia.",
    price: 189.9,
    images: [
      "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=800",
      "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800",
    ],
    category: "Tropical",
    allowsCustomization: true,
    featured: true,
    active: true,
    createdAt: "2024-01-20",
  },
  {
    id: "3",
    name: "Elegância Branca",
    description:
      "Pureza e sofisticação em um único buquê. Composto por lírios brancos, rosas brancas e gérberas, este arranjo transmite paz e elegância, sendo ideal para casamentos, batizados ou momentos de celebração.",
    shortDescription: "Lírios e rosas brancas que transmitem paz e elegância.",
    price: 219.9,
    images: [
      "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=800",
      "https://images.unsplash.com/photo-1522057306606-8d84dea71d49?w=800",
    ],
    category: "Clássico",
    allowsCustomization: true,
    featured: true,
    active: true,
    createdAt: "2024-02-01",
  },
  {
    id: "4",
    name: "Paixão Vermelha",
    description:
      "O clássico buquê de rosas vermelhas, símbolo universal do amor apaixonado. Cada rosa é escolhida no ponto perfeito de abertura para garantir máxima beleza e durabilidade.",
    shortDescription: "Rosas vermelhas clássicas, o símbolo do amor verdadeiro.",
    price: 169.9,
    images: [
      "https://images.unsplash.com/photo-1548198471-e5667a4a58a2?w=800",
      "https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=800",
    ],
    category: "Romântico",
    allowsCustomization: false,
    featured: false,
    active: true,
    createdAt: "2024-02-10",
  },
  {
    id: "5",
    name: "Campo de Girassóis",
    description:
      "Alegria em forma de flores! Este buquê de girassóis irradia energia positiva e felicidade. Perfeito para animar qualquer dia ou celebrar conquistas.",
    shortDescription: "Girassóis radiantes que trazem felicidade e energia.",
    price: 129.9,
    images: [
      "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=800",
      "https://images.unsplash.com/photo-1578923813614-76cf9a24f2ed?w=800",
    ],
    category: "Alegre",
    allowsCustomization: true,
    featured: false,
    active: true,
    createdAt: "2024-02-15",
  },
  {
    id: "6",
    name: "Mix Primavera",
    description:
      "Uma celebração da primavera com uma mistura encantadora de margaridas, crisântemos e astromélias em tons pastéis. Este buquê traz frescor e delicadeza para qualquer ocasião.",
    shortDescription: "Flores mistas em tons pastéis, perfeitas para qualquer ocasião.",
    price: 139.9,
    images: [
      "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=800",
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800",
    ],
    category: "Misto",
    allowsCustomization: true,
    featured: false,
    active: true,
    createdAt: "2024-02-20",
  },
]

// ========== CUSTOMIZATION OPTIONS ==========
export const initialFlowers: FlowerType[] = [
  { id: "f1", name: "Rosa", category: "flower", price: 12.9, active: true, order: 1 },
  { id: "f2", name: "Lírio", category: "flower", price: 15.9, active: true, order: 2 },
  { id: "f3", name: "Girassol", category: "flower", price: 9.9, active: true, order: 3 },
  { id: "f4", name: "Orquídea", category: "flower", price: 24.9, active: true, order: 4 },
  { id: "f5", name: "Tulipa", category: "flower", price: 18.9, active: true, order: 5 },
  { id: "f6", name: "Margarida", category: "flower", price: 6.9, active: true, order: 6 },
  { id: "f7", name: "Gérbera", category: "flower", price: 8.9, active: true, order: 7 },
  { id: "f8", name: "Crisântemo", category: "flower", price: 7.9, active: false, order: 8 },
]

export const initialColors: ColorOption[] = [
  { id: "c1", name: "Rosa", category: "color", hexCode: "#F4C2C2", price: 0, active: true, order: 1 },
  { id: "c2", name: "Vermelho", category: "color", hexCode: "#DC143C", price: 0, active: true, order: 2 },
  { id: "c3", name: "Branco", category: "color", hexCode: "#FFFFFF", price: 0, active: true, order: 3 },
  { id: "c4", name: "Amarelo", category: "color", hexCode: "#FFD700", price: 0, active: true, order: 4 },
  { id: "c5", name: "Laranja", category: "color", hexCode: "#FF8C00", price: 0, active: true, order: 5 },
  { id: "c6", name: "Lilás", category: "color", hexCode: "#C8A2C8", price: 5, active: true, order: 6 },
  { id: "c7", name: "Coral", category: "color", hexCode: "#FF7F50", price: 5, active: false, order: 7 },
]

export const initialSizes: SizeOption[] = [
  { id: "s1", name: "Pequeno", category: "size", price: 99.9, priceModifier: 0, active: true, order: 1 },
  { id: "s2", name: "Médio", category: "size", price: 149.9, priceModifier: 50, active: true, order: 2 },
  { id: "s3", name: "Grande", category: "size", price: 199.9, priceModifier: 100, active: true, order: 3 },
  { id: "s4", name: "Luxo", category: "size", price: 299.9, priceModifier: 200, active: true, order: 4 },
]

export const initialComplements: ComplementItem[] = [
  { id: "cp1", name: "Laço de Cetim", category: "complement", type: "ribbon", price: 8.9, active: true, order: 1 },
  { id: "cp2", name: "Laço de Organza", category: "complement", type: "ribbon", price: 12.9, active: true, order: 2 },
  { id: "cp3", name: "Papel Kraft", category: "complement", type: "wrapping", price: 5.9, active: true, order: 3 },
  { id: "cp4", name: "Celofane Transparente", category: "complement", type: "wrapping", price: 4.9, active: true, order: 4 },
  { id: "cp5", name: "Cartão Personalizado", category: "complement", type: "card", price: 9.9, active: true, order: 5 },
  { id: "cp6", name: "Cartão com Mensagem", category: "complement", type: "card", price: 6.9, active: true, order: 6 },
  { id: "cp7", name: "Chocolate Belga", category: "complement", type: "other", price: 29.9, active: true, order: 7 },
  { id: "cp8", name: "Urso de Pelúcia", category: "complement", type: "other", price: 39.9, active: false, order: 8 },
]

// ========== SITE SETTINGS ==========
export const initialSettings: SiteSettings = {
  whatsappNumber: "5511981713690",
  whatsappDefaultMessage: "Olá! Gostaria de fazer um pedido.",
  ctaMainText: "Monte seu Buquê",
  ctaSecondaryText: "Falar no WhatsApp",
  heroTitle: "Flores que Falam por Você",
  heroSubtitle:
    "Presenteie quem você ama com buquês exclusivos, feitos com carinho e flores frescas selecionadas especialmente para você.",
  siteName: "Flor & Arte",
}
