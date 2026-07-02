// ============================================================
// FDI Prime Investments — Mock Data
// Central sample dataset powering all modules (no backend).
// Currency amounts are in INR crore (Cr) unless noted.
// ============================================================

export const company = {
  name: 'FDI Prime Investments',
  user: { name: 'Tejas Taran', role: 'Super Admin', avatar: 'TT' },
}

// ---------- Dashboard KPIs ----------
export const dashboardStats = [
  { key: 'aum', label: 'Total AUM', value: '₹265.40 Cr', delta: 18.5, up: true, icon: 'Wallet', tint: 'purple' },
  { key: 'investors', label: 'Total Investors', value: '1,256', delta: 12.7, up: true, icon: 'Users', tint: 'blue' },
  { key: 'projects', label: 'Active FDI Projects', value: '48', delta: 8.3, up: true, icon: 'Briefcase', tint: 'teal' },
  { key: 'props', label: 'Properties Under Mgmt.', value: '32', delta: 11.2, up: true, icon: 'Building2', tint: 'orange' },
  { key: 'profit', label: 'Total Profit (YTD)', value: '₹28.65 Cr', delta: 24.6, up: true, icon: 'Coins', tint: 'gold' },
]

export const footerStats = [
  { label: 'Total Funds Raised', value: '₹320.80 Cr', delta: 21.4, up: true, icon: 'Target' },
  { label: 'Total Properties', value: '32', delta: 14.2, up: true, icon: 'Building2' },
  { label: 'Total Investors', value: '1,256', delta: 12.7, up: true, icon: 'Users' },
  { label: 'Total Exits', value: '18', delta: 28.6, up: true, icon: 'LogOut' },
  { label: 'Average ROI', value: '19.6%', delta: 3.8, up: true, icon: 'Gauge' },
  { label: 'Success Rate', value: '92%', delta: 5.4, up: true, icon: 'Award' },
]

export const secondaryStats = [
  { label: 'Properties Sold', value: '18', sub: 'This year' },
  { label: 'Monthly Revenue', value: '₹4.75 Cr', sub: 'June 2026' },
  { label: 'Pending Documentation', value: '23', sub: 'Awaiting action' },
  { label: 'Active Investment Seekers', value: '86', sub: 'Businesses' },
]

// ---------- Charts ----------
export const aumProfitSeries = [
  { month: 'Jan', aum: 180, profit: 12.5 },
  { month: 'Feb', aum: 192, profit: 14.1 },
  { month: 'Mar', aum: 205, profit: 15.8 },
  { month: 'Apr', aum: 198, profit: 13.2 },
  { month: 'May', aum: 215, profit: 18.4 },
  { month: 'Jun', aum: 228, profit: 20.1 },
  { month: 'Jul', aum: 221, profit: 19.0 },
  { month: 'Aug', aum: 210.4, profit: 24.8 },
  { month: 'Sep', aum: 238, profit: 22.6 },
  { month: 'Oct', aum: 249, profit: 25.9 },
  { month: 'Nov', aum: 258, profit: 27.4 },
  { month: 'Dec', aum: 265.4, profit: 28.65 },
]

export const investmentDistribution = [
  { name: 'Real Estate', value: 45, color: '#f59e0b' },
  { name: 'Manufacturing', value: 20, color: '#3b82f6' },
  { name: 'Technology', value: 15, color: '#8b5cf6' },
  { name: 'Healthcare', value: 10, color: '#2ec4b6' },
  { name: 'Others', value: 10, color: '#64748b' },
]

export const projectPipeline = [
  { stage: 'Enquiries', count: 120, color: '#38bdf8' },
  { stage: 'In Discussion', count: 75, color: '#2ec4b6' },
  { stage: 'Proposal Sent', count: 48, color: '#8b5cf6' },
  { stage: 'Due Diligence', count: 26, color: '#f59e0b' },
  { stage: 'Closed Deals', count: 12, color: '#22c55e' },
]

export const taskSummary = { total: 64, completed: 28, inProgress: 22, pending: 14 }

// ---------- Enquiries / Activities ----------
export const recentEnquiries = [
  { name: 'Amit Verma', type: 'Investor', when: '2 mins ago' },
  { name: 'Global Ventures Ltd.', type: 'Investment Seeker', when: '15 mins ago' },
  { name: 'Dubai Capital Group', type: 'Investor', when: '1 hour ago' },
  { name: 'NextGen Industries', type: 'Investment Seeker', when: '2 hours ago' },
  { name: 'Sarah Johnson', type: 'Investor', when: '3 hours ago' },
]

export const upcomingActivities = [
  { day: '25', mon: 'MAY', title: 'Investor Meeting', sub: 'Dubai Capital Group', time: '10:30 AM' },
  { day: '25', mon: 'MAY', title: 'FDI Proposal Review', sub: 'NextGen Industries', time: '01:00 PM' },
  { day: '26', mon: 'MAY', title: 'Due Diligence Call', sub: 'GreenTech Solutions', time: '11:00 AM' },
  { day: '27', mon: 'MAY', title: 'Property Site Visit', sub: 'Commercial Tower, Hyd', time: '03:00 PM' },
]

export const recentInvestments = [
  { name: 'Commercial Tower, Dubai', type: 'Property', amount: '₹45.00 Cr', status: 'Active', roi: '18.5%', progress: 70 },
  { name: 'Luxury Villas, Goa', type: 'Property', amount: '₹18.50 Cr', status: 'Active', roi: '16.2%', progress: 60 },
  { name: 'GreenTech Solutions', type: 'FDI Project', amount: '₹12.00 Cr', status: 'Due Diligence', roi: '22.0%', progress: 40 },
  { name: 'IT Park, Bangalore', type: 'Property', amount: '₹25.00 Cr', status: 'Active', roi: '17.5%', progress: 50 },
  { name: 'NextGen Manufacturing', type: 'FDI Project', amount: '₹15.75 Cr', status: 'Proposal Sent', roi: '20.5%', progress: 30 },
]

export const propertiesOverview = [
  { name: 'Commercial Tower', location: 'Hyderabad, India', value: '₹68.50 Cr', status: 'Rented', tone: 'green' },
  { name: 'Luxury Apartments', location: 'Dubai, UAE', value: '₹32.00 Cr', status: 'In Progress', tone: 'blue' },
  { name: 'Beach Resort', location: 'Goa, India', value: '₹22.75 Cr', status: 'Under Renovation', tone: 'orange' },
  { name: 'Industrial Park', location: 'Singapore', value: '₹45.30 Cr', status: 'Acquired', tone: 'purple' },
]

// ---------- Investors ----------
export const investors = [
  { id: 'INV-1001', name: 'Dubai Capital Group', country: 'UAE', capacity: '₹50 Cr', industries: ['Real Estate', 'Hospitality'], kyc: 'Verified', invested: '₹45.00 Cr', roi: '18.5%', rm: 'Priya Nair', risk: 'Moderate', status: 'Active' },
  { id: 'INV-1002', name: 'Amit Verma', country: 'India', capacity: '₹10 Cr', industries: ['Technology'], kyc: 'Verified', invested: '₹8.50 Cr', roi: '21.0%', rm: 'Rahul Mehta', risk: 'Aggressive', status: 'Active' },
  { id: 'INV-1003', name: 'Sarah Johnson', country: 'USA', capacity: '₹25 Cr', industries: ['Healthcare', 'Technology'], kyc: 'Pending', invested: '₹0.00 Cr', roi: '—', rm: 'Priya Nair', risk: 'Conservative', status: 'Onboarding' },
  { id: 'INV-1004', name: 'Sterling Holdings', country: 'UK', capacity: '₹40 Cr', industries: ['Manufacturing'], kyc: 'Verified', invested: '₹30.00 Cr', roi: '16.8%', rm: 'Karan Shah', risk: 'Moderate', status: 'Active' },
  { id: 'INV-1005', name: 'Lion City Fund', country: 'Singapore', capacity: '₹60 Cr', industries: ['Real Estate', 'Industrial'], kyc: 'Verified', invested: '₹52.00 Cr', roi: '19.4%', rm: 'Priya Nair', risk: 'Moderate', status: 'Active' },
  { id: 'INV-1006', name: 'Kensington Partners', country: 'UK', capacity: '₹15 Cr', industries: ['Technology'], kyc: 'In Review', invested: '₹0.00 Cr', roi: '—', rm: 'Karan Shah', risk: 'Aggressive', status: 'Onboarding' },
  { id: 'INV-1007', name: 'Al Noor Investments', country: 'UAE', capacity: '₹35 Cr', industries: ['Hospitality', 'Real Estate'], kyc: 'Verified', invested: '₹28.00 Cr', roi: '17.9%', rm: 'Rahul Mehta', risk: 'Moderate', status: 'Active' },
  { id: 'INV-1008', name: 'Meridian Global', country: 'Australia', capacity: '₹20 Cr', industries: ['Agriculture', 'Manufacturing'], kyc: 'Verified', invested: '₹14.50 Cr', roi: '15.2%', rm: 'Karan Shah', risk: 'Conservative', status: 'Active' },
]

// ---------- Investment Seekers ----------
export const seekers = [
  { id: 'SEK-2001', company: 'GreenTech Solutions', cin: 'U40108KA2019PTC121001', industry: 'CleanTech', location: 'Bangalore', required: '₹12 Cr', equity: '18%', roi: '22%', stage: 'Series A', valuation: '₹66 Cr', status: 'Due Diligence' },
  { id: 'SEK-2002', company: 'NextGen Industries', cin: 'U29100MH2017PLC298877', industry: 'Manufacturing', location: 'Pune', required: '₹15.75 Cr', equity: '22%', roi: '20.5%', stage: 'Growth', valuation: '₹71 Cr', status: 'Proposal Sent' },
  { id: 'SEK-2003', company: 'MediCore Labs', cin: 'U24232TG2020PTC140233', industry: 'Healthcare', location: 'Hyderabad', required: '₹8 Cr', equity: '15%', roi: '24%', stage: 'Seed', valuation: '₹53 Cr', status: 'In Discussion' },
  { id: 'SEK-2004', company: 'UrbanNest Realty', cin: 'U70102DL2016PTC300145', industry: 'Real Estate', location: 'Delhi NCR', required: '₹30 Cr', equity: '25%', roi: '17%', stage: 'Growth', valuation: '₹120 Cr', status: 'Enquiry' },
  { id: 'SEK-2005', company: 'AgriPlus Farms', cin: 'U01100PB2018PTC099210', industry: 'Agriculture', location: 'Ludhiana', required: '₹6.5 Cr', equity: '20%', roi: '16%', stage: 'Seed', valuation: '₹32 Cr', status: 'In Discussion' },
  { id: 'SEK-2006', company: 'Fabrik Motors', cin: 'U34103TN2015PLC101744', industry: 'Automotive', location: 'Chennai', required: '₹40 Cr', equity: '30%', roi: '19%', stage: 'Series B', valuation: '₹133 Cr', status: 'Due Diligence' },
]

// ---------- FDI Projects ----------
export const fdiProjects = [
  { id: 'FDI-501', name: 'GreenTech Solar Expansion', sector: 'CleanTech', route: 'Automatic', investor: 'Lion City Fund', size: '₹12 Cr', stage: 'Due Diligence', progress: 40, closeDate: '2026-08-15' },
  { id: 'FDI-502', name: 'NextGen Manufacturing Unit', sector: 'Manufacturing', route: 'Automatic', investor: 'Sterling Holdings', size: '₹15.75 Cr', stage: 'Proposal Sent', progress: 30, closeDate: '2026-09-01' },
  { id: 'FDI-503', name: 'MediCore R&D Center', sector: 'Healthcare', route: 'Government', investor: 'Sarah Johnson', size: '₹8 Cr', stage: 'In Discussion', progress: 20, closeDate: '2026-10-10' },
  { id: 'FDI-504', name: 'Fabrik EV Plant', sector: 'Automotive', route: 'Automatic', investor: 'Meridian Global', size: '₹40 Cr', stage: 'Due Diligence', progress: 55, closeDate: '2026-08-30' },
  { id: 'FDI-505', name: 'UrbanNest Township', sector: 'Real Estate', route: 'Automatic', investor: 'Dubai Capital Group', size: '₹30 Cr', stage: 'Closed', progress: 100, closeDate: '2026-05-20' },
]

// ---------- Documentation ----------
export const documents = [
  { name: 'Investment Agreement — GreenTech', type: 'Investment Agreement', party: 'GreenTech Solutions', date: '2026-06-18', status: 'Signed' },
  { name: 'Term Sheet — NextGen', type: 'Term Sheet', party: 'NextGen Industries', date: '2026-06-21', status: 'Pending Signature' },
  { name: 'NDA — MediCore Labs', type: 'NDA', party: 'MediCore Labs', date: '2026-06-10', status: 'Signed' },
  { name: 'FC-GPR Filing — Fabrik', type: 'RBI Form', party: 'Fabrik Motors', date: '2026-06-25', status: 'Filed' },
  { name: 'Shareholders Agreement — UrbanNest', type: 'SHA', party: 'UrbanNest Realty', date: '2026-06-05', status: 'Under Review' },
  { name: 'MoU — Lion City Fund', type: 'MoU', party: 'Lion City Fund', date: '2026-05-28', status: 'Signed' },
  { name: 'KYC Package — Sterling Holdings', type: 'KYC', party: 'Sterling Holdings', date: '2026-06-01', status: 'Verified' },
]

export const docChecklist = [
  'NDA', 'Term Sheet', 'MoU', 'Shareholders Agreement', 'Investment Agreement',
  'FEMA Documents', 'RBI Forms', 'Government Approvals', 'Passport Copies',
  'KYC', 'PAN', 'GST', 'CIN', 'Board Resolution',
]

// ---------- FEMA Compliance ----------
export const femaChecklist = [
  { item: 'FEMA Eligibility Assessment', status: 'Complete' },
  { item: 'Sector-wise FDI Limit Check', status: 'Complete' },
  { item: 'Automatic Route Confirmation', status: 'Complete' },
  { item: 'Government Route Approval', status: 'Not Required' },
  { item: 'RBI Filing — FC-GPR', status: 'In Progress' },
  { item: 'RBI Filing — FC-TRS', status: 'Pending' },
  { item: 'Annual Return on FLA', status: 'Pending' },
]

export const femaSectorLimits = [
  { sector: 'Real Estate (Construction Dev.)', limit: '100%', route: 'Automatic' },
  { sector: 'Manufacturing', limit: '100%', route: 'Automatic' },
  { sector: 'Healthcare (Greenfield)', limit: '100%', route: 'Automatic' },
  { sector: 'Healthcare (Brownfield)', limit: '100%', route: 'Government' },
  { sector: 'Defence', limit: '74%', route: 'Automatic' },
  { sector: 'Insurance', limit: '74%', route: 'Automatic' },
  { sector: 'Print Media', limit: '26%', route: 'Government' },
]

// ---------- Due Diligence ----------
export const dueDiligence = [
  { company: 'GreenTech Solutions', mca: 'Verified', gst: 'Verified', litigation: 'Clear', credit: 'A (Stable)', director: 'Verified', overall: 78 },
  { company: 'NextGen Industries', mca: 'Verified', gst: 'Verified', litigation: '1 Pending', credit: 'BBB+', director: 'Verified', overall: 65 },
  { company: 'MediCore Labs', mca: 'In Progress', gst: 'Verified', litigation: 'Clear', credit: 'A-', director: 'Pending', overall: 52 },
  { company: 'Fabrik Motors', mca: 'Verified', gst: 'Verified', litigation: 'Clear', credit: 'AA-', director: 'Verified', overall: 88 },
]

// ---------- Investor Matching ----------
export const matches = [
  { investor: 'Lion City Fund', seeker: 'GreenTech Solutions', score: 94, industry: 'CleanTech', amount: '₹12 Cr', roi: '22%', risk: 'Moderate' },
  { investor: 'Sterling Holdings', seeker: 'NextGen Industries', score: 88, industry: 'Manufacturing', amount: '₹15.75 Cr', roi: '20.5%', risk: 'Moderate' },
  { investor: 'Sarah Johnson', seeker: 'MediCore Labs', score: 82, industry: 'Healthcare', amount: '₹8 Cr', roi: '24%', risk: 'Conservative' },
  { investor: 'Meridian Global', seeker: 'AgriPlus Farms', score: 76, industry: 'Agriculture', amount: '₹6.5 Cr', roi: '16%', risk: 'Conservative' },
  { investor: 'Dubai Capital Group', seeker: 'UrbanNest Realty', score: 91, industry: 'Real Estate', amount: '₹30 Cr', roi: '17%', risk: 'Moderate' },
]

// ---------- Services & Pricing ----------
export const servicePricing = [
  { service: 'Initial FDI Consultation', price: '₹25,000' },
  { service: 'Investor Readiness Assessment', price: '₹40,000' },
  { service: 'Proposal Building', price: '₹75,000' },
  { service: 'Business Plan Preparation', price: '₹1,25,000' },
  { service: 'Pitch Deck Design', price: '₹60,000' },
  { service: 'Financial Projection', price: '₹80,000' },
  { service: 'Company Valuation Assistance', price: '₹1,00,000' },
  { service: 'Documentation Package', price: '₹75,000' },
  { service: 'FEMA Compliance Assistance', price: '₹1,50,000' },
  { service: 'RBI Filing Assistance', price: '₹75,000' },
  { service: 'Investment Due Diligence', price: '₹2,00,000' },
  { service: 'Investor Matching Service', price: '₹3,00,000' },
  { service: 'End-to-End FDI Consultancy', price: '₹5–15 Lakhs' },
]

// ---------- Properties ----------
export const properties = [
  { id: 'PROP-301', name: 'Prime Commercial Tower', category: 'Commercial', location: 'Hyderabad, India', purchase: '₹52.00 Cr', current: '₹68.50 Cr', expected: '₹78.00 Cr', rental: '₹0.55 Cr/mo', roi: '18.5%', legal: 'Clear', status: 'Rented' },
  { id: 'PROP-302', name: 'Marina Luxury Apartments', category: 'Residential', location: 'Dubai, UAE', purchase: '₹28.00 Cr', current: '₹32.00 Cr', expected: '₹40.00 Cr', rental: '₹0.28 Cr/mo', roi: '16.2%', legal: 'Clear', status: 'In Progress' },
  { id: 'PROP-303', name: 'Palm Beach Resort', category: 'Hospitality', location: 'Goa, India', purchase: '₹19.50 Cr', current: '₹22.75 Cr', expected: '₹30.00 Cr', rental: '₹0.20 Cr/mo', roi: '15.0%', legal: 'Under Review', status: 'Under Renovation' },
  { id: 'PROP-304', name: 'Jurong Industrial Park', category: 'Industrial', location: 'Singapore', purchase: '₹38.00 Cr', current: '₹45.30 Cr', expected: '₹55.00 Cr', rental: '₹0.42 Cr/mo', roi: '17.8%', legal: 'Clear', status: 'Acquired' },
  { id: 'PROP-305', name: 'Green Valley Farmland', category: 'Agricultural', location: 'Nashik, India', purchase: '₹6.50 Cr', current: '₹8.20 Cr', expected: '₹12.00 Cr', rental: '—', roi: '21.0%', legal: 'Clear', status: 'Held' },
  { id: 'PROP-306', name: 'Hillcrest Villas', category: 'Villas', location: 'Goa, India', purchase: '₹15.00 Cr', current: '₹18.50 Cr', expected: '₹24.00 Cr', rental: '₹0.15 Cr/mo', roi: '16.5%', legal: 'Clear', status: 'For Sale' },
]

// ---------- Investor Pool ----------
export const investorPool = [
  { investor: 'Dubai Capital Group', property: 'Prime Commercial Tower', amount: '₹20.00 Cr', date: '2025-03-12', units: 200, ownership: '38.5%', roi: '18.5%', exit: '—' },
  { investor: 'Lion City Fund', property: 'Jurong Industrial Park', amount: '₹22.00 Cr', date: '2025-01-20', units: 220, ownership: '57.9%', roi: '17.8%', exit: '—' },
  { investor: 'Al Noor Investments', property: 'Palm Beach Resort', amount: '₹10.00 Cr', date: '2025-06-05', units: 100, ownership: '51.3%', roi: '15.0%', exit: '—' },
  { investor: 'Sterling Holdings', property: 'Marina Luxury Apartments', amount: '₹15.00 Cr', date: '2025-02-18', units: 150, ownership: '53.6%', roi: '16.2%', exit: '—' },
  { investor: 'Meridian Global', property: 'Hillcrest Villas', amount: '₹8.00 Cr', date: '2024-11-30', units: 80, ownership: '43.2%', roi: '16.5%', exit: '2026-09-15' },
]

// ---------- Fund Management ----------
export const funds = {
  totalPool: '₹92.40 Cr',
  allocated: '₹75.00 Cr',
  balance: '₹17.40 Cr',
  expenses: [
    { head: 'Stamp Duty', amount: '₹3.20 Cr' },
    { head: 'Registration Charges', amount: '₹0.85 Cr' },
    { head: 'Brokerage', amount: '₹1.10 Cr' },
    { head: 'Legal Cost', amount: '₹0.65 Cr' },
    { head: 'Renovation', amount: '₹2.40 Cr' },
  ],
}

// ---------- Profit Distribution ----------
export const profitDistribution = [
  { property: 'Green Valley Farmland (Partial Exit)', purchase: '₹6.50 Cr', sale: '₹9.00 Cr', expenses: '₹0.45 Cr', netProfit: '₹2.05 Cr', investorShare: '₹1.64 Cr', companyShare: '₹0.41 Cr', status: 'Distributed' },
  { property: 'Hillcrest Villas (Unit A)', purchase: '₹2.00 Cr', sale: '₹2.50 Cr', expenses: '₹0.08 Cr', netProfit: '₹0.42 Cr', investorShare: '₹0.336 Cr', companyShare: '₹0.084 Cr', status: 'Pending Settlement' },
  { property: 'Marina Apartments (Flip)', purchase: '₹5.00 Cr', sale: '₹6.20 Cr', expenses: '₹0.22 Cr', netProfit: '₹0.98 Cr', investorShare: '₹0.784 Cr', companyShare: '₹0.196 Cr', status: 'Distributed' },
]

// ---------- International Property ----------
export const intlProperties = [
  { country: 'Dubai, UAE', flag: '🇦🇪', currency: 'AED', rate: '22.60', properties: 4, value: '₹128 Cr', tax: 'No income tax', residency: 'Golden Visa (10 yr)' },
  { country: 'United Kingdom', flag: '🇬🇧', currency: 'GBP', rate: '106.40', properties: 2, value: '₹64 Cr', tax: 'SDLT 5–12%', residency: 'Tier 1 Investor' },
  { country: 'United States', flag: '🇺🇸', currency: 'USD', rate: '83.20', properties: 3, value: '₹96 Cr', tax: 'FIRPTA 15%', residency: 'EB-5 Visa' },
  { country: 'Singapore', flag: '🇸🇬', currency: 'SGD', rate: '61.80', properties: 2, value: '₹72 Cr', tax: 'ABSD 20–60%', residency: 'Global Investor' },
  { country: 'Portugal', flag: '🇵🇹', currency: 'EUR', rate: '90.10', properties: 1, value: '₹28 Cr', tax: 'IMT 6–8%', residency: 'Golden Visa' },
  { country: 'Thailand', flag: '🇹🇭', currency: 'THB', rate: '2.28', properties: 1, value: '₹14 Cr', tax: 'Transfer 2%', residency: 'Elite Visa' },
]

// ---------- CRM ----------
export const leads = [
  { name: 'Rajesh Kumar', company: 'RK Enterprises', type: 'Investor', source: 'Website', stage: 'New', owner: 'Sales · Anita', value: '₹5 Cr', last: '2h ago' },
  { name: 'Global Ventures Ltd.', company: 'Global Ventures', type: 'Seeker', source: 'Referral', stage: 'Contacted', owner: 'Sales · Vikram', value: '₹20 Cr', last: '15m ago' },
  { name: 'Fatima Al Sayed', company: 'Al Sayed Holdings', type: 'Investor', source: 'Event', stage: 'Qualified', owner: 'Sales · Anita', value: '₹35 Cr', last: '1d ago' },
  { name: 'TechNova Pvt Ltd', company: 'TechNova', type: 'Seeker', source: 'LinkedIn', stage: 'Proposal', owner: 'Sales · Vikram', value: '₹10 Cr', last: '3h ago' },
  { name: 'Michael Chen', company: 'Chen Capital', type: 'Investor', source: 'Website', stage: 'Negotiation', owner: 'Sales · Anita', value: '₹18 Cr', last: '5h ago' },
]

export const crmPipeline = [
  { stage: 'New', count: 32 },
  { stage: 'Contacted', count: 24 },
  { stage: 'Qualified', count: 18 },
  { stage: 'Proposal', count: 12 },
  { stage: 'Negotiation', count: 7 },
  { stage: 'Won', count: 9 },
]

// ---------- Tasks / Calendar ----------
export const tasks = [
  { title: 'Prepare term sheet for NextGen', due: '2026-07-03', priority: 'High', assignee: 'Rahul Mehta', status: 'In Progress' },
  { title: 'RBI FC-GPR filing — Fabrik', due: '2026-07-05', priority: 'High', assignee: 'Legal Team', status: 'Pending' },
  { title: 'Investor call — Dubai Capital', due: '2026-07-02', priority: 'Medium', assignee: 'Priya Nair', status: 'Completed' },
  { title: 'Site visit report — Goa Resort', due: '2026-07-08', priority: 'Medium', assignee: 'Property Mgr', status: 'Pending' },
  { title: 'Quarterly ROI statements', due: '2026-07-10', priority: 'Low', assignee: 'Finance Team', status: 'In Progress' },
]

// ---------- Accounts & Finance ----------
export const invoices = [
  { no: 'INV-2026-0142', client: 'GreenTech Solutions', service: 'Due Diligence', amount: '₹2,00,000', gst: '₹36,000', total: '₹2,36,000', status: 'Paid' },
  { no: 'INV-2026-0143', client: 'NextGen Industries', service: 'Proposal Building', amount: '₹75,000', gst: '₹13,500', total: '₹88,500', status: 'Sent' },
  { no: 'INV-2026-0144', client: 'MediCore Labs', service: 'Pitch Deck Design', amount: '₹60,000', gst: '₹10,800', total: '₹70,800', status: 'Overdue' },
  { no: 'INV-2026-0145', client: 'Dubai Capital Group', service: 'Investor Matching', amount: '₹3,00,000', gst: '₹54,000', total: '₹3,54,000', status: 'Paid' },
  { no: 'INV-2026-0146', client: 'Fabrik Motors', service: 'FEMA Compliance', amount: '₹1,50,000', gst: '₹27,000', total: '₹1,77,000', status: 'Sent' },
]

export const cashflowSeries = [
  { month: 'Jan', inflow: 3.2, outflow: 2.1 },
  { month: 'Feb', inflow: 3.8, outflow: 2.4 },
  { month: 'Mar', inflow: 4.1, outflow: 2.8 },
  { month: 'Apr', inflow: 3.6, outflow: 2.5 },
  { month: 'May', inflow: 4.6, outflow: 3.0 },
  { month: 'Jun', inflow: 4.75, outflow: 3.1 },
]

// ---------- Reports ----------
export const propertyPerformance = [
  { property: 'Prime Commercial Tower', invested: 52, current: 68.5, roi: 18.5 },
  { property: 'Jurong Industrial Park', invested: 38, current: 45.3, roi: 17.8 },
  { property: 'Marina Apartments', invested: 28, current: 32, roi: 16.2 },
  { property: 'Palm Beach Resort', invested: 19.5, current: 22.75, roi: 15.0 },
  { property: 'Hillcrest Villas', invested: 15, current: 18.5, roi: 16.5 },
]

// ---------- Users & Roles ----------
export const roles = [
  'Super Admin', 'Director', 'Investment Manager', 'Property Manager',
  'FDI Consultant', 'Legal Team', 'Finance Team', 'Sales Team',
  'Investor (Portal)', 'Investment Seeker (Portal)',
]

export const teamMembers = [
  { name: 'Tejas Taran', email: 'tejas.corps@gmail.com', role: 'Super Admin', status: 'Active', last: 'Now' },
  { name: 'Priya Nair', email: 'priya@fdiprime.com', role: 'Investment Manager', status: 'Active', last: '10m ago' },
  { name: 'Rahul Mehta', email: 'rahul@fdiprime.com', role: 'FDI Consultant', status: 'Active', last: '1h ago' },
  { name: 'Karan Shah', email: 'karan@fdiprime.com', role: 'Investment Manager', status: 'Active', last: '2h ago' },
  { name: 'Adv. Sneha Rao', email: 'sneha@fdiprime.com', role: 'Legal Team', status: 'Active', last: '3h ago' },
  { name: 'Deepak Iyer', email: 'deepak@fdiprime.com', role: 'Finance Team', status: 'Away', last: '1d ago' },
  { name: 'Anita Desai', email: 'anita@fdiprime.com', role: 'Sales Team', status: 'Active', last: '30m ago' },
]

// ---------- Investor Portal ----------
export const portalInvestor = {
  name: 'Dubai Capital Group',
  kyc: 'Verified',
  portfolioValue: '₹53.20 Cr',
  invested: '₹45.00 Cr',
  currentRoi: '18.5%',
  profitBooked: '₹4.85 Cr',
  holdings: [
    { asset: 'Prime Commercial Tower', type: 'Property', invested: '₹20.00 Cr', current: '₹24.10 Cr', roi: '18.5%' },
    { asset: 'UrbanNest Township', type: 'FDI Project', invested: '₹15.00 Cr', current: '₹17.60 Cr', roi: '17.3%' },
    { asset: 'Palm Beach Resort', type: 'Property', invested: '₹10.00 Cr', current: '₹11.50 Cr', roi: '15.0%' },
  ],
  requests: [
    { type: 'New Investment', detail: 'Jurong Industrial Park — ₹8 Cr', date: '2026-06-28', status: 'Under Review' },
    { type: 'Withdrawal', detail: 'Partial exit — Green Valley', date: '2026-06-15', status: 'Approved' },
  ],
  opportunities: [
    { name: 'Fabrik EV Plant', sector: 'Automotive', roi: '19%', min: '₹5 Cr' },
    { name: 'MediCore R&D Center', sector: 'Healthcare', roi: '24%', min: '₹3 Cr' },
    { name: 'Hillcrest Villas Phase 2', sector: 'Real Estate', roi: '16.5%', min: '₹2 Cr' },
  ],
}

// ---------- Seeker Portal ----------
export const portalSeeker = {
  company: 'GreenTech Solutions',
  stage: 'Due Diligence',
  required: '₹12 Cr',
  raised: '₹4.5 Cr',
  proposalStatus: 'Shared with 3 investors',
  checklist: [
    { item: 'Business Plan', done: true },
    { item: 'Financial Statements', done: true },
    { item: 'Pitch Deck', done: true },
    { item: 'Valuation Report', done: true },
    { item: 'CIN / MCA Docs', done: true },
    { item: 'GST Certificate', done: true },
    { item: 'Director KYC', done: false },
    { item: 'FEMA Declaration', done: false },
  ],
  timeline: [
    { step: 'Funding Request Submitted', date: '2026-05-20', done: true },
    { step: 'Documents Verified', date: '2026-06-02', done: true },
    { step: 'Proposal Built & Shared', date: '2026-06-12', done: true },
    { step: 'Due Diligence', date: '2026-06-25', done: true },
    { step: 'Investor Commitment', date: 'In progress', done: false },
    { step: 'Deal Closure', date: 'Pending', done: false },
  ],
}

// ============================================================
// Detail-view lookups & supporting data
// ============================================================

// Rich per-investor extras (contact, compliance, notes). Falls back to defaults.
const investorExtra = {
  'INV-1001': {
    email: 'contact@dubaicapital.ae', phone: '+971 4 555 0100', joined: '2024-08-15',
    passport: 'A1234567 (UAE)', sourceOfFunds: 'Sovereign wealth allocation & real-estate exits',
    period: '5–7 years',
    notes: [
      { by: 'Priya Nair', when: '2026-06-28', text: 'Committed additional ₹8 Cr to Jurong Industrial Park. Awaiting FC-GPR.' },
      { by: 'Rahul Mehta', when: '2026-05-14', text: 'Prefers commercial & hospitality assets in tier-1 GCC + India metros.' },
    ],
  },
  'INV-1005': {
    email: 'invest@lioncityfund.sg', phone: '+65 6555 0180', joined: '2024-11-02',
    passport: 'S9988776 (SG)', sourceOfFunds: 'Institutional LP capital',
    period: '4–6 years',
    notes: [{ by: 'Priya Nair', when: '2026-06-10', text: 'Largest pool holder in Jurong (57.9%). Quarterly reporting agreed.' }],
  },
}

export function getInvestor(id) {
  const base = investors.find((i) => i.id === id)
  if (!base) return null
  const extra = investorExtra[id] || {
    email: `${base.name.split(' ')[0].toLowerCase()}@example.com`,
    phone: '+91 98••• •••••', joined: '2025-02-10',
    passport: '—', sourceOfFunds: 'Declared business & investment income', period: '3–5 years',
    notes: [{ by: base.rm, when: '2026-06-01', text: `Onboarded and assigned to ${base.rm}.` }],
  }
  const holdings = [
    ...investorPool.filter((p) => p.investor === base.name).map((p) => ({
      asset: p.property, type: 'Property', invested: p.amount, ownership: p.ownership, roi: p.roi, date: p.date,
    })),
    ...fdiProjects.filter((f) => f.investor === base.name).map((f) => ({
      asset: f.name, type: 'FDI Project', invested: f.size, ownership: '—', roi: '—', date: f.closeDate,
    })),
  ]
  const kycChecklist = [
    { item: 'Passport / ID', status: base.kyc === 'Verified' ? 'Verified' : 'Pending' },
    { item: 'Proof of Address', status: base.kyc === 'Verified' ? 'Verified' : 'Pending' },
    { item: 'Source of Funds Declaration', status: base.kyc === 'Verified' ? 'Verified' : 'In Review' },
    { item: 'FEMA / FATCA Declaration', status: base.kyc === 'Verified' ? 'Verified' : 'Pending' },
    { item: 'Bank Account Verification', status: base.status === 'Active' ? 'Verified' : 'Pending' },
  ]
  const documents = [
    { name: 'Passport Copy', type: 'KYC', date: extra.joined, status: 'Verified' },
    { name: 'Investment Agreement', type: 'Agreement', date: '2025-03-12', status: base.status === 'Active' ? 'Signed' : 'Pending Signature' },
    { name: 'Source of Funds Letter', type: 'Compliance', date: extra.joined, status: 'Verified' },
    { name: 'FEMA Declaration', type: 'FEMA', date: '2025-03-10', status: base.status === 'Active' ? 'Filed' : 'Pending' },
  ]
  return { ...base, ...extra, holdings, kycChecklist, documents }
}

export function getProperty(id) {
  const base = properties.find((p) => p.id === id)
  if (!base) return null
  const pool = investorPool.filter((p) => p.property === base.name)
  const documents = [
    { name: 'Sale Deed', type: 'Title', date: '2025-03-20', status: 'Verified' },
    { name: 'Encumbrance Certificate (EC)', type: 'Legal', date: '2025-03-18', status: 'Verified' },
    { name: 'Khata Certificate', type: 'Municipal', date: '2025-03-15', status: 'Verified' },
    { name: 'Property Tax Receipts', type: 'Tax', date: '2026-04-01', status: 'Verified' },
    { name: 'Occupancy Certificate', type: 'Statutory', date: '2025-04-10', status: base.status === 'Under Renovation' ? 'Pending' : 'Verified' },
    { name: 'Building Plan Approval', type: 'Statutory', date: '2025-02-28', status: 'Verified' },
    { name: 'Legal Opinion', type: 'Legal', date: '2025-03-19', status: 'Verified' },
    { name: 'Valuation Report', type: 'Finance', date: '2026-05-01', status: 'Verified' },
  ]
  const workflow = [
    { step: 'Property Identified', done: true }, { step: 'Due Diligence', done: true },
    { step: 'Legal Verification', done: base.legal === 'Clear' }, { step: 'Investor Approval', done: true },
    { step: 'Fund Collection', done: base.status !== 'In Progress' }, { step: 'Purchase', done: base.status !== 'In Progress' },
    { step: 'Registration', done: base.status !== 'In Progress' }, { step: 'Renovation', done: base.status === 'Rented' || base.status === 'For Sale' },
    { step: 'Marketing', done: base.status === 'For Sale' }, { step: 'Sale', done: false }, { step: 'Profit Distribution', done: false },
  ]
  return { ...base, pool, documents, workflow }
}

const seekerExtra = {
  'SEK-2001': {
    contact: 'Ananya Rao', role: 'Founder & CEO', email: 'ananya@greentech.in', phone: '+91 80 4123 5567',
    founded: '2019', employees: '145', revenue: '₹22 Cr FY25', useOfFunds: 'Scale solar module capacity to 500 MW',
  },
  'SEK-2002': {
    contact: 'Vikram Malhotra', role: 'Managing Director', email: 'vikram@nextgen.in', phone: '+91 20 6655 8890',
    founded: '2017', employees: '320', revenue: '₹58 Cr FY25', useOfFunds: 'New precision-manufacturing line + working capital',
  },
}

export function getSeekerDetail(id) {
  const base = seekers.find((s) => s.id === id)
  if (!base) return null
  const extra = seekerExtra[id] || {
    contact: 'Founder', role: 'CEO', email: `founder@${base.company.split(' ')[0].toLowerCase()}.in`,
    phone: '+91 •• •••• ••••', founded: '2018', employees: '80', revenue: '₹15 Cr FY25',
    useOfFunds: 'Expansion & working capital',
  }
  const financials = [
    { year: 'FY23', revenue: 8, ebitda: 1.1 },
    { year: 'FY24', revenue: 14, ebitda: 2.3 },
    { year: 'FY25', revenue: 22, ebitda: 4.0 },
    { year: 'FY26E', revenue: 35, ebitda: 7.2 },
    { year: 'FY27E', revenue: 52, ebitda: 12.5 },
  ]
  const documents = [
    { name: 'Pitch Deck', type: 'Presentation', date: '2026-06-10', status: 'Uploaded' },
    { name: 'Business Plan', type: 'Document', date: '2026-06-08', status: 'Uploaded' },
    { name: 'Financial Statements (3 yr)', type: 'Finance', date: '2026-06-05', status: 'Uploaded' },
    { name: 'Valuation Report', type: 'Finance', date: '2026-06-12', status: 'Uploaded' },
    { name: 'CIN / MCA Documents', type: 'Statutory', date: '2026-06-02', status: 'Verified' },
    { name: 'GST Certificate', type: 'Tax', date: '2026-06-02', status: 'Verified' },
  ]
  const dd = dueDiligence.find((d) => d.company === base.company) || null
  const matchedInvestors = matches.filter((m) => m.seeker === base.company)
  const timeline = [
    { step: 'Funding Request Submitted', date: '2026-05-20', done: true },
    { step: 'Documents Verified', date: '2026-06-02', done: true },
    { step: 'Proposal Built & Shared', date: '2026-06-12', done: base.status !== 'Enquiry' },
    { step: 'Due Diligence', date: '2026-06-25', done: base.status === 'Due Diligence' || base.status === 'Proposal Sent' },
    { step: 'Investor Commitment', date: 'In progress', done: false },
    { step: 'Deal Closure', date: 'Pending', done: false },
  ]
  return { ...base, ...extra, financials, documents, dd, matchedInvestors, timeline }
}

export function getProject(id) {
  const base = fdiProjects.find((p) => p.id === id)
  if (!base) return null
  const stages = ['Enquiry', 'In Discussion', 'Proposal Sent', 'Due Diligence', 'Closed']
  const currentIdx = stages.indexOf(base.stage)
  const timeline = stages.map((s, i) => ({ step: s, done: base.stage === 'Closed' ? true : i <= currentIdx }))
  const documents = [
    { name: 'Term Sheet', type: 'Agreement', date: '2026-06-15', status: base.progress >= 30 ? 'Signed' : 'Draft' },
    { name: 'Investment Agreement', type: 'Agreement', date: '2026-06-20', status: base.progress >= 55 ? 'Signed' : 'Pending Signature' },
    { name: 'FC-GPR Filing', type: 'RBI Form', date: '2026-06-25', status: base.progress >= 55 ? 'Filed' : 'Pending' },
    { name: 'Due Diligence Report', type: 'Report', date: '2026-06-22', status: base.progress >= 40 ? 'Verified' : 'In Progress' },
    { name: 'Board Resolution', type: 'Statutory', date: '2026-06-18', status: 'Verified' },
  ]
  return { ...base, timeline, documents }
}

export function getSeeker(id) {
  return seekers.find((s) => s.id === id) || null
}

// ---------- Name → id lookups (for cross-linking) ----------
export const investorIdByName = (name) => investors.find((i) => i.name === name)?.id || null
export const propertyIdByName = (name) => properties.find((p) => p.name === name)?.id || null
export const projectIdByName = (name) => fdiProjects.find((p) => p.name === name)?.id || null
export const seekerIdByName = (name) => seekers.find((s) => s.company === name)?.id || null

// ---------- Global search index (built live so newly-added records appear) ----------
export function buildSearchIndex() {
  return [
    ...investors.map((i) => ({ label: i.name, sub: `${i.country} · Capacity ${i.capacity}`, to: `/investors/${i.id}`, type: 'Investor', icon: 'Users' })),
    ...seekers.map((s) => ({ label: s.company, sub: `${s.industry} · ${s.location}`, to: `/seekers/${s.id}`, type: 'Seeker', icon: 'Building' })),
    ...properties.map((p) => ({ label: p.name, sub: `${p.category} · ${p.location}`, to: `/properties/${p.id}`, type: 'Property', icon: 'Building2' })),
    ...fdiProjects.map((p) => ({ label: p.name, sub: `${p.sector} · ${p.size}`, to: `/projects/${p.id}`, type: 'FDI Project', icon: 'Briefcase' })),
  ]
}

export function globalSearch(term) {
  const t = term.trim().toLowerCase()
  if (!t) return []
  return buildSearchIndex()
    .filter((e) => e.label.toLowerCase().includes(t) || e.sub.toLowerCase().includes(t) || e.type.toLowerCase().includes(t))
    .slice(0, 8)
}

// ---------- ID generators for newly-created records ----------
let _seq = 0
const uniq = () => `${Date.now().toString().slice(-5)}${(_seq++).toString().padStart(2, '0')}`
export const newInvestorId = () => `INV-${uniq()}`
export const newSeekerId = () => `SEK-${uniq()}`
export const newPropertyId = () => `PROP-${uniq()}`
export const newTicketId = () => `TKT-${uniq()}`

// ============================================================
// Notifications
// ============================================================
export const seedNotifications = [
  { id: 'n1', type: 'enquiry', title: 'New investor enquiry', text: 'Amit Verma submitted an investment enquiry.', when: '2 mins ago', read: false, tone: 'blue', icon: 'UserPlus', to: '/investors' },
  { id: 'n2', type: 'compliance', title: 'FC-GPR filing due', text: 'Fabrik Motors FC-GPR filing is due in 3 days.', when: '25 mins ago', read: false, tone: 'orange', icon: 'ShieldAlert', to: '/fema' },
  { id: 'n3', type: 'deal', title: 'Deal stage advanced', text: 'GreenTech Solar Expansion moved to Due Diligence.', when: '1 hour ago', read: false, tone: 'teal', icon: 'TrendingUp', to: '/projects/FDI-501' },
  { id: 'n4', type: 'payment', title: 'Invoice paid', text: 'Dubai Capital Group paid ₹3.54 L (INV-2026-0145).', when: '3 hours ago', read: true, tone: 'green', icon: 'CircleDollarSign', to: '/accounts' },
  { id: 'n5', type: 'property', title: 'Property valuation updated', text: 'Prime Commercial Tower revalued to ₹68.50 Cr.', when: '5 hours ago', read: true, tone: 'gold', icon: 'Building2', to: '/properties/PROP-301' },
  { id: 'n6', type: 'kyc', title: 'KYC verified', text: 'Sterling Holdings KYC package verified.', when: 'Yesterday', read: true, tone: 'green', icon: 'ShieldCheck', to: '/investors/INV-1004' },
]

// Random demo pushes to simulate incoming activity
export const demoPushes = [
  { title: 'New matched investor', text: 'Lion City Fund is a 94% match for GreenTech Solutions.', tone: 'purple', icon: 'GitCompareArrows', to: '/matching', type: 'match' },
  { title: 'Withdrawal request', text: 'Al Noor Investments requested a partial exit.', tone: 'orange', icon: 'LogOut', to: '/portal/investor', type: 'request' },
  { title: 'Document uploaded', text: 'NextGen Industries uploaded a valuation report.', tone: 'blue', icon: 'FileUp', to: '/documentation', type: 'document' },
  { title: 'Site visit reminder', text: 'Commercial Tower, Hyd site visit at 3:00 PM today.', tone: 'gold', icon: 'MapPin', to: '/tasks', type: 'reminder' },
  { title: 'New support ticket', text: 'GreenTech Solutions opened a ticket: “KYC document rejected”.', tone: 'red', icon: 'LifeBuoy', to: '/support', type: 'support' },
]

// ============================================================
// Support & Live Chat
// ============================================================
export const supportTickets = [
  { id: 'TKT-1042', subject: 'KYC document rejected — need clarification', requester: 'Dubai Capital Group', category: 'KYC', priority: 'High', status: 'Open', updated: '10m ago', agent: 'Priya Nair' },
  { id: 'TKT-1041', subject: 'Unable to download investment statement', requester: 'Sarah Johnson', category: 'Portal', priority: 'Medium', status: 'In Progress', updated: '1h ago', agent: 'Rahul Mehta' },
  { id: 'TKT-1040', subject: 'Question on profit distribution timeline', requester: 'Sterling Holdings', category: 'Finance', priority: 'Low', status: 'In Progress', updated: '3h ago', agent: 'Deepak Iyer' },
  { id: 'TKT-1039', subject: 'FEMA declaration format request', requester: 'NextGen Industries', category: 'Compliance', priority: 'Medium', status: 'Open', updated: '5h ago', agent: 'Unassigned' },
  { id: 'TKT-1038', subject: 'Change registered email address', requester: 'Meridian Global', category: 'Account', priority: 'Low', status: 'Resolved', updated: 'Yesterday', agent: 'Anita Desai' },
]

export const supportStats = { open: 12, inProgress: 8, resolvedToday: 15, avgResponse: '18 min', csat: '94%' }

export const chatConversations = [
  {
    id: 'c1', name: 'Dubai Capital Group', role: 'Investor', tint: 'blue', online: true, unread: 2, last: 'Thanks, that resolves it!',
    messages: [
      { from: 'them', text: 'Hi, my KYC document was marked rejected. Can you tell me why?', time: '10:02 AM' },
      { from: 'me', text: 'Hello! The passport scan was slightly blurred. Could you re-upload a clearer copy?', time: '10:04 AM' },
      { from: 'them', text: 'Sure, uploading now. Anything else needed?', time: '10:06 AM' },
      { from: 'me', text: 'That should be all. I’ll fast-track the re-verification today.', time: '10:07 AM' },
      { from: 'them', text: 'Thanks, that resolves it!', time: '10:08 AM' },
    ],
  },
  {
    id: 'c2', name: 'GreenTech Solutions', role: 'Seeker', tint: 'purple', online: true, unread: 0, last: 'When will the proposal be shared?',
    messages: [
      { from: 'them', text: 'Hi team, when will our proposal be shared with investors?', time: '09:30 AM' },
      { from: 'me', text: 'It’s in final review — should go out to 3 investors by EOD.', time: '09:35 AM' },
      { from: 'them', text: 'When will the proposal be shared?', time: '09:40 AM' },
    ],
  },
  {
    id: 'c3', name: 'Sarah Johnson', role: 'Investor', tint: 'blue', online: false, unread: 0, last: 'Got it, thank you.',
    messages: [
      { from: 'them', text: 'I can’t download my statement from the portal.', time: 'Yesterday' },
      { from: 'me', text: 'We’ve reset the export — please try again and let me know.', time: 'Yesterday' },
      { from: 'them', text: 'Got it, thank you.', time: 'Yesterday' },
    ],
  },
]

// Canned auto-replies for the live chat demo
export const cannedReplies = [
  'Thanks for your message! A relationship manager will respond shortly.',
  'Sure — let me pull up those details for you.',
  'I’ve noted that and raised it with our compliance team.',
  'Happy to help! Is there anything else you need?',
]
