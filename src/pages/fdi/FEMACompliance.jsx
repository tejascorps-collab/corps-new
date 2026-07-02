import { useState } from 'react'
import { PageHeader, Card, CardHeader, Badge, StatCard, Table, Icon } from '../../components/ui/Primitives'
import { Modal } from '../../components/ui/Modal'
import { useApp } from '../../context/AppContext'
import { femaChecklist, femaSectorLimits } from '../../data/mockData'

const statusTone = { Complete: 'green', 'In Progress': 'blue', Pending: 'orange', 'Not Required': 'slate' }

export default function FEMACompliance() {
  const { pushNotification } = useApp()
  const [eligibility, setEligibility] = useState(false)
  const [filing, setFiling] = useState(null)

  const runEligibility = () => {
    setEligibility(true)
    pushNotification({ type: 'system', title: 'Eligibility check complete', text: 'CleanTech is eligible under the Automatic route (100% cap).', tone: 'green', icon: 'ShieldCheck' })
  }

  const markFiled = () => {
    const name = filing?.form
    setFiling(null)
    pushNotification({ type: 'system', title: 'Filing submitted', text: `${name} marked as filed with RBI.`, tone: 'green', icon: 'FileCheck2' })
  }

  return (
    <div>
      <PageHeader title="FEMA Compliance Assistance" subtitle="Eligibility, sector limits, RBI filings & compliance tracker" icon="ShieldCheck">
        <button className="btn-gold btn-sm" onClick={runEligibility}>Run Eligibility Check</button>
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
            <button className="btn-ghost btn-sm mt-4 w-full" onClick={() => setFiling(f)}>Manage Filing</button>
          </Card>
        ))}
      </div>

      <Modal
        open={eligibility}
        onClose={() => setEligibility(false)}
        title="FDI Eligibility Result"
        subtitle="GreenTech Solutions — CleanTech"
        icon="ShieldCheck"
        footer={<button className="btn-gold btn-sm" onClick={() => setEligibility(false)}>Done</button>}
      >
        <div className="space-y-2">
          {[
            ['Sector', 'CleanTech / Renewable Energy', 'green', 'Allowed'],
            ['FDI Route', 'Automatic', 'green', 'No approval'],
            ['Sector Cap', '100%', 'green', 'OK'],
            ['Government Approval', 'Not Required', 'slate', 'Info'],
            ['Pricing Guidelines', 'FEMA compliant', 'green', 'OK'],
          ].map(([label, val, tone, tag]) => (
            <div key={label} className="flex items-center justify-between rounded-xl bg-white/[0.02] px-3 py-2.5 ring-1 ring-white/5">
              <span className="text-sm text-slate-300">{label}</span>
              <span className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-100">{val}</span>
                <Badge tone={tone}>{tag}</Badge>
              </span>
            </div>
          ))}
        </div>
      </Modal>

      <Modal
        open={!!filing}
        onClose={() => setFiling(null)}
        title={filing ? `${filing.form} Filing` : 'Filing'}
        subtitle={filing?.desc}
        icon="FileClock"
        footer={
          <>
            <button className="btn-ghost btn-sm" onClick={() => setFiling(null)}>Close</button>
            <button className="btn-gold btn-sm" onClick={markFiled}><Icon name="FileCheck2" size={14} /> Mark Filed</button>
          </>
        }
      >
        {filing && (
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-white/[0.02] px-3 py-2.5 ring-1 ring-white/5">
              <span className="text-sm text-slate-300">Form</span>
              <span className="text-sm font-semibold text-slate-100">{filing.form}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white/[0.02] px-3 py-2.5 ring-1 ring-white/5">
              <span className="text-sm text-slate-300">Current Status</span>
              <Badge tone={statusTone[filing.status]}>{filing.status}</Badge>
            </div>
            <p className="text-sm text-slate-400">{filing.desc}</p>
          </div>
        )}
      </Modal>
    </div>
  )
}
