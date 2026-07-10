// Thin API client for the FDI Prime backend.
// In production the SPA and API share an origin, so the base is a relative
// "/api" (nginx proxies it). For local dev set VITE_API_URL (e.g. the dev
// server on http://localhost:4100).
const BASE = import.meta.env.VITE_API_URL || '/api'

const TOKEN_KEY = 'fdi_token'
export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const setToken = (t) => (t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY))

let onUnauthorized = null
export const setUnauthorizedHandler = (fn) => { onUnauthorized = fn }

export class ApiError extends Error {
  constructor(message, status) { super(message); this.status = status }
}

async function request(method, path, body) {
  let res
  try {
    res = await fetch(BASE + path, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      },
      body: body != null ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError('Network error — is the API running?', 0)
  }
  if (res.status === 401) {
    setToken(null)
    if (onUnauthorized) onUnauthorized()
    throw new ApiError('Not authenticated', 401)
  }
  if (res.status === 204) return null
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new ApiError(data.error || `Request failed (${res.status})`, res.status)
  return data
}

export const api = {
  get: (p) => request('GET', p),
  post: (p, b) => request('POST', p, b),
  patch: (p, b) => request('PATCH', p, b),
  del: (p) => request('DELETE', p),
}
