import { useState } from 'react'
import { Download, X } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export default function InstallBanner() {
  const { canInstall, installApp } = useApp()
  const [dismissed, setDismissed] = useState(false)
  if (!canInstall || dismissed) return null

  return (
    <div className="fixed inset-x-3 bottom-[4.75rem] z-40 flex items-center gap-3 rounded-2xl border border-gold-400/25 bg-ink-800/95 p-3 shadow-glow backdrop-blur-xl lg:hidden">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gold-gradient text-ink-950">
        <Download size={18} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold text-white">Install FDI Prime</div>
        <div className="truncate text-xs text-slate-400">Add to home screen for a full-screen app experience.</div>
      </div>
      <button onClick={installApp} className="btn-gold btn-sm shrink-0">Install</button>
      <button onClick={() => setDismissed(true)} className="text-slate-400 hover:text-white"><X size={16} /></button>
    </div>
  )
}
