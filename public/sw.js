// PagoPing Service Worker v1.0.0
const CACHE_NAME = "pagoping-cache-v1"

const STATIC_ASSETS = [
  "/",
  "/favicon.ico",
  "/apple-icon.png",
  "/icon-192.png",
  "/icon-512.png",
  "/logo.png",
  "/logo-dark.png",
  "/manifest.json",
]

// Install event - Cache core static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn("[SW] Core asset caching failed:", err)
      })
    })
  )
  self.skipWaiting()
})

// Activate event - Clean up obsolete caches and claim clients
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    }).then(() => self.clients.claim())
  )
})

// Fetch event
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url)

  // Skip cross-origin requests
  if (url.origin !== self.location.origin) return

  // Always use network for API requests and Supabase requests
  if (url.pathname.startsWith("/api/") || url.pathname.includes("supabase")) {
    return
  }

  // For navigation (HTML pages)
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .catch(async () => {
          const cached = await caches.match(event.request)
          if (cached) return cached
          return caches.match("/dashboard") || caches.match("/")
        })
    )
    return
  }

  // Cache-first for images, fonts, and static assets
  if (
    event.request.destination === "image" ||
    event.request.destination === "font" ||
    url.pathname.match(/\.(png|jpg|jpeg|svg|ico|webp|woff2|css)$/)
  ) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          // Stale-while-revalidate in background
          fetch(event.request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse))
              }
            })
            .catch(() => {})
          return cachedResponse
        }

        return fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone))
          }
          return networkResponse
        })
      })
    )
    return
  }

  // Network-first for everything else
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  )
})
