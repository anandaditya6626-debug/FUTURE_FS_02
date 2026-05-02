import { cn } from '../../lib/utils'

export function Skeleton({ className }) {
  return <div className={cn('skeleton rounded-xl', className)} />
}

export function SkeletonCard({ lines = 3 }) {
  return (
    <div className="glass rounded-2xl p-5 space-y-3">
      <Skeleton className="h-4 w-1/3" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={`h-3 ${i === lines - 1 ? 'w-1/2' : 'w-full'}`} />
      ))}
    </div>
  )
}

export function SkeletonTable({ rows = 5, cols = 6 }) {
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-white/[0.06]">
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="divide-y divide-white/[0.04]">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex gap-4 px-4 py-3">
            {Array.from({ length: cols }).map((_, c) => (
              <Skeleton key={c} className={`h-3 flex-1 ${c === 0 ? 'max-w-[150px]' : ''}`} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export function SkeletonKPI() {
  return (
    <div className="glass rounded-2xl p-5 space-y-4">
      <div className="flex justify-between">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-8 w-8 rounded-xl" />
      </div>
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-2 w-16" />
    </div>
  )
}
