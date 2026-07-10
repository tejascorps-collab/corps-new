// Isolates the Twilio Voice browser SDK. Lazy-loaded so the ~heavy SDK only
// enters the bundle when telephony is actually live-configured.
import { api } from './api'

let sdkPromise
const loadSdk = () => (sdkPromise ??= import('@twilio/voice-sdk'))

// Create and register a Twilio Device using a server-minted access token.
// Callbacks: onIncoming(call), onRegistered(), onUnregistered(), onError(err).
export async function createDevice({ onIncoming, onRegistered, onUnregistered, onError }) {
  const { Device } = await loadSdk()
  const { token } = await api.get('/telephony/token')

  const device = new Device(token, { codecPreferences: ['opus', 'pcmu'], closeProtection: true })

  device.on('registered', () => onRegistered?.())
  device.on('unregistered', () => onUnregistered?.())
  device.on('error', (e) => onError?.(e))
  device.on('incoming', (call) => onIncoming?.(call))
  device.on('tokenWillExpire', async () => {
    try { const { token: t } = await api.get('/telephony/token'); device.updateToken(t) } catch { /* ignore */ }
  })

  await device.register()
  return device
}

// Place an outbound call. Returns the Twilio Call object.
export async function deviceConnect(device, number) {
  return device.connect({ params: { To: number } })
}
