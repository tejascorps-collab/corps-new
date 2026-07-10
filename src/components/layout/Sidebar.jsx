import { NavLink, useNavigate } from 'react-router-dom'
import { getNavGroups, workspaceByKey } from '../../config/nav'
import { useApp } from '../../context/AppContext'
import { Icon } from '../ui/Primitives'
import { X } from 'lucide-react'

export default function Sidebar({ open, onClose }) {
  const nav = useNavigate()
  const { workspace } = useApp()
  const ws = workspaceByKey(workspace)
  const groups = getNavGroups(workspace)

  const explore = () => {
    nav('/portal/investor')
    if (onClose) onClose()
  }

  return (
    <>
      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden" onClick={onClose} />}

      <aside
        className={`fixed z-40 flex h-full w-[260px] flex-col border-r border-white/5 bg-ink-900/95 backdrop-blur-xl transition-transform duration-200 lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-5 py-5">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="logo" className="h-9 w-9" />
            <div className="leading-tight">
              <div className="font-display text-lg font-bold text-white">FDI PRIME</div>
              <div className="text-[9px] font-semibold uppercase tracking-[0.35em] text-gold-400">{ws.tagline}</div>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 lg:hidden">
            <X size={20} />
          </button>
        </div>

        {/* Active workspace */}
        <div className="mx-3 mb-3 flex items-center gap-2.5 rounded-xl border border-gold-400/20 bg-gold-400/[0.07] px-3 py-2.5">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gold-400/15 text-gold-300">
            <Icon name={ws.icon} size={16} />
          </span>
          <div className="min-w-0 leading-tight">
            <div className="text-[10px] uppercase tracking-wide text-slate-500">Workspace</div>
            <div className="truncate text-sm font-semibold text-gold-200">{ws.label}</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-6 overflow-y-auto px-3 pb-6">
          {groups.map((group, gi) => (
            <div key={gi}>
              {group.title && <div className="section-title mb-2 px-3">{group.title}</div>}
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.exact}
                    onClick={onClose}
                    className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
                  >
                    <Icon name={item.icon} size={18} />
                    <span className="flex-1">{item.label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}

          {/* Promo card */}
          <div className="mx-1 overflow-hidden rounded-2xl bg-gradient-to-br from-gold-700/30 via-ink-800 to-ink-900 p-4 ring-1 ring-gold-400/20">
            <div className="font-display text-sm font-bold text-gold-200">Grow Your Wealth Globally</div>
            <p className="mt-1 text-xs text-slate-400">We manage. You prosper.</p>
            <button className="btn-gold btn-sm mt-3 w-full" onClick={explore}>Explore Opportunities</button>
          </div>
        </nav>
      </aside>
    </>
  )
}
