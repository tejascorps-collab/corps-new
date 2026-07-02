// Sidebar navigation model. Each item maps to a route.
export const navGroups = [
  {
    title: null,
    items: [{ to: '/', label: 'Main Dashboard', icon: 'LayoutDashboard', exact: true }],
  },
  {
    title: 'FDI Management',
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
  },
  {
    title: 'Property Management',
    items: [
      { to: '/properties', label: 'Properties', icon: 'Building2' },
      { to: '/property-deals', label: 'Property Deals', icon: 'Handshake' },
      { to: '/investor-pool', label: 'Investor Pool', icon: 'Layers' },
      { to: '/fund-management', label: 'Fund Management', icon: 'PiggyBank' },
      { to: '/profit-distribution', label: 'Profit Distribution', icon: 'Coins' },
      { to: '/international', label: 'International Property', icon: 'Globe' },
    ],
  },
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
