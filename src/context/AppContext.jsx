import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { seedNotifications, demoPushes } from '../data/mockData'
import { api, setToken, getToken, setUnauthorizedHandler } from '../lib/api'

const AppContext = createContext(null)
export const useApp = () => useContext(AppContext)

export function AppProvider({ children }) {
  // ---------- Auth (real API + JWT) ----------
  const [currentUser, setCurrentUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(!!getToken())
  const authed = !!currentUser

  // On load, restore the session from a stored token (if still valid).
  useEffect(() => {
    if (!getToken()) { setAuthLoading(false); return }
    let alive = true
    api.get('/auth/me')
      .then(({ user }) => { if (alive) setCurrentUser(user) })
      .catch(() => { if (alive) setToken(null) })
      .finally(() => { if (alive) setAuthLoading(false) })
    return () => { alive = false }
  }, [])

  const login = useCallback(async ({ username, password }) => {
    try {
      const { token, user } = await api.post('/auth/login', { username, password })
      setToken(token)
      setCurrentUser(user)
      return true
    } catch {
      return false
    }
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setCurrentUser(null)
  }, [])

  // A 401 from any request means the session expired — drop it.
  useEffect(() => { setUnauthorizedHandler(() => setCurrentUser(null)) }, [])

  const isSuperAdmin = currentUser?.role === 'super_admin'

  // ---------- Role (admin | investor | seeker) ----------
  const [role, setRole] = useState(() => localStorage.getItem('fdi_role') || 'admin')
  useEffect(() => localStorage.setItem('fdi_role', role), [role])

  // ---------- Workspace (fdi | property) ----------
  // The two business lines are separate workspaces: FDI Support and Property Trading.
  // Business modules (CRM, accounts, reports, support, settings) and the portals are shared.
  const [workspace, setWorkspace] = useState(() => localStorage.getItem('fdi_workspace') || 'fdi')
  useEffect(() => localStorage.setItem('fdi_workspace', workspace), [workspace])

  // ---------- Notifications ----------
  const [notifications, setNotifications] = useState(seedNotifications)
  const [toasts, setToasts] = useState([])
  const [pushEnabled, setPushEnabled] = useState(
    () => typeof Notification !== 'undefined' && Notification.permission === 'granted'
  )
  const idc = useRef(1000)
  const nextId = () => `dyn-${++idc.current}`

  // ---------- PWA install prompt ----------
  const [installPrompt, setInstallPrompt] = useState(null)
  const [installed, setInstalled] = useState(
    () => typeof window !== 'undefined' && window.matchMedia?.('(display-mode: standalone)').matches
  )
  useEffect(() => {
    const onBip = (e) => { e.preventDefault(); setInstallPrompt(e) }
    const onInstalled = () => { setInstallPrompt(null); setInstalled(true) }
    window.addEventListener('beforeinstallprompt', onBip)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onBip)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])
  const installApp = useCallback(async () => {
    if (!installPrompt) return
    installPrompt.prompt()
    try { await installPrompt.userChoice } catch (e) { /* ignore */ }
    setInstallPrompt(null)
  }, [installPrompt])

  // ---------- OS notification (prefers active service worker) ----------
  const osNotify = useCallback(async (n) => {
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return
    const opts = { body: n.text, icon: '/logo.svg', badge: '/logo.svg', tag: n.id, data: { url: n.to || '/' } }
    try {
      if (navigator.serviceWorker && navigator.serviceWorker.controller) {
        const reg = await navigator.serviceWorker.ready
        await reg.showNotification(n.title, opts)
      } else {
        new Notification(n.title, opts)
      }
    } catch (e) {
      /* ignore */
    }
  }, [])

  const dismissToast = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), [])

  const pushToast = useCallback(
    (toast) => {
      const id = nextId()
      setToasts((t) => [...t, { ...toast, id }])
      setTimeout(() => dismissToast(id), 5200)
    },
    [dismissToast]
  )

  const pushNotification = useCallback(
    (n) => {
      const id = nextId()
      setNotifications((list) => [{ id, read: false, when: 'just now', ...n }, ...list])
      pushToast({ title: n.title, body: n.text, tone: n.tone, icon: n.icon })
      osNotify({ ...n, id })
    },
    [pushToast, osNotify]
  )

  const enablePush = useCallback(async () => {
    if (typeof Notification === 'undefined') {
      pushToast({ title: 'Not supported', body: 'This browser has no Notification API.', tone: 'orange', icon: 'BellOff' })
      return
    }
    const perm = await Notification.requestPermission()
    setPushEnabled(perm === 'granted')
    if (perm === 'granted')
      pushNotification({ type: 'system', title: 'Notifications enabled', text: 'You will now receive push alerts.', tone: 'green', icon: 'BellRing' })
  }, [pushNotification, pushToast])

  const markRead = useCallback(
    (id) => setNotifications((l) => l.map((n) => (n.id === id ? { ...n, read: true } : n))),
    []
  )
  const markAllRead = useCallback(() => setNotifications((l) => l.map((n) => ({ ...n, read: true }))), [])
  const clearNotifications = useCallback(() => setNotifications([]), [])
  const unreadCount = notifications.filter((n) => !n.read).length

  // Fire a random demo push (simulated incoming activity)
  const sendDemoPush = useCallback(() => {
    const p = demoPushes[Math.floor(Math.random() * demoPushes.length)]
    pushNotification(p)
  }, [pushNotification])

  const value = {
    // auth
    authed,
    authLoading,
    currentUser,
    isSuperAdmin,
    login,
    logout,
    role,
    setRole,
    // workspace
    workspace,
    setWorkspace,
    notifications,
    unreadCount,
    markRead,
    markAllRead,
    clearNotifications,
    pushNotification,
    sendDemoPush,
    pushEnabled,
    enablePush,
    toasts,
    pushToast,
    dismissToast,
    // PWA install
    canInstall: !!installPrompt,
    installed,
    installApp,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
