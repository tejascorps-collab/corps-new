import { PageHeader, Card, Badge, StatCard, Avatar, initials, Icon } from '../../components/ui/Primitives'
import { HBarChart } from '../../components/charts/Charts'
import { leads, crmPipeline } from '../../data/mockData'

const stages = ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation']
const channels = [
  { icon: 'Phone', label: 'Calls', count: 42, tint: 'blue' },
  { icon: 'MessageCircle', label: 'WhatsApp', count: 128, tint: 'green' },
  { icon: 'Mail', label: 'Emails', count: 264, tint: 'purple' },
  { icon: 'CalendarDays', label: 'Meetings', count: 19, tint: 'orange' },
]

export default function CRM() {
  return (
    <div>
      <PageHeader title="CRM & Leads" subtitle="Leads, calls, follow-ups, WhatsApp, email, meetings & tasks" icon="Contact">
        <button className="btn-gold btn-sm">+ Add Lead</button>
      </PageHeader>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {channels.map((c) => (
          <Card key={c.label} className="card-pad flex items-center gap-4">
            <span className={`grid h-11 w-11 place-items-center rounded-xl bg-brand-${c.tint}/10 text-brand-${c.tint}`}>
              <Icon name={c.icon} size={20} />
            </span>
            <div>
              <div className="text-xl font-bold text-white">{c.count}</div>
              <div className="text-xs text-slate-500">{c.label} this month</div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <div className="px-5 pt-5 text-sm font-semibold text-white">Lead Pipeline</div>
          <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 lg:grid-cols-5">
            {stages.map((s) => {
              const items = leads.filter((l) => l.stage === s)
              return (
                <div key={s} className="rounded-xl bg-white/[0.02] p-2.5 ring-1 ring-white/5">
                  <div className="mb-2 flex items-center justify-between px-1">
                    <span className="text-xs font-semibold text-slate-300">{s}</span>
                    <span className="chip bg-white/5 text-slate-400">{items.length}</span>
                  </div>
                  <div className="space-y-2">
                    {items.map((l) => (
                      <div key={l.name} className="rounded-lg bg-ink-800 p-2.5 ring-1 ring-white/5">
                        <div className="flex items-center gap-2">
                          <Avatar initials={initials(l.name)} tint={l.type === 'Investor' ? 'blue' : 'purple'} />
                          <div className="min-w-0">
                            <div className="truncate text-xs font-medium text-slate-100">{l.name}</div>
                            <div className="truncate text-[10px] text-slate-500">{l.company}</div>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-gold-300">{l.value}</span>
                          <span className="text-[10px] text-slate-500">{l.last}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        <Card>
          <div className="px-5 pt-5 text-sm font-semibold text-white">Pipeline by Stage</div>
          <div className="card-pad pt-3">
            <HBarChart data={crmPipeline} dataKey="count" categoryKey="stage" />
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="px-5 pt-5 text-sm font-semibold text-white">All Leads</div>
        <div className="overflow-x-auto px-2 pb-2 pt-2">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="text-[11px] uppercase tracking-wide text-slate-500">
                {['Lead', 'Type', 'Source', 'Stage', 'Owner', 'Value', 'Last Activity'].map((h) => (
                  <th key={h} className="px-3 py-2">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.name} className="table-row">
                  <td className="px-3 py-3">
                    <div className="font-medium text-slate-100">{l.name}</div>
                    <div className="text-xs text-slate-500">{l.company}</div>
                  </td>
                  <td className="px-3 py-3"><Badge tone={l.type === 'Investor' ? 'blue' : 'purple'}>{l.type}</Badge></td>
                  <td className="px-3 py-3 text-slate-400">{l.source}</td>
                  <td className="px-3 py-3"><Badge tone="slate">{l.stage}</Badge></td>
                  <td className="px-3 py-3 text-slate-400">{l.owner}</td>
                  <td className="px-3 py-3 font-semibold text-gold-300">{l.value}</td>
                  <td className="px-3 py-3 text-slate-500">{l.last}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
