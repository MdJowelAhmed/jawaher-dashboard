import { TrendingDown, TrendingUp } from 'lucide-react'
import { cn } from '../../utils/cn'
import { formatNumber, formatPercent } from '../../utils/format'
import { Skeleton } from '../ui/LoadingState'

export function StatCard({ icon: Icon, label, value, change, comparison, accent = 'brand', loading }) {
  const up = change >= 0
  const accents = { brand: 'bg-brand-soft text-brand', accent: 'bg-accent-soft text-accent', violet: 'bg-violet-soft text-violet' }
  if (loading) {
    return (
      <div className="rounded-card border border-line bg-white p-5 shadow-card">
        <Skeleton className="mb-4 h-10 w-10 rounded-xl" />
        <Skeleton className="mb-2 h-3 w-24" />
        <Skeleton className="h-8 w-28" />
      </div>
    )
  }
  return (
    <article className="rounded-card border border-line bg-white p-5 shadow-card">
      <div className="mb-4 flex items-start justify-between">
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', accents[accent])}>{Icon ? <Icon size={18} /> : null}</div>
        <span className={cn('inline-flex items-center gap-1 text-xs font-semibold', up ? 'text-success' : 'text-danger')}>
          {up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {formatPercent(change)}
        </span>
      </div>
      <p className="text-sm font-medium text-ink-muted">{label}</p>
      <p className="mt-1 text-[28px] font-semibold leading-none tracking-tight text-ink">{formatNumber(value)}</p>
      <p className="mt-2 text-xs text-ink-muted">{comparison}</p>
    </article>
  )
}
