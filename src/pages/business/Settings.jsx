import { PageHeader, Card, CardHeader, Badge, Table, Avatar, initials, Icon } from '../../components/ui/Primitives'
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
  return (
    <div>
      <PageHeader title="Settings & Users" subtitle="Team members, roles, permissions & platform configuration" icon="Settings">
        <button className="btn-gold btn-sm">+ Invite User</button>
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
                    return <button className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white"><Icon name="MoreHorizontal" size={16} /></button>
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
                ['Company Name', 'FDI Prime Investments'],
                ['Base Currency', 'INR (₹)'],
                ['Profit Share Ratio', '80 / 20'],
                ['Fiscal Year', 'Apr – Mar'],
                ['GST Number', '29ABCDE1234F1Z5'],
              ].map(([l, v]) => (
                <div key={l} className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">{l}</span>
                  <span className="font-medium text-slate-100">{v}</span>
                </div>
              ))}
            </div>
            <button className="btn-ghost btn-sm mt-4 w-full">Edit Configuration</button>
          </Card>
        </div>
      </div>
    </div>
  )
}
