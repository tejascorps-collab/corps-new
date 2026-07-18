import { useNavigate } from 'react-router-dom'
import { ChevronRight, ArrowUpRight } from 'lucide-react'
import { Card, Icon } from '../../components/ui/Primitives'

export function LinkAll({ label = 'View All', to = '/' }) {
  const nav = useNavigate()
  return (
    <button onClick={() => nav(to)} className="flex items-center gap-1 text-xs font-medium text-gold-400 hover:text-gold-300">
      {label} <ChevronRight size={14} />
    </button>
  )
}

export function Legend({ color, label }) {
  return (
    <span className="flex items-center gap-1.5 text-slate-400">
      <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} /> {label}
    </span>
  )
}

// Bottom strip of headline numbers, shared by both workspace dashboards.
export function StatStrip({ stats }) {
  return (
    <Card className="card-pad">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-gold-400/10 text-gold-300 ring-1 ring-gold-400/20">
              <Icon name={s.icon} size={18} />
            </span>
            <div>
              <div className="text-lg font-bold text-white">{s.value}</div>
              <div className="text-[11px] text-slate-500">{s.label}</div>
              {typeof s.delta === 'number' && (
                <div className="flex items-center gap-0.5 text-[11px] text-brand-green">
                  <ArrowUpRight size={11} /> {s.delta}%
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

// Hero banner with the gold skyline silhouette.
export function Hero({ title, subtitle, actions }) {
  return (
    <div className="relative overflow-hidden rounded-2xl xl:col-span-2">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a2438] via-[#0f1626] to-[#0a0e17]" />
      <div className="absolute bottom-0 left-0 right-0 h-2/3 opacity-60"
        style={{ background: 'linear-gradient(to top, rgba(212,175,55,0.10), transparent 70%)' }} />
      <svg className="absolute bottom-0 left-0 right-0 w-full opacity-30" height="140" preserveAspectRatio="none" viewBox="0 0 800 140">
        <g fill="#d4af37">
          {[20, 70, 110, 160, 210, 250, 300, 360, 410, 460, 520, 580, 630, 690, 740].map((x, i) => (
            <rect key={i} x={x} y={140 - (40 + (i * 37) % 90)} width={i % 3 === 0 ? 34 : 24} height={40 + (i * 37) % 90} />
          ))}
        </g>
      </svg>
      <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/70 to-transparent" />
      <div className="relative p-7">
        {title}
        <p className="mt-1 text-slate-300">{subtitle}</p>
        <div className="mt-16 flex flex-wrap gap-3">{actions}</div>
      </div>
    </div>
  )
}
