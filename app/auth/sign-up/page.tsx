"use client"

import type React from "react"
import { useState, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { createClient } from "@/lib/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { Logo } from "@/components/logo"
import {
  Mail,
  Lock,
  Building2,
  Phone,
  Eye,
  EyeOff,
  ArrowLeft,
  Loader2,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Check
} from "lucide-react"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [businessName, setBusinessName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showRepeatPassword, setShowRepeatPassword] = useState(false)
  const router = useRouter()

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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== repeatPassword) {
      setError("Las contraseñas no coinciden")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
          data: {
            phone_number: phoneNumber,
            display_name: businessName,
            business_name: businessName,
          },
        },
      })
      if (error) throw error
      router.push("/auth/sign-up-success")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Ocurrió un error al crear la cuenta")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex bg-background text-foreground">
      {/* Left Column: Brand & Value Proposition (Desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden bg-gradient-to-br from-purple-950 via-neutral-950 to-indigo-950 text-white border-r border-border/20">
        {/* Ambient Glows */}
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-primary/25 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-blue-500/15 rounded-full blur-[100px] pointer-events-none" />

        {/* Top Header inside showcase */}
        <div className="relative z-10">
          <Logo size="md" showBadge variant="dark" />
        </div>

        {/* Middle Visual Content */}
        <div ref={brandCardRef} className="relative z-10 max-w-md space-y-6 my-auto">
          <Badge className="px-3 py-1 bg-white/10 text-purple-200 border-white/20 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 mr-1 text-yellow-300 fill-yellow-300" />
            Comienza Gratis en 2 Minutos
          </Badge>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            Únete a cientos de comercios que ya no caen en estafas
          </h2>

          <p className="text-purple-200/80 text-sm leading-relaxed">
            Protege tus ventas, atiende más rápido en caja y deja que tu parlante anuncie cada pago Yape en voz alta.
          </p>

          {/* Value points */}
          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 mt-0.5">
                <Check className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Validación Instantánea de Notificaciones</p>
                <p className="text-[11px] text-purple-200/70">
                  Lectura directa del paquete de Yape en tu celular Android.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="p-1.5 rounded-lg bg-primary/30 text-purple-300 mt-0.5">
                <Check className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Audio por Parlante Bluetooth</p>
                <p className="text-[11px] text-purple-200/70">
                  Tus cajeros no necesitan tocar el teléfono ni pedir capturas.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 mt-0.5">
                <Check className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Multicaja Sincronizada</p>
                <p className="text-[11px] text-purple-200/70">
                  Supervisa varias cajas o tiendas desde un solo panel.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info in showcase */}
        <div className="relative z-10 flex items-center justify-between text-xs text-purple-300/70 pt-6 border-t border-white/10">
          <p>© {new Date().getFullYear()} PagoPing Perú</p>
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            Sin tarjeta de crédito requerida
          </span>
        </div>
      </div>

      {/* Right Column: Interactive Registration Form */}
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
        <div ref={formContainerRef} className="w-full max-w-md mx-auto my-auto py-6">
          {/* Mobile Logo View */}
          <div className="lg:hidden mb-6">
            <Logo size="md" />
          </div>

          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Crear Cuenta de Negocio
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Empieza gratis hoy y recibe tus pagos con confirmación por voz
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignUp} className="space-y-3.5">
            {error && (
              <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold flex items-center gap-2 animate-shake">
                <span>{error}</span>
              </div>
            )}

            {/* Business name field */}
            <div className="space-y-1">
              <Label htmlFor="business" className="text-xs font-semibold">
                Nombre de tu Negocio / Empresa
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                </div>
                <Input
                  id="business"
                  type="text"
                  placeholder="Mi Tienda o Restaurante S.A.C."
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="pl-10 h-10 rounded-xl bg-card border-border/80 focus:border-primary focus:ring-primary/20 transition-all text-sm"
                />
              </div>
            </div>

            {/* Email field */}
            <div className="space-y-1">
              <Label htmlFor="email" className="text-xs font-semibold">
                Correo Electrónico
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                  <Mail className="h-4 w-4" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@minegocio.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-10 rounded-xl bg-card border-border/80 focus:border-primary focus:ring-primary/20 transition-all text-sm"
                />
              </div>
            </div>

            {/* Phone field */}
            <div className="space-y-1">
              <Label htmlFor="phone" className="text-xs font-semibold">
                Número de Celular / WhatsApp
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                  <Phone className="h-4 w-4" />
                </div>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="999 999 999"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="pl-10 h-10 rounded-xl bg-card border-border/80 focus:border-primary focus:ring-primary/20 transition-all text-sm"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1">
              <Label htmlFor="password" className="text-xs font-semibold">
                Contraseña (mínimo 6 caracteres)
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                  <Lock className="h-4 w-4" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-10 rounded-xl bg-card border-border/80 focus:border-primary focus:ring-primary/20 transition-all text-sm"
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

            {/* Repeat Password field */}
            <div className="space-y-1">
              <Label htmlFor="repeat-password" className="text-xs font-semibold">
                Repetir Contraseña
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                  <Lock className="h-4 w-4" />
                </div>
                <Input
                  id="repeat-password"
                  type={showRepeatPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  className="pl-10 pr-10 h-10 rounded-xl bg-card border-border/80 focus:border-primary focus:ring-primary/20 transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showRepeatPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 mt-3 text-sm font-bold rounded-xl bg-gradient-to-r from-primary via-purple-600 to-indigo-600 hover:from-primary/95 hover:to-indigo-500 text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 hover:scale-[1.01]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando tu cuenta...
                </>
              ) : (
                <>
                  Registrar mi Negocio Gratis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Login redirect link */}
          <div className="mt-6 text-center text-xs text-muted-foreground pt-5 border-t border-border/50">
            ¿Ya tienes una cuenta registrada?{" "}
            <Link
              href="/auth/login"
              className="font-bold text-primary hover:underline hover:text-primary/90 ml-1"
            >
              Inicia sesión aquí
            </Link>
          </div>
        </div>

        {/* Bottom security assurance */}
        <div className="w-full max-w-md mx-auto text-center text-[11px] text-muted-foreground/70">
          <p>
            Al registrarte aceptas la{" "}
            <Link href="/privacidad" className="font-medium text-primary underline underline-offset-2">
              Política de Privacidad
            </Link>{" "}
            de PagoPing.
          </p>
        </div>
      </div>
    </div>
  )
}
