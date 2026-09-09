"use client"

import { useRef } from "react"
import Link from "next/link"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Smartphone,
  ArrowRight,
  ShieldCheck,
  Volume2,
  Zap,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Download
} from "lucide-react"

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const heroBadgeRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const paragraphRef = useRef<HTMLParagraphElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)
  const trustRef = useRef<HTMLDivElement>(null)
  const phoneMockupRef = useRef<HTMLDivElement>(null)
  const floatingCard1Ref = useRef<HTMLDivElement>(null)
  const floatingCard2Ref = useRef<HTMLDivElement>(null)
  const floatingCard3Ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      // Intro timeline
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

      tl.from(heroBadgeRef.current, {
        y: -30,
        opacity: 0,
        duration: 0.8,
      })
        .from(
          headingRef.current,
          {
            y: 40,
            opacity: 0,
            duration: 1,
          },
          "-=0.5"
        )
        .from(
          paragraphRef.current,
          {
            y: 30,
            opacity: 0,
            duration: 0.8,
          },
          "-=0.6"
        )
        .from(
          buttonsRef.current,
          {
            y: 20,
            opacity: 0,
            scale: 0.95,
            duration: 0.7,
          },
          "-=0.5"
        )
        .from(
          trustRef.current,
          {
            opacity: 0,
            duration: 0.8,
          },
          "-=0.4"
        )
        .from(
          phoneMockupRef.current,
          {
            y: 60,
            opacity: 0,
            scale: 0.9,
            duration: 1.2,
            ease: "back.out(1.4)",
          },
          "-=0.8"
        )

      // Continuous subtle floating animations for badges
      gsap.to(floatingCard1Ref.current, {
        y: -12,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      })

      gsap.to(floatingCard2Ref.current, {
        y: 10,
        duration: 3.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.6,
      })

      gsap.to(floatingCard3Ref.current, {
        y: -8,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1.2,
      })
    },
    { scope: containerRef }
  )

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32"
    >
      {/* Dynamic ambient lights / mesh glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-gradient-to-tr from-primary/25 via-purple-500/20 to-indigo-500/10 rounded-full blur-[130px] opacity-70 dark:opacity-40 animate-pulse" />
        <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-emerald-500/15 rounded-full blur-[100px] opacity-50 dark:opacity-30" />
        <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-blue-500/15 rounded-full blur-[120px] opacity-50 dark:opacity-30" />
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center max-w-3xl mx-auto mb-14">
          {/* Badge */}
          <div ref={heroBadgeRef} className="inline-block">
            <Badge
              variant="outline"
              className="px-4 py-1.5 rounded-full border-primary/30 bg-primary/10 text-primary font-semibold text-xs md:text-sm tracking-wide shadow-sm hover:bg-primary/15 transition-colors gap-2"
            >
              <Sparkles className="h-3.5 w-3.5 fill-primary text-primary" />
              <span>La solución #1 contra vouchers falsos en Perú</span>
              <span className="hidden sm:inline-block text-muted-foreground">• Compatible con Yape</span>
            </Badge>
          </div>

          {/* Heading */}
          <h1
            ref={headingRef}
            className="mt-6 text-4xl sm:text-5xl md:text-7xl font-black tracking-tight leading-[1.1] text-foreground"
          >
            Tu negocio canta cada pago{" "}
            <span className="bg-gradient-to-r from-primary via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              en 1 segundo
            </span>
          </h1>

          {/* Description */}
          <p
            ref={paragraphRef}
            className="mt-6 text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-pretty"
          >
            PagoPing escucha las notificaciones de <strong>Yape</strong> en tu celular, las valida contra estafas y anuncia en voz alta cada pago para tus cajeros y empleados.
          </p>

          {/* Call to action buttons */}
          <div
            ref={buttonsRef}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              size="lg"
              asChild
              className="w-full sm:w-auto h-12 px-7 text-base font-semibold bg-gradient-to-r from-primary via-purple-600 to-indigo-600 hover:from-primary/95 hover:to-indigo-500 text-white shadow-xl shadow-primary/25 rounded-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-primary/40"
            >
              <Link href="/auth/sign-up">
                Comenzar Gratis Ahora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              asChild
              className="w-full sm:w-auto h-12 px-6 text-base font-medium rounded-xl border-border/80 hover:bg-muted/70 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02]"
            >
              <Link href="/app-release.apk" target="_blank" download>
                <Download className="mr-2 h-5 w-5 text-primary" />
                Descargar APK Android
              </Link>
            </Button>
          </div>

          {/* Trust badges */}
          <div
            ref={trustRef}
            className="mt-8 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs sm:text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>Instalación en 2 minutos</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>Sin tarjeta de crédito</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>100% Seguro y Privado</span>
            </div>
          </div>
        </div>

        {/* Hero Interactive Visual Showcase */}
        <div ref={phoneMockupRef} className="relative mx-auto max-w-4xl mt-6">
          {/* Glass Card Container */}
          <div className="relative rounded-3xl border border-border/60 bg-gradient-to-b from-card/90 to-card/40 p-4 sm:p-8 backdrop-blur-2xl shadow-2xl shadow-primary/10">
            {/* Top Bar of Dashboard Simulation */}
            <div className="flex items-center justify-between pb-6 border-b border-border/40">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
                </div>
                <span className="text-xs font-semibold text-muted-foreground">
                  pagoping.app / panel-en-vivo
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                  3 Dispositivos Sincronizados
                </span>
              </div>
            </div>

            {/* Grid inside mockup: Phone preview & Dashboard table */}
            <div className="grid lg:grid-cols-12 gap-6 mt-6 items-center">
              {/* Phone Mockup Screen */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-64 sm:w-72 rounded-[2.5rem] p-3.5 bg-neutral-900 border-4 border-neutral-800 shadow-2xl ring-1 ring-white/10">
                  {/* Speaker notch */}
                  <div className="absolute top-5 left-1/2 -translate-x-1/2 w-20 h-4 bg-neutral-800 rounded-full flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-neutral-950" />
                  </div>

                  {/* Mobile Screen Content */}
                  <div className="rounded-[2rem] overflow-hidden bg-gradient-to-b from-purple-950/90 via-neutral-950 to-neutral-900 text-white p-4 pt-10 min-h-[380px] flex flex-col justify-between">
                    <div>
                      <div className="text-center mb-4">
                        <span className="text-[11px] font-medium text-purple-300/80 tracking-wide uppercase">
                          PagoPing • Listener Activo
                        </span>
                        <div className="flex items-center justify-center gap-1 mt-1 text-xs text-emerald-400 font-semibold">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          Escuchando notificaciones Yape
                        </div>
                      </div>

                      {/* Incoming simulated Yape notification banner */}
                      <div className="rounded-2xl bg-neutral-800/90 border border-purple-500/30 p-3 shadow-lg shadow-purple-900/30 transition-all hover:scale-[1.02]">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-md bg-[#742299] flex items-center justify-center font-bold text-[10px] text-white">
                              Y
                            </div>
                            <span className="text-[11px] font-bold text-white">Yape</span>
                          </div>
                          <span className="text-[9px] text-neutral-400">Ahora</span>
                        </div>
                        <p className="text-xs text-neutral-200 font-medium">
                          <strong>Carlos Mendoza</strong> te envió un pago de:
                        </p>
                        <div className="mt-1 flex items-baseline justify-between">
                          <span className="text-lg font-black text-emerald-400">S/ 120.00</span>
                          <span className="text-[10px] text-neutral-400 font-mono">OP: #482910</span>
                        </div>
                      </div>

                      {/* TTS Soundwave Animation */}
                      <div className="mt-4 rounded-xl bg-purple-900/30 border border-purple-500/20 p-2.5 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/20 text-primary">
                          <Volume2 className="h-4 w-4 animate-bounce text-purple-300" />
                        </div>
                        <div className="flex-1">
                          <p className="text-[10px] text-purple-200 font-medium">Voz en parlante:</p>
                          <p className="text-[11px] text-white font-bold truncate">
                            ¡Pago de 120 soles recibido!
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="text-center pt-3 border-t border-white/10">
                      <p className="text-[10px] text-neutral-400">
                        Válido • Sin tocar el celular
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Real-time Dashboard Snapshot */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base sm:text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Registro de Ventas en Vivo
                  </h3>
                  <Badge variant="secondary" className="font-mono text-xs">
                    Hoy: S/ 1,480.00
                  </Badge>
                </div>

                {/* Simulated list of payments */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                        CM
                      </div>
                      <div>
                        <p className="font-semibold text-sm leading-tight">Carlos Mendoza</p>
                        <p className="text-xs text-muted-foreground">Yape • OP #482910 • Celular Cajero 1</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-600 dark:text-emerald-400 text-sm sm:text-base">+ S/ 120.00</p>
                      <span className="text-[10px] font-medium text-emerald-500 uppercase">Validado</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-card border border-border/70 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                        MG
                      </div>
                      <div>
                        <p className="font-semibold text-sm leading-tight">María García Ramos</p>
                        <p className="text-xs text-muted-foreground">Yape • OP #482909 • Celular Barra</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground text-sm sm:text-base">+ S/ 45.50</p>
                      <span className="text-[10px] text-muted-foreground">Hace 4 min</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-card border border-border/70 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                        RT
                      </div>
                      <div>
                        <p className="font-semibold text-sm leading-tight">Renzo Torres Salazar</p>
                        <p className="text-xs text-muted-foreground">Yape • OP #482908 • Celular Delivery</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground text-sm sm:text-base">+ S/ 89.00</p>
                      <span className="text-[10px] text-muted-foreground">Hace 12 min</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    Hash MD5 anti-duplicados verificado
                  </span>
                  <Link href="#simulador" className="text-primary font-medium hover:underline flex items-center gap-1">
                    Probar interactivo <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Pill 1 (Top Left) */}
          <div
            ref={floatingCard1Ref}
            className="hidden sm:flex absolute -top-6 -left-6 items-center gap-2.5 rounded-2xl border border-emerald-500/30 bg-background/95 backdrop-blur-xl p-3 shadow-xl shadow-emerald-500/10"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-500">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">0.2 segundos</p>
              <p className="text-[10px] text-muted-foreground">Detección ultrarrápida</p>
            </div>
          </div>

          {/* Floating Pill 2 (Top Right) */}
          <div
            ref={floatingCard2Ref}
            className="hidden sm:flex absolute -top-5 -right-6 items-center gap-2.5 rounded-2xl border border-purple-500/30 bg-background/95 backdrop-blur-xl p-3 shadow-xl shadow-purple-500/10"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/20 text-primary">
              <Volume2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Voz TTS por Parlante</p>
              <p className="text-[10px] text-muted-foreground">Sin tocar el celular</p>
            </div>
          </div>

          {/* Floating Pill 3 (Bottom Left) */}
          <div
            ref={floatingCard3Ref}
            className="hidden sm:flex absolute -bottom-6 -left-4 items-center gap-2.5 rounded-2xl border border-blue-500/30 bg-background/95 backdrop-blur-xl p-3 shadow-xl shadow-blue-500/10"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/20 text-blue-500">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Anti-Capturas Falsas</p>
              <p className="text-[10px] text-muted-foreground">Verificación de OP real</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
