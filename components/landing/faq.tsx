"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, HelpCircle } from "lucide-react"

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      q: "¿Necesito darle contraseñas o acceso a mi cuenta bancaria a PagoPing?",
      a: "No, en lo absoluto. PagoPing nunca te pedirá contraseñas, códigos SMS, PIN ni datos bancarios. Solo requiere el permiso estándar de Android para leer las notificaciones emergentes que Yape muestra en la barra de estado de tu teléfono.",
    },
    {
      q: "¿Cómo me protege PagoPing contra las capturas de pantalla falsas?",
      a: "La mayoría de estafas ocurren cuando un cliente muestra una imagen editada en Photoshop o una app falsa en su propio celular. Con PagoPing tú ya no necesitas mirar su pantalla: si el dinero no entró a tu banco, tu parlante no sonará y la transacción no aparecerá en tu panel.",
    },
    {
      q: "¿Qué parlantes Bluetooth son compatibles?",
      a: "Cualquier parlante Bluetooth del mercado (o incluso el altavoz propio de tu celular). Simplemente empareja tu celular Android al parlante del mostrador y el audio sonará automáticamente.",
    },
    {
      q: "¿Mis empleados o cajeros pueden ver el saldo de mi cuenta bancaria?",
      a: "No. Tus empleados solo ven el monto de la venta actual y el nombre del cliente para despachar el producto. Nunca tienen acceso al saldo total de tu cuenta ni a tus movimientos personales.",
    },
    {
      q: "¿Puedo usarlo si tengo iPhone (iOS)?",
      a: "El celular que recibe los Yapes debe ser Android (para poder capturar las notificaciones del sistema). Sin embargo, como dueño puedes revisar el panel de control, ver las ventas en vivo y descargar reportes en Excel desde cualquier iPhone, iPad, Mac o computadora con navegador web.",
    },
    {
      q: "¿Puedo probarlo antes de pagar?",
      a: "¡Sí! El Plan Gratis te permite realizar validaciones de prueba completas para que verifiques la velocidad del audio y la sincronización en tu propio mostrador.",
    },
  ]

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="py-20 md:py-28 relative">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="outline" className="mb-3 px-3 py-1 border-primary/30 bg-primary/10 text-primary font-semibold">
            Resolvemos tus Dudas
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground">
            Preguntas Frecuentes
          </h2>
          <p className="mt-4 text-muted-foreground text-base sm:text-lg">
            Todo lo que necesitas saber antes de implementar PagoPing en tu punto de venta.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div
                key={faq.q}
                className="rounded-2xl border border-border/70 bg-card overflow-hidden transition-all duration-200 hover:border-primary/40"
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 font-bold text-foreground sm:text-lg"
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle className="h-5 w-5 text-primary shrink-0" />
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 text-muted-foreground transition-transform duration-200 shrink-0 ${
                      isOpen ? "rotate-180 text-primary" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-6 pt-0 sm:px-6 sm:pb-6 text-sm sm:text-base text-muted-foreground leading-relaxed border-t border-border/30 mt-1">
                    <p className="pt-3">{faq.a}</p>
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
