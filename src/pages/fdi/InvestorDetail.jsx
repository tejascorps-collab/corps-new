import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Card, CardHeader, Badge, StatCard, Avatar, initials, Tabs, Field, BackLink, Table, Icon,
} from '../../components/ui/Primitives'
import { Modal, FormGrid, TextField, SelectField, ConfirmDialog } from '../../components/ui/Modal'
import { useData } from '../../context/DataContext'
import { useApp } from '../../context/AppContext'
import { getInvestor, propertyIdByName, projectIdByName } from '../../data/mockData'

const kycTone = { Verified: 'green', Pending: 'orange', 'In Review': 'orange', Filed: 'green', Signed: 'green', 'Pending Signature': 'orange' }

export default function InvestorDetail() {
  const { id } = useParams()
  const nav = useNavigate()
  const { investors, updateInvestor, deleteInvestor } = useData() // subscribe so edits re-render
  void investors
  const { pushNotification } = useApp()
  const inv = getInvestor(id)
  const [edit, setEdit] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const [form, setForm] = useState(null)
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }))

  const doDelete = () => {
    const name = inv.name
    deleteInvestor(id)
    setConfirm(false)
    pushNotification({ type: 'investor', title: 'Investor deleted', text: `${name} was removed.`, tone: 'red', icon: 'UserPlus', to: '/investors' })
    nav('/investors')
  }

  const openEdit = () => {
    setForm({
      name: inv.name, country: inv.country, capacity: inv.capacity,
      industries: inv.industries.join(', '), rm: inv.rm, risk: inv.risk,
      kyc: inv.kyc, status: inv.status,
    })
    setEdit(true)
  }
  const saveEdit = (e) => {
    e.preventDefault()
    updateInvestor(id, {
      ...form,
      industries: form.industries.split(',').map((s) => s.trim()).filter(Boolean),
    })
    setEdit(false)
  }

  if (!inv)
    return (
      <div>
        <BackLink label="Back to Investors" onClick={() => nav('/investors')} />
        <Card className="card-pad text-center text-slate-400">Investor “{id}” not found.</Card>
      </div>
    )

  const tabs = [
    { key: 'overview', label: 'Overview', icon: 'User' },
    { key: 'history', label: 'Investment History', icon: 'History', count: inv.holdings.length },
    { key: 'documents', label: 'Documents', icon: 'FolderOpen', count: inv.documents.length },
    { key: 'kyc', label: 'KYC & Compliance', icon: 'ShieldCheck' },
    { key: 'notes', label: 'Notes', icon: 'StickyNote', count: inv.notes.length },
  ]

  return (
    <div>
      <BackLink label="Back to Investors" onClick={() => nav('/investors')} />

      {/* Header */}
      <Card className="card-pad mb-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <span className="grid h-16 w-16 place-items-center rounded-2xl bg-gold-gradient text-xl font-bold text-ink-950">
              {initials(inv.name)}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl font-bold text-white">{inv.name}</h1>
                <Badge>{inv.status}</Badge>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-slate-400">
                <span>{inv.id}</span>
                <span className="flex items-center gap-1"><Icon name="MapPin" size={13} /> {inv.country}</span>
                <span className="flex items-center gap-1"><Icon name="ShieldCheck" size={13} /> KYC {inv.kyc}</span>
                <span className="flex items-center gap-1"><Icon name="UserCog" size={13} /> RM: {inv.rm}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="btn-ghost btn-sm"><Icon name="Mail" size={14} /> Message</button>
            <button className="btn-ghost btn-sm" onClick={openEdit}><Icon name="Pencil" size={14} /> Edit</button>
            <button className="btn-ghost btn-sm text-brand-red hover:bg-brand-red/10" onClick={() => setConfirm(true)}><Icon name="Trash2" size={14} /> Delete</button>
            <button className="btn-gold btn-sm"><Icon name="Plus" size={14} /> New Investment</button>
          </div>
        </div>
      </Card>

      {/* KPIs */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Invested" value={inv.invested} delta={0} up icon="Wallet" tint="blue" hint="committed" />
        <StatCard label="Investment Capacity" value={inv.capacity} delta={0} up icon="Target" tint="gold" hint="declared" />
        <StatCard label="Current ROI" value={inv.roi} delta={2.1} up icon="Gauge" tint="green" />
        <StatCard label="Risk Profile" value={inv.risk} delta={0} up icon="Activity" tint="purple" hint={inv.period} />
      </div>

      <Tabs tabs={tabs}>
        {(active) => {
          if (active === 'overview')
            return (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                  <CardHeader title="Investor Profile" icon="User" />
                  <div className="card-pad grid grid-cols-1 gap-3 pt-3 sm:grid-cols-2">
                    <Field label="Country" value={inv.country} />
                    <Field label="Investment Capacity" value={inv.capacity} accent />
                    <Field label="Preferred Industries" value={inv.industries.join(', ')} />
                    <Field label="Preferred Period" value={inv.period} />
                    <Field label="Passport / ID" value={inv.passport} />
                    <Field label="Source of Funds" value={inv.sourceOfFunds} />
                    <Field label="Email" value={inv.email} />
                    <Field label="Phone" value={inv.phone} />
                    <Field label="Onboarded" value={inv.joined} />
                    <Field label="Risk Appetite" value={inv.risk} />
                  </div>
                </Card>
                <Card className="h-fit">
                  <CardHeader title="Relationship Manager" icon="UserCog" />
                  <div className="card-pad pt-3">
                    <div className="flex items-center gap-3">
                      <Avatar initials={initials(inv.rm)} tint="gold" />
                      <div>
                        <div className="font-medium text-slate-100">{inv.rm}</div>
                        <div className="text-xs text-slate-500">Investment Manager</div>
                      </div>
                    </div>
                    <button className="btn-ghost btn-sm mt-4 w-full">Contact RM</button>
                    <div className="mt-4 rounded-xl bg-white/[0.02] p-3 text-sm ring-1 ring-white/5">
                      <div className="text-xs text-slate-500">Portfolio Health</div>
                      <div className="mt-1 flex items-center gap-2">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                          <div className="h-full rounded-full bg-brand-green" style={{ width: '82%' }} />
                        </div>
                        <span className="text-sm font-semibold text-brand-green">Good</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )

          if (active === 'history')
            return (
              <Table
                columns={[
                  { key: 'asset', label: 'Asset' },
                  { key: 'type', label: 'Type' },
                  { key: 'invested', label: 'Invested', align: 'right' },
                  { key: 'ownership', label: 'Ownership', align: 'right' },
                  { key: 'roi', label: 'ROI', align: 'right' },
                  { key: 'date', label: 'Date' },
                ]}
                rows={inv.holdings}
                renderCell={(key, row) => {
                  if (key === 'asset') {
                    const to = row.type === 'Property'
                      ? (propertyIdByName(row.asset) && `/properties/${propertyIdByName(row.asset)}`)
                      : (projectIdByName(row.asset) && `/projects/${projectIdByName(row.asset)}`)
                    return to ? (
                      <button onClick={() => nav(to)} className="font-medium text-slate-100 hover:text-gold-300">{row.asset}</button>
                    ) : <span className="font-medium text-slate-100">{row.asset}</span>
                  }
                  if (key === 'type') return <Badge tone={row.type === 'Property' ? 'orange' : 'teal'}>{row.type}</Badge>
                  if (key === 'invested') return <span className="font-semibold text-white">{row.invested}</span>
                  if (key === 'roi') return <span className="text-brand-green">{row.roi}</span>
                  return row[key]
                }}
              />
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
                rows={inv.documents}
                renderCell={(key, row) => {
                  if (key === 'name')
                    return (
                      <span className="flex items-center gap-2.5 font-medium text-slate-100">
                        <Icon name="FileText" size={16} className="text-brand-blue" /> {row.name}
                      </span>
                    )
                  if (key === 'status') return <Badge tone={kycTone[row.status] || 'slate'}>{row.status}</Badge>
                  if (key === 'actions')
                    return <button className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white"><Icon name="Download" size={15} /></button>
                  return row[key]
                }}
              />
            )

          if (active === 'kyc')
            return (
              <Card>
                <CardHeader title="KYC & Compliance Checklist" icon="ShieldCheck" />
                <div className="card-pad space-y-2 pt-3">
                  {inv.kycChecklist.map((k) => (
                    <div key={k.item} className="flex items-center justify-between rounded-xl bg-white/[0.02] px-3 py-2.5 ring-1 ring-white/5">
                      <span className="flex items-center gap-2.5 text-sm text-slate-200">
                        <Icon name={k.status === 'Verified' ? 'CheckCircle2' : 'Clock'} size={16}
                          className={k.status === 'Verified' ? 'text-brand-green' : 'text-brand-orange'} />
                        {k.item}
                      </span>
                      <Badge tone={kycTone[k.status] || 'slate'}>{k.status}</Badge>
                    </div>
                  ))}
                </div>
              </Card>
            )

          // notes
          return (
            <Card>
              <CardHeader title="Relationship Notes" icon="StickyNote"
                action={<button className="btn-gold btn-sm">+ Add Note</button>} />
              <div className="card-pad space-y-3 pt-3">
                {inv.notes.map((n, i) => (
                  <div key={i} className="rounded-xl bg-white/[0.02] p-4 ring-1 ring-white/5">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm font-medium text-slate-200">
                        <Avatar initials={initials(n.by)} tint="gold" /> {n.by}
                      </span>
                      <span className="text-xs text-slate-500">{n.when}</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-400">{n.text}</p>
                  </div>
                ))}
              </div>
            </Card>
          )
        }}
      </Tabs>

      {form && (
        <Modal
          open={edit}
          onClose={() => setEdit(false)}
          title="Edit Investor"
          subtitle={inv.id}
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
              <TextField label="Name" value={form.name} onChange={set('name')} full />
              <TextField label="Country" value={form.country} onChange={set('country')} />
              <TextField label="Investment Capacity" value={form.capacity} onChange={set('capacity')} />
              <TextField label="Preferred Industries" value={form.industries} onChange={set('industries')} full />
              <TextField label="Relationship Manager" value={form.rm} onChange={set('rm')} />
              <SelectField label="Risk Profile" value={form.risk} onChange={set('risk')} options={['Conservative', 'Moderate', 'Aggressive']} />
              <SelectField label="KYC Status" value={form.kyc} onChange={set('kyc')} options={['Pending', 'In Review', 'Verified']} />
              <SelectField label="Status" value={form.status} onChange={set('status')} options={['Onboarding', 'Active']} />
            </FormGrid>
          </form>
        </Modal>
      )}

      <ConfirmDialog
        open={confirm}
        onClose={() => setConfirm(false)}
        onConfirm={doDelete}
        title="Delete investor?"
        message={`This will permanently remove ${inv.name} (${inv.id}) and their profile. This cannot be undone.`}
        confirmLabel="Delete investor"
      />
    </div>
  )
}
