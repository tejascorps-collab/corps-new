import { Icon } from './Primitives'
import { X } from 'lucide-react'

// Contextual action bar shown when one or more rows are selected.
export function BulkBar({ count, onClear, onDelete, onExport, noun = 'items' }) {
  if (!count) return null
  return (
    <div className="mb-3 flex flex-col gap-3 rounded-xl border border-gold-400/25 bg-gold-400/[0.06] px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3 text-sm">
        <span className="grid h-6 min-w-6 place-items-center rounded-full bg-gold-gradient px-1.5 text-xs font-bold text-ink-950">{count}</span>
        <span className="text-slate-200">{count} {noun} selected</span>
        <button onClick={onClear} className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200">
          <X size={13} /> Clear
        </button>
      </div>
      <div className="flex items-center gap-2">
        {onExport && (
          <button onClick={onExport} className="btn-ghost btn-sm">
            <Icon name="Download" size={14} /> Export
          </button>
        )}
        {onDelete && (
          <button
            onClick={onDelete}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-red/90 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-red"
          >
            <Icon name="Trash2" size={14} /> Delete selected
          </button>
        )}
      </div>
    </div>
  )
}
