"use client"

import { useEffect } from "react"
import Link from "next/link"
import confetti from "canvas-confetti"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { Logo } from "@/components/logo"
import {
  CheckCircle2,
  Mail,
  Smartphone,
  ArrowRight,
  Download,
  Sparkles,
  ShieldCheck
} from "lucide-react"

export default function SignUpSuccessPage() {
  useEffect(() => {
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#8e44ad", "#00c853", "#2979ff"],
      })
    } catch {
      // Confetti fallback
    }
  }, [])

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-between p-4 sm:p-6 md:p-10 bg-background text-foreground relative overflow-hidden safe-top safe-bottom">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-primary/15 rounded-full blur-[130px] pointer-events-none" />

      {/* Top Header */}
      <div className="w-full max-w-xl flex items-center justify-between z-10">
        <Logo size="md" />
        <ThemeToggle />
      </div>

      {/* Central Success Card */}
      <div className="w-full max-w-lg z-10 my-auto py-6 sm:py-8">
        <div className="rounded-3xl border border-border/80 bg-card/90 backdrop-blur-xl p-5 sm:p-8 shadow-2xl text-center space-y-5 sm:space-y-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500/15 text-emerald-500 ring-8 ring-emerald-500/10">
            <CheckCircle2 className="h-10 w-10 animate-bounce" />
          </div>

          <div>
            <Badge variant="outline" className="mb-3 px-3 py-1 border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
              <Sparkles className="h-3.5 w-3.5 mr-1 text-emerald-500" />
              Cuenta creada con éxito
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              ¡Casi listo para comenzar!
            </h1>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Te hemos enviado un enlace de confirmación a tu correo electrónico. Por favor, abre tu bandeja y confirma tu cuenta para acceder.
            </p>
          </div>

          {/* Next steps guide */}
          <div className="text-left p-4 rounded-2xl bg-muted/60 border border-border/60 space-y-3 text-xs">
            <div className="flex items-start gap-3">
              <div className="p-1 rounded bg-primary/10 text-primary font-bold">1</div>
              <p className="text-foreground">
                <strong>Revisa tu correo:</strong> Haz clic en el botón de confirmación recibido (revisa spam si no lo ves).
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-1 rounded bg-primary/10 text-primary font-bold">2</div>
              <p className="text-foreground">
                <strong>Descarga la app Android:</strong> Instala el APK de PagoPing en el celular de tu negocio.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              asChild
              className="flex-1 h-11 font-bold rounded-xl bg-gradient-to-r from-primary via-purple-600 to-indigo-600 hover:from-primary/95 hover:to-indigo-500 text-white shadow-lg shadow-primary/20"
            >
              <Link href="/auth/login">
                Ir a Iniciar Sesión
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="flex-1 h-11 font-semibold rounded-xl border-border/80 hover:bg-muted"
            >
              <Link href="/app-release.apk" target="_blank" download>
                <Download className="mr-1.5 h-4 w-4 text-primary" />
                Descargar APK
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full max-w-xl text-center text-xs text-muted-foreground z-10">
        <p>© {new Date().getFullYear()} PagoPing. Hecho para comercios peruanos.</p>
      </div>
    </div>
  )
}
