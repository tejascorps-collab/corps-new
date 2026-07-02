import { useState } from 'react'
import { PageHeader, Card, CardHeader, StatCard } from '../../components/ui/Primitives'
import { AumProfitChart, DonutChart, HBarChart, CashflowChart } from '../../components/charts/Charts'
import { Modal, FormGrid, TextField, SelectField } from '../../components/ui/Modal'
import { useApp } from '../../context/AppContext'
import { downloadCsv } from '../../lib/exportCsv'
import { aumProfitSeries, investmentDistribution, propertyPerformance, cashflowSeries } from '../../data/mockData'

const perfData = propertyPerformance.map((p) => ({ ...p, name: p.property, color: '#d4af37' }))

export default function Reports() {
  const { pushNotification } = useApp()
  const [open, setOpen] = useState(false)
  const [range, setRange] = useState({ from: '', to: '', preset: 'This Month' })

  const applyRange = () => {
    setOpen(false)
    pushNotification({ type: 'system', title: 'Report period updated', text: `Period set to ${range.preset}.`, tone: 'gold', icon: 'CalendarDays' })
  }

  const downloadReport = () => {
    downloadCsv('property-performance.csv', propertyPerformance, [
      { key: 'property', label: 'Property' },
      { key: 'invested', label: 'Invested (₹ Cr)' },
      { key: 'current', label: 'Current (₹ Cr)' },
      { key: 'roi', label: 'ROI' },
    ])
    pushNotification({ type: 'system', title: 'Report downloaded', text: 'Property performance exported to CSV.', tone: 'blue', icon: 'Download' })
  }

  return (
    <div>
      <PageHeader title="Reports & Analytics" subtitle="Monthly profit, ROI, property performance, pipeline & portfolio" icon="BarChart3">
        <button className="btn-ghost btn-sm" onClick={() => setOpen(true)}>Date Range</button>
        <button className="btn-gold btn-sm" onClick={downloadReport}>Download Report</button>
      </PageHeader>

      <Modal open={open} onClose={() => setOpen(false)} title="Date Range" subtitle="Choose a reporting period" icon="CalendarDays"
        footer={<><button className="btn-ghost btn-sm" onClick={() => setOpen(false)}>Cancel</button><button className="btn-gold btn-sm" onClick={applyRange}>Apply</button></>}>
        <FormGrid>
          <SelectField label="Preset" value={range.preset} onChange={(v) => setRange((r) => ({ ...r, preset: v }))} options={['This Month', 'This Quarter', 'This Year', 'Custom']} full />
          <TextField label="From" type="date" value={range.from} onChange={(v) => setRange((r) => ({ ...r, from: v }))} />
          <TextField label="To" type="date" value={range.to} onChange={(v) => setRange((r) => ({ ...r, to: v }))} />
        </FormGrid>
      </Modal>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Portfolio Value" value="₹402 Cr" delta={13.5} up icon="Briefcase" tint="gold" />
        <StatCard label="Blended ROI" value="19.6%" delta={3.8} up icon="Gauge" tint="green" />
        <StatCard label="Revenue (YTD)" value="₹28.65 Cr" delta={24.6} up icon="IndianRupee" tint="teal" />
        <StatCard label="Success Rate" value="92%" delta={5.4} up icon="Award" tint="purple" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="AUM & Profit Trend" icon="TrendingUp" />
          <div className="card-pad pt-3"><AumProfitChart data={aumProfitSeries} /></div>
        </Card>

        <Card>
          <CardHeader title="Portfolio Mix" icon="PieChart" />
          <div className="card-pad pt-3"><DonutChart data={investmentDistribution} centerBottom="₹265 Cr" /></div>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader title="Property Performance" subtitle="Current value by asset — ₹ Cr" icon="Building2" />
          <div className="card-pad pt-3">
            <HBarChart data={perfData} dataKey="current" categoryKey="name" />
          </div>
        </Card>

        <Card>
          <CardHeader title="Cash Flow" icon="Activity" />
          <div className="card-pad pt-3"><CashflowChart data={cashflowSeries} height={280} /></div>
        </Card>
      </div>
    </div>
  )
}
