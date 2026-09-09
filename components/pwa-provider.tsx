"use client"

import React, { createContext, useContext, useEffect, useState, useCallback } from "react"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>
}

interface PWAContextType {
  isInstallable: boolean
  isStandalone: boolean
  isIOS: boolean
  installApp: () => Promise<boolean>
  dismissPrompt: () => void
  isDismissed: boolean
}

const PWAContext = createContext<PWAContextType>({
  isInstallable: false,
  isStandalone: false,
  isIOS: false,
  installApp: async () => false,
  dismissPrompt: () => {},
  isDismissed: false,
})

export function PWAProvider({ children }: { children: React.ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isStandalone, setIsStandalone] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Check if dismissed before in session
    if (typeof window !== "undefined") {
      const dismissed = sessionStorage.getItem("pagoping_pwa_dismissed") === "true"
      if (dismissed) setIsDismissed(true)
    }

    // Check standalone mode
    const checkStandalone = () => {
      const isStandaloneMedia = window.matchMedia("(display-mode: standalone)").matches
      const isIOSStandalone = (window.navigator as any).standalone === true
      setIsStandalone(Boolean(isStandaloneMedia || isIOSStandalone))
    }

    // Detect iOS
    const checkIOS = () => {
      const userAgent = window.navigator.userAgent.toLowerCase()
      const isAppleDevice = /iphone|ipad|ipod/.test(userAgent)
      setIsIOS(isAppleDevice)
    }

    checkStandalone()
    checkIOS()

    // Register Service Worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("[PWA] Service Worker registrado:", reg.scope)
        })
        .catch((err) => {
          console.warn("[PWA] Error registrando Service Worker:", err)
        })
    }

    // Listen for beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }

    const handleAppInstalled = () => {
      setDeferredPrompt(null)
      setIsStandalone(true)
      console.log("[PWA] App instalada con éxito")
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [])

  const installApp = useCallback(async (): Promise<boolean> => {
    if (!deferredPrompt) {
      return false
    }

    try {
      await deferredPrompt.prompt()
      const choiceResult = await deferredPrompt.userChoice
      if (choiceResult.outcome === "accepted") {
        setDeferredPrompt(null)
        setIsStandalone(true)
        return true
      }
      return false
    } catch (err) {
      console.error("[PWA] Error durante instalación:", err)
      return false
    }
  }, [deferredPrompt])

  const dismissPrompt = useCallback(() => {
    setIsDismissed(true)
    if (typeof window !== "undefined") {
      sessionStorage.setItem("pagoping_pwa_dismissed", "true")
    }
  }, [])

  return (
    <PWAContext.Provider
      value={{
        isInstallable: Boolean(deferredPrompt) && !isStandalone,
        isStandalone,
        isIOS,
        installApp,
        dismissPrompt,
        isDismissed,
      }}
    >
      {children}
    </PWAContext.Provider>
  )
}

export function usePWA() {
  return useContext(PWAContext)
}
