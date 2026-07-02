import { useState } from 'react'
import { PageHeader, Card, Toolbar, StatCard, Table, Icon } from '../../components/ui/Primitives'
import { Modal, FormGrid, TextField, SelectField } from '../../components/ui/Modal'
import { useApp } from '../../context/AppContext'
import { intlProperties } from '../../data/mockData'

const marketOpts = ['Emerging', 'Established', 'Prime', 'Frontier']

export default function InternationalProperty() {
  const { pushNotification } = useApp()
  const [countries, setCountries] = useState(intlProperties)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ country: '', city: '', market: 'Emerging', notes: '' })
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }))

  const submit = (e) => {
    e?.preventDefault?.()
    if (!form.country.trim()) return
    const label = form.city.trim() ? `${form.city.trim()}, ${form.country.trim()}` : form.country.trim()
    setCountries((c) => [
      ...c,
      { country: label, flag: '🌐', currency: '—', rate: '—', properties: 0, value: '₹0 Cr', tax: form.market, residency: form.notes.trim() || '—' },
    ])
    setOpen(false)
    setForm({ country: '', city: '', market: 'Emerging', notes: '' })
    pushNotification({ type: 'system', title: 'Country added', text: `${label} added to international portfolio.`, tone: 'blue', icon: 'Globe' })
  }

  return (
    <div>
      <PageHeader title="International Property" subtitle="Country-wise assets with currency, tax & residency intelligence" icon="Globe">
        <button className="btn-gold btn-sm" onClick={() => setOpen(true)}>+ Add Country</button>
      </PageHeader>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add Country"
        subtitle="Register a new international market"
        icon="Globe"
        size="md"
        footer={
          <>
            <button className="btn-ghost btn-sm" onClick={() => setOpen(false)}>Cancel</button>
            <button className="btn-gold btn-sm" onClick={submit}>Add Country</button>
          </>
        }
      >
        <form onSubmit={submit}>
          <FormGrid>
            <TextField label="Country" value={form.country} onChange={set('country')} placeholder="e.g. Canada" required />
            <TextField label="City" value={form.city} onChange={set('city')} placeholder="e.g. Toronto" />
            <SelectField label="Market" value={form.market} onChange={set('market')} options={marketOpts} />
            <TextField label="Notes" value={form.notes} onChange={set('notes')} placeholder="Residency / tax notes" full />
          </FormGrid>
        </form>
      </Modal>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Countries" value="6" delta={0} up icon="Globe" tint="teal" />
        <StatCard label="Intl. Properties" value="13" delta={8.0} up icon="Building2" tint="gold" />
        <StatCard label="Intl. Portfolio" value="₹402 Cr" delta={11.0} up icon="TrendingUp" tint="green" />
        <StatCard label="FX Exposure" value="5 currencies" delta={0} up icon="Coins" tint="purple" />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {countries.map((c) => (
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
            rows={countries}
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
