import { NavLink } from 'react-router-dom'
import { navGroups } from '../../config/nav'
import { Icon } from '../ui/Primitives'
import { X } from 'lucide-react'

export default function Sidebar({ open, onClose }) {
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
              <div className="text-[9px] font-semibold uppercase tracking-[0.35em] text-gold-400">Investments</div>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 lg:hidden">
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-6 overflow-y-auto px-3 pb-6">
          {navGroups.map((group, gi) => (
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
            <button className="btn-gold btn-sm mt-3 w-full">Explore Opportunities</button>
          </div>
        </nav>
      </aside>
    </>
  )
}
