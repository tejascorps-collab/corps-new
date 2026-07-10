import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { seedCallLogs, telephonyProviders, sipTransports } from '../data/mockData'
import { api } from '../lib/api'
import { createDevice, deviceConnect } from '../lib/twilioDevice'
import { useApp } from './AppContext'

const TelephonyContext = createContext(null)
export const useTelephony = () => useContext(TelephonyContext)

const STATUS_KEY = 'fdi_agent_status'

const fmtWhen = (iso) => {
  try {
    const d = new Date(iso)
    return `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}`
  } catch { return 'recently' }
}

export const fmtDuration = (s) => {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${String(sec).padStart(2, '0')}`
}

// Client-side view of the server telephony config (secrets never sent down).
const emptyConfig = {
  enabled: false, mode: 'api', provider: 'Twilio', callerId: '',
  accountSid: '', hasApiKey: false, hasApiSecret: false, twimlAppSid: '',
  sipServer: '', sipPort: '5061', sipTransport: 'WSS', sipUsername: '', hasSipPassword: false,
  live: false, identity: 'agent',
}

const idle = { status: 'idle', number: '', name: '', direction: 'outbound', muted: false, held: false }

export function TelephonyProvider({ children }) {
  const { pushNotification, currentUser } = useApp()

  const [config, setConfigState] = useState(emptyConfig)
  const [deviceReady, setDeviceReady] = useState(false) // real Twilio Device registered
  const [agentStatus, setAgentStatus] = useState(() => localStorage.getItem(STATUS_KEY) || 'Available')
  const [call, setCall] = useState(idle)
  const [incoming, setIncoming] = useState(null)
  const [seconds, setSeconds] = useState(0)
  const [callLogs, setCallLogs] = useState(seedCallLogs)

  const timers = useRef([])
  const incomingRef = useRef(null)
  const logId = useRef(1041)
  const deviceRef = useRef(null)     // Twilio Device (live mode)
  const twCallRef = useRef(null)     // active Twilio Call
  const twIncomingRef = useRef(null) // pending inbound Twilio Call
  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = [] }
  const later = (fn, ms) => { timers.current.push(setTimeout(fn, ms)) }

  const live = config.live
  // In live mode readiness comes from the Twilio Device; in simulation, enabling is enough.
  const registered = live ? deviceReady : config.enabled

  useEffect(() => localStorage.setItem(STATUS_KEY, agentStatus), [agentStatus])

  // Tick the call timer while connected (both modes).
  useEffect(() => {
    if (call.status !== 'active' || call.held) return
    const t = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(t)
  }, [call.status, call.held])

  useEffect(() => () => clearTimers(), [])

  const refreshLogs = useCallback(() => {
    api.get('/call-logs')
      .then((rows) => { if (rows?.length) setCallLogs(rows.map((c) => ({ ...c, when: c.when || fmtWhen(c.createdAt) }))) })
      .catch(() => {})
  }, [])

  // Load server config + call history on sign-in.
  useEffect(() => {
    if (!currentUser) return
    let alive = true
    api.get('/telephony/config').then((c) => { if (alive) setConfigState({ ...emptyConfig, ...c }) }).catch(() => {})
    refreshLogs()
    return () => { alive = false }
  }, [currentUser, refreshLogs])

  const logCall = useCallback((entry) => {
    const tmpId = `CL-tmp-${++logId.current}`
    const agent = currentUser?.name || 'You'
    setCallLogs((l) => [{ id: tmpId, agent, when: 'just now', ...entry }, ...l])
    api.post('/call-logs', { ...entry, agent })
      .then((saved) => setCallLogs((l) => l.map((x) => (x.id === tmpId ? { ...saved, when: 'just now' } : x))))
      .catch(() => {})
  }, [currentUser])

  // ---------- Live (Twilio) device lifecycle ----------
  const endLiveCall = useCallback((finalStatus) => {
    setCall((c) => {
      if (c.status === 'idle') return c
      pushNotification({ type: 'system', title: finalStatus === 'Answered' ? 'Call ended' : 'Call ended', text: c.name || c.number, tone: 'blue', icon: 'PhoneOff' })
      return idle
    })
    setSeconds(0)
    setAgentStatus((s) => (s === 'On Call' ? 'Available' : s))
    twCallRef.current = null
    // The server logs live calls via the status webhook; pull the fresh history.
    later(refreshLogs, 1500)
  }, [pushNotification, refreshLogs])

  const wireTwilioCall = useCallback((twCall) => {
    twCallRef.current = twCall
    twCall.on('ringing', () => setCall((c) => (c.status === 'dialing' ? { ...c, status: 'ringing' } : c)))
    twCall.on('accept', () => { setSeconds(0); setAgentStatus('On Call'); setCall((c) => ({ ...c, status: 'active' })) })
    twCall.on('disconnect', () => endLiveCall('Answered'))
    twCall.on('cancel', () => endLiveCall('Missed'))
    twCall.on('reject', () => endLiveCall('Missed'))
    twCall.on('error', () => endLiveCall('Missed'))
  }, [endLiveCall])

  // Build the Twilio Device when telephony goes live.
  useEffect(() => {
    if (!live || !currentUser) { setDeviceReady(false); return }
    let disposed = false
    createDevice({
      onRegistered: () => { if (!disposed) setDeviceReady(true) },
      onUnregistered: () => { if (!disposed) setDeviceReady(false) },
      onError: (e) => { if (!disposed) { setDeviceReady(false); pushNotification({ type: 'system', title: 'Telephony error', text: e?.message || 'Device error', tone: 'red', icon: 'PhoneOff' }) } },
      onIncoming: (twCall) => {
        if (disposed) return
        const from = twCall.parameters?.From || 'Unknown'
        twIncomingRef.current = twCall
        setIncoming({ number: from, name: '' })
        twCall.on('cancel', () => { twIncomingRef.current = null; setIncoming(null) })
        pushNotification({ type: 'system', title: 'Incoming call', text: `${from} is calling…`, tone: 'gold', icon: 'PhoneIncoming' })
      },
    })
      .then((device) => { if (disposed) { device.destroy?.() } else { deviceRef.current = device } })
      .catch((e) => { if (!disposed) pushNotification({ type: 'system', title: 'Telephony offline', text: e?.message || 'Could not connect to Twilio.', tone: 'red', icon: 'PhoneOff' }) })
    return () => {
      disposed = true
      try { deviceRef.current?.destroy?.() } catch {}
      deviceRef.current = null
      setDeviceReady(false)
    }
  }, [live, currentUser, pushNotification])

  // ---------- Config management (server-side) ----------
  const saveConfig = useCallback(async (patch) => {
    const updated = await api.put('/telephony/config', patch)
    setConfigState({ ...emptyConfig, ...updated })
    pushNotification({ type: 'system', title: 'Telephony updated', text: updated.live ? 'Live telephony configured.' : 'Configuration saved.', tone: 'green', icon: 'Phone' })
    return updated
  }, [pushNotification])

  const testConnection = useCallback(async () => {
    try {
      const res = await api.post('/telephony/verify')
      pushNotification({
        type: 'system',
        title: res.ok ? 'Connection OK' : 'Check failed',
        text: res.ok ? (res.detail || 'Provider reachable.') : (res.error || 'Verification failed.'),
        tone: res.ok ? 'green' : 'red',
        icon: res.ok ? 'PhoneCall' : 'PhoneOff',
      })
      return res.ok
    } catch (e) {
      pushNotification({ type: 'system', title: 'Check failed', text: e?.message || 'Could not verify.', tone: 'red', icon: 'PhoneOff' })
      return false
    }
  }, [pushNotification])

  // ---------- Outbound ----------
  const placeCall = useCallback((number, name = '') => {
    if (!config.enabled) {
      pushNotification({ type: 'system', title: 'Telephony disabled', text: 'Enable and configure telephony in Settings first.', tone: 'orange', icon: 'PhoneOff' })
      return false
    }
    if (!registered) {
      pushNotification({ type: 'system', title: live ? 'Not connected' : 'Not ready', text: live ? 'Twilio device is still connecting.' : 'Run “Test Connection” in Settings.', tone: 'orange', icon: 'PhoneOff' })
      return false
    }
    if (call.status !== 'idle') {
      pushNotification({ type: 'system', title: 'Call in progress', text: 'End the current call first.', tone: 'orange', icon: 'PhoneCall' })
      return false
    }
    if (!number.trim()) return false

    clearTimers()
    setSeconds(0)
    setCall({ ...idle, status: 'dialing', number, name, direction: 'outbound' })

    if (live && deviceRef.current) {
      deviceConnect(deviceRef.current, number)
        .then((twCall) => wireTwilioCall(twCall))
        .catch((e) => { pushNotification({ type: 'system', title: 'Call failed', text: e?.message || 'Could not place call.', tone: 'red', icon: 'PhoneOff' }); setCall(idle) })
    } else {
      // Simulation
      later(() => setCall((c) => (c.status === 'dialing' ? { ...c, status: 'ringing' } : c)), 1200)
      later(() => setCall((c) => { if (c.status !== 'ringing') return c; setAgentStatus('On Call'); return { ...c, status: 'active' } }), 3000)
    }
    return true
  }, [config.enabled, registered, live, call.status, pushNotification, wireTwilioCall])

  const hangup = useCallback(() => {
    clearTimers()
    if (live) {
      try { twCallRef.current?.disconnect() } catch {}
      // endLiveCall runs via the 'disconnect' event; ensure UI resets even if no active call.
      if (!twCallRef.current) { setCall(idle); setSeconds(0) }
      return
    }
    // Simulation
    setCall((c) => {
      if (c.status === 'idle') return c
      const answered = c.status === 'active'
      logCall({ name: c.name || 'Unknown', number: c.number, direction: c.direction, status: answered ? 'Answered' : 'Missed', duration: answered ? seconds : 0 })
      pushNotification({ type: 'system', title: answered ? 'Call ended' : 'Call cancelled', text: answered ? `${c.name || c.number} · ${fmtDuration(seconds)}` : `${c.name || c.number}`, tone: answered ? 'blue' : 'orange', icon: 'PhoneOff' })
      return idle
    })
    setSeconds(0)
    setAgentStatus((s) => (s === 'On Call' ? 'Available' : s))
  }, [live, seconds, logCall, pushNotification])

  const toggleMute = useCallback(() => {
    setCall((c) => {
      if (c.status !== 'active') return c
      const muted = !c.muted
      if (live) { try { twCallRef.current?.mute(muted) } catch {} }
      return { ...c, muted }
    })
  }, [live])

  // Hold has no native Twilio Voice SDK equivalent — UI-only in live mode.
  const toggleHold = useCallback(() => setCall((c) => (c.status === 'active' ? { ...c, held: !c.held } : c)), [])

  const transferCall = useCallback((to) => {
    if (call.status !== 'active' || !to.trim()) return
    pushNotification({ type: 'system', title: 'Call transferred', text: `${call.name || call.number} → ${to}`, tone: 'purple', icon: 'PhoneForwarded' })
    hangup()
  }, [call, hangup, pushNotification])

  // ---------- Inbound ----------
  // Simulated inbound (demo). Live inbound arrives via the Twilio Device 'incoming' event.
  const ringInbound = useCallback((number, name = '') => {
    if (!config.enabled || !registered || live) return false
    if (call.status !== 'idle' || incoming) {
      logCall({ name: name || 'Unknown', number, direction: 'inbound', status: 'Missed', duration: 0 })
      pushNotification({ type: 'system', title: 'Missed call (busy)', text: `${name || number}`, tone: 'red', icon: 'PhoneMissed' })
      return false
    }
    const inc = { number, name }
    setIncoming(inc)
    incomingRef.current = inc
    pushNotification({ type: 'system', title: 'Incoming call', text: `${name || number} is calling…`, tone: 'gold', icon: 'PhoneIncoming' })
    later(() => {
      if (incomingRef.current === inc) {
        incomingRef.current = null
        setIncoming(null)
        logCall({ name: name || 'Unknown', number, direction: 'inbound', status: 'Missed', duration: 0 })
        pushNotification({ type: 'system', title: 'Missed call', text: `${name || number}`, tone: 'red', icon: 'PhoneMissed' })
      }
    }, 12000)
    return true
  }, [config.enabled, registered, live, call.status, incoming, logCall, pushNotification])

  const acceptCall = useCallback(() => {
    if (!incoming) return
    clearTimers()
    incomingRef.current = null
    const inc = incoming
    setIncoming(null)
    setSeconds(0)
    setAgentStatus('On Call')
    if (live && twIncomingRef.current) {
      const twCall = twIncomingRef.current
      twIncomingRef.current = null
      wireTwilioCall(twCall)
      try { twCall.accept() } catch {}
      setCall({ ...idle, status: 'active', number: inc.number, name: inc.name, direction: 'inbound' })
    } else {
      setCall({ ...idle, status: 'active', number: inc.number, name: inc.name, direction: 'inbound' })
    }
  }, [incoming, live, wireTwilioCall])

  const declineCall = useCallback(() => {
    if (!incoming) return
    clearTimers()
    incomingRef.current = null
    const inc = incoming
    setIncoming(null)
    if (live && twIncomingRef.current) {
      try { twIncomingRef.current.reject() } catch {}
      twIncomingRef.current = null
      later(refreshLogs, 1500)
    } else {
      logCall({ name: inc.name || 'Unknown', number: inc.number, direction: 'inbound', status: 'Missed', duration: 0 })
    }
    pushNotification({ type: 'system', title: 'Call declined', text: `${inc.name || inc.number}`, tone: 'orange', icon: 'PhoneOff' })
  }, [incoming, live, logCall, refreshLogs, pushNotification])

  const value = {
    config, saveConfig, testConnection,
    live, registered,
    agentStatus, setAgentStatus,
    call, seconds, placeCall, hangup, toggleMute, toggleHold, transferCall,
    incoming, ringInbound, acceptCall, declineCall,
    callLogs, logCall, refreshLogs,
    providers: telephonyProviders, transports: sipTransports,
    onCall: call.status !== 'idle',
  }

  return <TelephonyContext.Provider value={value}>{children}</TelephonyContext.Provider>
}
