import { Router } from 'express'
import twilio from 'twilio'
import { prisma, nextId } from '../db.js'
import { requireAuth, requireRole } from '../auth.js'

const r = Router()

// The browser softphones all register under one shared identity, so an inbound
// call can ring every on-duty agent. (Per-agent routing = future work.)
const AGENT_IDENTITY = 'agent'

const getConfig = async () => {
  let cfg = await prisma.telephonyConfig.findUnique({ where: { id: 'default' } })
  if (!cfg) cfg = await prisma.telephonyConfig.create({ data: { id: 'default' } })
  return cfg
}

// True only when everything needed for real Twilio browser calling is present.
const isLive = (c) =>
  c.enabled && c.mode === 'api' && c.provider === 'Twilio' &&
  !!(c.accountSid && c.apiKey && c.apiSecret && c.twimlAppSid && c.callerId)

// Safe projection — never leaks secrets, just flags which are set.
const publicConfig = (c) => ({
  enabled: c.enabled,
  mode: c.mode,
  provider: c.provider,
  callerId: c.callerId,
  accountSid: c.accountSid ? `${c.accountSid.slice(0, 6)}…` : '',
  hasApiKey: !!c.apiKey,
  hasApiSecret: !!c.apiSecret,
  twimlAppSid: c.twimlAppSid ? `${c.twimlAppSid.slice(0, 6)}…` : '',
  sipServer: c.sipServer,
  sipPort: c.sipPort,
  sipTransport: c.sipTransport,
  sipUsername: c.sipUsername,
  hasSipPassword: !!c.sipPassword,
  live: isLive(c),
  identity: AGENT_IDENTITY,
  updatedAt: c.updatedAt,
})

// ---- Config ----
r.get('/config', requireAuth, async (_req, res) => {
  res.json(publicConfig(await getConfig()))
})

// Save config. Secrets left blank are kept (so the UI never has to re-enter them).
r.put('/config', requireAuth, requireRole('super_admin'), async (req, res) => {
  const b = req.body || {}
  const cur = await getConfig()
  const keepIfBlank = (val, prev) => (val === undefined ? prev : (val === '' ? prev : val))
  const data = {
    enabled: typeof b.enabled === 'boolean' ? b.enabled : cur.enabled,
    mode: b.mode || cur.mode,
    provider: b.provider || cur.provider,
    accountSid: keepIfBlank(b.accountSid, cur.accountSid),
    apiKey: keepIfBlank(b.apiKey, cur.apiKey),
    apiSecret: keepIfBlank(b.apiSecret, cur.apiSecret),
    twimlAppSid: keepIfBlank(b.twimlAppSid, cur.twimlAppSid),
    callerId: b.callerId ?? cur.callerId,
    sipServer: b.sipServer ?? cur.sipServer,
    sipPort: b.sipPort ?? cur.sipPort,
    sipTransport: b.sipTransport ?? cur.sipTransport,
    sipUsername: b.sipUsername ?? cur.sipUsername,
    sipPassword: keepIfBlank(b.sipPassword, cur.sipPassword),
  }
  const saved = await prisma.telephonyConfig.update({ where: { id: 'default' }, data })
  res.json(publicConfig(saved))
})

// ---- Verify credentials against the provider ----
r.post('/verify', requireAuth, requireRole('super_admin'), async (_req, res) => {
  const c = await getConfig()
  if (!c.enabled) return res.status(400).json({ ok: false, error: 'Telephony is disabled.' })

  if (c.mode === 'sip') {
    if (!c.sipServer || !c.sipUsername) return res.json({ ok: false, error: 'SIP server and username are required.' })
    return res.json({ ok: true, detail: `SIP configured for ${c.sipServer} (registration happens in the browser).` })
  }

  // API mode → actually call Twilio to validate the credentials.
  if (!c.accountSid || !c.apiKey || !c.apiSecret) {
    return res.json({ ok: false, error: 'Account SID, API Key and API Secret are required.' })
  }
  try {
    const client = twilio(c.apiKey, c.apiSecret, { accountSid: c.accountSid })
    const acct = await client.api.v2010.accounts(c.accountSid).fetch()
    res.json({ ok: true, detail: `Connected to Twilio account “${acct.friendlyName}” (${acct.status}).` })
  } catch (e) {
    res.json({ ok: false, error: `Twilio rejected the credentials: ${e.message || 'unknown error'}` })
  }
})

// ---- Access token for the browser Voice SDK ----
r.get('/token', requireAuth, async (_req, res) => {
  const c = await getConfig()
  if (!isLive(c)) return res.status(409).json({ error: 'Telephony is not live-configured.' })
  try {
    const { AccessToken } = twilio.jwt
    const VoiceGrant = AccessToken.VoiceGrant
    const token = new AccessToken(c.accountSid, c.apiKey, c.apiSecret, { identity: AGENT_IDENTITY, ttl: 3600 })
    token.addGrant(new VoiceGrant({ outgoingApplicationSid: c.twimlAppSid, incomingAllow: true }))
    res.json({ token: token.toJwt(), identity: AGENT_IDENTITY })
  } catch (e) {
    res.status(500).json({ error: `Could not mint token: ${e.message}` })
  }
})

// ---- TwiML: how Twilio should handle a call (public; Twilio calls this) ----
r.post('/voice', async (req, res) => {
  const c = await getConfig()
  const twiml = new twilio.twiml.VoiceResponse()
  const to = (req.body?.To || '').trim()
  const isPhone = /^\+?[0-9()\-\s]{5,}$/.test(to)

  if (to && isPhone) {
    // Outbound from the browser SDK → dial the PSTN number.
    const dial = twiml.dial({ callerId: c.callerId || undefined, answerOnBridge: true })
    dial.number(to)
  } else {
    // Inbound to the Twilio number → ring the on-duty browser agents.
    const dial = twiml.dial({ answerOnBridge: true })
    dial.client(AGENT_IDENTITY)
  }
  res.type('text/xml').send(twiml.toString())
})

// ---- Status webhook: persist a call log when a call completes ----
r.post('/status', async (req, res) => {
  const p = req.body || {}
  try {
    const status = String(p.CallStatus || '').toLowerCase()
    // Only log terminal states once.
    if (['completed', 'no-answer', 'busy', 'failed', 'canceled'].includes(status)) {
      const callSid = p.CallSid || ''
      const existing = callSid ? await prisma.callLog.findFirst({ where: { callSid } }) : null
      if (!existing) {
        const direction = String(p.Direction || '').includes('inbound') ? 'inbound' : 'outbound'
        const number = direction === 'inbound' ? (p.From || '') : (p.To || '')
        const id = await nextId('callLog', 'CL', 1042)
        await prisma.callLog.create({
          data: {
            id,
            name: p.CallerName || number || 'Unknown',
            number,
            direction,
            status: status === 'completed' ? 'Answered' : status === 'no-answer' ? 'Missed' : 'Missed',
            duration: Number(p.CallDuration) || 0,
            agent: AGENT_IDENTITY,
            callSid,
          },
        })
      }
    }
  } catch (e) {
    console.error('status webhook error', e)
  }
  res.type('text/xml').send('<Response/>')
})

export default r
