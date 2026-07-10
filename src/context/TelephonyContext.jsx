import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { seedCallLogs, telephonyProviders, sipTransports } from '../data/mockData'
import { useApp } from './AppContext'

const TelephonyContext = createContext(null)
export const useTelephony = () => useContext(TelephonyContext)

const STORAGE_KEY = 'fdi_telephony'

export const defaultConfig = {
  enabled: false,
  mode: 'sip', // 'sip' | 'api'
  sip: {
    server: 'pbx.thecorps.in',
    port: '5061',
    transport: 'WSS',
    username: 'agent01',
    password: '',
    stun: 'stun:stun.l.google.com:19302',
  },
  api: {
    provider: telephonyProviders[0],
    accountSid: '',
    authToken: '',
    callerId: '+91 80 4718 0000',
    webhook: 'https://admin.thecorps.in/api/telephony/webhook',
  },
}

const loadConfig = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultConfig
    const saved = JSON.parse(raw)
    // Merge so newly-added fields keep their defaults.
    return { ...defaultConfig, ...saved, sip: { ...defaultConfig.sip, ...saved.sip }, api: { ...defaultConfig.api, ...saved.api } }
  } catch {
    return defaultConfig
  }
}

export const fmtDuration = (s) => {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${String(sec).padStart(2, '0')}`
}

const idle = { status: 'idle', number: '', name: '', direction: 'outbound', muted: false, held: false }

export function TelephonyProvider({ children }) {
  const { pushNotification, currentUser } = useApp()

  const [config, setConfig] = useState(loadConfig)
  const [registered, setRegistered] = useState(false)
  const [agentStatus, setAgentStatus] = useState('Available')
  const [call, setCall] = useState(idle)
  const [incoming, setIncoming] = useState(null) // { number, name } while ringing
  const [seconds, setSeconds] = useState(0)
  const [callLogs, setCallLogs] = useState(seedCallLogs)

  const timers = useRef([])
  const incomingRef = useRef(null)
  const logId = useRef(1041)
  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = [] }
  const later = (fn, ms) => { timers.current.push(setTimeout(fn, ms)) }

  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(config)), [config])

  // A disabled trunk can't stay registered.
  useEffect(() => { if (!config.enabled) setRegistered(false) }, [config.enabled])

  // Tick the call timer only while a call is connected.
  useEffect(() => {
    if (call.status !== 'active' || call.held) return
    const t = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(t)
  }, [call.status, call.held])

  useEffect(() => () => clearTimers(), [])

  const saveConfig = useCallback((next) => {
    setConfig(next)
    pushNotification({ type: 'system', title: 'Telephony updated', text: `${next.mode === 'sip' ? 'SIP' : next.api.provider} configuration saved.`, tone: 'green', icon: 'Phone' })
  }, [pushNotification])

  // Simulated registration / connectivity check against the configured trunk.
  const testConnection = useCallback(() => {
    if (!config.enabled) {
      pushNotification({ type: 'system', title: 'Telephony disabled', text: 'Enable telephony before testing the connection.', tone: 'orange', icon: 'PhoneOff' })
      return Promise.resolve(false)
    }
    const missing = config.mode === 'sip'
      ? !config.sip.server || !config.sip.username
      : !config.api.accountSid || !config.api.authToken
    return new Promise((resolve) => {
      later(() => {
        if (missing) {
          setRegistered(false)
          pushNotification({ type: 'system', title: 'Registration failed', text: config.mode === 'sip' ? 'SIP server and username are required.' : 'API credentials are required.', tone: 'red', icon: 'PhoneOff' })
          resolve(false)
        } else {
          setRegistered(true)
          pushNotification({ type: 'system', title: 'Registered', text: config.mode === 'sip' ? `SIP registered to ${config.sip.server}` : `${config.api.provider} API connected.`, tone: 'green', icon: 'PhoneCall' })
          resolve(true)
        }
      }, 900)
    })
  }, [config, pushNotification])

  const logCall = useCallback((entry) => {
    const id = `CL-${++logId.current}`
    setCallLogs((l) => [{ id, agent: currentUser?.name || 'You', when: 'just now', ...entry }, ...l])
  }, [currentUser])

  // Outbound call: dialing → ringing → connected. Mirrors a real softphone's states.
  const placeCall = useCallback((number, name = '') => {
    if (!config.enabled) {
      pushNotification({ type: 'system', title: 'Telephony disabled', text: 'Enable and configure telephony in Settings first.', tone: 'orange', icon: 'PhoneOff' })
      return false
    }
    if (!registered) {
      pushNotification({ type: 'system', title: 'Not registered', text: 'Run “Test Connection” in Settings to register the trunk.', tone: 'orange', icon: 'PhoneOff' })
      return false
    }
    if (call.status !== 'idle') {
      pushNotification({ type: 'system', title: 'Call in progress', text: 'End the current call before dialling another.', tone: 'orange', icon: 'PhoneCall' })
      return false
    }
    if (!number.trim()) return false

    clearTimers()
    setSeconds(0)
    setCall({ ...idle, status: 'dialing', number, name, direction: 'outbound' })
    later(() => setCall((c) => (c.status === 'dialing' ? { ...c, status: 'ringing' } : c)), 1200)
    later(() => {
      setCall((c) => {
        if (c.status !== 'ringing') return c
        setAgentStatus('On Call')
        return { ...c, status: 'active' }
      })
    }, 3000)
    return true
  }, [config.enabled, registered, call.status, pushNotification])

  const hangup = useCallback(() => {
    clearTimers()
    setCall((c) => {
      if (c.status === 'idle') return c
      const answered = c.status === 'active'
      logCall({
        name: c.name || 'Unknown',
        number: c.number,
        direction: c.direction,
        status: answered ? 'Answered' : 'Missed',
        duration: answered ? seconds : 0,
      })
      pushNotification({
        type: 'system',
        title: answered ? 'Call ended' : 'Call cancelled',
        text: answered ? `${c.name || c.number} · ${fmtDuration(seconds)}` : `${c.name || c.number}`,
        tone: answered ? 'blue' : 'orange',
        icon: 'PhoneOff',
      })
      return idle
    })
    setSeconds(0)
    setAgentStatus((s) => (s === 'On Call' ? 'Available' : s))
  }, [seconds, logCall, pushNotification])

  const toggleMute = useCallback(() => setCall((c) => (c.status === 'active' ? { ...c, muted: !c.muted } : c)), [])
  const toggleHold = useCallback(() => setCall((c) => (c.status === 'active' ? { ...c, held: !c.held } : c)), [])

  const transferCall = useCallback((to) => {
    if (call.status !== 'active' || !to.trim()) return
    pushNotification({ type: 'system', title: 'Call transferred', text: `${call.name || call.number} → ${to}`, tone: 'purple', icon: 'PhoneForwarded' })
    hangup()
  }, [call, hangup, pushNotification])

  // ---------- Inbound ----------
  // A real trunk pushes ringing events; here we surface one for the agent to
  // accept or decline. Auto-declines (busy) if a call is already in progress.
  const ringInbound = useCallback((number, name = '') => {
    if (!config.enabled || !registered) return false
    if (call.status !== 'idle' || incoming) {
      logCall({ name: name || 'Unknown', number, direction: 'inbound', status: 'Missed', duration: 0 })
      pushNotification({ type: 'system', title: 'Missed call (busy)', text: `${name || number}`, tone: 'red', icon: 'PhoneMissed' })
      return false
    }
    const inc = { number, name }
    setIncoming(inc)
    incomingRef.current = inc
    pushNotification({ type: 'system', title: 'Incoming call', text: `${name || number} is calling…`, tone: 'gold', icon: 'PhoneIncoming' })
    // Auto-miss if still ringing after 12s.
    later(() => {
      if (incomingRef.current === inc) {
        incomingRef.current = null
        setIncoming(null)
        logCall({ name: name || 'Unknown', number, direction: 'inbound', status: 'Missed', duration: 0 })
        pushNotification({ type: 'system', title: 'Missed call', text: `${name || number}`, tone: 'red', icon: 'PhoneMissed' })
      }
    }, 12000)
    return true
  }, [config.enabled, registered, call.status, incoming, logCall, pushNotification])

  const acceptCall = useCallback(() => {
    if (!incoming) return
    clearTimers()
    incomingRef.current = null
    setIncoming(null)
    setSeconds(0)
    setAgentStatus('On Call')
    setCall({ ...idle, status: 'active', number: incoming.number, name: incoming.name, direction: 'inbound' })
  }, [incoming])

  const declineCall = useCallback(() => {
    if (!incoming) return
    clearTimers()
    incomingRef.current = null
    setIncoming(null)
    logCall({ name: incoming.name || 'Unknown', number: incoming.number, direction: 'inbound', status: 'Missed', duration: 0 })
    pushNotification({ type: 'system', title: 'Call declined', text: `${incoming.name || incoming.number}`, tone: 'orange', icon: 'PhoneOff' })
  }, [incoming, logCall, pushNotification])

  const value = {
    config, setConfig, saveConfig, defaultConfig,
    registered, testConnection,
    agentStatus, setAgentStatus,
    call, seconds, placeCall, hangup, toggleMute, toggleHold, transferCall,
    incoming, ringInbound, acceptCall, declineCall,
    callLogs, logCall,
    providers: telephonyProviders, transports: sipTransports,
    onCall: call.status !== 'idle',
  }

  return <TelephonyContext.Provider value={value}>{children}</TelephonyContext.Provider>
}
