import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader, Toolbar, Table, Badge, StatCard, FilterSelect } from '../../components/ui/Primitives'
import { Modal, FormGrid, TextField, SelectField, ConfirmDialog } from '../../components/ui/Modal'
import { RowActions } from '../../components/ui/RowActions'
import { BulkBar } from '../../components/ui/BulkBar'
import { downloadCsv } from '../../lib/exportCsv'
import { useData } from '../../context/DataContext'
import { useApp } from '../../context/AppContext'

const exportCols = [
  { key: 'id', label: 'ID' }, { key: 'company', label: 'Company' }, { key: 'cin', label: 'CIN' },
  { key: 'industry', label: 'Industry' }, { key: 'location', label: 'Location' }, { key: 'required', label: 'Funding Required' },
  { key: 'equity', label: 'Equity' }, { key: 'roi', label: 'ROI' }, { key: 'valuation', label: 'Valuation' },
  { key: 'stage', label: 'Stage' }, { key: 'status', label: 'Status' },
]

const columns = [
  { key: 'company', label: 'Company' },
  { key: 'industry', label: 'Industry' },
  { key: 'location', label: 'Location' },
  { key: 'required', label: 'Funding Req.', align: 'right' },
  { key: 'equity', label: 'Equity', align: 'right' },
  { key: 'roi', label: 'ROI', align: 'right' },
  { key: 'valuation', label: 'Valuation', align: 'right' },
  { key: 'stage', label: 'Stage' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: '', align: 'right' },
]

const industries = ['All', 'CleanTech', 'Manufacturing', 'Healthcare', 'Real Estate', 'Agriculture', 'Automotive']
const industryOpts = ['CleanTech', 'Manufacturing', 'Healthcare', 'Real Estate', 'Agriculture', 'Automotive', 'Technology']
const empty = { company: '', cin: '', industry: 'Technology', location: '', required: '', equity: '', roi: '', valuation: '', stage: 'Seed', status: 'Enquiry' }

export default function InvestmentSeekers() {
  const nav = useNavigate()
  const { seekers, addSeeker, updateSeeker, deleteSeeker, deleteSeekers } = useData()
  const { pushNotification } = useApp()
  const [q, setQ] = useState('')
  const [industry, setIndustry] = useState('All')
  const [modal, setModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(empty)
  const [toDelete, setToDelete] = useState(null)
  const [selected, setSelected] = useState(new Set())
  const [bulkConfirm, setBulkConfirm] = useState(false)
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }))

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase()
    return seekers.filter((s) => {
      const matchQ = !term || [s.company, s.id, s.cin, s.industry, s.location].some((v) => v.toLowerCase().includes(term))
      const matchInd = industry === 'All' || s.industry === industry
      return matchQ && matchInd
    })
  }, [seekers, q, industry])

  const openAdd = () => { setEditingId(null); setForm(empty); setModal(true) }
  const openEdit = (row) => {
    setEditingId(row.id)
    setForm({ company: row.company, cin: row.cin, industry: row.industry, location: row.location, required: row.required, equity: row.equity, roi: row.roi, valuation: row.valuation, stage: row.stage, status: row.status })
    setModal(true)
  }

  const submit = (e) => {
    e.preventDefault()
    if (!form.company.trim()) return
    if (editingId) {
      updateSeeker(editingId, form)
    } else {
      const item = addSeeker(form)
      pushNotification({ type: 'seeker', title: 'Seeker added', text: `${item.company} added (${item.id}).`, tone: 'purple', icon: 'Building', to: `/seekers/${item.id}` })
    }
    setModal(false)
    setForm(empty)
    setEditingId(null)
  }

  const confirmDelete = () => {
    const name = toDelete.company
    deleteSeeker(toDelete.id)
    setToDelete(null)
    pushNotification({ type: 'seeker', title: 'Seeker deleted', text: `${name} was removed.`, tone: 'red', icon: 'Building', to: '/seekers' })
  }

  const confirmBulkDelete = () => {
    const n = selected.size
    deleteSeekers([...selected])
    setSelected(new Set())
    setBulkConfirm(false)
    pushNotification({ type: 'seeker', title: 'Seekers deleted', text: `${n} seeker${n > 1 ? 's' : ''} removed.`, tone: 'red', icon: 'Building', to: '/seekers' })
  }
  const exportRows = (list, label) => {
    if (!list.length) return
    downloadCsv(`seekers-${label}-${list.length}.csv`, list, exportCols)
    pushNotification({ type: 'system', title: 'CSV exported', text: `Downloaded ${list.length} seeker record(s).`, tone: 'blue', icon: 'Download' })
  }
  const exportSelected = () => {
    exportRows(seekers.filter((s) => selected.has(s.id)), 'selected')
    setSelected(new Set())
  }

  return (
    <div>
      <PageHeader title="Investment Seeker Management" subtitle="Businesses looking for FDI — CIN, financials, pitch decks & valuation" icon="Building">
        <button className="btn-ghost btn-sm" onClick={() => pushNotification({ type: 'seeker', title: 'Template library', text: 'Opening the seeker onboarding template library.', tone: 'gold', icon: 'FileText' })}>Templates</button>
        <button className="btn-ghost btn-sm" onClick={() => pushNotification({ type: 'seeker', title: 'Import started', text: 'Bulk seeker import — upload a CSV to begin.', tone: 'blue', icon: 'Download' })}>Import</button>
        <button className="btn-gold btn-sm" onClick={openAdd}>+ Add Seeker</button>
      </PageHeader>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Seekers" value={seekers.length} delta={7.5} up icon="Building" tint="purple" hint="businesses" />
        <StatCard label="In Due Diligence" value={seekers.filter((s) => s.status === 'Due Diligence').length} delta={3.1} up icon="Search" tint="gold" hint="advanced" />
        <StatCard label="Proposals Sent" value={seekers.filter((s) => s.status === 'Proposal Sent').length} delta={2.0} up icon="Send" tint="teal" hint="active" />
        <StatCard label="New Enquiries" value={seekers.filter((s) => s.status === 'Enquiry').length} delta={1.2} up icon="Inbox" tint="orange" hint="to review" />
      </div>

      <Toolbar
        placeholder="Search seekers by company, CIN, industry…"
        query={q}
        onQuery={setQ}
        onExport={() => exportRows(rows, 'filtered')}
        filters={<FilterSelect value={industry} onChange={setIndustry} label="Industries" options={industries} />}
      />

      <div className="mb-3 text-xs text-slate-500">Showing {rows.length} of {seekers.length} seekers</div>

      <BulkBar
        count={selected.size}
        noun="seekers"
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
        onRowClick={(row) => nav(`/seekers/${row.id}`)}
        renderCell={(key, row) => {
          if (key === 'company')
            return (
              <div>
                <div className="font-medium text-slate-100">{row.company}</div>
                <div className="text-xs text-slate-500">CIN: {row.cin}</div>
              </div>
            )
          if (key === 'stage') return <Badge tone="slate">{row.stage}</Badge>
          if (key === 'status') return <Badge>{row.status}</Badge>
          if (['required', 'valuation'].includes(key)) return <span className="font-semibold text-white">{row[key]}</span>
          if (key === 'roi') return <span className="text-brand-green">{row.roi}</span>
          if (key === 'actions')
            return (
              <RowActions
                items={[
                  { label: 'View', icon: 'Eye', onClick: () => nav(`/seekers/${row.id}`) },
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
        title={editingId ? 'Edit Seeker' : 'Add Investment Seeker'}
        subtitle={editingId || 'Register a business seeking FDI'}
        icon={editingId ? 'Pencil' : 'Building'}
        footer={
          <>
            <button className="btn-ghost btn-sm" onClick={() => setModal(false)}>Cancel</button>
            <button className="btn-gold btn-sm" onClick={submit}>{editingId ? 'Save Changes' : 'Add Seeker'}</button>
          </>
        }
      >
        <form onSubmit={submit}>
          <FormGrid>
            <TextField label="Company Name" value={form.company} onChange={set('company')} placeholder="e.g. Solaris Energy Pvt Ltd" required full />
            <TextField label="CIN" value={form.cin} onChange={set('cin')} placeholder="e.g. U40108KA2020PTC…" />
            <SelectField label="Industry" value={form.industry} onChange={set('industry')} options={industryOpts} />
            <TextField label="Location" value={form.location} onChange={set('location')} placeholder="e.g. Bangalore" />
            <TextField label="Funding Required" value={form.required} onChange={set('required')} placeholder="e.g. ₹10 Cr" />
            <TextField label="Equity Offered" value={form.equity} onChange={set('equity')} placeholder="e.g. 18%" />
            <TextField label="Expected ROI" value={form.roi} onChange={set('roi')} placeholder="e.g. 22%" />
            <TextField label="Valuation" value={form.valuation} onChange={set('valuation')} placeholder="e.g. ₹55 Cr" />
            <SelectField label="Stage" value={form.stage} onChange={set('stage')} options={['Seed', 'Series A', 'Series B', 'Growth']} />
            <SelectField label="Status" value={form.status} onChange={set('status')} options={['Enquiry', 'In Discussion', 'Proposal Sent', 'Due Diligence']} />
          </FormGrid>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete seeker?"
        message={toDelete ? `Permanently remove ${toDelete.company} (${toDelete.id})? This cannot be undone.` : ''}
        confirmLabel="Delete seeker"
      />

      <ConfirmDialog
        open={bulkConfirm}
        onClose={() => setBulkConfirm(false)}
        onConfirm={confirmBulkDelete}
        title={`Delete ${selected.size} seekers?`}
        message={`This will permanently remove ${selected.size} selected seeker record(s). This cannot be undone.`}
        confirmLabel={`Delete ${selected.size} seekers`}
      />
    </div>
  )
}
