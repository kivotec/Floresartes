import React from "react"
import type { Metadata, Viewport } from "next"
import { Cormorant_Garamond, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { StoreProvider } from "@/lib/store"
import "./globals.css"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Flor & Arte - Buquês Exclusivos",
  description:
    "Buquês de flores exclusivos feitos com carinho. Presenteie quem você ama com arranjos únicos e personalizados.",
  keywords: ["flores", "buquês", "presentes", "arranjos florais", "floricultura"],
    generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: "#7A2E3A",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${cormorant.variable} ${inter.variable} font-sans antialiased`}>
        <StoreProvider>{children}</StoreProvider>
        <Analytics />
      </body>
    </html>
  )
}
