"use client"

import { useRef, useEffect } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { Badge } from "@/components/ui/badge"
import { Store, Utensils, Wrench, Shirt, Wine, ShoppingBag } from "lucide-react"

export function StatsCounter() {
  const containerRef = useRef<HTMLDivElement>(null)
  const count1Ref = useRef<HTMLSpanElement>(null)
  const count2Ref = useRef<HTMLSpanElement>(null)
  const count3Ref = useRef<HTMLSpanElement>(null)
  const count4Ref = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      // Counter animation
      const obj1 = { val: 0 }
      gsap.to(obj1, {
        val: 25000,
        duration: 2.2,
        ease: "power2.out",
        onUpdate: () => {
          if (count1Ref.current) {
            count1Ref.current.innerText = "+" + Math.floor(obj1.val).toLocaleString("es-PE")
          }
        },
      })

      const obj2 = { val: 0 }
      gsap.to(obj2, {
        val: 99.9,
        duration: 2.5,
        ease: "power2.out",
        onUpdate: () => {
          if (count2Ref.current) {
            count2Ref.current.innerText = obj2.val.toFixed(1) + "%"
          }
        },
      })

      const obj3 = { val: 0 }
      gsap.to(obj3, {
        val: 0.2,
        duration: 2,
        ease: "power2.out",
        onUpdate: () => {
          if (count3Ref.current) {
            count3Ref.current.innerText = "< " + obj3.val.toFixed(1) + "s"
          }
        },
      })

      const obj4 = { val: 0 }
      gsap.to(obj4, {
        val: 0,
        duration: 1.5,
        onUpdate: () => {
          if (count4Ref.current) {
            count4Ref.current.innerText = "S/ " + Math.floor(obj4.val)
          }
        },
      })
    },
    { scope: containerRef }
  )

  const businessTypes = [
    { icon: Store, name: "Bodegas y Minimarkets" },
    { icon: Utensils, name: "Restaurantes y Cafés" },
    { icon: Wrench, name: "Ferreterías y Talleres" },
    { icon: Shirt, name: "Boutiques y Calzado" },
    { icon: Wine, name: "Licorerías y Market" },
    { icon: ShoppingBag, name: "Puestos de Mercado" },
  ]

  return (
    <section ref={containerRef} className="py-10 sm:py-16 md:py-20 border-y border-border/50 bg-card/30 backdrop-blur-sm">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Numbers grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 text-center">
          <div className="space-y-0.5 sm:space-y-1">
            <span
              ref={count1Ref}
              className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-primary font-mono"
            >
              +25,000
            </span>
            <p className="text-[11px] sm:text-sm font-medium text-muted-foreground">
              Pagos Yape Verificados
            </p>
          </div>

          <div className="space-y-0.5 sm:space-y-1">
            <span
              ref={count3Ref}
              className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-emerald-500 font-mono"
            >
              &lt; 0.2s
            </span>
            <p className="text-[11px] sm:text-sm font-medium text-muted-foreground">
              Velocidad de Alerta por Voz
            </p>
          </div>

          <div className="space-y-0.5 sm:space-y-1">
            <span
              ref={count4Ref}
              className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground font-mono"
            >
              S/ 0
            </span>
            <p className="text-[11px] sm:text-sm font-medium text-muted-foreground">
              Pérdidas por Capturas Falsas
            </p>
          </div>

          <div className="space-y-0.5 sm:space-y-1">
            <span
              ref={count2Ref}
              className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-indigo-500 font-mono"
            >
              99.9%
            </span>
            <p className="text-[11px] sm:text-sm font-medium text-muted-foreground">
              Disponibilidad del Sistema
            </p>
          </div>
        </div>

        {/* Business sectors pill list */}
        <div className="mt-8 sm:mt-14 pt-6 sm:pt-10 border-t border-border/40 text-center">
          <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4 sm:mb-6">
            Optimizado para todo tipo de negocio en el Perú
          </p>
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-3">
            {businessTypes.map((biz) => {
              const Icon = biz.icon
              return (
                <div
                  key={biz.name}
                  className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-lg sm:rounded-xl bg-background/80 border border-border/60 text-[11px] sm:text-xs font-medium text-foreground shadow-sm hover:border-primary/40 transition-colors"
                >
                  <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary shrink-0" />
                  <span>{biz.name}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
