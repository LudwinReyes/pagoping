import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowLeft,
  BellRing,
  Camera,
  Database,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Smartphone,
  Trash2,
  Users,
} from "lucide-react"

import { Logo } from "@/components/logo"

export const metadata: Metadata = {
  title: "Política de Privacidad | PagoPing",
  description: "Conoce cómo PagoPing recopila, utiliza, protege y elimina los datos de sus usuarios.",
  alternates: {
    canonical: "https://pagoping.tunkitek.lat/privacidad",
  },
}

const sections = [
  { id: "datos", label: "Datos que tratamos" },
  { id: "uso", label: "Cómo los utilizamos" },
  { id: "proveedores", label: "Proveedores" },
  { id: "seguridad", label: "Seguridad y conservación" },
  { id: "eliminacion", label: "Eliminar tus datos" },
]

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-border/70 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href="/" aria-label="Volver a PagoPing">
            <Logo size="sm" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2 text-sm font-medium transition-colors hover:border-primary/40 hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
        <section className="relative overflow-hidden rounded-3xl border border-primary/15 bg-card p-6 shadow-sm sm:p-10">
          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary">
              <ShieldCheck className="h-4 w-4" />
              Tus datos, con transparencia
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">Política de Privacidad</h1>
            <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg">
              Esta política explica cómo PagoPing, operado por Ludwin Reyes, recopila, utiliza, almacena y protege
              información cuando utilizas nuestro sitio web y la aplicación móvil PagoPing.
            </p>
            <p className="mt-5 text-sm font-medium text-muted-foreground">Última actualización: 11 de septiembre de 2026</p>
          </div>
        </section>

        <nav aria-label="Contenido de la política" className="my-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="rounded-xl border border-border bg-card px-3 py-3 text-sm font-medium transition-colors hover:border-primary/40 hover:text-primary"
            >
              {section.label}
            </a>
          ))}
        </nav>

        <div className="space-y-6">
          <PolicySection id="datos" icon={Database} title="1. Datos que recopilamos y tratamos">
            <p>PagoPing trata únicamente la información necesaria para prestar sus funciones:</p>
            <ul>
              <li><strong>Cuenta y negocio:</strong> correo electrónico, número de celular, nombre del titular, nombre del negocio y datos de suscripción.</li>
              <li><strong>Colaboradores:</strong> nombre, celular, estado de acceso y relación con la cuenta del negocio.</li>
              <li><strong>Pagos:</strong> nombre mostrado del remitente, importe, código de operación, fecha, hora y texto de la notificación de pago procesada.</li>
              <li><strong>Dispositivo:</strong> identificador de la instalación, nombre o modelo del dispositivo, estado, última actividad y token de notificaciones.</li>
              <li><strong>Contenido proporcionado:</strong> imagen QR de cobro cuando el titular decide cargarla.</li>
              <li><strong>Datos técnicos:</strong> dirección IP, navegador, registros de seguridad y métricas básicas de funcionamiento del sitio.</li>
            </ul>
          </PolicySection>

          <PolicySection id="permisos" icon={Smartphone} title="2. Permisos de la aplicación móvil">
            <div className="grid gap-4 sm:grid-cols-3">
              <Permission icon={BellRing} title="Notificaciones" text="Con tu autorización, PagoPing accede a las notificaciones para detectar y procesar avisos de pago compatibles. No comercializamos su contenido." />
              <Permission icon={Camera} title="Cámara" text="Se utiliza cuando decides escanear un código QR. PagoPing no graba video ni utiliza la cámara en segundo plano." />
              <Permission icon={Users} title="Colaboradores" text="Permite asociar las cuentas y dispositivos autorizados por el dueño del negocio." />
            </div>
          </PolicySection>

          <PolicySection id="uso" icon={ShieldCheck} title="3. Cómo utilizamos la información">
            <ul>
              <li>Crear y proteger cuentas, autenticar usuarios y administrar suscripciones.</li>
              <li>Detectar, registrar y mostrar pagos asociados al negocio.</li>
              <li>Emitir alertas visuales, sonoras y notificaciones push.</li>
              <li>Gestionar colaboradores, dispositivos autorizados e historial de ventas.</li>
              <li>Prevenir duplicados, fraude, abuso y accesos no autorizados.</li>
              <li>Atender soporte, solicitudes de privacidad y obligaciones legales.</li>
            </ul>
            <p>PagoPing no vende ni alquila datos personales y no utiliza el contenido de los pagos para publicidad personalizada.</p>
          </PolicySection>

          <PolicySection id="proveedores" icon={Database} title="4. Proveedores que procesan información">
            <p>Utilizamos proveedores tecnológicos que procesan información para prestar el servicio:</p>
            <ul>
              <li><strong>Supabase:</strong> autenticación, base de datos, almacenamiento y funciones de servidor.</li>
              <li><strong>Google Firebase Cloud Messaging:</strong> entrega de notificaciones a los dispositivos.</li>
              <li><strong>Vercel:</strong> alojamiento del sitio web y métricas técnicas de disponibilidad y uso.</li>
              <li><strong>Google Play:</strong> distribución, seguridad y diagnóstico de la aplicación Android.</li>
            </ul>
            <p>Estos proveedores pueden procesar información fuera de Perú conforme a sus términos y medidas de protección. PagoPing no comparte datos con terceros para que los comercialicen.</p>
          </PolicySection>

          <PolicySection id="seguridad" icon={LockKeyhole} title="5. Seguridad y conservación">
            <p>
              Aplicamos conexiones cifradas HTTPS, controles de acceso por usuario, permisos por rol y reglas de seguridad en la base de datos. Ningún sistema es infalible, pero limitamos el acceso a la información a lo necesario para operar y proteger PagoPing.
            </p>
            <p>
              Conservamos los datos mientras la cuenta permanezca activa o sean necesarios para prestar el servicio. Después de una solicitud de eliminación verificada, eliminaremos o anonimizaremos los datos asociados en un plazo de hasta 30 días, salvo información que debamos conservar por obligación legal, prevención de fraude o resolución de controversias. Las copias de respaldo pueden tardar hasta 90 días adicionales en desaparecer.
            </p>
          </PolicySection>

          <PolicySection id="eliminacion" icon={Trash2} title="6. Acceso, corrección y eliminación de datos">
            <p>
              Puedes solicitar acceso, corrección o eliminación de tu cuenta y sus datos escribiendo desde el correo registrado a
              {" "}<a className="font-semibold text-primary underline underline-offset-4" href="mailto:ludwintac@gmail.com?subject=Solicitud%20de%20privacidad%20PagoPing">ludwintac@gmail.com</a>.
              Indica el nombre del negocio y el tipo de solicitud. Antes de atenderla podremos pedirte una verificación razonable de identidad.
            </p>
            <a
              href="mailto:ludwintac@gmail.com?subject=Solicitud%20de%20eliminaci%C3%B3n%20de%20cuenta%20PagoPing&body=Solicito%20eliminar%20mi%20cuenta%20PagoPing.%0A%0ACorreo%20registrado%3A%0ANombre%20del%20negocio%3A"
              className="mt-2 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Trash2 className="h-4 w-4" />
              Solicitar eliminación de cuenta
            </a>
          </PolicySection>

          <PolicySection id="menores" icon={Users} title="7. Menores de edad">
            <p>PagoPing es una herramienta comercial dirigida a personas mayores de 18 años. No está diseñada para menores ni recopilamos intencionalmente información de menores de edad.</p>
          </PolicySection>

          <PolicySection id="cambios" icon={BellRing} title="8. Cambios y contacto">
            <p>Podemos actualizar esta política cuando cambien las funciones, proveedores o requisitos legales. Publicaremos la versión vigente en esta misma dirección e indicaremos su fecha de actualización.</p>
            <p>
              Para consultas sobre privacidad, escríbenos a
              {" "}<a className="font-semibold text-primary underline underline-offset-4" href="mailto:ludwintac@gmail.com"><Mail className="mr-1 inline h-4 w-4" />ludwintac@gmail.com</a>.
            </p>
          </PolicySection>
        </div>

        <footer className="mt-10 border-t border-border py-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} PagoPing · Perú</p>
          <p className="mt-2">PagoPing es una herramienta independiente y no está afiliada a Yape ni al Banco de Crédito del Perú.</p>
        </footer>
      </main>
    </div>
  )
}

function PolicySection({
  id,
  icon: Icon,
  title,
  children,
}: {
  id: string
  icon: typeof ShieldCheck
  title: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-24 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </span>
        <h2 className="text-xl font-bold tracking-tight sm:text-2xl">{title}</h2>
      </div>
      <div className="space-y-4 text-base leading-7 text-muted-foreground [&_li]:pl-1 [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:ml-5 [&_ul]:list-disc [&_ul]:space-y-2">
        {children}
      </div>
    </section>
  )
}

function Permission({ icon: Icon, title, text }: { icon: typeof Camera; title: string; text: string }) {
  return (
    <div className="rounded-xl border border-border/70 bg-background p-4">
      <Icon className="mb-3 h-5 w-5 text-primary" />
      <h3 className="font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-6">{text}</p>
    </div>
  )
}
