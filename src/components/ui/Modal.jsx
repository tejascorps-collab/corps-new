import { useEffect } from 'react'
import { X } from 'lucide-react'
import { Icon } from './Primitives'

export function Modal({ open, onClose, title, subtitle, icon, children, footer, size = 'md' }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null
  const maxW = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-3xl' }[size]

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className={`relative z-10 w-full ${maxW} animate-fade-in overflow-hidden rounded-t-2xl border border-white/10 bg-ink-850 shadow-card sm:rounded-2xl`}>
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-3">
            {icon && (
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gold-400/10 text-gold-300">
                <Icon name={icon} size={17} />
              </span>
            )}
            <div>
              <h3 className="text-base font-semibold text-white">{title}</h3>
              {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
            </div>
          </div>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-white/5 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-5 py-5">{children}</div>

        {footer && <div className="flex items-center justify-end gap-2 border-t border-white/10 px-5 py-3.5">{footer}</div>}
      </div>
    </div>
  )
}

// ---------- Form fields ----------
export function TextField({ label, value, onChange, placeholder, required, type = 'text', full }) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <label className="label">{label}{required && <span className="text-brand-red"> *</span>}</label>
      <input className="input" type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required} />
    </div>
  )
}

export function SelectField({ label, value, onChange, options, full }) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <label className="label">{label}</label>
      <select className="input cursor-pointer" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o} value={o} className="bg-ink-800">{o}</option>
        ))}
      </select>
    </div>
  )
}

export function FormGrid({ children }) {
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
}

// ---------- Confirm dialog ----------
export function ConfirmDialog({ open, onClose, onConfirm, title = 'Are you sure?', message, confirmLabel = 'Delete', danger = true }) {
  return (
    <Modal open={open} onClose={onClose} title={title} icon={danger ? 'AlertTriangle' : 'Info'} size="sm"
      footer={
        <>
          <button className="btn-ghost btn-sm" onClick={onClose}>Cancel</button>
          <button
            onClick={onConfirm}
            className={
              danger
                ? 'inline-flex items-center gap-2 rounded-lg bg-brand-red/90 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-red'
                : 'btn-gold btn-sm'
            }
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <p className="text-sm text-slate-400">{message}</p>
    </Modal>
  )
}
