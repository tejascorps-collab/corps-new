import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Card, CardHeader, Badge, StatCard, Avatar, initials, Tabs, Field, BackLink, Table, Progress, Icon,
} from '../../components/ui/Primitives'
import { Modal, FormGrid, TextField, SelectField, ConfirmDialog } from '../../components/ui/Modal'
import { useData } from '../../context/DataContext'
import { useApp } from '../../context/AppContext'
import { RevenueChart } from '../../components/charts/Charts'
import { getSeekerDetail, investorIdByName } from '../../data/mockData'

const docTone = { Verified: 'green', Uploaded: 'blue' }
const industryOpts = ['CleanTech', 'Manufacturing', 'Healthcare', 'Real Estate', 'Agriculture', 'Automotive', 'Technology']
const stageOpts = ['Seed', 'Series A', 'Series B', 'Growth']
const statusOpts = ['Enquiry', 'In Discussion', 'Proposal Sent', 'Due Diligence']

export default function SeekerDetail() {
  const { id } = useParams()
  const nav = useNavigate()
  const { seekers, updateSeeker, deleteSeeker } = useData()
  void seekers
  const { pushNotification } = useApp()
  const s = getSeekerDetail(id)
  const [edit, setEdit] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const [form, setForm] = useState(null)
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }))

  const openEdit = () => {
    setForm({
      company: s.company, cin: s.cin, industry: s.industry, location: s.location,
      required: s.required, equity: s.equity, roi: s.roi, valuation: s.valuation, stage: s.stage, status: s.status,
    })
    setEdit(true)
  }
  const saveEdit = (e) => { e.preventDefault(); updateSeeker(id, form); setEdit(false) }
  const doDelete = () => {
    const name = s.company
    deleteSeeker(id)
    setConfirm(false)
    pushNotification({ type: 'seeker', title: 'Seeker deleted', text: `${name} was removed.`, tone: 'red', icon: 'Building', to: '/seekers' })
    nav('/seekers')
  }

  if (!s)
    return (
      <div>
        <BackLink label="Back to Investment Seekers" onClick={() => nav('/seekers')} />
        <Card className="card-pad text-center text-slate-400">Seeker “{id}” not found.</Card>
      </div>
    )

  const tabs = [
    { key: 'overview', label: 'Overview', icon: 'Building' },
    { key: 'financials', label: 'Financials', icon: 'LineChart' },
    { key: 'documents', label: 'Documents', icon: 'FolderOpen', count: s.documents.length },
    { key: 'dd', label: 'Due Diligence', icon: 'Search' },
    { key: 'matches', label: 'Matched Investors', icon: 'GitCompareArrows', count: s.matchedInvestors.length },
  ]

  return (
    <div>
      <BackLink label="Back to Investment Seekers" onClick={() => nav('/seekers')} />

      {/* Header */}
      <Card className="card-pad mb-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <span className="grid h-16 w-16 place-items-center rounded-2xl bg-brand-purple/15 text-xl font-bold text-brand-purple ring-1 ring-brand-purple/25">
              {initials(s.company)}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl font-bold text-white">{s.company}</h1>
                <Badge>{s.status}</Badge>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-slate-400">
                <span>{s.id}</span>
                <span className="flex items-center gap-1"><Icon name="Factory" size={13} /> {s.industry}</span>
                <span className="flex items-center gap-1"><Icon name="MapPin" size={13} /> {s.location}</span>
                <span className="flex items-center gap-1"><Icon name="Milestone" size={13} /> {s.stage}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="btn-ghost btn-sm" onClick={openEdit}><Icon name="Pencil" size={14} /> Edit</button>
            <button className="btn-ghost btn-sm text-brand-red hover:bg-brand-red/10" onClick={() => setConfirm(true)}><Icon name="Trash2" size={14} /> Delete</button>
            <button className="btn-gold btn-sm"><Icon name="Handshake" size={14} /> Advance Stage</button>
          </div>
        </div>
      </Card>

      {/* KPIs */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Funding Required" value={s.required} delta={0} up icon="Target" tint="gold" />
        <StatCard label="Equity Offered" value={s.equity} delta={0} up icon="PieChart" tint="purple" />
        <StatCard label="Expected ROI" value={s.roi} delta={0} up icon="Gauge" tint="green" />
        <StatCard label="Valuation" value={s.valuation} delta={0} up icon="TrendingUp" tint="teal" />
      </div>

      <Tabs tabs={tabs}>
        {(active) => {
          if (active === 'overview')
            return (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                  <CardHeader title="Company Profile" icon="Building" />
                  <div className="card-pad grid grid-cols-1 gap-3 pt-3 sm:grid-cols-2">
                    <Field label="CIN" value={s.cin} />
                    <Field label="Industry" value={s.industry} />
                    <Field label="Location" value={s.location} />
                    <Field label="Founded" value={s.founded} />
                    <Field label="Employees" value={s.employees} />
                    <Field label="Latest Revenue" value={s.revenue} />
                    <Field label="Funding Stage" value={s.stage} />
                    <Field label="Valuation" value={s.valuation} accent />
                    <div className="sm:col-span-2"><Field label="Use of Funds" value={s.useOfFunds} /></div>
                  </div>
                </Card>
                <Card className="h-fit">
                  <CardHeader title="Primary Contact" icon="UserRound" />
                  <div className="card-pad pt-3">
                    <div className="flex items-center gap-3">
                      <Avatar initials={initials(s.contact)} tint="purple" />
                      <div>
                        <div className="font-medium text-slate-100">{s.contact}</div>
                        <div className="text-xs text-slate-500">{s.role}</div>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-slate-300"><Icon name="Mail" size={14} className="text-slate-500" /> {s.email}</div>
                      <div className="flex items-center gap-2 text-slate-300"><Icon name="Phone" size={14} className="text-slate-500" /> {s.phone}</div>
                    </div>
                    <button className="btn-ghost btn-sm mt-4 w-full">Schedule Meeting</button>
                  </div>
                </Card>
              </div>
            )

          if (active === 'financials')
            return (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                  <CardHeader title="Revenue & EBITDA" subtitle="Historical + projected (₹ Cr)" icon="LineChart" />
                  <div className="card-pad pt-3"><RevenueChart data={s.financials} /></div>
                </Card>
                <Card className="h-fit">
                  <CardHeader title="Deal Terms" icon="Handshake" />
                  <div className="card-pad grid grid-cols-1 gap-3 pt-3">
                    <Field label="Funding Required" value={s.required} accent />
                    <Field label="Equity Offered" value={s.equity} />
                    <Field label="Implied Valuation" value={s.valuation} />
                    <Field label="Expected ROI" value={s.roi} />
                  </div>
                </Card>
              </div>
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
                rows={s.documents}
                renderCell={(key, row) => {
                  if (key === 'name')
                    return <span className="flex items-center gap-2.5 font-medium text-slate-100"><Icon name="FileText" size={16} className="text-brand-purple" /> {row.name}</span>
                  if (key === 'status') return <Badge tone={docTone[row.status] || 'slate'}>{row.status}</Badge>
                  if (key === 'actions')
                    return <button className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white"><Icon name="Download" size={15} /></button>
                  return row[key]
                }}
              />
            )

          if (active === 'dd')
            return s.dd ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  ['MCA Verification', s.dd.mca], ['GST Verification', s.dd.gst], ['Litigation Check', s.dd.litigation],
                  ['Credit Rating', s.dd.credit], ['Director Verification', s.dd.director],
                ].map(([label, val]) => (
                  <Card key={label} className="card-pad">
                    <div className="text-xs text-slate-500">{label}</div>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="font-semibold text-slate-100">{val}</span>
                      <Badge tone={['Verified', 'Clear'].includes(val) ? 'green' : val.includes('Pending') || val === 'In Progress' ? 'orange' : 'slate'}>
                        {['Verified', 'Clear'].includes(val) ? 'Pass' : 'Review'}
                      </Badge>
                    </div>
                  </Card>
                ))}
                <Card className="card-pad sm:col-span-2 lg:col-span-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-semibold text-white">Overall Diligence Score</span>
                    <span className="font-display text-lg font-bold text-gold-300">{s.dd.overall}/100</span>
                  </div>
                  <Progress value={s.dd.overall} tone={s.dd.overall >= 75 ? 'green' : s.dd.overall >= 55 ? 'gold' : 'orange'} />
                </Card>
              </div>
            ) : (
              <Card className="card-pad text-center text-slate-400">Due diligence not yet initiated for this company.</Card>
            )

          // matches
          return s.matchedInvestors.length ? (
            <div className="space-y-4">
              {s.matchedInvestors.map((m, i) => (
                <Card key={i} className="card-pad flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar initials={initials(m.investor)} tint="blue" />
                    <div>
                      {investorIdByName(m.investor) ? (
                        <button onClick={() => nav(`/investors/${investorIdByName(m.investor)}`)} className="font-medium text-slate-100 hover:text-gold-300">{m.investor}</button>
                      ) : (
                        <div className="font-medium text-slate-100">{m.investor}</div>
                      )}
                      <div className="text-xs text-slate-500">{m.industry} · {m.amount} · {m.risk} risk</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-xs text-slate-500">Match</div>
                      <div className={`text-lg font-bold ${m.score >= 85 ? 'text-brand-green' : 'text-gold-300'}`}>{m.score}%</div>
                    </div>
                    <button className="btn-gold btn-sm">Introduce</button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="card-pad text-center text-slate-400">No investor matches generated yet. Run the matching engine.</Card>
          )
        }}
      </Tabs>

      {form && (
        <Modal
          open={edit}
          onClose={() => setEdit(false)}
          title="Edit Seeker"
          subtitle={s.id}
          icon="Pencil"
          footer={
            <>
              <button className="btn-ghost btn-sm" onClick={() => setEdit(false)}>Cancel</button>
              <button className="btn-gold btn-sm" onClick={saveEdit}>Save Changes</button>
            </>
          }
        >
          <form onSubmit={saveEdit}>
            <FormGrid>
              <TextField label="Company Name" value={form.company} onChange={set('company')} full />
              <TextField label="CIN" value={form.cin} onChange={set('cin')} />
              <SelectField label="Industry" value={form.industry} onChange={set('industry')} options={industryOpts} />
              <TextField label="Location" value={form.location} onChange={set('location')} />
              <TextField label="Funding Required" value={form.required} onChange={set('required')} />
              <TextField label="Equity Offered" value={form.equity} onChange={set('equity')} />
              <TextField label="Expected ROI" value={form.roi} onChange={set('roi')} />
              <TextField label="Valuation" value={form.valuation} onChange={set('valuation')} />
              <SelectField label="Stage" value={form.stage} onChange={set('stage')} options={stageOpts} />
              <SelectField label="Status" value={form.status} onChange={set('status')} options={statusOpts} />
            </FormGrid>
          </form>
        </Modal>
      )}

      <ConfirmDialog
        open={confirm}
        onClose={() => setConfirm(false)}
        onConfirm={doDelete}
        title="Delete seeker?"
        message={`This will permanently remove ${s.company} (${s.id}). This cannot be undone.`}
        confirmLabel="Delete seeker"
      />
    </div>
  )
}
