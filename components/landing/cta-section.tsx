"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Download, Sparkles, CheckCircle2, ShieldCheck } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="relative rounded-[2.5rem] overflow-hidden p-8 sm:p-14 md:p-16 border border-primary/30 bg-gradient-to-tr from-purple-950/90 via-primary/30 to-indigo-950/80 text-white shadow-2xl shadow-primary/20 text-center">
          {/* Decorative ambient blurred blobs */}
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-indigo-500/30 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-purple-200 text-xs font-semibold mb-6">
              <Sparkles className="h-3.5 w-3.5 text-yellow-300 fill-yellow-300" />
              <span>Configuración rápida en menos de 2 minutos</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Protege tu negocio hoy y no pierdas ni un solo sol
            </h2>

            <p className="mt-5 text-base sm:text-lg text-purple-100/90 leading-relaxed max-w-xl mx-auto">
              Únete a cientos de negocios peruanos que ya cobran de forma segura, rápida y sin depender de mirar el celular.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                asChild
                className="w-full sm:w-auto h-13 px-8 text-base font-bold bg-white text-purple-950 hover:bg-white/90 shadow-xl shadow-black/20 rounded-xl transition-all duration-300 hover:scale-105"
              >
                <Link href="/auth/sign-up">
                  Crear Cuenta Gratis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                asChild
                className="w-full sm:w-auto h-13 px-7 text-base font-medium rounded-xl border-white/30 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all duration-300 hover:scale-105"
              >
                <Link href="/app-release.apk" target="_blank" download>
                  <Download className="mr-2 h-5 w-5" />
                  Descargar APK Directo
                </Link>
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-purple-200/90">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Prueba sin tarjeta
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Cancelación libre
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Soporte en Perú
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
