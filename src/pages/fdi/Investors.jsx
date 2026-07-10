import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader, Toolbar, Table, Badge, StatCard, Avatar, initials, FilterSelect } from '../../components/ui/Primitives'
import { Modal, FormGrid, TextField, SelectField, ConfirmDialog } from '../../components/ui/Modal'
import { RowActions } from '../../components/ui/RowActions'
import { BulkBar } from '../../components/ui/BulkBar'
import { downloadCsv } from '../../lib/exportCsv'
import { useData } from '../../context/DataContext'
import { useApp } from '../../context/AppContext'

const exportCols = [
  { key: 'id', label: 'ID' }, { key: 'name', label: 'Name' }, { key: 'country', label: 'Country' },
  { key: 'capacity', label: 'Capacity' }, { key: 'industries', label: 'Industries' }, { key: 'kyc', label: 'KYC' },
  { key: 'invested', label: 'Invested' }, { key: 'roi', label: 'ROI' }, { key: 'rm', label: 'Relationship Manager' },
  { key: 'risk', label: 'Risk' }, { key: 'status', label: 'Status' },
]

const columns = [
  { key: 'name', label: 'Investor' },
  { key: 'country', label: 'Country' },
  { key: 'capacity', label: 'Capacity' },
  { key: 'industries', label: 'Preferred Industries' },
  { key: 'kyc', label: 'KYC' },
  { key: 'invested', label: 'Invested', align: 'right' },
  { key: 'roi', label: 'ROI', align: 'right' },
  { key: 'rm', label: 'Relationship Mgr' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: '', align: 'right' },
]

const empty = { name: '', country: 'India', capacity: '', industries: '', rm: 'Priya Nair', risk: 'Moderate', kyc: 'Pending', status: 'Onboarding' }

export default function Investors() {
  const nav = useNavigate()
  const { investors, addInvestor, updateInvestor, deleteInvestor, deleteInvestors } = useData()
  const { pushNotification } = useApp()
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('All')
  const [kyc, setKyc] = useState('All')
  const [modal, setModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(empty)
  const [toDelete, setToDelete] = useState(null)
  const [selected, setSelected] = useState(new Set())
  const [bulkConfirm, setBulkConfirm] = useState(false)
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }))

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase()
    return investors.filter((i) => {
      const matchQ =
        !term ||
        [i.name, i.id, i.country, i.rm, ...i.industries].some((v) => v.toLowerCase().includes(term))
      const matchStatus = status === 'All' || i.status === status
      const matchKyc = kyc === 'All' || i.kyc === kyc
      return matchQ && matchStatus && matchKyc
    })
  }, [investors, q, status, kyc])

  const openAdd = () => { setEditingId(null); setForm(empty); setModal(true) }
  const openEdit = (row) => {
    setEditingId(row.id)
    setForm({ name: row.name, country: row.country, capacity: row.capacity, industries: row.industries.join(', '), rm: row.rm, risk: row.risk, kyc: row.kyc, status: row.status })
    setModal(true)
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    try {
      if (editingId) {
        await updateInvestor(editingId, { ...form, industries: form.industries.split(',').map((s) => s.trim()).filter(Boolean) })
      } else {
        const item = await addInvestor(form)
        pushNotification({ type: 'investor', title: 'Investor registered', text: `${item.name} added (${item.id}).`, tone: 'green', icon: 'UserPlus', to: `/investors/${item.id}` })
      }
      setModal(false)
      setForm(empty)
      setEditingId(null)
    } catch {
      pushNotification({ type: 'investor', title: 'Save failed', text: 'Could not save investor. Please try again.', tone: 'red', icon: 'AlertTriangle' })
    }
  }

  const confirmDelete = () => {
    const name = toDelete.name
    deleteInvestor(toDelete.id)
    setToDelete(null)
    pushNotification({ type: 'investor', title: 'Investor deleted', text: `${name} was removed.`, tone: 'red', icon: 'UserPlus', to: '/investors' })
  }

  const confirmBulkDelete = () => {
    const n = selected.size
    deleteInvestors([...selected])
    setSelected(new Set())
    setBulkConfirm(false)
    pushNotification({ type: 'investor', title: 'Investors deleted', text: `${n} investor${n > 1 ? 's' : ''} removed.`, tone: 'red', icon: 'UserPlus', to: '/investors' })
  }
  const exportRows = (list, label) => {
    if (!list.length) return
    downloadCsv(`investors-${label}-${list.length}.csv`, list, exportCols)
    pushNotification({ type: 'system', title: 'CSV exported', text: `Downloaded ${list.length} investor record(s).`, tone: 'blue', icon: 'Download' })
  }
  const exportSelected = () => {
    exportRows(investors.filter((i) => selected.has(i.id)), 'selected')
    setSelected(new Set())
  }

  return (
    <div>
      <PageHeader title="Investor Management" subtitle="Registration, profiles, KYC, capacity & assigned relationship managers" icon="Users">
        <button className="btn-ghost btn-sm" onClick={() => pushNotification({ type: 'investor', title: 'Import started', text: 'Bulk investor import — upload a CSV to begin.', tone: 'blue', icon: 'Download' })}>Import</button>
        <button className="btn-ghost btn-sm" onClick={() => pushNotification({ type: 'investor', title: 'Template library', text: 'Opening investor onboarding & KYC templates.', tone: 'gold', icon: 'FileText' })}>Templates</button>
        <button className="btn-gold btn-sm" onClick={openAdd}>+ Register Investor</button>
      </PageHeader>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Investors" value={investors.length} delta={12.7} up icon="Users" tint="blue" hint="in system" />
        <StatCard label="KYC Verified" value={investors.filter((i) => i.kyc === 'Verified').length} delta={6.2} up icon="ShieldCheck" tint="green" hint="verified" />
        <StatCard label="Active" value={investors.filter((i) => i.status === 'Active').length} delta={9.1} up icon="Wallet" tint="gold" hint="investing" />
        <StatCard label="Onboarding" value={investors.filter((i) => i.status === 'Onboarding').length} delta={4.4} up icon="UserPlus" tint="purple" hint="in pipeline" />
      </div>

      <Toolbar
        placeholder="Search investors by name, country, RM…"
        query={q}
        onQuery={setQ}
        onExport={() => exportRows(rows, 'filtered')}
        filters={
          <>
            <FilterSelect value={status} onChange={setStatus} label="Status" options={['All', 'Active', 'Onboarding']} />
            <FilterSelect value={kyc} onChange={setKyc} label="KYC" options={['All', 'Verified', 'Pending', 'In Review']} />
          </>
        }
      />

      <div className="mb-3 text-xs text-slate-500">Showing {rows.length} of {investors.length} investors</div>

      <BulkBar
        count={selected.size}
        noun="investors"
        onClear={() => setSelected(new Set())}
        onDelete={() => setBulkConfirm(true)}
        onExport={exportSelected}
      />

      <Table
        columns={columns}
        rows={rows}
        selectable
        selected={selected}
        onSelectedChange={setSelected}
        onRowClick={(row) => nav(`/investors/${row.id}`)}
        renderCell={(key, row) => {
          if (key === 'name')
            return (
              <div className="flex items-center gap-3">
                <Avatar initials={initials(row.name)} tint="blue" />
                <div>
                  <div className="font-medium text-slate-100">{row.name}</div>
                  <div className="text-xs text-slate-500">{row.id}</div>
                </div>
              </div>
            )
          if (key === 'industries')
            return (
              <div className="flex flex-wrap gap-1">
                {row.industries.map((t) => (
                  <span key={t} className="chip bg-white/5 text-slate-300">{t}</span>
                ))}
              </div>
            )
          if (key === 'kyc') return <Badge>{row.kyc}</Badge>
          if (key === 'status') return <Badge>{row.status}</Badge>
          if (key === 'invested') return <span className="font-semibold text-white">{row.invested}</span>
          if (key === 'roi') return <span className="text-brand-green">{row.roi}</span>
          if (key === 'actions')
            return (
              <RowActions
                items={[
                  { label: 'View', icon: 'Eye', onClick: () => nav(`/investors/${row.id}`) },
                  { label: 'Edit', icon: 'Pencil', onClick: () => openEdit(row) },
                  { label: 'Delete', icon: 'Trash2', danger: true, onClick: () => setToDelete(row) },
                ]}
              />
            )
          return row[key]
        }}
      />

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title={editingId ? 'Edit Investor' : 'Register Investor'}
        subtitle={editingId || 'Create a new investor profile'}
        icon={editingId ? 'Pencil' : 'UserPlus'}
        footer={
          <>
            <button className="btn-ghost btn-sm" onClick={() => setModal(false)}>Cancel</button>
            <button className="btn-gold btn-sm" onClick={submit}>{editingId ? 'Save Changes' : 'Register Investor'}</button>
          </>
        }
      >
        <form onSubmit={submit}>
          <FormGrid>
            <TextField label="Full / Entity Name" value={form.name} onChange={set('name')} placeholder="e.g. Horizon Capital LLC" required full />
            <TextField label="Country" value={form.country} onChange={set('country')} placeholder="e.g. UAE" />
            <TextField label="Investment Capacity" value={form.capacity} onChange={set('capacity')} placeholder="e.g. ₹25 Cr" />
            <TextField label="Preferred Industries" value={form.industries} onChange={set('industries')} placeholder="Comma separated" full />
            <SelectField label="Risk Profile" value={form.risk} onChange={set('risk')} options={['Conservative', 'Moderate', 'Aggressive']} />
            <TextField label="Relationship Manager" value={form.rm} onChange={set('rm')} placeholder="e.g. Priya Nair" />
            <SelectField label="KYC Status" value={form.kyc} onChange={set('kyc')} options={['Pending', 'In Review', 'Verified']} />
            <SelectField label="Status" value={form.status} onChange={set('status')} options={['Onboarding', 'Active']} />
          </FormGrid>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete investor?"
        message={toDelete ? `Permanently remove ${toDelete.name} (${toDelete.id})? This cannot be undone.` : ''}
        confirmLabel="Delete investor"
      />

      <ConfirmDialog
        open={bulkConfirm}
        onClose={() => setBulkConfirm(false)}
        onConfirm={confirmBulkDelete}
        title={`Delete ${selected.size} investors?`}
        message={`This will permanently remove ${selected.size} selected investor record(s). This cannot be undone.`}
        confirmLabel={`Delete ${selected.size} investors`}
      />
    </div>
  )
}
