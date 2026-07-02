import { useState, useMemo } from 'react'
import { PageHeader, Toolbar, Table, Badge, Card, CardHeader, Icon, FilterSelect } from '../../components/ui/Primitives'
import { Modal, FormGrid, TextField, SelectField } from '../../components/ui/Modal'
import { useApp } from '../../context/AppContext'
import { downloadCsv } from '../../lib/exportCsv'
import { documents, docChecklist } from '../../data/mockData'

const templates = [
  { name: 'Non-Disclosure Agreement (NDA)', desc: 'Mutual confidentiality agreement' },
  { name: 'Term Sheet', desc: 'Preliminary investment terms' },
  { name: 'Share Subscription Agreement', desc: 'Equity subscription terms' },
  { name: 'FC-GPR Filing Template', desc: 'RBI reporting of share issue' },
  { name: 'Shareholders Agreement', desc: 'Rights and obligations of shareholders' },
]

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
  const { pushNotification } = useApp()
  const [q, setQ] = useState('')
  const [type, setType] = useState('All')
  const [templatesOpen, setTemplatesOpen] = useState(false)
  const [preview, setPreview] = useState(null)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [uploadForm, setUploadForm] = useState({ title: '', category: docTypes[1] || 'Agreement', note: '' })
  const setUp = (k) => (v) => setUploadForm((f) => ({ ...f, [k]: v }))

  const submitUpload = (e) => {
    if (e) e.preventDefault()
    if (!uploadForm.title.trim()) return
    setUploadOpen(false)
    pushNotification({ type: 'system', title: 'Document uploaded', text: `${uploadForm.title} uploaded to the document library.`, tone: 'green', icon: 'FileText' })
    setUploadForm({ title: '', category: docTypes[1] || 'Agreement', note: '' })
  }

  const downloadDoc = (doc) => {
    pushNotification({ type: 'system', title: 'Download started', text: `Download started — ${doc.name}.`, tone: 'blue', icon: 'Download' })
  }
  const useTemplate = (t) => {
    setTemplatesOpen(false)
    pushNotification({ type: 'system', title: 'Template applied', text: `${t.name} added as a new draft document.`, tone: 'gold', icon: 'FileText' })
  }
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
        <button className="btn-ghost btn-sm" onClick={() => setTemplatesOpen(true)}>Templates</button>
        <button className="btn-gold btn-sm" onClick={() => setUploadOpen(true)}>+ Upload Document</button>
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
                    <button onClick={() => downloadDoc(row)} className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white"><Icon name="Download" size={15} /></button>
                    <button onClick={() => setPreview(row)} className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white"><Icon name="Eye" size={15} /></button>
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

      <Modal
        open={templatesOpen}
        onClose={() => setTemplatesOpen(false)}
        title="Document Templates"
        subtitle="Start a new document from a template"
        icon="FileText"
        footer={<button className="btn-ghost btn-sm" onClick={() => setTemplatesOpen(false)}>Close</button>}
      >
        <div className="space-y-2">
          {templates.map((t) => (
            <div key={t.name} className="flex items-center justify-between rounded-xl bg-white/[0.02] px-3 py-2.5 ring-1 ring-white/5">
              <span className="flex items-center gap-2.5 text-sm text-slate-200">
                <Icon name="FileText" size={16} className="text-brand-blue" />
                <span>{t.name}<span className="block text-xs text-slate-500">{t.desc}</span></span>
              </span>
              <button className="btn-ghost btn-sm" onClick={() => useTemplate(t)}>Use</button>
            </div>
          ))}
        </div>
      </Modal>

      <Modal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        title="Upload Document"
        subtitle="Add a new document to the library"
        icon="FileText"
        footer={
          <>
            <button className="btn-ghost btn-sm" onClick={() => setUploadOpen(false)}>Cancel</button>
            <button className="btn-gold btn-sm" onClick={submitUpload}>Upload</button>
          </>
        }
      >
        <form onSubmit={submitUpload}>
          <FormGrid>
            <TextField label="Document Title" value={uploadForm.title} onChange={setUp('title')} placeholder="e.g. Share Subscription Agreement" required full />
            <SelectField label="Category" value={uploadForm.category} onChange={setUp('category')} options={docTypes.filter((t) => t !== 'All')} />
            <TextField label="File Note" value={uploadForm.note} onChange={setUp('note')} placeholder="e.g. Signed copy, PDF" full />
          </FormGrid>
        </form>
      </Modal>

      <Modal
        open={!!preview}
        onClose={() => setPreview(null)}
        title={preview?.name || 'Document'}
        subtitle={preview ? `${preview.type} · ${preview.party}` : ''}
        icon="Eye"
        size="lg"
        footer={
          <>
            <button className="btn-ghost btn-sm" onClick={() => setPreview(null)}>Close</button>
            {preview && <button className="btn-gold btn-sm" onClick={() => { downloadDoc(preview); setPreview(null) }}><Icon name="Download" size={14} /> Download</button>}
          </>
        }
      >
        {preview && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-white/[0.02] p-3 ring-1 ring-white/5">
                <div className="text-xs text-slate-500">Type</div>
                <div className="text-sm font-semibold text-slate-100">{preview.type}</div>
              </div>
              <div className="rounded-xl bg-white/[0.02] p-3 ring-1 ring-white/5">
                <div className="text-xs text-slate-500">Status</div>
                <div className="text-sm font-semibold text-slate-100">{preview.status}</div>
              </div>
              <div className="rounded-xl bg-white/[0.02] p-3 ring-1 ring-white/5">
                <div className="text-xs text-slate-500">Party</div>
                <div className="text-sm font-semibold text-slate-100">{preview.party}</div>
              </div>
              <div className="rounded-xl bg-white/[0.02] p-3 ring-1 ring-white/5">
                <div className="text-xs text-slate-500">Date</div>
                <div className="text-sm font-semibold text-slate-100">{preview.date}</div>
              </div>
            </div>
            <div className="rounded-xl bg-white p-6 text-ink-900 shadow-inner">
              <div className="font-serif text-lg font-bold text-ink-900">{preview.name}</div>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                This is a preview of {preview.name}. The full document content, clauses, signatures and
                statutory annexures render here in the production build. Prepared for {preview.party}.
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
