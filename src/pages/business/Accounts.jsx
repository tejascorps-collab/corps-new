import { PageHeader, Card, CardHeader, Badge, StatCard, Table } from '../../components/ui/Primitives'
import { CashflowChart } from '../../components/charts/Charts'
import { invoices, cashflowSeries } from '../../data/mockData'

export default function Accounts() {
  return (
    <div>
      <PageHeader title="Accounts & Finance" subtitle="Investor payments, invoices, GST, TDS, commission & cash flow" icon="Landmark">
        <button className="btn-ghost btn-sm">Export GST</button>
        <button className="btn-gold btn-sm">+ Create Invoice</button>
      </PageHeader>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Monthly Revenue" value="₹4.75 Cr" delta={9.0} up icon="IndianRupee" tint="green" />
        <StatCard label="Receivables" value="₹1.36 Cr" delta={3.0} up={false} icon="Clock" tint="orange" hint="outstanding" />
        <StatCard label="GST Collected" value="₹1.42 Cr" delta={6.0} up icon="Percent" tint="blue" />
        <StatCard label="TDS Deducted" value="₹0.38 Cr" delta={2.0} up icon="Receipt" tint="purple" />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Cash Flow" subtitle="Inflow vs outflow — ₹ Cr" icon="TrendingUp" />
          <div className="card-pad pt-3">
            <CashflowChart data={cashflowSeries} />
          </div>
        </Card>
        <Card>
          <CardHeader title="Financial Snapshot" icon="Wallet" />
          <div className="card-pad space-y-3 pt-3">
            {[
              ['Net Profit (MTD)', '₹1.65 Cr', 'text-brand-green'],
              ['Vendor Payments', '₹0.92 Cr', 'text-slate-100'],
              ['Commission Paid', '₹0.44 Cr', 'text-slate-100'],
              ['Profit Sharing Out', '₹2.76 Cr', 'text-slate-100'],
              ['Cash Balance', '₹9.80 Cr', 'text-gold-300'],
            ].map(([l, v, c]) => (
              <div key={l} className="flex items-center justify-between border-b border-white/5 pb-2.5 text-sm last:border-0">
                <span className="text-slate-400">{l}</span>
                <span className={`font-semibold ${c}`}>{v}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <CardHeader title="Invoices" subtitle="Service billing with GST" icon="FileText" />
        <div className="px-2 pb-2 pt-2">
          <Table
            columns={[
              { key: 'no', label: 'Invoice #' },
              { key: 'client', label: 'Client' },
              { key: 'service', label: 'Service' },
              { key: 'amount', label: 'Amount', align: 'right' },
              { key: 'gst', label: 'GST', align: 'right' },
              { key: 'total', label: 'Total', align: 'right' },
              { key: 'status', label: 'Status' },
            ]}
            rows={invoices}
            renderCell={(key, row) => {
              if (key === 'no') return <span className="font-medium text-gold-300">{row.no}</span>
              if (key === 'total') return <span className="font-semibold text-white">{row.total}</span>
              if (key === 'status') return <Badge>{row.status}</Badge>
              return row[key]
            }}
          />
        </div>
      </Card>
    </div>
  )
}
