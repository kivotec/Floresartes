"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Flower,
  Palette,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ShoppingBag,
  BarChart3,
} from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/lib/auth"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Pedidos", href: "/admin/pedidos", icon: ShoppingBag },
  { name: "Buques", href: "/admin/buques", icon: Flower },
  { name: "Personalizacao", href: "/admin/personalizacao", icon: Palette },
  { name: "Relatorios", href: "/admin/relatorios", icon: BarChart3 },
  { name: "Configuracoes", href: "/admin/configuracoes", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useAuth()
  const { settings } = useStore()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/admin")
  }

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-sidebar border-b border-sidebar-border h-16 flex items-center justify-between px-4">
        <span className="font-semibold text-sidebar-foreground">{settings.siteName} Admin</span>
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-sidebar-foreground"
          aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-foreground/50"
          onClick={() => setIsMobileMenuOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setIsMobileMenuOpen(false)}
          role="button"
          tabIndex={0}
          aria-label="Fechar menu"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-300",
          "lg:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-sidebar-border">
          <span className="text-xl font-semibold text-sidebar-foreground">{settings.siteName}</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border space-y-2">
          <Button asChild variant="outline" className="w-full justify-start bg-transparent" size="sm">
            <Link href="/" target="_blank">
              <ExternalLink className="h-4 w-4 mr-2" />
              Ver Site
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            size="sm"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </aside>
    </>
  )
}
