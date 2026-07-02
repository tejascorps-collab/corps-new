import { useState } from 'react'
import { PageHeader, Card, CardHeader, Badge, StatCard, Table } from '../../components/ui/Primitives'
import { CashflowChart } from '../../components/charts/Charts'
import { Modal, FormGrid, TextField, SelectField } from '../../components/ui/Modal'
import { useApp } from '../../context/AppContext'
import { downloadCsv } from '../../lib/exportCsv'
import { invoices, cashflowSeries } from '../../data/mockData'

export default function Accounts() {
  const { pushNotification } = useApp()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ client: '', amount: '', gst: '18', due: '' })

  const exportGst = () => {
    downloadCsv('gst-invoices.csv', invoices, [
      { key: 'no', label: 'Invoice #' },
      { key: 'client', label: 'Client' },
      { key: 'service', label: 'Service' },
      { key: 'amount', label: 'Amount' },
      { key: 'gst', label: 'GST' },
      { key: 'total', label: 'Total' },
      { key: 'status', label: 'Status' },
    ])
    pushNotification({ type: 'system', title: 'GST exported', text: `${invoices.length} invoices exported to CSV.`, tone: 'blue', icon: 'Download' })
  }

  const submit = () => {
    if (!form.client.trim()) return
    setOpen(false)
    pushNotification({ type: 'system', title: 'Invoice created', text: `Invoice for ${form.client.trim()} drafted.`, tone: 'green', icon: 'Receipt' })
    setForm({ client: '', amount: '', gst: '18', due: '' })
  }

  return (
    <div>
      <PageHeader title="Accounts & Finance" subtitle="Investor payments, invoices, GST, TDS, commission & cash flow" icon="Landmark">
        <button className="btn-ghost btn-sm" onClick={exportGst}>Export GST</button>
        <button className="btn-gold btn-sm" onClick={() => setOpen(true)}>+ Create Invoice</button>
      </PageHeader>

      <Modal open={open} onClose={() => setOpen(false)} title="Create Invoice" subtitle="Draft a new service invoice" icon="Receipt"
        footer={<><button className="btn-ghost btn-sm" onClick={() => setOpen(false)}>Cancel</button><button className="btn-gold btn-sm" onClick={submit}>Create</button></>}>
        <FormGrid>
          <TextField label="Client" value={form.client} onChange={(v) => setForm((f) => ({ ...f, client: v }))} placeholder="Client name" required full />
          <TextField label="Amount (₹)" value={form.amount} onChange={(v) => setForm((f) => ({ ...f, amount: v }))} placeholder="2,00,000" />
          <SelectField label="GST %" value={form.gst} onChange={(v) => setForm((f) => ({ ...f, gst: v }))} options={['0', '5', '12', '18', '28']} />
          <TextField label="Due Date" type="date" value={form.due} onChange={(v) => setForm((f) => ({ ...f, due: v }))} full />
        </FormGrid>
      </Modal>

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
