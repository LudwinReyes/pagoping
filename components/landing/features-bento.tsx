"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Volume2,
  ShieldCheck,
  Smartphone,
  FileSpreadsheet,
  Lock,
  Zap,
  CheckCircle,
  Radio,
  ArrowUpRight
} from "lucide-react"

export function FeaturesBento() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <section id="caracteristicas" ref={containerRef} className="py-14 sm:py-20 md:py-28 relative">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
          <Badge variant="outline" className="mb-3 px-3 py-1 border-primary/30 bg-primary/10 text-primary font-semibold text-xs">
            Tecnología Diseñada para Comercios
          </Badge>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground text-balance">
            Todo lo que necesitas para vender con{" "}
            <span className="bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
              total tranquilidad
            </span>
          </h2>
          <p className="mt-3 sm:mt-4 text-muted-foreground text-sm sm:text-lg text-balance">
            Olvídate de mirar el celular a cada minuto o dudar si la captura de pantalla que te muestra el cliente es real.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid md:grid-cols-3 gap-5 sm:gap-6">
          {/* Bento Item 1 (Wide): Voice TTS */}
          <Card className="md:col-span-2 relative overflow-hidden border-border/80 bg-gradient-to-br from-card via-card to-primary/5 hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-xl group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/20 transition-all" />
            <CardHeader className="p-4 sm:p-6 pb-3 sm:pb-4">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary shadow-inner">
                  <Volume2 className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <Badge variant="secondary" className="font-semibold text-[11px] sm:text-xs text-primary">
                  Sin mirar la pantalla
                </Badge>
              </div>
              <CardTitle className="text-xl sm:text-2xl font-bold mt-3 sm:mt-4 text-foreground">
                Alerta por Voz TTS Instantánea
              </CardTitle>
              <CardDescription className="text-xs sm:text-base text-muted-foreground">
                Conecta tu celular a un parlante Bluetooth en el mostrador o déjalo en altavoz. Cada vez que un cliente yapea, PagoPing canta el monto y el nombre en voz alta.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 sm:pt-2">
              <div className="rounded-xl sm:rounded-2xl bg-muted/60 border border-border/60 p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-primary text-white shrink-0">
                    <Radio className="h-4 w-4 sm:h-5 sm:w-5 animate-pulse" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Parlante Caja Principal</p>
                    <p className="text-[10px] sm:text-[11px] text-muted-foreground">Volumen inteligente optimizado para tiendas</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px] sm:text-xs border border-emerald-500/20 shrink-0">
                  <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  Listo para Bluetooth
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bento Item 2: Anti Fraud Shield */}
          <Card className="relative overflow-hidden border-border/80 bg-gradient-to-br from-card via-card to-emerald-500/5 hover:border-emerald-500/50 transition-all duration-300 shadow-sm hover:shadow-xl group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/20 transition-all" />
            <CardHeader className="p-4 sm:p-6 pb-3 sm:pb-4">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shadow-inner">
                  <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <Badge variant="secondary" className="font-semibold text-[11px] sm:text-xs text-emerald-600 dark:text-emerald-400">
                  Protección 100%
                </Badge>
              </div>
              <CardTitle className="text-lg sm:text-xl font-bold mt-3 sm:mt-4 text-foreground">
                Escudo Anti-Vouchers Falsos
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm text-muted-foreground">
                Detecta y bloquea intentos de pago con capturas viejas o comprobantes alterados con Photoshop o apps falsas de Yape.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 sm:pt-2">
              <div className="space-y-1.5 sm:space-y-2 text-xs text-muted-foreground pt-1">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="truncate">Validación de código de operación (OP)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="truncate">Hash único anti-duplicados</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="truncate">Cero pérdidas por estafas en mostrador</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bento Item 3: Multi-device */}
          <Card className="relative overflow-hidden border-border/80 bg-gradient-to-br from-card via-card to-blue-500/5 hover:border-blue-500/50 transition-all duration-300 shadow-sm hover:shadow-xl group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/20 transition-all" />
            <CardHeader className="p-4 sm:p-6 pb-3 sm:pb-4">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-500 shadow-inner">
                  <Smartphone className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <Badge variant="secondary" className="font-semibold text-[11px] sm:text-xs text-blue-500">
                  Multidispositivo
                </Badge>
              </div>
              <CardTitle className="text-lg sm:text-xl font-bold mt-3 sm:mt-4 text-foreground">
                Múltiples Celulares y Cajas
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm text-muted-foreground">
                Sincroniza hasta 3 teléfonos al mismo tiempo. El dueño puede ver las ventas desde casa mientras los empleados atienden en el local.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 sm:pt-2">
              <div className="rounded-xl bg-muted/60 p-2.5 sm:p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-0 text-xs font-semibold">
                <span className="text-muted-foreground">Modo Dueño + Empleado</span>
                <span className="text-blue-500">Enlace por Token</span>
              </div>
            </CardContent>
          </Card>

          {/* Bento Item 4: Excel & Reports */}
          <Card className="relative overflow-hidden border-border/80 bg-gradient-to-br from-card via-card to-amber-500/5 hover:border-amber-500/50 transition-all duration-300 shadow-sm hover:shadow-xl group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/20 transition-all" />
            <CardHeader className="p-4 sm:p-6 pb-3 sm:pb-4">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-500 shadow-inner">
                  <FileSpreadsheet className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <Badge variant="secondary" className="font-semibold text-[11px] sm:text-xs text-amber-500">
                  1 Clic
                </Badge>
              </div>
              <CardTitle className="text-lg sm:text-xl font-bold mt-3 sm:mt-4 text-foreground">
                Cuadre de Caja y Excel
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm text-muted-foreground">
                Exporta todas las transacciones del día, semana o mes con fecha, hora, nombre y número de operación en formato Excel o CSV.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 sm:pt-2">
              <div className="rounded-xl bg-muted/60 p-2.5 sm:p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-0 text-xs font-semibold">
                <span className="text-muted-foreground">Ahorra 1 hora diaria</span>
                <span className="text-amber-500">Cero errores de cálculo</span>
              </div>
            </CardContent>
          </Card>

          {/* Bento Item 5: Privacy & Security */}
          <Card className="relative overflow-hidden border-border/80 bg-gradient-to-br from-card via-card to-purple-500/5 hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-xl group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/20 transition-all" />
            <CardHeader className="p-4 sm:p-6 pb-3 sm:pb-4">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-purple-500/15 text-primary shadow-inner">
                  <Lock className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <Badge variant="secondary" className="font-semibold text-[11px] sm:text-xs text-primary">
                  100% No Intrusivo
                </Badge>
              </div>
              <CardTitle className="text-lg sm:text-xl font-bold mt-3 sm:mt-4 text-foreground">
                Sin Claves Bancarias
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm text-muted-foreground">
                PagoPing nunca te solicitará contraseñas, PIN ni tokens de seguridad. Solo lee el texto de la notificación que Yape muestra en tu pantalla.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 sm:pt-2">
              <div className="rounded-xl bg-muted/60 p-2.5 sm:p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-0 text-xs font-semibold">
                <span className="text-muted-foreground">Cifrado punto a punto</span>
                <span className="text-emerald-500">PostgreSQL Seguro</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
