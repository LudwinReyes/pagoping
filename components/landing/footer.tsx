"use client"

import Link from "next/link"
import { Logo } from "@/components/logo"
import { Smartphone, Shield, Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-card/40 backdrop-blur-md py-8 sm:py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {/* Col 1: Brand */}
          <div className="col-span-2 md:col-span-1 space-y-2.5 sm:space-y-3">
            <Logo size="sm" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Monitoreo, validación y alerta por voz para notificaciones de pagos Yape en comercios y tiendas de Perú.
            </p>
            <div className="pt-1 sm:pt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
              <span>🇵🇪 Hecho en Perú</span>
            </div>
          </div>

          {/* Col 2: Producto */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-2.5 sm:mb-3">
              Producto
            </h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs text-muted-foreground">
              <li>
                <a href="#como-funciona" className="hover:text-primary transition-colors">
                  Cómo funciona
                </a>
              </li>
              <li>
                <a href="#simulador" className="hover:text-primary transition-colors">
                  Simulador interactivo
                </a>
              </li>
              <li>
                <a href="#caracteristicas" className="hover:text-primary transition-colors">
                  Voz TTS y Anti-Fraude
                </a>
              </li>
              <li>
                <a href="#planes" className="hover:text-primary transition-colors">
                  Planes y Precios
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Recursos */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-2.5 sm:mb-3">
              Recursos
            </h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/instalacion" className="hover:text-primary transition-colors">
                  Guía de instalación
                </Link>
              </li>
              <li>
                <a href="/app-release.apk" target="_blank" download className="hover:text-primary transition-colors">
                  Descargar APK
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-primary transition-colors">
                  Preguntas frecuentes
                </a>
              </li>
              <li>
                <Link href="/MOBILE_API_DOCUMENTATION.md" target="_blank" className="hover:text-primary transition-colors">
                  Documentación API
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & Acceso */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-2.5 sm:mb-3">
              Acceso
            </h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/auth/login" className="hover:text-primary transition-colors">
                  Iniciar Sesión
                </Link>
              </li>
              <li>
                <Link href="/auth/sign-up" className="hover:text-primary transition-colors">
                  Crear Cuenta
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-primary transition-colors">
                  Panel de Control
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 sm:pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs text-muted-foreground text-center sm:text-left">
          <p>© {new Date().getFullYear()} PagoPing. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Shield className="h-3.5 w-3.5 text-emerald-500" />
              Conexión Cifrada SSL
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
