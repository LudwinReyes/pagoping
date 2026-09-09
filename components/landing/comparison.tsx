"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { XCircle, CheckCircle2, AlertOctagon, Sparkles, ArrowRight } from "lucide-react"

export function Comparison() {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="outline" className="mb-3 px-3 py-1 border-primary/30 bg-primary/10 text-primary font-semibold">
            Comparativa Real en Mostrador
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground">
            ¿Por qué los comercios cambian a{" "}
            <span className="bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
              PagoPing?
            </span>
          </h2>
          <p className="mt-4 text-muted-foreground text-base sm:text-lg">
            Mira la diferencia entre atender a ciegas y atender con confirmación por voz en tiempo real.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          {/* Card: Sin PagoPing */}
          <Card className="border-rose-500/30 bg-rose-950/5 dark:bg-rose-950/10 shadow-lg relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 left-0 w-full h-1 bg-rose-500/80" />
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="border-rose-500/40 text-rose-600 dark:text-rose-400 bg-rose-500/10">
                  <AlertOctagon className="h-3 w-3 mr-1" />
                  Método Tradicional
                </Badge>
                <span className="text-xs font-semibold text-rose-500">Pérdida de dinero y tiempo</span>
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">
                Sin PagoPing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground flex-1">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-background/60 border border-rose-500/20">
                <XCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                <p>
                  <strong>Capturas de pantalla engañosas:</strong> El cliente te muestra el celular de lejos diciendo que ya yapeó, y no puedes verificarlo sin interrumpir.
                </p>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-background/60 border border-rose-500/20">
                <XCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                <p>
                  <strong>Interrupción constante:</strong> Tus cajeros o meseros tienen que llamar al dueño por teléfono a cada rato para preguntar: <em>"¿Te llegó el Yape?"</em>.
                </p>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-background/60 border border-rose-500/20">
                <XCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                <p>
                  <strong>Filas lentas en caja:</strong> Abrir la app bancaria para revisar el saldo demora hasta 1 minuto por cliente, ralentizando tu atención.
                </p>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-background/60 border border-rose-500/20">
                <XCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                <p>
                  <strong>Cuadre de caja manual y tedioso:</strong> Al cerrar el día, tienes que contar comprobante por comprobante a mano en un cuaderno.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Card: Con PagoPing */}
          <Card className="border-emerald-500/40 bg-emerald-950/5 dark:bg-emerald-950/10 shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" />
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Con PagoPing Activo
                </Badge>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">100% Automatizado</span>
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">
                Con PagoPing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground flex-1">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-background/60 border border-emerald-500/25">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <p>
                  <strong>Anuncio inmediato por voz:</strong> El parlante canta: <em>"¡Pago de 45 soles recibido de Juan!"</em> en menos de 1 segundo.
                </p>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-background/60 border border-emerald-500/25">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <p>
                  <strong>Autonomía para tus empleados:</strong> Cada caja tiene su tablet o celular visor donde ve los pagos entrar en vivo sin molestar al dueño.
                </p>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-background/60 border border-emerald-500/25">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <p>
                  <strong>Escudo anti-fraude algorítmico:</strong> Compara códigos de operación para evitar que te reutilicen el mismo voucher dos veces.
                </p>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-background/60 border border-emerald-500/25">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <p>
                  <strong>Exportación a Excel en 1 segundo:</strong> Todas las ventas quedan ordenadas con fecha, hora, monto y cajero para cuadre automático.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
