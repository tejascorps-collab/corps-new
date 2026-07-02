import { PageHeader, Card, Badge, StatCard, Icon } from '../../components/ui/Primitives'
import { servicePricing } from '../../data/mockData'

const featured = ['Investment Due Diligence', 'Investor Matching Service', 'End-to-End FDI Consultancy']

export default function ServicesPricing() {
  return (
    <div>
      <PageHeader title="Investor Services & Pricing" subtitle="Consulting service catalogue with suggested pricing" icon="Tag">
        <button className="btn-gold btn-sm">+ Add Service</button>
      </PageHeader>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Services Offered" value="13" delta={0} up icon="Tag" tint="gold" hint="catalogue" />
        <StatCard label="Revenue (YTD)" value="₹2.4 Cr" delta={18.0} up icon="IndianRupee" tint="green" />
        <StatCard label="Active Engagements" value="34" delta={9.0} up icon="Briefcase" tint="teal" />
        <StatCard label="Avg. Ticket Size" value="₹1.1 L" delta={5.0} up icon="Receipt" tint="purple" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {servicePricing.map((s) => {
          const isFeatured = featured.includes(s.service)
          return (
            <Card key={s.service} className={`card-pad flex flex-col justify-between ${isFeatured ? 'ring-1 ring-gold-400/30' : ''}`}>
              <div>
                <div className="flex items-start justify-between">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold-400/10 text-gold-300">
                    <Icon name="Sparkles" size={18} />
                  </span>
                  {isFeatured && <Badge tone="gold">Popular</Badge>}
                </div>
                <h3 className="mt-3 text-[15px] font-semibold text-slate-100">{s.service}</h3>
              </div>
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <div className="text-xs text-slate-500">Suggested price</div>
                  <div className="font-display text-xl font-bold text-gold-300">{s.price}</div>
                </div>
                <button className="btn-ghost btn-sm">Quote</button>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
