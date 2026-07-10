import { resource } from '../lib/crud.js'

// Each resource maps a Prisma model to a REST router with a shaping function
// that mirrors the frontend's create defaults (see old DataContext).

export const investors = resource({
  model: 'investor',
  prefix: 'INV',
  idStart: 1001,
  jsonFields: ['industries'],
  shape: (b) => ({
    name: b.name,
    country: b.country || 'India',
    capacity: b.capacity || '₹0 Cr',
    industries: Array.isArray(b.industries)
      ? b.industries
      : String(b.industries || '').split(',').map((s) => s.trim()).filter(Boolean),
    kyc: b.kyc || 'Pending',
    invested: b.invested || '₹0.00 Cr',
    roi: b.roi || '—',
    rm: b.rm || 'Unassigned',
    risk: b.risk || 'Moderate',
    status: b.status || 'Onboarding',
  }),
})

export const seekers = resource({
  model: 'seeker',
  prefix: 'SEK',
  idStart: 2001,
  shape: (b) => ({
    company: b.company,
    cin: b.cin || '—',
    industry: b.industry || 'General',
    location: b.location || 'India',
    required: b.required || '₹0 Cr',
    equity: b.equity || '0%',
    roi: b.roi || '0%',
    stage: b.stage || 'Seed',
    valuation: b.valuation || '₹0 Cr',
    status: b.status || 'Enquiry',
  }),
})

export const properties = resource({
  model: 'property',
  prefix: 'PROP',
  idStart: 301,
  shape: (b) => ({
    name: b.name,
    category: b.category || 'Commercial',
    location: b.location || 'India',
    purchase: b.purchase || '₹0 Cr',
    current: b.current || b.purchase || '₹0 Cr',
    expected: b.expected || '₹0 Cr',
    rental: b.rental || '—',
    roi: b.roi || '0%',
    legal: b.legal || 'Under Review',
    status: b.status || 'Acquired',
  }),
})

export const leads = resource({
  model: 'lead',
  prefix: 'LEAD',
  idStart: 1,
  shape: (b) => ({
    name: b.name,
    company: b.company || '—',
    type: b.type || 'Investor',
    source: b.source || 'Manual',
    stage: b.stage || 'New',
    owner: b.owner || 'Sales · You',
    value: b.value || '—',
    phone: b.phone || '',
    last: b.last || 'just now',
  }),
})

export const tickets = resource({
  model: 'ticket',
  prefix: 'TKT',
  idStart: 4001,
  shape: (b) => ({
    subject: b.subject,
    requester: b.requester || '—',
    category: b.category || 'General',
    priority: b.priority || 'Medium',
    status: b.status || 'Open',
    agent: b.agent || 'Unassigned',
    updated: b.updated || 'just now',
  }),
})

export const callLogs = resource({
  model: 'callLog',
  prefix: 'CL',
  idStart: 1042,
  shape: (b) => ({
    name: b.name || 'Unknown',
    number: b.number || '',
    direction: b.direction || 'outbound',
    status: b.status || 'Answered',
    duration: Number(b.duration) || 0,
    agent: b.agent || '',
  }),
})
