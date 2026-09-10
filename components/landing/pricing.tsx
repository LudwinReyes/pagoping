"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import gsap from "gsap"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, ArrowRight, Shield } from "lucide-react"

export function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false)
  const cardsContainerRef = useRef<HTMLDivElement>(null)

  const toggleBilling = (annual: boolean) => {
    setIsAnnual(annual)
    if (cardsContainerRef.current) {
      gsap.fromTo(
        cardsContainerRef.current.children,
        { scale: 0.96, opacity: 0.8 },
        { scale: 1, opacity: 1, duration: 0.35, stagger: 0.05, ease: "power2.out" }
      )
    }
  }

  const plans = [
    {
      name: "Gratis",
      desc: "Para probar PagoPing en tu negocio sin compromiso.",
      price: "S/ 0",
      period: "Para siempre",
      highlighted: false,
      badge: null,
      features: [
        "5 validaciones de prueba",
        "1 dispositivo Android",
        "Voz TTS por parlante",
        "Dashboard básico",
      ],
      ctaText: "Comenzar Gratis",
      ctaVariant: "outline" as const,
    },
    {
      name: "Básico",
      desc: "Para bodegas o tiendas pequeñas con 1 punto de venta.",
      price: isAnnual ? "S/ 11.25" : "S/ 15",
      period: isAnnual ? "/ mes (pago anual)" : "/ mes",
      highlighted: false,
      badge: isAnnual ? "Ahorras 25%" : null,
      features: [
        "Validaciones ILIMITADAS",
        "1 dispositivo conectado",
        "Voz TTS en tiempo real",
        "Historial de 30 días",
        "Escudo anti-duplicados MD5",
      ],
      ctaText: "Elegir Básico",
      ctaVariant: "outline" as const,
    },
    {
      name: "Negocio",
      desc: "El más elegido por restaurantes, pollerías y minimarkets.",
      price: isAnnual ? "S/ 22.50" : "S/ 30",
      period: isAnnual ? "/ mes (pago anual)" : "/ mes",
      highlighted: true,
      badge: "MÁS POPULAR",
      features: [
        "Validaciones ILIMITADAS",
        "Hasta 4 dispositivos (Multicaja)",
        "Voz TTS en todos los celulares",
        "Historial completo de ventas",
        "Exportación a Excel / CSV",
        "Soporte prioritario por WhatsApp",
      ],
      ctaText: "Probar Plan Negocio",
      ctaVariant: "default" as const,
    },
    {
      name: "Empresa",
      desc: "Para cadenas de locales o franquicias con alto volumen.",
      price: isAnnual ? "S/ 45" : "S/ 60",
      period: isAnnual ? "/ mes (pago anual)" : "/ mes",
      highlighted: false,
      badge: "ALTO VOLUMEN",
      features: [
        "Validaciones ILIMITADAS",
        "Hasta 8 dispositivos conectados",
        "Dashboard centralizado multi-local",
        "Exportación automática",
        "Asesor técnico dedicado",
      ],
      ctaText: "Contactar Asesor",
      ctaVariant: "outline" as const,
    },
  ]

  return (
    <section id="planes" className="py-14 sm:py-20 md:py-28 relative bg-muted/20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <Badge variant="outline" className="mb-3 px-3 py-1 border-primary/30 bg-primary/10 text-primary font-semibold text-xs">
            Precios Claros y Accesibles
          </Badge>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground text-balance">
            Invierte centavos al día,{" "}
            <span className="bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
              evita miles en pérdidas
            </span>
          </h2>
          <p className="mt-3 sm:mt-4 text-muted-foreground text-sm sm:text-lg text-balance">
            Elige el plan ideal para tu negocio. Puedes cambiar de plan o cancelar cuando quieras.
          </p>

          {/* Billing Switcher Toggle */}
          <div className="mt-6 sm:mt-8 inline-flex items-center rounded-full p-1 sm:p-1.5 bg-background border border-border/70 shadow-sm max-w-full">
            <button
              type="button"
              onClick={() => toggleBilling(false)}
              className={`px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
                !isAnnual
                  ? "bg-primary text-white shadow-md shadow-primary/30"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Pago Mensual
            </button>
            <button
              type="button"
              onClick={() => toggleBilling(true)}
              className={`px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-1 sm:gap-1.5 ${
                isAnnual
                  ? "bg-primary text-white shadow-md shadow-primary/30"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>Pago Anual</span>
              <span className="px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] bg-emerald-500 text-white font-bold tracking-tight">
                -25%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div
          ref={cardsContainerRef}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 items-stretch"
        >
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative flex flex-col justify-between transition-all duration-300 rounded-2xl sm:rounded-3xl ${
                plan.highlighted
                  ? "border-2 border-primary shadow-2xl shadow-primary/15 bg-gradient-to-b from-card via-card to-primary/5 scale-100 lg:-translate-y-2"
                  : "border-border/80 bg-card hover:border-border hover:shadow-lg"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge
                    className={`px-3 py-0.5 text-[10px] sm:text-[11px] font-black tracking-wider uppercase shadow-md ${
                      plan.highlighted
                        ? "bg-gradient-to-r from-primary via-purple-600 to-indigo-600 text-white"
                        : "bg-emerald-600 text-white"
                    }`}
                  >
                    {plan.badge}
                  </Badge>
                </div>
              )}

              <CardHeader className="p-4 sm:p-6 pt-6 sm:pt-7 pb-3 sm:pb-4">
                <CardTitle className="text-lg sm:text-xl font-bold text-foreground flex items-center justify-between">
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground min-h-[28px] sm:min-h-[32px] mt-1">
                  {plan.desc}
                </CardDescription>
                <div className="pt-3 sm:pt-4 border-t border-border/40">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
                      {plan.price}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">
                      {plan.period}
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0 space-y-5 sm:space-y-6 flex-1 flex flex-col justify-between">
                <ul className="space-y-2 sm:space-y-2.5 pt-1 sm:pt-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 sm:gap-2.5 text-xs text-muted-foreground">
                      <CheckCircle2
                        className={`h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 mt-0.5 ${
                          plan.highlighted ? "text-primary" : "text-emerald-500"
                        }`}
                      />
                      <span className="text-foreground/90 font-medium leading-tight">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full h-10 sm:h-11 font-bold rounded-xl transition-all duration-300 text-xs sm:text-sm ${
                    plan.highlighted
                      ? "bg-gradient-to-r from-primary via-purple-600 to-indigo-600 hover:from-primary/95 hover:to-indigo-500 text-white shadow-lg shadow-primary/25 hover:scale-[1.02]"
                      : "border-border/80 hover:bg-muted"
                  }`}
                  variant={plan.ctaVariant}
                  asChild
                >
                  <Link href="/auth/sign-up">
                    {plan.ctaText}
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Security / Guarantee note */}
        <div className="mt-8 sm:mt-12 text-center flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Shield className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Garantía de satisfacción:</span>
          </div>
          <span>Puedes cancelar en cualquier momento sin penalizaciones.</span>
        </div>
      </div>
    </section>
  )
}
