import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader, Toolbar, Card, Badge, StatCard, Icon, Checkbox } from '../../components/ui/Primitives'
import { Modal, FormGrid, TextField, SelectField, ConfirmDialog } from '../../components/ui/Modal'
import { RowActions } from '../../components/ui/RowActions'
import { BulkBar } from '../../components/ui/BulkBar'
import { downloadCsv } from '../../lib/exportCsv'
import { useData } from '../../context/DataContext'
import { useApp } from '../../context/AppContext'

const exportCols = [
  { key: 'id', label: 'ID' }, { key: 'name', label: 'Name' }, { key: 'category', label: 'Category' },
  { key: 'location', label: 'Location' }, { key: 'purchase', label: 'Purchase' }, { key: 'current', label: 'Current Value' },
  { key: 'expected', label: 'Expected Sale' }, { key: 'rental', label: 'Rental' }, { key: 'roi', label: 'ROI' },
  { key: 'legal', label: 'Legal' }, { key: 'status', label: 'Status' },
]

const cats = ['All', 'Residential', 'Commercial', 'Industrial', 'Agricultural', 'Villas', 'Hospitality']
const catOpts = ['Commercial', 'Residential', 'Industrial', 'Agricultural', 'Villas', 'Hospitality', 'Land']
const statusOpts = ['Acquired', 'In Progress', 'Rented', 'Under Renovation', 'For Sale', 'Held']
const empty = { name: '', category: 'Commercial', location: '', purchase: '', current: '', expected: '', rental: '', roi: '', legal: 'Under Review', status: 'Acquired' }

export default function Properties() {
  const { properties, addProperty, updateProperty, deleteProperty, deleteProperties } = useData()
  const { pushNotification } = useApp()
  const [cat, setCat] = useState('All')
  const [q, setQ] = useState('')
  const [modal, setModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(empty)
  const [toDelete, setToDelete] = useState(null)
  const [selected, setSelected] = useState(new Set())
  const [bulkConfirm, setBulkConfirm] = useState(false)
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }))
  const nav = useNavigate()

  const list = useMemo(() => {
    const term = q.trim().toLowerCase()
    return properties.filter((p) => {
      const matchCat = cat === 'All' || p.category === cat
      const matchQ = !term || [p.name, p.id, p.location, p.category, p.status].some((v) => v.toLowerCase().includes(term))
      return matchCat && matchQ
    })
  }, [properties, cat, q])

  const openAdd = () => { setEditingId(null); setForm(empty); setModal(true) }
  const openEdit = (p) => {
    setEditingId(p.id)
    setForm({ name: p.name, category: p.category, location: p.location, purchase: p.purchase, current: p.current, expected: p.expected, rental: p.rental, roi: p.roi, legal: p.legal, status: p.status })
    setModal(true)
  }

  const submit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    if (editingId) {
      updateProperty(editingId, form)
    } else {
      const item = addProperty(form)
      pushNotification({ type: 'property', title: 'Property added', text: `${item.name} added (${item.id}).`, tone: 'gold', icon: 'Building2', to: `/properties/${item.id}` })
    }
    setModal(false)
    setForm(empty)
    setEditingId(null)
  }

  const confirmDelete = () => {
    const name = toDelete.name
    deleteProperty(toDelete.id)
    setToDelete(null)
    pushNotification({ type: 'property', title: 'Property deleted', text: `${name} was removed.`, tone: 'red', icon: 'Building2', to: '/properties' })
  }
  const exportRows = (rows, label) => {
    if (!rows.length) return
    downloadCsv(`properties-${label}-${rows.length}.csv`, rows, exportCols)
    pushNotification({ type: 'system', title: 'CSV exported', text: `Downloaded ${rows.length} property record(s).`, tone: 'blue', icon: 'Download' })
  }

  // selection (over the currently-filtered list)
  const ids = list.map((p) => p.id)
  const allSelected = list.length > 0 && ids.every((id) => selected.has(id))
  const someSelected = ids.some((id) => selected.has(id))
  const toggle = (id) => { const s = new Set(selected); s.has(id) ? s.delete(id) : s.add(id); setSelected(s) }
  const toggleAll = () => {
    const s = new Set(selected)
    if (allSelected) ids.forEach((id) => s.delete(id))
    else ids.forEach((id) => s.add(id))
    setSelected(s)
  }
  const confirmBulkDelete = () => {
    const n = selected.size
    deleteProperties([...selected])
    setSelected(new Set())
    setBulkConfirm(false)
    pushNotification({ type: 'property', title: 'Properties deleted', text: `${n} propert${n > 1 ? 'ies' : 'y'} removed.`, tone: 'red', icon: 'Building2', to: '/properties' })
  }
  const exportSelected = () => {
    exportRows(properties.filter((p) => selected.has(p.id)), 'selected')
    setSelected(new Set())
  }

  return (
    <div>
      <PageHeader title="Property Database" subtitle="Residential, commercial, industrial, agricultural & international assets" icon="Building2">
        <button className="btn-ghost btn-sm" onClick={() => pushNotification({ type: 'property', title: 'Map view', text: 'Map view is coming soon.', tone: 'blue', icon: 'MapPin' })}>Map View</button>
        <button className="btn-gold btn-sm" onClick={openAdd}>+ Add Property</button>
      </PageHeader>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Properties Under Mgmt." value={properties.length} delta={11.2} up icon="Building2" tint="orange" />
        <StatCard label="Portfolio Value" value="₹402 Cr" delta={13.5} up icon="TrendingUp" tint="gold" />
        <StatCard label="Monthly Rental" value="₹1.60 Cr" delta={4.0} up icon="Wallet" tint="green" />
        <StatCard label="Avg. Property ROI" value="17.4%" delta={2.1} up icon="Gauge" tint="teal" />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {cats.map((c) => (
          <button key={c} onClick={() => setCat(c)}
            className={`chip ring-1 ${cat === c ? 'bg-gold-400/15 text-gold-200 ring-gold-400/30' : 'bg-white/5 text-slate-400 ring-white/10 hover:text-white'}`}>
            {c}
          </button>
        ))}
      </div>

      <Toolbar placeholder="Search by property ID, name, location…" query={q} onQuery={setQ} onExport={() => exportRows(list, 'filtered')} />

      <BulkBar
        count={selected.size}
        noun="properties"
        onClear={() => setSelected(new Set())}
        onDelete={() => setBulkConfirm(true)}
        onExport={exportSelected}
      />

      {list.length === 0 ? (
        <Card className="card-pad text-center text-slate-500">No properties match your search.</Card>
      ) : (
      <>
      <label className="mb-3 inline-flex cursor-pointer items-center gap-2 text-xs text-slate-400">
        <Checkbox checked={allSelected} indeterminate={someSelected} onChange={toggleAll} />
        Select all ({list.length})
      </label>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {list.map((p) => {
          const isSel = selected.has(p.id)
          return (
          <Card key={p.id} onClick={() => nav(`/properties/${p.id}`)} className={`cursor-pointer overflow-hidden transition hover:ring-1 hover:ring-gold-400/30 ${isSel ? 'ring-1 ring-gold-400/50' : ''}`}>
            <div className="relative h-40 bg-gradient-to-br from-ink-700 to-ink-850">
              <div className="absolute inset-0 flex items-center justify-center text-slate-600">
                <Icon name="Building2" size={40} />
              </div>
              <div className="absolute left-3 top-3 flex items-center gap-2">
                <span onClick={(e) => e.stopPropagation()} className="grid place-items-center rounded-md bg-ink-900/70 p-1 ring-1 ring-white/10">
                  <Checkbox checked={isSel} onChange={() => toggle(p.id)} />
                </span>
                <Badge tone="slate">{p.category}</Badge>
              </div>
              <div className="absolute right-3 top-3"><Badge>{p.status}</Badge></div>
            </div>
            <div className="card-pad">
              <div className="flex items-center justify-between">
                <h3 className="text-[15px] font-semibold text-slate-100">{p.name}</h3>
                <RowActions
                  items={[
                    { label: 'View', icon: 'Eye', onClick: () => nav(`/properties/${p.id}`) },
                    { label: 'Edit', icon: 'Pencil', onClick: () => openEdit(p) },
                    { label: 'Delete', icon: 'Trash2', danger: true, onClick: () => setToDelete(p) },
                  ]}
                />
              </div>
              <div className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                <Icon name="MapPin" size={12} /> {p.location} · {p.id}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Info label="Purchase" value={p.purchase} />
                <Info label="Current Value" value={p.current} accent />
                <Info label="Expected Sale" value={p.expected} />
                <Info label="Rental" value={p.rental} />
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                <span className="text-sm">
                  <span className="text-slate-500">ROI </span>
                  <span className="font-semibold text-brand-green">{p.roi}</span>
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <Icon name="Scale" size={13} /> {p.legal}
                </span>
              </div>
            </div>
          </Card>
          )
        })}
      </div>
      </>
      )}

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title={editingId ? 'Edit Property' : 'Add Property'}
        subtitle={editingId || 'Register a new property asset'}
        icon={editingId ? 'Pencil' : 'Building2'}
        footer={
          <>
            <button className="btn-ghost btn-sm" onClick={() => setModal(false)}>Cancel</button>
            <button className="btn-gold btn-sm" onClick={submit}>{editingId ? 'Save Changes' : 'Add Property'}</button>
          </>
        }
      >
        <form onSubmit={submit}>
          <FormGrid>
            <TextField label="Property Name" value={form.name} onChange={set('name')} placeholder="e.g. Skyline Business Park" required full />
            <SelectField label="Category" value={form.category} onChange={set('category')} options={catOpts} />
            <TextField label="Location" value={form.location} onChange={set('location')} placeholder="e.g. Mumbai, India" />
            <TextField label="Purchase Price" value={form.purchase} onChange={set('purchase')} placeholder="e.g. ₹40 Cr" />
            <TextField label="Current Value" value={form.current} onChange={set('current')} placeholder="e.g. ₹46 Cr" />
            <TextField label="Expected Sale" value={form.expected} onChange={set('expected')} placeholder="e.g. ₹55 Cr" />
            <TextField label="Rental Income" value={form.rental} onChange={set('rental')} placeholder="e.g. ₹0.30 Cr/mo" />
            <TextField label="ROI" value={form.roi} onChange={set('roi')} placeholder="e.g. 17%" />
            <SelectField label="Legal Status" value={form.legal} onChange={set('legal')} options={['Clear', 'Under Review']} />
            <SelectField label="Status" value={form.status} onChange={set('status')} options={statusOpts} />
          </FormGrid>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete property?"
        message={toDelete ? `Permanently remove ${toDelete.name} (${toDelete.id})? This cannot be undone.` : ''}
        confirmLabel="Delete property"
      />

      <ConfirmDialog
        open={bulkConfirm}
        onClose={() => setBulkConfirm(false)}
        onConfirm={confirmBulkDelete}
        title={`Delete ${selected.size} properties?`}
        message={`This will permanently remove ${selected.size} selected property record(s). This cannot be undone.`}
        confirmLabel={`Delete ${selected.size} properties`}
      />
    </div>
  )
}

function Info({ label, value, accent }) {
  return (
    <div>
      <div className="text-xs text-slate-500">{label}</div>
      <div className={`text-sm font-semibold ${accent ? 'text-gold-300' : 'text-slate-100'}`}>{value}</div>
    </div>
  )
}
