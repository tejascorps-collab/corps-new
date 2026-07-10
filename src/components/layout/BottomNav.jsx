import { NavLink, useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { Icon } from '../ui/Primitives'

// 5-tab sets per role. Last tab opens the full drawer.
// Admin tabs follow the active workspace (FDI Support vs Property Trading).
const adminTabs = {
  fdi: [
    { to: '/', label: 'Home', icon: 'LayoutDashboard', exact: true },
    { to: '/investors', label: 'Investors', icon: 'Users' },
    { to: '/projects', label: 'Projects', icon: 'Briefcase' },
    { to: '/notifications', label: 'Alerts', icon: 'Bell', badge: true },
    { more: true, label: 'More', icon: 'Menu' },
  ],
  property: [
    { to: '/', label: 'Home', icon: 'LayoutDashboard', exact: true },
    { to: '/properties', label: 'Property', icon: 'Building2' },
    { to: '/property-deals', label: 'Deals', icon: 'Handshake' },
    { to: '/notifications', label: 'Alerts', icon: 'Bell', badge: true },
    { more: true, label: 'More', icon: 'Menu' },
  ],
}

const tabSets = {
  investor: [
    { to: '/portal/investor', label: 'Portfolio', icon: 'Briefcase' },
    { to: '/properties', label: 'Explore', icon: 'Building2' },
    { to: '/notifications', label: 'Alerts', icon: 'Bell', badge: true },
    { to: '/support', label: 'Support', icon: 'LifeBuoy' },
    { more: true, label: 'More', icon: 'Menu' },
  ],
  seeker: [
    { to: '/portal/seeker', label: 'Home', icon: 'Rocket' },
    { to: '/proposal-builder', label: 'Proposal', icon: 'FileText' },
    { to: '/documentation', label: 'Docs', icon: 'FolderOpen' },
    { to: '/support', label: 'Support', icon: 'LifeBuoy' },
    { more: true, label: 'More', icon: 'Menu' },
  ],
}

export default function BottomNav({ onMore }) {
  const { role, unreadCount, workspace } = useApp()
  const nav = useNavigate()
  const tabs = role === 'admin' ? adminTabs[workspace] || adminTabs.fdi : tabSets[role] || adminTabs.fdi

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-ink-900/95 backdrop-blur-xl lg:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-5">
        {tabs.map((t, i) =>
          t.more ? (
            <button key={i} onClick={onMore} className="flex flex-col items-center gap-1 py-2.5 text-slate-400 active:text-gold-300">
              <Icon name={t.icon} size={20} />
              <span className="text-[10px] font-medium">{t.label}</span>
            </button>
          ) : (
            <NavLink
              key={i}
              to={t.to}
              end={t.exact}
              className={({ isActive }) =>
                `relative flex flex-col items-center gap-1 py-2.5 transition ${isActive ? 'text-gold-300' : 'text-slate-400'}`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && <span className="absolute top-0 h-0.5 w-8 rounded-full bg-gold-gradient" />}
                  <span className="relative">
                    <Icon name={t.icon} size={20} />
                    {t.badge && unreadCount > 0 && (
                      <span className="absolute -right-2 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-gold-400 px-1 text-[8px] font-bold text-ink-950">
                        {unreadCount}
                      </span>
                    )}
                  </span>
                  <span className="text-[10px] font-medium">{t.label}</span>
                </>
              )}
            </NavLink>
          )
        )}
      </div>
      {/* iOS safe-area spacer */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  )
}
