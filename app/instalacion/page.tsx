import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Download, ShieldAlert, Smartphone, Settings, CheckCircle2 } from "lucide-react"

export default function InstallationPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-card py-4 sticky top-0 z-50">
                <div className="container mx-auto px-4 flex items-center">
                    <Button variant="ghost" size="sm" asChild className="mr-4">
                        <Link href="/">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Volver
                        </Link>
                    </Button>
                    <span className="font-bold text-lg">Guía de Instalación</span>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-3xl">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold mb-4">Instalar PagoPing en Android</h1>
                    <p className="text-muted-foreground">
                        Al no estar en Google Play Store, necesitas seguir unos pasos sencillos para instalar la app manualemente.
                    </p>
                    <Button size="lg" className="mt-6" asChild>
                        <Link href="/app-release.apk" download>
                            <Download className="mr-2 h-4 w-4" />
                            Descargar APK Ahora
                        </Link>
                    </Button>
                </div>

                <div className="space-y-6">
                    <StepCard
                        number="1"
                        title="Descargar el Archivo"
                        icon={<Download className="h-6 w-6 text-blue-500" />}
                    >
                        <p>
                            Haz clic en el botón de arriba para descargar el archivo <strong>app-release.apk</strong>.
                            Es posible que tu navegador te pregunte si quieres descargar un archivo que "podría ser dañino".
                            Esto es una advertencia estándar de Android para cualquier app fuera de la tienda.
                        </p>
                        <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 rounded-lg text-sm flex items-start gap-2">
                            <ShieldAlert className="h-5 w-5 shrink-0" />
                            <p>Confirma que deseas descargar el archivo. La app es segura y libre de virus.</p>
                        </div>
                    </StepCard>

                    <StepCard
                        number="2"
                        title="Abrir el Archivo"
                        icon={<Smartphone className="h-6 w-6 text-purple-500" />}
                    >
                        <p>
                            Una vez descargado, abre la notificación de descarga o busca el archivo en tu carpeta de "Descargas" y tócalo.
                        </p>
                    </StepCard>

                    <StepCard
                        number="3"
                        title="Permitir Instalación"
                        icon={<Settings className="h-6 w-6 text-slate-500" />}
                    >
                        <p>
                            Si te aparece un mensaje diciendo que "Chrome no puede instalar apps de fuentes desconocidas", toca en <strong>Configuración</strong>.
                        </p>
                        <p className="mt-2">
                            Luego, activa el interruptor que dice <strong>"Confiar en esta fuente"</strong> o "Permitir desde esta fuente".
                        </p>
                    </StepCard>

                    <StepCard
                        number="4"
                        title="Instalar y Abrir"
                        icon={<CheckCircle2 className="h-6 w-6 text-green-500" />}
                    >
                        <p>
                            Regresa atrás y toca en <strong>Instalar</strong>. Una vez termine, abre la app y concede los permisos de notificaciones para que pueda detectar los pagos.
                        </p>
                    </StepCard>
                </div>

                <div className="mt-12 p-6 bg-muted rounded-xl text-center">
                    <h3 className="font-semibold mb-2">¿Problemas con Google Play Protect?</h3>
                    <p className="text-sm text-muted-foreground">
                        Si ves una advertencia roja/naranja de Play Protect, selecciona <strong>"Más detalles"</strong> y luego <strong>"Instalar de todas formas"</strong>. Esto ocurre porque nuestra app es nueva y aún no ha sido indexada globalmente por Google.
                    </p>
                </div>
            </main>
        </div>
    )
}

function StepCard({ number, title, icon, children }: { number: string, title: string, icon: React.ReactNode, children: React.ReactNode }) {
    return (
        <Card className="relative overflow-hidden border-l-4 border-l-primary">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg">
                    {number}
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        {icon}
                        <CardTitle className="text-xl">{title}</CardTitle>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pl-[72px]">
                <div className="text-muted-foreground">
                    {children}
                </div>
            </CardContent>
        </Card>
    )
}
