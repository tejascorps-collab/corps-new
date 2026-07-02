import { useState, useMemo } from 'react'
import { PageHeader, Toolbar, Table, Badge, Card, CardHeader, Icon, FilterSelect } from '../../components/ui/Primitives'
import { downloadCsv } from '../../lib/exportCsv'
import { documents, docChecklist } from '../../data/mockData'

const docTypes = ['All', ...Array.from(new Set(documents.map((d) => d.type)))]

const columns = [
  { key: 'name', label: 'Document' },
  { key: 'type', label: 'Type' },
  { key: 'party', label: 'Party' },
  { key: 'date', label: 'Date' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: '', align: 'right' },
]

export default function Documentation() {
  const [q, setQ] = useState('')
  const [type, setType] = useState('All')
  const rows = useMemo(() => {
    const term = q.trim().toLowerCase()
    return documents.filter((d) => {
      const matchQ = !term || [d.name, d.type, d.party, d.status].some((v) => v.toLowerCase().includes(term))
      const matchType = type === 'All' || d.type === type
      return matchQ && matchType
    })
  }, [q, type])

  return (
    <div>
      <PageHeader title="Documentation Management" subtitle="NDAs, term sheets, agreements, RBI forms, KYC & statutory documents" icon="FolderOpen">
        <button className="btn-ghost btn-sm">Templates</button>
        <button className="btn-gold btn-sm">+ Upload Document</button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
        <div>
          <Toolbar
            placeholder="Search documents…"
            query={q}
            onQuery={setQ}
            onExport={() => rows.length && downloadCsv(`documents-${rows.length}.csv`, rows, [
              { key: 'name', label: 'Document' }, { key: 'type', label: 'Type' }, { key: 'party', label: 'Party' },
              { key: 'date', label: 'Date' }, { key: 'status', label: 'Status' },
            ])}
            filters={<FilterSelect value={type} onChange={setType} label="Types" options={docTypes} />}
          />
          <Table
            columns={columns}
            rows={rows}
            renderCell={(key, row) => {
              if (key === 'name')
                return (
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-blue/10 text-brand-blue">
                      <Icon name="FileText" size={16} />
                    </span>
                    <span className="font-medium text-slate-100">{row.name}</span>
                  </div>
                )
              if (key === 'status') return <Badge>{row.status}</Badge>
              if (key === 'actions')
                return (
                  <div className="flex justify-end gap-1">
                    <button className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white"><Icon name="Download" size={15} /></button>
                    <button className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white"><Icon name="Eye" size={15} /></button>
                  </div>
                )
              return row[key]
            }}
          />
        </div>

        <Card className="h-fit">
          <CardHeader title="Document Checklist" icon="ListChecks" />
          <div className="card-pad space-y-1.5 pt-3">
            {docChecklist.map((d, i) => (
              <label key={d} className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-white/[0.03]">
                <input type="checkbox" defaultChecked={i < 9} className="h-4 w-4 rounded border-white/20 bg-transparent text-gold-400 focus:ring-gold-400/40" />
                <span className="text-sm text-slate-300">{d}</span>
              </label>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
