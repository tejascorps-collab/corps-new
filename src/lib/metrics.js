// ---------------------------------------------------------------------------
// Live dashboard metrics.
//
// The dashboards used to render hardcoded numbers from mockData. These helpers
// derive the same shapes from the live, DB-backed collections (investors,
// seekers, properties, leads) so the KPIs reflect real data as it is entered.
//
// Only metrics that can be honestly computed from stored records live here.
// Things with no source of truth yet (month-over-month history, tasks, calendar
// activities) are intentionally NOT faked — the dashboard keeps its illustrative
// series for those and they are labelled as such.
// ---------------------------------------------------------------------------

// "₹45.00 Cr" | "₹1,256" | 45 → 45.  Strips currency/commas/units.
export const parseCr = (v) => {
  if (typeof v === 'number') return Number.isFinite(v) ? v : 0
  const n = parseFloat(String(v ?? '').replace(/[^0-9.]/g, ''))
  return Number.isFinite(n) ? n : 0
}

// "18.5%" → 18.5 ; "—" / blank → null (so it can be excluded from averages).
export const parsePct = (v) => {
  const s = String(v ?? '').replace(/[^0-9.]/g, '')
  if (!s) return null
  const n = parseFloat(s)
  return Number.isFinite(n) ? n : null
}

export const fmtCr = (n) =>
  `₹${Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Cr`

export const fmtCount = (n) => Number(n || 0).toLocaleString('en-IN')

const sum = (arr, pick) => arr.reduce((t, x) => t + pick(x), 0)

// Stable colours for known sectors; a fallback palette covers anything else.
const SECTOR_COLORS = {
  'Real Estate': '#f59e0b',
  Manufacturing: '#3b82f6',
  Technology: '#8b5cf6',
  Healthcare: '#2ec4b6',
  Hospitality: '#ec4899',
  Industrial: '#0ea5e9',
  Agriculture: '#84cc16',
  CleanTech: '#22c55e',
}
const FALLBACK_PALETTE = ['#f59e0b', '#3b82f6', '#8b5cf6', '#2ec4b6', '#ec4899', '#0ea5e9', '#84cc16']
const OTHERS_COLOR = '#64748b'

// ---------------------------------------------------------------------------
// KPI aggregates
// ---------------------------------------------------------------------------

// Total assets under management = sum of every investor's invested amount.
export const totalAum = (investors = []) => sum(investors, (i) => parseCr(i.invested))

// Estimated annual profit = Σ invested × ROI%. A real, derived proxy — not a
// stored figure — of the portfolio's annualised return.
export const estimatedProfit = (investors = []) =>
  sum(investors, (i) => {
    const roi = parsePct(i.roi)
    return roi == null ? 0 : (parseCr(i.invested) * roi) / 100
  })

// Portfolio-weighted average ROI across investors that have a real ROI.
export const averageRoi = (investors = []) => {
  const withRoi = investors.filter((i) => parsePct(i.roi) != null && parseCr(i.invested) > 0)
  const capital = sum(withRoi, (i) => parseCr(i.invested))
  if (capital === 0) return null
  const weighted = sum(withRoi, (i) => parseCr(i.invested) * parsePct(i.roi))
  return weighted / capital
}

// ---------------------------------------------------------------------------
// Distributions
// ---------------------------------------------------------------------------

// Investment distribution by sector, from investors' capital split across the
// sectors they operate in. Returns the top 4 sectors + "Others", as whole-number
// percentages summing to 100. Shape matches DonutChart: { name, value, color }.
export const sectorDistribution = (investors = []) => {
  const bySector = {}
  for (const inv of investors) {
    const cap = parseCr(inv.invested)
    if (cap <= 0) continue
    const sectors = Array.isArray(inv.industries) && inv.industries.length ? inv.industries : ['Others']
    const share = cap / sectors.length
    for (const s of sectors) bySector[s] = (bySector[s] || 0) + share
  }
  const total = Object.values(bySector).reduce((t, v) => t + v, 0)
  if (total === 0) return []

  const ranked = Object.entries(bySector).sort((a, b) => b[1] - a[1])
  const top = ranked.slice(0, 4)
  const othersAmt = ranked.slice(4).reduce((t, [, v]) => t + v, 0)

  const rows = top.map(([name, amt], i) => ({
    name,
    value: Math.round((amt / total) * 100),
    color: SECTOR_COLORS[name] || FALLBACK_PALETTE[i % FALLBACK_PALETTE.length],
  }))
  if (othersAmt > 0) rows.push({ name: 'Others', value: Math.round((othersAmt / total) * 100), color: OTHERS_COLOR })

  // Fix rounding drift so the slices total exactly 100%.
  const drift = 100 - rows.reduce((t, r) => t + r.value, 0)
  if (rows.length && drift !== 0) rows[0].value += drift
  return rows
}

// FDI project pipeline funnel, derived from seekers' status. Shape matches
// FunnelViz: { stage, count, color }. Stages are shown even at zero so the
// funnel keeps its shape.
const PIPELINE_STAGES = [
  { stage: 'Enquiries', match: ['Enquiry', 'New', 'Enquiries'], color: '#38bdf8' },
  { stage: 'In Discussion', match: ['In Discussion', 'Contacted', 'Qualified'], color: '#2ec4b6' },
  { stage: 'Proposal Sent', match: ['Proposal Sent', 'Proposal'], color: '#8b5cf6' },
  { stage: 'Due Diligence', match: ['Due Diligence'], color: '#f59e0b' },
  { stage: 'Closed Deals', match: ['Closed', 'Won', 'Closed Deals', 'Funded'], color: '#22c55e' },
]

export const projectPipeline = (seekers = []) =>
  PIPELINE_STAGES.map(({ stage, match, color }) => ({
    stage,
    color,
    count: seekers.filter((s) => match.includes(s.status) || match.includes(s.stage)).length,
  }))

// Newest enquiries, from leads. Shape matches the dashboard list: { name, type, when }.
export const recentEnquiriesFrom = (leads = [], n = 5) =>
  leads.slice(0, n).map((l) => ({
    name: l.name || l.company || '—',
    type: l.type || 'Lead',
    when: l.last || 'recently',
  }))

// Property-side aggregates ------------------------------------------------------

export const propertiesValue = (properties = []) =>
  sum(properties, (p) => parseCr(p.current || p.purchase))

export const propertiesInvested = (properties = []) =>
  sum(properties, (p) => parseCr(p.purchase))

export const propertyAverageRoi = (properties = []) => {
  const withRoi = properties.filter((p) => parsePct(p.roi) != null)
  if (!withRoi.length) return null
  return sum(withRoi, (p) => parsePct(p.roi)) / withRoi.length
}
