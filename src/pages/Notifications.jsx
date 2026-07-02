import { useNavigate } from 'react-router-dom'
import { PageHeader, Card, Icon } from '../components/ui/Primitives'
import { useApp } from '../context/AppContext'
import { Check, Send, Bell, Trash2 } from 'lucide-react'

const tints = {
  gold: 'bg-gold-400/10 text-gold-300', green: 'bg-brand-green/10 text-brand-green',
  blue: 'bg-brand-blue/10 text-brand-blue', teal: 'bg-brand-teal/10 text-brand-teal',
  orange: 'bg-brand-orange/10 text-brand-orange', purple: 'bg-brand-purple/10 text-brand-purple',
  red: 'bg-brand-red/10 text-brand-red',
}

export default function Notifications() {
  const { notifications, unreadCount, markRead, markAllRead, clearNotifications, sendDemoPush, pushEnabled, enablePush } = useApp()
  const nav = useNavigate()

  return (
    <div>
      <PageHeader title="Notifications" subtitle={`${unreadCount} unread · push, alerts & activity`} icon="Bell">
        {!pushEnabled && <button onClick={enablePush} className="btn-ghost btn-sm"><Bell size={14} /> Enable Push</button>}
        <button onClick={sendDemoPush} className="btn-ghost btn-sm"><Send size={14} /> Test Push</button>
        <button onClick={markAllRead} className="btn-ghost btn-sm"><Check size={14} /> Mark all read</button>
        <button onClick={clearNotifications} className="btn-ghost btn-sm"><Trash2 size={14} /> Clear</button>
      </PageHeader>

      <Card className="overflow-hidden">
        {notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-slate-500">
            <Icon name="BellOff" size={30} />
            <span className="text-sm">No notifications right now.</span>
            <button onClick={sendDemoPush} className="btn-gold btn-sm mt-2"><Send size={13} /> Send a test push</button>
          </div>
        )}
        {notifications.map((n) => (
          <button
            key={n.id}
            onClick={() => { markRead(n.id); if (n.to) nav(n.to) }}
            className={`flex w-full items-start gap-4 border-b border-white/5 px-5 py-4 text-left transition hover:bg-white/[0.03] ${n.read ? '' : 'bg-white/[0.02]'}`}
          >
            <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${tints[n.tone] || tints.gold}`}>
              <Icon name={n.icon || 'Bell'} size={19} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-100">{n.title}</span>
                {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />}
              </div>
              <div className="mt-0.5 text-sm text-slate-400">{n.text}</div>
              <div className="mt-1 text-[11px] text-slate-600">{n.when}</div>
            </div>
            <Icon name="ChevronRight" size={16} className="mt-1 text-slate-600" />
          </button>
        ))}
      </Card>
    </div>
  )
}
