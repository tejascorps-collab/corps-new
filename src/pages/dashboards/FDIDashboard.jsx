import { Card, CardHeader, StatCard, Badge, Icon, Progress, Avatar, initials } from '../../components/ui/Primitives'
import { AumProfitChart, DonutChart, RingChart, FunnelViz } from '../../components/charts/Charts'
import { aumProfitSeries, taskSummary, upcomingActivities } from '../../data/mockData'
import {
  totalAum, estimatedProfit, averageRoi, sectorDistribution, projectPipeline,
  recentEnquiriesFrom, fmtCr, fmtCount,
} from '../../lib/metrics'
import { Crown, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { useData } from '../../context/DataContext'
import { LinkAll, Legend, StatStrip, Hero } from './bits'

const ringData = [
  { name: 'Completed', value: taskSummary.completed, color: '#22c55e' },
  { name: 'In Progress', value: taskSummary.inProgress, color: '#3b82f6' },
  { name: 'Pending', value: taskSummary.pending, color: '#f59e0b' },
]

// Seekers past the initial enquiry stage count as active FDI projects.
const ACTIVE_STAGES = ['In Discussion', 'Proposal Sent', 'Due Diligence', 'Closed', 'Won', 'Funded']
// Rough completion for a seeker based on how far it is down the pipeline.
const STAGE_PROGRESS = { Enquiry: 15, 'In Discussion': 35, 'Proposal Sent': 55, 'Due Diligence': 75, Closed: 100, Won: 100, Funded: 100 }

export default function FDIDashboard() {
  const { currentUser, pushNotification } = useApp()
  const { investors, seekers, leads } = useData()
  const nav = useNavigate()
  const firstName = (currentUser?.name || 'there').split(' ')[0]

  // ---- Live-derived metrics (from the DB-backed collections) ----
  const aum = totalAum(investors)
  const profit = estimatedProfit(investors)
  const roi = averageRoi(investors)
  const activeProjects = seekers.filter((s) => ACTIVE_STAGES.includes(s.status)).length
  const distribution = sectorDistribution(investors)
  const pipeline = projectPipeline(seekers)
  const enquiries = recentEnquiriesFrom(leads, 5)

  const fdiStats = [
    { key: 'aum', label: 'Total AUM', value: fmtCr(aum), icon: 'Wallet', tint: 'purple' },
    { key: 'investors', label: 'Total Investors', value: fmtCount(investors.length), icon: 'Users', tint: 'blue' },
    { key: 'projects', label: 'Active FDI Projects', value: fmtCount(activeProjects), icon: 'Briefcase', tint: 'teal' },
    { key: 'profit', label: 'Est. Profit (YTD)', value: fmtCr(profit), icon: 'Coins', tint: 'gold' },
    { key: 'seekers', label: 'Investment Seekers', value: fmtCount(seekers.length), icon: 'Building', tint: 'orange' },
  ]

  const fdiFooterStats = [
    { label: 'Total Funds Raised', value: fmtCr(aum), icon: 'Target' },
    { label: 'Total Investors', value: fmtCount(investors.length), icon: 'Users' },
    { label: 'Investment Seekers', value: fmtCount(seekers.length), icon: 'Building2' },
    { label: 'Active Projects', value: fmtCount(activeProjects), icon: 'Briefcase' },
    { label: 'Total Leads', value: fmtCount(leads.length), icon: 'Filter' },
    { label: 'Average ROI', value: roi == null ? '—' : `${roi.toFixed(1)}%`, icon: 'Gauge' },
  ]

  // Active FDI investments table, built from seekers in the pipeline.
  const fdiInvestments = seekers.slice(0, 6).map((s) => ({
    name: s.company,
    amount: s.required,
    status: s.status,
    roi: s.roi,
    progress: STAGE_PROGRESS[s.status] ?? 20,
  }))

  return (
    <div className="space-y-6">
      {/* Hero + Global presence */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Hero
          title={
            <div className="flex items-center gap-2">
              <h2 className="font-display text-3xl font-bold text-white">Welcome back, {firstName}</h2>
              <Crown className="text-gold-400" size={26} />
            </div>
          }
          subtitle="Here's what's happening across your FDI advisory pipeline today."
          actions={
            <>
              <button className="btn-gold" onClick={() => nav('/projects')}>View FDI Projects</button>
              <button className="btn-ghost" onClick={() => nav('/investors')}>Add Investor</button>
            </>
          }
        />

        <Card className="card-pad flex flex-col justify-between bg-gradient-to-br from-gold-700/20 via-ink-800 to-ink-900">
          <div>
            <h3 className="font-display text-lg font-bold text-white">Global Presence</h3>
            <p className="text-sm text-gold-300">Connecting Opportunities Worldwide</p>
          </div>
          <div className="my-4 grid grid-cols-3 gap-3 text-center">
            {[['35+', 'Countries'], ['120+', 'Partners'], ['500+', 'Successful Deals']].map(([n, l]) => (
              <div key={l} className="rounded-xl bg-white/[0.03] py-3 ring-1 ring-white/5">
                <div className="text-xl font-bold text-gold-300">{n}</div>
                <div className="mt-0.5 text-[11px] text-slate-400">{l}</div>
              </div>
            ))}
          </div>
          <button className="btn-gold btn-sm w-full" onClick={() => nav('/matching')}>Run Investor Matching <ChevronRight size={15} /></button>
        </Card>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {fdiStats.map(({ key, ...s }) => <StatCard key={key} {...s} />)}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card>
          <CardHeader title="AUM & Profit Overview" subtitle="This Year" icon="TrendingUp"
            action={<button className="btn-ghost btn-sm" onClick={() => pushNotification({ type: 'system', title: 'View updated', text: 'Showing AUM & Profit for This Year.', tone: 'gold', icon: 'TrendingUp' })}>This Year</button>} />
          <div className="card-pad pt-3">
            <div className="mb-2 flex gap-4 text-xs">
              <Legend color="#d4af37" label="AUM (₹ Cr)" />
              <Legend color="#2ec4b6" label="Profit (₹ Cr)" />
            </div>
            <AumProfitChart data={aumProfitSeries} />
          </div>
        </Card>

        <Card>
          <CardHeader title="Investment Distribution" subtitle="By Sector" icon="PieChart"
            action={<button className="btn-ghost btn-sm" onClick={() => pushNotification({ type: 'system', title: 'View updated', text: 'Grouping investment distribution by sector.', tone: 'gold', icon: 'PieChart' })}>By Sector</button>} />
          <div className="card-pad grid grid-cols-2 items-center gap-2 pt-3">
            <DonutChart data={distribution} centerBottom={fmtCr(aum)} />
            <div className="space-y-2.5">
              {distribution.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-sm" style={{ background: d.color }} />
                    <span className="text-slate-300">{d.name}</span>
                  </span>
                  <span className="font-semibold text-white">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="FDI Project Pipeline" icon="Filter" action={<LinkAll to="/projects" />} />
          <div className="card-pad pt-3">
            <FunnelViz data={pipeline} />
          </div>
        </Card>
      </div>

      {/* Enquiries + Activities + Tasks */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-4">
        <Card className="xl:col-span-1">
          <CardHeader title="Recent Enquiries" action={<LinkAll to="/investors" />} />
          <div className="card-pad space-y-1 pt-3">
            {enquiries.map((e) => (
              <div key={e.name} className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-white/[0.03]">
                <Avatar initials={initials(e.name)} tint={e.type === 'Investor' ? 'blue' : 'purple'} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-slate-100">{e.name}</div>
                  <div className="text-xs text-slate-500">{e.type}</div>
                </div>
                <span className="text-[11px] text-slate-500">{e.when}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader title="Upcoming Activities" action={<LinkAll label="View Calendar" to="/tasks" />} />
          <div className="card-pad space-y-2 pt-3">
            {upcomingActivities.map((a, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl bg-white/[0.02] px-3 py-2.5 ring-1 ring-white/5">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-gold-400/10 text-center leading-none text-gold-300">
                  <span className="text-base font-bold">{a.day}</span>
                  <span className="mt-0.5 text-[9px] font-semibold">{a.mon}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-slate-100">{a.title}</div>
                  <div className="text-xs text-slate-500">{a.sub}</div>
                </div>
                <span className="chip bg-white/5 text-slate-300"><Icon name="Clock" size={12} /> {a.time}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Task Summary" action={<LinkAll to="/tasks" />} />
          <div className="card-pad pt-3">
            <RingChart data={ringData} centerTop="Total" centerBottom={taskSummary.total} />
            <div className="mt-3 space-y-2">
              {ringData.map((r) => (
                <div key={r.name} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: r.color }} />
                    <span className="text-slate-300">{r.name}</span>
                  </span>
                  <span className="font-semibold text-white">
                    {r.value} <span className="text-slate-500">({Math.round((r.value / taskSummary.total) * 100)}%)</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Active FDI investments */}
      <Card>
        <CardHeader title="Active FDI Investments" subtitle="Live projects across sectors" icon="Briefcase" action={<LinkAll to="/projects" />} />
        <div className="overflow-x-auto px-2 pb-2 pt-2">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="text-[11px] uppercase tracking-wide text-slate-500">
                <th className="px-3 py-2">Project</th>
                <th className="px-3 py-2">Amount</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">ROI</th>
                <th className="px-3 py-2">Progress</th>
              </tr>
            </thead>
            <tbody>
              {fdiInvestments.map((r) => (
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

      <StatStrip stats={fdiFooterStats} />
    </div>
  )
}
