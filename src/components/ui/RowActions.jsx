import { useState, useRef, useEffect } from 'react'
import { Icon } from './Primitives'

// Kebab menu for table rows / cards. Uses fixed positioning so the dropdown
// isn't clipped by the table's overflow container.
export function RowActions({ items }) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState(null)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const close = () => setOpen(false)
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    // close on scroll/resize since the menu is fixed-positioned
    window.addEventListener('scroll', close, true)
    window.addEventListener('resize', close)
    document.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('scroll', close, true)
      window.removeEventListener('resize', close)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  const toggle = (e) => {
    e.stopPropagation()
    if (open) { setOpen(false); return }
    const r = e.currentTarget.getBoundingClientRect()
    setPos({ top: r.bottom + 6, right: Math.max(8, window.innerWidth - r.right) })
    setOpen(true)
  }

  const run = (fn) => (e) => { e.stopPropagation(); setOpen(false); fn() }

  return (
    <div ref={ref} className="flex justify-end" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={toggle}
        className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-white/5 hover:text-white"
        aria-label="Row actions"
      >
        <Icon name="MoreVertical" size={16} />
      </button>

      {open && pos && (
        <div
          style={{ position: 'fixed', top: pos.top, right: pos.right }}
          className="z-[60] w-44 overflow-hidden rounded-xl border border-white/10 bg-ink-850 py-1 shadow-card"
        >
          {items.map((it, i) => (
            <button
              key={i}
              onClick={run(it.onClick)}
              className={`flex w-full items-center gap-2.5 px-3.5 py-2 text-sm transition ${
                it.danger ? 'text-brand-red hover:bg-brand-red/10' : 'text-slate-200 hover:bg-white/[0.05]'
              }`}
            >
              <Icon name={it.icon} size={15} />
              {it.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
