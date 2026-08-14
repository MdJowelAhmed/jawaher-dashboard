import { TicketHistory } from './TicketHistory'
import { TicketStatusBadge } from './TicketStatusBadge'
import { Button } from '../ui/Button'
import { formatDateTime } from '../../utils/format'

export function TicketDetails({ ticket, working, onComplete }) {
  const pending = ticket.status === 'pending'

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <Info label="Ticket ID" value={`#${ticket.id}`} />
        <Info label="User" value={ticket.userName} />
        <Info label="Email" value={ticket.userEmail} />
        <Info label="Submitted Date" value={formatDateTime(ticket.createdAt)} />
        <div>
          <p className="text-xs font-medium text-ink-muted">Status</p>
          <div className="mt-1"><TicketStatusBadge status={ticket.status} /></div>
        </div>
        {!pending && ticket.completedAt ? (
          <Info label="Completed" value={formatDateTime(ticket.completedAt)} />
        ) : null}
      </div>

      <div>
        <p className="text-xs font-medium text-ink-muted">Subject</p>
        <p className="mt-1 text-sm font-semibold text-ink">{ticket.subject}</p>
      </div>

      <div>
        <p className="text-xs font-medium text-ink-muted">User Message</p>
        <p className="mt-1 rounded-xl bg-canvas px-3 py-2.5 text-sm text-ink">{ticket.message}</p>
      </div>

      <div className="flex flex-wrap justify-end gap-2">
        {pending ? (
          <Button type="button" disabled={working} onClick={onComplete}>
            {working ? 'Updating…' : 'Mark as Complete'}
          </Button>
        ) : (
          <Button type="button" variant="outline" disabled>Ticket Completed</Button>
        )}
      </div>

      <TicketHistory history={ticket.history} />
    </div>
  )
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs font-medium text-ink-muted">{label}</p>
      <p className="mt-1 text-sm font-medium text-ink">{value}</p>
    </div>
  )
}
