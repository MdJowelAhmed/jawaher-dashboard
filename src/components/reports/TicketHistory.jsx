import { formatDateTime } from '../../utils/format'

export function TicketHistory({ history = [] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-ink">History</h3>
      <ol className="mt-3 space-y-3">
        {history.map((item) => (
          <li key={item.id} className="rounded-xl border border-line bg-canvas px-3 py-2.5">
            <p className="text-sm font-semibold text-ink">{item.title}</p>
            <p className="mt-0.5 text-sm text-ink-muted">{item.detail}</p>
            <p className="mt-1 text-xs text-ink-muted">{formatDateTime(item.at)}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}
