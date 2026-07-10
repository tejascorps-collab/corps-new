import { Icon, initials } from '../ui/Primitives'
import { useTelephony } from '../../context/TelephonyContext'

// Global ringing overlay — appears anywhere in the app when an inbound call arrives.
export default function IncomingCall() {
  const { incoming, acceptCall, declineCall } = useTelephony()
  if (!incoming) return null

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-4 sm:items-start sm:justify-end sm:p-6">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={declineCall} />
      <div className="relative w-full max-w-sm animate-fade-in overflow-hidden rounded-2xl border border-gold-400/30 bg-ink-850/95 shadow-card backdrop-blur-xl">
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gold-400/15 text-gold-300 ring-2 ring-gold-400/30 animate-pulse">
            <Icon name="PhoneIncoming" size={22} />
          </span>
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-wide text-gold-300">Incoming call</div>
            <div className="truncate text-base font-semibold text-white">{incoming.name || incoming.number}</div>
            {incoming.name && <div className="truncate text-xs text-slate-400">{incoming.number}</div>}
          </div>
          <span className="ml-auto grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/5 text-xs font-semibold text-slate-300">
            {incoming.name ? initials(incoming.name) : <Icon name="User" size={16} />}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 p-3">
          <button
            onClick={declineCall}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-red px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
          >
            <Icon name="PhoneOff" size={16} /> Decline
          </button>
          <button
            onClick={acceptCall}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-green px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
          >
            <Icon name="PhoneCall" size={16} /> Accept
          </button>
        </div>
      </div>
    </div>
  )
}
