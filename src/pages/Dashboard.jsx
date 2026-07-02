import {
  Card, CardHeader, StatCard, Badge, Icon, Progress, Avatar, initials,
} from '../components/ui/Primitives'
import { AumProfitChart, DonutChart, RingChart, FunnelViz } from '../components/charts/Charts'
import {
  dashboardStats, footerStats, aumProfitSeries, investmentDistribution,
  projectPipeline, taskSummary, recentEnquiries, upcomingActivities,
  recentInvestments, propertiesOverview,
} from '../data/mockData'
import { Crown, ChevronRight, ArrowUpRight } from 'lucide-react'

const ringData = [
  { name: 'Completed', value: taskSummary.completed, color: '#22c55e' },
  { name: 'In Progress', value: taskSummary.inProgress, color: '#3b82f6' },
  { name: 'Pending', value: taskSummary.pending, color: '#f59e0b' },
]

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Hero + Global presence */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="relative overflow-hidden rounded-2xl xl:col-span-2">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a2438] via-[#0f1626] to-[#0a0e17]" />
          {/* CSS skyline silhouette */}
          <div className="absolute bottom-0 left-0 right-0 h-2/3 opacity-60"
            style={{ background: 'linear-gradient(to top, rgba(212,175,55,0.10), transparent 70%)' }} />
          <svg className="absolute bottom-0 left-0 right-0 w-full opacity-30" height="140" preserveAspectRatio="none" viewBox="0 0 800 140">
            <g fill="#d4af37">
              {[20, 70, 110, 160, 210, 250, 300, 360, 410, 460, 520, 580, 630, 690, 740].map((x, i) => (
                <rect key={i} x={x} y={140 - (40 + (i * 37) % 90)} width={i % 3 === 0 ? 34 : 24} height={40 + (i * 37) % 90} />
              ))}
            </g>
          </svg>
          <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/70 to-transparent" />
          <div className="relative p-7">
            <div className="flex items-center gap-2">
              <h2 className="font-display text-3xl font-bold text-white">Welcome back, Tejas Taran</h2>
              <Crown className="text-gold-400" size={26} />
            </div>
            <p className="mt-1 text-slate-300">Here's what's happening with your investments today.</p>
            <div className="mt-16 flex flex-wrap gap-3">
              <button className="btn-gold">View Portfolio</button>
              <button className="btn-ghost">Add Investment</button>
            </div>
          </div>
        </div>

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
          <button className="btn-gold btn-sm w-full">View Global Network <ChevronRight size={15} /></button>
        </Card>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {dashboardStats.map(({ key, ...s }) => (
          <StatCard key={key} {...s} />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-1 xl:row-span-1">
          <CardHeader title="AUM & Profit Overview" subtitle="This Year" icon="TrendingUp"
            action={<button className="btn-ghost btn-sm">This Year</button>} />
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
            action={<button className="btn-ghost btn-sm">By Sector</button>} />
          <div className="card-pad grid grid-cols-2 items-center gap-2 pt-3">
            <DonutChart data={investmentDistribution} centerBottom="₹265.40 Cr" />
            <div className="space-y-2.5">
              {investmentDistribution.map((d) => (
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
          <CardHeader title="FDI Project Pipeline" icon="Filter" />
          <div className="card-pad pt-3">
            <FunnelViz data={projectPipeline} />
          </div>
        </Card>
      </div>

      {/* Enquiries + Activities + Tasks */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-4">
        <Card className="xl:col-span-1">
          <CardHeader title="Recent Enquiries" action={<LinkAll />} />
          <div className="card-pad space-y-1 pt-3">
            {recentEnquiries.map((e) => (
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
          <CardHeader title="Upcoming Activities" action={<LinkAll label="View Calendar" />} />
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
          <CardHeader title="Task Summary" />
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

      {/* Recent investments + properties overview */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader title="Recent Investments" action={<LinkAll />} />
          <div className="overflow-x-auto px-2 pb-2 pt-2">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="text-[11px] uppercase tracking-wide text-slate-500">
                  <th className="px-3 py-2">Project</th>
                  <th className="px-3 py-2">Type</th>
                  <th className="px-3 py-2">Amount</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">ROI</th>
                  <th className="px-3 py-2">Progress</th>
                </tr>
              </thead>
              <tbody>
                {recentInvestments.map((r) => (
                  <tr key={r.name} className="table-row">
                    <td className="px-3 py-3 font-medium text-slate-100">{r.name}</td>
                    <td className="px-3 py-3 text-slate-400">{r.type}</td>
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

        <Card>
          <CardHeader title="Properties Overview" action={<LinkAll />} />
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
      </div>

      {/* Footer stat strip */}
      <Card className="card-pad">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {footerStats.map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-gold-400/10 text-gold-300 ring-1 ring-gold-400/20">
                <Icon name={s.icon} size={18} />
              </span>
              <div>
                <div className="text-lg font-bold text-white">{s.value}</div>
                <div className="text-[11px] text-slate-500">{s.label}</div>
                <div className="flex items-center gap-0.5 text-[11px] text-brand-green">
                  <ArrowUpRight size={11} /> {s.delta}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function LinkAll({ label = 'View All' }) {
  return (
    <button className="flex items-center gap-1 text-xs font-medium text-gold-400 hover:text-gold-300">
      {label} <ChevronRight size={14} />
    </button>
  )
}
function Legend({ color, label }) {
  return (
    <span className="flex items-center gap-1.5 text-slate-400">
      <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} /> {label}
    </span>
  )
}
