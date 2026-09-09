"use client"

import type React from "react"
import { useState, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { Logo } from "@/components/logo"
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Loader2,
  ShieldCheck,
  CheckCircle2,
  Volume2,
  Sparkles,
  ArrowRight
} from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const formContainerRef = useRef<HTMLDivElement>(null)
  const brandCardRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.from(formContainerRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: "power3.out",
    })

    if (brandCardRef.current) {
      gsap.from(brandCardRef.current, {
        opacity: 0,
        x: -30,
        duration: 0.9,
        ease: "power3.out",
      })
    }
  })

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      console.log("[v0] Login page - Sending to API:", email)

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Error al iniciar sesión. Revisa tus credenciales.")
        setLoading(false)
        return
      }

      if (data.accessToken) {
        localStorage.setItem("auth_token", data.accessToken)
        localStorage.setItem("auth_user", JSON.stringify(data.user))
      }

      window.location.href = data.redirectTo || "/dashboard"
    } catch (err) {
      setError("Ocurrió un error inesperado. Intenta de nuevo.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex bg-background text-foreground">
      {/* Left Column: Brand & Trust Showcase (Desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden bg-gradient-to-br from-purple-950 via-neutral-950 to-indigo-950 text-white border-r border-border/20">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/3 w-[450px] h-[450px] bg-primary/25 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-emerald-500/15 rounded-full blur-[100px] pointer-events-none" />

        {/* Top Header inside showcase */}
        <div className="relative z-10">
          <Logo size="md" showBadge variant="dark" />
        </div>

        {/* Middle Visual Content */}
        <div ref={brandCardRef} className="relative z-10 max-w-md space-y-6 my-auto">
          <Badge className="px-3 py-1 bg-white/10 text-purple-200 border-white/20 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 mr-1 text-yellow-300 fill-yellow-300" />
            Acceso a tu Panel de Ventas
          </Badge>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            Control total de tus pagos Yape en un solo lugar
          </h2>

          <p className="text-purple-200/80 text-sm leading-relaxed">
            Ingresa a tu cuenta para supervisar dispositivos activos, revisar historiales de cobro y descargar reportes para el cuadre del día.
          </p>

          {/* Mini Live Preview Widget */}
          <div className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl p-4 shadow-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-purple-200 flex items-center gap-1.5">
                <Volume2 className="h-4 w-4 text-emerald-400 animate-pulse" />
                Última Notificación Capturada
              </span>
              <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/20 px-2 py-0.5 rounded-full">
                VALIDADO
              </span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <div>
                <p className="font-bold text-sm text-white">Rosa María Flores</p>
                <p className="text-[11px] text-purple-200/70 font-mono">OP #719284 • Caja Principal</p>
              </div>
              <span className="text-xl font-black text-emerald-400">+ S/ 65.00</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-2 text-xs text-purple-200/90">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Cero estafas de capturas</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-purple-200/90">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Voz TTS por Bluetooth</span>
            </div>
          </div>
        </div>

        {/* Footer info in showcase */}
        <div className="relative z-10 flex items-center justify-between text-xs text-purple-300/70 pt-6 border-t border-white/10">
          <p>© {new Date().getFullYear()} PagoPing Perú</p>
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            Cifrado Seguro SSL
          </span>
        </div>
      </div>

      {/* Right Column: Interactive Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-4 sm:p-8 md:p-12 relative overflow-y-auto safe-top safe-bottom">
        {/* Top navigation actions */}
        <div className="flex items-center justify-between w-full max-w-md mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Volver a la web
          </Link>
          <ThemeToggle />
        </div>

        {/* Form Container */}
        <div ref={formContainerRef} className="w-full max-w-md mx-auto my-auto py-8">
          {/* Mobile Logo View */}
          <div className="lg:hidden mb-8">
            <Logo size="md" />
          </div>

          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Iniciar Sesión
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Ingresa tus credenciales para acceder a tu panel de PagoPing
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold flex items-center gap-2 animate-shake">
                <span>{error}</span>
              </div>
            )}

            {/* Email field */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold">
                Correo Electrónico
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                  <Mail className="h-4 w-4" />
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tu@negocio.com"
                  required
                  className="pl-10 h-11 rounded-xl bg-card border-border/80 focus:border-primary focus:ring-primary/20 transition-all text-sm"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-semibold">
                  Contraseña
                </Label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                  <Lock className="h-4 w-4" />
                </div>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  className="pl-10 pr-10 h-11 rounded-xl bg-card border-border/80 focus:border-primary focus:ring-primary/20 transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 mt-2 text-sm font-bold rounded-xl bg-gradient-to-r from-primary via-purple-600 to-indigo-600 hover:from-primary/95 hover:to-indigo-500 text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 hover:scale-[1.01]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Ingresando a tu cuenta...
                </>
              ) : (
                <>
                  Ingresar a PagoPing
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Sign up link */}
          <div className="mt-8 text-center text-xs text-muted-foreground pt-6 border-t border-border/50">
            ¿Aún no tienes cuenta?{" "}
            <Link
              href="/auth/sign-up"
              className="font-bold text-primary hover:underline hover:text-primary/90 ml-1"
            >
              Regístrate gratis aquí
            </Link>
          </div>
        </div>

        {/* Bottom security assurance */}
        <div className="w-full max-w-md mx-auto text-center text-[11px] text-muted-foreground/70">
          <p>Tus datos están protegidos con autenticación segura y cifrado SSL.</p>
        </div>
      </div>
    </div>
  )
}
