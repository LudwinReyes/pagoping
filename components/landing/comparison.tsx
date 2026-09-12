"use client"

import { useRef, useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { XCircle, CheckCircle2, AlertOctagon, Sparkles } from "lucide-react"

export function Comparison() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el || !("IntersectionObserver" in window)) {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={containerRef} className="py-14 sm:py-20 md:py-28 relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className={`text-center max-w-2xl mx-auto mb-10 sm:mb-16 transition-all duration-500 ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}>
          <Badge variant="outline" className="mb-3 px-3 py-1 border-primary/30 bg-primary/10 text-primary font-semibold text-xs">
            Comparativa Real en Mostrador
          </Badge>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground text-balance">
            ¿Por qué los comercios cambian a{" "}
            <span className="bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
              PagoPing?
            </span>
          </h2>
          <p className="mt-3 sm:mt-4 text-muted-foreground text-sm sm:text-lg text-balance">
            Mira la diferencia entre atender a ciegas y atender con confirmación por voz en tiempo real.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5 sm:gap-8 items-stretch">
          {/* Card: Sin PagoPing */}
          <Card className={`border-rose-500/30 bg-rose-950/5 dark:bg-rose-950/10 shadow-lg relative overflow-hidden flex flex-col justify-between rounded-2xl sm:rounded-3xl transition-all duration-500 delay-75 gpu-layer ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}>
            <div className="absolute top-0 left-0 w-full h-1 bg-rose-500/80" />
            <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2">
                <Badge variant="outline" className="border-rose-500/40 text-rose-600 dark:text-rose-400 bg-rose-500/10 w-fit text-xs">
                  <AlertOctagon className="h-3 w-3 mr-1" />
                  Método Tradicional
                </Badge>
                <span className="text-[11px] sm:text-xs font-semibold text-rose-500">Pérdida de dinero y tiempo</span>
              </div>
              <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">
                Sin PagoPing
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 space-y-3 sm:space-y-4 text-xs sm:text-sm text-muted-foreground flex-1">
              <div className="flex items-start gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-background/60 border border-rose-500/20">
                <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-rose-500 shrink-0 mt-0.5" />
                <p>
                  <strong>Capturas engañosas:</strong> El cliente te muestra el celular de lejos diciendo que ya yapeó, y no puedes verificarlo sin interrumpir.
                </p>
              </div>

              <div className="flex items-start gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-background/60 border border-rose-500/20">
                <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-rose-500 shrink-0 mt-0.5" />
                <p>
                  <strong>Interrupción constante:</strong> Tus cajeros o meseros tienen que llamar al dueño por teléfono a cada rato para preguntar: <em>&ldquo;¿Te llegó el Yape?&rdquo;</em>.
                </p>
              </div>

              <div className="flex items-start gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-background/60 border border-rose-500/20">
                <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-rose-500 shrink-0 mt-0.5" />
                <p>
                  <strong>Filas lentas en caja:</strong> Abrir la app bancaria para revisar el saldo demora hasta 1 minuto por cliente, ralentizando tu atención.
                </p>
              </div>

              <div className="flex items-start gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-background/60 border border-rose-500/20">
                <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-rose-500 shrink-0 mt-0.5" />
                <p>
                  <strong>Cuadre manual y tedioso:</strong> Al cerrar el día, tienes que contar comprobante por comprobante a mano en un cuaderno.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Card: Con PagoPing */}
          <Card className={`border-emerald-500/40 bg-emerald-950/5 dark:bg-emerald-950/10 shadow-xl relative overflow-hidden flex flex-col justify-between rounded-2xl sm:rounded-3xl transition-all duration-500 delay-150 gpu-layer ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}>
            <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" />
            <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2">
                <Badge variant="outline" className="border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 w-fit text-xs">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Con PagoPing Activo
                </Badge>
                <span className="text-[11px] sm:text-xs font-semibold text-emerald-600 dark:text-emerald-400">100% Automatizado</span>
              </div>
              <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">
                Con PagoPing
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 space-y-3 sm:space-y-4 text-xs sm:text-sm text-muted-foreground flex-1">
              <div className="flex items-start gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-background/60 border border-emerald-500/25">
                <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500 shrink-0 mt-0.5" />
                <p>
                  <strong>Anuncio inmediato por voz:</strong> El parlante canta: <em>&ldquo;¡Pago de 45 soles recibido de Juan!&rdquo;</em> en menos de 1 segundo.
                </p>
              </div>

              <div className="flex items-start gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-background/60 border border-emerald-500/25">
                <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500 shrink-0 mt-0.5" />
                <p>
                  <strong>Autonomía para empleados:</strong> Cada caja tiene su tablet o celular visor donde ve los pagos entrar en vivo sin molestar al dueño.
                </p>
              </div>

              <div className="flex items-start gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-background/60 border border-emerald-500/25">
                <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500 shrink-0 mt-0.5" />
                <p>
                  <strong>Escudo anti-fraude:</strong> Compara códigos de operación para evitar que te reutilicen el mismo voucher dos veces.
                </p>
              </div>

              <div className="flex items-start gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-background/60 border border-emerald-500/25">
                <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500 shrink-0 mt-0.5" />
                <p>
                  <strong>Exportación a Excel en 1 clic:</strong> Todas las ventas quedan ordenadas con fecha, hora, monto y cajero para cuadre automático.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
