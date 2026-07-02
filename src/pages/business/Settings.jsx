import { useState } from 'react'
import { PageHeader, Card, CardHeader, Badge, Table, Avatar, initials, Icon } from '../../components/ui/Primitives'
import { Modal, FormGrid, TextField, SelectField } from '../../components/ui/Modal'
import { useApp } from '../../context/AppContext'
import { teamMembers, roles } from '../../data/mockData'

// Role → permission preview matrix
const permissions = ['Dashboard', 'Investors', 'Properties', 'Fund Mgmt', 'Accounts', 'Settings']
const matrix = {
  'Super Admin': [1, 1, 1, 1, 1, 1],
  Director: [1, 1, 1, 1, 1, 0],
  'Investment Manager': [1, 1, 0, 1, 0, 0],
  'Property Manager': [1, 0, 1, 1, 0, 0],
  'Finance Team': [1, 0, 0, 1, 1, 0],
}

export default function Settings() {
  const { pushNotification } = useApp()
  const [config, setConfig] = useState({
    company: 'FDI Prime Investments',
    currency: 'INR (₹)',
    ratio: '80 / 20',
    fiscal: 'Apr – Mar',
    gst: '29ABCDE1234F1Z5',
  })
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(config)

  const [inviteOpen, setInviteOpen] = useState(false)
  const [invite, setInvite] = useState({ email: '', role: roles[0] })

  const openEditor = () => { setDraft(config); setOpen(true) }
  const saveConfig = () => {
    setConfig(draft)
    setOpen(false)
    pushNotification({ type: 'system', title: 'Settings updated', text: 'Platform configuration saved.', tone: 'green', icon: 'Settings' })
  }

  const openInvite = () => { setInvite({ email: '', role: roles[0] }); setInviteOpen(true) }
  const sendInvite = () => {
    if (!invite.email.trim()) return
    setInviteOpen(false)
    pushNotification({ type: 'system', title: 'Invitation sent', text: `Invite sent to ${invite.email} (${invite.role}).`, tone: 'green', icon: 'UserPlus' })
  }

  return (
    <div>
      <PageHeader title="Settings & Users" subtitle="Team members, roles, permissions & platform configuration" icon="Settings">
        <button className="btn-gold btn-sm" onClick={openInvite}>+ Invite User</button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <CardHeader title="Team Members" subtitle={`${teamMembers.length} users`} icon="Users" />
            <div className="px-2 pb-2 pt-2">
              <Table
                columns={[
                  { key: 'name', label: 'Member' },
                  { key: 'role', label: 'Role' },
                  { key: 'status', label: 'Status' },
                  { key: 'last', label: 'Last Active' },
                  { key: 'actions', label: '', align: 'right' },
                ]}
                rows={teamMembers}
                renderCell={(key, row) => {
                  if (key === 'name')
                    return (
                      <div className="flex items-center gap-3">
                        <Avatar initials={initials(row.name)} tint="gold" />
                        <div>
                          <div className="font-medium text-slate-100">{row.name}</div>
                          <div className="text-xs text-slate-500">{row.email}</div>
                        </div>
                      </div>
                    )
                  if (key === 'role') return <Badge tone="slate">{row.role}</Badge>
                  if (key === 'status') return <Badge>{row.status}</Badge>
                  if (key === 'actions')
                    return <button onClick={() => pushNotification({ type: 'system', title: 'Member actions', text: `Manage ${row.name} (${row.role}).`, tone: 'blue', icon: 'MoreHorizontal' })} className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white"><Icon name="MoreHorizontal" size={16} /></button>
                  return row[key]
                }}
              />
            </div>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader title="Role Permissions" subtitle="Access matrix preview" icon="ShieldCheck" />
            <div className="overflow-x-auto px-2 pb-2 pt-2">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead>
                  <tr className="text-[11px] uppercase tracking-wide text-slate-500">
                    <th className="px-4 py-2">Role</th>
                    {permissions.map((p) => <th key={p} className="px-3 py-2 text-center">{p}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(matrix).map(([role, perms]) => (
                    <tr key={role} className="table-row">
                      <td className="px-4 py-3 font-medium text-slate-100">{role}</td>
                      {perms.map((v, i) => (
                        <td key={i} className="px-3 py-3 text-center">
                          {v ? <Icon name="Check" size={16} className="mx-auto text-brand-green" /> : <Icon name="Minus" size={16} className="mx-auto text-slate-600" />}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="card-pad">
            <h3 className="mb-3 text-sm font-semibold text-white">All Roles</h3>
            <div className="flex flex-wrap gap-2">
              {roles.map((r) => (
                <span key={r} className="chip bg-white/5 text-slate-300 ring-1 ring-white/10">{r}</span>
              ))}
            </div>
          </Card>

          <Card className="card-pad">
            <h3 className="mb-3 text-sm font-semibold text-white">Platform</h3>
            <div className="space-y-3">
              {[
                ['Company Name', config.company],
                ['Base Currency', config.currency],
                ['Profit Share Ratio', config.ratio],
                ['Fiscal Year', config.fiscal],
                ['GST Number', config.gst],
              ].map(([l, v]) => (
                <div key={l} className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">{l}</span>
                  <span className="font-medium text-slate-100">{v}</span>
                </div>
              ))}
            </div>
            <button className="btn-ghost btn-sm mt-4 w-full" onClick={openEditor}>Edit Configuration</button>
          </Card>
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Edit Configuration" subtitle="Platform settings" icon="Settings"
        footer={<><button className="btn-ghost btn-sm" onClick={() => setOpen(false)}>Cancel</button><button className="btn-gold btn-sm" onClick={saveConfig}>Save</button></>}>
        <FormGrid>
          <TextField label="Company Name" value={draft.company} onChange={(v) => setDraft((d) => ({ ...d, company: v }))} full />
          <SelectField label="Base Currency" value={draft.currency} onChange={(v) => setDraft((d) => ({ ...d, currency: v }))} options={['INR (₹)', 'USD ($)', 'AED (د.إ)', 'SGD (S$)']} />
          <TextField label="Profit Share Ratio" value={draft.ratio} onChange={(v) => setDraft((d) => ({ ...d, ratio: v }))} />
          <SelectField label="Fiscal Year" value={draft.fiscal} onChange={(v) => setDraft((d) => ({ ...d, fiscal: v }))} options={['Apr – Mar', 'Jan – Dec']} />
          <TextField label="GST Number" value={draft.gst} onChange={(v) => setDraft((d) => ({ ...d, gst: v }))} full />
        </FormGrid>
      </Modal>

      <Modal open={inviteOpen} onClose={() => setInviteOpen(false)} title="Invite User" subtitle="Send an invitation to join the platform" icon="UserPlus"
        footer={<><button className="btn-ghost btn-sm" onClick={() => setInviteOpen(false)}>Cancel</button><button className="btn-gold btn-sm" onClick={sendInvite}>Send Invite</button></>}>
        <form onSubmit={(e) => { e.preventDefault(); sendInvite() }}>
          <FormGrid>
            <TextField label="Email Address" value={invite.email} onChange={(v) => setInvite((i) => ({ ...i, email: v }))} placeholder="name@company.com" required full />
            <SelectField label="Role" value={invite.role} onChange={(v) => setInvite((i) => ({ ...i, role: v }))} options={roles} full />
          </FormGrid>
        </form>
      </Modal>
    </div>
  )
}
