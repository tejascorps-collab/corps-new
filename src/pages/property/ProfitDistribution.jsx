import { PageHeader, Card, CardHeader, Badge, StatCard, Table, Icon } from '../../components/ui/Primitives'
import { profitDistribution } from '../../data/mockData'
import { ArrowDown } from 'lucide-react'

const flow = [
  { label: 'Purchase Price', value: '₹2.00 Cr', tone: 'slate' },
  { label: 'Expenses + Holding', value: '₹0.08 Cr', tone: 'orange' },
  { label: 'Selling Price', value: '₹2.50 Cr', tone: 'blue' },
  { label: 'Net Profit', value: '₹0.42 Cr', tone: 'green' },
]

export default function ProfitDistribution() {
  return (
    <div>
      <PageHeader title="Profit Distribution" subtitle="Auto-calculated profit sharing & investor settlement (80% / 20%)" icon="Coins">
        <button className="btn-gold btn-sm">Run Settlement</button>
      </PageHeader>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Profit Distributed" value="₹3.45 Cr" delta={22.0} up icon="Coins" tint="gold" />
        <StatCard label="Investor Payout" value="₹2.76 Cr" delta={20.0} up icon="Users" tint="green" hint="80% share" />
        <StatCard label="Company Share" value="₹0.69 Cr" delta={20.0} up icon="Building2" tint="purple" hint="20% share" />
        <StatCard label="Pending Settlement" value="1" delta={0} up={false} icon="Clock" tint="orange" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">
        {/* Profit flow + sharing example */}
        <div className="space-y-6">
          <Card className="card-pad">
            <h3 className="mb-4 text-sm font-semibold text-white">Profit Calculation Flow</h3>
            <div className="space-y-2">
              {flow.map((f, i) => (
                <div key={f.label}>
                  <div className="flex items-center justify-between rounded-xl bg-white/[0.02] px-4 py-3 ring-1 ring-white/5">
                    <span className="text-sm text-slate-300">{f.label}</span>
                    <span className={`font-semibold ${f.tone === 'green' ? 'text-brand-green' : 'text-white'}`}>{f.value}</span>
                  </div>
                  {i < flow.length - 1 && <div className="flex justify-center py-0.5"><ArrowDown size={14} className="text-slate-600" /></div>}
                </div>
              ))}
            </div>
          </Card>

          <Card className="card-pad">
            <h3 className="mb-4 text-sm font-semibold text-white">Sharing Split — Net ₹0.42 Cr</h3>
            <div className="space-y-3">
              <Split label="Investor Share" pct={80} value="₹0.336 Cr" tone="bg-brand-green" />
              <Split label="Company Share" pct={20} value="₹0.084 Cr" tone="bg-brand-purple" />
            </div>
            <button className="btn-gold btn-sm mt-5 w-full"><Icon name="Send" size={14} /> Distribute to Investors</button>
          </Card>
        </div>

        <Card className="overflow-hidden">
          <CardHeader title="Distribution Ledger" subtitle="Realised sales & settlements" icon="ScrollText" />
          <div className="px-2 pb-2">
            <Table
              columns={[
                { key: 'property', label: 'Property' },
                { key: 'purchase', label: 'Purchase', align: 'right' },
                { key: 'sale', label: 'Sale', align: 'right' },
                { key: 'netProfit', label: 'Net Profit', align: 'right' },
                { key: 'investorShare', label: 'Investor (80%)', align: 'right' },
                { key: 'companyShare', label: 'Company (20%)', align: 'right' },
                { key: 'status', label: 'Status' },
              ]}
              rows={profitDistribution}
              renderCell={(key, row) => {
                if (key === 'property') return <span className="font-medium text-slate-100">{row.property}</span>
                if (key === 'netProfit') return <span className="font-semibold text-brand-green">{row.netProfit}</span>
                if (key === 'status') return <Badge>{row.status}</Badge>
                if (['investorShare', 'companyShare'].includes(key)) return <span className="font-medium text-slate-200">{row[key]}</span>
                return row[key]
              }}
            />
          </div>
        </Card>
      </div>
    </div>
  )
}

function Split({ label, pct, value, tone }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="text-slate-300">{label} · {pct}%</span>
        <span className="font-semibold text-white">{value}</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
        <div className={`h-full rounded-full ${tone}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
