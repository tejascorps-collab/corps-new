import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader, Card, Badge, StatCard, Avatar, initials, Icon } from '../../components/ui/Primitives'
import { HBarChart } from '../../components/charts/Charts'
import { Modal, FormGrid, TextField, SelectField } from '../../components/ui/Modal'
import { useApp } from '../../context/AppContext'
import { useData } from '../../context/DataContext'
import { useTelephony } from '../../context/TelephonyContext'
import { crmPipeline } from '../../data/mockData'

const stages = ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation']
const channels = [
  { icon: 'Phone', label: 'Calls', count: 42, tint: 'blue' },
  { icon: 'MessageCircle', label: 'WhatsApp', count: 128, tint: 'green' },
  { icon: 'Mail', label: 'Emails', count: 264, tint: 'purple' },
  { icon: 'CalendarDays', label: 'Meetings', count: 19, tint: 'orange' },
]

export default function CRM() {
  const { pushNotification } = useApp()
  const { leads, addLead } = useData()
  const { placeCall, onCall } = useTelephony()
  const nav = useNavigate()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', company: '', type: 'Investor', stage: 'New', value: '', phone: '' })

  const submit = async () => {
    if (!form.name.trim()) return
    try {
      const lead = await addLead({
        name: form.name.trim(),
        company: form.company.trim(),
        type: form.type,
        source: 'Manual',
        stage: form.stage,
        owner: 'Sales · You',
        value: form.value.trim(),
        phone: form.phone.trim(),
      })
      setOpen(false)
      setForm({ name: '', company: '', type: 'Investor', stage: 'New', value: '', phone: '' })
      pushNotification({ type: 'system', title: 'Lead added', text: `${lead.name} added to pipeline.`, tone: 'green', icon: 'Contact' })
    } catch {
      pushNotification({ type: 'system', title: 'Failed', text: 'Could not add lead. Please try again.', tone: 'red', icon: 'AlertTriangle' })
    }
  }

  // Click-to-call: dial the lead, then jump to the softphone so the agent sees the live call.
  const callLead = (l) => {
    if (!l.phone || l.phone === '—') {
      pushNotification({ type: 'system', title: 'No phone number', text: `${l.name} has no number on file.`, tone: 'orange', icon: 'PhoneOff' })
      return
    }
    if (placeCall(l.phone, l.name)) nav('/telephony')
  }

  return (
    <div>
      <PageHeader title="CRM & Leads" subtitle="Leads, calls, follow-ups, WhatsApp, email, meetings & tasks" icon="Contact">
        <button className="btn-gold btn-sm" onClick={() => setOpen(true)}>+ Add Lead</button>
      </PageHeader>

      <Modal open={open} onClose={() => setOpen(false)} title="Add Lead" subtitle="Create a new pipeline lead" icon="Contact"
        footer={<><button className="btn-ghost btn-sm" onClick={() => setOpen(false)}>Cancel</button><button className="btn-gold btn-sm" onClick={submit}>Add Lead</button></>}>
        <FormGrid>
          <TextField label="Name" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} placeholder="Full name" required />
          <TextField label="Company" value={form.company} onChange={(v) => setForm((f) => ({ ...f, company: v }))} placeholder="Company" />
          <SelectField label="Type" value={form.type} onChange={(v) => setForm((f) => ({ ...f, type: v }))} options={['Investor', 'Seeker']} />
          <SelectField label="Stage" value={form.stage} onChange={(v) => setForm((f) => ({ ...f, stage: v }))} options={stages} />
          <TextField label="Phone" value={form.phone} onChange={(v) => setForm((f) => ({ ...f, phone: v }))} placeholder="+91 98765 43210" />
          <TextField label="Value" value={form.value} onChange={(v) => setForm((f) => ({ ...f, value: v }))} placeholder="₹5 Cr" />
        </FormGrid>
      </Modal>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {channels.map((c) => (
          <Card key={c.label} className="card-pad flex items-center gap-4">
            <span className={`grid h-11 w-11 place-items-center rounded-xl bg-brand-${c.tint}/10 text-brand-${c.tint}`}>
              <Icon name={c.icon} size={20} />
            </span>
            <div>
              <div className="text-xl font-bold text-white">{c.count}</div>
              <div className="text-xs text-slate-500">{c.label} this month</div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <div className="px-5 pt-5 text-sm font-semibold text-white">Lead Pipeline</div>
          <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 lg:grid-cols-5">
            {stages.map((s) => {
              const items = leads.filter((l) => l.stage === s)
              return (
                <div key={s} className="rounded-xl bg-white/[0.02] p-2.5 ring-1 ring-white/5">
                  <div className="mb-2 flex items-center justify-between px-1">
                    <span className="text-xs font-semibold text-slate-300">{s}</span>
                    <span className="chip bg-white/5 text-slate-400">{items.length}</span>
                  </div>
                  <div className="space-y-2">
                    {items.map((l) => (
                      <div key={l.name} className="rounded-lg bg-ink-800 p-2.5 ring-1 ring-white/5">
                        <div className="flex items-center gap-2">
                          <Avatar initials={initials(l.name)} tint={l.type === 'Investor' ? 'blue' : 'purple'} />
                          <div className="min-w-0">
                            <div className="truncate text-xs font-medium text-slate-100">{l.name}</div>
                            <div className="truncate text-[10px] text-slate-500">{l.company}</div>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-gold-300">{l.value}</span>
                          <span className="text-[10px] text-slate-500">{l.last}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        <Card>
          <div className="px-5 pt-5 text-sm font-semibold text-white">Pipeline by Stage</div>
          <div className="card-pad pt-3">
            <HBarChart data={crmPipeline} dataKey="count" categoryKey="stage" />
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-5">
          <span className="text-sm font-semibold text-white">All Leads</span>
          <button className="btn-ghost btn-sm" onClick={() => nav('/telephony')}><Icon name="Headphones" size={14} /> Softphone</button>
        </div>
        <div className="overflow-x-auto px-2 pb-2 pt-2">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead>
              <tr className="text-[11px] uppercase tracking-wide text-slate-500">
                {['Lead', 'Type', 'Phone', 'Stage', 'Owner', 'Value', 'Last Activity', ''].map((h) => (
                  <th key={h} className="px-3 py-2">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.name} className="table-row">
                  <td className="px-3 py-3">
                    <div className="font-medium text-slate-100">{l.name}</div>
                    <div className="text-xs text-slate-500">{l.company}</div>
                  </td>
                  <td className="px-3 py-3"><Badge tone={l.type === 'Investor' ? 'blue' : 'purple'}>{l.type}</Badge></td>
                  <td className="px-3 py-3 text-slate-400">{l.phone || '—'}</td>
                  <td className="px-3 py-3"><Badge tone="slate">{l.stage}</Badge></td>
                  <td className="px-3 py-3 text-slate-400">{l.owner}</td>
                  <td className="px-3 py-3 font-semibold text-gold-300">{l.value}</td>
                  <td className="px-3 py-3 text-slate-500">{l.last}</td>
                  <td className="px-3 py-3 text-right">
                    <button
                      onClick={() => callLead(l)}
                      disabled={onCall}
                      title={`Call ${l.name}`}
                      aria-label={`Call ${l.name}`}
                      className="grid h-8 w-8 place-items-center rounded-lg bg-brand-green/10 text-brand-green ring-1 ring-brand-green/20 transition hover:bg-brand-green/20 disabled:opacity-40"
                    >
                      <Icon name="Phone" size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
