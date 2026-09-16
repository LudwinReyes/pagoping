"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Smartphone,
  Mail,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Volume2,
  Loader2,
  Info,
} from "lucide-react"

interface CaptureChannelModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentChannel: "android_notification" | "email"
  inboundEmailSlug?: string | null
  inboundEmailAddress?: string | null
  isExpired?: boolean
  onChannelChanged?: (newChannel: "android_notification" | "email") => void
}

export function CaptureChannelModal({
  open,
  onOpenChange,
  currentChannel,
  inboundEmailSlug,
  inboundEmailAddress,
  isExpired = false,
  onChannelChanged,
}: CaptureChannelModalProps) {
  const [selectedChannel, setSelectedChannel] = useState<"android_notification" | "email">(
    currentChannel || "android_notification"
  )
  const [isSaving, setIsSaving] = useState(false)
  const [copied, setCopied] = useState(false)
  const [copiedBcp, setCopiedBcp] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const emailAddress =
    inboundEmailAddress ||
    (inboundEmailSlug
      ? `cobros-${inboundEmailSlug}@tunkitek.lat`
      : "cobros-...@tunkitek.lat")

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(emailAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch (err) {
      console.error("Error al copiar al portapapeles:", err)
    }
  }

  const handleCopyBcp = async () => {
    try {
      await navigator.clipboard.writeText("notificaciones@notificacionesbcp.com.pe")
      setCopiedBcp(true)
      setTimeout(() => setCopiedBcp(false), 2500)
    } catch (err) {
      console.error("Error al copiar al portapapeles:", err)
    }
  }

  const handleSelectChannel = async (targetChannel: "android_notification" | "email") => {
    if (targetChannel === selectedChannel || isSaving) return

    setIsSaving(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const response = await fetch("/api/user/capture-channel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel: targetChannel }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "No se pudo cambiar el canal de recepción")
      }

      setSelectedChannel(targetChannel)
      setSuccessMessage(
        targetChannel === "email"
          ? "Canal cambiado a Correo Electrónico (iPhone / iOS)"
          : "Canal cambiado a Notificaciones Android"
      )
      onChannelChanged?.(targetChannel)
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Error al actualizar")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[94vw] sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl p-5 sm:p-7">
        <DialogHeader className="text-left space-y-1.5 pb-2 border-b">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                Canal de Recepción de Pagos
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
                Elige cómo PagoPing detecta tus cobros de Yape.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {errorMessage && (
          <Alert variant="destructive" className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">{errorMessage}</AlertDescription>
          </Alert>
        )}

        {successMessage && (
          <Alert className="mt-3 border-emerald-300 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <AlertDescription className="text-xs font-medium">{successMessage}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-3.5 mt-2">
          <p className="text-xs text-muted-foreground">
            Solo un canal puede estar activo a la vez para evitar que un pago se registre doble.
          </p>

          {/* Selector de Canales */}
          <div className="grid grid-cols-1 gap-3">
            {/* Opción 1: Notificación Android */}
            <div
              onClick={() => handleSelectChannel("android_notification")}
              className={`p-3.5 sm:p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex items-start justify-between gap-3 ${
                selectedChannel === "android_notification"
                  ? "border-purple-600 bg-purple-50/70 dark:bg-purple-950/30 shadow-sm"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 hover:bg-gray-50/50 dark:hover:bg-gray-800/40"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                    selectedChannel === "android_notification"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-500"
                  }`}
                >
                  <Smartphone className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      Notificaciones en Android
                    </p>
                    <Badge
                      variant="outline"
                      className="border-emerald-300 text-emerald-700 dark:text-emerald-300 bg-emerald-100/60 dark:bg-emerald-900/40 text-[10px] font-semibold"
                    >
                      Desde S/ 0.10
                    </Badge>
                    {selectedChannel === "android_notification" && (
                      <Badge className="bg-purple-600 text-white text-[10px] px-2 py-0">
                        Activo
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    Desde S/ 0.10 (micropagos). Lee alertas en segundo plano cuando tu Yape está en un celular Android.
                  </p>
                </div>
              </div>

              <div className="pt-1">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    selectedChannel === "android_notification"
                      ? "border-purple-600 bg-purple-600"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                >
                  {selectedChannel === "android_notification" && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
              </div>
            </div>

            {/* Opción 2: Correo Electrónico (iPhone / iOS) */}
            <div
              onClick={() => handleSelectChannel("email")}
              className={`p-3.5 sm:p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex items-start justify-between gap-3 ${
                selectedChannel === "email"
                  ? "border-purple-600 bg-purple-50/70 dark:bg-purple-950/30 shadow-sm"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 hover:bg-gray-50/50 dark:hover:bg-gray-800/40"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                    selectedChannel === "email"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-500"
                  }`}
                >
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      Por Correo Electrónico
                    </p>
                    <Badge
                      variant="outline"
                      className="border-purple-300 text-purple-700 dark:text-purple-300 bg-purple-100/60 dark:bg-purple-900/40 text-[10px] font-semibold"
                    >
                      Recomendado iPhone
                    </Badge>
                    <Badge
                      variant="outline"
                      className="border-amber-300 text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 text-[10px] font-semibold"
                    >
                      Pagos ≥ S/ 10
                    </Badge>
                    {selectedChannel === "email" && (
                      <Badge className="bg-purple-600 text-white text-[10px] px-2 py-0">
                        Activo
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    Para pagos de S/ 10.00 a más y transferencias BCP. Procesa constancias en tiempo real sin celular Android.
                  </p>
                </div>
              </div>

              <div className="pt-1">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    selectedChannel === "email"
                      ? "border-purple-600 bg-purple-600"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                >
                  {selectedChannel === "email" && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {isSaving && (
            <div className="flex items-center justify-center gap-2 py-2 text-xs text-purple-600 font-medium">
              <Loader2 className="h-4 w-4 animate-spin" />
              Guardando canal de recepción...
            </div>
          )}

          {/* Configuración detallada cuando está activo el modo Correo */}
          {selectedChannel === "email" && (
            <div className="pt-2 space-y-4 border-t border-dashed">
              {isExpired && (
                <Alert variant="destructive" className="py-2.5">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    Tu suscripción ha vencido. La recepción de pagos por correo se reactivará al renovar tu plan.
                  </AlertDescription>
                </Alert>
              )}

              {/* Alerta explicativa sobre política de BCP (S/ 10) */}
              <div className="rounded-2xl p-3.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-200">
                  <Info className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                  <span>Aviso Importante: Monto mínimo de Yape por Correo</span>
                </div>
                <p className="leading-relaxed text-[11px] text-amber-800/90 dark:text-amber-300/90 pl-6">
                  Por política bancaria del BCP, <strong>las constancias por correo de Yape solo se emiten para montos de S/ 10.00 en adelante</strong>. El banco no envía correos de confirmación para pagos menores (como S/ 1 o S/ 5).
                </p>
                <p className="leading-relaxed text-[11px] text-amber-800/90 dark:text-amber-300/90 pl-6">
                  👉 <em>Si tu negocio recibe con frecuencia cobros de menos de S/ 10, te recomendamos cambiar al canal <strong>"Notificaciones en Android"</strong> para detectar cualquier monto desde S/ 0.10.</em>
                </p>
              </div>

              {/* Caja con la dirección de correo exclusiva */}
              <div className="rounded-2xl p-4 bg-gradient-to-br from-purple-50 to-indigo-50/50 dark:from-gray-800/80 dark:to-purple-950/20 border border-purple-200 dark:border-purple-800/60 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold tracking-wide uppercase text-purple-700 dark:text-purple-300">
                    Tu buzón exclusivo de cobros:
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Listo para recibir
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="flex-1 px-3 py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-purple-200 dark:border-purple-800 font-mono text-xs sm:text-sm text-purple-900 dark:text-purple-200 font-medium select-all break-all shadow-inner">
                    {emailAddress}
                  </div>
                  <Button
                    onClick={handleCopyEmail}
                    type="button"
                    className={`shrink-0 rounded-xl text-xs font-semibold h-10 px-4 transition-all duration-200 ${
                      copied
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                        : "bg-purple-600 hover:bg-purple-700 text-white shadow-sm"
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 mr-1.5" />
                        ¡Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-1.5" />
                        Copiar Correo
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Guía en 3 Pasos sin fricción */}
              <div className="rounded-2xl p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <p className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                    <span>⚙️</span> Configuración en Gmail en 3 pasos rápidos
                  </p>
                  <a
                    href="https://mail.google.com/mail/u/0/#settings/fwdandpop"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-600 hover:text-purple-700 dark:text-purple-400 hover:underline"
                  >
                    Abrir Ajustes de Gmail
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                <div className="space-y-3 text-xs text-gray-600 dark:text-gray-300">
                  {/* Paso 1 */}
                  <div className="flex items-start gap-2.5">
                    <div className="h-5 w-5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 font-bold flex items-center justify-center shrink-0 text-[11px] mt-0.5">
                      1
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <p className="font-semibold text-gray-800 dark:text-gray-200">
                        Añade tu buzón de reenvío en Gmail
                      </p>
                      <p className="text-muted-foreground text-[11px] leading-relaxed">
                        En tu computadora entra a Gmail ➔ <strong>Ajustes (⚙️)</strong> ➔ <strong>Ver todos los ajustes</strong> ➔ pestaña <strong>Reenvío y correo POP/IMAP</strong> ➔ haz clic en <strong>"Añadir una dirección de reenvío"</strong> y pega tu correo exclusivo de arriba.
                      </p>
                      <div className="p-2.5 rounded-xl bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-800/40 text-[11px] text-purple-900 dark:text-purple-200 flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
                        <span>
                          <strong>Confirmación automática:</strong> PagoPing aprueba el correo de confirmación de Google en menos de 5 segundos. No necesitas buscar ningún código: tras añadirlo, solo recarga la página de Gmail.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Paso 2 */}
                  <div className="flex items-start gap-2.5">
                    <div className="h-5 w-5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 font-bold flex items-center justify-center shrink-0 text-[11px] mt-0.5">
                      2
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <p className="font-semibold text-gray-800 dark:text-gray-200">
                        Crea el Filtro Automático
                      </p>
                      <p className="text-muted-foreground text-[11px] leading-relaxed">
                        Ve a <strong>Filtros y direcciones bloqueadas</strong> ➔ haz clic en <strong>"Crear un filtro nuevo"</strong>. En la casilla <strong>"De"</strong> escribe el correo del BCP:
                      </p>
                      <div className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-gray-900 border text-[11px] font-mono shadow-sm">
                        <span className="text-purple-700 dark:text-purple-300 font-semibold truncate">
                          notificaciones@notificacionesbcp.com.pe
                        </span>
                        <Button
                          onClick={handleCopyBcp}
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="h-6 px-2 text-[10px] font-semibold text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950/50 shrink-0"
                        >
                          {copiedBcp ? (
                            <>
                              <Check className="h-3 w-3 mr-1 text-emerald-600" />
                              <span className="text-emerald-600">Copiado</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3 mr-1" />
                              Copiar
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Paso 3 */}
                  <div className="flex items-start gap-2.5">
                    <div className="h-5 w-5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 font-bold flex items-center justify-center shrink-0 text-[11px] mt-0.5">
                      3
                    </div>
                    <div className="space-y-1 flex-1">
                      <p className="font-semibold text-gray-800 dark:text-gray-200">
                        Activa el Reenvío
                      </p>
                      <p className="text-muted-foreground text-[11px] leading-relaxed">
                        Haz clic en <strong>"Crear filtro"</strong>, marca la casilla ☑️ <strong>"Reenviarlo a:"</strong> y selecciona tu dirección de PagoPing. Haz clic en guardar y ¡listo!
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Voz y colaboradores reminder */}
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 text-purple-900 dark:text-purple-200 text-xs">
                <Volume2 className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed text-[11px]">
                  <strong>¿Cómo cantará los cobros?</strong> Cada vez que un cliente te yapee S/ 10 o más, PagoPing procesará el comprobante al segundo y cantará la alerta por voz en los celulares de tus cajeros y en tu panel web.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="pt-2">
          <Button
            onClick={() => onOpenChange(false)}
            variant="outline"
            className="w-full rounded-xl text-xs"
          >
            Entendido, cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
