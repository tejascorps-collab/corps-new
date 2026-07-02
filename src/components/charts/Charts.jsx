import {
  ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, PieChart, Pie, Cell, BarChart, AreaChart, Area, Legend,
} from 'recharts'

const axis = { stroke: '#475569', fontSize: 11, tickLine: false, axisLine: false }
const grid = <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" vertical={false} />

const tooltipStyle = {
  contentStyle: {
    background: '#0d121d',
    border: '1px solid rgba(212,175,55,0.25)',
    borderRadius: 12,
    fontSize: 12,
    boxShadow: '0 8px 30px -8px rgba(0,0,0,0.6)',
  },
  labelStyle: { color: '#e2e8f0', fontWeight: 600, marginBottom: 4 },
  itemStyle: { color: '#cbd5e1' },
}

// AUM (bars) + Profit (line)
export function AumProfitChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <ComposedChart data={data} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id="barGold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e0c06b" />
            <stop offset="100%" stopColor="#a67c26" />
          </linearGradient>
        </defs>
        {grid}
        <XAxis dataKey="month" {...axis} />
        <YAxis {...axis} />
        <Tooltip {...tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
        <Bar dataKey="aum" name="AUM (₹ Cr)" fill="url(#barGold)" radius={[4, 4, 0, 0]} barSize={16} isAnimationActive={false} />
        <Line type="monotone" dataKey="profit" name="Profit (₹ Cr)" stroke="#2ec4b6" strokeWidth={2.5} dot={{ r: 3, fill: '#2ec4b6' }} activeDot={{ r: 5 }} isAnimationActive={false} />
      </ComposedChart>
    </ResponsiveContainer>
  )
}

// Donut with center label
export function DonutChart({ data, centerTop = 'Total', centerBottom, height = 260 }) {
  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={2} stroke="none" isAnimationActive={false}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.color} />
            ))}
          </Pie>
          <Tooltip {...tooltipStyle} formatter={(v, n) => [`${v}%`, n]} />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xs text-slate-500">{centerTop}</span>
        <span className="text-xl font-bold text-white">{centerBottom}</span>
      </div>
    </div>
  )
}

// Ring / gauge donut for task summary
export function RingChart({ data, centerTop, centerBottom, height = 220, inner = 62, outer = 88 }) {
  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie data={data} dataKey="value" cx="50%" cy="50%" innerRadius={inner} outerRadius={outer} paddingAngle={3} stroke="none" isAnimationActive={false}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.color} />
            ))}
          </Pie>
          <Tooltip {...tooltipStyle} />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xs text-slate-500">{centerTop}</span>
        <span className="text-2xl font-bold text-white">{centerBottom}</span>
      </div>
    </div>
  )
}

// Horizontal bar for pipelines / performance
export function HBarChart({ data, dataKey, categoryKey, color = '#d4af37', height = 280 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart layout="vertical" data={data} margin={{ top: 4, right: 24, left: 8, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" horizontal={false} />
        <XAxis type="number" {...axis} />
        <YAxis type="category" dataKey={categoryKey} {...axis} width={130} />
        <Tooltip {...tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
        <Bar dataKey={dataKey} radius={[0, 6, 6, 0]} barSize={18} isAnimationActive={false}>
          {data.map((d, i) => (
            <Cell key={i} fill={d.color || color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

// Cashflow area
export function CashflowChart({ data, height = 260 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id="in" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22c55e" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="out" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
          </linearGradient>
        </defs>
        {grid}
        <XAxis dataKey="month" {...axis} />
        <YAxis {...axis} />
        <Tooltip {...tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Area type="monotone" dataKey="inflow" name="Inflow (₹ Cr)" stroke="#22c55e" strokeWidth={2} fill="url(#in)" isAnimationActive={false} />
        <Area type="monotone" dataKey="outflow" name="Outflow (₹ Cr)" stroke="#ef4444" strokeWidth={2} fill="url(#out)" isAnimationActive={false} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

// Revenue vs EBITDA (grouped bars) for seeker financials
export function RevenueChart({ data, height = 260 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
        {grid}
        <XAxis dataKey="year" {...axis} />
        <YAxis {...axis} />
        <Tooltip {...tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="revenue" name="Revenue (₹ Cr)" fill="#d4af37" radius={[4, 4, 0, 0]} barSize={16} isAnimationActive={false} />
        <Bar dataKey="ebitda" name="EBITDA (₹ Cr)" fill="#2ec4b6" radius={[4, 4, 0, 0]} barSize={16} isAnimationActive={false} />
      </BarChart>
    </ResponsiveContainer>
  )
}

// Funnel-like stacked visual for pipeline (custom, matches reference)
export function FunnelViz({ data }) {
  const max = Math.max(...data.map((d) => d.count))
  return (
    <div className="flex flex-col items-center gap-1.5 py-2">
      {data.map((d, i) => {
        const w = 40 + (d.count / max) * 60
        return (
          <div key={i} className="flex w-full items-center gap-3">
            <div className="flex flex-1 justify-center">
              <div
                className="flex items-center justify-center rounded-md py-2.5 text-xs font-semibold text-white transition-all"
                style={{ width: `${w}%`, background: d.color }}
              >
                {d.stage}
              </div>
            </div>
            <div className="w-20 shrink-0 text-right">
              <div className="text-sm font-bold text-white">{d.count}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
