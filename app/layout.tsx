import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "next-themes"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"
import { PWAProvider } from "@/components/pwa-provider"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PagoPing - Monitorea tus pagos Yape en tiempo real",
  description:
    "PagoPing captura automáticamente las notificaciones de Yape en tu celular y las organiza en un dashboard fácil de usar. Perfecto para tiendas, restaurantes y negocios.",
  keywords: ["yape", "pagos", "notificaciones", "monitoreo", "negocio", "ventas", "perú", "pwa"],
  generator: "v0.app",
  applicationName: "PagoPing",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PagoPing",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "PagoPing - Monitorea tus pagos Yape",
    description: "Nunca pierdas un pago de tu negocio. Dashboard para validar pagos Yape en tiempo real.",
    type: "website",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#121212" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="manifest" href="/manifest.webmanifest" />
      </head>
      <body className={`font-sans antialiased min-h-screen bg-background text-foreground safe-area-padding`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>
            <PWAProvider>{children}</PWAProvider>
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}

