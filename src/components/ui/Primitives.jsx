import { useState, useRef, useEffect, useMemo } from 'react'
import { ArrowUpRight, ArrowDownRight, ArrowUp, ArrowDown, ArrowUpDown, Search, X, Download, ChevronDown, ArrowLeft, Circle } from 'lucide-react'
import { iconMap } from '../../lib/icons'

// ---------- Card ----------
export function Card({ className = '', children, ...rest }) {
  return (
    <div className={`card ${className}`} {...rest}>
      {children}
    </div>
  )
}

export function CardHeader({ title, action, subtitle, icon }) {
  return (
    <div className="flex items-center justify-between gap-3 px-5 pt-5">
      <div className="flex items-center gap-2.5">
        {icon && (
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gold-400/10 text-gold-300">
            <Icon name={icon} size={16} />
          </span>
        )}
        <div>
          <h3 className="text-[15px] font-semibold text-slate-100">{title}</h3>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  )
}

// ---------- Dynamic icon (from curated registry) ----------
export function Icon({ name, size = 18, className = '' }) {
  const Cmp = iconMap[name] || Circle
  return <Cmp size={size} className={className} />
}

// ---------- Tint helpers ----------
const tints = {
  gold: 'bg-gold-400/10 text-gold-300 ring-gold-400/20',
  purple: 'bg-brand-purple/10 text-brand-purple ring-brand-purple/20',
  blue: 'bg-brand-blue/10 text-brand-blue ring-brand-blue/20',
  teal: 'bg-brand-teal/10 text-brand-teal ring-brand-teal/20',
  orange: 'bg-brand-orange/10 text-brand-orange ring-brand-orange/20',
  green: 'bg-brand-green/10 text-brand-green ring-brand-green/20',
  red: 'bg-brand-red/10 text-brand-red ring-brand-red/20',
  slate: 'bg-white/5 text-slate-300 ring-white/10',
}

// ---------- Stat Card ----------
export function StatCard({ label, value, delta, up, icon, tint = 'gold', hint = 'from last month' }) {
  return (
    <Card className="card-pad group relative overflow-hidden">
      <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/[0.03] blur-2xl transition-opacity group-hover:opacity-100" />
      <div className="flex items-start justify-between">
        <span className={`grid h-11 w-11 place-items-center rounded-xl ring-1 ${tints[tint]}`}>
          <Icon name={icon} size={20} />
        </span>
        {typeof delta === 'number' && (
          <span className={`chip ${up ? 'bg-brand-green/10 text-brand-green' : 'bg-brand-red/10 text-brand-red'}`}>
            {up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            {delta}%
          </span>
        )}
      </div>
      <div className="mt-4">
        <div className="text-2xl font-bold tracking-tight text-white">{value}</div>
        <div className="mt-1 text-sm text-slate-400">{label}</div>
        {hint && typeof delta === 'number' && (
          <div className="mt-0.5 text-[11px] text-slate-600">{hint}</div>
        )}
      </div>
    </Card>
  )
}

// ---------- Badge ----------
const badgeMap = {
  // green
  Active: 'green', Verified: 'green', Signed: 'green', Complete: 'green', Paid: 'green',
  Rented: 'green', Filed: 'green', Distributed: 'green', Clear: 'green', Approved: 'green',
  Won: 'green', Completed: 'green', Acquired: 'purple', Held: 'slate',
  // amber
  'Due Diligence': 'orange', 'Under Renovation': 'orange', 'In Progress': 'blue',
  Pending: 'orange', 'Pending Signature': 'orange', 'Under Review': 'orange',
  Overdue: 'red', Away: 'orange', 'Pending Settlement': 'orange', 'Pending Signature ': 'orange',
  // blue / purple
  'Proposal Sent': 'blue', 'In Discussion': 'purple', Sent: 'blue', Onboarding: 'blue',
  Enquiry: 'slate', 'In Review': 'orange', 'For Sale': 'blue', 'Not Required': 'slate',
}
export function Badge({ children, tone }) {
  const t = tone || badgeMap[children] || 'slate'
  return <span className={`chip ring-1 ${tints[t]}`}>{children}</span>
}

// ---------- Page Header ----------
export function PageHeader({ title, subtitle, children, icon }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        {icon && (
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-gold-400/10 text-gold-300 ring-1 ring-gold-400/20">
            <Icon name={icon} size={22} />
          </span>
        )}
        <div>
          <h1 className="font-display text-2xl font-bold text-white">{title}</h1>
          {subtitle && <p className="mt-0.5 text-sm text-slate-400">{subtitle}</p>}
        </div>
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  )
}

// ---------- Toolbar (search + filter) ----------
export function Toolbar({ placeholder = 'Search…', right, query, onQuery, filters, onExport }) {
  const controlled = onQuery != null
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          className="input pl-9"
          placeholder={placeholder}
          value={controlled ? query : undefined}
          onChange={controlled ? (e) => onQuery(e.target.value) : undefined}
        />
        {controlled && query && (
          <button onClick={() => onQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-200">
            <X size={15} />
          </button>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {filters}
        {right}
        <button className="btn-ghost btn-sm" onClick={onExport}>
          <Download size={14} /> Export
        </button>
      </div>
    </div>
  )
}

// ---------- Filter select (compact) ----------
export function FilterSelect({ value, onChange, options, label }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="btn-ghost btn-sm cursor-pointer appearance-none pr-8"
      >
        {options.map((o) => (
          <option key={o} value={o} className="bg-ink-800 text-slate-200">
            {o === 'All' ? `All ${label}` : o}
          </option>
        ))}
      </select>
      <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
    </div>
  )
}

// ---------- Empty state ----------
export function EmptyRow({ colSpan = 1, message = 'No results found.' }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-5 py-10 text-center text-sm text-slate-500">{message}</td>
    </tr>
  )
}

// ---------- Checkbox ----------
export function Checkbox({ checked, indeterminate, onChange }) {
  const ref = useRef(null)
  useEffect(() => { if (ref.current) ref.current.indeterminate = !!indeterminate && !checked }, [indeterminate, checked])
  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      onClick={(e) => e.stopPropagation()}
      className="h-4 w-4 cursor-pointer rounded border-white/25 bg-transparent text-gold-400 accent-gold-400 focus:ring-1 focus:ring-gold-400/40"
    />
  )
}

// Parse a formatted cell (₹45.00 Cr, 18.5%, 1,256) into a number for sorting.
function sortNum(v) {
  if (typeof v === 'number') return v
  if (v == null) return NaN
  const s = String(v).replace(/[₹,%\s]/g, '').replace(/Cr|Lakhs?|Lakh/gi, '')
  return parseFloat(s)
}

function makeComparator(key, dir, sortFn) {
  return (a, b) => {
    if (sortFn) {
      const cmp = sortFn(a, b)
      return dir === 'asc' ? cmp : -cmp
    }
    const av = a[key]
    const bv = b[key]
    const an = sortNum(av)
    const bn = sortNum(bv)
    const aNaN = Number.isNaN(an)
    const bNaN = Number.isNaN(bn)
    if (!aNaN && !bNaN) return dir === 'asc' ? an - bn : bn - an
    if (aNaN && bNaN) {
      const cmp = String(av ?? '').localeCompare(String(bv ?? ''))
      return dir === 'asc' ? cmp : -cmp
    }
    // Mixed: blanks/non-numeric always sort to the end regardless of direction.
    return aNaN ? 1 : -1
  }
}

function SortCaret({ state }) {
  if (state === 'asc') return <ArrowUp size={12} className="text-gold-300" />
  if (state === 'desc') return <ArrowDown size={12} className="text-gold-300" />
  return <ArrowUpDown size={12} className="text-slate-600" />
}

// ---------- Data Table ----------
export function Table({ columns, rows, renderCell, onRowClick, selectable, selected, onSelectedChange }) {
  const [sort, setSort] = useState(null) // { key, dir }

  const cycle = (col) => {
    setSort((s) => {
      if (!s || s.key !== col.key) return { key: col.key, dir: 'asc', sortFn: col.sortFn }
      if (s.dir === 'asc') return { key: col.key, dir: 'desc', sortFn: col.sortFn }
      return null
    })
  }

  const sortedRows = useMemo(() => {
    if (!sort) return rows
    return [...rows].sort(makeComparator(sort.key, sort.dir, sort.sortFn))
  }, [rows, sort])

  const ids = sortedRows.map((r) => r.id)
  const allSelected = selectable && sortedRows.length > 0 && ids.every((id) => selected.has(id))
  const someSelected = selectable && ids.some((id) => selected.has(id))

  const toggleRow = (id) => {
    const s = new Set(selected)
    s.has(id) ? s.delete(id) : s.add(id)
    onSelectedChange(s)
  }
  const toggleAll = () => {
    const s = new Set(selected)
    if (allSelected) ids.forEach((id) => s.delete(id))
    else ids.forEach((id) => s.add(id))
    onSelectedChange(s)
  }
  const colCount = columns.length + (selectable ? 1 : 0)

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.02]">
              {selectable && (
                <th className="w-10 px-5 py-3.5">
                  <Checkbox checked={allSelected} indeterminate={someSelected} onChange={toggleAll} />
                </th>
              )}
              {columns.map((c) => {
                const canSort = c.sortable !== false && c.key !== 'actions'
                const state = sort && sort.key === c.key ? sort.dir : null
                return (
                  <th
                    key={c.key}
                    onClick={canSort ? () => cycle(c) : undefined}
                    className={`px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500 ${c.align === 'right' ? 'text-right' : ''} ${canSort ? 'cursor-pointer select-none transition-colors hover:text-slate-300' : ''}`}
                  >
                    <span className={`inline-flex items-center gap-1.5 ${c.align === 'right' ? 'flex-row-reverse' : ''}`}>
                      {c.label}
                      {canSort && c.label && <SortCaret state={state} />}
                    </span>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {sortedRows.length === 0 && (
              <tr>
                <td colSpan={colCount} className="px-5 py-10 text-center text-sm text-slate-500">
                  No results found.
                </td>
              </tr>
            )}
            {sortedRows.map((row, i) => {
              const isSel = selectable && selected.has(row.id)
              return (
                <tr
                  key={row.id || i}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={`table-row ${onRowClick ? 'cursor-pointer' : ''} ${isSel ? 'bg-gold-400/[0.06]' : ''}`}
                >
                  {selectable && (
                    <td className="px-5 py-3.5">
                      <Checkbox checked={isSel} onChange={() => toggleRow(row.id)} />
                    </td>
                  )}
                  {columns.map((c) => (
                    <td key={c.key} className={`px-5 py-3.5 ${c.align === 'right' ? 'text-right' : ''}`}>
                      {renderCell ? renderCell(c.key, row, i) : row[c.key]}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

// ---------- Progress bar ----------
export function Progress({ value, tone = 'gold' }) {
  const bar = {
    gold: 'bg-gold-gradient', green: 'bg-brand-green', blue: 'bg-brand-blue',
    teal: 'bg-brand-teal', purple: 'bg-brand-purple', orange: 'bg-brand-orange',
  }[tone]
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/10">
        <div className={`h-full rounded-full ${bar}`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs text-slate-400">{value}%</span>
    </div>
  )
}

// ---------- Empty / mini list row ----------
export function Avatar({ initials, tint = 'slate' }) {
  return (
    <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-semibold ring-1 ${tints[tint]}`}>
      {initials}
    </span>
  )
}

export function initials(name = '') {
  return name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
}

// ---------- Tabs ----------
export function Tabs({ tabs, children }) {
  const [active, setActive] = useState(tabs[0].key)
  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-1 border-b border-white/10">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={`relative -mb-px flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition ${
              active === t.key ? 'text-gold-200' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.icon && <Icon name={t.icon} size={15} />}
            {t.label}
            {t.count != null && <span className="chip bg-white/5 text-slate-400">{t.count}</span>}
            {active === t.key && <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-gold-gradient" />}
          </button>
        ))}
      </div>
      <div className="animate-fade-in">{children(active)}</div>
    </div>
  )
}

// ---------- Key/Value grid field ----------
export function Field({ label, value, accent }) {
  return (
    <div className="rounded-xl bg-white/[0.02] p-3.5 ring-1 ring-white/5">
      <div className="text-xs text-slate-500">{label}</div>
      <div className={`mt-0.5 text-sm font-medium ${accent ? 'text-gold-300' : 'text-slate-100'}`}>{value}</div>
    </div>
  )
}

// ---------- Back link ----------
export function BackLink({ to, label, onClick }) {
  return (
    <button onClick={onClick} className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-gold-300">
      <ArrowLeft size={15} /> {label}
    </button>
  )
}
