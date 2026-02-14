import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, Smartphone, Bell, Shield, Zap, CheckCircle2, ArrowRight } from "lucide-react"

export default function HomePage() {
  const plans = [
    {
      name: "Gratis",
      price: "S/ 0",
      period: "Para siempre",
      features: ["5 validaciones totales", "1 dispositivo", "Dashboard básico"],
      highlighted: false,
    },
    {
      name: "Básico",
      price: "S/ 15",
      period: "/ mes",
      features: ["Validaciones ilimitadas", "1 dispositivo", "Historial 30 días"],
      highlighted: false,
    },
    {
      name: "Negocio",
      price: "S/ 30",
      period: "/ mes",
      features: ["Validaciones ilimitadas", "3 dispositivos", "Historial completo", "Exportar Excel"],
      highlighted: true,
    },
    {
      name: "Anual",
      price: "S/ 225",
      period: "/ año",
      features: ["Todo de Negocio", "Ahorra 25%", "Soporte prioritario"],
      highlighted: false,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
              <DollarSign className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">PagoPing</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Iniciar Sesión</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/sign-up">Comenzar Gratis</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4" variant="secondary">
            Monitorea tus pagos Yape en tiempo real
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-balance">
            Nunca pierdas un pago
            <br />
            <span className="text-primary">de tu negocio</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 text-pretty">
            PagoPing captura automáticamente las notificaciones de Yape en tu celular y las organiza en un dashboard
            fácil de usar. Perfecto para tiendas, restaurantes y negocios.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/auth/sign-up">
                Comenzar Gratis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="bg-transparent">
              <Link href="/app-release.apk" target="_blank" download>
                <Smartphone className="mr-2 h-4 w-4" />
                Descargar App para Android
              </Link>
            </Button>
          </div>
          <div className="mt-6 text-sm text-muted-foreground">
            <p>¿Tienes dudas sobre cómo instalar?</p>
            <Link href="/instalacion" className="underline hover:text-primary">
              Ver guía de instalación
            </Link>
          </div>
        </div>
      </section >

      {/* Features */}
      < section className="py-20 bg-muted/30" >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">¿Por qué PagoPing?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-0 bg-card/50">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
                  <Bell className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Notificaciones Instantáneas</CardTitle>
                <CardDescription>
                  Recibe alertas inmediatas cuando te llega un pago. Con opción de voz TTS para escuchar sin mirar el
                  celular.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 bg-card/50">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
                  <Smartphone className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Múltiples Dispositivos</CardTitle>
                <CardDescription>
                  Conecta hasta 3 celulares en tu negocio. Ideal para tiendas con varios puntos de venta o empleados.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 bg-card/50">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Evita Fraudes</CardTitle>
                <CardDescription>
                  Valida cada pago con el código de operación único. Detecta automáticamente intentos de pagos
                  duplicados.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section >

      {/* How it works */}
      < section className="py-20" >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">¿Cómo funciona?</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold mb-2">Instala la App</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Descarga PagoPing en tu Android y dale permisos de notificaciones.
              </p>
              <Button size="sm" variant="outline" asChild>
                <Link href="/app-release.apk" target="_blank" download>
                  <Smartphone className="mr-2 h-3 w-3" />
                  Descargar APK
                </Link>
              </Button>
            </div>
            <div className="text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold mb-2">Recibe Pagos</h3>
              <p className="text-sm text-muted-foreground">
                Cuando te llegue un Yape, la app captura y procesa la notificación.
              </p>
            </div>
            <div className="text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold mb-2">Monitorea Todo</h3>
              <p className="text-sm text-muted-foreground">
                Ve tu historial, exporta reportes y gestiona tus ventas desde el dashboard.
              </p>
            </div>
          </div>
        </div>
      </section >

      {/* Pricing */}
      < section id="planes" className="py-20 bg-muted/30" >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Planes Simples</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
            Elige el plan que mejor se adapte a tu negocio. Puedes cambiar de plan cuando quieras.
          </p>
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <Card key={plan.name} className={`relative ${plan.highlighted ? "border-primary shadow-lg" : ""}`}>
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary">Popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground text-sm">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-6" variant={plan.highlighted ? "default" : "outline"} asChild>
                    <Link href="/auth/sign-up">Elegir Plan</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section >

      {/* CTA */}
      < section className="py-20" >
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <Zap className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">¿Listo para empezar?</h2>
            <p className="text-muted-foreground mb-8">
              Comienza gratis hoy y lleva el control de tus pagos Yape al siguiente nivel.
            </p>
            <Button size="lg" asChild>
              <Link href="/auth/sign-up">
                Crear Cuenta Gratis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section >

      {/* Footer */}
      < footer className="border-t py-8" >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <DollarSign className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">PagoPing</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2025 PagoPing. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer >
    </div >
  )
}
