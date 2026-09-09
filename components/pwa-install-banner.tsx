"use client"

import { useState } from "react"
import { usePWA } from "@/components/pwa-provider"
import { Button } from "@/components/ui/button"
import { Smartphone, Download, X, Share, PlusSquare, Sparkles } from "lucide-react"

export function PWAInstallBanner() {
  const { isInstallable, isStandalone, isIOS, installApp, dismissPrompt, isDismissed } = usePWA()
  const [isInstalling, setIsInstalling] = useState(false)
  const [showIOSGuide, setShowIOSGuide] = useState(false)

  // Don't show if already in standalone app mode or dismissed
  if (isStandalone || isDismissed) {
    return null
  }

  // If not installable via API and not iOS Safari, don't show
  if (!isInstallable && !isIOS) {
    return null
  }

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSGuide(true)
      return
    }

    setIsInstalling(true)
    try {
      await installApp()
    } finally {
      setIsInstalling(false)
    }
  }

  return (
    <div className="relative mb-4 w-full">
      <div className="relative overflow-hidden rounded-2xl border border-purple-200 dark:border-purple-900/60 bg-gradient-to-r from-purple-500/10 via-purple-500/5 to-background p-3.5 sm:p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          {/* Icon and text */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-600 text-white shadow-md shadow-purple-500/20">
              <Smartphone className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate">
                  Instala PagoPing en tu teléfono
                </p>
                <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/60 text-[10px] font-semibold text-purple-700 dark:text-purple-300">
                  <Sparkles className="h-2.5 w-2.5" /> PWA
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-muted-foreground truncate">
                Acceso instantáneo a pantalla completa sin barra de navegación
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              onClick={handleInstallClick}
              disabled={isInstalling}
              className="h-8 sm:h-9 px-3 sm:px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-sm"
            >
              <Download className="mr-1.5 h-3.5 w-3.5" />
              {isInstalling ? "Instalando..." : "Instalar"}
            </Button>
            <button
              onClick={dismissPrompt}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              aria-label="Cerrar aviso"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* iOS Helper Tooltip if requested */}
        {showIOSGuide && (
          <div className="mt-3 pt-3 border-t border-purple-200/60 dark:border-purple-800/40 text-xs text-purple-900 dark:text-purple-200 flex flex-col gap-1.5 bg-purple-50/50 dark:bg-purple-950/30 p-2.5 rounded-xl">
            <p className="font-semibold flex items-center gap-1.5">
              <Share className="h-3.5 w-3.5 text-purple-600" />
              Para instalar en iPhone / iPad:
            </p>
            <ol className="list-decimal pl-5 space-y-0.5 text-[11px] text-muted-foreground">
              <li>Toca el botón <strong>Compartir</strong> en la barra inferior de Safari.</li>
              <li>Desliza y presiona <strong>"Añadir a pantalla de inicio"</strong> <PlusSquare className="inline h-3 w-3" />.</li>
              <li>Confirma pulsando <strong>"Añadir"</strong> arriba a la derecha.</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  )
}
