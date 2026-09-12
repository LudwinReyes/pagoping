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
      // Intro timeline using fromTo with clearProps: "all" for resilient rendering on iOS WebKit
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } })

      if (heroBadgeRef.current) {
        tl.fromTo(
          heroBadgeRef.current,
          { y: -20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, clearProps: "all" }
        )
      }

      if (headingRef.current) {
        tl.fromTo(
          headingRef.current,
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, clearProps: "all" },
          "-=0.4"
        )
      }

      if (paragraphRef.current) {
        tl.fromTo(
          paragraphRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, clearProps: "all" },
          "-=0.4"
        )
      }

      if (buttonsRef.current) {
        tl.fromTo(
          buttonsRef.current,
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, clearProps: "all" },
          "-=0.3"
        )
      }

      if (trustRef.current) {
        tl.fromTo(
          trustRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.6, clearProps: "all" },
          "-=0.3"
        )
      }

      if (phoneMockupRef.current) {
        tl.fromTo(
          phoneMockupRef.current,
          { y: 35, opacity: 0, scale: 0.96 },
          { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "power3.out", clearProps: "all" },
          "-=0.4"
        )
      }
    },
    { scope: containerRef }
  )

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden pt-8 pb-14 sm:pt-12 sm:pb-20 md:pt-20 md:pb-32"
    >
      {/* Optimized GPU-friendly ambient lights */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[550px] h-[280px] sm:h-[400px] bg-gradient-to-tr from-primary/20 via-purple-500/15 to-indigo-500/10 rounded-full blur-2xl sm:blur-3xl opacity-60 dark:opacity-30 gpu-layer" />
        <div className="hidden sm:block absolute top-1/3 right-10 w-[280px] h-[280px] bg-emerald-500/10 rounded-full blur-2xl sm:blur-3xl opacity-40 dark:opacity-20 gpu-layer" />
        <div className="hidden sm:block absolute bottom-10 left-10 w-[280px] h-[280px] bg-blue-500/10 rounded-full blur-2xl sm:blur-3xl opacity-40 dark:opacity-20 gpu-layer" />
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          {/* Badge */}
          <div ref={heroBadgeRef} className="inline-block max-w-full">
            <Badge
              variant="outline"
              className="px-3 py-1 sm:px-4 sm:py-1.5 rounded-full border-primary/30 bg-primary/10 text-primary font-semibold text-xs md:text-sm tracking-wide shadow-sm hover:bg-primary/15 transition-colors gap-1.5 sm:gap-2 flex-wrap justify-center text-center"
            >
              <Sparkles className="h-3.5 w-3.5 fill-primary text-primary shrink-0" />
              <span>La solución #1 contra vouchers falsos en Perú</span>
              <span className="hidden sm:inline-block text-muted-foreground">• Compatible con Yape</span>
            </Badge>
          </div>

          {/* Heading */}
          <h1
            ref={headingRef}
            className="mt-5 sm:mt-6 text-3xl sm:text-5xl md:text-7xl font-black tracking-tight leading-[1.15] sm:leading-[1.1] text-foreground text-balance"
          >
            Tu negocio canta cada pago{" "}
            <span className="bg-gradient-to-r from-primary via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              en 1 segundo
            </span>
          </h1>

          {/* Description */}
          <p
            ref={paragraphRef}
            className="mt-4 sm:mt-6 text-sm sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-balance"
          >
            PagoPing escucha las notificaciones de <strong>Yape</strong> en tu celular, las valida contra estafas y anuncia en voz alta cada pago para tus cajeros y empleados.
          </p>

          {/* Call to action buttons */}
          <div
            ref={buttonsRef}
            className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full"
          >
            <Button
              size="lg"
              asChild
              className="w-full sm:w-auto h-12 px-7 text-sm sm:text-base font-semibold bg-gradient-to-r from-primary via-purple-600 to-indigo-600 hover:from-primary/95 hover:to-indigo-500 text-white shadow-xl shadow-primary/25 rounded-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-primary/40"
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
              className="w-full sm:w-auto h-12 px-6 text-sm sm:text-base font-medium rounded-xl border-border/80 hover:bg-muted/70 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02]"
            >
              <a href="/app-release.apk" target="_blank" download>
                <Download className="mr-2 h-5 w-5 text-primary" />
                Descargar APK Android
              </a>
            </Button>
          </div>

          {/* Trust badges */}
          <div
            ref={trustRef}
            className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-y-2 gap-x-4 sm:gap-x-6 text-xs sm:text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Instalación en 2 minutos</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Sin tarjeta de crédito</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>100% Seguro y Privado</span>
            </div>
          </div>
        </div>

        {/* Hero Interactive Visual Showcase */}
        <div ref={phoneMockupRef} className="relative mx-auto max-w-4xl mt-4 sm:mt-6">
          {/* Glass Card Container */}
          <div className="relative rounded-2xl sm:rounded-3xl border border-border/60 bg-gradient-to-b from-card/90 to-card/40 p-3.5 sm:p-8 backdrop-blur-2xl shadow-2xl shadow-primary/10">
            {/* Top Bar of Dashboard Simulation */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-4 sm:pb-6 border-b border-border/40">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="flex gap-1.5 shrink-0">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-400/80" />
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-400/80" />
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-400/80" />
                </div>
                <span className="text-[11px] sm:text-xs font-semibold text-muted-foreground truncate">
                  pagoping.app / panel-en-vivo
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[11px] sm:text-xs font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
                  3 Dispositivos Sincronizados
                </span>
              </div>
            </div>

            {/* Grid inside mockup: Phone preview & Dashboard table */}
            <div className="grid lg:grid-cols-12 gap-6 mt-4 sm:mt-6 items-center">
              {/* Phone Mockup Screen */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-[260px] sm:w-72 rounded-[2rem] sm:rounded-[2.5rem] p-3 sm:p-3.5 bg-neutral-900 border-4 border-neutral-800 shadow-2xl ring-1 ring-white/10">
                  {/* Speaker notch */}
                  <div className="absolute top-4 sm:top-5 left-1/2 -translate-x-1/2 w-16 sm:w-20 h-3.5 sm:h-4 bg-neutral-800 rounded-full flex items-center justify-center">
                    <div className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-neutral-950" />
                  </div>

                  {/* Mobile Screen Content */}
                  <div className="rounded-[1.6rem] sm:rounded-[2rem] overflow-hidden bg-gradient-to-b from-purple-950/90 via-neutral-950 to-neutral-900 text-white p-3 sm:p-4 pt-8 sm:pt-10 min-h-[350px] sm:min-h-[380px] flex flex-col justify-between">
                    <div>
                      <div className="text-center mb-3 sm:mb-4">
                        <span className="text-[10px] sm:text-[11px] font-medium text-purple-300/80 tracking-wide uppercase">
                          PagoPing • Listener Activo
                        </span>
                        <div className="flex items-center justify-center gap-1 mt-1 text-xs text-emerald-400 font-semibold">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          Escuchando notificaciones Yape
                        </div>
                      </div>

                      {/* Incoming simulated Yape notification banner */}
                      <div className="rounded-2xl bg-neutral-800/90 border border-purple-500/30 p-2.5 sm:p-3 shadow-lg shadow-purple-900/30 transition-all hover:scale-[1.02]">
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
                          <span className="text-base sm:text-lg font-black text-emerald-400">S/ 120.00</span>
                          <span className="text-[10px] text-neutral-400 font-mono">OP: #482910</span>
                        </div>
                      </div>

                      {/* TTS Soundwave Animation */}
                      <div className="mt-3 sm:mt-4 rounded-xl bg-purple-900/30 border border-purple-500/20 p-2 sm:p-2.5 flex items-center gap-2.5 sm:gap-3">
                        <div className="p-1.5 sm:p-2 rounded-lg bg-primary/20 text-primary shrink-0">
                          <Volume2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-bounce text-purple-300" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[9px] sm:text-[10px] text-purple-200 font-medium">Voz en parlante:</p>
                          <p className="text-[10px] sm:text-[11px] text-white font-bold truncate">
                            ¡Pago de 120 soles recibido!
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="text-center pt-2.5 sm:pt-3 border-t border-white/10">
                      <p className="text-[10px] text-neutral-400">
                        Válido • Sin tocar el celular
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Real-time Dashboard Snapshot */}
              <div className="lg:col-span-7 space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm sm:text-lg flex items-center gap-1.5 sm:gap-2">
                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0" />
                    <span>Registro de Ventas en Vivo</span>
                  </h3>
                  <Badge variant="secondary" className="font-mono text-[11px] sm:text-xs shrink-0">
                    Hoy: S/ 1,480.00
                  </Badge>
                </div>

                {/* Simulated list of payments */}
                <div className="space-y-2 sm:space-y-2.5">
                  <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 transition-all gap-2">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-[11px] sm:text-xs shrink-0">
                        CM
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-xs sm:text-sm leading-tight truncate">Carlos Mendoza</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground truncate">Yape • OP #482910 • Celular Cajero 1</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-emerald-600 dark:text-emerald-400 text-xs sm:text-base">+ S/ 120.00</p>
                      <span className="text-[9px] sm:text-[10px] font-medium text-emerald-500 uppercase">Validado</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-card border border-border/70 transition-all gap-2">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[11px] sm:text-xs shrink-0">
                        MG
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-xs sm:text-sm leading-tight truncate">María García Ramos</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground truncate">Yape • OP #482909 • Celular Barra</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-foreground text-xs sm:text-base">+ S/ 45.50</p>
                      <span className="text-[9px] sm:text-[10px] text-muted-foreground whitespace-nowrap">Hace 4 min</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-card border border-border/70 transition-all gap-2">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[11px] sm:text-xs shrink-0">
                        RT
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-xs sm:text-sm leading-tight truncate">Renzo Torres Salazar</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground truncate">Yape • OP #482908 • Celular Delivery</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-foreground text-xs sm:text-base">+ S/ 89.00</p>
                      <span className="text-[9px] sm:text-[10px] text-muted-foreground whitespace-nowrap">Hace 12 min</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Hash MD5 anti-duplicados verificado</span>
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
            className="flex absolute -top-3.5 sm:-top-6 -left-1 sm:-left-6 items-center gap-2 sm:gap-2.5 rounded-xl sm:rounded-2xl border border-emerald-500/30 bg-background/95 backdrop-blur-md p-2 sm:p-3 shadow-xl shadow-emerald-500/10 scale-90 sm:scale-100 origin-top-left animate-float-1 gpu-layer z-20"
          >
            <div className="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-lg sm:rounded-xl bg-emerald-500/20 text-emerald-500">
              <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div>
              <p className="text-[11px] sm:text-xs font-bold text-foreground">0.2 segundos</p>
              <p className="text-[9px] sm:text-[10px] text-muted-foreground">Detección instantánea</p>
            </div>
          </div>

          {/* Floating Pill 2 (Top Right - Desktop) */}
          <div
            ref={floatingCard2Ref}
            className="hidden md:flex absolute -top-5 -right-6 items-center gap-2.5 rounded-2xl border border-purple-500/30 bg-background/95 backdrop-blur-md p-3 shadow-xl shadow-purple-500/10 animate-float-2 gpu-layer z-20"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/20 text-primary">
              <Volume2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Voz TTS por Parlante</p>
              <p className="text-[10px] text-muted-foreground">Sin tocar el celular</p>
            </div>
          </div>

          {/* Floating Pill 3 (Bottom Right on mobile / Bottom Left on desktop) */}
          <div
            ref={floatingCard3Ref}
            className="flex absolute -bottom-3.5 sm:-bottom-6 -right-1 sm:right-auto sm:-left-4 items-center gap-2 sm:gap-2.5 rounded-xl sm:rounded-2xl border border-blue-500/30 bg-background/95 backdrop-blur-md p-2 sm:p-3 shadow-xl shadow-blue-500/10 scale-90 sm:scale-100 origin-bottom-right sm:origin-bottom-left animate-float-2 gpu-layer z-20"
          >
            <div className="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-lg sm:rounded-xl bg-blue-500/20 text-blue-500">
              <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div>
              <p className="text-[11px] sm:text-xs font-bold text-foreground">Anti-Estafas</p>
              <p className="text-[9px] sm:text-[10px] text-muted-foreground">Valida OP real</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
