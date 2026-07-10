import { Card, CardHeader, StatCard, Badge, Progress } from '../../components/ui/Primitives'
import { DonutChart, HBarChart, CashflowChart } from '../../components/charts/Charts'
import {
  funds, propertiesOverview, profitDistribution, intlProperties,
  propertyPerformance, cashflowSeries, recentInvestments,
} from '../../data/mockData'
import { Crown, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { LinkAll, Legend, StatStrip, Hero } from './bits'

const allocation = [
  { name: 'Allocated to Properties', value: 81, color: '#d4af37' },
  { name: 'Available Balance', value: 19, color: '#2ec4b6' },
]

const propertyStats = [
  { label: 'Properties Under Mgmt.', value: '32', delta: 11.2, up: true, icon: 'Building2', tint: 'orange' },
  { label: 'Total Fund Pool', value: funds.totalPool, delta: 12.0, up: true, icon: 'PiggyBank', tint: 'gold' },
  { label: 'Allocated', value: funds.allocated, delta: 9.0, up: true, icon: 'Send', tint: 'blue' },
  { label: 'Balance Available', value: funds.balance, delta: 3.0, up: true, icon: 'Wallet', tint: 'teal' },
  { label: 'Properties Sold (YTD)', value: '18', delta: 28.6, up: true, icon: 'Handshake', tint: 'green' },
]

const propertyFooterStats = [
  { label: 'Total Properties', value: '32', delta: 14.2, icon: 'Building2' },
  { label: 'Fund Pool', value: funds.totalPool, delta: 12.0, icon: 'PiggyBank' },
  { label: 'Properties Sold', value: '18', delta: 28.6, icon: 'Handshake' },
  { label: 'Average ROI', value: '19.6%', delta: 3.8, icon: 'Gauge' },
  { label: 'Total Exits', value: '18', delta: 28.6, icon: 'LogOut' },
  { label: 'Success Rate', value: '92%', delta: 5.4, icon: 'Award' },
]

export default function PropertyDashboard() {
  const { currentUser, pushNotification } = useApp()
  const nav = useNavigate()
  const firstName = (currentUser?.name || 'there').split(' ')[0]
  const propertyDeals = recentInvestments.filter((r) => r.type === 'Property')
  const intlTotal = intlProperties.reduce((n, c) => n + c.properties, 0)

  return (
    <div className="space-y-6">
      {/* Hero + International footprint */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Hero
          title={
            <div className="flex items-center gap-2">
              <h2 className="font-display text-3xl font-bold text-white">Welcome back, {firstName}</h2>
              <Crown className="text-gold-400" size={26} />
            </div>
          }
          subtitle="Here's how your property trading book is performing today."
          actions={
            <>
              <button className="btn-gold" onClick={() => nav('/properties')}>View Properties</button>
              <button className="btn-ghost" onClick={() => nav('/property-deals')}>New Deal</button>
            </>
          }
        />

        <Card className="card-pad flex flex-col justify-between bg-gradient-to-br from-gold-700/20 via-ink-800 to-ink-900">
          <div>
            <h3 className="font-display text-lg font-bold text-white">International Footprint</h3>
            <p className="text-sm text-gold-300">Cross-border property holdings</p>
          </div>
          <div className="my-4 grid grid-cols-3 gap-3 text-center">
            {[[`${intlProperties.length}`, 'Countries'], [`${intlTotal}`, 'Properties'], ['₹402 Cr', 'Book Value']].map(([n, l]) => (
              <div key={l} className="rounded-xl bg-white/[0.03] py-3 ring-1 ring-white/5">
                <div className="text-xl font-bold text-gold-300">{n}</div>
                <div className="mt-0.5 text-[11px] text-slate-400">{l}</div>
              </div>
            ))}
          </div>
          <button className="btn-gold btn-sm w-full" onClick={() => nav('/international')}>View International <ChevronRight size={15} /></button>
        </Card>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {propertyStats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card>
          <CardHeader title="Fund Allocation" subtitle="Pool utilisation" icon="PieChart" action={<LinkAll label="Fund Mgmt" to="/fund-management" />} />
          <div className="card-pad grid grid-cols-2 items-center gap-2 pt-3">
            <DonutChart data={allocation} centerTop="Pool" centerBottom={funds.totalPool} />
            <div className="space-y-3">
              {allocation.map((a) => (
                <div key={a.name} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-sm" style={{ background: a.color }} />
                    <span className="text-slate-300">{a.name}</span>
                  </span>
                  <span className="font-semibold text-white">{a.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Property Performance" subtitle="ROI by asset" icon="BarChart3"
            action={<button className="btn-ghost btn-sm" onClick={() => pushNotification({ type: 'property', title: 'View updated', text: 'Ranking properties by ROI.', tone: 'gold', icon: 'BarChart3' })}>By ROI</button>} />
          <div className="card-pad pt-3">
            <HBarChart data={propertyPerformance} dataKey="roi" categoryKey="property" />
          </div>
        </Card>

        <Card>
          <CardHeader title="Cashflow" subtitle="Inflow vs outflow (₹ Cr)" icon="TrendingUp" action={<LinkAll label="Accounts" to="/accounts" />} />
          <div className="card-pad pt-3">
            <div className="mb-2 flex gap-4 text-xs">
              <Legend color="#2ec4b6" label="Inflow" />
              <Legend color="#f59e0b" label="Outflow" />
            </div>
            <CashflowChart data={cashflowSeries} />
          </div>
        </Card>
      </div>

      {/* Properties overview + active deals */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader title="Properties Overview" icon="Building2" action={<LinkAll to="/properties" />} />
          <div className="card-pad grid grid-cols-1 gap-3 pt-3 sm:grid-cols-2">
            {propertiesOverview.map((p) => (
              <div key={p.name} className="overflow-hidden rounded-xl bg-white/[0.02] ring-1 ring-white/5">
                <div className="h-20 bg-gradient-to-br from-ink-700 to-ink-850" />
                <div className="p-3">
                  <div className="text-sm font-semibold text-slate-100">{p.name}</div>
                  <div className="text-xs text-slate-500">{p.location}</div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-bold text-gold-300">{p.value}</span>
                    <Badge tone={p.tone}>{p.status}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Active Property Deals" icon="Handshake" action={<LinkAll to="/property-deals" />} />
          <div className="overflow-x-auto px-2 pb-2 pt-2">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="text-[11px] uppercase tracking-wide text-slate-500">
                  <th className="px-3 py-2">Property</th>
                  <th className="px-3 py-2">Amount</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">ROI</th>
                  <th className="px-3 py-2">Progress</th>
                </tr>
              </thead>
              <tbody>
                {propertyDeals.map((r) => (
                  <tr key={r.name} className="table-row">
                    <td className="px-3 py-3 font-medium text-slate-100">{r.name}</td>
                    <td className="px-3 py-3 font-semibold text-white">{r.amount}</td>
                    <td className="px-3 py-3"><Badge>{r.status}</Badge></td>
                    <td className="px-3 py-3 text-brand-green">{r.roi}</td>
                    <td className="px-3 py-3"><Progress value={r.progress} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Profit distribution + international */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader title="Recent Profit Distribution" subtitle="Exits & settlements" icon="Coins" action={<LinkAll to="/profit-distribution" />} />
          <div className="card-pad space-y-2 pt-3">
            {profitDistribution.map((p) => (
              <div key={p.property} className="rounded-xl bg-white/[0.02] p-3 ring-1 ring-white/5">
                <div className="flex items-center justify-between gap-2">
                  <span className="min-w-0 truncate text-sm font-medium text-slate-100">{p.property}</span>
                  <Badge>{p.status}</Badge>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-slate-500">
                  <span>Net profit <span className="font-semibold text-brand-green">{p.netProfit}</span></span>
                  <span>Investor share <span className="font-semibold text-gold-300">{p.investorShare}</span></span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="International Holdings" subtitle="By country" icon="Globe" action={<LinkAll to="/international" />} />
          <div className="card-pad space-y-1.5 pt-3">
            {intlProperties.map((c) => (
              <div key={c.country} className="flex items-center gap-3 rounded-xl bg-white/[0.02] px-3 py-2.5 ring-1 ring-white/5">
                <span className="text-xl leading-none">{c.flag}</span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-slate-100">{c.country}</div>
                  <div className="text-xs text-slate-500">{c.properties} propert{c.properties === 1 ? 'y' : 'ies'} · {c.currency}</div>
                </div>
                <span className="font-semibold text-gold-300">{c.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <StatStrip stats={propertyFooterStats} />
    </div>
  )
}
