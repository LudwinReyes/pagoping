import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, ShieldAlert, Smartphone, Settings, CheckCircle2, Sparkles, Share2, PlusSquare } from "lucide-react"

export default function InstallationPage() {
    return (
        <div className="min-h-screen bg-background pb-12">
            {/* Header */}
            <header className="border-b bg-card/90 backdrop-blur-md py-3.5 sticky top-0 z-50 safe-top">
                <div className="container mx-auto px-4 flex items-center justify-between">
                    <div className="flex items-center">
                        <Button variant="ghost" size="sm" asChild className="mr-3">
                            <Link href="/">
                                <ArrowLeft className="h-4 w-4 mr-1.5" />
                                Volver
                            </Link>
                        </Button>
                        <span className="font-bold text-base sm:text-lg">Guía de Instalación</span>
                    </div>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300 text-xs">
                        PagoPing
                    </Badge>
                </div>
            </header>

            <main className="container mx-auto px-4 py-6 sm:py-10 max-w-3xl space-y-10">
                {/* Hero section */}
                <div className="text-center">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs font-semibold mb-3">
                        <Sparkles className="h-3.5 w-3.5" /> Configuración Rápida
                    </span>
                    <h1 className="text-2xl sm:text-4xl font-black mb-3 text-foreground tracking-tight">
                        Instalación y Uso de PagoPing
                    </h1>
                    <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
                        PagoPing funciona con una app capturadora para Android y una Web App (PWA) para ver tus cobros en tiempo real en cualquier dispositivo.
                    </p>
                </div>

                {/* Section 1: PWA Dashboard */}
                <div className="p-5 sm:p-6 rounded-3xl border border-purple-200 dark:border-purple-900/60 bg-gradient-to-br from-purple-50/50 via-background to-purple-50/30 dark:from-purple-950/20 dark:via-background dark:to-purple-950/10 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-purple-600 text-white shadow-md">
                            <Smartphone className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-xl font-bold text-foreground">1. Instalar la App Web (PWA) en tu Celular</h2>
                            <p className="text-xs sm:text-sm text-muted-foreground">Para ti y tus cajeros: visualiza pagos en vivo a pantalla completa.</p>
                        </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3 pt-2 text-xs sm:text-sm">
                        <div className="p-3.5 rounded-2xl bg-card border border-border/80 space-y-1.5">
                            <p className="font-semibold text-foreground flex items-center gap-1.5">
                                <span className="h-2 w-2 rounded-full bg-purple-500" />
                                En Android (Chrome):
                            </p>
                            <p className="text-muted-foreground text-xs leading-relaxed">
                                Ingresa a <Link href="/dashboard" className="text-primary font-medium underline">tu Dashboard</Link> y pulsa el botón <strong>"Instalar"</strong> que aparece arriba, o toca el menú (⋮) de Chrome y elige <strong>"Instalar aplicación"</strong>.
                            </p>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-card border border-border/80 space-y-1.5">
                            <p className="font-semibold text-foreground flex items-center gap-1.5">
                                <span className="h-2 w-2 rounded-full bg-purple-500" />
                                En iPhone / iOS (Safari):
                            </p>
                            <p className="text-muted-foreground text-xs leading-relaxed">
                                Abre <Link href="/dashboard" className="text-primary font-medium underline">tu Dashboard</Link> en Safari, presiona el botón <strong>Compartir</strong> (icono <Share2 className="inline h-3 w-3" />) y selecciona <strong>"Añadir a pantalla de inicio"</strong>.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Section 2: Android APK */}
                <div className="space-y-6">
                    <div className="border-b pb-3">
                        <h2 className="text-xl sm:text-2xl font-bold text-foreground">2. Instalar el Capturador de Notificaciones (APK Android)</h2>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                            Instálalo exclusivamente en el celular que tiene la cuenta de Yape activa para detectar las notificaciones entrantes.
                        </p>
                        <div className="mt-4">
                            <Button size="lg" className="w-full sm:w-auto h-11 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold" asChild>
                                <a href="/app-release.apk" download>
                                    <Download className="mr-2 h-4 w-4" />
                                    Descargar APK Android
                                </a>
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <StepCard
                            number="1"
                            title="Descargar el Archivo"
                            icon={<Download className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />}
                        >
                            <p>
                                Haz clic en el botón de arriba para descargar el archivo <strong>app-release.apk</strong>.
                                Es posible que Android pregunte si deseas descargar un archivo de fuentes externas. Confirma para continuar.
                            </p>
                            <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 rounded-xl text-xs flex items-start gap-2">
                                <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                                <p>La aplicación es 100% segura y privada: no accede a tus claves ni contraseñas de Yape.</p>
                            </div>
                        </StepCard>

                        <StepCard
                            number="2"
                            title="Abrir el Archivo"
                            icon={<Smartphone className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500" />}
                        >
                            <p>
                                Una vez descargado, abre la notificación de descarga o dirígete a tu carpeta de <strong>"Descargas"</strong> y tócalo.
                            </p>
                        </StepCard>

                        <StepCard
                            number="3"
                            title="Permitir Instalación"
                            icon={<Settings className="h-5 w-5 sm:h-6 sm:w-6 text-slate-500" />}
                        >
                            <p>
                                Si el navegador muestra que "no puede instalar apps de fuentes desconocidas", toca en <strong>Configuración</strong> y activa <strong>"Permitir desde esta fuente"</strong>.
                            </p>
                        </StepCard>

                        <StepCard
                            number="4"
                            title="Instalar y Vincular"
                            icon={<CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />}
                        >
                            <p>
                                Toca <strong>Instalar</strong>, abre la aplicación y concede el permiso de <strong>Acceso a Notificaciones</strong>. Luego, vincula tu cuenta iniciando sesión o escaneando tu código de dispositivo.
                            </p>
                        </StepCard>
                    </div>

                    <div className="p-5 bg-muted rounded-2xl text-center text-xs sm:text-sm">
                        <h3 className="font-semibold mb-1 text-foreground">¿Problemas con Google Play Protect?</h3>
                        <p className="text-muted-foreground max-w-lg mx-auto">
                            Si ves un aviso de Play Protect, selecciona <strong>"Más detalles"</strong> y luego <strong>"Instalar de todas formas"</strong>. Esto ocurre con aplicaciones corporativas nuevas distribuidas directamente sin pasar por Play Store.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    )
}

function StepCard({ number, title, icon, children }: { number: string, title: string, icon: React.ReactNode, children: React.ReactNode }) {
    return (
        <Card className="relative overflow-hidden border-l-4 border-l-primary rounded-2xl shadow-sm">
            <CardHeader className="flex flex-row items-center gap-3 sm:gap-4 p-4 pb-2">
                <div className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm sm:text-base">
                    {number}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        {icon}
                        <CardTitle className="text-base sm:text-lg font-bold">{title}</CardTitle>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pl-14 sm:pl-16 pr-4 pb-4 pt-0 text-xs sm:text-sm text-muted-foreground">
                {children}
            </CardContent>
        </Card>
    )
}

