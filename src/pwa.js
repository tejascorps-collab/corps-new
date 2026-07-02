// Service worker registration.
// Registered only in production builds — a caching SW would interfere with Vite's
// dev HMR. Verify PWA behaviour via `npm run build && npm run preview`.
export function registerSW() {
  if (!('serviceWorker' in navigator)) return
  if (!import.meta.env.PROD) return
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(
      (reg) => {
        // If an updated SW is waiting, activate it on next load.
        reg.addEventListener('updatefound', () => {
          const nw = reg.installing
          if (!nw) return
          nw.addEventListener('statechange', () => {
            if (nw.state === 'installed' && navigator.serviceWorker.controller) {
              // New content available — will be used after next reload.
            }
          })
        })
      },
      (err) => console.warn('SW registration failed:', err)
    )
  })
}
