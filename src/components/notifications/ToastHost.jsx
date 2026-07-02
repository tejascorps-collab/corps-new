import { useApp } from '../../context/AppContext'
import { Icon } from '../ui/Primitives'
import { X } from 'lucide-react'

const tints = {
  gold: 'ring-gold-400/30 text-gold-300', green: 'ring-brand-green/30 text-brand-green',
  blue: 'ring-brand-blue/30 text-brand-blue', teal: 'ring-brand-teal/30 text-brand-teal',
  orange: 'ring-brand-orange/30 text-brand-orange', purple: 'ring-brand-purple/30 text-brand-purple',
  red: 'ring-brand-red/30 text-brand-red',
}

export default function ToastHost() {
  const { toasts, dismissToast } = useApp()
  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-[60] flex flex-col items-center gap-2 px-3 sm:inset-x-auto sm:right-4 sm:items-end">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex w-full max-w-sm animate-fade-in items-start gap-3 rounded-2xl border border-white/10 bg-ink-800/95 p-3.5 shadow-card ring-1 backdrop-blur-xl ${tints[t.tone] || tints.gold}`}
        >
          <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/5 ${tints[t.tone] || tints.gold}`}>
            <Icon name={t.icon || 'Bell'} size={17} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-white">{t.title}</div>
            {t.body && <div className="mt-0.5 text-xs text-slate-400">{t.body}</div>}
          </div>
          <button onClick={() => dismissToast(t.id)} className="text-slate-500 hover:text-slate-200">
            <X size={15} />
          </button>
        </div>
      ))}
    </div>
  )
}
