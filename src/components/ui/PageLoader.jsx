// Lightweight skeleton shown while a lazily-loaded route chunk downloads.
export default function PageLoader() {
  return (
    <div className="animate-fade-in space-y-6">
      {/* header */}
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 animate-pulse rounded-xl bg-white/[0.06]" />
        <div className="space-y-2">
          <div className="h-5 w-52 animate-pulse rounded bg-white/[0.06]" />
          <div className="h-3 w-72 animate-pulse rounded bg-white/[0.04]" />
        </div>
      </div>
      {/* stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-2xl bg-white/[0.04] ring-1 ring-white/5" />
        ))}
      </div>
      {/* content block */}
      <div className="h-72 animate-pulse rounded-2xl bg-white/[0.04] ring-1 ring-white/5" />
    </div>
  )
}
