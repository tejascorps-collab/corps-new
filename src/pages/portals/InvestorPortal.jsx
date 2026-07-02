import { PageHeader, Card, CardHeader, Badge, StatCard, Table, Icon } from '../../components/ui/Primitives'
import { portalInvestor as p } from '../../data/mockData'

export default function InvestorPortal() {
  return (
    <div>
      <PageHeader title="Investor Portal" subtitle={`${p.name} · Portfolio, ROI, opportunities & requests`} icon="UserCircle">
        <Badge tone="green"><Icon name="ShieldCheck" size={12} /> KYC {p.kyc}</Badge>
        <button className="btn-gold btn-sm">Support Ticket</button>
      </PageHeader>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Portfolio Value" value={p.portfolioValue} delta={12.0} up icon="Briefcase" tint="gold" />
        <StatCard label="Total Invested" value={p.invested} delta={0} up icon="Wallet" tint="blue" />
        <StatCard label="Current ROI" value={p.currentRoi} delta={2.1} up icon="Gauge" tint="green" />
        <StatCard label="Profit Booked" value={p.profitBooked} delta={18.0} up icon="Coins" tint="purple" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 overflow-hidden">
          <CardHeader title="Investment Portfolio" icon="PieChart" />
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

        <Card>
          <CardHeader title="My Requests" icon="Inbox" />
          <div className="card-pad space-y-2 pt-3">
            {p.requests.map((r, i) => (
              <div key={i} className="rounded-xl bg-white/[0.02] p-3 ring-1 ring-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-100">{r.type}</span>
                  <Badge>{r.status}</Badge>
                </div>
                <div className="mt-1 text-xs text-slate-500">{r.detail}</div>
                <div className="mt-1 text-[11px] text-slate-600">{r.date}</div>
              </div>
            ))}
            <button className="btn-ghost btn-sm mt-1 w-full">+ New Request / Withdrawal</button>
          </div>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader title="New Opportunities" subtitle="Curated for your risk profile" icon="Sparkles" action={<button className="btn-ghost btn-sm">Statements</button>} />
        <div className="card-pad grid grid-cols-1 gap-4 pt-3 sm:grid-cols-3">
          {p.opportunities.map((o) => (
            <div key={o.name} className="rounded-xl bg-white/[0.02] p-4 ring-1 ring-white/5">
              <div className="text-sm font-semibold text-slate-100">{o.name}</div>
              <div className="text-xs text-slate-500">{o.sector}</div>
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
              <button className="btn-gold btn-sm mt-4 w-full">Express Interest</button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
