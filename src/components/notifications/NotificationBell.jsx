import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Check, Send } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { Icon } from '../ui/Primitives'

const tints = {
  gold: 'bg-gold-400/10 text-gold-300', green: 'bg-brand-green/10 text-brand-green',
  blue: 'bg-brand-blue/10 text-brand-blue', teal: 'bg-brand-teal/10 text-brand-teal',
  orange: 'bg-brand-orange/10 text-brand-orange', purple: 'bg-brand-purple/10 text-brand-purple',
  red: 'bg-brand-red/10 text-brand-red',
}

export default function NotificationBell() {
  const { notifications, unreadCount, markRead, markAllRead, sendDemoPush, pushEnabled, enablePush } = useApp()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const nav = useNavigate()

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const openItem = (n) => { markRead(n.id); setOpen(false); if (n.to) nav(n.to) }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative grid h-10 w-10 place-items-center rounded-xl text-slate-300 transition hover:bg-white/5 hover:text-white"
      >
        <Bell size={19} />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-gold-400 px-1 text-[9px] font-bold text-ink-950">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-40 mt-2 w-[340px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-white/10 bg-ink-850 shadow-card">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="text-sm font-semibold text-white">Notifications</div>
            <button onClick={markAllRead} className="flex items-center gap-1 text-xs text-gold-400 hover:text-gold-300">
              <Check size={13} /> Mark all read
            </button>
          </div>

          <div className="max-h-[360px] overflow-y-auto">
            {notifications.length === 0 && <div className="px-4 py-10 text-center text-sm text-slate-500">You're all caught up.</div>}
            {notifications.map((n) => (
              <button
                key={n.id}
                onClick={() => openItem(n)}
                className={`flex w-full items-start gap-3 border-b border-white/5 px-4 py-3 text-left transition hover:bg-white/[0.03] ${n.read ? '' : 'bg-white/[0.02]'}`}
              >
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${tints[n.tone] || tints.gold}`}>
                  <Icon name={n.icon || 'Bell'} size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium text-slate-100">{n.title}</span>
                    {!n.read && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold-400" />}
                  </div>
                  <div className="mt-0.5 line-clamp-2 text-xs text-slate-400">{n.text}</div>
                  <div className="mt-0.5 text-[11px] text-slate-600">{n.when}</div>
                </div>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 border-t border-white/10 p-2.5">
            {!pushEnabled && (
              <button onClick={enablePush} className="btn-ghost btn-sm flex-1">
                <Bell size={13} /> Enable push
              </button>
            )}
            <button onClick={sendDemoPush} className="btn-gold btn-sm flex-1">
              <Send size={13} /> Test push
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
