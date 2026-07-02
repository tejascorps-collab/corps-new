import { useState } from 'react'
import { PageHeader, Card, CardHeader, Badge, Table, Progress, StatCard } from '../../components/ui/Primitives'
import { Modal, FormGrid, TextField, SelectField } from '../../components/ui/Modal'
import { useApp } from '../../context/AppContext'
import { dueDiligence } from '../../data/mockData'

const scopeOpts = ['Full Diligence', 'Financial Only', 'Legal Only', 'Litigation & Credit']
const emptyDD = { project: '', assignee: '', scope: 'Full Diligence' }

const checks = [
  'Company Verification', 'Financial Analysis', 'Legal Verification', 'Litigation Check',
  'Credit Rating', 'Director Verification', 'GST Verification', 'MCA Verification',
]

function tone(v) {
  if (['Verified', 'Clear'].includes(v)) return 'green'
  if (['In Progress', 'Pending'].includes(v)) return 'orange'
  if (v.includes('Pending')) return 'orange'
  return 'slate'
}

export default function DueDiligence() {
  const { pushNotification } = useApp()
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(emptyDD)
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }))

  const submit = (e) => {
    e.preventDefault()
    if (!form.project.trim()) return
    const name = form.project
    setModal(false)
    setForm(emptyDD)
    pushNotification({ type: 'system', title: 'Diligence started', text: `${form.scope} initiated for ${name}.`, tone: 'teal', icon: 'Search' })
  }

  return (
    <div>
      <PageHeader title="Due Diligence" subtitle="Company, financial, legal, litigation, credit & director verification" icon="Search">
        <button className="btn-gold btn-sm" onClick={() => { setForm(emptyDD); setModal(true) }}>+ Start Diligence</button>
      </PageHeader>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active Cases" value="14" delta={3.0} up icon="Search" tint="teal" />
        <StatCard label="Avg. DD Score" value="70.8" delta={4.5} up icon="Gauge" tint="gold" hint="out of 100" />
        <StatCard label="Cleared" value="26" delta={8.0} up icon="CheckCircle2" tint="green" />
        <StatCard label="Flags Raised" value="3" delta={1.0} up={false} icon="Flag" tint="red" hint="under review" />
      </div>

      <Card className="mb-6 overflow-hidden">
        <CardHeader title="Verification Matrix" subtitle="Diligence status across active companies" icon="Table2" />
        <div className="px-2 pb-2">
          <Table
            columns={[
              { key: 'company', label: 'Company' },
              { key: 'mca', label: 'MCA' },
              { key: 'gst', label: 'GST' },
              { key: 'litigation', label: 'Litigation' },
              { key: 'credit', label: 'Credit' },
              { key: 'director', label: 'Director' },
              { key: 'overall', label: 'DD Score' },
            ]}
            rows={dueDiligence}
            renderCell={(key, row) => {
              if (key === 'company') return <span className="font-medium text-slate-100">{row.company}</span>
              if (key === 'credit') return <span className="font-semibold text-white">{row.credit}</span>
              if (key === 'overall')
                return <Progress value={row.overall} tone={row.overall >= 75 ? 'green' : row.overall >= 55 ? 'gold' : 'orange'} />
              return <Badge tone={tone(row[key])}>{row[key]}</Badge>
            }}
          />
        </div>
      </Card>

      <Card className="card-pad">
        <h3 className="mb-4 text-sm font-semibold text-white">Standard Diligence Scope</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {checks.map((c) => (
            <div key={c} className="rounded-xl bg-white/[0.02] p-3 text-sm text-slate-300 ring-1 ring-white/5">
              {c}
            </div>
          ))}
        </div>
      </Card>

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title="Start Diligence"
        subtitle="Open a new due diligence case"
        icon="Search"
        footer={
          <>
            <button className="btn-ghost btn-sm" onClick={() => setModal(false)}>Cancel</button>
            <button className="btn-gold btn-sm" onClick={submit}>Start Diligence</button>
          </>
        }
      >
        <form onSubmit={submit}>
          <FormGrid>
            <TextField label="Company / Project" value={form.project} onChange={set('project')} placeholder="e.g. GreenTech Solutions" required full />
            <TextField label="Assignee" value={form.assignee} onChange={set('assignee')} placeholder="e.g. Anita Rao" />
            <SelectField label="Scope" value={form.scope} onChange={set('scope')} options={scopeOpts} />
          </FormGrid>
        </form>
      </Modal>
    </div>
  )
}
