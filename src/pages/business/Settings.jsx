import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader, Card, CardHeader, Badge, Table, Avatar, initials, Icon } from '../../components/ui/Primitives'
import { Modal, FormGrid, TextField, SelectField } from '../../components/ui/Modal'
import { useApp } from '../../context/AppContext'
import { useTelephony } from '../../context/TelephonyContext'
import { api } from '../../lib/api'
import { roles } from '../../data/mockData'

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
  const nav = useNavigate()
  const {
    config: tel, saveConfig: saveTelephony, registered, testConnection, providers, transports,
  } = useTelephony()

  // Telephony editor
  const [telOpen, setTelOpen] = useState(false)
  const [telDraft, setTelDraft] = useState(tel)
  const [testing, setTesting] = useState(false)

  const openTelephony = () => { setTelDraft(tel); setTelOpen(true) }
  const saveTel = () => { saveTelephony(telDraft); setTelOpen(false) }
  const runTest = async () => { setTesting(true); await testConnection(); setTesting(false) }

  const setSip = (k) => (v) => setTelDraft((d) => ({ ...d, sip: { ...d.sip, [k]: v } }))
  const setApi = (k) => (v) => setTelDraft((d) => ({ ...d, api: { ...d.api, [k]: v } }))

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

  // Team members come from the DB now.
  const [members, setMembers] = useState([])
  const loadMembers = () => api.get('/users').then(setMembers).catch(() => {})
  useEffect(() => { loadMembers() }, [])

  const openEditor = () => { setDraft(config); setOpen(true) }
  const saveConfig = () => {
    setConfig(draft)
    setOpen(false)
    pushNotification({ type: 'system', title: 'Settings updated', text: 'Platform configuration saved.', tone: 'green', icon: 'Settings' })
  }

  const openInvite = () => { setInvite({ email: '', role: roles[0] }); setInviteOpen(true) }
  const sendInvite = async () => {
    if (!invite.email.trim()) return
    try {
      await api.post('/users', {
        email: invite.email.trim(),
        name: invite.email.trim().split('@')[0],
        title: invite.role,
        role: invite.role === 'Super Admin' ? 'super_admin' : 'admin',
      })
      setInviteOpen(false)
      await loadMembers()
      pushNotification({ type: 'system', title: 'User invited', text: `${invite.email} added as ${invite.role}.`, tone: 'green', icon: 'UserPlus' })
    } catch (e) {
      pushNotification({ type: 'system', title: 'Invite failed', text: e?.message || 'Could not invite user.', tone: 'red', icon: 'UserPlus' })
    }
  }

  return (
    <div>
      <PageHeader title="Settings & Users" subtitle="Team members, roles, permissions & platform configuration" icon="Settings">
        <button className="btn-gold btn-sm" onClick={openInvite}>+ Invite User</button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <CardHeader title="Team Members" subtitle={`${members.length} users`} icon="Users" />
            <div className="px-2 pb-2 pt-2">
              <Table
                columns={[
                  { key: 'name', label: 'Member' },
                  { key: 'title', label: 'Role' },
                  { key: 'status', label: 'Status' },
                  { key: 'lastActive', label: 'Last Active' },
                  { key: 'actions', label: '', align: 'right' },
                ]}
                rows={members}
                renderCell={(key, row) => {
                  if (key === 'name')
                    return (
                      <div className="flex items-center gap-3">
                        <Avatar initials={row.avatar || initials(row.name)} tint="gold" />
                        <div>
                          <div className="font-medium text-slate-100">{row.name}</div>
                          <div className="text-xs text-slate-500">{row.email}</div>
                        </div>
                      </div>
                    )
                  if (key === 'title') return <Badge tone={row.role === 'super_admin' ? 'gold' : 'slate'}>{row.title || (row.role === 'super_admin' ? 'Super Admin' : 'Administrator')}</Badge>
                  if (key === 'status') return <Badge>{row.status}</Badge>
                  if (key === 'actions')
                    return <button onClick={() => pushNotification({ type: 'system', title: 'Member actions', text: `Manage ${row.name} (${row.title || row.role}).`, tone: 'blue', icon: 'MoreHorizontal' })} className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white"><Icon name="MoreHorizontal" size={16} /></button>
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

          {/* ---------------- Telephony ---------------- */}
          <Card className="card-pad">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Telephony</h3>
              <span className={`chip ring-1 ${tel.enabled ? (registered ? 'bg-brand-green/10 text-brand-green ring-brand-green/20' : 'bg-brand-orange/10 text-brand-orange ring-brand-orange/20') : 'bg-white/5 text-slate-400 ring-white/10'}`}>
                <Icon name={tel.enabled && registered ? 'PhoneCall' : 'PhoneOff'} size={12} />
                {!tel.enabled ? 'Disabled' : registered ? 'Registered' : 'Not registered'}
              </span>
            </div>

            <div className="space-y-3">
              {(tel.mode === 'sip'
                ? [
                    ['Mode', 'SIP / PBX'],
                    ['SIP Server', tel.sip.server || '—'],
                    ['Port', tel.sip.port || '—'],
                    ['Transport', tel.sip.transport],
                    ['SIP User', tel.sip.username || '—'],
                  ]
                : [
                    ['Mode', 'Cloud API'],
                    ['Provider', tel.api.provider],
                    ['Caller ID', tel.api.callerId || '—'],
                    ['Account SID', tel.api.accountSid ? `${tel.api.accountSid.slice(0, 6)}…` : 'Not set'],
                    ['Auth Token', tel.api.authToken ? '••••••••' : 'Not set'],
                  ]
              ).map(([l, v]) => (
                <div key={l} className="flex items-center justify-between gap-3 text-sm">
                  <span className="shrink-0 text-slate-400">{l}</span>
                  <span className="truncate font-medium text-slate-100">{v}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button className="btn-ghost btn-sm" onClick={openTelephony}>Configure</button>
              <button className="btn-gold btn-sm" onClick={runTest} disabled={testing}>
                {testing ? 'Testing…' : 'Test Connection'}
              </button>
            </div>
            <button className="btn-ghost btn-sm mt-2 w-full" onClick={() => nav('/telephony')}>
              <Icon name="Headphones" size={14} /> Open Softphone
            </button>
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

      {/* ---------------- Telephony configuration ---------------- */}
      <Modal open={telOpen} onClose={() => setTelOpen(false)} title="Telephony Configuration" subtitle="Connect a SIP trunk or a cloud voice API" icon="Phone" size="lg"
        footer={<><button className="btn-ghost btn-sm" onClick={() => setTelOpen(false)}>Cancel</button><button className="btn-gold btn-sm" onClick={saveTel}>Save</button></>}>
        <FormGrid>
          <SelectField
            label="Status"
            value={telDraft.enabled ? 'Enabled' : 'Disabled'}
            onChange={(v) => setTelDraft((d) => ({ ...d, enabled: v === 'Enabled' }))}
            options={['Enabled', 'Disabled']}
          />
          <SelectField
            label="Integration Mode"
            value={telDraft.mode === 'sip' ? 'SIP / PBX' : 'Cloud API'}
            onChange={(v) => setTelDraft((d) => ({ ...d, mode: v === 'SIP / PBX' ? 'sip' : 'api' }))}
            options={['SIP / PBX', 'Cloud API']}
          />
        </FormGrid>

        {telDraft.mode === 'sip' ? (
          <div className="mt-5">
            <div className="section-title mb-3">SIP Registration</div>
            <FormGrid>
              <TextField label="SIP Server / Domain" value={telDraft.sip.server} onChange={setSip('server')} placeholder="pbx.thecorps.in" required />
              <TextField label="Port" value={telDraft.sip.port} onChange={setSip('port')} placeholder="5061" />
              <SelectField label="Transport" value={telDraft.sip.transport} onChange={setSip('transport')} options={transports} />
              <TextField label="SIP Username / Extension" value={telDraft.sip.username} onChange={setSip('username')} placeholder="agent01" required />
              <TextField label="SIP Password" type="password" value={telDraft.sip.password} onChange={setSip('password')} placeholder="••••••••" />
              <TextField label="STUN / TURN Server" value={telDraft.sip.stun} onChange={setSip('stun')} placeholder="stun:stun.l.google.com:19302" />
            </FormGrid>
            <p className="mt-3 text-xs text-slate-500">
              Browser softphones require a WebSocket transport (WSS) on the PBX. UDP/TCP apply to desk phones on the same trunk.
            </p>
          </div>
        ) : (
          <div className="mt-5">
            <div className="section-title mb-3">Cloud Voice API</div>
            <FormGrid>
              <SelectField label="Provider" value={telDraft.api.provider} onChange={setApi('provider')} options={providers} />
              <TextField label="Caller ID" value={telDraft.api.callerId} onChange={setApi('callerId')} placeholder="+91 80 4718 0000" />
              <TextField label="Account SID / API Key" value={telDraft.api.accountSid} onChange={setApi('accountSid')} placeholder="ACxxxxxxxx" required />
              <TextField label="Auth Token" type="password" value={telDraft.api.authToken} onChange={setApi('authToken')} placeholder="••••••••" required />
              <TextField label="Webhook URL" value={telDraft.api.webhook} onChange={setApi('webhook')} placeholder="https://…/api/telephony/webhook" full />
            </FormGrid>
            <p className="mt-3 text-xs text-slate-500">
              The provider posts call events (ringing, answered, hangup, recording) to this webhook. Credentials are stored in this browser only — move them to a backend before production.
            </p>
          </div>
        )}
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
