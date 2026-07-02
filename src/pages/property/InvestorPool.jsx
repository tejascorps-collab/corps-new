import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader, Toolbar, Table, Badge, StatCard, Avatar, initials } from '../../components/ui/Primitives'
import { downloadCsv } from '../../lib/exportCsv'
import { investorPool, investorIdByName, propertyIdByName } from '../../data/mockData'

const columns = [
  { key: 'investor', label: 'Investor' },
  { key: 'property', label: 'Property' },
  { key: 'amount', label: 'Investment', align: 'right' },
  { key: 'units', label: 'Units', align: 'right' },
  { key: 'ownership', label: 'Ownership', align: 'right' },
  { key: 'roi', label: 'ROI', align: 'right' },
  { key: 'date', label: 'Invested On' },
  { key: 'exit', label: 'Exit' },
]

export default function InvestorPool() {
  const nav = useNavigate()
  const [q, setQ] = useState('')
  const rows = useMemo(() => {
    const term = q.trim().toLowerCase()
    return investorPool.filter((r) => !term || [r.investor, r.property].some((v) => v.toLowerCase().includes(term)))
  }, [q])

  return (
    <div>
      <PageHeader title="Investor Pool" subtitle="Pooled investments per property — units, ownership % & ROI" icon="Layers">
        <button className="btn-gold btn-sm">+ Add Pool Entry</button>
      </PageHeader>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Pooled Capital" value="₹75.00 Cr" delta={10.0} up icon="Layers" tint="gold" />
        <StatCard label="Pool Investors" value="18" delta={5.0} up icon="Users" tint="blue" />
        <StatCard label="Avg. Ownership" value="48.9%" delta={0} up icon="PieChart" tint="purple" hint="per property" />
        <StatCard label="Upcoming Exits" value="3" delta={1.0} up icon="LogOut" tint="orange" hint="next 90 days" />
      </div>

      <Toolbar
        placeholder="Search by investor or property…"
        query={q}
        onQuery={setQ}
        onExport={() => rows.length && downloadCsv(`investor-pool-${rows.length}.csv`, rows, [
          { key: 'investor', label: 'Investor' }, { key: 'property', label: 'Property' }, { key: 'amount', label: 'Investment' },
          { key: 'units', label: 'Units' }, { key: 'ownership', label: 'Ownership' }, { key: 'roi', label: 'ROI' },
          { key: 'date', label: 'Invested On' }, { key: 'exit', label: 'Exit' },
        ])}
      />

      <Table
        columns={columns}
        rows={rows}
        renderCell={(key, row, i) => {
          if (key === 'investor') {
            const iid = investorIdByName(row.investor)
            return (
              <div className="flex items-center gap-3">
                <Avatar initials={initials(row.investor)} tint="blue" />
                {iid ? (
                  <button onClick={() => nav(`/investors/${iid}`)} className="font-medium text-slate-100 hover:text-gold-300">{row.investor}</button>
                ) : (
                  <span className="font-medium text-slate-100">{row.investor}</span>
                )}
              </div>
            )
          }
          if (key === 'property') {
            const pid = propertyIdByName(row.property)
            return pid ? (
              <button onClick={() => nav(`/properties/${pid}`)} className="text-slate-300 hover:text-gold-300">{row.property}</button>
            ) : row.property
          }
          if (key === 'amount') return <span className="font-semibold text-white">{row.amount}</span>
          if (key === 'ownership') return <Badge tone="purple">{row.ownership}</Badge>
          if (key === 'roi') return <span className="text-brand-green">{row.roi}</span>
          if (key === 'exit') return row.exit === '—' ? <span className="text-slate-500">Active</span> : <Badge tone="orange">{row.exit}</Badge>
          return row[key]
        }}
      />
    </div>
  )
}
