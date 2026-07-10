import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader, Card, CardHeader, StatCard, Badge, Icon, Avatar, initials } from '../../components/ui/Primitives'
import { Modal, TextField } from '../../components/ui/Modal'
import { useTelephony, fmtDuration } from '../../context/TelephonyContext'
import { useApp } from '../../context/AppContext'
import { leads, agentStatuses } from '../../data/mockData'
import { downloadCsv } from '../../lib/exportCsv'

const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#']

const statusTone = { Answered: 'green', Missed: 'red', Voicemail: 'orange' }
const dirIcon = { inbound: 'PhoneIncoming', outbound: 'PhoneOutgoing' }

const agentTone = {
  Available: 'bg-brand-green/10 text-brand-green ring-brand-green/20',
  'On Call': 'bg-gold-400/10 text-gold-300 ring-gold-400/20',
  Break: 'bg-brand-orange/10 text-brand-orange ring-brand-orange/20',
  Offline: 'bg-white/5 text-slate-400 ring-white/10',
}

export default function Telephony() {
  const { pushNotification } = useApp()
  const nav = useNavigate()
  const {
    config, registered, agentStatus, setAgentStatus,
    call, seconds, placeCall, hangup, toggleMute, toggleHold, transferCall,
    ringInbound, incoming, callLogs, onCall,
  } = useTelephony()

  // Demo helper: simulate an inbound call from a random CRM lead (no real PBX wired).
  const simulateInbound = () => {
    if (!registered) {
      pushNotification({ type: 'system', title: 'Not registered', text: 'Register the trunk in Settings to receive calls.', tone: 'orange', icon: 'PhoneOff' })
      return
    }
    const withPhone = leads.filter((l) => l.phone)
    const l = withPhone[Math.floor(seconds + callLogs.length) % withPhone.length] || withPhone[0]
    ringInbound(l.phone, l.name)
  }

  const [number, setNumber] = useState('')
  const [xferOpen, setXferOpen] = useState(false)
  const [xferTo, setXferTo] = useState('')

  const stats = useMemo(() => {
    const today = callLogs.filter((c) => c.when.startsWith('Today') || c.when === 'just now')
    const answered = callLogs.filter((c) => c.status === 'Answered')
    const avg = answered.length ? Math.round(answered.reduce((n, c) => n + c.duration, 0) / answered.length) : 0
    return {
      today: today.length,
      answered: answered.length,
      missed: callLogs.filter((c) => c.status === 'Missed').length,
      avg: fmtDuration(avg),
    }
  }, [callLogs])

  // While connected the keypad sends DTMF tones instead of editing the number.
  const press = (k) => {
    if (call.status === 'active') {
      pushNotification({ type: 'system', title: 'DTMF sent', text: `Tone “${k}” sent to ${call.name || call.number}.`, tone: 'blue', icon: 'Radio' })
      return
    }
    setNumber((n) => n + k)
  }

  const dial = () => { if (placeCall(number, '')) setNumber('') }

  const callLead = (l) => placeCall(l.phone, l.name)

  const redial = (c) => placeCall(c.number, c.name)

  const doTransfer = () => {
    transferCall(xferTo)
    setXferOpen(false)
    setXferTo('')
  }

  const exportLogs = () =>
    downloadCsv('call-logs.csv', callLogs, [
      { key: 'id', label: 'Call ID' }, { key: 'name', label: 'Contact' }, { key: 'number', label: 'Number' },
      { key: 'direction', label: 'Direction' }, { key: 'status', label: 'Status' },
      { key: 'duration', label: 'Duration (s)' }, { key: 'agent', label: 'Agent' }, { key: 'when', label: 'When' },
    ])

  const trunk = config.mode === 'sip' ? `SIP · ${config.sip.server}` : `${config.api.provider} API`

  return (
    <div>
      <PageHeader title="Telephony" subtitle="Softphone, click-to-call and call history for agents" icon="Headphones">
        <span className={`chip ring-1 ${registered ? 'bg-brand-green/10 text-brand-green ring-brand-green/20' : 'bg-brand-red/10 text-brand-red ring-brand-red/20'}`}>
          <Icon name={registered ? 'PhoneCall' : 'PhoneOff'} size={12} />
          {registered ? 'Registered' : 'Not registered'}
        </span>
        <div className="relative">
          <select
            value={agentStatus}
            onChange={(e) => setAgentStatus(e.target.value)}
            className={`chip cursor-pointer appearance-none pr-7 ring-1 ${agentTone[agentStatus]}`}
          >
            {agentStatuses.map((s) => <option key={s} value={s} className="bg-ink-800 text-slate-200">{s}</option>)}
          </select>
          <Icon name="ChevronDown" size={12} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-current" />
        </div>
        <button className="btn-ghost btn-sm" onClick={simulateInbound} disabled={!config.enabled || onCall || !!incoming}><Icon name="PhoneIncoming" size={14} /> Simulate Inbound</button>
        <button className="btn-ghost btn-sm" onClick={() => nav('/settings')}><Icon name="Settings" size={14} /> Configure</button>
      </PageHeader>

      {/* Not-configured banner */}
      {!config.enabled && (
        <Card className="card-pad mb-6 border border-brand-orange/20 bg-brand-orange/[0.04]">
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-orange/10 text-brand-orange"><Icon name="PhoneOff" size={18} /></span>
              <div>
                <div className="text-sm font-semibold text-slate-100">Telephony is disabled</div>
                <div className="text-xs text-slate-400">Enable SIP or an API provider in Settings to start making calls.</div>
              </div>
            </div>
            <button className="btn-gold btn-sm" onClick={() => nav('/settings')}>Set up telephony</button>
          </div>
        </Card>
      )}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Calls Today" value={stats.today} delta={0} up icon="Phone" tint="blue" hint={trunk} />
        <StatCard label="Answered" value={stats.answered} delta={0} up icon="PhoneCall" tint="green" />
        <StatCard label="Missed" value={stats.missed} delta={0} up={false} icon="PhoneMissed" tint="red" />
        <StatCard label="Avg Duration" value={stats.avg} delta={0} up icon="Clock" tint="gold" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">
        {/* ---------------- Softphone ---------------- */}
        <Card className="overflow-hidden">
          <CardHeader title="Softphone" subtitle={trunk} icon="Phone" />
          <div className="card-pad pt-3">
            {/* Active call panel */}
            {onCall ? (
              <div className="rounded-2xl bg-gradient-to-br from-gold-700/20 via-ink-800 to-ink-900 p-5 text-center ring-1 ring-gold-400/20">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gold-400/15 text-gold-300">
                  <Icon name="PhoneCall" size={26} />
                </div>
                <div className="mt-3 truncate text-lg font-semibold text-white">{call.name || call.number}</div>
                {call.name && <div className="truncate text-xs text-slate-400">{call.number}</div>}
                <div className="mt-2 text-sm font-medium text-gold-300">
                  {call.status === 'dialing' && 'Dialling…'}
                  {call.status === 'ringing' && 'Ringing…'}
                  {call.status === 'active' && (call.held ? `On hold · ${fmtDuration(seconds)}` : fmtDuration(seconds))}
                </div>

                <div className="mt-5 flex items-center justify-center gap-2">
                  <CallBtn icon={call.muted ? 'MicOff' : 'Mic'} label={call.muted ? 'Unmute' : 'Mute'} onClick={toggleMute} active={call.muted} disabled={call.status !== 'active'} />
                  <CallBtn icon={call.held ? 'Play' : 'Pause'} label={call.held ? 'Resume' : 'Hold'} onClick={toggleHold} active={call.held} disabled={call.status !== 'active'} />
                  <CallBtn icon="PhoneForwarded" label="Transfer" onClick={() => setXferOpen(true)} disabled={call.status !== 'active'} />
                </div>

                <button onClick={hangup} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-red px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110">
                  <Icon name="PhoneOff" size={16} /> End Call
                </button>
              </div>
            ) : (
              <>
                <div className="relative">
                  <input
                    className="input pr-10 text-center text-lg tracking-wide"
                    placeholder="+91 98765 43210"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && dial()}
                  />
                  {number && (
                    <button onClick={() => setNumber((n) => n.slice(0, -1))} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-200" aria-label="Backspace">
                      <Icon name="Delete" size={16} />
                    </button>
                  )}
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {keys.map((k) => (
                    <button key={k} onClick={() => press(k)} className="rounded-xl border border-white/10 bg-white/[0.03] py-3 text-lg font-semibold text-slate-100 transition hover:bg-white/[0.08]">
                      {k}
                    </button>
                  ))}
                </div>
                <button onClick={dial} disabled={!number.trim()} className="btn-gold mt-4 w-full">
                  <Icon name="Phone" size={16} /> Call
                </button>
              </>
            )}

            {/* DTMF keypad while connected */}
            {call.status === 'active' && (
              <div className="mt-4">
                <div className="section-title mb-2">Keypad (DTMF)</div>
                <div className="grid grid-cols-3 gap-1.5">
                  {keys.map((k) => (
                    <button key={k} onClick={() => press(k)} className="rounded-lg border border-white/10 bg-white/[0.03] py-2 text-sm font-semibold text-slate-200 hover:bg-white/[0.08]">{k}</button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        <div className="space-y-6">
          {/* ---------------- Click-to-call contacts ---------------- */}
          <Card>
            <CardHeader title="Quick Dial" subtitle="Leads from your CRM pipeline" icon="Contact"
              action={<button className="btn-ghost btn-sm" onClick={() => nav('/crm')}>Open CRM</button>} />
            <div className="card-pad grid grid-cols-1 gap-2 pt-3 sm:grid-cols-2">
              {leads.map((l) => (
                <div key={l.name} className="flex items-center gap-3 rounded-xl bg-white/[0.02] p-3 ring-1 ring-white/5">
                  <Avatar initials={initials(l.name)} tint={l.type === 'Investor' ? 'blue' : 'purple'} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-slate-100">{l.name}</div>
                    <div className="truncate text-xs text-slate-500">{l.phone}</div>
                  </div>
                  <button
                    onClick={() => callLead(l)}
                    disabled={onCall}
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-green/10 text-brand-green ring-1 ring-brand-green/20 transition hover:bg-brand-green/20 disabled:opacity-40"
                    aria-label={`Call ${l.name}`}
                  >
                    <Icon name="Phone" size={16} />
                  </button>
                </div>
              ))}
            </div>
          </Card>

          {/* ---------------- Call history ---------------- */}
          <Card className="overflow-hidden">
            <CardHeader title="Call History" subtitle={`${callLogs.length} calls`} icon="History"
              action={<button className="btn-ghost btn-sm" onClick={exportLogs}><Icon name="Download" size={14} /> Export</button>} />
            <div className="overflow-x-auto px-2 pb-2 pt-2">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="text-[11px] uppercase tracking-wide text-slate-500">
                    {['Contact', 'Direction', 'Status', 'Duration', 'Agent', 'When', ''].map((h) => <th key={h} className="px-3 py-2">{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {callLogs.map((c) => (
                    <tr key={c.id} className="table-row">
                      <td className="px-3 py-3">
                        <div className="font-medium text-slate-100">{c.name}</div>
                        <div className="text-xs text-slate-500">{c.number}</div>
                      </td>
                      <td className="px-3 py-3">
                        <span className="flex items-center gap-1.5 text-xs capitalize text-slate-400">
                          <Icon name={dirIcon[c.direction]} size={14} className={c.direction === 'inbound' ? 'text-brand-blue' : 'text-brand-teal'} />
                          {c.direction}
                        </span>
                      </td>
                      <td className="px-3 py-3"><Badge tone={statusTone[c.status]}>{c.status}</Badge></td>
                      <td className="px-3 py-3 text-slate-300">{c.duration ? fmtDuration(c.duration) : '—'}</td>
                      <td className="px-3 py-3 text-slate-400">{c.agent}</td>
                      <td className="px-3 py-3 text-slate-500">{c.when}</td>
                      <td className="px-3 py-3 text-right">
                        <button
                          onClick={() => redial(c)}
                          disabled={onCall}
                          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white/5 hover:text-brand-green disabled:opacity-40"
                          aria-label={`Redial ${c.name}`}
                        >
                          <Icon name="Phone" size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>

      {/* Transfer modal */}
      <Modal open={xferOpen} onClose={() => setXferOpen(false)} title="Transfer Call" subtitle={call.name || call.number} icon="PhoneForwarded" size="sm"
        footer={<><button className="btn-ghost btn-sm" onClick={() => setXferOpen(false)}>Cancel</button><button className="btn-gold btn-sm" onClick={doTransfer}>Transfer</button></>}>
        <TextField label="Transfer to" value={xferTo} onChange={setXferTo} placeholder="Extension or number, e.g. 1042" required full />
      </Modal>
    </div>
  )
}

function CallBtn({ icon, label, onClick, active, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={`grid h-11 w-11 place-items-center rounded-xl ring-1 transition disabled:opacity-40 ${
        active ? 'bg-gold-400/20 text-gold-200 ring-gold-400/40' : 'bg-white/[0.04] text-slate-200 ring-white/10 hover:bg-white/[0.08]'
      }`}
    >
      <Icon name={icon} size={18} />
    </button>
  )
}
