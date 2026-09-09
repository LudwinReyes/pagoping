"use client"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/client"
import { useRouter } from "next/navigation"
import type { Subscription, Payment, Device } from "@/lib/types"
import { PLAN_CONFIG } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DollarSign,
  Volume2,
  VolumeX,
  Download,
  Lock,
  Smartphone,
  LogOut,
  AlertCircle,
  Clock,
  MessageCircle,
  RefreshCw,
  Trash2,
  UserPlus,
  Loader2,
  TrendingUp,
  Users,
} from "lucide-react"
import { format, formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import QRCode from "qrcode"
import { ThemeToggle } from "@/components/theme-toggle"
import { Logo } from "@/components/logo"
import { PWAInstallBanner } from "@/components/pwa-install-banner"
import { usePWA } from "@/components/pwa-provider"

interface ClientDashboardProps {
  subscription: Subscription | null
  todayPayments: Payment[]
  recentPayments: Payment[]
  devices: Device[]
  userEmail: string
  onRefresh?: () => void  // Callback to reload data
}

export function ClientDashboard({
  subscription,
  todayPayments,
  recentPayments,
  devices,
  userEmail,
  onRefresh,
}: ClientDashboardProps) {
  const [ttsEnabled, setTtsEnabled] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [previousPaymentsCount, setPreviousPaymentsCount] = useState(recentPayments.length)
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)
  const [isGeneratingQR, setIsGeneratingQR] = useState(false)
  const [qrModalOpen, setQrModalOpen] = useState(false)
  const [devicesModalOpen, setDevicesModalOpen] = useState(false)
  const [currentDevices, setCurrentDevices] = useState<Device[]>(devices)
  const [isDeletingDevice, setIsDeletingDevice] = useState<string | null>(null)
  const [selectedAction, setSelectedAction] = useState<string | null>(null)
  const router = useRouter()
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null)
  const { isStandalone } = usePWA()

  // Get business/display name
  const businessDisplayName = subscription?.display_name || subscription?.business_name || subscription?.owner_name || userEmail.split('@')[0]

  const tier = subscription?.tier || "free"
  const planConfig = PLAN_CONFIG[tier]
  const isBusiness = tier === "business" || tier === "annual"

  const todayTotal = todayPayments.reduce((sum, p) => sum + Number(p.amount), 0)

  const isExpired = subscription?.ends_at && new Date(subscription.ends_at) < new Date()
  const isFreeLimitReached =
    tier === "free" && (subscription?.validations_count || 0) >= (subscription?.max_validations || 5)
  const isDashboardBlocked = isExpired || isFreeLimitReached

  useEffect(() => {
    setCurrentDevices(devices)
  }, [devices])

  // Subscribe to Supabase Realtime for instant payment updates
  useEffect(() => {
    if (!subscription?.user_id) return

    const supabase = createClient()

    // Subscribe to INSERT events on payments table for this user
    const channel = supabase
      .channel('payments-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'payments',
          filter: `user_id=eq.${subscription.user_id}`
        },
        (payload) => {
          console.log('🔔 Nuevo pago recibido via Realtime:', payload.new)
          // Trigger data reload when new payment arrives
          if (onRefresh) {
            onRefresh()
          }
        }
      )
      .subscribe((status) => {
        console.log('📡 Realtime subscription status:', status)
      })

    // Cleanup on unmount
    return () => {
      console.log('🔌 Unsubscribing from Realtime')
      supabase.removeChannel(channel)
    }
  }, [subscription?.user_id, onRefresh])

  useEffect(() => {
    if (recentPayments.length > previousPaymentsCount && ttsEnabled) {
      const newPayment = recentPayments[0]
      const message = `Nuevo pago de ${newPayment.sender_name}, monto ${Number(newPayment.amount).toFixed(2)} soles, código ${newPayment.operation_code}`

      const utterance = new SpeechSynthesisUtterance(message)
      utterance.lang = "es-ES"
      utterance.rate = 1
      utterance.pitch = 1

      speechSynthesisRef.current = utterance
      window.speechSynthesis.speak(utterance)
    }
    setPreviousPaymentsCount(recentPayments.length)
  }, [recentPayments, ttsEnabled, previousPaymentsCount])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    localStorage.removeItem("auth_token")
    localStorage.removeItem("auth_user")
    router.push("/auth/login")
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    router.refresh()
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const handleExport = () => {
    if (!subscription?.can_export) return

    const headers = ["Fecha", "Hora", "Nombre", "Monto", "Código"]
    const rows = recentPayments.map((p) => [
      format(new Date(p.created_at), "dd/MM/yyyy"),
      format(new Date(p.created_at), "HH:mm"),
      `"${(p.sender_name || "").replace(/"/g, '""')}"`,
      `"S/ ${Number(p.amount).toFixed(2)}"`,
      `"${p.operation_code || ""}"`,
    ])

    // Se agrega el BOM de UTF-8 (\uFEFF) para que Excel en Windows reconozca tildes (á, é, í, ó, ú, ñ) automáticamente
    const csvContent = [headers.join(";"), ...rows.map((r) => r.join(";"))].join("\r\n")
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `pagoping-${format(new Date(), "yyyy-MM-dd")}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleWhatsApp = () => {
    window.open("https://wa.me/51928659361?text=Hola,%20necesito%20ayuda%20con%20PagoPing", "_blank")
  }

  const handleGenerateQR = async () => {
    setIsGeneratingQR(true)
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch("/api/devices/create-token", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const error = await response.json()
        alert(error.error || "Error generando QR")
        return
      }

      const data = await response.json()
      // Use URI format that mobile app expects: pagoping://pair?token=...
      const qrDataString = `pagoping://pair?token=${data.pairingToken}`
      const qrUrl = await QRCode.toDataURL(qrDataString, {
        width: 300,
        margin: 2,
        color: {
          dark: "#8E44AD",
          light: "#FFFFFF",
        },
      })
      setQrCodeUrl(qrUrl)
      setQrModalOpen(true)
    } catch (error) {
      console.error("Error generating QR:", error)
      alert("Error generando código QR")
    } finally {
      setIsGeneratingQR(false)
    }
  }

  const handleDeleteDevice = async (deviceId: string) => {
    setIsDeletingDevice(deviceId)
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch("/api/devices/delete", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ deviceId }),
      })

      if (response.ok) {
        setCurrentDevices((prev) => prev.filter((d) => d.device_id !== deviceId))
      } else {
        const error = await response.json()
        alert(error.error || "Error eliminando dispositivo")
      }
    } catch (error) {
      console.error("Error deleting device:", error)
    } finally {
      setIsDeletingDevice(null)
    }
  }

  const staffDevices = currentDevices.filter((d) => (d as any).role === "viewer")
  const listenerDevices = currentDevices.filter((d) => (d as any).role !== "viewer")

  return (
    <div className={`min-h-screen bg-background ${isDashboardBlocked ? "relative" : ""}`}>
      {isDashboardBlocked && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
          <Card className="max-w-md mx-4">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                  <AlertCircle className="h-8 w-8 text-destructive" />
                </div>
              </div>
              <CardTitle>{isExpired ? "Plan Vencido" : "Límite Alcanzado"}</CardTitle>
              <CardDescription>
                {isExpired
                  ? "Tu plan ha expirado. Contacta al administrador para renovar."
                  : "Has alcanzado tus 5 validaciones gratuitas."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" onClick={handleWhatsApp}>
                <MessageCircle className="mr-2 h-4 w-4" />
                Contactar por WhatsApp
              </Button>
              <Button variant="outline" className="w-full" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Header - Logo and action buttons */}
      <header className="bg-white/85 dark:bg-gray-900/85 backdrop-blur-xl sticky top-0 z-40 border-b safe-top transition-colors duration-200">
        <div className="container mx-auto px-3.5 sm:px-4 py-2.5 sm:py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Logo size="sm" asLink={false} />
              <Badge variant="secondary" className="ml-1 bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400 text-[10px] sm:text-xs">
                {planConfig.name}
              </Badge>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <ThemeToggle />
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                aria-label="Actualizar datos"
                className={`h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center rounded-full border-2 transition-all duration-300 ${isRefreshing ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30' : 'border-transparent hover:border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20'}`}
              >
                <RefreshCw className={`h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400 ${isRefreshing ? "animate-spin" : ""}`} />
              </button>
              <button
                onClick={handleLogout}
                aria-label="Cerrar sesión"
                className="h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center rounded-full border-2 border-transparent hover:border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
              >
                <LogOut className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-3.5 sm:p-5 md:p-6 space-y-5 sm:space-y-6 pb-28 md:pb-12">
        {/* PWA Install Banner */}
        <PWAInstallBanner />

        {/* Welcome Section with Vencimiento Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">¡Hola, {businessDisplayName}!</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">Aquí tienes el resumen de tu negocio hoy.</p>
          </div>

          {/* Vencimiento Badge with WhatsApp */}
          {subscription?.ends_at && !isExpired && tier !== "free" && (
            <button
              onClick={handleWhatsApp}
              className="flex items-center justify-between sm:justify-start gap-2.5 px-3.5 py-2 rounded-2xl sm:rounded-full bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-800 shadow-sm hover:shadow-md transition-all duration-200 group w-full sm:w-auto"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900 shrink-0">
                  <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] sm:text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wide">Vencimiento Plan</p>
                  <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{format(new Date(subscription.ends_at), "dd 'de' MMMM, yyyy", { locale: es })}</p>
                </div>
              </div>
              <svg className="h-4 w-4 text-green-500 group-hover:scale-110 transition-transform shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </button>
          )}
        </div>

        {tier === "free" && !isFreeLimitReached && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs sm:text-sm">
              Plan Gratis: {subscription?.validations_count || 0} / {subscription?.max_validations || 5} validaciones usadas
            </AlertDescription>
          </Alert>
        )}

        {/* Contador principal - Styled Card */}
        <Card id="resumen-ventas" className="overflow-hidden bg-gradient-to-br from-white via-purple-50/30 to-white dark:from-gray-800 dark:via-purple-900/10 dark:to-gray-800 border-purple-100 dark:border-purple-900/50 shadow-sm">
          <CardContent className="pt-6 pb-6 px-4 sm:px-6">
            {/* Sales Badge */}
            <div className="flex justify-center mb-3 sm:mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 text-xs font-semibold uppercase tracking-wide">
                <TrendingUp className="h-3.5 w-3.5" />
                Ventas del Día
              </span>
            </div>

            <div className="text-center">
              <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">Total Recaudado</p>
              <p className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-purple-600 dark:text-purple-400">
                S/ {todayTotal.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2.5 sm:mt-3">
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                  {todayPayments.length} {todayPayments.length === 1 ? "transacción exitosa" : "transacciones exitosas"}
                </span>
              </p>
            </div>

            {/* TTS Toggle - Pill Style */}
            <div className="flex justify-center mt-5 sm:mt-6">
              <button
                onClick={() => setTtsEnabled(!ttsEnabled)}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full border-2 transition-all duration-300 ${ttsEnabled ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30' : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'}`}
              >
                <Volume2 className={`h-4 w-4 ${ttsEnabled ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'}`} />
                <span className={`text-xs sm:text-sm font-medium ${ttsEnabled ? 'text-purple-600 dark:text-purple-400' : 'text-gray-600 dark:text-gray-400'}`}>Voz TTS</span>
                <div className={`relative w-9 h-5 rounded-full transition-colors duration-300 ${ttsEnabled ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${ttsEnabled ? 'translate-x-4.5' : 'translate-x-0.5'}`}></div>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Botones de acción - Card Style */}
        <div id="acciones-rapidas" className={`grid gap-3 sm:gap-4 ${isBusiness ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2"}`}>
          {/* Exportar Excel */}
          <button
            onClick={() => { setSelectedAction('export'); handleExport(); setTimeout(() => setSelectedAction(null), 300); }}
            disabled={!subscription?.can_export}
            className={`relative p-3.5 sm:p-5 md:p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-2 sm:gap-3 group
              ${selectedAction === 'export'
                ? 'border-purple-500 bg-purple-500 shadow-lg shadow-purple-200 dark:shadow-purple-900/30 scale-[1.02]'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-purple-300 hover:shadow-md'}
              ${!subscription?.can_export ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            <div className={`p-2.5 sm:p-3 rounded-xl transition-all duration-300 ${selectedAction === 'export' ? 'bg-white/20' : 'bg-purple-100 dark:bg-purple-900/50'}`}>
              {subscription?.can_export ? (
                <Download className={`h-5 w-5 sm:h-6 sm:w-6 transition-colors ${selectedAction === 'export' ? 'text-white' : 'text-purple-600 dark:text-purple-400'}`} />
              ) : (
                <Lock className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
              )}
            </div>
            <span className={`text-xs sm:text-sm font-medium text-center transition-colors ${selectedAction === 'export' ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`}>Exportar Excel</span>
            {!subscription?.can_export && <span className="text-[10px] text-gray-400">Plan Negocio+</span>}
          </button>

          {/* Dispositivos */}
          <Dialog open={devicesModalOpen} onOpenChange={(open) => { setDevicesModalOpen(open); if (open) setSelectedAction('devices'); else setSelectedAction(null); }}>
            <DialogTrigger asChild>
              <button
                className={`relative p-3.5 sm:p-5 md:p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-2 sm:gap-3 group
                  ${selectedAction === 'devices' || devicesModalOpen
                    ? 'border-purple-500 bg-purple-500 shadow-lg shadow-purple-200 dark:shadow-purple-900/30 scale-[1.02]'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-purple-300 hover:shadow-md'}`}
              >
                {/* Selection indicator dot */}
                {(selectedAction === 'devices' || devicesModalOpen) && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-purple-400 border-2 border-white"></div>
                )}
                <div className={`p-2.5 sm:p-3 rounded-xl transition-all duration-300 ${selectedAction === 'devices' || devicesModalOpen ? 'bg-white/20' : 'bg-purple-100 dark:bg-purple-900/50'}`}>
                  <Smartphone className={`h-5 w-5 sm:h-6 sm:w-6 transition-colors ${selectedAction === 'devices' || devicesModalOpen ? 'text-white' : 'text-purple-600 dark:text-purple-400'}`} />
                </div>
                <span className={`text-xs sm:text-sm font-medium text-center transition-colors ${selectedAction === 'devices' || devicesModalOpen ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`}>Dispositivos</span>
                <span className={`text-[11px] sm:text-xs text-center transition-colors ${selectedAction === 'devices' || devicesModalOpen ? 'text-purple-200' : 'text-purple-600 dark:text-purple-400'}`}>
                  {currentDevices.length} / {subscription?.max_devices || 1} Activos
                </span>
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-[92vw] sm:max-w-md max-h-[85vh] overflow-y-auto rounded-2xl p-4 sm:p-6">
              <DialogHeader>
                <DialogTitle>Dispositivos Vinculados</DialogTitle>
                <DialogDescription>Tu plan permite {subscription?.max_devices || 1} dispositivo(s)</DialogDescription>
              </DialogHeader>
              <div className="space-y-3 mt-2">
                {currentDevices.length === 0 ? (
                  <p className="text-center text-muted-foreground py-6 text-sm">No hay dispositivos vinculados.</p>
                ) : (
                  currentDevices.map((device) => (
                    <div
                      key={device.device_id}
                      className="flex items-center justify-between p-3 rounded-xl bg-secondary"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Smartphone className="h-5 w-5 text-primary shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{device.device_name || "Dispositivo"}</p>
                          <p className="text-xs text-muted-foreground">
                            {(device as any).role === "viewer" ? "Empleado" : "Principal"} • Visto{" "}
                            {formatDistanceToNow(new Date(device.last_seen), { addSuffix: true, locale: es })}
                          </p>
                        </div>
                      </div>
                      {(device as any).role === "viewer" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteDevice(device.device_id)}
                          disabled={isDeletingDevice === device.device_id}
                          className="text-destructive hover:bg-destructive/10 shrink-0 ml-2"
                        >
                          {isDeletingDevice === device.device_id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </DialogContent>
          </Dialog>

          {/* Vincular Staff */}
          {isBusiness && (
            <Dialog open={qrModalOpen} onOpenChange={(open) => { setQrModalOpen(open); if (open) setSelectedAction('staff'); else setSelectedAction(null); }}>
              <DialogTrigger asChild>
                <button
                  onClick={handleGenerateQR}
                  disabled={isGeneratingQR}
                  className={`relative p-3.5 sm:p-5 md:p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-2 sm:gap-3 group col-span-2 sm:col-span-1
                    ${selectedAction === 'staff' || qrModalOpen
                      ? 'border-purple-500 bg-purple-500 shadow-lg shadow-purple-200 dark:shadow-purple-900/30 scale-[1.02]'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-purple-300 hover:shadow-md'}`}
                >
                  <div className={`p-2.5 sm:p-3 rounded-xl transition-all duration-300 ${selectedAction === 'staff' || qrModalOpen ? 'bg-white/20' : 'bg-purple-100 dark:bg-purple-900/50'}`}>
                    {isGeneratingQR ? (
                      <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 text-white animate-spin" />
                    ) : (
                      <Users className={`h-5 w-5 sm:h-6 sm:w-6 transition-colors ${selectedAction === 'staff' || qrModalOpen ? 'text-white' : 'text-purple-600 dark:text-purple-400'}`} />
                    )}
                  </div>
                  <span className={`text-xs sm:text-sm font-medium text-center transition-colors ${selectedAction === 'staff' || qrModalOpen ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`}>Vincular Staff</span>
                  <span className={`text-[11px] sm:text-xs text-center transition-colors ${selectedAction === 'staff' || qrModalOpen ? 'text-purple-200' : 'text-purple-600 dark:text-purple-400'}`}>
                    {staffDevices.length} / {(subscription?.max_devices || 1) - 1} Miembros
                  </span>
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-[92vw] sm:max-w-md max-h-[85vh] overflow-y-auto rounded-2xl p-4 sm:p-6">
                <DialogHeader>
                  <DialogTitle>Vincular Empleado</DialogTitle>
                  <DialogDescription className="text-xs sm:text-sm">
                    Escanea este código con la App PagoPing en el celular de tu empleado
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center py-4 sm:py-6">
                  {qrCodeUrl ? (
                    <>
                      <div className="p-3 sm:p-4 bg-white rounded-2xl border-2 border-primary shadow-sm">
                        <img src={qrCodeUrl || "/placeholder.svg"} alt="QR Code" className="w-48 sm:w-60 h-48 sm:h-60 object-contain mx-auto" />
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-4 text-center max-w-xs">
                        El empleado podrá ver los pagos en tiempo real pero NO podrá insertar pagos falsos.
                      </p>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-48 sm:h-60">
                      <Loader2 className="h-8 w-8 text-primary animate-spin" />
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Lista de pagos */}
        <Card id="historial-pagos" className="shadow-sm">
          <CardHeader className="pb-3 px-4 sm:px-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base sm:text-lg">Pagos Recientes</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Últimos pagos recibidos</CardDescription>
              </div>
              <Badge variant="outline" className="text-xs font-normal">
                {recentPayments.length} registrados
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 px-3 sm:px-6 pb-6">
            {recentPayments.length === 0 ? (
              <p className="text-center text-muted-foreground py-8 text-xs sm:text-sm">
                No hay pagos registrados aún. Los pagos aparecerán aquí cuando uses la app.
              </p>
            ) : (
              recentPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
                >
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                    <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-xs sm:text-sm text-foreground truncate">{payment.sender_name}</p>
                      <p className="text-[11px] sm:text-xs text-muted-foreground truncate">
                        {format(new Date(payment.created_at), "dd/MM HH:mm")} • Cod: {payment.operation_code}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 pl-2">
                    <p className="font-bold text-sm sm:text-base md:text-lg text-primary">S/ {Number(payment.amount).toFixed(2)}</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </main>

      {/* Mobile Bottom Navigation Bar (PWA Dock) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-purple-100 dark:border-purple-900/40 safe-bottom shadow-lg shadow-black/10">
        <div className="flex items-center justify-around px-2 py-1.5">
          <button
            onClick={() => {
              const el = document.getElementById("resumen-ventas")
              if (el) el.scrollIntoView({ behavior: "smooth" })
              else window.scrollTo({ top: 0, behavior: "smooth" })
            }}
            className="flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors"
          >
            <TrendingUp className="h-5 w-5" />
            <span className="text-[10px] font-semibold">Ventas</span>
          </button>
          <button
            onClick={() => setDevicesModalOpen(true)}
            className="flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors"
          >
            <Smartphone className="h-5 w-5" />
            <span className="text-[10px] font-semibold">Equipos</span>
          </button>
          {isBusiness && (
            <button
              onClick={() => { handleGenerateQR(); setQrModalOpen(true); }}
              className="flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors"
            >
              <Users className="h-5 w-5" />
              <span className="text-[10px] font-semibold">Staff</span>
            </button>
          )}
          <button
            onClick={() => {
              const el = document.getElementById("historial-pagos")
              if (el) el.scrollIntoView({ behavior: "smooth" })
            }}
            className="flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors"
          >
            <DollarSign className="h-5 w-5" />
            <span className="text-[10px] font-semibold">Historial</span>
          </button>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors"
          >
            <RefreshCw className={`h-5 w-5 ${isRefreshing ? "animate-spin text-purple-600" : ""}`} />
            <span className="text-[10px] font-semibold">Actualizar</span>
          </button>
        </div>
      </div>
    </div>
  )
}
