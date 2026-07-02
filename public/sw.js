/* FDI Prime Investments — Service Worker
   Offline app-shell caching + Web Push scaffolding. */
const CACHE = 'fdi-prime-v1'
const SHELL = ['/', '/index.html', '/logo.svg', '/icon-maskable.svg', '/manifest.webmanifest']

// ---------- Install: precache app shell ----------
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())
  )
})

// ---------- Activate: clean old caches ----------
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

// ---------- Fetch: navigations network-first (offline SPA), assets stale-while-revalidate ----------
self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return
  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return // let cross-origin (fonts) hit network directly

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('/index.html').then((r) => r || caches.match('/')))
    )
    return
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((res) => {
          if (res && res.status === 200 && res.type === 'basic') {
            const copy = res.clone()
            caches.open(CACHE).then((c) => c.put(request, copy))
          }
          return res
        })
        .catch(() => cached)
      return cached || network
    })
  )
})

// ---------- Web Push: show notification from server payload ----------
self.addEventListener('push', (event) => {
  let payload = { title: 'FDI Prime Investments', body: 'You have a new notification.', url: '/' }
  try {
    if (event.data) payload = { ...payload, ...event.data.json() }
  } catch (e) {
    if (event.data) payload.body = event.data.text()
  }
  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: '/logo.svg',
      badge: '/logo.svg',
      tag: payload.tag,
      data: { url: payload.url || '/' },
      vibrate: [80, 40, 80],
    })
  )
})

// ---------- Notification click: focus/open the app at the target URL ----------
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const target = (event.notification.data && event.notification.data.url) || '/'
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if ('focus' in client) {
          if ('navigate' in client) client.navigate(target).catch(() => {})
          return client.focus()
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(target)
    })
  )
})

// ---------- Allow the page to activate a waiting SW immediately ----------
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting()
})
