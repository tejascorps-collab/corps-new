import { PageHeader, Card, CardHeader, Badge, StatCard, Icon } from '../../components/ui/Primitives'
import { portalSeeker as s } from '../../data/mockData'

export default function SeekerPortal() {
  const raisedPct = Math.round((parseFloat(s.raised) / parseFloat(s.required)) * 100)
  return (
    <div>
      <PageHeader title="Investment Seeker Portal" subtitle={`${s.company} · Funding request, documents & proposal tracking`} icon="Rocket">
        <Badge>{s.stage}</Badge>
        <button className="btn-gold btn-sm">Message Consultant</button>
      </PageHeader>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Funding Required" value={s.required} delta={0} up icon="Target" tint="gold" />
        <StatCard label="Committed" value={s.raised} delta={raisedPct} up icon="TrendingUp" tint="green" hint={`${raisedPct}% of goal`} />
        <StatCard label="Stage" value={s.stage} delta={0} up icon="Milestone" tint="blue" />
        <StatCard label="Proposal" value="Shared ×3" delta={0} up icon="Send" tint="purple" hint="with investors" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Timeline */}
        <Card>
          <CardHeader title="Proposal Status Timeline" icon="GitCommitVertical" />
          <div className="card-pad pt-4">
            <div className="relative space-y-6 pl-6">
              <div className="absolute left-[9px] top-1 h-[calc(100%-1rem)] w-px bg-white/10" />
              {s.timeline.map((t, i) => (
                <div key={i} className="relative">
                  <span className={`absolute -left-6 top-0.5 grid h-5 w-5 place-items-center rounded-full ring-2 ${
                    t.done ? 'bg-brand-green/20 text-brand-green ring-brand-green/40' : 'bg-ink-800 text-slate-500 ring-white/10'}`}>
                    {t.done ? <Icon name="Check" size={12} /> : <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />}
                  </span>
                  <div className="text-sm font-medium text-slate-100">{t.step}</div>
                  <div className="text-xs text-slate-500">{t.date}</div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Compliance checklist + upload */}
        <div className="space-y-6">
          <Card>
            <CardHeader title="Compliance Checklist" subtitle="Documents required to proceed" icon="ListChecks" />
            <div className="card-pad space-y-1.5 pt-3">
              {s.checklist.map((c) => (
                <div key={c.item} className="flex items-center justify-between rounded-lg px-2 py-1.5">
                  <span className="flex items-center gap-2.5 text-sm text-slate-300">
                    <Icon name={c.done ? 'CheckCircle2' : 'Circle'} size={16} className={c.done ? 'text-brand-green' : 'text-slate-500'} />
                    {c.item}
                  </span>
                  {c.done ? <Badge tone="green">Uploaded</Badge> : <button className="btn-ghost btn-sm">Upload</button>}
                </div>
              ))}
            </div>
          </Card>

          <Card className="card-pad">
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/10 py-8 text-center">
              <Icon name="UploadCloud" size={28} className="text-gold-300" />
              <div className="mt-2 text-sm font-medium text-slate-200">Upload Business Plan / Financials</div>
              <div className="text-xs text-slate-500">PDF, XLSX up to 25 MB</div>
              <button className="btn-gold btn-sm mt-4">Choose Files</button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
