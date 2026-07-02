import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader, Card, CardHeader, Badge, StatCard, Avatar, initials } from '../../components/ui/Primitives'
import { useApp } from '../../context/AppContext'
import { matches, investorIdByName, seekerIdByName } from '../../data/mockData'
import { ArrowRight } from 'lucide-react'

const criteria = ['Industry', 'Country', 'Investment Amount', 'Expected ROI', 'Investment Period', 'Risk Profile']

export default function InvestorMatching() {
  const nav = useNavigate()
  const { pushNotification } = useApp()
  const [running, setRunning] = useState(false)

  const runMatching = () => {
    if (running) return
    setRunning(true)
    setTimeout(() => {
      setRunning(false)
      pushNotification({ type: 'system', title: 'Matching complete', text: `Matching complete — ${matches.length} matches found.`, tone: 'purple', icon: 'Sparkles' })
    }, 900)
  }

  const introduce = (m) => {
    pushNotification({ type: 'system', title: 'Introduction sent', text: `Intro sent between ${m.investor} and ${m.seeker}.`, tone: 'gold', icon: 'Handshake' })
  }

  return (
    <div>
      <PageHeader title="Investment Matching Engine" subtitle="Auto-match Investor ↔ Startup ↔ Company on industry, amount, ROI & risk" icon="GitCompareArrows">
        <button className="btn-gold btn-sm" onClick={runMatching} disabled={running}>{running ? 'Running…' : 'Run Matching'}</button>
      </PageHeader>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Suggested Matches" value="37" delta={12.0} up icon="Sparkles" tint="purple" />
        <StatCard label="High-fit (>85%)" value="14" delta={8.0} up icon="Target" tint="green" />
        <StatCard label="Intros Made" value="21" delta={5.0} up icon="Handshake" tint="gold" />
        <StatCard label="Match → Deal Rate" value="34%" delta={3.2} up icon="TrendingUp" tint="teal" />
      </div>

      <Card className="mb-6 card-pad">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-white">Match criteria:</span>
          {criteria.map((c) => (
            <span key={c} className="chip bg-gold-400/10 text-gold-200 ring-1 ring-gold-400/20">{c}</span>
          ))}
        </div>
      </Card>

      <div className="space-y-4">
        {matches.map((m, i) => (
          <Card key={i} className="card-pad">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-1 items-center gap-4">
                <Avatar initials={initials(m.investor)} tint="blue" />
                <div>
                  <div className="text-xs text-slate-500">Investor</div>
                  {investorIdByName(m.investor) ? (
                    <button onClick={() => nav(`/investors/${investorIdByName(m.investor)}`)} className="font-medium text-slate-100 hover:text-gold-300">{m.investor}</button>
                  ) : <div className="font-medium text-slate-100">{m.investor}</div>}
                </div>
                <ArrowRight className="mx-2 hidden text-gold-400 sm:block" size={20} />
                <Avatar initials={initials(m.seeker)} tint="purple" />
                <div>
                  <div className="text-xs text-slate-500">Seeker</div>
                  {seekerIdByName(m.seeker) ? (
                    <button onClick={() => nav(`/seekers/${seekerIdByName(m.seeker)}`)} className="font-medium text-slate-100 hover:text-gold-300">{m.seeker}</button>
                  ) : <div className="font-medium text-slate-100">{m.seeker}</div>}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Meta label="Industry" value={m.industry} />
                <Meta label="Amount" value={m.amount} />
                <Meta label="ROI" value={m.roi} tone="text-brand-green" />
                <Meta label="Risk" value={m.risk} />
                <div className="text-center">
                  <div className="text-xs text-slate-500">Match Score</div>
                  <div className={`text-lg font-bold ${m.score >= 85 ? 'text-brand-green' : 'text-gold-300'}`}>{m.score}%</div>
                </div>
                <button className="btn-gold btn-sm" onClick={() => introduce(m)}>Introduce</button>
              </div>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className={`h-full rounded-full ${m.score >= 85 ? 'bg-brand-green' : 'bg-gold-gradient'}`} style={{ width: `${m.score}%` }} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

function Meta({ label, value, tone = 'text-slate-200' }) {
  return (
    <div>
      <div className="text-xs text-slate-500">{label}</div>
      <div className={`text-sm font-medium ${tone}`}>{value}</div>
    </div>
  )
}
