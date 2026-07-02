import { PageHeader, Card, Toolbar, StatCard, Table, Icon } from '../../components/ui/Primitives'
import { intlProperties } from '../../data/mockData'

export default function InternationalProperty() {
  return (
    <div>
      <PageHeader title="International Property" subtitle="Country-wise assets with currency, tax & residency intelligence" icon="Globe">
        <button className="btn-gold btn-sm">+ Add Country</button>
      </PageHeader>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Countries" value="6" delta={0} up icon="Globe" tint="teal" />
        <StatCard label="Intl. Properties" value="13" delta={8.0} up icon="Building2" tint="gold" />
        <StatCard label="Intl. Portfolio" value="₹402 Cr" delta={11.0} up icon="TrendingUp" tint="green" />
        <StatCard label="FX Exposure" value="5 currencies" delta={0} up icon="Coins" tint="purple" />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {intlProperties.map((c) => (
          <Card key={c.country} className="card-pad">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{c.flag}</span>
                <div>
                  <div className="font-semibold text-slate-100">{c.country}</div>
                  <div className="text-xs text-slate-500">{c.properties} properties</div>
                </div>
              </div>
              <span className="font-display text-lg font-bold text-gold-300">{c.value}</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <Kv label="Currency" value={`${c.currency} · ₹${c.rate}`} />
              <Kv label="Tax" value={c.tax} />
              <Kv label="Residency" value={c.residency} full />
            </div>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden">
        <div className="px-5 pt-5 text-sm font-semibold text-white">Country Comparison</div>
        <div className="px-2 pb-2 pt-2">
          <Table
            columns={[
              { key: 'country', label: 'Country' },
              { key: 'currency', label: 'Currency' },
              { key: 'rate', label: '₹ / Unit', align: 'right' },
              { key: 'properties', label: 'Assets', align: 'right' },
              { key: 'value', label: 'Value', align: 'right' },
              { key: 'tax', label: 'Tax Regime' },
              { key: 'residency', label: 'Residency Benefit' },
            ]}
            rows={intlProperties}
            renderCell={(key, row) => {
              if (key === 'country') return <span className="font-medium text-slate-100">{row.flag} {row.country}</span>
              if (key === 'value') return <span className="font-semibold text-gold-300">{row.value}</span>
              return row[key]
            }}
          />
        </div>
      </Card>
    </div>
  )
}

function Kv({ label, value, full }) {
  return (
    <div className={full ? 'col-span-2' : ''}>
      <div className="text-xs text-slate-500">{label}</div>
      <div className="text-slate-200">{value}</div>
    </div>
  )
}
