"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  QrCode,
  Upload,
  CheckCircle2,
  Clock,
  RefreshCw,
  Phone,
  User,
  Mail,
  Receipt,
  Sparkles,
  AlertCircle
} from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import type { SubscriptionOrder, GatewayConfig } from "@/lib/types"

export function AdminGatewayManager() {
  const [config, setConfig] = useState<GatewayConfig | null>(null)
  const [orders, setOrders] = useState<SubscriptionOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const res = await fetch("/api/admin/gateway-settings")
      if (res.ok) {
        const data = await res.json()
        setConfig(data.settings)
        setOrders(data.orders || [])
        setName(data.settings.admin_yape_name || "")
        setPhone(data.settings.admin_yape_phone || "")
        setEmail(data.settings.admin_yape_email || "")
        setPreviewUrl(data.settings.admin_qr_url || "/api/gateway/qr-image")
      }
    } catch (err) {
      console.error("Error fetching gateway settings:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setStatusMessage(null)

    try {
      const formData = new FormData()
      formData.append("admin_yape_name", name)
      formData.append("admin_yape_phone", phone)
      formData.append("admin_yape_email", email)
      if (selectedFile) {
        formData.append("qr_file", selectedFile)
      }

      const res = await fetch("/api/admin/gateway-settings", {
        method: "POST",
        body: formData,
      })

      if (res.ok) {
        const data = await res.json()
        setConfig(data.settings)
        if (data.settings.admin_qr_url) {
          setPreviewUrl(data.settings.admin_qr_url)
        }
        setSelectedFile(null)
        setStatusMessage({ type: "success", text: "¡Configuración de pasarela guardada correctamente!" })
      } else {
        const err = await res.json()
        setStatusMessage({ type: "error", text: err.error || "Error al guardar" })
      }
    } catch (err) {
      console.error("Error updating gateway settings:", err)
      setStatusMessage({ type: "error", text: "Error de conexión al servidor" })
    } finally {
      setIsSaving(false)
    }
  }

  const getOrderStatusBadge = (status: SubscriptionOrder["status"]) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 gap-1 font-medium">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Activado
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 gap-1 font-medium">
            <Clock className="w-3 h-3 text-amber-600 animate-spin" />
            Pendiente
          </Badge>
        )
      case "expired":
        return (
          <Badge variant="outline" className="text-gray-500 border-gray-200">
            Expirado
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form & Info */}
        <Card className="lg:col-span-2 border-0 shadow-sm bg-white dark:bg-slate-800">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                    Pasarela Yape Personal (Admin)
                  </CardTitle>
                  <CardDescription className="text-slate-500">
                    Configura tu QR y datos de Yape para que los clientes te paguen y activen sus planes automáticamente.
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchData}
                disabled={isLoading}
                className="rounded-xl gap-1.5 text-xs text-slate-600 dark:text-slate-300"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
                Actualizar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {statusMessage && (
              <div
                className={`mb-4 p-3.5 rounded-xl text-sm flex items-center gap-2 ${
                  statusMessage.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                    : "bg-red-50 text-red-800 border border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800"
                }`}
              >
                {statusMessage.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                )}
                <span>{statusMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-purple-600" />
                    Nombre del Titular Yape
                  </label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ludwin Roy Reyes"
                    required
                    className="rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-purple-600" />
                    Número Yape (Celular)
                  </label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="900461720"
                    required
                    className="rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-purple-600" />
                  Correo Vinculado al Yape / BCP (Donde llegan las notificaciones de pago)
                </label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ludwinrey.s@gmail.com"
                  required
                  className="rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-sm"
                />
                <p className="text-[11px] text-slate-500">
                  Importante: Cuando un cliente yapea, el sistema lee el correo BCP de esta cuenta para validar el monto y activar el plan al instante.
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl px-5 text-sm font-semibold shadow-sm"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Guardar Cambios de Pasarela
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Right 1 Col: QR Preview & Upload */}
        <Card className="border-0 shadow-sm bg-white dark:bg-slate-800 flex flex-col justify-between">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <QrCode className="w-4 h-4 text-purple-600" />
              Código QR de Yape
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Este QR se muestra a los clientes al renovar o comprar un plan.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-4 pb-6">
            <div className="w-44 h-44 rounded-2xl border-2 border-dashed border-purple-200 dark:border-purple-800/60 bg-purple-50/50 dark:bg-purple-950/20 p-2 flex items-center justify-center overflow-hidden relative group">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="QR Yape Admin"
                  onError={() => setPreviewUrl("/api/gateway/qr-image")}
                  className="w-full h-full object-contain rounded-xl"
                />
              ) : (
                <div className="text-center p-3 text-slate-400">
                  <QrCode className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="text-xs font-medium">Sin QR subido</p>
                </div>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-xl border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-800 dark:text-purple-300 text-xs font-semibold gap-2 w-full max-w-[200px]"
            >
              <Upload className="w-3.5 h-3.5" />
              {selectedFile ? "Cambiar Imagen" : "Subir Nuevo QR"}
            </Button>
            {selectedFile && (
              <p className="text-[11px] text-emerald-600 font-medium">
                Seleccionado: {selectedFile.name} (haz clic en Guardar)
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Orders Monitoring Table */}
      <Card className="border-0 shadow-sm bg-white dark:bg-slate-800">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Receipt className="w-5 h-5 text-purple-600" />
                Órdenes de Pago de Suscripciones (Pasarela)
              </CardTitle>
              <CardDescription className="text-slate-500 text-xs sm:text-sm">
                Registro de intentos de pago y planes activados automáticamente por el sistema.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Autovalidación activa
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {orders.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <Receipt className="w-10 h-10 mx-auto mb-2 opacity-30 text-slate-400" />
              <p className="text-sm font-medium">Aún no hay órdenes de suscripción registradas</p>
              <p className="text-xs text-slate-400 mt-1">
                Cuando un cliente seleccione un plan y pague por Yape, aparecerá aquí.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-y border-slate-100 dark:border-slate-700/60 bg-slate-50/70 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                    <th className="py-3 px-4">Fecha / Hora</th>
                    <th className="py-3 px-4">Cliente</th>
                    <th className="py-3 px-4">Plan & Ciclo</th>
                    <th className="py-3 px-4">Monto</th>
                    <th className="py-3 px-4">Cód. Operación</th>
                    <th className="py-3 px-4">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/40">
                  {orders.map((order) => {
                    const planName = {
                      free: "Gratis",
                      basic: "Básico",
                      business: "Negocio",
                      enterprise: "Empresa",
                      annual: "Negocio Anual",
                    }[order.plan_tier] || order.plan_tier

                    const cycleLabel = order.billing_cycle === "annual" ? "Anual (12m)" : "Mensual"

                    return (
                      <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors">
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                          {format(new Date(order.created_at), "dd/MM/yyyy HH:mm", { locale: es })}
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">
                          {order.user_email}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-purple-700 dark:text-purple-300">
                            {planName}
                          </span>{" "}
                          <span className="text-[11px] text-slate-500">({cycleLabel})</span>
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                          S/ {Number(order.amount).toFixed(2)}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400">
                          {order.operation_code || (
                            <span className="text-slate-400 text-xs italic">Autodetectando...</span>
                          )}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {getOrderStatusBadge(order.status)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
