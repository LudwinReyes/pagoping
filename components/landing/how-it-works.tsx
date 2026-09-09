"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Smartphone, QrCode, Volume2, ArrowRight, Download, HelpCircle } from "lucide-react"

export function HowItWorks() {
  const steps = [
    {
      step: "01",
      icon: Smartphone,
      title: "Instala la App en tu Android",
      desc: "Descarga el APK oficial de PagoPing y activa el permiso de lectura de notificaciones en tu celular.",
      badge: "Toma 1 minuto",
    },
    {
      step: "02",
      icon: QrCode,
      title: "Vincula tu Negocio con QR",
      desc: "Escanea el código QR de vinculación desde la app para conectar tus cajas con el panel central.",
      badge: "Sin contraseñas de banco",
    },
    {
      step: "03",
      icon: Volume2,
      title: "Recibe Pagos y Escúchalos",
      desc: "¡Eso es todo! Conecta un parlante Bluetooth o usa el altavoz: cada Yape sonará fuerte y claro.",
      badge: "100% Automático",
    },
  ]

  return (
    <section id="como-funciona" className="py-20 md:py-28 relative">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="outline" className="mb-3 px-3 py-1 border-primary/30 bg-primary/10 text-primary font-semibold">
            Puesta en Marcha Rápida
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground">
            Empieza a operar en{" "}
            <span className="bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
              3 simples pasos
            </span>
          </h2>
          <p className="mt-4 text-muted-foreground text-base sm:text-lg">
            No necesitas ser programador ni comprar hardware costoso. Funciona con cualquier celular Android.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {steps.map((item, index) => {
            const Icon = item.icon
            return (
              <div
                key={item.step}
                className="relative rounded-3xl border border-border/70 bg-card p-8 shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Step number badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary/20 via-purple-500/20 to-indigo-500/20 text-primary font-black text-xl group-hover:scale-110 transition-transform">
                    <Icon className="h-7 w-7" />
                  </div>
                  <span className="font-mono text-3xl font-black text-muted-foreground/30">
                    {item.step}
                  </span>
                </div>

                <div>
                  <Badge variant="secondary" className="mb-3 text-[11px] font-semibold text-primary">
                    {item.badge}
                  </Badge>
                  <h3 className="text-xl font-bold text-foreground mb-2.5">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                {index === 0 && (
                  <div className="mt-6 pt-4 border-t border-border/40">
                    <Button size="sm" variant="outline" asChild className="w-full text-xs font-semibold">
                      <Link href="/app-release.apk" target="_blank" download>
                        <Download className="mr-1.5 h-3.5 w-3.5 text-primary" />
                        Descargar APK Android
                      </Link>
                    </Button>
                  </div>
                )}

                {index === 1 && (
                  <div className="mt-6 pt-4 border-t border-border/40 text-center">
                    <Link href="/instalacion" className="text-xs text-primary font-medium hover:underline flex items-center justify-center gap-1">
                      <HelpCircle className="h-3.5 w-3.5" />
                      Ver guía con capturas
                    </Link>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
