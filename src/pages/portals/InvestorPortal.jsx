import { useState } from 'react'
import { PageHeader, Card, CardHeader, Badge, StatCard, Table, Tabs, Icon, Progress, Field } from '../../components/ui/Primitives'
import { Modal, FormGrid, TextField, SelectField } from '../../components/ui/Modal'
import { DonutChart, AumProfitChart } from '../../components/charts/Charts'
import { downloadCsv } from '../../lib/exportCsv'
import { useApp } from '../../context/AppContext'
import { useData } from '../../context/DataContext'
import { portalInvestor as p } from '../../data/mockData'

const toneRing = {
  green: 'bg-brand-green/10 text-brand-green ring-brand-green/20',
  blue: 'bg-brand-blue/10 text-brand-blue ring-brand-blue/20',
  gold: 'bg-gold-400/10 text-gold-300 ring-gold-400/20',
  purple: 'bg-brand-purple/10 text-brand-purple ring-brand-purple/20',
}

export default function InvestorPortal() {
  const { pushNotification } = useApp()
  const { addTicket } = useData()

  // Requests live in local state so "New Request" adds to the list.
  const [requests, setRequests] = useState(p.requests)

  // Modals
  const [reqOpen, setReqOpen] = useState(false)
  const [ticketOpen, setTicketOpen] = useState(false)
  const [interest, setInterest] = useState(null) // opportunity being expressed interest in

  const [reqForm, setReqForm] = useState({ type: 'New Investment', amount: '', detail: '' })
  const [ticketForm, setTicketForm] = useState({ subject: '', priority: 'Medium', detail: '' })

  const submitRequest = () => {
    if (!reqForm.amount && !reqForm.detail) return
    const item = {
      type: reqForm.type,
      detail: `${reqForm.detail || reqForm.type}${reqForm.amount ? ` — ${reqForm.amount}` : ''}`,
      date: '2026-07-02',
      status: 'Under Review',
    }
    setRequests((r) => [item, ...r])
    setReqOpen(false)
    setReqForm({ type: 'New Investment', amount: '', detail: '' })
    pushNotification({ type: 'investor', title: 'Request submitted', text: `${item.type}: ${item.detail}`, tone: 'blue', icon: 'Inbox' })
  }

  const submitTicket = async () => {
    if (!ticketForm.subject) return
    try {
      const t = await addTicket({ subject: ticketForm.subject, requester: p.name, category: 'Investor', priority: ticketForm.priority })
      setTicketOpen(false)
      setTicketForm({ subject: '', priority: 'Medium', detail: '' })
      pushNotification({ type: 'support', title: 'Support ticket raised', text: `${t.id}: ${t.subject}`, tone: 'red', icon: 'LifeBuoy', to: '/support' })
    } catch {
      pushNotification({ type: 'support', title: 'Failed', text: 'Could not raise ticket. Please try again.', tone: 'red', icon: 'LifeBuoy' })
    }
  }

  const confirmInterest = () => {
    const o = interest
    setInterest(null)
    pushNotification({ type: 'investor', title: 'Interest registered', text: `Your relationship manager will reach out about ${o.name}.`, tone: 'gold', icon: 'Sparkles' })
  }

  const exportStatements = () =>
    downloadCsv('investor-statements.csv', p.statements, [
      { key: 'period', label: 'Period' }, { key: 'type', label: 'Type' },
      { key: 'size', label: 'Size' }, { key: 'date', label: 'Date' },
    ])

  return (
    <div>
      <PageHeader title="Investor Portal" subtitle={`${p.name} · Portfolio, ROI, opportunities & requests`} icon="UserCircle">
        <Badge tone="green"><Icon name="ShieldCheck" size={12} /> KYC {p.kyc}</Badge>
        <button className="btn-ghost btn-sm" onClick={() => setTicketOpen(true)}><Icon name="LifeBuoy" size={14} /> Support</button>
        <button className="btn-gold btn-sm" onClick={() => setReqOpen(true)}><Icon name="Plus" size={14} /> New Request</button>
      </PageHeader>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Portfolio Value" value={p.portfolioValue} delta={12.0} up icon="Briefcase" tint="gold" />
        <StatCard label="Total Invested" value={p.invested} delta={0} up icon="Wallet" tint="blue" />
        <StatCard label="Current ROI" value={p.currentRoi} delta={2.1} up icon="Gauge" tint="green" />
        <StatCard label="Profit Booked" value={p.profitBooked} delta={18.0} up icon="Coins" tint="purple" />
      </div>

      <Tabs
        tabs={[
          { key: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
          { key: 'portfolio', label: 'Portfolio', icon: 'PieChart' },
          { key: 'opportunities', label: 'Opportunities', icon: 'Sparkles' },
          { key: 'requests', label: 'Requests', icon: 'Inbox', count: requests.length },
          { key: 'documents', label: 'Statements & Docs', icon: 'FileText' },
        ]}
      >
        {(tab) => (
          <>
            {/* ---------------- Overview ---------------- */}
            {tab === 'overview' && (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2 overflow-hidden">
                  <CardHeader title="Portfolio Performance" subtitle="AUM & profit booked (₹ Cr)" icon="TrendingUp" />
                  <div className="px-3 pb-4 pt-2"><AumProfitChart data={p.performance} /></div>
                </Card>

                <Card className="overflow-hidden">
                  <CardHeader title="Allocation" subtitle="By sector" icon="PieChart" />
                  <div className="px-3 pb-3 pt-1">
                    <DonutChart data={p.allocation} centerTop="Holdings" centerBottom={p.holdings.length} height={220} />
                    <div className="mt-2 space-y-1.5 px-2">
                      {p.allocation.map((a) => (
                        <div key={a.name} className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2 text-slate-300">
                            <span className="h-2.5 w-2.5 rounded-full" style={{ background: a.color }} />{a.name}
                          </span>
                          <span className="font-medium text-slate-200">{a.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

                <Card className="lg:col-span-2">
                  <CardHeader title="Recent Activity" icon="Activity" />
                  <div className="card-pad space-y-2 pt-3">
                    {p.activity.map((a, i) => (
                      <div key={i} className="flex items-start gap-3 rounded-xl bg-white/[0.02] p-3 ring-1 ring-white/5">
                        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ring-1 ${toneRing[a.tone]}`}>
                          <Icon name={a.icon} size={16} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm text-slate-200">{a.text}</div>
                          <div className="text-[11px] text-slate-500">{a.when}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card>
                  <CardHeader title="Account" icon="UserCircle" />
                  <div className="card-pad grid grid-cols-1 gap-3 pt-3">
                    <Field label="Relationship Manager" value={p.rm} accent />
                    <Field label="Risk Profile" value={p.riskProfile} />
                    <Field label="Member Since" value={p.memberSince} />
                    <Field label="KYC Status" value={p.kyc} />
                  </div>
                </Card>
              </div>
            )}

            {/* ---------------- Portfolio ---------------- */}
            {tab === 'portfolio' && (
              <Card className="overflow-hidden">
                <CardHeader title="Investment Portfolio" subtitle={`${p.holdings.length} active holdings`} icon="PieChart"
                  action={<button className="btn-ghost btn-sm" onClick={() => downloadCsv('investor-portfolio.csv', p.holdings, [
                    { key: 'asset', label: 'Asset' }, { key: 'type', label: 'Type' }, { key: 'invested', label: 'Invested' },
                    { key: 'current', label: 'Current' }, { key: 'roi', label: 'ROI' },
                  ])}><Icon name="Download" size={14} /> Export</button>} />
                <div className="px-2 pb-2 pt-2">
                  <Table
                    columns={[
                      { key: 'asset', label: 'Asset' },
                      { key: 'type', label: 'Type' },
                      { key: 'invested', label: 'Invested', align: 'right' },
                      { key: 'current', label: 'Current', align: 'right' },
                      { key: 'roi', label: 'ROI', align: 'right' },
                    ]}
                    rows={p.holdings}
                    renderCell={(key, row) => {
                      if (key === 'asset') return <span className="font-medium text-slate-100">{row.asset}</span>
                      if (key === 'type') return <Badge tone={row.type === 'Property' ? 'orange' : 'teal'}>{row.type}</Badge>
                      if (key === 'current') return <span className="font-semibold text-white">{row.current}</span>
                      if (key === 'roi') return <span className="text-brand-green">{row.roi}</span>
                      return row[key]
                    }}
                  />
                </div>
              </Card>
            )}

            {/* ---------------- Opportunities ---------------- */}
            {tab === 'opportunities' && (
              <Card>
                <CardHeader title="New Opportunities" subtitle="Curated for your risk profile" icon="Sparkles" />
                <div className="card-pad grid grid-cols-1 gap-4 pt-3 sm:grid-cols-2 lg:grid-cols-3">
                  {p.opportunities.map((o) => (
                    <div key={o.name} className="flex flex-col rounded-xl bg-white/[0.02] p-4 ring-1 ring-white/5">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-sm font-semibold text-slate-100">{o.name}</div>
                          <div className="text-xs text-slate-500">{o.sector}</div>
                        </div>
                        <Badge tone="slate">Closes {o.closing}</Badge>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div>
                          <div className="text-xs text-slate-500">Target ROI</div>
                          <div className="font-semibold text-brand-green">{o.roi}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-slate-500">Min. Ticket</div>
                          <div className="font-semibold text-gold-300">{o.min}</div>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="mb-1 flex justify-between text-[11px] text-slate-500"><span>Raised</span><span>{o.raised}%</span></div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                          <div className="h-full rounded-full bg-gold-gradient" style={{ width: `${o.raised}%` }} />
                        </div>
                      </div>
                      <button className="btn-gold btn-sm mt-4 w-full" onClick={() => setInterest(o)}>Express Interest</button>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* ---------------- Requests ---------------- */}
            {tab === 'requests' && (
              <Card>
                <CardHeader title="My Requests" subtitle="Investments, withdrawals & exits" icon="Inbox"
                  action={<button className="btn-gold btn-sm" onClick={() => setReqOpen(true)}><Icon name="Plus" size={14} /> New</button>} />
                <div className="card-pad space-y-2 pt-3">
                  {requests.map((r, i) => (
                    <div key={i} className="flex items-center justify-between rounded-xl bg-white/[0.02] p-3.5 ring-1 ring-white/5">
                      <div className="flex items-center gap-3">
                        <span className={`grid h-9 w-9 place-items-center rounded-lg ring-1 ${r.type === 'Withdrawal' ? toneRing.purple : toneRing.blue}`}>
                          <Icon name={r.type === 'Withdrawal' ? 'ArrowDownRight' : 'ArrowUpRight'} size={16} />
                        </span>
                        <div>
                          <div className="text-sm font-medium text-slate-100">{r.type}</div>
                          <div className="text-xs text-slate-500">{r.detail}</div>
                          <div className="text-[11px] text-slate-600">{r.date}</div>
                        </div>
                      </div>
                      <Badge>{r.status}</Badge>
                    </div>
                  ))}
                  {requests.length === 0 && <div className="py-8 text-center text-sm text-slate-500">No requests yet.</div>}
                </div>
              </Card>
            )}

            {/* ---------------- Statements & Docs ---------------- */}
            {tab === 'documents' && (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader title="Statements" subtitle="Download account statements" icon="FileText"
                    action={<button className="btn-ghost btn-sm" onClick={exportStatements}><Icon name="Download" size={14} /> Export list</button>} />
                  <div className="card-pad space-y-2 pt-3">
                    {p.statements.map((st, i) => (
                      <div key={i} className="flex items-center justify-between rounded-xl bg-white/[0.02] p-3 ring-1 ring-white/5">
                        <div className="flex items-center gap-3">
                          <span className="grid h-9 w-9 place-items-center rounded-lg bg-gold-400/10 text-gold-300"><Icon name="FileText" size={16} /></span>
                          <div>
                            <div className="text-sm font-medium text-slate-100">{st.type}</div>
                            <div className="text-[11px] text-slate-500">{st.period} · {st.size} · {st.date}</div>
                          </div>
                        </div>
                        <button
                          className="btn-ghost btn-sm"
                          onClick={() => pushNotification({ type: 'investor', title: 'Download started', text: `${st.type} (${st.period})`, tone: 'green', icon: 'Download' })}
                        ><Icon name="Download" size={14} /></button>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card>
                  <CardHeader title="Documents" subtitle="Agreements & certificates" icon="FolderOpen" />
                  <div className="card-pad space-y-2 pt-3">
                    {p.documents.map((d, i) => (
                      <div key={i} className="flex items-center justify-between rounded-xl bg-white/[0.02] p-3 ring-1 ring-white/5">
                        <div className="flex items-center gap-3">
                          <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 text-slate-300"><Icon name="FileCheck" size={16} /></span>
                          <div className="min-w-0">
                            <div className="truncate text-sm font-medium text-slate-100">{d.name}</div>
                            <div className="text-[11px] text-slate-500">{d.date}</div>
                          </div>
                        </div>
                        <Badge tone="green">{d.type}</Badge>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}
          </>
        )}
      </Tabs>

      {/* ---------- New Request modal ---------- */}
      <Modal open={reqOpen} onClose={() => setReqOpen(false)} title="New Request" subtitle="Investment, withdrawal or exit" icon="Inbox"
        footer={<><button className="btn-ghost btn-sm" onClick={() => setReqOpen(false)}>Cancel</button><button className="btn-gold btn-sm" onClick={submitRequest}>Submit Request</button></>}>
        <FormGrid>
          <SelectField label="Request Type" value={reqForm.type} onChange={(v) => setReqForm({ ...reqForm, type: v })} options={['New Investment', 'Withdrawal', 'Partial Exit', 'Reinvestment']} />
          <TextField label="Amount" value={reqForm.amount} onChange={(v) => setReqForm({ ...reqForm, amount: v })} placeholder="₹5 Cr" />
          <TextField label="Details" value={reqForm.detail} onChange={(v) => setReqForm({ ...reqForm, detail: v })} placeholder="Asset / notes" full />
        </FormGrid>
      </Modal>

      {/* ---------- Support ticket modal ---------- */}
      <Modal open={ticketOpen} onClose={() => setTicketOpen(false)} title="Raise a Support Ticket" subtitle="Our team responds within 24h" icon="LifeBuoy"
        footer={<><button className="btn-ghost btn-sm" onClick={() => setTicketOpen(false)}>Cancel</button><button className="btn-gold btn-sm" onClick={submitTicket}>Submit Ticket</button></>}>
        <FormGrid>
          <TextField label="Subject" value={ticketForm.subject} onChange={(v) => setTicketForm({ ...ticketForm, subject: v })} placeholder="e.g. Statement discrepancy" required full />
          <SelectField label="Priority" value={ticketForm.priority} onChange={(v) => setTicketForm({ ...ticketForm, priority: v })} options={['Low', 'Medium', 'High', 'Urgent']} />
          <TextField label="Description" value={ticketForm.detail} onChange={(v) => setTicketForm({ ...ticketForm, detail: v })} placeholder="Describe your issue" full />
        </FormGrid>
      </Modal>

      {/* ---------- Express interest confirm ---------- */}
      <Modal open={!!interest} onClose={() => setInterest(null)} title="Express Interest" icon="Sparkles" size="sm"
        footer={<><button className="btn-ghost btn-sm" onClick={() => setInterest(null)}>Cancel</button><button className="btn-gold btn-sm" onClick={confirmInterest}>Confirm Interest</button></>}>
        {interest && (
          <p className="text-sm text-slate-400">
            Register your interest in <span className="font-semibold text-slate-100">{interest.name}</span> ({interest.sector}) with a
            target ROI of <span className="text-brand-green">{interest.roi}</span> and minimum ticket of <span className="text-gold-300">{interest.min}</span>.
            Your relationship manager <span className="text-slate-200">{p.rm}</span> will contact you.
          </p>
        )}
      </Modal>
    </div>
  )
}
