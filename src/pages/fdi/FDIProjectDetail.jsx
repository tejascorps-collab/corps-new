import { useParams, useNavigate } from 'react-router-dom'
import {
  Card, CardHeader, Badge, StatCard, Tabs, Field, BackLink, Table, Progress, Avatar, initials, Icon,
} from '../../components/ui/Primitives'
import { getProject, investorIdByName } from '../../data/mockData'

const docTone = { Signed: 'green', Filed: 'green', Verified: 'green', Draft: 'slate', 'Pending Signature': 'orange', Pending: 'orange', 'In Progress': 'blue' }

export default function FDIProjectDetail() {
  const { id } = useParams()
  const nav = useNavigate()
  const p = getProject(id)

  if (!p)
    return (
      <div>
        <BackLink label="Back to FDI Projects" onClick={() => nav('/projects')} />
        <Card className="card-pad text-center text-slate-400">Project “{id}” not found.</Card>
      </div>
    )

  const tabs = [
    { key: 'overview', label: 'Overview', icon: 'Briefcase' },
    { key: 'timeline', label: 'Deal Stage', icon: 'GitCommitVertical' },
    { key: 'documents', label: 'Documents', icon: 'FolderOpen', count: p.documents.length },
    { key: 'compliance', label: 'FEMA / RBI', icon: 'ShieldCheck' },
  ]

  return (
    <div>
      <BackLink label="Back to FDI Projects" onClick={() => nav('/projects')} />

      {/* Header */}
      <Card className="card-pad mb-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <span className="grid h-16 w-16 place-items-center rounded-2xl bg-brand-teal/15 text-brand-teal ring-1 ring-brand-teal/25">
              <Icon name="Briefcase" size={26} />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl font-bold text-white">{p.name}</h1>
                <Badge>{p.stage}</Badge>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-slate-400">
                <span>{p.id}</span>
                <span className="flex items-center gap-1"><Icon name="Factory" size={13} /> {p.sector}</span>
                <span className="flex items-center gap-1"><Icon name="Route" size={13} /> {p.route} Route</span>
                <span className="flex items-center gap-1"><Icon name="CalendarClock" size={13} /> Closes {p.closeDate}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="btn-ghost btn-sm"><Icon name="FileText" size={14} /> View Proposal</button>
            <button className="btn-gold btn-sm"><Icon name="ArrowRight" size={14} /> Advance Stage</button>
          </div>
        </div>
      </Card>

      {/* KPIs */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Deal Size" value={p.size} delta={0} up icon="Wallet" tint="gold" />
        <StatCard label="Sector" value={p.sector} delta={0} up icon="Factory" tint="teal" />
        <StatCard label="FDI Route" value={p.route} delta={0} up icon="Route" tint={p.route === 'Automatic' ? 'green' : 'orange'} />
        <StatCard label="Progress" value={`${p.progress}%`} delta={0} up icon="Gauge" tint="purple" />
      </div>

      <Tabs tabs={tabs}>
        {(active) => {
          if (active === 'overview')
            return (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                  <CardHeader title="Project Details" icon="Info" />
                  <div className="card-pad grid grid-cols-1 gap-3 pt-3 sm:grid-cols-2">
                    <Field label="Project ID" value={p.id} />
                    <Field label="Sector" value={p.sector} />
                    <Field label="Deal Size" value={p.size} accent />
                    <Field label="FDI Route" value={p.route} />
                    <Field label="Current Stage" value={p.stage} />
                    <Field label="Expected Close" value={p.closeDate} />
                    <div className="sm:col-span-2">
                      <div className="mt-1 rounded-xl bg-white/[0.02] p-3.5 ring-1 ring-white/5">
                        <div className="mb-2 flex items-center justify-between text-sm">
                          <span className="text-slate-400">Deal Progress</span>
                          <span className="font-semibold text-white">{p.progress}%</span>
                        </div>
                        <Progress value={p.progress} tone={p.progress === 100 ? 'green' : 'gold'} />
                      </div>
                    </div>
                  </div>
                </Card>
                <Card className="h-fit">
                  <CardHeader title="Lead Investor" icon="UserRound" />
                  <div className="card-pad pt-3">
                    <div className="flex items-center gap-3">
                      <Avatar initials={initials(p.investor)} tint="blue" />
                      <div>
                        <div className="font-medium text-slate-100">{p.investor}</div>
                        <div className="text-xs text-slate-500">Committed capital</div>
                      </div>
                    </div>
                    {investorIdByName(p.investor) && (
                      <button onClick={() => nav(`/investors/${investorIdByName(p.investor)}`)} className="btn-ghost btn-sm mt-4 w-full">View Investor</button>
                    )}
                  </div>
                </Card>
              </div>
            )

          if (active === 'timeline')
            return (
              <Card>
                <CardHeader title="Deal Stage Progression" icon="GitCommitVertical" />
                <div className="card-pad pt-4">
                  <div className="relative space-y-5 pl-6">
                    <div className="absolute left-[9px] top-1 h-[calc(100%-1rem)] w-px bg-white/10" />
                    {p.timeline.map((t, i) => (
                      <div key={i} className="relative">
                        <span className={`absolute -left-6 top-0.5 grid h-5 w-5 place-items-center rounded-full ring-2 ${
                          t.done ? 'bg-brand-green/20 text-brand-green ring-brand-green/40' : 'bg-ink-800 text-slate-500 ring-white/10'}`}>
                          {t.done ? <Icon name="Check" size={12} /> : <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />}
                        </span>
                        <div className={`text-sm font-medium ${t.done ? 'text-slate-100' : 'text-slate-400'}`}>{t.step}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )

          if (active === 'documents')
            return (
              <Table
                columns={[
                  { key: 'name', label: 'Document' },
                  { key: 'type', label: 'Type' },
                  { key: 'date', label: 'Date' },
                  { key: 'status', label: 'Status' },
                  { key: 'actions', label: '', align: 'right' },
                ]}
                rows={p.documents}
                renderCell={(key, row) => {
                  if (key === 'name')
                    return <span className="flex items-center gap-2.5 font-medium text-slate-100"><Icon name="FileText" size={16} className="text-brand-teal" /> {row.name}</span>
                  if (key === 'status') return <Badge tone={docTone[row.status] || 'slate'}>{row.status}</Badge>
                  if (key === 'actions')
                    return <button className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white"><Icon name="Download" size={15} /></button>
                  return row[key]
                }}
              />
            )

          // compliance
          return (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ['FDI Route', p.route, p.route === 'Automatic' ? 'green' : 'orange'],
                ['Sector Cap', '100% (indicative)', 'slate'],
                ['FC-GPR Filing', p.progress >= 55 ? 'Filed' : 'Pending', p.progress >= 55 ? 'green' : 'orange'],
                ['FC-TRS', 'Not Applicable', 'slate'],
                ['Annual Return (FLA)', 'Scheduled', 'blue'],
                ['Government Approval', p.route === 'Government' ? 'Required' : 'Not Required', p.route === 'Government' ? 'orange' : 'slate'],
              ].map(([label, val, tone]) => (
                <Card key={label} className="card-pad">
                  <div className="text-xs text-slate-500">{label}</div>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="font-semibold text-slate-100">{val}</span>
                    <Badge tone={tone}>{tone === 'green' ? 'OK' : tone === 'orange' ? 'Action' : 'Info'}</Badge>
                  </div>
                </Card>
              ))}
            </div>
          )
        }}
      </Tabs>
    </div>
  )
}
