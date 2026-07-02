import { useState } from 'react'
import { PageHeader, Card, CardHeader, Badge, Icon } from '../../components/ui/Primitives'
import { FileText, Download, Check } from 'lucide-react'

const sections = [
  { key: 'summary', label: 'Executive Summary', icon: 'AlignLeft' },
  { key: 'model', label: 'Business Model', icon: 'Boxes' },
  { key: 'projection', label: 'Financial Projection', icon: 'LineChart' },
  { key: 'requirement', label: 'Investment Requirement', icon: 'Wallet' },
  { key: 'risk', label: 'Risk Analysis', icon: 'AlertTriangle' },
  { key: 'exit', label: 'Exit Strategy', icon: 'LogOut' },
  { key: 'shareholding', label: 'Shareholding Pattern', icon: 'PieChart' },
  { key: 'timeline', label: 'Funding Timeline', icon: 'CalendarClock' },
  { key: 'attachments', label: 'Attachments', icon: 'Paperclip' },
]

export default function ProposalBuilder() {
  const [active, setActive] = useState('summary')
  const [done, setDone] = useState(['summary', 'model', 'projection'])
  const toggle = (k) => setDone((d) => (d.includes(k) ? d.filter((x) => x !== k) : [...d, k]))
  const pct = Math.round((done.length / sections.length) * 100)

  return (
    <div>
      <PageHeader title="FDI Proposal Builder" subtitle="Generate professional, investor-ready proposals with PDF export" icon="FileText">
        <button className="btn-ghost btn-sm"><Icon name="Eye" size={14} /> Preview</button>
        <button className="btn-gold btn-sm"><Download size={14} /> Export PDF</button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        {/* Section nav */}
        <Card className="card-pad h-fit">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-white">Sections</span>
            <Badge tone={pct === 100 ? 'green' : 'gold'}>{pct}% complete</Badge>
          </div>
          <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gold-gradient transition-all" style={{ width: `${pct}%` }} />
          </div>
          <div className="space-y-1">
            {sections.map((s) => (
              <button
                key={s.key}
                onClick={() => setActive(s.key)}
                className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition ${
                  active === s.key ? 'bg-gold-400/10 text-gold-200' : 'text-slate-400 hover:bg-white/5'
                }`}
              >
                <Icon name={s.icon} size={15} />
                <span className="flex-1">{s.label}</span>
                {done.includes(s.key) && <Check size={14} className="text-brand-green" />}
              </button>
            ))}
          </div>
        </Card>

        {/* Editor + preview */}
        <div className="space-y-6">
          <Card>
            <CardHeader
              title={sections.find((s) => s.key === active)?.label}
              subtitle="Draft content for this section — auto-saved"
              icon="PenLine"
              action={
                <button onClick={() => toggle(active)} className="btn-ghost btn-sm">
                  {done.includes(active) ? 'Mark incomplete' : 'Mark complete'}
                </button>
              }
            />
            <div className="card-pad space-y-4 pt-3">
              <div>
                <label className="label">Section Heading</label>
                <input className="input" defaultValue={sections.find((s) => s.key === active)?.label} />
              </div>
              <div>
                <label className="label">Content</label>
                <textarea
                  className="input min-h-[180px] resize-y"
                  defaultValue="GreenTech Solutions is raising ₹12 Cr to expand solar manufacturing capacity to 500 MW, targeting 22% ROI over a 4-year horizon under the automatic FDI route…"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {['Insert Chart', 'Insert Table', 'Insert Financials', 'AI Draft'].map((b) => (
                  <button key={b} className="btn-ghost btn-sm">{b}</button>
                ))}
              </div>
            </div>
          </Card>

          {/* Live proposal card preview */}
          <Card className="card-pad">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-semibold text-white">Live Preview</span>
              <Badge tone="slate">A4 · PDF</Badge>
            </div>
            <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 text-ink-900 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <div className="font-serif text-xl font-bold text-ink-900">FDI Investment Proposal</div>
                  <div className="text-sm text-slate-500">GreenTech Solutions Pvt. Ltd.</div>
                </div>
                <FileText className="text-gold-600" size={28} />
              </div>
              <div className="mt-5 grid grid-cols-3 gap-4 text-center">
                {[['₹12 Cr', 'Funding'], ['18%', 'Equity'], ['22%', 'Target ROI']].map(([v, l]) => (
                  <div key={l} className="rounded-lg bg-slate-50 py-3">
                    <div className="text-lg font-bold text-ink-900">{v}</div>
                    <div className="text-xs text-slate-500">{l}</div>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-sm leading-relaxed text-slate-600">
                GreenTech Solutions is a Bangalore-based CleanTech company seeking foreign direct
                investment under the automatic route to scale solar module manufacturing…
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
