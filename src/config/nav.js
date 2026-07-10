// Navigation model. The app has two business-line workspaces — FDI Support and
// Property Trading — each with its own dashboard and module list. Business
// Management and the Portals are shared and appear in both workspaces.

export const workspaces = [
  { key: 'fdi', label: 'FDI Support', short: 'FDI', icon: 'Briefcase', tagline: 'Investments' },
  { key: 'property', label: 'Property Trading', short: 'Trading', icon: 'Building2', tagline: 'Trading' },
]

export const workspaceByKey = (key) => workspaces.find((w) => w.key === key) || workspaces[0]

const fdiGroup = {
  title: 'FDI Support',
  items: [
    { to: '/investors', label: 'Investors', icon: 'Users' },
    { to: '/seekers', label: 'Investment Seekers', icon: 'Building' },
    { to: '/projects', label: 'FDI Projects', icon: 'Briefcase' },
    { to: '/proposal-builder', label: 'Proposal Builder', icon: 'FileText' },
    { to: '/documentation', label: 'Documentation', icon: 'FolderOpen' },
    { to: '/fema', label: 'FEMA Compliance', icon: 'ShieldCheck' },
    { to: '/due-diligence', label: 'Due Diligence', icon: 'Search' },
    { to: '/matching', label: 'Investor Matching', icon: 'GitCompareArrows' },
    { to: '/services', label: 'Services & Pricing', icon: 'Tag' },
  ],
}

const propertyGroup = {
  title: 'Property Trading',
  items: [
    { to: '/properties', label: 'Properties', icon: 'Building2' },
    { to: '/property-deals', label: 'Property Deals', icon: 'Handshake' },
    { to: '/investor-pool', label: 'Investor Pool', icon: 'Layers' },
    { to: '/fund-management', label: 'Fund Management', icon: 'PiggyBank' },
    { to: '/profit-distribution', label: 'Profit Distribution', icon: 'Coins' },
    { to: '/international', label: 'International Property', icon: 'Globe' },
  ],
}

const sharedGroups = [
  {
    title: 'Business Management',
    items: [
      { to: '/crm', label: 'CRM & Leads', icon: 'Contact' },
      { to: '/tasks', label: 'Tasks & Calendar', icon: 'CalendarDays' },
      { to: '/accounts', label: 'Accounts & Finance', icon: 'Landmark' },
      { to: '/reports', label: 'Reports & Analytics', icon: 'BarChart3' },
      { to: '/support', label: 'Support & Live Chat', icon: 'LifeBuoy' },
      { to: '/notifications', label: 'Notifications', icon: 'Bell' },
      { to: '/settings', label: 'Settings & Users', icon: 'Settings' },
    ],
  },
  {
    title: 'Portals',
    items: [
      { to: '/portal/investor', label: 'Investor Portal', icon: 'UserCircle' },
      { to: '/portal/seeker', label: 'Seeker Portal', icon: 'Rocket' },
    ],
  },
]

// Sidebar groups for the active workspace.
export function getNavGroups(workspace) {
  const dashboard = {
    title: null,
    items: [
      {
        to: '/',
        label: workspace === 'property' ? 'Trading Dashboard' : 'FDI Dashboard',
        icon: 'LayoutDashboard',
        exact: true,
      },
    ],
  }
  return [dashboard, workspace === 'property' ? propertyGroup : fdiGroup, ...sharedGroups]
}

// Route → workspace ownership, so deep-linking into a module switches to the
// workspace that owns it. Shared routes return null (stay where you are).
const ownedRoutes = {
  fdi: fdiGroup.items.map((i) => i.to),
  property: propertyGroup.items.map((i) => i.to),
}

export function workspaceForRoute(pathname) {
  for (const [key, routes] of Object.entries(ownedRoutes)) {
    if (routes.some((r) => pathname === r || pathname.startsWith(`${r}/`))) return key
  }
  return null
}
