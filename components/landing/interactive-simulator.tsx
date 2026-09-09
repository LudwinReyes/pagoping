"use client"

import { useState, useRef } from "react"
import gsap from "gsap"
import confetti from "canvas-confetti"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Zap,
  Volume2,
  ShieldCheck,
  AlertTriangle,
  Play,
  RotateCcw,
  Check,
  CheckCircle2,
  Smartphone,
  Flame
} from "lucide-react"

type ScenarioType = "normal" | "duplicate" | "large"

export function InteractiveSimulator() {
  const [scenario, setScenario] = useState<ScenarioType>("normal")
  const [isPlaying, setIsPlaying] = useState(false)
  const [lastEvent, setLastEvent] = useState<{
    sender: string
    amount: number
    op: string
    time: string
    isFraud?: boolean
  } | null>(null)

  const phoneNotificationRef = useRef<HTMLDivElement>(null)
  const soundwaveRef = useRef<HTMLDivElement>(null)

  // Web Audio Synth for crisp notification chime
  const playChime = (isWarning: boolean) => {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (!AudioContextClass) return
      const audioCtx = new AudioContextClass()
      const osc = audioCtx.createOscillator()
      const gain = audioCtx.createGain()
      osc.connect(gain)
      gain.connect(audioCtx.destination)

      const now = audioCtx.currentTime
      if (isWarning) {
        osc.type = "sawtooth"
        osc.frequency.setValueAtTime(220, now)
        osc.frequency.setValueAtTime(180, now + 0.15)
        gain.gain.setValueAtTime(0.2, now)
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4)
        osc.start(now)
        osc.stop(now + 0.4)
      } else {
        osc.type = "sine"
        osc.frequency.setValueAtTime(587.33, now) // D5
        osc.frequency.setValueAtTime(880, now + 0.1) // A5
        gain.gain.setValueAtTime(0.25, now)
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5)
        osc.start(now)
        osc.stop(now + 0.5)
      }
    } catch {
      // Audio context might be restricted before interaction
    }
  }

  const handleSimulate = () => {
    if (isPlaying) return
    setIsPlaying(true)

    const isFraud = scenario === "duplicate"
    playChime(isFraud)

    if (!isFraud) {
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 },
          colors: ["#8e44ad", "#00c853", "#2979ff"],
        })
      } catch {
        // Confetti fallback
      }
    }

    const newPayment = {
      sender:
        scenario === "normal"
          ? "Lucía Morales Prado"
          : scenario === "large"
          ? "Restaurante El Criollo SAC"
          : "Falso Comprador (Captura)",
      amount: scenario === "normal" ? 38.5 : scenario === "large" ? 480.0 : 50.0,
      op: scenario === "duplicate" ? "OP #492811 (Duplicado)" : `OP #${Math.floor(100000 + Math.random() * 900000)}`,
      time: "Ahora mismo",
      isFraud,
    }

    setLastEvent(newPayment)

    // GSAP notification pop animation
    if (phoneNotificationRef.current) {
      gsap.fromTo(
        phoneNotificationRef.current,
        { scale: 0.8, y: -20, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 0.4, ease: "back.out(2)" }
      )
    }

    if (soundwaveRef.current) {
      gsap.fromTo(
        soundwaveRef.current,
        { opacity: 0, scaleX: 0.5 },
        { opacity: 1, scaleX: 1, duration: 0.3, yoyo: true, repeat: 3 }
      )
    }

    setTimeout(() => {
      setIsPlaying(false)
    }, 1200)
  }

  return (
    <section id="simulador" className="py-20 md:py-28 relative overflow-hidden bg-muted/30">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="outline" className="mb-3 px-3 py-1 border-primary/40 bg-primary/10 text-primary font-semibold">
            <Flame className="h-3.5 w-3.5 mr-1 text-amber-500 fill-amber-500" />
            Demostración en Tiempo Real
          </Badge>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-foreground">
            Pruébalo tú mismo:{" "}
            <span className="bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
              Simula un pago Yape
            </span>
          </h2>
          <p className="mt-4 text-muted-foreground text-base sm:text-lg">
            Haz clic en el botón y experimenta cómo PagoPing captura el pago, reproduce la voz y bloquea estafas en segundos.
          </p>
        </div>

        {/* Interactive Console Card */}
        <div className="rounded-3xl border border-border/80 bg-card/80 backdrop-blur-xl shadow-2xl p-6 md:p-8">
          {/* Controls Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-border/50">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Elige un escenario:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <Button
                  size="sm"
                  variant={scenario === "normal" ? "default" : "outline"}
                  onClick={() => setScenario("normal")}
                  className="text-xs h-8"
                >
                  Pago Habitual (S/ 38.50)
                </Button>
                <Button
                  size="sm"
                  variant={scenario === "large" ? "default" : "outline"}
                  onClick={() => setScenario("large")}
                  className="text-xs h-8"
                >
                  Pago Grande (S/ 480.00)
                </Button>
                <Button
                  size="sm"
                  variant={scenario === "duplicate" ? "destructive" : "outline"}
                  onClick={() => setScenario("duplicate")}
                  className="text-xs h-8 gap-1"
                >
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Intento de Estafa
                </Button>
              </div>
            </div>

            <Button
              onClick={handleSimulate}
              disabled={isPlaying}
              className={`h-11 px-6 font-bold shadow-lg transition-all duration-300 hover:scale-105 ${
                scenario === "duplicate"
                  ? "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/25"
                  : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-600/25"
              }`}
            >
              {isPlaying ? (
                <>
                  <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
                  Procesando notificación...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4 fill-current" />
                  ¡Simular Notificación Yape!
                </>
              )}
            </Button>
          </div>

          {/* Demonstration Canvas */}
          <div className="grid md:grid-cols-12 gap-6 mt-6 items-center">
            {/* Left: Interactive Phone Notification Preview */}
            <div className="md:col-span-6 bg-gradient-to-b from-muted/50 to-muted/20 border border-border/60 rounded-2xl p-5 flex flex-col justify-center min-h-[260px]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                  <Smartphone className="h-4 w-4 text-primary" />
                  Celular del Negocio (Pantalla bloqueada o en uso)
                </div>
                <span className="text-[10px] text-emerald-500 font-mono flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Servicio Activo
                </span>
              </div>

              {/* Notification Box */}
              <div
                ref={phoneNotificationRef}
                className={`rounded-2xl p-4 border transition-all duration-300 shadow-lg ${
                  lastEvent?.isFraud
                    ? "bg-rose-950/20 border-rose-500/50 text-rose-300"
                    : lastEvent
                    ? "bg-purple-950/20 border-purple-500/40 text-purple-200"
                    : "bg-card/50 border-dashed border-border text-muted-foreground"
                }`}
              >
                {lastEvent ? (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs text-white ${
                            lastEvent.isFraud ? "bg-rose-600" : "bg-[#742299]"
                          }`}
                        >
                          {lastEvent.isFraud ? "!" : "Y"}
                        </div>
                        <span className="text-xs font-bold text-foreground">
                          {lastEvent.isFraud ? "Alerta de Seguridad" : "Yape Notificación"}
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground">{lastEvent.time}</span>
                    </div>

                    {lastEvent.isFraud ? (
                      <div>
                        <p className="text-xs text-rose-500 font-bold flex items-center gap-1.5">
                          <AlertTriangle className="h-4 w-4" />
                          ¡Voucher Duplicado Detectado!
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          El cliente intentó pasar una captura vieja con código repetido. Pago no acreditado en caja.
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-xs text-foreground font-medium">
                          <strong>{lastEvent.sender}</strong> te envió:
                        </p>
                        <div className="mt-1 flex items-baseline justify-between">
                          <span className="text-2xl font-black text-emerald-500">
                            S/ {lastEvent.amount.toFixed(2)}
                          </span>
                          <span className="text-xs font-mono text-muted-foreground">{lastEvent.op}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-6 text-center">
                    <p className="text-xs">Presiona el botón de arriba para enviar una prueba</p>
                  </div>
                )}
              </div>

              {/* Sound Voice Wave Indicator */}
              <div
                ref={soundwaveRef}
                className="mt-4 flex items-center gap-3 p-3 rounded-xl bg-background border border-border/60"
              >
                <div
                  className={`p-2 rounded-lg ${
                    lastEvent?.isFraud
                      ? "bg-rose-500/20 text-rose-500"
                      : "bg-primary/20 text-primary"
                  }`}
                >
                  <Volume2 className="h-4 w-4 animate-pulse" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">
                    Alerta de Voz TTS (Parlante Bluetooth / Celular):
                  </p>
                  <p className="text-xs font-bold text-foreground truncate">
                    {lastEvent?.isFraud
                      ? "🗣️ '¡Atención! Código de pago ya utilizado anteriormente.'"
                      : lastEvent
                      ? `🗣️ '¡Pago de ${lastEvent.amount.toFixed(2)} soles recibido de ${lastEvent.sender.split(" ")[0]}!'`
                      : "Esperando pago para anunciar en voz alta..."}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Dashboard Reaction & Verification */}
            <div className="md:col-span-6 space-y-4">
              <div className="rounded-2xl border border-border/70 bg-card p-5">
                <h4 className="font-bold text-sm text-foreground flex items-center gap-2 mb-3">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  ¿Qué sucede por detrás en 0.2 segundos?
                </h4>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                      <Check className="h-3 w-3" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">Lectura de Notificación Oficial</p>
                      <p className="text-[11px] text-muted-foreground">
                        La app lee directamente el paquete oficial de Yape en Android, sin pedir contraseñas ni claves de banco.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                      <Check className="h-3 w-3" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">Algoritmo Anti-Duplicados MD5</p>
                      <p className="text-[11px] text-muted-foreground">
                        Genera un hash criptográfico único por cada pago. Si un cliente muestra una captura editada o vieja, el sistema la rechaza.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                      <Check className="h-3 w-3" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">Anuncio Automático por Voz TTS</p>
                      <p className="text-[11px] text-muted-foreground">
                        Tus cajeros y meseros escuchan el monto al instante sin que tengas que enviarles capturas por WhatsApp ni prestarles tu teléfono.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status summary banner */}
              <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-primary/10 border border-primary/20 text-xs">
                <span className="font-medium text-primary">
                  ¿Quieres esto funcionando en tu negocio hoy?
                </span>
                <Button size="sm" variant="link" asChild className="text-primary font-bold p-0 h-auto">
                  <a href="/auth/sign-up">Crear cuenta gratis &rarr;</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
