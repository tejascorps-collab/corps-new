import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader, Toolbar, Table, Badge, StatCard, Avatar, initials } from '../../components/ui/Primitives'
import { Modal, FormGrid, TextField } from '../../components/ui/Modal'
import { useApp } from '../../context/AppContext'
import { downloadCsv } from '../../lib/exportCsv'
import { investorPool, investorIdByName, propertyIdByName } from '../../data/mockData'

const columns = [
  { key: 'investor', label: 'Investor' },
  { key: 'property', label: 'Property' },
  { key: 'amount', label: 'Investment', align: 'right' },
  { key: 'units', label: 'Units', align: 'right' },
  { key: 'ownership', label: 'Ownership', align: 'right' },
  { key: 'roi', label: 'ROI', align: 'right' },
  { key: 'date', label: 'Invested On' },
  { key: 'exit', label: 'Exit' },
]

export default function InvestorPool() {
  const nav = useNavigate()
  const { pushNotification } = useApp()
  const [q, setQ] = useState('')
  const [pool, setPool] = useState(investorPool)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ investor: '', property: '', amount: '', share: '' })
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }))
  const rows = useMemo(() => {
    const term = q.trim().toLowerCase()
    return pool.filter((r) => !term || [r.investor, r.property].some((v) => v.toLowerCase().includes(term)))
  }, [q, pool])

  const submit = (e) => {
    e?.preventDefault?.()
    if (!form.investor.trim() || !form.property.trim()) return
    const ownership = form.share.trim() ? `${form.share.trim().replace(/%$/, '')}%` : '—'
    setPool((p) => [
      {
        investor: form.investor.trim(),
        property: form.property.trim(),
        amount: form.amount.trim() || '₹0 Cr',
        units: '—',
        ownership,
        roi: '—',
        date: new Date().toISOString().slice(0, 10),
        exit: '—',
      },
      ...p,
    ])
    setOpen(false)
    setForm({ investor: '', property: '', amount: '', share: '' })
    pushNotification({ type: 'system', title: 'Pool entry added', text: `${form.investor.trim()} → ${form.property.trim()}.`, tone: 'gold', icon: 'Users' })
  }

  return (
    <div>
      <PageHeader title="Investor Pool" subtitle="Pooled investments per property — units, ownership % & ROI" icon="Layers">
        <button className="btn-gold btn-sm" onClick={() => setOpen(true)}>+ Add Pool Entry</button>
      </PageHeader>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add Pool Entry"
        subtitle="Record a pooled investment"
        icon="Users"
        size="md"
        footer={
          <>
            <button className="btn-ghost btn-sm" onClick={() => setOpen(false)}>Cancel</button>
            <button className="btn-gold btn-sm" onClick={submit}>Add Entry</button>
          </>
        }
      >
        <form onSubmit={submit}>
          <FormGrid>
            <TextField label="Investor" value={form.investor} onChange={set('investor')} placeholder="e.g. Rohan Mehta" required />
            <TextField label="Property" value={form.property} onChange={set('property')} placeholder="e.g. Prime Commercial Tower" required />
            <TextField label="Investment Amount" value={form.amount} onChange={set('amount')} placeholder="e.g. ₹5 Cr" />
            <TextField label="Share %" value={form.share} onChange={set('share')} placeholder="e.g. 12" />
          </FormGrid>
        </form>
      </Modal>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Pooled Capital" value="₹75.00 Cr" delta={10.0} up icon="Layers" tint="gold" />
        <StatCard label="Pool Investors" value="18" delta={5.0} up icon="Users" tint="blue" />
        <StatCard label="Avg. Ownership" value="48.9%" delta={0} up icon="PieChart" tint="purple" hint="per property" />
        <StatCard label="Upcoming Exits" value="3" delta={1.0} up icon="LogOut" tint="orange" hint="next 90 days" />
      </div>

      <Toolbar
        placeholder="Search by investor or property…"
        query={q}
        onQuery={setQ}
        onExport={() => rows.length && downloadCsv(`investor-pool-${rows.length}.csv`, rows, [
          { key: 'investor', label: 'Investor' }, { key: 'property', label: 'Property' }, { key: 'amount', label: 'Investment' },
          { key: 'units', label: 'Units' }, { key: 'ownership', label: 'Ownership' }, { key: 'roi', label: 'ROI' },
          { key: 'date', label: 'Invested On' }, { key: 'exit', label: 'Exit' },
        ])}
      />

      <Table
        columns={columns}
        rows={rows}
        renderCell={(key, row, i) => {
          if (key === 'investor') {
            const iid = investorIdByName(row.investor)
            return (
              <div className="flex items-center gap-3">
                <Avatar initials={initials(row.investor)} tint="blue" />
                {iid ? (
                  <button onClick={() => nav(`/investors/${iid}`)} className="font-medium text-slate-100 hover:text-gold-300">{row.investor}</button>
                ) : (
                  <span className="font-medium text-slate-100">{row.investor}</span>
                )}
              </div>
            )
          }
          if (key === 'property') {
            const pid = propertyIdByName(row.property)
            return pid ? (
              <button onClick={() => nav(`/properties/${pid}`)} className="text-slate-300 hover:text-gold-300">{row.property}</button>
            ) : row.property
          }
          if (key === 'amount') return <span className="font-semibold text-white">{row.amount}</span>
          if (key === 'ownership') return <Badge tone="purple">{row.ownership}</Badge>
          if (key === 'roi') return <span className="text-brand-green">{row.roi}</span>
          if (key === 'exit') return row.exit === '—' ? <span className="text-slate-500">Active</span> : <Badge tone="orange">{row.exit}</Badge>
          return row[key]
        }}
      />
    </div>
  )
}
