"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Zap,
  Menu,
  X,
  Sparkles,
  Smartphone,
  ShieldCheck,
  HelpCircle,
  Download,
  LogIn,
  ArrowRight,
} from "lucide-react"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  // Cerrar menú con la tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false)
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full px-2.5 sm:px-4 pt-2.5 sm:pt-3 pb-2 transition-all">
      <div className="container mx-auto max-w-6xl relative">
        <div className="flex h-14 sm:h-16 items-center justify-between px-3 sm:px-6 rounded-2xl border border-border/50 bg-background/80 backdrop-blur-xl shadow-lg shadow-primary/5">
          {/* Official PagoPing Logo */}
          <div className="shrink-0 scale-90 sm:scale-100 origin-left">
            <Logo showBadge size="md" />
          </div>

          {/* Desktop Navigation links */}
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
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <ThemeToggle />
            <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex text-sm font-medium">
              <Link href="/auth/login">Iniciar Sesión</Link>
            </Button>
            <Button
              size="sm"
              asChild
              className="h-8 sm:h-9 px-3 sm:px-4 text-xs sm:text-sm bg-gradient-to-r from-primary via-purple-600 to-indigo-600 hover:from-primary/90 hover:to-indigo-500 text-white shadow-md shadow-primary/20 border-0 font-semibold transition-all duration-300 hover:shadow-primary/30 hover:scale-[1.02]"
            >
              <Link href="/auth/sign-up">
                <span className="sm:hidden">Comenzar</span>
                <span className="hidden sm:inline">Comenzar Gratis</span>
              </Link>
            </Button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden h-8 w-8 rounded-xl border border-border/70 bg-card/60 backdrop-blur-md flex items-center justify-center text-foreground hover:bg-muted hover:border-primary/40 active:scale-90 transition-all duration-200"
              aria-label={isOpen ? "Cerrar menú" : "Abrir menú de opciones"}
              aria-expanded={isOpen}
            >
              {isOpen ? (
                <X className="h-4 w-4 text-foreground transition-transform duration-200 rotate-90" />
              ) : (
                <Menu className="h-4 w-4 text-foreground transition-transform duration-200" />
              )}
            </button>
          </div>
        </div>

        {/* Backdrop for click outside */}
        {isOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* Mobile Dropdown Navigation Menu */}
        {isOpen && (
          <div className="relative z-50 md:hidden mt-2 p-3.5 rounded-2xl border border-border/80 bg-background/95 backdrop-blur-2xl shadow-2xl shadow-primary/10 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="space-y-1">
              <a
                href="#simulador"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary font-semibold text-xs sm:text-sm hover:bg-primary/15 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Zap className="h-3.5 w-3.5 fill-primary/30 text-primary" />
                  </div>
                  <span>Simulador Interactivo</span>
                </div>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-primary text-white">
                  En vivo
                </span>
              </a>

              <a
                href="#como-funciona"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 p-2.5 rounded-xl text-xs sm:text-sm font-medium text-foreground hover:bg-muted/80 transition-colors"
              >
                <div className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                  <Smartphone className="h-3.5 w-3.5" />
                </div>
                <span>Cómo Funciona</span>
              </a>

              <a
                href="#caracteristicas"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 p-2.5 rounded-xl text-xs sm:text-sm font-medium text-foreground hover:bg-muted/80 transition-colors"
              >
                <div className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <span>Beneficios y Anti-Fraude</span>
              </a>

              <a
                href="#planes"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 p-2.5 rounded-xl text-xs sm:text-sm font-medium text-foreground hover:bg-muted/80 transition-colors"
              >
                <div className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5" />
                </div>
                <span>Planes y Precios</span>
              </a>

              <a
                href="#faq"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 p-2.5 rounded-xl text-xs sm:text-sm font-medium text-foreground hover:bg-muted/80 transition-colors"
              >
                <div className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                  <HelpCircle className="h-3.5 w-3.5" />
                </div>
                <span>Preguntas Frecuentes</span>
              </a>

              <Link
                href="/instalacion"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 p-2.5 rounded-xl text-xs sm:text-sm font-medium text-foreground hover:bg-muted/80 transition-colors"
              >
                <div className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                  <Download className="h-3.5 w-3.5" />
                </div>
                <span>Guía de Instalación (PWA & APK)</span>
              </Link>
            </div>

            {/* Auth Actions in Mobile Menu */}
            <div className="pt-3 mt-2 border-t border-border/50 space-y-2">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="w-full h-10 font-semibold text-xs sm:text-sm justify-center rounded-xl"
                onClick={() => setIsOpen(false)}
              >
                <Link href="/auth/login">
                  <LogIn className="h-4 w-4 mr-2" />
                  Iniciar Sesión
                </Link>
              </Button>

              <Button
                size="sm"
                asChild
                className="w-full h-10 font-semibold text-xs sm:text-sm bg-gradient-to-r from-primary via-purple-600 to-indigo-600 hover:from-primary/90 hover:to-indigo-500 text-white shadow-md shadow-primary/20 border-0 justify-center rounded-xl"
                onClick={() => setIsOpen(false)}
              >
                <Link href="/auth/sign-up">
                  Comenzar Gratis Ahora
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
