import { useNavigate, useLocation } from 'react-router-dom'
import { Icon } from '../ui/Primitives'
import { useTelephony, fmtDuration } from '../../context/TelephonyContext'

// Floating call controls so an agent can keep navigating the CRM mid-call.
// Hidden on the Telephony page itself, which already shows the full softphone.
export default function CallBar() {
  const { call, seconds, hangup, toggleMute, toggleHold, onCall } = useTelephony()
  const nav = useNavigate()
  const { pathname } = useLocation()

  if (!onCall || pathname === '/telephony') return null

  const label =
    call.status === 'dialing' ? 'Dialling…'
    : call.status === 'ringing' ? 'Ringing…'
    : call.held ? `On hold · ${fmtDuration(seconds)}`
    : fmtDuration(seconds)

  return (
    <div className="fixed inset-x-3 bottom-24 z-[60] mx-auto max-w-md rounded-2xl border border-gold-400/25 bg-ink-850/95 p-3 shadow-card backdrop-blur-xl sm:inset-x-auto sm:right-6 sm:w-[380px] lg:bottom-6">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gold-400/15 text-gold-300">
          <Icon name="PhoneCall" size={18} />
        </span>
        <button onClick={() => nav('/telephony')} className="min-w-0 flex-1 text-left">
          <div className="truncate text-sm font-semibold text-white">{call.name || call.number}</div>
          <div className="truncate text-xs text-gold-300">{label}</div>
        </button>

        <div className="flex shrink-0 items-center gap-1.5">
          <button
            onClick={toggleMute}
            disabled={call.status !== 'active'}
            aria-label={call.muted ? 'Unmute' : 'Mute'}
            className={`grid h-9 w-9 place-items-center rounded-lg ring-1 transition disabled:opacity-40 ${
              call.muted ? 'bg-gold-400/20 text-gold-200 ring-gold-400/40' : 'bg-white/[0.04] text-slate-200 ring-white/10 hover:bg-white/[0.08]'
            }`}
          >
            <Icon name={call.muted ? 'MicOff' : 'Mic'} size={16} />
          </button>
          <button
            onClick={toggleHold}
            disabled={call.status !== 'active'}
            aria-label={call.held ? 'Resume' : 'Hold'}
            className={`grid h-9 w-9 place-items-center rounded-lg ring-1 transition disabled:opacity-40 ${
              call.held ? 'bg-gold-400/20 text-gold-200 ring-gold-400/40' : 'bg-white/[0.04] text-slate-200 ring-white/10 hover:bg-white/[0.08]'
            }`}
          >
            <Icon name={call.held ? 'Play' : 'Pause'} size={16} />
          </button>
          <button
            onClick={hangup}
            aria-label="End call"
            className="grid h-9 w-9 place-items-center rounded-lg bg-brand-red text-white transition hover:brightness-110"
          >
            <Icon name="PhoneOff" size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
