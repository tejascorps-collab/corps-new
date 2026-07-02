import { useState } from 'react'
import { PageHeader, Card, Badge, Icon } from '../../components/ui/Primitives'
import { Modal, FormGrid, TextField, SelectField } from '../../components/ui/Modal'
import { useApp } from '../../context/AppContext'

const workflow = [
  { step: 'Property Identified', icon: 'MapPin', status: 'done' },
  { step: 'Due Diligence', icon: 'Search', status: 'done' },
  { step: 'Legal Verification', icon: 'Scale', status: 'done' },
  { step: 'Investor Approval', icon: 'ThumbsUp', status: 'done' },
  { step: 'Fund Collection', icon: 'Wallet', status: 'active' },
  { step: 'Purchase', icon: 'Handshake', status: 'todo' },
  { step: 'Registration', icon: 'FileSignature', status: 'todo' },
  { step: 'Renovation', icon: 'Hammer', status: 'todo' },
  { step: 'Marketing', icon: 'Megaphone', status: 'todo' },
  { step: 'Sale', icon: 'BadgeIndianRupee', status: 'todo' },
  { step: 'Profit Distribution', icon: 'Coins', status: 'todo' },
]

const initialDeals = [
  { name: 'Prime Commercial Tower', stage: 'Fund Collection', target: '₹52 Cr', collected: '₹41 Cr', pct: 79 },
  { name: 'Palm Beach Resort', stage: 'Renovation', target: '₹19.5 Cr', collected: '₹19.5 Cr', pct: 100 },
  { name: 'Hillcrest Villas', stage: 'Marketing', target: '₹15 Cr', collected: '₹15 Cr', pct: 100 },
  { name: 'Green Valley Farmland', stage: 'Sale', target: '₹6.5 Cr', collected: '₹6.5 Cr', pct: 100 },
]

const stageOpts = ['Property Identified', 'Due Diligence', 'Fund Collection', 'Renovation', 'Marketing', 'Sale']

export default function PropertyDeals() {
  const { pushNotification } = useApp()
  const [deals, setDeals] = useState(initialDeals)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', target: '', stage: 'Fund Collection' })
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }))

  const submit = (e) => {
    e?.preventDefault?.()
    if (!form.name.trim()) return
    const target = form.target.trim() || '₹0 Cr'
    setDeals((d) => [{ name: form.name.trim(), stage: form.stage, target, collected: '₹0 Cr', pct: 0 }, ...d])
    setOpen(false)
    setForm({ name: '', target: '', stage: 'Fund Collection' })
    pushNotification({ type: 'system', title: 'Deal created', text: `${form.name.trim()} added at ${form.stage}.`, tone: 'gold', icon: 'Handshake' })
  }

  return (
    <div>
      <PageHeader title="Property Deals" subtitle="End-to-end acquisition workflow from identification to profit distribution" icon="Handshake">
        <button className="btn-gold btn-sm" onClick={() => setOpen(true)}>+ New Deal</button>
      </PageHeader>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="New Deal"
        subtitle="Register a new acquisition deal"
        icon="Handshake"
        size="md"
        footer={
          <>
            <button className="btn-ghost btn-sm" onClick={() => setOpen(false)}>Cancel</button>
            <button className="btn-gold btn-sm" onClick={submit}>Create Deal</button>
          </>
        }
      >
        <form onSubmit={submit}>
          <FormGrid>
            <TextField label="Deal Name" value={form.name} onChange={set('name')} placeholder="e.g. Skyline Business Park" required full />
            <TextField label="Target Amount" value={form.target} onChange={set('target')} placeholder="e.g. ₹40 Cr" />
            <SelectField label="Stage" value={form.stage} onChange={set('stage')} options={stageOpts} />
          </FormGrid>
        </form>
      </Modal>

      <Card className="mb-6 card-pad">
        <h3 className="mb-5 text-sm font-semibold text-white">Purchase Workflow — Prime Commercial Tower</h3>
        <div className="flex flex-wrap gap-y-6">
          {workflow.map((w, i) => (
            <div key={w.step} className="flex items-center">
              <div className="flex w-24 flex-col items-center text-center">
                <span className={`grid h-11 w-11 place-items-center rounded-full ring-1 ${
                  w.status === 'done' ? 'bg-brand-green/15 text-brand-green ring-brand-green/30'
                  : w.status === 'active' ? 'bg-gold-400/20 text-gold-300 ring-gold-400/40 animate-pulse'
                  : 'bg-white/5 text-slate-500 ring-white/10'}`}>
                  <Icon name={w.icon} size={18} />
                </span>
                <span className={`mt-2 text-[11px] leading-tight ${w.status === 'todo' ? 'text-slate-500' : 'text-slate-200'}`}>{w.step}</span>
              </div>
              {i < workflow.length - 1 && (
                <div className={`mb-5 h-0.5 w-6 ${w.status === 'done' ? 'bg-brand-green/40' : 'bg-white/10'}`} />
              )}
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {deals.map((d) => (
          <Card key={d.name} className="card-pad">
            <div className="flex items-center justify-between">
              <h3 className="text-[15px] font-semibold text-slate-100">{d.name}</h3>
              <Badge>{d.stage}</Badge>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-slate-400">Collected <span className="font-semibold text-white">{d.collected}</span></span>
              <span className="text-slate-400">Target <span className="font-semibold text-white">{d.target}</span></span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-gold-gradient" style={{ width: `${d.pct}%` }} />
            </div>
            <div className="mt-1 text-right text-xs text-gold-300">{d.pct}% funded</div>
          </Card>
        ))}
      </div>
    </div>
  )
}
