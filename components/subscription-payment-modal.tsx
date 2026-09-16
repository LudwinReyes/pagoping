"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle2,
  Copy,
  Loader2,
  Sparkles,
  QrCode,
  ShieldCheck,
  Smartphone,
  ArrowRight,
  RefreshCw,
  Clock,
  AlertCircle
} from "lucide-react"
import type { SubscriptionOrder, GatewayConfig } from "@/lib/types"

interface SubscriptionPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  initialPlanTier?: "basic" | "business" | "enterprise"
  initialAnnual?: boolean
  userEmail: string
  onPaymentSuccess?: () => void
}

export function SubscriptionPaymentModal({
  isOpen,
  onClose,
  initialPlanTier = "business",
  initialAnnual = false,
  userEmail,
  onPaymentSuccess,
}: SubscriptionPaymentModalProps) {
  const [step, setStep] = useState<"select_plan" | "pay_qr" | "success">("select_plan")
  const [selectedTier, setSelectedTier] = useState<"basic" | "business" | "enterprise">(initialPlanTier)
  const [isAnnual, setIsAnnual] = useState(initialAnnual)
  const [gatewayConfig, setGatewayConfig] = useState<GatewayConfig | null>(null)
  const [order, setOrder] = useState<SubscriptionOrder | null>(null)
  const [operationCode, setOperationCode] = useState("")
  const [isLoadingOrder, setIsLoadingOrder] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [verifyError, setVerifyError] = useState<string | null>(null)
  const [successData, setSuccessData] = useState<{ planName: string; newEndsAt: string } | null>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  // Load gateway config on mount
  useEffect(() => {
    if (!isOpen) return
    const fetchConfig = async () => {
      try {
        const res = await fetch("/api/gateway/config")
        if (res.ok) {
          const data = await res.json()
          setGatewayConfig(data)
        }
      } catch (err) {
        console.error("Error loading gateway config:", err)
      }
    }
    fetchConfig()
  }, [isOpen])

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setStep("select_plan")
      setSelectedTier(initialPlanTier)
      setIsAnnual(initialAnnual)
      setOrder(null)
      setOperationCode("")
      setVerifyError(null)
      setSuccessData(null)
    }
  }, [isOpen, initialPlanTier, initialAnnual])

  // Listen to Supabase Realtime for order completion
  useEffect(() => {
    if (!order?.id || step !== "pay_qr") return

    const supabase = createClient()
    const channel = supabase
      .channel(`order-${order.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "subscription_orders",
          filter: `id=eq.${order.id}`,
        },
        (payload) => {
          const updated = payload.new as SubscriptionOrder
          if (updated.status === "completed") {
            handleOrderCompleted(updated)
          }
        }
      )
      .subscribe()

    // Polling fallback every 4 seconds
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/gateway/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: order.id }),
        })
        if (res.ok) {
          const data = await res.json()
          if (data.success) {
            handleOrderCompleted(order, data.new_ends_at)
          }
        }
      } catch {
        // ignore polling errors
      }
    }, 4000)

    return () => {
      supabase.removeChannel(channel)
      clearInterval(interval)
    }
  }, [order?.id, step])

  const handleOrderCompleted = (completedOrder: SubscriptionOrder, newEndsAt?: string) => {
    const planName = completedOrder.plan_tier === "basic"
      ? "Básico"
      : completedOrder.plan_tier === "business"
      ? "Negocio"
      : "Empresa"
    setSuccessData({
      planName,
      newEndsAt: newEndsAt || completedOrder.completed_at || new Date().toISOString(),
    })
    setStep("success")
    if (onPaymentSuccess) {
      onPaymentSuccess()
    }
  }

  const handleCreateOrder = async () => {
    setIsLoadingOrder(true)
    setVerifyError(null)
    try {
      const res = await fetch("/api/gateway/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planTier: selectedTier,
          billingCycle: isAnnual ? "annual" : "monthly",
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.order) {
        throw new Error(data.error || "No se pudo crear la orden")
      }

      setOrder(data.order)
      setStep("pay_qr")
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Error al procesar la orden"
      setVerifyError(errorMsg)
    } finally {
      setIsLoadingOrder(false)
    }
  }

  const handleManualVerify = async () => {
    if (!order?.id) return
    setIsVerifying(true)
    setVerifyError(null)

    try {
      const res = await fetch("/api/gateway/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          operationCode: operationCode.trim(),
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Aún no se detecta el pago en Yape.")
      }

      handleOrderCompleted(order, data.new_ends_at)
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Error al verificar el pago"
      setVerifyError(errorMsg)
    } finally {
      setIsVerifying(false)
    }
  }

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const plans = [
    {
      id: "basic" as const,
      name: "Básico",
      desc: "1 dispositivo conectado, validaciones ilimitadas.",
      monthly: 15,
      annual: 156, // S/ 13/mes
    },
    {
      id: "business" as const,
      name: "Negocio",
      desc: "Hasta 4 dispositivos (Multicaja), voz en todos los celulares.",
      monthly: 30,
      annual: 300, // S/ 25/mes
      popular: true,
    },
    {
      id: "enterprise" as const,
      name: "Empresa",
      desc: "Hasta 8 dispositivos, soporte VIP y dashboard multi-local.",
      monthly: 60,
      annual: 600, // S/ 50/mes
    },
  ]

  const activePlanInfo = plans.find((p) => p.id === selectedTier) || plans[1]
  const currentPrice = isAnnual ? activePlanInfo.annual : activePlanInfo.monthly

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-lg p-0 overflow-hidden border-border/60">
        {step === "select_plan" && (
          <div className="p-6 space-y-6">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <DialogTitle className="text-xl font-bold">Elige tu Plan PagoPing</DialogTitle>
              </div>
              <DialogDescription>
                Activa tu suscripción en minutos pagando directamente con Yape.
              </DialogDescription>
            </DialogHeader>

            {/* Selector de ciclo Mensual / Anual */}
            <div className="flex items-center justify-center p-1 bg-muted/60 rounded-xl border border-border/50">
              <button
                type="button"
                onClick={() => setIsAnnual(false)}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                  !isAnnual
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Facturación Mensual
              </button>
              <button
                type="button"
                onClick={() => setIsAnnual(true)}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  isAnnual
                    ? "bg-background text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span>Pago Anual</span>
                <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold">
                  Ahorra 13%
                </span>
              </button>
            </div>

            {/* Opciones de planes */}
            <div className="space-y-3">
              {plans.map((plan) => {
                const isSelected = selectedTier === plan.id
                const price = isAnnual ? plan.annual : plan.monthly
                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedTier(plan.id)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border/60 hover:border-border bg-card"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground">{plan.name}</span>
                        {plan.popular && (
                          <Badge variant="default" className="text-[10px] h-5 bg-primary text-primary-foreground">
                            MÁS POPULAR
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground max-w-[240px] sm:max-w-xs">{plan.desc}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-black text-foreground">S/ {price}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {isAnnual ? "/ año completo" : "/ mes"}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {verifyError && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{verifyError}</span>
              </div>
            )}

            <Button
              onClick={handleCreateOrder}
              disabled={isLoadingOrder}
              className="w-full h-12 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isLoadingOrder ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generando QR de Pago...
                </>
              ) : (
                <>
                  Continuar a Pago con Yape (S/ {currentPrice})
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        )}

        {step === "pay_qr" && order && (
          <div className="p-6 space-y-5">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-primary" />
                  <DialogTitle className="text-lg font-bold">Escanea y Paga con Yape</DialogTitle>
                </div>
                <Badge variant="outline" className="text-xs font-semibold">
                  {order.plan_tier.toUpperCase()} • {order.billing_cycle === "annual" ? "ANUAL" : "MENSUAL"}
                </Badge>
              </div>
              <DialogDescription className="text-xs">
                Yapea el monto exacto al código QR o al número oficial del administrador.
              </DialogDescription>
            </DialogHeader>

            {/* Tarjeta del Monto a Pagar */}
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-between">
              <div>
                <span className="text-xs text-muted-foreground font-medium">Monto a Yapear:</span>
                <div className="text-2xl font-black text-primary">S/ {order.amount.toFixed(2)}</div>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Radar PagoPing Activo
              </div>
            </div>

            {/* Imagen del QR y Datos de Yape */}
            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border/50">
              <div className="w-40 h-40 bg-white p-2 rounded-xl shadow-sm border border-border/40 flex items-center justify-center flex-shrink-0">
                {gatewayConfig?.admin_qr_url ? (
                  <img
                    src={gatewayConfig.admin_qr_url}
                    alt="QR Yape PagoPing"
                    className="w-full h-full object-contain rounded-lg"
                  />
                ) : (
                  <div className="text-center p-2">
                    <QrCode className="w-12 h-12 text-muted-foreground mx-auto mb-1 opacity-50" />
                    <span className="text-[10px] text-muted-foreground">QR no disponible</span>
                  </div>
                )}
              </div>

              <div className="space-y-2.5 text-xs w-full">
                <div>
                  <span className="text-muted-foreground font-medium">Titular de Yape:</span>
                  <div className="font-bold text-foreground text-sm">
                    {gatewayConfig?.admin_yape_name || "Ludwin Roy Reyes"}
                  </div>
                </div>

                <div>
                  <span className="text-muted-foreground font-medium">Número de Celular:</span>
                  <div className="flex items-center justify-between gap-2 mt-0.5">
                    <span className="font-mono font-bold text-foreground text-sm">
                      {gatewayConfig?.admin_yape_phone || "900461720"}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs"
                      onClick={() => copyToClipboard(gatewayConfig?.admin_yape_phone || "900461720", "phone")}
                    >
                      {copiedField === "phone" ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span className="ml-1">{copiedField === "phone" ? "Copiado" : "Copiar"}</span>
                    </Button>
                  </div>
                </div>

                <div className="pt-1 text-[11px] text-muted-foreground flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>Tu plan se activará en cuanto el pago llegue a nuestro Yape.</span>
                </div>
              </div>
            </div>

            {/* Entrada opcional de código de operación para validación manual instantánea */}
            <div className="space-y-2 pt-1 border-t border-border/40">
              <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                <span>¿Ya realizaste el Yapeo? Ingresa tu N° de Operación:</span>
                <span className="text-[11px] text-muted-foreground font-normal">(opcional)</span>
              </label>
              <div className="flex gap-2">
                <Input
                  value={operationCode}
                  onChange={(e) => setOperationCode(e.target.value)}
                  placeholder="Ej: 839201"
                  className="h-10 text-sm font-mono"
                  maxLength={12}
                />
                <Button
                  onClick={handleManualVerify}
                  disabled={isVerifying}
                  className="h-10 px-4 font-bold bg-primary hover:bg-primary/90 text-primary-foreground flex-shrink-0"
                >
                  {isVerifying ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Verificar Pago"
                  )}
                </Button>
              </div>
              <p className="text-[11px] text-muted-foreground">
                El número de operación se encuentra en la constancia que Yape te muestra al terminar el pago.
              </p>
            </div>

            {verifyError && (
              <div className="p-2.5 rounded-lg bg-destructive/10 text-destructive text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{verifyError}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep("select_plan")}
                className="text-xs text-muted-foreground"
              >
                Volver a planes
              </Button>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                <span>Esperando confirmación...</span>
              </div>
            </div>
          </div>
        )}

        {step === "success" && successData && (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <DialogTitle className="text-2xl font-black text-foreground">
                ¡Pago Confirmado! 🎉
              </DialogTitle>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Tu suscripción al <strong>Plan {successData.planName}</strong> ha sido activada exitosamente con validaciones ilimitadas.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-muted/40 border border-border/50 text-xs space-y-1 text-muted-foreground">
              <div>Fecha de vencimiento:</div>
              <div className="text-base font-bold text-foreground">
                {new Date(successData.newEndsAt).toLocaleDateString("es-PE", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
            </div>

            <Button
              onClick={onClose}
              className="w-full h-11 font-bold bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Ir a mi Dashboard
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
