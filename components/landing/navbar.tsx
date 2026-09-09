"use client"

import Link from "next/link"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Zap } from "lucide-react"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full px-4 pt-3 pb-2 transition-all">
      <div className="container mx-auto max-w-6xl">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 rounded-2xl border border-border/50 bg-background/70 backdrop-blur-xl shadow-lg shadow-primary/5">
          {/* Official PagoPing Logo */}
          <Logo showBadge size="md" />

          {/* Navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="#como-funciona" className="hover:text-foreground transition-colors">
              Cómo Funciona
            </a>
            <a href="#simulador" className="hover:text-primary transition-colors flex items-center gap-1.5 font-semibold text-foreground">
              <Zap className="h-3.5 w-3.5 text-primary fill-primary/20" />
              Simulador
            </a>
            <a href="#caracteristicas" className="hover:text-foreground transition-colors">
              Beneficios
            </a>
            <a href="#planes" className="hover:text-foreground transition-colors">
              Planes
            </a>
            <a href="#faq" className="hover:text-foreground transition-colors">
              FAQ
            </a>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex text-sm font-medium">
              <Link href="/auth/login">Iniciar Sesión</Link>
            </Button>
            <Button
              size="sm"
              asChild
              className="bg-gradient-to-r from-primary via-purple-600 to-indigo-600 hover:from-primary/90 hover:to-indigo-500 text-white shadow-md shadow-primary/20 border-0 font-medium transition-all duration-300 hover:shadow-primary/30 hover:scale-[1.02]"
            >
              <Link href="/auth/sign-up">Comenzar Gratis</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
