import { CheckCircle2, Clock, Ticket } from 'lucide-react'
import { formatNumber } from '../../utils/format'
import { Skeleton } from '../ui/LoadingState'

const cards = [
  { key: 'total', label: 'Total Tickets', icon: Ticket, accent: 'bg-brand-soft text-brand' },
  { key: 'pending', label: 'Pending', icon: Clock, accent: 'bg-warning-soft text-warning' },
  { key: 'complete', label: 'Completed', icon: CheckCircle2, accent: 'bg-success-soft text-success' },
]

export function TicketStats({ stats, loading }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <article key={card.key} className="rounded-card border border-line bg-white p-5 shadow-card">
            {loading ? (
              <>
                <Skeleton className="mb-4 h-10 w-10 rounded-xl" />
                <Skeleton className="mb-2 h-3 w-24" />
                <Skeleton className="h-8 w-16" />
              </>
            ) : (
              <>
                <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${card.accent}`}>
                  <Icon size={18} />
                </div>
                <p className="text-sm font-medium text-ink-muted">{card.label}</p>
                <p className="mt-1 text-[28px] font-semibold leading-none tracking-tight text-ink">{formatNumber(stats?.[card.key] ?? 0)}</p>
              </>
            )}
          </article>
        )
      })}
    </div>
  )
}
