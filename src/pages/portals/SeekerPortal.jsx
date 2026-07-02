import { useState } from 'react'
import { PageHeader, Card, CardHeader, Badge, StatCard, Tabs, Table, Icon, Field } from '../../components/ui/Primitives'
import { Modal, FormGrid, TextField, SelectField } from '../../components/ui/Modal'
import { DonutChart } from '../../components/charts/Charts'
import { useApp } from '../../context/AppContext'
import { portalSeeker as s } from '../../data/mockData'

const num = (v) => parseFloat(String(v).replace(/[₹,\s]/g, '')) || 0

export default function SeekerPortal() {
  const { pushNotification } = useApp()
  const raisedPct = Math.min(100, Math.round((num(s.raised) / num(s.required)) * 100))

  const [checklist, setChecklist] = useState(s.checklist)
  const [messages, setMessages] = useState(s.messages)
  const [draft, setDraft] = useState('')

  const [uploadOpen, setUploadOpen] = useState(false)
  const [msgOpen, setMsgOpen] = useState(false)
  const [reqOpen, setReqOpen] = useState(false)
  const [uploadForm, setUploadForm] = useState({ type: 'Business Plan', notes: '' })
  const [reqForm, setReqForm] = useState({ amount: s.required, equity: s.equityOffered, notes: '' })

  const pending = checklist.filter((c) => !c.done).length
  const donePct = Math.round(((checklist.length - pending) / checklist.length) * 100)

  const markUploaded = (item) => {
    setChecklist((list) => list.map((c) => (c.item === item ? { ...c, done: true } : c)))
    pushNotification({ type: 'seeker', title: 'Document uploaded', text: `${item} received and marked complete.`, tone: 'green', icon: 'FileCheck' })
  }

  const submitUpload = () => {
    setUploadForm({ type: 'Business Plan', notes: '' })
    setUploadOpen(false)
    pushNotification({ type: 'seeker', title: 'File uploaded', text: `${uploadForm.type} submitted for review.`, tone: 'green', icon: 'UploadCloud' })
  }

  const sendMessage = () => {
    if (!draft.trim()) return
    setMessages((m) => [...m, { from: 'You', role: s.company, text: draft.trim(), when: 'just now', me: true }])
    setDraft('')
    pushNotification({ type: 'seeker', title: 'Message sent', text: `Sent to consultant ${s.consultant}.`, tone: 'blue', icon: 'MessageSquare' })
  }

  const submitConsultantMsg = () => {
    if (!draft.trim()) { setMsgOpen(false); return }
    sendMessage()
    setMsgOpen(false)
  }

  const submitFundingUpdate = () => {
    setReqOpen(false)
    pushNotification({ type: 'seeker', title: 'Funding request updated', text: `Requesting ${reqForm.amount} for ${reqForm.equity} equity.`, tone: 'purple', icon: 'Target' })
  }

  return (
    <div>
      <PageHeader title="Investment Seeker Portal" subtitle={`${s.company} · Funding request, documents & proposal tracking`} icon="Rocket">
        <Badge>{s.stage}</Badge>
        <button className="btn-ghost btn-sm" onClick={() => setReqOpen(true)}><Icon name="Target" size={14} /> Edit Request</button>
        <button className="btn-gold btn-sm" onClick={() => setMsgOpen(true)}><Icon name="MessageSquare" size={14} /> Message Consultant</button>
      </PageHeader>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Funding Required" value={s.required} delta={0} up icon="Target" tint="gold" />
        <StatCard label="Committed" value={s.raised} delta={raisedPct} up icon="TrendingUp" tint="green" hint={`${raisedPct}% of goal`} />
        <StatCard label="Stage" value={s.stage} delta={0} up icon="Milestone" tint="blue" />
        <StatCard label="Docs Pending" value={pending} delta={0} up icon="ListChecks" tint="purple" hint={`${donePct}% complete`} />
      </div>

      {/* Funding progress bar */}
      <Card className="card-pad mb-6">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-slate-200">Funding Progress</span>
          <span className="text-slate-400">{s.raised} <span className="text-slate-600">of</span> {s.required}</span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-gold-gradient transition-all" style={{ width: `${raisedPct}%` }} />
        </div>
      </Card>

      <Tabs
        tabs={[
          { key: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
          { key: 'timeline', label: 'Proposal Timeline', icon: 'GitCommitVertical' },
          { key: 'documents', label: 'Documents', icon: 'ListChecks', count: pending || undefined },
          { key: 'investors', label: 'Investor Interest', icon: 'Users', count: s.investorInterest.length },
          { key: 'messages', label: 'Messages', icon: 'MessageSquare' },
        ]}
      >
        {(tab) => (
          <>
            {/* ---------------- Overview ---------------- */}
            {tab === 'overview' && (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <Card className="overflow-hidden lg:col-span-2">
                  <CardHeader title="Use of Funds" subtitle="How the raise will be deployed" icon="PieChart" />
                  <div className="grid grid-cols-1 gap-2 px-3 pb-4 pt-1 sm:grid-cols-2">
                    <DonutChart data={s.useOfFunds} centerTop="Raise" centerBottom={s.required} height={230} />
                    <div className="flex flex-col justify-center gap-2 px-2">
                      {s.useOfFunds.map((u) => (
                        <div key={u.name} className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2 text-slate-300">
                            <span className="h-2.5 w-2.5 rounded-full" style={{ background: u.color }} />{u.name}
                          </span>
                          <span className="font-medium text-slate-200">{u.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

                <Card>
                  <CardHeader title="Business Snapshot" icon="Building2" />
                  <div className="card-pad grid grid-cols-1 gap-3 pt-3">
                    <Field label="Industry" value={s.industry} />
                    <Field label="Location" value={s.location} />
                    <Field label="Valuation" value={s.valuation} accent />
                    <Field label="Equity Offered" value={s.equityOffered} />
                    <Field label="Consultant" value={s.consultant} accent />
                  </div>
                </Card>
              </div>
            )}

            {/* ---------------- Timeline ---------------- */}
            {tab === 'timeline' && (
              <Card>
                <CardHeader title="Proposal Status Timeline" subtitle={s.proposalStatus} icon="GitCommitVertical" />
                <div className="card-pad pt-4">
                  <div className="relative space-y-6 pl-6">
                    <div className="absolute left-[9px] top-1 h-[calc(100%-1rem)] w-px bg-white/10" />
                    {s.timeline.map((t, i) => (
                      <div key={i} className="relative">
                        <span className={`absolute -left-6 top-0.5 grid h-5 w-5 place-items-center rounded-full ring-2 ${
                          t.done ? 'bg-brand-green/20 text-brand-green ring-brand-green/40' : 'bg-ink-800 text-slate-500 ring-white/10'}`}>
                          {t.done ? <Icon name="Check" size={12} /> : <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />}
                        </span>
                        <div className="text-sm font-medium text-slate-100">{t.step}</div>
                        <div className="text-xs text-slate-500">{t.date}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {/* ---------------- Documents ---------------- */}
            {tab === 'documents' && (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader title="Compliance Checklist" subtitle={`${pending} of ${checklist.length} pending`} icon="ListChecks" />
                  <div className="card-pad space-y-1.5 pt-3">
                    {checklist.map((c) => (
                      <div key={c.item} className="flex items-center justify-between rounded-lg px-2 py-1.5">
                        <span className="flex items-center gap-2.5 text-sm text-slate-300">
                          <Icon name={c.done ? 'CheckCircle2' : 'Circle'} size={16} className={c.done ? 'text-brand-green' : 'text-slate-500'} />
                          {c.item}
                        </span>
                        {c.done ? <Badge tone="green">Uploaded</Badge> : <button className="btn-ghost btn-sm" onClick={() => markUploaded(c.item)}>Upload</button>}
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="card-pad">
                  <button
                    onClick={() => setUploadOpen(true)}
                    className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/10 py-8 text-center transition hover:border-gold-400/40 hover:bg-white/[0.02]"
                  >
                    <Icon name="UploadCloud" size={28} className="text-gold-300" />
                    <div className="mt-2 text-sm font-medium text-slate-200">Upload Business Plan / Financials</div>
                    <div className="text-xs text-slate-500">PDF, XLSX up to 25 MB</div>
                    <span className="btn-gold btn-sm mt-4">Choose Files</span>
                  </button>
                </Card>
              </div>
            )}

            {/* ---------------- Investor Interest ---------------- */}
            {tab === 'investors' && (
              <Card className="overflow-hidden">
                <CardHeader title="Investor Interest" subtitle="Investors your proposal was shared with" icon="Users" />
                <div className="px-2 pb-2 pt-2">
                  <Table
                    columns={[
                      { key: 'name', label: 'Investor' },
                      { key: 'country', label: 'Country' },
                      { key: 'ticket', label: 'Ticket', align: 'right' },
                      { key: 'status', label: 'Status', align: 'right' },
                    ]}
                    rows={s.investorInterest.map((x, i) => ({ id: i, ...x }))}
                    renderCell={(key, row) => {
                      if (key === 'name') return <span className="font-medium text-slate-100">{row.name}</span>
                      if (key === 'ticket') return <span className="font-semibold text-gold-300">{row.ticket}</span>
                      if (key === 'status') return <Badge tone={row.status === 'Committed' ? 'green' : undefined}>{row.status}</Badge>
                      return row[key]
                    }}
                  />
                </div>
              </Card>
            )}

            {/* ---------------- Messages ---------------- */}
            {tab === 'messages' && (
              <Card className="flex flex-col">
                <CardHeader title={`Consultant · ${s.consultant}`} subtitle="Your dedicated advisor" icon="MessageSquare" />
                <div className="card-pad flex-1 space-y-3 pt-3">
                  {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.me ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${m.me ? 'bg-gold-400/15 text-slate-100 ring-1 ring-gold-400/20' : 'bg-white/[0.04] text-slate-200 ring-1 ring-white/5'}`}>
                        {!m.me && <div className="mb-0.5 text-[11px] font-semibold text-gold-300">{m.from}</div>}
                        <div>{m.text}</div>
                        <div className="mt-1 text-[10px] text-slate-500">{m.when}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 border-t border-white/10 p-3">
                  <input
                    className="input"
                    placeholder="Type a message…"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <button className="btn-gold btn-sm shrink-0" onClick={sendMessage}><Icon name="Send" size={14} /> Send</button>
                </div>
              </Card>
            )}
          </>
        )}
      </Tabs>

      {/* ---------- Upload modal ---------- */}
      <Modal open={uploadOpen} onClose={() => setUploadOpen(false)} title="Upload Document" subtitle="Add to your data room" icon="UploadCloud"
        footer={<><button className="btn-ghost btn-sm" onClick={() => setUploadOpen(false)}>Cancel</button><button className="btn-gold btn-sm" onClick={submitUpload}>Upload</button></>}>
        <FormGrid>
          <SelectField label="Document Type" value={uploadForm.type} onChange={(v) => setUploadForm({ ...uploadForm, type: v })} options={['Business Plan', 'Financial Statements', 'Pitch Deck', 'Valuation Report', 'Director KYC', 'FEMA Declaration', 'Other']} full />
          <TextField label="Notes (optional)" value={uploadForm.notes} onChange={(v) => setUploadForm({ ...uploadForm, notes: v })} placeholder="Any context for the reviewer" full />
        </FormGrid>
        <div className="mt-4 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/10 py-6 text-center">
          <Icon name="UploadCloud" size={24} className="text-gold-300" />
          <div className="mt-1.5 text-xs text-slate-500">Drag &amp; drop or click to browse · PDF, XLSX up to 25 MB</div>
        </div>
      </Modal>

      {/* ---------- Message consultant modal ---------- */}
      <Modal open={msgOpen} onClose={() => setMsgOpen(false)} title="Message Consultant" subtitle={s.consultant} icon="MessageSquare"
        footer={<><button className="btn-ghost btn-sm" onClick={() => setMsgOpen(false)}>Cancel</button><button className="btn-gold btn-sm" onClick={submitConsultantMsg}>Send</button></>}>
        <label className="label">Message</label>
        <textarea className="input min-h-28 resize-y" placeholder="Write your message to your consultant…" value={draft} onChange={(e) => setDraft(e.target.value)} />
      </Modal>

      {/* ---------- Edit funding request modal ---------- */}
      <Modal open={reqOpen} onClose={() => setReqOpen(false)} title="Edit Funding Request" icon="Target"
        footer={<><button className="btn-ghost btn-sm" onClick={() => setReqOpen(false)}>Cancel</button><button className="btn-gold btn-sm" onClick={submitFundingUpdate}>Save</button></>}>
        <FormGrid>
          <TextField label="Amount Required" value={reqForm.amount} onChange={(v) => setReqForm({ ...reqForm, amount: v })} placeholder="₹12 Cr" />
          <TextField label="Equity Offered" value={reqForm.equity} onChange={(v) => setReqForm({ ...reqForm, equity: v })} placeholder="30%" />
          <TextField label="Notes" value={reqForm.notes} onChange={(v) => setReqForm({ ...reqForm, notes: v })} placeholder="Anything investors should know" full />
        </FormGrid>
      </Modal>
    </div>
  )
}
