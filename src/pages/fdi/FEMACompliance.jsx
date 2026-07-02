import { PageHeader, Card, CardHeader, Badge, StatCard, Table, Icon } from '../../components/ui/Primitives'
import { femaChecklist, femaSectorLimits } from '../../data/mockData'

const statusTone = { Complete: 'green', 'In Progress': 'blue', Pending: 'orange', 'Not Required': 'slate' }

export default function FEMACompliance() {
  return (
    <div>
      <PageHeader title="FEMA Compliance Assistance" subtitle="Eligibility, sector limits, RBI filings & compliance tracker" icon="ShieldCheck">
        <button className="btn-gold btn-sm">Run Eligibility Check</button>
      </PageHeader>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Compliant Deals" value="41" delta={6.0} up icon="ShieldCheck" tint="green" />
        <StatCard label="Pending RBI Filings" value="7" delta={2.0} up={false} icon="FileClock" tint="orange" hint="fewer" />
        <StatCard label="FC-GPR Filed" value="33" delta={9.0} up icon="FileCheck2" tint="teal" />
        <StatCard label="Overdue Returns" value="2" delta={1.0} up={false} icon="AlertTriangle" tint="red" hint="reduced" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Compliance Checklist" subtitle="GreenTech Solutions — CleanTech" icon="ListChecks" />
          <div className="card-pad space-y-2 pt-3">
            {femaChecklist.map((c) => (
              <div key={c.item} className="flex items-center justify-between rounded-xl bg-white/[0.02] px-3 py-2.5 ring-1 ring-white/5">
                <span className="flex items-center gap-2.5 text-sm text-slate-200">
                  <Icon name={c.status === 'Complete' ? 'CheckCircle2' : c.status === 'In Progress' ? 'Loader' : 'Circle'} size={16}
                    className={c.status === 'Complete' ? 'text-brand-green' : c.status === 'In Progress' ? 'text-brand-blue' : 'text-slate-500'} />
                  {c.item}
                </span>
                <Badge tone={statusTone[c.status]}>{c.status}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Sector-wise FDI Limits" subtitle="Reference — automatic vs government route" icon="Landmark" />
          <div className="card-pad pt-2">
            <Table
              columns={[
                { key: 'sector', label: 'Sector' },
                { key: 'limit', label: 'FDI Limit', align: 'right' },
                { key: 'route', label: 'Route' },
              ]}
              rows={femaSectorLimits}
              renderCell={(key, row) => {
                if (key === 'route') return <Badge tone={row.route === 'Automatic' ? 'green' : 'orange'}>{row.route}</Badge>
                if (key === 'limit') return <span className="font-semibold text-white">{row.limit}</span>
                return row[key]
              }}
            />
          </div>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { form: 'FC-GPR', desc: 'Reporting of foreign investment for issue of shares', status: 'In Progress' },
          { form: 'FC-TRS', desc: 'Transfer of shares between resident & non-resident', status: 'Pending' },
          { form: 'Annual Return (FLA)', desc: 'Foreign Liabilities & Assets return to RBI', status: 'Pending' },
        ].map((f) => (
          <Card key={f.form} className="card-pad">
            <div className="flex items-center justify-between">
              <span className="font-display text-lg font-bold text-gold-300">{f.form}</span>
              <Badge tone={statusTone[f.status]}>{f.status}</Badge>
            </div>
            <p className="mt-2 text-sm text-slate-400">{f.desc}</p>
            <button className="btn-ghost btn-sm mt-4 w-full">Manage Filing</button>
          </Card>
        ))}
      </div>
    </div>
  )
}
