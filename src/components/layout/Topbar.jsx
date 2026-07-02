import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, Search, Globe, MessageSquare, ChevronDown, Check } from 'lucide-react'
import { company, globalSearch } from '../../data/mockData'
import { Icon } from '../ui/Primitives'
import NotificationBell from '../notifications/NotificationBell'
import { useApp } from '../../context/AppContext'

const roleLabels = { admin: 'Super Admin', investor: 'Investor', seeker: 'Investment Seeker' }
const roleOptions = [
  { key: 'admin', label: 'Admin Console', icon: 'LayoutDashboard' },
  { key: 'investor', label: 'Investor Portal', icon: 'UserCircle' },
  { key: 'seeker', label: 'Seeker Portal', icon: 'Rocket' },
]

const typeTint = {
  Investor: 'text-brand-blue', Seeker: 'text-brand-purple',
  Property: 'text-brand-orange', 'FDI Project': 'text-brand-teal',
}

export default function Topbar({ onMenu }) {
  const nav = useNavigate()
  const { role, setRole, canInstall, installApp, logout } = useApp()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const boxRef = useRef(null)
  const menuRef = useRef(null)
  const results = globalSearch(q)

  useEffect(() => {
    const onClick = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false)
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const chooseRole = (r) => {
    setRole(r)
    setMenuOpen(false)
    if (r === 'investor') nav('/portal/investor')
    else if (r === 'seeker') nav('/portal/seeker')
    else nav('/')
  }

  const goto = (to) => { setQ(''); setOpen(false); nav(to) }

  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-white/5 bg-ink-950/80 px-4 py-3 backdrop-blur-xl sm:px-6">
      <button onClick={onMenu} className="grid h-10 w-10 place-items-center rounded-xl text-slate-300 hover:bg-white/5 lg:hidden">
        <Menu size={20} />
      </button>

      {/* Search */}
      <div ref={boxRef} className="relative hidden flex-1 md:block md:max-w-xl">
        <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          className="input pl-10"
          placeholder="Search investors, projects, properties…"
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
        />
        {open && q && (
          <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-white/10 bg-ink-850 shadow-card">
            {results.length ? (
              results.map((r, i) => (
                <button
                  key={i}
                  onClick={() => goto(r.to)}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-white/[0.04]"
                >
                  <span className={`grid h-8 w-8 place-items-center rounded-lg bg-white/5 ${typeTint[r.type]}`}>
                    <Icon name={r.icon} size={15} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-slate-100">{r.label}</div>
                    <div className="truncate text-xs text-slate-500">{r.sub}</div>
                  </div>
                  <span className="chip bg-white/5 text-slate-400">{r.type}</span>
                </button>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-sm text-slate-500">No matches for “{q}”</div>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-1 items-center justify-end gap-1.5 sm:gap-2">
        <IconBtn icon={Globe} />
        <NotificationBell />
        <button onClick={() => nav('/support')} className="relative grid h-10 w-10 place-items-center rounded-xl text-slate-300 transition hover:bg-white/5 hover:text-white">
          <MessageSquare size={19} />
          <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-brand-teal px-1 text-[9px] font-bold text-ink-950">3</span>
        </button>

        {/* Profile + role switcher */}
        <div ref={menuRef} className="relative ml-1">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] py-1.5 pl-1.5 pr-3 hover:bg-white/[0.06]"
          >
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-gold-gradient text-sm font-bold text-ink-950">
              {company.user.avatar}
            </span>
            <div className="hidden text-left leading-tight sm:block">
              <div className="text-sm font-semibold text-white">{company.user.name}</div>
              <div className="text-[11px] text-gold-400">{roleLabels[role]}</div>
            </div>
            <ChevronDown size={15} className="text-slate-400" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full z-40 mt-2 w-60 overflow-hidden rounded-2xl border border-white/10 bg-ink-850 shadow-card">
              <div className="border-b border-white/10 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Switch View
              </div>
              {roleOptions.map((o) => (
                <button
                  key={o.key}
                  onClick={() => chooseRole(o.key)}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition hover:bg-white/[0.04]"
                >
                  <Icon name={o.icon} size={16} className={role === o.key ? 'text-gold-300' : 'text-slate-400'} />
                  <span className={`flex-1 ${role === o.key ? 'text-gold-200' : 'text-slate-200'}`}>{o.label}</span>
                  {role === o.key && <Check size={15} className="text-gold-300" />}
                </button>
              ))}
              {canInstall && (
                <button
                  onClick={() => { installApp(); setMenuOpen(false) }}
                  className="flex w-full items-center gap-3 border-t border-white/10 px-4 py-2.5 text-left text-sm text-gold-200 transition hover:bg-white/[0.04]"
                >
                  <Icon name="Download" size={16} className="text-gold-300" />
                  <span className="flex-1">Install App</span>
                </button>
              )}
              <div className="border-t border-white/10 p-1.5">
                <button
                  onClick={() => { setMenuOpen(false); logout(); nav('/login') }}
                  className="btn-ghost btn-sm w-full"
                >
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

function IconBtn({ icon: Icon, badge, tone = 'gold' }) {
  return (
    <button className="relative grid h-10 w-10 place-items-center rounded-xl text-slate-300 transition hover:bg-white/5 hover:text-white">
      <Icon size={19} />
      {badge && (
        <span className={`absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full px-1 text-[9px] font-bold text-ink-950 ${tone === 'teal' ? 'bg-brand-teal' : 'bg-gold-400'}`}>
          {badge}
        </span>
      )}
    </button>
  )
}
