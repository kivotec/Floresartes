"use client"

import { Truck, Heart, Leaf, Gift } from "lucide-react"

const benefits = [
  {
    icon: Leaf,
    title: "Flores Frescas",
    description: "Selecionamos apenas as flores mais frescas e bonitas para compor seus buquês.",
  },
  {
    icon: Heart,
    title: "Feito com Amor",
    description: "Cada arranjo é criado com dedicação e atenção aos mínimos detalhes.",
  },
  {
    icon: Gift,
    title: "Personalização",
    description: "Monte o buquê perfeito escolhendo flores, cores e complementos.",
  },
  {
    icon: Truck,
    title: "Entrega Cuidadosa",
    description: "Seus buquês chegam protegidos e com todo o cuidado que merecem.",
  },
]

export function BenefitsSection() {
  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-sm text-muted-foreground uppercase tracking-widest">
            Por que nos escolher
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 text-balance">
            Qualidade em Cada Pétala
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="text-center p-6 bg-card rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/50 text-primary mb-4">
                <benefit.icon className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">{benefit.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
