import { PageHeader, Card, CardHeader, StatCard, Icon } from '../../components/ui/Primitives'
import { DonutChart } from '../../components/charts/Charts'
import { funds } from '../../data/mockData'

const alloc = [
  { name: 'Allocated to Properties', value: 81, color: '#d4af37' },
  { name: 'Available Balance', value: 19, color: '#2ec4b6' },
]

export default function FundManagement() {
  return (
    <div>
      <PageHeader title="Fund Management" subtitle="Investor funds, total pool, property allocation & expense tracking" icon="PiggyBank">
        <button className="btn-gold btn-sm">Record Transaction</button>
      </PageHeader>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Pool" value={funds.totalPool} delta={12.0} up icon="PiggyBank" tint="gold" />
        <StatCard label="Allocated" value={funds.allocated} delta={9.0} up icon="Send" tint="blue" />
        <StatCard label="Balance Available" value={funds.balance} delta={3.0} up icon="Wallet" tint="teal" />
        <StatCard label="Total Expenses" value="₹8.20 Cr" delta={4.0} up={false} icon="Receipt" tint="orange" hint="controlled" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Fund Allocation" subtitle="Pool utilisation" icon="PieChart" />
          <div className="card-pad grid grid-cols-2 items-center gap-2 pt-3">
            <DonutChart data={alloc} centerTop="Pool" centerBottom={funds.totalPool} />
            <div className="space-y-3">
              {alloc.map((a) => (
                <div key={a.name} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-sm" style={{ background: a.color }} />
                    <span className="text-slate-300">{a.name}</span>
                  </span>
                  <span className="font-semibold text-white">{a.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Expense Breakdown" subtitle="Acquisition & holding costs" icon="Receipt" />
          <div className="card-pad space-y-2 pt-3">
            {funds.expenses.map((e) => (
              <div key={e.head} className="flex items-center justify-between rounded-xl bg-white/[0.02] px-3 py-2.5 ring-1 ring-white/5">
                <span className="flex items-center gap-2.5 text-sm text-slate-200">
                  <Icon name="CircleDollarSign" size={15} className="text-gold-300" /> {e.head}
                </span>
                <span className="font-semibold text-white">{e.amount}</span>
              </div>
            ))}
            <div className="flex items-center justify-between border-t border-white/10 px-3 pt-3">
              <span className="text-sm font-semibold text-slate-300">Total Expenses</span>
              <span className="font-display text-lg font-bold text-gold-300">₹8.20 Cr</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
