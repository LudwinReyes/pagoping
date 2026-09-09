import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PagoPing - Validador de Pagos Yape",
    short_name: "PagoPing",
    description: "Monitorea y valida notificaciones de pagos Yape en tiempo real para tu negocio.",
    start_url: "/dashboard",
    scope: "/",
    display: "standalone",
    display_override: ["standalone", "window-controls-overlay"],
    orientation: "portrait",
    background_color: "#121212",
    theme_color: "#8e44ad",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/icon-light-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    categories: ["finance", "business", "productivity"],
    shortcuts: [
      {
        name: "Dashboard de Ventas",
        short_name: "Ventas",
        description: "Revisa las ventas y pagos del día",
        url: "/dashboard",
        icons: [{ src: "/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Guía de Instalación",
        short_name: "Instalación",
        description: "Pasos para vincular celular con la app",
        url: "/instalacion",
        icons: [{ src: "/icon-192.png", sizes: "192x192" }],
      },
    ],
  }
}
