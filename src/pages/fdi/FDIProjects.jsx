import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader, Toolbar, Card, CardHeader, Badge, StatCard, Progress } from '../../components/ui/Primitives'
import { Modal, FormGrid, TextField, SelectField } from '../../components/ui/Modal'
import { FunnelViz } from '../../components/charts/Charts'
import { downloadCsv } from '../../lib/exportCsv'
import { useApp } from '../../context/AppContext'
import { fdiProjects, projectPipeline } from '../../data/mockData'

const sectorOpts = ['Renewable Energy', 'Manufacturing', 'Healthcare', 'Real Estate', 'Agriculture', 'Automotive', 'Technology', 'Infrastructure']
const emptyProject = { name: '', sector: 'Renewable Energy', size: '', investor: '' }

const exportCols = [
  { key: 'id', label: 'ID' }, { key: 'name', label: 'Project' }, { key: 'sector', label: 'Sector' },
  { key: 'route', label: 'Route' }, { key: 'investor', label: 'Investor' }, { key: 'size', label: 'Size' },
  { key: 'stage', label: 'Stage' }, { key: 'progress', label: 'Progress' },
]

export default function FDIProjects() {
  const nav = useNavigate()
  const { pushNotification } = useApp()
  const [q, setQ] = useState('')
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(emptyProject)
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }))

  const createProject = (e) => {
    if (e) e.preventDefault()
    if (!form.name.trim()) return
    setModal(false)
    pushNotification({ type: 'fdi', title: 'Project created', text: `${form.name} added to the FDI pipeline.`, tone: 'green', icon: 'Briefcase' })
    setForm(emptyProject)
  }

  const list = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return fdiProjects
    return fdiProjects.filter((p) =>
      [p.name, p.sector, p.investor, p.id].some((v) => String(v).toLowerCase().includes(term)))
  }, [q])

  const exportRows = () => {
    if (!list.length) return
    downloadCsv(`fdi-projects-${list.length}.csv`, list, exportCols)
    pushNotification({ type: 'system', title: 'CSV exported', text: `Downloaded ${list.length} project record(s).`, tone: 'blue', icon: 'Download' })
  }

  return (
    <div>
      <PageHeader title="FDI Projects" subtitle="Live foreign direct investment deals across sectors & routes" icon="Briefcase">
        <button className="btn-gold btn-sm" onClick={() => { setForm(emptyProject); setModal(true) }}>+ New Project</button>
      </PageHeader>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active Projects" value="48" delta={8.3} up icon="Briefcase" tint="teal" />
        <StatCard label="Deal Value (Live)" value="₹105.75 Cr" delta={14.0} up icon="TrendingUp" tint="gold" />
        <StatCard label="Closed (YTD)" value="12" delta={20.0} up icon="CheckCircle2" tint="green" />
        <StatCard label="Avg. Close Time" value="94 days" delta={5.0} up={false} icon="Clock" tint="orange" hint="faster" />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <Toolbar placeholder="Search projects by name, sector, investor…" query={q} onQuery={setQ} onExport={exportRows} />
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02] text-[11px] uppercase tracking-wide text-slate-500">
                    <th className="px-5 py-3.5">Project</th>
                    <th className="px-5 py-3.5">Sector</th>
                    <th className="px-5 py-3.5">Route</th>
                    <th className="px-5 py-3.5">Investor</th>
                    <th className="px-5 py-3.5 text-right">Size</th>
                    <th className="px-5 py-3.5">Stage</th>
                    <th className="px-5 py-3.5">Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {list.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-8 text-center text-slate-500">No projects match your search.</td>
                    </tr>
                  ) : list.map((p) => (
                    <tr key={p.id} onClick={() => nav(`/projects/${p.id}`)} className="table-row cursor-pointer">
                      <td className="px-5 py-3.5">
                        <div className="font-medium text-slate-100">{p.name}</div>
                        <div className="text-xs text-slate-500">{p.id} · closes {p.closeDate}</div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-300">{p.sector}</td>
                      <td className="px-5 py-3.5"><Badge tone={p.route === 'Automatic' ? 'green' : 'orange'}>{p.route}</Badge></td>
                      <td className="px-5 py-3.5 text-slate-300">{p.investor}</td>
                      <td className="px-5 py-3.5 text-right font-semibold text-white">{p.size}</td>
                      <td className="px-5 py-3.5"><Badge>{p.stage}</Badge></td>
                      <td className="px-5 py-3.5"><Progress value={p.progress} tone={p.progress === 100 ? 'green' : 'gold'} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <Card>
          <CardHeader title="Deal Pipeline" icon="Filter" />
          <div className="card-pad pt-3">
            <FunnelViz data={projectPipeline} />
          </div>
        </Card>
      </div>

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title="New FDI Project"
        subtitle="Register a new foreign direct investment deal"
        icon="Briefcase"
        footer={
          <>
            <button className="btn-ghost btn-sm" onClick={() => setModal(false)}>Cancel</button>
            <button className="btn-gold btn-sm" onClick={createProject}>Create Project</button>
          </>
        }
      >
        <form onSubmit={createProject}>
          <FormGrid>
            <TextField label="Project Name" value={form.name} onChange={set('name')} placeholder="e.g. Solaris Gigafactory" required full />
            <SelectField label="Sector" value={form.sector} onChange={set('sector')} options={sectorOpts} />
            <TextField label="Investment Size" value={form.size} onChange={set('size')} placeholder="e.g. ₹40 Cr" />
            <TextField label="Lead Investor" value={form.investor} onChange={set('investor')} placeholder="e.g. Horizon Capital LLC" full />
          </FormGrid>
        </form>
      </Modal>
    </div>
  )
}
