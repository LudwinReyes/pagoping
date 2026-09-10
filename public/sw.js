// PagoPing Service Worker v1.0.1
const CACHE_NAME = "pagoping-cache-v2"

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
  // 1. Only handle GET requests; never intercept POST, PUT, DELETE, etc.
  if (event.request.method !== "GET") return

  const url = new URL(event.request.url)

  // 2. Skip cross-origin requests
  if (url.origin !== self.location.origin) return

  // 3. Skip API requests, Supabase requests, and Next.js RSC requests
  if (
    url.pathname.startsWith("/api/") ||
    url.pathname.includes("supabase") ||
    url.searchParams.has("_rsc")
  ) {
    return
  }

  // 4. For navigation (HTML pages)
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(async () => {
        const cached = await caches.match(event.request)
        if (cached) return cached

        const dashboardCached = await caches.match("/dashboard")
        if (dashboardCached) return dashboardCached

        const homeCached = await caches.match("/")
        if (homeCached) return homeCached

        return new Response("Offline", {
          status: 503,
          statusText: "Offline",
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        })
      })
    )
    return
  }

  // 5. Cache-first for images, fonts, and static assets
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

        return fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseClone = networkResponse.clone()
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone))
            }
            return networkResponse
          })
          .catch(async () => {
            const fallback = await caches.match(event.request)
            if (fallback) return fallback
            return new Response(null, { status: 404, statusText: "Not Found" })
          })
      })
    )
    return
  }

  // 6. Network-first for everything else
  event.respondWith(
    fetch(event.request).catch(async () => {
      const cached = await caches.match(event.request)
      if (cached) return cached
      return new Response(null, { status: 504, statusText: "Gateway Timeout" })
    })
  )
})
