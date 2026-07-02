import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Card, CardHeader, Badge, StatCard, Tabs, Field, BackLink, Table, Avatar, initials, Icon,
} from '../../components/ui/Primitives'
import { Modal, FormGrid, TextField, SelectField, ConfirmDialog } from '../../components/ui/Modal'
import { useData } from '../../context/DataContext'
import { useApp } from '../../context/AppContext'
import { getProperty, investorIdByName } from '../../data/mockData'

const docTone = { Verified: 'green', Pending: 'orange' }
const catOpts = ['Commercial', 'Residential', 'Industrial', 'Agricultural', 'Villas', 'Hospitality', 'Land']
const statusOpts = ['Acquired', 'In Progress', 'Rented', 'Under Renovation', 'For Sale', 'Held']

export default function PropertyDetail() {
  const { id } = useParams()
  const nav = useNavigate()
  const { properties, updateProperty, deleteProperty } = useData()
  void properties
  const { pushNotification } = useApp()
  const p = getProperty(id)
  const [edit, setEdit] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const [form, setForm] = useState(null)
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }))

  const openEdit = () => {
    setForm({
      name: p.name, category: p.category, location: p.location, purchase: p.purchase,
      current: p.current, expected: p.expected, rental: p.rental, roi: p.roi, legal: p.legal, status: p.status,
    })
    setEdit(true)
  }
  const saveEdit = (e) => { e.preventDefault(); updateProperty(id, form); setEdit(false) }
  const doDelete = () => {
    const name = p.name
    deleteProperty(id)
    setConfirm(false)
    pushNotification({ type: 'property', title: 'Property deleted', text: `${name} was removed.`, tone: 'red', icon: 'Building2', to: '/properties' })
    nav('/properties')
  }

  if (!p)
    return (
      <div>
        <BackLink label="Back to Properties" onClick={() => nav('/properties')} />
        <Card className="card-pad text-center text-slate-400">Property “{id}” not found.</Card>
      </div>
    )

  const tabs = [
    { key: 'overview', label: 'Overview', icon: 'Building2' },
    { key: 'financials', label: 'Financials', icon: 'LineChart' },
    { key: 'pool', label: 'Investor Pool', icon: 'Layers', count: p.pool.length },
    { key: 'documents', label: 'Documents', icon: 'FolderOpen', count: p.documents.length },
    { key: 'timeline', label: 'Timeline', icon: 'GitCommitVertical' },
  ]

  return (
    <div>
      <BackLink label="Back to Properties" onClick={() => nav('/properties')} />

      {/* Hero */}
      <Card className="mb-6 overflow-hidden">
        <div className="relative h-48 bg-gradient-to-br from-ink-700 to-ink-850">
          <div className="absolute inset-0 flex items-center justify-center text-slate-600"><Icon name="Building2" size={56} /></div>
          <div className="absolute left-4 top-4 flex gap-2"><Badge tone="slate">{p.category}</Badge><Badge>{p.status}</Badge></div>
        </div>
        <div className="card-pad flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-white">{p.name}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-slate-400">
              <span>{p.id}</span>
              <span className="flex items-center gap-1"><Icon name="MapPin" size={13} /> {p.location}</span>
              <span className="flex items-center gap-1"><Icon name="Scale" size={13} /> Legal: {p.legal}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="btn-ghost btn-sm" onClick={openEdit}><Icon name="Pencil" size={14} /> Edit</button>
            <button className="btn-ghost btn-sm text-brand-red hover:bg-brand-red/10" onClick={() => setConfirm(true)}><Icon name="Trash2" size={14} /> Delete</button>
            <button className="btn-gold btn-sm"><Icon name="TrendingUp" size={14} /> List for Sale</button>
          </div>
        </div>
      </Card>

      {/* KPIs */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Purchase Price" value={p.purchase} delta={0} up icon="ShoppingCart" tint="blue" hint="acquisition" />
        <StatCard label="Current Value" value={p.current} delta={12.0} up icon="TrendingUp" tint="gold" />
        <StatCard label="Expected Sale" value={p.expected} delta={0} up icon="Target" tint="teal" hint="projected" />
        <StatCard label="ROI" value={p.roi} delta={2.4} up icon="Gauge" tint="green" />
      </div>

      <Tabs tabs={tabs}>
        {(active) => {
          if (active === 'overview')
            return (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                  <CardHeader title="Property Details" icon="Info" />
                  <div className="card-pad grid grid-cols-1 gap-3 pt-3 sm:grid-cols-2">
                    <Field label="Property ID" value={p.id} />
                    <Field label="Category" value={p.category} />
                    <Field label="Location" value={p.location} />
                    <Field label="Legal Status" value={p.legal} />
                    <Field label="Rental Income" value={p.rental} />
                    <Field label="Current Value" value={p.current} accent />
                    <Field label="GPS Coordinates" value="17.4126° N, 78.4071° E" />
                    <Field label="Status" value={p.status} />
                  </div>
                </Card>
                <Card className="h-fit">
                  <CardHeader title="Media" icon="Images" />
                  <div className="card-pad grid grid-cols-2 gap-2 pt-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="flex aspect-video items-center justify-center rounded-lg bg-gradient-to-br from-ink-700 to-ink-850 text-slate-600 ring-1 ring-white/5">
                        <Icon name={i === 3 ? 'Video' : 'Image'} size={20} />
                      </div>
                    ))}
                  </div>
                  <div className="px-5 pb-5"><button className="btn-ghost btn-sm w-full"><Icon name="Upload" size={14} /> Upload Media</button></div>
                </Card>
              </div>
            )

          if (active === 'financials') {
            const expenses = [
              ['Stamp Duty', '₹3.20 Cr'], ['Registration', '₹0.85 Cr'], ['Brokerage', '₹1.10 Cr'],
              ['Legal Cost', '₹0.65 Cr'], ['Renovation', '₹2.40 Cr'],
            ]
            return (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader title="Valuation" icon="LineChart" />
                  <div className="card-pad grid grid-cols-2 gap-3 pt-3">
                    <Field label="Purchase Price" value={p.purchase} />
                    <Field label="Current Value" value={p.current} accent />
                    <Field label="Expected Selling Price" value={p.expected} />
                    <Field label="Monthly Rental" value={p.rental} />
                    <Field label="Gross ROI" value={p.roi} />
                    <Field label="Holding Period" value="1.4 years" />
                  </div>
                </Card>
                <Card>
                  <CardHeader title="Expense Breakdown" icon="Receipt" />
                  <div className="card-pad space-y-2 pt-3">
                    {expenses.map(([h, a]) => (
                      <div key={h} className="flex items-center justify-between rounded-xl bg-white/[0.02] px-3 py-2.5 ring-1 ring-white/5">
                        <span className="text-sm text-slate-300">{h}</span>
                        <span className="font-semibold text-white">{a}</span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between border-t border-white/10 px-3 pt-3">
                      <span className="text-sm font-semibold text-slate-300">Total Expenses</span>
                      <span className="font-display text-lg font-bold text-gold-300">₹8.20 Cr</span>
                    </div>
                  </div>
                </Card>
              </div>
            )
          }

          if (active === 'pool')
            return p.pool.length ? (
              <Table
                columns={[
                  { key: 'investor', label: 'Investor' },
                  { key: 'amount', label: 'Investment', align: 'right' },
                  { key: 'units', label: 'Units', align: 'right' },
                  { key: 'ownership', label: 'Ownership', align: 'right' },
                  { key: 'roi', label: 'ROI', align: 'right' },
                  { key: 'date', label: 'Invested On' },
                ]}
                rows={p.pool}
                renderCell={(key, row) => {
                  if (key === 'investor') {
                    const iid = investorIdByName(row.investor)
                    return (
                      <span className="flex items-center gap-3">
                        <Avatar initials={initials(row.investor)} tint="blue" />
                        {iid ? (
                          <button onClick={() => nav(`/investors/${iid}`)} className="font-medium text-slate-100 hover:text-gold-300">{row.investor}</button>
                        ) : <span className="font-medium text-slate-100">{row.investor}</span>}
                      </span>
                    )
                  }
                  if (key === 'amount') return <span className="font-semibold text-white">{row.amount}</span>
                  if (key === 'ownership') return <Badge tone="purple">{row.ownership}</Badge>
                  if (key === 'roi') return <span className="text-brand-green">{row.roi}</span>
                  return row[key]
                }}
              />
            ) : (
              <Card className="card-pad text-center text-slate-400">No pooled investors recorded for this property yet.</Card>
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
                    return <span className="flex items-center gap-2.5 font-medium text-slate-100"><Icon name="FileText" size={16} className="text-brand-blue" /> {row.name}</span>
                  if (key === 'status') return <Badge tone={docTone[row.status] || 'slate'}>{row.status}</Badge>
                  if (key === 'actions')
                    return <button className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white"><Icon name="Download" size={15} /></button>
                  return row[key]
                }}
              />
            )

          // timeline
          return (
            <Card>
              <CardHeader title="Acquisition Workflow" icon="GitCommitVertical" />
              <div className="card-pad pt-4">
                <div className="relative space-y-5 pl-6">
                  <div className="absolute left-[9px] top-1 h-[calc(100%-1rem)] w-px bg-white/10" />
                  {p.workflow.map((w, i) => (
                    <div key={i} className="relative">
                      <span className={`absolute -left-6 top-0.5 grid h-5 w-5 place-items-center rounded-full ring-2 ${
                        w.done ? 'bg-brand-green/20 text-brand-green ring-brand-green/40' : 'bg-ink-800 text-slate-500 ring-white/10'}`}>
                        {w.done ? <Icon name="Check" size={12} /> : <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />}
                      </span>
                      <div className={`text-sm font-medium ${w.done ? 'text-slate-100' : 'text-slate-400'}`}>{w.step}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )
        }}
      </Tabs>

      {form && (
        <Modal
          open={edit}
          onClose={() => setEdit(false)}
          title="Edit Property"
          subtitle={p.id}
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
              <TextField label="Property Name" value={form.name} onChange={set('name')} full />
              <SelectField label="Category" value={form.category} onChange={set('category')} options={catOpts} />
              <TextField label="Location" value={form.location} onChange={set('location')} />
              <TextField label="Purchase Price" value={form.purchase} onChange={set('purchase')} />
              <TextField label="Current Value" value={form.current} onChange={set('current')} />
              <TextField label="Expected Sale" value={form.expected} onChange={set('expected')} />
              <TextField label="Rental Income" value={form.rental} onChange={set('rental')} />
              <TextField label="ROI" value={form.roi} onChange={set('roi')} />
              <SelectField label="Legal Status" value={form.legal} onChange={set('legal')} options={['Clear', 'Under Review']} />
              <SelectField label="Status" value={form.status} onChange={set('status')} options={statusOpts} />
            </FormGrid>
          </form>
        </Modal>
      )}

      <ConfirmDialog
        open={confirm}
        onClose={() => setConfirm(false)}
        onConfirm={doDelete}
        title="Delete property?"
        message={`This will permanently remove ${p.name} (${p.id}). This cannot be undone.`}
        confirmLabel="Delete property"
      />
    </div>
  )
}
